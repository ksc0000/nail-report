// Stage 8 — controlled nail-bed annotation error, and the scan that measures it.
//
// The perturbations act on Layer A observations only: they move pixel
// coordinates of named bed points, exactly as a person or a mask extractor
// placing them wrongly would. Nothing estimated is written back into Layer A.
//
// Error directions are expressed in each view's own NAIL axes rather than raw
// image x/y: `across` runs from side A to side B along the cuticle, `along`
// runs from the cuticle midpoint toward the free-edge midpoint. That is what a
// boundary error means for a mask extractor, and in this synthetic setup the
// two coincide closely with image x and image y respectively.

import type { Finger } from '../../src/lib/nail3dContract.ts'
import { liftTwoView } from '../../src/lib/nail3dMultiView.ts'
import { estimateSocketFused } from '../../src/lib/nail3dBedFusion.ts'
import type { BedFusionOptions } from '../../src/lib/nail3dBedFusion.ts'
import { socketObservationsFrom } from '../../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { ObservedPoint2D, ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { estimateRelativeRotationWithProfile } from '../../src/lib/nail3dProfilePose.ts'
import type { HandProfile3D } from '../../src/lib/nail3dProfilePose.ts'
import { stretchProfileLaterally } from '../../src/lib/nail3dHandCalibration.ts'
import {
  estimateSocket,
  normalAngleDeg,
  originOffsetRatio,
  tangentAngleDeg,
} from '../../src/lib/nail3dSocket.ts'
import type { SocketObservation } from '../../src/lib/nail3dSocket.ts'
import { rotationDifference, toRotationVector } from '../../src/lib/nail3dLandmarkPose.ts'
import { add, multiplyMat3, normalize, scale as vscale, transposeMat3 } from '../../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../../src/lib/vec3.ts'
import { GENERIC_PROFILE, trueStretch } from './handPopulation.ts'
import { gaussianSource, syntheticHand } from './syntheticHand.ts'
import type { SyntheticHand, SyntheticOptions } from './syntheticHand.ts'
import {
  cameraPosition,
  jitterObservation,
  lookAtRotation,
  projectToObservation,
  truthBed,
} from './syntheticProjection.ts'
import type { CameraSetup } from './syntheticProjection.ts'

export const REQUIRED_BED_POINTS = ['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB'] as const
export const OPTIONAL_BED_POINTS = ['cuticleApex', 'bedWallSideA', 'bedWallSideB'] as const
export type BedPointName = (typeof REQUIRED_BED_POINTS)[number] | (typeof OPTIONAL_BED_POINTS)[number]

const SIDE_A: ReadonlySet<BedPointName> = new Set(['cuticleSideA', 'freeEdgeSideA', 'bedWallSideA'])

export type BedErrorKind =
  /** Independent per point and per view. */
  | 'random'
  /** The same offset, in each view's nail axes, in both views. */
  | 'common'
  /** Opposite offsets in the two views: inconsistent between them. */
  | 'viewSpecific'
  /** Side-A points pushed outward, side B left alone, in both views. */
  | 'asymmetric'

export interface BedError {
  kind: BedErrorKind
  points: readonly BedPointName[]
  axis: 'across' | 'along' | 'both'
  /** Sigma for `random`, offset for the systematic kinds, in pixels. */
  px: number
  seed?: number
}

export type BoundaryConfusion =
  /** The distal points placed at the nail tip instead of the bed's distal edge. */
  | { kind: 'distalAtTip'; fractionOfBedLength: number }
  /** The cuticle points placed at a boundary further along the nail, such as the lunula. */
  | { kind: 'cuticleTooDistal'; fractionOfBedLength: number }
  /** Cuticle and free-edge labels exchanged on both sides. */
  | { kind: 'swap' }

interface NailAxes {
  across: [number, number]
  along: [number, number]
  /** Bed length in this view's pixels, from the clean annotation. */
  lengthPx: number
}

const axesOf = (observation: ScanObservation, finger: Finger): NailAxes => {
  const nail = observation.nails.find(entry => entry.finger === finger)
  if (!nail) throw new Error(`no ${finger} annotation`)
  const p = nail.points
  const ca = p.cuticleSideA!
  const cb = p.cuticleSideB!
  const fa = p.freeEdgeSideA!
  const fb = p.freeEdgeSideB!
  const unit = (x: number, y: number): [number, number] => {
    const n = Math.hypot(x, y)
    return [x / n, y / n]
  }
  const along: [number, number] = [(fa.x + fb.x - ca.x - cb.x) / 2, (fa.y + fb.y - ca.y - cb.y) / 2]
  return {
    across: unit(cb.x - ca.x, cb.y - ca.y),
    along: unit(along[0], along[1]),
    lengthPx: Math.hypot(along[0], along[1]),
  }
}

const shift = (point: ObservedPoint2D, dx: number, dy: number): ObservedPoint2D => ({
  ...point,
  x: point.x + dx,
  y: point.y + dy,
})

