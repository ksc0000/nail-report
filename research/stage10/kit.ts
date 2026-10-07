// Stage 10 — the real-photo PoC analysis, frozen before the first photo.
//
// Its job is to find which synthetic assumption breaks FIRST on real photos,
// not to make anything more accurate. So it calls the committed Stage 7–9
// code as is (calibration, pose, lift, frames, socket arithmetic), changes
// none of it, and applies break criteria that were written down before any
// data existed (docs/product/NAIL_SOCKET_POC_PLAN.md §6-L).
//
// There is no 3D truth in a photo, so nothing here is called accuracy. Every
// number is one of:
//   R  repeatability  — scatter of the same quantity over repeated captures
//   C  consistency    — agreement of two measurement routes on the SAME photo
//                       (Vision vs the annotator; annotation pass 1 vs pass 2)
//   S  shift          — change of a quantity between two conditions (nail
//                       set), judged against its own repeatability
// The manual annotation is a REFERENCE, not truth: for the joints it is the
// annotator's convention (dorsal skin crease, skin apex), which differs from
// the detector's by a constant that the S and R numbers cancel and the C
// numbers report as such.
//
// v2 (re-frozen once after the independent review, still before any photo):
// the primary F0 / F3dNoTip comparison and every Q5 substitution run on
// MATCHED sessions only, every session is accounted for with the reason it
// left the analysis, uncertainties are session-level, and the protocol is
// time-balanced (ABBA x 3) with the capture order checked against EXIF time.

import type { Finger } from '../../src/lib/nail3dContract.ts'
import { buildFrame } from '../../src/lib/nail3dCanonicalFrames.ts'
import type { FrameMethod } from '../../src/lib/nail3dCanonicalFrames.ts'
import { measurePalmStretch, stretchProfileLaterally } from '../../src/lib/nail3dHandCalibration.ts'
import { identityView, liftTwoView } from '../../src/lib/nail3dMultiView.ts'
import type { NailBedAnnotation, ObservedPoint2D, ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { estimateRelativeRotationWithProfile } from '../../src/lib/nail3dProfilePose.ts'
import type { HandProfile3D } from '../../src/lib/nail3dProfilePose.ts'
import { socketInFrame } from '../../src/lib/nail3dSocket.ts'
import type { CanonicalHandFrame, NailBedCorners, SocketObservation } from '../../src/lib/nail3dSocket.ts'
import { computeStability } from '../../src/lib/nail3dStability.ts'
import { add, distance, dot, midpoint, scale, sub, toBasisCoords } from '../../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../../src/lib/vec3.ts'
import { GENERIC_PROFILE } from '../../tests/support/handPopulation.ts'
import { jackknife, mean, variance, welchDifference } from './stats.ts'
import type { Jackknife, WelchDifference } from './stats.ts'

export const STAGE10_KIT_VERSION = 2
const FINGER: Finger = 'index'

/** F0 is the product frame; F3dNoTip the Stage 9 candidate; F3d and F4 diagnose TIP and DIP. */
export const STAGE10_FRAMES = ['F0', 'F3dNoTip', 'F3d', 'F4'] as const satisfies readonly FrameMethod[]
export type Stage10Frame = (typeof STAGE10_FRAMES)[number]
/** The pre-registered comparison. F3d and F4 are descriptive only and are never selected from Stage 10 data. */
export const PRIMARY_FRAMES = ['F0', 'F3dNoTip'] as const satisfies readonly Stage10Frame[]

// ---------------------------------------------------------------------------
// Names: S<session>-<N0|N1>-<V1|V2>-<shot>, CAL-<n>
// ---------------------------------------------------------------------------

export type NailSetId = 'N0' | 'N1'
export type ViewId = 'V1' | 'V2'

/**
 * The session order: ABBA x 3 (N0 N1 N1 N0, three times). Both conditions sit
 * at a mean session index of 6.5, so a linear drift over the day cannot pose
 * as a nail-set shift (ABAB would leave one session step of it). Every
 * session is a fresh placement of the hand, also when the same condition
 * comes twice in a row; an N1 session re-attaches the tip every time.
 */
export const STAGE10_SCHEDULE: readonly NailSetId[] = ['N0', 'N1', 'N1', 'N0', 'N0', 'N1', 'N1', 'N0', 'N0', 'N1', 'N1', 'N0']
/** Shot 1 is the analysed pair, shot 2 the unmoved repeat (R floor), V1 shot 3 the Stage 10A return-to-V1 check. */
export const RETURN_SHOT = 3

export interface CaptureName {
  captureId: string
  session: string
  nailSet: NailSetId
  view: ViewId
  shot: number
}

const CAPTURE_PATTERN = /^S(\d+)-(N0|N1)-(V1|V2)-(\d+)$/
const CALIBRATION_PATTERN = /^CAL-\d+$/

export const parseCaptureName = (captureId: string): CaptureName | null => {
  const match = CAPTURE_PATTERN.exec(captureId)
  if (!match) return null
  return {
    captureId,
    session: `S${match[1]}`,
    nailSet: match[2] as NailSetId,
    view: match[3] as ViewId,
    shot: Number(match[4]),
  }
}

export const isCalibrationName = (captureId: string): boolean => CALIBRATION_PATTERN.test(captureId)

// ---------------------------------------------------------------------------
// Manual annotation: captureId,pass,point,x,y
// ---------------------------------------------------------------------------

export const ANNOTATED_POINTS = [
  'cuticleSideA',
  'cuticleSideB',
  'freeEdgeSideA',
  'freeEdgeSideB',
  'indexDIP',
  'indexPIP',
  'indexTIP',
] as const
export type AnnotatedPoint = (typeof ANNOTATED_POINTS)[number]

export interface AnnotationRow {
  captureId: string
  pass: 1 | 2
  point: AnnotatedPoint
  x: number
  y: number
}

export const parseAnnotationCsv = (text: string): { rows: AnnotationRow[]; errors: string[] } => {
  const rows: AnnotationRow[] = []
  const errors: string[] = []
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'))
  if (lines.length === 0) return { rows, errors: ['annotations: empty'] }
  if (lines[0].replace(/[\s"]/g, '') !== 'captureId,pass,point,x,y') {
    errors.push('annotations: the header must be captureId,pass,point,x,y')
  }
  const seen = new Set<string>()
  lines.slice(1).forEach((line, index) => {
    const where = `annotations line ${index + 2}`
    // Spreadsheet exports may quote cells; the values themselves never contain commas.
    const cells = line.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1').trim())
    if (cells.length !== 5) {
      errors.push(`${where}: expected 5 columns`)
      return
    }
    const [captureId, passText, point, xText, yText] = cells
    const pass = Number(passText)
    const x = Number(xText)
    const y = Number(yText)
    if (pass !== 1 && pass !== 2) errors.push(`${where}: pass must be 1 or 2`)
    else if (!(ANNOTATED_POINTS as readonly string[]).includes(point)) errors.push(`${where}: unknown point ${point}`)
    else if (!Number.isFinite(x) || !Number.isFinite(y)) errors.push(`${where}: x and y must be numbers`)
    else if (seen.has(`${captureId}|${pass}|${point}`)) errors.push(`${where}: ${point} pass ${pass} given twice`)
    else {
      seen.add(`${captureId}|${pass}|${point}`)
      rows.push({ captureId, pass, point: point as AnnotatedPoint, x, y })
    }
  })
  return { rows, errors }
}

type Px = [number, number]

class Annotations {
  private readonly byKey = new Map<string, Px>()
  constructor(rows: readonly AnnotationRow[]) {
    for (const row of rows) this.byKey.set(`${row.captureId}|${row.pass}|${row.point}`, [row.x, row.y])
  }
  get(captureId: string, pass: 1 | 2, point: AnnotatedPoint): Px | null {
    return this.byKey.get(`${captureId}|${pass}|${point}`) ?? null
  }
}

// ---------------------------------------------------------------------------
// Small numerics
// ---------------------------------------------------------------------------

const median = (values: readonly number[]) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : Number.NaN
}
const percentile95 = (values: readonly number[]) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : Number.NaN
}
const centroid = (points: readonly Vec3[]): Vec3 =>
  scale(points.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / points.length)
/** Mean squared distance from the centroid (a vector variance). */
const spreadSquared = (points: readonly Vec3[]) => {
  if (points.length < 2) return Number.NaN
  const c = centroid(points)
  return points.reduce((sum, point) => sum + distance(point, c) ** 2, 0) / (points.length - 1)
}
const angleDeg = (a: Vec3, b: Vec3) => (Math.acos(Math.min(1, Math.max(-1, dot(a, b)))) * 180) / Math.PI

/** Rotation -> unit quaternion [w, x, y, z]. */
const toQuaternion = (m: Mat3): [number, number, number, number] => {
  const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = m
  const trace = m00 + m11 + m22
  if (trace > 0) {
    const s = Math.sqrt(trace + 1) * 2
    return [s / 4, (m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s]
  }
  if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2
    return [(m21 - m12) / s, s / 4, (m01 + m10) / s, (m02 + m20) / s]
  }
  if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2
    return [(m02 - m20) / s, (m01 + m10) / s, s / 4, (m12 + m21) / s]
  }
  const s = Math.sqrt(1 + m22 - m00 - m11) * 2
  return [(m10 - m01) / s, (m02 + m20) / s, (m12 + m21) / s, s / 4]
}

