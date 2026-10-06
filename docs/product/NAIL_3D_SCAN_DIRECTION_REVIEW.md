# Nail 3D Scan 方向性レビュー: Personal Hand Base + Replaceable Nail Set

> **Status: 設計レビュー（docs-only / 実装なし）**
> 対象: Issue #390〜#394 / #404〜#407、および `docs/product/` の 3D 関連設計ドキュメント
> 作成日: 2026-10-06
> 目的: オーナー提案（動画 Nail Scan → 爪単体 / 指＋爪 / 手全体 3D → 3D 振り返り → 360°共有、ただし「毎回手全体を再構築」ではなく **Personal Hand Base + Replaceable Nail Set**）の妥当性を評価し、現行設計との矛盾・現実的な技術構成・最小 PoC・Issue 修正案を整理する。
>
> 本ドキュメントはコード・スキーマ・Rules・依存関係を一切変更しない。Human Gate 該当事項は各節に明記する。

---

## 0. 結論サマリ

| 問い | 結論 |
|---|---|
| 1. 方向性の妥当性 | **妥当。** ただし「爪 socket（爪床の座標系）を Hand Base 側に固定する」という設計の核が Issue に未記載。ここが成否を決める |
| 2. 現行設計との矛盾 | **10 件検出。** うち #A（プラットフォーム分裂）と #H（Phase 8 の目的が逆）は G1 判断が必要なブロッカー<br>→ #A は [NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) で比較・推奨案を提示済み |
| 3. 現実的な技術構成 | MediaPipe Hand Landmarker + **パラメトリック幾何 + テクスチャ投影** + R3F。NeRF / Gaussian Splatting はデフォルト経路から除外し、オプトイン隔離 |
| 4. 最小 PoC | **「同じ指の socket に、別の日の爪を差し替えて見比べる」**（PoC-3）が本命。手全体・10 本・両手は PoC 範囲外 |
| 5. Issue 対応 | 既存 7 件に修正提案、新規 14 件を提案。最優先は「プラットフォーム決定」と「Phase 8 再定義」 |

**最重要の指摘:** Nailous の本質は「気軽に残す → 見返す → 見せる」である。3D が最も価値を出すのは **見せる（360°共有）** と **並べて振り返る** の 2 工程で、**最も価値を出さないのは「残す」工程**（スキャンが重い・失敗する＝記録の摩擦が増える）。したがって技術選定の最上位制約は精度ではなく **「記録フローを現状より重くしないこと」** である。この観点から、処理時間とコストを持ち込む生成系 3D（NeRF / GS）をデフォルト経路に置かない判断は正しい。

---

## 1. この方向性の妥当性

### 1.1 評価: 妥当

「毎回手全体を再構築しない」という判断は、以下の 4 点で正しい。

#### (1) 変化速度の非対称性が構造と一致している

| 対象 | 変化速度 | 再構築すべきか |
|---|---|---|
| 手・指の骨格形状 | 年単位でほぼ不変 | 一度作って再利用（Hand Base） |
| 爪の形・長さ・反り | 3〜4 週で変わる | 毎回（Nail Set） |
| 爪の色・アート・光沢 | 毎回変わる | 毎回（Nail Set テクスチャ） |

再構築コストを「変化する部分」にだけ払う構成は、データ量・処理時間・失敗率のすべてで有利。

#### (2) 保存コストの定量差

概算（1 ユーザー / 月 1 回記録 / 片手）:

| 方式 | 1 記録あたり | 年間（12 記録） |
|---|---:|---:|
| 毎回手全体メッシュ + テクスチャを保存 | 2〜5 MB | 24〜60 MB |
| Hand Base 1 回 + Nail Set のみ保存 | 約 300 KB<br>(params 数 KB + テクスチャ 5 枚 × 約 60 KB) | 約 4 MB + Base 1〜3 MB |

**約 1/10。** Firebase Storage の転送・保存コストと、モバイル回線での共有体験に直接効く。これが「毎回再構築しない」判断の定量的根拠。

#### (3) 「振り返り比較」の体験品質がむしろ向上する

毎回手全体を再構築すると、記録ごとに手の形・ポーズ・スケールが微妙に揺れる。並べて比較したときに **「ネイルの違い」ではなく「手の揺れ」が目立つ** ため、#406 が狙う時系列比較の体験が壊れる。Hand Base を固定すれば「同じ自分の手に、違うネイル」という比較軸が成立する。

これは精度の問題ではなく **体験設計の問題** であり、Nailous の本質（振り返る楽しさ）に直結する。固定ベースは手抜きではなく、正しい設計判断である。

#### (4) フォールバックが階層化できる

Hand Base が永続すれば、スキャン失敗時に「写真にフォールバック」の一段上に **「Base + 推定パラメータのみの簡易 Nail Set」** という中間フォールバックを置ける。#404 の成功条件 4「3D 失敗時も写真記録へフォールバック」を、より緩やかに実現できる。

### 1.2 ただし、設計の核が Issue に未記載

**Hand Base = 手の形状メッシュ + 10 個の Nail Socket 定義** であることが、#404〜#407 のどこにも書かれていない。

