# Admin Authentication APIs

This document describes the admin authentication endpoints for the Luxora Car Rental Service.

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. Admin Login
**POST** `/login`

Authenticates an admin user and returns a JWT token.

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "admin@example.com",
    "phone": "1234567890",
    "role": "admin",
    "isEmailVerified": true,
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 2. Admin Register
**POST** `/register`

Registers a new admin user.

#### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "securepassword123",
  "phone": "9876543210"
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "9876543210",
    "role": "admin",
    "isEmailVerified": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "Admin with this email already exists"
}
```

## Validation Rules

### Login Validation
- `email`: Required, must be a valid email format
- `password`: Required, minimum 6 characters

### Register Validation
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `email`: Required, must be a valid email format
- `password`: Required, minimum 6 characters
- `phone`: Required, must be exactly 10 digits

## Usage Examples

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "securepassword123",
    "phone": "9876543210"
  }'
```

### Using JavaScript/Fetch

#### Login
```javascript
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
console.log(loginData);
```

#### Register
```javascript
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'securepassword123',
    phone: '9876543210'
  })
});

const registerData = await registerResponse.json();
console.log(registerData);
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Tokens**: Secure JWT tokens with 7-day expiration
3. **Input Validation**: Comprehensive validation using Joi
4. **Role-based Access**: Only users with admin role can access these endpoints
5. **Account Status**: Checks for active/inactive account status

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Successful login
- `201`: Successful registration
- `400`: Bad request (validation errors, invalid credentials)
- `401`: Unauthorized (invalid token)
- `500`: Internal server error

## Notes

- Admin accounts are automatically marked as email verified
- Admin accounts are automatically set as active
- The JWT token should be included in subsequent requests as a Bearer token in the Authorization header
- All admin endpoints (except auth) require the JWT token for access
