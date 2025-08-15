# Booking API Documentation

This document provides comprehensive information about the Booking API endpoints for the Luxora backend. The booking system allows users to book cars and admins to manage bookings with automatic email notifications.

## Base URL
```
http://localhost:3000/api
```

## Authentication
- **Public endpoints**: No authentication required
- **Protected endpoints**: Require Bearer token in Authorization header
- **Admin endpoints**: Require admin authentication

## Email Flow Overview

### 1. New Booking Flow
1. **User creates booking** → Admin receives notification email
2. **Admin confirms booking** → User receives confirmation email
3. **Admin updates status** → User receives status update email
4. **Admin cancels booking** → User receives cancellation email

### 2. Email Templates
- **Admin Notification**: New booking request details
- **User Confirmation**: Booking confirmed with all details
- **Status Updates**: Booking status changes with admin notes
- **Cancellation**: Booking cancelled with reason

## API Endpoints

### 1. Check Car Availability (Public)
**GET** `/availability`

Check if a car is available for the selected dates.

**Query Parameters:**
- `carId` (string): Car ID
- `pickupDate` (string): Pickup date (YYYY-MM-DD)
- `returnDate` (string): Return date (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "car_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "pickup_date": "2024-01-20",
    "return_date": "2024-01-25",
    "is_available": true
  }
}
```

### 2. Create Booking (User)
**POST** `/bookings`

Create a new car booking. Requires user authentication.

**Request Body:**
```json
{
  "car_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "pickup_date": "2024-01-20",
  "return_date": "2024-01-25",
  "pickup_location": "Mumbai Airport",
  "return_location": "Mumbai Airport",
  "pickup_time": "09:00",
  "return_time": "18:00",
  "payment_method": "credit_card",
  "additional_services": [
    {
      "service_name": "GPS Navigation",
      "service_price": 500,
      "description": "GPS device rental"
    }
  ],
  "driver_details": {
    "name": "John Doe",
    "license_number": "DL123456789",
    "phone": "+919876543210",
    "email": "john.doe@example.com"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully. Awaiting admin confirmation.",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "booking_id": "BK1703123456789ABCD",
    "status": "pending",
    "total_amount": 15000,
    "pickup_date": "2024-01-20T00:00:00.000Z",
    "return_date": "2024-01-25T00:00:00.000Z"
  }
}
```

**Email Sent:** Admin notification email

### 3. Get All Bookings (Admin)
**GET** `/bookings`

Get all bookings with filtering and pagination. Admin authentication required.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `status` (string): Filter by status
- `payment_status` (string): Filter by payment status
- `user_id` (string): Filter by user ID
- `car_id` (string): Filter by car ID
- `date_from` (string): Filter from date
- `date_to` (string): Filter to date
- `search` (string): Search in booking ID, locations
- `sortBy` (string): Sort field (default: created_at)
- `sortOrder` (string): Sort order (asc, desc, default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "booking_id": "BK1703123456789ABCD",
      "user_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+919876543210"
      },
      "car_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "car_name": "BMW X5",
        "brand": "BMW",
        "image_url": "https://example.com/bmw-x5.jpg"
      },
      "pickup_date": "2024-01-20T00:00:00.000Z",
      "return_date": "2024-01-25T00:00:00.000Z",
      "pickup_location": "Mumbai Airport",
      "return_location": "Mumbai Airport",
      "total_amount": 15000,
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 4. Get User's Bookings (User)
**GET** `/bookings/my-bookings`

Get all bookings for the authenticated user.

**Query Parameters:**
- `status` (string): Filter by status
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "booking_id": "BK1703123456789ABCD",
      "car_id": {
        "car_name": "BMW X5",
        "brand": "BMW",
        "image_url": "https://example.com/bmw-x5.jpg",
        "price_per_day": 3000
      },
      "pickup_date": "2024-01-20T00:00:00.000Z",
      "return_date": "2024-01-25T00:00:00.000Z",
      "total_amount": 15000,
      "status": "confirmed",
      "payment_status": "completed"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### 5. Get Booking by ID (Admin)
**GET** `/bookings/:bookingId`

Get a specific booking by ID. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "booking_id": "BK1703123456789ABCD",
    "user_id": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+919876543210"
    },
    "car_id": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW X5",
      "brand": "BMW",
      "image_url": "https://example.com/bmw-x5.jpg",
      "price_per_day": 3000
    },
    "pickup_date": "2024-01-20T00:00:00.000Z",
    "return_date": "2024-01-25T00:00:00.000Z",
    "pickup_location": "Mumbai Airport",
    "return_location": "Mumbai Airport",
    "pickup_time": "09:00",
    "return_time": "18:00",
    "daily_rate": 3000,
    "total_days": 5,
    "subtotal": 15000,
    "tax_amount": 2700,
    "total_amount": 17700,
    "security_deposit": 5000,
    "status": "pending",
    "payment_status": "pending",
    "payment_method": "credit_card",
    "additional_services": [
      {
        "service_name": "GPS Navigation",
        "service_price": 500,
        "description": "GPS device rental"
      }
    ],
    "driver_details": {
      "name": "John Doe",
      "license_number": "DL123456789",
      "phone": "+919876543210",
      "email": "john.doe@example.com"
    },
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6. Get Booking by Custom ID (User)
**GET** `/bookings/booking/:bookingId`

Get a booking by custom booking ID (starts with BK). User authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "booking_id": "BK1703123456789ABCD",
    "car_id": {
      "car_name": "BMW X5",
      "brand": "BMW",
      "image_url": "https://example.com/bmw-x5.jpg"
    },
    "pickup_date": "2024-01-20T00:00:00.000Z",
    "return_date": "2024-01-25T00:00:00.000Z",
    "total_amount": 17700,
    "status": "confirmed"
  }
}
```

