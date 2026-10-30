// Stage 5 — relative rotation between two views, from hand landmarks alone.
//
// Stage 4.5 established that the two-view lift needs the camera-to-HAND
// relative rotation to roughly 2-4 degrees, that device odometry measures
// camera-to-world instead, and that the component the images cannot police is
// exactly the one about the baseline axis. This module tests the remaining
// candidate: estimate the relative rotation from the landmarks themselves,
// which are the only thing that sees the hand and the camera together.
//
// The degree-of-freedom count suggested it should work — 21 landmarks give 42
// equations against 25 unknowns — but that count is wrong about where the
// redundancy sits, and the measurement says so:
//
//   Depth reaches the second image only along (r02, r12). Along that one
//   direction each point's own depth absorbs its own equation, with nothing
//   left over, so ALL the information about the rotation lives in the
//   perpendicular component. That component pins the rotation's AXIS and says
//   nothing about its MAGNITUDE, which trades off exactly against a depth
//   scaling. Adding landmarks adds redundancy only where there already was
//   some.
//
// So this is a one-parameter ambiguity (the classical bas-relief one), exact
// rather than ill-conditioned: on the synthetic hand the residual is flat to
// 1e-13 px for every assumed separation from 5 to 75 degrees, and an exact fit
// exists 50 degrees from the truth. More points do not help, and neither does
// a less planar hand.
//
// What survives is the axis DIRECTION, which is recovered essentially exactly.
// The estimator therefore reports the axis, refuses the full rotation, and
// never returns a magnitude a caller could mistake for a measurement.
//
// ⚠ The nail-bed semantic landmarks are NOT an input here, by construction:
// the input type exposes `landmarks` and nothing else. The bed is held back so
// its reprojection residual stays an INDEPENDENT check on a pose this
// estimator produced. Feeding it in would make that check circular and leave
// the pipeline with no self-validation at all.
//
// World convention, as in the lift: X right, Y up (image Y negated), Z toward
// the reference camera. Absolute scale and absolute depth are not recovered.

import { LANDMARK_NAMES } from './nail3dLift.ts'
import type { ScanObservation } from './nail3dObservation.ts'
import { FINGER_LANDMARKS, WRIST } from './nail3dSocket.ts'
import { DEFAULT_MIN_VIEW_SEPARATION } from './nail3dMultiView.ts'
import { cross, dot, normalize, rotationMat3, multiplyMat3, transposeMat3 } from './vec3.ts'
import type { Mat3, Vec3 } from './vec3.ts'

export const LANDMARK_POSE_VERSION = 1
export const LANDMARK_POSE_METHOD = 'twoViewOrthographic+landmarkOnly'

/**
 * The angular budget Stage 4.5 derived for the relative pose. `confidence` is
 * expressed against it, so a confidence of 0 means "at or past the point where
 * this pose costs more socket error than the product can absorb".
 */
export const POSE_BUDGET_DEG = 4

/**
 * Below this, a degree of rotation error about the weakest direction changes
 * the residual by less than annotation noise would, so that direction is not
 * measured whatever the fit reports. Stage 4.5 put real annotation sigma at
 * 1.5-3 px, so a tenth of a pixel per degree is already generous.
 */
export const OBSERVABLE_MIN_PX_PER_DEG = 0.1

// ---------------------------------------------------------------------------
// The point sets being compared
// ---------------------------------------------------------------------------

const PALM_RIGID_IDS = [
  'wrist',
  // Index 1 in this layout. MediaPipe calls it the thumb CMC; it articulates,
  // but far less than any finger joint, and it is the only palm point that
  // adds width on the thumb side.
  'thumbMCP',
  'indexMCP',
  'middleMCP',
  'ringMCP',
  'pinkyMCP',
] as const

/**
 * Candidate landmark sets, named so a result can say which one produced it.
 *
 * `all21` uses every landmark, and so depends on the fingers holding still
 * between the two shots. `palmRigid` uses only the wrist and the MCP row,
 * which barely move when the fingers do — at the cost of six points that are
 * nearly coplanar, and a plane carries no rotation information at all under
 * orthographic projection. Which trade wins is an empirical question.
 */
