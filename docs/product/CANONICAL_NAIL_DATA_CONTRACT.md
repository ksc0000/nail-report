# Canonical Nail Data 契約 v1（設計確定案）

> **Status: 契約設計（docs-only / 実装なし）**
> 前提: [NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) の **案 A-1 採用がオーナー承認済み（G1, 2026-10-06）**
> 作成日: 2026-10-06
> 位置づけ: **本ドキュメントが Canonical Nail Data（CND）の単一の正（single source of truth）である。** iOS / Web の両実装はこの契約に従う。

---

## 0. 承認済みの前提

| # | 決定事項 | 状態 |
|---|---|---|
| 1 | ネイティブ iOS + App Store 配布を Nail Scan / 3D 生成のために許容する | **G1 承認済み（2026-10-06）** |
| 2 | 案 **A-1** を採用（復元処理も iOS 側） | **承認済み** |
| 3 | 責務分離: iOS = Capture / Detection / Reconstruction、Web/R3F = Archive / Compare / Share / Rendering | **承認済み** |
| 4 | **GLB を永続データの正にしない。** プラットフォーム非依存の CND を正とし、GLB 等は派生 asset | **承認済み** |

### 不変条件（INV / 全実装が従う）

| # | 不変条件 |
|---|---|
| **INV-1** | **写真記録は常に成立する。** 2.5D / 3D は追加レイヤーであり、記録の前提条件ではない |
| **INV-2** | **3D 状態は `NailItem` 本体から分離する。** 3D の失敗・欠損が記録本体に書き戻されない |
| **INV-3** | **未知の `contractVersion` は L0（写真のみ）へ安全にフォールバックする。** 例外を投げず、記録の閲覧を妨げない |

---

## 1. Canonical / Derived の二分

### 1.1 原則

> **Canonical = 失ったら復元できないデータ。Derived = CND から再生成できるデータ。**
> バックアップ・マイグレーション・エクスポート・契約バージョニングの対象は **Canonical のみ**。

```text
┌─ Canonical（正・再生成不可）─────────────────────────┐
│  HandProfile   … 手の骨格 + NailSocket[5]  (JSON)     │
│  NailSocket    … 爪床の座標系              (JSON)     │
│  NailGeometry  … 爪の形状パラメータ        (JSON)     │
│  NailTexture   … 整形済み爪テクスチャ      (画像)★    │
│  NailSet       … 上記の束ね + バージョン   (JSON)     │
└───────────────────────────────────────────────────────┘
                        │ 再生成可能
                        ▼
┌─ Derived（派生・キャッシュ扱い・削除可）─────────────┐
│  GLB / glTF        … レンダリング用メッシュ           │
│  USDZ              … 将来の AR Quick Look             │
│  preview PNG       … サムネイル・OG 画像              │
│  KTX2              … 圧縮テクスチャ                   │
│  publicAssets/*    … 共有スコープの複製               │
└───────────────────────────────────────────────────────┘
```

★ **NailTexture は Canonical。** 撮影由来の画像データでありパラメータから再生成できないため、「派生 asset」ではなく正に含める。これが CND を「JSON だけ」と定義できない理由。

### 1.2 GLB を正にしない理由（オーナー判断の裏付け）

| # | 理由 |
|---|---|
| 1 | **比較ができない。** #406 の時系列比較は `curveV` / `length` 等のパラメータ差分が必要。GLB はバイナリメッシュであり、焼き込まれた頂点から元のパラメータを復元できない |
| 2 | **レンダリング改善のたびに再スキャンが必要になる。** パラメータを失っていると、シェーダ・合成方法・品質を改善しても既存記録に適用できない |
| 3 | **エクスポータ / レンダラ依存。** UV・法線・マテリアルの解釈が実装依存で、iOS が書き Web が読む構成では差異が入る。JSON なら契約で固定できる |
| 4 | **クエリ不能。** CND（数 KB の JSON）は Firestore に収まり、検索・ソート・差分が可能。GLB は不可 |
| 5 | **サイズ。** CND 数 KB + テクスチャ数十 KB 対 GLB 数百 KB〜MB。保存・転送・共有すべてで有利 |
| 6 | **表現方式を固定してしまう。** 2.5D / パラメトリック / メッシュのどれで見せるかを後から変えられなくなる |

