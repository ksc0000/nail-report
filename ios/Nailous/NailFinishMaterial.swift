import SceneKit
import UIKit

/// Builds the PBR material for each finish and the sparkle maps that make a
/// design actually catch the light. This is Nailous's "映え" engine: instead of
/// editing the photo's brightness, we drive real 3D surface physics —
/// per-fleck metalness so glitter throws highlights as the nail turns, a
/// mirror chrome, and an iridescent aurora sheen tinted by the nail's own colour.
enum NailFinishMaterial {
    /// Cache sparkle maps by tint bucket so rebuilds don't redraw them.
    private static var sparkleCache: [String: (mask: UIImage, glow: UIImage)] = [:]

    static func material(for appearance: NailAppearance) -> SCNMaterial {
        let material = SCNMaterial()
        material.lightingModel = .physicallyBased
        material.diffuse.contents = appearance.texture
        material.diffuse.maxAnisotropy = 8
        material.diffuse.mipFilter = .linear
        material.isDoubleSided = true

        let tint = appearance.texture.dominantNailColor()

        switch appearance.finish {
        case .gloss:
            material.metalness.contents = 0.0
            material.roughness.contents = 0.34
            material.clearCoat.contents = 1.0
            material.clearCoatRoughness.contents = 0.08

        case .matte:
            material.metalness.contents = 0.0
            material.roughness.contents = 0.82
            material.clearCoat.contents = 0.1
            material.clearCoatRoughness.contents = 0.6

        case .glitter:
            // Each fleck is a tiny metallic mirror: the metalness map makes
            // hundreds of specks reflect the environment, so the surface
            // twinkles as it rotates. Clear coat keeps the wet-gel top.
            let (mask, glow) = sparkles(tint: tint)
            material.metalness.contents = mask
            material.roughness.contents = 0.3
            material.clearCoat.contents = 1.0
            material.clearCoatRoughness.contents = 0.08
            material.emission.contents = glow
            material.emission.intensity = 0.35
            addShimmer(to: material, from: 0.22, to: 0.5)

        case .chrome:
            // Mirror finish: high metalness + very low roughness reflects the
            // whole studio environment, tinted toward the design's colour.
            material.metalness.contents = 0.95
            material.roughness.contents = 0.08
            material.clearCoat.contents = 0.3
            material.clearCoatRoughness.contents = 0.05
            material.emission.contents = tint.withAlphaComponent(0.12)

        case .aurora:
            // Iridescent sheen: a soft multi-hue emission over a glossy coat
            // reads as an oil-slick / unicorn shift as the light sweeps.
            material.metalness.contents = 0.35
            material.roughness.contents = 0.14
            material.clearCoat.contents = 1.0
            material.clearCoatRoughness.contents = 0.06
            material.emission.contents = auroraSheen(tint: tint)
            material.emission.intensity = 0.4
            addShimmer(to: material, from: 0.28, to: 0.55)
        }
        return material
    }

    /// Gentle pulsing on the emission so glitter/aurora feel alive even at rest.
    private static func addShimmer(to material: SCNMaterial, from: CGFloat, to: CGFloat) {
        let pulse = CABasicAnimation(keyPath: "emission.intensity")
        pulse.fromValue = from
        pulse.toValue = to
        pulse.duration = 1.7
        pulse.autoreverses = true
        pulse.repeatCount = .infinity
        pulse.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        material.addAnimation(pulse, forKey: "shimmer")
    }

    // MARK: - Generated maps

    private static func sparkles(tint: UIColor) -> (mask: UIImage, glow: UIImage) {
        let key = tint.bucketKey
        if let cached = sparkleCache[key] { return cached }
        let size = CGSize(width: 512, height: 768)
        var rng = SeededGenerator(seed: 0xC0FFEE)

        // Metalness mask: white flecks (metal = 1) on black (metal = 0).
        let mask = UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            cg.setFillColor(UIColor.black.cgColor)
            cg.fill(CGRect(origin: .zero, size: size))
            for _ in 0..<900 {
                let x = CGFloat.random(in: 0..<size.width, using: &rng)
                let y = CGFloat.random(in: 0..<size.height, using: &rng)
                let r = CGFloat.random(in: 0.8...2.6, using: &rng)
                let w = CGFloat.random(in: 0.55...1.0, using: &rng)
                cg.setFillColor(UIColor(white: w, alpha: 1).cgColor)
                cg.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
        }

        // Emission glow: the same flecks in warm-white + the design's colour,
        // so the sparkle carries a hint of the actual nail hue.
        var rng2 = SeededGenerator(seed: 0xBADA55)
        let glow = UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            cg.setFillColor(UIColor.black.cgColor)
            cg.fill(CGRect(origin: .zero, size: size))
            let palette = [UIColor.white, UIColor(white: 0.98, alpha: 1), tint.brightened()]
            for _ in 0..<520 {
                let x = CGFloat.random(in: 0..<size.width, using: &rng2)
                let y = CGFloat.random(in: 0..<size.height, using: &rng2)
                let r = CGFloat.random(in: 0.9...2.4, using: &rng2)
                let a = CGFloat.random(in: 0.5...1.0, using: &rng2)
                let c = palette.randomElement(using: &rng2) ?? .white
                cg.setFillColor(c.withAlphaComponent(a).cgColor)
                cg.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
        }
        let pair = (mask, glow)
        sparkleCache[key] = pair
        return pair
    }