export const POSE_LANDMARK_SETS = {
  all21: LANDMARK_NAMES,
  palmRigid: PALM_RIGID_IDS as readonly string[],
} as const

export type PoseLandmarkSetName = keyof typeof POSE_LANDMARK_SETS

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Deliberately narrower than `ScanObservation`: this is the whole input
 * surface of the estimator, so the nail bed cannot reach it even by accident.
 */
export interface PoseLandmarkView {
  readonly landmarks: ScanObservation['landmarks']
  readonly handedness?: ScanObservation['handedness']
}

export interface Observability {
  /**
   * sqrt of the ratio of the largest to smallest curvature of the residual in
   * rotation space. A plane-like point set sends this to infinity: the
   * rotation has a direction it does not constrain at all.
   */
  conditionNumber: number
  /** Residual rise per degree of error about the baseline axis, in px/deg. */
  baselineAxisPxPerDeg: number
  /** The same for the worst-constrained direction, whatever it is. */
  weakestPxPerDeg: number
  /** The direction the data constrains least, as a rotation axis. */
  weakestAxis: Vec3
  /** 1 sigma of the estimate about the baseline axis, in degrees. */
  baselineAxisSigmaDeg: number
  /** 1 sigma along the weakest direction, in degrees. */
  weakestSigmaDeg: number
}

export interface LandmarkPoseEstimate {
  set: PoseLandmarkSetName | 'custom'
  /**
   * The relative rotation, ONLY when every component of it was observable.
   * Null whenever something was not, so an unusable pose cannot be read out
   * by a caller that forgot to check `refusedReason`.
   */
  rotation: Mat3 | null
  /**
   * The best-fitting rotation when the estimate was refused. For diagnostics
   * and for evaluation: its magnitude is not a measurement.
   */
  discardedRotation: Mat3 | null
  /**
   * The rotation AXIS as a unit vector — the part the images do determine,
   * reported even when the magnitude is not. This is what a cross-check
   * against an external pose can actually police.
   */
  axisDirection: Vec3 | null
  /** Scale ratio between the views, solved alongside the rotation. */
  viewScaleRatio: number
  /** Weighted RMS of the second view's residual, in that view's pixels. */
  residualRmsPx: number
  observability: Observability | null
  /** Which depth branch the chirality prior selected. */
  depthBranch: 'asSolved' | 'mirrored' | 'unresolved'
  usedLandmarkIds: readonly string[]
  rejectedLandmarkIds: readonly string[]
  /** 0-1, from the weakest-direction sigma against `POSE_BUDGET_DEG`. */
  confidence: number
  refusedReason?: 'tooFewLandmarks' | 'viewsTooSimilar' | 'notObservable'
}

export interface EstimateOptions {
  set?: PoseLandmarkSetName
  /** Explicit landmark ids, when neither named set is wanted. */
  landmarkIds?: readonly string[]
  /** Landmarks below this confidence are rejected outright. Default 0.3. */
  minConfidence?: number
  /** Minimum |(r02, r12)| for the solve to be trusted. */
  minViewSeparation?: number
}

// ---------------------------------------------------------------------------
// Small linear algebra, local because it is only needed here
// ---------------------------------------------------------------------------