→ **GLB はレンダリングキャッシュであり、データではない。**

### 1.3 MVP では GLB を生成しない

Web は CND からランタイムにジオメトリを構築する（R3F の procedural geometry + テクスチャ適用）。したがって:

- **MVP で GLB / USDZ の生成・保存は不要。**
- GLB が必要になるのは「AR Quick Look 対応」「外部ツールへの書き出し」など明確な用途が生じたときのみ。そのとき派生 asset として生成する。
- `3D_ASSET_DELIVERY_STRATEGY.md` の GLB 中心の記述は**プリセット配信**を前提としたものであり、実物復元経路には適用されない（同ドキュメントに注記を追加済み）。

### 1.4 派生 asset のルール

| # | ルール |
|---|---|
| **D1** | 派生 asset は必ず CND から再生成できること。再生成不能な情報を派生 asset にのみ持たせてはならない |
| **D2** | 派生 asset は削除可能（キャッシュ扱い）。削除しても CND があれば復元できる |
| **D3** | 派生 asset は `derivedFrom: { contractVersion, reconstructionVersion, rendererVersion, cndRevision }` を持ち、CND 更新時に無効化できる |
| **D4** | エクスポート / バックアップの対象は Canonical のみ。派生 asset は含めない |
| **D5** | 共有も「CND → 派生」の経路を通る。GLB を直接の正として配らない |

---

## 2. 契約オブジェクト

### 2.1 HandProfile（ユーザー資産・handedness 単位）

