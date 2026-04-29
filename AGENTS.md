# AGENTS.md

このリポジトリは、ローカルLLM + Aider + Git を使ってAI支援開発を行うためのプロジェクトです。

AIエージェントはコード作成を支援する補助者です。最終判断、差分レビュー、commit、merge は必ず人間が行います。

---

## 1. Project Overview

このプロジェクトは React + TypeScript + Vite によるWebアプリです。

現在の目的は、ローカルLLMを使って以下の開発フローを確立することです。

- Aiderによるコード編集
- Gitブランチによる作業分離
- buildによる検証
- 人間によるdiffレビュー
- 人間によるcommit
- 将来的な役割別エージェント運用

---

## 2. Core Principles

AIエージェントは、以下の方針に従って作業してください。

- 小さく、安全な差分を作る
- 1回の作業で複数の目的を混ぜない
- 指定されたファイルだけを変更する
- 既存機能を壊さない
- buildが通る状態を維持する
- 最終commitは人間に任せる
- 不明点がある場合は、実装せずに確認する
- 大規模な書き換えより、段階的な改善を優先する
- AIの自己申告ではなく、Git差分とbuild結果を信頼する

---

## 3. Required Workflow

AI作業は必ず以下の流れで行います。

```text
1. 人間が作業内容を決める
2. Gitの作業ツリーがcleanであることを確認する
3. ai/<task-name> または chore/<task-name> ブランチを作る
4. Aiderを安全設定で起動する
5. Planner Agent が変更方針を出す
6. 人間が方針を確認する
7. Coder Agent が指定ファイルだけを変更する
8. Tester Agent が build を確認する
9. Reviewer Agent が差分を確認する
10. 人間が git diff を確認する
11. 人間が commit する
12. 必要に応じて main へ merge する
```

---

## 4. Setup Commands

依存関係のインストール:

```powershell
npm install
```

開発サーバー起動:

```powershell
npm run dev
```

本番ビルド確認:

```powershell
npm run build
```

Git状態確認:

```powershell
git status
```

差分確認:

```powershell
git --no-pager diff
```

---

## 5. Branch Rules

AI作業では、mainブランチを直接変更してはいけません。

作業ブランチ命名例:

```text
ai/todo-ui-polish
ai/add-form-validation
ai/refactor-app-css
chore/phase4-agent-roles
docs/update-agent-manual
```

作業開始時の基本コマンド:

```powershell
git status
git switch -c ai/<task-name>
```

作業完了後、問題なければ人間がcommitします。

---

## 6. Protected Files

以下のファイル・ディレクトリは、明示的な指示がない限り変更禁止です。

```text
package.json
package-lock.json
src/main.tsx
public/
dist/
assets/
```

特に `src/main.tsx` はアプリのエントリーポイントです。

`createRoot`、`StrictMode`、ReactDOM rendering code は `src/main.tsx` 側の責務であり、`src/App.tsx` に書いてはいけません。

---

## 7. Editable Files by Default

通常のUI改善や小規模な機能改善では、原則として以下のみを変更対象にします。

```text
src/App.tsx
src/App.css
```

CSSだけの見た目改善では、原則として以下のみを変更します。

```text
src/App.css
```

---

## 8. React Rules

`src/App.tsx` はReactコンポーネントです。

守ること:

- `src/App.tsx` にはReactコンポーネントの実装を書く
- 既存のTodo機能を削除しない
- 既存のstate、handler、UI構造を不用意に壊さない
- JSXの構造を大きく変える場合は、事前に方針を説明する
- 入力、ボタン、リスト、イベントハンドラの関係を保つ
- TypeScriptの型エラーを残さない

禁止:

- `src/App.tsx` に `createRoot` を書く
- `src/App.tsx` に `StrictMode` のroot renderingを書く
- `src/App.tsx` から `App` 自身をimportする
- `src/main.tsx` の内容を `src/App.tsx` に移す
- Todo機能を勝手に削除する
- 外部ライブラリを勝手に追加する

---

## 9. CSS Rules

`src/App.css` では通常のCSSだけを使います。

守ること:

- 通常のCSSセレクタを使う
- className と CSSセレクタで状態を表現する
- UI改善は小さく段階的に行う
- 既存デザインを大きく壊さない
- 余白、配置、視認性、押しやすさを中心に改善する

禁止:

- CSSにJavaScript式を書かない
- `${props => ...}` のようなstyled-components風構文を書かない
- CSS内でReact stateを直接参照しない
- ネストCSSが通常CSSとして無効になる形で書かない
- 大規模なデザイン全面変更を勝手に行わない

正しい例:

