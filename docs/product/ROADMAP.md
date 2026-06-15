# Development Roadmap

このドキュメントは、AI 支援開発の進行順序を定義するロードマップです。  
各フェーズは順番に進める必要はなく、プロダクト方針に応じて調整してください。

> **Note:** フェーズ間の移行判断は人間が行います。  
> AI は現在のフェーズ内のタスクのみを実行してください。

---

## フェーズ一覧

| フェーズ | 名称 | 状態 |
|----------|------|------|
| Phase 0 | Harness Foundation | ✅ 完了 |
| Phase 1 | Core UI | ✅ 完了 |
| Phase 2 | Data Persistence | ✅ 完了 |
| Phase 3 | Authentication / User Management | ✅ 完了 |
| Phase 4 | AI-Assisted Features | 🔲 未着手 |
| Phase 4.5 | Nail View / Camera Foundation | 🔲 推奨 next |
| Phase 5 | Review / Export / Sharing | 🟡 進行中 |
| Phase 6 | Security / Operations Hardening | 🟡 進行中 |
| Phase 7 | Release Preparation | 🟡 進行中 |
| Phase 8 | 3D Preview / Modeling Foundation | 🔲 未着手 |
| Phase 9 | AR Try-on / Advanced Modeling | 🔲 未着手 |

---

## Phase 0: Harness Foundation

**Goal:** AI 支援開発を安全・安定に運用するための基盤を整備する

### 完了タスク

- [x] AI 役割エージェント定義（`agents/` ディレクトリ）
- [x] PowerShell コマンド整備（`commands/` ディレクトリ）
- [x] GitHub Actions CI 整備（CSS guard + build）
- [x] Branch Ruleset 設定（main 保護）
- [x] Harness ドキュメント整備（`docs/harness/`）
- [x] プロダクト仕様雛形作成（`docs/product/`）
- [x] ローカル開発マニュアル作成（`docs/operations/`）
- [x] デザイン参考資料整備（`docs/design-references/`）

### Human Gates

- G10: `.github/workflows` 変更
- G11: Ruleset / CI 変更

### Done Criteria

- [x] AI が安全なフローで作業できる環境が整っている
- [x] CSS guard が CI で動作している
- [x] build が CI で検証されている
- [x] ドキュメント一式が `docs/` に揃っている
- [x] README に全ドキュメントへのリンクがある

---

## Phase 1: Core UI

**Goal:** NailItem コレクションアプリの UI を完成させる

### 完了タスク

- [x] NailItem カードグリッド（2カラム、レスポンシブ対応）
- [x] 追加 / 編集フォーム（タイトル・タグ・メモ・画像）
- [x] 削除確認ダイアログ
- [x] クライアント検索（タイトル・タグ絞り込み）
- [x] 新着順ソート（updatedAt / createdAt 降順）
- [x] 空状態ガイド（初回ユーザー向けオンボーディング）
- [x] 作成日・更新日の表示
- [x] カードホバーエフェクト（lift + shadow + 画像ズーム）
- [x] アクセシビリティ対応（focus-visible リング）
- [x] `prefers-reduced-motion` 対応

### Human Gates

- G2: UI/UX の大きな変更（レイアウト全面変更時）
- G1: 機能スコープの変更（プロダクト方針）

### Done Criteria

- [x] 主要なユーザーストーリーが画面で確認できる
- [x] スマートフォン / デスクトップで表示が崩れない
- [x] `npm run build` が成功する
- [x] CSS guard が通過する
- [x] 既存の NailItem CRUD 機能が壊れていない

---

## Phase 2: Data Persistence

**Goal:** NailItem データを永続化し、リロードしてもデータが残るようにする

### 完了タスク

- [x] Firestore による NailItem 永続化（CRUD）
- [x] Firebase Storage による画像アップロード（5MB / jpeg・png・webp）
- [x] Firestore Security Rules（オーナー本人のみ read / write）
- [x] Storage Security Rules（認証済み本人のみ）
- [x] サーバータイムスタンプ（createdAt / updatedAt）

### Human Gates

- G3: DB スキーマ変更
- G8: 新しいライブラリ追加

### Done Criteria

- [x] ページをリロードしても NailItem が消えない
- [x] データが破損せずに読み書きされる
- [x] 画像アップロード・削除が正常に動作する

---

## Phase 3: Authentication / User Management

**Goal:** ユーザーが自分のコレクションを管理できるようにする

### 完了タスク

- [x] Google OAuth ログイン / ログアウト
- [x] ユーザー別の NailItem 管理（users/{uid}/nailItems/）
- [x] 未ログイン時のサインイン導線

### Human Gates

- G4: 認証・認可変更
- G6: 個人情報の取り扱い
- G7: 外部 API キーの管理

### Done Criteria

- [x] ログイン / ログアウトが動作する
- [x] ユーザーごとに独立した NailItem が表示される
- [x] Firestore / Storage Security Rules によるアクセス制御が機能している

---

