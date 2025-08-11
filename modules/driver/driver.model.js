const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    performance: { type: String, enum: ['excellent', 'good', 'average', 'poor'], default: 'good' },
    totalTrips: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    experience: { type: Number, min: 0, default: 0 }, // in years
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

driverSchema.index({ firstName: 1, lastName: 1, phone: 1, email: 1 });
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ status: 1, isActive: 1 });

module.exports = mongoose.model('Driver', driverSchema);


