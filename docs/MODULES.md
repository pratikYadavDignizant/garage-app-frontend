# Garage Management System - Complete Module Documentation

## Table of Contents

1. [Authentication Module](#1-authentication-module)
2. [Dashboard Module](#2-dashboard-module)
3. [Customer Management Module](#3-customer-management-module)
4. [Vehicle Management Module](#4-vehicle-management-module)
5. [Service Management Module](#5-service-management-module)
6. [Invoice Module](#6-invoice-module)
7. [Reminder Management Module](#7-reminder-management-module)
8. [Template Management Module](#8-template-management-module)
9. [Settings Module](#9-settings-module)
10. [Garage Management Module (Admin)](#10-garage-management-module-admin)
11. [Registration Requests Module (Admin)](#11-registration-requests-module-admin)

---

## 1. Authentication Module

### Overview

Dual authentication system supporting both garage users and admin users.

### Features

#### 1.1 Garage User Authentication (Firebase OTP)

- **Method**: Phone-based OTP
- **Flow**:
  1. User enters phone number
  2. Firebase sends OTP via SMS
  3. User verifies OTP
  4. System creates/retrieves garage account
- **Token**: Firebase ID Token (auto-refreshes)
- **Session**: Persistent with automatic token refresh

#### 1.2 Admin Authentication (Email/Password)

- **Method**: Email and password
- **Flow**:
  1. Admin enters credentials
  2. Backend validates
  3. JWT token returned
  4. Token stored in localStorage and cookies
- **Token**: JWT (expires in 30 days)
- **Session**: Persistent across browser sessions

### API Endpoints

#### POST `/auth/verify`

Verify Firebase token for garage users.

**Request:**

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

#### POST `/auth/admin/login`

Admin login with credentials.

**Request:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "admin"
  }
}
```

### Security Features

- reCAPTCHA protection on OTP requests
- Rate limiting on authentication attempts
- Secure token storage
- Automatic token refresh (Firebase)
- HTTPS required in production

---

## 2. Dashboard Module

### Overview

Centralized admin dashboard providing system-wide analytics and metrics.

### Features

#### 2.1 Garage Statistics

- **Total Garages**: Count of all registered garages
- **Active Garages**: Currently operational garages
- **Inactive Garages**: Temporarily closed garages
- **Pending Requests**: New registration requests awaiting approval

#### 2.2 Business Metrics

- **Total Customers**: Aggregate customer count across all garages
- **Total Vehicles**: All vehicles in the system
- **Total Services**: Completed service records

#### 2.3 Reminder Status

- **Overdue Reminders**: Services past due date (requires immediate attention)
- **Reminders Today**: Services due today
- **Upcoming Reminders**: Services due in next 7 days

#### 2.4 Calculated Metrics

- **Active Rate**: Percentage of active garages
- **Avg Vehicles**: Average vehicles per garage
- **Avg Services**: Average services per garage
- **Reminder Rate**: Percentage of vehicles with active reminders

### API Endpoints

#### GET `/admin/dashboard/summary`

Get dashboard summary statistics.

**Response:**

```json
{
  "garages": {
    "total": number,
    "active": number,
    "inactive": number
  },
  "customers": number,
  "vehicles": number,
  "services": number,
  "reminders": {
    "today": number,
    "upcoming": number,
    "overdue": number
  }
}
```

### UI Components

- **StatCard**: Displays individual metrics with icons and colors
- **System Health**: Real-time status indicator
- **Trend Indicators**: Visual representation of metrics

---

## 3. Customer Management Module

### Overview

Complete CRUD operations for managing customer records.

### Features

#### 3.1 Customer List

- Paginated table view
- Search by name, phone, or address
- Sort by any column
- Vehicle count per customer
- Quick actions (Edit, Delete, View)

#### 3.2 Customer Creation

- **Required Fields**:
  - Name
  - Phone number (unique per garage)
- **Optional Fields**:
  - Address
- **Validation**:
  - Phone number format validation
  - Duplicate phone detection

#### 3.3 Customer Editing

- Update name, phone, address
- Cannot change garage association
- Real-time validation

#### 3.4 Customer Deletion

- **Cascade Delete**: Removes all associated vehicles and services
- **Confirmation Modal**: Prevents accidental deletion
- **Details Shown**: Number of vehicles and services to be deleted

#### 3.5 Export Functionality

- Export to CSV format
- Includes all customer data
- Nested vehicle information flattened

### API Endpoints

#### GET `/customers`

Get all customers for authenticated garage.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response:**

```json
{
  "customers": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "address": "string",
      "garageId": "string",
      "createdAt": "ISO 8601",
      "_count": {
        "vehicles": number
      }
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

#### GET `/customers/:id`

Get single customer with vehicles.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "address": "string",
  "garageId": "string",
  "createdAt": "ISO 8601",
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

Create new customer.

**Request:**

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
    /* customer object */
  }
}
```

#### PUT `/customers/:id`

Update customer.

**Request:**

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
    /* updated customer */
  }
}
```

#### DELETE `/customers/:id`

Delete customer and all associated data.

**Response:**

```json
{
  "message": "Customer and all associated data deleted successfully"
}
```

### Data Validation

- Phone number: 10 digits
- Name: Required, min 2 characters
- Address: Optional, max 500 characters

---

## 4. Vehicle Management Module

### Overview

Manage vehicles associated with customers, including service history.

### Features

#### 4.1 Vehicle List

- Paginated table with customer information
- Search by model, number plate, or customer name
- Service count per vehicle
- Quick access to service history

#### 4.2 Vehicle Creation

- **Required Fields**:
  - Customer (dropdown selection)
  - Vehicle model
  - Number plate (unique per garage)
- **Validation**:
  - Number plate format
  - Duplicate detection

#### 4.3 Vehicle Editing

- Update model and number plate
- Cannot change customer association
- Real-time validation

#### 4.4 Vehicle Deletion

- **Cascade Delete**: Removes all service records
- **Confirmation Modal**: Shows service count
- **Impact Warning**: Displays what will be deleted

#### 4.5 Service History View

- **Timeline View**: Chronological service records
- **Service Details**: Date, items, costs, notes
- **Next Service**: Calculated due date
- **Status Indicators**: Visual status badges
- **Invoice Access**: Direct link to invoice for each service

### API Endpoints

#### GET `/vehicles`

Get all vehicles for authenticated garage.

**Query Parameters:**

- `page`, `limit`, `search`

**Response:**

```json
{
  "vehicles": [
    {
      "id": "string",
      "model": "string",
      "numberPlate": "string",
      "customerId": "string",
      "garageId": "string",
      "createdAt": "ISO 8601",
      "customer": {
        "id": "string",
        "name": "string",
        "phone": "string"
      },
      "_count": {
        "services": number
      }
    }
  ],
  "total": number
}
```

#### GET `/vehicles/:id`

Get vehicle with complete service history.

**Response:**

```json
{
  "id": "string",
  "model": "string",
  "numberPlate": "string",
  "customerId": "string",
  "garageId": "string",
  "createdAt": "ISO 8601",
  "customer": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "address": "string"
  },
  "services": [
    {
      "id": "string",
      "serviceDate": "ISO 8601",
      "nextServiceDate": "ISO 8601",
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

Create new vehicle.

**Request:**

```json
{
  "model": "string",
  "numberPlate": "string",
  "customerId": "string"
}
```

#### PUT `/vehicles/:id`

Update vehicle.

**Request:**

```json
{
  "model": "string",
  "numberPlate": "string"
}
```

#### DELETE `/vehicles/:id`

Delete vehicle and all services.

**Response:**

```json
{
  "message": "Vehicle and all associated services deleted successfully"
}
```

### Data Validation

- Number plate: Required, unique per garage
- Model: Required, min 2 characters
- Customer: Must exist and belong to garage

---

## 5. Service Management Module

### Overview

Record and manage service history for vehicles.

### Features

#### 5.1 Service List

- Paginated table with vehicle and customer info
- Filter by status (Completed, Pending, In Progress)
- Search by vehicle number, customer name
- Sort by service date
- Quick actions (Edit, Delete, View Invoice)

#### 5.2 Service Creation

- **Required Fields**:
  - Vehicle (dropdown with customer info)
  - Service date
  - Service interval (months)
  - Status
  - At least one service item
- **Service Items**:
  - Service description
  - Cost (₹)
  - Add/remove multiple items
- **Auto-calculations**:
  - Next service date (based on interval)
  - Subtotal
  - GST (configurable rate)
  - Total amount

#### 5.3 Service Editing

- Update all service details
- Modify service items
- Change status
- Recalculate totals

#### 5.4 Service Deletion

- Confirmation required
- Does not delete vehicle or customer

#### 5.5 Invoice Generation

- Automatic invoice creation
- Professional format
- GST calculations
- Print-ready layout

### API Endpoints

#### GET `/services`

Get all services for authenticated garage.

**Query Parameters:**

- `page`, `limit`, `search`
- `status`: Filter by status

**Response:**

```json
{
  "services": [
    {
      "id": "string",
      "serviceDate": "ISO 8601",
      "nextServiceDate": "ISO 8601",
      "intervalMonths": number,
      "notes": "string",
      "status": "string",
      "vehicleId": "string",
      "garageId": "string",
      "createdAt": "ISO 8601",
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
  ],
  "total": number
}
```

#### GET `/services/:id`

Get single service with full details.

#### POST `/services`

Create new service.

**Request:**

```json
{
  "vehicleId": "string",
  "serviceDate": "ISO 8601",
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
  "message": "Service created successfully",
  "service": {
    /* service object */
  }
}
```

#### PUT `/services/:id`

Update service.

#### DELETE `/services/:id`

Delete service.

### Business Logic

- **Next Service Date**: `serviceDate + intervalMonths`
- **Subtotal**: Sum of all item costs
- **GST**: `subtotal * (gstRate / 100)`
- **Total**: `subtotal + gst`

### Status Options

- Completed
- Pending
- In Progress
- Cancelled

---

## 6. Invoice Module

### Overview

Professional invoice generation for service records.

### Features

#### 6.1 Invoice Generation

- Automatic invoice number generation
- Format: `INV-YYYYMMDD-XXXXX`
- Real-time data from service record

#### 6.2 Invoice Layout

- **Header Section**:
  - Garage logo placeholder
  - Garage details (name, address, phone, email)
  - Invoice title and "Original" label
- **Billing Information**:
  - Bill To: Customer details
  - GSTIN and PAN number
- **Order Details Grid**:
  - Invoice number and date
  - Vehicle number and model
  - Service date and status
- **Items Table**:
  - Serial number
  - Service description
  - Amount
  - Minimum 8 rows for professional appearance
  - Total row
- **Footer**:
  - Remarks/Notes section
  - Company GSTIN
  - Next service due date
  - Invoice summary with tax breakdown
  - Grand total (highlighted)
- **Thank You Message**

#### 6.3 Tax Calculations

- **Taxable Value**: Subtotal before tax
- **SGST**: GST / 2 (State GST)
- **CGST**: GST / 2 (Central GST)
- **IGST**: ₹0.00 (for inter-state, currently not implemented)
- **Grand Total**: Subtotal + GST

#### 6.4 Print Functionality

- Print button in header
- A4 page size optimization
- Print-specific styling
- Removes unnecessary UI elements

### API Endpoints

#### GET `/invoices/:serviceId`

Generate invoice for a service.

**Response:**

```json
{
  "invoiceNumber": "string",
  "invoiceDate": "ISO 8601",
  "service": {
    "id": "string",
    "serviceDate": "ISO 8601",
    "nextServiceDate": "ISO 8601",
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
    "logo": "string"
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
    "gstRate": number,
    "total": number
  },
  "hasItems": boolean,
  "itemCount": number
}
```

### Design Features

- Professional grid-based layout
- Thin borders for clean appearance
- Proper typography hierarchy
- Currency formatting (₹1,234.56)
- Date formatting (dd/MM/yyyy)
- Responsive design
- Dark mode support (screen only)

---

## 7. Reminder Management Module

### Overview

Automated and manual WhatsApp reminder system for upcoming services.

### Features

#### 7.1 Reminder Dashboard

- **Tabs**:
  - All Reminders
  - Pending (not yet sent)
  - Sent (successfully delivered)
  - Failed (delivery failed)
- **Reminder List**:
  - Customer and vehicle information
  - Next service due date
  - Scheduled send date
  - Status with color coding
  - WhatsApp message ID (if sent)

#### 7.2 Manual Reminders

- Send reminder for any service
- Template selection
- Immediate delivery
- Status tracking

#### 7.3 Automatic Reminders

- Scheduled based on next service date
- Configurable days before service
- Automatic template selection
- Batch processing

#### 7.4 Reminder Status Tracking

- **Pending**: Scheduled but not sent
- **Sent**: Successfully delivered to WhatsApp
- **Failed**: Delivery failed (with error message)

### API Endpoints

#### GET `/reminders`

Get all reminders for authenticated garage.

**Query Parameters:**

- `status`: Filter by status (pending, sent, failed)
- `page`, `limit`

**Response:**

```json
{
  "reminders": [
    {
      "id": "string",
      "serviceId": "string",
      "scheduledDate": "ISO 8601",
      "sentDate": "ISO 8601",
      "status": "string",
      "messageId": "string",
      "createdAt": "ISO 8601",
      "service": {
        "id": "string",
        "nextServiceDate": "ISO 8601",
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
  ],
  "total": number
}
```

#### POST `/reminders/send`

Send manual reminder.

**Request:**

```json
{
  "serviceId": "string",
  "templateId": "string" // optional
}
```

**Response:**

```json
{
  "message": "Reminder sent successfully",
  "reminder": {
    /* reminder object */
  }
}
```

### WhatsApp Integration

- Uses WhatsApp Business API
- Template-based messaging
- Variable substitution
- Delivery status tracking
- Error handling and retry logic

---

## 8. Template Management Module

### Overview

Manage customizable message templates for WhatsApp reminders.

### Features

#### 8.1 Template List

- All templates for garage
- Default template indicator
- Quick actions (Edit, Delete, Set as Default)

#### 8.2 Template Creation

- **Fields**:
  - Template name
  - Message content
  - Default flag
- **Variable Support**:
  - `{customerName}`
  - `{vehicleModel}`
  - `{vehicleNumber}`
  - `{nextServiceDate}`
  - `{garageName}`
  - `{garagePhone}`

#### 8.3 Template Editing

- Update name and message
- Toggle default status
- Preview with sample data

#### 8.4 Template Deletion

- Cannot delete if it's the only template
- Cannot delete default template without setting another as default
- Confirmation required

#### 8.5 Default Template

- Only one default template allowed
- Used when no template specified
- Automatically selected for auto-reminders

### API Endpoints

#### GET `/templates`

Get all templates for authenticated garage.

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "message": "string",
    "isDefault": boolean,
    "garageId": "string",
    "createdAt": "ISO 8601"
  }
]
```

#### POST `/templates`

Create new template.

**Request:**

```json
{
  "name": "string",
  "message": "string",
  "isDefault": boolean
}
```

#### PUT `/templates/:id`

Update template.

**Request:**

```json
{
  "name": "string",
  "message": "string",
  "isDefault": boolean
}
```

#### DELETE `/templates/:id`

Delete template.

**Response:**

```json
{
  "message": "Template deleted successfully"
}
```

### Template Variables

Variables are automatically replaced when sending reminders:

| Variable            | Description           | Example             |
| ------------------- | --------------------- | ------------------- |
| `{customerName}`    | Customer's name       | "John Doe"          |
| `{vehicleModel}`    | Vehicle model         | "Honda City"        |
| `{vehicleNumber}`   | Registration number   | "MH12AB1234"        |
| `{nextServiceDate}` | Next service due date | "15/01/2026"        |
| `{garageName}`      | Garage name           | "Premium Auto Care" |
| `{garagePhone}`     | Garage phone          | "+919876543210"     |

### Example Template

```
Hello {customerName}, your {vehicleModel} ({vehicleNumber}) is due for service on {nextServiceDate}.
Please contact {garageName} at {garagePhone} to schedule an appointment.
```

---

## 9. Settings Module

### Overview

Configure garage information and system preferences.

### Features

#### 9.1 Garage Information

- **Garage Name**: Displayed on invoices and reminders
- **Contact Phone**: For customer communication
- **Address**: Full workshop address for invoices
- **GST Number**: Optional, for tax calculations

#### 9.2 Reminder Settings (Future)

- Days before service to send reminder
- Auto-reminder toggle
- WhatsApp integration toggle

#### 9.3 Invoice Settings (Future)

- GST rate configuration
- Invoice number prefix
- Logo upload

#### 9.4 Security Settings (Placeholder)

- Two-factor authentication
- API access management

### API Endpoints

#### GET `/settings`

Get garage settings.

**Response:**

```json
{
  "id": "string",
  "garageId": "string",
  "name": "string",
  "phone": "string",
  "address": "string",
  "gstNumber": "string",
  "reminderDaysBefore": number,
  "autoReminders": boolean,
  "whatsappEnabled": boolean,
  "gstRate": number,
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

#### PUT `/settings`

Update garage settings.

**Request:**

```json
{
  "name": "string",
  "phone": "string",
  "address": "string",
  "gstNumber": "string",
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
    /* updated settings */
  }
}
```

### Validation Rules

- Name: Required, min 2 characters
- Phone: Required, 10 digits
- Address: Required
- GST Number: Optional, 15 characters if provided
- GST Rate: 0-100

---

## 10. Garage Management Module (Admin)

### Overview

Admin-only module for managing all garages in the system.

### Features

#### 10.1 Garage List

- All registered garages
- Verification status
- Active/inactive status
- Quick actions (Edit, Delete, Toggle Status)

#### 10.2 Garage Creation (Admin)

- Create garage accounts manually
- Set initial credentials
- Assign Firebase UID

#### 10.3 Garage Editing

- Update garage information
- Change verification status
- Toggle active/inactive

#### 10.4 Garage Deletion

- **Cascade Delete**: Removes all data
  - Customers
  - Vehicles
  - Services
  - Reminders
  - Templates
  - Settings
- **Confirmation Required**: Shows impact
- **Irreversible**: No recovery

#### 10.5 Verification Management

- Verify/unverify garages
- Affects access to features
- Displayed on garage dashboard

### API Endpoints

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
    "firebaseUid": "string",
    "createdAt": "ISO 8601",
    "_count": {
      "customers": number,
      "vehicles": number,
      "services": number
    }
  }
]
```

#### GET `/garages/:id`

Get single garage details.

#### POST `/garages`

Create new garage (admin only).

**Request:**

```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "gstNumber": "string",
  "firebaseUid": "string"
}
```

#### PUT `/garages/:id`

Update garage.

**Request:**

```json
{
  "name": "string",
  "email": "string",
  "address": "string",
  "gstNumber": "string",
  "isVerified": boolean
}
```

#### DELETE `/garages/:id`

Delete garage and all associated data (admin only).

**Response:**

```json
{
  "message": "Garage and all associated data deleted successfully"
}
```

#### PUT `/garages/:id/verify`

Toggle garage verification status.

**Response:**

```json
{
  "message": "Garage verification status updated",
  "garage": {
    /* updated garage */
  }
}
```

---

## 11. Registration Requests Module (Admin)

### Overview

Admin module for managing new garage registration requests.

### Features

#### 11.1 Request List

- **Tabs**:
  - Pending (awaiting review)
  - Approved (accepted requests)
  - Rejected (declined requests)
- **Request Information**:
  - Garage name
  - Owner name
  - Contact details
  - Address
  - GST number
  - Submission date
  - Status

#### 11.2 Request Review

- View full request details
- Check for duplicate submissions
- Verify contact information

#### 11.3 Request Approval

- Creates new garage account
- Sends confirmation (future)
- Moves to approved tab
- Cannot be undone

#### 11.4 Request Rejection

- Optional rejection reason
- Moves to rejected tab
- Can be deleted later

#### 11.5 Request Deletion

- Permanently removes request
- Confirmation required
- Cannot be recovered

#### 11.6 Rate Limiting

- 1 request per phone number per 24 hours
- Prevents spam
- Returns 429 error if exceeded

### API Endpoints

#### GET `/registration/requests`

Get all registration requests (admin only).

**Query Parameters:**

- `status`: Filter by status (PENDING, APPROVED, REJECTED)
- `page`, `limit`

**Response:**

```json
{
  "requests": [
    {
      "id": "string",
      "garageName": "string",
      "ownerName": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "gstNumber": "string",
      "status": "string",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

#### POST `/registration/request`

Submit new registration request (public).

**Request:**

```json
{
  "garageName": "string",
  "ownerName": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "gstNumber": "string"
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
    "status": "PENDING"
  }
}
```

**Error (Rate Limit):**

```json
{
  "error": "Too many requests. Please try again in 24 hours."
}
```

#### PUT `/registration/requests/:id/approve`

Approve registration request (admin only).

**Response:**

```json
{
  "message": "Registration approved successfully",
  "garage": {
    /* created garage object */
  }
}
```

#### PUT `/registration/requests/:id/reject`

Reject registration request (admin only).

**Request:**

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

#### DELETE `/registration/requests/:id`

Delete registration request (admin only).

**Response:**

```json
{
  "message": "Registration request deleted successfully"
}
```

### Status Flow

```
PENDING → APPROVED (creates garage account)
PENDING → REJECTED (can be deleted)
```

### Validation Rules

- Garage Name: Required, min 2 characters
- Owner Name: Required, min 2 characters
- Phone: Required, 10 digits, unique per 24 hours
- Email: Required, valid email format
- Address: Required
- GST Number: Optional, 15 characters if provided

---

## Common Features Across Modules

### Pagination

All list endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- Response includes `total`, `page`, `limit`

### Search

Most list views support search:

- Searches across relevant fields
- Case-insensitive
- Partial matching

### Sorting

Tables support column sorting:

- Click column header to sort
- Toggle ascending/descending
- Default sort varies by module

### Export

Customer and service data can be exported:

- CSV format
- All fields included
- Nested data flattened
- Date formatting applied

### Error Handling

Consistent error responses:

- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 429: Too Many Requests (rate limiting)
- 500: Internal Server Error

### Loading States

All modules include:

- Skeleton loaders
- Loading spinners
- Disabled states during operations
- Progress indicators

### Responsive Design

All modules are fully responsive:

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### Dark Mode

Full dark mode support:

- System preference detection
- Manual toggle
- Persistent preference
- Optimized color schemes

---

## Data Relationships

```
Garage
├── Customers
│   └── Vehicles
│       └── Services
│           ├── Reminders
│           └── Invoices
├── Templates
└── Settings

Admin
├── All Garages
└── Registration Requests
```

### Cascade Deletion Rules

- Delete Garage → Deletes all customers, vehicles, services, reminders, templates, settings
- Delete Customer → Deletes all vehicles and services
- Delete Vehicle → Deletes all services
- Delete Service → No cascade (reminders remain for history)

---

## Security & Permissions

### Garage User Permissions

- Full CRUD on own customers, vehicles, services
- View and manage own reminders
- Manage own templates
- Update own settings
- View own invoices
- **Cannot**: Access other garages' data, manage registrations, access admin features

### Admin Permissions

- All garage user permissions
- View all garages
- Create/edit/delete any garage
- Manage registration requests
- View system-wide analytics
- **Cannot**: Access individual garage's Firebase auth

### Data Isolation

- All garage data is isolated by `garageId`
- Middleware enforces garage-level access control
- Admin bypass for system management
- No cross-garage data access

---

## Performance Optimizations

### Frontend

- React Query for caching
- Optimistic updates
- Debounced search
- Lazy loading
- Code splitting
- Image optimization

### Backend

- Database indexing
- Query optimization
- Pagination
- Rate limiting
- Caching strategies

---

## Future Enhancements

### Planned Features

1. **Analytics Dashboard**: Advanced charts and trends
2. **Bulk Operations**: Import/export, bulk updates
3. **Notifications**: In-app notifications, email alerts
4. **Reports**: PDF reports, custom date ranges
5. **Multi-language**: i18n support
6. **Mobile App**: React Native companion app
7. **API Webhooks**: Integration with external systems
8. **Advanced Search**: Filters, saved searches
9. **Audit Logs**: Track all changes
10. **Role-based Access**: Multiple user roles per garage

---

## Support & Maintenance

### Logging

- Error tracking
- User activity logs
- API request logs
- Performance monitoring

### Backup

- Automated database backups
- Point-in-time recovery
- Data export capabilities

### Updates

- Semantic versioning
- Changelog maintenance
- Migration scripts
- Backward compatibility

---

**Last Updated**: January 13, 2026  
**Version**: 0.1.0  
**Documentation Status**: Complete