/** Eigenvalues of a symmetric 3x3 matrix, descending. */
const symmetricEigenvalues = (m: Mat3): [number, number, number] => {
  const [a, b, c, , d, e, , , f] = m
  const offDiagonal = b * b + c * c + e * e
  if (offDiagonal < 1e-30) {
    const sorted = [a, d, f].sort((x, y) => y - x)
    return [sorted[0], sorted[1], sorted[2]]
  }
  const q = (a + d + f) / 3
  const p2 = (a - q) ** 2 + (d - q) ** 2 + (f - q) ** 2 + 2 * offDiagonal
  const p = Math.sqrt(p2 / 6)
  const bm: Mat3 = [(a - q) / p, b / p, c / p, b / p, (d - q) / p, e / p, c / p, e / p, (f - q) / p]
  const determinant =
    bm[0] * (bm[4] * bm[8] - bm[5] * bm[7]) -
    bm[1] * (bm[3] * bm[8] - bm[5] * bm[6]) +
    bm[2] * (bm[3] * bm[7] - bm[4] * bm[6])
  const phi = Math.acos(Math.min(1, Math.max(-1, determinant / 2))) / 3
  const first = q + 2 * p * Math.cos(phi)
  const third = q + 2 * p * Math.cos(phi + (2 * Math.PI) / 3)
  return [first, 3 * q - first - third, third]
}

const invertSymmetric3 = (m: Mat3): Mat3 | null => {
  const [a, b, c, d, e, f, g, h, i] = m
  const determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  if (!(Math.abs(determinant) > 1e-30)) return null
  const inv = 1 / determinant
  return [
    (e * i - f * h) * inv,
    (c * h - b * i) * inv,
    (b * f - c * e) * inv,
    (f * g - d * i) * inv,
    (a * i - c * g) * inv,
    (c * d - a * f) * inv,
    (d * h - e * g) * inv,
    (b * g - a * h) * inv,
    (a * e - b * d) * inv,
  ]
}

const quadraticForm = (m: Mat3, v: Vec3): number => {
  let total = 0
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) total += v[r] * m[r * 3 + c] * v[c]
  }
  return total
}

/** Rotation from a rotation vector (axis * angle in radians). */
const fromRotationVector = (omega: Vec3): Mat3 => {
  const angle = Math.hypot(omega[0], omega[1], omega[2])
  if (angle < 1e-12) return [1, 0, 0, 0, 1, 0, 0, 0, 1]
  return rotationMat3([omega[0] / angle, omega[1] / angle, omega[2] / angle], angle)
}

/** The rotation vector of a rotation matrix: axis * angle, in radians. */
export const toRotationVector = (m: Mat3): Vec3 => {
  const cosine = Math.min(1, Math.max(-1, (m[0] + m[4] + m[8] - 1) / 2))
  const angle = Math.acos(cosine)
  if (angle < 1e-9) return [0, 0, 0]
  if (Math.PI - angle < 1e-6) {
    // Near 180 degrees the antisymmetric part vanishes; take the axis from
    // the symmetric part instead.
    const diagonal: Vec3 = [
      Math.sqrt(Math.max(0, (m[0] + 1) / 2)),
      Math.sqrt(Math.max(0, (m[4] + 1) / 2)),
      Math.sqrt(Math.max(0, (m[8] + 1) / 2)),
    ]
    const axis = normalize(diagonal) ?? ([1, 0, 0] as Vec3)
    return [axis[0] * angle, axis[1] * angle, axis[2] * angle]
  }
  const k = angle / (2 * Math.sin(angle))
  return [(m[7] - m[5]) * k, (m[2] - m[6]) * k, (m[3] - m[1]) * k]
}

