const Joi = require('joi');

const base = {
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  address: Joi.string().max(255).allow('', null),
  notes: Joi.string().max(1000).allow('', null),
  isActive: Joi.boolean()
};

const createClientValidation = Joi.object({
  firstName: base.firstName.required(),
  lastName: base.lastName.required(),
  phone: base.phone.required(),
  email: base.email,
  address: base.address,
  notes: base.notes
});

const updateClientValidation = Joi.object(base);

module.exports = {
  createClientValidation,
  updateClientValidation
};


