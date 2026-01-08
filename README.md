# 🚗 Garage Management System

A modern, high-performance web application designed for garage owners to efficiently manage customers, vehicles, service records, and automated reminders. Built with Next.js 16 and powered by Firebase authentication.

## ✨ Key Features

- **🔐 Secure OTP Authentication**: Firebase-powered phone authentication for seamless, password-free login
- **📊 Real-time Dashboard**: Comprehensive overview of garage operations with KPIs and analytics
- **👥 Customer Management**: Centralized database with full CRUD operations and export capabilities
- **🚙 Vehicle Tracking**: Complete vehicle history, service records, and maintenance schedules
- **🔧 Service Recording**: Log service details with automatic next-service-date calculations
- **📱 WhatsApp Integration**: Automated service reminders via WhatsApp Business API
- **📝 Template Management**: Customizable message templates for different service types
- **📈 Analytics \u0026 Reports**: Service trends, reminder tracking, and performance metrics

## 🛠️ Tech Stack

### Core Framework

- **[Next.js 16.1.1](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - Latest React features

### UI \u0026 Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icons
- **[Recharts](https://recharts.org/)** - Composable charting library

### State \u0026 Data Management

- **[TanStack Query v5](https://tanstack.com/query/latest)** - Powerful async state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client

### Authentication \u0026 Utilities

- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - Phone OTP authentication
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Firebase Project** with Phone Authentication enabled
- **Backend API** (see backend repository for setup)

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd garage-app-web
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install

# or

yarn install

# or

pnpm install
\`\`\`

### 3. Environment Configuration

Create a \`.env.local\` file in the root directory by copying the template:

\`\`\`bash
cp env.local.template .env.local
\`\`\`

Update the \`.env.local\` file with your configuration:

\`\`\`env

# Backend API Configuration

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Firebase Web Config (REQUIRED for OTP)

NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Admin Details (Optional - for pre-filling login)

NEXT_PUBLIC_ADMIN_PHONE="+1234567890"
\`\`\`

#### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **General**
4. Scroll down to **Your apps** section
5. Click on the **Web app** (or create one if it doesn't exist)
6. Copy the configuration values to your \`.env.local\`

#### Enable Phone Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Phone** provider
3. Add your domain to the authorized domains list (e.g., \`localhost\` for development)

### 4. Run the Development Server

\`\`\`bash
npm run dev

# or

yarn dev

# or

pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Backend Setup

This frontend requires a backend API server. Make sure your backend is running on the URL specified in \`NEXT_PUBLIC_API_BASE_URL\`.

See the backend repository for setup instructions.

## 📁 Project Structure

\`\`\`
garage-app-web/
├── app/ # Next.js App Router pages
│ ├── (auth)/ # Authentication pages (login, admin)
│ ├── admin/ # Admin dashboard pages
│ │ ├── customers/ # Customer management
│ │ ├── vehicles/ # Vehicle management
│ │ ├── services/ # Service records
│ │ ├── reminders/ # Reminder management
│ │ ├── templates/ # Message templates
│ │ └── settings/ # Settings page
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── error.tsx # Error boundary
│ └── not-found.tsx # 404 page
├── components/ # React components
│ ├── layout/ # Layout components (sidebar, header)
│ ├── providers/ # Context providers
│ └── ui/ # Reusable UI components
├── hooks/ # Custom React hooks
│ └── api/ # API hooks (TanStack Query)
├── lib/ # Utility libraries
│ ├── axios.ts # Axios configuration
│ ├── firebase.ts # Firebase initialization
│ ├── format.ts # Formatting utilities
│ ├── export.ts # CSV export utilities
│ └── utils.ts # General utilities
├── docs/ # Documentation
├── public/ # Static assets
└── .env.local # Environment variables (create from template)
\`\`\`

## 🔧 Development Workflow

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Formatting**: Follow the existing code style

## 🌐 Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js plugin
- **AWS Amplify**: Follow AWS Amplify Next.js guide
- **Self-hosted**: Use \`npm run build\` and \`npm run start\`

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[User Guide](./docs/USER_GUIDE.md)** - How to use the application
- **[Tech Stack](./docs/tech-stack.md)** - Detailed technology overview
- **[Flowcharts](./docs/flowcharts.md)** - Visual system diagrams
- **[MVP Plan](./docs/mvp-plan.md)** - Product roadmap
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - Development guidelines
- **[Known Issues](./docs/KNOWN_ISSUES.md)** - Current limitations and planned improvements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:

1. Check the [Known Issues](./docs/KNOWN_ISSUES.md)
2. Review the [User Guide](./docs/USER_GUIDE.md)
3. Contact the development team

---

**Built with ❤️ for garage owners who deserve better tools**
