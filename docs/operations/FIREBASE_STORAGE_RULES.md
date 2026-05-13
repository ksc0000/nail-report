# Firebase Storage Security Rules Design

> **Status: Phase 2 Active — deployed 2026-05-14**
> このドキュメントは Firebase Storage Security Rules の設計方針を定義します。
> `storage.rules` の deploy は原則として人間が行ってください。AI が実行するのは、人間が明示的に委譲した場合のみです。
>
> **リポジトリ状態:** `storage.rules` は Phase 2（認証ユーザー本人のみ read / write / delete）です。
> **本番 deploy 状態:** 2026-05-14 01:35 JST に `nail-report-dev-ksc0000` へ deploy 済みです。
> **実行記録:** 人間の委譲承認に基づき Codex が `firebase deploy --only firestore:rules,storage --project nail-report-dev-ksc0000` を実行しました。

---

## 基本方針

| 原則 | 内容 |
|------|------|
| Deny by default | 明示的に許可されていない全ての操作を拒否する |
| 未認証アクセス禁止 | `request.auth != null` を全ての操作条件に必須とする |
| UID 単位のアクセス制御 | `request.auth.uid == userId` でユーザーごとにストレージを分離する |
| contentType 制限 | image/jpeg, image/png, image/webp のみ許可 |
| ファイルサイズ制限 | 5MB 以下のみ許可 |
| public read 禁止 | 未認証ユーザーの読み取りは完全に禁止 |
| deploy は手動 | 原則として人間が承認・deploy する。AI が実行するのは明示委譲時のみ |

---

## ストレージパス設計

```
gs://{storageBucket}/users/{uid}/nailItems/{nailItemId}/{filename}
```

| セグメント | 説明 |
|-----------|------|
| `users/{uid}` | Firebase Auth の UID — Firestore パスと一致 |
| `nailItems/{nailItemId}` | NailItem 単位のフォルダ — Firestore ドキュメント ID と対応 |
| `{filename}` | ファイル名（現行実装は `original`） — Rules は contentType で制約 |

**ファイル名の規則:**

| 用途 | ファイル名 |
|------|-----------|
| オリジナル画像（現行実装） | `original` |
| サムネイル（将来） | `thumb_400x400.jpg` |

---

## Storage Rules（Phase 2）

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    match /{allPaths=**} {
      allow read, write: if false;
    }

    match /users/{userId}/nailItems/{nailItemId}/{filename} {

      allow read: if request.auth != null
                  && request.auth.uid == userId;

      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size <= 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|webp)');

      allow delete: if request.auth != null
                    && request.auth.uid == userId;
    }
  }
}
```

---

## アクセス制御マトリクス

| 操作 | 未認証 | 認証済み（自分） | 認証済み（他人） |
|------|--------|----------------|----------------|
| read | ❌ | ✅ | ❌ |
| write (サイズ・type 適合) | ❌ | ✅ | ❌ |
| write (5MB 超) | ❌ | ❌ | ❌ |
| write (image 以外) | ❌ | ❌ | ❌ |
| delete | ❌ | ✅ | ❌ |

---

## 許可する contentType

| type | 理由 |
|------|------|
| `image/jpeg` | スマートフォン標準フォーマット |
| `image/png` | スクリーンショット・透過画像 |
| `image/webp` | 軽量モダンフォーマット |

**除外フォーマット:** GIF（アニメーション不要）、HEIC（Web での互換性問題）、PDF、BMP、SVG 等

---

## imageUrl / thumbnailUrl の保存方針

```
1. Storage にアップロード
2. getDownloadURL(ref) で署名付き URL を取得
3. Firestore NailItem の imageUrl に保存
4. thumbnailUrl = imageUrl（初期は同値）
```

**将来の thumbnailUrl 自動生成（現フェーズ対象外）:**
- Cloud Storage Resize Extension または Cloud Functions でサムネイル自動生成
- 生成後に Firestore の thumbnailUrl を更新

---

## Rules Playground 確認ケース

Firebase Console → Storage → Rules → **Playground** で以下を確認:

| # | 操作 | パス | uid | ファイルサイズ | contentType | 期待値 |
|---|------|------|-----|-------------|-------------|--------|
| 1 | read | `users/A/nailItems/xxx/original` | A | — | — | ✅ allow |
| 2 | write | `users/A/nailItems/xxx/original` | A | 3MB | image/jpeg | ✅ allow |
| 3 | write | `users/A/nailItems/xxx/original` | A | 3MB | image/png | ✅ allow |
| 4 | write | `users/A/nailItems/xxx/original` | A | 3MB | image/webp | ✅ allow |
| 5 | delete | `users/A/nailItems/xxx/original` | A | — | — | ✅ allow |
| 6 | read | `users/A/nailItems/xxx/original` | 未認証 | — | — | ❌ deny |
| 7 | write | `users/A/nailItems/xxx/original` | 未認証 | 3MB | image/jpeg | ❌ deny |
| 8 | read | `users/A/nailItems/xxx/original` | B | — | — | ❌ deny |
| 9 | write | `users/A/nailItems/xxx/original` | B | 3MB | image/jpeg | ❌ deny |
| 10 | delete | `users/A/nailItems/xxx/original` | B | — | — | ❌ deny |
| 11 | write | `users/A/nailItems/xxx/original` | A | 6MB | image/jpeg | ❌ deny (サイズ超過) |
| 12 | write | `users/A/nailItems/xxx/file.pdf` | A | 1MB | application/pdf | ❌ deny (type 不正) |

---

## Deploy 手順（人間が実行する）

```powershell
# プロジェクトディレクトリで実行
cd C:\dev\agent-sandbox

