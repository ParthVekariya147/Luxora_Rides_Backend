const Vehicle = require('./vehicle.model');

class VehicleService {
  async createVehicle(data) {
    const vehicle = await Vehicle.create(data);
    return vehicle;
  }

  async updateVehicle(id, data) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');
    Object.assign(vehicle, data);
    await vehicle.save();
    return vehicle;
  }

  async deleteVehicle(id) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');
    await Vehicle.deleteOne({ _id: id });
    return { message: 'Vehicle deleted successfully' };
  }

  async getVehicleById(id) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  async listVehicles(query) {
    const { search, isActive, serviceStatus, page = 1, limit = 20 } = query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { plateNumber: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
    if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true' || isActive === true;
    if (serviceStatus) filter.serviceStatus = serviceStatus;
    const docs = await Vehicle.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Vehicle.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }
}

module.exports = new VehicleService();


