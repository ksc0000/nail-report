# Local Development Manual

このドキュメントは、agent-sandbox のローカル開発手順をまとめたものです。

詳細なエージェントルールは [AGENTS.md](../../AGENTS.md) を参照してください。  
詳細なワークフローは [WORKFLOW.md](../harness/WORKFLOW.md) を参照してください。

---

## 前提条件

以下がインストール済みであること:

| ツール | バージョン | 用途 |
|--------|------------|------|
| Node.js | 22 以上 | ビルド・開発サーバー |
| npm | Node.js 付属 | パッケージ管理 |
| Git | 任意 | バージョン管理 |
| PowerShell | 7 以上（pwsh） | コマンドスクリプト実行 |
| gh CLI | 任意（推奨） | GitHub 操作 |
| Ollama | 任意（Aider 使用時） | ローカル LLM 実行 |
| Aider | 任意 | AI コーディング補助 |

---

## 初回セットアップ

```powershell
# リポジトリのクローン
git clone https://github.com/<owner>/agent-sandbox.git
cd agent-sandbox

# 依存関係インストール
npm install

# 動作確認
npm run build
npm run dev
```

---

## 標準開発フロー

### 1. main を最新化する

作業開始前に必ず最新化します。

```powershell
git switch main
git pull origin main
```

### 2. Issue を確認・作成する

作業は必ず GitHub Issue 起点で行います。

```powershell
# Issue 一覧確認
gh issue list

# Issue の詳細確認
gh issue view <number>

# 新規 Issue 作成
gh issue create --title "<タイトル>" --body "<詳細>"
```

### 3. 作業ブランチを作成する

```powershell
# コマンドスクリプトを使う場合
.\commands\start-ai-task.ps1 -TaskName <task-name>

# 手動で作成する場合
git switch -c ai/<task-name>
```

ブランチ命名規則:

```text
ai/<task-name>       # AI実装タスク
chore/<task-name>    # 開発運用タスク
docs/<task-name>     # ドキュメントタスク
fix/<task-name>      # バグ修正
```

### 4. Planner を実行する（方針確認）

Planner は**ファイルを編集しない**計画専任エージェントです。

```powershell
# plan-ai-task.ps1 がある場合
.\commands\plan-ai-task.ps1

# Aider 内で実行する場合
.\commands\run-aider-safe.ps1 -Files src/App.css
```

Aider 内:

```text
/read agents/planner.md
今回の作業内容を説明します。
まず変更方針だけ出してください。まだ編集しないでください。
```

Planner の出力を確認し、Human Gates に該当しないか確認してください。  
→ [HUMAN_GATES.md](../harness/HUMAN_GATES.md)

### 5. Coder を実行する（実装）

人間が Planner の方針を承認したら、Coder を実行します。

```powershell
# CSS だけ変更する場合
.\commands\run-aider-safe.ps1 -Files src/App.css

# TSX と CSS を変更する場合
.\commands\run-aider-safe.ps1 -Files src/App.tsx,src/App.css
```

Aider 内:

```text
/read agents/coder.md
指定ファイルだけ変更してください。
変更後に /test npm run build を実行してください。
```

### 6. review-ai-diff.ps1 を実行する

```powershell
.\commands\review-ai-diff.ps1
```

このスクリプトは以下を自動実行します:

- `git branch --show-current` — 現在のブランチ確認
- `git status` — 変更ファイル確認
- `git --no-pager diff` — 差分表示
- `.\commands\check-css-guard.ps1` — CSS guard チェック
- `npm run build` — ビルド確認

### 7. CSS guard を確認する

```powershell
.\commands\check-css-guard.ps1
```

チェック内容:

- Markdown コードフェンス（`` ``` ``）が CSS に混入していないか
- CSS ネストセレクタ（`& :hover` 等）が使われていないか
- JavaScript テンプレートリテラル（`${...}`）が混入していないか
- 必須スタイル（`#todo-list li.completed .todo-text`）が残っているか

**passed** と表示されれば OK です。

### 8. npm run build を実行する

```powershell
npm run build
```

`dist/` ディレクトリが生成され、エラーなしで完了することを確認します。

### 9. git diff を確認する

```powershell
git --no-pager diff
```

確認ポイント:

- 変更が目的に合っているか
- 変更対象外ファイルが含まれていないか
- `package.json` / `src/main.tsx` が変更されていないか

### 10. commit する

