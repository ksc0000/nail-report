// Stage 6 — relative rotation with a known Personal HandProfile.
//
// Stage 5 closed the landmark-only route: with weak perspective and a free
// depth per point, the depths absorb one image equation each, so the rotation's
// MAGNITUDE is not merely ill-conditioned but exactly unobservable. The one
// thing that can break that is removing the free depths, and Nailous already
// has the means — the HandProfile is Canonical data.
//
// With the hand's 3D landmark geometry known, each view stops being a
// structure-and-motion problem and becomes a pose fit: three rotation
// parameters, one scale, two translation, against 2N measurements. The depths
// are no longer unknowns to trade the rotation against, so the bas-relief
// family cannot form.
//
// Scope: this answers whether a known profile makes the magnitude observable
// and how accurate the profile has to be. It does NOT decide how a profile is
// acquired, and it assumes weak perspective throughout, as every stage since
// Stage 3 has.
//
// Absolute scale is deliberately not used: each view solves its own scale, so
// a profile that is uniformly too large or too small costs nothing. The
// profile supplies SHAPE, never size.

import { LANDMARK_NAMES } from './nail3dLift.ts'
import type { ScanObservation } from './nail3dObservation.ts'
import { FINGER_LANDMARKS, LANDMARK_COUNT, WRIST } from './nail3dSocket.ts'
import { DEFAULT_MIN_VIEW_SEPARATION } from './nail3dMultiView.ts'
import { POSE_BUDGET_DEG, POSE_LANDMARK_SETS, toRotationVector } from './nail3dLandmarkPose.ts'
import type { Observability, PoseLandmarkSetName } from './nail3dLandmarkPose.ts'
import { cross, dot, normalize, multiplyMat3, rotationMat3, transposeMat3 } from './vec3.ts'
import type { Mat3, Vec3 } from './vec3.ts'

export const PROFILE_POSE_VERSION = 1
export const PROFILE_POSE_METHOD = 'twoViewOrthographic+knownHandProfile'

/**
 * Below this, a degree of rotation error moves the fitted landmarks by less
 * than annotation noise would, so the direction is not measured. Same rule and
 * same number as the landmark-only estimator, so the two are comparable.
 */
export const OBSERVABLE_MIN_PX_PER_DEG = 0.1

/**
 * A personal hand's 3D landmark geometry, in its own canonical frame.
 *
 * `units: 'profile'` exists for the same reason `NormalizedNailSocket` carries
 * `units: 'normalized'`: so a shape can never be mistaken for a metre value.
 * Nothing here is in millimetres, and nothing needs to be — the fit solves
 * each view's scale, so only the SHAPE is read.
 */
export interface HandProfile3D {
  readonly units: 'profile'
  /** 21 landmarks, in `LANDMARK_NAMES` order. */
  readonly landmarks: readonly Vec3[]
  readonly handedness: 'left' | 'right'
}

export const handProfile = (
  landmarks: readonly Vec3[],
  handedness: 'left' | 'right',
): HandProfile3D | null =>
  landmarks.length === LANDMARK_COUNT ? { units: 'profile', landmarks, handedness } : null

export interface ViewFit {
  rotation: Mat3
  /** Pixels per profile unit for this view, solved rather than assumed. */
  scale: number
  /**
   * RMS distance between the projected profile and the observed landmarks.
   * This is the profile-mismatch signal: near zero for the person's own
   * profile, and it grows with the profile's shape error.
   */
  mismatchRmsPx: number
  /** Which of the two weak-perspective depth branches the prior chose. */
  depthBranch: 'asSolved' | 'mirrored' | 'unresolved'
}

export interface ProfilePoseEstimate {
  set: PoseLandmarkSetName | 'custom'
  /** The relative rotation, when every component was observable. */
  rotation: Mat3 | null
  /** The best fit when refused — diagnostics only. */
  discardedRotation: Mat3 | null
  referenceFit: ViewFit | null
  secondFit: ViewFit | null
  /** Worse of the two views' profile mismatch, in reference-view pixels. */
  profileMismatchRmsPx: number
  /** Scale ratio between the views, from the two solved scales. */
  viewScaleRatio: number
  observability: Observability | null
  usedLandmarkIds: readonly string[]
  rejectedLandmarkIds: readonly string[]
  confidence: number
  refusedReason?: 'tooFewLandmarks' | 'viewsTooSimilar' | 'notObservable' | 'profileMismatch'
}

