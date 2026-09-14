import CoreGraphics
import CoreImage
import Foundation
import Vision

/// Extracts the small numeric summaries `NailShapeEstimator` needs from a
/// 立体スキャン angle photo: a binary "is this pixel the nail plate" mask,
/// built from Vision's foreground-subject mask combined with a skin-chroma
/// exclusion (mirrors `NailCleanup`'s skin window; kept standalone here,
/// without a UIKit dependency, so this file also compiles into the macOS
/// host bench tool alongside `NailDetector.swift`).
enum NailAngleMeasurer {
    struct Mask {
        let width: Int
        let height: Int
        let isNail: [Bool] // row-major

        func rowSpan(_ y: Int) -> (minX: Int, maxX: Int)? {
            guard y >= 0, y < height else { return nil }
            var minX = -1
            var maxX = -1
            let base = y * width
            for x in 0..<width where isNail[base + x] {
                if minX == -1 { minX = x }
                maxX = x
            }
            return minX == -1 ? nil : (minX, maxX)
        }

        struct BoundingBox { let minX, minY, maxX, maxY: Int }

        var boundingBox: BoundingBox? {
            var minX = width, minY = height, maxX = -1, maxY = -1
            for y in 0..<height {
                guard let span = rowSpan(y) else { continue }
                minX = min(minX, span.minX)
                maxX = max(maxX, span.maxX)
                minY = min(minY, y)
                maxY = max(maxY, y)
            }
            return maxX >= 0 ? BoundingBox(minX: minX, minY: minY, maxX: maxX, maxY: maxY) : nil
        }

        var pixelCount: Int { isNail.reduce(0) { $0 + ($1 ? 1 : 0) } }
    }

    /// Fixed analysis grid so the per-pixel work stays cheap regardless of
    /// the source photo's resolution. Subtle bows (side/cat's-paw curvature)
    /// are only a few percent of the frame, so this needs to be large enough
    /// that downsampling doesn't quantize them away (96 was too coarse —
    /// distinct curveV targets collapsed onto the same measured row in
    /// testing against the #389 synthetic bench).
    private static let analysisSize = 256

    /// nil when Vision's subject-mask request is unavailable, fails, or
    /// produces a mask too small/large to trust (mirrors the coverage guard
    /// in `NailCleanup.subjectMasked`).
    static func mask(for cgImage: CGImage) -> Mask? {
        guard #available(iOS 17.0, macOS 14.0, *) else { return nil }
        let request = VNGenerateForegroundInstanceMaskRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        try? handler.perform([request])
        var maskBuffer: CVPixelBuffer?
        if let observation = request.results?.first {
            maskBuffer = try? observation.generateScaledMaskForImage(
                forInstances: observation.allInstances,
                from: handler
            )
        }
        let imageCI = CIImage(cgImage: cgImage)
        let context = CIContext()
        // Fit the analysis grid to the source photo's own aspect ratio — a
        // fixed square grid would squash a portrait crop's y-axis more than
        // its x-axis, silently inflating every length-ratio measurement
        // below (archRatio, sagitta/chord, ...) by that distortion factor.
        let extent = imageCI.extent
        guard extent.width > 0, extent.height > 0 else { return nil }
        let longSide = Float(analysisSize)
        let sourceAspect = Float(extent.width / extent.height)
        let gridWidth = max(1, Int((sourceAspect >= 1 ? longSide : longSide * sourceAspect).rounded()))
        let gridHeight = max(1, Int((sourceAspect >= 1 ? longSide / sourceAspect : longSide).rounded()))

        guard let colorCG = context.createCGImage(imageCI, from: imageCI.extent),
              let colorPixels = rgbaPixels(of: colorCG, width: gridWidth, height: gridHeight)
        else { return nil }

        let maskPixels: [UInt8]
        if let maskBuffer,
           let maskCG = context.createCGImage(CIImage(cvPixelBuffer: maskBuffer), from: CIImage(cvPixelBuffer: maskBuffer).extent, format: .L8, colorSpace: CGColorSpaceCreateDeviceGray()),
           let pixels = grayscalePixels(of: maskCG, width: gridWidth, height: gridHeight) {
            maskPixels = pixels
        } else {
            #if targetEnvironment(simulator)
            // The simulator cannot run the foreground-mask model (like hand
            // pose, #360). Fall back to "differs from the border colour" so
            // the capture → estimate → badge wiring stays verifiable there.
            // Never used on a device: a failed segmentation must stay a
            // failed estimate, not a bad one.
            maskPixels = borderDifferenceMask(colorPixels, width: gridWidth, height: gridHeight)
            #else
            return nil
            #endif
        }

        let pixelCount = gridWidth * gridHeight
        var isNail = [Bool](repeating: false, count: pixelCount)
        for i in 0..<pixelCount {
            guard maskPixels[i] > 128 else { continue }
            let r = colorPixels[i * 4]
            let g = colorPixels[i * 4 + 1]
            let b = colorPixels[i * 4 + 2]
            isNail[i] = !isSkinChroma(r: r, g: g, b: b)
        }
        let result = Mask(width: gridWidth, height: gridHeight, isNail: isNail)
        // A mask that grabs almost nothing (bad segmentation) or almost
        // everything (background wasn't separated) isn't trustworthy.
        let coverage = Float(result.pixelCount) / Float(pixelCount)
        guard coverage > 0.03, coverage < 0.85 else { return nil }
        return result
    }

