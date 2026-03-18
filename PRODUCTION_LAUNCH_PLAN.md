# Production Launch Plan - Pranijheightsindia
## Single VPS Deployment — All-in-One Server

> **Architecture:** Everything runs on a single private VPS — Frontend, Backend, Database, and all uploaded files/images are stored directly on the server disk.

---

## Phase 1: VPS Server Setup (30-45 mins)

### 1.1 VPS Requirements
| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **RAM** | 2 GB | 4 GB |
| **CPU** | 1 vCPU | 2 vCPU |
| **Disk** | 40 GB SSD | 80 GB SSD (for storing images/PDFs) |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **Bandwidth** | 1 TB | Unmetered |

### 1.2 Initial Server Setup
```bash
# SSH into your VPS
ssh root@YOUR_SERVER_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Create a non-root user
adduser pranijheightsindia
usermod -aG sudo pranijheightsindia

# Switch to new user
su - pranijheightsindia
```

### 1.3 Domain & DNS
- [ ] Point `pranijheightsindia.com` A record → VPS IP address
- [ ] Point `www.pranijheightsindia.com` CNAME → `pranijheightsindia.com`
- [ ] (Optional) Use Cloudflare for DNS + CDN caching of static assets
- [ ] Wait for DNS propagation (usually 5-30 mins with Cloudflare)

### 1.4 Firewall Setup
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
# PostgreSQL (5432) and Node.js (5000) stay internal only — NOT exposed
```

### 1.5 Install SSL with Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
# SSL certificate will be configured after Nginx setup (Phase 4)
```

---

## Phase 2: Database Setup (15-20 mins)

### 2.1 Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2.2 Create Database & User
```bash
sudo -u postgres psql
```
```sql
CREATE USER pranijheightsindia_admin WITH PASSWORD 'YOUR_STRONG_DB_PASSWORD';
CREATE DATABASE pranijheightsindia OWNER pranijheightsindia_admin;
GRANT ALL PRIVILEGES ON DATABASE pranijheightsindia TO pranijheightsindia_admin;
\q
```

### 2.3 Verify Connection
```bash
psql -U pranijheightsindia_admin -d pranijheightsindia -h localhost
# Enter password, should connect successfully
\q
```

**Database URL for .env:**
```
DATABASE_URL="postgresql://pranijheightsindia_admin:YOUR_STRONG_DB_PASSWORD@localhost:5432/pranijheightsindia?schema=public&connection_limit=10"
```

---

## Phase 3: Application Deployment (30-45 mins)

### 3.1 Install Node.js 22 LTS & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version    # Should show v22.x.x
npm --version

sudo npm install -g pm2
```

### 3.2 Clone the Project
```bash
sudo mkdir -p /var/www
sudo chown pranijheightsindia:pranijheightsindia /var/www
cd /var/www
git clone <your-repo-url> pranijheightsindia
cd pranijheightsindia
```

### 3.3 Create Upload Directories (for images/files stored on VPS)
```bash
# Create the upload directory structure
mkdir -p backend/uploads/{products,categories,catalogues,testimonials,general}

# Set proper permissions (writable by the app)
chmod -R 755 backend/uploads
```

### 3.4 Setup Backend
```bash
cd /var/www/pranijheightsindia/backend
npm install --production
```

### 3.5 Create Production Backend `.env`
```bash
cp .env.example .env
nano .env
```

**Set ALL of these values:**
```env
# ===== SERVER =====
NODE_ENV=production
PORT=5000

# ===== DATABASE =====
DATABASE_URL="postgresql://pranijheightsindia_admin:YOUR_STRONG_DB_PASSWORD@localhost:5432/pranijheightsindia?schema=public&connection_limit=10"

# ===== JWT SECRETS (generate strong random strings) =====
# Run: openssl rand -hex 64
JWT_SECRET=PASTE_64_HEX_CHARS_HERE
JWT_REFRESH_SECRET=PASTE_ANOTHER_64_HEX_CHARS_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ===== CORS — Frontend URL(s) =====
FRONTEND_URL=https://pranijheightsindia.com,https://www.pranijheightsindia.com

