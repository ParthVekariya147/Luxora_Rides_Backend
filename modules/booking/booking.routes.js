const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
router.get('/availability', bookingController.checkCarAvailability);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes (authenticated users)
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/booking/:bookingId', bookingController.getBookingByBookingId);

// Admin routes (admin authentication required)
router.get('/', bookingController.getAllBookings);
router.get('/:bookingId', bookingController.getBookingById);
router.put('/:bookingId/status', bookingController.updateBookingStatus);
router.post('/:bookingId/confirm', bookingController.confirmBooking);
router.post('/:bookingId/cancel', bookingController.cancelBooking);
router.put('/:bookingId/payment', bookingController.updatePaymentStatus);
router.get('/stats/statistics', bookingController.getBookingStatistics);
router.get('/upcoming', bookingController.getUpcomingBookings);
router.get('/overdue', bookingController.getOverdueBookings);
router.delete('/:bookingId', bookingController.deleteBooking);
router.put('/:bookingId/edit', bookingController.editBookingDetails);

module.exports = router;