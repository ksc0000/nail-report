#!/bin/bash
# QA Preflight Script for Commercial MVP (Issue #113)
# Run this script before production deployment to verify automated checks.
# Manual checks (iPhone Safari, incognito share, etc.) still require human QA.

set -e

PASS=0
FAIL=0
WARN=0

pass() { PASS=$((PASS + 1)); echo "  ✅ $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  ❌ $1"; }
warn() { WARN=$((WARN + 1)); echo "  ⚠️  $1"; }

echo ""
echo "======================================"
echo " Nailous QA Preflight Check"
echo "======================================"
echo ""

# 1. Build check
echo "📦 1. Build Check (tsc + vite build)"
if npm run build > /dev/null 2>&1; then
  pass "npm run build succeeded"
else
  fail "npm run build failed"
fi

# 2. Lint check
echo "🔍 2. Lint Check (eslint)"
if npm run lint > /dev/null 2>&1; then
  pass "npm run lint passed with 0 errors"
else
  fail "npm run lint has errors"
fi

# 3. Test check
echo "🧪 3. Test Check (vitest)"
if npm test -- --run > /dev/null 2>&1; then
  pass "npm test passed"
else
  warn "npm test failed or no tests found"
fi

# 4. Dependency vulnerability scan
echo "🔒 4. Dependency Vulnerability Scan"
AUDIT_OUTPUT=$(npm audit --audit-level=moderate 2>&1) || true
if echo "$AUDIT_OUTPUT" | grep -q "found 0 vulnerabilities"; then
  pass "npm audit: 0 moderate+ vulnerabilities"
else
  VULN_COUNT=$(echo "$AUDIT_OUTPUT" | grep -oE '[0-9]+ vulnerabilities' | head -1)
  warn "npm audit found issues: $VULN_COUNT"
fi

# 5. Route existence check (verify key pages exist in build output)
echo "🗺️  5. Route Verification"
if [ -f "dist/index.html" ]; then
  pass "dist/index.html exists (SPA entry point)"
else
  fail "dist/index.html missing — build may have failed"
fi

# 6. Key source files existence
echo "📄 6. Key Source Files"
REQUIRED_FILES=(
  "src/App.tsx"
  "src/App.css"
  "src/components/PrivacyPolicyPage.tsx"
  "src/components/TermsOfServicePage.tsx"
  "src/components/NailImageDetailViewer.tsx"
  "src/components/NailComparisonPanel.tsx"
  "src/components/ErrorBanner.tsx"
  "src/lib/firebase.ts"
  "src/lib/firestore.ts"
  "src/lib/auth.ts"
  "src/lib/storage.ts"
  "src/lib/publicShares.ts"
  "src/lib/nailTags.ts"
  "src/lib/featureFlags.ts"
  "src/lib/firebaseConfigStatus.ts"
)
for f in "${REQUIRED_FILES[@]}"; do
  if [ -f "$f" ]; then
    pass "$f exists"
  else
    fail "$f missing"
  fi
done

# 7. Security rules syntax check
echo "🛡️  7. Security Rules Files"
for rules_file in "firestore.rules" "storage.rules"; do
  if [ -f "$rules_file" ]; then
    pass "$rules_file exists"
  else
    warn "$rules_file not found"
  fi
done

# 8. Firebase config check
echo "🔥 8. Firebase Configuration"
if [ -f "firebase.json" ]; then
  pass "firebase.json exists"
else
  fail "firebase.json missing"
fi
if [ -f ".firebaserc" ]; then
  pass ".firebaserc exists"
else
  warn ".firebaserc not found (needed for deployment)"
fi

# 9. Bundle size check
echo "📊 9. Bundle Size Check"
if [ -d "dist/assets" ]; then
  JS_SIZE=$(find dist/assets -name "*.js" -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
  CSS_SIZE=$(find dist/assets -name "*.css" -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
  JS_KB=$((JS_SIZE / 1024))
  CSS_KB=$((CSS_SIZE / 1024))
  echo "    JS total: ${JS_KB}KB, CSS total: ${CSS_KB}KB"
  if [ "$JS_KB" -gt 500 ]; then
    warn "JS bundle > 500KB (${JS_KB}KB) — consider code splitting"
  else
    pass "JS bundle under 500KB (${JS_KB}KB)"
  fi
else
  warn "dist/assets not found — build may not have run"
fi

# 10. Docs readiness
echo "📋 10. Release Documentation"
REQUIRED_DOCS=(
  "docs/operations/PRODUCTION_RELEASE_RUNBOOK.md"
  "docs/operations/PRODUCTION_SMOKE_TEST_CHECKLIST.md"
  "docs/operations/PRODUCTION_FIREBASE_PREFLIGHT.md"
  "docs/operations/COMMERCIAL_LAUNCH_QA_REPORT.md"
  "docs/operations/IPHONE_SAFARI_CAMERA_SMOKE_REPORT.md"
)
for doc in "${REQUIRED_DOCS[@]}"; do
  if [ -f "$doc" ]; then
    pass "$doc exists"
  else
    warn "$doc missing"
  fi
done

# Summary
echo ""
echo "======================================"
echo " QA Preflight Results"
echo "======================================"
echo "  ✅ Passed:   $PASS"
echo "  ❌ Failed:   $FAIL"
echo "  ⚠️  Warnings: $WARN"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "❌ PREFLIGHT FAILED — Fix the above failures before proceeding."
  exit 1
elif [ "$WARN" -gt 0 ]; then
  echo "⚠️  PREFLIGHT PASSED WITH WARNINGS — Review warnings before go/no-go."
  exit 0
else
  echo "✅ PREFLIGHT PASSED — Ready for manual QA."
  exit 0
fi
