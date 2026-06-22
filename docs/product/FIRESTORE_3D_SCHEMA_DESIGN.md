# Firestore 3D Schema Design

This document records a future Firestore schema direction for Phase 8 3D Preview and Phase 9 AR/Modeling work. It is a design document only. The commercial MVP schema remains unchanged.

## Current Constraint

The current `NailItem` schema is focused on photo archive use cases:

- title
- tags
- memo
- imageUrl
- imageSource
- createdAt / updatedAt

Do not add 3D fields before Phase 8 is explicitly approved. Firestore schema changes are a human gate.

## Design Goals

- Keep all 3D fields optional so existing documents require no migration.
- Prefer stable preset IDs over raw Storage URLs when possible.
- Keep user-uploaded photos private and separate from public/static 3D product assets.
- Allow future UI to fall back gracefully when 3D fields are absent.

## Proposed Optional Fields

| Field | Type | Example | Purpose |
|---|---|---|---|
| `shape` | `string` | `almond` | User-facing nail shape preset |
| `color` | `string` | `#D86BA2` | Base color or selected palette value |
| `texture` | `string` | `gloss` | Texture/material family |
| `modelId` | `string` | `shapes/almond_v1` | Stable reference to a product-owned GLB asset |
| `modelUrl` | `string` | `https://.../almond_v1.glb` | Optional resolved asset URL for cases where direct URLs are needed |
| `materialPreset` | `string` | `gloss_pink_01` | Renderer material preset |
| `decorationParts` | `string[]` | `["stone_small_01"]` | Future Phase 9 decoration references |

`modelId` should be preferred over `modelUrl` for app-owned assets. `modelUrl` is kept as an escape hatch for future integrations, but direct URLs increase validation and lifecycle risk.

## TypeScript Draft

```ts
export interface NailItem3DFields {
  shape?: string
  color?: string
  texture?: string
  modelId?: string
  modelUrl?: string
  materialPreset?: string
  decorationParts?: string[]
}
```

When implemented, these fields should be added to `NailItemInput` and `NailItemDoc` only in the same PR as the UI/storage behavior that uses them.

## Migration Strategy

Recommended approach: no bulk migration.

- All fields are optional.
- Existing documents continue to render the existing photo-based card/detail UI.
- The 3D UI should show an empty/default state when 3D fields are absent.
- Defaults should live in the app or product asset catalog, not be backfilled into every existing document.

## Validation Direction

Before implementation, decide the allowed values for:

- `shape`
- `texture`
- `materialPreset`
- `modelId`

Validation should happen in app code first. Firestore Rules validation may be added later, but any `firestore.rules` change requires human approval and Rules Playground verification.

Suggested validation constraints:

- `shape`, `texture`, `modelId`, and `materialPreset`: short slug strings.
- `color`: either a hex color or a controlled palette token.
- `modelUrl`: HTTPS URL only, ideally restricted to approved Firebase/Hosting asset origins.
- `decorationParts`: bounded array of short slug strings.

## Security And Privacy Notes

- Private `users/{userId}/nailItems/{itemId}` data remains owner-scoped.
- Static 3D product assets may be public, but that decision belongs in the asset delivery and security rules plan.
- Do not expose user-uploaded photo URLs through public 3D fields.
- Do not loosen Firestore or Storage rules as part of schema planning.

## Related Documents

- [3D_ASSET_DELIVERY_STRATEGY.md](./3D_ASSET_DELIVERY_STRATEGY.md)
- [3D_LIBRARY_EVALUATION.md](./3D_LIBRARY_EVALUATION.md)
- [NAIL_HAND_DETECTION_PIPELINE.md](./NAIL_HAND_DETECTION_PIPELINE.md)
- [FIRESTORE_SECURITY_RULES.md](../operations/FIRESTORE_SECURITY_RULES.md)

## Human Gates

- G1: confirm Phase 8/9 scope and priority.
- G3: approve Firestore schema changes.
- G6: approve any privacy/security policy changes.
- G8: approve any new 3D rendering dependency.
- G16: approve any 3D asset addition and licensing.
