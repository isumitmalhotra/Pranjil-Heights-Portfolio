# SSL/HTTPS Production Setup Guide

This guide covers configuring SSL/HTTPS for the PVC Portfolio application in production.

## Why HTTPS?

1. **Security** - Encrypts data in transit (passwords, user data)
2. **SEO** - Google ranks HTTPS sites higher
3. **Trust** - Browser shows secure padlock icon
4. **Required** - Modern features require HTTPS (geolocation, service workers)
5. **Compliance** - Required for payment processing and data protection laws

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Production Setup                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Internet                                                       │
│       │                                                          │
│       ▼                                                          │
│   ┌───────────────────────────┐                                  │
│   │   Nginx (Reverse Proxy)   │ ◄── SSL/TLS Termination         │
│   │   Port 80, 443            │     Let's Encrypt Cert          │
│   └───────────────────────────┘                                  │
│       │                                                          │
│       ├──────────────────────────────┐                           │
│       ▼                              ▼                           │
│   ┌─────────────────┐    ┌──────────────────────┐                │
│   │   Frontend      │    │   Backend API        │                │
│   │   (Static/Vite) │    │   (Node.js:5000)     │                │
│   │   Port 3000     │    │                      │                │
│   └─────────────────┘    └──────────────────────┘                │
│                                    │                             │
│                                    ▼                             │
│                          ┌──────────────────┐                    │
│                          │   PostgreSQL     │                    │
│                          │   Port 5432      │                    │
│                          └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Option 1: Let's Encrypt with Nginx (Recommended)

### Prerequisites

- Ubuntu 22.04 VPS/Server
- Domain pointing to server IP (DNS A record)
- Ports 80 and 443 open in firewall

### Step 1: Install Nginx and Certbot

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

### Step 2: Configure DNS

Point your domain to the server:

```
Type: A
Name: @  (or www)
Value: YOUR_SERVER_IP
TTL: 3600
```

Wait for DNS propagation (can take up to 24 hours, usually 10-30 minutes).

### Step 3: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/pranijheightsindia.com
```

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name pranijheightsindia.com www.pranijheightsindia.com;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name pranijheightsindia.com www.pranijheightsindia.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/pranijheightsindia.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/pranijheightsindia.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;
    
    # Root directory for frontend (built files)
    root /var/www/pranijheightsindia.com/dist;
    index index.html;
    
    # Frontend - Serve static files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # File uploads
    location /uploads/ {
        alias /var/www/pranijheightsindia.com/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Step 4: Enable Site and Get SSL Certificate

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pranijheightsindia.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d pranijheightsindia.com -d www.pranijheightsindia.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect option (recommended: 2)
```

### Step 5: Auto-Renewal

```bash
# Test renewal process
sudo certbot renew --dry-run

# Certbot automatically adds cron job for renewal
# Verify with:
sudo systemctl list-timers | grep certbot
```

---

## Option 2: Cloudflare SSL (Free & Easy)

If using Cloudflare as DNS provider:

### Step 1: Add Domain to Cloudflare

1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers at your registrar to Cloudflare's nameservers

### Step 2: Configure SSL Mode

1. Go to SSL/TLS in Cloudflare dashboard
2. Choose "Full (strict)" mode
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

### Step 3: Origin Certificate (Server Side)

```bash
# In Cloudflare Dashboard:
# SSL/TLS → Origin Server → Create Certificate

# Save the certificate and key
sudo nano /etc/ssl/cloudflare/origin.pem
sudo nano /etc/ssl/cloudflare/origin.key

# Set permissions
sudo chmod 600 /etc/ssl/cloudflare/origin.key
```

### Step 4: Nginx Configuration for Cloudflare

