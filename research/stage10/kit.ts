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

export const STAGE10_KIT_VERSION = 1
const FINGER: Finger = 'index'

/** F0 is the product frame; F3dNoTip the Stage 9 candidate; F3d and F4 diagnose TIP and DIP. */
export const STAGE10_FRAMES = ['F0', 'F3dNoTip', 'F3d', 'F4'] as const satisfies readonly FrameMethod[]
export type Stage10Frame = (typeof STAGE10_FRAMES)[number]

// ---------------------------------------------------------------------------
// Names: S<session>-<N0|N1>-<V1|V2>-<shot>, CAL-<n>
// ---------------------------------------------------------------------------

export type NailSetId = 'N0' | 'N1'
export type ViewId = 'V1' | 'V2'

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

const mean = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
const variance = (values: readonly number[]) => {
  if (values.length < 2) return Number.NaN
  const m = mean(values)
  return values.reduce((sum, value) => sum + (value - m) ** 2, 0) / (values.length - 1)
}
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
  outcome.liftResidualPx = lifted.reprojectionRmsPx

  const cuticle1 = cuticleOf(annotations, idA, idB, 1)
  const cuticle2 = cuticleOf(annotations, idA, idB, 2)
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
  for (const method of STAGE10_FRAMES) if (!frames[method]) notes.push(`${method} refused`)

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
  photos: number
  /** C: mean (Vision − annotator), along / across the finger, % bed length. A convention offset, not an error. */
  offsetAlong: number
  offsetAcross: number
  /** C: annotator noise per axis, from pass 1 vs pass 2, % bed length. */
  sdAnnotator: number
  /** R: Vision's placement-to-placement scatter per axis, the annotator's share removed, % bed length. */
  sdDetector: number
  /** R: Vision's shot-to-shot scatter on an unmoved hand (shot 1 vs 2), per axis, % bed length. */
  sdShotFloor: number
  /** S: nail-set shift of (Vision − annotator), N1 − N0, along / across the finger, % bed length. */
  shiftAlong: number
  shiftAcross: number
  /** Their standard errors (each set's own scatter, per axis). */
  shiftAlongSe: number
  shiftAcrossSe: number
  /** |shift| and its chi-square (2 dof) against no shift. */
  nailSetShift: number
  shiftChi2: number
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
      const annotator: number[] = []
      const floor: number[] = []
      for (const capture of annotated.filter(c => c.view === view)) {
        const id = capture.captureId
        const axis = fingerAxis(annotations, id)
        const manual = annotations.get(id, 1, joint)
        const observation = observations.get(id)
        const detected = observation ? landmarkPx(observation, joint) : null
        if (!axis || !manual || !detected) continue
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
      if (n0.length < 2) continue
      // Per-axis variances, each set about its own mean (the nail set may shift it).
      const perAxis = (items: typeof rows) => (variance(items.map(r => r.along)) + variance(items.map(r => r.across))) / 2
      const pooled = n1.length > 1 ? (perAxis(n0) * (n0.length - 1) + perAxis(n1) * (n1.length - 1)) / (n0.length + n1.length - 2) : perAxis(n0)
      // pass1 − pass2 carries two passes' noise over two axes.
      const annotatorVar = annotator.length ? mean(annotator) / 4 : Number.NaN
      const component = (key: 'along' | 'across') => {
        if (n1.length < 2) return { delta: Number.NaN, se: Number.NaN }
        const a = n0.map(r => r[key])
        const b = n1.map(r => r[key])
        return { delta: mean(b) - mean(a), se: Math.sqrt(variance(a) / a.length + variance(b) / b.length) }
      }
      const along = component('along')
      const across = component('across')
      out.push({
        joint,
        view,
        photos: rows.length,
        offsetAlong: mean(n0.map(r => r.along)),
        offsetAcross: mean(n0.map(r => r.across)),
        sdAnnotator: Math.sqrt(annotatorVar),
        sdDetector: Math.sqrt(Math.max(0, pooled - (Number.isFinite(annotatorVar) ? annotatorVar : 0))),
        sdShotFloor: floor.length ? Math.sqrt(mean(floor) / 4) : Number.NaN,
        shiftAlong: along.delta,
        shiftAcross: across.delta,
        shiftAlongSe: along.se,
        shiftAcrossSe: across.se,
        nailSetShift: Math.hypot(along.delta, across.delta),
        shiftChi2: (along.delta / along.se) ** 2 + (across.delta / across.se) ** 2,
      })
    }
  }
  return out
}

