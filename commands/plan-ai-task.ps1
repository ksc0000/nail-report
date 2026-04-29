param(
  [string[]]$ReadFiles = @("src/App.css")
)

$ErrorActionPreference = "Stop"

Write-Host "Checking git status..." -ForegroundColor Cyan
$dirty = git status --short

if ($dirty) {
  Write-Host "Working tree is not clean. Commit or restore changes before planning." -ForegroundColor Red
  git status
  exit 1
}

Write-Host "Starting Aider in PLANNER mode." -ForegroundColor Cyan
Write-Host "No editable files are passed. All project files are read-only context." -ForegroundColor Yellow

$baseArgs = @(
  "--model", "ollama/qwen2.5-coder:7b",
  "--no-auto-commits",
  "--no-dirty-commits",
  "--chat-mode", "ask",
  "--read", "AGENTS.md",
  "--read", "CONVENTIONS.md",
  "--read", "agents/planner.md"
)

$readArgs = @()

foreach ($file in $ReadFiles) {
  $readArgs += @("--read", $file)
}

aider @baseArgs @readArgs