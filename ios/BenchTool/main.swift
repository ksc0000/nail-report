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
    /// Photo-framing quality signal (#366) — used to decide whether to
    /// suggest a retake in `PhotoCropView`, reported here so a threshold
    /// change can be checked against the whole benchmark set before landing.
    let quality: DetectionQuality
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
/// of the larger side (exact, not greedy — see #356: on photos with crossed
/// or closely-packed fingers, a nearest-first greedy match could mis-pair
/// centers with a swap that's individually "nearest" but globally
/// suboptimal, by tens of px).
///
/// The DP processes "rows" in a fixed order (row `i` gets assigned exactly
/// when `mask.nonzeroBitCount == i`), and picks a "column" subset for them
/// via the mask, so *every* row is always matched to something but *not*
/// every column needs to be. Rows must therefore be the smaller set —
/// picking `expected` as rows unconditionally (as an earlier version did)
/// meant that whenever `expected.count > detected.count`, only the first
/// `detected.count` expected points (in manifest order) could ever be
/// matched, silently ignoring the rest instead of choosing the
/// best-matching subset (caught in cross-review, #356).
func meanCenterOffset(expected: [[Double]], detected: [CGPoint]) -> (mean: Double, matched: Int)? {
    guard !expected.isEmpty, !detected.isEmpty else { return nil }
    let expectedPoints = expected.map { (Double($0[0]), Double($0[1])) }
    let detectedPoints = detected.map { (Double($0.x), Double($0.y)) }
    let rows = expectedPoints.count <= detectedPoints.count ? expectedPoints : detectedPoints
    let cols = expectedPoints.count <= detectedPoints.count ? detectedPoints : expectedPoints
    let m = rows.count
    let n = cols.count
    var dist = [[Double]](repeating: [Double](repeating: 0, count: n), count: m)
    for r in 0..<m {
        for c in 0..<n {
            dist[r][c] = hypot(rows[r].0 - cols[c].0, rows[r].1 - cols[c].1)
        }
    }
    // dp[mask] = min cost of assigning the first popcount(mask) rows to
    // exactly the column indices in `mask`.
    let subsetCount = 1 << n
    var dp = [Double](repeating: .infinity, count: subsetCount)
    dp[0] = 0
    for mask in 0..<subsetCount {
        let assigned = mask.nonzeroBitCount
        guard assigned < m, dp[mask].isFinite else { continue }
        for c in 0..<n where mask & (1 << c) == 0 {
            let newMask = mask | (1 << c)
            let candidate = dp[mask] + dist[assigned][c]
            if candidate < dp[newMask] { dp[newMask] = candidate }
        }
    }
    let matched = m
    var best = Double.infinity
    for mask in 0..<subsetCount where mask.nonzeroBitCount == matched && dp[mask] < best {
        best = dp[mask]
    }
    guard best.isFinite else { return nil }
    return (best / Double(matched), matched)
}

/// Regression guard for `meanCenterOffset` (#356). There is no XCTest
/// target for this macOS host tool, so this runs unconditionally at
/// startup instead; a failure aborts before touching the manifest.
func runSelfTests() {
    func fail(_ message: String) -> Never {
        FileHandle.standardError.write(Data("self-test failed: \(message)\n".utf8))
        exit(1)
    }
    func assertClose(_ actual: Double, _ expected: Double, _ message: String, tolerance: Double = 1e-6) {
        guard abs(actual - expected) < tolerance else {
            fail("\(message) (actual=\(actual), expected=\(expected))")
        }
    }

    // expected.count > detected.count: must pick the best-matching subset
    // of expected points, not just the first N in manifest order (the exact
    // case caught in cross-review).
    do {
        guard let result = meanCenterOffset(expected: [[0, 0], [100, 0]], detected: [CGPoint(x: 100, y: 0)]) else {
            fail("expected>detected case returned nil")
        }
        assertClose(result.mean, 0, "expected>detected should match the closer expected point exactly")
        assertClose(Double(result.matched), 1, "expected>detected matched count")
    }

    // detected.count > expected.count: symmetric case, the extra detected
    // (false-positive) point must be ignored rather than dragging the mean.
    do {
        guard let result = meanCenterOffset(expected: [[100, 0]], detected: [CGPoint(x: 0, y: 0), CGPoint(x: 100, y: 0)]) else {
            fail("detected>expected case returned nil")
        }
        assertClose(result.mean, 0, "detected>expected should match the closer detected point exactly")
    }

    // Equal counts, non-trivial optimal assignment: a nearest-first greedy
    // match would mis-pair these (e.g. by processing in manifest order).
    do {
        let expected = [[0.0, 0.0], [10.0, 0.0]]
        let detectedPoints = [CGPoint(x: 9, y: 0), CGPoint(x: 1, y: 0)]
        guard let result = meanCenterOffset(expected: expected, detected: detectedPoints) else {
            fail("equal-count case returned nil")
        }
        assertClose(result.mean, 1, "equal-count optimal assignment should pair nearest points")
    }
}

runSelfTests()

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
            results.append(CaseResult(
                file: testCase.file, expectedNails: testCase.expectedNails, detectedNails: 0, success: false,
                meanCenterOffsetPx: nil, matchedCenters: nil,
                quality: NailDetector.assessQuality(nails: [], ambiguousJoints: 0, handCount: 0)
            ))
            continue
        }
        let (detected, quality) = await NailDetector.detectNails(cgImage: cgImage, orientation: orientation)
        let success = detected.count == testCase.expectedNails
        let offset = testCase.expectedNailCenters.flatMap { meanCenterOffset(expected: $0, detected: detected.map(\.center)) }
        results.append(CaseResult(
            file: testCase.file,
            expectedNails: testCase.expectedNails,
            detectedNails: detected.count,
            success: success,
            meanCenterOffsetPx: offset?.mean,
            matchedCenters: offset?.matched,
            quality: quality
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
