# Product Specification

> **Status: Draft / Template**
> このドキュメントはプロダクト仕様の雛形です。
> 詳細仕様が確定次第、各セクションを更新してください。
> 未確定の項目は `[TBD]` または `[要人間判断]` と記載しています。

---

## Product Vision

> このプロダクトが何を実現しようとしているかを1〜2文で表現します。

**[TBD — 人間が記入する]**

例:
```
ユーザーが日常のタスクを素早く整理・管理できる、
シンプルで快適な Todo アプリを提供する。
```

---

## Target Users

> 誰のために作るかを定義します。

**[TBD — 人間が記入する]**

| ユーザー種別 | 説明 |
|------------|------|
| 主要ターゲット | 例: 個人ユーザー / チームメンバー |
| サブターゲット | 例: モバイルユーザー |

---

## Problems to Solve

> このプロダクトが解決しようとしている課題を列挙します。

**[TBD — 人間が記入する]**

1. 
2. 
3. 

---

## MVP Scope

> 最初のリリースに含める最小限の機能を定義します。

現在実装済みの機能（コードより確認）:

- [x] Todo の追加（テキスト入力 + Enter / ボタン）
- [x] Todo の完了/未完了トグル
- [x] Todo の削除
- [x] 完了済み Todo の視覚的な区別（打ち消し線）

MVP 追加候補（**[要人間判断]**）:

- [ ] Todo の永続化（localStorage / バックエンド）
- [ ] Todo の編集
- [ ] Todo のフィルタリング（全て / 未完了 / 完了済み）

---

## Non-MVP Scope

> MVP には含めないが、将来対応する機能を定義します。

**[TBD — 人間が記入する]**

- ユーザー認証・マルチユーザー対応
- チーム共有機能
- リマインダー・通知機能
- モバイルアプリ対応
- データエクスポート（CSV / JSON）

---

## Key Screens

> 主要な画面とその目的を定義します。

**[TBD — 人間が記入する / デザイン確定後に更新]**

| 画面名 | 目的 | 状態 |
|--------|------|------|
| メイン画面 | Todo の一覧表示・追加・完了・削除 | 実装済み |
| [追加候補] | | [TBD] |

---

## Data Model Overview

> アプリが扱うデータの概要を定義します。

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
- `memo` を追加 — サロン名・価格・シーンのメモニーズに対応。今入れないと後でマイグレーションが必要。
- `color` / AI フィールドはスキップ — Gemini API 連携フェーズ（Phase 3 以降）で追加。今追加しても入力 UI がない。
- `tags` は `string[]` のままで構造化しない — スタイル・色・シーンを自由に分類できる柔軟性を優先。

**アクセスルール（Phase 1 Security Rules 移行後）:**
- `users/{userId}/nailItems/{itemId}` — ログイン済み本人のみ read / write

---

### Todo（フロントエンド state のみ — 開発用スキャフォールド）

現在の実装に残っている Todo 機能は開発用の足場であり、将来削除予定です。

```typescript
interface Todo {
  id: number
  text: string
  completed: boolean
}
```

DB / ストレージ方式: なし（フロントエンド state のみ）

---

## AI Features

> このプロダクトに組み込む AI 機能（将来的な計画含む）を定義します。

**[TBD — 人間が記入する]**

現在: AI 支援**開発**ツールとして活用（プロダクト機能としての AI は未実装）

将来候補:
- [ ] AI による Todo の自動分類・優先度提案
- [ ] 自然言語での Todo 入力補助
- [ ] スケジュール提案

---

## Operational Constraints

> 運用上の制約・非機能要件を定義します。

| 制約 | 内容 | 状態 |
|------|------|------|
| ビルドシステム | Vite + React + TypeScript | 確定 |
| Node.js バージョン | 22 | 確定（CI より） |
| 外部ライブラリ追加 | 人間の承認が必要（Human Gate G8） | 確定 |
| CSS フレームワーク | なし（通常 CSS のみ） | 確定 |
| バックエンド | [TBD] | 未確定 |
| デプロイ先 | [TBD] | 未確定 |
| 対応ブラウザ | [TBD] | 未確定 |
| パフォーマンス要件 | [TBD] | 未確定 |

---

## Open Questions Requiring Human Input

> 仕様を確定させるために、人間の判断が必要な未解決事項を列挙します。

| # | 質問 | 優先度 | 担当 |
|---|------|--------|------|
| Q1 | プロダクトのビジョン・ターゲットユーザーは何か | 高 | 人間 |
| Q2 | Todo の永続化は必要か・どこに保存するか | 高 | 人間 |
| Q3 | ユーザー認証は MVP に含めるか | 高 | 人間 |
| Q4 | デプロイ先は何を使うか | 中 | 人間 |
| Q5 | モバイル対応のレベル感（レスポンシブのみ / アプリ） | 中 | 人間 |
| Q6 | プロダクト名 | 低 | 人間 |
| Q13 | NailItem Firestore スキーマの最終確定 | 高 | ✅ **確定 2026-05-01** — Data Model Overview 参照 |

これらの質問に回答が必要な場合は [HUMAN_TASK_REQUEST.md](../harness/HUMAN_TASK_REQUEST.md) を使って Issue を起票してください。

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [ROADMAP.md](./ROADMAP.md) | 開発ロードマップ |
| [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md) | タスク完了基準 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | 人間確認が必要な条件 |
