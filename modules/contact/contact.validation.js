const Joi = require('joi');

// Validation for creating a new contact
const createContactValidation = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),

  email: Joi.string()
    .required()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),

  phone: Joi.string()
    .optional()
    .trim()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .max(15)
    .messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),

  subject: Joi.string()
    .required()
    .trim()
    .min(5)
    .max(200)
    .messages({
      'string.empty': 'Subject is required',
      'string.min': 'Subject must be at least 5 characters long',
      'string.max': 'Subject cannot exceed 200 characters'
    }),

  message: Joi.string()
    .required()
    .trim()
    .min(10)
    .max(2000)
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 2000 characters'
    }),

  contact_type: Joi.string()
    .valid('general', 'support', 'booking', 'complaint', 'feedback', 'partnership', 'other')
    .default('general')
    .messages({
      'any.only': 'Invalid contact type'
    }),

  attachments: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().required(),
        file_url: Joi.string().uri().required(),
        file_size: Joi.number().positive().required(),
        mime_type: Joi.string().required()
      })
    )
    .optional()
    .max(5)
    .messages({
      'array.max': 'Maximum 5 attachments allowed'
    })
});

// Validation for updating contact status
const updateStatusValidation = Joi.object({
  status: Joi.string()
    .required()
    .valid('pending', 'in_progress', 'resolved', 'closed')
    .messages({
      'any.only': 'Invalid status value'
    })
});

// Validation for admin response
const adminResponseValidation = Joi.object({
  message: Joi.string()
    .required()
    .trim()
    .min(5)
    .max(2000)
    .messages({
      'string.empty': 'Response message is required',
      'string.min': 'Response must be at least 5 characters long',
      'string.max': 'Response cannot exceed 2000 characters'
    })
});

// Validation for contact filters
const contactFiltersValidation = Joi.object({
  status: Joi.string()
    .valid('pending', 'in_progress', 'resolved', 'closed')
    .optional(),

  contact_type: Joi.string()
    .valid('general', 'support', 'booking', 'complaint', 'feedback', 'partnership', 'other')
    .optional(),

  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .optional(),

  email: Joi.string()
    .email()
    .optional(),

  search: Joi.string()
    .trim()
    .min(1)
    .optional()
});

// Validation for pagination
const paginationValidation = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'name', 'email', 'subject', 'status', 'priority')
    .default('createdAt')
    .messages({
      'any.only': 'Invalid sort field'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"'
    })
});

// Validation for bulk update
const bulkUpdateValidation = Joi.object({
  contactIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one contact ID is required',
      'array.max': 'Maximum 50 contacts can be updated at once',
      'string.pattern.base': 'Invalid contact ID format'
    }),

  status: Joi.string()
    .required()
    .valid('pending', 'in_progress', 'resolved', 'closed')
    .messages({
      'any.only': 'Invalid status value'
    })
});

// Validation for contact ID parameter
const contactIdValidation = Joi.object({
  contactId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid contact ID format'
    })
});

module.exports = {
  createContactValidation,
  updateStatusValidation,
  adminResponseValidation,
  contactFiltersValidation,
  paginationValidation,
  bulkUpdateValidation,
  contactIdValidation
};
