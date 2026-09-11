import SceneKit
import SwiftUI
import UIKit

/// A stage theme bundles three things: the SwiftUI backdrop (an AI-generated
/// image dropped into the bundle as `bg_<rawValue>.png`, with a gradient
/// fallback), the lighting-environment map the clear coat reflects, and an
/// optional particle system.
enum StageTheme: String, CaseIterable, Identifiable {
    /// The quiet default: the nail alone on warm paper, no frame, no decor.
    /// The dark themes below are stage effects the user opts into.
    case paper
    case glass
    case night
    case deepsea
    case dresser

    var id: String { rawValue }

    /// Light stage: chrome, sheets and copy switch to the ink-on-paper palette.
    var isLight: Bool { self == .paper }

    var label: String {
        switch self {
        case .paper: return "ペーパー"
        case .glass: return "ガラス"
        case .night: return "星空"
        case .deepsea: return "深海"
        case .dresser: return "ドレッサー"
        }
    }

    /// AI-generated backdrop, if the user has added one to the bundle.
    var backdropImage: UIImage? {
        UIImage(named: "bg_\(rawValue)")
    }

    /// AI-generated gold-on-black ornament frame overlaid (screen-blended) on
    /// top of the stage; `fg_<theme>.png` in the bundle.
    var foregroundImage: UIImage? {
        UIImage(named: "fg_\(rawValue)")
    }

    var gradientColors: [Color] {
        switch self {
        case .paper:
            return [Palette.paper, Color(red: 0.958, green: 0.943, blue: 0.918)]
        case .glass:
            return [Color(red: 0.16, green: 0.09, blue: 0.15), Color(red: 0.04, green: 0.02, blue: 0.05)]
        case .night:
            return [Color(red: 0.08, green: 0.10, blue: 0.22), Color(red: 0.01, green: 0.02, blue: 0.07)]
        case .deepsea:
            return [Color(red: 0.03, green: 0.16, blue: 0.23), Color(red: 0.01, green: 0.04, blue: 0.09)]
        case .dresser:
            return [Color(red: 0.30, green: 0.23, blue: 0.20), Color(red: 0.10, green: 0.07, blue: 0.07)]
        }
    }

    /// Multiplier on the water-sway ambient amplitude. Dresser backdrops are
    /// full of straight furniture edges, so its sway is damped further than
    /// the others to keep those lines readable.
    var swayAmplitude: Float {
        switch self {
        case .dresser: return 0.55
        default: return 1.0
        }
    }
}

/// Ambient decoration drifting around the stage — a user preference, since
/// tastes differ. Drop `decor_<rawValue>.png` into the bundle to replace any
/// drawn particle with AI-generated art.
enum StageDecor: String, CaseIterable, Identifiable {
    case sparkle
    case snow
    case petal
    case bubble
    case off

    var id: String { rawValue }

    var label: String {
        switch self {
        case .sparkle: return "きらめき"
        case .snow: return "粉雪"
        case .petal: return "花びら"
        case .bubble: return "泡"
        case .off: return "オフ"
        }
    }
}

/// Generated environment maps and particles per theme. The environment map is
/// what the gel's clear coat reflects, so each theme changes how the gloss
/// itself feels — not just the backdrop.
enum StageEnvironment {
    private static var envCache: [StageTheme: UIImage] = [:]

    static func image(for theme: StageTheme) -> UIImage {
        if let cached = envCache[theme] { return cached }
        let image = makeEnvironment(for: theme)
        envCache[theme] = image
        return image
    }