const fromQuaternion = ([w, x, y, z]: readonly number[]): Mat3 => [
  1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y),
  2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x),
  2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y),
]

/** Chordal mean of rotations (sign-aligned quaternion average). */
const meanRotation = (rotations: readonly Mat3[]): Mat3 => {
  const quaternions = rotations.map(toQuaternion)
  const reference = quaternions[0]
  const sum = [0, 0, 0, 0]
  for (const q of quaternions) {
    const sign = q[0] * reference[0] + q[1] * reference[1] + q[2] * reference[2] + q[3] * reference[3] < 0 ? -1 : 1
    for (let i = 0; i < 4; i += 1) sum[i] += sign * q[i]
  }
  const norm = Math.hypot(...sum)
  return fromQuaternion(sum.map(value => value / norm))
}

const rotationAngleDeg = (a: Mat3, b: Mat3): number => {
  // angle of a * b^T
  const trace =
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] + a[4] * b[4] + a[5] * b[5] + a[6] * b[6] + a[7] * b[7] + a[8] * b[8]
  return (Math.acos(Math.min(1, Math.max(-1, (trace - 1) / 2))) * 180) / Math.PI
}

// ---------------------------------------------------------------------------
// Calibration (Stage 7: H1 = generic profile, stretched by the mean palmShapeFit)
// ---------------------------------------------------------------------------

export interface CalibrationResult {
  frames: number
  stretches: number[]
  refused: string[]
  stretch: number | null
  /** Standard error of the mean stretch. */
  stretchSe: number
  profile: HandProfile3D | null
}

export const calibrate = (frames: readonly ScanObservation[]): CalibrationResult => {
  const stretches: number[] = []
  const refused: string[] = []
  for (const frame of frames) {
    const measured = measurePalmStretch(GENERIC_PROFILE, frame, 'palmShapeFit')
    if (measured.stretch === null) refused.push(`${frame.captureId}: ${measured.refusedReason ?? 'refused'}`)
    else stretches.push(measured.stretch)
  }
  const stretch = stretches.length ? mean(stretches) : null
  return {
    frames: frames.length,
    stretches,
    refused,
    stretch,
    stretchSe: stretches.length > 1 ? Math.sqrt(variance(stretches) / stretches.length) : Number.NaN,
    profile: stretch === null ? null : stretchProfileLaterally(GENERIC_PROFILE, stretch),
  }
}

// ---------------------------------------------------------------------------
// One capture pair through the frozen pipeline
// ---------------------------------------------------------------------------

const plane = (x: number, y: number): Px => [x, -y]

const landmarkPx = (observation: ScanObservation, name: string): Px | null => {
  const found = observation.landmarks.find(landmark => landmark.name === name)
  return found && found.x !== null && found.y !== null ? [found.x, found.y] : null
}

interface Lifted {
  landmarks: readonly (Vec3 | null)[]
  wristA: Px
  wristB: Px
  relative: Mat3
  u: number
  reprojectionRmsPx: number
}

/** The frozen two-view lift on the landmarks alone (no bed in the solve). */
const liftLandmarks = (a: ScanObservation, b: ScanObservation, relative: Mat3): Lifted | null => {
  const result = liftTwoView({ ...a, nails: [] }, { ...b, nails: [] }, { reference: identityView, second: { rotation: relative } }, [FINGER])
  const wa = landmarkPx(a, 'wrist')
  const wb = landmarkPx(b, 'wrist')
  if (!result.canonical || !wa || !wb) return null
  return {
    landmarks: result.canonical.landmarks3d,
    wristA: plane(wa[0], wa[1]),
    wristB: plane(wb[0], wb[1]),
    relative,
    u: result.residuals.viewScaleRatio,
    reprojectionRmsPx: result.residuals.reprojectionRmsPx,
  }
}

/**
 * Lifts one extra correspondence with the depth equation the lift itself
 * uses (nail3dMultiView.ts `solve`), at the scale ratio it already solved.
 * Lets the cuticle be lifted as a probe when no full bed exists (long opaque
 * nails hide the distal edge). Checked against the lift's own bed corners in
 * tests/nail3dStage10Kit.test.ts.
 */
export const liftPoint = (lifted: Pick<Lifted, 'wristA' | 'wristB' | 'relative' | 'u'>, aPx: Px, bPx: Px): Vec3 => {
  const [r00, r01, r02, r10, r11, r12] = lifted.relative
  const a = plane(aPx[0], aPx[1])
  const b = plane(bPx[0], bPx[1])
  const ax = a[0] - lifted.wristA[0]
  const ay = a[1] - lifted.wristA[1]
  const bx = b[0] - lifted.wristB[0]
  const by = b[1] - lifted.wristB[1]
  const mx = r00 * ax + r01 * ay
  const my = r10 * ax + r11 * ay
  const u = lifted.u
  const alpha = (r02 * (bx - u * mx) + r12 * (by - u * my)) / (r02 * r02 + r12 * r12)
  return [lifted.wristA[0] + ax, lifted.wristA[1] + ay, alpha / u]
}

const originIn = (frame: CanonicalHandFrame, cuticleA: Vec3, cuticleB: Vec3): Vec3 =>
  scale(toBasisCoords(midpoint(cuticleA, cuticleB), frame.origin, frame.basis), 1 / frame.scaleReferenceLength)

const manualPoint = (point: Px): ObservedPoint2D => ({ x: point[0], y: point[1], confidence: null, source: 'manual' })

