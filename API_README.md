## Luxora Backend API Reference

This document lists all available APIs, how they work, and sample requests/responses. All admin-facing endpoints require an admin token.

## Summary (All Endpoints)

- Users: register, login, profile (get/update), change-password, refresh-token
- Admin: users list/get, role update, activate/deactivate/delete, overview stats
- Clients: add/update/delete/get/list
- Drivers: add/update/delete/get/list
- Vehicles: add/update/delete/get/list
- Calendar/Bookings: add/update/delete/get/list
  - Overview (range), Export CSV (range)
  - Rent status update/list
  - Assign/unassign driver/vehicle
  - Availability: drivers/vehicles by time range
- Expenses: add/update/delete/list
- Messages: send/list/delete
- Payments: add/update/get/list

## Base URL and Auth

- **Base URL (local)**: `http://localhost:5000`
- **Auth**: JWT Bearer token in header
  - Header: `Authorization: Bearer <JWT>`
- **Admin-protected**: Endpoints marked with admin require a token with `role: 'admin'`.

## Conventions

- **Success envelope**: `{ success: boolean, message?: string, data?: any }`
- **Pagination**: `page` (default 1), `limit` (defaults vary)
- **IDs**: MongoDB ObjectId strings

## Authentication (Users)

### Register
- POST `/api/users/register`
- Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "9876543210"
}
```

### Login
- POST `/api/users/login`
- Body:
```json
{ "email": "john@example.com", "password": "secret123" }
```
- Response (example):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "66e1...", "firstName": "John", "role": "admin", "email": "john@example.com", "phone": "9876543210", "isActive": true },
    "token": "<JWT>",
    "refreshToken": "<JWT_REFRESH>"
  }
}
```

### Refresh Token
- POST `/api/users/refresh-token`
- Body:
```json
{ "refreshToken": "<JWT_REFRESH>" }
```
- Response:
```json
{
  "success": true,
  "data": { "token": "<NEW_JWT>", "refreshToken": "<NEW_JWT_REFRESH>" }
}
```

## Admin

All endpoints require admin token.

- GET `/api/admin/users` list users
- GET `/api/admin/users/:userId` get user by id
- PUT `/api/admin/users/:userId/role` update role
  - Body: `{ "role": "admin" }` or `{ "role": "user" }`
- PUT `/api/admin/users/:userId/activate`
- PUT `/api/admin/users/:userId/deactivate`
- DELETE `/api/admin/users/:userId`
- GET `/api/admin/stats/overview` platform overview

## Clients (Admin)

- POST `/api/clients` add
```json
{ "firstName": "Alice", "lastName": "Smith", "phone": "9998887777", "email": "alice@ex.com", "address": "221B Baker St" }
```
- PUT `/api/clients/:clientId` update
```json
{ "phone": "9990001111", "notes": "VIP" }
```
- DELETE `/api/clients/:clientId`
- GET `/api/clients/:clientId`
- GET `/api/clients?search=ali&isActive=true&page=1&limit=20`

## Drivers (Admin)

- POST `/api/drivers` add
```json
{ "firstName": "Bob", "lastName": "Driver", "phone": "9000011111", "licenseNumber": "GJ-1234-5678" }
```
- PUT `/api/drivers/:driverId` update
- DELETE `/api/drivers/:driverId`
- GET `/api/drivers/:driverId`
- GET `/api/drivers?search=bo&page=1&limit=20`

## Calendar / Bookings (Admin)

- POST `/api/calendar/bookings` add booking
```json
{
  "title": "Airport Drop",
  "description": "Morning ride",
  "start": "2025-08-01T07:30:00.000Z",
  "end": "2025-08-01T09:00:00.000Z",
  "client": "66e1000aa0bbccddeeff0011",
  "driver": "66e1000aa0bbccddeeff0022",
  "vehicle": "Sedan",
  "pickupLocation": "Hotel Luxora",
  "dropoffLocation": "Airport",
  "amount": 1200
}
```
- PUT `/api/calendar/bookings/:bookingId` update
- DELETE `/api/calendar/bookings/:bookingId`
- GET `/api/calendar/bookings/:bookingId`
- GET `/api/calendar/bookings?start=2025-08-01T00:00:00.000Z&end=2025-08-31T23:59:59.999Z&client=66e1...&driver=66e2...&status=scheduled&rentStatus=unpaid&page=1&limit=50`

### Booking Overview (Admin)
- GET `/api/calendar/overview?start=2025-08-01T00:00:00.000Z&end=2025-08-31T23:59:59.999Z`
- GET `/api/calendar/overview/export?start=2025-08-01T00:00:00.000Z&end=2025-08-31T23:59:59.999Z` returns CSV

### Rent Status (Admin)
- PUT `/api/calendar/bookings/:bookingId/rent-status`
```json
{ "rentStatus": "partially_paid" }
```
- GET `/api/calendar/bookings/rent-status?start=2025-08-01T00:00:00.000Z&end=2025-08-31T23:59:59.999Z`

