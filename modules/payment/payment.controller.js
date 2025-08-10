const paymentService = require('./payment.service');
const { createPaymentValidation, updatePaymentValidation } = require('./payment.validation');

const addPayment = async (req, res) => {
  try {
    const { error } = createPaymentValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const payment = await paymentService.createPayment(req.body);
    return res.status(201).json({ success: true, data: payment });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { error } = updatePaymentValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const payment = await paymentService.updatePayment(req.params.paymentId, req.body);
    return res.status(200).json({ success: true, data: payment });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.paymentId);
    return res.status(200).json({ success: true, data: payment });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const listPayments = async (req, res) => {
  try {
    const data = await paymentService.listPayments(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addPayment, updatePayment, getPayment, listPayments };


