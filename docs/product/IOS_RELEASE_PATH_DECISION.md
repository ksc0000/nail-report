# iOS Release Path Decision: PWA vs Native

## Overview
This brief compares the two primary paths for bringing Nailous to iOS users: **PWA-first** vs. **Native-iOS-first** (Capacitor or SwiftUI).

## Comparison Table

| Factor | PWA-First (Recommended) | Native-iOS-First |
| :--- | :--- | :--- |
| **Release Timing** | **Immediate** (Firebase Deploy) | **Delayed** (App Store Review) |
| **Development Cost** | Low (Existing React/Vite) | High (Native plugins/Apple setup) |
| **App Store Effort** | None | High ($99/yr, review, metadata) |
| **Camera UX** | Standard system picker | Custom overlays / AR ready |
| **Firebase Sync** | Native compatibility | Plugin-dependent (Capacitor) |
| **Privacy** | Browser-sandboxed | App Store Privacy Labels required |
| **QA Effort** | Safari/iOS focus | Multi-device native testing |

## Recommendation: PWA-First

**We recommend PWA-first for the Commercial MVP.**

### Justification
1. **Velocity:** Eliminates the "Apple Gatekeeper" delay for the initial launch.
2. **Firebase Synergy:** The current web-based authentication and Firestore/Storage logic works out-of-the-box in standalone PWA mode.
3. **Camera UX:** Browser `<input capture>` is sufficient for the MVP's goal of capturing high-quality nail photos.
4. **Simplicity:** Single codebase maintenance during the early iteration phase.

## Strategic Roadmap
- **MVP (Phase 7):** PWA via "Add to Home Screen" for early adopters.
- **Phase 8 (3D):** Web-based 3D (Three.js) is viable in modern Safari.
- **Phase 9 (AR):** Re-evaluate. If WebXR performance is insufficient for AR Try-on, pivot to a native wrapper (Capacitor) to access ARKit.

## Human Decisions Needed
- [ ] Accept PWA "Add to Home Screen" installation flow instead of App Store search.
- [ ] Confirm if AR (Phase 9) is a "must-have" for MVP (if yes, pivot to native now).
- [ ] Approve $0 upfront App Store cost vs. $99/year.

---
*Status: Recommended Path (Awaiting Human Approval)*
