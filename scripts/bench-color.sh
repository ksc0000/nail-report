#!/bin/bash
# AI cleanup colour-balance benchmark (issue #354).
#
# Builds Nailous, launches it in the iPhone 17 Pro simulator with
# `-benchColor 1`, which makes the app synthesize a 5-nail set (4 normal +
# 1 washed-out) and run AICleanup.colorBalanced against it — purely local
# CoreImage logic, no Replicate network calls — then write a JSON summary
# and before/after PNGs to its Documents directory. This script waits for
# that file, then prints the washed-out sample's saturation before/after
# and the max saturation drift among the untouched normal samples.
#
# Any colour-fidelity PR (AICleanup.swift) must run this before/after and
# report both numbers.
set -euo pipefail

DEVICE_NAME="iPhone 17 Pro"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="$PROJECT_DIR/ios/Nailous.xcodeproj"
SCHEME="Nailous"
BUNDLE_ID="com.ksc0000.nailous"
DERIVED_DATA="$PROJECT_DIR/.build/bench-derived-data"
TIMEOUT_SECONDS=60

cd "$PROJECT_DIR"

echo "==> Locating '$DEVICE_NAME' simulator"
DEVICE_ID=$(xcrun simctl list devices available | grep -E "iPhone 17 Pro \(" | head -1 | sed -E 's/.*\(([0-9A-F-]+)\).*/\1/')
if [ -z "$DEVICE_ID" ]; then
  echo "error: simulator '$DEVICE_NAME' not found (run: xcrun simctl list devices available)" >&2
  exit 1
fi
echo "    device: $DEVICE_ID"

echo "==> Booting simulator (no-op if already booted)"
xcrun simctl boot "$DEVICE_ID" 2>/dev/null || true
xcrun simctl bootstatus "$DEVICE_ID" -b >/dev/null

echo "==> Building $SCHEME (Debug, $DEVICE_NAME)"
BUILD_LOG="$(mktemp)"
if ! xcodebuild -project "$PROJECT" -scheme "$SCHEME" \
    -destination "id=$DEVICE_ID" \
    -derivedDataPath "$DERIVED_DATA" \
    build > "$BUILD_LOG" 2>&1; then
  echo "error: build failed, see $BUILD_LOG" >&2
  tail -60 "$BUILD_LOG" >&2
  exit 1
fi
echo "    build OK"

APP_PATH="$DERIVED_DATA/Build/Products/Debug-iphonesimulator/Nailous.app"
if [ ! -d "$APP_PATH" ]; then
  echo "error: built app not found at $APP_PATH" >&2
  exit 1
fi

echo "==> Installing & launching with -benchColor 1"
xcrun simctl install "$DEVICE_ID" "$APP_PATH"
xcrun simctl terminate "$DEVICE_ID" "$BUNDLE_ID" >/dev/null 2>&1 || true

DATA_DIR=$(xcrun simctl get_app_container "$DEVICE_ID" "$BUNDLE_ID" data)
RESULTS_FILE="$DATA_DIR/Documents/color-bench-results.json"
rm -f "$RESULTS_FILE"

xcrun simctl launch "$DEVICE_ID" "$BUNDLE_ID" -benchColor 1 >/dev/null

echo "==> Waiting for color-bench-results.json"
elapsed=0
while [ ! -f "$RESULTS_FILE" ]; do
  sleep 1
  elapsed=$((elapsed + 1))
  if [ "$elapsed" -ge "$TIMEOUT_SECONDS" ]; then
    echo "error: timed out waiting for $RESULTS_FILE" >&2
    exit 1
  fi
done
sleep 1

xcrun simctl terminate "$DEVICE_ID" "$BUNDLE_ID" >/dev/null 2>&1 || true

echo "    before/after images: $DATA_DIR/Documents/washed_out_{before,after}.png"

python3 - "$RESULTS_FILE" <<'PY'
import json
import sys

with open(sys.argv[1]) as f:
    summary = json.load(f)

before = summary["washedOutMedianBefore"]
after = summary["washedOutMedianAfter"]
drift = summary["normalMaxSaturationDelta"]

print()
for s in summary["samples"]:
    print(f"  {s['name']}: S {s['saturationBefore']:.3f} -> {s['saturationAfter']:.3f}")
print()
print(f"washed-out S: {before:.3f} -> {after:.3f} ({(after/before - 1) * 100:+.1f}%)")
print(f"normal max S drift: {drift:.4f}")
PY
