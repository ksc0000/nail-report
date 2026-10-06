# Issue 再編案（#390〜#407）— 確定版

> **Status: 確定案（Issue の作成・編集は未実施）**
> 前提: 案 A-1 採用・ネイティブ iOS + App Store 配布の許容が **G1 承認済み（2026-10-06）**
> 正となる契約: [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md)
> 作成日: 2026-10-06

本書は #390〜#407 の各 Issue に対する**処置を確定**し、追加すべき Issue を列挙する。適用（Issue の編集・起票）は未実施。

> **2026-10-06 — N1（Canonical Nail Data 契約 v1）完了。**
> 契約・fixtures・パース検証が揃い、Wave 1 の残り（N2 / N3）と Wave 2 / 3 に着手可能な状態。
> 本書の Issue 再編（#404〜#407 の編集と新規起票）は**次の工程として実行可能**。
> → [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md) 7.1 節

---

## 0-0. 現在地と次の主目標（2026-10-06）

> **次の技術的主目標: #405 — stable Nail Socket PoC（iOS）**

### 完了（PR #413 / CI green）

| Issue | 内容 | 状態 |
|---:|---|---|
| #408 | CI に lint / test を追加（G10） | **完了** |
| #410 | 3D 機能のモジュール構成方針（G12） | **完了** |
| #411 | R3F 導入・最小 3D 表示（G8 / G9） | **完了** |
| #412 | CND から NailSet をレンダリング（最小） | **完了** |
| （N1） | Canonical Nail Data 契約 v1 + fixtures + 検証 | **完了** |

PR: https://github.com/ksc0000/nail-report/pull/413（マージは human 判断 / G14）

### CI 実測（windows-latest / PR #413）

| ステップ | 結果 |
|---|---|
| Checkout / Setup Node.js（`node-version: 22`） | success |
| Install dependencies（`npm ci`） | success |
| Run CSS guard（pwsh） | success |
| **Build**（`tsc -b && vite build`） | success |
| **Lint**（`eslint .`） | success |
| **Test**（`npm run test`） | success — node 側 **71 pass / 0 fail / 0 skipped**、vitest 側 9 pass |

`node --experimental-strip-types --test` は **Windows ランナーで問題なく動作した**。同フラグは Node 22.6 以降でのみ利用可能なため、`node-version: 22` が 22.6 以降に解決されていることが実行結果から確認できる。

### いま可能になったこと

- 契約（CND v1）が固まり、**iOS 側は実装のみを持てばよい**状態
- fixtures 17 件と降格検証 53 ケース（契約 27 / ジオメトリ 26）が CI でガードされる
- `/nail3d-preview` で **CND → NailGeometry / NailTexture → R3F** が実際に描画できる
- #405 の出力が出たら、同じ `<Nail3DView>` に本物の `NailSet` / `HandProfile` と `resolveTextureUrl` を渡すだけで差し替わる

### 意図的に作り込まないもの（#405 の結果が出るまで）

| | 理由 |
|---|---|
| #406 の時系列比較 UI | socket が安定しなければ比較体験そのものが成立しない |
| #407 の 360°共有 | 同上。加えて画像を含む共有の G6 判断が未了 |
| Firestore / Storage レイアウトと Rules（G3 / G4 / G6） | PoC は Firestore 書き込みを必要としない |
| HandProfile 生成・CND 書き込み（iOS） | #405 は socket 1 個で足りる |

### 未解決（本線とは別）

- `Agent PR Review Router`（`.github/workflows/agent-pr-review-router.yml`）が **401 Bad credentials** で失敗する。`secrets.GH_AW_AGENT_TOKEN` が失効しており、空でないため `|| github.token` のフォールバックが働かない。前回成功は 2026-06-29 で、本 PR とは無関係の潜在不具合。対処はシークレットの削除（G7）またはワークフロー修正（G10）
- `commands/check-css-guard.ps1` の対象が `src/App.css` のみで feature 配下の CSS がガードされない（既知の負債）