/** Nelder-Mead in 3 dimensions. Deterministic, no tuning knobs exposed. */
const nelderMead = (
  objective: (x: Vec3) => number,
  start: Vec3,
  step: number,
  iterations: number,
): { x: Vec3; value: number } => {
  const simplex: Array<{ x: Vec3; value: number }> = [start].concat(
    [0, 1, 2].map(axis => {
      const point: number[] = [...start]
      point[axis] += step
      return point as unknown as Vec3
    }) as Vec3[],
  ).map(x => ({ x, value: objective(x) }))

  const combine = (a: Vec3, b: Vec3, t: number): Vec3 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    simplex.sort((a, b) => a.value - b.value)
    const worst = simplex[3]
    const centroid: Vec3 = [
      (simplex[0].x[0] + simplex[1].x[0] + simplex[2].x[0]) / 3,
      (simplex[0].x[1] + simplex[1].x[1] + simplex[2].x[1]) / 3,
      (simplex[0].x[2] + simplex[1].x[2] + simplex[2].x[2]) / 3,
    ]
    const reflected = combine(worst.x, centroid, 2)
    const reflectedValue = objective(reflected)

    if (reflectedValue < simplex[0].value) {
      const expanded = combine(worst.x, centroid, 3)
      const expandedValue = objective(expanded)
      simplex[3] =
        expandedValue < reflectedValue
          ? { x: expanded, value: expandedValue }
          : { x: reflected, value: reflectedValue }
      continue
    }
    if (reflectedValue < simplex[2].value) {
      simplex[3] = { x: reflected, value: reflectedValue }
      continue
    }
    const contracted = combine(worst.x, centroid, 0.5)
    const contractedValue = objective(contracted)
    if (contractedValue < worst.value) {
      simplex[3] = { x: contracted, value: contractedValue }
      continue
    }
    // Shrink toward the best vertex.
    for (let i = 1; i < 4; i += 1) {
      const x = combine(simplex[0].x, simplex[i].x, 0.5)
      simplex[i] = { x, value: objective(x) }
    }
  }

  simplex.sort((a, b) => a.value - b.value)
  return simplex[0]
}

// ---------------------------------------------------------------------------
// The solve
// ---------------------------------------------------------------------------

interface Pair {
  id: string
  index: number
  /** Offset from the weighted centroid in the reference view, in its pixels. */
  a: [number, number]
  /** The same point's offset in the second view. */
  b: [number, number]
  weight: number
}

/** Image pixels -> the lift's 2D convention (Y negated). */
const toPlane = (x: number, y: number): [number, number] => [x, -y]

const collect = (
  reference: PoseLandmarkView,
  second: PoseLandmarkView,
  ids: readonly string[],
  minConfidence: number,
): { pairs: Pair[]; rejected: string[] } => {
  const index = (view: PoseLandmarkView) => new Map(view.landmarks.map(l => [l.name, l]))
  const mapA = index(reference)
  const mapB = index(second)
  const pairs: Pair[] = []
  const rejected: string[] = []

  for (const id of ids) {
    const a = mapA.get(id)
    const b = mapB.get(id)
    if (!a || !b || a.x === null || a.y === null || b.x === null || b.y === null) {
      rejected.push(id)
      continue
    }
    // An unreported confidence is treated as usable; a reported low one is not.
    const confidence = Math.min(a.confidence ?? 1, b.confidence ?? 1)
    if (confidence < minConfidence) {
      rejected.push(id)
      continue
    }
    pairs.push({
      id,
      index: LANDMARK_NAMES.indexOf(id),
      a: toPlane(a.x, a.y),
      b: toPlane(b.x, b.y),
      // Weighting by confidence, so a shaky landmark pulls less than a firm
      // one instead of being all-or-nothing at the threshold.
      weight: confidence,
    })
  }
  return { pairs, rejected }
}

const centre = (pairs: readonly Pair[]): Pair[] => {
  let total = 0
  const sum = [0, 0, 0, 0]
  for (const pair of pairs) {
    total += pair.weight
    sum[0] += pair.weight * pair.a[0]
    sum[1] += pair.weight * pair.a[1]
    sum[2] += pair.weight * pair.b[0]
    sum[3] += pair.weight * pair.b[1]
  }
  const [ax, ay, bx, by] = sum.map(value => value / total)
  return pairs.map(pair => ({
    ...pair,
    a: [pair.a[0] - ax, pair.a[1] - ay],
    b: [pair.b[0] - bx, pair.b[1] - by],
  }))
}

interface Solved {
  u: number
  /** Weighted sum of squared residuals, in px^2. */
  sse: number
  weightTotal: number
  depths: number[]
}

