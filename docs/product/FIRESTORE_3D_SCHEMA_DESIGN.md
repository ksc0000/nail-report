# Firestore 3D Schema Design

> **2026-10-06 — 本書の一部は [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md) に置き換えられた。**
> 製品方向が「プリセット試着」から「実物のネイル復元」へ変わり、GLB を永続データの正にしない方針が G1 承認された。
> 齟齬がある場合は Canonical Nail Data 契約を優先する。本書は経緯の記録として残す。
>
> 主な変更点:
> - 3D データは `NailItem` 本体ではなく **サブコレクション `nailItems/{itemId}/nail3d/current`** に置く（3D 状態の分離）
> - `modelId` / `modelUrl` / `materialPreset` は **非採用**（GLB は Canonical ではなく派生 asset）
> - **ユーザー所有の private 3D データ**（HandProfile / NailSet / NailTexture）という第 3 のアセットカテゴリを追加
> - 未知の `contractVersion` は **L0（写真のみ）へフォールバック**する

This document records a future Firestore schema direction for Phase 8 3D Preview and Phase 9 AR/Modeling work. It is a design document only. The commercial MVP schema remains unchanged.

## Current Constraint

The current `NailItem` schema is focused on photo archive use cases:

- title
- tags
- memo
- imageUrl / thumbnailUrl
- imageSource
- createdAt / updatedAt

**Correction (2026-10-06):** the following optional fields are **already implemented** in
`src/lib/firestoreModel.ts` — earlier revisions of this document incorrectly listed them as absent:

- `shape`, `mainColor`, `texture`, `decorationParts`
- `salonName`, `price`, `appointmentDate`

`imageUrl` is a **required** field, so the photo is structurally the record itself. The
`buildOptionalNailItemFields` helper omits `undefined` fields on write, which means the
optional-additive pattern is already established and tested.

Do not add 3D fields to `NailItem` itself. Under the Canonical Nail Data contract, 3D data lives in a
subcollection, so **no `NailItem` schema change is required** for the personal-reconstruction direction.
Firestore schema changes remain a human gate (G3).

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
