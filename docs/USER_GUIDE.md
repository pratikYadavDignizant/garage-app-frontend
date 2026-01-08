# User Guide

Welcome to the **Garage Management System User Guide**. This comprehensive guide will help you navigate and use all features of the platform efficiently.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Customers](#managing-customers)
4. [Managing Vehicles](#managing-vehicles)
5. [Service History \u0026 Recording](#service-history--recording)
6. [Reminders System](#reminders-system)
7. [Message Templates](#message-templates)
8. [Settings](#settings)
9. [Common Workflows](#common-workflows)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Application

1. Navigate to your application URL (e.g., \`https://your-garage-app.com\`)
2. You'll be redirected to the login page
3. Enter your registered phone number (with country code, e.g., \`+1234567890\`)
4. Click **Send OTP**
5. Check your phone for a 6-digit verification code
6. Enter the OTP code and click **Verify \u0026 Sign In**
7. You'll be redirected to the dashboard

\u003e **Note**: If you don't have an account, contact your system administrator to have your number registered.

### First-Time Setup

After logging in for the first time:

1. **Review Settings**: Go to Settings to verify your garage information
2. **Add Customers**: Start by adding your existing customers
3. **Add Vehicles**: Link vehicles to their respective owners
4. **Record Services**: Add historical service records if available
5. **Set Up Templates**: Create message templates for WhatsApp reminders

---

## Dashboard Overview

The dashboard provides a high-level view of your garage operations.

### Key Performance Indicators (KPIs)

The dashboard displays four main KPI cards:

1. **Total Customers**
   - Shows the total number of registered customers
   - Click to navigate to the Customers page

2. **Total Vehicles**
   - Displays the total number of vehicles under management
   - Click to navigate to the Vehicles page

3. **Services Today**
   - Number of services scheduled or completed today
   - Helps track daily workload

4. **Overdue Services**
   - Critical count of vehicles that missed their service date
   - Requires immediate attention for customer retention

### Analytics Charts

#### Service Trends Chart

- **Type**: Bar chart
- **Data**: Service volume over the last 6 months
- **Purpose**: Identify busy periods and plan resources

#### Reminders Overview Chart

- **Type**: Line chart
- **Data**: Reminders sent vs. services booked
- **Purpose**: Track reminder effectiveness

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

### Recording a New Service

When a vehicle comes in for work:

1. Click the **Record Service** button
2. **Select Vehicle**:
   - Search by number plate or model
   - The customer name will be displayed
3. **Service Date**:
   - Defaults to today
   - Can be backdated if recording historical services
4. **Service Interval**:
   - Select months until next service (3, 6, 9, or 12 months)
   - Defaults to the vehicle's default interval
   - This automatically calculates the next service date
5. **Notes** (Optional):
   - Add details like \"Oil change, Brake pad replacement\"
   - \"Air filter replaced, Tire rotation\"
   - Any other relevant information
6. Click **Record Service**

\u003e **Tip**: The system automatically calculates the \`Next Service Date\` based on the service date and interval, and schedules a reminder.

### Viewing Service Records

The Services page displays all service records with:

- Vehicle information
- Customer name
- Service date
- Next service date
- Interval
- Notes
- Status (Upcoming, Overdue, Completed)

### Filtering Services

Use the filter options to view:

- **All Services**: Complete history
- **Upcoming**: Services due in the future
- **Overdue**: Services past their due date
- **This Month**: Services from the current month

### Editing a Service Record

1. Find the service in the list
2. Click the **Edit** icon
3. Update the information
4. Click **Update Service**

### Deleting a Service Record

1. Find the service in the list
2. Click the **Delete** icon
3. Confirm the deletion

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

## Common Workflows

### Workflow 1: New Customer Walk-In

1. **Add Customer** (Customers page)
   - Name: John Doe
   - Phone: +1234567890
   - Address: 123 Main St

2. **Add Vehicle** (Vehicles page)
   - Select Customer: John Doe
   - Model: Honda Civic
   - Plate: ABC-1234
   - Interval: 6 months

3. **Record Service** (Services page)
   - Select Vehicle: Honda Civic (ABC-1234)
   - Service Date: Today
   - Interval: 6 months
   - Notes: Oil change, tire rotation

4. **System automatically**:
   - Calculates next service date (6 months from today)
   - Schedules a reminder

### Workflow 2: Sending Overdue Reminders

1. Go to **Reminders** → **Overdue** tab
2. Review the list of overdue services
3. For each customer:
   - Click **Send WhatsApp**
   - System sends reminder immediately
4. Follow up with phone calls if needed

### Workflow 3: Monthly Reporting

1. Go to **Dashboard**
2. Review the Service Trends chart
3. Go to **Services** page
4. Filter by \"This Month\"
5. Export data if needed for external reporting

---

## Troubleshooting

### Login Issues

**Problem**: Not receiving OTP

**Solutions**:

- Check if your phone number is registered
- Ensure you included the country code (e.g., +1 for US)
- Check your phone's SMS inbox and spam folder
- Try resending the OTP
- Contact your administrator

**Problem**: \"Invalid verification code\"

**Solutions**:

- Ensure you entered the 6-digit code correctly
- Check if the code has expired (codes expire after 5 minutes)
- Request a new OTP

### Data Not Loading

**Problem**: Pages show loading spinner indefinitely

**Solutions**:

- Check your internet connection
- Refresh the page (F5 or Ctrl+R)
- Clear browser cache and cookies
- Try a different browser
- Contact support if the issue persists

### WhatsApp Reminders Not Sending

**Problem**: Reminders show \"Failed\" status

**Solutions**:

- Verify WhatsApp Business API is configured correctly
- Check if the customer's phone number is valid
- Ensure the phone number is registered with WhatsApp
- Contact your administrator to check backend logs

### Export Not Working

**Problem**: CSV export button doesn't download file

**Solutions**:

- Check if your browser is blocking downloads
- Disable popup blockers
- Try a different browser
- Ensure you have data to export

---

## Keyboard Shortcuts

- \`Ctrl + K\` - Open search (if implemented)
- \`Esc\` - Close dialogs/modals
- \`Tab\` - Navigate between form fields

---

## Best Practices

1. **Regular Data Entry**: Record services immediately after completion
2. **Accurate Information**: Double-check phone numbers and plate numbers
3. **Consistent Naming**: Use standard formats for vehicle models
4. **Timely Reminders**: Send reminders at least 7 days before service due date
5. **Follow Up**: Call customers who don't respond to WhatsApp reminders
6. **Data Backup**: Export customer data regularly for backup

---

## Need Help?

If you encounter technical issues:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Review the [Known Issues](./KNOWN_ISSUES.md) document
3. Take a screenshot of the error
4. Contact your development team or support

---

**Happy managing! 🚗**
