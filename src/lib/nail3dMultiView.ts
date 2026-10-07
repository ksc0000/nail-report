// Layer B v2 — two-view lift.
//
// Stage 3 established that one weak-perspective view cannot see tilt about the
// nail bed's own width axis: that rotation foreshortens the bed without
// skewing it, so the projection is identical to a shorter fronto-parallel bed.
// This module exists to answer one question and no more: does adding a second
// view with a known relative pose make that rotation observable?
//
// It is NOT a reconstruction pipeline. No bundle adjustment, no pose
// estimation, no triangulation across many frames. Two views, a relative
// rotation that is given rather than solved for, and an explicit refusal when
// the two views are too similar for depth to be determined.
//
// Layer A (ScanObservation) is unchanged: camera pose is an input to the lift,
// not an observation, so it is passed separately. Layer C and M0-M6 are
// unchanged: this produces the same CanonicalObservation the v1 lift does.
//
// World convention, as in v1: X right, Y up (image Y negated), Z toward the
// camera of the reference view. Absolute scale is still not recovered.

import { FINGERS } from './nail3dContract.ts'
import type { Finger } from './nail3dContract.ts'
import { FINGER_LANDMARKS, LANDMARK_COUNT, WRIST } from './nail3dSocket.ts'
import type { NailBedCorners } from './nail3dSocket.ts'
import { LANDMARK_NAMES } from './nail3dLift.ts'
import type { CanonicalObservation } from './nail3dLift.ts'
import { bedQuad2D } from './nail3dObservation.ts'
import type { ScanObservation } from './nail3dObservation.ts'
import { IDENTITY_MAT3, multiplyMat3, transposeMat3 } from './vec3.ts'
import type { Mat3, Vec3 } from './vec3.ts'

export const MULTIVIEW_LIFT_VERSION = 2
export const MULTIVIEW_LIFT_METHOD = 'twoViewOrthographic+knownRelativePose'

/**
 * Below this, the second view barely rotates the Z axis into its image plane
 * and depth is not determined. The index is |(r02, r12)| — the length of the
 * part of the world Z axis that the second view can actually see — which for
 * a pure rotation is the sine of the out-of-plane separation.
 */
export const DEFAULT_MIN_VIEW_SEPARATION = 0.05 // ~2.9 degrees

/**
 * Clearing the degeneracy threshold is not the same as being usable. Measured
 * on the synthetic bed with 5 px of independent annotation noise per view, the
 * recovered bed normal is off by ~46 deg at 3 deg of separation, ~21 deg at
 * 15 deg, ~13 deg at 25 deg and ~6 deg at 60 deg: the solve is legal well
 * before it is informative, because depth enters the second view's image
 * scaled by this index and annotation noise is divided by it.
 *
 * So separation is reported as a grade, not just a boolean.
 */
export const RECOMMENDED_VIEW_SEPARATION = 0.42 // ~25 degrees

export type SeparationQuality =
  /** Depth not determined at all; the lift refuses. */
  | 'degenerate'
  /** Determined, but annotation noise is amplified enough to be misleading. */
  | 'weak'
  /** Enough separation for the recovered depth to be worth using. */
  | 'adequate'

const gradeSeparation = (index: number, threshold: number): SeparationQuality => {
  if (index < threshold) return 'degenerate'
  return index < RECOMMENDED_VIEW_SEPARATION ? 'weak' : 'adequate'
}

export interface ViewPose {
  /** Row-major world->camera rotation for this view. */
  rotation: Mat3
}

export interface TwoViewSetup {
  reference: ViewPose
  second: ViewPose
  minViewSeparation?: number
}

export interface MultiViewResiduals {
  /**
   * |(r02, r12)| of the relative rotation: how much of the world Z axis the
   * second view can see. 0 means depth is not observable at all, whatever the
   * data looks like.
   */
  viewSeparationIndex: number
  /** True when the separation cleared the threshold and depth was solved. */
  depthObservable: boolean
  /**
   * How much to trust the solved depth. `weak` is a result, not a failure:
   * the geometry determined depth but will amplify annotation error.
   */
  separationQuality: SeparationQuality
  /** Scale ratio between the two views, solved rather than assumed. */
  viewScaleRatio: number
  /** Correspondences that took part in the solve. */
  correspondences: number
  /**
   * RMS of the second view's reprojection error, in that view's pixels.
   *
   * It measures annotation consistency and nothing else. A WRONG relative
   * pose leaves this at zero while the recovered bed normal is off by about
   * the same angle as the pose error, so it must never be read as a check on
   * the pose the caller supplied.
   */
  reprojectionRmsPx: number
  /** Why the lift refused, when it did. */
  refusedReason?: 'viewsTooSimilar' | 'tooFewCorrespondences' | 'scaleUnsolvable'
}

