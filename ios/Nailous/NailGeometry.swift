import SceneKit

/// Nail plate shapes supported by the procedural mesh.
enum NailShape: String, CaseIterable, Identifiable {
    case squoval
    case round
    case oval
    case almond
    case coffin

    var id: String { rawValue }

    var label: String {
        switch self {
        case .squoval: return "スクエア"
        case .round: return "ラウンド"
        case .oval: return "オーバル"
        case .almond: return "アーモンド"
        case .coffin: return "コフィン"
        }
    }
}

/// Procedurally generated nail-plate mesh.
///
/// The plate is a displaced grid: near-parallel sides through the body,
/// circular-arc caps that round the cuticle end and the free edge (so the
/// silhouette reads as a nail, not a bottle or a leaf), a convex C-curve
/// cross-section, and a slight curl at the free edge.
enum NailGeometry {
    private static let cols = 48
    private static let rows = 96

    /// Plate proportions per shape: round is short & wide, almond/coffin run
    /// long — matching how the styles differ on real tips.
    static func plateSize(for shape: NailShape) -> (width: Float, height: Float) {
        switch shape {
        case .squoval: return (1.32, 2.25)
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
    /// Exposed so SwiftUI thumbnails can draw the same silhouette (`NailSilhouette`).
    static func widthFactor(t: Float, shape: NailShape) -> Float {
        // Shallow arc at the cuticle edge plus a slight base taper: real nail
        // plates are marginally narrower at the base than at mid-body.
        let baseCap: Float = 0.09
        let baseRound: Float = t < baseCap
            ? sqrt(max(0, 1 - pow((baseCap - t) / baseCap, 2)))
            : 1
        let baseTaper: Float = 1 - 0.07 * smoothstep(0.3, 0, t)

        switch shape {
        case .squoval:
            // Parallel sides, flat free edge with softly rounded corners
            // (photo ref: short square gel nails).
            let body = 1 - 0.04 * smoothstep(0.5, 1, t)
            let tipCap: Float = 0.07
            let tipRound: Float = t > 1 - tipCap
                ? 0.62 + 0.38 * sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .round:
            // Short and wide with a generously rounded free edge.
            let body = 1 - 0.05 * smoothstep(0.4, 1, t)
            let tipCap: Float = 0.3
            let tipRound: Float = t > 1 - tipCap
                ? sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .oval:
            // Near-straight sides, gently rounded free edge.
            let body = 1 - 0.1 * smoothstep(0.45, 1, t)
            let tipCap: Float = 0.22
            let tipRound: Float = t > 1 - tipCap
                ? sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .almond:
            // Continuous accelerating curve into a slim rounded point —
            // no straight "shoulder", the almond signature.
            let progress = smoothstep(0.18, 1, t)
            let body = 1 - 0.62 * pow(progress, 1.6)
            let tipCap: Float = 0.09
            let tipRound: Float = t > 1 - tipCap
                ? sqrt(max(0, 1 - pow((t - (1 - tipCap)) / tipCap, 2)))
                : 1
            return body * baseRound * baseTaper * tipRound
        case .coffin:
            // Ballerina: dead-straight diagonal sides down to a flat free
            // edge (~58% of base width) with just-softened corners.
            let linear = max(0, (t - 0.12) / 0.88)
            let body = 1 - 0.42 * linear
            let cornerCap: Float = 0.03
            let corner: Float = t > 1 - cornerCap
                ? 0.9 + 0.1 * sqrt(max(0, 1 - pow((t - (1 - cornerCap)) / cornerCap, 2)))
                : 1
            return body * baseRound * baseTaper * corner
        }
    }

    static func makeGeometry(shape: NailShape) -> SCNGeometry {
        let (plateWidth, plateHeight) = plateSize(for: shape)
        var vertices: [SCNVector3] = []
        var uvs: [CGPoint] = []
        vertices.reserveCapacity((cols + 1) * (rows + 1))
        uvs.reserveCapacity((cols + 1) * (rows + 1))

        for row in 0...rows {
            let t = Float(row) / Float(rows) // 0 cuticle → 1 tip
            let wf = widthFactor(t: t, shape: shape)
            for col in 0...cols {
                let u = Float(col) / Float(cols) * 2 - 1 // -1 … 1
                let x = u * (plateWidth / 2) * wf
                let y = (t - 0.5) * plateHeight
                // C-curve bulge, fading out where the silhouette pinches so the
                // rounded ends stay clean.
                let endFade = min(1, wf * 1.5)
                let bulge = 0.16 * (1 - u * u) * (0.85 + 0.15 * (1 - t)) * endFade
                let curl = 0.06 * smoothstep(0.5, 1, t)
                vertices.append(SCNVector3(x, y, bulge - curl))
                uvs.append(CGPoint(x: CGFloat((u + 1) / 2), y: CGFloat(1 - t)))
            }
        }

        var indices: [Int32] = []
        indices.reserveCapacity(cols * rows * 6)
        let stride = cols + 1
        for row in 0..<rows {
            for col in 0..<cols {
                let a = Int32(row * stride + col)
                let b = a + 1
                let c = a + Int32(stride)
                let d = c + 1
                indices.append(contentsOf: [a, c, b, b, c, d])
            }
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
