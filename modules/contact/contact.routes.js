const express = require('express');
const router = express.Router();
const contactController = require('./contact.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
router.post('/contact', contactController.createContact);
router.get('/contact/email/:email', contactController.getContactsByEmail);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes (authenticated users can see their own contacts)
router.get('/contact/my-contacts', contactController.getContactsByUserId);

// Admin routes (admin authentication required)
router.get('/contact', contactController.getAllContacts);
router.get('/contact/urgent', contactController.getUrgentContacts);
router.get('/contact/stats', contactController.getContactStatistics);
router.get('/contact/:contactId', contactController.getContactById);
router.put('/contact/:contactId/status', contactController.updateContactStatus);
router.post('/contact/:contactId/respond', contactController.respondToContact);
router.delete('/contact/:contactId', contactController.deleteContact);
router.post('/contact/bulk-update', contactController.bulkUpdateStatus);

module.exports = router;