```text
users/{uid}/handProfiles/{handedness}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|:---:|---|
| `contractVersion` | number | ✅ | 契約バージョン（v1 = `1`） |
| `handedness` | `"left" \| "right"` | ✅ | 記録単位が片手である既存決定（2026-09-15 / #392）と一致 |
| `boneLengths` | number[] | ✅ | landmarks から算出。正規化スケール。**要素数は厳密に 20** |
| `fingerRadii` | number[] | ✅ | 指の太さ。**要素数は厳密に 5** |
| `canonicalPose` | object | ✅ | `{ wristOrigin: vec3, palmNormal: vec3, palmTangent: vec3 }`。**撮影時ポーズは再現しない**（非目標） |
| `nailSockets` | NailSocket[] | ✅ | 1〜5 件。`finger` は重複不可 → 2.2 |
| `source` | object | ✅ | `{ deviceClass: string, capturedAt: string, sampleCount: int≥1 }` |
| `reconstructionVersion` | number | ✅ | 生成アルゴリズム版 |
| `updatedAt` | Timestamp | ✅ | |

**生成・更新は iOS のみ。** Web は読み取り専用。複数スキャンの統計（中央値）で精度が上がる設計とし、`sampleCount` で信頼度を表現する。

### 2.2 NailSocket（HandProfile に埋め込み）

爪が生える場所の座標系。**この契約の中核であり、爪を差し替えても同じ手に見えるかはここの安定性で決まる。**

| フィールド | 型 | 必須 | 説明 |
|---|---|:---:|---|
| `finger` | `thumb\|index\|middle\|ring\|pinky` | ✅ | |
| `origin` | vec3 | ✅ | 爪床の基準点（キューティクル側中央） |
| `normal` | vec3 | ✅ | 爪面の法線 |
| `tangent` | vec3 | ✅ | 指の長軸方向 |
| `bedWidth` | number | ✅ | 爪床の実寸幅 |
| `bedLength` | number | ✅ | 爪床の実寸長（**爪そのものの長さは含まない**） |
| `confidence` | number | ✅ | 0〜1 |

> `bedLength`（爪床・不変）と NailGeometry の `length`（爪の長さ・毎回変わる）を混同しないこと。スカルプ / チップで伸びるのは後者。

### 2.3 NailGeometry（NailSet に埋め込み・爪ごと）

| フィールド | 型 | 必須 | 説明 |
|---|---|:---:|---|
| `shape` | `round\|square\|almond\|coffin\|stiletto` | ✅ | #389 推定器の出力 |
| `curveV` | number | ✅ | 縦カーブ（#389 / #394） |
| `curveH` | number | ✅ | 横カーブ（#389 / #394） |
| `length` | number | ✅ | 爪の長さ |
| `thickness` | number | ✅ | 厚み |
| `outline` | vec2[] | — | 輪郭ポリゴン（任意・高精度化用） |
| `confidence` | number | ✅ | 0〜1 |

**既存の #388 / #389 完了分と #391 / #394 進行分の出力が、そのままこのオブジェクトに対応する。** 契約側で新しい推定を要求しない。

### 2.4 NailTexture（NailSet に埋め込み・爪ごと / Canonical）

| フィールド | 型 | 必須 | 説明 |
|---|---|:---:|---|
| `textureRef` | string | ✅ | Storage パス（socket UV 空間に整形済み） |
| `uvTransform` | number[9] | ✅ | socket 座標系への対応（row-major mat3） |
| `heightMapRef` | string | — | **L1 / 2.5D 表現。これ単独でも成立する**（→ 3.2） |
| `normalMapRef` | string | — | 任意 |
| `capturedFrameHint` | string | — | 由来フレーム（デバッグ用・再スキャン判断） |

### 2.5 NailSet（NailItem から分離・INV-2 の実装）

```text
users/{uid}/nailItems/{itemId}/nail3d/current
```

| フィールド | 型 | 必須 | 説明 |
|---|---|:---:|---|
| `contractVersion` | number | ✅ | **INV-3 の判定キー** |
| `reconstructionVersion` | number | ✅ | 推定アルゴリズム版 |
| `handedness` | `"left"\|"right"` | ✅ | |
| `handProfileRef` | string | ✅ | 参照先が欠けていても L1 として描画可能 |
| `nails` | array (≤5) | ✅ | `{ socketRef, geometry: NailGeometry, texture: NailTexture }` |
| `quality` | object | ✅ | `{ overall, perNail[] }` |
| `completeness` | `"full"\|"partial"` | ✅ | 5 本揃わなくても保存する。**`nails` の件数と一致すること**（`full` ⇔ 5 件） |
| `createdAt` / `updatedAt` | Timestamp | ✅ | |

**重要: `status: "failed"` のような失敗状態を持たない。** 失敗は「このドキュメントが存在しない」で表現する（INV-2）。部分成功は `completeness: "partial"` + `nails` の要素数で表現する。

### 2.6 計測値は CND に含めない

`#407` の「本人専用の計測値・解析値を公開モデルに混ぜない」を**構造で**保証するため、健康解析・計測目的のデータは別ドキュメントに置く。

```text
users/{uid}/nailItems/{itemId}/measurement/current   ← 共有経路は読まない
```

フィールド単位のフィルタリングに頼らず、**共有経路がこのドキュメントを参照しない**ことで担保する。既存の `publicShares` が `memo` / `imageUrl` をアプリ側で除外している方式より構造的に安全。

---

## 3. バージョニングと INV-3

### 3.1 3 つのバージョンの役割

| フィールド | 置き場所 | 上げるとき | 読み手の反応 |
|---|---|---|---|
| `contractVersion` | Canonical | **データ形の破壊的変更** | 未知なら **L0 フォールバック** |
| `reconstructionVersion` | Canonical | 推定アルゴリズムの改善 | 描画は可能。再スキャン推奨の判断に使う |
| `rendererVersion` | **Derived のみ** | 表示側の改善 | 派生 asset の無効化に使う |

`rendererVersion` を Canonical に置かないこと。表示の都合がデータの正を汚染する。

### 3.2 INV-3 の判定ルール（Web 実装の規範）