### 7. Confirm Booking (Admin)
**POST** `/bookings/:bookingId/confirm`

Confirm a booking and send confirmation email to user. Admin authentication required.

**Request Body:**
```json
{
  "admin_notes": "Booking confirmed. Please arrive 15 minutes before pickup time."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully. Confirmation email sent to customer.",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "status": "confirmed",
    "confirmed_at": "2024-01-15T11:00:00.000Z",
    "admin_id": "64f8a1b2c3d4e5f6a7b8c9d3"
  }
}
```

**Email Sent:** User confirmation email

### 8. Update Booking Status (Admin)
**PUT** `/bookings/:bookingId/status`

Update booking status. Admin authentication required.

**Request Body:**
```json
{
  "status": "in_progress",
  "admin_notes": "Vehicle handed over to customer."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "status": "in_progress",
    "admin_notes": "Vehicle handed over to customer.",
    "updated_at": "2024-01-20T09:00:00.000Z"
  }
}
```

**Email Sent:** Status update email (if status changed)

### 9. Cancel Booking (Admin)
**POST** `/bookings/:bookingId/cancel`

Cancel a booking and send cancellation email to user. Admin authentication required.

**Request Body:**
```json
{
  "reason": "Vehicle unavailable due to maintenance."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully. Cancellation email sent to customer.",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "status": "cancelled",
    "cancelled_reason": "Vehicle unavailable due to maintenance.",
    "cancelled_at": "2024-01-15T12:00:00.000Z"
  }
}
```

**Email Sent:** Cancellation email

### 10. Update Payment Status (Admin)
**PUT** `/bookings/:bookingId/payment`

Update payment status. Admin authentication required.

**Request Body:**
```json
{
  "payment_status": "completed",
  "payment_id": "pay_123456789",
  "transaction_id": "txn_987654321"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "payment_status": "completed",
    "payment_id": "pay_123456789",
    "transaction_id": "txn_987654321"
  }
}
```

### 11. Get Booking Statistics (Admin)
**GET** `/bookings/stats/statistics`

Get comprehensive booking statistics. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 150,
      "pending": 25,
      "confirmed": 50,
      "in_progress": 15,
      "completed": 45,
      "cancelled": 15,
      "total_revenue": 2500000
    },
    "monthlyStats": [
      {
        "_id": {
          "year": 2024,
          "month": 1
        },
        "count": 25,
        "revenue": 450000
      }
    ],
    "recentBookings": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "booking_id": "BK1703123456789ABCD",
        "status": "confirmed",
        "total_amount": 17700,
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 12. Get Upcoming Bookings (Admin)
**GET** `/bookings/upcoming`

Get upcoming bookings. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "booking_id": "BK1703123456789ABCD",
      "user_id": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+919876543210"
      },
      "car_id": {
        "car_name": "BMW X5",
        "brand": "BMW",
        "image_url": "https://example.com/bmw-x5.jpg"
      },
      "pickup_date": "2024-01-20T00:00:00.000Z",
      "status": "confirmed"
    }
  ]
}
```

### 13. Get Overdue Bookings (Admin)
**GET** `/bookings/overdue`

Get overdue bookings. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "booking_id": "BK1703123456789ABCD",
      "user_id": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+919876543210"
      },
      "car_id": {
        "car_name": "BMW X5",
        "brand": "BMW",
        "image_url": "https://example.com/bmw-x5.jpg"
      },
      "return_date": "2024-01-18T00:00:00.000Z",
      "status": "in_progress"
    }
  ]
}
```

