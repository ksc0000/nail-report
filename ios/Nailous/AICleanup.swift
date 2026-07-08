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
        let composited = composite(cutout, over: base, size: image.size)

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

    private static func composite(_ cutout: UIImage, over base: UIColor, size: CGSize) -> UIImage {
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { ctx in
            base.setFill()
            ctx.fill(CGRect(origin: .zero, size: size))
            cutout.draw(in: CGRect(origin: .zero, size: size))
        }
    }

    private static func resized(_ image: UIImage, to size: CGSize) -> UIImage {
        guard image.size != size else { return image }
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            image.draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