---

## 0-A. 実施記録（2026-10-06 適用済み）

本書の再編案は **実適用済み**。

### 既存 Issue の編集（7 件）

| Issue | 実施内容 |
|---|---|
| #404 | Epic として全面改稿。G1 承認前提・責務分離・Product Principle・不変条件・契約・非目標追加・Gate 表・sub-issue 一覧。G16 を**非該当**に訂正 |
| #405 | **改題・縮小** → `[iOS] PoC: stable Nail Socket — 爪床の座標系を安定して推定する`。方式比較を削除し、socket 安定性に集中。安定性の測り方と受け入れ基準を追加 |
| #406 | Web 実装 Issue に。**差し替え比較を最優先に順序変更**。記録単位（handedness / 片手5本 / 10本合成）を明記 |
| #407 | 技術方針を確定記載（R3F 採用 / Cross-service Rules / **トークン URL 禁止** / 複製方式 / generic hand 既定）。**画像を含む共有の G6 判断が未了**であることを依存として明示 |
| #392 | 解決方針を確定（HandProfile は handedness 単位、10 本は NailSet 2 つの合成、L3 判定は 1 階層上） |
| #390 | `[iOS]` 化。**存在しない `nailous-scan-roadmap.md` 参照を修正**し Scan Phase / Product Phase を分離。ScanSession との関係とプライバシー制約を追加 |
| #391 | `[iOS]` 化。較正は `reconstructionVersion` を上げる（`contractVersion` ではない）ことを明記。#405 と独立であることを明示 |
| #394 | `[iOS]` 化。出力が `NailGeometry × 5` として CND に載ること、**5 本揃わなくても `partial` で成立する**ことを明記 |

### 新規 Issue（5 件・すべて #404 の sub-issue）

**16 件を機械的に全件起票せず、#405（stable Nail Socket PoC）までの依存関係に入るものだけを起票した。**

| Issue | タイトル | Gate | #405 との関係 |
|---|---|---|---|
| **#408** | CI に lint / test を追加して契約回帰をガードする | **G10** | 並行。契約を守る基盤 |
| **#409** | ScanSession（iOS → CND 受け渡し）仕様 | — | #405 は単写真で開始できるため**直列依存ではない**（優先度中） |
| **#410** | `src/features/nail3d/` 分離方針を決める | G12 | #411 / #412 の前提。**先に決める** |
| **#411** | R3F を導入し最小 3D 表示 | **G8 / G9** | #405 の出力を本番スタックで目視するため |
| **#412** | CND から NailSet をレンダリング（最小） | — | #405 の「差し替えて見比べる」を本番スタックで成立させる |

**#411 / #412 は #405 と並行して進められる。** 契約パーサと fixtures が完成しているため、iOS の実装完了を待たずに描画側を作れる。

### 意図的に保留した Issue（未起票）

| 内容 | 保留理由 |
|---|---|
| Firestore / Storage レイアウトと Rules（G3 / G4 / G6） | #405 は PoC であり Firestore 書き込みを必要としない |
| 手形状モデルのプライバシー区分（G6） | #407（共有）の前提。PoC には不要 |
| 共有 revoke 方式（G6） | 同上。技術方針は #407 本文に記載済み |
| HandProfile 生成・更新（iOS） | #405 完了後。PoC は socket 1 個で足りる |
| CND 書き込み（iOS） | 同上 |
| カメラ / 動画スキャン同意フロー（G17） | #390（動画）着手時 |
| 時系列差し替え比較 / 360°共有の実装本体 | #406 / #407 自体がその Issue |
| フォールバック階層の定義 | #412 の受け入れ基準で実質カバー |
| docs 不整合修正 | **本ブランチで実施済み**（Issue 化不要） |

### ラベル

`nail3d` を新規作成し全 3D Issue に付与。iOS 側は既存の `ios-quality` を併用。
`platform: ios` / `platform: web` / `contract` は**未作成**（`nail3d` + タイトルの `[iOS]` 接頭辞で区別がつくため、現時点では不要と判断）。

