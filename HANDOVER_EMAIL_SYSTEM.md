# Email System Handover - Pranij Heights India

Date: 2026-03-23

## Scope Completed

- User-facing confirmation emails are wired for:
  - Contact form
  - Quote request
  - Dealer application
  - Newsletter subscription/unsubscription
- Admin notification emails are wired for:
  - New contact inquiries
  - New quote requests
  - New dealer applications
  - New newsletter subscriptions
  - New catalogue lead submissions
- Admin notification recipients now support a comma-separated list via `NOTIFICATION_EMAILS`.
- Email template admin links now match actual admin routes (`/admin/<module>?id=<id>`).
- Newsletter links now use a valid frontend route (`/unsubscribe`) with resubscribe support.
- Resources catalogue downloads now capture lead details and trigger admin lead notifications.

## Required Production Environment Variables

Set these in backend production `.env`:

```env
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@pranijheightsindia.com
SMTP_PASS=<TITAN_MAILBOX_PASSWORD>
EMAIL_FROM="Pranijheightsindia <contact@pranijheightsindia.com>"

NOTIFICATION_EMAILS=contact@pranijheightsindia.com,accounts@pranijheightsindia.com
ADMIN_EMAIL=contact@pranijheightsindia.com
FRONTEND_URL=https://pranijheightsindia.com
NODE_ENV=production
```

## Live Smoke Test Checklist

Run all five from production website/API:

1. Contact submit
- Trigger: `POST /api/contact`
- Expectation:
  - User gets thank-you email.
  - Admin recipients get new contact alert.

2. Quote submit
- Trigger: `POST /api/quotes`
- Expectation:
  - User gets quote request received email.
  - Admin recipients get new quote alert.

3. Dealer application submit
- Trigger: `POST /api/dealers/apply`
- Expectation:
  - User gets application received email.
  - Admin recipients get new dealer alert.

4. Newsletter subscribe
- Trigger: `POST /api/newsletter/subscribe`
- Expectation:
  - User gets welcome email.
  - Admin recipients get newsletter signup alert.

5. Catalogue lead download (Resources page)
- Trigger: `POST /api/catalogues/:slug/download` via lead modal
- Expectation:
  - File download starts.
  - Admin recipients get catalogue lead alert.

## Rollback Plan

If any email issue appears after release:

1. Roll back to previous commit in production deploy target.
2. Keep website/API online while disabling email side effects by setting placeholder SMTP password:

```env
SMTP_PASS=your-smtp-password
```

This keeps form submissions working while email sending falls back safely.

3. Re-deploy and verify `/health` + form submissions.

## Operational Notes

- Email failures do not block form submission (non-fatal by design).
- Use Titan mailbox `contact@pranijheightsindia.com` as sender.
- Use both `contact@` and `accounts@` in `NOTIFICATION_EMAILS` for admin alerts.
- Unsubscribe/resubscribe endpoint is available at `/unsubscribe` route on frontend.
