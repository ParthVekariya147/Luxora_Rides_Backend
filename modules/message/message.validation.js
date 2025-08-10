const Joi = require('joi');

const sendMessageValidation = Joi.object({
  toType: Joi.string().valid('Client', 'Driver', 'client', 'driver').required(),
  to: Joi.string().hex().length(24).required(),
  subject: Joi.string().max(150).allow('', null),
  body: Joi.string().min(1).max(5000).required(),
  channel: Joi.string().valid('email', 'sms', 'in_app')
});

module.exports = { sendMessageValidation };


