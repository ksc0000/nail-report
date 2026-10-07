# Nailous UI Design Principles

> **Status: Canonical UI direction**
> **Decided: 2026-10-07**
>
> This document is the source of truth for Nailous navigation and visual direction.
> When an older design/planning document conflicts with this file, this file wins.

## Product Design Principle

**Minimal UI. Maximum Nail.**

Nailous should feel quiet, minimal, and monochrome so that the user's nail itself becomes the strongest visual element.

The UI should not compete with the nail view.

## Primary Navigation

Authenticated mobile UI exposes only three primary bottom navigation actions:

| Item | Role | Direction |
|---|---|---|
| **ネイル** | View the user's nail archive, current nail, history, and nail view | Primary viewing surface. The nail view should receive the most visual space. |
| **撮る** | Start capture / scan | Central action. May receive slightly stronger emphasis, but without decorative clutter. |
| **検索** | Search / discover nail designs and records | Visual-first discovery and search. |

### Navigation constraints

- Keep the bottom navigation at **three items**.
- Do not add Profile, Settings, Legal, Saved, Booking, Home, or similar low-frequency destinations to the bottom navigation.
- The three navigation items should use **Nailous-specific custom icons**, not generic system icons as the final brand treatment.
- The icon family must share one visual language.
- “撮る” may be slightly more prominent, but should still feel restrained and minimal.
- Public routes such as terms, privacy, and shared nail views remain accessible independently of the authenticated bottom navigation.

## Secondary / Low-Frequency Actions

Account and management functions belong behind a top-right overflow control such as **“…”**.

Typical contents:

- Account settings
- Notification settings
- Privacy
- Terms of Service
- Help
- App information
- Data/export controls
- Sign out

The overflow menu is for management/settings actions. Do not hide frequent product actions there.

## Visual Direction

### Required

- Minimal
- Monochrome / neutral
- Large negative space
- Strong typographic hierarchy
- Nail imagery / rendered nail color is the dominant color source
- The nail view receives visual priority over chrome and controls
- Use spacing and hierarchy before borders, cards, shadows, or decoration

### Avoid by default

- Decorative backgrounds
- Background patterns
- Ornamental illustrations that do not serve the nail view
- Glassmorphism as a default shell treatment
- Gold rims / metallic UI chrome
- Heavy gradients
- Excessive drop shadows
- Stacked decorative cards
- Large numbers of badges, chips, or persistent controls
- Color added only to make the interface feel “richer”

If a decorative treatment does not improve comprehension, capture quality, or the nail-view experience, remove it.

## Color Principle

The shell should primarily use:

- White
- Black
- Neutral grays

Accent color should be rare and purposeful.

The user's actual nail design, texture, photo, or 3D reconstruction should provide most of the visual color and impact.

## Nail View Principle

Nailous is not a management dashboard with a nail preview attached.

The **nail view is the product surface**.

The UI should make users want to:

1. look at their nail,
2. rotate / inspect it when 3D is available,
3. revisit older NailSets,
4. compare current and past nails,
5. show the result to someone else.

Navigation, metadata, settings, and controls should stay visually subordinate to that experience.

## Floating Nail View

The Nail screen may use a restrained **Floating Nail View** treatment: rounded-rectangle bubbles with subtle neutral tint, while the nail itself moves slightly with scroll inertia.

This is an interaction treatment, not decorative glassmorphism.

- Bubble/container stays visually quiet and should generally be **compact rather than large card-like**.
- Nail view may support multiple compositions such as **Flow / Scatter / Focus**; mixed horizontal/vertical placement is allowed when intentionally composed.
- Each nail bubble may use a small lower-right **♡ favorite** action.
- Nail may lag, translate, rotate, or scale subtly with scroll.
- The nail remains the visual focal point.
- Do not add floating particles, strong blur, rainbow reflections, heavy gradients, or decorative motion.
- Prefer **CSS + Motion + the existing React Three Fiber renderer**.
- Keep framing, motion, and nail rendering independent.

Implementation direction and PoC constraints are defined in [FLOATING_NAIL_VIEW.md](./FLOATING_NAIL_VIEW.md).

## Review Checklist

Before adding a UI element, ask:

1. Is this one of the three primary actions: ネイル / 撮る / 検索?
2. If not, can it live contextually in the current screen or under “…“?
3. Does this decoration improve understanding or the nail experience?
4. Does it reduce the visual impact of the nail itself?
5. Can spacing, typography, or motion solve the problem with less chrome?

Default to subtraction.
