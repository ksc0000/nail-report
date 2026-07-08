import CoreImage
import CoreImage.CIFilterBuiltins
import UIKit
import Vision

/// On-device cleanup applied when a crop is committed, attacking the three
/// causes of "切り抜き感":
///  1. subject mask (Vision foreground instance) swaps background/skin outside
///     the nail for the nail's own base colour
///  2. remaining skin-toned pixels near the edges are feathered into the base
///     colour (harmless on nude nails — skin ≈ base there)
///  3. baked-in photo highlights are tamed so SceneKit's clear coat becomes
///     the single source of gloss
enum NailCleanup {
    private static let ciContext = CIContext()

    static func process(_ image: UIImage) -> UIImage {
        let base = dominantCenterColor(of: image)
        var working = image
        if let masked = subjectMasked(working, background: base) {
            working = masked
        }
        working = skinSuppressed(working, base: base)
        working = highlightTamed(working)
        return working
    }

    // MARK: - 1. subject mask

    private static func subjectMasked(_ image: UIImage, background: UIColor) -> UIImage? {
        guard #available(iOS 17.0, *), let cgImage = image.cgImage else { return nil }
        let request = VNGenerateForegroundInstanceMaskRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        try? handler.perform([request])
        guard let observation = request.results?.first,
              let maskBuffer = try? observation.generateScaledMaskForImage(
                  forInstances: observation.allInstances,
                  from: handler
              )
        else { return nil }

        let maskCI = CIImage(cvPixelBuffer: maskBuffer)
        // A mask that grabs almost nothing is unreliable — keep the original.
        guard maskCoverage(maskCI) > 0.22 else { return nil }

        let imageCI = CIImage(cgImage: cgImage)
        let blend = CIFilter.blendWithMask()
        blend.inputImage = imageCI
        blend.backgroundImage = CIImage(color: CIColor(color: background)).cropped(to: imageCI.extent)
        blend.maskImage = maskCI
        guard let output = blend.outputImage,
              let rendered = ciContext.createCGImage(output, from: imageCI.extent)
        else { return nil }
        return UIImage(cgImage: rendered)
    }

    private static func maskCoverage(_ mask: CIImage) -> Double {
        let filter = CIFilter.areaAverage()
        filter.inputImage = mask
        filter.extent = mask.extent
        guard let output = filter.outputImage else { return 1 }
        var pixel = [UInt8](repeating: 0, count: 4)
        ciContext.render(
            output,
            toBitmap: &pixel,
            rowBytes: 4,
            bounds: CGRect(x: 0, y: 0, width: 1, height: 1),
            format: .RGBA8,
            colorSpace: CGColorSpaceCreateDeviceRGB()
        )
        return Double(pixel[0]) / 255.0
    }

    // MARK: - base colour

    /// Average colour of the central region — the nail's own base tone.
    static func dominantCenterColor(of image: UIImage) -> UIColor {
        guard let cgImage = image.cgImage else { return .systemPink }
        let ci = CIImage(cgImage: cgImage)
        let extent = ci.extent
        let center = CGRect(
            x: extent.midX - extent.width * 0.2,
            y: extent.midY - extent.height * 0.2,
            width: extent.width * 0.4,
            height: extent.height * 0.4
        )
        let filter = CIFilter.areaAverage()
        filter.inputImage = ci
        filter.extent = center
        guard let output = filter.outputImage else { return .systemPink }
        var pixel = [UInt8](repeating: 0, count: 4)
        ciContext.render(
            output,
            toBitmap: &pixel,
            rowBytes: 4,
            bounds: CGRect(x: 0, y: 0, width: 1, height: 1),
            format: .RGBA8,
            colorSpace: CGColorSpaceCreateDeviceRGB()
        )
        return UIColor(
            red: CGFloat(pixel[0]) / 255,
            green: CGFloat(pixel[1]) / 255,
            blue: CGFloat(pixel[2]) / 255,
            alpha: 1
        )
    }

    // MARK: - 2. skin feathering

    /// Blends skin-chroma pixels toward the base colour, weighted toward the
    /// edges where surrounding skin actually appears.
    private static func skinSuppressed(_ image: UIImage, base: UIColor) -> UIImage {
        guard let cgImage = image.cgImage else { return image }
        let width = cgImage.width
        let height = cgImage.height
        guard let context = CGContext(
            data: nil,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: width * 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return image }
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        guard let raw = context.data else { return image }
        let pixels = raw.bindMemory(to: UInt8.self, capacity: width * height * 4)

        var baseR: CGFloat = 0, baseG: CGFloat = 0, baseB: CGFloat = 0, baseA: CGFloat = 0
        base.getRed(&baseR, green: &baseG, blue: &baseB, alpha: &baseA)
        let bR = Float(baseR) * 255, bG = Float(baseG) * 255, bB = Float(baseB) * 255

        for y in 0..<height {
            let ny = (Float(y) / Float(height) - 0.5) * 2 // -1…1
            let row = y * width * 4
            for x in 0..<width {
                let nx = (Float(x) / Float(width) - 0.5) * 2
                // weight rises toward the sides/corners where skin lives
                let edge = max(abs(nx), 0.55 * abs(ny) + 0.45 * abs(nx))
                guard edge > 0.45 else { continue }
                let index = row + x * 4
                let r = Float(pixels[index])
                let g = Float(pixels[index + 1])
                let b = Float(pixels[index + 2])
                // BT.601 chroma — classic skin window
                let cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
                let cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b
                guard cb > 77, cb < 127, cr > 133, cr < 177 else { continue }
                let strength = min(1, (edge - 0.45) / 0.4)
                pixels[index] = UInt8(max(0, min(255, r + (bR - r) * strength)))
                pixels[index + 1] = UInt8(max(0, min(255, g + (bG - g) * strength)))
                pixels[index + 2] = UInt8(max(0, min(255, b + (bB - b) * strength)))
            }
        }

        guard let output = context.makeImage() else { return image }
        return UIImage(cgImage: output)
    }

    // MARK: - 3. highlight taming

    /// Pulls down the photo's own specular highlights; the 3D clear coat then
    /// supplies the (single) gloss.
    private static func highlightTamed(_ image: UIImage) -> UIImage {
        guard let input = CIImage(image: image) else { return image }
        let filter = CIFilter.highlightShadowAdjust()
        filter.inputImage = input
        filter.highlightAmount = 0.55
        filter.shadowAmount = 0.15
        guard let output = filter.outputImage,
              let rendered = ciContext.createCGImage(output, from: input.extent)
        else { return image }
        return UIImage(cgImage: rendered)
    }
}
