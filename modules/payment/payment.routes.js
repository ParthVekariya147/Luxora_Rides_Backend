const express = require('express');
const router = express.Router();
const { addPayment, updatePayment, getPayment, listPayments } = require('./payment.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', addPayment);
router.get('/', listPayments);
router.get('/:paymentId', getPayment);
router.put('/:paymentId', updatePayment);

module.exports = router;