```text
MAX_SUPPORTED_CONTRACT_VERSION = 1   // Web が理解できる上限

NailSet を読んだとき（この順序で評価する）:
  1. ドキュメント不在 (null / undefined)   → L0 'absent'。異常ではなく正常な状態
  2. オブジェクトでない                    → L0 'malformed'
  3. contractVersion が正整数でない        → L0 'invalid-contract-version'
  4. contractVersion > MAX_SUPPORTED       → L0 'unsupported-contract-version'
  5. 必須フィールド欠落・型不一致          → L0 'malformed'。部分描画は試みない
  6. textureRef（Canonical）が取得不可     → **その爪のみ除外**し droppedFingers に記録
       └ 描画可能な爪が 0 本になった場合   → L0 'texture-unavailable'
  7. HandProfile が不在 / 未対応版 / 不正  → L1 'hand-profile-missing'
       └ handedness が NailSet と不一致     → L1（同 reason, detail に不一致を記録）
       └ socket が 1 つも一致しない         → L1（同上）
       └ 使用可能な heightMap が無い場合    → L0 'hand-profile-missing'
  8. 上記すべて正常                        → L2 描画
```

**6 の精緻化（実装時の決定）:** 当初は「texture 取得失敗 → L0」としていたが、
**1 本のテクスチャ欠損で 5 本すべてを失うのは過剰**なため、該当する爪のみを除外し
残りを描画する方式に変更した。`completeness: "partial"` と同じ思想であり、
降格は「描画可能な爪が 0 本」のときだけ L0 まで落ちる。

**L3 について:** `L3`（手 ＋ 10 本）は NailSet 2 つの合成であり、単一 NailSet を評価する
`planNail3DRender()` の戻り値は `L0 | L1 | L2` に限られる。L3 の判定は 1 階層上で行う。

**規範:**

- 例外を UI に伝播させない。3D の失敗が記録の閲覧を妨げてはならない（INV-1 / INV-3）。
- **失敗を Firestore に書き戻さない**（INV-2）。リトライ状態も記録本体に持たせない。
- エラー表示は「3D がありません」ではなく、**3D 領域を出さない**のが既定（写真記録として完全であることを示す / P6）。

この forward compatibility により、**iOS が新バージョンで先行リリースしても Web は壊れない。** App Store 審査の遅延が Web のリリースをブロックしないため、2 クライアントのリリース順序を揃える必要がなくなる。

### 3.3 契約変更ルール

| # | ルール |
|---|---|
| C1 | **additive-only。** フィールド追加は `contractVersion` を上げない（任意フィールドとして追加） |
| C2 | フィールドの削除・型変更・意味変更は `contractVersion` を上げる |
| C3 | 契約の正は**このリポジトリ**。`docs/product/` の本書と、将来追加する JSON fixtures |
| C4 | fixtures は Web 側テスト（既存 Vitest 基盤）でパース検証する |
| C5 | iOS 側は実装のみを持ち、契約を単独で変更しない |

C3〜C5 は、**iOS 実装がこのリポジトリおよび CI / AI パイプラインの検証範囲外にある**ことへの対策（[NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) 2.4 リスク 1）。

---

## 4. レイヤーモデルと契約の対応

```text
L3  HandProfile + NailSet 合成（手 ＋ 10 本）  … HandProfile ＋ NailSet×2
L2  NailSet（パラメトリック 5 本 + テクスチャ）… HandProfile ＋ NailSet
L1  2.5D（height / normal map）                … NailTexture のみ（HandProfile 不要）
────────────────────────────────────────────────────────────────
L0  写真記録                                    … NailItem のみ（必須・常に成立）
```

**L1 が HandProfile を必要としない**ことは意図的な設計。

- HandProfile 生成前・生成失敗時でも 2.5D で「ネイルを立体的に見る」体験を提供できる
- 将来 Web 側キャプチャを開く場合、L1 のみを MediaPipe Web で実現でき、L2/L3 の完全実装を待つ必要がない（プラットフォーム非対称の緩和手段）

---

