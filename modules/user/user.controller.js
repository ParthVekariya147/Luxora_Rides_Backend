const userService = require('./user.service');
const { verifyRefreshToken, generateToken, generateRefreshToken } = require('../../utils/generateToken');
const { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation, 
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyOTPValidation
} = require('./user.validation');

// Register new user
const register = async (req, res) => {
  try {
    // Validate request body
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const result = await userService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Validate request body
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;
    const result = await userService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.userId);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    // Validate request body
    const { error } = updateProfileValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const updatedUser = await userService.updateProfile(req.user.userId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    // Validate request body
    const { error } = changePasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.userId, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Deactivate user (admin only)
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.deactivateUser(userId);
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Activate user (admin only)
const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.activateUser(userId);
    
    res.status(200).json({
      success: true,
      message: 'User activated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Forgot password - send OTP
const forgotPassword = async (req, res) => {
  try {
    // Validate request body
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;
    await userService.forgotPassword(email);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    // Validate request body
    const { error } = verifyOTPValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, otp } = req.body;
    await userService.verifyOTP(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Reset password with OTP
const resetPassword = async (req, res) => {
  try {
    // Validate request body
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, otp, newPassword } = req.body;
    await userService.resetPassword(email, otp, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    // Validate request body
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;
    await userService.resendOTP(email);
    
    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully to your email'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deactivateUser,
  activateUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    // Optionally: check token against DB/whitelist
    const user = await require('./user.model').findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid user' });
    }
    const token = generateToken(user._id, user.email, user.role);
    const newRefresh = generateRefreshToken(user._id);
    return res.status(200).json({ success: true, data: { token, refreshToken: newRefresh } });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

module.exports.refreshToken = refreshToken;
