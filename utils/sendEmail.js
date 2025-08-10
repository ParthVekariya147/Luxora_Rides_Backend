const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

// Alternative: Use Ethereal Email for testing (no real emails sent)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    return null;
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.GMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Welcome to Luxora Rides!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to Luxora Rides!</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${firstName},</p>
          <p style="color: #666; line-height: 1.6;">Thank you for registering with us. Your account has been successfully created.</p>
          <p style="color: #666; line-height: 1.6;">You can now log in to your account and start using our services.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/login" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">Best regards,<br>The Luxora Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    
    // Fallback to test email service
    try {
      const testTransporter = await createTestAccount();
      if (testTransporter) {
        await testTransporter.sendMail(mailOptions);
        console.log("Welcome email sent via test service to:", email);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback email also failed:", fallbackError);
    }
    
    return false;
  }
};

// Send OTP for password reset
const sendOTPEmail = async (email, otp, firstName = "User") => {
  const mailOptions = {
    from: process.env.GMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Password Reset OTP - Luxora Backend",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${firstName},</p>
          <p style="color: #666; line-height: 1.6;">You requested a password reset for your account.</p>
          <p style="color: #666; line-height: 1.6;">Your OTP is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: white; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 5px;">
              ${otp}
            </div>
          </div>
          <p style="color: #666; line-height: 1.6;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666; line-height: 1.6;">If you didn't request this, please ignore this email.</p>
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">Best regards,<br>The Luxora Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    
    // For development/testing, log the OTP to console
    console.log(`🔐 OTP for ${email}: ${otp}`);
    console.log(`📧 Email would be sent to: ${email}`);
    console.log(`👤 User: ${firstName}`);
    
    // Fallback to test email service
    try {
      const testTransporter = await createTestAccount();
      if (testTransporter) {
        await testTransporter.sendMail(mailOptions);
        console.log("OTP email sent via test service to:", email);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback email also failed:", fallbackError);
    }
    
    return false;
  }
};

// Send password reset success email
const sendPasswordResetSuccessEmail = async (email, firstName = "User") => {
  const mailOptions = {
    from: process.env.GMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Password Reset Successful - Luxora Backend",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Successful</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${firstName},</p>
          <p style="color: #666; line-height: 1.6;">Your password has been successfully reset.</p>
          <p style="color: #666; line-height: 1.6;">You can now log in to your account with your new password.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/login" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">If you didn't reset your password, please contact support immediately.</p>
          <p style="color: #666; line-height: 1.6;">Best regards,<br>The Luxora Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    return false;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  generateOTP,
  verifyEmailConfig,
};
