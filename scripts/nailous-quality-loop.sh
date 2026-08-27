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

# 多重起動防止（前の回が長引いた場合、次の回はスキップ）
LOCK="/tmp/nailous-quality-loop.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') SKIP: another run in progress" >> "$LOG"
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

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
  # Issueが尽きたら監査モード: 実測に基づき新しい品質Issueを起票する
  PROMPT_FILE="scripts/quality-loop-prompt.md"
  if [ -z "$(gh issue list --label nailous-auto --state open --limit 1 2>/dev/null)" ]; then
    # 監査は1日1回まで（直近20時間以内に監査済みならスキップ）
    STAMP="/tmp/nailous-quality-audit.stamp"
    if [ -f "$STAMP" ] && [ -n "$(find "$STAMP" -mmin -1200 2>/dev/null)" ]; then
      echo "DONE: backlog empty, audit already ran recently"; exit 0
    fi
    touch "$STAMP"
    PROMPT_FILE="scripts/quality-audit-prompt.md"
    echo "MODE: audit (backlog empty)"
  fi

  claude -p "$(cat "$PROMPT_FILE")" \
    --model sonnet \
    --max-turns 120 \
    --allowedTools "Read,Glob,Grep,Edit,Write,Bash(git:*),Bash(gh:*),Bash(xcodebuild:*),Bash(xcrun:*),Bash(xcodegen:*),Bash(cd:*),Bash(ls:*),Bash(find:*),Bash(cat:*),Bash(cp:*),Bash(mkdir:*),Bash(python3:*),Bash(sips:*),Bash(md5:*),Bash(plutil:*),Bash(sleep:*),Bash(scripts/bench-detect.sh:*)" \
    2>&1 &
  AGENT_PID=$!
  ( sleep 5400; if kill -0 $AGENT_PID 2>/dev/null; then
      echo "WATCHDOG: claude run exceeded 90min — killing $AGENT_PID"
      kill -9 $AGENT_PID 2>/dev/null
    fi ) &
  WATCHDOG_PID=$!
  wait $AGENT_PID
  AGENT_RC=$?
  kill $WATCHDOG_PID 2>/dev/null
  echo "agent exit: $AGENT_RC"

  echo "===== $(date '+%Y-%m-%d %H:%M:%S') run end (exit $?) ====="
} >> "$LOG" 2>&1
