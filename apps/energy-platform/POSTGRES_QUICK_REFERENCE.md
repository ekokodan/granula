# PostgreSQL & pgAdmin Quick Reference

## 🚀 Quick Setup Commands

### **Install PostgreSQL (macOS)**
```bash
brew install postgresql@15
brew services start postgresql@15
```

### **Create Database & User**
```bash
psql postgres
```
Then run:
```sql
CREATE DATABASE energy_platform;
CREATE USER energy_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE energy_platform TO energy_user;
\c energy_platform
GRANT ALL ON SCHEMA public TO energy_user;
\q
```

### **Configure Application**

Create `apps/energy-platform/backend/.env`:
```env
DATABASE_URL=postgresql://energy_user:your_password@localhost:5432/energy_platform
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
```

### **Setup Prisma**
```bash
cd apps/energy-platform/backend
npm run generate
npx prisma migrate dev
npm run seed
```

---

## 🔌 pgAdmin Connection Settings

**Server Name:** Energy Platform Local  
**Host:** localhost  
**Port:** 5432  
**Database:** postgres (for maintenance) or energy_platform  
**Username:** postgres or energy_user  
**Password:** [Your PostgreSQL password]

---

## 📋 Common Commands

### **Check PostgreSQL Status**
```bash
pg_isready
```

### **Connect to Database**
```bash
psql -U energy_user -d energy_platform
```

### **List Databases**
```sql
\l
```

### **List Tables**
```sql
\dt
```

### **Describe Table**
```sql
\d table_name
```

### **Exit psql**
```sql
\q
```

---

## 🔧 Troubleshooting Quick Fixes

**Connection refused?**
```bash
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql    # Linux
```

**Permission denied?**
```sql
GRANT ALL ON SCHEMA public TO energy_user;
```

**Database doesn't exist?**
```sql
CREATE DATABASE energy_platform;
```

---

## 📝 Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Example:**
```
postgresql://energy_user:mypassword@localhost:5432/energy_platform
```

---

## ✅ Verification

1. PostgreSQL running: `pg_isready`
2. Database exists: `psql -l | grep energy_platform`
3. Connection works: `psql $DATABASE_URL`
4. Tables created: Check pgAdmin or run `npx prisma studio`



