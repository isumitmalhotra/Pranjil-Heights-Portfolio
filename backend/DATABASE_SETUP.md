# Database Setup Guide

This guide covers different ways to set up PostgreSQL for the Pranjil Heights backend.

## Option 1: Neon (Recommended - Free Cloud Database)

Neon offers a generous free tier with serverless PostgreSQL.

### Steps:

1. **Create Account:**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub or Email

2. **Create Project:**
   - Click "Create Project"
   - Name: `pvc-portfolio`
   - Region: Choose closest to you
   - PostgreSQL Version: 15 or 16

3. **Get Connection String:**
   - Go to Dashboard → Connection Details
   - Copy the connection string (looks like):
     ```
     postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
     ```

4. **Update .env:**
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

5. **Run Migrations:**
   ```bash
   cd backend
   npm run db:push
   npm run db:seed
   ```

---

## Option 2: Railway (Free Cloud Database)

Railway offers $5 free credits monthly.

### Steps:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create New Project → Add PostgreSQL
4. Copy the `DATABASE_URL` from Variables tab
5. Update `.env` with the connection string

---

## Option 3: Supabase (Free Cloud Database)

Supabase offers a generous free tier.

### Steps:

1. Go to [supabase.com](https://supabase.com)
2. Create New Project
3. Go to Settings → Database → Connection String
4. Copy the URI connection string
5. Update `.env` with the connection string

---

## Option 4: Docker (Local Development)

If you have Docker Desktop running:

```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- pgAdmin on port 5050 (optional DB GUI)

Connection string (already in .env):
```
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/pvc_portfolio?schema=public"
```

---

## Option 5: Local PostgreSQL Installation

### Windows:

1. Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run installer, set password for `postgres` user
3. Create database:
   ```sql
   CREATE DATABASE pvc_portfolio;
   ```
4. Update `.env` with your credentials

### Mac (with Homebrew):

```bash
brew install postgresql@15
brew services start postgresql@15
createdb pvc_portfolio
```

### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb pvc_portfolio
```

---

## After Database Setup

Once your database is running:

```bash
# Navigate to backend
cd backend

# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

---

## Verify Connection

Test if the database is connected:

```bash
npm run dev
```

You should see:
```
🚀 Pranjil Heights API Server
✅ Database connected successfully
Server running on port 5000
```

---

## Troubleshooting

### Connection Refused
- Check if PostgreSQL is running
- Verify port 5432 is not blocked
- Check credentials in DATABASE_URL

### SSL Required (Cloud Databases)
- Add `?sslmode=require` to connection string

### Authentication Failed
- Verify username and password
- Check if user has access to the database
