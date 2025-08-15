# Contact API Documentation

This document provides comprehensive information about the Contact API endpoints for the Luxora backend. The contact system allows users to submit contact forms and admins to manage and respond to these submissions.

## Base URL
```
http://localhost:3000/api
```

## Authentication
- **Public endpoints**: No authentication required
- **Protected endpoints**: Require Bearer token in Authorization header
- **Admin endpoints**: Require admin authentication

## API Endpoints

### 1. Submit Contact Form (Public)
**POST** `/contact`

Submit a new contact form. This endpoint is public and doesn't require authentication.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "subject": "Car Rental Inquiry",
  "message": "I would like to know more about your luxury car rental services.",
  "contact_type": "general"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully. We will get back to you soon!",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Car Rental Inquiry",
    "status": "pending",
    "submitted_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Contacts (Admin)
**GET** `/contact`

Get all contact submissions with filtering and pagination. Admin authentication required.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `status` (string): Filter by status (pending, in_progress, resolved, closed)
- `contact_type` (string): Filter by contact type
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `email` (string): Filter by email
- `search` (string): Search in name, subject, message, email
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (asc, desc, default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "subject": "Car Rental Inquiry",
      "message": "I would like to know more about your luxury car rental services.",
      "contact_type": "general",
      "priority": "medium",
      "status": "pending",
      "admin_response": null,
      "user_id": null,
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "attachments": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
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

### 3. Get Contact by ID (Admin)
**GET** `/contact/:contactId`

Get a specific contact submission by ID. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "subject": "Car Rental Inquiry",
    "message": "I would like to know more about your luxury car rental services.",
    "contact_type": "general",
    "priority": "medium",
    "status": "pending",
    "admin_response": {
      "message": "Thank you for your inquiry. We'll get back to you within 24 hours.",
      "responded_by": "64f8a1b2c3d4e5f6a7b8c9d1",
      "responded_at": "2024-01-15T11:00:00.000Z"
    },
    "user_id": null,
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "attachments": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "response_time_hours": 0,
    "is_responded": true
  }
}
```

### 4. Update Contact Status (Admin)
**PUT** `/contact/:contactId/status`

Update the status of a contact submission. Admin authentication required.

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contact status updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "in_progress",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 5. Respond to Contact (Admin)
**POST** `/contact/:contactId/respond`

Send a response to a contact submission. This will automatically update the status to "resolved" and send an email to the user. Admin authentication required.

**Request Body:**
```json
{
  "message": "Thank you for your inquiry. We have a wide selection of luxury vehicles available for rent. Please visit our website or call us for more details."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Response sent successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "resolved",
    "admin_response": {
      "message": "Thank you for your inquiry. We have a wide selection of luxury vehicles available for rent. Please visit our website or call us for more details.",
      "responded_by": "64f8a1b2c3d4e5f6a7b8c9d1",
      "responded_at": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

### 6. Delete Contact (Admin)
**DELETE** `/contact/:contactId`

Delete a contact submission. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

### 7. Get Contact Statistics (Admin)
**GET** `/contact/stats`

Get comprehensive statistics about contact submissions. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 150,
      "pending": 25,
      "in_progress": 15,
      "resolved": 100,
      "closed": 10
    },
    "byType": [
      {
        "_id": "general",
        "count": 50
      },
      {
        "_id": "support",
        "count": 30
      },
      {
        "_id": "booking",
        "count": 40
      }
    ],
    "byPriority": [
      {
        "_id": "low",
        "count": 20
      },
      {
        "_id": "medium",
        "count": 80
      },
      {
        "_id": "high",
        "count": 40
      },
      {
        "_id": "urgent",
        "count": 10
      }
    ],
    "recentContacts": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "subject": "Car Rental Inquiry",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 8. Get Urgent Contacts (Admin)
**GET** `/contact/urgent`

Get contacts with urgent priority or high priority that are still pending. Admin authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "subject": "Urgent Booking Request",
      "priority": "urgent",
      "status": "pending",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

### 9. Get My Contacts (User)
**GET** `/contact/my-contacts`

Get all contact submissions made by the authenticated user. User authentication required.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subject": "Car Rental Inquiry",
      "status": "resolved",
      "admin_response": {
        "message": "Thank you for your inquiry...",
        "responded_at": "2024-01-15T11:00:00.000Z"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 10. Get Contacts by Email (Public)
**GET** `/contact/email/:email`

Get all contact submissions for a specific email address. This is useful for tracking previous communications.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subject": "Car Rental Inquiry",
      "status": "resolved",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 11. Bulk Update Contact Status (Admin)
**POST** `/contact/bulk-update`

Update the status of multiple contacts at once. Admin authentication required.

**Request Body:**
```json
{
  "contactIds": [
    "64f8a1b2c3d4e5f6a7b8c9d0",
    "64f8a1b2c3d4e5f6a7b8c9d1",
    "64f8a1b2c3d4e5f6a7b8c9d2"
  ],
  "status": "resolved"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "3 contacts updated successfully",
  "data": {
    "modifiedCount": 3
  }
}
```

## Contact Types
- `general`: General inquiries
- `support`: Technical support
- `booking`: Booking-related questions
- `complaint`: Complaints
- `feedback`: Feedback and suggestions
- `partnership`: Partnership inquiries
- `other`: Other types

## Contact Status
- `pending`: New submission, not yet reviewed
- `in_progress`: Being handled by admin
- `resolved`: Issue resolved, response sent
- `closed`: Contact closed

## Priority Levels
- `low`: Low priority
- `medium`: Medium priority (default)
- `high`: High priority
- `urgent`: Urgent priority

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Name must be at least 2 characters long",
    "Please enter a valid email address"
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Contact not found",
  "error": "Contact not found"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to submit contact form",
  "error": "Database connection error"
}
```

## Frontend Integration Examples

### React/JavaScript Example
```javascript
// Submit contact form
const submitContact = async (contactData) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Contact form submitted successfully!');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get admin contacts (with authentication)
const getAdminContacts = async (token, filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/contact?${queryParams}`, {
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
<form id="contactForm">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="tel" name="phone" placeholder="Your Phone">
  <input type="text" name="subject" placeholder="Subject" required>
  <select name="contact_type">
    <option value="general">General Inquiry</option>
    <option value="support">Support</option>
    <option value="booking">Booking</option>
    <option value="complaint">Complaint</option>
    <option value="feedback">Feedback</option>
    <option value="partnership">Partnership</option>
    <option value="other">Other</option>
  </select>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const contactData = Object.fromEntries(formData);
  
  await submitContact(contactData);
});
</script>
```

## Features Summary

### For Users (Frontend)
- ✅ Submit contact forms without authentication
- ✅ Track previous submissions by email
- ✅ View own contact history (if authenticated)
- ✅ Receive email notifications when admin responds

### For Admins (Admin Panel)
- ✅ View all contact submissions with filtering and pagination
- ✅ Update contact status (pending → in_progress → resolved → closed)
- ✅ Respond to contacts with automatic email notifications
- ✅ View contact statistics and analytics
- ✅ Bulk update contact statuses
- ✅ Prioritize urgent contacts
- ✅ Delete unwanted submissions
- ✅ Track response times and user history

### Technical Features
- ✅ Comprehensive validation with detailed error messages
- ✅ Automatic priority assignment based on contact type
- ✅ Email notifications for admins and users
- ✅ IP address and user agent tracking for security
- ✅ Support for file attachments
- ✅ Virtual properties for response time and status
- ✅ Database indexing for optimal performance
- ✅ Pagination and advanced filtering
- ✅ Search functionality across multiple fields
