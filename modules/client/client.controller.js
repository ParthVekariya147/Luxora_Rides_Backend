const clientService = require('./client.service');
const { createClientValidation, updateClientValidation } = require('./client.validation');

const addClient = async (req, res) => {
  try {
    const { error } = createClientValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const client = await clientService.createClient(req.body);
    return res.status(201).json({ success: true, data: client });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { error } = updateClientValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const client = await clientService.updateClient(req.params.clientId, req.body);
    return res.status(200).json({ success: true, data: client });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const result = await clientService.deleteClient(req.params.clientId);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getClient = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.clientId);
    return res.status(200).json({ success: true, data: client });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const listClients = async (req, res) => {
  try {
    const data = await clientService.listClients(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addClient,
  updateClient,
  deleteClient,
  getClient,
  listClients
};


