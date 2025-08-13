const Joi = require('joi');

const base = {
  name: Joi.string().min(2).max(100),
  licensePlate: Joi.string().min(3).max(20),
  make: Joi.string().max(50),
  model: Joi.string().max(50),
  year: Joi.number().min(1900).max(new Date().getFullYear() + 1),
  vin: Joi.string().length(17),
  color: Joi.string().max(50),
  seats: Joi.number().min(1).max(15),
  mileage: Joi.number().min(0),
  category: Joi.string().valid('economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'van', 'truck'),
  status: Joi.string().valid('available', 'maintenance', 'rented', 'out_of_service'),
    fuelType: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid', 'lpg'),
transmission: Joi.string().valid('automatic', 'manual'),
  dailyRate: Joi.number().min(0),
  weeklyRate: Joi.number().min(0),
  monthlyRate: Joi.number().min(0),
  features: Joi.array().items(Joi.string()),
  description: Joi.string().allow('', null),
  insuranceExpiry: Joi.date(),
  registrationExpiry: Joi.date(),
  lastMaintenance: Joi.date(),
  nextMaintenance: Joi.date(),
  images: Joi.array().items(Joi.string().uri())
};

const createVehicleValidation = Joi.object({
  name: base.name.optional(),
  make: base.make.required(),
  model: base.model.required(),
  year: base.year.required(),
  licensePlate: base.licensePlate.required(),
  vin: base.vin.required(),
  color: base.color.required(),
  seats: base.seats.required(),
  mileage: base.mileage.required(),
  fuelType: base.fuelType.optional(),
    transmission: base.transmission.optional(),

  category: base.category.optional(),
  status: base.status.optional(),
  dailyRate: base.dailyRate.required(),
  weeklyRate: base.weeklyRate.optional(),
  monthlyRate: base.monthlyRate.optional(),
  features: base.features.optional(),
  description: base.description.optional(),
  insuranceExpiry: base.insuranceExpiry.optional(),
  registrationExpiry: base.registrationExpiry.optional(),
  lastMaintenance: base.lastMaintenance.optional(),
  nextMaintenance: base.nextMaintenance.optional(),
  images: base.images.optional()
});

const updateVehicleValidation = Joi.object(base);

module.exports = { createVehicleValidation, updateVehicleValidation };
