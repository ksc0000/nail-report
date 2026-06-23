# Regression Checklist

This checklist is for verifying existing Nailous MVP features during PR reviews and before releases.
It consolidates key test cases to ensure no regressions are introduced.

## 1. App Load & General
- [ ] App loads on Desktop (Chrome/Safari) without console errors.
- [ ] App loads on Mobile Safari without layout breakage.
- [ ] Responsive design: No horizontal overflow on mobile widths.

## 2. Authentication (Google Auth)
- [ ] Sign-in with Google works.
- [ ] Sign-out works and returns to the landing/login screen.
- [ ] Session persists after page refresh.

## 3. Nail CRUD
- [ ] Create: Add a new nail item with title, tags, and memo.
- [ ] Read: Items appear in the list (newest first).
- [ ] Update: Edit an existing item's title, tags, or memo.
- [ ] Delete: Delete an item after confirming the dialog.
- [ ] Search/Filter: Search by title or tag filters the list correctly.
- [ ] Detail View: Clicking a card opens the detail viewer with correct info.
- [ ] Comparison: Selecting two items displays them side-by-side (Before/After).

## 4. Image Upload & Management
- [ ] Upload jpeg/png/webp (under 5MB) works.
- [ ] Image preview appears in the form before saving.
- [ ] "Remove" button in form clears the selection.
- [ ] Updating an item:
    - [ ] Keeping existing image works.
    - [ ] Replacing with a new image works.
- [ ] Large files (>5MB) or invalid formats (pdf/gif) trigger error messages.
- [ ] Deleting an item removes its image from Storage (verify via Console if possible).

## 5. Mobile Safari / Camera (PWA)
- [ ] Camera button opens system camera picker.
- [ ] Capture photo and confirm it uploads and previews.
- [ ] "Album" fallback works for selecting existing photos.
- [ ] Layout: Controls are accessible and not hidden by system UI.

## 6. Public Sharing
- [ ] Create a share link for selected items.
- [ ] View the share link in an incognito/private window (no sign-in required).
- [ ] Verify legal links (Privacy/Terms) are visible on the share page.
- [ ] Revoke the share link and verify the URL is no longer accessible.

## 7. Data Management & Export
- [ ] CSV Export: Download and verify fields (title, tags, memo, etc.).
- [ ] JSON Export: Download and verify data structure.
- [ ] Data Management Modal: Shows user data ownership and support email.
- [ ] Individual deletion works as expected.

## 8. Legal Routes
- [ ] `/privacy` route loads and displays the Privacy Policy.
- [ ] `/terms` route loads and displays the Terms of Service.
- [ ] Verify `noindex` meta tag is present on legal and share pages.

## 9. Pre-Merge Technical Checks
- [ ] `npm run build` succeeds.
- [ ] TypeScript type-checking passes.
- [ ] No `console.log` or debug code remains.
- [ ] CSS guard passed (if applicable).
