# PostgreSQL Setup Guide for Energy Platform

## 🗄️ Database Configuration

Your backend is now configured to use PostgreSQL with Prisma ORM. Here's how to set it up:

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed (or use Docker)
- Docker & Docker Compose (recommended for development)

---

## 🚀 Quick Start with Docker Compose

The easiest way to get started is using Docker Compose, which is already configured:

### 1. **Set up environment variables**

Create a `.env` file in the `backend` directory:

```bash
cd apps/energy-platform/backend
cp .env.example .env  # If .env.example exists, or create manually
```

Add the following to your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:4001

# Database Configuration (for Docker Compose)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/energy_platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### 2. **Start PostgreSQL with Docker Compose**

From the `apps/energy-platform` directory:

```bash
# Start only PostgreSQL and Redis
docker-compose up -d postgres redis

# Or start everything
docker-compose up -d
```

### 3. **Generate Prisma Client**

```bash
cd backend
npm run generate
```

### 4. **Run database migrations**

```bash
# Create and apply migrations
npx prisma migrate dev

# Or if migrations already exist, just apply them
npx prisma migrate deploy
```

### 5. **Seed the database (optional)**

```bash
npm run seed
```

This will populate your database with sample products, bundles, and users.

### 6. **Start the backend server**

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Energy Platform API Server running on port 5000
📦 Database: PostgreSQL (Prisma)
```

---

## 🖥️ Manual PostgreSQL Setup (without Docker)

If you prefer to run PostgreSQL locally:

### 1. **Install PostgreSQL**

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. **Create database**

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE energy_platform;

# Create user (optional)
CREATE USER energy_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE energy_platform TO energy_user;

# Exit
\q
```

### 3. **Update DATABASE_URL**

In your `.env` file:

```env
# For local PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/energy_platform

# Or with custom user
DATABASE_URL=postgresql://energy_user:your_password@localhost:5432/energy_platform
```

### 4. **Run migrations and seed**

```bash
cd backend
npm run generate
npx prisma migrate dev
npm run seed
```

---

## 🔧 Prisma Commands

### Generate Prisma Client
```bash
npm run generate
# or
npx prisma generate
```

### Create a new migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Apply migrations (production)
```bash
npm run migrate
# or
npx prisma migrate deploy
```

### Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```
This opens a web interface at `http://localhost:5555` to browse and edit your database.

### Reset database (⚠️ deletes all data)
```bash
npx prisma migrate reset
```

### Seed database
```bash
npm run seed
```

---

## 📊 Database Schema

Your database includes these main tables:

- **users** - User accounts and authentication
- **user_profiles** - Extended user profile information
- **addresses** - User addresses
- **products** - Product catalog (batteries, inverters, solar panels, etc.)
- **bundles** - Pre-configured product bundles
- **bundle_items** - Items within bundles
- **quotes** - Customer quote requests
- **quote_items** - Items in quotes
- **orders** - Customer orders
- **order_items** - Items in orders
- **order_timeline** - Order status tracking
- **installations** - Installation scheduling
- **payments** - Payment records
- **reviews** - Product reviews

---

## ✅ Verify Database Connection

### 1. **Check health endpoint**

```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development",
  "database": "connected"
}
```

### 2. **Test API endpoints**

```bash
# Get all products
curl http://localhost:5000/api/products

# Get product bundles
curl http://localhost:5000/api/products/bundles

# Get single product (replace ID with actual product ID)
curl http://localhost:5000/api/products/clxxxxx
```

---

## 🐛 Troubleshooting

### Database connection failed

**Error:** `❌ Database connection failed`

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Local
   pg_isready
   ```

2. Verify DATABASE_URL in `.env`:
   ```bash
   echo $DATABASE_URL
   # Should match your PostgreSQL connection string
   ```

3. Check PostgreSQL logs:
   ```bash
   # Docker
   docker logs energy-platform-db
   
   # Local
   tail -f /var/log/postgresql/postgresql-15-main.log
   ```

### Migration errors

**Error:** `Migration failed`

**Solutions:**
1. Check if database exists:
   ```bash
   psql -l | grep energy_platform
   ```

2. Reset and retry:
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

3. Check Prisma schema syntax:
   ```bash
   npx prisma validate
   ```

### Prisma Client not generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm run generate
npm install
```

---

## 🔐 Production Setup

For production, use environment variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/energy_platform?schema=public&sslmode=require
```

**Security Best Practices:**
- Use strong passwords
- Enable SSL/TLS connections
- Use connection pooling
- Set up database backups
- Use environment variables (never commit `.env` files)
- Rotate credentials regularly

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## ✅ Next Steps

Now that PostgreSQL is set up:

1. ✅ Database connection configured
2. ✅ Products route updated to use Prisma
3. ⏭️ Update other routes (auth, quotes, orders) to use Prisma
4. ⏭️ Implement authentication with JWT
5. ⏭️ Add service layer for business logic

Your backend is now ready to use PostgreSQL! 🎉

