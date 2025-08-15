const Contact = require('./contact.model');
const { sendEmail } = require('../../utils/sendEmail');

class ContactService {
  // Create a new contact submission
  async createContact(contactData, userInfo = {}) {
    try {
      const contact = new Contact({
        ...contactData,
        ip_address: userInfo.ip_address,
        user_agent: userInfo.user_agent,
        user_id: userInfo.user_id
      });

      const savedContact = await contact.save();

      // Send notification email to admin (optional)
      await this.sendAdminNotification(savedContact);

      return savedContact;
    } catch (error) {
      throw error;
    }
  }

  // Get contact by ID
  async getContactById(contactId) {
    try {
      const contact = await Contact.findById(contactId)
        .populate('user_id', 'name email phone')
        .populate('admin_response.responded_by', 'name email');
      
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      return contact;
    } catch (error) {
      throw error;
    }
  }

  // Get all contacts with filtering and pagination
  async getAllContacts(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const { status, contact_type, priority, email, search } = filters;

      // Build query
      const query = {};
      
      if (status) query.status = status;
      if (contact_type) query.contact_type = contact_type;
      if (priority) query.priority = priority;
      if (email) query.email = { $regex: email, $options: 'i' };
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (page - 1) * limit;

      const contacts = await Contact.find(query)
        .populate('user_id', 'name email phone')
        .populate('admin_response.responded_by', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Contact.countDocuments(query);

      return {
        contacts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update contact status
  async updateContactStatus(contactId, status) {
    try {
      const contact = await Contact.findByIdAndUpdate(
        contactId,
        { status },
        { new: true }
      ).populate('user_id', 'name email phone');

      if (!contact) {
        throw new Error('Contact not found');
      }

      return contact;
    } catch (error) {
      throw error;
    }
  }

  // Respond to contact (admin response)
  async respondToContact(contactId, responseData, adminId) {
    try {
      const contact = await Contact.findById(contactId);
      
      if (!contact) {
        throw new Error('Contact not found');
      }

      // Update contact with admin response
      contact.admin_response = {
        message: responseData.message,
        responded_by: adminId,
        responded_at: new Date()
      };
      
      // Update status to resolved if not already
      if (contact.status !== 'resolved') {
        contact.status = 'resolved';
      }

      const updatedContact = await contact.save();

      // Send response email to user
      await this.sendUserResponseEmail(updatedContact);

      return updatedContact;
    } catch (error) {
      throw error;
    }
  }

  // Delete contact
  async deleteContact(contactId) {
    try {
      const contact = await Contact.findByIdAndDelete(contactId);
      
      if (!contact) {
        throw new Error('Contact not found');
      }

      return { message: 'Contact deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Get contact statistics
  async getContactStatistics() {
    try {
      const stats = await Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            in_progress: {
              $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
            },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
            },
            closed: {
              $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
            }
          }
        }
      ]);

      const typeStats = await Contact.aggregate([
        {
          $group: {
            _id: '$contact_type',
            count: { $sum: 1 }
          }
        }
      ]);

      const priorityStats = await Contact.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);

      const recentContacts = await Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name subject status createdAt');

      return {
        overview: stats[0] || {
          total: 0,
          pending: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0
        },
        byType: typeStats,
        byPriority: priorityStats,
        recentContacts
      };
    } catch (error) {
      throw error;
    }
  }

  // Get contacts by user ID
  async getContactsByUserId(userId) {
    try {
      const contacts = await Contact.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .populate('admin_response.responded_by', 'name email');

      return contacts;
    } catch (error) {
      throw error;
    }
  }

  // Bulk update contact status
  async bulkUpdateStatus(contactIds, status) {
    try {
      const result = await Contact.updateMany(
        { _id: { $in: contactIds } },
        { status }
      );

      return {
        message: `${result.modifiedCount} contacts updated successfully`,
        modifiedCount: result.modifiedCount
      };
    } catch (error) {
      throw error;
    }
  }

  // Send admin notification email
  async sendAdminNotification(contact) {
    try {
      const emailData = {
        to: process.env.ADMIN_EMAIL || 'admin@luxora.com',
        subject: `New Contact Form Submission - ${contact.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Type:</strong> ${contact.contact_type}</p>
          <p><strong>Priority:</strong> ${contact.priority}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
          <p><strong>Submitted:</strong> ${contact.createdAt}</p>
        `
      };

      await sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }
  }

  // Send user response email
  async sendUserResponseEmail(contact) {
    try {
      const emailData = {
        to: contact.email,
        subject: `Re: ${contact.subject} - Luxora Support`,
        html: `
          <h2>Response to your inquiry</h2>
          <p>Dear ${contact.name},</p>
          <p>Thank you for contacting Luxora. Here is our response to your inquiry:</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff;">
            <p><strong>Your original message:</strong></p>
            <p>${contact.message}</p>
          </div>
          <div style="background-color: #e8f5e8; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745;">
            <p><strong>Our response:</strong></p>
            <p>${contact.admin_response.message}</p>
          </div>
          <p>If you have any further questions, please don't hesitate to contact us again.</p>
          <p>Best regards,<br>Luxora Support Team</p>
        `
      };

      await sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send user response email:', error);
    }
  }

  // Get urgent contacts
  async getUrgentContacts() {
    try {
      const contacts = await Contact.find({
        $or: [
          { priority: 'urgent' },
          { status: 'pending', priority: 'high' }
        ]
      })
      .sort({ createdAt: 1 })
      .limit(10)
      .populate('user_id', 'name email phone');

      return contacts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContactService();
