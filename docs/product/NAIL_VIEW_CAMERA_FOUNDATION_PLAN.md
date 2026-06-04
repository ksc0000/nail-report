# Nail View / Camera Foundation Plan

> This document plans a near-term product slice: Phase 4.5 Nail View / Camera Foundation.
> It is docs-only and does not implement camera, AI detection, AR, Firestore Rules, or schema changes.

---

## 1. Background

The current app has:

- NailItem CRUD
- image upload
- Google authentication
- user-scoped Firestore persistence
- public sharing
- public share management
- sharing/security/operations documentation

Recent work strengthened sharing, security, and operations. That was necessary, but the next product step should move closer to a nail-specific experience before iOS release.

Advanced 3D preview, modeling, and AR try-on remain later phases. The product should not jump directly to advanced AR before it has strong image viewing, camera/upload flow, nail detail review, comparison, and annotation foundations.

---

## 2. Why This Matters For iOS

An iOS release likely needs:

- strong camera/upload UX
- native-feeling image review
- clear nail image detail view
- fast comparison of past designs
- privacy-safe handling of user photos
- future-ready data structure for AI detection and AR

Even if the first implementation remains web-first, the product should start shaping the workflows that a mobile user expects: capture, inspect, compare, annotate, and later analyze.

---

## 3. Goals

- Improve nail image viewing experience.
- Prepare for camera-first workflows.
- Create a foundation for AI tag suggestion.
- Create a foundation for nail/hand detection.
- Avoid jumping prematurely into full AR.
- Keep scope incremental and testable.
- Preserve existing NailItem CRUD, upload, auth, and sharing behavior.

---

## 4. Non-Goals

- No AR try-on implementation yet.
- No 3D modeling implementation yet.
- No production iOS release in this phase.
- No new AI API integration unless separately approved.
- No automatic biometric or identity inference.
- No broad app redesign.
- No Firestore schema change in this docs task.

---

## 5. Proposed Implementation Slices

### NVC-1: Nail Image Detail Viewer

- Larger image preview.
- Metadata panel.
- Tags / memo / createdAt / updatedAt visibility.
- Mobile-friendly layout.
- No new schema required.

### NVC-2: Image Comparison View

- Compare two NailItems.
- Support before/after or side-by-side review.
- Mobile responsive behavior.
- Keep comparison read-only for MVP.

### NVC-3: Camera / Upload Source Foundation

- Distinguish uploaded image vs camera-captured image.
- Prepare capture metadata.
- Avoid native iOS dependency initially.
- Prefer browser/PWA-compatible capture before native-only work.

### NVC-4: Manual Nail Area Annotation Prototype

- Optional manual bounding box / region marker.
- No AI required.
- Creates evaluation data for later detection.
- Keep annotations owner-only.

### NVC-5: AI Nail Tag Suggestion Design

- Identify possible tags: color, style, shape, season, mood.
- Choose local/manual fallback.
- Document privacy and API key considerations.
- Require user confirmation before adding suggested tags.

### NVC-6: Nail / Hand Detection Pipeline Design

- Evaluate browser-based ML vs server/API approaches.
- Compare privacy, cost, latency, accuracy, and iOS compatibility.
- Avoid external image processing without explicit user consent.
- Defer dependency selection until after design review.

### NVC-7: iOS Readiness Review

- Identify what needs to be native.
- Identify what can remain web/PWA.
- Plan camera permission UX.
- Review image storage/privacy behavior.
- Note App Store review considerations.

---

## 6. Recommended Immediate Next Implementation

Recommended next issue:

```text
feature: add nail image detail viewer
```

Why this should come before camera detection:

- Lower risk.
- Directly improves current UX.
- Works with existing data.
- Creates a UI surface for later detection and AI metadata.
- Can be smoke-tested without new permissions or ML dependencies.
- Does not require Firestore Rules, camera APIs, external AI APIs, or new dependencies.

The detail viewer can become the future home for:

- detected regions
- manual regions
- suggested tags
- dominant colors
- image source metadata
- comparison entry points

---

## 7. Data Model Considerations

Potential future fields, not implemented in this phase:

```text
imageSource: "upload" | "camera" | "unknown"
imageMetadata: {
  width?: number
  height?: number
  capturedAt?: Timestamp
  deviceType?: string
}
analysis: {
  status?: "none" | "pending" | "complete" | "failed"
  provider?: string
  analyzedAt?: Timestamp
}
detectedRegions: Array<{
  type: "nail" | "hand"
  box: { x: number; y: number; width: number; height: number }
  confidence?: number
}>
manualRegions: Array<{
  type: "nail" | "hand"
  box: { x: number; y: number; width: number; height: number }
}>
dominantColors: string[]
suggestedTags: string[]
confirmedTags: string[]
```

Any schema change should be a separate issue with:

- backward compatibility review
- Firestore Rules review
- migration/backfill decision
- UI fallback for missing fields
- privacy review

---

## 8. Privacy And Security Considerations

- User nail photos are personal data.
- Camera/photo permissions must be explicit.
- AI processing must be opt-in if external APIs are used.
- Do not put secrets or API keys in client code.
- Avoid sending images to external services without clear user consent.
- Keep owner-only access for private NailItems.
- Do not infer biometric identity or sensitive health information.
- Keep public sharing exclusions for memo/image data unless separately approved.
- Document all new image-processing data flows before implementation.

---

## 9. Validation Strategy

For future implementation tasks:

```text
[ ] npm run build
[ ] npm run lint
[ ] git diff --check
[ ] CSS guard if available
[ ] manual browser smoke test
[ ] mobile viewport smoke test
[ ] authenticated user test
[ ] no Firebase deploy unless rules/config changed
```

Additional checks for camera/image work:

```text
[ ] permission prompt copy is clear
[ ] no capture starts before user action
[ ] upload flow still works
[ ] image preview fits mobile and desktop viewports
[ ] console has no new relevant errors
[ ] existing NailItem CRUD is not broken
```

---

## 10. Proposed Next Issues

- feature: add nail image detail viewer
- feature: add nail image comparison view
- design: plan camera capture flow
- design: plan nail detection pipeline
- design: plan iOS release readiness

---

## 11. Human Decisions Needed

- Web-first vs iOS-native-first direction.
- Whether to use PWA as an intermediate step.
- Whether AI image analysis can use external APIs.
- Whether camera capture should be browser-based first.
- Which nail metadata matters most: color, shape, design, salon, date, mood, price.
- Whether users should manually confirm AI-suggested tags.
- Whether manual annotation is worth introducing before automated detection.

---

## Recommended Direction

Proceed with Phase 4.5 before adding more sharing/security polish.

The first implementation should be `feature: add nail image detail viewer`, because it improves the current product immediately and creates a stable UI surface for comparison, annotation, AI suggestion, and later detection work.

Phase 8 and Phase 9 remain valid future phases for advanced 3D modeling and AR try-on. Phase 4.5 is the bridge that makes those later phases safer and more product-grounded.
