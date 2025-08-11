const Driver = require('./driver.model');

class DriverService {
  async createDriver(data) {
    const driver = await Driver.create(data);
    return driver;
  }

  async updateDriver(id, data) {
    const driver = await Driver.findById(id);
    if (!driver) throw new Error('Driver not found');
    Object.assign(driver, data);
    await driver.save();
    return driver;
  }

  async deleteDriver(id) {
    const driver = await Driver.findById(id);
    if (!driver) throw new Error('Driver not found');
    await Driver.deleteOne({ _id: id });
    return { message: 'Driver deleted successfully' };
  }

  async getDriverById(id) {
    const driver = await Driver.findById(id);
    if (!driver) throw new Error('Driver not found');
    return driver;
  }

  async listDrivers(query) {
    const { search, isActive, status, performance, page = 1, limit = 20 } = query;
    const filter = {};
    
    if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true' || isActive === true;
    if (status) filter.status = status;
    if (performance) filter.performance = performance;
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    const docs = await Driver.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Driver.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }

  async getDriverStats() {
    const stats = await Driver.aggregate([
      {
        $group: {
          _id: null,
          totalDrivers: { $sum: 1 },
          activeDrivers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactiveDrivers: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          suspendedDrivers: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } },
          avgRating: { $avg: '$rating' },
          totalTrips: { $sum: '$totalTrips' },
          avgExperience: { $avg: '$experience' }
        }
      }
    ]);
    return stats[0] || {
      totalDrivers: 0,
      activeDrivers: 0,
      inactiveDrivers: 0,
      suspendedDrivers: 0,
      avgRating: 0,
      totalTrips: 0,
      avgExperience: 0
    };
  }
}

module.exports = new DriverService();