爪だけを差し替えて自然に見えるには、爪が生える場所の座標系が記録間で安定している必要がある。そのため Hand Base は単なるメッシュではなく、以下を持つ必要がある。

```text
HandBase (handedness ごとに 1 つ)
├── canonical mesh      … 正規化ポーズの手メッシュ
└── nailSockets[5]      … 指ごとの爪床アタッチメント
    ├── origin          … 爪床の基準点（キューティクル側中央）
    ├── normal          … 爪面の法線
    ├── tangent         … 指の長軸方向
    └── bedWidth/Length … 爪床の実寸スケール
```

Nail Set は「socket から生えるジオメトリ」として定義される。この socket が安定しているかどうかが、この方向性全体の成否を決める **唯一の最大リスク** であり、PoC の第一目標にすべき（→ 第 4 節）。

### 1.3 前提として整理すべき 3 点

#### (a) ポーズは正規化し、「撮影時のポーズ再現」は非目標にする

手は剛体ではない。記録ごとに指の曲げが違う。Hand Base は **canonical pose（正規化ポーズ）** で保持し、表示も正規化ポーズ固定にするのが現実的。MediaPipe の 21 landmarks があればポーズ正規化（骨長による正規化・手首基準の座標変換）は可能。

「スキャン時のポーズをそのまま 3D で再現する」は、価値が低い（振り返りに不要）割にコストと失敗率が高いので、明示的に非目標にすべき。

#### (b) 爪の「長さ」は Hand Base ではなく Nail Set の属性

スカルプ・チップで爪は伸びる。爪床（socket）は不変だが、爪そのものの長さ・反りは毎回変わる。したがって:

- `bedWidth / bedLength`（爪床の実寸）→ **Hand Base**
- `length / curveV / curveH / thickness / shape`（爪の形状）→ **Nail Set**

#### (c) 既存の推定器投資がそのまま Nail Set のパラメータになる（強い整合点）

#389（完了）の `shape / curveV / curveH / thickness` 推定、#391 の実写較正、#394 の片手 5 本分離は、**そのまま Nail Set のパラメータ推定** として再利用できる。これはこの方向性の大きな追い風であり、「パラメトリック Nail Set」を第 1 候補とすべき根拠でもある。

ただしこれらは現状 iOS native 側の実装であり、プラットフォームを跨ぐと再利用できない（→ 第 2 節 #A）。

### 1.4 本質維持のための絶対条件

| 条件 | 理由 |
|---|---|
| 動画スキャンを記録の**必須要件にしない** | 記録の摩擦が増えると「気軽に残す」が壊れる。写真 1 枚でもパラメトリック Nail Set は生成できる |
| 3D 生成はバックグラウンド / 事後でよい | 保存ボタンを 3D 処理でブロックしない |
| フォールバックを 3 層で定義する | 3D → 2.5D（height/normal map）→ 写真 |
| フォトリアルを狙わない | 「自分の手に見える」で十分。stylized は既存の「静かなラグジュアリー」トーン（#375 / JEWELRY_BOX_REFRESH）とむしろ整合する |

---

## 2. 現行設計との矛盾

検出した 10 件。重大度順。

### #A【重大 / G1】プラットフォーム分裂 — 最大のブロッカー

Issue 群が 2 つの異なるプラットフォームを前提にしている。

| Issue | 前提プラットフォーム | 根拠（Issue 本文の記載） |
|---|---|---|
| #390 | **iOS native** | `AVCaptureMovieFileOutput`, `AVAssetImageGenerator`, `VNDetectHumanHandPoseRequest` |
| #391 | **iOS native** | `ios/BenchmarkAssets/angles/real/`, `scripts/bench-angles.sh`, `NailShapeEstimator` |
| #394 | **iOS native** | `NailAngleMeasurer`, `AutoScanEstimator.estimateHand`, `ios/BenchmarkAssets/angles` |
| #404〜#407 | **Web** | Firestore, `/share/:id`, GLB / model-viewer / Three.js, インストール不要の共有 |

**このリポジトリに iOS 実装は 1 ファイルも存在しない。** 以下はすべて grep 0 件:

```text
ios/Bench* / bench-angles* / NailGeometry / NailAngleMeasurer /
AutoScanEstimator / AVCapture / VNDetectHumanHandPose
```

`src/` は React + Firebase の Web 実装のみ（24 ファイル）。`package.json` に `three` も `@mediapipe/*` も無い。

**矛盾の実体:** #405 は「#390 の角度別ベストフレームを入力候補」「#391 / #394 の multi-view / カーブ推定を再利用」と書いているが、それらの成果物は Swift / Vision 側にあり、**Web 側（MediaPipe / Three.js / R3F）からは再利用できない**。つまり「既存投資を活かす」という #405 の前提が、プラットフォームを跨いだ瞬間に成立しない。

**選択肢:**