export interface TipReach {
  /** Mean distance from the annotator's DIP crease to Vision's TIP, along the finger, % bed length. */
  n0: number
  n1: number
  /** S: N1 − N0, and its standard error. */
  shift: number
  shiftSe: number
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
    out[view] = {
      n0: mean(reach.N0),
      n1: mean(reach.N1),
      shift: mean(reach.N1) - mean(reach.N0),
      shiftSe: Math.sqrt(variance(reach.N0) / reach.N0.length + variance(reach.N1) / reach.N1.length),
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// The whole analysis
// ---------------------------------------------------------------------------

export interface Stage10Input {
  observations: ReadonlyMap<string, ScanObservation>
  annotations: readonly AnnotationRow[]
}

export interface FrameRepeatability {
  frame: Stage10Frame
  /** R: origin scatter per nail set (rms distance from that set's mean), % bed length. */
  m1: Record<NailSetId, number>
  /** Both sets, each about its own mean. */
  m1Pooled: number
  /** S: distance between the N0 and N1 mean origins, % bed length. */
  m6: number
  /** What `m6` would be by chance alone, from the M1 scatter. */
  m6Chance: number
  /** Full-socket M0–M4 over the N0 captures (computeStability), when beds were marked. */
  socket: { m0: number; m1: number; m2: number; m3: number; m4: number } | null
}

/**
 * Q5, as counterfactuals on the same captures: by how much the origin
 * variance would fall if one input were noise-free. Not additive shares — the
 * palm points feed both the pose and the palm fit, so their effects partly
 * cancel, and a share table would double-count them.
 */
export interface Attribution {
  frame: Stage10Frame
  captures: number
  /** Pooled origin variance (each nail set about its own mean), %² of bed length. */
  total: number
  /** Fraction of `total` removed by a noise-free cuticle annotation. */
  cuticleAnnotation: number
  /** ... by the true relative pose (the rig mean) in place of each estimate. */
  pose: number
  /** ... by DIP/PIP as repeatable as nothing at all (the annotator's points, their own noise taken out). */
  pipDipDetector: number
  /** Fraction of `total` LEFT with all three removed together: palm landmarks, posture, lift, perspective. */
  remainder: number
}

export interface Stage10Analysis {
  kitVersion: number
  counts: { calibration: number; captures: number; annotatedPairs: number; posesAccepted: number }
  calibration: CalibrationResult
  bedLengthPx: Record<ViewId, number>
  joints: JointStats[]
  tipReach: Record<ViewId, TipReach>
  pose: {
    refusalRate: number
    /** R: rotation scatter across sessions about the rig mean (the stand fixes the true one), degrees. */
    acrossSessionsMedianDeg: number
    acrossSessionsP95Deg: number
    /** R: shot 1 vs shot 2 of the same placement, degrees — the estimator's floor. */
    shotFloorMedianDeg: number
    mismatchMedianPx: number
  }
  frames: FrameRepeatability[]
  /** F3d − F3dNoTip axis gap over N0: DIP flexion against the calibrated posture. */
  axisGap: { sdDeg: number; medianDeg: number }
  attribution: Attribution[]
  pairs: PairOutcome[]
  problems: string[]
}

export const analyzeStage10 = (input: Stage10Input): Stage10Analysis => {
  const problems: string[] = []
  const annotations = new Annotations(input.annotations)
  const calibrationFrames = [...input.observations.values()].filter(o => isCalibrationName(o.captureId))
  const captures: CaptureName[] = []
  for (const id of input.observations.keys()) {
    if (isCalibrationName(id)) continue
    const name = parseCaptureName(id)
    if (name) captures.push(name)
    else problems.push(`${id}: not a Stage 10 name (S<n>-<N0|N1>-<V1|V2>-<shot> or CAL-<n>), ignored`)
  }
  const annotated = captures.filter(c => c.shot === 1)

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

  const pairOf = (capture: CaptureName): PairInput | null => {
    const partnerId = `${capture.session}-${capture.nailSet}-V2-${capture.shot}`
    const a = input.observations.get(capture.captureId)
    const b = input.observations.get(partnerId)
    if (!a || !b) {
      problems.push(`${capture.captureId}: no ${partnerId} to pair with`)
      return null
    }
    return { session: capture.session, nailSet: capture.nailSet, shot: capture.shot, a, b }
  }
  const pairs = annotated.filter(c => c.view === 'V1').map(pairOf).filter((p): p is PairInput => p !== null)
  const floorPairs = captures
    .filter(c => c.view === 'V1' && c.shot === 2)
    .map(pairOf)
    .filter((p): p is PairInput => p !== null)

  const profile = calibration.profile
  // The rig: one stand, two marked positions, so one true relative rotation.
  const estimates = profile ? pairs.map(pair => estimatePose(profile, pair)) : []
  const acceptedRotations = estimates.map(e => e.rotation).filter((r): r is Mat3 => r !== null)
  const rigRotation = acceptedRotations.length ? meanRotation(acceptedRotations) : null
  const outcomes = profile ? pairs.map(pair => processPair(pair, profile, annotations, rigRotation)) : []

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

  const frames: FrameRepeatability[] = []
  const attribution: Attribution[] = []
  for (const frame of STAGE10_FRAMES) {
    const n0Sockets = outcomes.filter(o => o.nailSet === 'N0' && o.sockets[frame])
    // The unit: the N0 bed length expressed in this frame's own units.
    const bedRef = median(n0Sockets.map(o => o.sockets[frame]!.socket.bedLength))
    const toPct = (value: number) => (value / bedRef) * 100
    const originsOf = (set: NailSetId) =>
      outcomes.filter(o => o.nailSet === set && o.origins.base?.[frame]).map(o => o.origins.base![frame]!)
    const n0 = originsOf('N0')
    const n1 = originsOf('N1')
    const m1 = {
      N0: n0.length > 1 ? toPct(Math.sqrt(spreadSquared(n0))) : Number.NaN,
      N1: n1.length > 1 ? toPct(Math.sqrt(spreadSquared(n1))) : Number.NaN,
    }
    const pooledSquared =
      n0.length > 1 && n1.length > 1
        ? (spreadSquared(n0) * (n0.length - 1) + spreadSquared(n1) * (n1.length - 1)) / (n0.length + n1.length - 2)
        : spreadSquared(n0)
    const m6 = n0.length && n1.length ? toPct(distance(centroid(n0), centroid(n1))) : Number.NaN
    const m6Chance = n0.length && n1.length ? toPct(Math.sqrt(pooledSquared * (1 / n0.length + 1 / n1.length))) : Number.NaN

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
    frames.push({ frame, m1, m1Pooled: toPct(Math.sqrt(pooledSquared)), m6, m6Chance, socket })

    // Q5 — counterfactuals on the same captures. Each nail set is centred on
    // its own mean first, so a nail-set shift is not counted as scatter.
    const pct2 = (value: number) => value * (100 / bedRef) ** 2
    const pooledVariance = (variant: OriginVariant) => {
      let sum = 0
      let count = 0
      let groups = 0
      for (const set of ['N0', 'N1'] as const) {
        const points = outcomes.filter(o => o.nailSet === set && o.origins[variant]?.[frame]).map(o => o.origins[variant]![frame]!)
        if (points.length < 2) continue
        const centre = centroid(points)
        sum += points.reduce((total, point) => total + distance(point, centre) ** 2, 0)
        count += points.length
        groups += 1
      }
      return count > groups ? pct2(sum / (count - groups)) : Number.NaN
    }
    const halfDifference = (x: OriginVariant, y: OriginVariant) => {
      const differences = outcomes
        .filter(o => o.origins[x]?.[frame] && o.origins[y]?.[frame])
        .map(o => sub(o.origins[x]![frame]!, o.origins[y]![frame]!))
      return differences.length > 1 ? pct2(spreadSquared(differences) / 2) : Number.NaN
    }
    const total = pooledVariance('base')
    // One pass of annotation noise, independent per photo: additive.
    const cuticle = halfDifference('base', 'cuticlePass2')
    const withoutPose = pooledVariance('rigPose')
    // The annotator's PIP/DIP sit at a different convention (skin crease), but
    // a constant one; their own noise is measured by the second pass and taken out.
    const withoutJoints = pooledVariance('manualJoints') - halfDifference('manualJoints', 'manualJointsPass2')
    const left = pooledVariance('rigManualJoints') - halfDifference('rigManualJoints', 'rigManualJointsPass2') - cuticle
    attribution.push({
      frame,
      captures: outcomes.filter(o => o.origins.base?.[frame]).length,
      total,
      cuticleAnnotation: cuticle / total,
      pose: (total - withoutPose) / total,
      pipDipDetector: (total - withoutJoints) / total,
      remainder: left / total,
    })
  }

  const gaps = outcomes.filter(o => o.nailSet === 'N0' && o.axisGapDeg !== null).map(o => o.axisGapDeg!)

  return {
    kitVersion: STAGE10_KIT_VERSION,
    counts: {
      calibration: calibrationFrames.length,
      captures: captures.length,
      annotatedPairs: pairs.length,
      posesAccepted: accepted.length,
    },
    calibration,
    bedLengthPx: bedLength,
    joints: jointStatistics(annotated, input.observations, annotations, bedLength),
    tipReach: tipReach(annotated, input.observations, annotations, bedLength),
    pose,
    frames,
    axisGap: { sdDeg: Math.sqrt(variance(gaps)), medianDeg: median(gaps) },
    attribution,
    pairs: outcomes,
    problems,
  }
}