```css
#todo-list li.completed .todo-text {
  text-decoration: line-through;
  opacity: 0.65;
}
```

悪い例:

```css
.todo-text {
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
}
```

---

## 10. AI Role System

このプロジェクトでは、AI作業を以下の役割に分けます。

```text
Planner Agent
Coder Agent
Reviewer Agent
Tester Agent
UI Designer Agent
Release Manager Agent
```

各役割の詳細は `agents/` ディレクトリ配下のMarkdownファイルに定義します。

```text
agents/planner.md
agents/coder.md
agents/reviewer.md
agents/tester.md
agents/ui-designer.md
agents/release-manager.md
```

---

## 11. Planner Agent Rule

Planner Agent は実装前の計画担当です。

役割:

- 要件を小さな作業単位に分解する
- 変更対象ファイルを明確にする
- 変更禁止ファイルを明確にする
- 想定リスクを出す
- 検証方法を提示する

禁止:

- ファイルを編集しない
- コードを変更しない
- いきなり実装しない

出力形式:

```text
目的:
変更対象ファイル:
変更禁止ファイル:
実装方針:
想定リスク:
検証方法:
人間確認ポイント:
```

---

## 12. Coder Agent Rule

Coder Agent は実装担当です。

役割:

- Plannerの方針に従って実装する
- 指定されたファイルだけを変更する
- 小さく安全な差分を作る
- 既存機能を壊さない

必須:

- buildが通る状態にする
- 変更ファイルを説明する
- 変更範囲を最小化する

禁止:

- `package.json` を変更しない
- `src/main.tsx` を変更しない
- 外部ライブラリを追加しない
- CSSにJavaScript式を書かない
- `App.tsx` に `createRoot` / `StrictMode` を書かない

---

## 13. Reviewer Agent Rule

Reviewer Agent は差分レビュー担当です。

確認項目:

- 指定外ファイルが変更されていないか
- `package.json` が変更されていないか
- `src/main.tsx` が変更されていないか
- `App.tsx` に `createRoot` / `StrictMode` が入っていないか
- CSSに `${...}` のようなJavaScript式が入っていないか
- 既存Todo機能が消えていないか
- `npm run build` が成功しているか
- 差分が小さく、目的に合っているか

出力形式:

```text
判定: OK / NG
変更ファイル:
良い点:
問題点:
修正必須:
commit可否:
```

NG条件:

- build失敗
- 指定外ファイル変更
- `package.json` 変更
- `src/main.tsx` 変更
- `App.tsx` にroot rendering混入
- CSSにJavaScript式混入
- 既存機能の削除

---

## 14. Tester Agent Rule

Tester Agent は検証担当です。

実行すること:

```powershell
git status
git --no-pager diff
npm run build
```

必要に応じて、開発サーバーを起動します。

```powershell
npm run dev
```

手動確認項目:

- 画面が表示される
- Todoを追加できる
- EnterキーでTodoを追加できる
- 完了/未完了を切り替えられる
- Deleteで削除できる
- 画面が崩れていない

出力形式:

```text
git status:
変更ファイル:
build結果:
手動確認項目:
総合判定:
```

---

## 15. UI Designer Agent Rule

UI Designer Agent はUI改善担当です。

目的:

- 既存機能を壊さず、見た目・余白・視認性を改善する

原則:

- まずCSSだけで改善できるか検討する
- TSX変更は必要最小限にする
- 既存のVite/Reactサンプル部分を勝手に削除しない
- UI変更は小さく段階的に行う

禁止:

- 大規模な全面変更
- 外部UIライブラリ追加
- `App.tsx` へのroot rendering混入
- CSSへのJavaScript式混入

出力形式:

```text
改善目的:
変更対象:
デザイン方針:
影響範囲:
検証方法:
```

---

## 16. Release Manager Agent Rule

Release Manager Agent は作業完了確認とcommit整理担当です。

確認項目:

- git status
- git diff
- npm run build
- 変更ファイル一覧
- commit message案
- merge可否

出力形式:

```text
変更概要:
変更ファイル:
build結果:
手動確認項目:
推奨commit message:
merge可否:
```

Commit message形式:

```text
feat: 新機能
fix: バグ修正
style: 見た目・CSS調整
refactor: 振る舞いを変えない整理
docs: ドキュメント
chore: 開発環境・運用
```

---

## 17. Aider Usage

Aiderは安全設定で起動します。

標準起動:

```powershell
aider `
  --model ollama/qwen2.5-coder:7b `
  --no-auto-commits `
  --no-dirty-commits `
  --test-cmd "npm run build" `
  --read CONVENTIONS.md `
  --read AGENTS.md `
  src/App.tsx src/App.css
