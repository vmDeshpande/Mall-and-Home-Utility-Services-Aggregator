# API Documentation

Complete reference for the Mall and Home Utility Services Aggregator backend API.

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
- [Rate Limiting](#rate-limiting)
- [Webhooks](#webhooks)

## 🌐 Base URL

**Development**: `http://localhost:5000`  
**Production**: `https://api.yourdomain.com`

All endpoints use this base URL unless otherwise specified.

## 🔐 Authentication

### JWT Token
Most endpoints require JWT authentication via `Authorization` header:

```
Authorization: Bearer <token>
```

### Getting a Token
Obtain token from login endpoint:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "_id": "user123",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### Token Expiry
- Access tokens expire after 24 hours
- Refresh tokens available at `/api/auth/refresh`

## 📤 Response Format

### Success Response (200-299)
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response (400-599)
```json
{
  "status": "error",
  "error": "ERROR_CODE",
  "message": "User-friendly error message",
  "details": {}
}
```

## ❌ Error Handling

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `SERVER_ERROR` | 500 | Internal server error |

### Error Response Example
```json
{
  "status": "error",
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "details": {
    "field": "email",
    "value": "invalid-email"
  }
}
```

## 📚 Endpoints

### Auth Routes

#### Register
```
POST /api/auth/register
```
**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "1234567890",
  "role": "customer" // or "provider"
}
```

**Response**: `201 Created`
```json
{
  "token": "eyJhbGc...",
  "user": {
    "_id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login
```
POST /api/auth/login
```
**Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**: `200 OK`
```json
{
  "token": "eyJhbGc...",
  "user": { /* user data */ }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### User Routes

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "user": {
    "_id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "avatar": "https://...",
    "addresses": [
      {
        "_id": "addr1",
        "label": "Home",
        "address": "123 Main St",
        "isDefault": true
      }
    ]
  }
}
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "avatar": "https://..."
}
```

**Response**: `200 OK`

#### Add Address
```
POST /api/users/addresses
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "label": "Office",
  "address": "456 Work St, City, State 12345",
  "isDefault": false
}
```

**Response**: `201 Created`

#### Delete Address
```
DELETE /api/users/addresses/:addressId
Authorization: Bearer <token>
```

**Response**: `200 OK`

---

### Service Routes

#### Get All Services
```
GET /api/services
```

**Query Parameters**:
- `category`: Filter by category
- `provider`: Filter by provider ID
- `limit`: Results per page (default: 10)
- `skip`: Pagination offset

**Response**: `200 OK`
```json
{
  "services": [
    {
      "_id": "svc123",
      "name": "Home Cleaning",
      "description": "Professional home cleaning",
      "category": "cleaning",
      "price": 100,
      "duration": "2 hours",
      "provider": "prov123"
    }
  ],
  "total": 150
}
```

#### Get Service by ID
```
GET /api/services/:serviceId
```

**Response**: `200 OK`
```json
{
  "service": { /* service details */ }
}
```

#### Create Service (Provider)
```
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "name": "AC Repair",
  "description": "Air conditioner repair and maintenance",
  "category": "maintenance",
  "price": 150,
  "duration": "1 hour"
}
```

**Response**: `201 Created`

#### Update Service (Provider)
```
PUT /api/services/:serviceId
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "price": 160,
  "description": "Updated description"
}
```

**Response**: `200 OK`

#### Delete Service (Provider)
```
DELETE /api/services/:serviceId
Authorization: Bearer <token>
```

**Response**: `200 OK`

---

### Booking Routes

#### Create Booking (Request)
```
POST /api/requests
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "providerId": "prov123",
  "serviceId": "svc123",
  "scheduledTime": "2024-06-01T14:00:00Z",
  "location": {
    "address": "123 Main St, City, State"
  },
  "price": 110,
  "notes": "Please bring spare parts"
}
```

**Response**: `201 Created`
```json
{
  "request": {
    "_id": "req123",
    "userId": "user123",
    "providerId": "prov123",
    "serviceId": "svc123",
    "status": "requested",
    "price": 110,
    "createdAt": "2024-05-22T10:00:00Z"
  }
}
```

#### Get User Requests
```
GET /api/requests
Authorization: Bearer <token>
```

**Query Parameters**:
- `status`: Filter by status
- `limit`: Results per page
- `skip`: Pagination offset

**Response**: `200 OK`
```json
{
  "requests": [
    { /* request details */ }
  ],
  "total": 5
}
```

#### Get Request by ID
```
GET /api/requests/:requestId
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "request": { /* request details */ }
}
```

#### Update Request Status (Provider)
```
PUT /api/requests/:requestId
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "status": "accepted" // or "rejected", "in-progress", "completed"
}
```

**Response**: `200 OK`

#### Cancel Request
```
DELETE /api/requests/:requestId
Authorization: Bearer <token>
```

**Response**: `200 OK`

---

### Provider Routes

#### Get All Providers
```
GET /api/providers
```

**Query Parameters**:
- `category`: Filter by service category
- `rating`: Minimum rating (1-5)
- `verified`: Show only verified (true/false)
- `limit`: Results per page
- `skip`: Pagination offset

**Response**: `200 OK`
```json
{
  "providers": [
    {
      "_id": "prov123",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "avatar": "https://..."
      },
      "services": [
        {
          "_id": "svc123",
          "name": "Home Cleaning",
          "price": 100
        }
      ],
      "rating": 4.8,
      "reviewCount": 125,
      "verification": {
        "status": "approved"
      }
    }
  ],
  "total": 450
}
```

#### Get Provider by ID
```
GET /api/providers/:providerId
```

**Response**: `200 OK`
```json
{
  "provider": { /* provider details */ }
}
```

#### Get Provider Dashboard (Provider)
```
GET /api/providers/dashboard
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "stats": {
    "totalJobs": 150,
    "completedJobs": 145,
    "rating": 4.8,
    "totalEarnings": 15000
  },
  "recentRequests": [
    { /* request details */ }
  ]
}
```

#### Update Provider Settings (Provider)
```
PUT /api/providers/settings
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "availabilityType": "flexible", // or "scheduled"
  "online": true,
  "bio": "Professional service provider"
}
```

**Response**: `200 OK`

---

### Review Routes

#### Create Review
```
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "providerId": "prov123",
  "requestId": "req123",
  "rating": 5,
  "comment": "Excellent service, highly recommended!",
  "tags": ["professional", "clean", "punctual"]
}
```

**Response**: `201 Created`

#### Get Reviews for Provider
```
GET /api/reviews/:providerId
```

**Query Parameters**:
- `limit`: Results per page
- `skip`: Pagination offset

**Response**: `200 OK`
```json
{
  "reviews": [
    {
      "_id": "rev123",
      "rating": 5,
      "comment": "Great service",
      "author": { /* user details */ },
      "createdAt": "2024-05-20T10:00:00Z"
    }
  ],
  "averageRating": 4.8,
  "total": 125
}
```

---

### Payment Routes (Placeholder)

#### Process Payment
```
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "bookingId": "req123",
  "amount": 110,
  "paymentMethod": "card",
  "cardToken": "tok_visa"
}
```

**Response**: `201 Created`
```json
{
  "transaction": {
    "_id": "txn123",
    "bookingId": "req123",
    "amount": 110,
    "status": "completed",
    "createdAt": "2024-05-22T10:00:00Z"
  }
}
```

#### Get Payment by Booking
```
GET /api/payments/booking/:bookingId
Authorization: Bearer <token>
```

**Response**: `200 OK`

---

### Admin Routes

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <token>
```

**Requires**: Admin role

**Query Parameters**:
- `role`: Filter by role
- `limit`: Results per page
- `skip`: Pagination offset

**Response**: `200 OK`

#### Verify Provider
```
PUT /api/admin/providers/:providerId/verify
Authorization: Bearer <token>
Content-Type: application/json
```

**Requires**: Admin role

**Body**:
```json
{
  "status": "approved", // or "rejected"
  "reason": "Documents verified"
}
```

**Response**: `200 OK`

#### Get Platform Analytics
```
GET /api/admin/analytics
Authorization: Bearer <token>
```

**Requires**: Admin role

**Response**: `200 OK`
```json
{
  "analytics": {
    "totalUsers": 1000,
    "totalProviders": 150,
    "totalBookings": 5000,
    "totalRevenue": 125000,
    "averageRating": 4.7
  }
}
```

---

## ⚡ Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Payment endpoints**: 20 requests per 15 minutes

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1621670400
```

When limit exceeded: `429 Too Many Requests`

---

## 🔔 Webhooks

Webhook events are sent to your registered endpoint.

### Webhook Events

#### booking.created
```json
{
  "event": "booking.created",
  "data": {
    "bookingId": "req123",
    "userId": "user123",
    "providerId": "prov123",
    "timestamp": "2024-05-22T10:00:00Z"
  }
}
```

#### booking.status_changed
```json
{
  "event": "booking.status_changed",
  "data": {
    "bookingId": "req123",
    "oldStatus": "requested",
    "newStatus": "accepted",
    "timestamp": "2024-05-22T10:05:00Z"
  }
}
```

#### payment.completed
```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "txn123",
    "bookingId": "req123",
    "amount": 110,
    "timestamp": "2024-05-22T10:10:00Z"
  }
}
```

### Registering Webhooks

Contact the development team to register your webhook endpoint.

---

## 📝 Pagination

Paginated endpoints support:

```
GET /api/resources?limit=10&skip=20
```

Response:
```json
{
  "data": [ /* 10 items */ ],
  "total": 150,
  "limit": 10,
  "skip": 20,
  "pages": 15
}
```

---

## 🔍 Filtering & Sorting

### Filtering
```
GET /api/services?category=cleaning&price=100
```

### Sorting
```
GET /api/services?sort=price&order=asc
```

---

## 📞 Support

- Documentation: See README.md and related docs
- Issues: Create an issue on GitHub
- Questions: Contact development team

---

**API Version**: 1.0.0  
**Last Updated**: May 22, 2026
