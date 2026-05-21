# Mall and Home Utility Services Aggregator

A full-stack web application that connects customers with service providers for home and utility services. Features include service booking, real-time tracking, provider management, and integrated mock payment processing.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Payment System](#payment-system)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Customers
- 🔍 Browse and search service providers
- 📅 Book services with date/time selection
- 💳 Pay for services using the integrated payment system
- 📍 Real-time service tracking with live updates
- ⭐ Rate and review completed services
- 👤 Manage profile and saved addresses
- 📱 Responsive mobile-friendly design

### For Service Providers
- 📊 Comprehensive dashboard with job statistics
- 💰 Earnings tracking and payment history
- 🔧 Manage available services
- 📋 Accept/reject service requests
- 📈 Provider analytics and performance metrics
- ✅ Verification and approval workflow

### For Administrators
- 👮 Provider verification and approval system
- 📊 Platform analytics and statistics
- 👥 User management
- 🔍 Monitor all bookings and transactions

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Custom components
- **Animations**: Framer Motion
- **State Management**: React Hooks + localStorage
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **File Upload**: Cloudinary (config ready)
- **Authentication**: JWT (custom implementation)

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier (recommended)
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB running locally or connection string
- (Optional) Cloudinary account for image uploads

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vmDeshpande/Mall-and-Home-Utility-Services-Aggregator
cd "Mall-and-Home-Utility-Services-Aggregator"
```

2. **Install dependencies**
```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install
cd ..
```

3. **Configure environment variables**
```bash
# Create .env.local in root for frontend
cp ENV_GUIDE.md .env.local.example

# Create .env in backend for backend
cd backend
cp .env.example .env
cd ..
```

4. **Start the development servers**
```bash
# Terminal 1: Backend (from backend directory)
cd backend
npm start

# Terminal 2: Frontend (from root directory)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard pages
│   ├── auth/                     # Authentication pages
│   ├── booking/                  # Booking pages
│   ├── dashboard/                # Customer dashboard
│   ├── onboarding/               # Provider onboarding
│   ├── payment/                  # Payment processing
│   ├── profile/                  # User profile
│   ├── provider/                 # Provider pages
│   ├── providers/                # Provider listing
│   ├── tracking/                 # Service tracking
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── payment/                  # Payment components
│   ├── ui/                       # UI components (shadcn)
│   ├── cards/                    # Card components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   └── sections/                 # Page sections
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/                          # Utility functions
│   ├── api.ts                    # API client
│   ├── payment-utils.ts          # Payment utilities
│   ├── provider-transform.ts     # Data transformation
│   ├── catalog.ts                # Service catalog
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper functions
│
├── backend/                      # Backend Node.js/Express
│   ├── controllers/              # Route handlers
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   ├── middlewares/              # Express middlewares
│   ├── config/                   # Configuration
│   ├── utils/                    # Backend utilities
│   ├── server.js                 # Entry point
│   └── package.json
│
├── public/                       # Static assets
│   └── sw.js                     # Service worker
│
├── styles/                       # Global styles
│   └── globals.css
│
├── .env.local.example            # Frontend environment template
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── postcss.config.mjs            # PostCSS configuration
├── components.json               # shadcn/ui config
│
└── Documentation files:
    ├── README.md                 # This file
    ├── CONTRIBUTION.md           # Contribution guidelines
    ├── API.md                    # API documentation
    ├── DEPLOYMENT.md             # Deployment guide
    ├── ENV_GUIDE.md              # Environment variables
    ├── PAYMENT_SYSTEM.md         # Payment system details
    └── PAYMENT_INTEGRATION.md    # Payment integration guide

```

## 🏗 Architecture

### Frontend Architecture
```
┌─────────────────────────────────────┐
│     Next.js App Router Pages        │
├─────────────────────────────────────┤
│      React Components & Hooks       │
├─────────────────────────────────────┤
│      Reusable UI Components         │
├─────────────────────────────────────┤
│    API Client (lib/api.ts)          │
├─────────────────────────────────────┤
│  Backend Express API (localhost:5000)│
└─────────────────────────────────────┘
```

### Data Flow
```
User Interface
    ↓
React Component
    ↓
API Client (lib/api.ts)
    ↓
Express Backend
    ↓
MongoDB Database
    ↓
Response → Component State → UI Update
```

## 🎯 Key Features Details

### 1. Service Booking Flow
1. Customer browses providers (`/providers`)
2. Selects a provider and clicks "Book Service"
3. Fills booking form with service details
4. Confirms booking (`/booking/confirmation`)
5. Service appears in tracking (`/tracking`)
6. Can pay when status is "in-progress"

### 2. Service Status Tracking
- **requested**: Initial booking created
- **assigned**: Provider accepted the request
- **in-progress**: Service actively happening
- **completed**: Service finished (payment available here)

### 3. Payment System
- Shows on tracking page when service is "in-progress"
- Mock payment processing (90% success rate)
- Transactions stored in localStorage
- Fully documented in [PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md)

### 4. Provider Onboarding
- Role selection during signup
- Service availability setup
- Verification document upload
- Admin approval workflow

### 5. Admin Dashboard
- Provider verification queue
- Platform analytics
- User management
- Booking oversight

## 💳 Payment System

The application includes a production-ready mock payment system:

### Components
- **PaymentModal**: In-page payment interface
- **PaymentCard**: Shows on tracking page during "in-progress" status
- **PaymentPage**: Standalone payment page (`/payment`)

### Features
- Real-time card validation
- Price breakdown display
- Transaction persistence
- Mock processing with error handling
- Security badges and information

For detailed information, see [PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md) and [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md).

## 🔧 Development

### Development Server
```bash
npm run dev
```
Runs on http://localhost:3000 with hot reload

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
# Check TypeScript errors
npm run type-check
```

### Linting
```bash
# Run ESLint
npm run lint
```

### Code Organization

- **Components**: Keep single-responsibility principle
- **Hooks**: Use custom hooks for shared logic
- **API**: All backend calls in `lib/api.ts`
- **Types**: Define in `lib/types.ts`
- **Styling**: Use Tailwind classes (no inline styles)

### Best Practices

1. **Component Naming**: PascalCase for components
2. **File Organization**: Group by feature/page
3. **Props**: Use TypeScript interfaces
4. **State**: Use React hooks (useState, useEffect)
5. **Side Effects**: Clean up in useEffect return
6. **Error Handling**: Try-catch in API calls
7. **Accessibility**: Use semantic HTML and ARIA

## 📚 Documentation

- [CONTRIBUTION.md](CONTRIBUTION.md) - How to contribute
- [API.md](API.md) - Backend API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy
- [ENV_GUIDE.md](ENV_GUIDE.md) - Environment configuration
- [PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md) - Payment system details
- [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) - Payment integration guide

## 🚀 Deployment

The application is configured for deployment on Vercel (frontend) and traditional Node hosting (backend).

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTION.md](CONTRIBUTION.md) for guidelines on:
- How to report issues
- How to submit pull requests
- Code standards and practices
- Testing requirements

