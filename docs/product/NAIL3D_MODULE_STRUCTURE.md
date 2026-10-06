# 3D 機能のモジュール構成方針（#410）

> **Status: 方針決定（docs-only）。既存ファイルの移動は伴わない。**
> 関連: #410 / Epic #404
> 作成日: 2026-10-06

---

## 1. なぜ実装前に決めるのか

| ファイル | 行数 |
|---|---:|
| `src/App.tsx` | 2,430 |
| `src/App.css` | 6,235 |

`AGENTS.md` の PR ルールは **diff 150 行以内**。3D レンダラー・時系列比較・360°共有をこの 2 ファイルに足すと 1 PR に収まらない。後から分離すると G12（大規模リファクタ）になるため、**最初から外に置く**。

---

## 2. 決定

### 2.1 ディレクトリ構成

```
src/
├── lib/
│   ├── nail3dContract.ts     … 契約パーサ（実装済み・移動しない）
│   └── nail3dGeometry.ts     … CND → 頂点データ（純粋数学・three 非依存）
├── features/
│   └── nail3d/
│       ├── Nail3DCanvas.tsx  … R3F <Canvas> ラッパー（lazy 読み込みの入口）
│       ├── NailSetMesh.tsx   … NailSet → BufferGeometry
│       ├── useNail3DPlan.ts  … planNail3DRender() の React 層
│       └── nail3d.css        … この機能のスタイル
└── App.tsx                    … lazy mount の数行のみ
```

**`src/features/` はこのリポジトリで新しい階層。** 既存は `src/components/*.tsx` と `src/lib/*.ts` のフラット構成。3D は複数ファイル・独自 CSS・独自の状態を持つ**境界のある部分機能**なので、`components/` に平置きせず `features/` にまとめる。

### 2.2 レイヤーの分離（最重要）

**`three` に依存するコードと、依存しないコードを分ける。**

| 層 | 場所 | `three` 依存 | テスト |
|---|---|:---:|---|
| 契約パース | `src/lib/nail3dContract.ts` | **なし** | `tests/` から直接（実装済み・27 ケース） |
| **ジオメトリ生成** | `src/lib/nail3dGeometry.ts` | **なし** | `tests/` から直接 |
| レンダリング | `src/features/nail3d/*` | あり | 目視 + 最小のスモーク |

理由:

1. **ジオメトリ生成は純粋数学。** `NailGeometry` + `NailSocket` → 頂点・法線・UV・インデックスの配列は three.js を必要としない。R3F 側は `<bufferGeometry>` に配列を渡すだけ
2. **依存追加（G8 / G9）の承認を待たずに書ける・テストできる**
3. **three.js を差し替えても壊れない**。3D 表現の本質（爪の形）がレンダラから独立する
4. 既存の `tests/` は node の test runner で動き、DOM も WebGL も不要。重要なロジックをそこに置ける

### 2.3 `App.tsx` への変更は lazy mount のみ

既存の前例（`PrivacyPolicyPage` / `TermsOfServicePage` / `NailImageDetailViewer` / `NailComparisonPanel`）に従う。

```tsx
const Nail3DCanvas = lazy(() => import('./features/nail3d/Nail3DCanvas'))
```

**ただし Suspense の扱いは既存と変える。**

既存は `<Suspense fallback={<div className="lazy-loading">読み込み中...</div>}>` を使うが、**3D ではこの fallback を使わない**。

> 理由: 3D は追加レイヤーであり、「読み込み中...」が出ると写真記録として完全なものが未完成に見える（**INV-1 / Product Principle**）。
> L0（3D なし）のときは **Suspense 境界ごと出さない**。描画する 3D があるときだけ mount し、その間の fallback は控えめなプレースホルダ（高さだけ確保する空要素）にする。

### 2.4 フィーチャーフラグ

既存の `isAiTagSuggestionEnabled` と同じパターン。

```ts
// src/lib/featureFlags.ts
export const isNail3DEnabled = import.meta.env.VITE_ENABLE_NAIL3D === 'true'
```

| | |
|---|---|
| **既定値** | **OFF**（env 未設定なら無効） |
| 有効化 | `.env.local` に `VITE_ENABLE_NAIL3D=true` |

