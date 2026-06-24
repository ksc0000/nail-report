# Jewelry Box Refresh Product Specification

> Status: Phase 5 product specification.
> This document describes the Jewelry Box refresh direction for Nailous while preserving the current React/Firebase MVP.

## Concept

Nailous is moving from a simple nail photo archive toward a jewelry-box experience where each saved nail can be viewed, cherished, reused, and prepared for the next salon visit.

The product should feel like:

- a private jewelry box for personal nail history
- a visual nail charm gallery rather than a plain image list
- a planning surface for the next appointment
- a future-ready foundation for nail-region detection, editable jewel views, exportable stickers, and later 3D/AR

The commercial MVP should still avoid premature heavy 3D, AR, reservations, payments, and public social ranking. The first priority is a beautiful, reliable, mobile-first viewing and planning experience.

## Implemented Screens

| Screen | Current state | Primary purpose |
|---|---|---|
| Home | Implemented | Jewelry Box overview, saved count, display mode switcher, collection grid |
| Design | Implemented | Add/edit nail record with photo, title, tags, memo, and design controls |
| Explore | Implemented as static UI | Inspiration surface and category tabs |
| Saved | Implemented as static/session UI | Saved-design surface and session-local saved preview |
| Book | Implemented as planning UI | Appointment memo surface; selected design context can be carried from detail |
| Profile | Implemented as static summary | Account identity, data management, legal links, and collection stats |
| Detail Card | Implemented | Image detail, floating Nail Charm view, tags, memo, metadata, and booking memo CTA |
| Public Share | Existing MVP | Read-only public collection snapshot without private memo/image exposure |

Related issues:

- #239 Epic: Jewelry Box Refresh 全体設計
- #240 Epic: Design System Refresh
- #241 Epic: Mobile Navigation & App Shell
- #242 Epic: Home / Jewelry Box Screen
- #243 Epic: Nail Design Editor
- #245 Epic: Saved Designs
- #246 Epic: Book Appointment
- #249 Epic: QA / Responsive / Release Readiness

## Current User Flow

1. User signs in with Google.
2. User records a nail design with photo, title, tags, and memo.
3. Home shows the nail inside the Jewelry Box card grid.
4. User opens the detail card from image/body click or keyboard.
5. Detail card shows the original image plus a floating Nail Charm preview.
6. User can choose `来店メモに使う`.
7. Book screen receives the selected design context and shows it in the planning memo card.
8. User can return to detail or clear the selected design.

This creates the first MVP loop:

```text
record nail -> view beautifully -> choose as next visit reference -> prepare salon memo
```

## Nail Charm / Jewel View Direction

The Nail Charm view is the bridge between current photo storage and the future "finger jewel" experience.

### Implemented Now

- Floating nail-chip style detail preview
- Deterministic placement based on NailItem id
- Display modes:
  - Glass
  - Snow Globe
  - Velvet
  - Showcase
- Subtle CSS motion with reduced-motion support
- Mobile-safe layout guards

### Next Product Direction

The next generation should make the jewel view editable and reusable:

| Capability | Recommended first version | Notes |
|---|---|---|
| Rotation | 2D pseudo-3D rotation/tilt controls | Use CSS transforms first; defer full Three.js until justified |
| Scale / position | Slider or drag controls | Keep touch controls simple on mobile |
| Tone adjustment | Presets such as Original, Milk, Pink, Chrome, Velvet, Night | Use CSS filters/canvas only after privacy and export behavior are clear |
| Stamp export | PNG download/copy of the jewel view | Start with app-rendered composition; transparent background later |
| Social formats | 1:1, 4:5, 9:16 export frames | Instagram-friendly output without requiring social login |
| Nail extraction | Manual crop/focus before auto detection | More reliable than jumping directly to AI segmentation |

This should be implemented incrementally as a "Jewel View Editor" rather than full AR.

## Data Model

### Current MVP Data

Current private NailItem records remain owner-scoped:

```text
users/{userId}/nailItems/{itemId}
```

The current core fields remain:

- `title`
- `imageUrl`
- `thumbnailUrl`
- `tags`
- `memo`
- `imageSource`
- `createdAt`
- `updatedAt`

### Session-Local UI State

The following UI state exists before backend persistence:

| State | Current implementation | Persistence |
|---|---|---|
| Save toggle | Session-local card UI | Not persisted |
| Like toggle | Session-local card UI | Not persisted |
| Booking memo selected design | Session-local selected NailItem id | Not persisted |

### Future Saved / Like Semantics

`isSaved` and `likeCount` are defined in `PRODUCT_SPEC.md`:

- `isSaved`: private per-user saved membership
- `likeCount`: public aggregate count for shared/public designs only

Implementation must not mix private user records and public social metrics in the same private NailItem document.

Related issue:

- #279 data: define isSaved and likeCount semantics

## Out Of Scope

The Jewelry Box refresh does not include:

- real appointment booking
- payments
- salon CRM
- public follower/following social graph
- production deployment without human approval
- Firebase rules changes without human approval
- new package dependencies without human approval
- full 3D rendering or AR try-on
- automatic nail detection in the commercial MVP
- uploading third-party 3D assets
- exposing private memo/image data in public share pages

## Phase Plan

| Phase | Goal | Current status |
|---|---|---|
| Phase 1 | App shell and bottom navigation | Implemented |
| Phase 2 | Static refreshed screens | Implemented |
| Phase 3 | Card grid and state polish | Implemented |
| Phase 4 | Nail Charm detail, display modes, motion, booking handoff | Implemented |
| Phase 5 | Product docs, empty states, responsive QA, release readiness | In progress |
| Phase 6 | Saved/like persistence and public design model | Future |
| Phase 7 | Jewel View Editor: rotate, tone, export/stamp | Future |
| Phase 8 | Nail region annotation and detection assist | Future |
| Phase 9 | True 3D / AR try-on | Future |

## Related Implementation Issues

- #282 animation: add CSS motion to Jewelry Box screen
- #283 feature: implement deterministic random placement for floating nail chips
- #284 feature: show nail detail card from Jewelry Box tap
- #285 feature: implement Glass, Snow Globe, Velvet, Showcase mode differences
- #286 ui: polish hover, active, and selected card states
- #287 ui: add premium skeleton loading states for images and cards
- #288 ui: design save and like button states
- #289 feature: connect design detail to booking memo flow
- #290 qa: verify all screens at 390px width
- #291 qa: verify iPhone SE equivalent width
- #292 qa: verify tablet layout at 768px and above
- #293 qa: run build and lint for Jewelry Box Refresh release gate
- #294 qa: verify Firebase missing config and signed-out states
- #295 ui: create complete empty states for refreshed screens
- #296 docs: update README with Jewelry Box Refresh overview
- #297 docs: add Jewelry Box Refresh product specification

## Release Readiness Notes

Before production release:

- Complete mobile QA for 390px, iPhone SE width, and tablet width.
- Verify signed-out landing, signed-in Home/Design/Explore/Saved/Book/Profile, detail card, comparison, share management, and public share.
- Re-deploy latest main to development Hosting before human QA.
- Keep production deploy human-approved.
