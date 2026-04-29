param(
  [Parameter(Mandatory=$true)]
  [string]$Message,

  [string[]]$Files = @("src/App.tsx", "src/App.css")
)

$ErrorActionPreference = "Stop"

Write-Host "Running build..." -ForegroundColor Cyan
npm run build

Write-Host "`nShowing diff..." -ForegroundColor Cyan
git --no-pager diff

Write-Host "`nStaging files..." -ForegroundColor Cyan
git add @Files

Write-Host "`nCommitting..." -ForegroundColor Cyan
git commit -m $Message

Write-Host "`nDone." -ForegroundColor Green
git log --oneline -5
