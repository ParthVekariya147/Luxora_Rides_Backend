# Contact API Documentation

This documentation explains how to use the Contact API for both users and admins in the Luxora Car Rental Service.

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Submit Contact Form
- **URL**: `POST /api/contact`
- **Description**: Submit a contact form
- **Body**:
  ```json
  {
    "name": "string (required)",
    "email": "string (required, valid email)",
    "phone": "string (optional)",
    "subject": "string (required)",
    "message": "string (required)",
    "contact_type": "string (optional, one of: general, support, booking, complaint, feedback, partnership, other)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Contact form submitted successfully. We will get back to you soon!",
    "data": {
      "id": "contact_id",
      "name": "user_name",
      "email": "user_email",
      "subject": "contact_subject",
      "status": "pending",
      "submitted_at": "timestamp"
    }
  }
  ```

#### Get Contacts by Email
- **URL**: `GET /api/contact/email/:email`
- **Description**: Get all contacts submitted with a specific email address
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "contact_object"
      }
    ]
  }
  ```

### User Endpoints (Authentication Required)

#### Get My Contacts
- **URL**: `GET /api/contact/my-contacts`
- **Description**: Get all contacts submitted by the authenticated user
- **Headers**: 
  ```
  Authorization: Bearer <user_token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "contact_object"
      }
    ]
  }
  ```

### Admin Endpoints (Admin Authentication Required)

#### Get All Contacts
- **URL**: `GET /api/contact`
- **Description**: Get all contacts with filtering and pagination
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 100)
  - `status`: Filter by status (pending, in_progress, resolved, closed)
  - `contact_type`: Filter by contact type
  - `priority`: Filter by priority
  - `email`: Filter by email
  - `search`: Search in name, subject, message, or email
  - `sortBy`: Sort field (createdAt, updatedAt, name, email, subject, status, priority)
  - `sortOrder`: Sort order (asc, desc)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "contact_object"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
  ```

#### Get Urgent Contacts
- **URL**: `GET /api/contact/urgent`
- **Description**: Get urgent contacts (priority: urgent or status: pending with priority: high)
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "contact_object"
      }
    ]
  }
  ```

#### Get Contact Statistics
- **URL**: `GET /api/contact/stats`
- **Description**: Get contact statistics
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "overview": {
        "total": 100,
        "pending": 20,
        "in_progress": 15,
        "resolved": 60,
        "closed": 5
      },
      "byType": [
        {
          "_id": "general",
          "count": 50
        }
      ],
      "byPriority": [
        {
          "_id": "medium",
          "count": 60
        }
      ],
      "recentContacts": [
        {
          "contact_object"
        }
      ]
    }
  }
  ```

#### Get Contact by ID
- **URL**: `GET /api/contact/:contactId`
- **Description**: Get a specific contact by ID
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "contact_object"
    }
  }
  ```

#### Update Contact Status
- **URL**: `PUT /api/contact/:contactId/status`
- **Description**: Update contact status
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Body**:
  ```json
  {
    "status": "string (one of: pending, in_progress, resolved, closed)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Contact status updated successfully",
    "data": {
      "contact_object"
    }
  }
  ```

#### Respond to Contact
- **URL**: `POST /api/contact/:contactId/respond`
- **Description**: Send a response to a contact
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Body**:
  ```json
  {
    "message": "string (response message)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Response sent successfully",
    "data": {
      "contact_object"
    }
  }
  ```

#### Delete Contact
- **URL**: `DELETE /api/contact/:contactId`
- **Description**: Delete a contact
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Contact deleted successfully"
  }
  ```

#### Bulk Update Contact Statuses
- **URL**: `POST /api/contact/bulk-update`
- **Description**: Update status for multiple contacts
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Body**:
  ```json
  {
    "contactIds": ["contact_id_1", "contact_id_2"],
    "status": "string (one of: pending, in_progress, resolved, closed)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "2 contacts updated successfully",
    "data": {
      "modifiedCount": 2
    }
  }
  ```

## Contact Object Structure

```json
{
  "_id": "contact_id",
  "name": "string",
  "email": "string",
  "phone": "string",
  "subject": "string",
  "message": "string",
  "contact_type": "string",
  "priority": "string",
  "status": "string",
  "admin_response": {
    "message": "string",
    "responded_by": "admin_id",
    "responded_at": "timestamp"
  },
  "user_id": "user_id",
  "ip_address": "string",
  "user_agent": "string",
  "attachments": [
    {
      "filename": "string",
      "file_url": "string",
      "file_size": "number",
      "mime_type": "string"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
