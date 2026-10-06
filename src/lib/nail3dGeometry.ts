// Canonical Nail Data -> renderable vertex data.
//
// This module deliberately has NO three.js dependency. It turns a
// NailGeometry + NailSocket pair into plain arrays that any renderer can
// consume; the R3F layer only has to hand them to <bufferGeometry>.
//
// Keeping it here (src/lib, not src/features/nail3d) means the shape of a
// nail — the part that actually encodes the product — is testable from the
// node test runner without WebGL, and survives a renderer swap.
//
// See docs/product/NAIL3D_MODULE_STRUCTURE.md.

import { FINGERS } from './nail3dContract.ts'
import type { Finger, HandProfile, NailEntry, NailGeometry, NailShape, NailSocket } from './nail3dContract.ts'

/**
 * Nail-local space, right-handed:
 *   +x across the nail (width), 0 at the centre line
 *   +y along the finger, 0 at the cuticle, `length` at the tip
 *   +z out of the nail surface
 */
export interface NailMesh {
  /** xyz triples in nail-local space. */
  positions: number[]
  normals: number[]
  /** uv pairs in [0,1]; the renderer applies NailTexture.uvTransform on top. */
  uvs: number[]
  indices: number[]
}

export interface BuildNailMeshOptions {
  /** Across the width. */
  segmentsU?: number
  /** Along the finger. */
  segmentsV?: number
}

export const DEFAULT_SEGMENTS_U = 12
export const DEFAULT_SEGMENTS_V = 16

/** Longitudinal curl toward the tip, as a fraction of nail length. */
const CURVE_V_SCALE = 0.35
/** Cross-section arch, as a fraction of the local half width. */
const CURVE_H_SCALE = 0.8
/**
 * Minimum width fraction at the tip. Shapes that taper to a point would
 * otherwise produce zero-area triangles and undefined normals, so the tip is
 * a very thin flat edge instead of a true singularity.
 */
const MIN_WIDTH_FRACTION = 0.02

// ---------------------------------------------------------------------------
// Socket placement
// ---------------------------------------------------------------------------

const length3 = (v: readonly number[]): number => Math.hypot(v[0], v[1], v[2])

const normalize3 = (v: readonly number[]): [number, number, number] => {
  const len = length3(v)
  if (len === 0) return [0, 0, 0]
  return [v[0] / len, v[1] / len, v[2] / len]
}

const cross3 = (a: readonly number[], b: readonly number[]): [number, number, number] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]

const dot3 = (a: readonly number[], b: readonly number[]): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/**
 * Column-major 4x4 matrix mapping nail-local space to hand space.
 *
 * The scan's `tangent` and `normal` are not guaranteed to be orthogonal, so
 * the basis is re-orthogonalized (Gram-Schmidt) with `tangent` held fixed:
 * the finger axis is the more reliable of the two.
 *
 * Returns null when the socket's axes are degenerate (zero-length or
 * parallel), which the caller should treat like a missing socket rather than
 * rendering a nail in an arbitrary pose.
 */
export const socketMatrix = (socket: NailSocket): number[] | null => {
  const y = normalize3(socket.tangent)
  if (length3(y) === 0) return null

  const rawNormal = socket.normal
  const projected: [number, number, number] = [
    rawNormal[0] - dot3(rawNormal, y) * y[0],
    rawNormal[1] - dot3(rawNormal, y) * y[1],
    rawNormal[2] - dot3(rawNormal, y) * y[2],
  ]
  if (length3(projected) < 1e-9) return null // normal parallel to tangent
  const z = normalize3(projected)
  const x = cross3(y, z)
  if (length3(x) < 1e-9) return null

  const [ox, oy, oz] = socket.origin
  return [
    x[0], x[1], x[2], 0,
    y[0], y[1], y[2], 0,
    z[0], z[1], z[2], 0,
    ox, oy, oz, 1,
  ]
}

// ---------------------------------------------------------------------------
// Shape profiles
// ---------------------------------------------------------------------------

/**
 * Half-width as a fraction of the nail bed, at `v` along the finger
 * (0 = cuticle, 1 = tip).
 */
const widthProfile = (shape: NailShape, v: number): number => {
  switch (shape) {
    case 'square':
      return 1 - 0.08 * v ** 4
    case 'round':
      return Math.sqrt(Math.max(0, 1 - v ** 6))
    case 'almond':
      return Math.sqrt(Math.max(0, 1 - v ** 2))
    case 'coffin':
      return 1 - 0.55 * v
    case 'stiletto':
      return (1 - v) ** 0.85
  }
}

// ---------------------------------------------------------------------------
// Mesh construction
// ---------------------------------------------------------------------------

const accumulateNormals = (positions: number[], indices: number[]): number[] => {
  const normals = new Array<number>(positions.length).fill(0)

  for (let i = 0; i < indices.length; i += 3) {
    const [ia, ib, ic] = [indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3]
    const ab = [positions[ib] - positions[ia], positions[ib + 1] - positions[ia + 1], positions[ib + 2] - positions[ia + 2]]
    const ac = [positions[ic] - positions[ia], positions[ic + 1] - positions[ia + 1], positions[ic + 2] - positions[ia + 2]]
    const n = cross3(ab, ac)
    for (const base of [ia, ib, ic]) {
      normals[base] += n[0]
      normals[base + 1] += n[1]
      normals[base + 2] += n[2]
    }
  }

  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2])
    if (len === 0) {
      // Isolated or degenerate vertex: fall back to the surface normal rather
      // than leaving NaN in the buffer.
      normals[i] = 0
      normals[i + 1] = 0
      normals[i + 2] = 1
      continue
    }
    normals[i] /= len
    normals[i + 1] /= len
    normals[i + 2] /= len
  }
  return normals
}

