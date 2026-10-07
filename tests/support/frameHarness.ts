// Stage 9 — one daily scan, every canonical-frame method evaluated on it.
//
// Each method is judged against ITS OWN definition applied to the true hand,
// with the same profile it would have on a daily scan: the frames anchor in
// different places, so the same nail has different coordinates in each, and
// only a like-for-like reference is fair. For F0 that reference is exactly the
// anatomical truth Stages 7 and 8 used.
//
// The truth lives in world coordinates and the estimate in the lift's
// (reference-view pixels, Y up, depth from the wrist). The synthetic camera is
// known, so the true hand is carried into lift coordinates by that camera's
// similarity before any method runs on it. No method ever sees the truth.

import type { Finger } from '../../src/lib/nail3dContract.ts'
import { buildFrame, frameError } from '../../src/lib/nail3dCanonicalFrames.ts'
import type { FrameError, FrameMethod, FrameResult } from '../../src/lib/nail3dCanonicalFrames.ts'
import { liftTwoView } from '../../src/lib/nail3dMultiView.ts'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { estimateRelativeRotationWithProfile } from '../../src/lib/nail3dProfilePose.ts'
import type { HandProfile3D } from '../../src/lib/nail3dProfilePose.ts'
import {
  normalAngleDeg,
  originOffsetRatio,
  socketInFrame,
  tangentAngleDeg,
} from '../../src/lib/nail3dSocket.ts'
import type { NailBedCorners, SocketObservation } from '../../src/lib/nail3dSocket.ts'
import { add, applyMat3, multiplyMat3, scale as vscale, sub, transposeMat3 } from '../../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../../src/lib/vec3.ts'
import { applyBedErrors } from './bedAnnotation.ts'
import type { BedError } from './bedAnnotation.ts'
import { syntheticHand } from './syntheticHand.ts'
import type { SyntheticHand, SyntheticOptions } from './syntheticHand.ts'
import {
  cameraPosition,
  jitterObservation,
  lookAtRotation,
  projectToObservation,
  truthBed,
} from './syntheticProjection.ts'
import type { CameraSetup } from './syntheticProjection.ts'

const REFERENCE_CAMERA: CameraSetup = {
  scale: 900,
  principalPoint: [1512, 2016],
  imageWidth: 3024,
  imageHeight: 4032,
}
const SECOND_CAMERA: CameraSetup = {
  scale: 1150,
  principalPoint: [1400, 1900],
  imageWidth: 3000,
  imageHeight: 4000,
}

const FINGER: Finger = 'index'

export interface FrameScanOptions {
  pose: 'truth' | 'h1PalmRigid'
  /** The Personal HandProfile available on the day: used by the pose and by F1/F3. */
  profile: HandProfile3D
  separationDeg?: number
  landmarkNoisePx?: number
  /** Restrict the landmark noise to these names. */
  noisyLandmarks?: readonly string[]
  /** Random error on the four required bed points. */
  bedNoisePx?: number
  /** Wrist landmark displaced along the palm in BOTH views (Stage 7's hazard). */
  wristShift?: number
  /** A landmark placed consistently off in both views, in each view's pixels. */
  landmarkBias?: { names: readonly string[]; px: [number, number] }
  /** Finger flexion on the day, relative to the profile, degrees per joint. */
  articulationDeg?: number
  freeEdgeFraction?: number
  tipFollowsNail?: 'axial' | 'dorsalTip'
  seedA?: number
  seedB?: number
}

export interface MethodOutcome {
  socket: SocketObservation
  truth: SocketObservation
  /** The lifted scan and the true hand in lift coordinates, for diagnostics. */
  lifted: { landmarks: readonly Vec3[]; bed: NailBedCorners }
  trueLift: { landmarks: readonly Vec3[]; bed: NailBedCorners }
  commonShift: Vec3
  frame: FrameResult
  truthFrame: FrameResult
  frameError: FrameError
  originPct: number
  normalDeg: number
  tangentDeg: number
  bedWidthPct: number
  bedLengthPct: number
}

const parse = (observation: ScanObservation): ScanObservation => {
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  if (!parsed.ok) throw new Error(parsed.errors.join('; '))
  return parsed.value
}

const centroid = (hand: SyntheticHand): Vec3 =>
  vscale(hand.landmarks.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / 21)

const ALL_FINGERS: readonly Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky']

const shiftLandmarks = (
  observation: ScanObservation,
  names: readonly string[],
  [dx, dy]: [number, number],
): ScanObservation => ({
  ...observation,
  landmarks: observation.landmarks.map(landmark =>
    names.includes(landmark.name) && landmark.x !== null && landmark.y !== null
      ? { ...landmark, x: landmark.x + dx, y: landmark.y + dy }
      : landmark,
  ),
})