/**
 * Given a candidate rotation, solves the scale ratio and every depth in closed
 * form and returns what is left over.
 *
 * For a point offset D seen as (Dx, Dy) in the reference view and as b in the
 * second, with relative rotation R and scale ratio u:
 *
 *   b = u * (R's top-left 2x2) * (Dx, Dy) + (r02, r12) * (u * Dz)
 *
 * The depth only ever enters along (r02, r12), so the component of b
 * perpendicular to that vector does not involve it: one residual per point in
 * u alone, which makes u a weighted least squares with a closed form and
 * leaves the rotation as the only thing to search over.
 */
const solveFor = (pairs: readonly Pair[], rotation: Mat3): Solved | null => {
  const [r00, r01, r02, r10, r11, r12] = rotation
  const normSquared = r02 * r02 + r12 * r12
  if (!(normSquared > 1e-12)) return null

  let numerator = 0
  let denominator = 0
  const prepared = pairs.map(pair => {
    const mx = r00 * pair.a[0] + r01 * pair.a[1]
    const my = r10 * pair.a[0] + r11 * pair.a[1]
    const c = r12 * mx - r02 * my
    const t = r12 * pair.b[0] - r02 * pair.b[1]
    numerator += pair.weight * c * t
    denominator += pair.weight * c * c
    return { mx, my, c, t }
  })
  if (!(denominator > 1e-18)) return null
  const u = numerator / denominator
  if (!Number.isFinite(u) || Math.abs(u) < 1e-9) return null

  let sse = 0
  let weightTotal = 0
  const depths: number[] = []
  pairs.forEach((pair, i) => {
    const { mx, my, c, t } = prepared[i]
    sse += (pair.weight * (t - u * c) ** 2) / normSquared
    weightTotal += pair.weight
    const alpha = (r02 * (pair.b[0] - u * mx) + r12 * (pair.b[1] - u * my)) / normSquared
    depths.push(alpha / u)
  })
  return { u, sse, weightTotal, depths }
}

/** M R M with M = diag(1, 1, -1): the depth-reversed twin of a solution. */
const mirrorRotation = (m: Mat3): Mat3 => [
  m[0], m[1], -m[2],
  m[3], m[4], -m[5],
  -m[6], -m[7], m[8],
]

/**
 * Does the reconstruction have the hand's back toward the reference camera?
 *
 * The two depth branches produce pixel-identical images, so the residual can
 * never choose between them. Handedness can: for a right hand seen from the
 * back, (indexMCP - wrist) x (pinkyMCP - wrist) points away from the camera.
 */
const dorsalFacesCamera = (
  pairs: readonly Pair[],
  depths: readonly number[],
  handedness: 'left' | 'right',
): boolean | null => {
  const find = (index: number): Vec3 | null => {
    const at = pairs.findIndex(pair => pair.index === index)
    if (at < 0) return null
    return [pairs[at].a[0], pairs[at].a[1], depths[at]]
  }
  const wrist = find(WRIST)
  const indexMcp = find(FINGER_LANDMARKS.index[0])
  const pinkyMcp = find(FINGER_LANDMARKS.pinky[0])
  if (!wrist || !indexMcp || !pinkyMcp) return null

  const normal = cross(
    [indexMcp[0] - wrist[0], indexMcp[1] - wrist[1], indexMcp[2] - wrist[2]],
    [pinkyMcp[0] - wrist[0], pinkyMcp[1] - wrist[1], pinkyMcp[2] - wrist[2]],
  )
  const dorsal: Vec3 = handedness === 'right' ? [-normal[0], -normal[1], -normal[2]] : normal
  return dot(dorsal, [0, 0, 1]) > 0
}

// ---------------------------------------------------------------------------
// Estimation
// ---------------------------------------------------------------------------

const GRID_AZIMUTH_STEP_DEG = 15
const GRID_ANGLES_DEG = [10, 20, 30, 40, 50, 60, 70]

