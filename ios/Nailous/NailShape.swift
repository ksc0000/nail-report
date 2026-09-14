import CoreGraphics
import Foundation

/// Nail plate shapes supported by the procedural mesh.
/// The salon chart order: round → oval → point → square → square-off →
/// ballerina. Raw values are storage keys (older records keep working);
/// labels follow the chart the owner uses.
enum NailShape: String, CaseIterable, Identifiable {
    case round
    case oval
    case almond   // ポイント
    case square
    case squoval  // スクエアオフ
    case coffin   // バレリーナ

    var id: String { rawValue }

    var label: String {
        switch self {
        case .round: return "ラウンド"
        case .oval: return "オーバル"
        case .almond: return "ポイント"
        case .square: return "スクエア"
        case .squoval: return "スクエアオフ"
        case .coffin: return "バレリーナ"
        }
    }
}

/// User-tunable plate proportions, each normalized to -1…+1 with 0 = the
/// shape's stock look. Persisted per record so a saved jewel keeps its tuning.
struct NailPlateParams: Equatable {
    var length: Float = 0
    var width: Float = 0
    var curveH: Float = 0 // C-curve (side-to-side) strength
    var curveV: Float = 0 // lengthwise arch
    var thickness: Float = 0
    var corner: Float = 0 // free-edge corner: -1 sharp/square … +1 rounded

    static let `default` = NailPlateParams()

    /// Stable cache-key fragment for scene rebuild detection.
    var key: String {
        String(format: "%.2f/%.2f/%.2f/%.2f/%.2f/%.2f", length, width, curveH, curveV, thickness, corner)
    }
}

/// Pure shape math shared by the SceneKit mesh builder (`NailGeometry`'s
/// `makeGeometry`, in NailGeometry.swift, which needs SceneKit's
/// platform-specific vector types) and the Phase 2 shape estimator's macOS
/// host bench tool (`NailShapeEstimator`, `NailAngleMeasurer`, see #389) —
/// kept in its own SceneKit-free file so the latter can compile standalone
/// via `swiftc` on macOS (SceneKit's `SCNVector3` is CGFloat-based on macOS
/// but Float-based on iOS, which broke that build when this lived in the
/// same file/declaration as `NailGeometry.makeGeometry`). `NailGeometry`
/// itself is declared here for that reason; NailGeometry.swift only extends it.
enum NailGeometry {
    /// Plate proportions per shape: round is short & wide, almond/coffin run
    /// long — matching how the styles differ on real tips.
    /// Width ÷ height of the plate a shape is modelled on — the aspect the
    /// crop window, camera guide and thumbnails all draw with, so a captured
    /// design lands on the plate without being squeezed.
    static func plateAspect(for shape: NailShape) -> CGFloat {
        let size = plateSize(for: shape)
        return CGFloat(size.width / size.height)
    }

    static func plateSize(for shape: NailShape) -> (width: Float, height: Float) {
        switch shape {
        // Base widths trimmed ~11% (owner: default nails read too wide).
        case .squoval: return (1.18, 2.25)
        case .square: return (1.18, 2.2)
        case .round: return (1.32, 1.8)
        case .oval: return (1.16, 2.4)
        case .almond: return (1.09, 2.6)
        case .coffin: return (1.09, 2.65)
        }
    }

    static func smoothstep(_ a: Float, _ b: Float, _ x: Float) -> Float {
        let t = min(1, max(0, (x - a) / (b - a)))
        return t * t * (3 - 2 * t)
    }

    /// Silhouette half-width factor along the plate (t: 0 = cuticle, 1 = tip).
    /// `corner` (-1…+1) softens or sharpens the free-edge corners.
    /// Exposed so SwiftUI thumbnails can draw the same silhouette (`NailSilhouette`).
    static func widthFactor(t: Float, shape: NailShape, corner: Float = 0) -> Float {
        // Shallow arc at the cuticle edge plus a slight base taper: real nail
        // plates are marginally narrower at the base than at mid-body.
        let baseCap: Float = 0.09
        let baseRound: Float = t < baseCap
            ? sqrt(max(0, 1 - pow((baseCap - t) / baseCap, 2)))
            : 1
        let baseTaper: Float = 1 - 0.07 * smoothstep(0.3, 0, t)
        // Rounder corners = the rounding arc starts earlier (bigger cap).
        let cornerMul = 1 + 0.75 * corner

        switch shape {
        case .square:
            // Dead-parallel sides, flat free edge, corners only just softened.
            let tipCap = min(0.2, max(0.01, 0.03 * cornerMul))
            let floor = max(0.5, 0.86 - 0.2 * corner)
            let tipRound: Float = t > 1 - tipCap
                ? floor + (1 - floor) * sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return baseRound * baseTaper * tipRound
        case .squoval:
            // Square-off: narrows a touch toward the tip and the whole free
            // edge is softly rounded (owner's reference chart).
            let body = 1 - 0.09 * smoothstep(0.3, 1, t)
            let tipCap = min(0.4, max(0.03, 0.13 * cornerMul))
            let floor = max(0.2, 0.5 - 0.25 * corner) // sharper corner = higher floor (squarer)
            let tipRound: Float = t > 1 - tipCap
                ? floor + (1 - floor) * sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .round:
            // Short and wide with a generously rounded free edge.
            let body = 1 - 0.05 * smoothstep(0.4, 1, t)
            let tipCap = min(0.45, max(0.1, 0.3 * cornerMul))
            let tipRound: Float = t > 1 - tipCap
                ? sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .oval:
            // Near-straight sides, gently rounded free edge.
            let body = 1 - 0.1 * smoothstep(0.45, 1, t)
            let tipCap = min(0.4, max(0.08, 0.22 * cornerMul))
            let tipRound: Float = t > 1 - tipCap
                ? sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .almond:
            // Continuous accelerating curve into a slim rounded point —
            // no straight "shoulder", the almond signature.
            let progress = smoothstep(0.18, 1, t)
            let body = 1 - 0.62 * pow(progress, 1.6)
            let tipCap = min(0.3, max(0.04, 0.09 * cornerMul))
            let tipRound: Float = t > 1 - tipCap
                ? sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .coffin:
            // Ballerina: dead-straight diagonal sides down to a flat free
            // edge (~58% of base width) with just-softened corners.
            let linear = max(0, (t - 0.12) / 0.88)
            let body = 1 - 0.42 * linear
            let cornerCap = min(0.14, max(0.008, 0.03 * cornerMul))
            let cornerRound: Float = t > 1 - cornerCap
                ? 0.9 + 0.1 * sqrt(max(0, 1 - pow((t - (1 - cornerCap)) / cornerCap, 2)))
                : 1
            return body * baseRound * baseTaper * cornerRound
        }
    }
}
