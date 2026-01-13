# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: [Your production API URL]
```

## Authentication

The application supports two authentication methods:

1. **Firebase OTP Authentication** - For garage users (phone-based)
2. **Email/Password Authentication** - For admin users

All API endpoints (except registration and admin login) require authentication.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Note:**

- Garage users use Firebase ID token
- Admin users use JWT token from `/auth/admin/login`

---

## Endpoints

### 1. Authentication

#### POST `/auth/admin/login`

Admin login with email and password.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (Success):**

```json
{
  "token": "string", // JWT token
  "user": {
    "id": "string",
    "email": "string",
    "role": "admin"
  }
}
```

**Response (Error):**

```json
{
  "error": "Invalid email or password"
}
```

**Usage:**

- Store the token in localStorage and cookies
- Include token in Authorization header for subsequent requests
- Token expires after 30 days

---

#### POST `/auth/verify`

Verify Firebase token and get/create garage account (for garage users).

**Request Body:**

```json
{
  "firebaseUid": "string",
  "phone": "string"
}
```

**Response:**

```json
{
  "garage": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "gstNumber": "string",
    "isVerified": boolean,
    "firebaseUid": "string"
  }
}
```

---

### 2. Garages

#### GET `/garages`

Get all garages (admin only).

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "gstNumber": "string",
    "isVerified": boolean,
    "createdAt": "ISO 8601 date"
  }
]
```

#### GET `/garages/:id`

Get garage by ID.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "gstNumber": "string",
  "isVerified": boolean,
  "createdAt": "ISO 8601 date"
}
```

#### PUT `/garages/:id`

Update garage information.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "address": "string",
  "gstNumber": "string"
}
```

**Response:**

```json
{
  "message": "Garage updated successfully",
  "garage": {
    /* updated garage object */
  }
}
```

#### DELETE `/garages/:id`

Delete garage (admin only).

**Response:**

```json
{
  "message": "Garage deleted successfully"
}
```

---

### 3. Customers

#### GET `/customers`

Get all customers for the authenticated garage.

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "phone": "string",
    "address": "string",
    "garageId": "string",
    "createdAt": "ISO 8601 date",
    "_count": {
      "vehicles": number
    }
  }
]
```

#### GET `/customers/:id`

Get customer by ID.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "address": "string",
  "garageId": "string",
  "createdAt": "ISO 8601 date",
  "vehicles": [
    {
      "id": "string",
      "model": "string",
      "numberPlate": "string"
    }
  ]
}
```

#### POST `/customers`

Create a new customer.

**Request Body:**

```json
{
  "name": "string",
  "phone": "string",
  "address": "string" // optional
}
```

**Response:**

```json
{
  "message": "Customer created successfully",
  "customer": {
    /* created customer object */
  }
}
```

#### PUT `/customers/:id`

Update customer information.

**Request Body:**