## Phase 4: AI-Assisted Features

**Goal:** プロダクトに AI 機能を組み込む

> **人間判断が必要:** どの AI 機能を組み込むかの方針決定

### Example Issues

- [ ] 画像からタグ自動提案（色・スタイル分析）
- [ ] 画像から OCR でサロン名・価格を自動読み取り
- [ ] 類似ネイル推薦
- [ ] Claude API / Anthropic SDK 連携

### Human Gates

- G1: AI 機能のスコープ決定
- G7: API キーの管理（ANTHROPIC_API_KEY 等）
- G6: AI が処理するデータのプライバシー方針

### Done Criteria

- [ ] AI 機能が指定された仕様通りに動作する
- [ ] API キーがコードに含まれていない
- [ ] フォールバック（API 障害時の動作）が定義されている

---

## Phase 4.5: Nail View / Camera Foundation

**Goal:** iOS release に向けて、ネイル画像の閲覧・比較・撮影導線・将来の検出/AI/AR に必要な土台を先に整える

> **Recommended next direction:** 共有・運用の追加 polish を続ける前に、NailItem の「ネイルらしい体験」を強化する。Phase 8 / 9 の 3D / AR は引き続き後続の advanced phase とし、この Phase 4.5 では画像閲覧・カメラ導線・手動 annotation・AI/検出の設計基盤までに絞る。

### Example Issues

- [ ] feature: add nail image detail viewer
- [ ] feature: add nail image comparison view
- [ ] design: plan camera capture flow
- [ ] feature: add upload/camera source distinction
- [x] design: plan nail/hand detection pipeline
- [ ] feature: add AI nail tag suggestion from image
- [ ] design: plan iOS capture requirements

### Human Gates

- G1: iOS / Web / PWA の product direction 判断
- G2: 画像 detail / comparison など UI/UX の主要変更
- G3: `imageSource` / `manualRegions` / `analysis` 等の Firestore schema 追加
- G6: カメラ・ユーザー写真・AI 画像解析のプライバシー方針
- G7: 外部 AI API キーが必要な場合
- G8: 画像処理 / ML / camera helper library 追加

### Done Criteria

- [ ] NailItem の画像 detail viewer が既存データで動作する
- [ ] 画像比較の最小 UX がスマートフォン幅で破綻しない
- [ ] カメラ/アップロード source の方針が docs にまとまっている
- [ ] AI tag suggestion / nail detection / iOS capture の判断材料が docs にまとまっている
- [ ] 既存の NailItem CRUD / upload / share 機能を壊していない
- [ ] `npm run build` が成功している

---

## Phase 5: Review / Export / Sharing

**Goal:** コレクションの振り返り・共有・エクスポート機能を追加する

> **人間判断が必要:** 共有機能のスコープ決定

### Example Issues

- [ ] CSV / JSON エクスポート
- [ ] コレクション振り返り画面（月別・タグ別）
- [ ] 共有 URL / 公開コレクション機能

### 完了済みサブセット

- [x] CSV / JSON エクスポート
- [x] コレクション概要（タグ別 / 月別 / 最近の更新）
- [x] 共有 URL 作成 UI
- [x] `/share/{shareId}` 公開閲覧ページ
- [x] public sharing browser QA
- [x] public sharing privacy notes

### Human Gates

- G1: 共有機能の方針（公開 / 限定公開 / 非公開）
- G6: 共有時の個人情報取り扱い

### Done Criteria

- [ ] エクスポート / 共有機能が動作する
- [ ] 共有時のプライバシー設定が明確

---

## Phase 6: Security / Operations Hardening

**Goal:** セキュリティと運用品質を強化する

> Commercial MVP direction: Firebase Hosting with separate development and production Firebase projects. Production deploy remains human-approved.

### Example Issues

- [ ] セキュリティヘッダーの設定（CSP 等）
- [ ] 入力バリデーションの強化（tags 件数制限 UI 等）
- [ ] エラーログ / 監視の整備
- [ ] 依存関係の脆弱性スキャン

### Human Gates

- G4: 認証強化
- G6: セキュリティポリシー変更
- G10: CI へのセキュリティスキャン追加

### Done Criteria

- [ ] Security Reviewer によるレビューが完了している
- [ ] 既知の脆弱性が解消されている
- [ ] 監視・アラートが設定されている

---

## Phase 7: Release Preparation

**Goal:** 商用 MVP を Firebase Hosting で安全にリリースできる状態にする

### 完了済みサブセット

- [x] 商用 MVP スコープ決定
- [x] プロダクト定義・対象ユーザー・問題設定決定
- [x] 本番デプロイ先を Firebase Hosting に決定
- [x] development / production Firebase project 分離方針決定
- [x] 本番 release runbook 作成
- [x] 本番 smoke test checklist 作成

### Remaining Issues

- [ ] Privacy Policy / Terms routes and visible links
- [ ] User data export and deletion guidance
- [ ] Security headers / CSP
- [ ] Bundle size warning reduction or documented acceptance
- [ ] Full manual QA and go/no-go decision

