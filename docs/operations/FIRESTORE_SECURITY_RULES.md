# Firestore Security Rules Design

> **Status: Phase 1 Active — deployed 2026-05-14**
> このドキュメントは Firestore Security Rules の設計方針を定義します。
> `firestore.rules` の deploy は原則として人間が行ってください。AI が実行するのは、人間が明示的に委譲した場合のみです。
>
> **リポジトリ状態:** `firestore.rules` は Phase 1（認証ユーザー本人のみ read / write）です。
> **本番 deploy 状態:** 2026-05-14 01:35 JST に `nail-report-dev-ksc0000` へ deploy 済みです。
> **実行記録:** 人間の委譲承認に基づき Codex が `firebase deploy --only firestore:rules,storage --project nail-report-dev-ksc0000` を実行しました。

---

## 基本方針

| 原則 | 内容 |
|------|------|
| Deny by default | 明示的に許可されていない全ての読み書きを拒否する |
| 未認証 write 禁止 | `request.auth != null` を全ての write 条件に必須とする |
| UID 単位のアクセス制御 | `request.auth.uid == userId` でユーザーごとにデータを分離する |
| Firestore 本格利用は認証確認後 | Google Auth が本番で動作確認されるまで Firestore への書き込みを開始しない |
| rules deploy は手動 | 原則として人間が承認・deploy する。AI が実行するのは明示委譲時のみ |

---

## コレクション設計

### Phase 0（完了 / 過去）: Firestore 未使用

Firestore 利用開始前の安全な初期状態です。
全アクセスを deny にした rules を配置し、意図しない読み書きを防ぎます。

### Phase 1（リポジトリ上の現在）: ユーザー個人データ

```
Firestore (default)
└── users/
    └── {userId}/                  ← Firebase Auth の UID
        └── nailItems/
            └── {itemId}/          ← Firestore 自動生成 ID
                ├── title: string
                ├── imageUrl: string       ← Firebase Storage URL
                ├── thumbnailUrl: string
                ├── tags: string[]
                ├── createdAt: Timestamp
                └── updatedAt: Timestamp
```

**アクセスルール:**
- `users/{userId}/nailItems/{itemId}` — ログイン済み本人のみ read / write
- `userId` = Firebase Auth の `uid` と一致する場合のみ許可

### Phase 2（将来）: 公開サンプルデータ

```
Firestore (default)
└── publicSamples/
    └── {sampleId}/                ← 管理者が Firebase Console から追加
        ├── title: string
        ├── imageUrl: string
        ├── tags: string[]
        └── order: number
```

**アクセスルール:**
- 全員 read 可（未ログインでも閲覧可能）
- write は Firebase Console から手動のみ（クライアントからの write は禁止）

---

## フェーズ別 Rules

### Phase 0 — Deny All（過去の初期 rules）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**目的:** Firestore が初期化されているが、まだ何も使わない段階で意図しないアクセスを完全にブロックする。

---

### Phase 1 — 認証ユーザーの個人データ（現在の `firestore.rules`）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // User's private nail items — authenticated owner only
    match /users/{userId}/nailItems/{itemId} {
      allow read, write: if request.auth != null
                          && request.auth.uid == userId;
    }

    // User profile document — authenticated owner only
    match /users/{userId} {
      allow read, write: if request.auth != null
                          && request.auth.uid == userId;
    }
  }
}
```

**Phase 1 への移行条件（承認済み項目として記録）:**
1. Google Auth がブラウザ・スマートフォンで動作確認済み
2. `NailItem` データモデルが確定済み（[PRODUCT_SPEC.md](../product/PRODUCT_SPEC.md) の Q13 解決）
3. Human Gate G3（DB スキーマ変更）・G4（認証・認可変更）の承認取得
4. Firebase Emulator でのローカルテスト完了（任意だが推奨）

---

### Phase 2 — 公開サンプル追加（将来・人間承認後）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Public sample nail items — read only for everyone
    match /publicSamples/{sampleId} {
      allow read: if true;
      allow write: if false;  // Firebase Console のみ
    }

    // User's private nail items — authenticated owner only
    match /users/{userId}/nailItems/{itemId} {
      allow read, write: if request.auth != null
                          && request.auth.uid == userId;
    }

    // User profile — authenticated owner only
    match /users/{userId} {
      allow read, write: if request.auth != null
                          && request.auth.uid == userId;
    }
  }
}
```

---

## アクセス制御マトリクス