export const estimateRelativeRotation = (
  reference: PoseLandmarkView,
  second: PoseLandmarkView,
  options: EstimateOptions = {},
): LandmarkPoseEstimate => {
  const setName = options.landmarkIds ? 'custom' : options.set ?? 'all21'
  const ids = options.landmarkIds ?? POSE_LANDMARK_SETS[options.set ?? 'all21']
  const { pairs: raw, rejected } = collect(reference, second, ids, options.minConfidence ?? 0.3)

  const refused = (reason: LandmarkPoseEstimate['refusedReason']): LandmarkPoseEstimate => ({
    set: setName,
    rotation: null,
    discardedRotation: null,
    axisDirection: null,
    viewScaleRatio: Number.NaN,
    residualRmsPx: Number.NaN,
    observability: null,
    depthBranch: 'unresolved',
    usedLandmarkIds: raw.map(pair => pair.id),
    rejectedLandmarkIds: rejected,
    confidence: 0,
    refusedReason: reason,
  })

  // 2N equations against N + 4 unknowns needs N >= 4 to determine and N >= 5
  // to leave anything over for a residual to be computed from.
  if (raw.length < 5) return refused('tooFewLandmarks')
  const pairs = centre(raw)

  const objective = (omega: Vec3): number => {
    const solved = solveFor(pairs, fromRotationVector(omega))
    return solved ? solved.sse : Number.POSITIVE_INFINITY
  }

  // Coarse grid over the rotation axis in the image plane and the angle, then
  // a local refine. The axis's out-of-plane component is left to the refine:
  // a roll error shows up strongly in the residual, so it is easy to find.
  let best: { x: Vec3; value: number } | null = null
  for (let azimuth = 0; azimuth < 360; azimuth += GRID_AZIMUTH_STEP_DEG) {
    const radians = (azimuth * Math.PI) / 180
    for (const angle of GRID_ANGLES_DEG) {
      const theta = (angle * Math.PI) / 180
      const start: Vec3 = [theta * Math.cos(radians), theta * Math.sin(radians), 0]
      const value = objective(start)
      if (Number.isFinite(value) && (!best || value < best.value)) best = { x: start, value }
    }
  }
  if (!best) return refused('notObservable')

  let refined = nelderMead(objective, best.x, (5 * Math.PI) / 180, 160)
  refined = nelderMead(objective, refined.x, (0.5 * Math.PI) / 180, 160)

  let rotation = fromRotationVector(refined.x)
  let solved = solveFor(pairs, rotation)
  if (!solved) return refused('notObservable')

  const separation = Math.hypot(rotation[2], rotation[5])
  if (separation < (options.minViewSeparation ?? DEFAULT_MIN_VIEW_SEPARATION)) {
    return { ...refused('viewsTooSimilar'), discardedRotation: rotation }
  }

  // Pick the depth branch. Both branches fit the images identically, so this
  // is settled by handedness, never by the residual.
  const handedness = reference.handedness ?? second.handedness ?? 'right'
  const facing = dorsalFacesCamera(pairs, solved.depths, handedness)
  let depthBranch: LandmarkPoseEstimate['depthBranch'] = 'unresolved'
  if (facing !== null) {
    depthBranch = facing ? 'asSolved' : 'mirrored'
    if (!facing) {
      rotation = mirrorRotation(rotation)
      solved = solveFor(pairs, rotation) ?? solved
    }
  }

  // Curvature of the residual in rotation space: the Gauss-Newton normal
  // matrix, by central differences about the solution.
  const h = (0.25 * Math.PI) / 180
  const atOffset = (i: number, j: number, si: number, sj: number): number => {
    const omega = [0, 0, 0]
    omega[i] += si * h
    omega[j] += sj * h
    const candidate = multiplyMat3(fromRotationVector(omega as unknown as Vec3), rotation)
    const value = solveFor(pairs, candidate)
    return value ? value.sse : Number.POSITIVE_INFINITY
  }
  const centreValue = solved.sse
  const normal: number[] = new Array(9).fill(0)
  for (let i = 0; i < 3; i += 1) {
    // Halved second derivative = J^T J for a sum of squares.
    normal[i * 3 + i] = (atOffset(i, i, 1, 0) - 2 * centreValue + atOffset(i, i, -1, 0)) / (2 * h * h)
    for (let j = i + 1; j < 3; j += 1) {
      const mixed =
        (atOffset(i, j, 1, 1) - atOffset(i, j, 1, -1) - atOffset(i, j, -1, 1) + atOffset(i, j, -1, -1)) /
        (8 * h * h)
      normal[i * 3 + j] = mixed
      normal[j * 3 + i] = mixed
    }
  }
  if (!normal.every(Number.isFinite)) return refused('notObservable')

  const eigenvalues = symmetricEigenvalues(normal)
  const largest = Math.max(eigenvalues[0], 0)
  const smallest = Math.max(eigenvalues[2], 0)
  const conditionNumber =
    smallest > 1e-12 ? Math.sqrt(largest / smallest) : Number.POSITIVE_INFINITY

  // Residual variance per degree of freedom: one residual per point, four
  // parameters (three rotation plus the scale ratio).
  const degreesOfFreedom = Math.max(1, pairs.length - 4)
  const variance = solved.sse / (solved.weightTotal / pairs.length) / degreesOfFreedom
  const covariance = invertSymmetric3(normal)
  const perDegree = Math.PI / 180

  const baselineAxis = normalize(toRotationVector(rotation)) ?? ([1, 0, 0] as Vec3)
  const sigmaAlong = (axis: Vec3): number => {
    // A direction the geometry does not constrain has unbounded uncertainty,
    // however small the residual is. Taking sqrt(variance * huge) on a
    // near-singular inverse would otherwise report a reassuring small number
    // for a quantity that was never measured.
    if (!covariance || !(smallest / Math.max(largest, 1e-30) > 1e-9)) {
      return Number.POSITIVE_INFINITY
    }
    const value = quadraticForm(covariance, axis) * variance
    return value > 0 ? Math.sqrt(value) / perDegree : 0
  }
  const riseAlong = (axis: Vec3): number =>
    Math.sqrt(Math.max(0, quadraticForm(normal, axis))) * perDegree

  // The weakest direction: the eigenvector of the smallest eigenvalue, found
  // by the inverse-matrix power step rather than a full decomposition.
  const weakestAxis = (() => {
    if (!covariance) return baselineAxis
    let v: Vec3 = [1, 1, 1]
    for (let i = 0; i < 24; i += 1) {
      const next: Vec3 = [
        covariance[0] * v[0] + covariance[1] * v[1] + covariance[2] * v[2],
        covariance[3] * v[0] + covariance[4] * v[1] + covariance[5] * v[2],
        covariance[6] * v[0] + covariance[7] * v[1] + covariance[8] * v[2],
      ]
      v = normalize(next) ?? v
    }
    return v
  })()

  const rms = Math.sqrt(solved.weightTotal)
  const observability: Observability = {
    conditionNumber,
    baselineAxisPxPerDeg: riseAlong(baselineAxis) / rms,
    weakestPxPerDeg: riseAlong(weakestAxis) / rms,
    weakestAxis,
    baselineAxisSigmaDeg: sigmaAlong(baselineAxis),
    weakestSigmaDeg: sigmaAlong(weakestAxis),
  }

  const axisDirection = normalize(toRotationVector(rotation))
  const residualRmsPx = Math.sqrt(solved.sse / solved.weightTotal)

  // A clean residual is not evidence that the rotation was measured. When the
  // weakest direction barely moves the residual, the fit found a valley rather
  // than a minimum, and the magnitude it landed on is arbitrary — so the
  // rotation is withheld even though it fits the images perfectly.
  if (observability.weakestPxPerDeg < OBSERVABLE_MIN_PX_PER_DEG) {
    return {
      ...refused('notObservable'),
      discardedRotation: rotation,
      axisDirection,
      viewScaleRatio: solved.u,
      residualRmsPx,
      observability,
      depthBranch,
      usedLandmarkIds: pairs.map(pair => pair.id),
    }
  }

  const confidence = Number.isFinite(observability.weakestSigmaDeg)
    ? Math.max(0, Math.min(1, 1 - observability.weakestSigmaDeg / POSE_BUDGET_DEG))
    : 0

  return {
    set: setName,
    rotation,
    discardedRotation: null,
    axisDirection,
    viewScaleRatio: solved.u,
    residualRmsPx,
    observability,
    depthBranch,
    usedLandmarkIds: pairs.map(pair => pair.id),
    rejectedLandmarkIds: rejected,
    confidence,
  }
}