export const frameScan = (
  geometry: SyntheticOptions,
  options: FrameScanOptions,
  methods: readonly FrameMethod[],
): Map<FrameMethod, MethodOutcome> | null => {
  const pose = { rotationAxis: [1, 0, 0] as Vec3, rotationDeg: 35 }
  const articulation = options.articulationDeg
    ? { articulationDeg: Object.fromEntries(ALL_FINGERS.map(finger => [finger, options.articulationDeg])) }
    : {}
  // The hand as it really is, and the hand as the detector reports it. They
  // differ only by landmark effects (wrist placement, a tip that follows the
  // nail); the truth never carries those.
  const truthHand = syntheticHand({ ...geometry, pose, ...articulation, freeEdgeFraction: options.freeEdgeFraction })
  const observedHand = syntheticHand({
    ...geometry,
    pose,
    ...articulation,
    freeEdgeFraction: options.freeEdgeFraction,
    wristShift: options.wristShift,
    tipFollowsNail: options.tipFollowsNail,
  })

  const target = centroid(truthHand)
  const separation = options.separationDeg ?? 40
  const referenceView = lookAtRotation(cameraPosition(3, 0, 0, target), target)
  const secondView = lookAtRotation(cameraPosition(3, separation * 0.875, separation * 0.5, target), target)
  const truthRelative = multiplyMat3(secondView, transposeMat3(referenceView))

  let a = projectToObservation(observedHand, { camera: REFERENCE_CAMERA, view: referenceView })
  let b = projectToObservation(observedHand, { camera: SECOND_CAMERA, view: secondView })
  const noise = options.landmarkNoisePx ?? 0
  if (noise) {
    a = jitterObservation(a, { sigmaPx: noise, seed: options.seedA ?? 11, nails: false, landmarkNames: options.noisyLandmarks })
    b = jitterObservation(b, {
      sigmaPx: noise * (SECOND_CAMERA.scale / REFERENCE_CAMERA.scale),
      seed: options.seedB ?? 977,
      nails: false,
      landmarkNames: options.noisyLandmarks,
    })
  }
  if (options.landmarkBias) {
    a = shiftLandmarks(a, options.landmarkBias.names, options.landmarkBias.px)
    b = shiftLandmarks(b, options.landmarkBias.names, options.landmarkBias.px)
  }
  if (options.bedNoisePx) {
    const bedErrors: BedError[] = [
      {
        kind: 'random',
        points: ['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB'],
        axis: 'both',
        px: options.bedNoisePx,
        seed: (options.seedA ?? 11) + 7,
      },
    ]
    ;[a, b] = applyBedErrors(a, b, bedErrors)
  }
  a = parse(a)
  b = parse(b)

  let relative: Mat3 = truthRelative
  if (options.pose === 'h1PalmRigid') {
    const estimate = estimateRelativeRotationWithProfile(options.profile, a, b, { set: 'palmRigid' })
    const fit = estimate.rotation ?? estimate.discardedRotation
    if (!fit) return null
    relative = fit
  }

  const lifted = liftTwoView(
    a,
    b,
    { reference: { rotation: referenceView }, second: { rotation: multiplyMat3(relative, referenceView) } },
    [FINGER],
  )
  const canonical = lifted.canonical
  const bed = canonical?.beds.find(entry => entry.finger === FINGER)
  if (!canonical || !bed || canonical.landmarks3d.some(point => point === null)) return null
  const landmarks = canonical.landmarks3d as Vec3[]

  // The true hand, carried into lift coordinates by the known reference camera.
  const s = REFERENCE_CAMERA.scale
  const [cx, cy] = REFERENCE_CAMERA.principalPoint
  const trueWristDepth = applyMat3(referenceView, truthHand.landmarks[0])[2]
  const toLift = (point: Vec3): Vec3 => {
    const camera = applyMat3(referenceView, point)
    return [cx + s * camera[0], -cy + s * camera[1], s * (camera[2] - trueWristDepth)]
  }
  const trueLandmarks = truthHand.landmarks.map(toLift)
  const trueBed = truthBed(truthHand, FINGER).map(toLift) as unknown as NailBedCorners
  // A translation shared by every lifted point moves frame and bed together.
  const commonShift = vscale(
    landmarks.reduce<Vec3>((sum, point, i) => add(sum, sub(point, trueLandmarks[i])), [0, 0, 0]),
    1 / landmarks.length,
  )

  const outcomes = new Map<FrameMethod, MethodOutcome>()
  for (const method of methods) {
    const frame = buildFrame(method, landmarks, FINGER, options.profile)
    const truthFrame = buildFrame(method, trueLandmarks, FINGER, options.profile)
    if (!frame || !truthFrame) continue
    const socket = socketInFrame(frame.frame, landmarks, bed.quad, FINGER)
    const truth = socketInFrame(truthFrame.frame, trueLandmarks, trueBed, FINGER)
    if (!socket || !truth) continue
    outcomes.set(method, {
      socket,
      truth,
      lifted: { landmarks, bed: bed.quad },
      trueLift: { landmarks: trueLandmarks, bed: trueBed },
      commonShift,
      frame,
      truthFrame,
      frameError: frameError(frame.frame, truthFrame.frame, commonShift),
      originPct: originOffsetRatio(socket.socket, truth.socket) * 100,
      normalDeg: normalAngleDeg(socket.socket, truth.socket) ?? Number.NaN,
      tangentDeg: tangentAngleDeg(socket.socket, truth.socket) ?? Number.NaN,
      bedWidthPct: (socket.socket.bedWidth / truth.socket.bedWidth - 1) * 100,
      bedLengthPct: (socket.socket.bedLength / truth.socket.bedLength - 1) * 100,
    })
  }
  return outcomes
}