| コレクション | 未認証 read | 未認証 write | 認証済み自分 read | 認証済み自分 write | 認証済み他人 |
|-------------|------------|------------|----------------|-----------------|------------|
| `/{document=**}` (Phase 0) | ❌ | ❌ | ❌ | ❌ | ❌ |
| `users/{uid}/nailItems/*` (Phase 1+) | ❌ | ❌ | ✅ | ✅ | ❌ |
| `users/{uid}` (Phase 1+) | ❌ | ❌ | ✅ | ✅ | ❌ |
| `publicSamples/*` (Phase 2+) | ✅ | ❌ | ✅ | ❌ | ✅ |

---

## Deploy 手順（人間が実行する）

> **原則として AI はこの手順を実行しません。** 人間が確認・承認し、明示的に委譲した場合のみ AI が実行できます。

### 前提条件

```powershell
# Firebase CLI のインストール（未インストールの場合）
npm install -g firebase-tools

# Firebase にログイン
firebase login

# プロジェクトの確認
firebase projects:list
```

### Rules の deploy

```powershell
# プロジェクトディレクトリで実行
cd C:\dev\agent-sandbox

# ドライラン（実際には deploy しない）
firebase deploy --only firestore:rules --dry-run

# 本番 deploy（承認済みの場合のみ）
firebase deploy --only firestore:rules --project nail-report-dev-ksc0000
```

### Emulator でのローカルテスト

```powershell
# Firebase Emulator の起動
firebase emulators:start --only firestore

# ブラウザで Emulator UI を開く
# → http://localhost:4000
```

---

## セキュリティチェックリスト

Deploy 前に人間が確認する項目:

```text
[ ] rules_version が '2' になっている
[ ] デフォルト deny (match /{document=**} { allow read, write: if false; }) が含まれている
[ ] 全公開 write (allow write: if true) が存在しないことを確認
[ ] request.auth != null が全ての write 条件に含まれている
[ ] userId 比較が request.auth.uid == userId になっている（== であること）
[ ] publicSamples の write が if false になっている
[ ] Firebase Console で Rules の "Playground" 機能を使って動作確認済み
[ ] 本番 Project ID を確認している（nail-report-dev-ksc0000）
```

---

## Human Gate 対応

Firestore Security Rules は以下の Human Gate に該当します。

| Gate | 理由 | 対応 |
|------|------|------|
| **G3** DB スキーマ変更 | コレクション構造・フィールド定義 | Phase 1 移行前に人間承認 |
| **G4** 認証・認可変更 | UID ベースのアクセス制御ルール | Phase 1 移行前に人間承認 |
| **G6** セキュリティ関連変更 | Rules の変更は全てセキュリティ影響あり | 変更のたびに人間承認 |
| **G15** 本番公開判断 | `firebase deploy` は本番への公開 | 原則は人間実行。明示委譲時のみ AI 実行可 |

---

## 人間承認が必要な項目（優先度順）

| # | 項目 | 優先度 | Gate | 状態 |
|---|------|--------|------|------|
| A1 | Phase 0 rules の `firebase deploy` 実行 | **高** | G15 | ✅ 完了 2026-05-01 |
| A2 | Google Auth の実機動作確認完了 | **高** | G4 | ✅ 完了 2026-05-01 |
| A3 | `NailItem` データモデルの最終確定 | **高** | G3 | ✅ 完了 2026-05-01 |
| A4 | Phase 1 rules への移行承認 | 中 | G3/G4 | ✅ 承認済み 2026-05-01 / deploy 済み 2026-05-14 |
| A5 | Firebase Emulator セットアップ（任意だが推奨） | 中 | — | ⬜ 未完了 |
| A6 | `publicSamples` コレクション方針の確定 | 低 | G1 | ⬜ 未完了 |

---

## Deploy 記録

| # | 日付 | フェーズ | 実行コマンド | 実行者 | 結果 |
|---|------|---------|------------|--------|------|
| 1 | 2026-05-01 | Phase 0 (deny-all) | `firebase deploy --only firestore:rules --project nail-report-dev-ksc0000` | 人間 (ksc0000) | ✅ 成功 |
| 2 | 2026-05-14 | Phase 1 (認証ユーザー個人データ) | `firebase deploy --only firestore:rules,storage --project nail-report-dev-ksc0000` | Codex（ksc0000 承認） | ✅ 成功 |

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [LOCAL_DEVELOPMENT_MANUAL.md](./LOCAL_DEVELOPMENT_MANUAL.md) | ローカル開発手順 |
| [PRODUCT_SPEC.md](../product/PRODUCT_SPEC.md) | データモデル・プロダクト仕様 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | Human Gate 定義 |
| [ACCEPTANCE_CRITERIA.md](../product/ACCEPTANCE_CRITERIA.md) | セキュリティ変更の完了条件 |
