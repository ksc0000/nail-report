# Floating Nail View

> **Status: Product/interaction direction**
> **Decided: 2026-10-07**
>
> This document defines the intended motion language for the Nail screen.
> It must remain consistent with [UI_DESIGN_PRINCIPLES.md](./UI_DESIGN_PRINCIPLES.md).

## Concept

The Nail screen should present nails as if they are lightly floating inside restrained rounded-rectangle bubbles.

This is **not** decorative bubble UI and **not** glassmorphism.

The intended effect is:

> **The UI stays quiet. The nail feels alive.**

The bubble is only a framing surface that gives the nail depth and separation from the page.

## Bubble Form

- Shape: rounded rectangle
- Surface: flat / lightly translucent neutral surface
- Default palette: white, off-white, very light gray
- Optional tint: extremely subtle and adjustable
- Avoid saturated colors
- Avoid iridescent / rainbow reflections
- Avoid strong blur, glow, metallic borders, gradients, or glass effects
- Avoid making the bubble itself the visual focal point

The nail remains the hero.

### Bubble scale

The current direction is **smaller bubbles with more surrounding whitespace**, rather than large card-like panels that dominate the viewport.

- A bubble should feel like a compact viewing capsule, not a dashboard card.
- Multiple bubbles may coexist in one viewport.
- Size may vary by layout or emphasis.
- Do not hard-code one fixed card size as the product identity.
- Exact dimensions remain a PoC/tuning decision rather than a canonical constant.

## Layout Variety

Floating Nail View is **not limited to one grid or one orientation**.

Supported visual families may include:

### Flow

Bubbles follow a calm, mostly consistent direction/order. This is the clearest archive/history presentation.

### Scatter

Bubbles are distributed more freely across the canvas:

- mixed portrait / landscape orientation
- modest variation in size
- non-uniform X/Y placement
- optional slight rotation
- intentional whitespace between groups

Scatter should look editorial and composed, not random or chaotic.

### Focus

One selected/current nail receives more space or depth while surrounding NailSets remain smaller and quieter.

### Constraint

The product should support multiple presentation modes without turning them into a large settings surface.

Layout variety is a presentation capability. It does **not** imply that users must be shown many layout controls.

The nail remains the hero.

## Favorite Action

Each nail bubble may expose a lightweight **heart favorite control in the lower-right corner**.

- default: outline heart
- favorited: filled heart
- keep the control visually small and subordinate to the nail
- avoid a large button background unless needed for contrast/accessibility
- the heart position should remain predictable across layout variants
- favorite state is an interaction/data concern independent of bubble layout and 3D rendering

The same heart interaction language may later be reused in Search/discovery, but archive favorite and discovery-save semantics must remain explicit in the data model.

## Motion Direction

Scrolling should create a small amount of inertial movement in the nail.

Recommended behavior:

- bubble/container: mostly stable
- nail position: slightly delayed relative to scroll
- nail rotation: subtle
- nail scale: subtle
- motion settles smoothly when scrolling stops
- no exaggerated bouncing
- no independently drifting decorative particles

A useful implementation target is:

- small X/Y translation
- rotation only a few degrees
- scale variation around ~0.98–1.02
- spring-like settling rather than looping animation

The motion should feel responsive and premium, not playful or toy-like.

## Interaction Principle

The desired perception is:

> **“The nail is floating inside a quiet viewing surface.”**

Not:

> “The screen is full of animated bubbles.”

When multiple NailSets are visible, the selected/current nail may receive stronger motion or depth while surrounding items remain calmer.

## Technical Direction

Prefer a small composable stack over a large visual-effects framework.

### Recommended baseline

1. **CSS**
   - rounded-rectangle bubble
   - neutral background
   - spacing / clipping
2. **Motion**
   - scroll progress
   - spring interpolation
   - subtle translate / rotate / scale
3. **React Three Fiber**
   - render the actual 3D nail / NailSet when available

### Optional later

- Drei ScrollControls for tighter coupling between scroll and 3D scene behavior
- Lenis only if native scrolling + spring motion is not sufficient

### Avoid initially

- adding a dedicated “bubble UI” framework
- heavy shader effects
- full-page custom scroll engines
- multiple competing animation libraries
- coupling the nail renderer to one specific decorative container

## Architecture Constraint

The Floating Nail View must remain separable into:

```
Bubble framing
    +
Motion behavior
    +
Nail renderer
```

The 3D renderer must not depend on the visual bubble treatment.

This allows:

- bubble style to change without touching nail reconstruction/rendering
- motion to be tuned independently
- 2D / 2.5D / 3D fallback levels to reuse the same shell
- future removal of the bubble treatment without losing nail motion behavior

## Fallbacks

- 3D available: render interactive NailSet
- 2.5D available: retain the same floating motion with a flat/depth-assisted asset
- image-only: use the same framing and restrained motion without pretending a 3D model exists

The interaction language should survive graceful degradation.

## Accessibility / UX Constraints

- respect reduced-motion preferences
- motion must never block reading or tapping
- do not make core actions depend on animation
- preserve smooth scrolling on mobile
- avoid excessive GPU work when multiple nail views are visible
- pause or reduce expensive 3D updates when off-screen

## Initial PoC

Build one isolated Nail screen experiment with:

- several **compact** rounded-rectangle nail bubbles with generous whitespace
- neutral background
- subtle configurable tint
- a **Scatter** composition with mixed horizontal/vertical placement as one primary test case
- a **Flow** composition as a second test case
- small lower-right heart favorite controls
- native scrolling
- spring-delayed nail motion
- one active/selected nail with slightly stronger presence when testing Focus behavior
- existing R3F renderer where available

The PoC should answer only:

1. Does the motion feel good?
2. Does the nail remain the strongest visual element?
3. Does the treatment still feel minimal/monochrome?
4. Does it perform smoothly on mobile?
5. Do smaller bubbles still give the nail enough visual impact?
6. Does Scatter feel intentional rather than cluttered?
7. Can Flow / Scatter / Focus share the same bubble, favorite, motion, and renderer primitives?

Do not expand it into a new UI framework before those are answered.