export interface ProfilePoseOptions {
  set?: PoseLandmarkSetName
  landmarkIds?: readonly string[]
  minConfidence?: number
  minViewSeparation?: number
  /**
   * Reject outright when the profile does not fit the images this badly, in
   * reference-view pixels. Off by default: Stage 6 measures the mismatch
   * rather than assuming a threshold for it.
   */
  maxProfileMismatchPx?: number
}

// ---------------------------------------------------------------------------
// Local linear algebra (kept here rather than exported from the Stage 5
// module, so neither estimator can quietly change the other's numbers)
// ---------------------------------------------------------------------------

const symmetricEigenvalues = (m: readonly number[]): [number, number, number] => {
  const [a, b, c, , d, e, , , f] = m
  const offDiagonal = b * b + c * c + e * e
  if (offDiagonal < 1e-30) {
    const sorted = [a, d, f].sort((x, y) => y - x)
    return [sorted[0], sorted[1], sorted[2]]
  }
  const q = (a + d + f) / 3
  const p2 = (a - q) ** 2 + (d - q) ** 2 + (f - q) ** 2 + 2 * offDiagonal
  const p = Math.sqrt(p2 / 6)
  const bm = [(a - q) / p, b / p, c / p, b / p, (d - q) / p, e / p, c / p, e / p, (f - q) / p]
  const determinant =
    bm[0] * (bm[4] * bm[8] - bm[5] * bm[7]) -
    bm[1] * (bm[3] * bm[8] - bm[5] * bm[6]) +
    bm[2] * (bm[3] * bm[7] - bm[4] * bm[6])
  const phi = Math.acos(Math.min(1, Math.max(-1, determinant / 2))) / 3
  const first = q + 2 * p * Math.cos(phi)
  const third = q + 2 * p * Math.cos(phi + (2 * Math.PI) / 3)
  return [first, 3 * q - first - third, third]
}

const invert3 = (m: readonly number[]): number[] | null => {
  const [a, b, c, d, e, f, g, h, i] = m
  const determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  if (!(Math.abs(determinant) > 1e-30)) return null
  const inv = 1 / determinant
  return [
    (e * i - f * h) * inv, (c * h - b * i) * inv, (b * f - c * e) * inv,
    (f * g - d * i) * inv, (a * i - c * g) * inv, (c * d - a * f) * inv,
    (d * h - e * g) * inv, (b * g - a * h) * inv, (a * e - b * d) * inv,
  ]
}

const quadraticForm = (m: readonly number[], v: Vec3): number => {
  let total = 0
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) total += v[r] * m[r * 3 + c] * v[c]
  return total
}

const congruence = (m: readonly number[], r: Mat3): number[] => {
  // r * m * r^T, for carrying a covariance between frames.
  const rm = new Array(9).fill(0)
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      let total = 0
      for (let k = 0; k < 3; k += 1) total += r[i * 3 + k] * m[k * 3 + j]
      rm[i * 3 + j] = total
    }
  }
  const out = new Array(9).fill(0)
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      let total = 0
      for (let k = 0; k < 3; k += 1) total += rm[i * 3 + k] * r[j * 3 + k]
      out[i * 3 + j] = total
    }
  }
  return out
}

const fromRotationVector = (omega: Vec3): Mat3 => {
  const angle = Math.hypot(omega[0], omega[1], omega[2])
  if (angle < 1e-12) return [1, 0, 0, 0, 1, 0, 0, 0, 1]
  return rotationMat3([omega[0] / angle, omega[1] / angle, omega[2] / angle], angle)
}

const nelderMead = (
  objective: (x: Vec3) => number,
  start: Vec3,
  step: number,
  iterations: number,
): { x: Vec3; value: number } => {
  const simplex = [start as Vec3]
    .concat([0, 1, 2].map(axis => {
      const point = [...start]
      point[axis] += step
      return point as unknown as Vec3
    }))
    .map(x => ({ x, value: objective(x) }))

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
      simplex[3] = expandedValue < reflectedValue
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
    for (let i = 1; i < 4; i += 1) {
      const x = combine(simplex[0].x, simplex[i].x, 0.5)
      simplex[i] = { x, value: objective(x) }
    }
  }
  simplex.sort((a, b) => a.value - b.value)
  return simplex[0]
}