## 5. 保存レイアウト（設計案 / G3・G4 承認後に実装）

```text
Firestore ─ Canonical
  users/{uid}/handProfiles/{handedness}                HandProfile + NailSocket[5]
  users/{uid}/nailItems/{itemId}                       NailItem（写真記録・L0）
  users/{uid}/nailItems/{itemId}/nail3d/current        NailSet
  users/{uid}/nailItems/{itemId}/measurement/current   計測値（共有経路は読まない）
  publicShares/{shareId}                               CND スナップショット（計測値を含まない）

Storage ─ Canonical
  users/{uid}/nailItems/{itemId}/nail3d/tex_{finger}.webp      NailTexture（private）
  users/{uid}/nailItems/{itemId}/nail3d/height_{finger}.webp   heightMap（private・任意）
  users/{uid}/handProfiles/{handedness}/profile.json           大きい場合の退避先（任意）

Storage ─ Derived（キャッシュ・削除可）
  publicAssets/{shareId}/tex_{finger}.webp                     共有用の複製
  （GLB / USDZ / preview は MVP では生成しない）
```

設計上の注意:

- **共有用テクスチャは複製**とする。原本は owner-only のまま、共有停止時の失効も複製側だけで完結する。
- `storage.rules` は現在 `users/{userId}/nailItems/{nailItemId}/{filename}` のみ許可し、`contentType` を `image/(jpeg|png|webp)` に制限している。`nail3d/` 配下と `publicAssets/` の追加は **G4 / G6**。
- `publicAssets/{shareId}/**` の公開読みは **Cross-service Rules**（`firestore.get` で `publicShares/{shareId}.isEnabled` を参照）で共有停止に連動させる。
- **`getDownloadURL()` のトークン付き URL を共有に使わないこと。** トークン URL は Security Rules をバイパスするため、共有停止後もアクセスが止まらない。

---

## 6. `NailItem` への影響（INV-1 / INV-2）

### 6.1 `NailItem` は変更しない

CND は `NailItem` のサブコレクションに置くため、**`NailItem` のスキーマ変更は不要**。

既存実装（`src/lib/firestoreModel.ts`）は:

- `imageUrl` が**必須フィールド**（写真が記録の本体であることが型で表現済み）
- `buildOptionalNailItemFields` が `undefined` のフィールドを書き込まない additive パターンを確立済み

→ **INV-1 / INV-2 は既存の型と構造をそのまま維持すれば満たされる。** 新しいパターンの導入は不要。

### 6.2 `modelId` / `modelUrl` / `materialPreset` は非採用

`FIRESTORE_3D_SCHEMA_DESIGN.md` / `PRODUCT_SPEC.md` が提案していたこれらのフィールドは、**CND 方針により `NailItem` には追加しない**。

| 提案フィールド | 判定 | 理由 |
|---|---|---|
| `modelId` | **非採用** | プリセット参照モデル。実物復元には対応しない |
| `modelUrl` | **非採用** | GLB URL を正にすることになり Canonical/Derived 原則に反する |
| `materialPreset` | **非採用** | マテリアルは NailTexture + レンダラ側で表現 |
| `shape` / `mainColor` / `texture` / `decorationParts` | **実装済み・現状維持** | 既にユーザー入力項目として機能。CND の `NailGeometry.shape` とは別物（手入力タグ的用途）として併存 |

> `NailItem.shape`（ユーザーが選ぶ分類）と `NailGeometry.shape`（スキャンによる推定）は**別物**であり、両立させる。前者は検索・分類用、後者は描画用。

---

## 7. 不変条件の受け入れテスト

3D に関わる全 PR で確認する。

