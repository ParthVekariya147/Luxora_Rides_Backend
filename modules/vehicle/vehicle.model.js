// const mongoose = require('mongoose');

// const vehicleSchema = new mongoose.Schema(
//   {
//     // Basic Information
//     name: { type: String, trim: true }, // 'name' ફીલ્ડ અહીં ઉમેરવામાં આવ્યું છે.
//     make: { type: String, required: true, trim: true },
//     model: { type: String, required: true, trim: true },
//     year: { type: Number, required: true },
//     licensePlate: { type: String, required: true, trim: true, unique: true },
//     vin: { type: String, required: true, trim: true, unique: true, maxlength: 17 },
//     color: { type: String, required: true, trim: true },
    
//     // Vehicle Details
//     fuelType: { type: String, enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg'], default: 'gasoline' },
//     transmission: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
//     seats: { type: Number, required: true, min: 1, max: 15 },
//     mileage: { type: Number, required: true, min: 0 },
//     category: { type: String, enum: ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'van', 'truck'], default: 'economy' },
//     status: { type: String, enum: ['available', 'maintenance', 'rented', 'out_of_service'], default: 'available' },
    
//     // Pricing
//     dailyRate: { type: Number, required: true, min: 0 },
//     weeklyRate: { type: Number, min: 0 },
//     monthlyRate: { type: Number, min: 0 },
    
//     // Features & Description
//     features: [{ type: String }],
//     description: { type: String },
    
//     // Important Dates
//     insuranceExpiry: { type: Date },
//     registrationExpiry: { type: Date },
//     lastMaintenance: { type: Date },
//     nextMaintenance: { type: Date },
    
//     // Image
//     images: [{ type: String }],
//   },
//   { timestamps: true }
// );

// vehicleSchema.index({ licensePlate: 1 });
// vehicleSchema.index({ vin: 1 });

// module.exports = mongoose.model('Vehicle', vehicleSchema);

const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    // Basic & Essential Information
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true, trim: true, unique: true },
    vin: { type: String, required: true, trim: true, unique: true, maxlength: 17 },
    color: { type: String, required: true, trim: true },
    
    // Vehicle Details
    fuelType: { type: String, enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg'], default: 'gasoline' },
    transmission: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
    seats: { type: Number, required: true, min: 1 },
    mileage: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'van', 'truck'], default: 'economy' },
    status: { type: String, enum: ['available', 'maintenance', 'rented', 'out_of_service'], default: 'available' },
    
    // Pricing
    dailyRate: { type: Number, required: true, min: 0 },

    // Image
    images: [{ type: String }],
  },
  { timestamps: true }
);

vehicleSchema.index({ licensePlate: 1 });
vehicleSchema.index({ vin: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);