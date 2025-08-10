const express = require('express');
const router = express.Router();
const { sendMessage, listMessages, deleteMessage } = require('./message.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', sendMessage);
router.get('/', listMessages);
router.delete('/:messageId', deleteMessage);

module.exports = router;


