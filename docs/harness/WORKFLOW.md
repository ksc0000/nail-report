# AI-Assisted Development Workflow

このドキュメントは、agent-sandbox における AI 支援開発の標準作業フローを定義します。

詳細なエージェントルール・Aider コマンドは [AGENTS.md](../../AGENTS.md) を参照してください。

---

## 前提

- 全作業は GitHub Issue 起点で開始する
- main ブランチへの直接 push は禁止
- commit・merge・PR merge は必ず人間が判断する
- AI は差分を作り、人間がレビューして commit する

---

## 標準フロー

```text
1. Issue 確認・作成
2. main 最新化
3. 作業ブランチ作成
4. Planner フェーズ（read-only）
5. 人間による方針承認
6. Coder フェーズ（指定ファイルのみ編集）
7. review-ai-diff.ps1 実行
8. CSS guard / build 確認
9. 人間が git diff を確認
10. 人間が commit
11. push
12. PR 作成
13. GitHub Actions 確認（gh pr checks --watch）
14. Ruleset 通過確認
15. 人間が merge 判断
```

---

## 各ステップ詳細

### Step 1: Issue 確認・作成

作業前に必ず GitHub Issue を確認します。  
Issue がない場合は作成してから始めてください。

```powershell
gh issue list
gh issue view <number>
```

### Step 2: main 最新化

```powershell
git switch main
git pull origin main
```

### Step 3: 作業ブランチ作成

```powershell
.\commands\start-ai-task.ps1 -TaskName <task-name>
```

または手動で:

```powershell
git switch -c ai/<task-name>
```

ブランチ命名規則:

```text
ai/<task-name>       # AI実装タスク
chore/<task-name>    # 開発運用タスク
docs/<task-name>     # ドキュメントタスク
fix/<task-name>      # バグ修正
```

### Step 4: Planner フェーズ（read-only）

Planner は **ファイルを一切編集しない** 計画専任です。

```powershell
.\commands\plan-ai-task.ps1
```

または Aider 内で:

```text
/read agents/planner.md
今回の作業内容を説明する。
まず変更方針だけ出してください。まだ編集しないでください。
```

Planner の出力形式:

```text
目的:
変更対象ファイル:
変更禁止ファイル:
実装方針:
想定リスク:
検証方法:
人間確認ポイント:
```

### Step 5: 人間による方針承認

Planner の出力を確認します。  
問題がなければ承認、問題があれば修正を指示します。

- 変更対象ファイルが適切か
- 変更禁止ファイルが含まれていないか
- Human Gates に該当しないか（→ [HUMAN_GATES.md](./HUMAN_GATES.md) 参照）

### Step 6: Coder フェーズ

```powershell
.\commands\run-aider-safe.ps1 -Files src/App.css
```

Coder は Planner の方針に従い、**指定されたファイルのみ**を変更します。

```text
/read agents/coder.md
指定ファイルだけ変更してください。
変更後に /test npm run build を実行してください。
```

### Step 7: review-ai-diff.ps1 実行

```powershell
.\commands\review-ai-diff.ps1
```

このスクリプトは以下を自動実行します:

- `git branch --show-current`
- `git status`
- `git --no-pager diff`
- `.\commands\check-css-guard.ps1`
- `npm run build`

### Step 8: CSS guard / build 確認

review-ai-diff.ps1 の出力を確認します。

- CSS guard: passed になっているか
- build: `dist/` が生成されているか（エラーなし）

問題がある場合は Coder に修正を依頼してください。

### Step 9: 人間が git diff を確認

```powershell
git --no-pager diff
```

確認ポイント:

- 変更が目的に合っているか
- 指定外ファイルが変更されていないか
- `package.json` / `src/main.tsx` が変更されていないか
- 差分が小さく、安全か

Red Flags は [AGENTS.md セクション20](../../AGENTS.md) を参照してください。

### Step 10: commit

```powershell
.\commands\finish-ai-task.ps1 -Message "style: polish todo UI" -Files src/App.css
```

または手動で:

```powershell
git add <changed-files>
git commit -m "<type>: <message>"
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

### Step 11: push

```powershell
git push origin <branch-name>
```

### Step 12: PR 作成

```powershell
gh pr create --title "<title>" --body "Closes #<issue-number>"
```

PR テンプレート:

```text
## 概要
（変更の目的・背景）

## 変更内容
- （箇条書き）

## テスト確認
- [ ] CSS guard passed
- [ ] npm run build 成功
- [ ] git diff 確認済み

## 関連 Issue
Closes #<number>
```

### Step 13: GitHub Actions 確認

```powershell
gh pr checks --watch
```

CI は以下の2ステップを実行します:

1. CSS guard（`check-css-guard.ps1`）
2. `npm run build`

どちらかが失敗した場合はマージ不可です。

### Step 14: Ruleset 通過確認

GitHub の Branch Ruleset（main ブランチ保護）が通過していることを確認します。

- CI checks が全て green
- Require PR review（設定されている場合）

### Step 15: 人間が merge 判断

全ての確認が完了したら、**人間が** GitHub UI または CLI でマージします。

```powershell
.\commands\merge-ai-task.ps1 -BaseBranch main
```

または GitHub PR 画面から "Merge pull request" を押す。

AI は自動で merge してはいけません。

---

## iPad / VS Code Tunnel からの操作

iPad や遠隔環境から操作する場合も、同じフローで作業できます。

```text
iPad / iPhone / リモートデバイス
  ├─ VS Code Tunnel（ブラウザ版 VS Code）
  │    └─ ターミナルから PowerShell コマンドを実行
  ├─ GitHub Mobile
  │    └─ Issue 確認・PR レビュー・merge 判断
  └─ Tailscale / SSH（オプション）
```

**VS Code Tunnel での作業手順:**

1. ブラウザで VS Code Tunnel を開く
2. ターミナルパネルを開く
3. 通常の PowerShell コマンドをそのまま実行する
4. `npm run dev` でローカルプレビューも確認可能（ポートフォワード）

詳細は [LOCAL_DEVELOPMENT_MANUAL.md](../operations/LOCAL_DEVELOPMENT_MANUAL.md) を参照してください。

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| [AGENTS.md](../../AGENTS.md) | エージェントルール詳細・Aider 使用方法 |
| [HUMAN_GATES.md](./HUMAN_GATES.md) | 人間確認が必要な条件 |
| [MODEL_POLICY.md](./MODEL_POLICY.md) | 役割別モデル選定方針 |
| [HUMAN_TASK_REQUEST.md](./HUMAN_TASK_REQUEST.md) | AI→人間への依頼テンプレート |
| [ACCEPTANCE_CRITERIA.md](../product/ACCEPTANCE_CRITERIA.md) | タスク完了の基準 |
| [LOCAL_DEVELOPMENT_MANUAL.md](../operations/LOCAL_DEVELOPMENT_MANUAL.md) | ローカル開発手順 |
