# Client Change Tasks Tracker

> Purpose: Track post-completion client change requests separately from core development tasks.
> Last updated: 2026-03-27

## Status Key
- [ ] Pending
- [~] In progress
- [x] Completed
- [!] Blocked (waiting on client input/asset)

---

## CR-001: Logo Quality and Blend Issue
Status: [!] Blocked
Priority: High

Client feedback:
- Current website logo looks pasted/sticker-like.
- Logo quality does not look premium.
- White background on logo does not blend with site header/background.
- Client shared a reference look for expected brand presentation.

Technical findings:
- Current logo file in use: /public/logo.png (non-transparent appearance against dark backgrounds).
- Same logo reused in navbar, footer, admin, and email templates.
- Email template currently forces white background and padding behind logo, which amplifies sticker look.

Action checklist:
- [ ] Get final brand-approved transparent assets from client:
  - [ ] logo-light (for dark backgrounds)
  - [ ] logo-dark (for light backgrounds)
  - [ ] Preferred format: SVG, else high-res PNG with alpha transparency
- [ ] Replace header/footer/admin logo usage with proper light/dark variant mapping.
- [ ] Remove forced white background treatment in email logo block.
- [ ] QA across desktop/mobile and dark/light sections.
- [ ] Validate visual quality on production and collect client sign-off.

Blocker:
- Waiting for final production-ready transparent logo assets from client.

---

## Incoming Requests
Add new client-requested changes below this section as CR-002, CR-003, etc.

---

## CR-002: Product Full Image View Not Working
Status: [x] Completed
Priority: High

Client feedback:
- On product detail page, full image view control was not working.
- Maximize/full-view interaction did nothing when clicked.
- Bottom helper control near viewer also appeared non-functional.

Fix implemented:
- Wired fullscreen action to open a proper lightbox modal.
- Connected both controls to the fullscreen action:
  - Maximize button (top-right on product image)
  - Bottom viewer helper pill
- Added fullscreen modal features:
  - Close button
  - Previous/next image navigation
  - Thumbnail strip for quick selection
- Preserved existing product image fallback behavior.

Code references:
- src/pages/ProductDetails.jsx

Validation:
- Frontend production build passed after fix.

---

## CR-003: Hero Headline Copy Update + Remove Animated Panels
Status: [x] Completed
Priority: High

Client feedback:
- Replace hero headline text:
  - From: "India's Oldest & Most Trusted PVC Wall Panel Brand"
  - To: "India's No.1 Manufacturer of PVC Wall Panels, Fluted Panels & ACP/HPL Sheets - Trusted by Dealers Across India"
- Remove the 3 animated panel visuals in the hero section.

Fix implemented:
- Updated hero main headline copy exactly as requested.
- Removed right-side animated panel visual block from hero.
- Kept hero readability and background overlay balanced after visual removal.

Code references:
- src/components/home/Hero.jsx

Validation:
- Frontend production build passed after change.