const withPoints = (
  observation: ScanObservation,
  finger: Finger,
  edit: (points: Record<string, ObservedPoint2D | undefined>) => void,
): ScanObservation => ({
  ...observation,
  nails: observation.nails.map(nail => {
    if (nail.finger !== finger) return nail
    const points = { ...nail.points } as Record<string, ObservedPoint2D | undefined>
    edit(points)
    return { ...nail, points: points as typeof nail.points }
  }),
})

/**
 * Applies bed errors to a pair of observations, in pixels and nail axes. The
 * axes are taken from the CLEAN annotation, so every error is measured from
 * the same reference regardless of how many are stacked.
 */
export const applyBedErrors = (
  reference: ScanObservation,
  second: ScanObservation,
  errors: readonly BedError[],
  confusion?: BoundaryConfusion,
  finger: Finger = 'index',
): [ScanObservation, ScanObservation] => {
  const axes = [axesOf(reference, finger), axesOf(second, finger)]
  let views: [ScanObservation, ScanObservation] = [reference, second]

  errors.forEach((error, errorIndex) => {
    const gaussian = gaussianSource((error.seed ?? 1) * 7919 + errorIndex)
    views = views.map((view, viewIndex) =>
      withPoints(view, finger, points => {
        const { across, along } = axes[viewIndex]
        for (const name of error.points) {
          const point = points[name]
          if (!point) continue
          let a = 0
          let l = 0
          if (error.kind === 'random') {
            if (error.axis !== 'along') a = gaussian() * error.px
            if (error.axis !== 'across') l = gaussian() * error.px
          } else {
            const sign = error.kind === 'viewSpecific' && viewIndex === 1 ? -1 : 1
            const magnitude =
              error.kind === 'asymmetric' ? (SIDE_A.has(name) ? -error.px : 0) : sign * error.px
            if (error.axis === 'across' || error.axis === 'both') a = magnitude
            if (error.axis === 'along' || error.axis === 'both') l = magnitude
          }
          points[name] = shift(point, across[0] * a + along[0] * l, across[1] * a + along[1] * l)
        }
      }),
    ) as [ScanObservation, ScanObservation]
  })

  if (confusion) {
    views = views.map((view, viewIndex) =>
      withPoints(view, finger, points => {
        const { along, lengthPx } = axes[viewIndex]
        if (confusion.kind === 'swap') {
          const [ca, cb, fa, fb] = [points.cuticleSideA, points.cuticleSideB, points.freeEdgeSideA, points.freeEdgeSideB]
          points.cuticleSideA = fa
          points.cuticleSideB = fb
          points.freeEdgeSideA = ca
          points.freeEdgeSideB = cb
          return
        }
        const distance = confusion.fractionOfBedLength * lengthPx
        const names: BedPointName[] =
          confusion.kind === 'distalAtTip' ? ['freeEdgeSideA', 'freeEdgeSideB'] : ['cuticleSideA', 'cuticleSideB', 'cuticleApex']
        for (const name of names) {
          const point = points[name]
          if (point) points[name] = shift(point, along[0] * distance, along[1] * distance)
        }
      }),
    ) as [ScanObservation, ScanObservation]
  }
  return views
}

// ---------------------------------------------------------------------------
// The scan
// ---------------------------------------------------------------------------

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

const scaledCamera = (camera: CameraSetup, factor: number): CameraSetup => ({
  scale: camera.scale * factor,
  principalPoint: [camera.principalPoint[0] * factor, camera.principalPoint[1] * factor],
  imageWidth: Math.round(camera.imageWidth * factor),
  imageHeight: Math.round(camera.imageHeight * factor),
})

const parse = (observation: ScanObservation): ScanObservation => {
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  if (!parsed.ok) throw new Error(parsed.errors.join('; '))
  return parsed.value
}

const centroid = (hand: SyntheticHand): Vec3 =>
  vscale(hand.landmarks.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / 21)

export interface BedScanOptions {
  /** Where the relative pose comes from: the truth, or Stage 7's H1 + palmRigid. */
  pose: 'truth' | 'h1PalmRigid'
  /** Detector noise on the 21 hand landmarks only, per view, in pixels. */
  landmarkNoisePx?: number
  /** Restrict that noise to these landmarks, to attribute it. */
  noisyLandmarks?: readonly string[]
  bedErrors?: readonly BedError[]
  confusion?: BoundaryConfusion
  seedA?: number
  seedB?: number
  /** Multiplies both cameras' pixels per unit: a sharper or coarser capture. */
  resolution?: number
  /** Emit the optional bed points. */
  optionalBedPoints?: boolean
  /** How the socket is read from the lifted bed. Default: the plain quad. */
  estimator?: { kind: 'quad' } | ({ kind: 'fused' } & BedFusionOptions)
  /** Free edge beyond the bed, for M6 swap captures. */
  freeEdgeFraction?: number
  /** A precomputed profile, so a population sweep does not rebuild it per scan. */
  profile?: HandProfile3D
}

