const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  getAllUsers, 
  deactivateUser, 
  activateUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
  refreshToken
} = require('./user.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Password reset routes (no authentication required)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);
router.post('/refresh-token', refreshToken);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

// Admin routes (admin role required)
router.get('/all', authMiddleware, adminMiddleware, getAllUsers);
router.put('/deactivate/:userId', authMiddleware, adminMiddleware, deactivateUser);
router.put('/activate/:userId', authMiddleware, adminMiddleware, activateUser);

module.exports = router;
