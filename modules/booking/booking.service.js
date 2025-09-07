const Booking = require("./booking.model");
const Car = require("../car/car.model");
const User = require("../user/user.model");
const {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendAdminBookingNotification,
} = require("../../utils/sendEmail");

class BookingService {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      // Check if car is available for the selected dates
      const isCarAvailable = await this.checkCarAvailability(
        bookingData.car_id,
        bookingData.pickup_date,
        bookingData.return_date
      );

      if (!isCarAvailable) {
        throw new Error("Car is not available for the selected dates");
      }

      // Get car details for pricing
      const car = await Car.findById(bookingData.car_id);
      if (!car) {
        throw new Error("Car not found");
      }

      // Calculate total days
      const pickupDate = new Date(bookingData.pickup_date);
      const returnDate = new Date(bookingData.return_date);

      let totalDays = Math.ceil(
        (returnDate - pickupDate) / (1000 * 60 * 60 * 24)
      );
      if (totalDays <= 0) {
        totalDays = 1; // Minimum 1 day rent charge
      }

      // Calculate pricing
      const dailyRate = car.price_per_day;
      const totalAmount = dailyRate * totalDays;

      // Create booking object aligned with simplified model
      const booking = new Booking({
        ...bookingData,
        daily_rate: dailyRate,
        total_days: totalDays,
        total_amount: totalAmount,
        // Removed subtotal, tax_amount, security_deposit as per simplified model
      });

      const savedBooking = await booking.save();

      // Send admin notification
      await this.sendAdminNotification(savedBooking);

      return savedBooking;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate("user_id", "name email phone")
        .populate("car_id");

      if (!booking) {
        throw new Error("Booking not found");
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by custom booking ID
  async getBookingByBookingId(bookingId) {
    try {
      const booking = await Booking.findOne({ booking_id: bookingId })
        .populate("user_id", "name email phone")
        .populate("car_id")
        .populate("admin_id", "name email");

      if (!booking) {
        throw new Error("Booking not found");
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings with filtering and pagination
  async getAllBookings(filters = {}, pagination = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        sortBy = "created_at",
        sortOrder = "desc",
      } = pagination;
      const {
        status,
        payment_status,
        user_id,
        car_id,
        date_from,
        date_to,
        search,
      } = filters;

      const query = {};

      if (status) query.status = status;
      if (payment_status) query.payment_status = payment_status;
      if (user_id) query.user_id = user_id;
      if (car_id) query.car_id = car_id;

      if (date_from || date_to) {
        query.pickup_date = {};
        if (date_from) query.pickup_date.$gte = new Date(date_from);
        if (date_to) query.pickup_date.$lte = new Date(date_to);
      }

      if (search) {
        query.$or = [
          { booking_id: { $regex: search, $options: "i" } },
          { pickup_location: { $regex: search, $options: "i" } },
          { return_location: { $regex: search, $options: "i" } },
        ];
      }

      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const skip = (page - 1) * limit;

      const bookings = await Booking.find(query)
        .populate("user_id", "name email phone")
        .populate("car_id", "car_name brand image_url")

        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Booking.countDocuments(query);

      return {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user's bookings
  async getUserBookings(userId, filters = {}) {
    try {
      const { status, page = 1, limit = 50 } = filters;

      const query = { user_id: userId };
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const bookings = await Booking.find(query)
        .populate("car_id", "car_name brand image_url daily_rate")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(50);

      const total = await Booking.countDocuments(query);

      return {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Update booking status (admin action)
  async updateBookingStatus(bookingId, status, adminId, notes = "") {
    try {
      const booking = await Booking.findById(bookingId)
        .populate("user_id", "name email phone")
        .populate("car_id", "car_name brand image_url");

      if (!booking) {
        throw new Error("Booking not found");
      }

      const oldStatus = booking.status;
      booking.status = status;
      booking.admin_id = adminId;
      booking.admin_notes = notes;

      // Set timestamps based on status
      if (status === "confirmed") {
        booking.confirmed_at = new Date();
      } else if (status === "cancelled") {
        booking.cancelled_at = new Date();
      }

      const updatedBooking = await booking.save();

      // Send email notification if status changed
      if (oldStatus !== status) {
        await this.sendStatusUpdateEmail(updatedBooking);
      }

      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }

  // Confirm booking (admin action)
  async confirmBooking(bookingId, adminId, notes = "") {
    try {
      const booking = await this.updateBookingStatus(
        bookingId,
        "confirmed",
        adminId,
        notes
      );

      // Send confirmation email
      await this.sendConfirmationEmail(booking);

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId, adminId, reason = "") {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      booking.status = "cancelled";
      booking.admin_id = adminId;
      booking.cancelled_reason = reason;
      booking.cancelled_at = new Date();

      const updatedBooking = await booking.save();

      // Send cancellation email
      await this.sendStatusUpdateEmail(updatedBooking);

      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(
    bookingId,
    paymentStatus,
    paymentId = null,
    transactionId = null
  ) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      booking.payment_status = paymentStatus;
      if (paymentId) booking.payment_id = paymentId;
      if (transactionId) booking.transaction_id = transactionId;

      const updatedBooking = await booking.save();

      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }

  // Check car availability
  async checkCarAvailability(carId, pickupDate, returnDate) {
    try {
      const conflictingBookings = await Booking.find({
        car_id: carId,
        status: { $in: ["pending", "confirmed", "in_progress"] },
        $or: [
          {
            pickup_date: { $lte: new Date(returnDate) },
            return_date: { $gte: new Date(pickupDate) },
          },
        ],
      });

      return conflictingBookings.length === 0;
    } catch (error) {
      throw error;
    }
  }

  // Get booking statistics
  async getBookingStatistics() {
    try {
      const stats = await Booking.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            confirmed: {
              $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
            },
            in_progress: {
              $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
            },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
            total_revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$payment_status", "completed"] },
                  "$total_amount",
                  0,
                ],
              },
            },
          },
        },
      ]);

      const monthlyStats = await Booking.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$created_at" },
              month: { $month: "$created_at" },
            },
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$payment_status", "completed"] },
                  "$total_amount",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]);

      const recentBookings = await Booking.find()
        .populate("user_id", "name email")
        .populate("car_id", "car_name brand")
        .sort({ created_at: -1 })
        .limit(5)
        .select("booking_id status total_amount created_at");

      return {
        overview: stats[0] || {
          total: 0,
          pending: 0,
          confirmed: 0,
          in_progress: 0,
          completed: 0,
          cancelled: 0,
          total_revenue: 0,
        },
        monthlyStats,
        recentBookings,
      };
    } catch (error) {
      throw error;
    }
  }