    private static func makeEnvironment(for theme: StageTheme) -> UIImage {
        let size = CGSize(width: 256, height: 128)
        let (baseWhite, boxColors): (CGFloat, [UIColor]) = {
            switch theme {
            case .paper:
                // A bright, warm room: the clear coat reflects soft daylight
                // rather than a spotlight, so gloss reads as sheen, not glare.
                return (0.62, [
                    UIColor(red: 1, green: 0.98, blue: 0.94, alpha: 1),
                    UIColor(red: 0.98, green: 0.94, blue: 0.88, alpha: 1),
                    UIColor(red: 0.82, green: 0.76, blue: 0.68, alpha: 1),
                ])
            case .glass:
                return (0.05, [.white, UIColor(white: 0.85, alpha: 1), UIColor(white: 0.5, alpha: 1)])
            case .night:
                return (0.03, [
                    UIColor(red: 0.85, green: 0.9, blue: 1, alpha: 1),
                    UIColor(red: 0.6, green: 0.7, blue: 1, alpha: 1),
                    UIColor(red: 0.4, green: 0.45, blue: 0.8, alpha: 1),
                ])
            case .deepsea:
                return (0.04, [
                    UIColor(red: 0.6, green: 0.95, blue: 1, alpha: 1),
                    UIColor(red: 0.3, green: 0.7, blue: 0.85, alpha: 1),
                    UIColor(red: 0.15, green: 0.4, blue: 0.55, alpha: 1),
                ])
            case .dresser:
                return (0.08, [
                    UIColor(red: 1, green: 0.93, blue: 0.82, alpha: 1),
                    UIColor(red: 0.95, green: 0.8, blue: 0.65, alpha: 1),
                    UIColor(red: 0.6, green: 0.5, blue: 0.42, alpha: 1),
                ])
            }
        }()

        return UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            cg.setFillColor(UIColor(white: baseWhite, alpha: 1).cgColor)
            cg.fill(CGRect(origin: .zero, size: size))

            func softbox(_ rect: CGRect, color: UIColor, brightness: CGFloat) {
                let colors = [
                    color.withAlphaComponent(brightness).cgColor,
                    color.withAlphaComponent(0).cgColor,
                ] as CFArray
                guard let gradient = CGGradient(
                    colorsSpace: CGColorSpaceCreateDeviceRGB(),
                    colors: colors,
                    locations: [0, 1]
                ) else { return }
                cg.saveGState()
                cg.clip(to: rect)
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

            softbox(CGRect(x: 30, y: 8, width: 90, height: 34), color: boxColors[0], brightness: 1.0)
            softbox(CGRect(x: 150, y: 30, width: 70, height: 26), color: boxColors[1], brightness: 0.8)
            softbox(CGRect(x: 70, y: 84, width: 120, height: 22), color: boxColors[2], brightness: 0.45)
        }
    }

    // MARK: - Particles

