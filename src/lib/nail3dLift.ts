// Layer B — 2D observation -> canonical 3D observation.
//
// A single photo cannot determine depth or absolute scale. This module does
// not pretend otherwise: every unmeasurable quantity is supplied by a named
// assumption, the assumptions travel with the result, and `liftVersion` lets
// the whole layer be replaced without touching Layer A or anything downstream.
//
// This is deliberately the SIMPLEST baseline that produces a usable 3D frame:
// weak perspective, a fronto-parallel palm, generic bone-length priors, and a
// minimum-tilt solution for the nail-bed plane. It is a floor to measure
// against, not an attempt at accurate reconstruction.
//
// World convention: X right, Y up (image Y negated), Z toward the camera.
// Right-handed. The palm sits at Z = 0 and fingers curl away (Z <= 0).
//
// See docs/product/SCAN_OBSERVATION_CONTRACT.md §4 and §6.

import { FINGERS } from './nail3dContract.ts'
import type { Finger } from './nail3dContract.ts'
import { FINGER_LANDMARKS, LANDMARK_COUNT, WRIST, estimateSocket } from './nail3dSocket.ts'
import type { NailBedCorners, SocketObservation } from './nail3dSocket.ts'
import { bedQuad2D } from './nail3dObservation.ts'
import type { NailBedAnnotation, ScanObservation } from './nail3dObservation.ts'
import { add, cross, distance, dot, midpoint, normalize, scale, sub } from './vec3.ts'
import type { Vec3 } from './vec3.ts'

export const LIFT_VERSION = 1
export const LIFT_METHOD = 'weakPerspective+planarPalm+minimumTilt'

/** Landmark names, in the index order `FINGER_LANDMARKS` uses. */
export const LANDMARK_NAMES: readonly string[] = (() => {
  const names = new Array<string>(LANDMARK_COUNT).fill('')
  names[WRIST] = 'wrist'
  for (const finger of FINGERS) {
    const [mcp, pip, dip, tip] = FINGER_LANDMARKS[finger]
    names[mcp] = `${finger}MCP`
    names[pip] = `${finger}PIP`
    names[dip] = `${finger}DIP`
    names[tip] = `${finger}TIP`
  }
  return names
})()

/**
 * Phalanx lengths as fractions of the palm width (|indexMCP - pinkyMCP|).
 *
 * These are GENERIC priors, not this hand's measurements. They are the
 * substitute for the depth a single photo cannot give, and the error they
 * introduce is what the lift-bias check measures.
 */
export const PHALANX_RATIOS: Record<Finger, readonly [number, number, number]> = {
  thumb: [0.66, 0.55, 0.39],
  index: [0.9, 0.56, 0.39],
  middle: [1.0, 0.63, 0.41],
  ring: [0.92, 0.59, 0.39],
  pinky: [0.72, 0.44, 0.35],
}

export interface LiftResiduals {
  /** x/y are preserved exactly by weak perspective; non-zero means a bug. */
  reprojectionRmsPx: number
  /** Bones whose projected length exceeded the prior, so depth was clamped to 0. */
  clampedBones: number
  /** True when every bone's depth could be resolved without clamping. */
  depthResolved: boolean
  /** |p| and |q| of the minimum-tilt bed solution, per finger, in pixels. */
  bedTiltMagnitudePx: Partial<Record<Finger, number>>
  /**
   * cos of the angle between the projected across and along axes, per finger.
   *
   * Zero means the projected quad is square, which carries NO information
   * about tilt around the bed's own width axis — that rotation foreshortens
   * the bed without skewing it, so it is indistinguishable from a shorter
   * fronto-parallel bed. When this is ~0 the reconstructed normal is the
   * camera axis by default, not a measurement.
   */
  bedSkewCosine: Partial<Record<Finger, number>>
}

export interface LiftedBed {
  finger: Finger
  quad: NailBedCorners
  /**
   * The optional bed points, lifted when the lift was asked to. Absent means
   * "not used", never "observed at the origin".
   */
  optional?: Partial<Record<'cuticleApex' | 'bedWallSideA' | 'bedWallSideB', Vec3>>
}

export interface CanonicalObservation {
  liftVersion: number
  liftMethod: string
  derivedFrom: { captureId: string; sessionId: string }
  handedness: 'left' | 'right'
  /** Everything supplied rather than measured. Travels with the result. */
  assumptions: readonly string[]
  landmarks3d: readonly (Vec3 | null)[]
  beds: readonly LiftedBed[]
  residuals: LiftResiduals
  /** Palm width in pixels: the unit everything here is expressed in. */
  scaleReferencePx: number
}