## 📝 Environment Configuration

Required environment variables are documented in [ENV_GUIDE.md](ENV_GUIDE.md).

Key variables:
- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `MONGODB_URI`: MongoDB connection string (backend)
- `JWT_SECRET`: JWT signing key (backend)
- `CLOUDINARY_*`: Image upload configuration (optional)

## 🔐 Security Notes

- Never commit `.env` files
- Store sensitive keys in environment variables
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting for APIs
- Use secure session management

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify MongoDB connection
- Check `.env` file configuration

### API calls failing
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check backend is running
- Check CORS configuration

### Payment system not working
- Verify localStorage is enabled
- Check browser console for errors
- Clear cache and reload

### Build errors
- Run `npm run build` to check for TypeScript errors
- Verify all imports are correct
- Check for missing dependencies

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review existing issues in the repository
3. Create a new issue with detailed information
4. Contact the development team

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)

## 📈 Project Status

**Current Version**: 1.0.0  
**Last Updated**: May 22, 2026  
**Status**: Active Development

### Recent Updates
- ✅ Implemented production-ready payment system
- ✅ Added payment modal and card components
- ✅ Created payment utilities and persistence layer
- ✅ Integrated payment into tracking page
- ✅ Comprehensive documentation

### Upcoming Features
- Real payment gateway integration (Stripe/PayPal)
- Enhanced admin dashboard
- Mobile app (React Native)
- Real-time notifications (WebSocket)
- Advanced analytics
- Multi-language support

---

**Built with ❤️ for efficient service management**
