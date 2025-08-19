const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Booking Information
    booking_id: {
      type: String,
      required: true,
      unique: true,
      default: function() {
        return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      }
    },

    // User Information
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Car Information
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },

    // Rental Details
    pickup_date: { type: Date, required: true },
    return_date: { type: Date, required: true },
    pickup_location: { type: String, required: true, trim: true },
    return_location: { type: String, required: true, trim: true },
    pickup_time: { type: String, default: '09:00' },
    return_time: { type: String, default: '18:00' },

    // Pricing Details
    daily_rate: { type: Number, required: true, min: 0 },
    total_days: { type: Number, min: 1 }, // auto calculated
    subtotal: { type: Number, min: 0 },
    tax_amount: { type: Number, default: 0, min: 0 },
    discount_amount: { type: Number, default: 0, min: 0 },
    total_amount: { type: Number, min: 0 },
    security_deposit: { type: Number, required: true, min: 0 },

    // Additional Services
    additional_services: [{
      service_name: { type: String, required: true },
      service_price: { type: Number, required: true, min: 0 },
      description: String
    }],

    // Driver Info (optional)
    driver_details: {
      name: String,
      license_number: String,
      phone: String,
      email: String
    },

    // Booking Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending'
    },

    // Payment Information
    payment_status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    payment_method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash', 'wallet'],
      required: true
    },
    payment_id: String,
    transaction_id: String,

    // Admin Actions
    admin_notes: { type: String, trim: true, maxlength: 1000 },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    confirmed_at: Date,
    cancelled_at: Date,
    cancelled_reason: String,

    // Vehicle Handover
    vehicle_handover: {
      pickup_condition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], default: 'excellent' },
      return_condition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
      pickup_notes: String,
      return_notes: String,
      pickup_odometer: Number,
      return_odometer: Number,
      fuel_level_pickup: { type: String, enum: ['full', '3/4', '1/2', '1/4', 'empty'] },
      fuel_level_return: { type: String, enum: ['full', '3/4', '1/2', '1/4', 'empty'] }
    },

    // Insurance and Damage
    insurance_details: {
      is_insured: { type: Boolean, default: true },
      insurance_amount: { type: Number, default: 0 },
      damage_charges: { type: Number, default: 0 },
      damage_description: String
    },

    // Cancellation and Refund
    cancellation_policy: { type: String, default: 'Standard cancellation policy applies' },
    refund_amount: { type: Number, default: 0 },
    refund_status: { type: String, enum: ['pending', 'processed', 'completed', 'failed'], default: 'pending' },

    // Documents
    documents: [{
      document_type: { type: String, enum: ['driving_license', 'id_proof', 'insurance', 'contract', 'receipt'] },
      document_url: String,
      uploaded_at: { type: Date, default: Date.now }
    }],

    // Communication
    email_sent: {
      confirmation: { type: Boolean, default: false },
      reminder: { type: Boolean, default: false },
      completion: { type: Boolean, default: false }
    },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
bookingSchema.index({ user_id: 1, created_at: -1 });
bookingSchema.index({ car_id: 1, status: 1 });
bookingSchema.index({ status: 1, created_at: -1 });
bookingSchema.index({ booking_id: 1 });
bookingSchema.index({ pickup_date: 1, return_date: 1 });
bookingSchema.index({ payment_status: 1 });

// Virtuals
bookingSchema.virtual('duration_days').get(function() {
  if (this.pickup_date && this.return_date) {
    const diffTime = Math.abs(this.return_date - this.pickup_date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

bookingSchema.virtual('is_active').get(function() {
  return ['pending', 'confirmed', 'in_progress'].includes(this.status);
});

bookingSchema.virtual('is_completed').get(function() {
  return this.status === 'completed';
});

bookingSchema.virtual('is_cancelled').get(function() {
  return this.status === 'cancelled';
});

bookingSchema.virtual('total_with_deposit').get(function() {
  return this.total_amount + this.security_deposit;
});

// Pre-save: update timestamps
bookingSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Pre-save: auto calculate totals
bookingSchema.pre('save', function(next) {
  if (this.pickup_date && this.return_date && this.daily_rate) {
    // Calculate total days
    this.total_days = Math.ceil((this.return_date - this.pickup_date) / (1000 * 60 * 60 * 24));
    if (this.total_days < 1) this.total_days = 1;

    // Subtotal (daily_rate * days)
    this.subtotal = this.daily_rate * this.total_days;

    // Add additional services
    if (this.additional_services && this.additional_services.length > 0) {
      const servicesTotal = this.additional_services.reduce((sum, service) => sum + service.service_price, 0);
      this.subtotal += servicesTotal;
    }

    // Total = subtotal + tax - discount
    this.total_amount = this.subtotal + this.tax_amount - this.discount_amount;
  }
  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
