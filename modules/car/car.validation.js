const Joi = require('joi');

// Validation schema for creating a car
const createCarValidation = Joi.object({
  // Basic Information
  car_name: Joi.string().required().trim().min(1).max(100),
  brand: Joi.string().required().trim().min(1).max(50),
  year_model: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  price_per_day: Joi.number().positive().required(),
  currency: Joi.string().valid('INR', 'USD', 'EUR').default('INR'),
  ratings: Joi.number().min(0).max(5).default(0),
  description: Joi.string().required().min(10).max(1000),
  image_url: Joi.string().uri().required(),

  // Technical Specifications
  technical_specifications: Joi.object({
    engine_type: Joi.string().required().trim(),
    engine_details: Joi.string().required().trim(),
    combined_horsepower: Joi.number().positive().required(),
    combined_torque_nm: Joi.number().positive().required(),
    transmission: Joi.string().required().trim(),
    top_speed_kmh: Joi.number().positive().required(),
    acceleration_0_100_kmh_seconds: Joi.number().positive().required(),
    drivetrain: Joi.string().required().trim(),
    fuel_economy_l_per_100km: Joi.number().positive().optional(),
    electric_range_km: Joi.number().positive().optional()
  }).required(),

  // Dimensions
  dimensions: Joi.object({
    length_mm: Joi.number().positive().required(),
    width_mm: Joi.number().positive().required(),
    height_mm: Joi.number().positive().required(),
    seating_capacity: Joi.number().integer().min(1).max(15).required(),
    cargo_space_liters: Joi.number().positive().required()
  }).required(),

  // Features
  features: Joi.object({
    infotainment: Joi.string().required().trim(),
    seating: Joi.string().required().trim(),
    sunroof: Joi.string().optional().trim(),
    ambient_lighting: Joi.boolean().default(false),
    head_up_display: Joi.boolean().default(false),
    color_options: Joi.array().items(Joi.string().trim()).optional(),
    headlights: Joi.string().optional().trim()
  }).required(),

  // Safety and Assistance
  safety_and_assistance: Joi.object({
    airbags_count: Joi.number().integer().min(0).required(),
    driver_assistance_systems: Joi.object({
      adaptive_cruise_control: Joi.boolean().default(false),
      lane_keep_assist: Joi.boolean().default(false),
      blind_spot_monitoring: Joi.boolean().default(false),
      parking_assistant_plus: Joi.boolean().default(false)
    }).required(),
    ncap_rating: Joi.string().default('Not yet rated')
  }).required(),

  // Rental Details
  rental_details: Joi.object({
    security_deposit_inr: Joi.number().positive().required(),
    kilometers_included_per_day: Joi.number().positive().required(),
    extra_km_charge_per_unit_inr: Joi.number().positive().required(),
    insurance_included: Joi.boolean().default(true)
  }).required(),

  // Status and Availability
  status: Joi.string().valid('available', 'rented', 'maintenance', 'out_of_service').default('available'),
  
  // Additional Images
  additional_images: Joi.array().items(Joi.string().uri()).optional(),
  
  // Location
  location: Joi.object({
    city: Joi.string().optional().trim(),
    state: Joi.string().optional().trim(),
    pickup_location: Joi.string().optional().trim()
  }).optional()
});

// Validation schema for updating a car
const updateCarValidation = Joi.object({
  // Basic Information
  car_name: Joi.string().trim().min(1).max(100).optional(),
  brand: Joi.string().trim().min(1).max(50).optional(),
  year_model: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
  price_per_day: Joi.number().positive().optional(),
  currency: Joi.string().valid('INR', 'USD', 'EUR').optional(),
  ratings: Joi.number().min(0).max(5).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  image_url: Joi.string().uri().optional(),

  // Technical Specifications
  technical_specifications: Joi.object({
    engine_type: Joi.string().trim().optional(),
    engine_details: Joi.string().trim().optional(),
    combined_horsepower: Joi.number().positive().optional(),
    combined_torque_nm: Joi.number().positive().optional(),
    transmission: Joi.string().trim().optional(),
    top_speed_kmh: Joi.number().positive().optional(),
    acceleration_0_100_kmh_seconds: Joi.number().positive().optional(),
    drivetrain: Joi.string().trim().optional(),
    fuel_economy_l_per_100km: Joi.number().positive().optional(),
    electric_range_km: Joi.number().positive().optional()
  }).optional(),

  // Dimensions
  dimensions: Joi.object({
    length_mm: Joi.number().positive().optional(),
    width_mm: Joi.number().positive().optional(),
    height_mm: Joi.number().positive().optional(),
    seating_capacity: Joi.number().integer().min(1).max(15).optional(),
    cargo_space_liters: Joi.number().positive().optional()
  }).optional(),

  // Features
  features: Joi.object({
    infotainment: Joi.string().trim().optional(),
    seating: Joi.string().trim().optional(),
    sunroof: Joi.string().optional().trim(),
    ambient_lighting: Joi.boolean().optional(),
    head_up_display: Joi.boolean().optional(),
    color_options: Joi.array().items(Joi.string().trim()).optional(),
    headlights: Joi.string().optional().trim()
  }).optional(),

  // Safety and Assistance
  safety_and_assistance: Joi.object({
    airbags_count: Joi.number().integer().min(0).optional(),
    driver_assistance_systems: Joi.object({
      adaptive_cruise_control: Joi.boolean().optional(),
      lane_keep_assist: Joi.boolean().optional(),
      blind_spot_monitoring: Joi.boolean().optional(),
      parking_assistant_plus: Joi.boolean().optional()
    }).optional(),
    ncap_rating: Joi.string().optional()
  }).optional(),

  // Rental Details
  rental_details: Joi.object({
    security_deposit_inr: Joi.number().positive().optional(),
    kilometers_included_per_day: Joi.number().positive().optional(),
    extra_km_charge_per_unit_inr: Joi.number().positive().optional(),
    insurance_included: Joi.boolean().optional()
  }).optional(),

  // Status and Availability
  status: Joi.string().valid('available', 'rented', 'maintenance', 'out_of_service').optional(),
  
  // Additional Images
  additional_images: Joi.array().items(Joi.string().uri()).optional(),
  
  // Location
  location: Joi.object({
    city: Joi.string().optional().trim(),
    state: Joi.string().optional().trim(),
    pickup_location: Joi.string().optional().trim()
  }).optional()
});

// Validation schema for car search
const carSearchValidation = Joi.object({
  query: Joi.string().trim().optional(),
  brand: Joi.string().trim().optional(),
  min_price: Joi.number().positive().optional(),
  max_price: Joi.number().positive().optional(),
  engine_type: Joi.string().trim().optional(),
  seating_capacity: Joi.number().integer().min(1).max(15).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  sort_by: Joi.string().valid('price_per_day', 'ratings', 'year_model', 'createdAt').default('price_per_day'),
  sort_order: Joi.string().valid('asc', 'desc').default('asc')
});

// Validation schema for bulk update
const bulkUpdateValidation = Joi.object({
  carIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  updateData: Joi.object().required()
});

// Validation schema for price range
const priceRangeValidation = Joi.object({
  minPrice: Joi.number().positive().required(),
  maxPrice: Joi.number().positive().required()
});

// Validation schema for status update
const statusUpdateValidation = Joi.object({
  status: Joi.string().valid('available', 'rented', 'maintenance', 'out_of_service').required()
});

module.exports = {
  createCarValidation,
  updateCarValidation,
  carSearchValidation,
  bulkUpdateValidation,
  priceRangeValidation,
  statusUpdateValidation
};
