// Stage 10: Apple Vision hand landmarks -> Layer A ScanObservation JSON.
//
// Usage (macOS 12 or later, Xcode command line tools):
//
//   swift research/stage10/vision-dump.swift <out-dir> [--upright <dir>] <photo> [<photo> ...]
//
// Name the photos by the Stage 10 convention first (S1-N0-V1-1.jpg,
// CAL-01.heic, ...): the captureId is the file name without its extension.
// Writes <out-dir>/<captureId>.json for each photo. With --upright, also
// writes an upright JPEG copy of each photo to <dir> — ANNOTATE THOSE: an
// iPhone photo is usually stored sideways with an EXIF rotation flag that
// many image tools ignore, and then the clicked coordinates would not be in
// the frame Vision's are in. The copies are for the local annotation only.
//
// What it records is Layer A only — what Vision saw, nothing estimated:
//   - the 21 joints in PIXELS of the orientation-applied image, origin top-left
//     (Vision returns normalised, bottom-left coordinates; they are converted
//     here and the conversion is recorded)
//   - null for a joint Vision gave no confidence for, never 0 as a stand-in
//   - no nail-bed points: those come from the manual annotation file
// It never writes the image, GPS, or device identifiers. Only the 35 mm
// equivalent focal length is kept, to judge perspective afterwards.
//
// Joint names follow this repository's scheme (src/lib/nail3dLift.ts): every
// finger, the thumb included, is MCP / PIP / DIP / TIP from the palm out, so
// Vision's thumbCMC is "thumbMCP" and its "little" finger is "pinky".
//
// NOTE: written without a Mac to run it on (the analysis lives in a Linux CI).
// If it fails to build or run, report the message rather than patching around
// it — the coordinate conversion below is the part that must stay exact.

import CoreGraphics
import Foundation
import ImageIO
import Vision

struct DumpError: Error, CustomStringConvertible {
    let description: String
}

let joints: [(VNHumanHandPoseObservation.JointName, String)] = [
    (.wrist, "wrist"),
    (.thumbCMC, "thumbMCP"), (.thumbMP, "thumbPIP"), (.thumbIP, "thumbDIP"), (.thumbTip, "thumbTIP"),
    (.indexMCP, "indexMCP"), (.indexPIP, "indexPIP"), (.indexDIP, "indexDIP"), (.indexTip, "indexTIP"),
    (.middleMCP, "middleMCP"), (.middlePIP, "middlePIP"), (.middleDIP, "middleDIP"), (.middleTip, "middleTIP"),
    (.ringMCP, "ringMCP"), (.ringPIP, "ringPIP"), (.ringDIP, "ringDIP"), (.ringTip, "ringTIP"),
    (.littleMCP, "pinkyMCP"), (.littlePIP, "pinkyPIP"), (.littleDIP, "pinkyDIP"), (.littleTip, "pinkyTIP"),
]

/// "S3-N1-V2-1" -> "S3". Each calibration frame is its own placement.
func sessionId(of captureId: String) -> String {
    if captureId.hasPrefix("CAL-") { return captureId }
    return captureId.split(separator: "-").first.map(String.init) ?? captureId
}

/// The photo with its EXIF orientation baked in, at full size, as JPEG.
func writeUpright(_ source: CGImageSource, longSide: Int, to url: URL) throws {
    let options: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: longSide,
    ]
    guard let upright = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary),
          let destination = CGImageDestinationCreateWithURL(url as CFURL, "public.jpeg" as CFString, 1, nil)
    else { throw DumpError(description: "cannot write \(url.path)") }
    CGImageDestinationAddImage(destination, upright, [kCGImageDestinationLossyCompressionQuality: 0.95] as CFDictionary)
    guard CGImageDestinationFinalize(destination) else { throw DumpError(description: "cannot finalize \(url.path)") }
}

