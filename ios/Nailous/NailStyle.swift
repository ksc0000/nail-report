import UIKit

/// Surface finish applied on top of the base texture — a real 3D material
/// treatment (not a photo edit), so the same design reads completely
/// differently as it spins in the light.
enum NailFinish: String, CaseIterable, Identifiable {
    case gloss
    case matte
    case glitter
    case chrome
    case aurora

    var id: String { rawValue }

    var label: String {
        switch self {
        case .gloss: return "ツヤ"
        case .matte: return "マット"
        case .glitter: return "ラメ"
        case .chrome: return "ミラー"
        case .aurora: return "オーロラ"
        }
    }
}

/// What gets painted on a nail: a texture (photo or generated art) + finish.
/// User records and built-in samples both reduce to this.
struct NailAppearance {
    let id: String
    let texture: UIImage
    let finish: NailFinish
}

/// A sample nail design. `texture` is generated at runtime for the prototype;
/// in the real app this slot is filled by the user's photo (Firebase Storage).
struct NailStyle: Identifiable {
    let id: String
    let label: String
    let swatch: UIColor
    let finish: NailFinish
    let texture: UIImage

    var appearance: NailAppearance {
        NailAppearance(id: id, texture: texture, finish: finish)
    }

    /// Sample set modeled on the user's reference photos:
    /// gray magnet gel, sheer nude glitter-french, deep-sea navy gradient.
    static let samples: [NailStyle] = [
        NailStyle(
            id: "sheer-rose",
            label: "シアーローズ",
            swatch: UIColor(red: 0.94, green: 0.72, blue: 0.78, alpha: 1),
            finish: .gloss,
            texture: NailTexturePainter.sheer(
                base: UIColor(red: 0.96, green: 0.78, blue: 0.83, alpha: 1),
                deep: UIColor(red: 0.85, green: 0.55, blue: 0.64, alpha: 1)
            )
        ),
        NailStyle(
            id: "magnet-gray",
            label: "グレージュマグネット",
            swatch: UIColor(red: 0.66, green: 0.65, blue: 0.68, alpha: 1),
            finish: .gloss,
            texture: NailTexturePainter.magnet(
                base: UIColor(red: 0.58, green: 0.57, blue: 0.61, alpha: 1),
                deep: UIColor(red: 0.40, green: 0.39, blue: 0.45, alpha: 1)
            )
        ),
        NailStyle(
            id: "french-glitter",
            label: "ラメフレンチ",
            swatch: UIColor(red: 0.93, green: 0.85, blue: 0.80, alpha: 1),
            finish: .gloss,
            texture: NailTexturePainter.frenchGlitter(
                base: UIColor(red: 0.93, green: 0.82, blue: 0.78, alpha: 1)
            )
        ),
        NailStyle(
            id: "deep-sea",
            label: "深海グラデ",
            swatch: UIColor(red: 0.10, green: 0.19, blue: 0.33, alpha: 1),
            finish: .gloss,
            texture: NailTexturePainter.deepSea(
                navy: UIColor(red: 0.09, green: 0.17, blue: 0.31, alpha: 1),
                abyss: UIColor(red: 0.05, green: 0.10, blue: 0.20, alpha: 1)
            )
        ),
    ]
}

/// Draws prototype textures. Image top = free edge (tip); UVs map v=0 to the tip.
enum NailTexturePainter {
    private static let size = CGSize(width: 512, height: 768)

