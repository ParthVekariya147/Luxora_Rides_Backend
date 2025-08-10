const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    toType: { type: String, enum: ['Client', 'Driver'], required: true },
    to: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'toType' },
    subject: { type: String, trim: true },
    body: { type: String, required: true, trim: true },
    channel: { type: String, enum: ['email', 'sms', 'in_app'], default: 'in_app' },
    meta: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);


