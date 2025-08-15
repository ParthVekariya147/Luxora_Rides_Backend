# Car API Documentation

This document provides comprehensive documentation for all car-related APIs in the Luxora backend system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Create Car
**POST** `/cars`

Creates a new car with detailed specifications.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "car_name": "BMW XM",
  "brand": "BMW",
  "year_model": 2025,
  "price_per_day": 32000.00,
  "currency": "INR",
  "ratings": 145,
  "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
  "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
  "technical_specifications": {
    "engine_type": "Plug-in Hybrid",
    "engine_details": "4.4L TwinPower Turbo V8 + Electric Motor",
    "combined_horsepower": 653,
    "combined_torque_nm": 800,
    "transmission": "8-Speed M Steptronic",
    "top_speed_kmh": 250,
    "acceleration_0_100_kmh_seconds": 4.3,
    "drivetrain": "All-wheel drive (AWD)",
    "fuel_economy_l_per_100km": 1.6,
    "electric_range_km": 88
  },
  "dimensions": {
    "length_mm": 5110,
    "width_mm": 2005,
    "height_mm": 1755,
    "seating_capacity": 5,
    "cargo_space_liters": 527
  },
  "features": {
    "infotainment": "BMW iDrive 8.5 with GPS Navigation",
    "seating": "M Lounge Seating, Leather Upholstery",
    "sunroof": "Panoramic",
    "ambient_lighting": true,
    "head_up_display": true,
    "color_options": [
      "Sophisto Grey Metallic",
      "Black Sapphire Metallic",
      "Marina Bay Blue Metallic"
    ],
    "headlights": "Adaptive LED"
  },
  "safety_and_assistance": {
    "airbags_count": 8,
    "driver_assistance_systems": {
      "adaptive_cruise_control": true,
      "lane_keep_assist": true,
      "blind_spot_monitoring": true,
      "parking_assistant_plus": true
    },
    "ncap_rating": "Not yet rated"
  },
  "rental_details": {
    "security_deposit_inr": 50000,
    "kilometers_included_per_day": 200,
    "extra_km_charge_per_unit_inr": 25,
    "insurance_included": true
  },
  "status": "available",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "pickup_location": "Mumbai Airport"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Car created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "car_name": "BMW XM",
    "brand": "BMW",
    "year_model": 2025,
    "price_per_day": 32000,
    "currency": "INR",
    "ratings": 145,
    "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
    "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
    "technical_specifications": {
      "engine_type": "Plug-in Hybrid",
      "engine_details": "4.4L TwinPower Turbo V8 + Electric Motor",
      "combined_horsepower": 653,
      "combined_torque_nm": 800,
      "transmission": "8-Speed M Steptronic",
      "top_speed_kmh": 250,
      "acceleration_0_100_kmh_seconds": 4.3,
      "drivetrain": "All-wheel drive (AWD)",
      "fuel_economy_l_per_100km": 1.6,
      "electric_range_km": 88
    },
    "dimensions": {
      "length_mm": 5110,
      "width_mm": 2005,
      "height_mm": 1755,
      "seating_capacity": 5,
      "cargo_space_liters": 527
    },
    "features": {
      "infotainment": "BMW iDrive 8.5 with GPS Navigation",
      "seating": "M Lounge Seating, Leather Upholstery",
      "sunroof": "Panoramic",
      "ambient_lighting": true,
      "head_up_display": true,
      "color_options": [
        "Sophisto Grey Metallic",
        "Black Sapphire Metallic",
        "Marina Bay Blue Metallic"
      ],
      "headlights": "Adaptive LED"
    },
    "safety_and_assistance": {
      "airbags_count": 8,
      "driver_assistance_systems": {
        "adaptive_cruise_control": true,
        "lane_keep_assist": true,
        "blind_spot_monitoring": true,
        "parking_assistant_plus": true
      },
      "ncap_rating": "Not yet rated"
    },
    "rental_details": {
      "security_deposit_inr": 50000,
      "kilometers_included_per_day": 200,
      "extra_km_charge_per_unit_inr": 25,
      "insurance_included": true
    },
    "status": "available",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "pickup_location": "Mumbai Airport"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get Car by ID