    static func sheer(base: UIColor, deep: UIColor) -> UIImage {
        UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            drawVerticalGradient(cg, from: base, to: deep)
            // jelly-like lighter core
            drawSoftEllipse(
                cg,
                rect: CGRect(x: size.width * 0.16, y: size.height * 0.18,
                             width: size.width * 0.68, height: size.height * 0.6),
                color: UIColor.white.withAlphaComponent(0.16)
            )
        }
    }

    /// Magnet (cat-eye) gel: gray base with a soft diagonal light streak and
    /// very fine shimmer (photo ref 1).
    static func magnet(base: UIColor, deep: UIColor) -> UIImage {
        UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            drawVerticalGradient(cg, from: base, to: deep)

            // diagonal streak band
            cg.saveGState()
            cg.translateBy(x: size.width / 2, y: size.height / 2)
            cg.rotate(by: -0.12)
            cg.translateBy(x: -size.width / 2, y: -size.height / 2)
            let bandColors = [
                UIColor.white.withAlphaComponent(0).cgColor,
                UIColor.white.withAlphaComponent(0.38).cgColor,
                UIColor.white.withAlphaComponent(0).cgColor,
            ] as CFArray
            if let band = CGGradient(
                colorsSpace: CGColorSpaceCreateDeviceRGB(),
                colors: bandColors,
                locations: [0, 0.5, 1]
            ) {
                cg.drawLinearGradient(
                    band,
                    start: CGPoint(x: size.width * 0.18, y: 0),
                    end: CGPoint(x: size.width * 0.62, y: 0),
                    options: []
                )
            }
            cg.restoreGState()

            // fine magnetic shimmer
            var rng = SystemRandomNumberGenerator()
            for _ in 0..<420 {
                let x = CGFloat.random(in: 0..<size.width, using: &rng)
                let y = CGFloat.random(in: 0..<size.height, using: &rng)
                let r = CGFloat.random(in: 0.6...1.5, using: &rng)
                let a = CGFloat.random(in: 0.1...0.4, using: &rng)
                cg.setFillColor(UIColor.white.withAlphaComponent(a).cgColor)
                cg.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
        }
    }

    /// Sheer nude base with a dense silver-glitter french tip (photo ref 2).
    static func frenchGlitter(base: UIColor) -> UIImage {
        UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            drawVerticalGradient(cg, from: base, to: base.darkened(by: 0.08))
            drawSoftEllipse(
                cg,
                rect: CGRect(x: size.width * 0.18, y: size.height * 0.22,
                             width: size.width * 0.64, height: size.height * 0.56),
                color: UIColor.white.withAlphaComponent(0.2)
            )

            // Smile-line tip zone (top of image = free edge)
            let tipPath = UIBezierPath()
            tipPath.move(to: CGPoint(x: 0, y: 0))
            tipPath.addLine(to: CGPoint(x: size.width, y: 0))
            tipPath.addLine(to: CGPoint(x: size.width, y: size.height * 0.2))
            tipPath.addQuadCurve(
                to: CGPoint(x: 0, y: size.height * 0.2),
                controlPoint: CGPoint(x: size.width / 2, y: size.height * 0.33)
            )
            tipPath.close()

            cg.saveGState()
            cg.addPath(tipPath.cgPath)
            cg.clip()
            cg.setFillColor(UIColor(red: 0.94, green: 0.88, blue: 0.80, alpha: 0.45).cgColor)
            cg.fill(CGRect(origin: .zero, size: size))

            // dense silver glitter inside the tip
            var rng = SystemRandomNumberGenerator()
            let glitterColors: [UIColor] = [
                .white,
                UIColor(red: 0.95, green: 0.93, blue: 0.88, alpha: 1),
                UIColor(red: 0.88, green: 0.87, blue: 0.92, alpha: 1),
                UIColor(red: 0.99, green: 0.94, blue: 0.78, alpha: 1),
            ]
            for _ in 0..<650 {
                let x = CGFloat.random(in: 0..<size.width, using: &rng)
                let y = CGFloat.random(in: 0..<(size.height * 0.34), using: &rng)
                let r = CGFloat.random(in: 0.8...2.8, using: &rng)
                let a = CGFloat.random(in: 0.45...1.0, using: &rng)
                let color = glitterColors.randomElement(using: &rng) ?? .white
                cg.setFillColor(color.withAlphaComponent(a).cgColor)
                cg.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
            cg.restoreGState()
        }
    }

    /// Deep navy jelly with a sheer wash rising from the base and scattered
    /// holo flakes (photo ref 3).
    static func deepSea(navy: UIColor, abyss: UIColor) -> UIImage {
        UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            drawVerticalGradient(cg, from: navy, to: abyss)

            // sheer white wash rising from the base (bottom of image)
            let washColors = [
                UIColor.white.withAlphaComponent(0).cgColor,
                UIColor.white.withAlphaComponent(0.42).cgColor,
            ] as CFArray
            if let wash = CGGradient(
                colorsSpace: CGColorSpaceCreateDeviceRGB(),
                colors: washColors,
                locations: [0.45, 1]
            ) {
                cg.drawLinearGradient(
                    wash,
                    start: CGPoint(x: 0, y: size.height * 0.3),
                    end: CGPoint(x: 0, y: size.height),
                    options: []
                )
            }

            // holo flakes: larger sparse + fine dust
            var rng = SystemRandomNumberGenerator()
            let holo: [UIColor] = [
                .white,
                UIColor(red: 0.81, green: 0.91, blue: 1.0, alpha: 1),
                UIColor(red: 1.0, green: 0.91, blue: 0.69, alpha: 1),
                UIColor(red: 0.66, green: 1.0, blue: 0.95, alpha: 1),
            ]
            for _ in 0..<70 {
                let x = CGFloat.random(in: 0..<size.width, using: &rng)
                let y = CGFloat.random(in: (size.height * 0.05)..<(size.height * 0.85), using: &rng)
                let r = CGFloat.random(in: 1.8...4.6, using: &rng)
                let a = CGFloat.random(in: 0.45...0.95, using: &rng)
                let color = holo.randomElement(using: &rng) ?? .white
                cg.setFillColor(color.withAlphaComponent(a).cgColor)
                cg.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
            for _ in 0..<240 {
                let x = CGFloat.random(in: 0..<size.width, using: &rng)
                let y = CGFloat.random(in: 0..<size.height, using: &rng)
                let r = CGFloat.random(in: 0.6...1.4, using: &rng)
                let a = CGFloat.random(in: 0.15...0.5, using: &rng)
                cg.setFillColor(UIColor.white.withAlphaComponent(a).cgColor)
                cg.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
        }
    }

    private static func drawVerticalGradient(_ cg: CGContext, from top: UIColor, to bottom: UIColor) {
        let colors = [top.cgColor, bottom.cgColor] as CFArray
        guard let gradient = CGGradient(
            colorsSpace: CGColorSpaceCreateDeviceRGB(),
            colors: colors,
            locations: [0, 1]
        ) else { return }
        cg.drawLinearGradient(
            gradient,
            start: .zero,
            end: CGPoint(x: 0, y: size.height),
            options: []
        )
    }

    private static func drawSoftEllipse(_ cg: CGContext, rect: CGRect, color: UIColor) {
        let colors = [color.cgColor, color.withAlphaComponent(0).cgColor] as CFArray
        guard let gradient = CGGradient(
            colorsSpace: CGColorSpaceCreateDeviceRGB(),
            colors: colors,
            locations: [0, 1]
        ) else { return }
        cg.saveGState()
        cg.addEllipse(in: rect)
        cg.clip()
        cg.drawRadialGradient(
            gradient,
            startCenter: CGPoint(x: rect.midX, y: rect.midY),
            startRadius: 0,
            endCenter: CGPoint(x: rect.midX, y: rect.midY),
            endRadius: max(rect.width, rect.height) / 2,
            options: []
        )
        cg.restoreGState()
    }
}

private extension UIColor {
    func darkened(by amount: CGFloat) -> UIColor {
        var h: CGFloat = 0, s: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        getHue(&h, saturation: &s, brightness: &b, alpha: &a)
        return UIColor(hue: h, saturation: s, brightness: max(0, b - amount), alpha: a)
    }
}
