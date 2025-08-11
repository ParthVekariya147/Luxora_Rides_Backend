const express = require('express');
const router = express.Router();
const adminService = require('../modules/admin/admin.service');
const { adminLoginValidation, adminRegisterValidation } = require('../modules/admin/admin.validation');

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

// Admin Login
router.post('/login', validateRequest(adminLoginValidation), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.adminLogin(email, password);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// Admin Register
router.post('/register', validateRequest(adminRegisterValidation), async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const result = await adminService.adminRegister(firstName, lastName, email, password, phone);
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
