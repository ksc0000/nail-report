# Nail View Prototype — Design Reference

> このフォルダは **デザイン参考資料** です。現在の React 実装 (`src/`) とは独立しています。

## 概要

`prototype.html` は、別リポジトリ (`C:\dev\nail-report-reference`) に存在した初期 Vite scaffold のデザインを、スタンドアロン HTML として保存したものです。

CSS 変数（カラーパレット・タイポグラフィ）、レイアウトパターン、コンポーネントスタイルの参考として保存しています。

## ファイル構成

| ファイル | 内容 |
|---|---|
| `prototype.html` | `index.css` + `App.css` を inline 化したスタンドアロン HTML |

## 使用方法

ブラウザで `prototype.html` を直接開くだけで表示できます（ビルド不要）。

## 重要な注意事項

### このフォルダからやってはいけないこと

- **現在の `src/` へそのままコピーしない**
  React 実装は現在の `src/App.tsx` / `src/App.css` が正です。
  prototype.html のコードを直接 `src/` へ貼り付けないでください。

- **Firebase Auth / Firestore / Storage 実装は現在の `src/` 側を正とする**
  参考プロトタイプは Firebase 連携を持ちません。
  認証・データ保存・画像アップロードのロジックは `src/lib/` の実装を参照してください。

- **Security Rules / deploy / package 追加はこの参考資料から行わない**
  `firestore.rules` / `storage.rules` / `firebase.json` / `package.json` の変更は、
  本体リポジトリの Issue 単位で別途実施してください。

### UI 改善時の手順

UI をこのプロトタイプに近づけたい場合は、**Issue 単位で小さく移植**してください。

1. 移植したいデザイン要素を Issue に記載する
2. 専用ブランチ (`feat/...` または `style/...`) で `src/App.css` を変更する
3. `npm run build` と `.\commands\check-css-guard.ps1` で確認する
4. PR を作成してレビューを受ける

## 参照元

- 元ファイル: `C:\dev\nail-report-reference\src\index.css` + `src\App.css` + `src\App.tsx`
- コピー対象: CSS（インライン化済み）+ 静的 HTML 構造のみ
- コピー除外: `.git/`, `node_modules/`, `package.json`, `tsconfig*`, `vite.config.ts`, `.github/`, `commands/`, `agents/`
