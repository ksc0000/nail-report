# Nailous — Tactile UI Motion Specification (iOS)

> Status: proposal / design review, implementation not authorized
> Tracking: [#425](https://github.com/ksc0000/nail-report/issues/425)
> Inherits: [UI_DESIGN_PRINCIPLES.md](./UI_DESIGN_PRINCIPLES.md) (canonical), [FLOATING_NAIL_VIEW.md](./FLOATING_NAIL_VIEW.md), [BOTTOM_NAV_DESIGN.md](./BOTTOM_NAV_DESIGN.md).
> Rule: **Minimal UI. Maximum Nail.** This document refines interactions; it does not override the canonical visual direction.

## 1. One-sentence design rule

**Quiet surfaces, glass controls, gel response, real nails.**
The shell is restrained, the real nail occupies the visual center, and only meaningful interactions receive a short elastic response.
Glass is a *functional control/navigation layer*, not a global background or a simulated nail finish.

## 2. Visual and motion boundaries

| Layer | Do | Do not |
|---|---|---|
| Shell / canvas | white, black, neutral gray; whitespace, typography; accessible contrast | gold rims, velvet stage, animated backgrounds, gradients, default glassmorphism |
| Navigation and contextual controls | native Liquid Glass on supported OS, minimal translucent fallback on older OS; tactile selection | glass-over-glass stacks, opaque chrome competing with nail, giant decorative buttons |
| Nail content / archive bubbles | accurate photo or 3D nail; neutral compact frame; tiny reactive translation only | generic rainbow shine, particles, blur that hides pattern, exaggerated buoyant looping |
| Gestures | fast direct manipulation; slight inertia only on release; gentle settle | rubbery latency while dragging, spring on every scroll tick, hidden action behind gesture |
| Completion / feedback | subtle state change + one appropriate haptic | confetti, flashing, repeated vibration, success before save actually completes |

**Non-negotiable:** UI reflections must never be presented as measured or reconstructed nail material. Preserve real color and finish; reconstruction fidelity is measured separately in #416/#422.

## 3. Screen-level design map (iOS)

| Screen / current file | Allowed glass/gel treatment | Explicitly restrained | Haptic role |
|---|---|---|---|
| **ネイル / history** — `CollectionView.swift`, `CollectionGridView.swift` | 3-action navigation target, tiny tap lift / spring settle on selected nail; content bubbles quiet | no glass treatment on every record; no gold ornaments; no autoplay spin | selected nail / favorite state (if enabled) |
| **撮る / scan** — `NailCameraView.swift`, `AddNailView.swift` | distinct capture button, subtle progress transition, glass toolbar outside nail guide | no shiny HUD across camera preview; no bouncing camera reticle; no fake capture success | captured, recognized scan step, completed save; errors distinct |
| **detail / 3D** — `NailDetailView.swift`, `NailSceneView.swift` | direct orbit/pinch, velocity-clamped release inertia, double-tap gentle reset; floating controls on top | no animated reflective shell that changes nail perception, no ornamental stage by default | discrete mode changes / reset, not continuous rotation |
| **adjustment** — `GoldSlider.swift`, tuning sheet | smooth tracking; small snap at meaningful detent; clear undo/reset | no haptic per pixel; no animation that shifts the actual value | zero/snap, final confirmation |
| **search / filters** — `CollectionGridView.swift` | selection highlight with quick easing; native search/toolbar | no card-wide liquid effect or busy parallax | filter selection only |
| **compare / share** — #406 / #407 (planned) | gentle same-position crossfade/morph; short export confirmation | no changes to source photo color, no silent sharing | explicit comparison switch / successful export |
| **settings, legal, data/export** | native flat controls and legible type | no glass spectacle or elastic transitions | significant destructive confirmation only |

The canonical destination model remains **ネイル・撮る・検索**, overflow **…** for low-frequency actions. **This is not yet fully implemented in the iOS branch**; `NailousApp.swift` currently starts `CollectionView`, whose header presents search/add/overflow. Treat navigation changes as a separate UX review and PR.

## 4. Interaction tokens (initial experiment values, not shipping constants)

| Action | Candidate timing/feel | Intent |
|---|---|---|
| Press | scale ~0.97–0.99 while held; return ~0.15–0.25s | acknowledge touch without looking like a toy |
| Select nail / favorite | spring response ~0.30–0.40s, damping ~0.78–0.90, no sustained bounce | one soft settle |
| Open/close sheet | prefer system sheet transitions; don't stack a second custom spring | maintain platform familiarity |
| Orbit | 1:1 finger following during drag; release inertia capped and decays in ~0.4–0.8s | intentional gel-like physicality |
| Scroll-linked floating nail | slight translation and ~1–2% scale only while scroll is active; settle after | maintain quiet frame |
| Capture completion | once backend/capture actually succeeds; ~0.15–0.25s visual confirmation | unambiguous state, not spectacle |
| Scan progress | static, legible status; minimal step transition | prevent guide obstruction |

Tune durations, hit targets, damping and any inertia **on device**; no arbitrary spring “jelly” on all components.

## 5. iOS implementation architecture

- **Existing baseline:** `ios/project.yml` sets **iOS 17.0**. The iOS app is SwiftUI + SceneKit (`SCNView`); `NailSceneView` already implements pan/pinch/tap/double-tap and release inertia. Preserve and tune rather than replacing the renderer.
- **Material adapter:** for iOS 26+ prefer native SwiftUI system controls, toolbar/TabView, and `glassEffect` on a few custom interactive controls. Use `if #available(iOS 26, *)` for new APIs; on iOS 17–25 use `Material` or flat contrast-safe fills. No new third-party glass/shader package.
- **Motion primitives:** `withAnimation(.spring(response:dampingFraction:))` for discrete transitions; avoid animating the underlying recorded geometry or photo. Separate design-state animations from SceneKit materials and physically-based finish.
- **Haptics:** `.sensoryFeedback(.selection, trigger: selectedValue)` on SwiftUI (iOS 17+) and existing UIKit generators where gesture coordinators require them. Trigger at meaningful detents/events, not each update.
- **Accessibility:** `@Environment(\.accessibilityReduceMotion)`, Reduce Transparency, Dynamic Type, VoiceOver, increased contrast. Motion-reduced mode uses fades or immediate updates; no required information in animation; gesture-only functions have reachable alternatives.
- **Performance:** test 3D FPS, gesture-to-pixel latency, scrolling smoothness, memory, and camera/preview responsiveness on physical iPhone; don't sacrifice capture or photo fallback for blur and animation.
- **Version strategy:** shared design tokens and behavior contracts for iOS + Web, separate platform implementations (SwiftUI/SceneKit vs CSS/Motion/R3F). No direct transfer of SwiftUI APIs into React.

### Example: platform glass boundary (illustrative, not production code)

```swift
@ViewBuilder
func controlSurface<Content: View>(@ViewBuilder content: () -> Content) -> some View {
    if #available(iOS 26.0, *) {
        content().glassEffect(.regular, in: Capsule())
    } else {
        content().background(.thinMaterial, in: Capsule())
    }
}
```

Call on an individual button/tool surface, **not** on the whole Nail screen. Confirm background contrast in light/dark/Reduce Transparency.

## 6. Existing design debt / safe migration

- `ios/Nailous/Theme.swift` and stage components still include gold gradients, gem dividers, velvet podiums, decorative frames; these are older than the canonical 2026-10-07 minimal direction. **Audit before removal.** Do not mass-delete themes, assets, or user content.
- `NailSceneView.swift` includes particle effects, animation, and dynamic highlight. Audit for fidelity/Reduce Motion separately from new control glass.
- First prototype should target **one detail viewer + one capture control**, not an app-wide reskin. Compare before/after screenshots of **the same nail** under identical lighting and rendering settings.

## 7. Sequenced implementation / human gates

1. **Design review (this PR):** review screen matrix, animation tokens and original-vs-reconstruction boundaries. No code changes.
2. **Small iOS PoC PR:** one tactile button + one selected nail interaction; guard iOS 17/26 and Reduce Motion; screenshots and device FPS measurements.
3. **3D gesture tuning PR:** keep SceneKit existing pan/pinch/reset; clamp inertia, accessibility fallback; before/after task completion rate and fidelity checks.
4. **Capture controls PR:** status clarity and haptics only on confirmed events; confirm focus/exposure/scan protocol unchanged (#417).
5. **Shell/navigation PR only after G2 review:** reconcile canonical 3 tabs with currently implemented iOS header; custom icon family later, without adding decorative backgrounds.
6. **QA:** iOS 17 and iOS 26; Reduce Motion/Transparency; VoiceOver and Dynamic Type; small iPhone; real-photo L0 and 3D-present/absent; no regressions in save, edit, scan, delete, export.

**Out of scope:** CND/schema changes, B/C/H1/H2 reconstruction algorithm changes, Firestore rules, deploy, npm dependencies, merge approval, complete visual reskin.

## 8. Reference and verification

- Apple: [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)
- Apple: [Materials HIG](https://developer.apple.com/design/human-interface-guidelines/materials)
- Apple: [Motion HIG](https://developer.apple.com/design/human-interface-guidelines/motion)
- Apple: [SwiftUI sensoryFeedback](https://developer.apple.com/documentation/swiftui/sensoryfeedback)
- Apple: [Reduce Motion environment](https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityreducemotion)
