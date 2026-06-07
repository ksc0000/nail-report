# nail-report Product Roadmap

## App Overview

React 19 + TypeScript + Vite + Firebase web app for tracking personal nail care history.

Core features: Google Auth, nail item CRUD with images and tags, Firebase Storage uploads, public share links, monthly stats, sorting.

CI runs on `windows-latest` with a PowerShell CSS guard. Jules runs on Ubuntu — Swift/PowerShell cannot be executed by Jules.

---

## Phase 1 — Complete

- Google Sign-in (Firebase Auth)
- Nail item CRUD (Firestore `nailItems` collection)
- Image upload and delete (Firebase Storage)
- Tag management and sorting
- Public share links (`publicShares` collection)
- Monthly stats view
- Basic CI (lint + build + CSS guard)

---

## Phase 2 — Active

Improve stability, test coverage, and UX.

### 2.1 Test coverage
- Unit tests for Firestore helper functions (`src/lib/firestore.ts`, `src/lib/storage.ts`, `src/lib/auth.ts`)
- Mocking Firebase SDK (vitest + vi.mock)
- Test runner: Vitest

### 2.2 Error handling UX
- Show user-friendly error banners (upload failures, auth errors, Firestore errors)
- Add retry buttons where applicable

### 2.3 Loading states
- Skeleton loading for the nail item list
- Loading spinner during image upload

### 2.4 Accessibility
- Add `aria-label` to icon buttons
- Ensure keyboard navigation works for the main list

### 2.5 Mobile UX
- Responsive layout improvements for small screens
- Better touch targets

---

## Phase 3 — Planned

- Tag-based search / filter
- Export functionality (CSV or PDF)
- Lazy loading for images
- Analytics (most-used tags, monthly trend)

---

## Jules-ready Tasks

Small, bounded tasks suitable for Jules (Ubuntu, no PowerShell):

1. Add Vitest + unit tests for `src/lib/firestore.ts` helpers
2. Add loading skeleton to nail item list (`src/App.tsx`)
3. Add `aria-label` to all icon-only buttons
4. Add error banner component for Firestore/Storage failures
5. Improve mobile CSS for small screens (< 480px)
