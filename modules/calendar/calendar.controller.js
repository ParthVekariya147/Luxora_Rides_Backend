const calendarService = require('./calendar.service');
const { createBookingValidation, updateBookingValidation, overviewValidation } = require('./calendar.validation');

// CRUD for bookings (calendar)
const addBooking = async (req, res) => {
  try {
    const { error } = createBookingValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const booking = await calendarService.createBooking(req.body);
    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { error } = updateBookingValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const booking = await calendarService.updateBooking(req.params.bookingId, req.body);
    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const result = await calendarService.deleteBooking(req.params.bookingId);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await calendarService.getBookingById(req.params.bookingId);
    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const listBookings = async (req, res) => {
  try {
    const data = await calendarService.listBookings(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Overview and exports
const getOverview = async (req, res) => {
  try {
    const { error } = overviewValidation.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const data = await calendarService.getOverview(req.query.start, req.query.end);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const exportSummary = async (req, res) => {
  try {
    const { error } = overviewValidation.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const csv = await calendarService.exportBookingsSummary(req.query.start, req.query.end);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="bookings_${req.query.start}_${req.query.end}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Rent status
const updateRentStatus = async (req, res) => {
  try {
    const booking = await calendarService.updateRentStatus(req.params.bookingId, req.body.rentStatus);
    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getRentStatus = async (req, res) => {
  try {
    const data = await calendarService.getRentStatusForBookings(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  listBookings,
  getOverview,
  exportSummary,
  updateRentStatus,
  getRentStatus
};

// Assignments
const assignDriver = async (req, res) => {
  try {
    const data = await calendarService.assignDriver(req.params.bookingId, req.body.driverId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const unassignDriver = async (req, res) => {
  try {
    const data = await calendarService.unassignDriver(req.params.bookingId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const assignVehicle = async (req, res) => {
  try {
    const data = await calendarService.assignVehicle(req.params.bookingId, req.body.vehicleId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const unassignVehicle = async (req, res) => {
  try {
    const data = await calendarService.unassignVehicle(req.params.bookingId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const availableDrivers = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await calendarService.availableDrivers(start, end);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const availableVehicles = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await calendarService.availableVehicles(start, end);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports.assignDriver = assignDriver;
module.exports.unassignDriver = unassignDriver;
module.exports.assignVehicle = assignVehicle;
module.exports.unassignVehicle = unassignVehicle;
module.exports.availableDrivers = availableDrivers;
module.exports.availableVehicles = availableVehicles;