```

CSSだけを対象にする場合:

```powershell
aider `
  --model ollama/qwen2.5-coder:7b `
  --no-auto-commits `
  --no-dirty-commits `
  --test-cmd "npm run build" `
  --read CONVENTIONS.md `
  --read AGENTS.md `
  src/App.css
```

Aider内でよく使うコマンド:

```text
/read agents/planner.md
/read agents/coder.md
/read agents/reviewer.md
/read agents/tester.md
/read agents/ui-designer.md
/read agents/release-manager.md

/run git status
/run git --no-pager diff
/test npm run build
/drop <file>
/ls
/exit
```

---

## 18. Standard AI Development Flow

### Step 1: Start task branch

```powershell
git status
git switch -c ai/<task-name>
```

または:

```powershell
.\commands\start-ai-task.ps1 -TaskName <task-name>
```

### Step 2: Start Aider safely

```powershell
.\commands\run-aider-safe.ps1 -Files src/App.css
```

または:

```powershell
.\commands\run-aider-safe.ps1 -Files src/App.tsx,src/App.css
```

### Step 3: Planner phase

Aider内:

```text
/read agents/planner.md
今回の作業内容を説明する。
まず変更方針だけ出してください。まだ編集しないでください。
```

### Step 4: Human approval

人間が方針を確認します。

問題がなければ:

```text
方針OKです。
```

問題があれば:

```text
その方針はNGです。src/main.tsx は変更しないでください。変更対象を src/App.css のみに絞って再提案してください。
```

### Step 5: Coder phase

```text
/read agents/coder.md
指定ファイルだけ変更してください。
変更後に /test npm run build を実行してください。
```

### Step 6: Review phase

```text
/read agents/reviewer.md
/run git status
/run git --no-pager diff
/test npm run build
この差分をレビューしてください。
```

### Step 7: Human verification

PowerShellで確認します。

```powershell
git status
git --no-pager diff
npm run build
npm run dev
```

### Step 8: Commit

```powershell
git add <changed-files>
git commit -m "<type>: <message>"
```

または:

```powershell
.\commands\finish-ai-task.ps1 -Message "style: polish todo UI" -Files src/App.css
```

### Step 9: Merge

```powershell
git switch main
git merge ai/<task-name>
```

または:

```powershell
.\commands\merge-ai-task.ps1 -BaseBranch main
```

---

## 19. Failure Recovery

未コミット変更を破棄する:

```powershell
git restore .
```

特定ファイルだけ戻す:

```powershell
git restore src/App.tsx src/App.css
```

Aider内で直前変更を戻す:

```text
/undo
```

直近commitを取り消す:

```powershell
git revert HEAD
```

ローカル検証中で履歴ごと戻す:

```powershell
git reset --hard HEAD~1
```

注意:

- 業務リポジトリでは基本的に `revert` を使う
- `reset --hard` はローカル検証中のみ使う
- 迷ったら `git status` と `git --no-pager diff` を確認する

---

## 20. Red Flags

以下の兆候があれば、すぐに作業を止めてレビューしてください。

- Aiderが `src/main.tsx` を変更しようとする
- Aiderが `package.json` を変更しようとする
- `App.tsx` に `createRoot` が入る
- `App.tsx` に `StrictMode` が入る
- `App.tsx` が自分自身をimportする
- CSSに `${props => ...}` が入る
- Todo機能が削除される
- buildが失敗する
- diffが大きすぎる
- 指示していないファイルが変更される

この場合は、以下を実行します。

```powershell
git status
git --no-pager diff
git restore .
npm run build
```

---

## 21. Remote Management Future Plan

将来的には、iPhoneなどの携帯端末から以下を管理できるようにします。

- GitHub Issue作成
- AI作業ブランチ作成
- Aider起動
- build確認
- diff確認
- commit確認
- Pull Request作成
- merge管理

想定構成:

```text
iPhone
  ├─ VS Code Web
  ├─ Tailscale
  ├─ SSH client
  └─ GitHub Mobile

Windows PC
  ├─ Ollama
  ├─ Aider
  ├─ Git repo
  ├─ VS Code Tunnel
  ├─ Tailscale
  └─ local web preview

GitHub
  ├─ Issues
  ├─ Branches
  ├─ Pull Requests
  └─ Actions
```

---

## 22. Final Principle

AIの自己申告ではなく、以下を信頼する。

```text
git status
git diff
npm run build
ブラウザでの手動確認
人間レビュー
```

AIは速く書けますが、正しいとは限りません。  
Gitとbuildを通して、AIの出力を安全に管理します。
