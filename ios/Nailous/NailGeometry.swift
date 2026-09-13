import SceneKit

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

/// Procedurally generated nail-plate mesh.
///
/// The plate is a displaced grid: near-parallel sides through the body,
/// circular-arc caps that round the cuticle end and the free edge (so the
/// silhouette reads as a nail, not a bottle or a leaf), a convex C-curve
/// cross-section, and a slight curl at the free edge. A mirrored underside and
/// a perimeter wall give the plate real thickness, like a physical tip.
enum NailGeometry {
    private static let cols = 48
    private static let rows = 96

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
        case .squoval: return (1.32, 2.25)
        case .square: return (1.32, 2.2)
        case .round: return (1.48, 1.8)
        case .oval: return (1.3, 2.4)
        case .almond: return (1.22, 2.6)
        case .coffin: return (1.22, 2.65)
        }
    }

    private static func smoothstep(_ a: Float, _ b: Float, _ x: Float) -> Float {
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

    static func makeGeometry(shape: NailShape, params: NailPlateParams = .default) -> SCNGeometry {
        let (baseWidth, baseHeight) = plateSize(for: shape)
        let plateWidth = baseWidth * (1 + 0.25 * params.width)
        let plateHeight = baseHeight * (1 + 0.25 * params.length)
        let curveHMul = 1 + 0.85 * params.curveH
        // Real tips are ~0.5–1mm on a ~10mm nail; default sits mid-range.
        let thickness = max(0.015, 0.055 + 0.05 * params.thickness)

        var vertices: [SCNVector3] = []
        var uvs: [CGPoint] = []
        let gridCount = (cols + 1) * (rows + 1)
        vertices.reserveCapacity(gridCount * 2)
        uvs.reserveCapacity(gridCount * 2)

        for row in 0...rows {
            let t = Float(row) / Float(rows) // 0 cuticle → 1 tip
            let wf = widthFactor(t: t, shape: shape, corner: params.corner)
            for col in 0...cols {
                let u = Float(col) / Float(cols) * 2 - 1 // -1 … 1
                let x = u * (plateWidth / 2) * wf
                let y = (t - 0.5) * plateHeight
                // C-curve bulge, fading out where the silhouette pinches so the
                // rounded ends stay clean.
                let endFade = min(1, wf * 1.5)
                let bulge = 0.16 * curveHMul * (1 - u * u) * (0.85 + 0.15 * (1 - t)) * endFade
                let curl = 0.06 * smoothstep(0.5, 1, t)
                // Lengthwise arch: bows the whole plate along its length.
                let arch = 0.14 * params.curveV * (1 - pow(2 * t - 1, 2))
                vertices.append(SCNVector3(x, y, bulge - curl + arch))
                uvs.append(CGPoint(x: CGFloat((u + 1) / 2), y: CGFloat(1 - t)))
            }
        }

        // Underside: the top grid pushed back by the thickness. Shares UVs so
        // the design wraps over the free edge like polish on a real tip.
        for i in 0..<gridCount {
            let v = vertices[i]
            vertices.append(SCNVector3(v.x, v.y, v.z - thickness))
            uvs.append(uvs[i])
        }

        var indices: [Int32] = []
        indices.reserveCapacity(cols * rows * 12 + (cols + rows) * 12)
        let stride = cols + 1
        let bottomOffset = Int32(gridCount)
        for row in 0..<rows {
            for col in 0..<cols {
                let a = Int32(row * stride + col)
                let b = a + 1
                let c = a + Int32(stride)
                let d = c + 1
                indices.append(contentsOf: [a, c, b, b, c, d])
                // reversed winding so the underside faces outward
                let a2 = a + bottomOffset, b2 = b + bottomOffset
                let c2 = c + bottomOffset, d2 = d + bottomOffset
                indices.append(contentsOf: [a2, b2, c2, b2, d2, c2])
            }
        }

        // Perimeter wall stitching top rim to bottom rim (the visible edge).
        func wall(_ a: Int32, _ b: Int32) {
            indices.append(contentsOf: [a, b, b + bottomOffset, a, b + bottomOffset, a + bottomOffset])
        }
        for col in 0..<cols {
            wall(Int32(col), Int32(col + 1)) // cuticle edge
            wall(Int32(rows * stride + col), Int32(rows * stride + col + 1)) // free edge
        }
        for row in 0..<rows {
            wall(Int32(row * stride), Int32((row + 1) * stride)) // left rim
            wall(Int32(row * stride + cols), Int32((row + 1) * stride + cols)) // right rim
        }

        let normals = computeNormals(vertices: vertices, indices: indices)

        let vertexSource = SCNGeometrySource(vertices: vertices)
        let normalSource = SCNGeometrySource(normals: normals)
        let uvSource = SCNGeometrySource(textureCoordinates: uvs)
        let element = SCNGeometryElement(indices: indices, primitiveType: .triangles)
        return SCNGeometry(sources: [vertexSource, normalSource, uvSource], elements: [element])
    }

    private static func computeNormals(vertices: [SCNVector3], indices: [Int32]) -> [SCNVector3] {
        var normals = [SIMD3<Float>](repeating: .zero, count: vertices.count)
        var i = 0
        while i < indices.count {
            let ia = Int(indices[i]), ib = Int(indices[i + 1]), ic = Int(indices[i + 2])
            let a = SIMD3<Float>(vertices[ia].x, vertices[ia].y, vertices[ia].z)
            let b = SIMD3<Float>(vertices[ib].x, vertices[ib].y, vertices[ib].z)
            let c = SIMD3<Float>(vertices[ic].x, vertices[ic].y, vertices[ic].z)
            let n = simd_cross(b - a, c - a)
            normals[ia] += n
            normals[ib] += n
            normals[ic] += n
            i += 3
        }
        return normals.map { n in
            let len = simd_length(n)
            let unit = len > 0 ? n / len : SIMD3<Float>(0, 0, 1)
            return SCNVector3(unit.x, unit.y, unit.z)
        }
    }
}
