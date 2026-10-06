# Nail 3D プラットフォーム構成比較と推奨案

> **Status: 設計レビュー（docs-only / 実装なし / Issue 追加なし）**
> 前提: [NAIL_3D_SCAN_DIRECTION_REVIEW.md](./NAIL_3D_SCAN_DIRECTION_REVIEW.md) の方向性（Personal Hand Base + Replaceable Nail Set）は承認済み
> 作成日: 2026-10-06
> 目的: オーナー提案の責務分離（iOS = Capture / Scan Engine、共通データ = HandProfile + NailSocket + NailSet + 3D Asset、Web/R3F = Archive / Compare / Share）を第一候補として検証し、代替案と比較して推奨構成を出す。
>
> **2026-10-06 — 本書の推奨（案 A-1）はオーナー承認済み（G1）。** ネイティブ iOS + App Store 配布を許容。
> 責務は iOS = Capture / Detection / Reconstruction、共通契約 = HandProfile + NailSocket + NailGeometry +
> NailTexture + NailSet、Web/R3F = Archive / Compare / Share / Rendering。
> **GLB は永続データの正にせず、Canonical Nail Data を正とし GLB 等は派生 asset として扱う。**
> 契約の詳細は [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md)、
> Issue 再編は [NAIL_3D_ISSUE_REORG_PLAN.md](./NAIL_3D_ISSUE_REORG_PLAN.md)。

---

## 0. 結論サマリ

| 問い | 結論 |
|---|---|
| 提案の責務分離は妥当か | **妥当。推奨案として採用。** ただし「復元処理をどちらが持つか」の下位判断が未定で、ここを決めないと契約が定まらない |
| 推奨構成 | **案 A-1: iOS = Capture + Reconstruction、Web/R3F = Render only、共通データ = 派生パラメータ + テクスチャのみ** |
| 最大のリスク | **契約ドリフト。** iOS 実装がこのリポジトリに存在せず、CI / AI パイプラインの検証範囲外にある |
| 最大の構造的利点 | 生の動画・多フレームが**端末外に出ない**。アップロードは派生パラメータとテクスチャのみ |
| 却下する案 | 案 C（iOS 単独）— #407 の「インストール不要の共有」要件を満たせない |
| 保険として残す案 | 案 B（Web 単独）— iOS 配布が承認されない場合のフォールバック |
| 要 Human 判断 | **iOS 配布（App Store）を受け入れるか。** `IOS_RELEASE_PATH_DECISION.md` の PWA-first 方針の部分見直しに相当（G1） |

**Product Principle として第 1 節を最上位に置く。** 案 A はキャプチャが iOS 専用になるため「Web ユーザーは 3D を作れない」という非対称が生じるが、**写真記録が常に成立する**ならこれは製品の欠陥ではなく段階的強化（progressive enhancement）になる。つまりこの Product Principle は、思想であると同時に **案 A を成立させる前提条件** である。

---

## 1. Product Principle（最上位・他のすべてに優先する）

> **写真によるネイル記録は常に成立する。3D / 2.5D は記録を豊かにする追加レイヤーであり、記録の前提条件ではない。**
>
> **3D 生成の失敗によって、ネイル記録そのものが失敗する設計にしてはならない。**

### 1.1 レイヤーモデル

```text
L3  HandProfile + NailSet 合成（手 ＋ 10 本）          ┐
L2  NailSet（パラメトリック 5 本 ＋ テクスチャ）        ├─ 追加レイヤー（任意・欠けてよい）
L1  2.5D（単写真 → height / normal map）              ┘
────────────────────────────────────────────────────
L0  写真記録（title / imageUrl / tags / memo / 日付）  ← 必須・全端末・常に成立
```

**L0 だけで製品は完結する。** L1〜L3 は上に積むだけで、下を変更しない。欠けても L0 の体験は一切劣化しない。

### 1.2 不変条件（テスト可能な形に落とす）

思想のままでは守られないので、検証可能な不変条件として定義する。