const BASE_ASSUMPTIONS: readonly string[] = [
  'weak perspective (scaled orthographic): image x/y are preserved, only depth is inferred',
  'the palm (wrist and all MCPs) is planar and fronto-parallel, at Z = 0',
  'phalanx lengths follow generic ratios of the palm width, not this hand measured',
  'fingers curl away from the camera, which fixes the sign of each bone depth',
  'the nail bed is rectangular, so its across and along axes are perpendicular in 3D',
  'of the bed orientations consistent with the projection, the least tilted is chosen',
  "tilt about the bed's own width axis is NOT observable in one view: it foreshortens " +
    'the bed without skewing it, so it is absorbed into bedLength and the reconstructed ' +
    'normal stays at the camera axis',
  'the bed sits at the depth of its DIP joint',
  'absolute scale is NOT recovered; lengths are in pixels and normalized downstream',
]

// ---------------------------------------------------------------------------

/** Image pixels -> world. Y is negated so the world frame is right-handed. */
const toWorld = (x: number, y: number, z: number): Vec3 => [x, -y, z]

interface Lifted2D {
  index: number
  x: number
  y: number
}

const collect2D = (observation: ScanObservation): (Lifted2D | null)[] => {
  const byName = new Map<string, { x: number | null; y: number | null }>()
  for (const landmark of observation.landmarks) byName.set(landmark.name, landmark)

  return LANDMARK_NAMES.map((name, index) => {
    const found = byName.get(name)
    if (!found || found.x === null || found.y === null) return null
    return { index, x: found.x, y: found.y }
  })
}

/**
 * Depth step along one bone.
 *
 * `expected` is the prior 3D length, `projected` what the image shows. The
 * difference is foreshortening. When the projection is longer than the prior
 * the prior is wrong, so depth is clamped to zero rather than taking the root
 * of a negative number.
 */
const depthStep = (expected: number, projected: number): { dz: number; clamped: boolean } => {
  const squared = expected * expected - projected * projected
  if (squared <= 0) return { dz: 0, clamped: true }
  // Negative: away from the camera.
  return { dz: -Math.sqrt(squared), clamped: false }
}

/**
 * Minimum-tilt planar solution for a projected quad.
 *
 * Under weak perspective a 3D rectangle projects to a parallelogram. Writing
 * the 3D axes as (ax, ay, p) and (lx, ly, q), perpendicularity forces
 * p*q = -(across2 . along2). That leaves one degree of freedom, and this picks
 * the solution with the smallest p^2 + q^2.
 *
 * The bias is explicit and one-directional: the true tilt is never
 * over-estimated, and is under-estimated whenever the real nail is more
 * slanted than the minimum-norm solution.
 */
export const minimumTiltDepths = (
  across2: readonly [number, number],
  along2: readonly [number, number],
): { p: number; q: number } => {
  const c = -(across2[0] * along2[0] + across2[1] * along2[1])
  if (Math.abs(c) < 1e-12) return { p: 0, q: 0 }
  const p = Math.sqrt(Math.abs(c))
  return { p, q: c / p }
}

const liftBed = (
  annotation: NailBedAnnotation,
  dipDepth: number,
  dorsalHint: Vec3 | null,
): { quad: NailBedCorners; tiltPx: number; skewCosine: number } | null => {
  const quad = bedQuad2D(annotation)
  if (!quad) return null
  const [cuticleA, cuticleB, freeEdgeB, freeEdgeA] = quad

  const across2: [number, number] = [cuticleB.x - cuticleA.x, cuticleB.y - cuticleA.y]
  const proximalMid: [number, number] = [(cuticleA.x + cuticleB.x) / 2, (cuticleA.y + cuticleB.y) / 2]
  const distalMid: [number, number] = [(freeEdgeA.x + freeEdgeB.x) / 2, (freeEdgeA.y + freeEdgeB.y) / 2]
  const along2: [number, number] = [distalMid[0] - proximalMid[0], distalMid[1] - proximalMid[1]]

  let { p, q } = minimumTiltDepths(across2, along2)

  // How much the projection actually constrains the tilt. ~0 means it does not.
  const acrossLength = Math.hypot(across2[0], across2[1])
  const alongLength = Math.hypot(along2[0], along2[1])
  const skewCosine =
    acrossLength > 1e-12 && alongLength > 1e-12
      ? (across2[0] * along2[0] + across2[1] * along2[1]) / (acrossLength * alongLength)
      : 0

  // Both (p, q) and (-p, -q) satisfy the constraint and give opposite normals.
  // The skeleton only picks the sign; it does not supply the orientation.
  if (dorsalHint) {
    const acrossWorld: Vec3 = [across2[0], -across2[1], p]
    const alongWorld: Vec3 = [along2[0], -along2[1], q]
    const normal = normalize(cross(acrossWorld, alongWorld))
    if (normal && dot(normal, dorsalHint) < 0) {
      p = -p
      q = -q
    }
  }

  // x/y come straight from the image; only z is supplied.
  const zProximalMid = dipDepth
  const zDistalMid = zProximalMid + q
  const corners: NailBedCorners = [
    toWorld(cuticleA.x, cuticleA.y, zProximalMid - p / 2),
    toWorld(cuticleB.x, cuticleB.y, zProximalMid + p / 2),
    toWorld(freeEdgeB.x, freeEdgeB.y, zDistalMid + p / 2),
    toWorld(freeEdgeA.x, freeEdgeA.y, zDistalMid - p / 2),
  ]
  return { quad: corners, tiltPx: Math.hypot(p, q), skewCosine }
}