**GET** `/cars/:carId`

Retrieves a specific car by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "car_name": "BMW XM",
    "brand": "BMW",
    "year_model": 2025,
    "price_per_day": 32000,
    "currency": "INR",
    "ratings": 145,
    "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
    "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
    "technical_specifications": {
      "engine_type": "Plug-in Hybrid",
      "engine_details": "4.4L TwinPower Turbo V8 + Electric Motor",
      "combined_horsepower": 653,
      "combined_torque_nm": 800,
      "transmission": "8-Speed M Steptronic",
      "top_speed_kmh": 250,
      "acceleration_0_100_kmh_seconds": 4.3,
      "drivetrain": "All-wheel drive (AWD)",
      "fuel_economy_l_per_100km": 1.6,
      "electric_range_km": 88
    },
    "dimensions": {
      "length_mm": 5110,
      "width_mm": 2005,
      "height_mm": 1755,
      "seating_capacity": 5,
      "cargo_space_liters": 527
    },
    "features": {
      "infotainment": "BMW iDrive 8.5 with GPS Navigation",
      "seating": "M Lounge Seating, Leather Upholstery",
      "sunroof": "Panoramic",
      "ambient_lighting": true,
      "head_up_display": true,
      "color_options": [
        "Sophisto Grey Metallic",
        "Black Sapphire Metallic",
        "Marina Bay Blue Metallic"
      ],
      "headlights": "Adaptive LED"
    },
    "safety_and_assistance": {
      "airbags_count": 8,
      "driver_assistance_systems": {
        "adaptive_cruise_control": true,
        "lane_keep_assist": true,
        "blind_spot_monitoring": true,
        "parking_assistant_plus": true
      },
      "ncap_rating": "Not yet rated"
    },
    "rental_details": {
      "security_deposit_inr": 50000,
      "kilometers_included_per_day": 200,
      "extra_km_charge_per_unit_inr": 25,
      "insurance_included": true
    },
    "status": "available",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "pickup_location": "Mumbai Airport"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Update Car
**PUT** `/cars/:carId`

Updates an existing car. Only include the fields you want to update.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price_per_day": 35000.00,
  "status": "maintenance",
  "description": "Updated description for the BMW XM..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Car updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "car_name": "BMW XM",
    "brand": "BMW",
    "year_model": 2025,
    "price_per_day": 35000,
    "currency": "INR",
    "ratings": 145,
    "description": "Updated description for the BMW XM...",
    "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
    "technical_specifications": {
      "engine_type": "Plug-in Hybrid",
      "engine_details": "4.4L TwinPower Turbo V8 + Electric Motor",
      "combined_horsepower": 653,
      "combined_torque_nm": 800,
      "transmission": "8-Speed M Steptronic",
      "top_speed_kmh": 250,
      "acceleration_0_100_kmh_seconds": 4.3,
      "drivetrain": "All-wheel drive (AWD)",
      "fuel_economy_l_per_100km": 1.6,
      "electric_range_km": 88
    },
    "dimensions": {
      "length_mm": 5110,
      "width_mm": 2005,
      "height_mm": 1755,
      "seating_capacity": 5,
      "cargo_space_liters": 527
    },
    "features": {
      "infotainment": "BMW iDrive 8.5 with GPS Navigation",
      "seating": "M Lounge Seating, Leather Upholstery",
      "sunroof": "Panoramic",
      "ambient_lighting": true,
      "head_up_display": true,
      "color_options": [
        "Sophisto Grey Metallic",
        "Black Sapphire Metallic",
        "Marina Bay Blue Metallic"
      ],
      "headlights": "Adaptive LED"
    },
    "safety_and_assistance": {
      "airbags_count": 8,
      "driver_assistance_systems": {
        "adaptive_cruise_control": true,
        "lane_keep_assist": true,
        "blind_spot_monitoring": true,
        "parking_assistant_plus": true
      },
      "ncap_rating": "Not yet rated"
    },
    "rental_details": {
      "security_deposit_inr": 50000,
      "kilometers_included_per_day": 200,
      "extra_km_charge_per_unit_inr": 25,
      "insurance_included": true
    },
    "status": "maintenance",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "pickup_location": "Mumbai Airport"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### 4. Delete Car