export interface MultiViewResult {
  canonical: CanonicalObservation | null
  residuals: MultiViewResiduals
}

const BASE_ASSUMPTIONS: readonly string[] = [
  'weak perspective (scaled orthographic) in both views',
  'the relative rotation between the views is KNOWN, not estimated from the images',
  'correspondence is known: the same named landmarks and bed points in both views',
  'absolute scale is NOT recovered; lengths are in reference-view pixels',
  'the depth offset of the whole hand is not recovered; the wrist is placed at Z = 0',
  'depth is solved from the two views, so no planar-palm or minimum-tilt assumption is used',
  'an error in the supplied relative rotation transfers ~1:1 into the recovered bed normal and leaves no reprojection residual',
]

// ---------------------------------------------------------------------------

/** Image pixels -> world-ish 2D, matching the v1 convention (Y negated). */
const toPlane = (x: number, y: number): [number, number] => [x, -y]

interface Correspondence {
  /** Where this vector belongs once solved. */
  slot: { kind: 'landmark'; index: number } | { kind: 'bed'; finger: Finger; corner: number }
  /** Offset from the wrist in the reference view, in that view's pixels. */
  a: [number, number]
  /** The same offset as seen in the second view. */
  b: [number, number]
}

const landmarkMap = (observation: ScanObservation): Map<string, [number, number] | null> => {
  const map = new Map<string, [number, number] | null>()
  for (const landmark of observation.landmarks) {
    map.set(landmark.name, landmark.x === null || landmark.y === null ? null : toPlane(landmark.x, landmark.y))
  }
  return map
}

const bedPoints = (observation: ScanObservation, finger: Finger): [number, number][] | null => {
  const annotation = observation.nails.find(nail => nail.finger === finger)
  if (!annotation) return null
  const quad = bedQuad2D(annotation)
  if (!quad) return null
  return quad.map(point => toPlane(point.x, point.y))
}

const buildCorrespondences = (
  reference: ScanObservation,
  second: ScanObservation,
  fingers: readonly Finger[],
): { items: Correspondence[]; wristA: [number, number]; wristB: [number, number] } | null => {
  const mapA = landmarkMap(reference)
  const mapB = landmarkMap(second)
  const wristA = mapA.get('wrist')
  const wristB = mapB.get('wrist')
  if (!wristA || !wristB) return null

  const items: Correspondence[] = []
  LANDMARK_NAMES.forEach((name, index) => {
    const a = mapA.get(name)
    const b = mapB.get(name)
    if (!a || !b || index === WRIST) return
    items.push({
      slot: { kind: 'landmark', index },
      a: [a[0] - wristA[0], a[1] - wristA[1]],
      b: [b[0] - wristB[0], b[1] - wristB[1]],
    })
  })

  for (const finger of fingers) {
    const quadA = bedPoints(reference, finger)
    const quadB = bedPoints(second, finger)
    if (!quadA || !quadB) continue
    for (let corner = 0; corner < 4; corner += 1) {
      items.push({
        slot: { kind: 'bed', finger, corner },
        a: [quadA[corner][0] - wristA[0], quadA[corner][1] - wristA[1]],
        b: [quadB[corner][0] - wristB[0], quadB[corner][1] - wristB[1]],
      })
    }
  }

  return { items, wristA, wristB }
}

/**
 * Solves the two-view system.
 *
 * For a point offset D = (Dx, Dy, Dz) seen in the reference view as
 * (Dx, Dy) and in the second view as b, with relative rotation R and unknown
 * scale ratio u between the views:
 *
 *   bx = u*(r00*Dx + r01*Dy) + r02*(u*Dz)
 *   by = u*(r10*Dx + r11*Dy) + r12*(u*Dz)
 *
 * Eliminating the per-point depth leaves one equation per point in u alone,
 * so the scale ratio is over-determined and solved by least squares across
 * every correspondence; depth then follows point by point.
 *
 * The eliminating denominator is proportional to (r02, r12). When the two
 * views nearly coincide that vanishes — which is the degeneracy, visible in
 * the algebra rather than inferred.
 */
