// Minimal 3D vector helpers shared by the nail3d modules.
//
// Kept dependency-free so the geometry, socket-estimation and stability code
// can all run under the node test runner without WebGL.

export type Vec3 = readonly [number, number, number]

export const vec3 = (x: number, y: number, z: number): Vec3 => [x, y, z]

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

export const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k]

export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]

export const length = (a: Vec3): number => Math.hypot(a[0], a[1], a[2])

export const distance = (a: Vec3, b: Vec3): number => length(sub(a, b))

export const normalize = (a: Vec3): Vec3 | null => {
  const len = length(a)
  if (!(len > 1e-12)) return null
  return [a[0] / len, a[1] / len, a[2] / len]
}

export const midpoint = (a: Vec3, b: Vec3): Vec3 => scale(add(a, b), 0.5)

export const mean = (values: readonly Vec3[]): Vec3 | null => {
  if (values.length === 0) return null
  let total: Vec3 = [0, 0, 0]
  for (const value of values) total = add(total, value)
  return scale(total, 1 / values.length)
}

/** Angle between two directions, in degrees. Returns null if either is degenerate. */
export const angleBetweenDeg = (a: Vec3, b: Vec3): number | null => {
  const na = normalize(a)
  const nb = normalize(b)
  if (!na || !nb) return null
  const cosine = Math.min(1, Math.max(-1, dot(na, nb)))
  return (Math.acos(cosine) * 180) / Math.PI
}

/**
 * Rotates `point` around `axis` (through the origin) by `radians`, Rodrigues.
 * A degenerate axis leaves the point untouched rather than producing NaN.
 */
export const rotateAroundAxis = (point: Vec3, axis: Vec3, radians: number): Vec3 => {
  const k = normalize(axis)
  if (!k || radians === 0) return point
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return add(
    add(scale(point, cos), scale(cross(k, point), sin)),
    scale(k, (1 - cos) * dot(k, point)),
  )
}

export const degToRad = (degrees: number): number => (degrees * Math.PI) / 180

/** Row-major 3x3: [r00 r01 r02, r10 r11 r12, r20 r21 r22]. */
export type Mat3 = readonly number[]

export const IDENTITY_MAT3: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]

/** Rotation matrix for an axis-angle pair, row-major. */
export const rotationMat3 = (axis: Vec3, radians: number): Mat3 => {
  const k = normalize(axis)
  if (!k) return IDENTITY_MAT3
  const [x, y, z] = k
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  const t = 1 - c
  return [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c,
  ]
}

export const applyMat3 = (m: Mat3, v: Vec3): Vec3 => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
]

/** Transpose, which for a rotation is also its inverse. */
export const transposeMat3 = (m: Mat3): Mat3 => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]

export const multiplyMat3 = (a: Mat3, b: Mat3): Mat3 => {
  const out = new Array<number>(9).fill(0)
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      let sum = 0
      for (let k = 0; k < 3; k += 1) sum += a[row * 3 + k] * b[k * 3 + col]
      out[row * 3 + col] = sum
    }
  }
  return out
}

export interface OrthonormalBasis {
  x: Vec3
  y: Vec3
  z: Vec3
}

/**
 * Right-handed basis with `primary` held fixed as +y and `secondary`
 * re-orthogonalized into +z (Gram-Schmidt). Returns null when the two
 * directions are degenerate or parallel — the caller must treat that as
 * "no usable frame" rather than inventing one.
 */
export const orthonormalBasis = (primary: Vec3, secondary: Vec3): OrthonormalBasis | null => {
  const y = normalize(primary)
  if (!y) return null
  const projected = sub(secondary, scale(y, dot(secondary, y)))
  const z = normalize(projected)
  if (!z) return null
  const x = normalize(cross(y, z))
  if (!x) return null
  return { x, y, z }
}

/** Expresses a world-space point in the frame given by `origin` and `basis`. */
export const toBasisCoords = (point: Vec3, origin: Vec3, basis: OrthonormalBasis): Vec3 => {
  const d = sub(point, origin)
  return [dot(d, basis.x), dot(d, basis.y), dot(d, basis.z)]
}

/** Expresses a world-space direction in the frame given by `basis`. */
export const toBasisDirection = (direction: Vec3, basis: OrthonormalBasis): Vec3 => [
  dot(direction, basis.x),
  dot(direction, basis.y),
  dot(direction, basis.z),
]
