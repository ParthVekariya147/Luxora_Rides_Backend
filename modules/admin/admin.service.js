const User = require('../user/user.model');

class AdminService {
  async listUsers() {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return users;
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserRole(userId, role) {
    const allowedRoles = ['user', 'admin'];
    if (!allowedRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    await user.save();
    return user.getProfile();
  }

  async activateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = true;
    await user.save();
    return { message: 'User activated successfully' };
  }

  async deactivateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = false;
    await user.save();
    return { message: 'User deactivated successfully' };
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await User.deleteOne({ _id: userId });
    return { message: 'User deleted successfully' };
  }

  async getOverviewStats() {
    const [totalUsers, activeUsers, inactiveUsers, totalAdmins, totalRegularUsers] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'user' })
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalAdmins,
      totalRegularUsers
    };
  }
}

module.exports = new AdminService();


