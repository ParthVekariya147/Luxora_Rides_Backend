const adminService = require('./admin.service');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.adminLogin(email, password);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const result = await adminService.adminRegister(firstName, lastName, email, password, phone);
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await adminService.listUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.userId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await adminService.updateUserRole(req.params.userId, role);
    return res.status(200).json({ success: true, message: 'Role updated successfully', data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const activateUser = async (req, res) => {
  try {
    const result = await adminService.activateUser(req.params.userId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const result = await adminService.deactivateUser(req.params.userId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.userId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getOverviewStats = async (req, res) => {
  try {
    const data = await adminService.getOverviewStats();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  adminLogin,
  adminRegister,
  listUsers,
  getUserById,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser,
  getOverviewStats
};


