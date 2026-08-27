#!/bin/bash
# Nail-detection benchmark (issues #352, #360).
#
# Runs the shared NailDetector core (ios/Nailous/NailDetector.swift) as a
# standalone macOS command-line tool (ios/BenchTool/main.swift) against the
# checked-in ios/BenchmarkAssets image set, and prints "N枚中M枚成功 (X%)".
#
# This runs on the macOS host rather than in the iOS Simulator: the
# Simulator's VNDetectHumanHandPoseRequest implementation reliably returns
# zero hands even on real photos (see #360), so detection accuracy can only
# be measured on macOS, where Vision hand-pose works normally. The iOS app
# itself is unaffected — it still runs NailDetector via UIKit on-device.
#
# Any detection-accuracy PR (NailDetector.swift / PhotoCropView.swift) must
# run this before/after and report both numbers.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS_DIR="$PROJECT_DIR/ios/BenchmarkAssets"
BUILD_DIR="$PROJECT_DIR/.build/bench-tool"
BINARY="$BUILD_DIR/bench-tool"

mkdir -p "$BUILD_DIR"

echo "==> Compiling bench-tool (macOS host, NailDetector core + BenchTool/main.swift)"
if ! xcrun swiftc -O \
    "$PROJECT_DIR/ios/Nailous/NailDetector.swift" \
    "$PROJECT_DIR/ios/BenchTool/main.swift" \
    -o "$BINARY" 2>"$BUILD_DIR/build.log"; then
  echo "error: swiftc build failed, see $BUILD_DIR/build.log" >&2
  cat "$BUILD_DIR/build.log" >&2
  exit 1
fi
echo "    build OK"

echo "==> Running bench-tool against $ASSETS_DIR"
RESULTS_JSON=$(xcrun "$BINARY" "$ASSETS_DIR")

python3 - "$RESULTS_JSON" <<'PY'
import json
import sys

summary = json.loads(sys.argv[1])

total = summary["total"]
succeeded = summary["succeeded"]
rate = summary["successRate"] * 100

print()
for r in summary["results"]:
    mark = "OK" if r["success"] else "NG"
    line = f"  [{mark}] {r['file']}: detected={r['detectedNails']} expected={r['expectedNails']}"
    offset = r.get("meanCenterOffsetPx")
    if offset is not None:
        line += f"  centerOffset={offset:.1f}px (n={r['matchedCenters']})"
    print(line)
print()
print(f"{total}枚中{succeeded}枚成功 ({rate:.1f}%)")
overall_offset = summary.get("overallMeanCenterOffsetPx")
if overall_offset is not None:
    print(f"平均中心ズレ: {overall_offset:.1f}px（ground truth付き画像のみ）")
PY
