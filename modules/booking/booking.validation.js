const Joi = require('joi');

// Validation for creating a new booking
const createBookingValidation = Joi.object({
  car_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid car ID format',
      'any.required': 'Car ID is required'
    }),

  pickup_date: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.greater': 'Pickup date must be in the future',
      'any.required': 'Pickup date is required'
    }),

  return_date: Joi.date()
    .greater(Joi.ref('pickup_date'))
    .required()
    .messages({
      'date.greater': 'Return date must be after pickup date',
      'any.required': 'Return date is required'
    }),

  pickup_location: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(200)
    .messages({
      'string.empty': 'Pickup location is required',
      'string.min': 'Pickup location must be at least 3 characters long',
      'string.max': 'Pickup location cannot exceed 200 characters'
    }),

  return_location: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(200)
    .messages({
      'string.empty': 'Return location is required',
      'string.min': 'Return location must be at least 3 characters long',
      'string.max': 'Return location cannot exceed 200 characters'
    }),

  pickup_time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .default('09:00')
    .messages({
      'string.pattern.base': 'Pickup time must be in HH:MM format'
    }),

  return_time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .default('18:00')
    .messages({
      'string.pattern.base': 'Return time must be in HH:MM format'
    }),

  payment_method: Joi.string()
    .valid('credit_card', 'debit_card', 'upi', 'net_banking', 'cash', 'wallet')
    .required()
    .messages({
      'any.only': 'Invalid payment method',
      'any.required': 'Payment method is required'
    }),

  additional_services: Joi.array()
    .items(
      Joi.object({
        service_name: Joi.string().required(),
        service_price: Joi.number().positive().required(),
        description: Joi.string().optional()
      })
    )
    .optional(),

  driver_details: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    license_number: Joi.string().trim().optional(),
    phone: Joi.string().trim().optional(),
    email: Joi.string().email().optional()
  }).optional()
});

// Validation for updating booking status
const updateStatusValidation = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected')
    .required()
    .messages({
      'any.only': 'Invalid status value',
      'any.required': 'Status is required'
    }),

  admin_notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Admin notes cannot exceed 1000 characters'
    })
});

// Validation for confirming booking
const confirmBookingValidation = Joi.object({
  admin_notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Admin notes cannot exceed 1000 characters'
    })
});

// Validation for cancelling booking
const cancelBookingValidation = Joi.object({
  reason: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Cancellation reason cannot exceed 500 characters'
    })
});

// Validation for updating payment status
const updatePaymentValidation = Joi.object({
  payment_status: Joi.string()
    .valid('pending', 'partial', 'completed', 'failed', 'refunded')
    .required()
    .messages({
      'any.only': 'Invalid payment status',
      'any.required': 'Payment status is required'
    }),

  payment_id: Joi.string()
    .trim()
    .optional(),

  transaction_id: Joi.string()
    .trim()
    .optional()
});

// Validation for booking filters
const bookingFiltersValidation = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected')
    .optional(),

  payment_status: Joi.string()
    .valid('pending', 'partial', 'completed', 'failed', 'refunded')
    .optional(),

  user_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid user ID format'
    }),

  car_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid car ID format'
    }),

  date_from: Joi.date()
    .optional()
    .messages({
      'date.base': 'Invalid date format'
    }),

  date_to: Joi.date()
    .min(Joi.ref('date_from'))
    .optional()
    .messages({
      'date.base': 'Invalid date format',
      'date.min': 'End date must be after start date'
    }),

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
    .valid('created_at', 'pickup_date', 'return_date', 'total_amount', 'status')
    .default('created_at')
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

// Validation for booking ID parameter
const bookingIdValidation = Joi.object({
  bookingId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid booking ID format',
      'any.required': 'Booking ID is required'
    })
});

// Validation for booking ID (custom ID) parameter
const customBookingIdValidation = Joi.object({
  bookingId: Joi.string()
    .pattern(/^BK[A-Z0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid booking ID format (should start with BK)',
      'any.required': 'Booking ID is required'
    })
});

// Validation for vehicle handover
const vehicleHandoverValidation = Joi.object({
  pickup_condition: Joi.string()
    .valid('excellent', 'good', 'fair', 'poor')
    .default('excellent')
    .messages({
      'any.only': 'Invalid pickup condition'
    }),

  return_condition: Joi.string()
    .valid('excellent', 'good', 'fair', 'poor')
    .optional()
    .messages({
      'any.only': 'Invalid return condition'
    }),

  pickup_notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Pickup notes cannot exceed 500 characters'
    }),

  return_notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Return notes cannot exceed 500 characters'
    }),

  pickup_odometer: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': 'Pickup odometer must be a number',
      'number.positive': 'Pickup odometer must be positive'
    }),

  return_odometer: Joi.number()
    .positive()
    .min(Joi.ref('pickup_odometer'))
    .optional()
    .messages({
      'number.base': 'Return odometer must be a number',
      'number.positive': 'Return odometer must be positive',
      'number.min': 'Return odometer must be greater than or equal to pickup odometer'
    }),

  fuel_level_pickup: Joi.string()
    .valid('full', '3/4', '1/2', '1/4', 'empty')
    .optional()
    .messages({
      'any.only': 'Invalid fuel level'
    }),

  fuel_level_return: Joi.string()
    .valid('full', '3/4', '1/2', '1/4', 'empty')
    .optional()
    .messages({
      'any.only': 'Invalid fuel level'
    })
});

// Validation for insurance and damage
const insuranceValidation = Joi.object({
  is_insured: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Insurance status must be a boolean'
    }),

  insurance_amount: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Insurance amount must be a number',
      'number.min': 'Insurance amount cannot be negative'
    }),

  damage_charges: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Damage charges must be a number',
      'number.min': 'Damage charges cannot be negative'
    }),

  damage_description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Damage description cannot exceed 1000 characters'
    })
});

module.exports = {
  createBookingValidation,
  updateStatusValidation,
  confirmBookingValidation,
  cancelBookingValidation,
  updatePaymentValidation,
  bookingFiltersValidation,
  paginationValidation,
  bookingIdValidation,
  customBookingIdValidation,
  vehicleHandoverValidation,
  insuranceValidation
};
