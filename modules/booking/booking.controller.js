const bookingService = require("./booking.service");
const {
  createBookingValidation,
  updateStatusValidation,
  confirmBookingValidation,
  cancelBookingValidation,
  updatePaymentValidation,
  bookingFiltersValidation,
  paginationValidation,
  bookingIdValidation,
  customBookingIdValidation,
} = require("./booking.validation");

class BookingController {
  // Create a new booking
  // Create a new booking
  async createBooking(req, res) {
    try {
      // Validate request body (without user_id)
      const { error, value } = createBookingValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Try different user ID fields
      const userId = req.user.id || req.user._id || req.user.userId;
      console.log("Extracted userId:", userId);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found in token",
        });
      }

      // Add user ID from authenticated user AFTER validation
      const bookingData = {
        ...value,
        user_id: userId,
      };

      console.log("Final bookingData:", bookingData);

      const booking = await bookingService.createBooking(bookingData);
      console.log(
        "booking.controller.js / booking / 36 -------------------  ",
        booking
      );

      res.status(201).json({
        success: true,
        message: "Booking created successfully. Awaiting admin confirmation.",
        data: {
          id: booking._id,
          booking_id: booking.booking_id,
          status: booking.status,
          total_amount: booking.total_amount,
          pickup_date: booking.pickup_date,
          return_date: booking.return_date,
          rent_per_day: booking.daily_rate,
          total_days: booking.total_days,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create booking",
        error: error.message,
      });
    }
  }

  // Get booking by ID
  async getBookingById(req, res) {
    try {
      // Validate booking ID
      const { error, value } = bookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: error.details[0].message,
        });
      }

      const booking = await bookingService.getBookingById(value.bookingId);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(404).json({
        success: false,
        message: "Booking not found",
        error: error.message,
      });
    }
  }

  // Get booking by custom booking ID
  async getBookingByBookingId(req, res) {
    try {
      // Validate booking ID
      const { error, value } = customBookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: error.details[0].message,
        });
      }

      const booking = await bookingService.getBookingByBookingId(
        value.bookingId
      );

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(404).json({
        success: false,
        message: "Booking not found",
        error: error.message,
      });
    }
  }

  // Get all bookings (admin)
  async getAllBookings(req, res) {
    try {
      // Validate query parameters
      const { error: filterError, value: filters } =
        bookingFiltersValidation.validate(req.query);
      if (filterError) {
        return res.status(400).json({
          success: false,
          message: "Invalid filter parameters",
          errors: filterError.details.map((detail) => detail.message),
        });
      }

      const { error: paginationError, value: pagination } =
        paginationValidation.validate(req.query);
      if (paginationError) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination parameters",
          errors: paginationError.details.map((detail) => detail.message),
        });
      }

      const result = await bookingService.getAllBookings(filters, pagination);

      res.status(200).json({
        success: true,
        data: result.bookings,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error getting bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookings",
        error: error.message,
      });
    }
  }

  // Get user's bookings
  async getUserBookings(req, res) {
    try {
      const { error: filterError, value: filters } =
        bookingFiltersValidation.validate(req.query);
      if (filterError) {
        return res.status(400).json({
          success: false,
          message: "Invalid filter parameters",
          errors: filterError.details.map((detail) => detail.message),
        });
      }

      const { error: paginationError, value: pagination } =
        paginationValidation.validate(req.query);
      if (paginationError) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination parameters",
          errors: paginationError.details.map((detail) => detail.message),
        });
      }

      const result = await bookingService.getUserBookings(req.user.id, {
        ...filters,
        ...pagination,
      });

      res.status(200).json({
        success: true,
        data: result.bookings,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error getting user bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user bookings",
        error: error.message,
      });
    }
  }

  // Update booking status (admin)
  async updateBookingStatus(req, res) {
    try {
      // Validate booking ID
      const { error: idError, value: idValue } = bookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (idError) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: idError.details[0].message,
        });
      }

      // Validate request body
      const { error: bodyError, value } = updateStatusValidation.validate(
        req.body
      );
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: bodyError.details.map((detail) => detail.message),
        });
      }

      const booking = await bookingService.updateBookingStatus(
        idValue.bookingId,
        value.status,
        req.user.id,
        value.admin_notes
      );

      res.status(200).json({
        success: true,
        message: "Booking status updated successfully",
        data: booking,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update booking status",
        error: error.message,
      });
    }
  }

  // Confirm booking (admin)
  async confirmBooking(req, res) {
    try {
      // Validate booking ID
      const { error: idError, value: idValue } = bookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (idError) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: idError.details[0].message,
        });
      }

      // Validate request body
      const { error: bodyError, value } = confirmBookingValidation.validate(
        req.body
      );
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: bodyError.details.map((detail) => detail.message),
        });
      }

      const booking = await bookingService.confirmBooking(
        idValue.bookingId,
        req.user.id,
        value.admin_notes
      );

      res.status(200).json({
        success: true,
        message:
          "Booking confirmed successfully. Confirmation email sent to customer.",
        data: booking,
      });
    } catch (error) {
      console.error("Error confirming booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to confirm booking",
        error: error.message,
      });
    }
  }

  // Cancel booking (admin)
  async cancelBooking(req, res) {
    try {
      // Validate booking ID
      const { error: idError, value: idValue } = bookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (idError) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: idError.details[0].message,
        });
      }

      // Validate request body
      const { error: bodyError, value } = cancelBookingValidation.validate(
        req.body
      );
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: bodyError.details.map((detail) => detail.message),
        });
      }

      const booking = await bookingService.cancelBooking(
        idValue.bookingId,
        req.user.id,
        value.reason
      );

      res.status(200).json({
        success: true,
        message:
          "Booking cancelled successfully. Cancellation email sent to customer.",
        data: booking,
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel booking",
        error: error.message,
      });
    }
  }

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      // Validate booking ID
      const { error: idError, value: idValue } = bookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (idError) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: idError.details[0].message,
        });
      }

      // Validate request body
      const { error: bodyError, value } = updatePaymentValidation.validate(
        req.body
      );
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: bodyError.details.map((detail) => detail.message),
        });
      }

      const booking = await bookingService.updatePaymentStatus(
        idValue.bookingId,
        value.payment_status,
        value.payment_id,
        value.transaction_id
      );

      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        data: booking,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update payment status",
        error: error.message,
      });
    }
  }

  // Get booking statistics (admin)
  async getBookingStatistics(req, res) {
    try {
      const stats = await bookingService.getBookingStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting booking statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch booking statistics",
        error: error.message,
      });
    }
  }

  // Get upcoming bookings (admin)
  async getUpcomingBookings(req, res) {
    try {
      const bookings = await bookingService.getUpcomingBookings();

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      console.error("Error getting upcoming bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch upcoming bookings",
        error: error.message,
      });
    }
  }

  // Get overdue bookings (admin)
  async getOverdueBookings(req, res) {
    try {
      const bookings = await bookingService.getOverdueBookings();

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      console.error("Error getting overdue bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch overdue bookings",
        error: error.message,
      });
    }
  }

  // Check car availability
  async checkCarAvailability(req, res) {
    try {
      const { carId, pickupDate, returnDate } = req.query;

      if (!carId || !pickupDate || !returnDate) {
        return res.status(400).json({
          success: false,
          message: "Car ID, pickup date, and return date are required",
        });
      }

      const isAvailable = await bookingService.checkCarAvailability(
        carId,
        pickupDate,
        returnDate
      );

      res.status(200).json({
        success: true,
        data: {
          car_id: carId,
          pickup_date: pickupDate,
          return_date: returnDate,
          is_available: isAvailable,
        },
      });
    } catch (error) {
      console.error("Error checking car availability:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check car availability",
        error: error.message,
      });
    }
  }

  // Delete booking (admin)
  async deleteBooking(req, res) {
    try {
      // Validate booking ID
      const { error, value } = bookingIdValidation.validate({
        bookingId: req.params.bookingId,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
          error: error.details[0].message,
        });
      }

      const result = await bookingService.deleteBooking(value.bookingId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete booking",
        error: error.message,
      });
    }
  }

  async editBookingDetails(req, res) {
    try {
      const { bookingId } = req.params;
      const updateData = req.body;

      if ("booking_id" in updateData) delete updateData.booking_id;
      updateData.updated_at = new Date();

      // Get booking document
      const booking = await bookingService.getBookingByBookingId(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Assign updated fields
      Object.keys(updateData).forEach((field) => {
        booking[field] = updateData[field];
      });

      // Save updated booking
      const updatedBooking = await bookingService.saveBooking(booking);

      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        data: updatedBooking,
      });
    } catch (error) {
      console.error("Error editing booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to edit booking",
        error: error.message,
      });
    }
  }
}

module.exports = new BookingController();
