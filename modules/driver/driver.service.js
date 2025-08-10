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
    const { search, isActive, page = 1, limit = 20 } = query;
    const filter = {};
    if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true' || isActive === true;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const docs = await Driver.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Driver.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }
}

module.exports = new DriverService();