| # | 不変条件 | 検証方法 |
|---|---|---|
| **P1** | `NailItem` の必須フィールドは写真側のみ。3D 関連は**すべて optional** | 型定義レビュー / 既存 `buildOptionalNailItemFields` パターン準拠 |
| **P2** | 記録の保存完了条件に 3D 生成を含めない。写真アップロード完了時点で保存は**成功確定** | 保存処理に 3D への `await` が無いことをレビューで確認 |
| **P3** | 3D 生成の失敗・中断・非対応端末が `NailItem` の状態を変えない（失敗状態を記録本体に書き戻さない） | 3D 失敗を注入して `NailItem` が無変更であることを確認 |
| **P4** | 3D 資産の欠損・削除・読み込み失敗時、詳細 / 一覧 / 比較 / 共有が写真のみで完全動作する | 3D 資産を手動削除して全画面を通す |
| **P5** | 共有は写真（またはテキスト）で常に成立し、3D はあれば付加されるだけ | 3D なし記録の共有リンクが正常動作 |
| **P6** | 3D を持つ記録と持たない記録が一覧で**同等に扱われる**（3D あり優遇も、3D なしの欠陥表示もしない） | 一覧 UI のデザインレビュー（G2） |

### 1.3 P3 を構造的に保証する設計（最重要）

**3D の状態を `NailItem` 本体に書かない。別ドキュメントに分離する。**

```text
users/{uid}/nailItems/{itemId}              ← 写真記録（L0）。3D の失敗状態を一切持たない
users/{uid}/nailItems/{itemId}/nail3d/current ← 3D レイヤー（L1〜L3）。無くてよい
```

理由: `NailItem` に `scanStatus: 'failed'` のようなフィールドを持たせると、**記録そのものが「失敗した記録」として表示されうる**。別ドキュメントなら「記録は成功している。3D レイヤーが存在しないだけ」という状態しか表現できない。

これは命名や運用ルールではなく**データ構造による保証**であり、実装者が間違えようとしても間違えにくい。P3 の担保手段としてこれを採用すべき。

### 1.4 既存コードとの整合（良いニュース）

`src/lib/firestoreModel.ts` を確認した結果、**optional-additive パターンは既に実装・テスト済み**:

```ts
const buildOptionalNailItemFields = (input: NailItemInput) => ({
  ...(input.shape !== undefined ? { shape: input.shape } : {}),
  ...(input.mainColor !== undefined ? { mainColor: input.mainColor } : {}),
  // ... undefined のフィールドは書き込まない
})
```

また `NailItem.imageUrl` は **必須フィールド**であり、写真が記録の本体であることが型レベルで既に表現されている。

→ **P1 は新しい発明ではなく、既存パターンの踏襲。** 実装リスクは低い。

### 1.5 ドキュメントと実装の乖離（要修正）

ただし、ここで **docs と実装の不一致** を検出した。

| | docs の記載 | 実装の実態 |
|---|---|---|
| `PRODUCT_SPEC.md` | 「これらのフィールドは現在の `NailItemInput` / `NailItemDoc` 型に**含まれていません**」 | `shape` / `mainColor` / `texture` / `decorationParts` は**実装済み** |
| `FIRESTORE_3D_SCHEMA_DESIGN.md` | `color` フィールドを提案 | 実装は `mainColor`（名前が違う） |
| 両 docs | `modelId` / `modelUrl` / `materialPreset` | 未実装（これは docs どおり） |

→ docs 側を実態に合わせる必要がある（前回レビューの新規 Issue 13 に統合）。実装上は「optional 追加の前例が既にある」という追い風として扱える。

### 1.6 フィーチャーフラグ

既存の `src/lib/featureFlags.ts`（`isAiTagSuggestionEnabled`）と同じパターンで `isNail3DEnabled` を置き、**OFF で 3D が完全に消え、L0 のみの製品として成立する**状態を常に維持する。これが P1〜P6 の回帰テスト基盤になる。

---

## 2. 第一候補（オーナー提案）の検証

### 2.1 提案の構造

```text
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│ iOS             │    │ 共通データ            │    │ Web / R3F           │
│ Capture /       │───▶│ HandProfile          │───▶│ Archive             │
│ Scan Engine     │    │ NailSocket           │    │ Compare             │
│                 │    │ NailSet              │    │ Share (360°)        │
│                 │    │ 3D Asset             │    │                     │
└─────────────────┘    └──────────────────────┘    └─────────────────────┘
```