| 案 | 内容 | 評価 |
|---|---|---|
| (i) Web / PWA 中心 | 3D は Web。iOS はキャプチャ専用。推定ロジックは Web 側に再実装 | 共有が必須なので Web は不可避。`IOS_RELEASE_PATH_DECISION.md`（PWA-first 推奨）と整合 |
| (ii) iOS native 中心 | 3D も iOS。共有だけ Web | 推定器を再利用できるが、共有用に結局 Web 3D が必要。二重実装 |
| (iii) 共通中間表現 | ScanSession（プラットフォーム非依存 JSON）を定義し、推定はどちらでも実装可能に | 分裂を構造的に吸収できる |

**推奨: (iii) + (i)。** ScanSession を境界に定め、表示・共有は Web/R3F に一本化する。360°共有は「インストール不要」が要件（#407）なので Web 実装は回避不可能であり、そこに寄せるのが最も無駄が少ない。

→ **新規 Issue 1（decision）として最優先で G1 判断を仰ぐこと。これが決まらないと #405 のスパイクは設計できない。**

### #B【重大 / G1】Phase 8 の目的がユーザー要望と逆向き

| | ROADMAP Phase 8 | オーナー要望 |
|---|---|---|
| 目的 | **架空のネイルチップ**をプリセットから選んでプレビュー | **実物の自分のネイル**を残して振り返る |
| Done Criteria | 「プリセット（形状 / カラー / テクスチャ）が UI で選択できる」 | プリセット選択は不要 |
| データ | プロダクト所有の静的 GLB（`shapes/almond_v1`） | ユーザー固有の復元データ |

`ROADMAP.md` Phase 8 は「3D Preview / Modeling Foundation = プリセット試着」として設計されている。実物復元はこの延長線上に無く、**目的が逆**（カタログを見る体験 vs 自分の記録を残す体験）。

また `3D_LIBRARY_EVALUATION.md` の R3F 推奨理由は「プリセットのカラー・テクスチャを動的にカスタマイズするため」だが、実物復元なら根拠が変わる（必要なのはテクスチャ投影とカスタムシェーダ）。**結論（R3F 採用）は変わらないが、理由を更新すべき。**

→ Phase 8 を「Preset Preview」から「**Personal Nail Capture & Replay**」へ再定義する G1 判断が必要（新規 Issue 12）。

### #C【重大 / G3】ユーザー所有 3D アセットというカテゴリが既存設計に存在しない

`3D_ASSET_DELIVERY_STRATEGY.md`:
> "base 3D assets are **public, static product assets**, while user nail photos remain private"

`FIRESTORE_3D_SCHEMA_DESIGN.md`:
> "`modelId` should be **preferred over** `modelUrl` for app-owned assets"（例: `shapes/almond_v1`）

既存設計のアセット分類は 2 つしかない。

1. **公開・静的・プロダクト所有**の 3D プリセット
2. **非公開・ユーザー所有**の写真

**Personal Hand Base は第 3 のカテゴリ** —「非公開・ユーザー所有・長命・写真ではない 3D データ」。これが既存設計に存在しない。

付随する不足:

- `storage.rules` は `users/{userId}/nailItems/{nailItemId}/{filename}` のみ許可、他は default deny。`users/{uid}/handBases/...` は新規パス追加 → **G4 / G6**
- `storage.rules` の `contentType.matches('image/(jpeg|png|webp)')` 制約は GLB を通さない → ルール設計が必要
- `3D_ASSET_DELIVERY_STRATEGY.md` のサイズ目標（single nail GLB ≤ 1MB）はプリセット前提。ユーザー固有 Hand Base + 10 Nail Set の目標値が未定義
- `FIRESTORE_3D_SCHEMA_DESIGN.md` の提案フィールドは「プリセット ID 参照」モデルであり、ユーザー固有復元データを表現できない

### #D【重大 / G6】手形状データのプライバシー区分が未整理

`NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md` の Non-Goals に明記:
> "No automatic **biometric** or identity inference."

**Personal Hand Base は「ユーザー固有の手の 3D 形状を永続保存する」** ものであり、この非目標に触れる可能性がある。手の形状は個人を識別しうる特徴に近い。

整理すべき論点（AI が単独で決めてはいけない、G6）:

- 「本人の記録目的で、本人のみが閲覧する手形状モデル」は identity inference に当たらない、という立場を取るか
- `PRIVACY_POLICY_DRAFT.md` に「手形状モデル」のデータカテゴリを追加するか
- 共有時に Hand Base を公開するか、**generic hand に差し替える選択肢**をユーザーに与えるか

後者は #407 の要件「本人専用の計測値・解析値を公開モデルに混ぜない」の自然な拡張であり、**共有は generic hand + 実物 Nail Set をデフォルト**にすると、プライバシーと「見せる楽しさ」を両立できる（personal hand 共有はオプトイン）。

→ 新規 Issue 5 として G6 に上げる。

### #E【重大】共有の現状と #407 の間に 2 段の飛躍がある

現状の共有実装を確認した結果:

`src/lib/publicShares.ts`:
```ts
// Snapshot of a single NailItem stored in publicShares.
// memo and imageUrl are intentionally excluded.
export interface PublicShareItemSnapshot {
  id: string; title: string; tags: string[]; createdAt: Timestamp | null
}
```

