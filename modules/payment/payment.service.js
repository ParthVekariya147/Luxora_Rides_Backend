const Payment = require('./payment.model');
const Booking = require('../calendar/calendar.model');

class PaymentService {
  async createPayment(data) {
    const booking = await Booking.findById(data.booking);
    if (!booking) throw new Error('Booking not found');

    const payment = await Payment.create(data);

    // Update rent status heuristically
    const payments = await Payment.aggregate([
      { $match: { booking: booking._id } },
      { $group: { _id: '$booking', amount: { $sum: '$amount' } } }
    ]);
    const totalPaid = (payments[0] && payments[0].amount) || 0;
    if (totalPaid <= 0) booking.rentStatus = 'unpaid';
    else if (totalPaid < booking.amount) booking.rentStatus = 'partially_paid';
    else booking.rentStatus = 'paid';
    await booking.save();

    return payment;
  }

  async updatePayment(id, data) {
    const payment = await Payment.findById(id);
    if (!payment) throw new Error('Payment not found');
    Object.assign(payment, data);
    await payment.save();
    return payment;
  }

  async getPaymentById(id) {
    const payment = await Payment.findById(id).populate({ path: 'booking' });
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  async listPayments(query) {
    const { booking, status, method, page = 1, limit = 50 } = query;
    const filter = {};
    if (booking) filter.booking = booking;
    if (status) filter.status = status;
    if (method) filter.method = method;
    const docs = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('booking');
    const total = await Payment.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }
}

module.exports = new PaymentService();