const solve = (
  items: readonly Correspondence[],
  relative: Mat3,
): { u: number; depths: number[]; reprojectionRmsPx: number } | null => {
  const [r00, r01, r02, r10, r11, r12] = relative
  let numerator = 0
  let denominator = 0

  const prepared = items.map(item => {
    const mx = r00 * item.a[0] + r01 * item.a[1]
    const my = r10 * item.a[0] + r11 * item.a[1]
    // Coefficient of u after eliminating this point's depth.
    const coefficient = r02 * my - r12 * mx
    const target = r02 * item.b[1] - r12 * item.b[0]
    numerator += coefficient * target
    denominator += coefficient * coefficient
    return { mx, my }
  })

  if (!(Math.abs(denominator) > 1e-12)) return null
  const u = numerator / denominator
  if (!Number.isFinite(u) || Math.abs(u) < 1e-9) return null

  const normSquared = r02 * r02 + r12 * r12
  const depths: number[] = []
  let squaredError = 0
  items.forEach((item, index) => {
    const { mx, my } = prepared[index]
    // Least-squares depth from both rows of the second view.
    const alpha = (r02 * (item.b[0] - u * mx) + r12 * (item.b[1] - u * my)) / normSquared
    depths.push(alpha / u)
    squaredError +=
      (u * mx + r02 * alpha - item.b[0]) ** 2 + (u * my + r12 * alpha - item.b[1]) ** 2
  })

  return {
    u,
    depths,
    reprojectionRmsPx: Math.sqrt(squaredError / Math.max(1, items.length * 2)),
  }
}

/**
 * Lifts one bed (and the hand frame it sits in) from two views.
 *
 * Returns `canonical: null` with a reason rather than a result whenever the
 * geometry does not determine depth. A plausible-looking 3D bed from two
 * nearly identical photos would be worse than none.
 */
export const liftTwoView = (
  reference: ScanObservation,
  second: ScanObservation,
  setup: TwoViewSetup,
  fingers: readonly Finger[] = FINGERS,
): MultiViewResult => {
  const relative = multiplyMat3(setup.second.rotation, transposeMat3(setup.reference.rotation))
  const viewSeparationIndex = Math.hypot(relative[2], relative[5])
  const threshold = setup.minViewSeparation ?? DEFAULT_MIN_VIEW_SEPARATION

  const empty = (reason: MultiViewResiduals['refusedReason']): MultiViewResult => ({
    canonical: null,
    residuals: {
      viewSeparationIndex,
      depthObservable: false,
      separationQuality: gradeSeparation(viewSeparationIndex, threshold),
      viewScaleRatio: Number.NaN,
      correspondences: 0,
      reprojectionRmsPx: Number.NaN,
      refusedReason: reason,
    },
  })

  if (viewSeparationIndex < threshold) return empty('viewsTooSimilar')

  const built = buildCorrespondences(reference, second, fingers)
  if (!built || built.items.length < 4) return empty('tooFewCorrespondences')

  const solved = solve(built.items, relative)
  if (!solved) return empty('scaleUnsolvable')

  const landmarks3d = new Array<Vec3 | null>(LANDMARK_COUNT).fill(null)
  // The wrist anchors the frame; its absolute depth is not recoverable.
  landmarks3d[WRIST] = [built.wristA[0], built.wristA[1], 0]

  const bedCorners = new Map<Finger, (Vec3 | null)[]>()
  built.items.forEach((item, index) => {
    const point: Vec3 = [
      built.wristA[0] + item.a[0],
      built.wristA[1] + item.a[1],
      solved.depths[index],
    ]
    if (item.slot.kind === 'landmark') {
      landmarks3d[item.slot.index] = point
      return
    }
    const corners = bedCorners.get(item.slot.finger) ?? new Array<Vec3 | null>(4).fill(null)
    corners[item.slot.corner] = point
    bedCorners.set(item.slot.finger, corners)
  })

  const beds = [...bedCorners.entries()]
    .filter(([, corners]) => corners.every(corner => corner !== null))
    .map(([finger, corners]) => ({ finger, quad: corners as unknown as NailBedCorners }))

  const scaleReferencePx = (() => {
    const index = landmarks3d[FINGER_LANDMARKS.index[0]]
    const pinky = landmarks3d[FINGER_LANDMARKS.pinky[0]]
    if (!index || !pinky) return 0
    return Math.hypot(index[0] - pinky[0], index[1] - pinky[1])
  })()

  return {
    canonical: {
      liftVersion: MULTIVIEW_LIFT_VERSION,
      liftMethod: MULTIVIEW_LIFT_METHOD,
      derivedFrom: { captureId: reference.captureId, sessionId: reference.sessionId },
      handedness: reference.handedness,
      assumptions: BASE_ASSUMPTIONS,
      landmarks3d,
      beds,
      residuals: {
        reprojectionRmsPx: solved.reprojectionRmsPx,
        clampedBones: 0,
        depthResolved: true,
        bedTiltMagnitudePx: {},
        // Depth comes from the two views, so the single-view skew measure
        // does not apply; observability is reported below instead.
        bedSkewCosine: {},
      },
      scaleReferencePx,
    },
    residuals: {
      viewSeparationIndex,
      depthObservable: true,
      separationQuality: gradeSeparation(viewSeparationIndex, threshold),
      viewScaleRatio: solved.u,
      correspondences: built.items.length,
      reprojectionRmsPx: solved.reprojectionRmsPx,
    },
  }
}

export const identityView: ViewPose = { rotation: IDENTITY_MAT3 }
