# 3D Asset Delivery Strategy

> **2026-10-06 — 適用範囲の限定。** 本書は **プロダクト所有の静的プリセットアセット**の配信戦略である。
> 実物のネイルを復元する経路（Personal Hand Base + Replaceable Nail Set）には適用されない。
> そちらでは **Canonical Nail Data が正であり、GLB は派生 asset（レンダリングキャッシュ）** として扱う。
> → [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md)
>
> 実物復元経路での差異:
>
> | | 本書（プリセット） | 実物復元（CND） |
> |---|---|---|
> | 正となるデータ | GLB ファイル | **Canonical Nail Data（JSON ＋ NailTexture 画像）** |
> | GLB の位置づけ | 配信する成果物 | **派生・キャッシュ・削除可。MVP では生成しない** |
> | 所有者 | プロダクト（公開・静的） | **ユーザー（private）** ← 本書に存在しなかった第 3 のカテゴリ |
> | ライセンス審査 | 必要（G16） | 不要（ユーザー自身のデータ。G3 / G6 の対象） |
> | バックアップ対象 | ― | **Canonical のみ。派生 asset は含めない** |

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

**Third category (added 2026-10-06): user-owned private 3D data.** `HandProfile`, `NailSet`, and
`NailTexture` are produced from the user's own scan. They are neither public product assets nor photos:

- Stored under `users/{uid}/...`, owner-only, never public by default.
- A share publishes a **copy** scoped to the share (`publicAssets/{shareId}/...`), so revoking a share
  never touches the originals.
- Public read on the share-scoped copy is gated by Cross-service Rules (`firestore.get` against
  `publicShares/{shareId}.isEnabled`) so that revoking a share also revokes asset access.
- Do **not** use `getDownloadURL()` token URLs for shared assets — token URLs bypass Security Rules,
  so revocation would not take effect.
- Hand shape is close to an identifying characteristic, so the personal hand model is **not** shared by
  default; a generic hand is substituted unless the user opts in (pending G6).

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
