# Production Admin QA Signoff

This is the final handover-grade QA gate for admin workflows in production.

## Execution Command

Run from repository root:

```bash
cd backend
QA_BASE_URL=https://pranijheightsindia.com QA_ADMIN_EMAIL=<admin_email> QA_ADMIN_PASSWORD=<admin_password> npm run qa:prod
```

On PowerShell:

```powershell
cd backend
$env:QA_BASE_URL = 'https://pranijheightsindia.com'
$env:QA_ADMIN_EMAIL = '<admin_email>'
$env:QA_ADMIN_PASSWORD = '<admin_password>'
npm run qa:prod
```

## Scope Covered (Must Pass)

- AUTH: Admin login
- PRODUCTS: create, list, update, delete
- CATEGORIES: create, list, update, delete
- CONTACTS: public submit, admin list, status update, export, delete
- QUOTES: public submit, admin list, status update, export, delete
- DEALERS: public apply, admin list, status update, export, delete
- TESTIMONIALS: create, list, update, delete
- NEWSLETTER: subscribe, admin list, delete
- CATALOGUES: create, stats, download history, update, delete
- MEDIA: upload, list, delete

## Password Reset E2E (Manual Signoff)

Automated script validates forgot-password initiation endpoint, but full reset flow requires mailbox access.

Required manual checks:

1. Go to /admin/forgot-password and submit admin email.
2. Open reset email and click reset link.
3. Set new password at /admin/reset-password.
4. Re-login at /admin/login with new password.

Mark as PASS only when all 4 are verified.

## Signoff Table

| Module | Check | Status | Evidence | Owner | Date |
|---|---|---|---|---|---|
| AUTH | Admin login |  |  |  |  |
| PRODUCTS | CRUD |  |  |  |  |
| CATEGORIES | CRUD |  |  |  |  |
| CONTACTS | list/status/export/delete |  |  |  |  |
| QUOTES | list/status/export/delete |  |  |  |  |
| DEALERS | list/status/export/delete |  |  |  |  |
| TESTIMONIALS | CRUD |  |  |  |  |
| NEWSLETTER | list/delete |  |  |  |  |
| CATALOGUES | admin CRUD/stats/history |  |  |  |  |
| MEDIA | upload/list/delete |  |  |  |  |
| AUTH RESET | forgot/reset/re-login |  |  |  |  |

## Exit Criteria

- No failed checks from automated script.
- Password reset manual flow passes.
- No unresolved production-severity defects.
- Signed by QA owner + engineering owner.
