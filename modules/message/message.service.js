const Message = require('./message.model');

class MessageService {
  async sendMessage(data) {
    const msg = await Message.create(data);
    // hook: integrate with email/SMS later
    return msg;
  }

  async listMessages(query) {
    const { toType, to, page = 1, limit = 50 } = query;
    const filter = {};
    if (toType) filter.toType = toType;
    if (to) filter.to = to;
    const docs = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Message.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }

  async deleteMessage(id) {
    const msg = await Message.findById(id);
    if (!msg) throw new Error('Message not found');
    await Message.deleteOne({ _id: id });
    return { message: 'Message deleted successfully' };
  }
}

module.exports = new MessageService();


