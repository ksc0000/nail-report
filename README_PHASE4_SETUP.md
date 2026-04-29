# Phase 4 Agent Roles Pack

このZIPには、Phase 4「役割エージェント化」に必要なファイル一式が入っています。

## 含まれるもの

```text
agents/
  planner.md
  coder.md
  reviewer.md
  tester.md
  ui-designer.md
  release-manager.md

commands/
  start-ai-task.ps1
  run-aider-safe.ps1
  review-ai-diff.ps1
  finish-ai-task.ps1
  merge-ai-task.ps1

logs/
  .gitkeep
```

## 配置場所

ZIPを展開し、`agents/`、`commands/`、`logs/` をプロジェクト直下へ配置してください。

例:

```powershell
cd C:\dev\agent-sandbox
```

## コミット例

```powershell
git add agents commands logs README_PHASE4_SETUP.md
git commit -m "chore: add role-based AI agent operation files"
```

## 基本運用

### 1. タスク開始

```powershell
.\commands\start-ai-task.ps1 -TaskName todo-ui-polish
```

### 2. Aider安全起動

CSSだけ変更する場合:

```powershell
.\commands\run-aider-safe.ps1 -Files src/App.css
```

TSXとCSSを変更する場合:

```powershell
.\commands\run-aider-safe.ps1 -Files src/App.tsx,src/App.css
```

### 3. Aider内で役割を読む

```text
/read agents/planner.md
```

方針確認後:

```text
/read agents/coder.md
```

レビュー時:

```text
/read agents/reviewer.md
/run git status
/run git --no-pager diff
/test npm run build
```

### 4. PowerShellでレビュー

```powershell
.\commands\review-ai-diff.ps1
```

### 5. commit

```powershell
.\commands\finish-ai-task.ps1 -Message "style: polish todo UI" -Files src/App.css
```

### 6. merge

```powershell
.\commands\merge-ai-task.ps1 -BaseBranch main
```

## 注意

- AIの自己申告ではなく、`git status`、`git diff`、`npm run build` を信用してください。
- `package.json` と `src/main.tsx` は原則変更禁止です。
- App.tsx に `createRoot` や `StrictMode` が混入したら、すぐ作業を止めてください。
- CSSに `${props => ...}` のようなJavaScript式が入ったらNGです。
