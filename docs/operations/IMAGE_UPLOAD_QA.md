# Image Upload QA Checklist

> Firebase Storage 画像アップロード機能の回帰確認チェックリストです。
> 機能変更・ライブラリ更新・Storage Rules 変更後に実施してください。
> **AI はこのリストを実機確認できません。** 人間が手動で確認してください。

---

## 事前条件

以下がすべて揃っていることを確認してから QA を開始してください。

```text
[ ] Firebase Console で Google Auth が有効になっている
[ ] Firebase Console で Firestore (default) が asia-northeast1 に作成済み
[ ] Firebase Console で Storage bucket が作成済み
[ ] storage.rules が firebase deploy --only storage 済み
[ ] .env.local の VITE_FIREBASE_STORAGE_BUCKET が Firebase Console の bucket 名と一致している
[ ] npm run dev が起動している（http://localhost:5173）
[ ] Google アカウントでサインイン済み
```

---

## 1. 正常系

### 1-1. 画像なしで NailItem を追加する

```text
[ ] Title のみ入力し、ファイルを選択せずに Add をクリック
[ ] カードが追加される
[ ] カードのサムネイル部分に "No image" プレースホルダーが表示される
[ ] Firebase Console > Firestore > users/{uid}/nailItems/{id} を開く
    → imageUrl が空文字 ("") であることを確認
[ ] Firebase Console > Storage > Files を開く
    → users/{uid}/nailItems/{id}/ フォルダが存在しないことを確認
```

### 1-2. jpeg 画像（5MB 以下）を追加する

```text
[ ] Title を入力し、5MB 以下の .jpg ファイルを選択して Add をクリック
[ ] ボタンが "Saving..." になる
[ ] Saving が解除されカードが追加される
[ ] カードのサムネイルに画像が表示される
[ ] Firebase Console > Firestore > imageUrl に https://firebasestorage.googleapis.com/... が保存されている
[ ] Firebase Console > Storage > Files > users/{uid}/nailItems/{id}/original が存在する
```

### 1-3. png 画像（5MB 以下）を追加する

```text
[ ] 5MB 以下の .png ファイルを選択して Add
[ ] 正常にアップロードされカードにサムネイルが表示される
```

### 1-4. webp 画像（5MB 以下）を追加する

```text
[ ] 5MB 以下の .webp ファイルを選択して Add
[ ] 正常にアップロードされカードにサムネイルが表示される
```

---

## 2. 異常系

### 2-1. PDF を選択したとき

```text
[ ] ファイル選択ダイアログで .pdf ファイルを選択する
[ ] フォーム下に「jpeg・png・webp 形式の画像を選択してください。」が表示される
[ ] ボタンは "Saving..." にならない
[ ] Firebase Storage へのリクエストが発生しない（ブラウザ DevTools > Network で確認）
[ ] Firebase Console > Firestore にドキュメントが追加されていない
```

### 2-2. GIF を選択したとき

```text
[ ] .gif ファイルを選択する
[ ] 「jpeg・png・webp 形式の画像を選択してください。」が表示される
[ ] Saving にならない
```

### 2-3. 5MB 超の画像を選択したとき

```text
[ ] 5MB を超える jpeg/png/webp を選択する
[ ] 「ファイルサイズは 5MB 以下にしてください（選択: X.X MB）。」が表示される
    ※ X.X には実際のファイルサイズ（MB）が表示される
[ ] Saving にならない
[ ] Firebase Storage へのリクエストが発生しない
```

### 2-4. 不正ファイル選択後に有効ファイルを再選択する

```text
[ ] PDF を選択してエラーを表示させる
[ ] 続けて有効な jpeg（5MB 以下）を選択する
[ ] エラーメッセージが消える
[ ] Add をクリックすると正常にアップロードされる
```

### 2-5. Cancel ボタンを押す

```text
[ ] 不正ファイルを選択してエラーを表示させる
[ ] Edit モードで Cancel をクリック（または Add 状態でフォームをリセット）
[ ] エラーメッセージが消える
[ ] ファイル選択状態がリセットされる
[ ] プレビュー画像が非表示になる
```

---

## 2-6. ファイルプレビュー表示