// ---------------------------------------------------------------------------
// One view's pose against the profile
// ---------------------------------------------------------------------------

interface Correspondence {
  id: string
  index: number
  /** Profile point, centred on the used points' weighted centroid. */
  model: Vec3
  /** Observed image point, centred the same way. Y negated as elsewhere. */
  image: [number, number]
  weight: number
}

/**
 * Weak-perspective fit of a known 3D shape to one image.
 *
 * Given a rotation, the scale has a closed form, so only three parameters are
 * searched. There are 2N measurements against those four unknowns and NO
 * per-point unknowns, which is the whole difference from Stage 5.
 */
const fitResidual = (items: readonly Correspondence[], rotation: Mat3): { scale: number; sse: number } => {
  const [r00, r01, r02, r10, r11, r12] = rotation
  let dotProduct = 0
  let normSquared = 0
  const projected = items.map(item => {
    const x = r00 * item.model[0] + r01 * item.model[1] + r02 * item.model[2]
    const y = r10 * item.model[0] + r11 * item.model[1] + r12 * item.model[2]
    dotProduct += item.weight * (x * item.image[0] + y * item.image[1])
    normSquared += item.weight * (x * x + y * y)
    return [x, y] as const
  })
  if (!(normSquared > 1e-18)) return { scale: 0, sse: Number.POSITIVE_INFINITY }
  const scale = dotProduct / normSquared
  let sse = 0
  items.forEach((item, i) => {
    sse +=
      item.weight *
      ((scale * projected[i][0] - item.image[0]) ** 2 + (scale * projected[i][1] - item.image[1]) ** 2)
  })
  return { scale, sse }
}

/**
 * Does this rotation put the hand's back toward the camera?
 *
 * With a profile in hand the test is direct: take the dorsal direction in
 * profile coordinates and see which way the rotation turns it.
 */
const dorsalFacesCamera = (profile: HandProfile3D, rotation: Mat3): boolean | null => {
  const wrist = profile.landmarks[WRIST]
  const indexMcp = profile.landmarks[FINGER_LANDMARKS.index[0]]
  const pinkyMcp = profile.landmarks[FINGER_LANDMARKS.pinky[0]]
  if (!wrist || !indexMcp || !pinkyMcp) return null
  const normal = cross(
    [indexMcp[0] - wrist[0], indexMcp[1] - wrist[1], indexMcp[2] - wrist[2]],
    [pinkyMcp[0] - wrist[0], pinkyMcp[1] - wrist[1], pinkyMcp[2] - wrist[2]],
  )
  const dorsal: Vec3 = profile.handedness === 'right' ? [-normal[0], -normal[1], -normal[2]] : normal
  const turned: Vec3 = [
    rotation[0] * dorsal[0] + rotation[1] * dorsal[1] + rotation[2] * dorsal[2],
    rotation[3] * dorsal[0] + rotation[4] * dorsal[1] + rotation[5] * dorsal[2],
    rotation[6] * dorsal[0] + rotation[7] * dorsal[1] + rotation[8] * dorsal[2],
  ]
  return dot(turned, [0, 0, 1]) > 0
}

/**
 * Closed-form weak-perspective pose of a known shape onto one image.
 *
 * Because the shape is known there is no search to do. Minimising
 * |A X - y| over an unconstrained 2x3 matrix A is linear least squares; the
 * nearest scaled-orthonormal pair of rows to that A is its SVD's U V^T, with
 * the scale the mean singular value. The third row of the rotation is then
 * fixed up to a sign, and that sign is the depth-reversal branch.
 *
 * Doing it this way rather than by searching SO(3) matters for the result,
 * not just the speed: a coarse search over rotations finds wrong-but-deep
 * basins and reports them with a clean residual, which is indistinguishable
 * from the ambiguity Stage 6 is supposed to be testing for.
 */