  // Send confirmation email
  async sendConfirmationEmail(booking) {
    try {
      const user = await User.findById(booking.user_id);
      const car = await Car.findById(booking.car_id);

      const emailData = {
        userEmail: user.email,
        userName: user.name,
        carName: car.car_name,
        carBrand: car.brand,
        pickupDate: booking.pickup_date,
        returnDate: booking.return_date,
        pickupLocation: booking.pickup_location,
        returnLocation: booking.return_location,
        totalAmount: booking.total_amount,
        bookingId: booking.booking_id,
        carImage: car.image_url,
      };

      await sendBookingConfirmationEmail(emailData);

      // Removed email_sent confirmation update per simplified model
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  }

  // Send status update email
  async sendStatusUpdateEmail(booking) {
    try {
      const user = await User.findById(booking.user_id);
      const car = await Car.findById(booking.car_id);
      const admin = await User.findById(booking.admin_id);

      const emailData = {
        userEmail: user.email,
        userName: user.name,
        carName: car.car_name,
        carBrand: car.brand,
        bookingId: booking.booking_id,
        status: booking.status,
        message: booking.admin_notes,
        adminName: admin ? admin.name : "Luxora Team",
      };

      await sendBookingStatusUpdateEmail(emailData);
    } catch (error) {
      console.error("Error sending status update email:", error);
    }
  }

  // Send admin notification
  async sendAdminNotification(booking) {
    try {
      const user = await User.findById(booking.user_id);
      const car = await Car.findById(booking.car_id);

      const emailData = {
        userEmail: user.email,
        userName: user.name,
        userPhone: user.phone,
        carName: car.car_name,
        carBrand: car.brand,
        pickupDate: booking.pickup_date,
        returnDate: booking.return_date,
        pickupLocation: booking.pickup_location,
        returnLocation: booking.return_location,
        totalAmount: booking.total_amount,
        bookingId: booking.booking_id,
      };

      await sendAdminBookingNotification(emailData);
    } catch (error) {
      console.error("Error sending admin notification:", error);
    }
  }

  // Delete booking
  async deleteBooking(bookingId) {
    try {
      const booking = await Booking.findByIdAndDelete(bookingId);

      if (!booking) {
        throw new Error("Booking not found");
      }

      return { message: "Booking deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  // Get upcoming bookings
  async getUpcomingBookings() {
    try {
      const today = new Date();
      const bookings = await Booking.find({
        pickup_date: { $gte: today },
        status: { $in: ["confirmed", "in_progress"] },
      })
        .populate("user_id", "name email phone")
        .populate("car_id", "car_name brand image_url")
        .sort({ pickup_date: 1 })
        .limit(10);

      return bookings;
    } catch (error) {
      throw error;
    }
  }

  // Get overdue bookings
  async getOverdueBookings() {
    try {
      const today = new Date();
      const bookings = await Booking.find({
        return_date: { $lt: today },
        status: { $in: ["confirmed", "in_progress"] },
      })
        .populate("user_id", "name email phone")
        .populate("car_id", "car_name brand image_url")
        .sort({ return_date: 1 });

      return bookings;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookingService();
