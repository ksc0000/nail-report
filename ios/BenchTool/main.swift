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

/// Finds the globally minimum-cost one-to-one assignment of expected
/// centers to detected centers (each expected matched to at most one
/// detected, each detected used at most once), via bitmask DP over subsets
/// of `detected` (exact, not greedy — see #356: on photos with crossed or
/// closely-packed fingers, a nearest-first greedy match could mis-pair
/// centers with a swap that's individually "nearest" but globally
/// suboptimal, by tens of px). `detected.count` is capped at ~13 in
/// practice (`NailDetector` stops merging past 10, plus stray extras), so
/// `1 << detected.count` subsets is cheap.
func meanCenterOffset(expected: [[Double]], detected: [CGPoint]) -> (mean: Double, matched: Int)? {
    guard !expected.isEmpty, !detected.isEmpty else { return nil }
    let m = expected.count
    let n = detected.count
    var dist = [[Double]](repeating: [Double](repeating: 0, count: n), count: m)
    for e in 0..<m {
        for d in 0..<n {
            dist[e][d] = hypot(expected[e][0] - Double(detected[d].x), expected[e][1] - Double(detected[d].y))
        }
    }
    // dp[mask] = min cost of assigning the first popcount(mask) expected
    // points to exactly the detected indices in `mask`.
    let subsetCount = 1 << n
    var dp = [Double](repeating: .infinity, count: subsetCount)
    dp[0] = 0
    for mask in 0..<subsetCount {
        let assigned = mask.nonzeroBitCount
        guard assigned < m, dp[mask].isFinite else { continue }
        for d in 0..<n where mask & (1 << d) == 0 {
            let newMask = mask | (1 << d)
            let candidate = dp[mask] + dist[assigned][d]
            if candidate < dp[newMask] { dp[newMask] = candidate }
        }
    }
    let matched = min(m, n)
    var best = Double.infinity
    for mask in 0..<subsetCount where mask.nonzeroBitCount == matched && dp[mask] < best {
        best = dp[mask]
    }
    guard best.isFinite else { return nil }
    return (best / Double(matched), matched)
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