const closedFormFit = (items: readonly Correspondence[]): { rows: [Vec3, Vec3]; scale: number } | null => {
  // Weighted normal equations for A (2x3): A = (Y W X^T)(X W X^T)^-1.
  const xx = new Array(9).fill(0)
  const yx = new Array(6).fill(0)
  for (const item of items) {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) xx[i * 3 + j] += item.weight * item.model[i] * item.model[j]
      yx[i] += item.weight * item.image[0] * item.model[i]
      yx[3 + i] += item.weight * item.image[1] * item.model[i]
    }
  }
  const inverse = invert3(xx)
  if (!inverse) return null
  const a: number[] = new Array(6).fill(0)
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      let total = 0
      for (let k = 0; k < 3; k += 1) total += yx[row * 3 + k] * inverse[k * 3 + col]
      a[row * 3 + col] = total
    }
  }

  // SVD of the 2x3 A, via the 2x2 eigenproblem of A A^T.
  const a0: Vec3 = [a[0], a[1], a[2]]
  const a1: Vec3 = [a[3], a[4], a[5]]
  const m00 = dot(a0, a0)
  const m01 = dot(a0, a1)
  const m11 = dot(a1, a1)
  const trace = m00 + m11
  const determinant = m00 * m11 - m01 * m01
  const gap = Math.sqrt(Math.max(0, trace * trace - 4 * determinant))
  const eigenvalues = [(trace + gap) / 2, (trace - gap) / 2]
  if (!(eigenvalues[1] > 1e-18)) return null

  // Exact weak-perspective data makes A's two singular values EQUAL, so the
  // eigenvectors of A A^T are not determined individually. Deriving each one
  // from its own eigenvalue then returns two nearly parallel vectors and the
  // reconstruction falls apart — on clean data specifically, which is the
  // worst possible place for it to happen. Taking the second as the
  // perpendicular of the first keeps the pair orthonormal either way, and any
  // orthonormal pair is a valid choice when the values coincide.
  const first = (() => {
    const candidate: [number, number] =
      Math.abs(m01) > 1e-12 * Math.max(1, trace)
        ? [m01, eigenvalues[0] - m00]
        : m00 >= m11
          ? [1, 0]
          : [0, 1]
    const norm = Math.hypot(candidate[0], candidate[1])
    return norm > 1e-18 ? ([candidate[0] / norm, candidate[1] / norm] as [number, number]) : ([1, 0] as [number, number])
  })()
  const u: Array<[number, number]> = [first, [-first[1], first[0]]]
  const sigma = eigenvalues.map(value => Math.sqrt(Math.max(value, 0)))
  // v_i = u_i^T A / sigma_i, the right singular vectors.
  const v = u.map((ui, i): Vec3 => {
    const raw: Vec3 = [
      (ui[0] * a0[0] + ui[1] * a1[0]) / sigma[i],
      (ui[0] * a0[1] + ui[1] * a1[1]) / sigma[i],
      (ui[0] * a0[2] + ui[1] * a1[2]) / sigma[i],
    ]
    return normalize(raw) ?? raw
  })

  // Nearest scaled-orthonormal rows: U V^T, with the mean singular value.
  const rows: [Vec3, Vec3] = [
    [
      u[0][0] * v[0][0] + u[1][0] * v[1][0],
      u[0][0] * v[0][1] + u[1][0] * v[1][1],
      u[0][0] * v[0][2] + u[1][0] * v[1][2],
    ],
    [
      u[0][1] * v[0][0] + u[1][1] * v[1][0],
      u[0][1] * v[0][1] + u[1][1] * v[1][1],
      u[0][1] * v[0][2] + u[1][1] * v[1][2],
    ],
  ]
  return { rows, scale: (sigma[0] + sigma[1]) / 2 }
}

interface ViewSolution extends ViewFit {
  /** Gauss-Newton normal matrix of this view's fit, in rotation space. */
  normal: number[]
  sse: number
}

