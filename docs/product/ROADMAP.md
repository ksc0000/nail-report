# Development Roadmap

このドキュメントは、AI 支援開発の進行順序を定義するロードマップです。  
各フェーズは順番に進める必要はなく、プロダクト方針に応じて調整してください。

> **Note:** フェーズ間の移行判断は人間が行います。  
> AI は現在のフェーズ内のタスクのみを実行してください。

---

## フェーズ一覧

| フェーズ | 名称 | 状態 |
|----------|------|------|
| Phase 0 | Harness Foundation | ✅ 進行中 |
| Phase 1 | Core UI | 🔲 未着手 |
| Phase 2 | Data Persistence | 🔲 未着手 |
| Phase 3 | Authentication / User Management | 🔲 未着手 |
| Phase 4 | AI-Assisted Features | 🔲 未着手 |
| Phase 5 | Review / Export / Sharing | 🔲 未着手 |
| Phase 6 | Security / Operations Hardening | 🔲 未着手 |
| Phase 7 | Release Preparation | 🔲 未着手 |

---

## Phase 0: Harness Foundation

**Goal:** AI 支援開発を安全・安定に運用するための基盤を整備する

### Example Issues

- [x] AI 役割エージェント定義（`agents/` ディレクトリ）
- [x] PowerShell コマンド整備（`commands/` ディレクトリ）
- [x] GitHub Actions CI 整備（CSS guard + build）
- [x] Branch Ruleset 設定（main 保護）
- [ ] Harness ドキュメント整備（`docs/harness/`）
- [ ] プロダクト仕様雛形作成（`docs/product/`）
- [ ] ローカル開発マニュアル作成（`docs/operations/`）

### Human Gates

- G10: `.github/workflows` 変更
- G11: Ruleset / CI 変更

### Done Criteria

- [x] AI が安全なフローで作業できる環境が整っている
- [x] CSS guard が CI で動作している
- [x] build が CI で検証されている
- [ ] ドキュメント一式が `docs/` に揃っている
- [ ] README に全ドキュメントへのリンクがある

---

## Phase 1: Core UI

**Goal:** 基本的な Todo アプリの UI を完成させる

### Example Issues

- [ ] レスポンシブ対応（スマートフォン表示の最適化）
- [ ] Todo フィルタリング（全て / 未完了 / 完了済み）
- [ ] Todo の編集機能
- [ ] 空状態の表示改善
- [ ] アクセシビリティ対応（`aria-label` 等）

### Human Gates

- G2: UI/UX の大きな変更（レイアウト全面変更時）
- G1: 機能スコープの変更（プロダクト方針）

### Done Criteria

- [ ] 主要なユーザーストーリーが画面で確認できる
- [ ] スマートフォン / デスクトップで表示が崩れない
- [ ] `npm run build` が成功する
- [ ] CSS guard が通過する
- [ ] 既存の Todo CRUD 機能が壊れていない

---

## Phase 2: Data Persistence

**Goal:** Todo データを永続化し、リロードしてもデータが残るようにする

> **人間判断が必要:** 永続化方式（localStorage / バックエンド / クラウド DB）の決定

### Example Issues

- [ ] localStorage による Todo 永続化
- [ ] データ構造の設計（`id`, `createdAt` 等の追加）
- [ ] データマイグレーション戦略

### Human Gates

- G1: 永続化方式の決定（プロダクト方針）
- G3: DB スキーマ変更（バックエンド導入時）
- G8: 新しいライブラリ追加（バックエンド SDK 等）

### Done Criteria

- [ ] ページをリロードしても Todo が消えない
- [ ] データが破損せずに読み書きされる
- [ ] 永続化エラー時のフォールバックがある（または方針が決まっている）

---

## Phase 3: Authentication / User Management

**Goal:** 複数ユーザーが個別の Todo を管理できるようにする

> **人間判断が必要:** 認証方式・プロバイダーの決定

### Example Issues

- [ ] 認証プロバイダー選定（GitHub OAuth / Google / Supabase 等）
- [ ] ログイン / ログアウト画面
- [ ] ユーザー別の Todo 管理
- [ ] セッション管理

### Human Gates

- G4: 認証・認可変更
- G5: （課金モデルと連動する場合）
- G6: 個人情報の取り扱い
- G7: 外部 API キーの管理
- G8: 認証ライブラリの追加

### Done Criteria

- [ ] ログイン / ログアウトが動作する
- [ ] ユーザーごとに独立した Todo が表示される
- [ ] セキュリティレビュー（Security Reviewer）が完了している

---

## Phase 4: AI-Assisted Features

**Goal:** プロダクトに AI 機能を組み込む

> **人間判断が必要:** どの AI 機能を組み込むかの方針決定

### Example Issues

- [ ] AI による Todo 優先度提案
- [ ] 自然言語での Todo 追加（例: 「明日の会議の準備」→ 自動分解）
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

## Phase 5: Review / Export / Sharing

**Goal:** Todo の振り返り・共有・エクスポート機能を追加する

> **人間判断が必要:** 共有機能のスコープ決定

### Example Issues

- [ ] CSV / JSON エクスポート
- [ ] 完了履歴の振り返り画面
- [ ] 共有 URL / 公開リスト機能
- [ ] 定期レポート機能

### Human Gates

- G1: 共有機能の方針（公開 / 限定公開 / 非公開）
- G6: 共有時の個人情報取り扱い

### Done Criteria

- [ ] エクスポート / 共有機能が動作する
- [ ] 共有時のプライバシー設定が明確

---

## Phase 6: Security / Operations Hardening

**Goal:** セキュリティと運用品質を強化する

### Example Issues

- [ ] セキュリティヘッダーの設定（CSP 等）
- [ ] 入力バリデーションの強化
- [ ] エラーログ / 監視の整備
- [ ] レートリミット設定
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

**Goal:** 本番公開の準備を完了させる

> **人間判断が必要:** 公開タイミング・デプロイ先の決定

### Example Issues

- [ ] デプロイ先の決定と設定（Vercel / Netlify / Cloudflare Pages 等）
- [ ] カスタムドメイン設定
- [ ] 本番ビルド最適化
- [ ] アクセス解析 / モニタリング設定
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