### 2.2 妥当と判断する理由

#### (1) 要件が構造を強制している（恣意的な分割ではない）

| 要件 | 強制される選択 |
|---|---|
| #407「共有リンク → **インストール不要** → 360°回転」 | **Web は回避不可能** |
| 高品質 multi-view キャプチャ（ブレ最小・角度別・連続フレーム） | **native が明確に有利** |

両方が同時に要件である以上、どちらか一方に寄せる構成は必ずどこかで無理が出る。責務分離は妥協ではなく**要件からの帰結**。

#### (2) 両プラットフォームの既存投資が同時に保全される

| 資産 | 状態 | 案 A での扱い |
|---|---|---|
| #388 4 方向ガイド撮影 | 完了 | そのまま Scan Engine |
| #389 形状パラメータ推定器 | 完了 | そのまま Scan Engine（NailSet 生成の中核） |
| #391 実写較正 / #394 片手 5 本分離 | 進行中 | そのまま Scan Engine |
| Web の CRUD / 共有 / エクスポート / 認証 | 完了・本番相当 | そのまま Archive / Share |

案 B（Web 単独）では左列上 4 つが、案 C（iOS 単独）では最下段が捨てられる。**案 A はどちらも捨てない唯一の構成。**

#### (3) 契約が製品の資産になる

HandProfile / NailSocket / NailSet はクライアント実装より寿命が長い。将来 Web キャプチャや Android を追加する場合も、同じ契約に差すだけで Archive / Share 側は無改修。案 A は「将来の選択肢を閉じない」構成。

#### (4) #404 の原則と一致

#404 の「Measurement Layer と Memory/Presentation Layer を分離」が、そのままプラットフォーム境界に対応する。設計原則とデプロイ境界が一致しているのは健全。

### 2.3 提案の未決事項 ——「復元処理はどちらが持つか」

ここが提案に含まれていない最大の空白。**「Capture / Scan Engine」という名前が、キャプチャのみか復元まで含むのか曖昧。** 3 通りあり、契約の形が大きく変わる。

| 案 | 復元の場所 | アップロードされるもの | 評価 |
|---|---|---|---|
| **A-1** | **iOS**（Capture + Reconstruction） | 派生パラメータ + 爪テクスチャ + ベストフレーム写真 | **推奨** |
| A-2 | Web（iOS は生フレームのみ送る） | 多フレーム画像 or 動画 | 非推奨 |
| A-3 | 両方（iOS native + Web MediaPipe） | 両方 | MVP では過剰 |

#### A-1 を推奨する理由

| 観点 | A-1 | A-2 |
|---|---|---|
| 幾何ロジックの実装箇所 | **1 箇所（Swift）** | 1 箇所（TS）だが Swift 推定器を捨てる |
| 生フレームの端末外流出 | **なし** | **あり**（動画 / 多フレームをアップロード） |
| `NAIL_HAND_DETECTION_PIPELINE.md` の原則<br>「Images never leave the device for analysis」 | **順守** | **違反** |
| アップロード量 | 数百 KB | 数 MB〜数十 MB |
| #389 推定器の再利用 | **そのまま使える** | 使えない（TS 再実装） |
| 失敗の切り分け | 端末内で完結、即座にリトライ可 | アップロード後に失敗＝体験が悪い |

**A-2 は既存のプライバシー原則に正面から違反する**ため、採用すべきでない。A-1 は「生の動画は端末外に出ず、出るのは派生物のみ」という、既存原則より**さらに強い**プライバシー特性を持つ。これは #D（手形状データの G6 判断）の論拠としても有利に働く。

A-3（Web 側にも復元を持つ）は、最も微妙で検証が難しいコード（幾何推定）を 2 言語で二重実装することになり、ドリフトの温床。Web キャプチャが**製品要件になってから**検討すべき。ただし L1（2.5D・単写真由来）だけは Web でも低コストに実現できるため、将来の拡張余地として残す（→ 5.3）。

### 2.4 提案のリスクと緩和策

#### リスク 1【最大】契約ドリフト — iOS 実装が検証範囲外にある

