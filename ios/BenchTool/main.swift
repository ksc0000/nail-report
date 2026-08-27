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
}

struct Manifest: Decodable {
    let cases: [ImageCase]
}

struct CaseResult: Encodable {
    let file: String
    let expectedNails: Int
    let detectedNails: Int
    let success: Bool
}

struct Summary: Encodable {
    let total: Int
    let succeeded: Int
    let successRate: Double
    let results: [CaseResult]
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
            results.append(CaseResult(file: testCase.file, expectedNails: testCase.expectedNails, detectedNails: 0, success: false))
            continue
        }
        let detected = await NailDetector.detectNails(cgImage: cgImage, orientation: orientation)
        let success = detected.count == testCase.expectedNails
        results.append(CaseResult(file: testCase.file, expectedNails: testCase.expectedNails, detectedNails: detected.count, success: success))
    }
    let succeeded = results.filter(\.success).count
    let rate = results.isEmpty ? 0 : Double(succeeded) / Double(results.count)
    return Summary(total: results.count, succeeded: succeeded, successRate: rate, results: results)
}

let summary = await run()
let data = try! JSONEncoder().encode(summary)
print(String(decoding: data, as: UTF8.self))
