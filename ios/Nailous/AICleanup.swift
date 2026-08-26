import CoreImage
import CoreImage.CIFilterBuiltins
import UIKit

/// Phase 2 cloud cleanup via Replicate — opt-in, one tap per capture:
///  1. matting (851-labs/background-remover, 27M+ runs) cuts the nail out at
///     model quality, far beyond the on-device mask
///  2. the RGBA cutout is composited over the nail's base colour
///  3. Real-ESRGAN doubles the detail, then the result is resized back to the
///     texture size — crisper glitter and art, same memory footprint
///
/// The API token lives in a gitignored `Secrets.plist` (key
/// `ReplicateAPIToken`); without it the feature stays hidden.
enum AICleanup {
    private static let mattingVersion =
        "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc" // 851-labs/background-remover
    private static let upscaleVersion =
        "b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8" // nightmareai/real-esrgan

    static var isConfigured: Bool { token != nil }

    private static var token: String? {
        guard let url = Bundle.main.url(forResource: "Secrets", withExtension: "plist"),
              let dict = NSDictionary(contentsOf: url),
              let value = dict["ReplicateAPIToken"] as? String,
              !value.isEmpty
        else { return nil }
        return value
    }

    enum AIError: LocalizedError {
        case notConfigured
        case badResponse(String)
        case timedOut

        var errorDescription: String? {
            switch self {
            case .notConfigured: return "APIトークンが設定されていません"
            case .badResponse(let detail): return "AI処理に失敗しました（\(detail)）"
            case .timedOut: return "AI処理がタイムアウトしました"
            }
        }
    }

    /// Full pipeline for one texture.
    static func enhance(_ image: UIImage) async throws -> UIImage {
        let base = NailCleanup.dominantCenterColor(of: image)

        // 1. matting → RGBA cutout
        let cutoutURL = try await runPrediction(
            version: mattingVersion,
            input: [
                "image": try dataURI(for: image),
                "format": "png",
                "background_type": "rgba",
            ]
        )
        let cutout = try await downloadImage(from: cutoutURL)
        let composited = fitCutout(cutout, over: base, size: image.size)

        // 2. upscale ×2 → back to texture size (detail enhancement)
        let upscaledURL = try await runPrediction(
            version: upscaleVersion,
            input: [
                "image": try dataURI(for: composited),
                "scale": 2,
                "face_enhance": false,
            ]
        )
        let upscaled = try await downloadImage(from: upscaledURL)
        return resized(upscaled, to: image.size)
    }

    // MARK: - Replicate REST

    private static func runPrediction(version: String, input: [String: Any]) async throws -> URL {
        guard let token else { throw AIError.notConfigured }
        var request = URLRequest(url: URL(string: "https://api.replicate.com/v1/predictions")!)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("wait=60", forHTTPHeaderField: "Prefer")
        request.timeoutInterval = 90
        request.httpBody = try JSONSerialization.data(withJSONObject: [
            "version": version,
            "input": input,
        ])

        let (data, _) = try await URLSession.shared.data(for: request)
        var prediction = try parsePrediction(data)

        // Poll if the sync wait did not finish it.
        var attempts = 0
        while prediction.status == "starting" || prediction.status == "processing" {
            attempts += 1
            if attempts > 60 { throw AIError.timedOut }
            try await Task.sleep(for: .seconds(1.5))
            guard let pollURL = prediction.pollURL else { throw AIError.badResponse("no poll url") }
            var poll = URLRequest(url: pollURL)
            poll.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            let (pollData, _) = try await URLSession.shared.data(for: poll)
            prediction = try parsePrediction(pollData)
        }

        guard prediction.status == "succeeded", let output = prediction.outputURL else {
            throw AIError.badResponse(prediction.status)
        }
        return output
    }

    private struct Prediction {
        let status: String
        let outputURL: URL?
        let pollURL: URL?
    }