/** Layer A with the pass-1 bed merged in, only when all four corners were marked. */
const withBed = (observation: ScanObservation, annotations: Annotations): ScanObservation | null => {
  const id = observation.captureId
  const corners = (['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB'] as const).map(point =>
    annotations.get(id, 1, point),
  )
  if (corners.some(corner => corner === null)) return null
  const [cuticleA, cuticleB, freeEdgeA, freeEdgeB] = corners as Px[]
  const nail: NailBedAnnotation = {
    finger: FINGER,
    sideAToward: 'thumb',
    points: {
      cuticleSideA: manualPoint(cuticleA),
      cuticleSideB: manualPoint(cuticleB),
      freeEdgeSideA: manualPoint(freeEdgeA),
      freeEdgeSideB: manualPoint(freeEdgeB),
    },
  }
  return { ...observation, nails: [nail], missing: observation.missing.filter(entry => !entry.startsWith('nails')) }
}

/** A counterfactual input, never saved as Layer A: the annotator's PIP/DIP in place of Vision's. */
const withManualJoints = (observation: ScanObservation, annotations: Annotations, pass: 1 | 2): ScanObservation | null => {
  const pip = annotations.get(observation.captureId, pass, 'indexPIP')
  const dip = annotations.get(observation.captureId, pass, 'indexDIP')
  if (!pip || !dip) return null
  return {
    ...observation,
    landmarks: observation.landmarks.map(landmark => {
      if (landmark.name === 'indexPIP') return { ...landmark, x: pip[0], y: pip[1] }
      if (landmark.name === 'indexDIP') return { ...landmark, x: dip[0], y: dip[1] }
      return landmark
    }),
  }
}

type OriginVariant =
  | 'base'
  | 'cuticlePass2'
  | 'rigPose'
  | 'manualJoints'
  | 'manualJointsPass2'
  | 'rigManualJoints'
  | 'rigManualJointsPass2'

export interface PairOutcome {
  session: string
  nailSet: NailSetId
  shot: number
  pose: { accepted: boolean; refusedReason?: string; rotation: Mat3 | null; mismatchPx: number }
  /** The landmark lift ran at the estimated pose. */
  lifted: boolean
  /** Pass-1 cuticle marked in both views: the origin probe exists. */
  cuticleMarked: boolean
  /** Which frames the lifted landmarks could build (independent of the cuticle). */
  framesBuilt: Partial<Record<Stage10Frame, boolean>>
  /** Socket origin from the cuticle probe, in frame units (proximal phalanx). */
  origins: Partial<Record<OriginVariant, Partial<Record<Stage10Frame, Vec3>>>>
  /** Angle between the F3d and F3dNoTip finger axes: DIP flexion against the calibrated posture, or TIP drift. */
  axisGapDeg: number | null
  /** Full socket, when all four bed corners were marked in both views (N0 in practice). */
  sockets: Partial<Record<Stage10Frame, SocketObservation>>
  liftResidualPx: number
  notes: string[]
}

const framesOf = (lifted: Lifted, profile: HandProfile3D) => {
  const frames: Partial<Record<Stage10Frame, CanonicalHandFrame>> = {}
  for (const method of STAGE10_FRAMES) {
    const built = buildFrame(method, lifted.landmarks, FINGER, profile)
    if (built) frames[method] = built.frame
  }
  return frames
}

const probeOrigins = (
  lifted: Lifted,
  profile: HandProfile3D,
  cuticle: { a: [Px, Px]; b: [Px, Px] } | null,
): Partial<Record<Stage10Frame, Vec3>> => {
  if (!cuticle) return {}
  const frames = framesOf(lifted, profile)
  const cuticleA = liftPoint(lifted, cuticle.a[0], cuticle.b[0])
  const cuticleB = liftPoint(lifted, cuticle.a[1], cuticle.b[1])
  const out: Partial<Record<Stage10Frame, Vec3>> = {}
  for (const method of STAGE10_FRAMES) {
    const frame = frames[method]
    if (frame) out[method] = originIn(frame, cuticleA, cuticleB)
  }
  return out
}

const cuticleOf = (annotations: Annotations, idA: string, idB: string, pass: 1 | 2) => {
  const a = [annotations.get(idA, pass, 'cuticleSideA'), annotations.get(idA, pass, 'cuticleSideB')]
  const b = [annotations.get(idB, pass, 'cuticleSideA'), annotations.get(idB, pass, 'cuticleSideB')]
  if ([...a, ...b].some(point => point === null)) return null
  return { a: a as [Px, Px], b: b as [Px, Px] }
}

interface PairInput {
  session: string
  nailSet: NailSetId
  shot: number
  a: ScanObservation
  b: ScanObservation
}

const estimatePose = (profile: HandProfile3D, pair: PairInput) =>
  estimateRelativeRotationWithProfile(profile, pair.a, pair.b, { set: 'palmRigid' })

/**
 * One annotated capture pair through the frozen pipeline, plus the
 * counterfactual inputs the Q5 attribution needs. `rigRotation` is the mean
 * relative rotation over all sessions: the stand marks fix the true one, so
 * using it removes the pose estimate's own scatter.
 */
const processPair = (
  pair: PairInput,
  profile: HandProfile3D,
  annotations: Annotations,
  rigRotation: Mat3 | null,
): PairOutcome => {
  const notes: string[] = []
  const estimate = estimatePose(profile, pair)
  const outcome: PairOutcome = {
    session: pair.session,
    nailSet: pair.nailSet,
    shot: pair.shot,
    pose: {
      accepted: estimate.rotation !== null,
      refusedReason: estimate.refusedReason,
      rotation: estimate.rotation,
      mismatchPx: estimate.profileMismatchRmsPx,
    },
    lifted: false,
    cuticleMarked: false,
    framesBuilt: {},
    origins: {},
    axisGapDeg: null,
    sockets: {},
    liftResidualPx: Number.NaN,
    notes,
  }
  if (!estimate.rotation) {
    notes.push(`pose refused: ${estimate.refusedReason ?? 'unknown'}`)
    return outcome
  }

  const idA = pair.a.captureId
  const idB = pair.b.captureId
  const lifted = liftLandmarks(pair.a, pair.b, estimate.rotation)
  if (!lifted) {
    notes.push('lift refused')
    return outcome
  }
  outcome.lifted = true
  outcome.liftResidualPx = lifted.reprojectionRmsPx

  const cuticle1 = cuticleOf(annotations, idA, idB, 1)
  const cuticle2 = cuticleOf(annotations, idA, idB, 2)
  outcome.cuticleMarked = cuticle1 !== null
  if (!cuticle1) notes.push('cuticle not marked in both views')
  outcome.origins.base = probeOrigins(lifted, profile, cuticle1)
  if (cuticle2) outcome.origins.cuticlePass2 = probeOrigins(lifted, profile, cuticle2)
  if (rigRotation) {
    const rig = liftLandmarks(pair.a, pair.b, rigRotation)
    if (rig) outcome.origins.rigPose = probeOrigins(rig, profile, cuticle1)
  }
  for (const pass of [1, 2] as const) {
    const a = withManualJoints(pair.a, annotations, pass)
    const b = withManualJoints(pair.b, annotations, pass)
    if (!a || !b) continue
    const swapped = liftLandmarks(a, b, estimate.rotation)
    if (swapped) outcome.origins[pass === 1 ? 'manualJoints' : 'manualJointsPass2'] = probeOrigins(swapped, profile, cuticle1)
    const both = rigRotation ? liftLandmarks(a, b, rigRotation) : null
    if (both) outcome.origins[pass === 1 ? 'rigManualJoints' : 'rigManualJointsPass2'] = probeOrigins(both, profile, cuticle1)
  }

  const frames = framesOf(lifted, profile)
  if (frames.F3d && frames.F3dNoTip) outcome.axisGapDeg = angleDeg(frames.F3d.basis.y, frames.F3dNoTip.basis.y)
  for (const method of STAGE10_FRAMES) {
    outcome.framesBuilt[method] = Boolean(frames[method])
    if (!frames[method]) notes.push(`${method} refused`)
  }

  // The full socket, through the frozen lift WITH the bed in the solve.
  const bedA = withBed(pair.a, annotations)
  const bedB = withBed(pair.b, annotations)
  if (bedA && bedB) {
    const full = liftTwoView(bedA, bedB, { reference: identityView, second: { rotation: estimate.rotation } }, [FINGER])
    const bed = full.canonical?.beds.find(entry => entry.finger === FINGER)
    const landmarks = full.canonical?.landmarks3d
    if (bed && landmarks && landmarks.every(point => point !== null)) {
      for (const method of STAGE10_FRAMES) {
        const built = buildFrame(method, landmarks, FINGER, profile)
        const socket = built ? socketInFrame(built.frame, landmarks as Vec3[], bed.quad as NailBedCorners, FINGER) : null
        if (socket) outcome.sockets[method] = socket
      }
    } else notes.push('full socket not computed (bed or a landmark missing after the lift)')
  }
  return outcome
}