**DELETE** `/cars/:carId`

Deletes a car from the system.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Car deleted successfully"
}
```

### 5. List All Cars
**GET** `/cars`

Retrieves a paginated list of all cars with optional filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `brand` (string): Filter by brand
- `year_model` (number): Filter by year
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter
- `engine_type` (string): Filter by engine type
- `seating_capacity` (number): Filter by seating capacity
- `status` (string): Filter by status
- `sort_by` (string): Sort field (default: createdAt)
- `sort_order` (string): Sort order - asc/desc (default: desc)
- `search` (string): Search in car name, brand, or description

**Example Request:**
```
GET /cars?page=1&limit=5&brand=BMW&min_price=20000&max_price=50000&sort_by=price_per_day&sort_order=asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cars": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "car_name": "BMW XM",
        "brand": "BMW",
        "year_model": 2025,
        "price_per_day": 32000,
        "currency": "INR",
        "ratings": 145,
        "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
        "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
        "status": "available",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 25,
      "items_per_page": 5
    }
  }
}
```

### 6. Get Available Cars
**GET** `/cars/available`

Retrieves all cars that are currently available for rent.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW XM",
      "brand": "BMW",
      "year_model": 2025,
      "price_per_day": 32000,
      "currency": "INR",
      "ratings": 145,
      "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
      "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 7. Get Featured Cars
**GET** `/cars/featured`

Retrieves featured cars (high-rated or premium cars).

**Query Parameters:**
- `limit` (number): Number of featured cars to return (default: 6)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW XM",
      "brand": "BMW",
      "year_model": 2025,
      "price_per_day": 32000,
      "currency": "INR",
      "ratings": 145,
      "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
      "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 8. Search Cars
**GET** `/cars/search`

Advanced search functionality with multiple filters.

**Query Parameters:**
- `query` (string): Text search in car name, brand, or description
- `brand` (string): Filter by brand
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter
- `engine_type` (string): Filter by engine type
- `seating_capacity` (number): Filter by seating capacity
- `features` (array): Filter by features
- `sort_by` (string): Sort field (default: price_per_day)
- `sort_order` (string): Sort order - asc/desc (default: asc)

**Example Request:**
```
GET /cars/search?query=BMW&min_price=20000&max_price=50000&seating_capacity=5&sort_by=price_per_day&sort_order=asc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW XM",
      "brand": "BMW",
      "year_model": 2025,
      "price_per_day": 32000,
      "currency": "INR",
      "ratings": 145,
      "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
      "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 9. Get Cars by Price Range
**GET** `/cars/price-range`

Retrieves cars within a specific price range.

**Query Parameters:**
- `minPrice` (number): Minimum price (required)
- `maxPrice` (number): Maximum price (required)

**Example Request:**
```
GET /cars/price-range?minPrice=20000&maxPrice=50000
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW XM",
      "brand": "BMW",
      "year_model": 2025,
      "price_per_day": 32000,
      "currency": "INR",
      "ratings": 145,
      "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
      "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 10. Get Cars by Brand
**GET** `/cars/brand/:brand`

Retrieves all cars of a specific brand.

**Example Request:**
```
GET /cars/brand/BMW
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW XM",
      "brand": "BMW",
      "year_model": 2025,
      "price_per_day": 32000,
      "currency": "INR",
      "ratings": 145,
      "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
      "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 11. Get Cars by Seating Capacity
**GET** `/cars/seating/:capacity`

Retrieves cars with a specific seating capacity.

