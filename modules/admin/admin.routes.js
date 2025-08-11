const express = require('express');
const router = express.Router();
const {
  listUsers,
  getUserById,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser,
  getOverviewStats,
  adminLogin,
  adminRegister
} = require('./admin.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

// Admin authentication routes (no middleware required)
router.post('/auth/login', adminLogin);
router.post('/auth/register', adminRegister);

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Users management
router.get('/users', listUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/activate', activateUser);
router.put('/users/:userId/deactivate', deactivateUser);
router.delete('/users/:userId', deleteUser);

// Overview stats
router.get('/stats/overview', getOverviewStats);

module.exports = router;


