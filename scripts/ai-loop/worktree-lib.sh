#!/bin/zsh
# 夜間ループ（Claude / Codex）が使う専用worktreeの共通処理。
#
# 背景（#402）: 以前はエージェントが $REPO 本体の作業ツリーで直接コミットし、
# ループ終了時にツリーがdirtyなら丸ごと `git stash push -u` していた。実行中
# （最大90分）に人間が同じ $REPO で編集を始めても区別できず、その変更ごと
# stashされて作業ツリーから消えてしまう問題があった。
#
# 対策として、エージェントは $REPO 本体ではなく専用worktree（別ディレクトリ・
# 別ブランチ）だけで作業する。Claude/Codex両ループは同じロックファイルで
# 相互排他されているため、同一のworktree/ブランチを共有しても衝突しない
# （相棒の直近コミットをレビューするCodexのモードBも、共有ブランチの線形
# 履歴に依存しているため、あえて分けずに1本にしている）。
# これにより $REPO 本体の作業ツリーはループから一切触られなくなる。

# prepare_agent_worktree <repo> <worktree_dir> <branch>
# 成功したら0を返す。失敗（detached HEAD等）したら1を返し、呼び出し側は
# そのランをSKIPすること。
prepare_agent_worktree() {
  local repo="$1" dir="$2" branch="$3"

  git -C "$repo" worktree prune >/dev/null 2>&1

  # `git worktree list` は解決済みの実パスを報告する（例: macOSでは /tmp が
  # /private/tmp のシンボリックリンクのため、そのまま比較すると常に不一致に
  # なる）。$dir 側も実パスに解決してから比較する。
  local resolved
  resolved=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null) || resolved=""

  if [ -n "$resolved" ] && git -C "$repo" worktree list --porcelain | grep -qx "worktree $resolved"; then
    : # 既存worktreeを再利用（前回までのコミット履歴はそのまま）
  elif git -C "$repo" show-ref --verify --quiet "refs/heads/$branch"; then
    echo "worktree: attaching to existing branch $branch at $dir"
    git -C "$repo" worktree add "$dir" "$branch" || return 1
  else
    local base
    base=$(git -C "$repo" symbolic-ref --quiet --short HEAD) || {
      echo "SKIP: $repo is in detached HEAD, cannot derive a base branch for $branch"
      return 1
    }
    echo "worktree: creating $branch from $base at $dir"
    git -C "$repo" worktree add -b "$branch" "$dir" "$base" || return 1
  fi

  if [ -n "$(git -C "$dir" status --porcelain)" ]; then
    echo "worktree: found leftover from a previous interrupted run in $dir; parking it before starting"
    park_worktree_leftover "$dir" "prior-crash"
  fi
  return 0
}

# park_worktree_leftover <worktree_dir> <label>
# 対象worktreeの未コミット変更を、そのworktree自身にstashで退避する。
# $REPO 本体には一切触れないため、人間の作業を巻き込むことはない。
park_worktree_leftover() {
  local dir="$1" label="$2"
  echo "LEFTOVER($label): uncommitted changes isolated to $dir (branch $(git -C "$dir" rev-parse --abbrev-ref HEAD)); parking in that worktree's own stash, not touching the shared working tree"
  git -C "$dir" status --short
  git -C "$dir" stash push -u -m "${label}-leftover $(date '+%Y-%m-%d %H:%M')" >/dev/null 2>&1 || true
}
