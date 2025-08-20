const express = require('express');
const router = express.Router();
const contactController = require('./contact.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

// Public route - Submit a new contact message
router.post('/', contactController.createContact);

// User routes - require authentication
router.use(authMiddleware);

// Get user's own contact messages
router.get('/my-messages', contactController.getContactsByUserId);

// Admin routes - all require authentication and admin role
router.use(adminMiddleware);

// View all user contact messages
router.get('/queries', contactController.getAllContacts);

// View details of a specific contact message
router.get('/query/:contactId', contactController.getContactById);

// Respond to a user's message
router.post('/reply/:contactId', contactController.respondToContact);

// Delete a specific contact query
router.delete('/query/:contactId', contactController.deleteContact);

module.exports = router;
