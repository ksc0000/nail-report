// H1 — nail texture from a photo (#421, HIGH_FIDELITY_NAIL_RECONSTRUCTION_POC §3 P2 / PH).
//
// The parametric nail mesh (nail3dGeometry.ts) is textured in a UV square:
// u runs across the nail from side A (u = 0) to side B (u = 1) and v runs
// along it from the cuticle (v = 0) to the free edge (v = 1), with each row
// of texels stretched over the local width of the shape. So "projecting a
// photo onto the nail" is a 2D problem: pick the four corners of the nail in
// the photo and pull the pixels inside that quadrilateral back into the unit
// square. No landmarks, no socket, no 3D pose are needed — this is what lets
// H1 survive the Stage 10A result (#414): a wobbly socket moves the nail on
// the hand, it does not change what is painted on it.
//
// Limitation of the 4-corner version: the sides are assumed straight between
// cuticle and free edge. An almond or stiletto outline bulges away from that
// line by a few percent of the width, which shows as a slight stretch near
// the tip. Mid-side control points (or an outline from a segmenter) are the
// follow-up; nothing below changes except uvToImage.
//
// Everything here is pure arithmetic over a pixel sampler so it runs under
// node:test; the canvas glue lives in the feature component.

import type { Mat3, Vec2 } from './nail3dContract'

/** The four corners of one nail in photo pixels. Side A is the thumb side. */
export interface NailQuad {
  cuticleA: Vec2
  cuticleB: Vec2
  freeEdgeA: Vec2
  freeEdgeB: Vec2
}

export const QUAD_CORNERS = ['cuticleA', 'cuticleB', 'freeEdgeB', 'freeEdgeA'] as const
export type QuadCorner = (typeof QUAD_CORNERS)[number]

export const IDENTITY_UV_TRANSFORM: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]

/** Default texture size: nails are taller than wide and the free edge needs the detail. */
export const DEFAULT_TEXTURE_WIDTH = 512
export const DEFAULT_TEXTURE_HEIGHT = 768

// ---------------------------------------------------------------------------
// Quad -> photo mapping
//
// A bilinear (Coons) blend of the four corners, NOT a homography. A homography
// would read the nail's taper as perspective depth and slide everything along
// the nail toward the narrow end — a dot two-thirds of the way to the free
// edge would land near the middle. The taper is shape, not depth: v must stay
// proportional along both sides, which is exactly what the bilinear blend does.

/** Photo position of UV (u, v): u blends side A -> side B, v blends cuticle -> free edge. */
export const uvToImage = (quad: NailQuad, u: number, v: number): Vec2 => {
  const ax = quad.cuticleA[0] * (1 - v) + quad.freeEdgeA[0] * v
  const ay = quad.cuticleA[1] * (1 - v) + quad.freeEdgeA[1] * v
  const bx = quad.cuticleB[0] * (1 - v) + quad.freeEdgeB[0] * v
  const by = quad.cuticleB[1] * (1 - v) + quad.freeEdgeB[1] * v
  return [ax * (1 - u) + bx * u, ay * (1 - u) + by * u]
}

// ---------------------------------------------------------------------------
// Projection (inverse mapping with bilinear sampling)

/** Reads one pixel of the source photo. Out-of-range coordinates must return something sane. */
export type PixelSampler = (x: number, y: number) => readonly [number, number, number, number]

export interface ProjectedTexture {
  width: number
  height: number
  /** RGBA, row-major, top row first — ready for ImageData. */
  data: Uint8ClampedArray
}

/**
 * Builds the UV texture: for every texel, find where it sits in the photo and
 * take a bilinear sample there. Row 0 of the output is the cuticle (v = 0),
 * matching the mesh so no flip is needed when the renderer loads it with
 * `flipY` off; the component handles the canvas orientation.
 */