// ---------------------------------------------------------------------------
// Evaluation and cross-check
// ---------------------------------------------------------------------------

export interface RotationDifference {
  totalDeg: number
  /** The part about `axis` — the component the images cannot police. */
  baselineAxisDeg: number
  /** The part perpendicular to it, which the residual does see. */
  orthogonalDeg: number
}

/**
 * Splits the rotation taking `from` to `to` into its component about `axis`
 * and the rest.
 *
 * Used two ways, with the same arithmetic: against the truth in evaluation,
 * and between two independent estimates in `poseDisagreement`.
 */
export const rotationDifference = (from: Mat3, to: Mat3, axis: Vec3): RotationDifference => {
  const error = toRotationVector(multiplyMat3(to, transposeMat3(from)))
  const unit = normalize(axis)
  const total = Math.hypot(error[0], error[1], error[2]) / (Math.PI / 180)
  if (!unit) return { totalDeg: total, baselineAxisDeg: Number.NaN, orthogonalDeg: Number.NaN }
  const along = dot(error, unit)
  const perpendicular: Vec3 = [
    error[0] - along * unit[0],
    error[1] - along * unit[1],
    error[2] - along * unit[2],
  ]
  return {
    totalDeg: total,
    baselineAxisDeg: Math.abs(along) / (Math.PI / 180),
    orthogonalDeg: Math.hypot(perpendicular[0], perpendicular[1], perpendicular[2]) / (Math.PI / 180),
  }
}

