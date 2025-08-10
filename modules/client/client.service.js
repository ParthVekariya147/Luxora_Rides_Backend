const Client = require('./client.model');

class ClientService {
  async createClient(data) {
    const client = await Client.create(data);
    return client;
  }

  async updateClient(id, data) {
    const client = await Client.findById(id);
    if (!client) throw new Error('Client not found');
    Object.assign(client, data);
    await client.save();
    return client;
  }

  async deleteClient(id) {
    const client = await Client.findById(id);
    if (!client) throw new Error('Client not found');
    await Client.deleteOne({ _id: id });
    return { message: 'Client deleted successfully' };
  }

  async getClientById(id) {
    const client = await Client.findById(id);
    if (!client) throw new Error('Client not found');
    return client;
  }

  async listClients(query) {
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
    const docs = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Client.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }
}

module.exports = new ClientService();