`firestore.rules`:
> `memo / imageUrl are NOT stored in publicShares (enforced by app).`

`storage.rules`: 公開読み出しパスは存在しない（owner-only のみ）。

**つまり現状の共有リンクは、画像すら表示していない。** タイトル・タグ・日付のテキストのみ。

#407 の「360°で 3D を回して見せる」は、**「画像を公開する」という未了の判断を飛ばして「3D アセットを公開する」に進もうとしている**。前提として「画像を含む共有をするか」の G6 判断が必要であり、これは #407 に依存として書かれていない。

**ただし技術面は解決可能 — 以下は良いニュース。**

#### #407 の最難関要件「共有停止で 3D アセットも即アクセス不可」は Cloud Function 不要で達成できる

Cloud Storage for Firebase の **Cross-service Rules**（`firestore.get` / `firestore.exists`）により、Storage Rules から Firestore を参照できる。したがって:

```javascript
// 設計案（未実装 / G4・G6 承認後）
match /publicAssets/{shareId}/{allPaths=**} {
  allow read: if firestore.get(
    /databases/(default)/documents/publicShares/$(shareId)
  ).data.isEnabled == true;
}
```

共有停止（`isEnabled: false`）がそのままアセットアクセス拒否に反映される。既存の revoke フロー（`disablePublicShare`）をそのまま流用でき、バックエンド追加（＝コスト・新しい Gate）が不要。

**ただし決定的な落とし穴:**

> **`getDownloadURL()` が返すトークン付き URL を共有に使ってはいけない。** トークン URL は Security Rules を**バイパス**するため、`isEnabled: false` にしても閲覧が止まらない。共有ページは Firebase SDK 経由（Rules 評価を通す）でアセットを取得する必要がある。

これは #407 の Done「共有停止が asset access にも反映」を満たすか否かを左右する実装上の要点なので、Issue に明記すべき（新規 Issue 10）。

留意事項: Cross-service Rules は Firestore の読み取り課金が発生し、レイテンシも増える。アセット数が多い共有ページでは、`shareId` 単位で 1 回評価されるよう パス設計する（上記案は `{shareId}/{allPaths=**}` でその形）。

### #F【中】記録単位「片手」と「手全体モデル」の衝突 — ただし解決可能

#392:
> "2026-09-15 の決定で記録の単位は「片手」になった（右手・左手は別記録）"

オーナー要望は「ユーザー固有の手全体モデル＋10 本の実ネイル」。Hand Base を「両手で 1 つ」にすると片手記録と衝突する。

**解決案（#392 の受け入れ基準と完全に整合）:**

| 要素 | 単位 | 根拠 |
|---|---|---|
| Hand Base | **handedness ごとに 1 つ**（left / right 各 1） | 手の形状は左右で違う。記録単位とは独立したユーザー資産 |
| Nail Set | **片手 5 本 = 1 記録**（既存の記録単位と一致） | 記録構造を変えない |
| 10 本表示 | **Nail Set 2 つを 1 シーンに合成** | #392 のペアリング（リンク情報）で実現 |

#392 の受け入れ基準「片手の記録構造を変えずに実現する（ペアはリンク情報として持つ）」をそのまま満たす。**つまりこの矛盾は、Hand Base の単位を handedness にすることで消える。**

### #G【中】Human Gate 番号の定義が分散している

#404 は `G1 / G2 / G3 / G6 / G8 / G16 / G17` を参照しているが、**`docs/harness/HUMAN_GATES.md` は G15 までしか定義していない。**

G16 / G17 は以下にのみ存在:

- `docs/product/ROADMAP.md:334` — G16: 3D アセット追加（ライセンス・サイズ確認）
- `docs/product/ROADMAP.md:369` — G17: AR / カメラアクセスのユーザー同意フロー設計
- `docs/product/ACCEPTANCE_CRITERIA.md:121,126,159,165`

Gate 定義の正が 2 箇所に分かれており、AI エージェントが `HUMAN_GATES.md` だけを読むと G16 / G17 を認識できない。運用上の実害がある。

→ `HUMAN_GATES.md` に G16 / G17 を追記し、単一の正とする（新規 Issue 2 / 低コスト・高効果）。

### #H【中】#390 が存在しないドキュメントを参照している

#390 本文:
> "`docs/product/nailous-scan-roadmap.md` Phase 3"

**このファイルは存在しない**（grep 0 件）。Scan ロードマップの Phase 1 / 2 / 3 という区分の出典が追えず、#390 / #391 / #394 / #405 の「Phase」という語が `ROADMAP.md` の Phase 8 / 9 と混同される。

→ 復元するか、`ROADMAP.md` への参照に修正し、Scan Phase と Product Phase の用語を分離する。

### #I【中 / G8・G9】依存追加とバンドルサイズ

`package.json` に 3D / CV 関連依存はゼロ。必要になるのは:

```text
three, @react-three/fiber, @react-three/drei, @mediapipe/tasks-vision
```

