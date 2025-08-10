const Joi = require('joi');

const base = {
  booking: Joi.string().hex().length(24),
  amount: Joi.number().min(0),
  method: Joi.string().valid('cash', 'card', 'upi', 'bank_transfer'),
  status: Joi.string().valid('pending', 'completed', 'failed', 'refunded'),
  transactionId: Joi.string().max(100).allow('', null),
  notes: Joi.string().max(1000).allow('', null),
  date: Joi.date()
};

const createPaymentValidation = Joi.object({
  booking: base.booking.required(),
  amount: base.amount.required(),
  method: base.method.required(),
  status: base.status,
  transactionId: base.transactionId,
  notes: base.notes,
  date: base.date
});

const updatePaymentValidation = Joi.object(base);

module.exports = { createPaymentValidation, updatePaymentValidation };


