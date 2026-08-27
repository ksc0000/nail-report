import CoreGraphics
import Foundation
import ImageIO

// macOS host runner for the nail-detection benchmark (#360). The iOS
// Simulator's Vision hand-pose implementation reliably returns zero hands
// even on real photos, so detection accuracy can only be measured by running
// the shared `NailDetector` core (ios/Nailous/NailDetector.swift, compiled
// into this tool alongside this file — see scripts/bench-detect.sh) directly
// on macOS, where Vision works normally.

struct ImageCase: Decodable {
    let file: String
    let expectedNails: Int
    /// Ground-truth marker centers (image pixel coords, top-left origin,
    /// same space as `DetectedNail.center`), hand-annotated on the
    /// checked-in photo for cases where present. Optional: only a subset of
    /// cases have this so far (#356).
    let expectedNailCenters: [[Double]]?
}

struct Manifest: Decodable {
    let cases: [ImageCase]
}

struct CaseResult: Encodable {
    let file: String
    let expectedNails: Int
    let detectedNails: Int
    let success: Bool
    /// Mean pixel distance between each ground-truth nail center and its
    /// nearest detected marker, greedily matched (nil if this case has no
    /// `expectedNailCenters`).
    let meanCenterOffsetPx: Double?
    let matchedCenters: Int?
}

struct Summary: Encodable {
    let total: Int
    let succeeded: Int
    let successRate: Double
    /// Mean of `meanCenterOffsetPx` across all cases that have ground-truth
    /// centers (nil if none do).
    let overallMeanCenterOffsetPx: Double?
    let results: [CaseResult]
}

/// Greedily matches each expected center to its nearest not-yet-used
/// detected center (smallest distances assigned first) and returns the mean
/// distance over matched pairs. Not a globally optimal assignment, but
/// stable and good enough to track before/after tuning deltas.
func meanCenterOffset(expected: [[Double]], detected: [CGPoint]) -> (mean: Double, matched: Int)? {
    guard !expected.isEmpty, !detected.isEmpty else { return nil }
    var pairs: [(e: Int, d: Int, dist: Double)] = []
    for (e, ePoint) in expected.enumerated() {
        for (d, dPoint) in detected.enumerated() {
            let dist = hypot(ePoint[0] - Double(dPoint.x), ePoint[1] - Double(dPoint.y))
            pairs.append((e, d, dist))
        }
    }
    pairs.sort { $0.dist < $1.dist }
    var usedExpected = Set<Int>()
    var usedDetected = Set<Int>()
    var distances: [Double] = []
    for pair in pairs {
        guard !usedExpected.contains(pair.e), !usedDetected.contains(pair.d) else { continue }
        usedExpected.insert(pair.e)
        usedDetected.insert(pair.d)
        distances.append(pair.dist)
    }
    guard !distances.isEmpty else { return nil }
    return (distances.reduce(0, +) / Double(distances.count), distances.count)
}

guard CommandLine.arguments.count > 1 else {
    FileHandle.standardError.write(Data("usage: bench-tool <assets-dir>\n".utf8))
    exit(1)
}
let assetsDir = URL(fileURLWithPath: CommandLine.arguments[1])
let manifestURL = assetsDir.appendingPathComponent("manifest.json")

let manifest: Manifest
do {
    let manifestData = try Data(contentsOf: manifestURL)
    manifest = try JSONDecoder().decode(Manifest.self, from: manifestData)
} catch {
    FileHandle.standardError.write(Data("error: failed to read manifest at \(manifestURL.path): \(error)\n".utf8))
    exit(1)
}

func loadOrientedCGImage(at url: URL) -> (CGImage, CGImagePropertyOrientation)? {
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil)
    else { return nil }
    let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any]
    let rawOrientation = (properties?[kCGImagePropertyOrientation] as? UInt32) ?? 1
    let orientation = CGImagePropertyOrientation(rawValue: rawOrientation) ?? .up
    return (cgImage, orientation)
}

func run() async -> Summary {
    var results: [CaseResult] = []
    for testCase in manifest.cases {
        let imageURL = assetsDir.appendingPathComponent(testCase.file)
        guard let (cgImage, orientation) = loadOrientedCGImage(at: imageURL) else {
            FileHandle.standardError.write(Data("warning: failed to load \(imageURL.path)\n".utf8))
            results.append(CaseResult(file: testCase.file, expectedNails: testCase.expectedNails, detectedNails: 0, success: false, meanCenterOffsetPx: nil, matchedCenters: nil))
            continue
        }
        let detected = await NailDetector.detectNails(cgImage: cgImage, orientation: orientation)
        let success = detected.count == testCase.expectedNails
        let offset = testCase.expectedNailCenters.flatMap { meanCenterOffset(expected: $0, detected: detected.map(\.center)) }
        results.append(CaseResult(
            file: testCase.file,
            expectedNails: testCase.expectedNails,
            detectedNails: detected.count,
            success: success,
            meanCenterOffsetPx: offset?.mean,
            matchedCenters: offset?.matched
        ))
    }
    let succeeded = results.filter(\.success).count
    let rate = results.isEmpty ? 0 : Double(succeeded) / Double(results.count)
    let offsets = results.compactMap(\.meanCenterOffsetPx)
    let overallOffset = offsets.isEmpty ? nil : offsets.reduce(0, +) / Double(offsets.count)
    return Summary(total: results.count, succeeded: succeeded, successRate: rate, overallMeanCenterOffsetPx: overallOffset, results: results)
}

let summary = await run()
let data = try! JSONEncoder().encode(summary)
print(String(decoding: data, as: UTF8.self))
