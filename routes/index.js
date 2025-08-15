const express = require('express');
const router = express.Router();
const userRoutes = require('../modules/user/user.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const clientRoutes = require('../modules/client/client.routes');
const driverRoutes = require('../modules/driver/driver.routes');
const calendarRoutes = require('../modules/calendar/calendar.routes');
const expenseRoutes = require('../modules/expense/expense.routes');
const messageRoutes = require('../modules/message/message.routes');
const paymentRoutes = require('../modules/payment/payment.routes');
const vehicleRoutes = require('../modules/vehicle/vehicle.routes');
const carRoutes = require('../modules/car/car.routes');
const contactRoutes = require('../modules/contact/contact.routes');
const bookingRoutes = require('../modules/booking/booking.routes');
const authRoutes = require('./auth');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/clients', clientRoutes);
router.use('/api/drivers', driverRoutes);
router.use('/api/calendar', calendarRoutes);
router.use('/api/expenses', expenseRoutes);
router.use('/api/messages', messageRoutes);
router.use('/api/payments', paymentRoutes);
router.use('/api/vehicles', vehicleRoutes);
router.use('/api', carRoutes);
router.use('/api', contactRoutes);
router.use('/api', bookingRoutes);

module.exports = router;
