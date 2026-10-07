// Stage 10 — a synthetic stand-in for the real-photo capture, in the exact
// on-disk format the real one will have.
//
// It exists to check the analysis kit (research/stage10/kit.ts), never to
// produce evidence: the hand is synthetic, the projection is weak
// perspective, and every error below is one we chose. What it does reproduce
// faithfully is the PROTOCOL — the names, the sessions, the two views, the
// short and long nail sets, Vision-like landmarks without nails, and a
// separate manual-annotation CSV — so that the kit is exercised on the same
// shapes of data the photos will produce.
//
// Geometry of the protocol: the right hand lies flat on a table, back up,
// fingers toward the top of the photo. V1 looks straight down; V2 swings
// ~35 degrees toward the thumb and ~20 toward the fingertips (~40 in all).

import { LANDMARK_NAMES } from '../../src/lib/nail3dLift.ts'
import type { ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { FINGER_LANDMARKS } from '../../src/lib/nail3dSocket.ts'
import { IDENTITY_MAT3, add, applyMat3, cross, multiplyMat3, normalize, rotationMat3, scale, sub } from '../../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../../src/lib/vec3.ts'
import { PERSONS, calibrationFrame } from './handPopulation.ts'
import { gaussianSource, syntheticHand } from './syntheticHand.ts'
import type { SyntheticOptions } from './syntheticHand.ts'
import { cameraPosition, lookAtRotation, projectPoint } from './syntheticProjection.ts'
import type { CameraSetup } from './syntheticProjection.ts'

/** ~150 px of index nail bed, roughly an iPhone at 40 cm with the 2x lens. */
export const DRY_RUN_CAMERA: CameraSetup = {
  scale: 1515,
  principalPoint: [1588, 3410],
  imageWidth: 3024,
  imageHeight: 4032,
}

export const DRY_RUN_VIEWS: Record<'V1' | 'V2', Mat3> = {
  V1: IDENTITY_MAT3,
  V2: lookAtRotation(cameraPosition(3, -35, 20)),
}

/** The index nail bed's length in V1 pixels for this person, hand at rest. */
export const dryRunBedLengthPx = (geometry: SyntheticOptions = PERSONS[0][1]): number => {
  const bed = syntheticHand(geometry).bedCorners.index
  const at = (point: Vec3) => projectPoint(applyMat3(DRY_RUN_VIEWS.V1, point), DRY_RUN_CAMERA)
  const [ca, cb, fb, fa] = bed.map(at)
  return Math.hypot((fa[0] + fb[0] - ca[0] - cb[0]) / 2, (fa[1] + fb[1] - ca[1] - cb[1]) / 2)
}

export interface DryRunOptions {
  /** The person. Default: the first of the Stage 7 population. */
  geometry?: SyntheticOptions
  /** Sessions, alternating N0 / N1 starting with N0. Default 12. */
  sessions?: number
  /** Shots per view per session. Default 2. */
  shots?: number
  calibrationFrames?: number
  /**
   * Detector error that is redrawn whenever the hand is put down again
   * (the image changes), per view, per landmark, pixels. Default 1.5.
   */
  detectorSigmaPx?: number
  /** Detector error between near-identical shots of one placement. Default 0.2. */
  shotSigmaPx?: number
  /** Manual annotation error, per point per pass. Default 1.0. */
  annotatorSigmaPx?: number
  /** Re-placement wobble: in-plane rotation, tilt (degrees), translation (units). */
  placement?: { rotationDeg?: number; tiltDeg?: number; translation?: number }
  /** Session-to-session change in finger flexion, degrees per joint (SD). Default 0. */
  flexSigmaDeg?: number
  /** Fault: the long nail set moves the detector's indexDIP distally, px. */
  nailSetDipShiftPx?: number
  /** Fault: the long nail set drags the detector's TIP with it. */
  tipFollowsNail?: 'axial' | 'dorsalTip'
  /** Fault: extra detector error on the palm points only (pose stress), px. */
  palmSigmaPx?: number
  seed?: number
}

export interface DryRunDataset {
  /** Vision-like Layer A, no nails: what `vision-dump.swift` writes. */
  observations: Record<string, ScanObservation>
  /** What the annotator writes: captureId,pass,point,x,y. */
  annotationsCsv: string
  conditions: Record<string, unknown>
}

const PALM_POINTS = new Set(['wrist', 'thumbMCP', 'indexMCP', 'middleMCP', 'ringMCP', 'pinkyMCP'])
const FINGERS_ALL = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const

const pad = (n: number) => String(n).padStart(2, '0')

export const dryRunDataset = (options: DryRunOptions = {}): DryRunDataset => {
  const geometry = options.geometry ?? PERSONS[0][1]
  const sessions = options.sessions ?? 12
  const shots = options.shots ?? 2
  const calibrationCount = options.calibrationFrames ?? 15
  const detectorSigma = options.detectorSigmaPx ?? 1.5
  const shotSigma = options.shotSigmaPx ?? 0.2
  const annotatorSigma = options.annotatorSigmaPx ?? 1.0
  const placement = { rotationDeg: 5, tiltDeg: 2, translation: 0.03, ...options.placement }
  const gaussian = gaussianSource(options.seed ?? 7)
  const camera = DRY_RUN_CAMERA

  const observations: Record<string, ScanObservation> = {}
  const csv: string[] = ['captureId,pass,point,x,y']

  // --- Calibration: face-on, the hand put down again for every frame -------
  for (let i = 1; i <= calibrationCount; i += 1) {
    const frame = calibrationFrame(geometry, {
      yawDeg: gaussian() * 3,
      pitchDeg: gaussian() * 3,
      jitterPx: detectorSigma,
      seed: (options.seed ?? 7) * 101 + i,
      camera,
    })
    const id = `CAL-${pad(i)}`
    observations[id] = { ...frame, captureId: id, sessionId: id, nails: [], missing: ['camera', 'nails'] }
  }

  // --- Daily sessions -------------------------------------------------------
  for (let s = 1; s <= sessions; s += 1) {
    const nailSet = s % 2 === 1 ? 'N0' : 'N1'
    const long = nailSet === 'N1'
    const flex = (options.flexSigmaDeg ?? 0) * gaussian()
    const posture = {
      ...geometry,
      articulationDeg: Object.fromEntries(FINGERS_ALL.map(finger => [finger, flex])),
      freeEdgeFraction: long ? 0.5 : 0,
    }
    const hand = syntheticHand({ ...posture, tipFollowsNail: long ? options.tipFollowsNail : undefined })
    // The same hand without any detector effect, for what a person marks.
    const anatomy = long && options.tipFollowsNail ? syntheticHand(posture) : hand

    // Put the hand down: rotate about the table normal, tilt a little, shift.
    const spin = rotationMat3([0, 0, 1], (gaussian() * placement.rotationDeg * Math.PI) / 180)
    const tiltAxis = normalize([gaussian(), gaussian(), 0]) ?? ([1, 0, 0] as Vec3)
    const tilt = rotationMat3(tiltAxis, (gaussian() * placement.tiltDeg * Math.PI) / 180)
    const place = multiplyMat3(tilt, spin)
    const shift: Vec3 = [gaussian() * placement.translation, gaussian() * placement.translation, 0]
    const put = (point: Vec3): Vec3 => add(applyMat3(place, point), shift)

    const landmarks = hand.landmarks.map(put)
    const anatomical = anatomy.landmarks.map(put)
    const bed = hand.bedCorners.index.map(put)

    // What a person marks for a joint is the dorsal skin crease, not the joint
    // centre the skeleton (and, roughly, Vision) uses. A constant convention:
    // it biases, it does not scatter.
    const [, pipIndex, dipIndex, tipIndex] = FINGER_LANDMARKS.index
    const lateral = normalize(sub(anatomical[FINGER_LANDMARKS.pinky[0]], anatomical[FINGER_LANDMARKS.index[0]])) ?? ([1, 0, 0] as Vec3)
    const crease = (joint: number, next: number) => {
      const along = normalize(sub(anatomical[next], anatomical[joint])) ?? ([0, 1, 0] as Vec3)
      const dorsal = normalize(cross(lateral, along)) ?? ([0, 0, 1] as Vec3)
      return add(anatomical[joint], scale(dorsal, 0.054))
    }
    const manual3d: Record<string, Vec3> = {
      indexPIP: crease(pipIndex, dipIndex),
      indexDIP: crease(dipIndex, tipIndex),
      cuticleSideA: bed[0],
      cuticleSideB: bed[1],
      freeEdgeSideB: bed[2],
      freeEdgeSideA: bed[3],
    }

    for (const view of ['V1', 'V2'] as const) {
      const rotation = DRY_RUN_VIEWS[view]
      const project = (point: Vec3) => projectPoint(applyMat3(rotation, point), camera)
      // Detector error belonging to this placement and view.
      const persistent = landmarks.map(() => [gaussian() * detectorSigma, gaussian() * detectorSigma])
      const palmExtra = landmarks.map(() => [gaussian() * (options.palmSigmaPx ?? 0), gaussian() * (options.palmSigmaPx ?? 0)])
      const projected = landmarks.map(project)
      const finger2d = (() => {
        const dip = projected[dipIndex]
        const pip = projected[pipIndex]
        const length = Math.hypot(dip[0] - pip[0], dip[1] - pip[1]) || 1
        return [(dip[0] - pip[0]) / length, (dip[1] - pip[1]) / length]
      })()

      for (let k = 1; k <= shots; k += 1) {
        const id = `S${s}-${nailSet}-${view}-${k}`
        observations[id] = {
          schemaVersion: 1,
          captureId: id,
          sessionId: `S${s}`,
          handedness: 'right',
          handednessSource: 'userSelected',
          image: {
            width: camera.imageWidth,
            height: camera.imageHeight,
            exifOrientation: 1,
            coordinateOrigin: 'topLeft',
            units: 'pixels',
          },
          landmarks: projected.map(([x, y], index) => {
            const name = LANDMARK_NAMES[index]
            let dx = persistent[index][0] + gaussian() * shotSigma
            let dy = persistent[index][1] + gaussian() * shotSigma
            if (PALM_POINTS.has(name)) {
              dx += palmExtra[index][0]
              dy += palmExtra[index][1]
            }
            if (long && name === 'indexDIP' && options.nailSetDipShiftPx) {
              dx += finger2d[0] * options.nailSetDipShiftPx
              dy += finger2d[1] * options.nailSetDipShiftPx
            }
            return { name, x: x + dx, y: y + dy, confidence: 0.9 }
          }),
          nails: [],
          missing: ['camera', 'nails'],
        }

        // Manual annotation, shot 1 only. A long opaque nail hides the bed's
        // distal edge, so it is simply not marked. Pass 2 repeats the four
        // points the analysis needs a noise figure for.
        if (k !== 1) continue
        const marked = long
          ? ['cuticleSideA', 'cuticleSideB', 'indexDIP', 'indexPIP']
          : ['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB', 'indexDIP', 'indexPIP']
        for (const pass of [1, 2]) {
          const points = pass === 1 ? marked : ['cuticleSideA', 'cuticleSideB', 'indexDIP', 'indexPIP']
          for (const name of points) {
            const [x, y] = project(manual3d[name])
            csv.push(
              `${id},${pass},${name},${(x + gaussian() * annotatorSigma).toFixed(2)},${(y + gaussian() * annotatorSigma).toFixed(2)}`,
            )
          }
        }
      }
    }
  }

  return {
    observations,
    annotationsCsv: `${csv.join('\n')}\n`,
    conditions: {
      kind: 'SYNTHETIC DRY RUN — not evidence',
      hand: 'right',
      finger: 'index',
      sessions,
      shots,
      calibrationFrames: calibrationCount,
      detectorSigmaPx: detectorSigma,
      shotSigmaPx: shotSigma,
      annotatorSigmaPx: annotatorSigma,
      flexSigmaDeg: options.flexSigmaDeg ?? 0,
      faults: {
        nailSetDipShiftPx: options.nailSetDipShiftPx ?? 0,
        tipFollowsNail: options.tipFollowsNail ?? 'none',
        palmSigmaPx: options.palmSigmaPx ?? 0,
      },
    },
  }
}
