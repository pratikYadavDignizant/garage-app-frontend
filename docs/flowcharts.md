# Application Flowcharts

This document visualizes the core processes and structures of the Garage Management application.

## Authentication Flow (Firebase OTP)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Firebase
    participant Backend

    User->>Frontend: Enter Phone Number
    Frontend->>Firebase: Request OTP (Recaptcha)
    Firebase-->>User: SMS with OTP Code
    User->>Frontend: Enter OTP Code
    Frontend->>Firebase: Verify OTP
    Firebase-->>Frontend: ID Token
    Frontend->>Backend: POST /auth/firebase (with ID Token)
    Backend-->>Frontend: Session JWT / Confirmation
    Frontend->>User: Redirect to Dashboard
```

## Data Relationship Model

```mermaid
erDiagram
    GARAGE ||--o{ CUSTOMER : "manages"
    CUSTOMER ||--o{ VEHICLE : "owns"
    VEHICLE ||--o{ SERVICE_RECORD : "has"
    SERVICE_RECORD ||--o{ REMINDER_LOG : "triggers"
    REMINDER_LOG }|--|| GARAGE : "sent_by"

    GARAGE {
        string id
        string name
        boolean verified
    }

    CUSTOMER {
        string id
        string name
        string phoneNumber
    }

    VEHICLE {
        string id
        string plateNumber
        string model
    }

    SERVICE_RECORD {
        string id
        date serviceDate
        string details
    }
```

## Admin Navigation Structure

```mermaid
graph TD
    Login((Login Page)) --> Dashboard
    Dashboard --> Customers
    Dashboard --> Vehicles
    Dashboard --> Services
    Dashboard --> Reminders
    Dashboard --> Templates
    Dashboard --> Settings

    Customers --> CustomerDetails[Customer Details & CRUD]
    Vehicles --> VehicleDetails[Vehicle Details & History]
    Services --> ServiceBooking[New Service & History]
    Reminders --> ReminderLogs[WhatsApp Logs & Status]
    Templates --> ReminderTemplates[Message Templates]
```
