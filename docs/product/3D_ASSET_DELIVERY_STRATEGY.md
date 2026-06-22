# 3D Asset Delivery Strategy

This document records the planned delivery strategy for future 3D nail assets in Phase 8 and Phase 9. It is a design document only. No 3D assets, Firebase rules changes, or runtime dependencies are introduced by this document.

## Goals

- Keep the commercial MVP launch independent from 3D/AR work.
- Prepare a clear asset format and storage direction before implementation begins.
- Avoid licensing, file size, and Firebase rules surprises when Phase 8 starts.

## Supported Formats

| Format | Use | Notes |
|---|---|---|
| GLB | Primary browser-rendered model format | Preferred because geometry, materials, and textures can be bundled into one file |
| KTX2 / compressed textures | Future texture optimization | Use only after tooling is approved |
| USDZ | Future iOS AR Quick Look support | Optional Phase 9 asset, not required for the first 3D preview |

GLB is the default for Phase 8. USDZ should be added only if the product direction includes native iOS AR preview or Safari AR Quick Look.

## Proposed Storage Layout

3D assets should be separate from user-uploaded nail photos.

```text
assets/3d/
  models/
    shapes/
    decorations/
    presets/
  textures/
    materials/
  thumbnails/
  LICENSE_CREDITS.md
```

This path is proposed for future Firebase Storage or Hosting use. The exact deployment target should be confirmed before any assets are uploaded.

## Size And Optimization Targets

| Asset | Target | Hard Limit Before Review |
|---|---:|---:|
| Single nail shape GLB | <= 1 MB | 3 MB |
| Decoration GLB | <= 500 KB | 1 MB |
| Texture | <= 1024 px square | 2048 px square |
| Thumbnail | <= 200 KB | 500 KB |

Optimization requirements before adding assets:

- Remove unused meshes, cameras, lights, and animation tracks.
- Prefer mobile-friendly polygon counts.
- Compress textures before shipping.
- Version static filenames, for example `almond_v1.glb`, so long-lived cache headers can be used later.
- Record source, license, author, and modification notes in `LICENSE_CREDITS.md`.

## Licensing Rules

Allowed without additional legal review:

- Original assets created for Nailous.
- CC0 assets.
- MIT or similarly permissive assets when the license text and attribution requirements are recorded.

Requires human/legal review:

- CC-BY assets that need attribution UI.
- Marketplace assets with unclear redistribution rights.
- Any asset with non-commercial, no-derivatives, editorial-only, or AI-training restrictions.

Do not commit or upload third-party 3D assets until license and size checks are complete.

## Firebase And Access Model

The expected product behavior is that base 3D assets are public, static product assets, while user nail photos remain private owner-scoped data unless explicitly shared.

Implementation rules:

- Do not change `firestore.rules` or `storage.rules` without human approval.
- Do not upload 3D assets to production Firebase without human approval.
- If assets are stored in Firebase Storage, create a rules design and Rules Playground cases before deploy.
- If assets are served from Firebase Hosting, document cache headers in `firebase.json` before deploy.

## Firestore References

Future `NailItem` documents may reference 3D presets, but the current commercial MVP schema must remain unchanged.

Potential future fields:

```ts
interface NailItem3DFields {
  shape?: string
  color?: string
  texture?: string
  modelUrl?: string
  materialPreset?: string
}
```

These fields require a separate schema design, UI design, and human approval before implementation.

## Phase 8 Entry Criteria

Before implementation starts:

- [ ] Human confirms Phase 8 priority after commercial MVP launch.
- [ ] 3D rendering dependency is approved if required.
- [ ] At least one test GLB has documented ownership or license.
- [ ] Asset size and optimization checks are complete.
- [ ] Firebase delivery path and security rules impact are reviewed.
