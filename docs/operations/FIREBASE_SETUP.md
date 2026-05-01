# Firebase Setup Guide

> このドキュメントは Firebase Authentication のセットアップ・動作確認手順を定義します。  
> **AI はこの手順を実行しません。** セットアップ作業は人間が行ってください。

---

## プロジェクト情報

| 項目 | 値 |
|------|---|
| Firebase Project ID | `nail-report-dev-ksc0000` |
| Firebase Web App | `nail-report-web` |
| Firestore database | `(default)`, リージョン: `asia-northeast1` |
| 認証プロバイダー | Google Sign-In |
| Firestore Security Rules 現フェーズ | Phase 0 (deny-all) |

---

## 1. Firebase Console の初期設定（人間が実施）

### 1-1. Google Sign-In を有効にする

1. [Firebase Console](https://console.firebase.google.com/) を開く
2. プロジェクト `nail-report-dev-ksc0000` を選択
3. 左メニュー → **Authentication** → **Sign-in method** タブ
4. **Google** をクリック → 「有効にする」をオン
5. プロジェクトのサポートメール（自分のメールアドレス）を設定
6. **保存**

### 1-2. 承認済みドメインを確認する

**Authentication** → **Settings** → **承認済みドメイン** に以下が含まれていることを確認:

| ドメイン | 用途 | 追加方法 |
|---------|------|---------|
| `localhost` | ローカル開発 | デフォルトで追加済み |
| VS Code Tunnel URL | モバイル実機テスト | 手動追加（次節参照） |
| 本番 URL | Vercel / GitHub Pages | デプロイ時に手動追加 |

---

## 2. ローカル環境のセットアップ

### 2-1. `.env.local` の確認

プロジェクトルート (`C:\dev\agent-sandbox`) に `.env.local` が存在することを確認:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=nail-report-dev-ksc0000.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nail-report-dev-ksc0000
VITE_FIREBASE_STORAGE_BUCKET=nail-report-dev-ksc0000.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...:web:...
```

> `.env.local` は `.gitignore` によって Git 管理外です。コードに実際の値を書かないでください。  
> 値は Firebase Console → プロジェクト設定 → アプリ → Web アプリ設定 から取得できます。

### 2-2. 依存関係のインストール確認

```powershell
npm ls firebase
# → firebase@12.12.1 が表示されることを確認
```

---

## 3. ローカル動作確認手順

### 3-1. 開発サーバーの起動

```powershell
cd C:\dev\agent-sandbox
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

### 3-2. 認証フローの確認

ページ上部の `#auth-bar` エリアで以下を確認:

```text
[ ] 「Sign in with Google」ボタンが表示される
[ ] ボタンをクリックするとポップアップが開く
[ ] Google アカウントを選択するとサインインが完了する
[ ] サインイン後に displayName または email が表示される
[ ] 「Sign out」ボタンが表示される
[ ] 「Sign out」をクリックするとサインアウトが完了する
[ ] サインアウト後に「Sign in with Google」ボタンへ戻る
```

### 3-3. Firebase Console でユーザー登録を確認

**Authentication** → **Users** タブに今サインインしたアカウントの UID・メールアドレスが登録されていることを確認。

### 3-4. 対象ブラウザ

| ブラウザ | 確認項目 |
|---------|---------|
| Chrome (PC) | サインイン・サインアウト |
| Edge (PC) | サインイン・サインアウト |
| Safari (PC/Mac) | サインイン・サインアウト |

---

## 4. モバイル実機確認手順（VS Code Tunnel 経由）

### 4-1. VS Code Tunnel の起動

1. Windows PC で VS Code を開く
2. コマンドパレット（Ctrl+Shift+P）→ **Remote Tunnels: Turn on Remote Tunnel Access**
3. Tunnel URL（例: `https://xxx.devtunnels.ms`）をメモする

または、VS Code Tunnel CLI を使う:

```powershell
code tunnel
# → "Open this link in your browser: https://vscode.dev/tunnel/..."
```

### 4-2. Tunnel URL を Firebase Console に追加

1. Firebase Console → **Authentication** → **Settings** → **承認済みドメイン**
2. **ドメインを追加** をクリック
3. Tunnel の hostname を追加（例: `xxx.devtunnels.ms`）

> **注意:** `signInWithPopup` がモバイルブラウザで内部的にリダイレクトを使う場合、  
> Tunnel URL が承認済みドメインにないと `auth/unauthorized-domain` エラーになります。

### 4-3. スマートフォンから Tunnel 経由でアクセス

Tunnel URL (`https://xxx.devtunnels.ms:5173` 相当) をスマートフォンのブラウザで開く。

```text
[ ] iOS Safari でサインイン成功
[ ] iOS Safari でサインアウト成功
[ ] Android Chrome でサインイン成功
[ ] Android Chrome でサインアウト成功
```

---

## 5. エラー発生時のトラブルシューティング

### `auth/popup-blocked`

**原因:** ブラウザがポップアップをブロックしている  
**対処:** ブラウザの設定で `localhost:5173` のポップアップを許可する

### `auth/unauthorized-domain`

**原因:** アクセス中のドメインが Firebase Console の承認済みドメインに登録されていない  
**対処:** Firebase Console → Authentication → Settings → 承認済みドメインに該当ドメインを追加する

### `auth/configuration-not-found` / Firebase 初期化エラー

**原因:** `.env.local` の値が正しくないか、ファイルが存在しない  
**対処:**
1. `.env.local` が `C:\dev\agent-sandbox` に存在するか確認
2. `VITE_FIREBASE_*` 6つの変数が全て設定されているか確認
3. `npm run dev` を再起動する（`.env.local` は起動時に読み込まれるため）

### サインイン後にユーザー表示が出ない

**原因:** `onAuthStateChanged` が動作していない、または Firebase 初期化に失敗している  
**対処:** ブラウザの開発者ツール → Console でエラーを確認する

---

## 6. Firestore に関する注意事項

> **現在の Firestore Security Rules は Phase 0 (deny-all) です。**  
> Google Auth でサインインできても、Firestore への読み書きは全て拒否されます。  
> これは意図した動作です。Phase 1 への移行は別途人間が承認します（Issue #15 参照）。

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md) | Firestore Security Rules 設計と Phase 移行計画 |
| [LOCAL_DEVELOPMENT_MANUAL.md](./LOCAL_DEVELOPMENT_MANUAL.md) | ローカル開発手順全般 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | Human Gate 定義（G4: 認証・認可変更） |