これは **G8（依存追加）+ G9（package.json 変更）** であり、`AGENTS.md` の Jules 禁止操作「package.json の依存関係追加（要 human 承認）」にも該当。

既存方針との整合は取れている（追い風）:

- `NAIL_HAND_DETECTION_PIPELINE.md` が既に MediaPipe Tasks Vision (Web) をクライアント処理で推奨済み
- 同ドキュメントが「dynamic `import()` で code-split」「WASM は CDN か `public/`」を指定済み
- `CODE_SPLITTING_STRATEGY.md` / `BUNDLE_SIZE_WARNING_ACCEPTANCE.md` が既にバンドル警告を扱っている

→ 3D / CV は必ず dynamic import で分離し、初期バンドルに載せない。既存方針にそのまま乗る。

### #J【中 / G12】App.tsx の規模と PR 規約の衝突

```text
src/App.tsx   2,430 行
src/App.css   6,235 行
```

`AGENTS.md` の PR ルールは **「diff 150 行以内」**。3D 機能を `App.tsx` / `App.css` に直接足すと、1 PR で収まらず規約と衝突する。

→ 3D 機能は `src/features/nail3d/` 等に分離し、`App.tsx` への変更は数行の lazy mount に留める設計を**実装開始前に**決めておく必要がある（新規 Issue 13）。これは実務上かなり重要で、放置すると PoC の段階で PR が規約違反になる。

---

## 3. 現実的な技術構成

`#404` の原則「Measurement Layer と Memory/Presentation Layer を分離」を踏襲し、3 層 + 保存層で構成する。

```text
┌─ Capture 層 ─────────────────────────────────────────┐
│ iOS native: AVCapture 動画 → フレーム抽出 (#390)      │
│ Web/PWA:    getUserMedia + requestVideoFrameCallback  │
│                      ↓                                │
│         【ScanSession】 ← プラットフォーム非依存の境界 │
└───────────────────────────────────────────────────────┘
┌─ Geometry 層（生成AI 非依存・オンデバイス）───────────┐
│ MediaPipe Hand Landmarker (21 landmarks)              │
│   → ポーズ正規化 → Hand Base フィット + Nail Socket   │
│   → Nail Set パラメータ推定（既存 #389 の推定器相当）  │
│   → 爪テクスチャの socket 座標系への投影              │
└───────────────────────────────────────────────────────┘
┌─ Presentation 層 ─────────────────────────────────────┐
│ React Three Fiber: Hand Base + Nail Set をランタイム合成│
│   詳細画面 / 時系列比較 / 360°共有ページ               │
└───────────────────────────────────────────────────────┘
```

### 3.1 ScanSession — プラットフォーム非依存の中間表現（#A を吸収する鍵）

```text
ScanSession
├── handedness: "left" | "right"
├── frames[]: { jpeg, angleLabel: top|side|reverse|fist, blurScore, nailArea }
├── landmarks[]: 21 点 × frame（MediaPipe / Vision いずれでも出力可）
├── nailQuads[]: 指ごとの爪領域 4 点（mask 由来）
└── captureMeta: { timestamp, deviceClass }  ※ EXIF / 位置情報は保持しない
```

これを境界に定めれば、キャプチャが iOS native でも Web でも、下流（Geometry / Presentation）を 1 本化できる。`IOS_CAPTURE_REQUIREMENTS.md` の「EXIF, location, device identifiers を保存しない」方針をそのまま継承する。

### 3.2 Hand Base の作り方 — 方式比較

| 方式 | 品質 | ライセンス | 実装コスト | 評価 |
|---|---|---|---|---|
| **(i) 自前の簡易リグ**<br>一般化した手メッシュを骨長・指半径でスケール | 中（stylized） | 安全（自作） | 中 | **推奨** |
| (ii) MANO 等の統計的手モデル | 高 | **研究用途限定。商用利用は不可 / 要交渉** | 中 | **商用 MVP では採用不可** |
| (iii) フォトグラメトリで実測メッシュ | 高 | 安全 | 高（処理時間・失敗率） | オプトイン将来機能 |
| (iv) NeRF / Gaussian Splatting | 最高 | 安全 | 最高（GPU サーバー必須） | デフォルト経路から除外 |

**(ii) の落とし穴は明記する価値がある:** MANO をはじめとする統計的手モデルの多くは研究用途ライセンスで、商用プロダクトに組み込めない。「手モデルは既存のものを使えばよい」という安易な前提は商用 MVP では成立しない。

→ **推奨 (i)**: MediaPipe の landmarks（複数フレーム・複数セッションの中央値）から骨長を測り、一般化メッシュをスケールする。フォトリアルではないが「自分の手に見える」。stylized であることは、既存の「静かなラグジュアリー」トーン（#375 / `JEWELRY_BOX_REFRESH.md`）と整合するため、**品質上の妥協ではなくプロダクト一貫性のある選択**として扱える。

### 3.3 Nail Set の作り方 — パラメトリック + テクスチャ投影を第 1 候補に

