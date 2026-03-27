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

Final copy refinement:
- Removed trailing line/phrase "Trusted by Dealers Across India" from the hero heading as requested.

---

## CR-004: Hero Looks Empty After Panel Removal
Status: [x] Completed
Priority: High

Client feedback:
- After removing animated hero panels, hero section looked visually empty.

Fix implemented:
- Rebalanced hero to a two-column desktop layout.
- Added a static right-side premium highlights panel (no animated product visuals).
- Improved headline composition into cleaner line breaks for readability.
- Kept trust signals and CTA section prominent while preserving clean look.

Code references:
- src/components/home/Hero.jsx

Validation:
- Frontend production build passed after change.

---

## CR-005: Remove Empty Technical Documentation and Installation Guides Sections
Status: [x] Completed
Priority: High

Client feedback:
- Remove Technical Documentation and Installation Guides areas from website where nothing is available to upload.

Fix implemented:
- Removed Technical Documentation section rendering from Resources page.
- Removed Installation Guides section from Resources page.
- Updated Resources page heading/description copy to remove technical docs/install guides references.
- Removed Technical Documents item from Resources dropdown in navbar.
- Removed Technical Documents quick link from footer.

Code references:
- src/pages/Resources.jsx
- src/components/Navbar.jsx
- src/components/Footer.jsx

Validation:
- Frontend production build passed after change.

---

## CR-006: Update Site-Wide Contact Phone and Email, Remove Named Contact
Status: [x] Completed
Priority: High

Client request:
- Update contact phone everywhere to: 9813027070
- Use contact@pranijheightsindia.com at all public contact locations
- Remove "Deepak" name references from contact labels

Fix implemented:
- Replaced phone/tel links and placeholders across website sections.
- Updated email displays/links to contact@pranijheightsindia.com where user-facing contact email was shown.
- Removed named-contact labels and kept neutral call labels.
- Updated backend email company footer metadata phone and removed contact person line.
- Updated seed contact phone and removed seeded named-contact key.

Code references:
- src/components/Footer.jsx
- src/pages/Contact.jsx
- src/components/home/CTASection.jsx
- src/pages/DealerPortal.jsx
- src/pages/Resources.jsx
- src/components/contact/QuotationForm.jsx
- src/components/contact/QuoteRequestForm.jsx
- src/components/home/DealerPartnershipCTA.jsx
- backend/src/templates/emails/base.js
- backend/prisma/seed.js

Validation:
- Frontend production build passed after change.

---

## CR-007: Replace Home CTA Options with Latest Videos + Admin Video Management
Status: [x] Completed
Priority: High

Client request:
- Remove the 3 option cards shown below "Ready to Partner With Us".
- Add a "Check Our Latest Video" section in that area.
- Provide admin dashboard support to upload/manage videos so homepage updates automatically.

Fix implemented:
- Replaced the old three-card CTA block with a dynamic "CHECK OUR LATEST VIDEO" section on home page.
- Added public backend endpoint to fetch active homepage videos from settings:
  - `GET /api/settings/public/home-videos`
- Added frontend public API helper to consume homepage videos.
- Added admin page "Home Latest Videos" with:
  - Add/remove video entries
  - Title, video URL, thumbnail URL, active toggle, display order controls
  - Upload video file support
  - Upload thumbnail support
  - Save to settings as JSON (`home_latest_videos`, group `homepage`)
- Wired admin route and sidebar navigation for easy management.

Code references:
- src/components/home/CTASection.jsx
- src/services/api.js
- backend/src/controllers/settings.controller.js
- backend/src/routes/settings.routes.js
- src/admin/pages/HomeVideos.jsx
- src/admin/layouts/AdminLayout.jsx
- src/admin/index.js
- src/App.jsx

Validation:
- Frontend production build passed after changes.

---

## CR-008: Latest Videos UI Refinement + About Page Cleanup
Status: [x] Completed
Priority: High

Client request:
- Refine the new "Check Our Latest Video" section visual layout to remove rigid box feel and improve spacing.
- Ensure equal spacing so 5 video cards fit neatly in one row on desktop without awkward side gaps.
- Add a section break between "Ready to Partner With Us" and latest videos.
- On About page, remove "Our Journey of Excellence" section.
- Fix the bad white gradient patch in About page CTA box.
- Ensure admin dashboard video upload works correctly for publishing videos to homepage section.

Fix implemented:
- Iteratively refined latest videos section layout and interaction in homepage CTA component:
  - Removed rigid boxed look
  - Kept clean horizontal strip with responsive behavior
  - Desktop now uses equal 5-column layout
  - Added visual section divider between partner CTA and videos
- Removed full About page "Our Journey of Excellence" timeline block.
- Replaced About CTA white center gradient with darker blue on-brand gradient overlay.
- Verified admin videos management wiring and fixed backend upload MIME handling so admin can upload video files via general upload endpoint:
  - Added video MIME support for general uploads (MP4/WebM/OGG/MOV)
  - Preserved stricter MIME validation for catalogue routes.

Code references:
- src/components/home/CTASection.jsx
- src/pages/About.jsx
- src/admin/pages/HomeVideos.jsx
- backend/src/middleware/upload.middleware.js

Validation:
- Frontend production build passed after changes.
- Static verification confirms uploaded video URL from admin can be saved and rendered in homepage latest videos section.