func dump(_ photo: URL, into outDir: URL, upright uprightDir: URL?) throws {
    guard let source = CGImageSourceCreateWithURL(photo as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
    else { throw DumpError(description: "cannot read \(photo.path)") }

    let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any] ?? [:]
    let exifOrientation = (properties[kCGImagePropertyOrientation] as? NSNumber)?.uint32Value ?? 1
    let orientation = CGImagePropertyOrientation(rawValue: exifOrientation) ?? .up
    // Orientations 5-8 turn the image by 90 degrees: the upright image swaps width and height.
    let quarterTurn = exifOrientation >= 5 && exifOrientation <= 8
    let width = Double(quarterTurn ? image.height : image.width)
    let height = Double(quarterTurn ? image.width : image.height)
    let exif = properties[kCGImagePropertyExifDictionary] as? [CFString: Any] ?? [:]

    let request = VNDetectHumanHandPoseRequest()
    request.maximumHandCount = 2
    // Given the orientation, Vision reports coordinates in the upright image.
    let handler = VNImageRequestHandler(cgImage: image, orientation: orientation, options: [:])
    try handler.perform([request])
    let hands = (request.results ?? []).compactMap { $0 as? VNHumanHandPoseObservation }

    // One hand is in the photo; if Vision reports two, keep the more confident.
    var best: (VNHumanHandPoseObservation, [VNHumanHandPoseObservation.JointName: VNRecognizedPoint])?
    var bestScore: Float = -1
    for hand in hands {
        let points = try hand.recognizedPoints(.all)
        let score = points.values.reduce(Float(0)) { $0 + $1.confidence }
        if score > bestScore {
            bestScore = score
            best = (hand, points)
        }
    }

    let captureId = photo.deletingPathExtension().lastPathComponent
    var missing: [String] = ["camera", "nails"]
    var landmarks: [[String: Any]] = []
    for (joint, name) in joints {
        if let point = best?.1[joint], point.confidence > 0 {
            landmarks.append([
                "name": name,
                "x": Double(point.location.x) * width,
                "y": (1.0 - Double(point.location.y)) * height,
                "confidence": Double(point.confidence),
            ])
        } else {
            landmarks.append(["name": name, "x": NSNull(), "y": NSNull(), "confidence": NSNull()])
            missing.append("landmarks.\(name)")
        }
    }
    if best == nil { missing.append("hand (Vision found none)") }

    var chirality = "unavailable"
    if #available(macOS 12.0, *), let hand = best?.0 {
        switch hand.chirality {
        case .left: chirality = "left"
        case .right: chirality = "right"
        default: chirality = "unknown"
        }
    }

    var observation: [String: Any] = [
        "schemaVersion": 1,
        "captureId": captureId,
        "sessionId": sessionId(of: captureId),
        // The protocol uses the right hand; Vision's own call is kept beside it.
        "handedness": "right",
        "handednessSource": "userSelected",
        "visionChirality": chirality,
        "image": [
            "fileName": photo.lastPathComponent,
            "width": width,
            "height": height,
            "exifOrientation": Int(exifOrientation),
            "coordinateOrigin": "topLeft",
            "units": "pixels",
        ],
        "landmarkModel": [
            "provider": "vision",
            "request": "VNDetectHumanHandPoseRequest",
            "revision": request.revision,
            "dimensionality": "2d",
            "coordinateConversion": "vision-normalized-bottomLeft -> pixel-topLeft (orientation applied)",
        ],
        "landmarks": landmarks,
        "nails": [],
        "missing": missing,
    ]
    if let focal = exif[kCGImagePropertyExifFocalLenIn35mmFilm] as? NSNumber {
        observation["lens"] = ["focalLength35mm": focal.doubleValue]
    }
    if let taken = exif[kCGImagePropertyExifDateTimeOriginal] as? String {
        observation["capturedAtLocal"] = taken
    }

    let data = try JSONSerialization.data(withJSONObject: observation, options: [.prettyPrinted, .sortedKeys])
    try data.write(to: outDir.appendingPathComponent("\(captureId).json"))
    if let dir = uprightDir {
        try writeUpright(source, longSide: Int(max(width, height)), to: dir.appendingPathComponent("\(captureId).jpg"))
    }
    let found = landmarks.filter { !($0["x"] is NSNull) }.count
    print("\(captureId): \(found)/21 joints, chirality \(chirality)")
}

var arguments = Array(CommandLine.arguments.dropFirst())
guard arguments.count >= 2 else {
    print("usage: swift vision-dump.swift <out-dir> [--upright <dir>] <photo> [<photo> ...]")
    exit(2)
}
let outDir = URL(fileURLWithPath: arguments.removeFirst(), isDirectory: true)
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
var uprightDir: URL?
if arguments.first == "--upright", arguments.count >= 2 {
    arguments.removeFirst()
    let dir = URL(fileURLWithPath: arguments.removeFirst(), isDirectory: true)
    try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    uprightDir = dir
}
var failures = 0
for path in arguments {
    do {
        try dump(URL(fileURLWithPath: path), into: outDir, upright: uprightDir)
    } catch {
        failures += 1
        print("FAILED \(path): \(error)")
    }
}
exit(failures == 0 ? 0 : 1)
