# Firebase Storage Security Rules Design

> **Status: Phase 2 Ready — deploy 待ち（人間が実行）**
> このドキュメントは Firebase Storage Security Rules の設計方針を定義します。
> `storage.rules` の deploy は必ず人間が行ってください。AI は deploy しません。

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
| deploy は手動 | AI は `firebase deploy` を実行しない。人間が承認・deploy する |

---

## ストレージパス設計

```
gs://{storageBucket}/users/{uid}/nailItems/{nailItemId}/{filename}
```

| セグメント | 説明 |
|-----------|------|
| `users/{uid}` | Firebase Auth の UID — Firestore パスと一致 |
| `nailItems/{nailItemId}` | NailItem 単位のフォルダ — Firestore ドキュメント ID と対応 |
| `{filename}` | ファイル名（例: `original.jpg`） — Rules は contentType で制約 |

**ファイル名の推奨規則（実装時）:**

| 用途 | ファイル名 |
|------|-----------|
| オリジナル画像 | `original.jpg` / `original.png` / `original.webp` |
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
| 1 | read | `users/A/nailItems/xxx/original.jpg` | A | — | — | ✅ allow |
| 2 | write | `users/A/nailItems/xxx/original.jpg` | A | 3MB | image/jpeg | ✅ allow |
| 3 | write | `users/A/nailItems/xxx/original.png` | A | 3MB | image/png | ✅ allow |
| 4 | write | `users/A/nailItems/xxx/original.webp` | A | 3MB | image/webp | ✅ allow |
| 5 | delete | `users/A/nailItems/xxx/original.jpg` | A | — | — | ✅ allow |
| 6 | read | `users/A/nailItems/xxx/original.jpg` | 未認証 | — | — | ❌ deny |
| 7 | write | `users/A/nailItems/xxx/original.jpg` | 未認証 | 3MB | image/jpeg | ❌ deny |
| 8 | read | `users/A/nailItems/xxx/original.jpg` | B | — | — | ❌ deny |
| 9 | write | `users/A/nailItems/xxx/original.jpg` | B | 3MB | image/jpeg | ❌ deny |
| 10 | delete | `users/A/nailItems/xxx/original.jpg` | B | — | — | ❌ deny |
| 11 | write | `users/A/nailItems/xxx/original.jpg` | A | 6MB | image/jpeg | ❌ deny (サイズ超過) |
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
| S3 | `firebase deploy --only storage` の実行 | ⬜ 実行待ち |
| S4 | Rules Playground での動作確認 | ⬜ 未完了 |

---

## Deploy 記録

| # | 日付 | 内容 | 実行者 | 結果 |
|---|------|------|--------|------|
| 1 | — | Phase 2 Storage Rules 初回 deploy | 人間 (ksc0000) | ⬜ 実行待ち |

---

## 次フェーズ（PR B）

Storage Rules deploy 完了後に実施:

1. `src/lib/firebase.ts` に `getStorage` + `storage` export を追加
2. `src/lib/storage.ts` を新規作成（uploadImage / deleteImage 関数）
3. `src/App.tsx` に画像アップロード UI を追加（ファイル選択 → アップロード → imageUrl 保存）

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md) | Firestore Security Rules 設計 |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Firebase 初期セットアップ手順 |
| [PRODUCT_SPEC.md](../product/PRODUCT_SPEC.md) | NailItem データモデル |
