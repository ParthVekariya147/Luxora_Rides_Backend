const CalendarEvent = require('./calendar.model');
const { Parser } = require('json2csv');
const Driver = require('../driver/driver.model');
const Vehicle = require('../vehicle/vehicle.model');

class CalendarService {
  async createBooking(data) {
    const booking = await CalendarEvent.create(data);
    return booking;
  }

  async updateBooking(id, data) {
    const booking = await CalendarEvent.findById(id);
    if (!booking) throw new Error('Booking not found');
    Object.assign(booking, data);
    await booking.save();
    return booking;
  }

  async deleteBooking(id) {
    const booking = await CalendarEvent.findById(id);
    if (!booking) throw new Error('Booking not found');
    await CalendarEvent.deleteOne({ _id: id });
    return { message: 'Booking deleted successfully' };
  }

  async getBookingById(id) {
    const booking = await CalendarEvent.findById(id)
      .populate('client')
      .populate('driver')
      .populate('vehicleId');
    if (!booking) throw new Error('Booking not found');
    return booking;
  }

  async listBookings(query) {
    const { start, end, client, driver, status, rentStatus, page = 1, limit = 50 } = query;
    const filter = {};
    if (start && end) {
      filter.$or = [
        { start: { $gte: new Date(start), $lte: new Date(end) } },
        { end: { $gte: new Date(start), $lte: new Date(end) } }
      ];
    }
    if (client) filter.client = client;
    if (driver) filter.driver = driver;
    if (status) filter.status = status;
    if (rentStatus) filter.rentStatus = rentStatus;

    const docs = await CalendarEvent.find(filter)
      .populate('client')
      .populate('driver')
      .populate('vehicle')  
      .sort({ start: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await CalendarEvent.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }

  async getOverview(start, end) {
    const filter = { $or: [
      { start: { $gte: new Date(start), $lte: new Date(end) } },
      { end: { $gte: new Date(start), $lte: new Date(end) } }
    ] };

    const [total, completed, inProgress, cancelled, scheduled, totalAmount] = await Promise.all([
      CalendarEvent.countDocuments(filter),
      CalendarEvent.countDocuments({ ...filter, status: 'completed' }),
      CalendarEvent.countDocuments({ ...filter, status: 'in_progress' }),
      CalendarEvent.countDocuments({ ...filter, status: 'cancelled' }),
      CalendarEvent.countDocuments({ ...filter, status: 'scheduled' }),
      CalendarEvent.aggregate([
        { $match: filter },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ])
    ]);

    return {
      total,
      statusBreakdown: { completed, inProgress, cancelled, scheduled },
      totalAmount: (totalAmount[0] && totalAmount[0].sum) || 0
    };
  }

  async exportBookingsSummary(start, end) {
    const { items } = await this.listBookings({ start, end, page: 1, limit: 10000 });
    const fields = ['_id', 'title', 'start', 'end', 'status', 'rentStatus', 'amount'];
    const parser = new Parser({ fields });
    return parser.parse(items.map((b) => ({
      _id: b._id,
      title: b.title,
      start: b.start,
      end: b.end,
      status: b.status,
      rentStatus: b.rentStatus,
      amount: b.amount
    })));
  }

  async updateRentStatus(id, rentStatus) {
    const allowed = ['unpaid', 'partially_paid', 'paid'];
    if (!allowed.includes(rentStatus)) throw new Error('Invalid rent status');
    const booking = await CalendarEvent.findById(id);
    if (!booking) throw new Error('Booking not found');
    booking.rentStatus = rentStatus;
    await booking.save();
    return booking;
  }

  async getRentStatusForBookings(query) {
    const { start, end } = query;
    const filter = {};
    if (start && end) {
      filter.$or = [
        { start: { $gte: new Date(start), $lte: new Date(end) } },
        { end: { $gte: new Date(start), $lte: new Date(end) } }
      ];
    }
    const docs = await CalendarEvent.find(filter).select('start end rentStatus amount');
    return docs;
  }

  async listPendingBookings(query) {
    const { by = 'rent', start, end, page = 1, limit = 50 } = query;
    const filter = {};
    if (start && end) {
      filter.$or = [
        { start: { $gte: new Date(start), $lte: new Date(end) } },
        { end: { $gte: new Date(start), $lte: new Date(end) } }
      ];
    }

    const pendingConditions = [];
    if (by === 'rent' || by === 'both') pendingConditions.push({ rentStatus: { $ne: 'paid' } });
    if (by === 'status' || by === 'both') pendingConditions.push({ status: 'scheduled' });
    if (pendingConditions.length === 0) pendingConditions.push({ rentStatus: { $ne: 'paid' } });

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: pendingConditions }];
      delete filter.$or;
    } else {
      filter.$or = pendingConditions;
    }

    const docs = await CalendarEvent.find(filter)
      .populate('client')
      .populate('driver')
      .populate('vehicleId')
      .sort({ start: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await CalendarEvent.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }

  // Assignments
  async assignDriver(bookingId, driverId) {
    const booking = await CalendarEvent.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');

    const overlap = await CalendarEvent.exists({
      _id: { $ne: bookingId },
      driver: driverId,
      $or: [
        { start: { $lt: booking.end, $gte: booking.start } },
        { end: { $gt: booking.start, $lte: booking.end } },
        { start: { $lte: booking.start }, end: { $gte: booking.end } }
      ]
    });
    if (overlap) throw new Error('Driver not available for the selected time');

    booking.driver = driverId;
    await booking.save();
    return booking;
  }

  async unassignDriver(bookingId) {
    const booking = await CalendarEvent.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.driver = undefined;
    await booking.save();
    return booking;
  }

  async assignVehicle(bookingId, vehicleId) {
    const booking = await CalendarEvent.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');

    const overlap = await CalendarEvent.exists({
      _id: { $ne: bookingId },
      vehicleId,
      $or: [
        { start: { $lt: booking.end, $gte: booking.start } },
        { end: { $gt: booking.start, $lte: booking.end } },
        { start: { $lte: booking.start }, end: { $gte: booking.end } }
      ]
    });
    if (overlap) throw new Error('Vehicle not available for the selected time');

    booking.vehicleId = vehicleId;
    await booking.save();
    return booking;
  }

  async unassignVehicle(bookingId) {
    const booking = await CalendarEvent.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.vehicleId = undefined;
    await booking.save();
    return booking;
  }

  async availableDrivers(start, end) {
    const busy = await CalendarEvent.distinct('driver', {
      driver: { $ne: null },
      $or: [
        { start: { $lt: new Date(end), $gte: new Date(start) } },
        { end: { $gt: new Date(start), $lte: new Date(end) } },
        { start: { $lte: new Date(start) }, end: { $gte: new Date(end) } }
      ]
    });
    const drivers = await Driver.find({ _id: { $nin: busy }, isActive: true });
    return drivers;
  }

  async availableVehicles(start, end) {
    const busy = await CalendarEvent.distinct('vehicleId', {
      vehicleId: { $ne: null },
      $or: [
        { start: { $lt: new Date(end), $gte: new Date(start) } },
        { end: { $gt: new Date(start), $lte: new Date(end) } },
        { start: { $lte: new Date(start) }, end: { $gte: new Date(end) } }
      ]
    });
    const vehicles = await Vehicle.find({ _id: { $nin: busy }, isActive: true, serviceStatus: 'ok' });
    return vehicles;
  }
}

module.exports = new CalendarService();

 