    #if targetEnvironment(simulator)
    /// Foreground = pixels far from the mean colour of the image border.
    private static func borderDifferenceMask(_ rgba: [UInt8], width: Int, height: Int) -> [UInt8] {
        var sum = (r: 0, g: 0, b: 0), count = 0
        for y in 0..<height {
            for x in 0..<width where x == 0 || y == 0 || x == width - 1 || y == height - 1 {
                let i = (y * width + x) * 4
                sum.r += Int(rgba[i]); sum.g += Int(rgba[i + 1]); sum.b += Int(rgba[i + 2]); count += 1
            }
        }
        guard count > 0 else { return [UInt8](repeating: 0, count: width * height) }
        let mean = (r: sum.r / count, g: sum.g / count, b: sum.b / count)
        return (0..<(width * height)).map { p in
            let i = p * 4
            let d = abs(Int(rgba[i]) - mean.r) + abs(Int(rgba[i + 1]) - mean.g) + abs(Int(rgba[i + 2]) - mean.b)
            return d > 60 ? 255 : 0
        }
    }
    #endif

    /// BT.601 skin-chroma window, mirroring `NailCleanup.skinSuppressed`'s
    /// per-pixel test (duplicated in miniature rather than shared, since
    /// that file is UIKit-only and this one needs to run on macOS too).
    private static func isSkinChroma(r: UInt8, g: UInt8, b: UInt8) -> Bool {
        let rf = Float(r), gf = Float(g), bf = Float(b)
        let cb = 128 - 0.168736 * rf - 0.331264 * gf + 0.5 * bf
        let cr = 128 + 0.5 * rf - 0.418688 * gf - 0.081312 * bf
        return cb > 77 && cb < 127 && cr > 133 && cr < 177
    }

    private static func grayscalePixels(of cgImage: CGImage, width: Int, height: Int) -> [UInt8]? {
        var buffer = [UInt8](repeating: 0, count: width * height)
        guard let context = CGContext(
            data: &buffer, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width,
            space: CGColorSpaceCreateDeviceGray(), bitmapInfo: 0
        ) else { return nil }
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        return buffer
    }

    private static func rgbaPixels(of cgImage: CGImage, width: Int, height: Int) -> [UInt8]? {
        var buffer = [UInt8](repeating: 0, count: width * height * 4)
        guard let context = CGContext(
            data: &buffer, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4,
            space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return nil }
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        return buffer
    }
}

