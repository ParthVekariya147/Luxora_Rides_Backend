const Joi = require('joi');

const base = {
  name: Joi.string().min(2).max(100),
  plateNumber: Joi.string().min(3).max(20),
  type: Joi.string().max(50).allow('', null),
  color: Joi.string().max(50).allow('', null),
  capacity: Joi.number().min(1).max(50),
  isActive: Joi.boolean(),
  serviceStatus: Joi.string().valid('ok', 'maintenance')
};

const createVehicleValidation = Joi.object({
  name: base.name.required(),
  plateNumber: base.plateNumber.required(),
  type: base.type,
  color: base.color,
  capacity: base.capacity
});

const updateVehicleValidation = Joi.object(base);

module.exports = { createVehicleValidation, updateVehicleValidation };


