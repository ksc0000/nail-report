# AGENTS.md — nail-report

> React 19 + TypeScript + Vite + Firebase Web アプリ。Jules / Codex / Claude による自律改善パイプラインで運用。

---

## ビルド・Lint

```bash
npm install
npm run build    # tsc -b && vite build
npm run lint     # eslint .
```

### CI 注意（Windows ランナー）

`.github/workflows/ci.yml` は **windows-latest** で動作し、PowerShell スクリプト `.\commands\check-css-guard.ps1` を実行する。Jules は Ubuntu 環境のため、このスクリプトは直接実行できない。

Jules は `npm run build` と `npm run lint` のみで動作確認すること。CSS guard は CI が自動チェックするので Jules が手動実行する必要はない。

---

## ディレクトリ構成

```
nail-report/
├── src/
│   ├── App.tsx          # メインコンポーネント
│   ├── App.css          # スタイル
│   └── main.tsx         # エントリーポイント（変更禁止）
├── commands/            # PowerShell 運用スクリプト（変更禁止）
├── agents/              # AI エージェント役割定義
├── docs/                # 設計ドキュメント
├── public/
├── firebase.json
├── firestore.rules      # セキュリティルール（human 承認後のみ変更可）
└── storage.rules
```

---

## PR ルール

Jules が作成する PR は以下のルールに従うこと。

| ルール | 内容 |
|---|---|
| サイズ上限 | diff 150 行以内 |
| スコープ | 1 Issue = 1 PR。複数 Issue を混在させない |
| CI 必須 | `npm run build` + `npm run lint` がパスすること |
| ドラフト | 実装完了後に Draft → Ready for review に変更する |

---

## レビューフロー（二段階）

```text
Jules PR 作成
  ↓ CI パス確認
  ↓ request-ai-review ラベル追加（human または Jules）
  ↓ @codex review（コード正確性・テスト漏れ・スコープ逸脱）
  ↓ Codex LGTM または token limit 到達の場合
  ↓ @claude review（設計・保守性・プロダクト一貫性）—— 自動トリガー
  ↓ human merge
```

Codex がブロッキング指摘を出した場合は Claude は自動トリガーされない。Jules が修正後、再度 `request-ai-review` ラベルを追加すること。

---

## 安全ルール

- `firebase deploy` はユーザー承認後のみ実行
- `firestore.rules` / `storage.rules` の変更も承認後に適用
- `.env` / service account JSON / API キーはコミット・表示しない
- `main` への直接コミット禁止。必ず feature ブランチ経由
- PR のマージは human が行う

---

## Jules 禁止操作

- `firebase deploy` / デプロイコマンド全般
- `.env` / `.env.*` / service account JSON への変更・コミット
- `firestore.rules` / `storage.rules` の変更
- `src/main.tsx` の変更（エントリーポイント）
- `package.json` の依存関係追加（要 human 承認）
- `commands/` 内スクリプトの変更（PowerShell 運用スクリプト）
- 複数 Issue にまたがる大規模リファクタリング
- PR のマージ

---

## React ルール

- `src/main.tsx` には `createRoot` / `StrictMode` を書く。`App.tsx` には書かない
- 外部 npm パッケージの追加は human 承認が必要
- TypeScript の型エラーを残さない
- 既存機能を削除・破壊しない
