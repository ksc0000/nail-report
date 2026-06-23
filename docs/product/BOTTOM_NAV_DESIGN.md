# Bottom Navigation Design

> Status: Phase 1 planning
> Updated: 2026-06-24

This document defines the future bottom fixed navigation structure for the Jewelry Box refresh. It is a planning artifact only; no route or UI implementation is included in this task.

## Navigation Items

The bottom navigation should expose the six core Jewelry Box screens directly:

| Item | Purpose | Current MVP Mapping | Future Direction |
|---|---|---|---|
| Home | Jewelry Box overview and premium collection entry | Signed-in studio hero, collection overview, high-level saved count | Floating nail-chip showcase and personalized collection overview. |
| Nail Design | Create or edit a nail record | Current add/edit form plus visual controls for shape/color/texture/parts | Full design editor with persisted shape, color, texture, and decorations. |
| Inspiration | Explore ideas before saving | Static Inspiration / Explore section and category tabs | Curated ideas, seasonal tabs, and later recommendation data. |
| Saved Designs | Return to saved or liked designs | Existing `nailItems` collection and search/list surfaces | Saved/liked split, premium cards, and filtered collections. |
| Book Appointment | Prepare salon visit notes | Existing memo field and share/export flow | Appointment memo builder and booking handoff. |
| Profile | Account, data, legal, and export controls | Auth bar, data management modal, legal routes | User settings, data export, privacy, and subscription/status surfaces. |

## Current Route Compatibility

The first implementation should preserve the current manual routing behavior:

| Route | Required Behavior |
|---|---|
| `/` | Main app shell. Signed-out users see the landing page; signed-in users see the Jewelry Box surface. |
| `/terms` | Terms of Service page remains reachable without auth. |
| `/privacy` | Privacy Policy page remains reachable without auth. |
| `/share/:id` | Public share view remains reachable without auth and must not show authenticated-only bottom navigation. |

## Layout Rules

- The bottom navigation is for authenticated users only.
- It should be fixed to the bottom of the viewport and respect `env(safe-area-inset-bottom)` through `--fixed-control-safe-gap`.
- Each nav item should provide at least `--tap-target-min` height.
- On 390px mobile width, labels may remain visible if they fit; otherwise a compact icon-first layout can be introduced later.
- Full-screen overlays such as image detail and comparison views should appear above the bottom nav.
- Page content should include enough bottom padding so fixed controls do not cover forms, cards, or share actions.

## Visual Direction

- Use Jewelry Box tokens from `src/index.css`.
- Prefer glass, gold-rim, and dark active states already introduced in `src/App.css`.
- Active state must be visually obvious and also available to assistive technology through `aria-current` or equivalent state.
- Avoid adding icon packages in this planning phase; implementation can use text-first labels or existing CSS shapes until a package is approved.

## Implementation Order

1. Keep manual route helpers stable.
2. Introduce a local active-screen state or route mapping for the six screen IDs.
3. Add the bottom nav shell with safe-area padding.
4. Move existing screen sections behind the six screen IDs without changing Firestore behavior.
5. Preserve legal and public share routes outside the authenticated bottom nav flow.

## Out of Scope

- No React Router dependency.
- No route implementation in this issue.
- No Firestore schema changes.
- No Firebase rules or deploy changes.
