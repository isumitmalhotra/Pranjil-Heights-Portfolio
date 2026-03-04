# Production Database Setup Guide

This guide covers setting up PostgreSQL for production deployment of the PVC Portfolio application.

## Why PostgreSQL?

We use **PostgreSQL** for production (not MongoDB) because:

1. **Relational Data Model** - Our data has relationships (products → categories, quotes → products, etc.)
2. **ACID Compliance** - Ensures data integrity for transactions
3. **Prisma ORM Support** - Excellent TypeScript/JavaScript integration
4. **Cloud Availability** - Available on all major cloud platforms (AWS RDS, GCP Cloud SQL, Azure Database, etc.)
5. **Industry Standard** - Widely used, well-documented, strong community support
6. **Cost Effective** - Open source, no licensing fees

---

## Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Database                       │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 15+                                              │
│  ├── Users (Admin accounts)                                  │
│  ├── Categories (Product categories)                         │
│  ├── Products (Product catalog with finishes)                │
│  ├── Contacts (Contact form submissions)                     │
│  ├── QuoteRequests (Quote requests)                          │
│  ├── DealerApplications (Dealer partnership applications)    │
│  ├── Newsletter (Newsletter subscribers)                     │
│  └── Testimonials (Customer testimonials)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Option 1: Cloud-Managed PostgreSQL (Recommended)

### AWS RDS PostgreSQL

```bash
# Environment variables for AWS RDS
DATABASE_URL="postgresql://username:password@your-rds-instance.region.rds.amazonaws.com:5432/pvc_portfolio?schema=public"
```

**Setup Steps:**
1. Go to AWS Console → RDS → Create database
2. Select PostgreSQL (version 15 or higher)
3. Choose instance type (db.t3.micro for small, db.t3.small for production)
4. Configure:
   - DB instance identifier: `pvc-portfolio-db`
   - Master username: Choose a secure username
   - Master password: Generate a strong password
   - Initial database name: `pvc_portfolio`
5. Configure VPC security group to allow connections from your application server
6. Enable automated backups (recommended: 7 days retention)

**Estimated Cost:** ~$15-50/month for db.t3.small

### DigitalOcean Managed PostgreSQL (Cost-Effective)

```bash
# Environment variables for DigitalOcean
DATABASE_URL="postgresql://username:password@your-cluster.db.ondigitalocean.com:25060/pvc_portfolio?sslmode=require"
```

**Setup Steps:**
1. Go to DigitalOcean → Databases → Create database cluster
2. Select PostgreSQL 15
3. Choose datacenter region (Mumbai for India)
4. Select plan (Basic $15/month for single node)
5. Name the cluster: `pvc-portfolio-db`
6. Create the database

**Estimated Cost:** ~$15-25/month

### Google Cloud SQL

```bash
# Environment variables for Cloud SQL
DATABASE_URL="postgresql://username:password@/pvc_portfolio?host=/cloudsql/project-id:region:instance-name"
```

---

## Option 2: Self-Hosted PostgreSQL (VPS)

### Installation on Ubuntu 22.04

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE pvc_portfolio;
CREATE USER pvc_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE pvc_portfolio TO pvc_user;
ALTER DATABASE pvc_portfolio OWNER TO pvc_user;

# Enable UUID extension (required for Prisma)
\c pvc_portfolio
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit
\q
```

### Configure PostgreSQL for Remote Access

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf

# Add/modify this line
listen_addresses = '*'

# Edit pg_hba.conf for remote access
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Add this line (replace with your application server IP)
host    pvc_portfolio    pvc_user    your-app-server-ip/32    scram-sha-256

# For Docker/internal network (use with caution)
host    all    all    10.0.0.0/8    scram-sha-256

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Environment Variable

```bash
DATABASE_URL="postgresql://pvc_user:your_strong_password_here@your-server-ip:5432/pvc_portfolio?schema=public"
```

---

## Option 3: Docker PostgreSQL (Development/Testing)

### Using Docker Compose

The project already includes `docker-compose.yml`:

```yaml
# backend/docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: pvc_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: pvc_user
      POSTGRES_PASSWORD: pvc_secure_password
      POSTGRES_DB: pvc_portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pvc_user -d pvc_portfolio"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Start the database:**