```nginx
server {
    listen 443 ssl http2;
    server_name pranijheightsindia.com www.pranijheightsindia.com;
    
    # Cloudflare Origin Certificate
    ssl_certificate /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin.key;
    
    # Only allow Cloudflare IPs
    # https://www.cloudflare.com/ips/
    allow 173.245.48.0/20;
    allow 103.21.244.0/22;
    allow 103.22.200.0/22;
    allow 103.31.4.0/22;
    allow 141.101.64.0/18;
    allow 108.162.192.0/18;
    allow 190.93.240.0/20;
    allow 188.114.96.0/20;
    allow 197.234.240.0/22;
    allow 198.41.128.0/17;
    allow 162.158.0.0/15;
    allow 104.16.0.0/13;
    allow 104.24.0.0/14;
    allow 172.64.0.0/13;
    allow 131.0.72.0/22;
    deny all;
    
    # Rest of configuration...
    root /var/www/pranijheightsindia.com/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## Option 3: AWS Application Load Balancer

For AWS deployments with ALB:

### Step 1: Request Certificate in ACM

1. Go to AWS Certificate Manager
2. Request a public certificate
3. Enter domain: `pranijheightsindia.com`, `*.pranijheightsindia.com`
4. Choose DNS validation
5. Create CNAME records in Route 53

### Step 2: Configure ALB

1. Create Application Load Balancer
2. Add HTTPS listener (port 443)
3. Select ACM certificate
4. Configure target group pointing to EC2 instances

### Step 3: Redirect HTTP to HTTPS

Add listener rule for port 80:
- Action: Redirect
- Protocol: HTTPS
- Port: 443
- Status code: 301

---

## Backend HTTPS Configuration

### Update Backend Environment

```bash
# .env
NODE_ENV=production
FRONTEND_URL=https://pranijheightsindia.com

# If running Node.js directly with SSL (not recommended):
# SSL_CERT_PATH=/path/to/cert.pem
# SSL_KEY_PATH=/path/to/key.pem
```

### Express.js Trust Proxy

Since Nginx handles SSL, Express needs to trust the proxy:

```javascript
// In server.js
import express from 'express';
const app = express();

// Trust first proxy (Nginx)
app.set('trust proxy', 1);

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}
```

### Update CORS for HTTPS

```javascript
// In server.js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://pranijheightsindia.com', 'https://www.pranijheightsindia.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

---

## Security Hardening

### SSL/TLS Best Practices

```nginx
# Add to Nginx server block
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

### HTTP Security Headers

```nginx
# Already included in main config, but here for reference
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Content Security Policy

```nginx
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.pranijheightsindia.com https://www.google-analytics.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
" always;
```

---

## Testing SSL Configuration

### Online Tools

1. **SSL Labs Test**: https://www.ssllabs.com/ssltest/
   - Aim for A+ grade
   
2. **Security Headers**: https://securityheaders.com/
   - Check all security headers are in place

3. **Mozilla Observatory**: https://observatory.mozilla.org/
   - Comprehensive security audit

### Command Line Tests

```bash
# Check certificate
openssl s_client -connect pranijheightsindia.com:443 -servername pranijheightsindia.com

# Check certificate expiry
echo | openssl s_client -connect pranijheightsindia.com:443 2>/dev/null | openssl x509 -noout -dates

# Check HTTPS redirect
curl -I http://pranijheightsindia.com

# Check security headers
curl -I https://pranijheightsindia.com
```

---

## Deployment Checklist

### Before Going Live

- [ ] Domain DNS configured and propagated
- [ ] Ports 80 and 443 open in firewall
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained (Let's Encrypt or Cloudflare)
- [ ] HTTP to HTTPS redirect working
- [ ] Backend running on port 5000
- [ ] Frontend built and deployed to /var/www/
- [ ] API proxy configured in Nginx
- [ ] Environment variables updated with HTTPS URLs
- [ ] CORS configured for HTTPS domains
- [ ] Security headers configured
- [ ] SSL Labs test passed (A+ grade)

### Post-Deployment

- [ ] Test all forms (contact, quote, dealer application)
- [ ] Test admin login
- [ ] Verify emails are sending
- [ ] Check browser console for mixed content warnings
- [ ] Monitor error logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure certificate renewal alerts

---

## Troubleshooting

### Common Issues

**Certificate not trusted:**
```bash
# Check certificate chain
openssl s_client -connect pranijheightsindia.com:443 -showcerts
```

**Mixed content warnings:**
- Ensure all resources (images, scripts, APIs) use HTTPS
- Check for hardcoded HTTP URLs

**502 Bad Gateway:**
```bash
# Check if backend is running
sudo systemctl status node-app  # or pm2 status

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

**Certificate renewal failed:**
```bash
# Manual renewal
sudo certbot renew --force-renewal

# Check logs
sudo cat /var/log/letsencrypt/letsencrypt.log
```

---

## Quick Reference

```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check SSL certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Check firewall
sudo ufw status

# Open HTTPS port
sudo ufw allow 443/tcp
```