// ---------------------------------------------------------------------------
// 2D, per photo: Vision against the annotator on the same photo
// ---------------------------------------------------------------------------

const JOINTS = ['indexPIP', 'indexDIP'] as const
type Joint = (typeof JOINTS)[number]

export interface JointStats {
  joint: Joint
  view: ViewId
  /** Sessions that gave a row, per condition. One photo per session: the session is the unit. */
  rows: Record<NailSetId, number>
  /** Annotated captures that gave no row, with the reason. */
  excluded: string[]
  /** C: mean (Vision − annotator) over N0, along / across the finger, % bed length. A convention offset, not an error. */
  offsetAlong: number
  offsetAcross: number
  /** C: annotator noise per axis, from pass 1 vs pass 2, % bed length. */
  sdAnnotator: number
  /** R: Vision's placement-to-placement scatter per axis, the annotator's share removed, % bed length. */
  sdDetector: number
  /** R: Vision's shot-to-shot scatter on an unmoved hand (shot 1 vs 2), per axis, % bed length. */
  sdShotFloor: number
  /** S: N1 − N0 of (Vision − annotator), along / across the finger, % bed length, with session-level Welch intervals. */
  shiftAlong: WelchDifference
  shiftAcross: WelchDifference
  /** |shift|, % bed length. */
  nailSetShift: number
}

const fingerAxis = (annotations: Annotations, id: string): Px | null => {
  const pip = annotations.get(id, 1, 'indexPIP')
  const dip = annotations.get(id, 1, 'indexDIP')
  if (!pip || !dip) return null
  const length = Math.hypot(dip[0] - pip[0], dip[1] - pip[1])
  return length > 1e-9 ? [(dip[0] - pip[0]) / length, (dip[1] - pip[1]) / length] : null
}

const bedLengthPx = (annotations: Annotations, id: string): number | null => {
  const points = (['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB'] as const).map(point =>
    annotations.get(id, 1, point),
  )
  if (points.some(point => point === null)) return null
  const [ca, cb, fa, fb] = points as Px[]
  return Math.hypot((fa[0] + fb[0] - ca[0] - cb[0]) / 2, (fa[1] + fb[1] - ca[1] - cb[1]) / 2)
}

const jointStatistics = (
  annotated: readonly CaptureName[],
  observations: ReadonlyMap<string, ScanObservation>,
  annotations: Annotations,
  bedLength: Record<ViewId, number>,
): JointStats[] => {
  const out: JointStats[] = []
  for (const view of ['V1', 'V2'] as const) {
    const toPct = 100 / bedLength[view]
    for (const joint of JOINTS) {
      const rows: { nailSet: NailSetId; along: number; across: number }[] = []
      const excluded: string[] = []
      const annotator: number[] = []
      const floor: number[] = []
      for (const capture of annotated.filter(c => c.view === view)) {
        const id = capture.captureId
        const observation = observations.get(id)
        const manual = annotations.get(id, 1, joint)
        const axis = fingerAxis(annotations, id)
        const detected = observation ? landmarkPx(observation, joint) : null
        if (!observation) excluded.push(`${id}: no Layer A`)
        else if (!manual) excluded.push(`${id}: ${joint} not marked (pass 1)`)
        else if (!axis) excluded.push(`${id}: no finger axis (pass-1 indexPIP and indexDIP both needed)`)
        else if (!detected) excluded.push(`${id}: Vision gave no ${joint}`)
        else if (!Number.isFinite(toPct)) excluded.push(`${id}: no ${view} bed length to scale by`)
        if (!observation || !manual || !axis || !detected || !Number.isFinite(toPct)) continue
        const along = (d: Px) => (d[0] * axis[0] + d[1] * axis[1]) * toPct
        const across = (d: Px) => (-d[0] * axis[1] + d[1] * axis[0]) * toPct
        const d: Px = [detected[0] - manual[0], detected[1] - manual[1]]
        rows.push({ nailSet: capture.nailSet, along: along(d), across: across(d) })
        const second = annotations.get(id, 2, joint)
        if (second) annotator.push(((manual[0] - second[0]) ** 2 + (manual[1] - second[1]) ** 2) * toPct ** 2)
        // The second shot of the same placement: no annotation needed, nothing moved.
        const shot2 = observations.get(`${capture.session}-${capture.nailSet}-${view}-2`)
        const detected2 = shot2 ? landmarkPx(shot2, joint) : null
        if (detected2) floor.push(((detected[0] - detected2[0]) ** 2 + (detected[1] - detected2[1]) ** 2) * toPct ** 2)
      }
      const n0 = rows.filter(row => row.nailSet === 'N0')
      const n1 = rows.filter(row => row.nailSet === 'N1')
      // Per-axis variances, each set about its own mean (the nail set may shift it).
      const perAxis = (items: typeof rows) => (variance(items.map(r => r.along)) + variance(items.map(r => r.across))) / 2
      const pooled =
        n0.length > 1 && n1.length > 1
          ? (perAxis(n0) * (n0.length - 1) + perAxis(n1) * (n1.length - 1)) / (n0.length + n1.length - 2)
          : n0.length > 1
            ? perAxis(n0)
            : Number.NaN
      // pass1 − pass2 carries two passes' noise over two axes.
      const annotatorVar = annotator.length ? mean(annotator) / 4 : Number.NaN
      const shiftAlong = welchDifference(n0.map(r => r.along), n1.map(r => r.along))
      const shiftAcross = welchDifference(n0.map(r => r.across), n1.map(r => r.across))
      out.push({
        joint,
        view,
        rows: { N0: n0.length, N1: n1.length },
        excluded,
        offsetAlong: mean(n0.map(r => r.along)),
        offsetAcross: mean(n0.map(r => r.across)),
        sdAnnotator: Math.sqrt(annotatorVar),
        sdDetector: Number.isFinite(pooled) ? Math.sqrt(Math.max(0, pooled - (Number.isFinite(annotatorVar) ? annotatorVar : 0))) : Number.NaN,
        sdShotFloor: floor.length ? Math.sqrt(mean(floor) / 4) : Number.NaN,
        shiftAlong,
        shiftAcross,
        nailSetShift: Math.hypot(shiftAlong.delta, shiftAcross.delta),
      })
    }
  }
  return out
}

export interface TipReach {
  /** Mean distance from the annotator's DIP crease to Vision's TIP, along the finger, % bed length. */
  n0: number
  n1: number
  /** S: N1 − N0, with its session-level Welch interval. */
  shift: WelchDifference
}

