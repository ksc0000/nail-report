# Bottom Navigation Design

> **Status: Canonical navigation direction**
> **Updated: 2026-10-07**
>
> The previous six-item Jewelry Box navigation plan is superseded.
> See [UI_DESIGN_PRINCIPLES.md](./UI_DESIGN_PRINCIPLES.md) for the visual source of truth.

## Navigation Items

The authenticated mobile shell exposes exactly three primary destinations:

| Item | Purpose | Notes |
|---|---|---|
| **ネイル** | Open the user's nail view, archive, history, and comparison entry points | The nail itself is the hero content. Avoid turning this into a dashboard. |
| **撮る** | Start camera capture / nail scan | Central action. Can be slightly more prominent than the other two, while remaining minimal. |
| **検索** | Search and discover nail designs / records | Keep discovery visual-first and uncluttered. |

## Icon Direction

The three navigation items should use a **Nailous-specific custom icon family**.

- Do not treat generic SF Symbols / stock icons as the final brand expression.
- “ネイル” should read as a nail / fingertip concept.
- “撮る” should communicate capture / scan rather than a generic camera alone.
- “検索” should communicate nail discovery rather than a generic magnifying glass alone.
- All three icons should share stroke weight, geometry, optical size, and active-state behavior.
- The icon treatment should reinforce the brand without adding decorative background art.

## Settings / Account / Legal

Do not add Profile or Settings as bottom navigation items.

Low-frequency management actions belong behind a top-right overflow control such as **“…”**:

- Account settings
- Privacy
- Terms of Service
- Help / app information
- Data/export controls
- Sign out

Public legal routes remain directly addressable and must not require authentication.

## Current Route Compatibility

| Route | Required Behavior |
|---|---|
| `/` | Main app shell. Signed-out users see the landing surface; signed-in users enter the Nailous product shell. |
| `/terms` | Terms of Service remains public. |
| `/privacy` | Privacy Policy remains public. |
| `/share/:id` | Public share view remains public and must not show authenticated-only bottom navigation. |

## Layout Rules

- Bottom navigation is for authenticated product UI.
- It must respect `env(safe-area-inset-bottom)` through the shared safe-gap token.
- Tap targets must remain accessible.
- Full-screen nail detail / 3D / comparison surfaces may visually dominate or temporarily cover the navigation when appropriate.
- Page content must include enough bottom padding to avoid fixed-control overlap.
- Do not introduce additional permanent bottom-nav items without an explicit product decision.

## Visual Direction

Follow [UI_DESIGN_PRINCIPLES.md](./UI_DESIGN_PRINCIPLES.md).

In particular:

- Minimal and monochrome shell.
- Prefer white / black / neutral gray.
- No decorative background patterns.
- No default glass / gold-rim treatment.
- Avoid heavy gradients, shadows, ornamental cards, and unnecessary chrome.
- Let nail imagery / rendering provide the color and impact.
- Use whitespace and typography before decoration.

## Out of Scope

This document defines navigation and visual intent. It does not require:

- a routing library,
- Firestore schema changes,
- Firebase rule changes,
- a specific icon package.