---

## 0. 再編の方針

| # | 方針 |
|---|---|
| 1 | **#404 を唯一の Epic とし、他を sub-issue として束ねる** |
| 2 | **プラットフォームをラベルで明示する。** iOS 側 / Web 側 / 契約（両方）の 3 区分 |
| 3 | **docs で答えが出た部分は Issue から外す。** 比較検討が完了した項目を実装 Issue に残さない |
| 4 | **契約（CND）を先行させる。** 契約未確定のまま iOS / Web の実装 Issue を着手可能にしない |
| 5 | **不変条件 INV-1〜3 の受け入れ基準を、3D に触る全 Issue に入れる** |

### 追加が必要なラベル

| ラベル | 用途 |
|---|---|
| `platform: ios` | iOS ネイティブ（Capture / Detection / Reconstruction） |
| `platform: web` | Web / R3F（Archive / Compare / Share / Rendering） |
| `contract` | Canonical Nail Data 契約（両プラットフォームに影響・変更は慎重に） |
| `nail3d` | 3D レイヤー関連の横断ラベル |

---

## 1. 既存 Issue の処置一覧

| Issue | タイトル（現在） | 処置 | 新ラベル |
|---:|---|---|---|
| **#390** | 動画スキャン: 短い動画から角度別ベストフレームを自動抽出 | **編集・継続** | `platform: ios` `nail3d` |
| **#391** | 多角度スキャン: 実写の角度別サンプルで推定器を較正 | **編集・継続** | `platform: ios` `nail3d` |
| **#392** | 両手をまとめて扱う（左右の記録をペアにする／10本表示） | **編集・継続**（解決方針を確定） | `platform: web` `contract` |
| **#394** | 片手スキャン: 横・猫の手写真から5本を分離してカーブを推定 | **編集・継続** | `platform: ios` `nail3d` |
| #400 | iOS: real_beige_bothhands.jpg の検出改善 | **現状維持**（3D 再編の対象外。Detection 層の品質課題として継続） | `platform: ios` |
| **#404** | Epic: Nail Scan → 実物の爪・指・手を3D資産化 | **大幅編集 → 唯一の Epic に** | `nail3d` |
| **#405** | 技術スパイク: 爪単体→指＋爪→手全体を段階的に3D/2.5D復元 | **縮小・改題**（方式比較は docs で完了。iOS 側 PoC に絞る） | `platform: ios` `nail3d` |
| **#406** | 3D Nail History: 時系列で振り返り・比較 | **編集・継続**（Web 実装 Issue に） | `platform: web` `nail3d` |
| **#407** | 3D Share: 360°で閲覧できる共有体験 | **編集・継続**（技術的回答を反映） | `platform: web` `nail3d` |

> #393 / #395〜#399 / #401〜#403 は Close 済み。処置不要。

---

## 2. 既存 Issue の編集内容（確定）

### #404 — Epic（大幅編集）

**追記する前提（G1 承認済み）**

```text
## 承認済みの前提（2026-10-06, G1）
- Nail Scan / 3D 生成のためのネイティブ iOS + App Store 配布を許容する
- 案 A-1 を採用（Capture だけでなく Reconstruction も iOS 側）
- 責務分離:
    iOS   = Capture / Detection / Reconstruction
    契約  = HandProfile + NailSocket + NailGeometry + NailTexture + NailSet
    Web   = Archive / Compare / Share / Rendering
- GLB を永続データの正にしない。Canonical Nail Data を正とし、GLB 等は派生 asset
  （MVP では GLB を生成しない）

## 不変条件（全 sub-issue の受け入れ基準に含める）
- INV-1 写真記録は常に成立する。2.5D / 3D は追加レイヤー
- INV-2 3D 状態は NailItem 本体から分離する（失敗を記録本体に書き戻さない）
- INV-3 未知の contractVersion は L0（写真のみ）へ安全にフォールバックする

## 正となるドキュメント
- docs/product/CANONICAL_NAIL_DATA_CONTRACT.md  ← 契約の正
- docs/product/NAIL_3D_PLATFORM_ARCHITECTURE.md
- docs/product/NAIL_3D_SCAN_DIRECTION_REVIEW.md
- docs/product/NAIL_3D_ISSUE_REORG_PLAN.md
```

