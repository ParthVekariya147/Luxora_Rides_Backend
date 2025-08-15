const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // User Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 15
    },
    
    // Contact Details
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    
    // Contact Type
    contact_type: {
      type: String,
      enum: ['general', 'support', 'booking', 'complaint', 'feedback', 'partnership', 'other'],
      default: 'general'
    },
    
    // Priority Level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending'
    },
    
    // Admin Response
    admin_response: {
      message: {
        type: String,
        trim: true,
        maxlength: 2000
      },
      responded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      },
      responded_at: {
        type: Date
      }
    },
    
    // Additional Information
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Optional, in case guest users submit contact form
    },
    
    // IP Address for security
    ip_address: {
      type: String,
      trim: true
    },
    
    // User Agent for tracking
    user_agent: {
      type: String,
      trim: true
    },
    
    // Attachments (if any)
    attachments: [{
      filename: String,
      file_url: String,
      file_size: Number,
      mime_type: String
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
contactSchema.index({ status: 1, created_at: -1 });
contactSchema.index({ contact_type: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ user_id: 1 });

// Virtual for response time
contactSchema.virtual('response_time_hours').get(function() {
  if (this.admin_response && this.admin_response.responded_at) {
    const responseTime = this.admin_response.responded_at - this.createdAt;
    return Math.round(responseTime / (1000 * 60 * 60)); // Convert to hours
  }
  return null;
});

// Virtual for is_responded
contactSchema.virtual('is_responded').get(function() {
  return this.admin_response && this.admin_response.message;
});

// Pre-save middleware to set priority based on contact type
contactSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set priority based on contact type
    switch (this.contact_type) {
      case 'complaint':
        this.priority = 'high';
        break;
      case 'support':
        this.priority = 'medium';
        break;
      case 'booking':
        this.priority = 'high';
        break;
      case 'urgent':
        this.priority = 'urgent';
        break;
      default:
        this.priority = 'medium';
    }
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema);
