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
