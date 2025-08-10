const Joi = require('joi');

const base = {
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  licenseNumber: Joi.string().max(50).allow('', null),
  address: Joi.string().max(255).allow('', null),
  isActive: Joi.boolean()
};

const createDriverValidation = Joi.object({
  firstName: base.firstName.required(),
  lastName: base.lastName.required(),
  phone: base.phone.required(),
  email: base.email,
  licenseNumber: base.licenseNumber,
  address: base.address
});

const updateDriverValidation = Joi.object(base);

module.exports = {
  createDriverValidation,
  updateDriverValidation
};