```text
NailSet (片手 5 本)
└── nails[5]
    ├── socketRef: thumb | index | middle | ring | pinky
    ├── shape: round | square | almond | coffin | stiletto   ← #389 推定器
    ├── curveV, curveH, length, thickness                     ← #389 推定器
    └── texture: 実写の爪領域を socket 座標系へ正射影した画像
        └── (任意) heightMap / normalMap  ← 2.5D 表現はここに収まる
```

重要な点:

- **#405 の比較対象リストにある「hand landmark + parametric geometry + nail texture/geometry のハイブリッド」が、まさにこれ。** #405 では 4 方式の 1 つとして並列に置かれているが、既存投資（#389 の推定器）が直接使え、生成 AI 非依存・オンデバイス・低コストという条件をすべて満たす唯一の方式なので、**第 1 候補として最初に検証すべき**（並列比較ではなく優先検証）。
- 2.5D depth/height 表現は別方式ではなく、この枠内の `heightMap` として吸収できる。方式が 1 つ減る。
- GLB 変換は `GLTFExporter` で可能（`3D_ASSET_DELIVERY_STRATEGY.md` の GLB 方針と整合）。ただし共有は後述のとおりパラメータ + テクスチャ配信のほうが軽い。

### 3.4 Presentation — R3F を採用（model-viewer は不採用）

`3D_LIBRARY_EVALUATION.md` の結論（R3F 推奨）は**維持。ただし理由を更新**:

| | 旧理由（プリセット前提） | 新理由（実物復元前提） |
|---|---|---|
| R3F が必要な理由 | プリセットの色・テクスチャを動的変更 | **Hand Base + Nail Set のランタイム合成**、テクスチャ投影、光沢・ラメのカスタムシェーダ |

`<model-viewer>` は「完成した 1 つの GLB を表示する」ツールであり、2 つの独立アセットを実行時に合成する用途に向かない。→ **#407 の technical question「GLB/model-viewer vs Three.js/R3F」への回答は R3F。**

### 3.5 保存レイアウト（設計案 / G3・G4 承認後）

```text
Firestore
  users/{uid}/handBases/{handedness}      … mesh params + nailSockets（JSON、1MiB 未満に収まる）
  users/{uid}/nailItems/{itemId}
    └── nailSetRef / nailSet params        … 既存スキーマへの optional 追加
  publicShares/{shareId}
    └── nailSet snapshot（パラメータのみ） … 計測値・解析値は含めない

Storage
  users/{uid}/handBases/{handedness}/mesh.glb   … private（新規パス / G4・G6）
  users/{uid}/nailItems/{itemId}/nail_*.webp    … 爪テクスチャ
  publicAssets/{shareId}/...                     … 公開読み（Cross-service Rules で revoke 連動）
```

`FIRESTORE_3D_SCHEMA_DESIGN.md` の原則「すべて optional / バルクマイグレーション不要 / 3D フィールド不在時は既存 UI にフォールバック」はそのまま適用できる。

### 3.6 生成 AI 依存とコスト

| 経路 | 推論コスト | 処理時間 | 採用 |
|---|---|---|---|
| MediaPipe + 幾何処理（オンデバイス） | **0 円** | 数百 ms〜数秒 | **デフォルト** |
| フォトグラメトリ（サーバー） | GPU 時間課金 | 数十秒〜分 | オプトイン将来 |
| NeRF / Gaussian Splatting（サーバー） | GPU 時間課金（1 scan あたり円〜十数円規模） | 数十秒〜分 | **デフォルト経路から除外** |

デフォルト経路を完全オンデバイスにすることで、「生成 AI API への常時依存を避けたい」という要望を満たすだけでなく、`NAIL_HAND_DETECTION_PIPELINE.md` のクライアント処理原則（プライバシー・レイテンシ・コスト）と完全に一致する。**ここは現行設計と矛盾がなく、むしろ最も整合している部分。**

---

## 4. 最小 PoC

### 4.1 PoC の選定基準

最大の不確実性は **「爪だけ差し替えて、同じ自分の手に見えるか」= socket の安定性**（第 1.2 節）。精度ではなくこれを最初に潰す。

したがって最小 PoC は「手全体を作る」ではなく **「1 本の指の socket に、2 つの異なる日の爪を差し替えて見比べる」**。

### 4.2 段階

| # | 内容 | 検証する問い | Gate |
|---|---|---|---|
| **PoC-0** | R3F 土台: procedural な指 1 本 + 爪 1 本を回す。dynamic import、既存 CRUD 非干渉 | R3F がこのアプリに載るか / バンドル影響 | G8・G9 |
| **PoC-1** | 実写 1 枚 + MediaPipe landmarks → 爪 socket 推定 → パラメトリック爪を写真に重ねる | socket は実物の爪輪郭と合うか | — |
| **PoC-2** | 実写の爪領域を socket 座標系へ投影して爪曲面に貼る | 「自分のネイル」に見えるか | — |
| **PoC-3** | **同じ指の socket に別の日の Nail Set を差し替え、2 つ並べて回す** ← **本命** | 差し替えても同じ手に見えるか / 振り返りが楽しいか | — |
| **PoC-4** | ログアウト状態の静的ページで PoC-3 のモデルを 360°回す（revoke は未実装） | 共有体験が成立するか / iOS Safari 性能 | — |

