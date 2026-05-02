$ErrorActionPreference = "Stop"

$cssPath = "src/App.css"

if (-not (Test-Path $cssPath)) {
  Write-Host "CSS file not found: $cssPath" -ForegroundColor Red
  exit 1
}

$errors = @()

# Check only newly added lines in the current git diff.
# This avoids failing on legacy CSS that already existed before the AI edit.
$diff = git --no-pager diff -- $cssPath

$addedLines = $diff |
  Where-Object {
    $_ -like "+*" -and
    $_ -notlike "+++*"
  } |
  ForEach-Object {
    $_.Substring(1)
  }

foreach ($line in $addedLines) {
  if ($line -match '```') {
    $errors += "Markdown code fence found in added CSS line: $line"
  }

  if ($line -match '&\s*:[a-zA-Z-]+') {
    $errors += "CSS nesting selector found in added line. Use normal selectors instead: $line"
  }

  if ($line -match '\$\{') {
    $errors += "JavaScript template expression found in added CSS line: $line"
  }
}

if ($errors.Count -gt 0) {
  Write-Host "CSS guard failed:" -ForegroundColor Red
  foreach ($error in $errors) {
    Write-Host "- $error" -ForegroundColor Red
  }
  exit 1
}

Write-Host "CSS guard passed." -ForegroundColor Green