const fitView = (profile: HandProfile3D, items: readonly Correspondence[]): ViewSolution | null => {
  const closed = closedFormFit(items)
  if (!closed) return null
  const [row0, row1] = closed.rows

  // The third row is the cross product up to a sign, and the sign IS the
  // depth-reversal branch: both signs project identically, so the residual
  // cannot choose and the handedness prior must.
  const third = cross(row0, row1)
  const candidates: Mat3[] = [
    [row0[0], row0[1], row0[2], row1[0], row1[1], row1[2], third[0], third[1], third[2]],
    [row0[0], row0[1], row0[2], row1[0], row1[1], row1[2], -third[0], -third[1], -third[2]],
  ]
  const facing = candidates.map(candidate => dorsalFacesCamera(profile, candidate))
  let chosen = 0
  let depthBranch: ViewFit['depthBranch'] = 'unresolved'
  if (facing[0] === true) {
    chosen = 0
    depthBranch = 'asSolved'
  } else if (facing[1] === true) {
    chosen = 1
    depthBranch = 'mirrored'
  }
  let rotation = candidates[chosen]

  // A short polish, because the Procrustes step minimises the distance to the
  // unconstrained A rather than the reprojection error itself. It starts at
  // the closed-form answer, so it refines and cannot wander.
  const objective = (omega: Vec3): number =>
    fitResidual(items, multiplyMat3(fromRotationVector(omega), rotation)).sse
  const polished = nelderMead(objective, [0, 0, 0], (0.25 * Math.PI) / 180, 120)
  if (polished.value < fitResidual(items, rotation).sse) {
    rotation = multiplyMat3(fromRotationVector(polished.x), rotation)
  }

  const solved = fitResidual(items, rotation)
  if (!Number.isFinite(solved.sse)) return null

  // Curvature of this view's residual in rotation space.
  const h = (0.25 * Math.PI) / 180
  const at = (i: number, j: number, si: number, sj: number): number => {
    const omega = [0, 0, 0]
    omega[i] += si * h
    omega[j] += sj * h
    return fitResidual(items, multiplyMat3(fromRotationVector(omega as unknown as Vec3), rotation)).sse
  }
  const normal = new Array(9).fill(0)
  for (let i = 0; i < 3; i += 1) {
    normal[i * 3 + i] = (at(i, i, 1, 0) - 2 * solved.sse + at(i, i, -1, 0)) / (2 * h * h)
    for (let j = i + 1; j < 3; j += 1) {
      const mixed = (at(i, j, 1, 1) - at(i, j, 1, -1) - at(i, j, -1, 1) + at(i, j, -1, -1)) / (8 * h * h)
      normal[i * 3 + j] = mixed
      normal[j * 3 + i] = mixed
    }
  }
  if (!normal.every(Number.isFinite)) return null

  const weightTotal = items.reduce((sum, item) => sum + item.weight, 0)
  return {
    rotation,
    scale: closed.scale,
    // Two residual components per point, so this is the per-point RMS distance.
    mismatchRmsPx: Math.sqrt(solved.sse / weightTotal),
    depthBranch,
    normal,
    sse: solved.sse,
  }
}

// ---------------------------------------------------------------------------
// Estimation
// ---------------------------------------------------------------------------

const toPlane = (x: number, y: number): [number, number] => [x, -y]

const collect = (
  profile: HandProfile3D,
  view: ScanObservation,
  ids: readonly string[],
  minConfidence: number,
): { items: Correspondence[]; rejected: string[] } => {
  const observed = new Map(view.landmarks.map(landmark => [landmark.name, landmark]))
  const items: Correspondence[] = []
  const rejected: string[] = []
  for (const id of ids) {
    const index = LANDMARK_NAMES.indexOf(id)
    const landmark = observed.get(id)
    const model = index >= 0 ? profile.landmarks[index] : undefined
    if (!landmark || !model || landmark.x === null || landmark.y === null) {
      rejected.push(id)
      continue
    }
    const confidence = landmark.confidence ?? 1
    if (confidence < minConfidence) {
      rejected.push(id)
      continue
    }
    items.push({
      id,
      index,
      model,
      image: toPlane(landmark.x, landmark.y),
      weight: confidence,
    })
  }
  return { items, rejected }
}

const centreItems = (items: readonly Correspondence[]): Correspondence[] => {
  let total = 0
  const sums = [0, 0, 0, 0, 0]
  for (const item of items) {
    total += item.weight
    sums[0] += item.weight * item.model[0]
    sums[1] += item.weight * item.model[1]
    sums[2] += item.weight * item.model[2]
    sums[3] += item.weight * item.image[0]
    sums[4] += item.weight * item.image[1]
  }
  const [mx, my, mz, ix, iy] = sums.map(value => value / total)
  return items.map(item => ({
    ...item,
    model: [item.model[0] - mx, item.model[1] - my, item.model[2] - mz],
    image: [item.image[0] - ix, item.image[1] - iy],
  }))
}

