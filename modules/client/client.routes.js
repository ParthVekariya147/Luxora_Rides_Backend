const express = require('express');
const router = express.Router();
const { addClient, updateClient, deleteClient, getClient, listClients } = require('./client.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', addClient);
router.get('/', listClients);
router.get('/:clientId', getClient);
router.put('/:clientId', updateClient);
router.delete('/:clientId', deleteClient);

module.exports = router;