**修正する箇所**

| 現在 | 修正後 |
|---|---|
| Human Gates: `G1 / G2 / G3 / G6 / G8 / G16 / G17` | `G1（承認済み）/ G2 / G3 / G4 / G6 / G8 / G9 / G17`。**G16 は非該当**（ユーザー自身のスキャンデータはプロダクトアセットではない）。G16 / G17 は `HUMAN_GATES.md` に定義追加済み |
| Target Flow | 末尾に「※ 手全体は毎回再構築しない。HandProfile は handedness 単位で再利用し、NailSet のみ差し替える」を追記 |
| 関連 Issue `#390 #391 #392 #394 #232` | sub-issue 化（→ 第 4 節）。`#232` は参照先が 3D と無関係のため要確認 |
| 非目標 | 以下を追加 |

```text
## 非目標（追加）
- 研究用途ライセンスの統計的手モデル（MANO 等）の採用 — 商用利用不可
- 生成 AI / サーバー推論をデフォルト経路に入れること
- 撮影時のポーズを 3D で再現すること（canonical pose に正規化する）
- GLB を永続データの正にすること
- 動画スキャンを記録の必須要件にすること
```

---

### #405 — 縮小・改題

**現タイトル:** 技術スパイク: Nail Scanから爪単体→指＋爪→手全体を段階的に3D/2.5D復元する
**新タイトル案:** `[iOS] PoC: 実写1本の爪から NailGeometry + NailTexture を生成する`

理由: 「2.5D / mesh / NeRF / GS / ハイブリッドの方式比較」は
[NAIL_3D_SCAN_DIRECTION_REVIEW.md](./NAIL_3D_SCAN_DIRECTION_REVIEW.md) 3 節と
[NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) で**完了**。
採用方式（hand landmark + パラメトリック幾何 + テクスチャ投影、オンデバイス）も確定済み。
スパイクに残すのは **socket の安定性という唯一の未検証リスク**のみ。

**書き換える Done**

```text
## Done
- [ ] 実写1枚 + landmarks から NailSocket を推定し、実物の爪輪郭と重なることを確認
- [ ] 爪領域を socket 座標系へ投影し NailTexture を生成
- [ ] NailGeometry（shape / curveV / curveH / length / thickness）を CND 契約の形で出力
- [ ] 出力が contractVersion=1 の fixtures として Web 側テストを通る
- [ ] 失敗時に NailItem を一切変更しないことを確認（INV-2）

## 非スコープ
- 手全体 / 10本 / 両手 / リアルタイム / NeRF・GS / GLB 生成
```

**削除する記述:** 「比較対象（2.5D / mesh / NeRF / GS / ハイブリッド）」「少なくとも2方式比較」「推奨アーキテクチャ決定」— いずれも docs で完了。

---

### #406 — Web 実装 Issue へ

**追記・修正**

```text
## 前提
- Canonical Nail Data を読んで描画する（生成は iOS 側）
- NailSet は nailItems/{itemId}/nail3d/current から読む（NailItem 本体には持たない）

## Done（差し替え）
- [ ] NailItem 詳細から保存済み NailSet を開ける
- [ ] 同一 socket に別日の NailSet を差し替えて比較できる  ← 最優先
- [ ] 過去モデルを時系列で選択できる
- [ ] モバイルで回転・拡大できる
- [ ] 3D が無い記録・nail3d を削除した記録でも詳細/一覧/比較が完全動作（INV-1）
- [ ] 未知 contractVersion で L0 にフォールバックする（INV-3）
- [ ] 既存 CRUD / share を壊さない
```