/**
 * Fits the profile to ONE view: the closed-form weak-perspective pose, with
 * the depth branch chosen by handedness. Exposed for calibration, which has
 * to fit a candidate profile to single frames before any second view exists.
 */
export const fitProfileToView = (
  profile: HandProfile3D,
  view: ScanObservation,
  options: ProfilePoseOptions = {},
): (ViewFit & { usedLandmarkIds: readonly string[]; rejectedLandmarkIds: readonly string[] }) | null => {
  const ids = options.landmarkIds ?? POSE_LANDMARK_SETS[options.set ?? 'all21']
  const { items, rejected } = collect(profile, view, ids, options.minConfidence ?? 0.3)
  if (items.length < 4) return null
  const solved = fitView(profile, centreItems(items))
  if (!solved) return null
  return {
    rotation: solved.rotation,
    scale: solved.scale,
    mismatchRmsPx: solved.mismatchRmsPx,
    depthBranch: solved.depthBranch,
    usedLandmarkIds: items.map(item => item.id),
    rejectedLandmarkIds: rejected,
  }
}

/**
 * Profile mismatch for ONE view at a GIVEN rotation, in that view's pixels.
 *
 * Exposed so the residual landscape can be walked from outside: Stage 5's
 * landmark-only residual was flat across every assumed separation, and the
 * whole claim of Stage 6 is that this one is not. A claim about the shape of a
 * residual has to be checkable without going through the optimizer that
 * searches it.
 */
export const profileFitResidualPx = (
  profile: HandProfile3D,
  view: ScanObservation,
  rotation: Mat3,
  options: ProfilePoseOptions = {},
): number => {
  const ids = options.landmarkIds ?? POSE_LANDMARK_SETS[options.set ?? 'all21']
  const { items } = collect(profile, view, ids, options.minConfidence ?? 0.3)
  if (items.length < 4) return Number.NaN
  const centred = centreItems(items)
  const { sse } = fitResidual(centred, rotation)
  const weightTotal = centred.reduce((sum, item) => sum + item.weight, 0)
  return Math.sqrt(sse / weightTotal)
}

