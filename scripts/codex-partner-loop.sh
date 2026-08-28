#!/bin/zsh
# Nailous 品質パートナーループ（Codex） — launchd から1日3回起動。
# codex-auto Issueがあれば実装、無ければClaude Codeループのコミットを
# クロスレビューして問題を nailous-auto でIssue化（相互成長）。
# Claudeループと同じロックを共有し、同時にリポジトリを変更しない。
set -u

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO="/Users/shunsuke/dev/github/ksc0000/nail-report"
LOG="$HOME/Library/Logs/nailous-codex-loop.log"

cd "$REPO" || exit 1

# Claudeループと共通のロック（相互排他）
LOCK="/tmp/nailous-quality-loop.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') SKIP: partner run in progress" >> "$LOG"
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

# ラン中のアイドルスリープを防止（蓋閉じスリープは防げない点に注意）
caffeinate -i -w $$ &

{
  echo "===== $(date '+%Y-%m-%d %H:%M:%S') codex run start ====="
  if ! gh auth status >/dev/null 2>&1; then
    echo "SKIP: gh not authenticated"; exit 0
  fi
  if [ -n "$(git status --porcelain)" ]; then
    echo "SKIP: working tree dirty — leaving it alone"; exit 0
  fi

  codex exec \
    --sandbox danger-full-access \
    --cd "$REPO" \
    "$(cat scripts/codex-partner-prompt.md)" \
    2>&1 &
  AGENT_PID=$!
  ( sleep 5400; if kill -0 $AGENT_PID 2>/dev/null; then
      echo "WATCHDOG: codex run exceeded 90min — killing $AGENT_PID"
      kill -9 $AGENT_PID 2>/dev/null
    fi ) &
  WATCHDOG_PID=$!
  wait $AGENT_PID
  AGENT_RC=$?
  kill $WATCHDOG_PID 2>/dev/null
  echo "agent exit: $AGENT_RC"

  echo "===== $(date '+%Y-%m-%d %H:%M:%S') codex run end (exit $?) ====="
} >> "$LOG" 2>&1