### 14. Delete Booking (Admin)
**DELETE** `/bookings/:bookingId`

Delete a booking. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

## Booking Status Flow

1. **pending** → User creates booking
2. **confirmed** → Admin confirms booking (sends confirmation email)
3. **in_progress** → Vehicle handed over to customer
4. **completed** → Vehicle returned successfully
5. **cancelled** → Booking cancelled by admin (sends cancellation email)
6. **rejected** → Booking rejected by admin

## Payment Status

- **pending**: Payment not yet made
- **partial**: Partial payment received
- **completed**: Full payment received
- **failed**: Payment failed
- **refunded**: Payment refunded

## Email Templates

### 1. Admin Notification Email
**Subject:** `New Booking Request - BMW X5 | Luxora`

**Content:**
- Booking details (ID, vehicle, dates, locations)
- Customer information (name, email, phone)
- Rental details (pickup/return dates, total amount)
- Action buttons (Review Booking, View All Bookings)

### 2. User Confirmation Email
**Subject:** `Booking Confirmed - BMW X5 | Luxora`

**Content:**
- Confirmation message with booking details
- Vehicle information with image
- Pickup and return details
- Total amount breakdown
- Next steps and instructions
- Action buttons (View Booking Details, Contact Support)

### 3. Status Update Email
**Subject:** `Booking In Progress - BMW X5 | Luxora`

**Content:**
- Status update with color-coded indicators
- Booking information
- Admin message/notes
- Action buttons (View Booking Details, Contact Support)

### 4. Cancellation Email
**Subject:** `Booking Cancelled - BMW X5 | Luxora`

**Content:**
- Cancellation notification
- Cancellation reason
- Booking information
- Refund information (if applicable)
- Action buttons (Contact Support)

## Frontend Integration Examples

### React/JavaScript Example
```javascript
// Create booking
const createBooking = async (bookingData) => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Booking created successfully! Check your email for updates.');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Check car availability
const checkAvailability = async (carId, pickupDate, returnDate) => {
  try {
    const response = await fetch(`/api/availability?carId=${carId}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
    const result = await response.json();
    return result.data.is_available;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

// Get user bookings
const getUserBookings = async (token) => {
  try {
    const response = await fetch('/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### HTML Form Example
```html
<form id="bookingForm">
  <select name="car_id" required>
    <option value="">Select Car</option>
    <option value="64f8a1b2c3d4e5f6a7b8c9d0">BMW X5 - ₹3000/day</option>
  </select>
  
  <input type="date" name="pickup_date" required>
  <input type="date" name="return_date" required>
  
  <input type="text" name="pickup_location" placeholder="Pickup Location" required>
  <input type="text" name="return_location" placeholder="Return Location" required>
  
  <select name="payment_method" required>
    <option value="">Select Payment Method</option>
    <option value="credit_card">Credit Card</option>
    <option value="debit_card">Debit Card</option>
    <option value="upi">UPI</option>
    <option value="net_banking">Net Banking</option>
    <option value="cash">Cash</option>
    <option value="wallet">Wallet</option>
  </select>
  
  <button type="submit">Book Now</button>
</form>

<script>
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const bookingData = Object.fromEntries(formData);
  
  await createBooking(bookingData);
});
</script>
```

## Features Summary

### For Users
- ✅ Create car bookings with detailed information
- ✅ Check car availability for specific dates
- ✅ View booking history and status
- ✅ Receive email notifications for booking updates
- ✅ Track booking by custom booking ID

### For Admins
- ✅ View all bookings with advanced filtering and pagination
- ✅ Confirm bookings with automatic email notifications
- ✅ Update booking status with email updates
- ✅ Cancel bookings with reason and email notification
- ✅ Manage payment status
- ✅ View booking statistics and analytics
- ✅ Track upcoming and overdue bookings
- ✅ Delete unwanted bookings

### Technical Features
- ✅ Comprehensive validation with detailed error messages
- ✅ Automatic pricing calculation with tax
- ✅ Car availability checking
- ✅ Email notifications using Nodemailer
- ✅ Custom booking ID generation
- ✅ Virtual properties for calculated fields
- ✅ Database indexing for optimal performance
- ✅ Pagination and advanced filtering
- ✅ Search functionality
- ✅ Booking statistics and analytics