export const estimateRelativeRotationWithProfile = (
  profile: HandProfile3D,
  reference: ScanObservation,
  second: ScanObservation,
  options: ProfilePoseOptions = {},
): ProfilePoseEstimate => {
  const setName = options.landmarkIds ? 'custom' : options.set ?? 'all21'
  const ids = options.landmarkIds ?? POSE_LANDMARK_SETS[options.set ?? 'all21']
  const minConfidence = options.minConfidence ?? 0.3
  const a = collect(profile, reference, ids, minConfidence)
  const b = collect(profile, second, ids, minConfidence)
  const rejected = [...new Set([...a.rejected, ...b.rejected])]
  // Only landmarks usable in BOTH views take part, so the two poses are fitted
  // to the same subset of the hand.
  const shared = new Set(b.items.map(item => item.id))
  const referenceItems = a.items.filter(item => shared.has(item.id))
  const secondShared = new Set(referenceItems.map(item => item.id))
  const secondItems = b.items.filter(item => secondShared.has(item.id))

  const base: ProfilePoseEstimate = {
    set: setName,
    rotation: null,
    discardedRotation: null,
    referenceFit: null,
    secondFit: null,
    profileMismatchRmsPx: Number.NaN,
    viewScaleRatio: Number.NaN,
    observability: null,
    usedLandmarkIds: referenceItems.map(item => item.id),
    rejectedLandmarkIds: rejected,
    confidence: 0,
  }

  // A known shape needs only three rotation parameters and a scale per view,
  // so four points already determine a view. Five leaves something over.
  if (referenceItems.length < 4) return { ...base, refusedReason: 'tooFewLandmarks' }

  const referenceFit = fitView(profile, centreItems(referenceItems))
  const secondFit = fitView(profile, centreItems(secondItems))
  if (!referenceFit || !secondFit) return { ...base, refusedReason: 'notObservable' }

  const rotation = multiplyMat3(secondFit.rotation, transposeMat3(referenceFit.rotation))
  const profileMismatchRmsPx = Math.max(referenceFit.mismatchRmsPx, secondFit.mismatchRmsPx)
  const viewScaleRatio = secondFit.scale / referenceFit.scale

  const fits = {
    referenceFit: { ...referenceFit, normal: undefined, sse: undefined } as unknown as ViewFit,
    secondFit: { ...secondFit, normal: undefined, sse: undefined } as unknown as ViewFit,
    profileMismatchRmsPx,
    viewScaleRatio,
    usedLandmarkIds: referenceItems.map(item => item.id),
  }

  const separation = Math.hypot(rotation[2], rotation[5])
  if (separation < (options.minViewSeparation ?? DEFAULT_MIN_VIEW_SEPARATION)) {
    return { ...base, ...fits, discardedRotation: rotation, refusedReason: 'viewsTooSimilar' }
  }

  // Each view's rotation error is independent, so the relative rotation's
  // covariance is one view's plus the other's carried into its frame.
  const weightTotal = referenceItems.reduce((sum, item) => sum + item.weight, 0)
  // Two residual components per point; four parameters per view.
  const degreesOfFreedom = Math.max(1, 2 * referenceItems.length - 4)
  const perView = [referenceFit, secondFit].map(fit => {
    const variance = fit.sse / degreesOfFreedom
    const inverse = invert3(fit.normal)
    const eigenvalues = symmetricEigenvalues(fit.normal)
    return { fit, variance, inverse, eigenvalues }
  })
  if (perView.some(view => !view.inverse)) {
    return { ...base, ...fits, discardedRotation: rotation, refusedReason: 'notObservable' }
  }

  const covariance = (() => {
    const second = perView[1].inverse!.map(value => value * perView[1].variance)
    const referenceOwn = perView[0].inverse!.map(value => value * perView[0].variance)
    const carried = congruence(referenceOwn, rotation)
    return second.map((value, index) => value + carried[index])
  })()
  // No inverse of the covariance is needed: a perfect fit has a zero
  // covariance, which is a measurement with no uncertainty rather than a
  // failure, and inverting it would turn the best possible case into a refusal.

  const eigenvalues = symmetricEigenvalues(
    perView[0].fit.normal.map((value, index) => value + perView[1].fit.normal[index]),
  )
  const largest = Math.max(eigenvalues[0], 0)
  const smallest = Math.max(eigenvalues[2], 0)
  const conditionNumber = smallest > 1e-12 ? Math.sqrt(largest / smallest) : Number.POSITIVE_INFINITY

  const perDegree = Math.PI / 180
  const baselineAxis = normalize(toRotationVector(rotation)) ?? ([1, 0, 0] as Vec3)
  const summedNormal = perView[0].fit.normal.map(
    (value, index) => value + perView[1].fit.normal[index],
  )
  const riseAlong = (axis: Vec3): number =>
    Math.sqrt(Math.max(0, quadraticForm(summedNormal, axis))) * perDegree / Math.sqrt(2 * weightTotal)
  const sigmaAlong = (axis: Vec3): number => {
    const value = quadraticForm(covariance, axis)
    return value > 0 ? Math.sqrt(value) / perDegree : 0
  }

  const weakestAxis = (() => {
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

  const observability: Observability = {
    conditionNumber,
    baselineAxisPxPerDeg: riseAlong(baselineAxis),
    weakestPxPerDeg: riseAlong(weakestAxis),
    weakestAxis,
    baselineAxisSigmaDeg: sigmaAlong(baselineAxis),
    weakestSigmaDeg: sigmaAlong(weakestAxis),
  }

  if (observability.weakestPxPerDeg < OBSERVABLE_MIN_PX_PER_DEG) {
    return {
      ...base,
      ...fits,
      discardedRotation: rotation,
      observability,
      refusedReason: 'notObservable',
    }
  }

  if (
    options.maxProfileMismatchPx !== undefined &&
    profileMismatchRmsPx > options.maxProfileMismatchPx
  ) {
    return {
      ...base,
      ...fits,
      discardedRotation: rotation,
      observability,
      refusedReason: 'profileMismatch',
    }
  }

  return {
    ...base,
    ...fits,
    rotation,
    observability,
    confidence: Number.isFinite(observability.weakestSigmaDeg)
      ? Math.max(0, Math.min(1, 1 - observability.weakestSigmaDeg / POSE_BUDGET_DEG))
      : 0,
  }
}
