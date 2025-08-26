const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    // --- Basic & Essential Information ---
    car_name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    year_model: { type: Number, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price_per_day: { type: Number, required: true, min: 0 },
    
    // --- Key Specifications (Simplified) ---
    fuel_type: { 
      type: String, 
      required: true, 
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'] 
    },
    transmission: { 
      type: String, 
      required: true, 
      enum: ['Manual', 'Automatic'] 
    },
    seating_capacity: { type: Number, required: true, min: 2, max: 10 },
    features: [{ type: String }], // A simple list of key features, e.g., ["Sunroof", "GPS", "Bluetooth"]

    // --- Availability ---
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Indexes for better query performance ---
carSchema.index({ brand: 1, price_per_day: -1 }); // Index for sorting by brand and price
carSchema.index({ status: 1 }); // Index for finding available cars

// --- Virtual property to easily check availability ---
carSchema.virtual('is_available').get(function () {
  return this.status === 'available';
});

module.exports = mongoose.model('Car', carSchema);