### 4.3 Done 判定は体験で行う

#405 の評価指標（輪郭・長さ幅比・曲率・処理時間・コスト…）は実装方式の比較には必要だが、**PoC の Done 判定は主観評価を一次指標にすべき**:

- [ ] オーナーが「これは自分の過去のネイルだ」と分かる
- [ ] 爪を差し替えても「同じ自分の手」に見える
- [ ] 2 つを並べたときに「ネイルの違い」が目立つ（手の揺れが目立たない）
- [ ] モバイルで回転・拡大が快適（60fps / iOS Safari）

数値指標（±0.25 など）は #391 / #394 の推定器較正の話であり、PoC-3 の成否判定には使えない。**「振り返って楽しいか」が本質なので、そこを一次指標にする。**

### 4.4 PoC スコープ外（明示）

手全体 / 10 本 / 両手 / リアルタイム AR / NeRF・GS / iOS 統合 / 共有の revoke 実装 / Firestore スキーマ変更。

### 4.5 実装上の制約

各 PoC は `src/features/nail3d/` に分離し、1 PR あたり 150 行以内（`AGENTS.md`）に収める。`App.tsx` への変更は lazy mount の数行のみ。PoC 段階ではフィーチャーフラグ（`src/lib/featureFlags.ts` が既に存在）配下に置き、既存 CRUD / 共有に一切影響させない。

---

## 5. 既存 Issue の修正案・追加 Issue 案

> 以下は**提案**であり、Issue の作成・編集は未実施。

### 5.1 既存 Issue の修正案

| Issue | 修正提案 |
|---|---|
| **#404**（Epic） | ・前提条件として「プラットフォーム決定（#A）」を冒頭に追加<br>・Target Flow に **Hand Base / Nail Set の分離**と「毎回手全体を再構築しない」原則を明記<br>・Hand Base の定義に **nail socket** を含めることを明記（設計の核）<br>・非目標に「研究用途ライセンスの手モデル（MANO 等）の採用」「生成 AI をデフォルト経路に入れる」「撮影時ポーズの再現」を追加<br>・G16 / G17 は `HUMAN_GATES.md` 未定義である旨を注記（新規 Issue 2 に依存） |
| **#405**（スパイク） | ・比較対象のうち「hand landmark + parametric + texture」を**第 1 候補として優先検証**に変更（4 方式の並列比較ではない）<br>・2.5D depth/height は独立方式ではなく上記の `heightMap` として吸収する旨を明記<br>・検証順序を「爪 1 本 → **差し替え** → 指＋爪 → 片手 → 手全体」に変更（差し替えが最大リスク）<br>・「#390 の出力を入力候補」はプラットフォーム依存であることを条件付きに<br>・MANO 等のライセンス制約を Constraints に追加 |
| **#406**（History） | ・「爪単体 / 指 / 手全体の表示切替」より先に「**同一 socket での時系列差し替え比較**」を Done に置く<br>・受け入れ基準に「片手単位の記録構造を変えない」を追加（#392 と整合）<br>・フォールバック階層（3D → 2.5D → 写真）を明記 |
| **#407**（Share） | ・technical question への回答を反映: **R3F 採用 / model-viewer 不採用**<br>・revoke は **Cross-service Rules（`firestore.get`）で Cloud Function 不要**と明記<br>・**`getDownloadURL()` のトークン URL は使用禁止**（Rules をバイパスし revoke が効かない）を Requirements に追加<br>・依存として「画像を含む共有の G6 判断が未了」を追加（現状の共有は画像すら公開していない）<br>・共有時の Hand Base は **generic hand をデフォルト、personal hand はオプトイン**を提案 |
| **#392**（両手） | ・Hand Base は **handedness 単位**で保持し、10 本表示は Nail Set 2 つの合成で実現する方針をコメント追加<br>・#404 と相互リンク |
| **#390 / #391 / #394** | ・**iOS native スコープ**であることをタイトル／本文で明示し、`platform: ios` 相当のラベルを付与<br>・Web 側 3D（#404〜#407）との関係を明記（ScanSession 境界）<br>・#390: 存在しない `docs/product/nailous-scan-roadmap.md` 参照を修正 |

### 5.2 追加 Issue 案

優先順（上から着手）:

