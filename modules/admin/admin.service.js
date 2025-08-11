const User = require('../user/user.model');
const { generateToken } = require('../../utils/generateToken');

class AdminService {
  async adminLogin(email, password) {
    // Find admin user by email
    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!admin) {
      throw new Error('Invalid email or password');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, admin.email, admin.role);

    return {
      message: 'Admin login successful',
      token,
      user: admin.getProfile()
    };
  }

  async adminRegister(firstName, lastName, email, password, phone) {
    // Check if admin already exists with this email
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    // Create new admin user
    const admin = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'admin',
      isEmailVerified: true, // Admin emails are pre-verified
      isActive: true
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id, admin.email, admin.role);

    return {
      message: 'Admin registered successfully',
      token,
      user: admin.getProfile()
    };
  }

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


