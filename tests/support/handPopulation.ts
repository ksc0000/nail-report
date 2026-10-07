// A small population of synthetic hands, for checking that a calibration rule
// holds across hand shapes rather than for one convenient hand.
//
// Each person differs from the generic hand along the axes Stage 6 found to
// matter or not matter: palm width and length (aspect ratio), arch depth and
// thickness, finger proportions, and idiosyncratic MCP placement. P1-P3 vary
// the aspect ratio in different ways on purpose — a wide palm and a short
// palm both raise it, and that difference turns out to decide what a
// one-number calibration can and cannot do.

import { estimateRelativeRotationWithProfile, handProfile } from '../../src/lib/nail3dProfilePose.ts'
import type { HandProfile3D } from '../../src/lib/nail3dProfilePose.ts'
import { measurePalmStretch } from '../../src/lib/nail3dHandCalibration.ts'
import { rotationDifference, toRotationVector } from '../../src/lib/nail3dLandmarkPose.ts'
import { liftTwoView } from '../../src/lib/nail3dMultiView.ts'
import { socketObservationsFrom } from '../../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { estimateSocket, originOffsetRatio } from '../../src/lib/nail3dSocket.ts'
import { add, multiplyMat3, normalize, scale as vscale, transposeMat3 } from '../../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../../src/lib/vec3.ts'
import { syntheticHand } from './syntheticHand.ts'
import type { Finger } from '../../src/lib/nail3dContract.ts'
import type { SyntheticHand, SyntheticOptions } from './syntheticHand.ts'
import {
  DEFAULT_CAMERA,
  cameraPosition,
  jitterObservation,
  lookAtRotation,
  projectToObservation,
  truthBed,
} from './syntheticProjection.ts'
import type { CameraSetup } from './syntheticProjection.ts'

/** The hand a generic profile describes. */
export const GENERIC_GEOMETRY: SyntheticOptions = { palmArch: 0.15 }

export const PERSONS: ReadonlyArray<readonly [string, SyntheticOptions]> = [
  ['P1 wide palm', { palmArch: 0.15, palmWidthScale: 1.1 }],
  ['P2 narrow, long palm', { palmArch: 0.15, palmWidthScale: 0.92, palmLengthScale: 1.08 }],
  ['P3 short palm', { palmArch: 0.15, palmLengthScale: 0.9 }],
  ['P4 deep arch, thick', { palmArch: 0.22, depthScale: 1.2 }],
  ['P5 flat, thin', { palmArch: 0.08, depthScale: 0.82 }],
  ['P6 long fingers', { palmArch: 0.15, fingerScale: { thumb: 1.08, index: 1.12, middle: 1.1, ring: 1.12, pinky: 1.06 } }],
  [
    'P7 mixed A',
    {
      palmArch: 0.11,
      palmWidthScale: 1.06,
      palmLengthScale: 0.95,
      depthScale: 1.1,
      fingerScale: { thumb: 0.95, index: 1.04, middle: 0.97, ring: 1.05, pinky: 0.92 },
      mcpJitter: 0.02,
      seed: 5,
    },
  ],
  [
    'P8 mixed B',
    {
      palmArch: 0.19,
      palmWidthScale: 0.9,
      palmLengthScale: 1.05,
      depthScale: 0.9,
      fingerScale: { thumb: 1.06, index: 0.94, middle: 1.03, ring: 0.96, pinky: 1.09 },
      mcpJitter: 0.02,
      seed: 9,
    },
  ],
]

export const profileOf = (geometry: SyntheticOptions): HandProfile3D => {
  const built = handProfile(syntheticHand(geometry).landmarks, 'right')
  if (!built) throw new Error('profile did not build')
  return built
}

export const GENERIC_PROFILE: HandProfile3D = profileOf(GENERIC_GEOMETRY)

const parse = (observation: ScanObservation): ScanObservation => {
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  if (!parsed.ok) throw new Error(parsed.errors.join('; '))
  return parsed.value
}

const ALL_FINGERS: readonly Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky']

/** One calibration frame: the hand held, nominally, face-on to the camera. */
export interface CalibrationFrame {
  /** Rotation about the palm's long axis, in degrees: compresses the width. */
  yawDeg?: number
  /** Rotation about the palm's lateral axis, in degrees: compresses the length. */
  pitchDeg?: number
  jitterPx?: number
  seed?: number
  /** Wrist landmark displacement along the palm, as a fraction of its length. */
  wristShift?: number
  /** Finger flexion, in degrees per joint. */
  flexDeg?: number
  camera?: CameraSetup
  /** Uniform hand size, to check that nothing depends on it. */
  handScale?: number
}

