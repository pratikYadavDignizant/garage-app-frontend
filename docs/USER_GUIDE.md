# User Guide

Welcome to the **Garage Management System User Guide**. This comprehensive guide will help you navigate and use all features of the platform efficiently.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles \u0026 Authentication](#user-roles--authentication)
3. [Registration Process (New Garages)](#registration-process-new-garages)
4. [Dashboard Overview](#dashboard-overview)
5. [Managing Customers](#managing-customers)
6. [Managing Vehicles](#managing-vehicles)
7. [Service History \u0026 Recording](#service-history--recording)
8. [Invoice Management](#invoice-management)
9. [Reminders System](#reminders-system)
10. [Message Templates](#message-templates)
11. [Settings](#settings)
12. [Admin Features](#admin-features)
13. [Common Workflows](#common-workflows)
14. [Quick Reference](#quick-reference)
15. [Troubleshooting](#troubleshooting)

---

## Getting Started

Welcome to the Garage Management System! This guide will help you get started based on your role.

---

## User Roles \u0026 Authentication

The system supports two types of users with different authentication methods:

### Garage Users

**Who**: Individual garage owners and staff managing their own garage operations

**Authentication**: Phone-based OTP (One-Time Password) via Firebase

- No password required
- Secure SMS verification
- Automatic account creation on first login

**Access**:

- Manage your own customers, vehicles, and services
- Send reminders to your customers
- Generate invoices
- Customize message templates
- Update garage settings

### Admin Users

**Who**: System administrators managing multiple garages

**Authentication**: Email and password

- Secure credential-based login
- 30-day session persistence
- JWT token authentication

**Access**:

- All garage user capabilities
- View and manage all garages in the system
- Approve/reject new garage registration requests
- System-wide analytics and reporting
- Garage activation/deactivation

---

## Accessing the Application

### For Garage Users (Phone OTP Login)

1. Navigate to your application URL (e.g., `https://your-garage-app.com`)
2. You'll be redirected to the login page
3. Enter your registered phone number with country code (e.g., `+919876543210`)
4. Complete the reCAPTCHA verification
5. Click **Send OTP**
6. Check your phone for a 6-digit verification code
7. Enter the OTP code and click **Verify \u0026 Sign In**
8. You'll be redirected to your garage dashboard

> **Note**: If you don't have an account yet, see the [Registration Process](#registration-process-new-garages) section below.

> **Security**: OTP codes expire after 5 minutes. If you don't receive the code, check your SMS inbox and try resending.

### For Admin Users (Email/Password Login)

1. Navigate to the admin login page (e.g., `https://your-garage-app.com/auth/admin`)
2. Enter your admin email address
3. Enter your password
4. Click **Sign In**
5. You'll be redirected to the admin dashboard

> **Note**: Admin accounts are created by system administrators only. Contact your system administrator if you need admin access.

---

## Registration Process (New Garages)

If you're a new garage owner wanting to use the system, follow these steps:

### Step 1: Access Registration Page

1. Go to the registration page (e.g., `https://your-garage-app.com/auth/register`)
2. You'll see the garage registration form

### Step 2: Fill in Garage Details

Provide the following information:

- **Garage Name** (Required): Your business name (e.g., "Premium Auto Care")
- **Owner Name** (Required): Full name of the garage owner
- **Phone Number** (Required): Contact number with country code (e.g., `+919876543210`)
- **Email Address** (Required): Valid email for communication
- **Address** (Required): Complete garage address
- **GST Number** (Optional): 15-character GST identification number if applicable

### Step 3: Submit Registration

1. Review all information for accuracy
2. Click **Submit Registration Request**
3. You'll see a confirmation message

### Step 4: Wait for Approval

- Your registration request will be reviewed by an administrator
- You'll receive notification once approved (typically within 24-48 hours)
- After approval, you can log in using your registered phone number

> **Important**: You can only submit one registration request per phone number every 24 hours to prevent spam.

> **Tip**: Make sure your phone number is correct as this will be your login credential.

### Step 5: First Login After Approval

1. Once approved, go to the login page
2. Enter your registered phone number
3. Complete OTP verification
4. Your garage account will be automatically created
5. Complete your profile in Settings

---

## First-Time Setup (For Approved Garages)

After logging in for the first time:

1. **Review Settings**: Go to Settings to verify and complete your garage information
   - Add/update garage name, address, and contact details
   - Add GST number if you have one (affects invoice generation)
2. **Create Message Template**: Set up your first WhatsApp reminder template
   - Go to Templates
   - Create a default template for service reminders
3. **Add Customers**: Start by adding your existing customers
   - Go to Customers
   - Click "Add Customer"
   - Enter customer details
4. **Add Vehicles**: Link vehicles to their respective owners
   - Go to Vehicles
   - Select customer and add vehicle details
5. **Record Services**: Add historical service records if available
   - Go to Services
   - Record past services to build history
6. **Set Up Reminders**: The system will automatically schedule reminders based on service dates

---

## Dashboard Overview

The dashboard is your command center, providing real-time insights into your operations. The dashboard you see depends on your user role.

---

### Garage Dashboard (For Garage Users)

The garage dashboard provides a high-level view of your garage operations.

#### Key Performance Indicators (KPIs)

The dashboard displays four main KPI cards:

1. **Total Customers**
   - Shows the total number of registered customers in your garage
   - Includes all active customer records
   - Click the card to navigate to the Customers page
   - **What it means**: Your customer base size

2. **Total Vehicles**
   - Displays the total number of vehicles under your management
   - Each vehicle is linked to a customer
   - Click the card to navigate to the Vehicles page
   - **What it means**: Total vehicles you service

3. **Services This Month**
   - Number of services completed in the current month
   - Resets on the 1st of each month
   - Helps track monthly workload and revenue
   - **What it means**: Your monthly service volume

4. **Pending Reminders**
   - Count of reminders scheduled but not yet sent
   - Includes reminders for upcoming services
   - Requires action to send WhatsApp messages
   - **What it means**: Customers who need to be contacted

#### Analytics Charts

##### Service Trends Chart

- **Type**: Bar chart
- **Data**: Service volume over the last 6 months
- **Purpose**: Identify busy periods and seasonal trends
- **Use case**: Plan resources, staff scheduling, inventory

##### Reminders Overview Chart

- **Type**: Line chart
- **Data**: Reminders sent vs. services booked over time
- **Purpose**: Track reminder effectiveness and conversion rate
- **Use case**: Optimize reminder timing and messaging

---

### Admin Dashboard (For Admin Users)

The admin dashboard provides system-wide analytics across all garages.

#### System-Wide KPIs

1. **Total Garages**
   - Count of all registered garages in the system
   - Includes active and inactive garages
   - Click to view garage management page

2. **Active Garages**
   - Number of currently operational garages
   - Garages actively using the system
   - **Active Rate**: Percentage of active garages

3. **Inactive Garages**
   - Garages temporarily not in operation
   - Can be reactivated by admin

4. **Pending Registration Requests**
   - New garage registration requests awaiting approval
   - **Critical**: Requires admin action
   - Click to review and approve/reject requests

#### Business Metrics

1. **Total Customers**
   - Aggregate customer count across all garages
   - System-wide customer base

2. **Total Vehicles**
   - All vehicles managed across all garages
   - **Avg Vehicles per Garage**: Calculated metric

3. **Total Services**
   - Completed service records system-wide
   - **Avg Services per Garage**: Calculated metric

#### Reminder Status (System-Wide)

1. **Overdue Reminders**
   - Services past due date across all garages
   - **Critical**: Indicates customer retention risk

2. **Reminders Today**
   - Services due today system-wide
   - Helps monitor daily activity

3. **Upcoming Reminders**
   - Services due in next 7 days
   - **Reminder Rate**: Percentage of vehicles with active reminders

#### Calculated Metrics

The admin dashboard automatically calculates:

- **Active Rate**: `(Active Garages / Total Garages) × 100`
- **Avg Vehicles**: `Total Vehicles / Total Garages`
- **Avg Services**: `Total Services / Total Garages`
- **Reminder Rate**: `(Active Reminders / Total Vehicles) × 100`

---

## Managing Customers

**Location**: Click **Customers** in the sidebar

The Customers page is your central database of vehicle owners.

### Adding a Customer

1. Click the **+ Add Customer** button (top right)
2. Fill in the customer details:
   - **Full Name** (Required)
   - **Phone Number** (Required) - Include country code
   - **Address** (Optional but recommended for invoicing)
3. Click **Add Customer**
4. Success toast will confirm the customer was created

### Viewing Customers

- **Search**: Use the search bar to find customers by name or phone
- **Sort**: Click column headers to sort (Name, Phone, Vehicles, etc.)
- **Pagination**: Navigate through pages if you have many customers

### Editing a Customer

1. Find the customer in the list
2. Click the **Edit** (pencil) icon in the Actions column
3. Update the information in the dialog
4. Click **Update Customer**

### Deleting a Customer

1. Find the customer in the list
2. Click the **Delete** (trash) icon in the Actions column
3. Confirm the deletion in the dialog
4. \u003e **Warning**: This will also delete all associated vehicles and service records

### Exporting Customer Data

1. Click the **Export** button (top right)
2. A CSV file will be downloaded with all customer data
3. Use this for:
   - Marketing campaigns
   - Backup purposes
   - External analysis

---

## Managing Vehicles

**Location**: Click **Vehicles** in the sidebar

Vehicles are the core entity for service tracking. Each vehicle must be linked to a customer.

### Adding a Vehicle

1. Click the **+ Add Vehicle** button
2. **Select Customer**:
   - Use the dropdown to search for an existing customer
   - Type the customer's name or phone number
3. Enter vehicle details:
   - **Model**: e.g., \"Hyundai Creta\", \"Honda Activa\", \"Toyota Camry\"
   - **Number Plate**: e.g., \"KA-01-AB-1234\"
   - **Default Service Interval**: Select from dropdown (3, 6, 9, or 12 months)
4. Click **Add Vehicle**

### Viewing Vehicle Details

Each vehicle row displays:

- **Model**: Vehicle make and model
- **Plate Number**: Registration number
- **Owner**: Customer name (clickable to view customer)
- **Last Service**: Date of most recent service
- **Next Service**: Calculated next service date
- **Status**: Overdue, Due Soon, or OK

### Editing a Vehicle

1. Find the vehicle in the list
2. Click the **Edit** icon
3. Update the information
4. Click **Update Vehicle**

### Viewing Service History

1. Find the vehicle in the list
2. Click the **History** (eye) icon
3. You'll see a chronological timeline of all past services:
   - Service date
   - Interval used
   - Next service date
   - Notes/details
   - Reminders sent

### Deleting a Vehicle

1. Find the vehicle in the list
2. Click the **Delete** icon
3. Confirm the deletion
4. \u003e **Warning**: This will also delete all associated service records

---

## Service History \u0026 Recording

**Location**: Click **Services** in the sidebar

The Services module is the heart of your garage management system, where you record all work performed on vehicles.

---

### Recording a New Service

When a vehicle comes in for work, follow these steps:

#### Step 1: Click Record Service

1. Navigate to the Services page
2. Click the **+ Record Service** button (top right)
3. The service recording form will open

#### Step 2: Select Vehicle

1. Click the **Vehicle** dropdown
2. Search by number plate or model name
3. Select the vehicle
4. Customer information will be displayed automatically

> **Tip**: If the vehicle doesn't exist, you'll need to add it first in the Vehicles section.

#### Step 3: Enter Service Date

1. **Service Date**: Click the date picker
2. Select the date service was performed
3. Defaults to today's date
4. Can be backdated for historical records

#### Step 4: Set Service Interval

1. **Service Interval**: Select from dropdown
   - 3 months
   - 6 months
   - 9 months
   - 12 months
2. This determines when the next service is due
3. **Next Service Date** is calculated automatically: `Service Date + Interval`

#### Step 5: Add Service Items

This is where you record what work was done and the costs:

1. Click **+ Add Item** to add a service item
2. For each item, enter:
   - **Service Description**: What was done (e.g., "Engine Oil Change", "Brake Pad Replacement")
   - **Cost (₹)**: Amount charged for this service

3. Add multiple items as needed:
   - Oil change: ₹800
   - Air filter replacement: ₹300
   - Brake inspection: ₹200
   - Labor charges: ₹500

4. Click the **trash icon** to remove an item if needed

> **Important**: You must add at least one service item to record a service.

#### Step 6: Review Automatic Calculations

The system automatically calculates:

- **Subtotal**: Sum of all service item costs
- **GST** (if GST number is configured in Settings):
  - Default rate: 18%
  - Calculated as: `Subtotal × (GST Rate / 100)`
- **Total Amount**: `Subtotal + GST`

Example:

```
Service Items:
- Engine Oil Change: ₹800
- Oil Filter: ₹200
- Labor: ₹500

Subtotal: ₹1,500
GST (18%): ₹270
Total: ₹1,770
```

#### Step 7: Set Service Status

Select the current status:

- **Completed**: Service finished and vehicle delivered
- **Pending**: Service scheduled but not started
- **In Progress**: Currently working on the vehicle
- **Cancelled**: Service was cancelled

#### Step 8: Add Notes (Optional)

- Add any additional details or observations
- Examples:
  - "Customer reported unusual noise from engine"
  - "Recommended tire replacement in next service"
  - "Used synthetic oil as per customer request"

#### Step 9: Save Service Record

1. Review all information
2. Click **Record Service**
3. Success notification will appear
4. Service is saved and invoice is automatically generated

> **Automatic Actions**: When you save a service:
>
> - Next service date is calculated
> - A reminder is scheduled automatically
> - An invoice is generated and can be accessed immediately

---

### Viewing Service Records

The Services page displays all service records in a table:

**Columns**:

- **Vehicle**: Model and plate number
- **Customer**: Owner name and phone
- **Service Date**: When service was performed
- **Next Service**: Calculated due date
- **Status**: Visual badge (Completed, Pending, In Progress, Cancelled)
- **Total Amount**: Total cost including GST
- **Actions**: Edit, Delete, View Invoice

**Features**:

- **Search**: Find services by vehicle number, customer name, or notes
- **Sort**: Click column headers to sort
- **Pagination**: Navigate through multiple pages

---

### Filtering Services

Use the filter dropdown to view:

- **All Services**: Complete history
- **Completed**: Finished services only
- **Pending**: Scheduled but not started
- **In Progress**: Currently being worked on
- **Cancelled**: Cancelled services
- **This Month**: Services from current month
- **This Year**: Services from current year

---

### Editing a Service Record

1. Find the service in the list
2. Click the **Edit** (pencil) icon in the Actions column
3. The edit form opens with current data
4. Modify any field:
   - Service date
   - Service interval
   - Service items (add, remove, or edit)
   - Status
   - Notes
5. Calculations update automatically
6. Click **Update Service**

> **Note**: Editing a service updates the next service date and recalculates totals.

---

### Deleting a Service Record

1. Find the service in the list
2. Click the **Delete** (trash) icon in the Actions column
3. Confirm the deletion in the dialog
4. Service record is permanently deleted

> **Warning**: Deleting a service does NOT delete the vehicle or customer. Only the service record is removed.

---

### Viewing Invoice

Every service automatically generates an invoice:

1. Find the service in the list
2. Click the **View Invoice** (receipt) icon
3. Opens the invoice in a new page
4. See [Invoice Management](#invoice-management) section for details

---

### Service Status Workflow

Typical status progression:

```
Pending → In Progress → Completed
```

Or:

```
Pending → Cancelled
```

**Status Meanings**:

- **Pending**: Vehicle booked, waiting to start work
- **In Progress**: Currently servicing the vehicle
- **Completed**: Service finished, vehicle ready for pickup
- **Cancelled**: Customer cancelled or service not performed

---

### Best Practices for Service Recording

1. **Record Immediately**: Enter service details right after completion while fresh
2. **Detailed Descriptions**: Use clear, specific service descriptions
   - Good: "Engine Oil Change - 5W-30 Synthetic"
   - Bad: "Oil"
3. **Accurate Costs**: Enter exact amounts charged
4. **Use Notes**: Document important observations or customer requests
5. **Update Status**: Keep status current for workflow tracking
6. **Consistent Naming**: Use standard terms for common services
7. **Complete Items**: Don't forget to include labor charges if applicable

---

## Invoice Management

**Location**: Accessible from Services page → View Invoice button

Every service record automatically generates a professional, print-ready invoice. Invoices are essential for maintaining financial records and providing customers with detailed billing information.

---

### Accessing Invoices

There are two ways to access an invoice:

#### Method 1: From Services Page

1. Go to the **Services** page
2. Find the service record in the table
3. Click the **View Invoice** (receipt) icon in the Actions column
4. Invoice opens in a new page

#### Method 2: Direct URL

- Each invoice has a unique URL: `/invoice/[serviceId]`
- Bookmark or share the link with customers

---

### Invoice Components

The invoice is professionally formatted with the following sections:

#### Header Section

- **Garage Logo**: Placeholder for your business logo
- **Garage Details**:
  - Garage name
  - Complete address
  - Phone number
  - Email address
- **Invoice Title**: "TAX INVOICE"
- **Document Label**: "ORIGINAL" (for customer copy)

#### Billing Information

- **Bill To**:
  - Customer name
  - Customer address
  - Customer phone number
- **Company Details**:
  - GSTIN (if configured)
  - PAN number (if applicable)

#### Order Details Grid

Displays key information in a grid format:

- **Invoice Number**: Format `INV-YYYYMMDD-XXXXX`
  - Example: `INV-20260129-00123`
- **Invoice Date**: Date invoice was generated
- **Vehicle Number**: Registration plate
- **Vehicle Model**: Make and model
- **Service Date**: When service was performed
- **Service Status**: Current status badge

#### Service Items Table

Professional table with:

- **S.No**: Serial number (1, 2, 3...)
- **Description**: Service item description
- **Amount (₹)**: Cost for each item

Features:

- Minimum 8 rows displayed for professional appearance
- Empty rows shown as dashes (---)
- **Total** row at bottom with subtotal

#### Tax Breakdown Section

Detailed tax calculations:

- **Taxable Value**: Subtotal before tax
- **SGST** (State GST): GST ÷ 2
- **CGST** (Central GST): GST ÷ 2
- **IGST** (Integrated GST): ₹0.00 (for inter-state transactions, currently not implemented)

Example:

```
Taxable Value: ₹1,500.00
SGST (9%): ₹135.00
CGST (9%): ₹135.00
IGST (0%): ₹0.00
```

#### Invoice Summary

- **Subtotal**: Sum of all service items
- **GST**: Total tax amount
- **Grand Total**: Final amount (highlighted and bold)

#### Footer Section

- **Remarks/Notes**: Service notes or special instructions
- **Company GSTIN**: Your GST identification number
- **Next Service Due**: Calculated next service date
- **Thank You Message**: "Thank you for your business!"

---

### Invoice Number Format

Invoice numbers are automatically generated using the format:

```
INV-YYYYMMDD-XXXXX
```

**Components**:

- `INV`: Invoice prefix
- `YYYYMMDD`: Date (Year-Month-Day)
  - Example: `20260129` for January 29, 2026
- `XXXXX`: Sequential number for that day
  - Starts at 00001 each day

**Examples**:

- `INV-20260129-00001`: First invoice on Jan 29, 2026
- `INV-20260129-00042`: 42nd invoice on Jan 29, 2026
- `INV-20260130-00001`: First invoice on Jan 30, 2026

---

### Printing Invoices

The invoice is optimized for printing:

#### To Print:

1. Open the invoice
2. Click the **Print** button in the header
3. Or use browser print: `Ctrl + P` (Windows) or `Cmd + P` (Mac)
4. Select your printer
5. Click **Print**

#### Print Optimization:

- **Page Size**: A4 (standard)
- **Orientation**: Portrait
- **Margins**: Optimized for professional appearance
- **Print-Specific Styling**:
  - Removes unnecessary UI elements
  - Optimizes colors for print
  - Ensures proper page breaks

> **Tip**: For best results, use "Print to PDF" to save a digital copy before printing.

---

### Tax Calculations Explained

Understanding the tax breakdown on your invoices:

#### GST Rate

- Default: **18%** (configurable in backend)
- Applied to subtotal of all service items

#### Tax Split (Intra-State)

For services within the same state:

- **SGST**: 9% (State Goods and Services Tax)
- **CGST**: 9% (Central Goods and Services Tax)
- **Total**: 18%

#### Tax Split (Inter-State)

For services across state borders:

- **IGST**: 18% (Integrated Goods and Services Tax)
- **SGST/CGST**: ₹0.00

> **Note**: Currently, the system assumes all transactions are intra-state. Inter-state GST handling may be added in future updates.

#### Example Calculation:

```
Service Items:
- Engine Oil Change: ₹800
- Oil Filter: ₹200
- Labor: ₹500

Subtotal: ₹1,500
GST (18%): ₹270
  - SGST (9%): ₹135
  - CGST (9%): ₹135

Grand Total: ₹1,770
```

---

### Invoice Best Practices

1. **Verify Before Printing**: Always review invoice details before printing
2. **GST Configuration**: Ensure your GST number is set in Settings for proper tax display
3. **Complete Address**: Keep customer addresses updated for accurate billing
4. **Digital Copies**: Save PDF copies for your records
5. **Customer Copies**: Print and provide to customers at service completion
6. **Record Keeping**: Maintain invoice copies for tax and audit purposes

---

## Reminders System

**Location**: Click **Reminders** in the sidebar

The Reminders system helps you retain customers by sending timely WhatsApp notifications.

### Reminder Tabs

The Reminders page has three tabs:

#### 1. Today

- Reminders scheduled for the current day
- Automatically generated based on service dates
- Ready to be sent

#### 2. Upcoming

- Reminders due in the next 7 days
- Helps you plan ahead
- Preview upcoming workload

#### 3. Overdue

- Customers who missed their service date
- Requires immediate follow-up
- Critical for customer retention

### Sending a Manual Reminder

1. Navigate to the appropriate tab (Today, Upcoming, or Overdue)
2. Find the customer/vehicle in the list
3. Click the **Send WhatsApp** button
4. The reminder will be sent immediately via WhatsApp
5. Status will update to \"Sent\"

### Reminder Information

Each reminder displays:

- Customer name and phone number
- Vehicle model and plate number
- Service due date
- Days overdue (if applicable)
- Last reminder sent date
- Reminder status

### Automatic Reminders

\u003e **Note**: If your backend has the scheduler enabled, reminders are sent automatically based on the configured schedule (e.g., 7 days before service due date).

---

## Message Templates

**Location**: Click **Templates** in the sidebar

Templates allow you to create reusable message formats for WhatsApp reminders.

### Creating a Template

1. Click the **+ Add Template** button
2. Enter template details:
   - **Template Name**: e.g., \"Standard Service Reminder\"
   - **Message Content**: The text that will be sent
3. Use placeholders for dynamic content:
   - \`{customerName}\` - Customer's name
   - \`{vehicleModel}\` - Vehicle model
   - \`{plateNumber}\` - Vehicle plate number
   - \`{serviceDate}\` - Next service date
   - \`{garageName}\` - Your garage name
4. Click **Create Template**

### Example Template

\`\`\`
Hello {customerName},

This is a friendly reminder that your {vehicleModel} ({plateNumber}) is due for service on {serviceDate}.

Please contact us to schedule your appointment.

Thank you,
{garageName}
\`\`\`

### Editing a Template

1. Find the template in the list
2. Click the **Edit** icon
3. Update the content
4. Click **Update Template**

### Deleting a Template

1. Find the template in the list
2. Click the **Delete** icon
3. Confirm the deletion

---

## Settings

**Location**: Click **Settings** in the sidebar

### Garage Profile

Update your garage information:

- **Garage Name**: Your business name
- **Phone Number**: Contact number
- **Address**: Physical location
- **GST Number**: Tax identification (if applicable)

### Account Settings

- **Change Password**: Update your login credentials (if using email/password)
- **Notification Preferences**: Configure reminder settings

### API Integration

\u003e **For Developers**: View API keys for WhatsApp and Firebase integration

---

## Admin Features

**Access**: Admin users only (email/password authentication)

**Location**: Admin dashboard and sidebar

This section covers features exclusive to system administrators who manage multiple garages.

---

### Admin Dashboard

The admin dashboard provides a bird's-eye view of the entire system.

#### Accessing Admin Dashboard

1. Log in with admin credentials at `/auth/admin`
2. You'll be redirected to `/admin/dashboard`
3. View system-wide statistics and metrics

#### Dashboard Features

See the [Admin Dashboard](#admin-dashboard-for-admin-users) section under Dashboard Overview for complete details on:

- System-wide KPIs
- Business metrics
- Reminder status across all garages
- Calculated performance metrics

---

### Garage Management

Admins can view and manage all garages in the system.

#### Viewing All Garages

1. Click **Garages** in the admin sidebar
2. View table of all registered garages

**Table Columns**:

- **Garage Name**: Business name
- **Owner/Contact**: Primary contact person
- **Phone**: Contact number
- **Email**: Email address
- **Status**: Active or Inactive badge
- **Customers**: Number of customers
- **Vehicles**: Number of vehicles
- **Services**: Total services performed
- **Created**: Registration date
- **Actions**: Edit, Delete

**Features**:

- **Search**: Find garages by name, phone, or email
- **Filter**: View Active, Inactive, or All garages
- **Sort**: Click column headers to sort
- **Pagination**: Navigate through multiple pages

#### Viewing Garage Details

1. Find the garage in the list
2. Click the garage name or **View** button
3. See complete garage profile:
   - Contact information
   - GST details
   - Statistics (customers, vehicles, services)
   - Registration date
   - Verification status
   - Activity status

#### Editing Garage Information

1. Find the garage in the list
2. Click the **Edit** (pencil) icon
3. Update editable fields:
   - Garage name
   - Email address
   - Address
   - GST number
4. Click **Update Garage**

> **Note**: Phone number cannot be changed as it's the login credential.

#### Activating/Deactivating Garages

**To Deactivate** (temporarily disable):

1. Edit the garage
2. Set status to **Inactive**
3. Save changes
4. Garage users cannot log in while inactive

**To Reactivate**:

1. Edit the garage
2. Set status to **Active**
3. Save changes
4. Garage users can log in again

> **Use Case**: Temporarily disable garages for non-payment, maintenance, or other reasons without deleting data.

#### Deleting a Garage

1. Find the garage in the list
2. Click the **Delete** (trash) icon
3. Review the deletion warning
4. Confirm deletion

> **CRITICAL WARNING**: Deleting a garage permanently removes:
>
> - The garage account
> - All customers
> - All vehicles
> - All service records
> - All reminders
> - All templates
> - All settings
>
> This action CANNOT be undone!

**When to Delete**:

- Garage permanently closed
- Duplicate or test accounts
- Fraudulent registrations

**Alternative**: Consider deactivating instead of deleting to preserve data.

---

### Registration Request Management

Admins review and approve new garage registration requests.

#### Viewing Registration Requests

1. Click **Registration Requests** in the admin sidebar
2. View table of all requests

**Table Columns**:

- **Garage Name**: Requested business name
- **Owner Name**: Owner's full name
- **Phone**: Contact number
- **Email**: Email address
- **Address**: Garage location
- **GST Number**: Tax ID (if provided)
- **Status**: Pending, Approved, or Rejected badge
- **Submitted**: Request date and time
- **Actions**: Approve, Reject, Delete

**Status Filter**:

- **Pending**: Awaiting admin action (default view)
- **Approved**: Already approved and garage created
- **Rejected**: Declined requests
- **All**: View all requests

#### Reviewing a Request

1. Find the request in the Pending tab
2. Review all submitted information:
   - Garage name and owner name
   - Contact details (phone and email)
   - Complete address
   - GST number (if applicable)
   - Submission date

3. Verify information:
   - Check if phone number is valid
   - Verify email format
   - Ensure address is complete
   - Validate GST number if provided

#### Approving a Registration Request

When a request looks legitimate:

1. Find the request in the Pending tab
2. Click the **Approve** (checkmark) button
3. Confirm approval in the dialog
4. System automatically:
   - Creates a new garage account
   - Sets status to "Approved"
   - Enables the phone number for OTP login
   - Sends notification (if configured)

5. The garage owner can now:
   - Log in using their registered phone number
   - Complete their profile
   - Start using the system

> **Important**: Once approved, the garage account is created immediately. The owner can log in right away.

#### Rejecting a Registration Request

When a request is suspicious, incomplete, or invalid:

1. Find the request in the Pending tab
2. Click the **Reject** (X) button
3. Optionally enter a rejection reason:
   - "Incomplete information"
   - "Invalid contact details"
   - "Duplicate registration"
   - "Suspected fraud"
4. Confirm rejection
5. Status changes to "Rejected"

**What Happens**:

- No garage account is created
- Phone number remains blocked for 24 hours (rate limit)
- Request moves to Rejected tab
- Can be deleted later if needed

> **Tip**: Add a clear rejection reason to help track why requests were declined.

#### Deleting a Registration Request

To clean up old or processed requests:

1. Find the request (usually in Approved or Rejected tab)
2. Click the **Delete** (trash) icon
3. Confirm deletion
4. Request is permanently removed

> **Note**: Deleting an approved request does NOT delete the created garage. It only removes the registration request record.

**When to Delete**:

- Clean up old approved requests
- Remove rejected spam requests
- Maintain a clean request list

#### Registration Request Best Practices

1. **Review Promptly**: Check pending requests daily
2. **Verify Details**: Ensure phone and email are valid
3. **Check for Duplicates**: Search existing garages before approving
4. **Document Rejections**: Always add a reason when rejecting
5. **Clean Up Regularly**: Delete old approved/rejected requests monthly
6. **Monitor Patterns**: Watch for suspicious registration patterns

---

### Admin Workflow Examples

#### Workflow: Processing New Registration

1. **Notification**: Check admin dashboard for pending requests count
2. **Review**: Go to Registration Requests → Pending tab
3. **Verify**: Check all submitted information
4. **Decision**:
   - If valid → Click Approve → Confirm
   - If invalid → Click Reject → Add reason → Confirm
5. **Follow-up**: Garage owner receives notification and can log in

#### Workflow: Managing Problem Garage

1. **Identify Issue**: Customer complaint or payment issue
2. **Review**: Go to Garages → Find the garage
3. **Action**:
   - Temporary issue → Edit → Set to Inactive → Save
   - Permanent closure → Delete (after confirming with owner)
4. **Monitor**: Check if issue is resolved
5. **Reactivate**: Edit → Set to Active → Save (if resolved)

#### Workflow: System Health Check

1. **Dashboard**: Review admin dashboard metrics
2. **Check Metrics**:
   - Active rate (should be high)
   - Pending requests (should be low)
   - Overdue reminders (monitor for issues)
3. **Investigate**: If metrics look unusual, drill down into specific garages
4. **Take Action**: Contact garages with issues or deactivate inactive ones

---

## Common Workflows

This section provides step-by-step workflows for common tasks in the system.

---

### Workflow 1: New Customer Walk-In (Garage User)

Complete process from customer arrival to service completion:

1. **Add Customer** (Customers page)
   - Click "+ Add Customer"
   - Name: John Doe
   - Phone: +919876543210
   - Address: 123 Main Street, Mumbai
   - Click "Add Customer"

2. **Add Vehicle** (Vehicles page)
   - Click "+ Add Vehicle"
   - Select Customer: John Doe
   - Model: Honda City
   - Plate: MH-12-AB-1234
   - Click "Add Vehicle"

3. **Record Service** (Services page)
   - Click "+ Record Service"
   - Select Vehicle: Honda City (MH-12-AB-1234)
   - Service Date: Today
   - Interval: 6 months
   - Add Service Items:
     - Engine Oil Change - 5W-30: ₹800
     - Oil Filter: ₹200
     - Labor: ₹500
   - Status: Completed
   - Notes: "Customer requested synthetic oil"
   - Review totals (Subtotal: ₹1,500, GST: ₹270, Total: ₹1,770)
   - Click "Record Service"

4. **Generate Invoice**
   - Click "View Invoice" from the service record
   - Review invoice details
   - Click "Print" to provide customer copy

5. **System Automatically**:
   - Calculates next service date (6 months from today)
   - Schedules a reminder for 7 days before due date
   - Generates invoice with unique number

---

### Workflow 2: Service with Invoice Generation

Recording a service and providing invoice to customer:

1. **Record Service** (as described in Workflow 1)
2. **Access Invoice**: Click "View Invoice" icon
3. **Review Invoice**: Check all details are correct
4. **Print Invoice**:
   - Click "Print" button
   - Or use Ctrl+P (Windows) / Cmd+P (Mac)
5. **Provide to Customer**: Give printed invoice
6. **Digital Copy** (Optional):
   - Print to PDF
   - Email to customer
   - Save for records

---

### Workflow 3: Sending Overdue Reminders

Following up with customers who missed their service:

1. Go to **Reminders** page
2. Click **Overdue** tab
3. Review the list of overdue services
4. For each customer:
   - Review vehicle and service details
   - Click **Send WhatsApp** button
   - System sends reminder immediately
   - Status updates to "Sent"
5. **Follow-up**: Call customers who don't respond within 2-3 days
6. **Track**: Monitor which customers book appointments

---

### Workflow 4: Monthly Business Review (Garage User)

Reviewing your garage's monthly performance:

1. Go to **Dashboard**
2. Review KPI cards:
   - Total customers (growth tracking)
   - Total vehicles (capacity planning)
   - Services this month (revenue indicator)
   - Pending reminders (action items)
3. Check **Service Trends Chart**:
   - Compare current month to previous months
   - Identify busy periods
4. Review **Reminders Overview**:
   - Check reminder effectiveness
   - Adjust timing if needed
5. Go to **Services** page:
   - Filter by "This Month"
   - Review total revenue
   - Identify top services
6. **Export Data** (if needed):
   - Go to Customers page
   - Click "Export" for customer list
   - Use for marketing or analysis

---

### Workflow 5: New Garage Onboarding (New Garage Owner)

Complete process from registration to first service:

#### Phase 1: Registration

1. **Submit Registration**:
   - Go to registration page
   - Fill in all details (garage name, owner, phone, email, address, GST)
   - Submit request
   - Wait for admin approval (24-48 hours)

2. **Receive Approval**:
   - Get notification of approval
   - Note your registered phone number

#### Phase 2: First Login

3. **Log In**:
   - Go to login page
   - Enter registered phone number
   - Complete OTP verification
   - Account automatically created

4. **Complete Profile**:
   - Go to Settings
   - Verify garage information
   - Add/update GST number
   - Save changes

#### Phase 3: Setup

5. **Create Message Template**:
   - Go to Templates
   - Click "+ Add Template"
   - Name: "Standard Service Reminder"
   - Message: "Hello {customerName}, your {vehicleModel} ({vehicleNumber}) is due for service on {serviceDate}. Please contact {garageName} at {garagePhone}."
   - Set as default
   - Save

6. **Add First Customer**:
   - Go to Customers
   - Add customer details
   - Save

7. **Add First Vehicle**:
   - Go to Vehicles
   - Select customer
   - Add vehicle details
   - Save

8. **Record First Service**:
   - Go to Services
   - Record service with items and costs
   - Generate invoice
   - System schedules reminder

#### Phase 4: Operations

9. **Monitor Dashboard**:
   - Check KPIs daily
   - Review upcoming reminders

10. **Send Reminders**:
    - Review reminder list
    - Send WhatsApp messages
    - Track responses

---

### Workflow 6: Admin Approval Process (Admin)

Processing new garage registration requests:

1. **Check Dashboard**:
   - Log in to admin panel
   - Review "Pending Registration Requests" count
   - Note if action needed

2. **Review Requests**:
   - Go to Registration Requests
   - Click Pending tab
   - Review each request

3. **Verify Information**:
   - Check phone number format
   - Verify email is valid
   - Ensure address is complete
   - Validate GST number (if provided)
   - Search for duplicates

4. **Make Decision**:

   **If Approving**:
   - Click "Approve" button
   - Confirm approval
   - Garage account created automatically
   - Owner can log in immediately

   **If Rejecting**:
   - Click "Reject" button
   - Enter rejection reason
   - Confirm rejection
   - No account created

5. **Clean Up** (Weekly):
   - Go to Approved tab
   - Delete old approved requests
   - Go to Rejected tab
   - Delete spam/invalid requests

---

### Workflow 7: Managing Inactive Garage (Admin)

Temporarily disabling a garage:

1. **Identify Issue**:
   - Payment overdue
   - Maintenance required
   - Customer complaint

2. **Review Garage**:
   - Go to Garages
   - Find the garage
   - Review statistics and details

3. **Deactivate**:
   - Click "Edit"
   - Set Status to "Inactive"
   - Save changes
   - Garage users cannot log in

4. **Communicate**:
   - Contact garage owner
   - Explain reason for deactivation
   - Provide resolution steps

5. **Monitor**:
   - Check if issue resolved
   - Verify payment received (if applicable)

6. **Reactivate**:
   - Edit garage
   - Set Status to "Active"
   - Save changes
   - Notify owner they can log in again

---

## Quick Reference

This section provides quick lookup tables and reference information for common tasks.

---

### User Roles Comparison

| Feature                   | Garage User               | Admin User                  |
| ------------------------- | ------------------------- | --------------------------- |
| **Authentication**        | Phone OTP (Firebase)      | Email/Password (JWT)        |
| **Dashboard**             | Garage-specific metrics   | System-wide analytics       |
| **Customers**             | Manage own customers      | View all garages' customers |
| **Vehicles**              | Manage own vehicles       | View all garages' vehicles  |
| **Services**              | Record own services       | View all garages' services  |
| **Invoices**              | Generate for own services | View all invoices           |
| **Reminders**             | Send to own customers     | View all reminders          |
| **Templates**             | Create own templates      | View all templates          |
| **Settings**              | Update own garage info    | Update any garage info      |
| **Garage Management**     | ❌ No access              | ✅ Full access              |
| **Registration Requests** | ❌ No access              | ✅ Approve/Reject           |
| **Multi-Garage View**     | ❌ No access              | ✅ Full access              |

---

### Data Hierarchy

Understanding how data is organized in the system:

```
Garage (Your Business)
│
├── Customers (Vehicle Owners)
│   │
│   └── Vehicles (Cars/Bikes)
│       │
│       └── Services (Work Performed)
│           │
│           ├── Service Items (Individual Tasks)
│           │   └── Costs (Pricing)
│           │
│           ├── Invoices (Billing Documents)
│           │   └── Tax Calculations (GST)
│           │
│           └── Reminders (WhatsApp Notifications)
│
├── Templates (Message Formats)
│
└── Settings (Garage Configuration)
```

**Cascade Deletion Rules**:

- Delete Garage → Deletes everything
- Delete Customer → Deletes all their vehicles and services
- Delete Vehicle → Deletes all its services
- Delete Service → Keeps vehicle and customer, removes only service record

---

### Status Indicators

#### Service Status

| Status          | Color  | Meaning                             | Next Action       |
| --------------- | ------ | ----------------------------------- | ----------------- |
| **Pending**     | Yellow | Service scheduled, not started      | Begin work        |
| **In Progress** | Blue   | Currently working on vehicle        | Complete service  |
| **Completed**   | Green  | Service finished, vehicle delivered | Generate invoice  |
| **Cancelled**   | Red    | Service was cancelled               | Archive or delete |

#### Reminder Status

| Status      | Color | Meaning                 | Next Action           |
| ----------- | ----- | ----------------------- | --------------------- |
| **Pending** | Gray  | Scheduled, not sent yet | Wait or send manually |
| **Sent**    | Green | Successfully delivered  | Monitor for response  |
| **Failed**  | Red   | Delivery failed         | Check number, resend  |

#### Garage Status (Admin)

| Status       | Badge | Meaning              | Access            |
| ------------ | ----- | -------------------- | ----------------- |
| **Active**   | Green | Operational, in use  | Full login access |
| **Inactive** | Gray  | Temporarily disabled | Login blocked     |

#### Registration Status (Admin)

| Status       | Badge  | Meaning          | Action Available      |
| ------------ | ------ | ---------------- | --------------------- |
| **Pending**  | Yellow | Awaiting review  | Approve or Reject     |
| **Approved** | Green  | Account created  | Delete request record |
| **Rejected** | Red    | Request declined | Delete request record |

---

### Template Variables Reference

Use these placeholders in message templates - they'll be automatically replaced:

| Variable            | Replaced With          | Example Output      |
| ------------------- | ---------------------- | ------------------- |
| `{customerName}`    | Customer's full name   | "John Doe"          |
| `{vehicleModel}`    | Vehicle make and model | "Honda City"        |
| `{vehicleNumber}`   | Registration plate     | "MH-12-AB-1234"     |
| `{nextServiceDate}` | Next service due date  | "15/02/2026"        |
| `{serviceDate}`     | Last service date      | "15/08/2025"        |
| `{garageName}`      | Your garage name       | "Premium Auto Care" |
| `{garagePhone}`     | Your contact number    | "+919876543210"     |

**Example Template**:

```
Hello {customerName},

Your {vehicleModel} ({vehicleNumber}) is due for service on {nextServiceDate}.

Please contact {garageName} at {garagePhone} to schedule your appointment.

Thank you!
```

**Rendered Output**:

```
Hello John Doe,

Your Honda City (MH-12-AB-1234) is due for service on 15/02/2026.

Please contact Premium Auto Care at +919876543210 to schedule your appointment.

Thank you!
```

---

### Common Field Formats

#### Phone Numbers

- **Format**: Country code + number
- **Examples**:
  - India: `+919876543210`
  - US: `+11234567890`
- **Validation**: Must include `+` and country code

#### Number Plates

- **Format**: State-District-Series-Number
- **Examples**:
  - `MH-12-AB-1234` (Maharashtra)
  - `DL-01-CD-5678` (Delhi)
  - `KA-03-EF-9012` (Karnataka)
- **Validation**: Alphanumeric, hyphens allowed

#### GST Numbers

- **Format**: 15 characters
- **Example**: `27AAPFU0939F1ZV`
- **Validation**: Exactly 15 characters if provided

#### Invoice Numbers

- **Format**: `INV-YYYYMMDD-XXXXX`
- **Example**: `INV-20260129-00042`
- **Auto-generated**: Cannot be manually set

---

### Keyboard Shortcuts

| Shortcut               | Action               | Context                           |
| ---------------------- | -------------------- | --------------------------------- |
| `Ctrl + P` / `Cmd + P` | Print invoice        | Invoice page                      |
| `Esc`                  | Close dialog/modal   | Any dialog                        |
| `Tab`                  | Navigate form fields | Any form                          |
| `Enter`                | Submit form          | Any form (when focused on button) |

---

### Currency Format

All amounts are displayed in Indian Rupees (₹):

- **Format**: ₹1,234.56
- **Decimal Places**: 2 (always)
- **Thousands Separator**: Comma (,)
- **Examples**:
  - ₹800.00
  - ₹1,500.00
  - ₹12,345.67

---

### Date Formats

| Context             | Format           | Example          |
| ------------------- | ---------------- | ---------------- |
| **Display**         | DD/MM/YYYY       | 29/01/2026       |
| **Invoice**         | DD/MM/YYYY       | 29/01/2026       |
| **Service Records** | DD/MM/YYYY       | 29/01/2026       |
| **Timestamps**      | DD/MM/YYYY HH:MM | 29/01/2026 14:30 |

---

### GST Calculation Reference

| Subtotal | GST (18%) | SGST (9%) | CGST (9%) | Total   |
| -------- | --------- | --------- | --------- | ------- |
| ₹1,000   | ₹180      | ₹90       | ₹90       | ₹1,180  |
| ₹1,500   | ₹270      | ₹135      | ₹135      | ₹1,770  |
| ₹2,000   | ₹360      | ₹180      | ₹180      | ₹2,360  |
| ₹5,000   | ₹900      | ₹450      | ₹450      | ₹5,900  |
| ₹10,000  | ₹1,800    | ₹900      | ₹900      | ₹11,800 |

**Formula**: `Total = Subtotal + (Subtotal × 0.18)`

---

## Troubleshooting

This section covers common issues and their solutions for both garage users and admins.

---

### Login Issues

#### Problem: Not Receiving OTP (Garage Users)

**Solutions**:

- Verify your phone number is registered and approved by admin
- Ensure you included the country code (e.g., `+91` for India)
- Check your phone's SMS inbox and spam folder
- Wait 1-2 minutes for SMS delivery
- Try resending the OTP
- Verify your phone has cellular signal
- Contact your administrator if issue persists

#### Problem: "Invalid Verification Code"

**Solutions**:

- Ensure you entered all 6 digits correctly
- Check if the code has expired (codes expire after 5 minutes)
- Request a new OTP
- Don't refresh the page while entering OTP
- Clear browser cache and try again

#### Problem: Admin Login Fails

**Solutions**:

- Verify you're using the correct email address
- Check password for typos (passwords are case-sensitive)
- Ensure you're on the admin login page (`/auth/admin`)
- Clear browser cookies and try again
- Contact system administrator to reset password

---

### Registration Issues (New Garages)

#### Problem: "Too Many Requests" Error

**Cause**: Rate limiting - one request per phone number per 24 hours

**Solutions**:

- Wait 24 hours before submitting again
- Use a different phone number if legitimate
- Contact admin if you made an error in your submission

#### Problem: Registration Not Approved

**Possible Reasons**:

- Incomplete information
- Invalid phone number or email
- Duplicate registration
- Admin hasn't reviewed yet (wait 24-48 hours)

**Actions**:

- Wait for admin review (typically 24-48 hours)
- Ensure all information was correct
- Contact admin for status update
- Check email for rejection notification

---

### Data Not Loading

#### Problem: Pages Show Loading Spinner Indefinitely

**Solutions**:

- Check your internet connection
- Refresh the page (`F5` or `Ctrl+R`)
- Clear browser cache and cookies:
  - Chrome: `Ctrl+Shift+Delete`
  - Firefox: `Ctrl+Shift+Delete`
  - Safari: `Cmd+Option+E`
- Try a different browser (Chrome, Firefox, Edge)
- Check if backend API is running (for developers)
- Contact support if issue persists

#### Problem: Dashboard Shows Zero for All Metrics

**Causes**:

- No data has been added yet (new garage)
- Database connection issue
- Permission problem

**Solutions**:

- Add customers, vehicles, and services first
- Refresh the page
- Log out and log back in
- Contact administrator

---

### Service Recording Issues

#### Problem: Cannot Add Service Items

**Solutions**:

- Ensure JavaScript is enabled in browser
- Try clicking "+ Add Item" button again
- Refresh the page and try again
- Clear browser cache
- Try a different browser

#### Problem: GST Not Calculating

**Causes**:

- GST number not configured in Settings
- Invalid service item costs
- JavaScript error

**Solutions**:

- Go to Settings and add your GST number
- Ensure all costs are valid numbers
- Refresh the page
- Check browser console for errors (F12)

#### Problem: "Vehicle Not Found" Error

**Solutions**:

- Verify the vehicle exists in Vehicles page
- Ensure vehicle belongs to your garage
- Refresh the vehicle dropdown
- Try adding the vehicle again

---

### Invoice Generation Issues

#### Problem: Invoice Not Displaying

**Solutions**:

- Ensure service has at least one service item
- Check that service was saved successfully
- Try accessing invoice via Services page → View Invoice
- Clear browser cache
- Try direct URL: `/invoice/[serviceId]`

#### Problem: Invoice Printing Issues

**Solutions**:

- Use the Print button in the invoice header
- Try browser print: `Ctrl+P` (Windows) or `Cmd+P` (Mac)
- Check printer connection
- Try "Print to PDF" first to verify invoice renders correctly
- Ensure pop-ups are not blocked
- Try a different browser

#### Problem: Wrong GST Amount on Invoice

**Causes**:

- GST number not configured
- Incorrect service item costs
- Calculation error

**Solutions**:

- Verify GST number in Settings
- Check service item costs are correct
- Recalculate: Edit service → Save again
- Contact support if calculations still wrong

---

### WhatsApp Reminders Issues

#### Problem: Reminders Show "Failed" Status

**Causes**:

- Invalid customer phone number
- WhatsApp Business API not configured
- Customer's number not registered with WhatsApp
- Network connectivity issue

**Solutions**:

- Verify customer's phone number is correct and includes country code
- Ensure phone number is registered with WhatsApp
- Check WhatsApp Business API configuration (admin/developer)
- Try resending the reminder
- Contact administrator to check backend logs

#### Problem: Reminders Not Sending Automatically

**Causes**:

- Scheduler not enabled on backend
- Cron job not running
- Configuration issue

**Solutions**:

- Send reminders manually from Reminders page
- Contact administrator to enable scheduler
- Verify backend cron jobs are running (admin/developer)

#### Problem: Customer Not Receiving Reminders

**Solutions**:

- Verify customer's phone number is correct
- Check reminder status (should be "Sent")
- Ensure customer has WhatsApp installed
- Ask customer to check WhatsApp spam/archived chats
- Try sending a manual reminder
- Verify phone number format includes country code

---

### Admin-Specific Issues

#### Problem: Cannot See Registration Requests

**Solutions**:

- Verify you're logged in as admin (not garage user)
- Check you're on the correct page (`/admin/registration-requests`)
- Ensure there are pending requests
- Try filtering by "All" status
- Refresh the page

#### Problem: Garage Deactivation Not Working

**Solutions**:

- Ensure you clicked "Save" after changing status
- Refresh the garages list
- Check if garage users are still logged in (they need to log out)
- Clear browser cache
- Try again

#### Problem: Cannot Delete Garage

**Causes**:

- Confirmation dialog not appearing
- JavaScript error
- Permission issue

**Solutions**:

- Ensure pop-ups are not blocked
- Try a different browser
- Check browser console for errors (F12)
- Verify you have admin permissions
- Contact system administrator

---

### Export Issues

#### Problem: CSV Export Button Doesn't Download File

**Solutions**:

- Check if browser is blocking downloads
- Disable popup blockers for this site
- Try a different browser
- Ensure you have data to export (customers/services exist)
- Check browser's download folder
- Try right-click → "Save link as"

---

### Performance Issues

#### Problem: Application Running Slowly

**Solutions**:

- Close unnecessary browser tabs
- Clear browser cache and cookies
- Restart your browser
- Check internet connection speed
- Try during off-peak hours
- Use a modern browser (latest Chrome, Firefox, or Edge)
- Contact administrator if issue persists

#### Problem: Large Data Sets Taking Long to Load

**Solutions**:

- Use search and filters to narrow results
- Use pagination instead of viewing all records
- Export data for offline analysis if needed
- Contact administrator about database optimization

---

### Browser Compatibility

**Recommended Browsers**:

- ✅ Google Chrome (latest version)
- ✅ Mozilla Firefox (latest version)
- ✅ Microsoft Edge (latest version)
- ✅ Safari (latest version)

**Not Recommended**:

- ❌ Internet Explorer (not supported)
- ❌ Older browser versions

**If experiencing issues**:

1. Update your browser to the latest version
2. Try a different recommended browser
3. Clear cache and cookies
4. Disable browser extensions temporarily

---

### Getting Additional Help

If you've tried the solutions above and still experiencing issues:

1. **Take a Screenshot**: Capture the error message or problem
2. **Note the Steps**: Write down what you were doing when the issue occurred
3. **Check Browser Console**: Press `F12`, go to Console tab, screenshot any red errors
4. **Contact Support**:
   - **Garage Users**: Contact your system administrator
   - **Admins**: Contact the development team or technical support
5. **Provide Details**:
   - What you were trying to do
   - Error message (if any)
   - Browser and version
   - Operating system
   - Screenshots

---

## Best Practices

### For Garage Users

#### Data Entry

1. **Record Services Immediately**: Enter service details right after completion while information is fresh
2. **Use Detailed Descriptions**: Be specific in service item descriptions
   - ✅ Good: "Engine Oil Change - 5W-30 Synthetic, 4L"
   - ❌ Bad: "Oil"
3. **Accurate Costs**: Enter exact amounts charged to customers
4. **Complete Customer Information**: Always include customer address for invoicing
5. **Verify Phone Numbers**: Double-check phone numbers before saving (they're used for login and reminders)

#### Service Management

1. **Consistent Naming**: Use standard terms for common services
   - Oil Change, Brake Service, Tire Rotation, etc.
2. **Include Labor**: Don't forget to add labor charges as a service item
3. **Update Status**: Keep service status current (Pending → In Progress → Completed)
4. **Add Notes**: Document important observations or customer requests
5. **Set Realistic Intervals**: Choose appropriate service intervals based on vehicle type and usage

#### Customer Communication

1. **Timely Reminders**: Send reminders 7-10 days before service due date
2. **Follow Up**: Call customers who don't respond to WhatsApp within 2-3 days
3. **Professional Templates**: Use clear, professional language in message templates
4. **Personalize**: Use template variables to personalize messages
5. **Track Responses**: Monitor which customers book appointments after reminders

#### Financial Management

1. **Regular Invoicing**: Generate and provide invoices for all completed services
2. **GST Compliance**: Ensure GST number is configured if applicable
3. **Print Copies**: Provide printed invoice copies to customers
4. **Digital Backup**: Save PDF copies of invoices for records
5. **Monthly Review**: Export data monthly for accounting and tax purposes

#### Data Management

1. **Regular Backups**: Export customer data monthly as backup
2. **Clean Data**: Remove duplicate or test entries
3. **Update Information**: Keep customer addresses and phone numbers current
4. **Archive Carefully**: Think twice before deleting - consider marking inactive instead

### For Admin Users

#### Registration Management

1. **Review Promptly**: Check pending requests daily
2. **Verify Thoroughly**: Validate phone numbers, emails, and addresses
3. **Check Duplicates**: Search existing garages before approving
4. **Document Rejections**: Always add clear rejection reasons
5. **Clean Up Regularly**: Delete old approved/rejected requests monthly
6. **Monitor Patterns**: Watch for suspicious registration patterns or spam

#### Garage Management

1. **Regular Monitoring**: Review system-wide metrics weekly
2. **Proactive Communication**: Contact garages with unusual activity
3. **Use Deactivation**: Prefer deactivating over deleting to preserve data
4. **Document Actions**: Keep notes on why garages were deactivated/deleted
5. **Support Garages**: Help new garages with onboarding and setup

#### System Health

1. **Dashboard Review**: Check admin dashboard daily
2. **Monitor Metrics**: Watch for unusual trends in active rate, services, reminders
3. **Address Issues**: Investigate and resolve system-wide problems promptly
4. **Performance**: Monitor for slow queries or performance degradation
5. **Security**: Regularly review access logs and user activity

#### Data Governance

1. **Privacy**: Respect garage data privacy - only access when necessary
2. **Backups**: Ensure regular database backups are running
3. **Compliance**: Follow data protection regulations
4. **Retention**: Define and follow data retention policies
5. **Audit Trail**: Maintain logs of admin actions

---

## Need Help?

If you encounter technical issues:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Review the [Known Issues](./KNOWN_ISSUES.md) document
3. Take a screenshot of the error
4. Contact your development team or support

---

**Happy managing! 🚗**
