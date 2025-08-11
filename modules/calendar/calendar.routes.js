  const express = require('express');
  const router = express.Router();
  const {
    addBooking,
    updateBooking,
    deleteBooking,
    getBooking,
    listBookings,
    listPendingBookings,
    getOverview,
    exportSummary,
    updateRentStatus,
    getRentStatus,
    assignDriver,
    unassignDriver,
    assignVehicle,
    unassignVehicle,
    availableDrivers,
    availableVehicles
  } = require('./calendar.controller');
  const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

  router.use(authMiddleware, adminMiddleware);

  // Calendar (Bookings)
  router.post('/bookings', addBooking);
  router.get('/bookings', listBookings);
  router.get('/bookings/pending', listPendingBookings);
  router.get('/bookings/:bookingId', getBooking);
  router.put('/bookings/:bookingId', updateBooking);
  router.delete('/bookings/:bookingId', deleteBooking);

  // Overview
  router.get('/overview', getOverview);
  router.get('/overview/export', exportSummary);

  // Rent Status
  router.put('/bookings/:bookingId/rent-status', updateRentStatus);
  router.get('/bookings/rent-status', getRentStatus);

  // Assignments
  router.post('/bookings/:bookingId/assign-driver', assignDriver);
  router.post('/bookings/:bookingId/unassign-driver', unassignDriver);
  router.post('/bookings/:bookingId/assign-vehicle', assignVehicle);
  router.post('/bookings/:bookingId/unassign-vehicle', unassignVehicle);

  // Availability
  router.get('/availability/drivers', availableDrivers);
  router.get('/availability/vehicles', availableVehicles);

  module.exports = router;


