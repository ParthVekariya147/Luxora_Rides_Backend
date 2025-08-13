# Luxora Backend - User Authentication API

A complete Node.js backend with user registration, login, and authentication system built with Express.js, MongoDB, and JWT.

## Features

- ✅ User registration with email verification
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with Joi
- ✅ JWT token generation and verification
- ✅ Email notifications (welcome emails)
- ✅ OTP-based password reset functionality
- ✅ User profile management
- ✅ Password change functionality
- ✅ Admin user management
- ✅ Rate limiting and security middleware
- ✅ Error handling middleware
- ✅ MongoDB integration with Mongoose

## Project Structure

```
luxora_backend/
├── config/
│   └── db.js                 # Database configuration
├── modules/user/
│   ├── user.controller.js     # HTTP request handlers
│   ├── user.model.js         # MongoDB user schema
│   ├── user.routes.js        # User API routes
│   ├── user.service.js       # Business logic
│   └── user.validation.js    # Input validation schemas
├── middlewares/
│   ├── auth.middleware.js    # JWT authentication middleware
│   └── error.middleware.js   # Error handling middleware
├── utils/
│   ├── generateToken.js      # JWT token utilities
│   └── sendEmail.js          # Email sending utilities
├── routes/
│   └── index.js              # Main routes file
├── app.js                    # Express application setup
├── server.js                 # Server entry point
└── package.json              # Dependencies and scripts
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxora_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/luxora_backend

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

   # Email Configuration (for Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Public Routes (No Authentication Required)

#### 1. User Registration
- **POST** `/api/users/register`
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "role": "user",
        "isEmailVerified": false,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
  ```

#### 2. User Login
- **POST** `/api/users/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "role": "user",
        "isEmailVerified": false,
        "isActive": true,
        "lastLogin": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
  ```

### Protected Routes (Authentication Required)

#### 3. Get User Profile
- **GET** `/api/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user",
      "isEmailVerified": false,
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### 4. Update User Profile
- **PUT** `/api/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "9876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "_id": "user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "user",
      "isEmailVerified": false,
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### 5. Change Password
- **PUT** `/api/users/change-password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

### Admin Routes (Admin Role Required)

#### 6. Get All Users
- **GET** `/api/users/all`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "user_id_1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "role": "user",
        "isEmailVerified": false,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### 7. Deactivate User
- **PUT** `/api/users/deactivate/:userId`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deactivated successfully"
  }
  ```

#### 8. Activate User
- **PUT** `/api/users/activate/:userId`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User activated successfully"
  }
  ```

### Password Reset Routes (No Authentication Required)

#### 6. Forgot Password - Send OTP
- **POST** `/api/users/forgot-password`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to your email"
  }
  ```

#### 7. Verify OTP
- **POST** `/api/users/verify-otp`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": {
      "resetToken": "base64_encoded_reset_token"
    }
  }
  ```

#### 8. Reset Password with Reset Token
- **POST** `/api/users/reset-password`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "resetToken": "base64_encoded_reset_token",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

#### 9. Resend OTP
- **POST** `/api/users/resend-otp`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "New OTP sent successfully to your email"
  }
  ```

### Health Check
- **GET** `/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Input Validation:** All inputs are validated using Joi schemas
- **Rate Limiting:** API rate limiting to prevent abuse
- **CORS Protection:** Configured CORS for frontend integration
- **Helmet Security:** Security headers for Express.js
- **Error Handling:** Centralized error handling with proper logging

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **joi** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **nodemailer** - Email sending
- **dotenv** - Environment variables

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 