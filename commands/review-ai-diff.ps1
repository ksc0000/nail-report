$ErrorActionPreference = "Stop"

Write-Host "=== Git branch ===" -ForegroundColor Cyan
git branch --show-current

Write-Host "`n=== Git status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Git diff ===" -ForegroundColor Cyan
git --no-pager diff

Write-Host "`n=== Build check ===" -ForegroundColor Cyan

Write-Host "`n=== CSS guard ===" -ForegroundColor Cyan
.\commands\check-css-guard.ps1
npm run build
