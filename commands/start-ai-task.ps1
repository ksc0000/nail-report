param(
  [Parameter(Mandatory=$true)]
  [string]$TaskName
)

$ErrorActionPreference = "Stop"

Write-Host "Checking git status..." -ForegroundColor Cyan
$dirty = git status --short

if ($dirty) {
  Write-Host "Working tree is not clean. Commit or restore changes first." -ForegroundColor Red
  git status
  exit 1
}

$branchName = "ai/$TaskName"

Write-Host "Creating branch: $branchName" -ForegroundColor Cyan
git switch -c $branchName

Write-Host "AI task branch ready." -ForegroundColor Green
git branch --show-current
