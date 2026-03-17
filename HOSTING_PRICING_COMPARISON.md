# Cloud Hosting Pricing Comparison
**Date:** January 28, 2026  
**Project:** Pranijheightsindia PVC Portfolio Website

---

## Server Requirements

| Specification | Value |
|--------------|-------|
| CPU | 2 vCPU |
| RAM | 4 GB |
| Storage | 50 GB SSD |
| Bandwidth | 2 TB/month |
| Region | India (Mumbai/Bangalore) |

---

## Monthly Pricing Comparison

### 1. Amazon Web Services (AWS) - Mumbai Region

| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| EC2 (t3.medium) | 2 vCPU, 4GB RAM | **$33.41** |
| EBS Storage | 50GB SSD (gp3) | **$4.00** |
| Data Transfer | 2TB outbound | **$174.08** |
| **Total** | | **₹17,750** (~$211/month) |

**With Reserved Instance (1 year):** ₹12,400/month ($148/month)

---

### 2. Google Cloud Platform (GCP) - Mumbai Region

| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| Compute Engine (e2-standard-2) | 2 vCPU, 4GB RAM | **$48.55** |
| Persistent Disk | 50GB SSD | **$8.50** |
| Network Egress | 2TB outbound | **$240.00** |
| **Total** | | **₹25,000** (~$297/month) |

**With Committed Use (1 year):** ₹17,500/month ($208/month)

---

### 3. Microsoft Azure - Pune Region

| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| Virtual Machine (B2s) | 2 vCPU, 4GB RAM | **$36.79** |
| Managed Disk | 50GB Premium SSD | **$7.37** |
| Bandwidth | 2TB outbound | **$173.60** |
| **Total** | | **₹18,350** (~$218/month) |

**With Reserved Instance (1 year):** ₹13,100/month ($156/month)

---

### 4. DigitalOcean - Bangalore Region

| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| Droplet (Basic) | 2 vCPU, 4GB RAM, 80GB SSD | **$24.00** |
| Bandwidth | **2TB included** | **FREE** |
| Additional Storage | Not needed (80GB included) | **$0** |
| **Total** | | **₹2,000** (~$24/month) |

✅ **No hidden charges** | ✅ **Bandwidth included** | ✅ **Simple pricing**

---

## Quick Summary

| Provider | Monthly Cost (₹) | Monthly Cost ($) | Bandwidth Charges |
|----------|------------------|------------------|-------------------|
| **AWS** | ₹17,750 | $211 | ❌ Expensive ($0.087/GB) |
| **GCP** | ₹25,000 | $297 | ❌ Most Expensive ($0.12/GB) |
| **Azure** | ₹18,350 | $218 | ❌ Expensive ($0.087/GB) |
| **DigitalOcean** | ₹2,000 | $24 | ✅ **FREE (included)** |

---

## Annual Cost Comparison

| Provider | Year 1 | Year 2 | Year 3 | 3-Year Total |
|----------|--------|--------|--------|--------------|
| AWS | ₹2,13,000 | ₹2,13,000 | ₹2,13,000 | ₹6,39,000 |
| GCP | ₹3,00,000 | ₹3,00,000 | ₹3,00,000 | ₹9,00,000 |
| Azure | ₹2,20,200 | ₹2,20,200 | ₹2,20,200 | ₹6,60,600 |
| **DigitalOcean** | **₹24,000** | **₹24,000** | **₹24,000** | **₹72,000** |

**Savings with DigitalOcean:** ₹5,67,000 over 3 years (vs AWS)

---

## Why DigitalOcean is 10x Cheaper?

### Major Cloud Providers (AWS/GCP/Azure)
- ❌ Bandwidth charged separately (~₹7/GB after 1GB)
- ❌ 2TB bandwidth = ₹14,000-20,000/month alone
- ❌ Complex pricing with hidden costs
- ❌ Designed for enterprise with heavy cloud services usage

### DigitalOcean
- ✅ All-inclusive pricing
- ✅ 2TB+ bandwidth included in droplet price
- ✅ No surprise charges
- ✅ Designed for developers and small-medium businesses

---

## Database Costs (Additional)

If using managed PostgreSQL database:

| Provider | Specs | Monthly Cost |
|----------|-------|--------------|
| AWS RDS | 1GB RAM, 20GB storage | $15-25 |
| GCP Cloud SQL | 1GB RAM, 20GB storage | $12-20 |
| Azure Database | 1GB RAM, 20GB storage | $25-35 |
| **DigitalOcean Managed** | 1GB RAM, 10GB storage | **$15** |
| **Self-Hosted on VPS** | Included in droplet | **$0** |

---

## File Storage Costs (20GB for catalogues/images)

| Provider | 20GB Storage | Monthly Cost |
|----------|--------------|--------------|
| AWS S3 | 20GB Standard | $0.46 + transfer fees |
| GCP Cloud Storage | 20GB Standard | $0.52 + transfer fees |
| Azure Blob | 20GB Hot tier | $0.44 + transfer fees |
| **DigitalOcean Spaces** | 250GB (with CDN) | **$5** |
| **VPS Storage** | Included in droplet | **$0** |

---

## Complete Solution Cost

### Option 1: DigitalOcean (Recommended)
```
Server (2 vCPU, 4GB, 80GB): ₹2,000/month
Managed Database: ₹1,200/month
Spaces Storage (250GB): ₹400/month
Domain + SSL: FREE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ₹3,600/month (~$43/month)
```

### Option 2: Self-Managed VPS (Most Economical)
```
VPS (2 vCPU, 4GB, 50GB): ₹1,000-1,500/month
Database: Included (self-hosted)
Storage: Included
Domain: ₹800/year
SSL: FREE (Let's Encrypt)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ₹1,000-1,500/month (~$12-18/month)
```

### Option 3: AWS (For Comparison)
```
Server: ₹17,750/month
Database: ₹1,800/month
Storage (S3): ₹40/month
Domain + SSL: FREE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ₹19,590/month (~$233/month)
```

---

## Recommendation

### For Budget-Conscious Projects:
**DigitalOcean** - Simple, transparent pricing with all essentials included

### For Enterprise/Scaling Requirements:
**AWS** - If you need advanced features like auto-scaling, load balancing, etc.

### For Maximum Savings:
**VPS** - Full control, lowest cost, requires technical management

---

## Additional Considerations

| Factor | AWS/GCP/Azure | DigitalOcean | VPS |
|--------|---------------|--------------|-----|
| Setup Time | 2-4 hours | 1-2 hours | 4-8 hours |
| Maintenance | Low | Low | High |
| Scalability | Excellent | Good | Manual |
| Support | Paid plans | Good | Minimal |
| India Presence | Yes | Yes | Varies |

---

**Note:** All prices are approximate and subject to change. Prices shown are in INR (₹) with USD equivalent. The major cost difference is due to bandwidth charges which are included in DigitalOcean but charged separately (and heavily) by AWS/GCP/Azure.

**Recommendation:** For a B2B corporate website with moderate traffic, DigitalOcean offers the best value with predictable, transparent pricing.
