#!/bin/bash
# Phase 2 shape/curve estimator benchmark (issue #389).
#
# Runs NailShapeEstimator.swift + NailAngleMeasurer.swift (ios/Nailous) as a
# standalone macOS command-line tool (ios/BenchAnglesTool/main.swift)
# against the checked-in ios/BenchmarkAssets/angles synthetic image set, and
# prints shape accuracy plus curveV/curveH tolerance hit-rate.
#
# Runs on the macOS host (same rationale as scripts/bench-detect.sh) so it
# doesn't depend on the Simulator or a device.
#
# Any change to the top/side/catHand estimation math (NailShapeEstimator.swift,
# NailAngleMeasurer.swift) must run this before/after and report both numbers.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS_DIR="$PROJECT_DIR/ios/BenchmarkAssets/angles"
BUILD_DIR="$PROJECT_DIR/.build/bench-angles-tool"
BINARY="$BUILD_DIR/bench-angles-tool"

mkdir -p "$BUILD_DIR"

echo "==> Compiling bench-angles-tool (macOS host, NailShape + NailShapeEstimator + NailAngleMeasurer + BenchAnglesTool/main.swift)"
if ! xcrun swiftc -O \
    "$PROJECT_DIR/ios/Nailous/NailShape.swift" \
    "$PROJECT_DIR/ios/Nailous/NailShapeEstimator.swift" \
    "$PROJECT_DIR/ios/Nailous/NailAngleMeasurer.swift" \
    "$PROJECT_DIR/ios/BenchAnglesTool/main.swift" \
    -o "$BINARY" 2>"$BUILD_DIR/build.log"; then
  echo "error: swiftc build failed, see $BUILD_DIR/build.log" >&2
  cat "$BUILD_DIR/build.log" >&2
  exit 1
fi
echo "    build OK"

echo "==> Running bench-angles-tool against $ASSETS_DIR"
RESULTS_JSON=$(xcrun "$BINARY" "$ASSETS_DIR")

python3 - "$RESULTS_JSON" <<'PY'
import json
import sys

summary = json.loads(sys.argv[1])

print()
for r in summary["results"]:
    mark = "OK" if r["shapeCorrect"] else "NG"
    line = f"  [{mark}] {r['id']}: shape predicted={r['predictedShape']} expected={r['expectedShape']}"
    if r["predictedCurveV"] is not None:
        okv = "OK" if r["curveVWithinTolerance"] else "NG"
        line += f"  curveV[{okv}] pred={r['predictedCurveV']:.2f} exp={r['expectedCurveV']:.2f}"
    else:
        line += "  curveV=n/a"
    if r["predictedCurveH"] is not None:
        okh = "OK" if r["curveHWithinTolerance"] else "NG"
        line += f"  curveH[{okh}] pred={r['predictedCurveH']:.2f} exp={r['expectedCurveH']:.2f}"
    else:
        line += "  curveH=n/a"
    print(line)

print()
print(f"shape正解率: {summary['shapeCorrect']}/{summary['total']} ({summary['shapeAccuracy'] * 100:.1f}%)")
print(f"curveV許容内(±0.25): {summary['curveVWithinTolerance']}/{summary['curveVEvaluated']}")
print(f"curveH許容内(±0.25): {summary['curveHWithinTolerance']}/{summary['curveHEvaluated']}")
PY