/** How far Vision puts the fingertip beyond the DIP crease: TIP needs no annotation of its own. */
const tipReach = (
  annotated: readonly CaptureName[],
  observations: ReadonlyMap<string, ScanObservation>,
  annotations: Annotations,
  bedLength: Record<ViewId, number>,
): Record<ViewId, TipReach> => {
  const out = {} as Record<ViewId, TipReach>
  for (const view of ['V1', 'V2'] as const) {
    const reach: Record<NailSetId, number[]> = { N0: [], N1: [] }
    for (const capture of annotated.filter(c => c.view === view)) {
      const axis = fingerAxis(annotations, capture.captureId)
      const dip = annotations.get(capture.captureId, 1, 'indexDIP')
      const observation = observations.get(capture.captureId)
      const tip = observation ? landmarkPx(observation, 'indexTIP') : null
      if (!axis || !dip || !tip) continue
      reach[capture.nailSet].push((((tip[0] - dip[0]) * axis[0] + (tip[1] - dip[1]) * axis[1]) * 100) / bedLength[view])
    }
    out[view] = { n0: mean(reach.N0), n1: mean(reach.N1), shift: welchDifference(reach.N0, reach.N1) }
  }
  return out
}

// ---------------------------------------------------------------------------
// Protocol: schedule, capture order, the record of the capture
// ---------------------------------------------------------------------------

const sessionIndex = (session: string) => Number(session.slice(1))

