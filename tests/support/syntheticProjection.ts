// Projects a synthetic 3D hand into a Layer A ScanObservation.
//
// This is what makes lift bias measurable: the 3D truth is known, only its 2D
// projection is handed to the lift, and the reconstruction can then be
// compared against the hand it came from.
//
// Projection is weak perspective (scaled orthographic) — the same model the
// lift assumes — so any error that shows up comes from the lift's OTHER
// assumptions (planar palm, generic bone ratios, minimum tilt), not from a
// mismatch in the camera model.

import type { Finger } from '../../src/lib/nail3dContract.ts'
import { LANDMARK_NAMES } from '../../src/lib/nail3dLift.ts'
import type { NailBedCorners } from '../../src/lib/nail3dSocket.ts'
import type {
  NailBedAnnotation,
  ObservedPoint2D,
  ScanObservation,
} from '../../src/lib/nail3dObservation.ts'
import { IDENTITY_MAT3, add, applyMat3, cross, normalize, rotationMat3, sub } from '../../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../../src/lib/vec3.ts'
import { gaussianSource } from './syntheticHand.ts'
import type { SyntheticHand } from './syntheticHand.ts'

export interface CameraSetup {
  /** Pixels per world unit. */
  scale: number
  principalPoint: readonly [number, number]
  imageWidth: number
  imageHeight: number
}

export const DEFAULT_CAMERA: CameraSetup = {
  scale: 900,
  principalPoint: [1512, 2016],
  imageWidth: 3024,
  imageHeight: 4032,
}

/**
 * World -> pixels. World Y is up, image y is down, matching the inverse the
 * lift applies (`toWorld` negates y).
 */
export const projectPoint = (point: Vec3, camera: CameraSetup): [number, number] => [
  camera.principalPoint[0] + camera.scale * point[0],
  camera.principalPoint[1] - camera.scale * point[1],
]

/** A camera orientation: world points are rotated by this before projecting. */
export const viewRotation = (axis: Vec3, degrees: number): Mat3 =>
  rotationMat3(axis, (degrees * Math.PI) / 180)

export interface ProjectionOptions {
  camera?: CameraSetup
  /** World->camera rotation for this view. Identity means the reference view. */
  view?: Mat3
  captureId?: string
  sessionId?: string
  handedness?: 'left' | 'right'
  /** Fingers to annotate. Defaults to the index finger alone. */
  fingers?: readonly Finger[]
  /** Drops these landmarks, to exercise the "not measured" path. */
  omitLandmarks?: readonly string[]
  /**
   * Also emit the optional bed points. The synthetic bed is a flat
   * rectangle, so cuticleApex lands ON the cuticle chord (a real cuticle is
   * curved and its apex sits proximal of the chord), and each bed wall point
   * is the midpoint of its lateral edge.
   */
  optionalBedPoints?: boolean
}

const observedPoint = (xy: readonly [number, number]): ObservedPoint2D => ({
  x: xy[0],
  y: xy[1],
  confidence: 0.9,
  source: 'manual',
})

/**
 * The synthetic bed quad is ordered [proximalA, proximalB, distalB, distalA].
 * Naming the points is the whole purpose of the annotation format: a mask
 * generator would emit these same names.
 */
const annotate = (
  finger: Finger,
  quad: NailBedCorners,
  camera: CameraSetup,
  view: Mat3,
  optional = false,
): NailBedAnnotation => {
  const at = (point: Vec3) => observedPoint(projectPoint(applyMat3(view, point), camera))
  const half = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  return {
    finger,
    // The synthetic layout runs the lateral axis from thumb (-x) to pinky (+x),
    // so corner A is the thumb-side one.
    sideAToward: 'thumb',
    points: {
      cuticleSideA: at(quad[0]),
      cuticleSideB: at(quad[1]),
      freeEdgeSideB: at(quad[2]),
      freeEdgeSideA: at(quad[3]),
      ...(optional
        ? {
            cuticleApex: at(half(quad[0], quad[1])),
            bedWallSideA: at(half(quad[0], quad[3])),
            bedWallSideB: at(half(quad[1], quad[2])),
          }
        : {}),
    },
  }
}

