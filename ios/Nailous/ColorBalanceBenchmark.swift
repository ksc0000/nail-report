import UIKit

/// Headless check for `AICleanup.colorBalanced` (issue #354): synthesizes a
/// 5-nail set where one texture is washed-out (low saturation, like a
/// white-blown edge nail after cloud enhancement) and the rest are normally
/// saturated, runs the local colour-balance pass, and writes before/after
/// saturation to Documents so `scripts/bench-color.sh` can assert the
/// washed-out sample recovered without the normal nails over-saturating.
/// Triggered by launching with `-benchColor 1`; does nothing otherwise.
enum ColorBalanceBenchmark {
    static var isRequested: Bool {
        ProcessInfo.processInfo.arguments.contains("-benchColor")
    }

    private struct SampleResult: Encodable {
        let name: String
        let saturationBefore: Double
        let saturationAfter: Double
    }

    private struct Summary: Encodable {
        let washedOutMedianBefore: Double
        let washedOutMedianAfter: Double
        let normalMaxSaturationDelta: Double
        let samples: [SampleResult]
    }

    static func run() {
        let normalHues: [CGFloat] = [0.98, 0.02, 0.94, 0.06]
        let normal = normalHues.map { swatch(hue: $0, saturation: 0.55, brightness: 0.82) }
        let washedOut = swatch(hue: 0.98, saturation: 0.08, brightness: 0.93)
        let set = normal + [washedOut]

        let before = set.map { AICleanup.saturation(of: $0) }
        let balanced = AICleanup.colorBalanced(set)
        let after = balanced.map { AICleanup.saturation(of: $0) }

        let names = (0..<normal.count).map { "normal_\($0)" } + ["washed_out"]
        let samples = zip(names, zip(before, after)).map {
            SampleResult(name: $0, saturationBefore: Double($1.0), saturationAfter: Double($1.1))
        }

        let normalDeltas = zip(before.dropLast(), after.dropLast()).map { abs($1 - $0) }
        let summary = Summary(
            washedOutMedianBefore: Double(before.last ?? 0),
            washedOutMedianAfter: Double(after.last ?? 0),
            normalMaxSaturationDelta: Double(normalDeltas.max() ?? 0),
            samples: samples
        )
        writeSummary(summary)
        writeImage(washedOut, name: "washed_out_before.png")
        writeImage(balanced.last ?? washedOut, name: "washed_out_after.png")
        writeImage(normal.first ?? washedOut, name: "normal_reference.png")
        print("COLOR_BENCH_DONE before=\(summary.washedOutMedianBefore) after=\(summary.washedOutMedianAfter)")
    }

    /// A flat-colour rounded-rect texture standing in for a baked nail crop.
    private static func swatch(hue: CGFloat, saturation: CGFloat, brightness: CGFloat) -> UIImage {
        let color = UIColor(hue: hue, saturation: saturation, brightness: brightness, alpha: 1)
        let size = CGSize(width: 256, height: 256)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { ctx in
            color.setFill()
            ctx.fill(CGRect(origin: .zero, size: size))
        }
    }

    private static func writeSummary(_ summary: Summary) {
        guard let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first,
              let data = try? JSONEncoder().encode(summary)
        else { return }
        let url = documents.appendingPathComponent("color-bench-results.json")
        try? data.write(to: url, options: .atomic)
    }

    private static func writeImage(_ image: UIImage, name: String) {
        guard let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first,
              let data = image.pngData()
        else { return }
        try? data.write(to: documents.appendingPathComponent(name), options: .atomic)
    }
}