| # | 種別 | タイトル案 | Gate | 備考 |
|---:|---|---|---|---|
| 1 | decision | **3D / Scan の実装プラットフォームを決める（Web/PWA vs iOS native vs ハイブリッド）** | G1 | **最優先ブロッカー。** #405 の設計がこれに依存 |
| 2 | docs | `HUMAN_GATES.md` に G16 / G17 を追記し Gate 定義を単一の正にする | — | 低コスト・高効果。今すぐ可 |
| 3 | decision | ROADMAP Phase 8 の再定義（Preset Preview → Personal Nail Capture & Replay） | G1 | #B |
| 4 | design | **ScanSession** 共通中間表現スキーマ定義（プラットフォーム非依存 JSON） | — | #A を構造的に吸収 |
| 5 | design | **Personal Hand Base + Nail Socket** データモデル設計 | G3 | 設計の核。#C |
| 6 | spike | R3F 導入の最小 3D 表示（dynamic import / バンドル影響計測） | G8・G9 | PoC-0 |
| 7 | refactor | 3D 機能を `src/features/nail3d/` に分離する方針決定 | G12 | #J。実装開始前に必須 |
| 8 | spike | 爪 socket 推定 + パラメトリック爪の実写オーバーレイ | — | PoC-1 / PoC-2 |
| 9 | spike | **Nail Set 差し替え比較**（同一 socket / 2 時点） | — | **PoC-3 = 本命** |
| 10 | design | 手形状モデルのプライバシー区分整理とポリシー追記 | G6 | #D。`NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md` の非目標との整合 |
| 11 | design | 3D アセットのストレージレイアウトと `storage.rules` 設計（private Hand Base / 公開 Nail Set） | G4・G6 | #C。GLB の contentType 対応含む |
| 12 | design | 共有 3D アセットの revoke 方式（Cross-service Rules / トークン URL 禁止） | G6 | #E |
| 13 | docs | `3D_ASSET_DELIVERY_STRATEGY.md` / `FIRESTORE_3D_SCHEMA_DESIGN.md` に「ユーザー所有アセット」カテゴリを追加 | — | #C |
| 14 | design | 3D 生成失敗時のフォールバック階層（3D → 2.5D → 写真）定義 | — | #404 成功条件 4 の具体化 |

### 5.3 推奨着手順

```text
[1] プラットフォーム決定 ──┐
[2] Gate 番号修正          ├─→ [4] ScanSession ─→ [5] Hand Base モデル ─┐
[3] Phase 8 再定義 ────────┘                                            │
                                                                        ↓
                            [6] R3F 土台 ─→ [7] features 分離 ─→ [8] socket ─→ [9] 差し替え
                                                                        │
                                              [10][11][12] privacy / rules / revoke（並行可）
                                                                        ↓
                                              [13][14] docs 整備
```

---

## 6. 本質（残す・振り返る・見せる）を守るためのチェックリスト

実装フェーズに入る各 PR で確認すること。

- [ ] 記録フローが現状より重くなっていない（動画スキャンは任意、保存を 3D 処理でブロックしない）
- [ ] 写真 1 枚だけでも記録でき、3D なしでも体験が完結する
- [ ] 3D 生成失敗時に 3D → 2.5D → 写真 のフォールバックが働く
- [ ] 既存の NailItem CRUD / 検索 / ソート / 共有 / エクスポートを壊していない
- [ ] 片手単位の記録構造を変えていない
- [ ] 本人専用の計測値・解析値が公開モデルに混ざっていない
- [ ] 3D が「解析結果の付属物」ではなく「ネイルの思い出」として提示されている（#406 の User Value）
- [ ] 1 PR の diff が 150 行以内（`AGENTS.md`）

---

## 7. 参照

| ドキュメント / Issue | 関連 |
|---|---|
| [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md) | **契約の正。** Canonical/Derived の二分、不変条件 INV-1〜3 |
| [NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) | 本書 #A（プラットフォーム分裂）への回答。責務分離の比較と推奨案（案 A-1・G1 承認済み） |
| [NAIL_3D_ISSUE_REORG_PLAN.md](./NAIL_3D_ISSUE_REORG_PLAN.md) | 本書 5 節の確定版。#390〜#407 の処置と追加 Issue |
| [ROADMAP.md](./ROADMAP.md) | Phase 8 / 9、G16 / G17 の定義元 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | Product Vision、NailItem 将来フィールド |
| [3D_LIBRARY_EVALUATION.md](./3D_LIBRARY_EVALUATION.md) | R3F vs model-viewer（結論維持・理由更新） |
| [3D_ASSET_DELIVERY_STRATEGY.md](./3D_ASSET_DELIVERY_STRATEGY.md) | GLB 方針、サイズ目標、ライセンス |
| [FIRESTORE_3D_SCHEMA_DESIGN.md](./FIRESTORE_3D_SCHEMA_DESIGN.md) | optional フィールド / マイグレーション不要原則 |
| [NAIL_HAND_DETECTION_PIPELINE.md](./NAIL_HAND_DETECTION_PIPELINE.md) | MediaPipe クライアント処理原則（最も整合） |
| [NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md](./NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md) | 非目標「No biometric inference」 |
| [IOS_RELEASE_PATH_DECISION.md](./IOS_RELEASE_PATH_DECISION.md) | PWA-first 推奨 |
| [IOS_CAPTURE_REQUIREMENTS.md](./IOS_CAPTURE_REQUIREMENTS.md) | EXIF / 位置情報を保持しない方針 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | G1〜G15（G16 / G17 未定義） |
| #390 / #391 / #392 / #394 | iOS native スキャン・推定器・両手ペアリング |
| #404 / #405 / #406 / #407 | 3D Epic / スパイク / History / Share |
