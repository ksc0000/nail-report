# Code Splitting Strategy

This document records the current bundle-splitting state and the next optimization path for Nailous.

## Current State

The commercial MVP still emits Vite's 500 KB chunk-size warning:

```text
dist/assets/index-*.js 594 kB+
```

This warning is accepted for the initial MVP in [BUNDLE_SIZE_WARNING_ACCEPTANCE.md](./BUNDLE_SIZE_WARNING_ACCEPTANCE.md), but the app already uses targeted lazy loading to reduce the initial bundle.

Already split with `React.lazy` and `Suspense`:

- `PrivacyPolicyPage`
- `TermsOfServicePage`
- `NailImageDetailViewer`
- `NailComparisonPanel`

The main remaining contributor is the core authenticated app surface in `App.tsx`, plus Firebase SDK code required for Auth, Firestore, Storage, and public share workflows.

## MVP Policy

- The current warning does not block the commercial MVP.
- Do not add new dependencies only to chase the warning.
- Do not change Firebase behavior or security rules as part of bundle optimization.
- Continue to validate with `npm run build` and `scripts/qa-preflight.sh`.

## Next Optimization Candidates

| Priority | Candidate | Expected Benefit | Risk |
|---|---|---|---|
| P1 | Extract public share page into a lazy page component | Keeps signed-out public-share flow smaller and clearer | Low |
| P1 | Extract authenticated collection page into a dedicated component | Makes future lazy boundaries easier | Medium, because it touches core CRUD UI |
| P2 | Split data management modal into a lazy component | Small initial bundle reduction | Low |
| P2 | Dynamically import AI tag generation utilities only when feature flag is enabled | Prevents AI code from affecting default MVP path | Medium, because feature flag behavior must stay exact |
| P3 | Manual vendor chunking for Firebase modules | May improve cache behavior | Medium/high, because output behavior can shift across Vite/Rolldown versions |
| P3 | Future 3D/AR preview lazy boundary | Essential before Phase 8/9 ships | Low if added before 3D code enters main bundle |

## Recommended Sequence

1. Keep the MVP warning accepted until full manual QA and launch.
2. After launch, extract the public share page and authenticated collection page from `App.tsx`.
3. Re-run `npm run build` and compare generated chunk sizes.
4. Only consider manual vendor chunking if app-owned component extraction does not reduce the initial payload enough.
5. Require any future 3D, AR, OCR, or AI-heavy feature to enter through a lazy boundary from the first PR.

## Verification Checklist

Before merging future code-splitting work:

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes if shared logic moved.
- [ ] `scripts/qa-preflight.sh` passes or only reports the accepted bundle warning.
- [ ] `/`, `/privacy`, `/terms`, and `/share/{shareId}` still route correctly.
- [ ] Google Auth, NailItem CRUD, image upload, public share create/view/revoke, CSV/JSON export still work.
