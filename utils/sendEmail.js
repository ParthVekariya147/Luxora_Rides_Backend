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
    subject: "Password Reset OTP - Luxora Rides",
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
    subject: "Password Reset Successful - Luxora Rides",
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

// Send booking confirmation email
const sendBookingConfirmationEmail = async (bookingData) => {
  const {
    userEmail,
    userName,
    carName,
    carBrand,
    pickupDate,
    returnDate,
    pickupLocation,
    returnLocation,
    totalAmount,
    bookingId,
    carImage
  } = bookingData;

  const mailOptions = {
    from: process.env.GMAIL_USER || "your-email@gmail.com",
    to: userEmail,
    subject: `Booking Confirmed - ${carBrand} ${carName} | Luxora`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #28a745; margin: 0; font-size: 28px;">✅ Booking Confirmed!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Your luxury car rental is confirmed</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Booking Details</h3>
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              ${carImage ? `<img src="${carImage}" alt="${carName}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">` : ''}
              <div>
                <h4 style="color: #333; margin: 0 0 5px 0;">${carBrand} ${carName}</h4>
                <p style="color: #666; margin: 0; font-size: 14px;">Booking ID: ${bookingId}</p>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <strong style="color: #333;">Pickup Date:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${new Date(pickupDate).toLocaleDateString()}</p>
              </div>
              <div>
                <strong style="color: #333;">Return Date:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${new Date(returnDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <strong style="color: #333;">Pickup Location:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${pickupLocation}</p>
              </div>
              <div>
                <strong style="color: #333;">Return Location:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${returnLocation}</p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: #333; font-size: 18px;">Total Amount:</strong>
                <span style="color: #28a745; font-size: 20px; font-weight: bold;">₹${totalAmount}</span>
              </div>
            </div>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="color: #155724; margin: 0 0 10px 0;">📋 What's Next?</h4>
            <ul style="color: #155724; margin: 0; padding-left: 20px;">
              <li>Arrive at the pickup location 15 minutes before your scheduled time</li>
              <li>Bring your driving license and booking confirmation</li>
              <li>Complete the vehicle inspection with our representative</li>
              <li>Enjoy your luxury ride!</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${bookingId}" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              View Booking Details
            </a>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" 
               style="display: inline-block; padding: 12px 24px; background-color: #6c757d; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              Contact Support
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px; text-align: center;">
            Thank you for choosing Luxora!<br>
            <strong>The Luxora Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    
    // Fallback to test email service
    try {
      const testTransporter = await createTestAccount();
      if (testTransporter) {
        await testTransporter.sendMail(mailOptions);
        console.log("Booking confirmation email sent via test service to:", userEmail);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback email also failed:", fallbackError);
    }
    
    return false;
  }
};

// Send booking status update email
const sendBookingStatusUpdateEmail = async (bookingData) => {
  const {
    userEmail,
    userName,
    carName,
    carBrand,
    bookingId,
    status,
    message = '',
    adminName = 'Luxora Team'
  } = bookingData;

  const statusColors = {
    'confirmed': '#28a745',
    'cancelled': '#dc3545',
    'completed': '#17a2b8',
    'in_progress': '#ffc107'
  };

  const statusMessages = {
    'confirmed': 'Your booking has been confirmed!',
    'cancelled': 'Your booking has been cancelled.',
    'completed': 'Your booking has been completed.',
    'in_progress': 'Your booking is being processed.'
  };

  const mailOptions = {
    from: process.env.GMAIL_USER || "your-email@gmail.com",
    to: userEmail,
    subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${carBrand} ${carName} | Luxora`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: ${statusColors[status] || '#333'}; margin: 0; font-size: 28px;">
              ${status === 'confirmed' ? '✅' : status === 'cancelled' ? '❌' : status === 'completed' ? '✅' : '⏳'} 
              Booking ${status.charAt(0).toUpperCase() + status.slice(1)}
            </h1>
            <p style="color: #666; margin: 10px 0 0 0;">${statusMessages[status]}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Booking Information</h3>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Vehicle:</strong> ${carBrand} ${carName}</p>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Status:</strong> 
              <span style="color: ${statusColors[status] || '#333'}; font-weight: bold;">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </p>
            ${message ? `<p style="color: #666; margin: 10px 0 0 0;"><strong>Message:</strong> ${message}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${bookingId}" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              View Booking Details
            </a>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" 
               style="display: inline-block; padding: 12px 24px; background-color: #6c757d; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              Contact Support
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong>${adminName}</strong><br>
            The Luxora Team
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking status update email sent successfully to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending booking status update email:", error);
    
    // Fallback to test email service
    try {
      const testTransporter = await createTestAccount();
      if (testTransporter) {
        await testTransporter.sendMail(mailOptions);
        console.log("Booking status update email sent via test service to:", userEmail);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback email also failed:", fallbackError);
    }
    
    return false;
  }
};

// Send admin notification for new booking
const sendAdminBookingNotification = async (bookingData) => {
  const {
    userEmail,
    userName,
    userPhone,
    carName,
    carBrand,
    pickupDate,
    returnDate,
    pickupLocation,
    returnLocation,
    totalAmount,
    bookingId
  } = bookingData;

  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'admin@luxora.com';

  const mailOptions = {
    from: process.env.GMAIL_USER || "your-email@gmail.com",
    to: adminEmail,
    subject: `New Booking Request - ${carBrand} ${carName} | Luxora`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0; font-size: 28px;">🚗 New Booking Request</h1>
            <p style="color: #666; margin: 10px 0 0 0;">A new booking has been submitted</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Booking Details</h3>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Vehicle:</strong> ${carBrand} ${carName}</p>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Customer Information</h3>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Name:</strong> ${userName}</p>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Phone:</strong> ${userPhone}</p>
          </div>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Rental Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #333;">Pickup Date:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${new Date(pickupDate).toLocaleDateString()}</p>
              </div>
              <div>
                <strong style="color: #333;">Return Date:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${new Date(returnDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div style="margin-top: 15px;">
              <strong style="color: #333;">Pickup Location:</strong>
              <p style="color: #666; margin: 5px 0 0 0;">${pickupLocation}</p>
            </div>
            <div style="margin-top: 15px;">
              <strong style="color: #333;">Return Location:</strong>
              <p style="color: #666; margin: 5px 0 0 0;">${returnLocation}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin'}/bookings/${bookingId}" 
               style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              Review Booking
            </a>
            <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin'}/bookings" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              View All Bookings
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px; text-align: center;">
            Please review and take appropriate action.<br>
            <strong>The Luxora System</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin booking notification sent successfully to:", adminEmail);
    return true;
  } catch (error) {
    console.error("Error sending admin booking notification:", error);
    
    // Fallback to test email service
    try {
      const testTransporter = await createTestAccount();
      if (testTransporter) {
        await testTransporter.sendMail(mailOptions);
        console.log("Admin booking notification sent via test service to:", adminEmail);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback email also failed:", fallbackError);
    }
    
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendAdminBookingNotification,
  generateOTP,
  verifyEmailConfig,
};
