const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    plateNumber: { type: String, required: true, trim: true, unique: true },
    type: { type: String, trim: true },
    color: { type: String, trim: true },
    capacity: { type: Number, default: 4 },
    isActive: { type: Boolean, default: true },
    serviceStatus: { type: String, enum: ['ok', 'maintenance'], default: 'ok' }
  },
  { timestamps: true }
);

vehicleSchema.index({ plateNumber: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);