/**
 * Lifts a Layer A observation into a canonical 3D observation.
 *
 * Returns null when the landmarks needed for the palm frame are absent — a
 * missing frame is reported, never invented.
 */
export const liftObservation = (observation: ScanObservation): CanonicalObservation | null => {
  const points2d = collect2D(observation)
  const indexMcp = points2d[FINGER_LANDMARKS.index[0]]
  const pinkyMcp = points2d[FINGER_LANDMARKS.pinky[0]]
  const wrist = points2d[WRIST]
  if (!indexMcp || !pinkyMcp || !wrist) return null

  const scaleReferencePx = Math.hypot(indexMcp.x - pinkyMcp.x, indexMcp.y - pinkyMcp.y)
  if (!(scaleReferencePx > 1e-9)) return null

  const landmarks3d = new Array<Vec3 | null>(LANDMARK_COUNT).fill(null)
  landmarks3d[WRIST] = toWorld(wrist.x, wrist.y, 0)

  let clampedBones = 0
  for (const finger of FINGERS) {
    const chain = FINGER_LANDMARKS[finger]
    const mcp = points2d[chain[0]]
    if (!mcp) continue
    landmarks3d[chain[0]] = toWorld(mcp.x, mcp.y, 0) // planar palm

    let depth = 0
    for (let bone = 0; bone < 3; bone += 1) {
      const from = points2d[chain[bone]]
      const to = points2d[chain[bone + 1]]
      if (!from || !to) break
      const projected = Math.hypot(to.x - from.x, to.y - from.y)
      const expected = PHALANX_RATIOS[finger][bone] * scaleReferencePx
      const step = depthStep(expected, projected)
      if (step.clamped) clampedBones += 1
      depth += step.dz
      landmarks3d[chain[bone + 1]] = toWorld(to.x, to.y, depth)
    }
  }

  // Dorsal direction: for a palm at Z = 0 seen from the front, the back of the
  // hand faces the camera. Used ONLY to disambiguate the bed normal's sign.
  const dorsalHint: Vec3 = [0, 0, 1]

  const beds: LiftedBed[] = []
  const bedTiltMagnitudePx: Partial<Record<Finger, number>> = {}
  const bedSkewCosine: Partial<Record<Finger, number>> = {}
  for (const annotation of observation.nails) {
    const dip = landmarks3d[FINGER_LANDMARKS[annotation.finger][2]]
    const lifted = liftBed(annotation, dip ? dip[2] : 0, dorsalHint)
    if (!lifted) continue
    beds.push({ finger: annotation.finger, quad: lifted.quad })
    bedTiltMagnitudePx[annotation.finger] = lifted.tiltPx
    bedSkewCosine[annotation.finger] = lifted.skewCosine
  }

  // Weak perspective preserves x/y exactly, so this is a self-check on the
  // implementation rather than a measurement of the scene.
  let squaredError = 0
  let counted = 0
  points2d.forEach((point, index) => {
    const lifted = landmarks3d[index]
    if (!point || !lifted) return
    squaredError += (lifted[0] - point.x) ** 2 + (-lifted[1] - point.y) ** 2
    counted += 1
  })

  return {
    liftVersion: LIFT_VERSION,
    liftMethod: LIFT_METHOD,
    derivedFrom: { captureId: observation.captureId, sessionId: observation.sessionId },
    handedness: observation.handedness,
    assumptions: BASE_ASSUMPTIONS,
    landmarks3d,
    beds,
    residuals: {
      reprojectionRmsPx: counted > 0 ? Math.sqrt(squaredError / counted) : 0,
      clampedBones,
      depthResolved: clampedBones === 0,
      bedTiltMagnitudePx,
      bedSkewCosine,
    },
    scaleReferencePx,
  }
}