/**
 * Builds a closed shell (top surface, bottom surface offset by `thickness`,
 * and the rim between them) for one nail, in nail-local space.
 *
 * Returns null for a geometry/socket pair that cannot produce a surface
 * (non-positive length, bed width or thickness), so the caller drops that
 * nail instead of rendering a degenerate mesh.
 */
export const buildNailMesh = (
  geometry: NailGeometry,
  socket: NailSocket,
  options: BuildNailMeshOptions = {},
): NailMesh | null => {
  const nu = Math.max(2, Math.floor(options.segmentsU ?? DEFAULT_SEGMENTS_U))
  const nv = Math.max(2, Math.floor(options.segmentsV ?? DEFAULT_SEGMENTS_V))

  const halfWidth = socket.bedWidth / 2
  const { length, thickness } = geometry
  if (!(halfWidth > 0) || !(length > 0) || !(thickness > 0)) return null

  const topPositions: number[] = []
  const uvs: number[] = []

  for (let iv = 0; iv <= nv; iv += 1) {
    const v = iv / nv
    const widthAt = Math.max(MIN_WIDTH_FRACTION, widthProfile(geometry.shape, v))
    const localHalf = halfWidth * widthAt
    // Nails curl down toward the tip.
    const zAlong = -geometry.curveV * length * v * v * CURVE_V_SCALE

    for (let iu = 0; iu <= nu; iu += 1) {
      const u = iu / nu
      const xn = u * 2 - 1
      // Cross-section arch: the edges sit lower than the centre line, scaled
      // by the local width so the tip is less arched than the cuticle.
      const zAcross = -geometry.curveH * localHalf * xn * xn * CURVE_H_SCALE

      topPositions.push(xn * localHalf, v * length, zAlong + zAcross)
      uvs.push(u, v)
    }
  }

  const rowStride = nu + 1
  const vertexCount = topPositions.length / 3
  const idx = (iu: number, iv: number): number => iv * rowStride + iu

  // Bottom surface mirrors the top, offset along -z.
  const positions = topPositions.slice()
  for (let i = 0; i < vertexCount; i += 1) {
    positions.push(topPositions[i * 3], topPositions[i * 3 + 1], topPositions[i * 3 + 2] - thickness)
    uvs.push(uvs[i * 2], uvs[i * 2 + 1])
  }

  const indices: number[] = []
  for (let iv = 0; iv < nv; iv += 1) {
    for (let iu = 0; iu < nu; iu += 1) {
      const a = idx(iu, iv)
      const b = idx(iu + 1, iv)
      const c = idx(iu + 1, iv + 1)
      const d = idx(iu, iv + 1)
      indices.push(a, b, c, a, c, d) // top, CCW seen from +z
      const [a2, b2, c2, d2] = [a + vertexCount, b + vertexCount, c + vertexCount, d + vertexCount]
      indices.push(a2, c2, b2, a2, d2, c2) // bottom, reversed winding
    }
  }

  // Rim: walk the grid boundary once and stitch top to bottom.
  const boundary: number[] = []
  for (let iu = 0; iu <= nu; iu += 1) boundary.push(idx(iu, 0))
  for (let iv = 1; iv <= nv; iv += 1) boundary.push(idx(nu, iv))
  for (let iu = nu - 1; iu >= 0; iu -= 1) boundary.push(idx(iu, nv))
  for (let iv = nv - 1; iv >= 1; iv -= 1) boundary.push(idx(0, iv))

  for (let i = 0; i < boundary.length; i += 1) {
    const a = boundary[i]
    const b = boundary[(i + 1) % boundary.length]
    indices.push(a, b, b + vertexCount, a, b + vertexCount, a + vertexCount)
  }

  return { positions, normals: accumulateNormals(positions, indices), uvs, indices }
}

// ---------------------------------------------------------------------------
// Contract -> placed meshes
// ---------------------------------------------------------------------------

export interface PlacedNail {
  finger: Finger
  mesh: NailMesh
  /** Column-major 4x4, nail-local -> hand space. */
  matrix: number[]
  textureRef: string
  heightMapRef?: string
}

const fingerOrder = (finger: Finger): number => FINGERS.indexOf(finger)

/**
 * Turns the nails of an L2 plan into placed, renderable meshes.
 *
 * Nails whose socket is missing or degenerate are skipped rather than
 * rendered in the wrong place — a nail floating off the finger is worse than
 * a nail that is simply absent.
 */
export const buildPlacedNails = (
  nails: readonly NailEntry[],
  handProfile: HandProfile,
  options?: BuildNailMeshOptions,
): PlacedNail[] => {
  const socketByFinger = new Map<Finger, NailSocket>(
    handProfile.nailSockets.map(socket => [socket.finger, socket]),
  )

  const placed: PlacedNail[] = []
  for (const nail of nails) {
    const socket = socketByFinger.get(nail.socketRef)
    if (!socket) continue
    const matrix = socketMatrix(socket)
    if (!matrix) continue
    const mesh = buildNailMesh(nail.geometry, socket, options)
    if (!mesh) continue
    placed.push({
      finger: nail.socketRef,
      mesh,
      matrix,
      textureRef: nail.texture.textureRef,
      ...(nail.texture.heightMapRef !== undefined ? { heightMapRef: nail.texture.heightMapRef } : {}),
    })
  }

  return placed.sort((a, b) => fingerOrder(a.finger) - fingerOrder(b.finger))
}
