const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      },
    },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },

    pickup_date: { type: Date, required: true },
    return_date: { type: Date, required: true },

    pickup_location: { type: String, required: true, trim: true },
    return_location: { type: String, required: true, trim: true },

    daily_rate: { type: Number, required: true, min: 0 },
    total_days: { type: Number, min: 1 },
    total_amount: { type: Number, min: 0 },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },

    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    payment_method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'cash', 'wallet'],
      required: true,
    },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto calculate total_days and total_amount
bookingSchema.pre('save', function (next) {
  if (this.pickup_date && this.return_date && this.daily_rate) {
    this.total_days = Math.ceil((this.return_date - this.pickup_date) / (1000 * 60 * 60 * 24));
    if (this.total_days < 1) this.total_days = 1;

    this.total_amount = this.daily_rate * this.total_days;
  }
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
