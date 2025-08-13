const User = require('./user.model');
const OTP = require('./otp.model');
const { generateToken, generateRefreshToken } = require('../../utils/generateToken');
const { sendWelcomeEmail, sendOTPEmail, sendPasswordResetSuccessEmail, generateOTP } = require('../../utils/sendEmail');

class UserService {
  // Register new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate tokens
      const token = generateToken(user._id, user.email, user.role);
      const refreshToken = generateRefreshToken(user._id);

      // Send welcome email
      await sendWelcomeEmail(user.email, user.firstName);

      return {
        user: user.getProfile(),
        token,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const token = generateToken(user._id, user.email, user.role);
      const refreshToken = generateRefreshToken(user._id);

      return {
        user: user.getProfile(),
        token,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed fields
      const allowedFields = ['firstName', 'lastName', 'phone'];
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          user[field] = updateData[field];
        }
      });

      await user.save();
      return user.getProfile();
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const users = await User.find({}).select('-password');
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Deactivate user (admin only)
  async deactivateUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.isActive = false;
      await user.save();

      return { message: 'User deactivated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Activate user (admin only)
  async activateUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.isActive = true;
      await user.save();

      return { message: 'User activated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Forgot password - send OTP
  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('User with this email does not exist');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP to database
      await OTP.create({
        email: email.toLowerCase(),
        otp,
        type: 'password_reset',
        expiresAt
      });

      // Send OTP email
      const emailSent = await sendOTPEmail(email, otp, user.firstName);
      if (!emailSent) {
        throw new Error('Failed to send OTP email');
      }

      return { message: 'OTP sent successfully to your email' };
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const otpRecord = await OTP.findOne({
        email: email.toLowerCase(),
        otp,
        type: 'password_reset',
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        throw new Error('Invalid or expired OTP');
      }

      // Mark OTP as verified
      await otpRecord.markAsVerified();

      // Generate a reset token (simple hash of email + timestamp)
      const resetToken = Buffer.from(`${email.toLowerCase()}-${Date.now()}`).toString('base64');

      return { 
        message: 'OTP verified successfully',
        resetToken 
      };
    } catch (error) {
      throw error;
    }
  }

  // Reset password with reset token
  async resetPassword(resetToken, newPassword) {
    try {
      // Decode reset token to get email
      const decoded = Buffer.from(resetToken, 'base64').toString();
      const [email] = decoded.split('-');
      
      if (!email) {
        throw new Error('Invalid reset token');
      }

      // Find verified OTP for this email
      const otpRecord = await OTP.findOne({
        email: email.toLowerCase(),
        type: 'password_reset',
        isVerified: true,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        throw new Error('No verified OTP found. Please verify your OTP first.');
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('User not found');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Mark OTP as used
      await otpRecord.markAsUsed();

      // Send success email
      await sendPasswordResetSuccessEmail(email, user.firstName);

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Resend OTP
  async resendOTP(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('User with this email does not exist');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Delete existing unused OTPs (both verified and unverified)
      await OTP.deleteMany({
        email: email.toLowerCase(),
        type: 'password_reset',
        isUsed: false
      });

      // Generate new OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save new OTP
      await OTP.create({
        email: email.toLowerCase(),
        otp,
        type: 'password_reset',
        expiresAt
      });

      // Send new OTP email
      const emailSent = await sendOTPEmail(email, otp, user.firstName);
      if (!emailSent) {
        throw new Error('Failed to send OTP email');
      }

      return { message: 'New OTP sent successfully to your email' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