```powershell
# コマンドスクリプトを使う場合
.\commands\finish-ai-task.ps1 -Message "style: polish todo UI" -Files src/App.css

# 手動でコミットする場合
git add src/App.css
git commit -m "style: polish todo UI"
```

commit message 形式:

```text
feat:     新機能
fix:      バグ修正
style:    見た目・CSS調整
refactor: 振る舞いを変えない整理
docs:     ドキュメント
chore:    開発環境・運用
```

### 11. push する

```powershell
git push origin <branch-name>
```

### 12. PR を作成する

```powershell
gh pr create --title "<タイトル>" --body "Closes #<issue-number>"
```

または GitHub の Web UI から PR を作成します。

### 13. GitHub Actions を確認する

```powershell
gh pr checks --watch
```

CI は以下の2ステップを実行します:

1. CSS guard（`check-css-guard.ps1`）
2. `npm run build`

どちらかが失敗した場合はマージできません。

### 14. merge する

**マージは必ず人間が判断します。**

CI が全て green になったら、GitHub の PR 画面から "Merge pull request" を押すか:

```powershell
.\commands\merge-ai-task.ps1 -BaseBranch main
```

---

## よく使うコマンド集

### Git 基本

```powershell
# 状態確認
git status

# 差分確認
git --no-pager diff

# ログ確認（簡潔）
git log --oneline -10

# 特定ファイルを元に戻す
git restore src/App.tsx src/App.css

# 全変更を破棄する（注意: 取り消し不可）
git restore .
```

### npm

```powershell
# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# 本番ビルド
npm run build

# TypeScript 型チェック
npx tsc --noEmit
```

### GitHub CLI

```powershell
# PR 一覧
gh pr list

# PR の詳細確認
gh pr view

# PR の CI 確認（完了まで待機）
gh pr checks --watch

# Issue 一覧
gh issue list

# Issue をクローズ
gh issue close <number>
```

---

## トラブルシューティング

### build が失敗する

```powershell
# 変更を確認
git --no-pager diff

# 変更を元に戻す
git restore src/App.tsx src/App.css

# 再ビルド
npm run build
```

### CSS guard が失敗する

よくある原因:

1. **JavaScript 式の混入**: CSS に `${props => ...}` のような記述がある
2. **ネストセレクタの使用**: `&:hover` のような記述がある
3. **必須スタイルの消失**: `#todo-list li.completed .todo-text` が削除された

```powershell
# App.css を元に戻す
git restore src/App.css
```

### Aider が変更禁止ファイルを変更しようとする

Red Flags が発生した場合は即座に作業を停止します。

```powershell
git status
git --no-pager diff
git restore .
npm run build
```

[AGENTS.md セクション20](../../AGENTS.md) の Red Flags 一覧を確認してください。

### merge-ai-task.ps1 が失敗する

手動でマージします。

```powershell
git switch main
git pull origin main
git merge ai/<task-name>
git push origin main
```

---

## VS Code Tunnel / iPad からの操作

### VS Code Tunnel の起動（Windows PC 側）

```powershell
# VS Code Tunnel の起動
code tunnel
```

または VS Code のコマンドパレットから「Remote Tunnels: Turn on Remote Tunnel Access」を選択。

### iPad / ブラウザからのアクセス

1. ブラウザで [vscode.dev](https://vscode.dev) を開く
2. 左下の「><」アイコン → "Connect to Tunnel" を選択
3. PC の Tunnel 名を選択して接続

### 操作の注意点

- ターミナルパネルを開いて PowerShell コマンドを実行できます
- `npm run dev` のポートフォワードは VS Code が自動で処理します
- iPad から GitHub Mobile でも Issue / PR 確認が可能です

### Tailscale を使う場合

```powershell
# PC 側で Tailscale が起動していれば、iPad から SSH でも接続可能
ssh <pc-name>
```

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [AGENTS.md](../../AGENTS.md) | エージェントルール詳細・Aider 使用方法 |
| [WORKFLOW.md](../harness/WORKFLOW.md) | AI 支援開発ワークフロー詳細 |
| [HUMAN_GATES.md](../harness/HUMAN_GATES.md) | 人間確認が必要な条件 |
| [ACCEPTANCE_CRITERIA.md](../product/ACCEPTANCE_CRITERIA.md) | タスク完了基準 |
| [README_PHASE4_SETUP.md](../../README_PHASE4_SETUP.md) | Phase 4 セットアップ手順 |