export interface BedScanResult {
  socket: SocketObservation
  truth: SocketObservation
  originPct: number
  normalDeg: number
  tangentDeg: number
  bedWidthPct: number
  bedLengthPct: number
  residualPx: number
  bedResidualPx: number
  poseErrorDeg: number
  /** Bed length in reference-view pixels, from the clean projection. */
  bedLengthPx: number
}

export const h1ProfileFor = (geometry: SyntheticOptions): HandProfile3D => {
  const profile = stretchProfileLaterally(GENERIC_PROFILE, trueStretch(geometry))
  if (!profile) throw new Error('H1 profile did not build')
  return profile
}

/**
 * One daily scan in the Stage 7 setting — hand pitched 35 degrees, second view
 * on the azimuth-dominant diagonal at 40 degrees — with controlled errors on
 * the hand landmarks and the bed points, and the socket read either way.
 */
export const bedScan = (geometry: SyntheticOptions, options: BedScanOptions): BedScanResult | null => {
  const pose = { rotationAxis: [1, 0, 0] as Vec3, rotationDeg: 35 }
  const hand = syntheticHand({ ...geometry, pose, freeEdgeFraction: options.freeEdgeFraction })
  const target = centroid(hand)
  const referenceView = lookAtRotation(cameraPosition(3, 0, 0, target), target)
  const secondView = lookAtRotation(cameraPosition(3, 40 * 0.875, 40 * 0.5, target), target)
  const truthRelative = multiplyMat3(secondView, transposeMat3(referenceView))
  const resolution = options.resolution ?? 1
  const cameraA = scaledCamera(REFERENCE_CAMERA, resolution)
  const cameraB = scaledCamera(SECOND_CAMERA, resolution)

  const project = (view: Mat3, camera: CameraSetup) =>
    projectToObservation(hand, { camera, view, optionalBedPoints: options.optionalBedPoints })
  let a = project(referenceView, cameraA)
  let b = project(secondView, cameraB)
  const bedLengthPx = axesOf(a, 'index').lengthPx

  const noise = options.landmarkNoisePx ?? 0
  if (noise) {
    a = jitterObservation(a, {
      sigmaPx: noise,
      seed: options.seedA ?? 11,
      nails: false,
      landmarkNames: options.noisyLandmarks,
    })
    b = jitterObservation(b, {
      sigmaPx: noise * (cameraB.scale / cameraA.scale),
      seed: options.seedB ?? 977,
      nails: false,
      landmarkNames: options.noisyLandmarks,
    })
  }
  ;[a, b] = applyBedErrors(a, b, options.bedErrors ?? [], options.confusion)
  a = parse(a)
  b = parse(b)

  let relative = truthRelative
  if (options.pose === 'h1PalmRigid') {
    const estimate = estimateRelativeRotationWithProfile(options.profile ?? h1ProfileFor(geometry), a, b, {
      set: 'palmRigid',
    })
    const fit = estimate.rotation ?? estimate.discardedRotation
    if (!fit) return null
    relative = fit
  }
  const axis = normalize(toRotationVector(truthRelative)) ?? ([1, 0, 0] as Vec3)
  const poseErrorDeg = rotationDifference(truthRelative, relative, axis).totalDeg

  const lifted = liftTwoView(
    a,
    b,
    { reference: { rotation: referenceView }, second: { rotation: multiplyMat3(relative, referenceView) } },
    ['index'],
    { optionalBedPoints: options.estimator?.kind === 'fused' },
  )
  if (!lifted.canonical) return null

  let socket: SocketObservation | null | undefined
  if (options.estimator?.kind === 'fused') {
    const bed = lifted.canonical.beds.find(entry => entry.finger === 'index')
    const landmarks = lifted.canonical.landmarks3d
    socket =
      bed && landmarks.every(point => point !== null)
        ? estimateSocketFused(landmarks as Vec3[], bed, 'index', options.estimator)
        : null
  } else {
    socket = socketObservationsFrom(lifted.canonical).get('index')
  }
  const truth = estimateSocket(hand.landmarks, truthBed(hand, 'index'), 'index')
  if (!socket || !truth) return null

  return {
    socket,
    truth,
    originPct: originOffsetRatio(socket.socket, truth.socket) * 100,
    normalDeg: normalAngleDeg(socket.socket, truth.socket) ?? Number.NaN,
    tangentDeg: tangentAngleDeg(socket.socket, truth.socket) ?? Number.NaN,
    bedWidthPct: (socket.socket.bedWidth / truth.socket.bedWidth - 1) * 100,
    bedLengthPct: (socket.socket.bedLength / truth.socket.bedLength - 1) * 100,
    residualPx: lifted.residuals.reprojectionRmsPx,
    bedResidualPx: lifted.residuals.bedReprojectionRmsPx.index ?? Number.NaN,
    poseErrorDeg,
    bedLengthPx,
  }
}