```json
{
  "name": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:**

```json
{
  "message": "Customer updated successfully",
  "customer": {
    /* updated customer object */
  }
}
```

#### DELETE `/customers/:id`

Delete customer and all associated vehicles and services.

**Response:**

```json
{
  "message": "Customer and all associated data deleted successfully"
}
```

---

### 4. Vehicles

#### GET `/vehicles`

Get all vehicles for the authenticated garage.

**Response:**

```json
[
  {
    "id": "string",
    "model": "string",
    "numberPlate": "string",
    "customerId": "string",
    "garageId": "string",
    "createdAt": "ISO 8601 date",
    "customer": {
      "id": "string",
      "name": "string",
      "phone": "string"
    },
    "_count": {
      "services": number
    }
  }
]
```

#### GET `/vehicles/:id`

Get vehicle by ID with service history.

**Response:**

```json
{
  "id": "string",
  "model": "string",
  "numberPlate": "string",
  "customerId": "string",
  "garageId": "string",
  "createdAt": "ISO 8601 date",
  "customer": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "address": "string"
  },
  "services": [
    {
      "id": "string",
      "serviceDate": "ISO 8601 date",
      "nextServiceDate": "ISO 8601 date",
      "intervalMonths": number,
      "notes": "string",
      "status": "string",
      "items": [
        {
          "service": "string",
          "cost": number
        }
      ]
    }
  ]
}
```

#### POST `/vehicles`

Create a new vehicle.

**Request Body:**

```json
{
  "model": "string",
  "numberPlate": "string",
  "customerId": "string"
}
```

**Response:**

```json
{
  "message": "Vehicle created successfully",
  "vehicle": {
    /* created vehicle object */
  }
}
```

#### PUT `/vehicles/:id`

Update vehicle information.

**Request Body:**

```json
{
  "model": "string",
  "numberPlate": "string"
}
```

**Response:**

```json
{
  "message": "Vehicle updated successfully",
  "vehicle": {
    /* updated vehicle object */
  }
}
```

#### DELETE `/vehicles/:id`

Delete vehicle and all associated services.

**Response:**

```json
{
  "message": "Vehicle and all associated services deleted successfully"
}
```

---

### 5. Services

#### GET `/services`

Get all services for the authenticated garage.

**Query Parameters:**

- `status` (optional): Filter by status (e.g., "completed", "pending")

**Response:**

```json
[
  {
    "id": "string",
    "serviceDate": "ISO 8601 date",
    "nextServiceDate": "ISO 8601 date",
    "intervalMonths": number,
    "notes": "string",
    "status": "string",
    "vehicleId": "string",
    "garageId": "string",
    "createdAt": "ISO 8601 date",
    "vehicle": {
      "id": "string",
      "model": "string",
      "numberPlate": "string",
      "customer": {
        "id": "string",
        "name": "string",
        "phone": "string"
      }
    },
    "items": [
      {
        "service": "string",
        "cost": number
      }
    ]
  }
]
```

#### GET `/services/:id`

Get service by ID.

**Response:**

```json
{
  "id": "string",
  "serviceDate": "ISO 8601 date",
  "nextServiceDate": "ISO 8601 date",
  "intervalMonths": number,
  "notes": "string",
  "status": "string",
  "vehicleId": "string",
  "garageId": "string",
  "createdAt": "ISO 8601 date",
  "vehicle": {
    "id": "string",
    "model": "string",
    "numberPlate": "string",
    "customer": {
      "id": "string",
      "name": "string",
      "phone": "string",
      "address": "string"
    }
  },
  "items": [
    {
      "service": "string",
      "cost": number
    }
  ]
}
```

#### POST `/services`

Create a new service record.

**Request Body:**

```json
{
  "vehicleId": "string",
  "serviceDate": "ISO 8601 date",
  "intervalMonths": number,
  "notes": "string", // optional
  "status": "string", // e.g., "completed", "pending"
  "items": [
    {
      "service": "string",
      "cost": number
    }
  ]
}
```

**Response:**

```json
{
  "message": "Service created successfully",
  "service": {
    /* created service object */
  }
}
```

#### PUT `/services/:id`

Update service record.

**Request Body:**

```json
{
  "serviceDate": "ISO 8601 date",
  "intervalMonths": number,
  "notes": "string",
  "status": "string",
  "items": [
    {
      "service": "string",
      "cost": number
    }
  ]
}
```

**Response:**

```json
{
  "message": "Service updated successfully",
  "service": {
    /* updated service object */
  }
}
```

#### DELETE `/services/:id`

Delete service record.

**Response:**

```json
{
  "message": "Service deleted successfully"
}
```

---

### 6. Invoices

#### GET `/invoices/:serviceId`

Generate invoice for a service.

**Response:**

```json
{
  "invoiceNumber": "string", // Format: INV-YYYYMMDD-XXXXX
  "invoiceDate": "ISO 8601 date",
  "service": {
    "id": "string",
    "serviceDate": "ISO 8601 date",
    "nextServiceDate": "ISO 8601 date",
    "intervalMonths": number,
    "notes": "string",
    "status": "string"
  },
  "vehicle": {
    "id": "string",
    "model": "string",
    "numberPlate": "string"
  },
  "customer": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "address": "string"
  },
  "garage": {
    "id": "string",
    "name": "string",
    "address": "string",
    "phone": "string",
    "gstNumber": "string",
    "email": "string",
    "logo": "string" // URL or null
  },
  "items": [
    {
      "sno": number,
      "description": "string",
      "amount": number
    }
  ],
  "summary": {
    "subtotal": number,
    "gst": number,
    "gstRate": number, // e.g., 18
    "total": number
  },
  "hasItems": boolean,
  "itemCount": number
}
```

**Error Responses:**

- `404`: Service not found
- `403`: Unauthorized access to service

---

### 7. Reminders

#### GET `/reminders`

Get all reminders for the authenticated garage.

**Query Parameters:**

- `status` (optional): Filter by status ("pending", "sent", "failed")

**Response:**

```json
[
  {
    "id": "string",
    "serviceId": "string",
    "scheduledDate": "ISO 8601 date",
    "sentDate": "ISO 8601 date", // null if not sent
    "status": "string",
    "messageId": "string", // WhatsApp message ID
    "createdAt": "ISO 8601 date",
    "service": {
      "id": "string",
      "nextServiceDate": "ISO 8601 date",
      "vehicle": {
        "model": "string",
        "numberPlate": "string",
        "customer": {
          "name": "string",
          "phone": "string"
        }
      }
    }
  }
]
```

#### POST `/reminders/send`

Send manual reminder for a service.

**Request Body:**

```json
{
  "serviceId": "string",
  "templateId": "string" // optional, uses default if not provided
}
```

**Response:**

```json
{
  "message": "Reminder sent successfully",
  "reminder": {
    /* created reminder object */
  }
}
```

---

### 8. Templates

#### GET `/templates`

Get all message templates for the authenticated garage.

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "message": "string",
    "isDefault": boolean,
    "garageId": "string",
    "createdAt": "ISO 8601 date"
  }
]
```

