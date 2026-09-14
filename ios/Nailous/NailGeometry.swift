import SceneKit

/// Procedurally generated nail-plate mesh.
///
/// The plate is a displaced grid: near-parallel sides through the body,
/// circular-arc caps that round the cuticle end and the free edge (so the
/// silhouette reads as a nail, not a bottle or a leaf), a convex C-curve
/// cross-section, and a slight curl at the free edge. A mirrored underside and
/// a perimeter wall give the plate real thickness, like a physical tip.
///
/// `NailShape`, `NailPlateParams`, the `NailGeometry` enum itself, and the
/// pure shape math (`plateAspect`, `plateSize`, `widthFactor`) live in
/// `NailShape.swift` instead of here — they need to compile without
/// SceneKit for the macOS host bench tool (#389).
extension NailGeometry {
    private static let cols = 48
    private static let rows = 96

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