```text
[ ] 有効な jpeg（5MB 以下）を選択する
[ ] ファイル入力の下にプレビュー画像が表示される
[ ] ファイル名とファイルサイズ（X.XMB）が表示される
[ ] 「削除」ボタンが表示される
```

### 2-7. プレビューの「削除」ボタン

```text
[ ] 有効な画像を選択してプレビューを表示させる
[ ] 「削除」ボタンをクリック
[ ] プレビュー画像が消える
[ ] ファイル名・サイズ表示が消える
[ ] ファイル入力がリセットされる（別のファイルを再選択できる）
[ ] エラーメッセージが表示されない
[ ] Add をクリックしても画像なしで登録される
```

---

## 3. 編集（Edit）

### 3-1. 画像未選択のまま Update する

```text
[ ] 画像付きの NailItem の Edit をクリック
[ ] フォームに「現在の画像を維持します。変更するには新しい画像を選択してください。」が表示されることを確認
[ ] プレビュー画像は表示されない（既存画像はサーバー側のみ）
[ ] ファイルを選択せずに Title や Tags を変更して Update
[ ] カードが更新される
[ ] 既存のサムネイル画像が保持されている
[ ] Firebase Console > Firestore > imageUrl が変わっていないことを確認
[ ] Firebase Console > Storage > original ファイルが変わっていないことを確認
```

### 3-2. 新しい画像を選択して Update する

```text
[ ] 画像付きの NailItem の Edit をクリック
[ ] 別の jpeg（5MB 以下）を選択して Update
[ ] カードのサムネイルが新しい画像に差し替わる
[ ] Firebase Console > Firestore > imageUrl が新しい URL に更新されている
[ ] Firebase Console > Storage > original ファイルが新しいファイルに上書きされている
```

### 3-3. 画像なしアイテムに画像を追加する Edit

```text
[ ] 画像なし（"No image" プレースホルダー）の NailItem の Edit をクリック
[ ] "Current image kept." ヒントが表示されないことを確認（既存画像がないため）
[ ] jpeg を選択して Update
[ ] カードのサムネイルに画像が表示される
```

---

## 4. 削除（Delete）

### 4-1. 画像付き NailItem を削除する

```text
[ ] 画像付きの NailItem の Delete をクリック
[ ] カードがリストから消える
[ ] Firebase Console > Firestore > 該当ドキュメントが削除されている
[ ] Firebase Console > Storage > users/{uid}/nailItems/{id}/original が削除されている
```

### 4-2. 画像なし NailItem を削除する

```text
[ ] "No image" の NailItem の Delete をクリック
[ ] カードがリストから消える
[ ] エラーが表示されないことを確認（Storage ファイルが存在しなくてもエラーにならない）
```

---

## 5. 認証・権限

### 5-1. サインアウト後の状態

```text
[ ] Sign out をクリック
[ ] リストが消え "Sign in with Google" ボタンのみ表示される
[ ] フォームが表示されない
```

### 5-2. サインイン後の初回ロード

```text
[ ] Sign in with Google でサインイン
[ ] "Loading..." が表示された後、リストまたは空状態に切り替わる
```

---

## 6. マージ前チェック

PR 作成・マージ前に以下をすべて実行して green であることを確認してください。

```powershell
# TypeScript ビルド
npm run build

# CSS ガード
.\commands\check-css-guard.ps1

# GitHub Actions CI（PR 作成後）
gh pr checks
```

```text
[ ] npm run build が成功している（エラーなし）
[ ] check-css-guard.ps1 が "CSS guard passed." になっている
[ ] GitHub Actions CI がすべて green になっている
[ ] src/ 以外の変更ファイルが意図通りであることを確認
[ ] package.json / package-lock.json が変更されていないことを確認
```

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [FIREBASE_STORAGE_RULES.md](./FIREBASE_STORAGE_RULES.md) | Storage Rules 設計・deploy 手順・テストケース |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Firebase 初期セットアップ・Auth 確認手順 |
| [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md) | Firestore Security Rules 設計 |
| [ACCEPTANCE_CRITERIA.md](../product/ACCEPTANCE_CRITERIA.md) | タスク完了基準 |