/** EXIF "YYYY:MM:DD HH:MM:SS" (vision-dump's capturedAtLocal) or ISO, as a number for ordering; NaN if unreadable. */
export const captureTimeValue = (text: string): number => {
  const exif = /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(text)
  if (exif) {
    const [y, mo, d, h, mi, se] = exif.slice(1).map(Number)
    return Date.UTC(y, mo - 1, d, h, mi, se)
  }
  const parsed = Date.parse(text)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

/** The order the shots of one session are taken in: V1 1, 2 → V2 1, 2 → (Stage 10A) back to V1 for shot 3. */
export const shotOrder = (capture: CaptureName) =>
  capture.view === 'V1' && capture.shot === RETURN_SHOT ? 100 : (capture.view === 'V1' ? 0 : 10) + capture.shot

/** Deviations from the pre-registered protocol. Reported, never silently corrected. */
const protocolChecks = (
  captures: readonly CaptureName[],
  schedule: readonly NailSetId[],
  capturedAt: ReadonlyMap<string, string> | undefined,
): string[] => {
  const notes: string[] = []
  const bySession = new Map<string, CaptureName[]>()
  for (const capture of captures) bySession.set(capture.session, [...(bySession.get(capture.session) ?? []), capture])
  const sessions = [...bySession.keys()].sort((a, b) => sessionIndex(a) - sessionIndex(b))
  for (const session of sessions) {
    const sets = [...new Set(bySession.get(session)!.map(capture => capture.nailSet))]
    const planned = schedule[sessionIndex(session) - 1]
    if (sets.length > 1) notes.push(`${session}: its photos name both N0 and N1`)
    if (!planned) notes.push(`${session}: not one of the ${schedule.length} scheduled sessions`)
    else if (!sets.includes(planned)) notes.push(`${session}: shot as ${sets.join('/')}, the ABBA schedule says ${planned}`)
  }
  schedule.forEach((planned, index) => {
    if (!bySession.has(`S${index + 1}`)) notes.push(`S${index + 1} (${planned}): no photo — the reason belongs in conditions.json deviations`)
  })
  if (!capturedAt) {
    notes.push('no capture times: the order of sessions and shots is unchecked')
    return notes
  }
  const untimed: string[] = []
  const starts: { session: string; start: number }[] = []
  for (const session of sessions) {
    const timed = bySession
      .get(session)!
      .map(capture => ({ capture, t: captureTimeValue(capturedAt.get(capture.captureId) ?? '') }))
    for (const entry of timed) if (!Number.isFinite(entry.t)) untimed.push(entry.capture.captureId)
    const known = timed.filter(entry => Number.isFinite(entry.t)).sort((a, b) => shotOrder(a.capture) - shotOrder(b.capture))
    for (let k = 1; k < known.length; k += 1) {
      if (known[k].t < known[k - 1].t) notes.push(`${session}: ${known[k].capture.captureId} was taken before ${known[k - 1].capture.captureId}`)
    }
    if (known.length) starts.push({ session, start: Math.min(...known.map(entry => entry.t)) })
  }
  for (let k = 1; k < starts.length; k += 1) {
    if (starts[k].start < starts[k - 1].start) notes.push(`${starts[k].session} started before ${starts[k - 1].session}: sessions not shot in schedule order`)
  }
  if (untimed.length) notes.push(`no capture time (EXIF DateTimeOriginal) for ${untimed.length} photo(s): ${untimed.slice(0, 6).join(', ')}${untimed.length > 6 ? ', …' : ''}`)
  return notes
}

const isText = (value: unknown) => typeof value === 'string' && value.trim().length > 0
const isPositive = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value > 0

/**
 * What conditions.json must record for a Stage 10B capture (README §4): both
 * camera endpoints with lens, zoom and camera-to-hand distance and how their
 * position AND orientation are reproduced, how the hand and forearm are
 * supported, and a per-session log. Missing fields are reported, not filled.
 */
export const checkConditions = (conditions: Record<string, unknown> | undefined): string[] => {
  if (!conditions) return ['conditions.json missing: the capture geometry and the session log are unrecorded']
  const problems: string[] = []
  for (const key of ['date', 'hand', 'finger', 'device', 'endpointReproduction', 'handSupport', 'lighting', 'background', 'N0', 'N1']) {
    if (!isText(conditions[key])) problems.push(`conditions.json: ${key} missing`)
  }
  const views = (conditions.views ?? {}) as Record<string, Record<string, unknown> | undefined>
  for (const view of ['V1', 'V2']) {
    const entry = views[view]
    if (!entry) {
      problems.push(`conditions.json: views.${view} missing`)
      continue
    }
    if (!isText(entry.lens)) problems.push(`conditions.json: views.${view}.lens missing`)
    if (!isPositive(entry.zoom)) problems.push(`conditions.json: views.${view}.zoom missing (a number, e.g. 3)`)
    if (!isPositive(entry.distanceCm)) problems.push(`conditions.json: views.${view}.distanceCm missing (camera to hand, cm)`)
    if (!isText(entry.endpoint)) problems.push(`conditions.json: views.${view}.endpoint missing (position and orientation of the camera)`)
  }
  const log = conditions.sessionLog
  if (!Array.isArray(log) || !log.length) problems.push('conditions.json: sessionLog missing (one entry per session: session, nailSet, startedAt, attachment, notes)')
  else {
    for (const [index, entry] of (log as Record<string, unknown>[]).entries()) {
      if (!isText(entry?.session)) problems.push(`conditions.json: sessionLog[${index}].session missing`)
      if (!isText(entry?.startedAt)) problems.push(`conditions.json: sessionLog[${index}].startedAt missing`)
      if (entry?.nailSet === 'N1' && !isText(entry?.attachment)) problems.push(`conditions.json: sessionLog[${index}].attachment missing (how the tip went on, any problem)`)
    }
  }
  if (!Array.isArray(conditions.deviations)) problems.push('conditions.json: deviations missing (an empty list if none)')
  return problems
}

// ---------------------------------------------------------------------------
// The whole analysis
// ---------------------------------------------------------------------------

export interface Stage10Input {
  observations: ReadonlyMap<string, ScanObservation>
  annotations: readonly AnnotationRow[]
  /** EXIF capture time per captureId (vision-dump's capturedAtLocal), to check the protocol order. */
  capturedAt?: ReadonlyMap<string, string>
  /** The pre-registered session order. Default STAGE10_SCHEDULE. */
  schedule?: readonly NailSetId[]
}

/** One session through the pipeline: how far it got, and why it stopped. */
export interface SessionAccount {
  session: string
  /** Condition from the file names, or from the schedule when no photo exists. */
  nailSet: NailSetId
  scheduled: NailSetId | null
  /** Both shot-1 photos (V1, V2) exist as Layer A. */
  available: boolean
  poseAccepted: boolean
  /** A socket origin from the cuticle probe exists in this frame. */
  frames: Record<Stage10Frame, boolean>
  /** F0 AND F3dNoTip both have an origin: the session enters the primary comparison. */
  primaryEligible: boolean
  /** Every Q5 substitution exists for both primary frames: the session enters Q5. */
  q5Matched: boolean
  /** Why the session stopped where it did, in pipeline order. Empty when it reached Q5. */
  excluded: string[]
}

export interface ConditionAccount {
  nailSet: NailSetId
  attempted: number
  available: number
  poseAccepted: number
  frameAccepted: Record<Stage10Frame, number>
  primaryEligible: number
  q5Matched: number
  /** Mean session index of the available sessions: equal for N0 and N1 when the order is time-balanced. */
  meanSessionIndex: number
}

export interface FrameRepeatability {
  frame: Stage10Frame
  /** Sessions used, per condition: the primary set (F0 and F3dNoTip both valid), for F3d / F4 the part of it where they are valid too. */
  sessions: Record<NailSetId, number>
  /** R: origin scatter per nail set (rms distance from that set's mean), % bed length. */
  m1: Record<NailSetId, number>
  /** Both sets, each about its own mean. */
  m1Pooled: number
  /** S: distance between the N0 and N1 mean origins, % bed length. */
  m6: number
  /** The rms of `m6` under no shift, from the M1 scatter. */
  m6Chance: number
  /** Full-socket M0–M4 over the N0 sessions of the set (computeStability), when beds were marked. */
  socket: { m0: number; m1: number; m2: number; m3: number; m4: number } | null
}

/** The pre-registered comparison, on matched sessions only. */
export interface PrimaryComparison {
  /** Sessions where F0 AND F3dNoTip both have an origin: the only ones compared. */
  sessions: Record<NailSetId, string[]>
  /** N0 sessions of that set with a full socket in both frames: the bed-length unit comes from these. */
  unitSessions: string[]
  /** F3dNoTip / F0 pooled M1 on the same sessions. */
  ratio: number
  /** Delete-one-session jackknife of ln(ratio). */
  logRatio: Jackknife
  /** exp of the jackknife 95% interval on ln(ratio). */
  ratioCi95: [number, number]
}

/**
 * Q5 as a reference-substitution SENSITIVITY analysis, on matched sessions
 * (every variant exists for both primary frames in every session used). Each
 * share is the change in origin variance when one input is REPLACED by a
 * reference — the annotator's creases for Vision's DIP/PIP, the rig-mean pose
 * for the per-session estimate, pass 1 vs 2 for the cuticle. A reference has
 * its own convention and error, and the rig-mean pose also absorbs hand motion
 * between the views, camera endpoint error and model inconsistency, so no
 * share is a "true error removed". Not additive, not causal.
 */
export interface ReferenceSubstitution {
  frame: Stage10Frame
  sessions: number
  /** Pooled origin variance (each nail set about its own mean), %² of bed length. */
  total: number
  /** Share of `total` one pass of cuticle annotation noise accounts for (pass 1 vs 2). */
  cuticleNoise: number
  /** Share removed by the rig-mean pose in place of each session's estimate (pose / hand motion / model inconsistency). */
  rigPose: number
  /** Share removed by the annotator's creases in place of Vision's DIP/PIP (the annotator's own noise taken out). */
  creaseJoints: number
  /** Share LEFT with all three substitutions together. */
  remainder: number
}

export interface Stage10Analysis {
  kitVersion: number
  counts: { calibration: number; captures: number; annotatedPairs: number; posesAccepted: number }
  accounting: {
    sessions: SessionAccount[]
    conditions: Record<NailSetId, ConditionAccount>
    /** Photos the 10B analysis does not use, and why. */
    unusedCaptures: string[]
  }
  /** Deviations from the pre-registered protocol (schedule, capture order). */
  protocol: string[]
  calibration: CalibrationResult
  bedLengthPx: Record<ViewId, number>
  joints: JointStats[]
  tipReach: Record<ViewId, TipReach>
  pose: {
    refusalRate: number
    /**
     * R: per-session relative pose about the rig mean, degrees. The stand
     * fixes the camera endpoints, so this is pose-estimator error AND hand
     * motion between the views AND camera endpoint error AND model
     * inconsistency — not separable here.
     */
    acrossSessionsMedianDeg: number
    acrossSessionsP95Deg: number
    /** R: shot 1 vs shot 2 of the same placement, degrees — the estimator's floor. */
    shotFloorMedianDeg: number
    mismatchMedianPx: number
  }
  frames: FrameRepeatability[]
  primary: PrimaryComparison
  /** F3d − F3dNoTip axis gap over N0: DIP flexion against the calibrated posture. */
  axisGap: { sdDeg: number; medianDeg: number; sessions: number }
  substitution: ReferenceSubstitution[]
  pairs: PairOutcome[]
  problems: string[]
}

const Q5_VARIANTS: readonly OriginVariant[] = [
  'base',
  'cuticlePass2',
  'rigPose',
  'manualJoints',
  'manualJointsPass2',
  'rigManualJoints',
  'rigManualJointsPass2',
]

const Q5_MISSING: Record<OriginVariant, string> = {
  base: 'no origin',
  cuticlePass2: 'no pass-2 cuticle',
  rigPose: 'no rig-mean pose lift',
  manualJoints: 'no pass-1 DIP/PIP substitution',
  manualJointsPass2: 'no pass-2 DIP/PIP substitution',
  rigManualJoints: 'no rig-pose + pass-1 DIP/PIP substitution',
  rigManualJointsPass2: 'no rig-pose + pass-2 DIP/PIP substitution',
}

const byCondition = (outcomes: readonly PairOutcome[], sessions: ReadonlySet<string>, set: NailSetId) =>
  outcomes.filter(outcome => sessions.has(outcome.session) && outcome.nailSet === set)

/** The bed-length unit of a frame: the median N0 full-socket bed length over the given sessions. */
const bedUnit = (outcomes: readonly PairOutcome[], frame: Stage10Frame, unitSessions: ReadonlySet<string>) =>
  median(byCondition(outcomes, unitSessions, 'N0').filter(o => o.sockets[frame]).map(o => o.sockets[frame]!.socket.bedLength))

/** Sessions of `sessions` whose N0 full socket exists in both primary frames: one unit set for both. */
const unitSessionsOf = (outcomes: readonly PairOutcome[], sessions: ReadonlySet<string>) =>
  new Set(byCondition(outcomes, sessions, 'N0').filter(o => o.sockets.F0 && o.sockets.F3dNoTip).map(o => o.session))

export const frameRepeatability = (
  outcomes: readonly PairOutcome[],
  frame: Stage10Frame,
  sessions: ReadonlySet<string>,
): FrameRepeatability => {
  const unit = bedUnit(outcomes, frame, unitSessionsOf(outcomes, sessions))
  const toPct = (value: number) => (value / unit) * 100
  const originsOf = (set: NailSetId) =>
    byCondition(outcomes, sessions, set).filter(o => o.origins.base?.[frame]).map(o => o.origins.base![frame]!)
  const n0 = originsOf('N0')
  const n1 = originsOf('N1')
  const pooledSquared =
    n0.length > 1 && n1.length > 1
      ? (spreadSquared(n0) * (n0.length - 1) + spreadSquared(n1) * (n1.length - 1)) / (n0.length + n1.length - 2)
      : spreadSquared(n0)
  const n0Sockets = byCondition(outcomes, sessions, 'N0').filter(o => o.sockets[frame])
  let socket: FrameRepeatability['socket'] = null
  if (n0Sockets.length > 1) {
    const report = computeStability(n0Sockets.map(o => ({ sessionId: o.session, observation: o.sockets[frame]! })))
    if (report) {
      socket = {
        m0: report.m0CanonicalFrame.rms,
        m1: report.m1Origin.rms * 100,
        m2: report.m2Normal.rms,
        m3: report.m3Tangent.rms,
        m4: report.m4Dimensions.bedLengthCv * 100,
      }
    }
  }
  return {
    frame,
    sessions: { N0: n0.length, N1: n1.length },
    m1: {
      N0: n0.length > 1 ? toPct(Math.sqrt(spreadSquared(n0))) : Number.NaN,
      N1: n1.length > 1 ? toPct(Math.sqrt(spreadSquared(n1))) : Number.NaN,
    },
    m1Pooled: toPct(Math.sqrt(pooledSquared)),
    m6: n0.length && n1.length ? toPct(distance(centroid(n0), centroid(n1))) : Number.NaN,
    m6Chance: n0.length && n1.length ? toPct(Math.sqrt(pooledSquared * (1 / n0.length + 1 / n1.length))) : Number.NaN,
    socket,
  }
}

const referenceSubstitution = (
  outcomes: readonly PairOutcome[],
  frame: Stage10Frame,
  sessions: ReadonlySet<string>,
  unitSessions: ReadonlySet<string>,
): ReferenceSubstitution => {
  const unit = bedUnit(outcomes, frame, unitSessions)
  const pct2 = (value: number) => value * (100 / unit) ** 2
  const used = outcomes.filter(o => sessions.has(o.session) && Q5_VARIANTS.every(variant => o.origins[variant]?.[frame]))
  const pooledVariance = (variant: OriginVariant) => {
    let sum = 0
    let count = 0
    let groups = 0
    for (const set of ['N0', 'N1'] as const) {
      const points = used.filter(o => o.nailSet === set).map(o => o.origins[variant]![frame]!)
      if (points.length < 2) continue
      const centre = centroid(points)
      sum += points.reduce((total, point) => total + distance(point, centre) ** 2, 0)
      count += points.length
      groups += 1
    }
    return count > groups ? pct2(sum / (count - groups)) : Number.NaN
  }
  const halfDifference = (x: OriginVariant, y: OriginVariant) => {
    const differences = used.map(o => sub(o.origins[x]![frame]!, o.origins[y]![frame]!))
    return differences.length > 1 ? pct2(spreadSquared(differences) / 2) : Number.NaN
  }
  const total = pooledVariance('base')
  // One pass of annotation noise, independent per photo: additive.
  const cuticle = halfDifference('base', 'cuticlePass2')
  const withoutPose = pooledVariance('rigPose')
  // The annotator's PIP/DIP sit at a different convention (skin crease), but
  // a near-constant one; their own noise is measured by the second pass and taken out.
  const withCreases = pooledVariance('manualJoints') - halfDifference('manualJoints', 'manualJointsPass2')
  const left = pooledVariance('rigManualJoints') - halfDifference('rigManualJoints', 'rigManualJointsPass2') - cuticle
  return {
    frame,
    sessions: used.length,
    total,
    cuticleNoise: cuticle / total,
    rigPose: (total - withoutPose) / total,
    creaseJoints: (total - withCreases) / total,
    remainder: left / total,
  }
}

export const analyzeStage10 = (input: Stage10Input): Stage10Analysis => {
  const problems: string[] = []
  const unusedCaptures: string[] = []
  const annotations = new Annotations(input.annotations)
  const schedule = input.schedule ?? STAGE10_SCHEDULE
  const calibrationFrames = [...input.observations.values()].filter(o => isCalibrationName(o.captureId))
  const captures: CaptureName[] = []
  for (const id of input.observations.keys()) {
    if (isCalibrationName(id)) continue
    const name = parseCaptureName(id)
    if (!name) {
      problems.push(`${id}: not a Stage 10 name (S<n>-<N0|N1>-<V1|V2>-<shot> or CAL-<n>), ignored`)
      unusedCaptures.push(`${id}: not a Stage 10 name`)
      continue
    }
    captures.push(name)
    if (name.shot === RETURN_SHOT && name.view === 'V1') unusedCaptures.push(`${id}: return-to-V1 shot (the Stage 10A transfer check), not part of the 10B analysis`)
    else if (name.shot > 2) unusedCaptures.push(`${id}: shot ${name.shot} is not in the protocol, not used`)
  }
  const annotated = captures.filter(c => c.shot === 1)
  const protocol = protocolChecks(captures, schedule, input.capturedAt)

  const calibration = calibrate(calibrationFrames)
  if (!calibration.profile) problems.push('calibration produced no H1 profile; nothing downstream can run')

  // Bed length in pixels per view, from the N0 photos: the unit of every 2D number.
  const bedLength = {} as Record<ViewId, number>
  for (const view of ['V1', 'V2'] as const) {
    const lengths = annotated
      .filter(c => c.view === view && c.nailSet === 'N0')
      .map(c => bedLengthPx(annotations, c.captureId))
      .filter((value): value is number => value !== null)
    bedLength[view] = median(lengths)
    if (!lengths.length) problems.push(`${view}: no N0 photo has all four bed corners; 2D numbers cannot be scaled`)
  }

  // Sanity: the annotator's DIP and Vision's must be in the same image frame.
  // A rotated annotation (EXIF ignored by the tool) lands far away.
  for (const capture of annotated) {
    const manual = annotations.get(capture.captureId, 1, 'indexDIP')
    const observation = input.observations.get(capture.captureId)
    const detected = observation ? landmarkPx(observation, 'indexDIP') : null
    const unit = bedLength[capture.view]
    if (manual && detected && Number.isFinite(unit) && Math.hypot(manual[0] - detected[0], manual[1] - detected[1]) > unit) {
      problems.push(`${capture.captureId}: annotated DIP is more than a bed length from Vision's — annotated on a rotated image?`)
    }
  }

  // Every session the schedule names or a photo names, accounted for.
  const observedSet = new Map<string, NailSetId>()
  for (const capture of captures) if (!observedSet.has(capture.session)) observedSet.set(capture.session, capture.nailSet)
  const sessionIds = [...new Set([...schedule.map((_, index) => `S${index + 1}`), ...observedSet.keys()])].sort(
    (a, b) => sessionIndex(a) - sessionIndex(b),
  )
  const accounts = new Map<string, SessionAccount>()
  for (const session of sessionIds) {
    const scheduled = schedule[sessionIndex(session) - 1] ?? null
    accounts.set(session, {
      session,
      nailSet: observedSet.get(session) ?? scheduled ?? 'N0',
      scheduled,
      available: false,
      poseAccepted: false,
      frames: { F0: false, F3dNoTip: false, F3d: false, F4: false },
      primaryEligible: false,
      q5Matched: false,
      excluded: [],
    })
  }

  const pairs: PairInput[] = []
  for (const account of accounts.values()) {
    const v1 = `${account.session}-${account.nailSet}-V1-1`
    const v2 = `${account.session}-${account.nailSet}-V2-1`
    const a = input.observations.get(v1)
    const b = input.observations.get(v2)
    if (!observedSet.has(account.session)) account.excluded.push('no photo')
    else if (!a || !b) {
      account.excluded.push(`no ${[!a ? v1 : null, !b ? v2 : null].filter(Boolean).join(' / ')}`)
      problems.push(`${account.session}: ${[!a ? v1 : null, !b ? v2 : null].filter(Boolean).join(' and ')} missing, the session cannot be paired`)
    } else {
      account.available = true
      pairs.push({ session: account.session, nailSet: account.nailSet, shot: 1, a, b })
    }
  }
  const floorPairs = captures
    .filter(c => c.view === 'V1' && c.shot === 2)
    .map(c => {
      const a = input.observations.get(c.captureId)
      const partner = `${c.session}-${c.nailSet}-V2-2`
      const b = input.observations.get(partner)
      if (!a || !b) problems.push(`${c.captureId}: no ${partner}, so the pose floor (shot 1 vs 2) skips ${c.session}`)
      return a && b ? { session: c.session, nailSet: c.nailSet, shot: 2, a, b } : null
    })
    .filter((p): p is PairInput => p !== null)

  const profile = calibration.profile
  // The rig: one stand, two marked endpoints, so one relative rotation when nothing moves.
  const estimates = profile ? pairs.map(pair => estimatePose(profile, pair)) : []
  const acceptedRotations = estimates.map(e => e.rotation).filter((r): r is Mat3 => r !== null)
  const rigRotation = acceptedRotations.length ? meanRotation(acceptedRotations) : null
  const outcomes = profile ? pairs.map(pair => processPair(pair, profile, annotations, rigRotation)) : []
  if (!profile) for (const pair of pairs) accounts.get(pair.session)!.excluded.push('no H1 profile (calibration)')

  for (const outcome of outcomes) {
    const account = accounts.get(outcome.session)!
    account.poseAccepted = outcome.pose.accepted
    for (const frame of STAGE10_FRAMES) account.frames[frame] = Boolean(outcome.origins.base?.[frame])
    account.primaryEligible = PRIMARY_FRAMES.every(frame => account.frames[frame])
    account.q5Matched =
      account.primaryEligible && PRIMARY_FRAMES.every(frame => Q5_VARIANTS.every(variant => outcome.origins[variant]?.[frame]))
    if (!outcome.pose.accepted) account.excluded.push(`pose refused (${outcome.pose.refusedReason ?? 'unknown'})`)
    else if (!outcome.lifted) account.excluded.push('lift refused')
    else {
      if (!outcome.cuticleMarked) account.excluded.push('cuticle not marked in both views (pass 1): no origin probe')
      for (const frame of PRIMARY_FRAMES) if (!outcome.framesBuilt[frame]) account.excluded.push(`${frame} refused`)
      if (account.primaryEligible && !account.q5Matched) {
        const missing = Q5_VARIANTS.filter(variant => PRIMARY_FRAMES.some(frame => !outcome.origins[variant]?.[frame]))
        account.excluded.push(`not in Q5: ${missing.map(variant => Q5_MISSING[variant]).join(', ')}`)
      }
    }
  }

  const accepted = outcomes.filter(o => o.pose.rotation)
  const shotFloor: number[] = []
  if (profile) {
    for (const floorPair of floorPairs) {
      const first = outcomes.find(o => o.session === floorPair.session)?.pose.rotation
      const second = estimatePose(profile, floorPair).rotation
      if (first && second) shotFloor.push(rotationAngleDeg(first, second))
    }
  }
  const pose = {
    refusalRate: pairs.length ? 1 - accepted.length / pairs.length : Number.NaN,
    acrossSessionsMedianDeg: rigRotation ? median(accepted.map(o => rotationAngleDeg(o.pose.rotation!, rigRotation))) : Number.NaN,
    acrossSessionsP95Deg: rigRotation ? percentile95(accepted.map(o => rotationAngleDeg(o.pose.rotation!, rigRotation))) : Number.NaN,
    shotFloorMedianDeg: median(shotFloor),
    mismatchMedianPx: median(outcomes.map(o => o.pose.mismatchPx)),
  }

  // The primary comparison: matched sessions only.
  const primarySessions = new Set([...accounts.values()].filter(a => a.primaryEligible).map(a => a.session))
  const q5Sessions = new Set([...accounts.values()].filter(a => a.q5Matched).map(a => a.session))
  const frames = STAGE10_FRAMES.map(frame => frameRepeatability(outcomes, frame, primarySessions))
  const ratioOn = (subset: readonly string[]) => {
    const set = new Set(subset)
    return frameRepeatability(outcomes, 'F3dNoTip', set).m1Pooled / frameRepeatability(outcomes, 'F0', set).m1Pooled
  }
  const primaryList = [...primarySessions].sort((a, b) => sessionIndex(a) - sessionIndex(b))
  const logRatio = jackknife(primaryList, subset => Math.log(ratioOn(subset)))
  const primary: PrimaryComparison = {
    sessions: {
      N0: primaryList.filter(session => accounts.get(session)!.nailSet === 'N0'),
      N1: primaryList.filter(session => accounts.get(session)!.nailSet === 'N1'),
    },
    unitSessions: [...unitSessionsOf(outcomes, primarySessions)].sort((a, b) => sessionIndex(a) - sessionIndex(b)),
    ratio: ratioOn(primaryList),
    logRatio,
    ratioCi95: [Math.exp(logRatio.ci95[0]), Math.exp(logRatio.ci95[1])],
  }
  if (!primary.unitSessions.length && primaryList.length) problems.push('no N0 session of the primary set has a full socket in both frames: no bed-length unit for the 3D numbers')

  const q5Units = unitSessionsOf(outcomes, q5Sessions)
  const substitution = STAGE10_FRAMES.map(frame => referenceSubstitution(outcomes, frame, q5Sessions, q5Units))

  const gaps = outcomes.filter(o => o.nailSet === 'N0' && o.axisGapDeg !== null).map(o => o.axisGapDeg!)

  const condition = (set: NailSetId): ConditionAccount => {
    const list = [...accounts.values()].filter(a => a.nailSet === set)
    const available = list.filter(a => a.available)
    return {
      nailSet: set,
      attempted: list.length,
      available: available.length,
      poseAccepted: list.filter(a => a.poseAccepted).length,
      frameAccepted: Object.fromEntries(STAGE10_FRAMES.map(frame => [frame, list.filter(a => a.frames[frame]).length])) as Record<Stage10Frame, number>,
      primaryEligible: list.filter(a => a.primaryEligible).length,
      q5Matched: list.filter(a => a.q5Matched).length,
      meanSessionIndex: mean(available.map(a => sessionIndex(a.session))),
    }
  }

  return {
    kitVersion: STAGE10_KIT_VERSION,
    counts: {
      calibration: calibrationFrames.length,
      captures: captures.length,
      annotatedPairs: pairs.length,
      posesAccepted: accepted.length,
    },
    accounting: {
      sessions: [...accounts.values()],
      conditions: { N0: condition('N0'), N1: condition('N1') },
      unusedCaptures,
    },
    protocol,
    calibration,
    bedLengthPx: bedLength,
    joints: jointStatistics(annotated, input.observations, annotations, bedLength),
    tipReach: tipReach(annotated, input.observations, annotations, bedLength),
    pose,
    frames,
    primary,
    axisGap: { sdDeg: Math.sqrt(variance(gaps)), medianDeg: median(gaps), sessions: gaps.length },
    substitution,
    pairs: outcomes,
    problems,
  }
}