extension NailAngleMeasurer {
    /// Width profile w(t) for the top-view shape fit: mask width per row
    /// within its bounding box, resampled to `samples` steps and normalized
    /// to its own peak. Also returns the box's width/height aspect for the
    /// length/width estimate. Which end (t=0) is the cuticle isn't resolved
    /// here — `NailShapeEstimator.estimateTop` tries both directions.
    static func topWidthProfile(mask: Mask, samples: Int = 24) -> (profile: [Float], aspect: Float)? {
        guard let box = mask.boundingBox else { return nil }
        let h = box.maxY - box.minY
        let w = box.maxX - box.minX
        guard h > 4, w > 2, samples > 1 else { return nil }

        var widths: [Float] = []
        widths.reserveCapacity(samples)
        for i in 0..<samples {
            let y = min(box.maxY, box.minY + Int(Float(i) / Float(samples - 1) * Float(h)))
            widths.append(mask.rowSpan(y).map { Float($0.maxX - $0.minX + 1) } ?? 0)
        }
        let peak = widths.max() ?? 0
        guard peak > 0 else { return nil }
        let aspect = Float(w + 1) / Float(h + 1)
        return (widths.map { $0 / peak }, aspect)
    }

    /// Side-view arch/thickness ratios. `archRatio`: sagitta of the mask's
    /// centerline (the midpoint between each row's left/right edge) at its
    /// midpoint, relative to a straight line between the mask's two ends —
    /// mirror-symmetric, so it doesn't depend on which side of the frame the
    /// finger is on (`side` vs `otherSide` are captured from opposite
    /// lateral directions). `thicknessRatio`: the mask's average width near
    /// its free-edge end, divided by its length.
    static func sideArchAndThickness(mask: Mask) -> (archRatio: Float, thicknessRatio: Float)? {
        guard let box = mask.boundingBox else { return nil }
        let length = Float(box.maxY - box.minY + 1)
        guard length > 8 else { return nil }

        var centerline: [(y: Int, x: Float)] = []
        for y in box.minY...box.maxY {
            if let span = mask.rowSpan(y) {
                centerline.append((y, Float(span.minX + span.maxX) / 2))
            }
        }
        guard centerline.count > 6, let start = centerline.first, let end = centerline.last else { return nil }
        let mid = centerline[centerline.count / 2]
        let yRange = Float(end.y - start.y)
        let t = yRange > 0 ? Float(mid.y - start.y) / yRange : 0
        let baseline = start.x + (end.x - start.x) * t
        let archRatio = abs(mid.x - baseline) / length

        let tipRows = max(1, Int(length * 0.08))
        var tipWidths: [Float] = []
        for y in max(box.minY, box.maxY - tipRows)...box.maxY {
            if let span = mask.rowSpan(y) { tipWidths.append(Float(span.maxX - span.minX + 1)) }
        }
        guard !tipWidths.isEmpty else { return nil }
        let thicknessRatio = (tipWidths.reduce(0, +) / Float(tipWidths.count)) / length
        return (archRatio, thicknessRatio)
    }

    /// Cat's-paw sagitta/chord: how much the mask's width bulges at its
    /// widest row versus a straight taper between its neighbours a short
    /// distance away, relative to that width. Width-based (not left/right
    /// position based), so it's robust to the frame being mirrored.
    static func catPawSagittaOverChord(mask: Mask) -> Float? {
        guard let box = mask.boundingBox else { return nil }
        let height = box.maxY - box.minY
        guard height > 8 else { return nil }
        let step = max(2, height / 12)

        var bestRow = -1
        var bestWidth = -1
        for y in box.minY...box.maxY {
            guard let span = mask.rowSpan(y) else { continue }
            let width = span.maxX - span.minX
            if width > bestWidth { bestWidth = width; bestRow = y }
        }
        guard bestRow >= 0, bestWidth > 4,
              let nearSpan = mask.rowSpan(max(box.minY, bestRow - step)),
              let farSpan = mask.rowSpan(min(box.maxY, bestRow + step))
        else { return nil }

        let nearWidth = Float(nearSpan.maxX - nearSpan.minX)
        let farWidth = Float(farSpan.maxX - farSpan.minX)
        let expected = (nearWidth + farWidth) / 2
        let sagitta = (Float(bestWidth) - expected) / 2
        return sagitta / Float(bestWidth)
    }
}
