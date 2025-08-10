const Joi = require('joi');

const base = {
  title: Joi.string().min(2).max(100),
  description: Joi.string().max(1000).allow('', null),
  start: Joi.date(),
  end: Joi.date(),
  client: Joi.string().hex().length(24),
  driver: Joi.string().hex().length(24).allow('', null),
  vehicle: Joi.string().max(100).allow('', null),
  pickupLocation: Joi.string().max(255).allow('', null),
  dropoffLocation: Joi.string().max(255).allow('', null),
  status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled'),
  rentStatus: Joi.string().valid('unpaid', 'partially_paid', 'paid'),
  amount: Joi.number().min(0),
  notes: Joi.string().max(1000).allow('', null)
};

const createBookingValidation = Joi.object({
  title: base.title.required(),
  start: base.start.required(),
  end: base.end.required(),
  client: base.client.required(),
  description: base.description,
  driver: base.driver,
  vehicle: base.vehicle,
  pickupLocation: base.pickupLocation,
  dropoffLocation: base.dropoffLocation,
  status: base.status,
  rentStatus: base.rentStatus,
  amount: base.amount,
  notes: base.notes
});

const updateBookingValidation = Joi.object(base);

const overviewValidation = Joi.object({
  start: Joi.date().required(),
  end: Joi.date().required()
});

module.exports = {
  createBookingValidation,
  updateBookingValidation,
  overviewValidation
};


