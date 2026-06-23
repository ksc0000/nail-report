# Component Audit: Jewelry Box Migration

> Status: Phase 1 audit
> Updated: 2026-06-24

This audit inventories the current React component surface before the Jewelry Box migration continues. It is documentation-only; no code movement is included in this task.

## Existing Extracted Components

| Component | Responsibility | Notes |
|---|---|---|
| `ErrorBanner` | Global and contextual error display | Dismissible alert used for Firebase, loading, and action failures. |
| `FloatingNailChip` | CSS-based floating nail chip visual | Shared by the signed-out Jewelry Box landing view and empty collection state. Supports visual variants through props and CSS classes. |
| `NailComparisonPanel` | Side-by-side nail item comparison | Handles selected item comparison and before/after ordering. |
| `NailImageDetailViewer` | Full-screen nail detail viewer | Provides focused image/detail viewing with keyboard close behavior. |
| `PrivacyPolicyPage` | Privacy policy route content | Used by manual `/privacy` routing. |
| `TermsOfServicePage` | Terms of service route content | Used by manual `/terms` routing. |

## Current `App.tsx` UI Sections

| Section | Responsibility | Current Dependencies |
|---|---|---|
| Manual route shell | Handles `/`, `/privacy`, `/terms`, and `/share/:id` | `pathname`, `navigateTo`, `getPublicShareIdFromPath`. |
| Signed-out Jewelry Box home | Black glass-case landing experience and sign-in CTA | `handleSignIn`, Firebase config state, display mode switcher, `FloatingNailChip`. |
| Auth and data management | User status, sign-out, data modal, legal links | `user`, `handleSignOut`, `isDataModalOpen`. |
| Jewelry Box studio hero | Logged-in header and saved item count | `nailItems.length`, display mode switcher. |
| Nail Design screen | Add/edit form plus shape, color, texture, and decoration controls | Local form state, image upload refs, AI tag feature flag. Shape/color/texture/parts are currently visual-only. |
| Inspiration / Explore screen | Static inspiration cards and category tabs | Local active category state and dummy card constants. No data fetching. |
| Collection summary | Counts, tags, month filter, recent updates, export actions | Derived summary data, active filters, CSV/JSON export helpers. |
| Public sharing management | Share link creation, copy, revoke, and share list | `publicShares`, `createPublicShare`, `disablePublicShare`. |
| Search and collection grid | Search, filter, card actions, comparison selection | `searchQuery`, `filteredItems`, edit/delete/detail/comparison handlers. |
| Public share view | Read-only shared collection state and cards | `publicShareState`, `publicShare`, share route id. |

## Extraction Candidates

### High Priority

| Candidate | Reason |
|---|---|
| `SignedOutLanding` | Large visual section with its own topbar, animated chips, sign-in CTA, and legal links. |
| `NailDesignScreen` | Dense form and visual editor controls should be isolated before data integration for shape/color/texture/parts. |
| `InspirationScreen` | Static cards and category tabs are already a cohesive screen surface. |
| `PublicShareView` | Separate route state with independent loading/disabled/not-found behavior. |

### Medium Priority

| Candidate | Reason |
|---|---|
| `CollectionSummary` | Contains derived stats, filters, export actions, and recent item rendering. |
| `ShareManagement` | Encapsulates public share creation, copy, revoke, and status messaging. |
| `NailCollectionGrid` / `NailCard` | Card rendering and per-item actions will grow as premium card UI is introduced. |
| `DataManagementModal` | Modal behavior and copy can follow the extracted viewer/modal pattern. |

### Lower Priority

| Candidate | Reason |
|---|---|
| `AuthBar` | Small but can move into an app shell once bottom navigation lands. |
| `Footer` | Currently a local render helper and low-risk to extract later. |

## Migration Notes

- Preserve manual routing until the bottom navigation and route map are finalized.
- Keep Firestore writes unchanged until the Phase 3 data-model tasks explicitly add fields.
- Continue extracting one surface per PR to avoid mixing visual refactor, data integration, and navigation behavior.