### References

- [PRODUCTION_RELEASE_RUNBOOK.md](../operations/PRODUCTION_RELEASE_RUNBOOK.md)
- [PRODUCTION_SMOKE_TEST_CHECKLIST.md](../operations/PRODUCTION_SMOKE_TEST_CHECKLIST.md)

### Example Issues

- [x] デプロイ先の決定（Firebase Hosting）
- [ ] カスタムドメイン設定（broader commercial expansion 前に推奨）
- [ ] 本番ビルド最適化（code splitting 等）
- [ ] アクセス解析 / モニタリング設定（MVP では defer）
- [ ] README の最終整備

### Human Gates

- G15: 本番公開判断
- G10: デプロイ用 CI/CD ワークフロー追加

### Done Criteria

- [ ] 本番環境で `npm run build` のビルドがデプロイされている
- [ ] 全ての Human Gates が適切に処理されている
- [ ] 監視・ロールバック手順が準備されている
- [ ] README が公開用に整備されている

---

## Phase 8: 3D Preview / Modeling Foundation

**Goal:** ネイルチップの 3D プレビュー基盤を構築し、形状・カラー・テクスチャをインタラクティブに確認できるようにする

> **人間判断が必要:** 3D ライブラリ選定・3D アセット戦略・Firebase Storage との関係整理

### Example Issues

- [ ] 技術スパイク: `model-viewer`（Web Components）vs Three.js / React Three Fiber の評価
- [ ] 静的 GLB ネイルチップモデルの用意と Firebase Storage への格納方針の決定
- [ ] 3D プレビュー画面の実装（形状・カラー・テクスチャのプリセット選択）
- [ ] NailItem への将来フィールド追加検討（`shape` / `color` / `texture` / `modelUrl` / `materialPreset`）
- [ ] Firestore スキーマ拡張設計（マイグレーション戦略）
- [ ] 3D アセットのライセンス・サイズ・配信戦略の確定

### Human Gates

- G8: 3D ライブラリ追加（`package.json` 変更）— 人間の承認が必須
- G16: 3D アセット追加（GLB / GLTF / テクスチャファイル）— ライセンス・サイズ確認
- G3: Firestore スキーマ拡張（NailItem フィールド追加）
- G1: 3D 機能のスコープ・優先度決定

### Done Criteria

- [ ] 技術スパイクの結果が `docs/` にまとめられている
- [ ] 静的 GLB プレビューが少なくとも 1 形状で動作する
- [ ] プリセット（形状 / カラー / テクスチャ）が UI で選択できる
- [ ] 3D プレビューが既存の NailItem CRUD を壊していない
- [ ] `npm run build` が成功している
- [ ] 人間が 3D ライブラリ追加を承認している（G8）

---

## Phase 9: AR Try-on / Advanced Modeling

**Goal:** カメラ映像にリアルタイムでネイルを重ねて試せる AR Try-on と、高度なモデリング機能を実現する

> **人間判断が必要:** カメラ・画像処理のプライバシーポリシー、手の検出ライブラリ選定

### Example Issues

- [ ] 手のランドマーク検出（MediaPipe Hands 等）の技術スパイク
- [ ] ネイルチップの手への位置合わせ・オーバーレイ実装
- [ ] デコレーションパーツの配置 UI（ストーン・ラメ・アート）
- [ ] Modeling Lite: カラー・グラデーション・アートのカスタム描画
- [ ] AR プレビュー画面（カメラ映像 + リアルタイムオーバーレイ）
- [ ] プライバシーポリシーの策定（カメラ映像はサーバー送信しない旨の明記）
- [ ] 画像処理のオンデバイス / クラウド方針の決定

### Human Gates

- G8: AR / 画像処理ライブラリ追加（`package.json` 変更）— 人間の承認が必須
- G6: カメラ映像・個人情報の取り扱いポリシー — プライバシーインパクト評価が必要
- G17: AR / カメラアクセスのユーザー同意フロー設計
- G1: AR 機能のスコープ・優先度決定

### Done Criteria

- [ ] カメラ映像上にネイルオーバーレイがリアルタイムで表示される
- [ ] プライバシーポリシーがユーザーに提示されている
- [ ] カメラ映像がサーバーに送信されないことが確認されている
- [ ] AR 機能が既存の NailItem CRUD を壊していない
- [ ] `npm run build` が成功している
- [ ] 人間が AR ライブラリ追加を承認している（G8・G6・G17）

---

## フェーズ移行チェックリスト

フェーズを進める前に以下を確認してください。

- [ ] 現フェーズの Done Criteria をすべて満たしている
- [ ] 未解決の Human Gates がない
- [ ] `npm run build` が成功している
- [ ] 次フェーズの Human Gates を把握している
- [ ] 人間が次フェーズへの移行を承認している

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | プロダクト仕様 |
| [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md) | タスク完了基準 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | 人間確認が必要な条件 |
