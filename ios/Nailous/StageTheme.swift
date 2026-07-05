import SceneKit
import SwiftUI
import UIKit

/// A stage theme bundles three things: the SwiftUI backdrop (an AI-generated
/// image dropped into the bundle as `bg_<rawValue>.png`, with a gradient
/// fallback), the lighting-environment map the clear coat reflects, and an
/// optional particle system.
enum StageTheme: String, CaseIterable, Identifiable {
    case glass
    case night
    case deepsea
    case dresser

    var id: String { rawValue }

    var label: String {
        switch self {
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

    var gradientColors: [Color] {
        switch self {
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

    static func particles(for theme: StageTheme) -> SCNParticleSystem? {
        let system = SCNParticleSystem()
        system.particleImage = dotImage
        system.blendMode = .additive
        system.emitterShape = SCNBox(width: 6, height: 9, length: 1, chamferRadius: 0)
        system.birthLocation = .volume
        system.particleLifeSpan = 7
        system.particleLifeSpanVariation = 2

        switch theme {
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
            return nil
        }
        return system
    }
}
