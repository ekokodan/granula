# Energy Platform - Alternative Energy Storage Solutions

A comprehensive e-commerce platform for building, buying, installing, financing, and insuring energy storage systems. Specializing in premium lithium battery solutions for residential, commercial, and grid-scale applications.

## 🎯 Project Overview

The Energy Platform enables customers to:
- **Build**: Interactive system calculator to determine optimal energy storage requirements
- **Buy**: Browse and purchase energy storage bundles and individual components  
- **Install**: Schedule professional installation with certified installers
- **Finance**: Access financing options and payment plans
- **Insure**: Integrated insurance coverage for energy systems

### Key Features

- 🔋 **Interactive System Builder** - Energy needs calculator with real-time recommendations
- 📦 **Bundle Offerings** - Pre-configured packages optimized for different use cases
- 📊 **Real-time Inventory** - Live stock levels and delivery estimates
- 📄 **PDF Quote Generation** - Downloadable system specifications and pricing
- 💳 **Integrated Payments** - Stripe integration for secure transactions
- 📱 **Customer Portal** - Order tracking, service scheduling, and support
- 🏢 **Admin Dashboard** - Inventory management, order processing, and analytics

## 🏗️ Architecture

```
energy-platform/
├── frontend/          # Next.js 14 React application
├── backend/           # Node.js Express API server
├── admin/             # Admin dashboard (future)
├── shared/            # Shared types and utilities
├── docs/              # Project documentation
└── docker-compose.yml # Development environment
```

### Tech Stack

#### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Query** for data fetching
- **jsPDF** for PDF generation

#### Backend
- **Node.js** + **Express.js**
- **TypeScript** for type safety
- **Prisma** ORM with PostgreSQL
- **Redis** for caching and sessions
- **Stripe** for payment processing
- **JWT** for authentication

#### Infrastructure
- **Docker** for containerization
- **PostgreSQL** database
- **Redis** for caching
- **Nginx** reverse proxy (production)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development environment**
   ```bash
   # Start all services with Docker Compose
   docker-compose up -d
   
   # Or run individual services
   npm run dev:frontend
   npm run dev:backend
   ```

5. **Initialize database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Access the application**
   - Frontend: http://localhost:4001
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api

### Manual Setup (without Docker)

1. **Database Setup**
   ```bash
   # Install and start PostgreSQL
   createdb energy_platform
   
   # Install and start Redis
   redis-server
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📋 Development Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both applications
npm run install:all      # Install all dependencies
```

### Frontend
```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run type-check       # TypeScript check
```

### Backend
```bash
npm run dev              # Development server with nodemon
npm run build            # TypeScript compilation
npm run start            # Production server
npm run test             # Run tests
npm run migrate          # Run database migrations
npm run seed             # Seed database
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users** - Customer accounts and profiles
- **Products** - Individual components (batteries, inverters, solar panels)
- **Bundles** - Pre-configured product packages
- **Quotes** - Customer system estimates
- **Orders** - Purchase transactions
- **Installations** - Service scheduling and tracking
- **Reviews** - Customer feedback

### Running Migrations

```bash
cd backend
npx prisma migrate dev      # Development migrations
npx prisma migrate deploy   # Production migrations
npx prisma generate         # Generate Prisma client
npx prisma studio          # Database browser
```

## 🔧 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/bundles` - Get product bundles

### Calculator
- `POST /api/calculator/estimate` - Calculate system requirements
- `POST /api/calculator/components` - Get component recommendations
- `GET /api/calculator/savings/:location` - Get savings by location

### Quotes
- `POST /api/quotes` - Create quote request
- `GET /api/quotes/:id` - Get quote details
- `GET /api/quotes/:id/download` - Download PDF quote

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## 🎨 UI Components

The frontend uses a design system built with Tailwind CSS and shadcn/ui components:

- **Button** - Primary actions and navigation
- **Card** - Content containers
- **Form** - Input fields and validation
- **Modal** - Dialogs and overlays
- **Tables** - Data display
- **Charts** - Analytics visualization

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy with nginx reverse proxy
docker-compose --profile production up -d
```

### Environment Variables

Key environment variables for production:

```bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...

# Frontend  
NEXT_PUBLIC_API_URL=https://api.energyplatform.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🗺️ Development Roadmap

### Phase 1: Foundation ✅
- [x] Project structure and basic setup
- [x] Database schema design
- [x] Basic API endpoints
- [x] Frontend components
- [x] Docker development environment

### Phase 2: Core Features (In Progress)
- [ ] System calculator implementation
- [ ] Product catalog with filtering
- [ ] Quote generation and PDF export
- [ ] User authentication system
- [ ] Shopping cart functionality

### Phase 3: E-commerce (Planned)
- [ ] Payment processing with Stripe
- [ ] Order management system
- [ ] Inventory tracking
- [ ] Email notifications
- [ ] Customer portal

### Phase 4: Advanced Features (Planned)
- [ ] Installation scheduling
- [ ] Financing calculator
- [ ] Insurance integration
- [ ] Admin dashboard
- [ ] Analytics and reporting

### Phase 5: Launch Preparation (Planned)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation completion
- [ ] Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical questions or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Target Launch Date**: January 2026

**Business Model**: B2B2C energy storage solutions platform targeting:
- High net-worth residential customers
- Small-to-medium enterprises  
- Commercial energy independence projects

**Revenue Goals**: $65,000 quarterly investment, 40% margin, $20,000 quarterly returns