### Assignments (Admin)
- POST `/api/calendar/bookings/:bookingId/assign-driver`
```json
{ "driverId": "66e1000aa0bbccddeeff0022" }
```
- POST `/api/calendar/bookings/:bookingId/unassign-driver`
- POST `/api/calendar/bookings/:bookingId/assign-vehicle`
```json
{ "vehicleId": "66e3000aa0bbccddeeff0044" }
```
- POST `/api/calendar/bookings/:bookingId/unassign-vehicle`

### Availability (Admin)
- GET `/api/calendar/availability/drivers?start=2025-08-10T08:00:00.000Z&end=2025-08-10T12:00:00.000Z`
- GET `/api/calendar/availability/vehicles?start=2025-08-10T08:00:00.000Z&end=2025-08-10T12:00:00.000Z`

## Expenses (Admin)

- POST `/api/expenses`
```json
{ "title": "Fuel", "amount": 3500, "category": "fuel", "date": "2025-08-01", "notes": "Trip A" }
```
- PUT `/api/expenses/:expenseId`
```json
{ "amount": 3600, "notes": "Adjusted" }
```
- DELETE `/api/expenses/:expenseId`
- GET `/api/expenses?start=2025-08-01&end=2025-08-31&category=fuel&page=1&limit=50`

## Messages (Admin)

- POST `/api/messages` send message
```json
{ "toType": "Client", "to": "66e1000aa0bbccddeeff0011", "subject": "Reminder", "body": "Your ride is tomorrow 7:30 AM.", "channel": "in_app" }
```
- GET `/api/messages?toType=Client&to=66e1000aa0bbccddeeff0011&page=1&limit=50`
- DELETE `/api/messages/:messageId`

## Payments (Admin)

- POST `/api/payments`
```json
{ "booking": "66e2000aa0bbccddeeff0033", "amount": 600, "method": "upi", "status": "completed", "transactionId": "TXN-12345" }
```
- PUT `/api/payments/:paymentId`
```json
{ "status": "refunded" }
```
- GET `/api/payments/:paymentId`
- GET `/api/payments?booking=66e2000aa0bbccddeeff0033&status=completed&method=upi&page=1&limit=50`

## Vehicles (Admin)

- POST `/api/vehicles`
```json
{ "name": "Toyota Innova", "plateNumber": "GJ01AB1234", "type": "SUV", "color": "White", "capacity": 6 }
```
- PUT `/api/vehicles/:vehicleId`
```json
{ "serviceStatus": "maintenance", "isActive": true }
```
- DELETE `/api/vehicles/:vehicleId`
- GET `/api/vehicles/:vehicleId`
- GET `/api/vehicles?search=innova&isActive=true&serviceStatus=ok&page=1&limit=20`

## Users (Authenticated)

- GET `/api/users/profile`
- PUT `/api/users/profile`
```json
{ "firstName": "John", "lastName": "Doe", "phone": "9876543210" }
```
- PUT `/api/users/change-password`
```json
{ "currentPassword": "secret123", "newPassword": "newSecret456" }
```

## Quick Test JSON Seed (example payloads)

Use these snippets to quickly test create flows:

```json
// Client
{ "firstName": "Alice", "lastName": "Smith", "phone": "9998887777", "email": "alice@ex.com" }

// Driver
{ "firstName": "Bob", "lastName": "Driver", "phone": "9000011111", "licenseNumber": "GJ-1234-5678" }

// Vehicle
{ "name": "Toyota Innova", "plateNumber": "GJ01AB1234", "type": "SUV", "color": "White", "capacity": 6 }

// Booking (after creating client/driver)
{ "title": "Airport Drop", "start": "2025-08-01T07:30:00.000Z", "end": "2025-08-01T09:00:00.000Z", "client": "<clientId>", "driver": "<driverId>", "amount": 1200 }

// Expense
{ "title": "Fuel", "amount": 3500, "category": "fuel", "date": "2025-08-01", "notes": "Trip A" }

// Message to client
{ "toType": "Client", "to": "<clientId>", "subject": "Reminder", "body": "Your ride is tomorrow 7:30 AM.", "channel": "in_app" }

// Payment
{ "booking": "<bookingId>", "amount": 600, "method": "upi", "status": "completed", "transactionId": "TXN-12345" }
```

## Sample cURL

```bash
curl -X GET "http://localhost:5000/api/clients?page=1&limit=10" \
  -H "Authorization: Bearer <JWT>"
```

```bash
curl -X POST "http://localhost:5000/api/calendar/bookings" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Airport Drop",
    "start": "2025-08-01T07:30:00.000Z",
    "end": "2025-08-01T09:00:00.000Z",
    "client": "66e1000aa0bbccddeeff0011",
    "driver": "66e1000aa0bbccddeeff0022",
    "amount": 1200
  }'
```

## Notes

- CSV export requires `json2csv`. Install dependency if not already: `npm i json2csv`.
- Time values should be ISO-8601 strings (e.g., `2025-08-01T07:30:00.000Z`).
- For `Messages`, use `toType` as `Client` or `Driver` (capitalized) matching model names.