**順序の変更:** 現在の「爪単体 / 指 / 手全体の表示切替」より **「同一 socket での時系列差し替え比較」を優先**。
後者が #406 の User Value（振り返る楽しさ）の核であり、前者は表示オプション。

**記録単位の明記:** NailSet は片手 5 本 = 1 記録。片手単位の記録構造（2026-09-15 決定）を変えない。

---

### #407 — 技術的回答を反映

**Technical questions への確定回答を追記**

```text
## 技術方針（確定）
- GLB/model-viewer vs Three.js/R3F → **R3F を採用**。model-viewer は不採用
  （CND から HandProfile + NailSet をランタイム合成するため。MVP では GLB を生成しない）
- 共有停止と asset access の連動 → **Storage の Cross-service Rules で達成可能**
  （firestore.get で publicShares/{shareId}.isEnabled を参照）。Cloud Function 不要
- ⚠️ getDownloadURL() のトークン付き URL を共有に使わない
  （Security Rules をバイパスするため共有停止が効かない）
- 本人用 asset と共有用 asset の分離 → 共有時は publicAssets/{shareId}/ へ**複製**する
  （原本は owner-only のまま。失効は複製側で完結）
- private measurement data → CND と**別ドキュメント**に置き、共有経路は参照しない（構造で担保）
- 手形状の扱い → 既定では personal hand を共有せず generic hand に差し替え（オプトイン / 要 G6）

## 依存（未了）
- 「画像を含む共有をするか」の G6 判断。現状 publicShares は imageUrl / memo を意図的に除外しており、
  共有リンクは画像すら表示していない。3D 公開はその判断を飛ばせない
```

---

### #392 — 解決方針を確定

```text
## 解決方針（確定 / #404 と整合）
- HandProfile は handedness 単位で保持する（left / right 各 1）。記録単位とは独立したユーザー資産
- NailSet は片手 5 本 = 1 記録（既存の記録単位と一致。記録構造を変えない）
- 10本表示は NailSet 2 つを 1 シーンに合成して実現する（ペアはリンク情報として持つ）
→ 受け入れ基準「片手の記録構造を変えずに実現する」をそのまま満たす
```

---

### #390 / #391 / #394 — iOS スコープの明示と参照修正

| Issue | 編集内容 |
|---|---|
| **#390** | タイトルに `[iOS]` を付与。**存在しない `docs/product/nailous-scan-roadmap.md` への参照を修正**（Scan Phase と Product Phase の用語を分離）。出力が ScanSession / CND 契約に適合することを受け入れ基準に追加 |
| **#391** | タイトルに `[iOS]` を付与。較正結果が `reconstructionVersion` を上げることを明記。オーナー撮影待ちのブロック状態を明示 |
| **#394** | タイトルに `[iOS]` を付与。出力が `NailGeometry × 5` として CND に載ることを明記 |

共通で追記:

```text
## 契約との関係
本 Issue の出力は Canonical Nail Data 契約（docs/product/CANONICAL_NAIL_DATA_CONTRACT.md）に適合すること。
契約の正はこのリポジトリにあり、iOS 側は実装のみを持つ（契約を単独で変更しない）。
```

---

## 3. 追加 Issue 候補（確定）

### Wave 1 — 契約と基盤（他のすべてをブロックする）

| # | 種別 | タイトル案 | Gate | 備考 |
|---:|---|---|---|---|
| N1 | contract | ~~Canonical Nail Data 契約 v1 を確定し JSON fixtures を追加する~~ | — | **実施済み（2026-10-06）。** `src/lib/nail3dContract.ts` / `contracts/nail3d/v1/` / `tests/nail3dContract.test.ts`。Issue 化は不要 |
| N2 | contract | **ScanSession（iOS → CND 受け渡し）仕様を定義する** | — | frames / landmarks / nailQuads / captureMeta。EXIF・位置情報は保持しない |
| N3 | design | **Firestore / Storage レイアウトと Rules を設計する**（private CND / 共有スコープ複製） | G3 / G4 / G6 | `nail3d/` と `publicAssets/` の新規パス。`contentType` 制約の見直し |
| N4 | docs | HUMAN_GATES / PRODUCT_SPEC / ROADMAP / 3D 系 docs の不整合修正 | — | **本ブランチで実施済み。** Issue 化は不要 |

