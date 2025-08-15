const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    // Basic Information
    car_name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    year_model: { type: Number, required: true },
    price_per_day: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', enum: ['INR', 'USD', 'EUR'] },
    ratings: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true },
    image_url: { type: String, required: true },

    // Technical Specifications
    technical_specifications: {
      engine_type: { type: String, required: true },
      engine_details: { type: String, required: true },
      combined_horsepower: { type: Number, required: true },
      combined_torque_nm: { type: Number, required: true },
      transmission: { type: String, required: true },
      top_speed_kmh: { type: Number, required: true },
      acceleration_0_100_kmh_seconds: { type: Number, required: true },
      drivetrain: { type: String, required: true },
      fuel_economy_l_per_100km: { type: Number },
      electric_range_km: { type: Number }
    },

    // Dimensions
    dimensions: {
      length_mm: { type: Number, required: true },
      width_mm: { type: Number, required: true },
      height_mm: { type: Number, required: true },
      seating_capacity: { type: Number, required: true, min: 1, max: 15 },
      cargo_space_liters: { type: Number, required: true }
    },

    // Features
    features: {
      infotainment: { type: String, required: true },
      seating: { type: String, required: true },
      sunroof: { type: String },
      ambient_lighting: { type: Boolean, default: false },
      head_up_display: { type: Boolean, default: false },
      color_options: [{ type: String }],
      headlights: { type: String }
    },

    // Safety and Assistance
    safety_and_assistance: {
      airbags_count: { type: Number, required: true, min: 0 },
      driver_assistance_systems: {
        adaptive_cruise_control: { type: Boolean, default: false },
        lane_keep_assist: { type: Boolean, default: false },
        blind_spot_monitoring: { type: Boolean, default: false },
        parking_assistant_plus: { type: Boolean, default: false }
      },
      ncap_rating: { type: String, default: 'Not yet rated' }
    },

    // Rental Details
    rental_details: {
      security_deposit_inr: { type: Number, required: true, min: 0 },
      kilometers_included_per_day: { type: Number, required: true, min: 0 },
      extra_km_charge_per_unit_inr: { type: Number, required: true, min: 0 },
      insurance_included: { type: Boolean, default: true }
    },

    // Status and Availability
    status: { 
      type: String, 
      enum: ['available', 'rented', 'maintenance', 'out_of_service'], 
      default: 'available' 
    },
    
    // Additional Images
    additional_images: [{ type: String }],
    
    // Location
    location: {
      city: { type: String },
      state: { type: String },
      pickup_location: { type: String }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
carSchema.index({ brand: 1, year_model: 1 });
carSchema.index({ price_per_day: 1 });
carSchema.index({ status: 1 });
carSchema.index({ 'technical_specifications.engine_type': 1 });
carSchema.index({ 'dimensions.seating_capacity': 1 });

// Virtual for average rating
carSchema.virtual('average_rating').get(function() {
  return this.ratings || 0;
});

// Virtual for availability status
carSchema.virtual('is_available').get(function() {
  return this.status === 'available';
});

module.exports = mongoose.model('Car', carSchema);
