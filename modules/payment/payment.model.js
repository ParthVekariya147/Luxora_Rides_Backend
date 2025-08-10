const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cash', 'card', 'upi', 'bank_transfer'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
    transactionId: { type: String, trim: true },
    notes: { type: String, trim: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1, date: -1 });

module.exports = mongoose.model('Payment', paymentSchema);