    private static func auroraSheen(tint: UIColor) -> UIImage {
        let size = CGSize(width: 512, height: 768)
        return UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            cg.setFillColor(UIColor.black.cgColor)
            cg.fill(CGRect(origin: .zero, size: size))
            // diagonal rainbow bands, low intensity — the clear coat turns
            // these into a shifting oil-slick highlight.
            let hues: [UIColor] = [
                UIColor(hue: 0.55, saturation: 0.7, brightness: 1, alpha: 1),
                UIColor(hue: 0.78, saturation: 0.6, brightness: 1, alpha: 1),
                UIColor(hue: 0.95, saturation: 0.55, brightness: 1, alpha: 1),
                UIColor(hue: 0.42, saturation: 0.6, brightness: 1, alpha: 1),
            ]
            cg.translateBy(x: size.width / 2, y: size.height / 2)
            cg.rotate(by: -0.5)
            cg.translateBy(x: -size.width / 2, y: -size.height / 2)
            let bandH = size.height / CGFloat(hues.count)
            for (i, color) in hues.enumerated() {
                let colors = [
                    color.withAlphaComponent(0).cgColor,
                    color.withAlphaComponent(0.5).cgColor,
                    color.withAlphaComponent(0).cgColor,
                ] as CFArray
                if let g = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: colors, locations: [0, 0.5, 1]) {
                    cg.drawLinearGradient(
                        g,
                        start: CGPoint(x: 0, y: CGFloat(i) * bandH - bandH),
                        end: CGPoint(x: 0, y: CGFloat(i) * bandH + bandH),
                        options: []
                    )
                }
            }
        }
    }
}

/// Deterministic RNG so sparkle maps are stable across rebuilds (no flicker).
private struct SeededGenerator: RandomNumberGenerator {
    private var state: UInt64
    init(seed: UInt64) { state = seed &+ 0x9E3779B97F4A7C15 }
    mutating func next() -> UInt64 {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        var z = state
        z = (z ^ (z >> 30)) &* 0xBF58476D1CE4E5B9
        z = (z ^ (z >> 27)) &* 0x94D049BB133111EB
        return z ^ (z >> 31)
    }
}

extension UIImage {
    /// Average colour of the central region — the design's own dominant tone.
    func dominantNailColor() -> UIColor {
        guard let cg = cgImage else { return .systemPink }
        let ci = CIImage(cgImage: cg)
        let e = ci.extent
        let center = CGRect(x: e.midX - e.width * 0.2, y: e.midY - e.height * 0.2,
                            width: e.width * 0.4, height: e.height * 0.4)
        let f = CIFilter(name: "CIAreaAverage", parameters: [
            kCIInputImageKey: ci,
            kCIInputExtentKey: CIVector(cgRect: center),
        ])
        guard let out = f?.outputImage else { return .systemPink }
        var px = [UInt8](repeating: 0, count: 4)
        CIContext().render(out, toBitmap: &px, rowBytes: 4,
                           bounds: CGRect(x: 0, y: 0, width: 1, height: 1),
                           format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
        return UIColor(red: CGFloat(px[0]) / 255, green: CGFloat(px[1]) / 255,
                       blue: CGFloat(px[2]) / 255, alpha: 1)
    }
}

private extension UIColor {
    func brightened() -> UIColor {
        var h: CGFloat = 0, s: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        getHue(&h, saturation: &s, brightness: &b, alpha: &a)
        return UIColor(hue: h, saturation: s * 0.7, brightness: min(1, b + 0.3), alpha: 1)
    }

    /// Coarse colour bucket for caching sparkle maps.
    var bucketKey: String {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        getRed(&r, green: &g, blue: &b, alpha: &a)
        return "\(Int(r * 6))-\(Int(g * 6))-\(Int(b * 6))"
    }
}