export const calibrationFrame = (
  geometry: SyntheticOptions,
  frame: CalibrationFrame = {},
): ScanObservation => {
  const hand = syntheticHand({
    ...geometry,
    wristShift: frame.wristShift,
    ...(frame.flexDeg
      ? { articulationDeg: Object.fromEntries(ALL_FINGERS.map(finger => [finger, frame.flexDeg])) }
      : {}),
    pose: { rotationAxis: [0, 0, 1], rotationDeg: 0, scale: frame.handScale ?? 1 },
  })
  const yaw = ((frame.yawDeg ?? 0) * Math.PI) / 180
  const pitch = ((frame.pitchDeg ?? 0) * Math.PI) / 180
  const aboutLongAxis: Mat3 = [Math.cos(yaw), 0, Math.sin(yaw), 0, 1, 0, -Math.sin(yaw), 0, Math.cos(yaw)]
  const aboutLateralAxis: Mat3 = [1, 0, 0, 0, Math.cos(pitch), -Math.sin(pitch), 0, Math.sin(pitch), Math.cos(pitch)]
  let observation = projectToObservation(hand, {
    camera: frame.camera ?? DEFAULT_CAMERA,
    view: multiplyMat3(aboutLateralAxis, aboutLongAxis),
  })
  if (frame.jitterPx) observation = jitterObservation(observation, { sigmaPx: frame.jitterPx, seed: frame.seed })
  return parse(observation)
}

/**
 * The lateral stretch that best maps the generic palm onto this person's,
 * read from a perfect face-on frame. The "true" value calibration aims at.
 */
export const trueStretch = (geometry: SyntheticOptions): number => {
  const stretch = measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry), 'palmShapeFit').stretch
  if (stretch === null) throw new Error('true stretch could not be measured')
  return stretch
}

const SECOND_CAMERA: CameraSetup = {
  scale: 1150,
  principalPoint: [1400, 1900],
  imageWidth: 3000,
  imageHeight: 4000,
}

const centroid = (hand: SyntheticHand): Vec3 =>
  vscale(hand.landmarks.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / 21)

export interface DailyScanResult {
  totalDeg: number
  baselineAxisDeg: number
  orthogonalDeg: number
  socketOriginPct: number
  bedWidthPct: number
  bedLengthPct: number
  mismatchPx: number
}

/**
 * A daily two-view scan in the Stage 6 setting — hand pitched 35 degrees,
 * second view on the azimuth-dominant diagonal at 40 degrees, 2 px of
 * annotation noise per view — using `profile` for the pose.
 */
export const dailyScan = (
  geometry: SyntheticOptions,
  profile: HandProfile3D,
  options: { set?: 'all21' | 'palmRigid'; seedA?: number; seedB?: number; jitterPx?: number } = {},
): DailyScanResult | null => {
  const hand = syntheticHand({ ...geometry, pose: { rotationAxis: [1, 0, 0], rotationDeg: 35 } })
  const target = centroid(hand)
  const reference = lookAtRotation(cameraPosition(3, 0, 0, target), target)
  const second = lookAtRotation(cameraPosition(3, 40 * 0.875, 40 * 0.5, target), target)
  const truth = multiplyMat3(second, transposeMat3(reference))
  const jitter = options.jitterPx ?? 2

  let a = projectToObservation(hand, { camera: DEFAULT_CAMERA, view: reference })
  let b = projectToObservation(hand, { camera: SECOND_CAMERA, view: second })
  if (jitter) {
    a = jitterObservation(a, { sigmaPx: jitter, seed: options.seedA ?? 11 })
    b = jitterObservation(b, {
      sigmaPx: jitter * (SECOND_CAMERA.scale / DEFAULT_CAMERA.scale),
      seed: options.seedB ?? 977,
    })
  }
  const first = parse(a)
  const other = parse(b)
  const estimate = estimateRelativeRotationWithProfile(profile, first, other, { set: options.set ?? 'all21' })
  const fit = estimate.rotation ?? estimate.discardedRotation
  if (!fit) return null

  const axis = normalize(toRotationVector(truth)) ?? ([1, 0, 0] as Vec3)
  const error = rotationDifference(truth, fit, axis)
  const lifted = liftTwoView(
    first,
    other,
    { reference: { rotation: reference }, second: { rotation: multiplyMat3(fit, reference) } },
    ['index'],
  )
  const truthSocket = estimateSocket(hand.landmarks, truthBed(hand, 'index'), 'index')
  const socket = lifted.canonical ? socketObservationsFrom(lifted.canonical).get('index') : undefined
  return {
    totalDeg: error.totalDeg,
    baselineAxisDeg: error.baselineAxisDeg,
    orthogonalDeg: error.orthogonalDeg,
    socketOriginPct:
      socket && truthSocket ? Math.abs(originOffsetRatio(socket.socket, truthSocket.socket) * 100) : Number.NaN,
    bedWidthPct:
      socket && truthSocket ? Math.abs(socket.socket.bedWidth / truthSocket.socket.bedWidth - 1) * 100 : Number.NaN,
    bedLengthPct:
      socket && truthSocket ? Math.abs(socket.socket.bedLength / truthSocket.socket.bedLength - 1) * 100 : Number.NaN,
    mismatchPx: estimate.profileMismatchRmsPx,
  }
}

export interface Spread {
  median: number
  p95: number
  worst: number
}

export const spread = (values: readonly number[]): Spread => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (sorted.length === 0) throw new Error('nothing to summarise')
  return {
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
    worst: sorted[sorted.length - 1],
  }
}