### Wave 2 — Web 基盤（契約が確定したら着手可）

| # | 種別 | タイトル案 | Gate | 備考 |
|---:|---|---|---|---|
| N5 | spike | **R3F を導入し最小 3D 表示を行う**（dynamic import / バンドル影響計測） | **G8 / G9** | `three` `@react-three/fiber` `@react-three/drei` |
| N6 | refactor | **3D 機能を `src/features/nail3d/` に分離する方針を確定する** | G12 | `App.tsx` 2,430 行・PR 150 行規約との両立。**実装開始前に必須** |
| N7 | feat | **CND パーサと L0 フォールバックを実装する**（INV-3） | — | fixtures ベースの Vitest。未知バージョン / 欠落 / 型不一致を網羅 |
| N8 | feat | **NailSet レンダラー（socket 合成）を実装する** | — | HandProfile + NailSet → R3F シーン |
| N9 | test | **不変条件 INV-1〜3 の回帰テストセットを作る** | — | T1〜T8（契約ドキュメント 7 節） |

### Wave 3 — iOS 実装

| # | 種別 | タイトル案 | Gate | 備考 |
|---:|---|---|---|---|
| N10 | feat | **[iOS] HandProfile + NailSocket を生成・更新する** | — | 複数スキャンの統計で精度向上。`sampleCount` で信頼度 |
| N11 | feat | **[iOS] CND を contractVersion 準拠で書き込む** | — | 失敗時に `NailItem` を変更しない（INV-2） |
| N12 | feat | **[iOS] カメラ / 動画スキャンの同意フローを実装する** | **G17** | オンデバイス処理の説明・撤回手段 |

### Wave 4 — 体験の完成

| # | 種別 | タイトル案 | Gate | 備考 |
|---:|---|---|---|---|
| N13 | feat | **時系列差し替え比較を実装する**（#406 の実装本体） | G2 | 新規画面 / 主要導線変更は design-review |
| N14 | feat | **360°共有ページを実装する**（#407 の実装本体） | G2 / G6 | 未ログイン閲覧・共有停止連動 |
| N15 | design | **手形状モデルのプライバシー区分を整理しポリシーに追記する** | **G6** | `NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md` の非目標「No biometric inference」との整合。**本件は AI が単独で決めない** |
| N16 | design | 3D 生成失敗時のフォールバック階層（L3→L2→L1→L0）を定義する | — | #404 成功条件 4 の具体化 |

### 将来（契約レベルで余地を残すのみ・着手しない）

| # | 内容 |
|---|---|
| F1 | L1（2.5D）を Web 側キャプチャにも開く（MediaPipe Web / HandProfile 不要） |
| F2 | 高精細オプトイン経路（フォトグラメトリ / Gaussian Splatting、案 D 構成・サーバー処理） |
| F3 | GLB / USDZ の派生 asset 生成（AR Quick Look 対応が必要になったとき） |

---

## 4. Epic 構造（#404 の sub-issue）

