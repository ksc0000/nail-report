# Product Specification

> **Status: MVP v0.1**
> Nailous の現行実装（PR #29〜#42）に基づいて更新されました（2026-05-03）。

---

## Product Vision

> **[TBD — 人間が記入する]**
>
> 例:
> ```
> 自分だけのネイルコレクションをかんたんに記録・整理できる、
> ネイル好きのためのパーソナルアーカイブアプリ。
> ```

---

## Target Users

> **[TBD — 人間が記入する]**

| ユーザー種別 | 説明 |
|------------|------|
| 主要ターゲット | ネイルアートを日常的に楽しむ個人ユーザー |
| サブターゲット | サロン通いの記録を残したいユーザー |

---

## Problems to Solve

> **[TBD — 人間が記入する]**

1. お気に入りのネイルデザインを写真・メモとともに整理したい
2. サロン名・価格・タグで後から検索・絞り込みしたい
3. 自分のネイル履歴を時系列で振り返りたい

---

## MVP Scope（v0.1 実装済み）

| 機能 | 状態 |
|------|------|
| Google アカウントでログイン / ログアウト | ✅ 完了 |
| ネイルアイテムの追加（タイトル・タグ・メモ・画像） | ✅ 完了 |
| ネイルアイテムの編集 | ✅ 完了 |
| ネイルアイテムの削除（確認ダイアログあり） | ✅ 完了 |
| 画像アップロード（jpeg / png / webp、5MB 以下） | ✅ 完了 |
| 新着順ソート（updatedAt / createdAt 降順） | ✅ 完了 |
| タイトル・タグによるクライアント検索 | ✅ 完了 |
| 作成日・更新日の表示 | ✅ 完了 |
| 初回ユーザー向け空状態ガイド | ✅ 完了 |
| Firestore Security Rules（オーナー本人のみ読み書き） | ✅ 完了 |
| Firebase Storage Security Rules（認証済み本人のみ） | ✅ 完了 |

---

## Non-MVP Scope（将来フェーズ）

- サムネイル自動生成（Cloud Storage Resize Extension）
- AI によるタグ提案・色分析（Gemini API 連携）
- コレクション共有・公開機能
- モバイルアプリ（PWA / ネイティブ）
- データエクスポート（CSV / JSON）
- リマインダー・次回サロン予約通知

---

## Key Screens

| 画面名 | 目的 | 状態 |
|--------|------|------|
| ログイン画面 | Google OAuth でサインイン | ✅ 完了 |
| コレクション一覧 | NailItem カードグリッド、検索、ソート | ✅ 完了 |
| 追加 / 編集フォーム | タイトル・タグ・メモ・画像の入力 | ✅ 完了 |
| 空状態ガイド | 初回ユーザー向けオンボーディング | ✅ 完了 |

---

## Data Model Overview

### NailItem（Firestore — Phase 1 以降）

> **スキーマ確定: 2026-05-01 (A3 完了)**

```
Firestore (default) / users/{userId}/nailItems/{itemId}
```

| フィールド | 型 | 必須 | 制約 | 説明 |
|-----------|-----|------|------|------|
| `title` | `string` | ✅ | — | ネイルタイトル |
| `imageUrl` | `string` | ✅ | Firebase Storage URL | フル解像度画像 |
| `thumbnailUrl` | `string` | ✅ | Firebase Storage URL | サムネイル画像（初期は imageUrl と同値でも可） |
| `tags` | `string[]` | ✅ | 最大 10 件、空配列可 | スタイル・色・シーン等のタグ |
| `memo` | `string` | ✅ | 最大 500 文字、空文字可 | サロン名・価格・シーン等のメモ |
| `createdAt` | `Timestamp` | ✅ | サーバータイムスタンプ | 作成日時 |
| `updatedAt` | `Timestamp` | ✅ | サーバータイムスタンプ | 更新日時 |

**型定義（TypeScript）:**

```typescript
interface NailItem {
  title: string
  imageUrl: string
  thumbnailUrl: string
  tags: string[]
  memo: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**決定事項:**
- `thumbnailUrl` を `imageUrl` と別フィールドで保持 — モバイルリスト表示でフル解像度は重い。将来 Cloud Storage Resize Extension で自動生成可能。
- `memo` を追加 — サロン名・価格・シーンのメモニーズに対応。
- `color` / AI フィールドはスキップ — Gemini API 連携フェーズ（Phase 4 以降）で追加。
- `tags` は `string[]` のままで構造化しない — スタイル・色・シーンを自由に分類できる柔軟性を優先。

**アクセスルール（Phase 1 Security Rules 移行後）:**
- `users/{userId}/nailItems/{itemId}` — ログイン済み本人のみ read / write

---

## AI Features

> **[TBD — 人間が記入する]**

現在: AI 支援**開発**ツールとして活用（プロダクト機能としての AI は未実装）

将来候補:
- [ ] AI によるネイルタグ自動提案（色・スタイル分析）
- [ ] 画像からサロン名・価格を自動読み取り（OCR）
- [ ] 類似ネイル推薦

---

## Operational Constraints

| 制約 | 内容 | 状態 |
|------|------|------|
| ビルドシステム | Vite + React + TypeScript | 確定 |
| Node.js バージョン | 22 | 確定（CI より） |
| 外部ライブラリ追加 | 人間の承認が必要（Human Gate G8） | 確定 |
| CSS フレームワーク | なし（通常 CSS のみ） | 確定 |
| バックエンド | Firebase（Auth / Firestore / Storage） | 確定 |
| デプロイ先 | [TBD] | 未確定 |
| 対応ブラウザ | モダンブラウザ（Chrome / Safari / Firefox 最新版） | 暫定 |
| 画像ファイル制限 | jpeg / png / webp、5MB 以下 | 確定 |

---

## Open Questions Requiring Human Input

| # | 質問 | 優先度 | 担当 |
|---|------|--------|------|
| Q1 | プロダクトのビジョン・ターゲットユーザーの正式定義 | 高 | 人間 |
| Q4 | デプロイ先は何を使うか（Firebase Hosting / Vercel 等） | 中 | 人間 |
| Q5 | モバイル対応のレベル感（レスポンシブのみ / PWA / ネイティブ） | 中 | 人間 |
| Q2 | ✅ **解決済み** — Firestore + Firebase Storage で永続化（2026-05-01） | — | — |
| Q3 | ✅ **解決済み** — Google OAuth で認証（2026-05-01） | — | — |
| Q13 | ✅ **解決済み** — NailItem Firestore スキーマ確定（2026-05-01） | — | — |

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [ROADMAP.md](./ROADMAP.md) | 開発ロードマップ |
| [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md) | タスク完了基準 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | 人間確認が必要な条件 |
