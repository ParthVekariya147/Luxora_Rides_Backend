const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    licenseNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

driverSchema.index({ firstName: 1, lastName: 1, phone: 1 });

module.exports = mongoose.model('Driver', driverSchema);