    private static let dotImage: UIImage = {
        let size = CGSize(width: 32, height: 32)
        return UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            let colors = [
                UIColor.white.cgColor,
                UIColor.white.withAlphaComponent(0).cgColor,
            ] as CFArray
            guard let gradient = CGGradient(
                colorsSpace: CGColorSpaceCreateDeviceRGB(),
                colors: colors,
                locations: [0, 1]
            ) else { return }
            cg.drawRadialGradient(
                gradient,
                startCenter: CGPoint(x: 16, y: 16),
                startRadius: 0,
                endCenter: CGPoint(x: 16, y: 16),
                endRadius: 16,
                options: []
            )
        }
    }()

    /// Bundle art (`decor_<decor>.png`) wins over the drawn default, so the
    /// user can swap in AI-generated particles without code changes.
    private static func decorImage(_ decor: StageDecor, fallback: UIImage) -> UIImage {
        UIImage(named: "decor_\(decor.rawValue)") ?? fallback
    }

    static func particles(for theme: StageTheme, decor: StageDecor) -> SCNParticleSystem? {
        // Paper never carries decor; it is the point of that stage.
        if theme.isLight { return nil }
        switch decor {
        case .off:
            return nil
        case .sparkle:
            return sparkleSystem(for: theme)
        case .snow:
            let system = SCNParticleSystem()
            system.particleImage = decorImage(.snow, fallback: dotImage)
            system.blendMode = .additive
            system.emitterShape = SCNBox(width: 7, height: 1, length: 1, chamferRadius: 0)
            system.birthLocation = .volume
            system.birthRate = 12
            system.particleLifeSpan = 9
            system.particleSize = 0.06
            system.particleSizeVariation = 0.045
            system.emittingDirection = SCNVector3(0, -1, 0)
            system.spreadingAngle = 12
            system.particleVelocity = 0.5
            system.particleVelocityVariation = 0.3
            system.acceleration = SCNVector3(0.02, -0.05, 0)
            system.particleColor = UIColor(white: 1, alpha: 0.75)
            return system
        case .petal:
            let system = SCNParticleSystem()
            system.particleImage = decorImage(.petal, fallback: petalImage)
            system.blendMode = .alpha
            system.orientationMode = .free
            system.particleAngularVelocity = 60
            system.particleAngularVelocityVariation = 90
            system.emitterShape = SCNBox(width: 7, height: 1, length: 1, chamferRadius: 0)
            system.birthLocation = .volume
            system.birthRate = 5
            system.particleLifeSpan = 10
            system.particleSize = 0.16
            system.particleSizeVariation = 0.07
            system.emittingDirection = SCNVector3(0.25, -1, 0)
            system.spreadingAngle = 20
            system.particleVelocity = 0.4
            system.particleVelocityVariation = 0.25
            system.acceleration = SCNVector3(0.05, -0.03, 0)
            return system
        case .bubble:
            let system = SCNParticleSystem()
            system.particleImage = decorImage(.bubble, fallback: bubbleImage)
            system.blendMode = .additive
            system.emitterShape = SCNBox(width: 6, height: 1, length: 1, chamferRadius: 0)
            system.birthLocation = .volume
            system.birthRate = 6
            system.particleLifeSpan = 8
            system.particleSize = 0.12
            system.particleSizeVariation = 0.09
            system.emittingDirection = SCNVector3(0, 1, 0)
            system.spreadingAngle = 18
            system.particleVelocity = 0.45
            system.particleVelocityVariation = 0.3
            system.acceleration = SCNVector3(0.03, 0.1, 0)
            system.particleColor = UIColor(white: 1, alpha: 0.5)
            return system
        }
    }

    /// Where the decor's emitter node sits: falling decor spawns above the
    /// stage, rising decor below, ambient dust at the centre.
    static func emitterY(for decor: StageDecor) -> Float {
        switch decor {
        case .snow, .petal: return 4.5
        case .bubble: return -4.5
        case .sparkle, .off: return 0
        }
    }

    private static func sparkleSystem(for theme: StageTheme) -> SCNParticleSystem? {
        let system = SCNParticleSystem()
        system.particleImage = decorImage(.sparkle, fallback: dotImage)
        system.blendMode = .additive
        system.emitterShape = SCNBox(width: 6, height: 9, length: 1, chamferRadius: 0)
        system.birthLocation = .volume
        system.particleLifeSpan = 7
        system.particleLifeSpanVariation = 2

        switch theme {
        case .paper:
            return nil
        case .glass:
            system.birthRate = 2.5
            system.particleSize = 0.05
            system.particleSizeVariation = 0.03
            system.particleVelocity = 0.03
            system.particleVelocityVariation = 0.03
            system.spreadingAngle = 180
            system.particleColor = UIColor(white: 1, alpha: 0.5)
        case .night:
            system.birthRate = 5
            system.particleSize = 0.035
            system.particleSizeVariation = 0.025
            system.particleVelocity = 0.015
            system.particleVelocityVariation = 0.02
            system.spreadingAngle = 180
            system.particleColor = UIColor(red: 0.85, green: 0.9, blue: 1, alpha: 0.6)
        case .deepsea:
            system.birthRate = 5
            system.particleSize = 0.055
            system.particleSizeVariation = 0.04
            system.emittingDirection = SCNVector3(0, 1, 0)
            system.spreadingAngle = 25
            system.particleVelocity = 0.3
            system.particleVelocityVariation = 0.15
            system.acceleration = SCNVector3(0, 0.12, 0)
            system.particleColor = UIColor(red: 0.7, green: 0.95, blue: 1, alpha: 0.45)
        case .dresser:
            system.birthRate = 2
            system.particleSize = 0.045
            system.particleSizeVariation = 0.03
            system.particleVelocity = 0.02
            system.particleVelocityVariation = 0.02
            system.spreadingAngle = 180
            system.particleColor = UIColor(red: 1, green: 0.9, blue: 0.75, alpha: 0.45)
        }
        return system
    }

    /// Soft five-lobed petal, tinted blush — reads as a falling petal at
    /// particle scale without needing bundled art.
    private static let petalImage: UIImage = {
        let size = CGSize(width: 48, height: 48)
        return UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            let petal = UIBezierPath()
            petal.move(to: CGPoint(x: 24, y: 6))
            petal.addCurve(to: CGPoint(x: 38, y: 30), controlPoint1: CGPoint(x: 36, y: 8), controlPoint2: CGPoint(x: 42, y: 20))
            petal.addCurve(to: CGPoint(x: 24, y: 42), controlPoint1: CGPoint(x: 34, y: 40), controlPoint2: CGPoint(x: 28, y: 43))
            petal.addCurve(to: CGPoint(x: 10, y: 30), controlPoint1: CGPoint(x: 20, y: 43), controlPoint2: CGPoint(x: 14, y: 40))
            petal.addCurve(to: CGPoint(x: 24, y: 6), controlPoint1: CGPoint(x: 6, y: 20), controlPoint2: CGPoint(x: 12, y: 8))
            petal.close()
            cg.addPath(petal.cgPath)
            cg.clip()
            let colors = [
                UIColor(red: 1, green: 0.88, blue: 0.92, alpha: 0.95).cgColor,
                UIColor(red: 0.95, green: 0.7, blue: 0.8, alpha: 0.75).cgColor,
            ] as CFArray
            if let g = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: colors, locations: [0, 1]) {
                cg.drawLinearGradient(g, start: CGPoint(x: 24, y: 6), end: CGPoint(x: 24, y: 42), options: [])
            }
        }
    }()

    /// Thin ring with a specular dot — a soap bubble.
    private static let bubbleImage: UIImage = {
        let size = CGSize(width: 48, height: 48)
        return UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            cg.setStrokeColor(UIColor(white: 1, alpha: 0.85).cgColor)
            cg.setLineWidth(2)
            cg.strokeEllipse(in: CGRect(x: 4, y: 4, width: 40, height: 40))
            cg.setFillColor(UIColor(white: 1, alpha: 0.9).cgColor)
            cg.fillEllipse(in: CGRect(x: 13, y: 10, width: 7, height: 5))
        }
    }()
}