    private static func parsePrediction(_ data: Data) throws -> Prediction {
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw AIError.badResponse("invalid json")
        }
        if let detail = json["detail"] as? String, json["status"] == nil {
            throw AIError.badResponse(detail)
        }
        let status = json["status"] as? String ?? "unknown"
        var output: URL?
        if let single = json["output"] as? String {
            output = URL(string: single)
        } else if let list = json["output"] as? [String], let first = list.first {
            output = URL(string: first)
        }
        var poll: URL?
        if let urls = json["urls"] as? [String: Any], let get = urls["get"] as? String {
            poll = URL(string: get)
        }
        return Prediction(status: status, outputURL: output, pollURL: poll)
    }

    private static func downloadImage(from url: URL) async throws -> UIImage {
        let (data, _) = try await URLSession.shared.data(from: url)
        guard let image = UIImage(data: data) else {
            throw AIError.badResponse("output not an image")
        }
        return image
    }

    // MARK: - local compositing helpers

    private static func dataURI(for image: UIImage) throws -> String {
        // JPEG keeps the upload light; matting doesn't need our alpha.
        guard let data = image.jpegData(compressionQuality: 0.9) else {
            throw AIError.badResponse("encode failed")
        }
        return "data:image/jpeg;base64,\(data.base64EncodedString())"
    }

    /// Crops the matted cutout to the nail itself, then aspect-fills it into the
    /// plate frame so the design reaches every edge — no solid base-colour
    /// corners where the photo had skin/background around a smaller nail.
    private static func fitCutout(_ cutout: UIImage, over base: UIColor, size: CGSize) -> UIImage {
        let nail: UIImage
        if let cg = cutout.cgImage,
           let bounds = opaqueBounds(cutout),
           let cropped = cg.cropping(to: bounds) {
            nail = UIImage(cgImage: cropped)
        } else {
            nail = cutout
        }

        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { ctx in
            base.setFill()
            ctx.fill(CGRect(origin: .zero, size: size))
            // aspect-fill: cover the whole frame, centre-crop any overflow.
            let ns = nail.size
            guard ns.width > 0, ns.height > 0 else { return }
            let scale = max(size.width / ns.width, size.height / ns.height)
            let dw = ns.width * scale, dh = ns.height * scale
            nail.draw(in: CGRect(
                x: (size.width - dw) / 2,
                y: (size.height - dh) / 2,
                width: dw,
                height: dh
            ))
        }
    }

    /// Bounding box of the opaque region (alpha above a small threshold), in
    /// top-left pixel coordinates suitable for `CGImage.cropping(to:)`.
    private static func opaqueBounds(_ image: UIImage) -> CGRect? {
        guard let cg = image.cgImage else { return nil }
        let w = cg.width, h = cg.height
        guard w > 0, h > 0 else { return nil }
        var pixels = [UInt8](repeating: 0, count: w * h * 4)
        guard let ctx = CGContext(
            data: &pixels,
            width: w,
            height: h,
            bitsPerComponent: 8,
            bytesPerRow: w * 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return nil }
        ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))

        let threshold: UInt8 = 24
        var minX = w, minY = h, maxX = -1, maxY = -1
        for y in 0..<h {
            let row = y * w * 4
            for x in 0..<w where pixels[row + x * 4 + 3] > threshold {
                if x < minX { minX = x }
                if x > maxX { maxX = x }
                if y < minY { minY = y }
                if y > maxY { maxY = y }
            }
        }
        guard maxX >= minX, maxY >= minY else { return nil }
        // A hair of padding keeps the very edge of the nail from clipping.
        let pad = max(1, Int(Double(max(w, h)) * 0.01))
        let x0 = max(0, minX - pad), y0 = max(0, minY - pad)
        let x1 = min(w - 1, maxX + pad), y1 = min(h - 1, maxY + pad)
        return CGRect(x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1)
    }

    private static func resized(_ image: UIImage, to size: CGSize) -> UIImage {
        guard image.size != size else { return image }
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            image.draw(in: CGRect(origin: .zero, size: size))
        }
    }

    // MARK: - set-wide colour balance

    private static let ciContext = CIContext()

    /// After per-texture cloud enhancement, a nail photographed at an angle or
    /// in harsh light can come back washed-out next to its set-mates. Pulls
    /// outlier-low-saturation textures toward the set's typical (median)
    /// saturation instead of grading every texture independently, so a
    /// 5-piece set reads as one consistent manicure.
    static func colorBalanced(_ images: [UIImage]) -> [UIImage] {
        guard images.count > 1 else { return images }
        let saturations = images.map(saturation(of:))
        let target = median(saturations)
        guard target > 0.03 else { return images }

        return zip(images, saturations).map { image, sat in
            // Only touch textures that clearly stand out as flat/washed-out —
            // well-saturated nails must pass through unchanged.
            guard sat < target * 0.7 else { return image }
            let boost = min(2.0, max(1.1, target / max(sat, 0.03)))
            return colorAdjusted(image, saturation: boost, contrast: 1.05)
        }
    }

    static func saturation(of image: UIImage) -> CGFloat {
        var h: CGFloat = 0, s: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        NailCleanup.dominantCenterColor(of: image).getHue(&h, saturation: &s, brightness: &b, alpha: &a)
        return s
    }

    private static func median(_ values: [CGFloat]) -> CGFloat {
        let sorted = values.sorted()
        guard !sorted.isEmpty else { return 0 }
        let mid = sorted.count / 2
        return sorted.count % 2 == 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
    }

    private static func colorAdjusted(_ image: UIImage, saturation: Double, contrast: Double) -> UIImage {
        guard let cgImage = image.cgImage else { return image }
        let input = CIImage(cgImage: cgImage)
        let filter = CIFilter.colorControls()
        filter.inputImage = input
        filter.saturation = Float(saturation)
        filter.contrast = Float(contrast)
        guard let output = filter.outputImage,
              let rendered = ciContext.createCGImage(output, from: input.extent)
        else { return image }
        return UIImage(cgImage: rendered)
    }
}
