# Product Specification

> **Status: MVP v0.1**
> Nailous の現行実装（PR #29〜#42）に基づいて更新されました（2026-05-03）。

---

## Product Vision

Nailous は、ネイル写真・メモ・タグをかんたんに残し、あとから見返し、必要な相手に共有できる、ネイル好きのためのパーソナルアーカイブです。

---

## Target Users

| ユーザー種別 | 説明 |
|------------|------|
| 主要ターゲット | ネイルを定期的に楽しみ、過去デザインを見返したい個人ユーザー |
| サブターゲット | サロン施術の記録、色・デザイン・価格・メモを残したいユーザー |
| 初期対象外 | サロン事業者向け CRM、予約管理、決済、スタッフ管理 |

---

## Problems to Solve

1. ネイル写真がスマホ内に散らばり、過去デザインを探しにくい
2. 色・季節・イベント・サロン情報を後から思い出せない
3. 次回サロン相談時に、過去デザインを共有しにくい
4. 自分の好みの変化や履歴を見返しにくい

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
| CSV / JSON エクスポート | ✅ 完了 |
| 共有リンク作成・停止・公開閲覧 | ✅ 完了 |
| 本番リリース runbook / smoke checklist | ✅ 完了 |
| Firestore Security Rules（オーナー本人のみ読み書き） | ✅ 完了 |
| Firebase Storage Security Rules（認証済み本人のみ） | ✅ 完了 |

---

## Non-MVP Scope（将来フェーズ）

- サムネイル自動生成（Cloud Storage Resize Extension）
- AI によるタグ提案・色分析（Gemini API 連携）
- モバイルアプリ（PWA / ネイティブ）
- リマインダー・次回サロン予約通知
- **3D Preview / Modeling / AR Try-on**（Phase 8〜9 — 将来フェーズ、現在未実装）

---

## Future Vision: 3D Preview / Modeling / AR Try-on

> このセクションは将来フェーズ（Phase 8〜9）の構想です。現在は実装されていません。

### 3D Preview（Phase 8）

ネイルチップの 3D モデルをインタラクティブにプレビューする機能。

| 機能 | 概要 |
|------|------|
| Static GLB Preview | 静的な GLB ネイルチップモデルの表示 |
| Shape Presets | ラウンド / スクエア / アーモンド等の形状プリセット |
| Color Presets | カラーパレットの適用 |
| Texture Presets | マット / グロス / ラメ等のテクスチャ |
| 技術候補 | `model-viewer`（Web Components）または Three.js / React Three Fiber |

### Modeling Lite（Phase 9）

カラー・グラデーション・デコレーションのカスタム描画・配置機能。

| 機能 | 概要 |
|------|------|
| Decoration Parts | ストーン・ラメ・アートパーツの配置 UI |
| Custom Drawing | グラデーション・フレンチ等のカスタム描画 |

### AR Try-on（Phase 9）

カメラ映像にリアルタイムでネイルをオーバーレイする試着機能。

| 機能 | 概要 |
|------|------|
| Hand Landmark Detection | MediaPipe Hands 等によるリアルタイム手検出 |
| Nail Placement Overlay | ネイルチップの指への位置合わせと重畳表示 |
| Privacy Policy | カメラ映像はオンデバイス処理・サーバー非送信を明記 |

---

### NailItem 将来フィールド（Phase 8〜9 以降）

> 現在の Firestore スキーマへの追加候補です。追加時は Human Gate G3（スキーマ変更）が必要です。

| フィールド | 型 | 説明 | 追加フェーズ |
|---|---|---|---|
| `shape` | `string` | ネイル形状プリセット（round / square / almond / coffin / stiletto） | Phase 8 |
| `color` | `string` | カラーコード（例: `#AA3BFF`）または カラー名 | Phase 8 |
| `texture` | `string` | テクスチャプリセット（matte / gloss / glitter / chrome） | Phase 8 |
| `modelUrl` | `string` | Firebase Storage 上の GLB モデル URL | Phase 8 |
| `materialPreset` | `string` | マテリアルプリセット識別子 | Phase 8 |
| `decorationParts` | `string[]` | デコレーションパーツ識別子の配列 | Phase 9 |

> **注意:** これらのフィールドは現在の `NailItemInput` / `NailItemDoc` 型に含まれていません。追加する際は `src/lib/firestore.ts` の型定義変更・Firestore マイグレーション戦略・UI 実装を合わせて計画してください。

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
- `color` / AI フィールドはスキップ — AI タグ提案は既存 `tags` にユーザー確認後の文字列として保存する。
- `tags` は `string[]` のままで構造化しない — スタイル・色・シーンを自由に分類できる柔軟性を優先。

**アクセスルール（Phase 1 Security Rules 移行後）:**
- `users/{userId}/nailItems/{itemId}` — ログイン済み本人のみ read / write

---

## AI Features

現在: 画像から AI タグ提案を行う UI は実装済み。ただし `VITE_ENABLE_AI_TAG_SUGGESTION=true` の時だけ表示・実行される。

商用 MVP: AI タグ提案を有効化するかは production gate で判断する。既定では無効にし、OCR と類似推薦は post-launch 候補として扱う。

将来候補:
- [x] AI によるネイルタグ自動提案（色・スタイル分析）
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
| デプロイ先 | Firebase Hosting | 確定 |
| Firebase project 方針 | development / production を分離 | 確定 |
| アプリ名 | Nailous | 確定 |
| production Firebase project ID | `nailous-prod` | 確定 |
| 初期 production URL | `https://nailous-prod.web.app` | production project 作成後に使用 |
| カスタムドメイン | 商用 MVP 初回リリースでは defer。`nailous` 関連ドメイン取得後に Firebase Hosting へ接続 | post-launch / human gate |
| 本番 deploy | human 承認後のみ実行 | 確定 |
| 対応ブラウザ | モダンブラウザ（Chrome / Safari / Firefox 最新版） | 暫定 |
| 画像ファイル制限 | jpeg / png / webp、5MB 以下 | 確定 |

---

## Open Questions Requiring Human Input

| # | 質問 | 優先度 | 担当 |
|---|------|--------|------|
| Q5 | モバイル対応のレベル感（レスポンシブのみ / PWA / ネイティブ） | 中 | 人間 |
| Q1 | ✅ **解決済み** — 個人向けネイル記録・共有アーカイブとして定義（2026-06-12） | — | — |
| Q2 | ✅ **解決済み** — Firestore + Firebase Storage で永続化（2026-05-01） | — | — |
| Q3 | ✅ **解決済み** — Google OAuth で認証（2026-05-01） | — | — |
| Q4 | ✅ **解決済み** — Firebase Hosting + dev/prod Firebase project 分離（2026-06-12） | — | — |
| Q13 | ✅ **解決済み** — NailItem Firestore スキーマ確定（2026-05-01） | — | — |

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [ROADMAP.md](./ROADMAP.md) | 開発ロードマップ |
| [3D_ASSET_DELIVERY_STRATEGY.md](./3D_ASSET_DELIVERY_STRATEGY.md) | 3D アセット配信戦略 |
| [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md) | タスク完了基準 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | 人間確認が必要な条件 |
| [PRODUCTION_RELEASE_RUNBOOK.md](../operations/PRODUCTION_RELEASE_RUNBOOK.md) | 本番リリース手順 |
| [PRODUCTION_SMOKE_TEST_CHECKLIST.md](../operations/PRODUCTION_SMOKE_TEST_CHECKLIST.md) | 本番 smoke test checklist |