export const projectToObservation = (
  hand: SyntheticHand,
  options: ProjectionOptions = {},
): ScanObservation => {
  const camera = options.camera ?? DEFAULT_CAMERA
  const fingers = options.fingers ?? (['index'] as const)
  const omit = new Set(options.omitLandmarks ?? [])
  const view = options.view ?? IDENTITY_MAT3

  return {
    schemaVersion: 1,
    captureId: options.captureId ?? 'cap_synthetic',
    sessionId: options.sessionId ?? 'ses_synthetic',
    handedness: options.handedness ?? 'right',
    handednessSource: 'userSelected',
    image: {
      width: camera.imageWidth,
      height: camera.imageHeight,
      exifOrientation: 1,
      coordinateOrigin: 'topLeft',
      units: 'pixels',
    },
    landmarks: hand.landmarks.map((point, index) => {
      const name = LANDMARK_NAMES[index]
      if (omit.has(name)) return { name, x: null, y: null, confidence: null }
      const [x, y] = projectPoint(applyMat3(view, point), camera)
      return { name, x, y, confidence: 0.95 }
    }),
    nails: fingers.map(finger =>
      annotate(finger, hand.bedCorners[finger], camera, view, options.optionalBedPoints ?? false),
    ),
    // Honest about what a synthetic capture does not have.
    missing: ['camera.focalLengthPx', 'camera.principalPointPx'],
  }
}

/** The 3D truth the projection came from, in the same order the lift emits. */
export const truthLandmarks = (hand: SyntheticHand): readonly Vec3[] => hand.landmarks

export const truthBed = (hand: SyntheticHand, finger: Finger): NailBedCorners =>
  hand.bedCorners[finger]

export interface JitterOptions {
  /** Per-point annotation sigma, in this view's pixels. */
  sigmaPx: number
  seed?: number
  /** Jitter the 21 hand landmarks. Default true. */
  landmarks?: boolean
  /** Restrict landmark jitter to these names. Default: all of them. */
  landmarkNames?: readonly string[]
  /** Jitter the nail-bed points. Default true. */
  nails?: boolean
}

/**
 * Adds independent 2D noise to an already-projected observation.
 *
 * This is the only honest way to model annotation error across views: a person
 * (or a mask generator) marks each photo separately, so the pixel error in one
 * view says nothing about the error in the other. Jittering the 3D hand and
 * projecting it twice instead gives the two views the SAME error, which a
 * two-view lift reconstructs exactly — a measurement that looks like perfect
 * noise immunity and is really just a shared perturbation.
 */
export const jitterObservation = (
  observation: ScanObservation,
  options: JitterOptions,
): ScanObservation => {
  const gaussian = gaussianSource(options.seed ?? 1)
  const sigma = options.sigmaPx
  const jitter = (value: number): number => value + gaussian() * sigma

  const doLandmarks = options.landmarks ?? true
  const doNails = options.nails ?? true

  return {
    ...observation,
    landmarks: observation.landmarks.map(landmark => {
      // Draw for every landmark regardless, so restricting the subset does not
      // change the noise any other landmark receives for the same seed.
      const dx = jitter(0)
      const dy = jitter(0)
      if (!doLandmarks || landmark.x === null || landmark.y === null) return landmark
      if (options.landmarkNames && !options.landmarkNames.includes(landmark.name)) return landmark
      return { ...landmark, x: landmark.x + dx, y: landmark.y + dy }
    }),
    nails: !doNails ? observation.nails : observation.nails.map(nail => ({
      ...nail,
      points: Object.fromEntries(
        Object.entries(nail.points).map(([name, point]) => [
          name,
          point ? { ...point, x: jitter(point.x), y: jitter(point.y) } : point,
        ]),
      ) as NailBedAnnotation['points'],
    })),
  }
}

/**
 * World->camera rotation for a camera at `position` looking at `target`.
 *
 * The projection stays weak perspective; the camera's distance is used only
 * to turn a POSITION into a view direction. That is the whole reason this
 * exists: the two-view lift needs a relative rotation, so a camera-position
 * error only matters through the view direction it implies, and the
 * conversion between the two depends on how far away the hand is.
 */
export const lookAtRotation = (
  position: Vec3,
  target: Vec3 = [0, 0, 0],
  up: Vec3 = [0, 1, 0],
): Mat3 => {
  // Row 2 is the camera's +Z, which points back toward the camera.
  const z = normalize(sub(position, target))
  if (!z) return IDENTITY_MAT3
  const x = normalize(cross(up, z)) ?? ([1, 0, 0] as Vec3)
  const y = cross(z, x)
  return [x[0], x[1], x[2], y[0], y[1], y[2], z[0], z[1], z[2]]
}

/**
 * A camera position on a sphere around the hand. Elevation moves the camera
 * over the fingertip (about the bed's width axis); azimuth moves it across
 * the hand.
 */
export const cameraPosition = (
  distance: number,
  azimuthDeg: number,
  elevationDeg: number,
  target: Vec3 = [0, 0, 0],
): Vec3 => {
  const az = (azimuthDeg * Math.PI) / 180
  const el = (elevationDeg * Math.PI) / 180
  return add(target, [
    distance * Math.cos(el) * Math.sin(az),
    distance * Math.sin(el),
    distance * Math.cos(el) * Math.cos(az),
  ])
}
