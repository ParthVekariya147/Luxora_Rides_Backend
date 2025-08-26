const Joi = require('joi');

// 1. નવી કાર બનાવવા માટેનું વેલિડેશન (Create Car Validation)
const createCarValidation = Joi.object({
  // --- Basic & Essential Information ---
  car_name: Joi.string().required().trim().min(1).max(100),
  brand: Joi.string().required().trim().min(1).max(50),
  year_model: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  image_url: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(1000),
  price_per_day: Joi.number().positive().required(),
  
  // --- Key Specifications (Simplified) ---
  fuel_type: Joi.string().required().valid('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'),
  transmission: Joi.string().required().valid('Manual', 'Automatic'),
  seating_capacity: Joi.number().integer().min(2).max(10).required(),
  features: Joi.array().items(Joi.string().trim()).optional(),

  status: Joi.string().valid('available', 'rented', 'maintenance').default('available'),
});

// 2. કાર અપડેટ કરવા માટેનું વેલિડેશન (Update Car Validation)
const updateCarValidation = Joi.object({
  // --- Basic & Essential Information ---
  car_name: Joi.string().trim().min(1).max(100).optional(),
  brand: Joi.string().trim().min(1).max(50).optional(),
  year_model: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
  image_url: Joi.string().uri().optional(),
  description: Joi.string().min(10).max(1000).optional(),
  price_per_day: Joi.number().positive().optional(),
  
  // --- Key Specifications (Simplified) ---
  fuel_type: Joi.string().valid('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG').optional(),
  transmission: Joi.string().valid('Manual', 'Automatic').optional(),
  seating_capacity: Joi.number().integer().min(2).max(10).optional(),
  features: Joi.array().items(Joi.string().trim()).optional(),


  status: Joi.string().valid('available', 'rented', 'maintenance').optional(),
}).min(1); // Ensure at least one field is being updated

// 3. કાર સર્ચ કરવા માટેનું વેલિડેશન (Car Search Validation)
const carSearchValidation = Joi.object({
  query: Joi.string().trim().optional(),
  brand: Joi.string().trim().optional(),
  min_price: Joi.number().positive().optional(),
  max_price: Joi.number().positive().optional(),
  fuel_type: Joi.string().trim().optional(), // 'engine_type' ને બદલે
  seating_capacity: Joi.number().integer().min(1).max(15).optional(),
  features: Joi.string().optional(), // Query માં string તરીકે આવશે, e.g., "Sunroof,GPS"
  sort_by: Joi.string().valid('price_per_day', 'year_model', 'createdAt').default('createdAt'), // 'ratings' કાઢી નાખ્યું
  sort_order: Joi.string().valid('asc', 'desc').default('desc')
});

// 4. બલ્ક અપડેટ માટેનું વેલિડેશન (Bulk Update Validation) - કોઈ ફેરફારની જરૂર નથી
const bulkUpdateValidation = Joi.object({
  carIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  updateData: Joi.object().required()
});

// 5. પ્રાઈસ રેન્જ માટેનું વેલિડેશન (Price Range Validation) - કોઈ ફેરફારની જરૂર નથી
const priceRangeValidation = Joi.object({
  minPrice: Joi.number().positive().required(),
  maxPrice: Joi.number().positive().required()
});

// 6. સ્ટેટસ અપડેટ માટેનું વેલિડેશન (Status Update Validation)
const statusUpdateValidation = Joi.object({
  status: Joi.string().valid('available', 'rented', 'maintenance').required() // 'out_of_service' કાઢી નાખ્યું
});

module.exports = {
  createCarValidation,
  updateCarValidation,
  carSearchValidation,
  bulkUpdateValidation,
  priceRangeValidation,
  statusUpdateValidation
};