事実確認:

- このリポジトリに iOS 実装は存在しない（`ios/`, `AVCapture`, `VNDetectHumanHandPose`, `NailGeometry` すべて grep 0 件）
- アカウントのリポジトリ一覧に nail-report に対応する iOS リポジトリが見当たらない（`nallie` / `nallie_p` は最終 push 2026-04 で、9 月の iOS 作業より前）
- #391 が参照する `ios/BenchmarkAssets/angles/real/` 等はオーナーのローカル環境にのみ存在すると見られる

→ **iOS 側はこのリポジトリの CI / AI パイプライン（Jules / Codex / Claude）の検証範囲外。** 契約の片側が自動検証できない状態で 2 クライアントが同じデータを読み書きする構成になる。

緩和策（これがないと案 A は成立しない）:

| 対策 | 内容 |
|---|---|
| **契約の正をこのリポジトリに置く** | `docs/product/` に契約仕様、`fixtures/` に JSON サンプルを置き、**これを単一の正とする**。iOS 側は実装のみ |
| **`contractVersion` 必須化** | 全オブジェクトに付与 |
| **additive-only** | フィールド削除・意味変更は禁止。必要なら新バージョン |
| **Web を forward compatible にする** | **未知の `contractVersion` は「3D レイヤーなし」として扱い、L0 にフォールバック**。これにより iOS が先行リリースしても Web が壊れない |
| **契約の fixtures を Web 側のテストに組み込む** | `src/__tests__/` で契約 JSON のパースを検証（既に Vitest 基盤あり） |

最後の 2 つが効く。Web が未知バージョンを安全に無視できるなら、**2 クライアントのリリース順序を揃える必要がなくなる**（App Store 審査の遅延が Web のリリースをブロックしない）。これは案 A の運用コストを大幅に下げる。

#### リスク 2 Web ユーザーは 3D を作れない（二層化）

iOS 専用キャプチャにより、Web / PWA ユーザーは 3D レイヤーを生成できない。`IOS_RELEASE_PATH_DECISION.md` が PWA-first を選んだ製品にとって、これは実在するコスト。

→ **Product Principle がこれを解決する。** L0 のみで製品は完結しており、Web ユーザーも完全な製品を使える。3D は iOS ユーザーに対する段階的強化。さらに **3D の「閲覧」は全端末で可能**（共有・自分の記録の閲覧とも）なので、非対称は「作成」のみに限定される。

ただしこれは「Product Principle を守れば許容できる」という条件付きの話であり、**Principle が崩れた瞬間に二層化が製品の欠陥に変わる**。第 1 節を最上位に置く理由。

#### リスク 3 iOS 配布コストの再発生

`IOS_RELEASE_PATH_DECISION.md` は App Store 回避（$99/年・審査遅延）を理由に PWA-first を推奨した。案 A は iOS 配布を前提とするため、この判断の部分的な見直しに相当する。

→ ただし #352〜#403 の規模（約 50 Issue）を見る限り **iOS ネイティブ開発は既に相当進行している**ため、このコストは実質的に受け入れ済みの可能性が高い。**オーナー確認事項（G1）** として明示する。

#### リスク 4 復元ロジックの修正に App Store 審査が必要

A-1 では幾何推定が iOS 側にあるため、推定バグの修正に審査待ちが発生し、既存記録の再スキャンも必要になりうる。

緩和策: **再レンダリングで直せる範囲を広く取る。** `nailQuads` / landmarks / テクスチャといった中間派生物も保存しておけば、Web 側のレンダリング改善（シェーダ・合成）は再スキャン不要。`reconstructionVersion` を保持し、古い記録も当時のバージョンで描画できるようにする。

---

## 3. 代替案との比較

### 3.1 候補一覧

| 案 | キャプチャ | 復元 | レンダリング | 共有 |
|---|---|---|---|---|
| **A-1（推奨）** | iOS | iOS | Web / R3F | Web |
| B | Web / PWA | Web | Web / R3F | Web |
| C | iOS | iOS | iOS | iOS（＋Web 必須） |
| D | iOS | **サーバー** | Web / R3F | Web |

### 3.2 評価表

