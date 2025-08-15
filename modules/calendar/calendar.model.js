const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    vehicle: { type: String, trim: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    pickupLocation: { type: String, trim: true },
    dropoffLocation: { type: String, trim: true },
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
    rentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
    amount: { type: Number, default: 0 },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

calendarEventSchema.index({ start: 1, end: 1 });
calendarEventSchema.index({ driver: 1, start: 1, end: 1 });
calendarEventSchema.index({ vehicleId: 1, start: 1, end: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);


