// Stage 10 — render the blind DIP / PIP crops planned by blind-cli.ts.
//
//   swift research/stage10/blind-crops.swift <data-dir>/blind/key.json <upright-dir> <blind-dir>
//
// For each entry of the key: the upright copy <upright-dir>/<captureId>.jpg,
// drawn through the transform stored in the key, into a crop of the stored
// size, written as <blind-dir>/pass<N>/<blindId>.jpg. Nothing else is drawn:
// no Vision point, no earlier mark. No geometry is computed here — blind.ts
// computes the transform and tests it; this only applies it.
//
// Not executed in the session that wrote it (no Mac): Stage 10A is its first
// run, and smoke-check.ts S10 checks the marks it leads to land on Vision's
// DIP and PIP.

import CoreGraphics
import Foundation
import ImageIO

struct Crop: Decodable { let width: Double; let height: Double }
struct Transform: Decodable { let a: Double; let b: Double; let c: Double; let d: Double; let tx: Double; let ty: Double }
struct Entry: Decodable { let blindId: String; let captureId: String; let pass: Int; let crop: Crop; let cg: Transform; let uprightHeight: Double }
struct Key: Decodable { let kind: String; let entries: [Entry] }

let arguments = Array(CommandLine.arguments.dropFirst())
guard arguments.count == 3 else {
    print("usage: swift blind-crops.swift <key.json> <upright-dir> <blind-dir>")
    exit(2)
}
let key = try JSONDecoder().decode(Key.self, from: Data(contentsOf: URL(fileURLWithPath: arguments[0])))
guard key.kind == "stage10-blind-key" else {
    print("\(arguments[0]) is not a Stage 10 blind key")
    exit(2)
}
let uprightDir = URL(fileURLWithPath: arguments[1])
let blindDir = URL(fileURLWithPath: arguments[2])

var images: [String: CGImage] = [:]
func upright(_ captureId: String) -> CGImage? {
    if let cached = images[captureId] { return cached }
    let url = uprightDir.appendingPathComponent("\(captureId).jpg")
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else { return nil }
    images[captureId] = image
    return image
}

for entry in key.entries {
    guard let image = upright(entry.captureId) else {
        print("cannot read \(entry.captureId).jpg in \(uprightDir.path)")
        exit(1)
    }
    // The transform assumes the upright copy is as tall as Layer A says (smoke-check S2 checks the sizes).
    guard Double(image.height) == entry.uprightHeight else {
        print("\(entry.captureId).jpg is \(image.height) px tall, the key says \(Int(entry.uprightHeight))")
        exit(1)
    }
    let width = Int(entry.crop.width)
    let height = Int(entry.crop.height)
    guard let context = CGContext(
        data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
    ) else {
        print("cannot make a \(width)x\(height) context")
        exit(1)
    }
    context.setFillColor(red: 0.5, green: 0.5, blue: 0.5, alpha: 1)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.interpolationQuality = .high
    let t = entry.cg
    context.concatenate(CGAffineTransform(a: t.a, b: t.b, c: t.c, d: t.d, tx: t.tx, ty: t.ty))
    context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
    guard let crop = context.makeImage() else {
        print("cannot render \(entry.blindId)")
        exit(1)
    }
    let dir = blindDir.appendingPathComponent("pass\(entry.pass)")
    try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    let out = dir.appendingPathComponent("\(entry.blindId).jpg")
    guard let destination = CGImageDestinationCreateWithURL(out as CFURL, "public.jpeg" as CFString, 1, nil) else {
        print("cannot write \(out.path)")
        exit(1)
    }
    CGImageDestinationAddImage(destination, crop, [kCGImageDestinationLossyCompressionQuality: 0.95] as CFDictionary)
    guard CGImageDestinationFinalize(destination) else {
        print("cannot finalize \(out.path)")
        exit(1)
    }
}
print("wrote \(key.entries.count) crops into \(blindDir.path)/pass1 and pass2. Mark only these; keep the key and the data folder closed until both passes are done.")