**既定 OFF にする理由:** `isNail3DEnabled = false` で 3D が完全に消え、L0 のみの製品として成立する状態を常に維持する。これが INV-1 の回帰テスト基盤になる（受け入れテスト T1）。

> `.env.example` には追記しない。既存の `VITE_ENABLE_AI_TAG_SUGGESTION` も記載されておらず、同ファイルは Firebase 設定専用。かつ `AGENTS.md` は `.env` / `.env.*` への変更を禁止している。フラグはこのドキュメントで周知する。

### 2.5 `App.tsx` の接続点

**NailItem 詳細（`NailImageDetailViewer` の近傍）に 1 箇所だけ。**

一覧・ホーム・共有ページには当面入れない。理由:

- 一覧に 3D を出すと「3D あり」の記録が優遇され、3D なしの記録が欠陥に見える（**INV-1 / P6**）
- 一覧で複数の WebGL コンテキストを持つとモバイルで破綻する

### 2.6 CSS

`src/features/nail3d/nail3d.css` に閉じる。`App.css` には追加しない。

#### ⚠ 発見: CSS guard は `src/App.css` しか見ていない

`commands/check-css-guard.ps1` を確認した結果:

```powershell
$cssPath = "src/App.css"
...
$diff = git --no-pager diff -- $cssPath
```

**ガード対象は `src/App.css` の diff 追加行のみ。** `src/features/nail3d/nail3d.css` はチェックされない。

| 選択肢 | 評価 |
|---|---|
| (a) 3D の CSS も `App.css` に置く | ガードは効くが 6,235 行のファイルをさらに太らせ、PR の diff も膨らむ。却下 |
| (b) feature 配下に置く（**採用**） | ガードの対象外になる。ルール（コードフェンス混入 / `&:` ネスト / `${}` 混入）は**人手のレビューで担保する** |
| (c) ガードを feature CSS にも広げる | `commands/` 配下のスクリプト変更は `AGENTS.md` の禁止操作。**別途承認が必要** |

**(b) を採用し、ガードの穴を既知の負債として記録する。** (c) は follow-up 候補（`commands/check-css-guard.ps1` の対象を `src/**/*.css` に広げる）。3D の CSS は Canvas のサイズ指定程度で量が少なく、当面のリスクは低い。

---

## 3. この構成が満たすもの

| 要件 | どう満たすか |
|---|---|
| PR 150 行以内 | 新規ファイルが独立しており、`App.tsx` の変更は数行 |
| INV-1（写真記録は常に成立） | `isNail3DEnabled = false` で完全に消える。L0 では Suspense 境界ごと出さない |
| INV-2（3D 状態を NailItem から分離） | データ側で担保済み（`nail3d/current` サブコレクション） |
| INV-3（未知バージョン → L0） | `lib/nail3dContract.ts` が実装済み。`features/` 側はその結果に従うだけ |
| 初期バンドルを太らせない | `three` を含むコードはすべて `features/nail3d/` 配下にあり lazy import の先にある |
| G12 を発生させない | **既存ファイルを移動しない。** 追加のみ |

---

## 4. 決定事項まとめ

- [x] ディレクトリ構成 → `src/features/nail3d/` ＋ `src/lib/nail3dGeometry.ts`
- [x] `three` 依存の有無でレイヤーを分ける → ジオメトリ生成は `lib/` に置き three 非依存
- [x] CSS → feature 配下。**ガード対象外であることを既知の負債として記録**
- [x] `isNail3DEnabled` 既定値 → **OFF**
- [x] `App.tsx` 接続点 → NailItem 詳細の 1 箇所のみ
- [x] Suspense fallback → 既存の「読み込み中...」を使わない。L0 では境界ごと出さない

## 5. follow-up 候補（未起票）

- `commands/check-css-guard.ps1` の対象を `src/**/*.css` に広げる（`commands/` 変更の承認が必要）

---

## 6. 参照

- `docs/product/CANONICAL_NAIL_DATA_CONTRACT.md` — 契約の正・不変条件
- `docs/product/NAIL_3D_PLATFORM_ARCHITECTURE.md` — 責務分離
- `docs/operations/CODE_SPLITTING_STRATEGY.md` / `BUNDLE_SIZE_WARNING_ACCEPTANCE.md` — 既存のバンドル方針
- `AGENTS.md` — PR サイズ規約・禁止操作
