#!/bin/zsh
# Nailous 自動開発の日次レポートをメール送信（launchd 08:00）。
# 直近24時間の Claude/Codex ループ実行結果・コミット・Issueの動きを集計し、
# メール.app（ログイン済みアカウント）から送る。認証情報は扱わない。
set -u

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO="/Users/shunsuke/dev/github/ksc0000/nail-report"
RECIPIENT="kikusuke0529@icloud.com"
QLOG="$HOME/Library/Logs/nailous-quality-loop.log"
CLOG="$HOME/Library/Logs/nailous-codex-loop.log"
RLOG="$HOME/Library/Logs/nailous-report.log"

cd "$REPO" || exit 1

TODAY=$(date '+%Y-%m-%d %H:%M')
SINCE=$(date -v-24H '+%Y-%m-%d %H:%M')

# --- 集計 ---
runs_from_log() {
  # 直近24hの run start/end/SKIP/MODE 行だけ抜く
  local f="$1"
  [ -f "$f" ] || { echo "(ログなし)"; return; }
  awk -v since="$(date -v-24H '+%Y-%m-%d %H:%M:%S')" '
    /run start|run end|SKIP|DONE|MODE/ {
      line=$0
      gsub(/^=+ | =+$/,"",line)
      ts=substr(line,1,19)
      if (ts >= since) print "  " line
    }' "$f" | tail -20
}

CLAUDE_RUNS=$(runs_from_log "$QLOG")
CODEX_RUNS=$(runs_from_log "$CLOG")
COMMITS=$(git log --since="24 hours ago" --pretty=format:"  %h %s" | head -15)
[ -z "$COMMITS" ] && COMMITS="  (なし)"
OPEN_AUTO=$(gh issue list --label nailous-auto --state open --json number,title --jq '.[] | "  #\(.number) \(.title)"' 2>/dev/null)
OPEN_CODEX=$(gh issue list --label codex-auto --state open --json number,title --jq '.[] | "  #\(.number) \(.title)"' 2>/dev/null)
CLOSED_RECENT=$(gh issue list --label ios-quality --state closed --search "closed:>=$(date -v-1d '+%Y-%m-%d')" --json number,title --jq '.[] | "  #\(.number) \(.title)"' 2>/dev/null)
ERRORS=$(grep -h "Failed\|401\|error:" "$QLOG" "$CLOG" 2>/dev/null | tail -5)
[ -z "$ERRORS" ] && ERRORS="  なし"
[ -z "$OPEN_AUTO" ] && OPEN_AUTO="  (なし)"
[ -z "$OPEN_CODEX" ] && OPEN_CODEX="  (なし)"
[ -z "$CLOSED_RECENT" ] && CLOSED_RECENT="  (なし)"

BODY="Nailous 自動開発レポート（$SINCE 〜 $TODAY）

■ この24時間のコミット
$COMMITS

■ クローズされたIssue（直近）
$CLOSED_RECENT

■ 未解決Issue — Claude担当 (nailous-auto)
$OPEN_AUTO

■ 未解決Issue — Codex担当 (codex-auto)
$OPEN_CODEX

■ Claudeループ実行履歴
${CLAUDE_RUNS:-  (実行なし)}

■ Codexループ実行履歴
${CODEX_RUNS:-  (実行なし)}

■ エラー（要対応の可能性）
$ERRORS

--
このメールは launchd (com.ksc0000.nailous-report) から毎朝08:00に自動送信されています。
Issue一覧: https://github.com/ksc0000/nail-report/issues"

SUBJECT="Nailous 自動開発レポート $(date '+%m/%d')"

# --- メール.app で送信（TCC: 初回のみ自動化の許可が必要） ---
/usr/bin/osascript - "$RECIPIENT" "$SUBJECT" "$BODY" <<'APPLESCRIPT'
on run argv
    set theRecipient to item 1 of argv
    set theSubject to item 2 of argv
    set theBody to item 3 of argv
    tell application "Mail"
        set theMessage to make new outgoing message with properties {subject:theSubject, content:theBody, visible:false}
        tell theMessage
            make new to recipient at end of to recipients with properties {address:theRecipient}
        end tell
        send theMessage
    end tell
end run
APPLESCRIPT
STATUS=$?

echo "$(date '+%Y-%m-%d %H:%M:%S') report sent to $RECIPIENT (osascript exit $STATUS)" >> "$RLOG"
exit $STATUS
