const Joi = require("joi");

// Validation for creating a new booking
const createBookingValidation = Joi.object({
  car_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid car ID format",
      "any.required": "Car ID is required",
    }),

  pickup_date: Joi.date().greater("now").required().messages({
    "date.greater": "Pickup date must be in the future",
    "any.required": "Pickup date is required",
  }),

  return_date: Joi.date().greater(Joi.ref("pickup_date")).required().messages({
    "date.greater": "Return date must be after pickup date",
    "any.required": "Return date is required",
  }),

  pickup_location: Joi.string().required().trim().min(3).max(200).messages({
    "string.empty": "Pickup location is required",
    "string.min": "Pickup location must be at least 3 characters long",
    "string.max": "Pickup location cannot exceed 200 characters",
  }),

  return_location: Joi.string().required().trim().min(3).max(200).messages({
    "string.empty": "Return location is required",
    "string.min": "Return location must be at least 3 characters long",
    "string.max": "Return location cannot exceed 200 characters",
  }),

  payment_method: Joi.string()
    .valid("credit_card", "debit_card", "upi", "cash", "wallet")
    .required()
    .messages({
      "any.only": "Invalid payment method",
      "any.required": "Payment method is required",
    }),

  daily_rate: Joi.number().greater(0).required().messages({
    "number.greater": "Daily rate must be greater than 0",
    "any.required": "Daily rate is required",
  }),

  // Removed additional_services, driver_details, pickup_time, return_time from create validation
});

// Validation for updating booking status
const updateStatusValidation = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "completed", "cancelled")
    .required()
    .messages({
      "any.only": "Invalid status value",
      "any.required": "Status is required",
    }),

  admin_notes: Joi.string().trim().max(1000).optional().messages({
    "string.max": "Admin notes cannot exceed 1000 characters",
  }),
});

// Validation for confirming booking
const confirmBookingValidation = Joi.object({
  admin_notes: Joi.string().trim().max(1000).optional().messages({
    "string.max": "Admin notes cannot exceed 1000 characters",
  }),
});

// Validation for cancelling booking
const cancelBookingValidation = Joi.object({
  reason: Joi.string().trim().max(500).optional().messages({
    "string.max": "Cancellation reason cannot exceed 500 characters",
  }),
});

// Validation for updating payment status
const updatePaymentValidation = Joi.object({
  payment_status: Joi.string()
    .valid("pending", "completed", "failed")
    .required()
    .messages({
      "any.only": "Invalid payment status",
      "any.required": "Payment status is required",
    }),

  payment_id: Joi.string().trim().optional(),

  transaction_id: Joi.string().trim().optional(),
});

// Validation for booking filters
const bookingFiltersValidation = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "completed", "cancelled")
    .optional(),

  payment_status: Joi.string()
    .valid("pending", "completed", "failed")
    .optional(),

  user_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid user ID format",
    }),

  car_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid car ID format",
    }),

  date_from: Joi.date().optional().messages({
    "date.base": "Invalid date format",
  }),

  date_to: Joi.date().min(Joi.ref("date_from")).optional().messages({
    "date.base": "Invalid date format",
    "date.min": "End date must be after start date",
  }),

  search: Joi.string().trim().min(1).optional(),
});

// Validation for pagination
const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(100).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  sortBy: Joi.string()
    .valid("created_at", "pickup_date", "return_date", "total_amount", "status")
    .default("created_at")
    .messages({
      "any.only": "Invalid sort field",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": 'Sort order must be either "asc" or "desc"',
  }),
});

// Validation for booking ID parameter
const bookingIdValidation = Joi.object({
  bookingId: Joi.string().required().messages({
    "any.required": "Booking ID is required",
  }),
});

const editBookingDetailsValidation = Joi.object({
  car_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid car ID format",
    }),

  pickup_date: Joi.date().greater("now").optional().messages({
    "date.greater": "Pickup date must be in the future",
  }),

  return_date: Joi.date().greater(Joi.ref("pickup_date")).optional().messages({
    "date.greater": "Return date must be after pickup date",
  }),

  pickup_location: Joi.string().trim().min(3).max(200).optional().messages({
    "string.min": "Pickup location must be at least 3 characters long",
    "string.max": "Pickup location cannot exceed 200 characters",
  }),

  return_location: Joi.string().trim().min(3).max(200).optional().messages({
    "string.min": "Return location must be at least 3 characters long",
    "string.max": "Return location cannot exceed 200 characters",
  }),

  payment_method: Joi.string()
    .valid("credit_card", "debit_card", "upi", "cash", "wallet")
    .optional()
    .messages({
      "any.only": "Invalid payment method",
    }),

  daily_rate: Joi.number().greater(0).optional().messages({
    "number.greater": "Daily rate must be greater than 0",
  }),

  total_days: Joi.number().integer().min(1).optional().messages({
    "number.base": "Total days must be a number",
    "number.min": "Total days must be at least 1",
  }),

  total_amount: Joi.number().min(0).optional().messages({
    "number.min": "Total amount cannot be negative",
  }),

  status: Joi.string()
    .valid("pending", "confirmed", "completed", "cancelled")
    .optional()
    .messages({
      "any.only": "Invalid status value",
    }),

  payment_status: Joi.string()
    .valid("pending", "completed", "failed")
    .optional()
    .messages({
      "any.only": "Invalid payment status",
    }),
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
  editBookingDetailsValidation,
};