# ドライラン（実際には deploy しない）
firebase deploy --only storage --dry-run --project nail-report-dev-ksc0000

# 本番 deploy（承認済みの場合のみ）
firebase deploy --only storage --project nail-report-dev-ksc0000
```

---

## deploy 前のセキュリティチェックリスト

```text
[ ] rules_version が '2' になっている
[ ] デフォルト deny (match /{allPaths=**} { allow read, write: if false; }) が含まれている
[ ] request.auth != null が全ての操作条件に含まれている
[ ] uid 比較が request.auth.uid == userId になっている
[ ] サイズ上限が request.resource.size <= 5 * 1024 * 1024 になっている
[ ] contentType が image/(jpeg|png|webp) のみになっている
[ ] public read (allow read: if true) が存在しないことを確認
[ ] Firebase Console の Rules Playground で確認ケースを実施済み
[ ] 本番 Project ID を確認している（nail-report-dev-ksc0000）
```

---

## Human Gate 対応

| Gate | 理由 |
|------|------|
| **G4** 認証・認可変更 | UID ベースのアクセス制御ルール |
| **G6** セキュリティ関連変更 | Rules の変更は全てセキュリティ影響あり |
| **G15** 本番公開判断 | `firebase deploy` は本番への公開 |

---

## 人間承認が必要な項目

| # | 項目 | 状態 |
|---|------|------|
| S1 | Storage Rules Phase 2 内容の承認 | ✅ 承認済み 2026-05-02 |
| S2 | `firebase.json` への storage セクション追加の承認 | ✅ 承認済み 2026-05-02 |
| S3 | `firebase deploy --only storage` の実行 | ✅ 完了 2026-05-14 |
| S4 | Rules Playground での動作確認 | ⬜ 要確認 |

---

## Deploy 記録

| # | 日付 | 内容 | 実行者 | 結果 |
|---|------|------|--------|------|
| 1 | 2026-05-14 | Phase 2 Storage Rules 初回 deploy | Codex（ksc0000 承認） | ✅ 成功 |

---

## 実装状況との同期

以下はすでに現行実装に反映済みです。

1. `src/lib/firebase.ts` で `getStorage` + `storage` を export
2. `src/lib/storage.ts` で `uploadNailImage` / `deleteNailImage` を実装
3. `src/App.tsx` で画像アップロード UI（ファイル選択 → Storage upload → Firestore `imageUrl` 保存）を実装

残タスク:

1. Firebase Console の Rules Playground でアクセス制御ケースを確認する
2. [IMAGE_UPLOAD_QA.md](./IMAGE_UPLOAD_QA.md) に沿って実機動作を確認する

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md) | Firestore Security Rules 設計 |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Firebase 初期セットアップ手順 |
| [PRODUCT_SPEC.md](../product/PRODUCT_SPEC.md) | NailItem データモデル |