```text
#404 Epic: Nail Scan → 実物のネイルを 3D 資産化し、振り返り・共有につなげる
│
├── 契約 / Contract
│   ├── N1  CND 契約 v1 確定 + fixtures
│   ├── N2  ScanSession 仕様
│   └── N3  Firestore / Storage レイアウトと Rules        [G3/G4/G6]
│
├── iOS: Capture / Detection / Reconstruction
│   ├── #390 動画から角度別ベストフレーム抽出
│   ├── #391 実写較正（オーナー撮影待ち）
│   ├── #394 片手5本分離とカーブ推定
│   ├── #405 PoC: 実写1本から NailGeometry + NailTexture
│   ├── N10  HandProfile + NailSocket 生成
│   ├── N11  CND 書き込み
│   └── N12  カメラ / 動画スキャン同意フロー               [G17]
│
├── Web: Archive / Compare / Share / Rendering
│   ├── N5   R3F 導入                                      [G8/G9]
│   ├── N6   features/nail3d 分離方針                      [G12]
│   ├── N7   CND パーサ + L0 フォールバック（INV-3）
│   ├── N8   NailSet レンダラー
│   ├── N9   INV-1〜3 回帰テスト
│   ├── #406 → N13 時系列差し替え比較                      [G2]
│   ├── #407 → N14 360°共有                                [G2/G6]
│   └── #392 両手ペア（10本表示）
│
└── 横断
    ├── N15  手形状モデルのプライバシー区分                [G6]
    └── N16  フォールバック階層の定義
```

---

## 5. 着手順と依存

```text
Wave 1  N1 ─ N2 ─ N3                     （契約。ここが全体をブロックする）
            │
Wave 2      ├─ N5 ─ N6 ─ N7 ─ N8 ─ N9    （Web 基盤。契約確定後）
            │
Wave 3      └─ #405 ─ N10 ─ N11          （iOS 実装。#391 はオーナー撮影待ち）
                       │
Wave 4                 └─ N13 ─ N14 ─ #392
                          N12 / N15 / N16 は並行可
```

**ブロッカーの明示:**

| ブロッカー | 影響 |
|---|---|
| ~~N1（契約 v1 確定）~~ | **解消済み。** 契約 v1・fixtures 17 件・検証 27 ケースが揃い、Wave 2 / 3 に着手可能 |
| ~~G9（`package.json` の test スクリプト追加）~~ | **解消済み（2026-10-06 承認・適用）。** `npm run test` が契約テスト 27 ケースを含む |
| **G10（`ci.yml` に lint / test ステップ追加）** | **CI は現在 build と CSS guard のみを実行しており `npm run test` を呼んでいない。** 契約回帰が CI でガードされないため、Wave 2 着手前に承認が望ましい |
| **N6（features 分離）** | N8 以降。先に決めないと PR が 150 行規約に収まらない |
| **G8 / G9 承認** | N5 以降の Web 実装すべて |
| **#391 のオーナー撮影** | 推定器の実写較正。iOS 側の品質確定 |
| **G6 判断（N15 / 画像共有）** | N14（360°共有）。技術ではなくポリシーの判断 |

---

## 6. 全 3D Issue 共通の受け入れ基準（テンプレート）

```text
## 共通受け入れ基準（3D レイヤーに触る Issue すべて）
- [ ] isNail3DEnabled = false で既存フローが完全動作する（INV-1）
- [ ] nail3d を削除しても詳細 / 一覧 / 比較 / 共有が写真のみで動作する（INV-1）
- [ ] 3D の失敗状態を NailItem 本体に書き戻していない（INV-2）
- [ ] 未知 contractVersion で L0 にフォールバックし、例外を UI に伝播しない（INV-3）
- [ ] 既存の NailItem CRUD / 検索 / ソート / 共有 / エクスポートを壊していない
- [ ] 片手単位の記録構造を変えていない
- [ ] 本人専用の計測値・解析値が公開モデルに混ざっていない
- [ ] diff 150 行以内（AGENTS.md）
- [ ] npm run build / npm run lint が通る
```

---

## 7. 参照

| ドキュメント | 関連 |
|---|---|
| [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md) | 契約の正・不変条件・受け入れテスト |
| [NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md) | 案 A-1・責務分離・契約ドリフト対策 |
| [NAIL_3D_SCAN_DIRECTION_REVIEW.md](./NAIL_3D_SCAN_DIRECTION_REVIEW.md) | 方向性レビュー・矛盾一覧 |
| [ROADMAP.md](./ROADMAP.md) | Phase 8 = Personal Nail Capture & Replay（再定義済み） |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | G1〜G17（G16 / G17 を定義追加済み） |
