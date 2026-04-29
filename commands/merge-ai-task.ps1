param(
  [string]$BaseBranch = "main"
)

$ErrorActionPreference = "Stop"

$currentBranch = git branch --show-current

if ($currentBranch -eq $BaseBranch) {
  Write-Host "Already on $BaseBranch. Nothing to merge." -ForegroundColor Yellow
  exit 0
}

Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

Write-Host "`nChecking working tree..." -ForegroundColor Cyan
$dirty = git status --short
if ($dirty) {
  Write-Host "Working tree is not clean. Commit or restore changes first." -ForegroundColor Red
  git status
  exit 1
}

Write-Host "`nRunning build before merge..." -ForegroundColor Cyan
npm run build

Write-Host "`nSwitching to $BaseBranch..." -ForegroundColor Cyan
git switch $BaseBranch

Write-Host "`nMerging $currentBranch..." -ForegroundColor Cyan
git merge $currentBranch

Write-Host "`nMerge completed." -ForegroundColor Green
git log --oneline -5