```bash
cd backend
docker-compose up -d
```

---

## Production Configuration

### 1. Update Environment Variables

Create/update `.env` in the backend folder:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/pvc_portfolio?schema=public"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Admin Email (receives notifications)
ADMIN_EMAIL=admin@pranjilheights.com

# Frontend URL (for CORS and email links)
FRONTEND_URL=https://pranjilheights.com

# Node Environment
NODE_ENV=production
```

### 2. Run Database Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database (for new databases)
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate deploy

# Seed initial data (if needed)
npx prisma db seed
```

### 3. Verify Connection

```bash
# Test database connection
npx prisma db pull

# Open Prisma Studio to verify data
npx prisma studio
```

---

## Database Backup Strategy

### Automated Backups (Production)

**For AWS RDS:**
- Enable automated backups in RDS console
- Set backup retention period (7-30 days)
- Configure backup window during low-traffic hours

**For Self-Hosted:**

```bash
# Create backup script
sudo nano /usr/local/bin/backup-pvc-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="pvc_portfolio_$DATE.sql.gz"

# Create backup
pg_dump -U pvc_user pvc_portfolio | gzip > "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete

# Optional: Upload to S3
# aws s3 cp "$BACKUP_DIR/$FILENAME" s3://your-bucket/backups/
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-pvc-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-pvc-db.sh
```

### Manual Backup

```bash
# Full backup
pg_dump -U pvc_user -d pvc_portfolio > backup.sql

# Compressed backup
pg_dump -U pvc_user -d pvc_portfolio | gzip > backup.sql.gz

# Restore from backup
psql -U pvc_user -d pvc_portfolio < backup.sql

# Restore from compressed
gunzip -c backup.sql.gz | psql -U pvc_user -d pvc_portfolio
```

---

## Performance Optimization

### Connection Pooling

For production, use connection pooling with PgBouncer or Prisma's built-in pooling:

```bash
# In DATABASE_URL, add connection pool settings
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10&pool_timeout=20"
```

### Indexes

The Prisma schema already includes necessary indexes. Verify with:

```sql
-- Check existing indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
```

### Query Optimization

```bash
# Enable query logging for debugging
# In postgresql.conf:
log_statement = 'all'
log_min_duration_statement = 1000  # Log queries taking > 1s
```

---

## Security Best Practices

1. **Strong Passwords** - Use 20+ character passwords with mixed characters
2. **SSL/TLS** - Always use encrypted connections (`?sslmode=require`)
3. **Network Security** - Restrict database access to application servers only
4. **Regular Updates** - Keep PostgreSQL updated with security patches
5. **Least Privilege** - Use separate database users for different environments
6. **Audit Logging** - Enable logging for security audit
7. **Encryption at Rest** - Enable storage encryption (available on cloud providers)

---

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql -h hostname -U username -d pvc_portfolio

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check port is open
sudo netstat -tulpn | grep 5432

# Check firewall
sudo ufw status
```

### Prisma Issues

```bash
# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate

# View database schema
npx prisma db pull
```

---

## Migration Checklist

- [ ] Choose hosting option (Cloud managed or self-hosted)
- [ ] Create PostgreSQL database
- [ ] Generate strong passwords
- [ ] Configure firewall/security groups
- [ ] Update `.env` with DATABASE_URL
- [ ] Run `npx prisma migrate deploy`
- [ ] Seed initial admin user
- [ ] Configure automated backups
- [ ] Test database connection from application
- [ ] Enable SSL for database connections
- [ ] Set up monitoring (optional)

---

## Quick Commands Reference

```bash
# Development
docker-compose up -d          # Start local PostgreSQL
npx prisma studio             # Open database GUI
npx prisma db seed            # Seed sample data

# Production
npx prisma migrate deploy     # Apply migrations
npx prisma generate           # Generate client
npm run start                 # Start production server

# Maintenance
pg_dump -U user db > backup.sql    # Backup
psql -U user db < backup.sql       # Restore
```
