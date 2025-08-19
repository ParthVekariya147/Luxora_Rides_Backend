const contactService = require('./contact.service');
const {
  createContactValidation,
  updateStatusValidation,
  adminResponseValidation,
  contactFiltersValidation,
  paginationValidation,
  bulkUpdateValidation,
  contactIdValidation
} = require('./contact.validation');

class ContactController {
  // Create a new contact submission (public endpoint)
  async createContact(req, res) {
    try {
      // Validate request body
      const { error, value } = createContactValidation.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Get user info from request
      const userInfo = {
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        user_id: req.user ? req.user.id : null
      };

      const contact = await contactService.createContact(value, userInfo);

      res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully. We will get back to you soon!',
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          status: contact.status,
          submitted_at: contact.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit contact form',
        error: error.message
      });
    }
  }

  // Get contact by ID (admin only)
  async getContactById(req, res) {
    try {
      // Validate contact ID
      const { error, value } = contactIdValidation.validate({ contactId: req.params.contactId });
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
          error: error.details[0].message
        });
      }

      const contact = await contactService.getContactById(value.contactId);

      res.status(200).json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Error getting contact:', error);
      res.status(404).json({
        success: false,
        message: 'Contact not found',
        error: error.message
      });
    }
  }

  // Get all contacts with filtering and pagination (admin only)
  async getAllContacts(req, res) {
    try {
      // Validate query parameters
      const { error: filterError, value: filters } = contactFiltersValidation.validate(req.query);
      if (filterError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid filter parameters',
          errors: filterError.details.map(detail => detail.message)
        });
      }

      const { error: paginationError, value: pagination } = paginationValidation.validate(req.query);
      if (paginationError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters',
          errors: paginationError.details.map(detail => detail.message)
        });
      }

      const result = await contactService.getAllContacts(filters, pagination);

      res.status(200).json({
        success: true,
        data: result.contacts,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts',
        error: error.message
      });
    }
  }

  // Update contact status (admin only)
  async updateContactStatus(req, res) {
    try {
      // Validate contact ID
      const { error: idError, value: idValue } = contactIdValidation.validate({ contactId: req.params.contactId });
      if (idError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
          error: idError.details[0].message
        });
      }

      // Validate request body
      const { error: bodyError, value } = updateStatusValidation.validate(req.body);
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: bodyError.details.map(detail => detail.message)
        });
      }

      const contact = await contactService.updateContactStatus(idValue.contactId, value.status);

      res.status(200).json({
        success: true,
        message: 'Contact status updated successfully',
        data: contact
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact status',
        error: error.message
      });
    }
  }

  // Respond to contact (admin only)
  async respondToContact(req, res) {
    try {
      // Validate contact ID
      const { error: idError, value: idValue } = contactIdValidation.validate({ contactId: req.params.contactId });
      if (idError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
          error: idError.details[0].message
        });
      }

      // Validate request body
      const { error: bodyError, value } = adminResponseValidation.validate(req.body);
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: bodyError.details.map(detail => detail.message)
        });
      }

      const contact = await contactService.respondToContact(idValue.contactId, value, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Response sent successfully',
        data: contact
      });
    } catch (error) {
      console.error('Error responding to contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send response',
        error: error.message
      });
    }
  }

  // Delete contact (admin only)
  async deleteContact(req, res) {
    try {
      // Validate contact ID
      const { error, value } = contactIdValidation.validate({ contactId: req.params.contactId });
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
          error: error.details[0].message
        });
      }

      const result = await contactService.deleteContact(value.contactId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete contact',
        error: error.message
      });
    }
  }

  // Get contact statistics (admin only)
  async getContactStatistics(req, res) {
    try {
      const stats = await contactService.getContactStatistics();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting contact statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact statistics',
        error: error.message
      });
    }
  }

  // Get contacts by user ID (user can see their own contacts)
async getContactsByUserId(req, res) {
  try {
const userId = req.user ? (req.user.id || req.user.userId) : req.params.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    const contacts = await contactService.getContactsByUserId(userId);
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error getting user contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user contacts',
      error: error.message
    });
  }
}

  // Bulk update contact status (admin only)
  async bulkUpdateStatus(req, res) {
    try {
      // Validate request body
      const { error, value } = bulkUpdateValidation.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const result = await contactService.bulkUpdateStatus(value.contactIds, value.status);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      console.error('Error bulk updating contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update contacts',
        error: error.message
      });
    }
  }

  // Get urgent contacts (admin only)
  async getUrgentContacts(req, res) {
    try {
      const contacts = await contactService.getUrgentContacts();

      res.status(200).json({
        success: true,
        data: contacts
      });
    } catch (error) {
      console.error('Error getting urgent contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch urgent contacts',
        error: error.message
      });
    }
  }

  // Get contact by email (for tracking user's previous contacts)
  async getContactsByEmail(req, res) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // This would need to be added to the service
      const contacts = await contactService.getAllContacts({ email }, { limit: 50 });

      res.status(200).json({
        success: true,
        data: contacts.contacts
      });
    } catch (error) {
      console.error('Error getting contacts by email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts by email',
        error: error.message
      });
    }
  }
}

module.exports = new ContactController();