| 評価軸 | A-1 | B | C | D |
|---|:---:|:---:|:---:|:---:|
| #407「インストール不要の共有」を満たす | ◎ | ◎ | **✕** | ◎ |
| キャプチャ品質（multi-view・ブレ・角度制御） | ◎ | △ | ◎ | ◎ |
| 既存 iOS 投資（#388/#389/#391/#394）の保全 | ◎ | **✕** | ◎ | ◎ |
| 既存 Web 投資（CRUD/共有/認証）の保全 | ◎ | ◎ | ✕ | ◎ |
| 実装箇所の単一性（ドリフト耐性） | △ | **◎** | ◎ | ◎ |
| 生フレームが端末外に出ない | **◎** | ◎ | ◎ | **✕** |
| 生成 AI / サーバー非依存 | ◎ | ◎ | ◎ | **✕** |
| 1 scan あたりコスト | 0 円 | 0 円 | 0 円 | **課金** |
| 配布コスト（App Store） | △ | **◎** | △ | △ |
| 3D 作成が全ユーザーに開かれている | △ | **◎** | △ | △ |
| 復元ロジック修正の機敏性 | △ | ◎ | △ | **◎** |

### 3.3 各案の判定

#### 案 B（Web / PWA 単独）— 保険として維持

**最も単純で一貫している。** 1 言語・1 コードベース・契約ドリフトなし・App Store 不要・3D が全ユーザーに開かれ、PWA-first 方針とも完全に整合。

しかし致命的な弱点が 2 つ:

