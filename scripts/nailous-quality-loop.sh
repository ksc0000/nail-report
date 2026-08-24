#!/bin/zsh
# Nailous 夜間品質改善ループ — launchd から毎晩起動され、Claude Code を
# ヘッドレスで1回走らせて nailous-auto ラベルの Issue を1件進める。
# ログ: ~/Library/Logs/nailous-quality-loop.log
set -u

export PATH="/Users/shunsuke/.nvm/versions/node/v24.16.0/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO="/Users/shunsuke/dev/github/ksc0000/nail-report"
LOG_DIR="$HOME/Library/Logs"
LOG="$LOG_DIR/nailous-quality-loop.log"
mkdir -p "$LOG_DIR"

cd "$REPO" || exit 1

{
  echo "===== $(date '+%Y-%m-%d %H:%M:%S') run start ====="

  # 前提チェック: gh 認証・シミュレータ存在
  if ! gh auth status >/dev/null 2>&1; then
    echo "SKIP: gh not authenticated"; exit 0
  fi
  if ! xcrun simctl list devices | grep -q "iPhone 17 Pro"; then
    echo "SKIP: simulator 'iPhone 17 Pro' not found"; exit 0
  fi
  # 人間の未コミット作業があれば触らない（プロンプト側と二重ガード）
  if [ -n "$(git status --porcelain)" ]; then
    echo "SKIP: working tree dirty — leaving it alone"; exit 0
  fi
  # 対象Issueが無ければ即終了（無駄なトークンを使わない）
  if [ -z "$(gh issue list --label nailous-auto --state open --limit 1 2>/dev/null)" ]; then
    echo "DONE: no open nailous-auto issues"; exit 0
  fi

  claude -p "$(cat scripts/quality-loop-prompt.md)" \
    --model sonnet \
    --max-turns 120 \
    --allowedTools "Read,Glob,Grep,Edit,Write,Bash(git:*),Bash(gh:*),Bash(xcodebuild:*),Bash(xcrun:*),Bash(xcodegen:*),Bash(cd:*),Bash(ls:*),Bash(find:*),Bash(cat:*),Bash(cp:*),Bash(mkdir:*),Bash(python3:*),Bash(sips:*),Bash(md5:*),Bash(plutil:*),Bash(sleep:*)" \
    2>&1

  echo "===== $(date '+%Y-%m-%d %H:%M:%S') run end (exit $?) ====="
} >> "$LOG" 2>&1
