import CoreGraphics
import Foundation
import ImageIO

// macOS host runner for the Phase 2 shape/curve estimator benchmark
// (issue #389, see scripts/bench-angles.sh). Same rationale as
// ios/BenchTool/main.swift for the detection benchmark: this runs the
// shared NailShapeEstimator/NailAngleMeasurer core directly on macOS rather
// than in the iOS Simulator, so it isn't at the mercy of any
// Simulator-specific Vision quirks and doesn't need the app or a device.

struct Case: Decodable {
    let id: String
    let shape: String
    let corner: Float
    let curveV: Float
    let curveH: Float
    let top: String
    let side: String
    let otherSide: String
    let catHand: String
}

struct Manifest: Decodable {
    let cases: [Case]
}

struct CaseResult: Encodable {
    let id: String
    let expectedShape: String
    let predictedShape: String?
    let shapeCorrect: Bool
    let expectedCurveV: Float
    let predictedCurveV: Float?
    let curveVWithinTolerance: Bool?
    let expectedCurveH: Float
    let predictedCurveH: Float?
    let curveHWithinTolerance: Bool?
}

struct Summary: Encodable {
    let total: Int
    let shapeCorrect: Int
    let shapeAccuracy: Double
    let curveVWithinTolerance: Int
    let curveVEvaluated: Int
    let curveHWithinTolerance: Int
    let curveHEvaluated: Int
    let results: [CaseResult]
}

let tolerance: Float = 0.25

func loadCGImage(at url: URL) -> CGImage? {
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(source, 0, nil)
}

guard CommandLine.arguments.count > 1 else {
    FileHandle.standardError.write(Data("usage: bench-angles-tool <assets-dir>\n".utf8))
    exit(1)
}
let assetsDir = URL(fileURLWithPath: CommandLine.arguments[1])
let manifestURL = assetsDir.appendingPathComponent("manifest.json")

let manifest: Manifest
do {
    let data = try Data(contentsOf: manifestURL)
    manifest = try JSONDecoder().decode(Manifest.self, from: data)
} catch {
    FileHandle.standardError.write(Data("error: failed to read manifest at \(manifestURL.path): \(error)\n".utf8))
    exit(1)
}

var results: [CaseResult] = []
for testCase in manifest.cases {
    var predictedShape: String?
    var predictedCurveV: Float?
    var predictedCurveH: Float?

    if let cg = loadCGImage(at: assetsDir.appendingPathComponent(testCase.top)),
       let mask = NailAngleMeasurer.mask(for: cg),
       let (profile, aspect) = NailAngleMeasurer.topWidthProfile(mask: mask),
       let estimate = NailShapeEstimator.estimateTop(widthProfile: profile, aspectRatio: aspect) {
        predictedShape = estimate.shape.rawValue
    }

    let sideMeasurements = [testCase.side, testCase.otherSide].compactMap { file -> (archRatio: Float, thicknessRatio: Float)? in
        guard let cg = loadCGImage(at: assetsDir.appendingPathComponent(file)),
              let mask = NailAngleMeasurer.mask(for: cg)
        else { return nil }
        return NailAngleMeasurer.sideArchAndThickness(mask: mask)
    }
    if !sideMeasurements.isEmpty {
        let archRatio = sideMeasurements.map(\.archRatio).reduce(0, +) / Float(sideMeasurements.count)
        if let curveVEstimate = NailShapeEstimator.estimateCurveV(archRatio: archRatio) {
            predictedCurveV = curveVEstimate.value
        }
    }

    if let cg = loadCGImage(at: assetsDir.appendingPathComponent(testCase.catHand)),
       let mask = NailAngleMeasurer.mask(for: cg),
       let ratio = NailAngleMeasurer.catPawSagittaOverChord(mask: mask),
       let estimate = NailShapeEstimator.estimateCatPaw(sagittaOverChord: ratio) {
        predictedCurveH = estimate.curveH
    }

    let curveVOk = predictedCurveV.map { abs($0 - testCase.curveV) <= tolerance }
    let curveHOk = predictedCurveH.map { abs($0 - testCase.curveH) <= tolerance }

    results.append(CaseResult(
        id: testCase.id,
        expectedShape: testCase.shape,
        predictedShape: predictedShape,
        shapeCorrect: predictedShape == testCase.shape,
        expectedCurveV: testCase.curveV,
        predictedCurveV: predictedCurveV,
        curveVWithinTolerance: curveVOk,
        expectedCurveH: testCase.curveH,
        predictedCurveH: predictedCurveH,
        curveHWithinTolerance: curveHOk
    ))
}

let shapeCorrect = results.filter(\.shapeCorrect).count
let curveVEvaluated = results.compactMap(\.curveVWithinTolerance)
let curveHEvaluated = results.compactMap(\.curveHWithinTolerance)

let summary = Summary(
    total: results.count,
    shapeCorrect: shapeCorrect,
    shapeAccuracy: results.isEmpty ? 0 : Double(shapeCorrect) / Double(results.count),
    curveVWithinTolerance: curveVEvaluated.filter { $0 }.count,
    curveVEvaluated: curveVEvaluated.count,
    curveHWithinTolerance: curveHEvaluated.filter { $0 }.count,
    curveHEvaluated: curveHEvaluated.count,
    results: results
)

let data = try! JSONEncoder().encode(summary)
print(String(decoding: data, as: UTF8.self))
