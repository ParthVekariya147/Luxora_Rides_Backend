const messageService = require('./message.service');
const { sendMessageValidation } = require('./message.validation');

const sendMessage = async (req, res) => {
  try {
    const { error } = sendMessageValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const msg = await messageService.sendMessage(req.body);
    return res.status(201).json({ success: true, data: msg });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const listMessages = async (req, res) => {
  try {
    const data = await messageService.listMessages(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const result = await messageService.deleteMessage(req.params.messageId);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, listMessages, deleteMessage };