#### POST `/templates`

Create a new message template.

**Request Body:**

```json
{
  "name": "string",
  "message": "string",
  "isDefault": boolean // optional, defaults to false
}
```

**Response:**

```json
{
  "message": "Template created successfully",
  "template": {
    /* created template object */
  }
}
```

#### PUT `/templates/:id`

Update message template.

**Request Body:**

```json
{
  "name": "string",
  "message": "string",
  "isDefault": boolean
}
```

**Response:**

```json
{
  "message": "Template updated successfully",
  "template": {
    /* updated template object */
  }
}
```

#### DELETE `/templates/:id`

Delete message template.

**Response:**

```json
{
  "message": "Template deleted successfully"
}
```

---

### 9. Settings

#### GET `/settings`

Get garage settings.

**Response:**

```json
{
  "id": "string",
  "garageId": "string",
  "reminderDaysBefore": number,
  "autoReminders": boolean,
  "whatsappEnabled": boolean,
  "gstRate": number,
  "createdAt": "ISO 8601 date",
  "updatedAt": "ISO 8601 date"
}
```

#### PUT `/settings`

Update garage settings.

**Request Body:**

```json
{
  "reminderDaysBefore": number,
  "autoReminders": boolean,
  "whatsappEnabled": boolean,
  "gstRate": number
}
```

**Response:**

```json
{
  "message": "Settings updated successfully",
  "settings": {
    /* updated settings object */
  }
}
```

---

### 10. Registration

#### POST `/registration/request`

Submit garage registration request (public endpoint).

**Request Body:**

```json
{
  "garageName": "string",
  "ownerName": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "gstNumber": "string" // optional
}
```

**Response:**

```json
{
  "message": "Registration request submitted successfully",
  "request": {
    "id": "string",
    "garageName": "string",
    "ownerName": "string",
    "phone": "string",
    "email": "string",
    "status": "pending"
  }
}
```

**Rate Limiting:**

- 1 request per phone number per 24 hours
- Returns `429 Too Many Requests` if limit exceeded

#### GET `/registration/requests` (Admin Only)

Get all registration requests.

**Response:**

```json
[
  {
    "id": "string",
    "garageName": "string",
    "ownerName": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "gstNumber": "string",
    "status": "string", // "pending", "approved", "rejected"
    "createdAt": "ISO 8601 date"
  }
]
```

#### PUT `/registration/requests/:id/approve` (Admin Only)

Approve registration request.

**Response:**

```json
{
  "message": "Registration approved successfully",
  "garage": {
    /* created garage object */
  }
}
```

#### PUT `/registration/requests/:id/reject` (Admin Only)

Reject registration request.

**Request Body:**

```json
{
  "reason": "string" // optional
}
```

**Response:**

```json
{
  "message": "Registration rejected successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized - Invalid or missing token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden - Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Template Variables

Message templates support the following variables:

- `{customerName}` - Customer's name
- `{vehicleModel}` - Vehicle model
- `{vehicleNumber}` - Vehicle registration number
- `{nextServiceDate}` - Next service due date
- `{garageName}` - Garage name
- `{garagePhone}` - Garage phone number

**Example Template:**

```
Hello {customerName}, your {vehicleModel} ({vehicleNumber}) is due for service on {nextServiceDate}.
Please contact {garageName} at {garagePhone} to schedule an appointment.
```

---

## Rate Limiting

- **Registration endpoint**: 1 request per phone per 24 hours
- **Other endpoints**: No explicit rate limiting (handled by backend infrastructure)

---

## Notes

1. All dates are in ISO 8601 format
2. All currency amounts are in INR (₹)
3. Phone numbers should include country code (e.g., +91 for India)
4. Firebase ID tokens expire after 1 hour and must be refreshed
5. Invoice numbers are auto-generated in format: `INV-YYYYMMDD-XXXXX`
