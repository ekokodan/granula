# PostgreSQL & pgAdmin Setup Guide

Complete guide to setting up PostgreSQL database server and pgAdmin for the Energy Platform project.

---

## 📋 Table of Contents

1. [Installation](#installation)
2. [PostgreSQL Server Setup](#postgresql-server-setup)
3. [pgAdmin Setup](#pgadmin-setup)
4. [Database Configuration](#database-configuration)
5. [Connecting from Application](#connecting-from-application)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Installation

### Option 1: Install PostgreSQL & pgAdmin Separately

#### **macOS Installation**

**PostgreSQL:**
```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

**pgAdmin:**
```bash
# Using Homebrew
brew install --cask pgadmin4

# Or download from: https://www.pgadmin.org/download/pgadmin-4-macos/
```

#### **Windows Installation**

1. **PostgreSQL:**
   - Download installer from: https://www.postgresql.org/download/windows/
   - Run the installer
   - During installation, you'll be prompted to set a password for the `postgres` superuser
   - **Remember this password!** You'll need it for pgAdmin
   - Default port: `5432`
   - Default installation path: `C:\Program Files\PostgreSQL\15\`

2. **pgAdmin:**
   - Download from: https://www.pgadmin.org/download/pgadmin-4-windows/
   - Or install via PostgreSQL installer (includes pgAdmin option)
   - Run the installer and follow the setup wizard

#### **Linux (Ubuntu/Debian) Installation**

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install pgAdmin
sudo apt install pgadmin4

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo -u postgres psql --version
```

---

## 🗄️ PostgreSQL Server Setup

### 1. **Initial Configuration**

#### **macOS/Linux:**

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Or on macOS with Homebrew
psql postgres
```

#### **Windows:**

Open **Command Prompt** or **PowerShell** as Administrator:
```cmd
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\15\bin"

# Connect to PostgreSQL
psql -U postgres
```

### 2. **Create Database and User**

Once connected to PostgreSQL, run these SQL commands:

```sql
-- Create database for Energy Platform
CREATE DATABASE energy_platform;

-- Create dedicated user (recommended for security)
CREATE USER energy_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE energy_platform TO energy_user;

-- Connect to the new database
\c energy_platform

-- Grant schema privileges (important!)
GRANT ALL ON SCHEMA public TO energy_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO energy_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO energy_user;

-- Exit psql
\q
```

### 3. **Verify PostgreSQL is Running**

```bash
# Check PostgreSQL status
# macOS/Linux:
pg_isready

# Windows:
# Check Services: Win+R → services.msc → Look for "postgresql-x64-15"

# Test connection
psql -U postgres -d energy_platform
```

### 4. **PostgreSQL Configuration Files**

**Location:**
- **macOS (Homebrew):** `/opt/homebrew/var/postgresql@15/` or `/usr/local/var/postgresql@15/`
- **Windows:** `C:\Program Files\PostgreSQL\15\data\`
- **Linux:** `/etc/postgresql/15/main/`

**Key Configuration Files:**
- `postgresql.conf` - Main configuration
- `pg_hba.conf` - Host-based authentication

**Important Settings in `postgresql.conf`:**
```conf
# Connection settings
listen_addresses = 'localhost'          # or '*' for all interfaces
port = 5432                             # Default PostgreSQL port
max_connections = 100                    # Adjust based on needs

# Memory settings
shared_buffers = 128MB                  # Adjust based on RAM
effective_cache_size = 4GB              # Adjust based on RAM
```

**Edit `pg_hba.conf` for local connections:**
```conf
# Allow local connections
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                  md5
```

**After editing config files, restart PostgreSQL:**
```bash
# macOS (Homebrew)
brew services restart postgresql@15

# Linux
sudo systemctl restart postgresql

# Windows
# Restart PostgreSQL service from Services manager
```

---

## 🖥️ pgAdmin Setup

### 1. **Launch pgAdmin**

- **macOS:** Open pgAdmin from Applications or Spotlight
- **Windows:** Open pgAdmin from Start Menu
- **Linux:** Run `pgadmin4` from terminal

### 2. **Set Master Password**

On first launch, pgAdmin will ask you to set a **master password**. This protects your saved server passwords.

**⚠️ Important:** Remember this password! You'll need it every time you open pgAdmin.

### 3. **Add PostgreSQL Server**

1. **Right-click** on "Servers" in the left panel
2. Select **"Register" → "Server"**

3. **General Tab:**
   ```
   Name: Energy Platform Local
   Server Group: Servers
   ```

4. **Connection Tab:**
   ```
   Host name/address: localhost
   Port: 5432
   Maintenance database: postgres
   Username: postgres (or energy_user)
   Password: [Your PostgreSQL password]
   ```
   
   **☑️ Check:** "Save password" (optional, but convenient)

5. **Advanced Tab:**
   ```
   DB restriction: energy_platform (optional - limits visible databases)
   ```

6. **Click "Save"**

### 4. **Verify Connection**

- Expand your server in the left panel
- Expand "Databases"
- You should see `energy_platform` database
- Expand `energy_platform` → `Schemas` → `public` → `Tables`

### 5. **Create Server Connection for Application User**

For better security, create a separate connection using the `energy_user`:

1. **Right-click** on "Servers" → **"Register" → "Server"**
2. **General Tab:**
   ```
   Name: Energy Platform (App User)
   ```
3. **Connection Tab:**
   ```
   Host name/address: localhost
   Port: 5432
   Maintenance database: energy_platform
   Username: energy_user
   Password: [Your energy_user password]
   ```
4. **Click "Save"**

---

## ⚙️ Database Configuration

### 1. **Create `.env` File**

Navigate to your backend directory:
```bash
cd apps/energy-platform/backend
```

Create `.env` file (if it doesn't exist):
```bash
touch .env
```

### 2. **Configure DATABASE_URL**

Add to your `.env` file:

```env
# PostgreSQL Connection String
# Format: postgresql://[user]:[password]@[host]:[port]/[database]

# Option 1: Using postgres superuser (development only)
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/energy_platform

# Option 2: Using dedicated user (recommended)
DATABASE_URL=postgresql://energy_user:your_secure_password_here@localhost:5432/energy_platform

# Option 3: With SSL (production)
DATABASE_URL=postgresql://energy_user:password@localhost:5432/energy_platform?sslmode=require

# Additional Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:4001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. **Test Database Connection**

```bash
cd apps/energy-platform/backend

# Generate Prisma Client
npm run generate

# Test connection with Prisma
npx prisma db pull

# Or test with psql
psql $DATABASE_URL
```

---

## 🔌 Connecting from Application

### 1. **Run Prisma Migrations**

```bash
cd apps/energy-platform/backend

# Generate Prisma Client
npm run generate

# Create and apply migrations
npx prisma migrate dev --name init

# Or if migrations exist
npx prisma migrate deploy
```

### 2. **Verify Tables in pgAdmin**

1. Open pgAdmin
2. Connect to your server
3. Navigate to: `Servers` → `Energy Platform` → `Databases` → `energy_platform` → `Schemas` → `public` → `Tables`
4. You should see all your Prisma tables:
   - `users`
   - `user_profiles`
   - `addresses`
   - `products`
   - `bundles`
   - `quotes`
   - `orders`
   - etc.

### 3. **Seed Database (Optional)**

```bash
cd apps/energy-platform/backend
npm run seed
```

### 4. **Start Backend Server**

```bash
cd apps/energy-platform
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Energy Platform API Server running on port 5000
```

---

## 🔍 Useful pgAdmin Operations

### **View Table Data**

1. Right-click on any table → **"View/Edit Data" → "All Rows"**
2. Or use Query Tool: Right-click database → **"Query Tool"**

### **Run SQL Queries**

1. Right-click on database → **"Query Tool"**
2. Enter SQL:
   ```sql
   SELECT * FROM users;
   SELECT COUNT(*) FROM products;
   ```
3. Click **Execute** (F5)

### **View Table Structure**

1. Right-click table → **"Properties"**
2. Go to **"Columns"** tab

### **Export Data**

1. Right-click table → **"Backup..."**
2. Choose format (SQL, CSV, etc.)
3. Set options and save

### **Import Data**

1. Right-click table → **"Import/Export Data..."**
2. Choose **"Import"**
3. Select file and configure options

---

## 🐛 Troubleshooting

### **Connection Refused**

**Error:** `could not connect to server: Connection refused`

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready
   
   # Windows - Check Services
   ```
2. Verify port 5432 is not blocked
3. Check `postgresql.conf`: `listen_addresses = 'localhost'`

### **Authentication Failed**

**Error:** `password authentication failed for user`

**Solutions:**
1. Verify username and password in `.env`
2. Check `pg_hba.conf` authentication method
3. Reset password:
   ```sql
   ALTER USER energy_user WITH PASSWORD 'new_password';
   ```

### **Database Does Not Exist**

**Error:** `database "energy_platform" does not exist`

**Solution:**
```sql
CREATE DATABASE energy_platform;
```

### **Permission Denied**

**Error:** `permission denied for schema public`

**Solution:**
```sql
GRANT ALL ON SCHEMA public TO energy_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO energy_user;
```

### **pgAdmin Won't Connect**

**Solutions:**
1. Verify PostgreSQL is running
2. Check firewall settings
3. Verify `pg_hba.conf` allows connections:
   ```conf
   host    all    all    127.0.0.1/32    md5
   ```
4. Restart PostgreSQL after config changes

### **Prisma Migration Errors**

**Error:** `Migration failed`

**Solutions:**
1. Check database exists:
   ```sql
   \l  -- List databases
   ```
2. Verify DATABASE_URL in `.env`
3. Reset migrations (⚠️ deletes data):
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

---

## 📊 Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?[parameters]
```

**Examples:**

```env
# Local development
DATABASE_URL=postgresql://energy_user:password123@localhost:5432/energy_platform

# With SSL
DATABASE_URL=postgresql://energy_user:password123@localhost:5432/energy_platform?sslmode=require

# Remote server
DATABASE_URL=postgresql://user:pass@db.example.com:5432/energy_platform

# Connection pooling (for production)
DATABASE_URL=postgresql://user:pass@localhost:5432/energy_platform?connection_limit=10&pool_timeout=20
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use dedicated database user** - Don't use `postgres` superuser
3. **Strong passwords** - Use complex passwords for production
4. **Enable SSL in production** - Add `?sslmode=require` to connection string
5. **Limit connections** - Use connection pooling
6. **Regular backups** - Set up automated backups
7. **Firewall rules** - Restrict database access to application servers only

---

## 📚 Quick Reference Commands

### **PostgreSQL CLI Commands**

```bash
# Connect to database
psql -U postgres -d energy_platform

# List databases
psql -U postgres -l

# Create database
createdb -U postgres energy_platform

# Drop database
dropdb -U postgres energy_platform

# Backup database
pg_dump -U postgres energy_platform > backup.sql

# Restore database
psql -U postgres energy_platform < backup.sql
```

### **Prisma Commands**

```bash
# Generate Prisma Client
npm run generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (web GUI)
npx prisma studio

# Reset database
npx prisma migrate reset

# Seed database
npm run seed
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] pgAdmin installed and launched
- [ ] Database `energy_platform` created
- [ ] User `energy_user` created with proper permissions
- [ ] pgAdmin connected to PostgreSQL server
- [ ] `.env` file created with correct `DATABASE_URL`
- [ ] Prisma Client generated (`npm run generate`)
- [ ] Migrations applied (`npx prisma migrate dev`)
- [ ] Tables visible in pgAdmin
- [ ] Backend server connects successfully
- [ ] Health endpoint returns `"database": "connected"`

---

## 🎉 Next Steps

Once PostgreSQL and pgAdmin are set up:

1. ✅ Database server running
2. ✅ pgAdmin configured
3. ✅ Database created
4. ⏭️ Run Prisma migrations
5. ⏭️ Seed sample data
6. ⏭️ Start developing!

---

## 📖 Additional Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **pgAdmin Documentation:** https://www.pgadmin.org/docs/
- **Prisma Documentation:** https://www.prisma.io/docs
- **Connection String Reference:** https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING

---

**Need Help?** Check the troubleshooting section or refer to the main `DATABASE_SETUP.md` file.