// ---------------------------------------------------------------------------
// Layer B -> Layer C
// ---------------------------------------------------------------------------

/**
 * Runs the Stage 1 socket estimator over a lifted observation.
 *
 * The estimator is unchanged: Layer B produces exactly the 3D landmarks and
 * bed quads it already expected, so replacing this lift leaves Layer C and the
 * M0-M6 metrics untouched.
 */
export const socketObservationsFrom = (
  canonical: CanonicalObservation,
): Map<Finger, SocketObservation> => {
  const result = new Map<Finger, SocketObservation>()
  const landmarks = canonical.landmarks3d
  if (landmarks.some(point => point === null)) return result

  for (const bed of canonical.beds) {
    const observation = estimateSocket(landmarks as Vec3[], bed.quad, bed.finger)
    if (observation) result.set(bed.finger, observation)
  }
  return result
}

// ---------------------------------------------------------------------------
// Lift bias (synthetic only)
// ---------------------------------------------------------------------------

export interface LiftBias {
  /** Per-landmark position error after removing the unrecoverable similarity. */
  landmarkRms: number
  /** Angle between the lifted and true bed normals, in degrees. */
  bedNormalDeg: number | null
  /** Lifted tilt / true tilt. < 1 means the lift under-estimates slant. */
  tiltRatio: number | null
}

const quadNormal = (quad: NailBedCorners): Vec3 | null => {
  const across = sub(quad[1], quad[0])
  const along = sub(midpoint(quad[2], quad[3]), midpoint(quad[0], quad[1]))
  return normalize(cross(across, along))
}

/**
 * Compares a lifted reconstruction against the 3D truth it was projected from.
 *
 * Only meaningful for synthetic data. Absolute scale and depth offset are not
 * recoverable from one view, so both are removed before comparing: what
 * remains is the shape error the lift's assumptions introduce.
 */
export const measureLiftBias = (
  lifted: readonly (Vec3 | null)[],
  truth: readonly Vec3[],
  liftedBed?: NailBedCorners,
  truthBed?: NailBedCorners,
): LiftBias => {
  const pairs: Array<{ lifted: Vec3; truth: Vec3 }> = []
  lifted.forEach((point, index) => {
    if (point && truth[index]) pairs.push({ lifted: point, truth: truth[index] })
  })

  let landmarkRms = 0
  if (pairs.length >= 2) {
    const liftedCentre = pairs.reduce<Vec3>((sum, pair) => add(sum, pair.lifted), [0, 0, 0])
    const truthCentre = pairs.reduce<Vec3>((sum, pair) => add(sum, pair.truth), [0, 0, 0])
    const lc = scale(liftedCentre, 1 / pairs.length)
    const tc = scale(truthCentre, 1 / pairs.length)

    const liftedSpread = pairs.reduce((sum, pair) => sum + distance(pair.lifted, lc), 0)
    const truthSpread = pairs.reduce((sum, pair) => sum + distance(pair.truth, tc), 0)
    const unitScale = truthSpread > 1e-12 ? liftedSpread / truthSpread : 1

    let squared = 0
    for (const pair of pairs) {
      const l = sub(pair.lifted, lc)
      const t = scale(sub(pair.truth, tc), unitScale)
      squared += distance(l, t) ** 2
    }
    // Normalized by the lifted spread so the number is scale-free.
    const reference = liftedSpread / pairs.length
    landmarkRms = reference > 1e-12 ? Math.sqrt(squared / pairs.length) / reference : 0
  }

  let bedNormalDeg: number | null = null
  let tiltRatio: number | null = null
  if (liftedBed && truthBed) {
    const a = quadNormal(liftedBed)
    const b = quadNormal(truthBed)
    if (a && b) {
      const cosine = Math.min(1, Math.max(-1, Math.abs(dot(a, b))))
      bedNormalDeg = (Math.acos(cosine) * 180) / Math.PI
      // Tilt away from facing the camera, for lifted vs truth.
      const view: Vec3 = [0, 0, 1]
      const liftedTilt = Math.acos(Math.min(1, Math.abs(dot(a, view))))
      const truthTilt = Math.acos(Math.min(1, Math.abs(dot(b, view))))
      tiltRatio = truthTilt > 1e-9 ? liftedTilt / truthTilt : null
    }
  }

  return { landmarkRms, bedNormalDeg, tiltRatio }
}
