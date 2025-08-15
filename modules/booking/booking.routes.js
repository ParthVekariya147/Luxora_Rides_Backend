const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
router.get('/availability', bookingController.checkCarAvailability);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes (authenticated users)
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/my-bookings', bookingController.getUserBookings);
router.get('/bookings/booking/:bookingId', bookingController.getBookingByBookingId);

// Admin routes (admin authentication required)
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:bookingId', bookingController.getBookingById);
router.put('/bookings/:bookingId/status', bookingController.updateBookingStatus);
router.post('/bookings/:bookingId/confirm', bookingController.confirmBooking);
router.post('/bookings/:bookingId/cancel', bookingController.cancelBooking);
router.put('/bookings/:bookingId/payment', bookingController.updatePaymentStatus);
router.get('/bookings/stats/statistics', bookingController.getBookingStatistics);
router.get('/bookings/upcoming', bookingController.getUpcomingBookings);
router.get('/bookings/overdue', bookingController.getOverdueBookings);
router.delete('/bookings/:bookingId', bookingController.deleteBooking);

module.exports = router;
