const Joi = require('joi');

const base = {
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  licenseNumber: Joi.string().max(50),
  address: Joi.string().max(500),
  status: Joi.string().valid('active', 'inactive', 'suspended'),
  performance: Joi.string().valid('excellent', 'good', 'average', 'poor'),
  totalTrips: Joi.number().min(0),
  rating: Joi.number().min(0).max(5),
  experience: Joi.number().min(0),
  isActive: Joi.boolean()
};

const createDriverValidation = Joi.object({
  firstName: base.firstName.required(),
  lastName: base.lastName.required(),
  email: base.email.required(),
  phone: base.phone.required(),
  licenseNumber: base.licenseNumber.required(),
  address: base.address.required(),
  status: base.status,
  performance: base.performance,
  totalTrips: base.totalTrips,
  rating: base.rating,
  experience: base.experience,
  isActive: base.isActive
});

const updateDriverValidation = Joi.object(base);

module.exports = {
  createDriverValidation,
  updateDriverValidation
};


