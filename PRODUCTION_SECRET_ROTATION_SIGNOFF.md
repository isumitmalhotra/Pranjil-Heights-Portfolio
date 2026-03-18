# Production Secret Rotation and Security Signoff

## Objective

Ensure no default credentials remain active and all production secrets are rotated, documented, and owned.

## Current Verification Snapshot

- Default admin password login (`admin@pranijheightsindia.com` / `admin123`) returns 401: PASS
- Live API identity string check against backend source expected value: FAIL (backend deployment/version drift)

## Mandatory Rotation Tasks

### 1) Application Secrets

- [ ] Rotate `JWT_SECRET`
- [ ] Rotate `JWT_REFRESH_SECRET`
- [ ] Rotate `ADMIN_DEFAULT_PASSWORD` and ensure seed default is not active
- [ ] Rotate SMTP credentials (`SMTP_USER` / `SMTP_PASS`)
- [ ] Rotate database credentials in `DATABASE_URL`

### 2) CI/CD Secrets (GitHub Actions)

- [ ] Rotate `VPS_PASSWORD`
- [ ] Verify/rotate `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_APP_DIR`, `VPS_HEALTH_URL`
- [ ] Re-run deploy workflow after secret rotation

### 3) Infrastructure Access

- [ ] Rotate VPS root/admin passwords or SSH keys
- [ ] Remove unused users/keys
- [ ] Confirm least-privilege service account ownership for deployment

### 4) Documentation and Ownership

- [ ] Record rotated secrets in secure password manager/vault (not in repo)
- [ ] Assign owners for each secret set (App, DB, SMTP, VPS, GitHub)
- [ ] Record rotation date, next due date, and emergency contact

## Verification Commands

Run from repo root:

```bash
cd backend
npm run security:verify
```

PowerShell:

```powershell
cd backend
npm run security:verify
```

Expected for complete pass:

- API identity message matches source
- /health returns 200
- default admin password login rejected (401)
- forgot-password endpoint reachable

## Evidence Table

| Control | Expected | Result | Evidence | Owner | Date |
|---|---|---|---|---|---|
| API identity | Matches backend source |  |  |  |  |
| Default admin password | Rejected (401) |  |  |  |  |
| Forgot-password endpoint | Reachable |  |  |  |  |
| JWT secrets rotated | New values in prod only |  |  |  |  |
| DB creds rotated | New DB credentials active |  |  |  |  |
| SMTP creds rotated | New SMTP creds active |  |  |  |  |
| CI/CD secrets rotated | Updated in GitHub |  |  |  |  |
| VPS credentials rotated | Updated keys/passwords |  |  |  |  |

## Blocker Note

If API identity check fails but deploy shows "success", treat as deployment-path/process drift and resolve before handover signoff.