# ===== FILE UPLOADS (stored on VPS disk) =====
UPLOAD_DIR=/var/www/pranijheightsindia/backend/uploads

# ===== EMAIL (Gmail App Password or SMTP service) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="Pranijheightsindia <noreply@pranijheightsindia.com>"

# ===== ADMIN =====
ADMIN_EMAIL=admin@pranijheightsindia.com
ADMIN_DEFAULT_PASSWORD=YourStrongAdminPassword123!

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate JWT secrets:**
```bash
openssl rand -hex 64    # Copy output → JWT_SECRET
openssl rand -hex 64    # Copy output → JWT_REFRESH_SECRET
```

### 3.6 Run Prisma Migrations & Seed Database
```bash
cd /var/www/pranijheightsindia/backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3.7 Test Backend Locally
```bash
node src/server.js
# Should see: "Pranijheightsindia API Server" on port 5000
# Ctrl+C to stop
```

### 3.8 Start Backend with PM2
```bash
pm2 start src/server.js --name "pranijheightsindia-api"
pm2 save
pm2 startup    # Follow the instructions it prints
```

### 3.9 Verify Backend
```bash
curl http://localhost:5000/health
# Expected: {"success":true,"database":"connected",...}
```

---

## Phase 4: Frontend Build & Nginx Setup (20-30 mins)

### 4.1 Create Frontend `.env.production`
```bash
cd /var/www/pranijheightsindia
nano .env.production
```
```env
VITE_API_URL=https://pranijheightsindia.com/api
```

### 4.2 Build Frontend
```bash
cd /var/www/pranijheightsindia
npm install
npm run build
# Creates dist/ folder with static files
ls dist/    # Should see index.html and assets/
```

### 4.3 Install & Configure Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

```bash
sudo nano /etc/nginx/sites-available/pranijheightsindia
```

**Paste this complete Nginx config:**
```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name pranijheightsindia.com www.pranijheightsindia.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pranijheightsindia.com www.pranijheightsindia.com;

    # SSL (Certbot will auto-fill these after running certbot)
    ssl_certificate /etc/letsencrypt/live/pranijheightsindia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pranijheightsindia.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ===== FRONTEND (React SPA static files) =====
    root /var/www/pranijheightsindia/dist;
    index index.html;

    # SPA routing — serve index.html for all frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ===== API PROXY → Node.js Backend =====
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # File upload size limit (50MB for catalogues)
        client_max_body_size 50M;
    }

    # ===== UPLOADED FILES (served directly by Nginx for performance) =====
    location /uploads {
        alias /var/www/pranijheightsindia/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;

        # Prevent directory listing
        autoindex off;

        # Only serve known file types
        location ~* \.(jpg|jpeg|png|gif|webp|svg|pdf|ico)$ {
            try_files $uri =404;
        }
    }

    # ===== HEALTH CHECK =====
    location /health {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # ===== SECURITY HEADERS =====
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://pranijheightsindia.com;" always;

    # ===== CACHE STATIC ASSETS (JS/CSS/images from build) =====
    location ~* \.(js|css|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # ===== GZIP COMPRESSION =====
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 256;
}
```

### 4.4 Enable Site & Get SSL
```bash
# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Enable our site
sudo ln -s /etc/nginx/sites-available/pranijheightsindia /etc/nginx/sites-enabled/

# Test config (before SSL)
sudo nginx -t

# Get SSL certificate
sudo certbot --nginx -d pranijheightsindia.com -d www.pranijheightsindia.com

# Test auto-renewal
sudo certbot renew --dry-run

# Reload Nginx
sudo systemctl reload nginx
```

---

## Phase 5: File Upload & Image Management

### 5.1 How File Storage Works
All uploaded files are stored **directly on the VPS disk** — no external cloud storage needed.

| Upload Type | Stored At | Max Size | Served Via |
|-------------|-----------|----------|------------|
| Product Images | `/var/www/pranijheightsindia/backend/uploads/products/` | 5 MB each | Nginx → `/uploads/products/` |
| Category Images | `/var/www/pranijheightsindia/backend/uploads/categories/` | 5 MB each | Nginx → `/uploads/categories/` |
| Catalogue PDFs | `/var/www/pranijheightsindia/backend/uploads/catalogues/` | 50 MB each | Nginx → `/uploads/catalogues/` |
| Testimonial Avatars | `/var/www/pranijheightsindia/backend/uploads/testimonials/` | 5 MB each | Nginx → `/uploads/testimonials/` |
| General Files | `/var/www/pranijheightsindia/backend/uploads/general/` | 50 MB each | Nginx → `/uploads/general/` |

### 5.2 Upload API Endpoints
All uploads go through the backend API (authentication required):

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/upload` | Upload single file |
| `POST` | `/api/upload/multiple` | Upload multiple files |
| `POST` | `/api/upload/product-image` | Upload product image (auto-generates thumbnail) |
| `POST` | `/api/upload/category-image` | Upload category image |
| `POST` | `/api/upload/catalogue` | Upload catalogue PDF + optional thumbnail |
| `POST` | `/api/upload/testimonial-image` | Upload testimonial avatar |
| `GET` | `/api/upload/media` | Browse all uploaded files (paginated) |
| `GET` | `/api/upload/stats` | Get storage usage statistics |
| `DELETE` | `/api/upload/:id` | Delete a file from disk + database |

### 5.3 Image URL Format
Once uploaded, images are accessible at:
```
https://pranijheightsindia.com/uploads/products/image-name-123456-abc.jpg
https://pranijheightsindia.com/uploads/categories/category-123456-xyz.png
```
These URLs are served **directly by Nginx** (fast, cached, no Node.js involved).

### 5.4 Database Tracking
Every uploaded file is tracked in the `media` table:
- `filename`, `originalName`, `mimeType`, `size`, `url`, `folder`
- Accessible through Admin Panel → Media Library

### 5.5 Backup Strategy for Uploads
```bash
# Add to crontab for daily backup of uploaded files
crontab -e

# Daily backup at 2 AM
0 2 * * * tar -czf /var/backups/pranijheightsindia-uploads-$(date +\%Y\%m\%d).tar.gz /var/www/pranijheightsindia/backend/uploads

# Keep only last 7 days of backups
0 3 * * * find /var/backups/pranijheightsindia-uploads-*.tar.gz -mtime +7 -delete
```

---

## Phase 6: Post-Launch Verification (15-20 mins)

### Reconciliation Note (2026-03-18)

This checklist was created before final production hardening and remains as a broad manual launch guide.
For handover signoff, use the dedicated production gates first:

- `PRODUCTION_ADMIN_QA_SIGNOFF.md`
- `PRODUCTION_SECRET_ROTATION_SIGNOFF.md`

Current verified-live status snapshot:

- [x] Health endpoint responding (`/health` = 200)
- [x] Backend API identity parity verified (`/api` message matches source)
- [x] Default seeded admin password rejected (401)
- [x] Forgot-password endpoint reachable

Treat remaining unchecked items below as manual validation tasks unless already captured in the signoff documents.

### 6.1 Website Testing Checklist
- [ ] **Homepage** loads with all sections (Hero, Products, About, etc.)
- [ ] **Products page** loads products from API
- [ ] **Product Details** page works with real data
- [ ] **Compare page** functional
- [ ] **Contact form** submits → check email arrives
- [ ] **Quote request form** submits successfully
- [ ] **Dealer application** submits successfully
- [ ] **Resources page** displays correctly
- [ ] **About page** loads all content
- [ ] **404 page** shows for invalid URLs (e.g., `/nonexistent`)

### 6.2 Admin Panel Testing
- [ ] `/admin/login` page loads
- [ ] Login with admin credentials works
- [ ] Dashboard shows real stats from database
- [ ] **Upload product image** → appears in product form
- [ ] **Upload category image** → shows correctly
- [ ] Products CRUD (create with images, edit, delete)
- [ ] Categories CRUD (create with images, edit, delete)
- [ ] Contacts list & status updates
- [ ] Quotes list & status updates
- [ ] Dealers list & status updates
- [ ] Testimonials CRUD
- [ ] Newsletter subscribers list
- [ ] Settings page shows correct system info + storage stats
- [ ] CSV exports download correctly
- [ ] Logout works properly

### 6.3 File Upload Testing
- [ ] Upload a product image → check it appears at `/uploads/products/`
- [ ] Upload a category image → verify thumbnail generated
- [ ] Upload a catalogue PDF → verify download works
- [ ] Delete an uploaded file → verify removed from disk
- [ ] Check storage stats show correct disk usage

### 6.4 Security Verification
- [ ] HTTPS working (green lock, no mixed content)
- [ ] Health check: `curl https://pranijheightsindia.com/health`
- [ ] No demo credentials visible on login page
- [ ] Rate limiting works (try 10+ rapid login attempts)
- [ ] Upload directory has no directory listing (try `/uploads/` directly)
- [ ] Only admins can access upload endpoints

### 6.5 Performance Checks
- [ ] Run Lighthouse audit in Chrome DevTools (target: 80+ score)
- [ ] Verify gzip: `curl -H "Accept-Encoding: gzip" -I https://pranijheightsindia.com`
- [ ] Verify static caching: `curl -I https://pranijheightsindia.com/assets/index-xxx.js` (should show `Cache-Control`)

---

## Phase 7: Security Hardening & Maintenance

### 7.1 Change Default Admin Password (IMMEDIATELY)
```bash
# Via API:
curl -X PUT https://pranijheightsindia.com/api/auth/change-password \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"your-seed-password","newPassword":"NewStrongPassword!@#456"}'
```
Or change it in the Admin Panel → Settings → Change Password

### 7.2 PM2 Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 7.3 Automatic Security Updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 7.4 Database Backups (Daily)
```bash
crontab -e
```
Add:
```cron
# Database backup at 1 AM daily
0 1 * * * pg_dump -U pranijheightsindia_admin pranijheightsindia | gzip > /var/backups/pranijheightsindia-db-$(date +\%Y\%m\%d).sql.gz

# File uploads backup at 2 AM daily
0 2 * * * tar -czf /var/backups/pranijheightsindia-uploads-$(date +\%Y\%m\%d).tar.gz /var/www/pranijheightsindia/backend/uploads

# Clean backups older than 14 days
0 3 * * * find /var/backups/pranijheightsindia-*.gz -mtime +14 -delete
```

### 7.5 Monitor Disk Space
```bash
# Check disk usage
df -h
du -sh /var/www/pranijheightsindia/backend/uploads/

# Set up alert (add to crontab - alerts if >80% full)
0 */6 * * * [ $(df / --output=pcent | tail -1 | tr -d ' %') -gt 80 ] && echo "Disk >80% full" | mail -s "VPS Disk Alert" admin@pranijheightsindia.com
```

### 7.6 Updating the Application
```bash
cd /var/www/pranijheightsindia

# Pull latest code
git pull origin main

# Rebuild frontend
npm install
npm run build

# Update backend
cd backend
npm install --production
npx prisma generate
npx prisma db push   # Apply any schema changes

# Restart backend
pm2 restart pranijheightsindia-api

# Reload Nginx (if config changed)
sudo nginx -t && sudo systemctl reload nginx
```

---

## Quick Reference: Environment Variables

### Frontend (.env.production)
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://pranijheightsindia.com/api` |

### Backend (.env)
| Variable | Required | Example |
|----------|----------|---------|
| `NODE_ENV` | **Yes** | `production` |
| `PORT` | **Yes** | `5000` |
| `DATABASE_URL` | **Yes** | `postgresql://pranijheightsindia_admin:PASS@localhost:5432/pranijheightsindia?schema=public&connection_limit=10` |
| `JWT_SECRET` | **CRITICAL** | `openssl rand -hex 64` |
| `JWT_REFRESH_SECRET` | **CRITICAL** | `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | Yes | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | `7d` |
| `FRONTEND_URL` | **Yes** | `https://pranijheightsindia.com,https://www.pranijheightsindia.com` |
| `UPLOAD_DIR` | Yes | `/var/www/pranijheightsindia/backend/uploads` |
| `ADMIN_EMAIL` | Yes | `admin@pranijheightsindia.com` |
| `ADMIN_DEFAULT_PASSWORD` | First seed | Strong password |
| `SMTP_HOST` | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | Yes | `587` |
| `SMTP_USER` | Yes | Your email |
| `SMTP_PASS` | Yes | Gmail App Password |
| `EMAIL_FROM` | Yes | `"Pranijheightsindia <noreply@pranijheightsindia.com>"` |

---

## VPS Architecture Overview

```
┌─────────────────── VPS Server ───────────────────┐
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │              NGINX (Port 80/443)            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │  / → SPA │  │ /api →   │  │/uploads →│  │  │
│  │  │  (dist/) │  │ Node.js  │  │ (disk)   │  │  │
│  │  └──────────┘  └────┬─────┘  └──────────┘  │  │
│  └──────────────────────┼──────────────────────┘  │
│                         │                         │
│  ┌──────────────────────┴──────────────────────┐  │
│  │       Node.js + Express (Port 5000)         │  │
│  │              managed by PM2                 │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │   API Routes    │   Upload Handler     │ │  │
│  │  │   Auth, CRUD    │   Multer → Disk      │ │  │
│  │  └────────┬────────┴────────┬─────────────┘ │  │
│  └───────────┼─────────────────┼───────────────┘  │
│              │                 │                   │
│  ┌───────────┴───────┐  ┌─────┴─────────────────┐ │
│  │  PostgreSQL DB    │  │  /uploads/ directory   │ │
│  │  (Port 5432)      │  │  products/             │ │
│  │  pranijheightsindia  │  │  categories/           │ │
│  │                   │  │  catalogues/           │ │
│  │  Tables:          │  │  testimonials/         │ │
│  │  - users          │  │  general/              │ │
│  │  - products       │  │                        │ │
│  │  - categories     │  │  All images, PDFs,     │ │
│  │  - contacts       │  │  and files stored      │ │
│  │  - quotes         │  │  directly on VPS disk  │ │
│  │  - media (tracks  │  │                        │ │
│  │    uploaded files) │  │                        │ │
│  │  - ...            │  │                        │ │
│  └───────────────────┘  └────────────────────────┘ │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## Known Limitations (Non-Blocking for Launch)

1. **Forgot Password** — Returns success but doesn't actually send reset email (stub implementation)
2. **Dealer Login** — Shows "coming soon" alert; dealers apply via the application form
3. **Resource Downloads** — 12 download links on Resources page point to `#`; upload actual PDFs via admin panel after launch
4. **Email Queue** — Emails sent synchronously; high volume could slow responses
5. **Client Logos** — Using placeholder logos on homepage; replace with real client logos

---

## Timeline Summary

| Phase | Task | Time |
|-------|------|------|
| 1 | VPS Setup + Firewall + DNS | 30-45 min |
| 2 | PostgreSQL Database Setup | 15-20 min |
| 3 | Backend Deploy + Prisma + PM2 | 30-45 min |
| 4 | Frontend Build + Nginx + SSL | 20-30 min |
| 5 | File Upload Verification | 10-15 min |
| 6 | Testing & Verification | 15-20 min |
| 7 | Security Hardening + Backups | 15-20 min |
| **Total** | | **~2.5-3.5 hours** |