1. **最も難しい部分（キャプチャ）を最も弱いプラットフォームに賭ける。** iOS Safari の `getUserMedia` は連続フレーム取得・露出/フォーカス固定の制御が限定的で、バックグラウンド throttling もある。multi-view の「角度別ベストフレーム」(#390) をブラウザで安定して取るのは native より明確に難しい。
2. **完了済みの #388 / #389 を捨てる。** 推定器を TypeScript で再実装し、#391 の実写較正もやり直しになる。

→ **iOS 配布が承認されない場合のフォールバックとして文書化して残す。** その場合は品質目標を下げ、L1（2.5D・単写真由来）を主軸にするのが現実的。

#### 案 C（iOS 単独）— 却下

**#407 の「インストール不要の共有」というハード要件を満たせない。** 共有のために結局 Web レンダラーが必要になり、それを作った時点で案 A と同じ構成＋iOS レンダラーの重複になる。加えて本番相当まで作り込まれた既存 Web アプリ（CRUD / 共有 / エクスポート / Privacy / Terms）を捨てることになる。

→ **要件により却下。**

#### 案 D（サーバー復元）— MVP 非採用 / 将来のオプトイン経路として保留

幾何ロジックを 1 箇所に置けてクライアント更新なしに改善できる利点は大きいが:

- 生フレームが端末外に出る（`NAIL_HAND_DETECTION_PIPELINE.md` の原則違反）
- 1 scan あたりの課金が発生（「生成 AI API への常時依存を避けたい」という要望に反する）
- 新規バックエンド（Cloud Run / Functions）＝ 新しい Human Gate とコスト

→ **MVP では非採用。** ただしフォトグラメトリ / Gaussian Splatting による高精細オプトイン経路（前回レビュー 3.6 節）を将来やるなら、その経路だけ案 D 構成になる。**契約（HandProfile / NailSet）が同じなら、オプトイン経路を後から案 D で足せる。** 案 A-1 はこの拡張を閉じない。

### 3.4 推奨

> **案 A-1 を採用する。** iOS = Capture + Reconstruction、Web / R3F = Render / Archive / Compare / Share、共通データ = 派生パラメータ + テクスチャ。
> 案 B を「iOS 配布が承認されない場合のフォールバック」として文書化して維持する。
> 案 D は将来の高精細オプトイン経路として契約レベルで余地を残す。

採用の条件（いずれも未了）:

1. **iOS 配布の受け入れ（G1）** — `IOS_RELEASE_PATH_DECISION.md` の部分見直し
2. **契約の正をこのリポジトリに置く運用の合意** — iOS 側が CI 範囲外である以上必須
3. **Web の forward compatibility（未知 `contractVersion` → L0 フォールバック）を契約に明記**

---

## 4. 共通データ契約（設計案 / G3・G4 承認後に実装）

### 4.1 オブジェクト

```text
HandProfile                users/{uid}/handProfiles/{handedness}
├── contractVersion: number
├── handedness: "left" | "right"
├── boneLengths[] / fingerRadii[]        … MediaPipe/Vision landmarks の統計から
├── canonicalPose                        … 正規化ポーズ（撮影時ポーズは再現しない）
├── nailSockets[5]                       ← 設計の核
│   ├── finger: thumb|index|middle|ring|pinky
│   ├── origin / normal / tangent        … 爪床の座標系
│   ├── bedWidth / bedLength             … 爪床の実寸（爪の長さは含まない）
│   └── confidence
├── meshRef                              … Storage の GLB（任意）
├── source: { deviceClass, capturedAt, sampleCount }
└── updatedAt

NailSet                    users/{uid}/nailItems/{itemId}/nail3d/current
├── contractVersion / reconstructionVersion
├── handedness / handProfileRef
├── nails[5]
│   ├── socketRef
│   ├── shape / curveV / curveH / length / thickness   ← #389 推定器の出力
│   ├── textureRef                                      … 爪テクスチャ
│   ├── heightMapRef                                    … L1/2.5D 表現（任意）
│   └── confidence
├── quality: { overall, perNail[] }
└── status: "complete" | "partial"        ← 失敗は status ではなく「ドキュメント不在」で表す

3D Asset（Storage）
├── users/{uid}/handProfiles/{handedness}/mesh.glb          … private
├── users/{uid}/nailItems/{itemId}/nail3d/nail_{finger}.webp … 爪テクスチャ
└── publicAssets/{shareId}/...                              … 共有スコープの複製
```

### 4.2 契約ルール

| # | ルール | 目的 |
|---|---|---|
| C1 | 全オブジェクトに `contractVersion` を必須化 | 2 クライアントの独立リリース |
| C2 | **additive-only。** 削除・意味変更は新バージョン | 旧クライアントを壊さない |
| C3 | **Web は未知 `contractVersion` を「3D なし」として扱う**（L0 フォールバック） | iOS 先行リリースで Web が壊れない |
| C4 | 契約仕様と JSON fixtures の正は**このリポジトリ** | iOS が CI 範囲外のため |
| C5 | **計測値（measurement）を NailSet に混ぜない。** 別ドキュメントに置く | ↓ |
| C6 | 失敗状態を `NailItem` 本体に書かない（P3） | ↓ |

#### C5 を構造ルールにする理由

計測値を NailSet と同じドキュメントに置くと、共有スナップショット生成時に**フィールド単位のフィルタリングが必要**になり、1 箇所の実装ミスで #407 の「本人専用の計測値・解析値を公開モデルに混ぜない」が破られる。

別ドキュメントに分ければ、**共有経路はそのドキュメントを読まない**だけでよい。既存の `publicShares` が `memo` / `imageUrl` を「アプリで除外」している方式（`firestore.rules` のコメント `memo / imageUrl are NOT stored in publicShares (enforced by app)`）より構造的に安全で、同じ思想の延長にある。

### 4.3 プラットフォーム能力マトリクス

| 機能 | iOS | Web / PWA（キャプチャ非対応端末） |
|---|:---:|:---:|
| L0 写真記録の作成・編集・削除 | ✅ | ✅ |
| L0 検索 / ソート / エクスポート | ✅ | ✅ |
| HandProfile の作成・更新 | ✅ | ✖ |
| NailSet の生成（スキャン） | ✅ | ✖ |
| **3D の閲覧・回転・ズーム** | ✅ | **✅** |
| **3D 時系列比較** | ✅ | **✅** |
| **360°共有の閲覧（未ログイン）** | ✅ | **✅** |
| 共有リンクの作成 | ✅ | ✅（3D は 3D がある記録のみ） |

**非対称は「作成」のみ。「閲覧・比較・共有」は全端末で成立する。** Nailous の本質 3 つのうち「振り返る」「見せる」は全ユーザーに開かれており、制約は「残す」の高度版だけに限定される。これが案 A の非対称が許容範囲に収まる理由。

---

## 5. 補足の設計判断

### 5.1 共有時の Hand Base

前回レビュー #D の論点。推奨:

| | 共有される | 既定 |
|---|---|---|
| **Nail Set（実物の爪）** | する | — |
| **Personal Hand Profile（本人の手形状）** | **既定では共有しない。generic hand に差し替え** | オプトイン |

理由: 手形状は個人を識別しうる特徴に近く、`NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md` の非目標「No biometric inference」に触れる。一方「見せたい対象」は**ネイルであって手ではない**。generic hand + 実物 Nail Set なら、見せる楽しさを損なわずプライバシーリスクを下げられる。

### 5.2 L1（2.5D）を Web 側の将来拡張余地として残す

L1（単写真 + 爪領域 → height / normal map）は HandProfile を必要としないため、**MediaPipe Web だけで実現可能**。将来「Web ユーザーも 3D を作れるようにしたい」となった場合、L2/L3 の完全実装を待たずに L1 だけを Web に開ける。

→ 契約で L1 を L2/L3 から独立させておく（`heightMapRef` を NailSet とは別に単独で持てる形にする）。案 A の二層化リスクに対する将来の緩和手段。

### 5.3 PR 粒度との整合

前回レビュー #J のとおり `App.tsx` は 2,430 行、PR 規約は 150 行以内。本構成では Web 側の追加は以下に限定されるため、規約内に収まる見込み:

```text
src/features/nail3d/          … R3F レンダラー・契約パーサ（新規・独立）
src/lib/featureFlags.ts       … isNail3DEnabled 追加（1 行）
src/App.tsx                   … lazy mount（数行）
```

契約パーサと R3F レンダラーが `App.tsx` の外にあるため、PoC 各段を独立 PR にできる。

---

## 6. Human 判断の状況

| # | 判断事項 | 状態 |
|---|---|---|
| 1 | iOS 配布（App Store）を受け入れるか | **承認済み（G1, 2026-10-06）** |
| 2 | 復元処理を iOS に置く（A-1） | **承認済み** |
| 3 | 契約の正をこのリポジトリに置く運用 | **承認済み** → [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md) |
| 4 | GLB を永続データの正にしない（CND を正とする） | **承認済み**（本書 3.3 で案 D 向けに想定していた以上の制約。MVP では GLB を生成しない） |
| 5 | 共有時に personal hand を既定で含めないこと（5.1） | **未決（G6）** → 再編案 N15 |
| 6 | 画像を含む共有をするか（現状 `publicShares` は imageUrl を除外） | **未決（G6）** → #407 の依存 |

`IOS_RELEASE_PATH_DECISION.md` の PWA-first 方針は、**Nail Scan / 3D 生成に限りネイティブ iOS を併用する**
形で部分的に見直された。写真記録（L0）は引き続き Web / PWA で完全に成立する。

---

## 7. 参照

| ドキュメント | 関連 |
|---|---|
| [NAIL_3D_SCAN_DIRECTION_REVIEW.md](./NAIL_3D_SCAN_DIRECTION_REVIEW.md) | 方向性レビュー（本書の前提） |
| [IOS_RELEASE_PATH_DECISION.md](./IOS_RELEASE_PATH_DECISION.md) | PWA-first 推奨（判断 1 で部分見直し） |
| [NAIL_HAND_DETECTION_PIPELINE.md](./NAIL_HAND_DETECTION_PIPELINE.md) | 「Images never leave the device」原則（A-2 却下根拠） |
| [NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md](./NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md) | 非目標「No biometric inference」（5.1 根拠） |
| [FIRESTORE_3D_SCHEMA_DESIGN.md](./FIRESTORE_3D_SCHEMA_DESIGN.md) | optional / マイグレーション不要原則（要実態同期） |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | Product Vision（要実態同期） |
| `src/lib/firestoreModel.ts` | optional-additive パターンの既存実装 |
| #388 / #389 / #390 / #391 / #394 | iOS Scan Engine 側の資産 |
| #404 / #405 / #406 / #407 | 3D Epic / スパイク / History / Share |
