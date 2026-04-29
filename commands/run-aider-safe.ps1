param(
  [string[]]$Files = @("src/App.tsx", "src/App.css")
)

$ErrorActionPreference = "Stop"

Write-Host "Checking git status..." -ForegroundColor Cyan
git status --short

$dirty = git status --short
if ($dirty) {
  Write-Host "Working tree is not clean. Commit or restore changes before running Aider." -ForegroundColor Red
  exit 1
}

Write-Host "Starting Aider safely..." -ForegroundColor Cyan
Write-Host "Target files: $($Files -join ', ')" -ForegroundColor Yellow

aider `
  --model ollama/qwen2.5-coder:7b `
  --no-auto-commits `
  --no-dirty-commits `
  --test-cmd "npm run build" `
  --read CONVENTIONS.md `
  --read AGENTS.md `
  @Files
