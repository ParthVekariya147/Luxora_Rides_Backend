const vehicleService = require('./vehicle.service');
const { createVehicleValidation, updateVehicleValidation } = require('./vehicle.validation');

const addVehicle = async (req, res) => {
  try {
    const { error } = createVehicleValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const vehicle = await vehicleService.createVehicle(req.body);
    return res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { error } = updateVehicleValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const vehicle = await vehicleService.updateVehicle(req.params.vehicleId, req.body);
    return res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.vehicleId);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.vehicleId);
    return res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const listVehicles = async (req, res) => {
  try {
    const data = await vehicleService.listVehicles(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addVehicle, updateVehicle, deleteVehicle, getVehicle, listVehicles };