/**
 * Disagreement between a landmark-derived relative rotation and one from an
 * external source such as device odometry.
 *
 * A pure function on two rotations, and nothing more: Stage 4.5 concluded that
 * comparing two independent estimates is the only available test of the
 * component a single image pair cannot check, and this is the arithmetic that
 * comparison needs. Where the external rotation comes from is not decided
 * here, and no platform code is implied.
 */
export const poseDisagreement = (
  landmarkRotation: Mat3,
  externalRotation: Mat3,
): RotationDifference => {
  // ⚠ Only `orthogonalDeg` carries information. Stage 5 measured that the
  // landmarks do not determine the rotation magnitude about their own axis, so
  // `baselineAxisDeg` compares an external number against nothing.

  // Measured about the landmark estimate's own axis, because that is the
  // direction its residual cannot police.
  const axis = normalize(toRotationVector(landmarkRotation)) ?? ([1, 0, 0] as Vec3)
  return rotationDifference(externalRotation, landmarkRotation, axis)
}

/**
 * Angle between the landmark-derived rotation axis and an external rotation's
 * axis, in degrees.
 *
 * This is the part of a cross-check that is actually backed by the images: the
 * axis direction is recovered well, the magnitude about it is not recovered at
 * all. A pure function on two inputs; nothing here knows where the external
 * rotation came from.
 */
export const axisDisagreementDeg = (landmarkAxis: Vec3, externalRotation: Mat3): number => {
  const external = normalize(toRotationVector(externalRotation))
  const landmark = normalize(landmarkAxis)
  if (!external || !landmark) return Number.NaN
  // Axis sign is a convention, so the obtuse case is folded back.
  const cosine = Math.min(1, Math.abs(dot(landmark, external)))
  return (Math.acos(cosine) * 180) / Math.PI
}
