const driverService = require('./driver.service');
const { createDriverValidation, updateDriverValidation } = require('./driver.validation');

const addDriver = async (req, res) => {
  try {
    const { error } = createDriverValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const driver = await driverService.createDriver(req.body);
    return res.status(201).json({ success: true, data: driver });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { error } = updateDriverValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const driver = await driverService.updateDriver(req.params.driverId, req.body);
    return res.status(200).json({ success: true, data: driver });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const result = await driverService.deleteDriver(req.params.driverId);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getDriver = async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.driverId);
    return res.status(200).json({ success: true, data: driver });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const listDrivers = async (req, res) => {
  try {
    const data = await driverService.listDrivers(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getDriverStats = async (req, res) => {
  try {
    const stats = await driverService.getDriverStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addDriver,
  updateDriver,
  deleteDriver,
  getDriver,
  listDrivers,
  getDriverStats
};