**Example Request:**
```
GET /cars/seating/5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "car_name": "BMW XM",
      "brand": "BMW",
      "year_model": 2025,
      "price_per_day": 32000,
      "currency": "INR",
      "ratings": 145,
      "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
      "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 12. Update Car Status
**PATCH** `/cars/:carId/status`

Updates the status of a specific car.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "rented"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Car status updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "car_name": "BMW XM",
    "brand": "BMW",
    "year_model": 2025,
    "price_per_day": 32000,
    "currency": "INR",
    "ratings": 145,
    "description": "The 2025 BMW XM is a high-performance plug-in hybrid SUV...",
    "image_url": "https://your-domain.com/images/bmw_xm_2025.png",
    "status": "rented",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### 13. Bulk Update Cars
**POST** `/cars/bulk-update`

Updates multiple cars at once.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "carIds": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
  "updateData": {
    "status": "maintenance",
    "price_per_day": 30000
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cars updated successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 2,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 2
  }
}
```

### 14. Upload Car Images
**POST** `/cars/:carId/images`

Uploads additional images for a car.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body:**
```
Form data with image files
```

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "imageUrls": [
      "https://your-domain.com/images/bmw_xm_2025_1.png",
      "https://your-domain.com/images/bmw_xm_2025_2.png"
    ]
  }
}
```

### 15. Get Car Statistics
**GET** `/cars/stats/statistics`

Retrieves comprehensive statistics about cars.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "total_cars": 25,
      "available_cars": 18,
      "rented_cars": 5,
      "maintenance_cars": 2,
      "average_price": 25000,
      "min_price": 8000,
      "max_price": 50000
    },
    "by_brand": [
      {
        "_id": "BMW",
        "count": 8,
        "average_price": 35000
      },
      {
        "_id": "Mercedes",
        "count": 6,
        "average_price": 32000
      },
      {
        "_id": "Audi",
        "count": 4,
        "average_price": 28000
      }
    ]
  }
}
```

### 16. Get Car Recommendations
**GET** `/cars/:carId/recommendations`

Retrieves similar car recommendations based on the specified car.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "car_name": "BMW X5",
      "brand": "BMW",
      "year_model": 2024,
      "price_per_day": 28000,
      "currency": "INR",
      "ratings": 120,
      "description": "The BMW X5 is a luxury SUV...",
      "image_url": "https://your-domain.com/images/bmw_x5_2024.png",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Car not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

## Status Codes

- `available`: Car is available for rent
- `rented`: Car is currently rented
- `maintenance`: Car is under maintenance
- `out_of_service`: Car is out of service

## Currency Codes

- `INR`: Indian Rupees
- `USD`: US Dollars
- `EUR`: Euros

## Features

The car API includes the following features:

1. **Comprehensive Car Data**: Detailed specifications including technical specs, dimensions, features, safety, and rental details
2. **Advanced Filtering**: Filter by brand, price range, engine type, seating capacity, status, etc.
3. **Search Functionality**: Text search across car names, brands, and descriptions
4. **Pagination**: Efficient pagination for large datasets
5. **Sorting**: Sort by various fields in ascending or descending order
6. **Bulk Operations**: Update multiple cars at once
7. **Statistics**: Get comprehensive car statistics and analytics
8. **Recommendations**: Get similar car recommendations
9. **Image Management**: Upload and manage car images
10. **Status Management**: Track car availability and status
11. **Validation**: Comprehensive input validation using Joi
12. **Authentication**: Secure endpoints with JWT authentication
13. **Error Handling**: Proper error responses and status codes

## Usage Examples

### Creating a Car
```javascript
const response = await fetch('/api/cars', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify(carData)
});
```

### Searching Cars
```javascript
const response = await fetch('/api/cars/search?brand=BMW&min_price=20000&max_price=50000');
const data = await response.json();
```

### Updating Car Status
```javascript
const response = await fetch('/api/cars/64f8a1b2c3d4e5f6a7b8c9d0/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ status: 'rented' })
});
```

This comprehensive car API provides all the functionality needed for a car rental service, from basic CRUD operations to advanced features like recommendations and statistics.