export const projectNailTexture = (
  sample: PixelSampler,
  quad: NailQuad,
  width = DEFAULT_TEXTURE_WIDTH,
  height = DEFAULT_TEXTURE_HEIGHT,
): ProjectedTexture | null => {
  if (!isQuadUsable(quad)) return null
  const data = new Uint8ClampedArray(width * height * 4)
  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height
    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width
      const [x, y] = uvToImage(quad, u, v)
      const [r, g, b, a] = sampleBilinear(sample, x, y)
      const o = (row * width + col) * 4
      data[o] = r
      data[o + 1] = g
      data[o + 2] = b
      data[o + 3] = a
    }
  }
  return { width, height, data }
}

const sampleBilinear = (
  sample: PixelSampler,
  x: number,
  y: number,
): readonly [number, number, number, number] => {
  const x0 = Math.floor(x - 0.5)
  const y0 = Math.floor(y - 0.5)
  const fx = x - 0.5 - x0
  const fy = y - 0.5 - y0
  const p00 = sample(x0, y0)
  const p10 = sample(x0 + 1, y0)
  const p01 = sample(x0, y0 + 1)
  const p11 = sample(x0 + 1, y0 + 1)
  const mix = (i: 0 | 1 | 2 | 3): number =>
    (p00[i] * (1 - fx) + p10[i] * fx) * (1 - fy) + (p01[i] * (1 - fx) + p11[i] * fx) * fy
  return [mix(0), mix(1), mix(2), mix(3)]
}

/** Wraps raw RGBA pixels as a clamped sampler. */
export const samplerFromRgba = (
  data: ArrayLike<number>,
  width: number,
  height: number,
): PixelSampler => (x, y) => {
  const cx = Math.min(width - 1, Math.max(0, x))
  const cy = Math.min(height - 1, Math.max(0, y))
  const o = (cy * width + cx) * 4
  return [data[o], data[o + 1], data[o + 2], data[o + 3]]
}

// ---------------------------------------------------------------------------
// Starting quad and quality hints for the UI

/**
 * A plausible first guess when no nail has been marked yet: a slightly
 * tapered quad in the middle of the photo, cuticle at the bottom (hands are
 * usually photographed fingertips-up).
 */
export const defaultQuadForImage = (width: number, height: number): NailQuad => {
  const cx = width / 2
  const cy = height / 2
  const halfLen = Math.min(width, height) * 0.18
  const cuticleHalf = halfLen * 0.42
  const edgeHalf = halfLen * 0.34
  return {
    cuticleA: [cx - cuticleHalf, cy + halfLen],
    cuticleB: [cx + cuticleHalf, cy + halfLen],
    freeEdgeA: [cx - edgeHalf, cy - halfLen],
    freeEdgeB: [cx + edgeHalf, cy - halfLen],
  }
}

/**
 * Photo pixels per output texel along the cuticle and along side A. Below ~1
 * the texture is upsampling the photo: the nail was too small in frame and a
 * closer shot (E0: close-ups at ~2x gave several times the nail pixels) will
 * look better than any filtering.
 */
export const sourceResolution = (
  quad: NailQuad,
  width = DEFAULT_TEXTURE_WIDTH,
  height = DEFAULT_TEXTURE_HEIGHT,
): { across: number; along: number } => ({
  across: distance(quad.cuticleA, quad.cuticleB) / width,
  along: distance(quad.cuticleA, quad.freeEdgeA) / height,
})

const distance = (a: Vec2, b: Vec2): number => Math.hypot(a[0] - b[0], a[1] - b[1])

/** True when the quad is a proper, non-self-intersecting quadrilateral. */
export const isQuadUsable = (quad: NailQuad): boolean => {
  const pts = QUAD_CORNERS.map(corner => quad[corner])
  let sign = 0
  for (let i = 0; i < 4; i += 1) {
    const a = pts[i]
    const b = pts[(i + 1) % 4]
    const c = pts[(i + 2) % 4]
    const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
    if (Math.abs(cross) < 1e-9) return false
    const s = Math.sign(cross)
    if (sign === 0) sign = s
    else if (s !== sign) return false
  }
  return true
}
