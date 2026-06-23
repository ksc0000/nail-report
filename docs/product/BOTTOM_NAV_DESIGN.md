# Bottom Navigation Design - Jewelry Box Phase 1

> Status: Draft
> Target Phase: Phase 1 (Incremental UI Refresh)
> Documented: 2026-05-15

## 1. Background
Nailous is evolving into the "Jewelry Box" concept. To improve mobile UX and prepare for future features (3D, AR), the monolithic scroll-based layout in `App.tsx` will be transition to a tab-based navigation using a bottom fixed bar.

This document defines the navigation structure and maps existing/future screens to these items.

---

## 2. Navigation Items Definition

| Item (ID) | Label | Icon (Idea) | Core Responsibility |
|-----------|-------|-------------|---------------------|
| **Gallery** | Gallery | Grid / Sparkles | Browsing collection, searching, filtering, and detail view. |
| **Studio**  | Studio  | Plus / Camera | Adding new items, editing, camera capture, and 3D preview. |
| **Review**  | Review  | Layers / Bar | Statistics, comparison view, and sharing management. |
| **Settings**| Settings| Gear / User | Data management, account info, and legal documents. |

---

## 3. Screen & Component Mapping

### Current MVP Components (`App.tsx`)

| Nav Item | Existing Sections / Components |
|----------|--------------------------------|
| **Gallery** | `nail-studio-hero`, `nail-search`, `filter-bar`, `nail-list`, `NailImageDetailViewer` |
| **Studio**  | `nail-form` (Add/Edit mode) |
| **Review**  | `nail-summary`, `NailComparisonPanel`, `nail-share` |
| **Settings**| `auth-user` (profile), Data Management Modal, `PrivacyPolicyPage`, `TermsOfServicePage` |

### Future Features (Phase 8-9)

| Nav Item | Future Features |
|----------|-----------------|
| **Studio**  | 3D Preview (Phase 8), Modeling Lite (Phase 9), AR Try-on (Phase 9) |
| **Review**  | AI Style Analysis Reports, Trend Comparisons |
| **Settings**| Theme switching, Export scheduling |

---

## 4. UI/UX Specifications

### Layout & Position
- **Fixed Position**: The bar remains at the bottom of the viewport.
- **Z-Index**: Above main content but below full-screen modals (like `NailImageDetailViewer` or `NailComparisonPanel` when expanded).
- **Responsive Width**: 100% width on mobile; can be centered or constrained to `--mobile-viewport-target` (390px) on desktop-view for consistency.

### Safe Area Handling
- Must respect `env(safe-area-inset-bottom)` to avoid overlapping with iOS home indicator.
- Use the existing CSS variable: `padding-bottom: var(--fixed-control-safe-gap)`.

### Aesthetic (Jewelry Box Style)
- **Glassmorphism**:
  - `backdrop-filter: blur(20px);`
  - `background: var(--jb-glass);`
  - `border-top: 1px solid var(--jb-glass-border);`
- **Active State**: Use `var(--accent)` (purple) or `var(--jb-pink)` to indicate the selected tab.
- **Tap Targets**: Each item must be at least `var(--tap-target-min)` (44px) square.

---

## 5. Interaction Principles
- **Persistence**: The navigation bar is always visible to authenticated users.
- **Routing**: While implementation is out of scope for this task, the design assumes a "single page app" feeling where switching tabs is instantaneous.
- **Action Priority**: "Studio" (Add) should be visually distinct (e.g., center position, slightly different styling) to encourage creation.

---

## 6. Out of Scope for Phase 1
- Navigation for signed-out users (they stay on the Landing Page).
- Implementation of React Router or complex routing state.
- Transition animations between tabs.
- Custom SVG icon assets (placeholders or characters are acceptable for design).

---

## 7. Validation Criteria (Next Implementation Task)
- [ ] Nav bar is fixed to bottom.
- [ ] `safe-area-inset-bottom` is handled correctly.
- [ ] Tap targets are >= 44px.
- [ ] Style matches "Jewelry Box" tokens.