| # | テスト | 期待 |
|---|---|---|
| T1 | `isNail3DEnabled = false` で全既存フローを通す | L0 のみで完全動作 |
| T2 | `nail3d/current` を手動削除 | 詳細 / 一覧 / 比較 / 共有が写真のみで動作 |
| T3 | `contractVersion = 999` を注入 | L0 フォールバック。例外なし |
| T4 | `textureRef` を不正パスに変更 | L0 へ降格。例外なし |
| T5 | `handProfileRef` を不在参照に変更 | L1 へ降格（heightMap があれば） |
| T6 | スキャンを中断 | `NailItem` が無変更のまま保存済みで残る |
| T7 | WebGL 無効環境で詳細を開く | 写真で開ける |
| T8 | 3D あり / なしの記録を一覧に混在 | 同等に表示される（優遇・欠陥表示なし） |

---

## 7.1 実装（N1 完了分）

| 成果物 | 内容 |
|---|---|
| `src/lib/nail3dContract.ts` | 契約の型定義とパーサ、`planNail3DRender()`（INV-3 の判定を実装）。Firebase / React / DOM に非依存 |
| `contracts/nail3d/v1/fixtures/*.json` | **プラットフォーム非依存の契約 artifact。** 17 件（valid / unknown version / malformed / 部分欠損） |
| `contracts/nail3d/v1/README.md` | fixtures 一覧と iOS 側の使い方、追加・変更ルール |
| `tests/nail3dContract.test.ts` | fixtures をディスクから読み、降格挙動を 27 ケースで検証 |

実行:

```bash
npm run test        # 契約テストを含む（G9 承認済み・2026-10-06 適用）
```

> **⚠ 未了（G10）— 契約回帰はまだ CI でガードされていない。**
> `.github/workflows/ci.yml` は **CSS guard と `npm run build` のみ**を実行しており、
> `npm run test` も `npm run lint` も呼んでいない。したがって `package.json` への
> 組み込み（G9 適用済み）だけでは CI ゲートにならず、契約を壊す変更が CI を通過しうる。
>
> 必要な変更（`.github/workflows` の変更は Human Gate **G10**）:
>
> ```yaml
>       - name: Lint
>         run: npm run lint
>
>       - name: Test
>         run: npm run test
> ```
>
> CI は `windows-latest` / Node 22 で動作する。`--experimental-strip-types` は
> Node 22.6 以降で利用可能なため、`node-version: 22`（22.x 最新に解決）であれば動作する。
> この 2 ステップが入るまで、契約回帰の検知はローカル実行に依存する。

検証済みの性質:

- `valid-full` / `valid-partial` → L2。socket が欠ける指は除外され、残りは描画される
- 未知 / 不正 / 欠落 `contractVersion` → L0（理由コードを区別）
- malformed 5 種 → L0。部分描画しない
- HandProfile 不在 / 未対応版 / 不正 / handedness 不一致 / socket 不一致 → L1、heightMap が無ければ L0
- texture 1 件不可 → その爪のみ除外。全件不可 → L0
- **additive-only の検証:** 未知フィールドを足しても L2 のまま（C1）
- **例外を投げない:** 文字列・数値・配列・NaN・throw する getter など 15 種の異常入力すべてで L0 を返す

## 8. 参照

| ドキュメント | 関連 |
|---|---|
| [NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) | 案 A-1・責務分離・Product Principle |
| [NAIL_3D_SCAN_DIRECTION_REVIEW.md](./NAIL_3D_SCAN_DIRECTION_REVIEW.md) | 方向性レビュー・矛盾一覧 |
| [NAIL_3D_ISSUE_REORG_PLAN.md](./NAIL_3D_ISSUE_REORG_PLAN.md) | #390〜#407 再編案 |
| [FIRESTORE_3D_SCHEMA_DESIGN.md](./FIRESTORE_3D_SCHEMA_DESIGN.md) | 旧スキーマ案（本書が優先） |
| [3D_ASSET_DELIVERY_STRATEGY.md](./3D_ASSET_DELIVERY_STRATEGY.md) | GLB 配信（プリセット前提・派生 asset として再位置づけ） |
| [NAIL_HAND_DETECTION_PIPELINE.md](./NAIL_HAND_DETECTION_PIPELINE.md) | オンデバイス処理原則 |
| `src/lib/firestoreModel.ts` | optional-additive パターンの既存実装 |
