// Stage 7 — how little does a first-run Hand Calibration have to measure?
//
// Stage 6 made the Personal HandProfile a precondition of the two-view route
// and found that its accuracy matters along one direction only: the palm's
// width-to-length aspect ratio. Global scale is irrelevant and the other shape
// parameters have an order of magnitude of slack. That suggests a calibration
// far lighter than a 3D hand scan, and this module provides the pieces to test
// that suggestion:
//
//   - tiered profiles: a generic profile laterally stretched to a measured
//     aspect ratio (H1), or with its in-plane layout replaced by measured 2D
//     landmarks (H2);
//   - several definitions of "palm aspect ratio" from 2D landmarks, from a
//     single distance ratio to robust fits over every palm point;
//   - a tilt-aware estimator that fits the 3D profile itself with a free
//     lateral stretch, so a hand held slightly off-frontal is not mistaken
//     for a differently shaped hand.
//
// Every quantity here is a RATIO or a stretch factor. No length in
// centimetres is read or produced anywhere, by design: Stage 6 showed the
// profile only has to supply shape.
//
// The nail bed is not an input. Calibration reads hand landmarks only.

import type { ScanObservation } from './nail3dObservation.ts'
import { LANDMARK_NAMES } from './nail3dLift.ts'
import { FINGER_LANDMARKS, WRIST } from './nail3dSocket.ts'
import { fitProfileToView, handProfile } from './nail3dProfilePose.ts'
import type { HandProfile3D } from './nail3dProfilePose.ts'
import { cross, dot, normalize, sub } from './vec3.ts'
import type { Vec3 } from './vec3.ts'

export const CALIBRATION_VERSION = 1

/**
 * The palm points an aspect ratio is read from. The thumb's base is left out
 * on purpose: it moves with thumb abduction far more than the finger MCPs do,
 * and the palm's shape is what is being measured, not the thumb's posture.
 */
export const PALM_ASPECT_LANDMARKS = [
  'wrist',
  'indexMCP',
  'middleMCP',
  'ringMCP',
  'pinkyMCP',
] as const

const INDEX = {
  wrist: WRIST,
  indexMCP: FINGER_LANDMARKS.index[0],
  middleMCP: FINGER_LANDMARKS.middle[0],
  ringMCP: FINGER_LANDMARKS.ring[0],
  pinkyMCP: FINGER_LANDMARKS.pinky[0],
} as const

type PalmId = (typeof PALM_ASPECT_LANDMARKS)[number]

// ---------------------------------------------------------------------------
// The palm's own frame, and the lateral stretch that defines H1
// ---------------------------------------------------------------------------

export interface PalmFrame {
  centre: Vec3
  /** Across the palm, index side to pinky side, perpendicular to `longitudinal`. */
  lateral: Vec3
  /** Wrist toward the middle MCP. */
  longitudinal: Vec3
  /** Out of the back of the hand. */
  normal: Vec3
}

/**
 * Axes derived from the profile rather than assumed, so a profile in any
 * orientation can be stretched along ITS palm, not along a world axis.
 */
export const palmFrame = (profile: HandProfile3D): PalmFrame | null => {
  const point = (id: PalmId): Vec3 => profile.landmarks[INDEX[id]]
  const longitudinal = normalize(sub(point('middleMCP'), point('wrist')))
  const across = sub(point('pinkyMCP'), point('indexMCP'))
  if (!longitudinal) return null
  const normal = normalize(cross(across, longitudinal))
  if (!normal) return null
  const lateral = normalize(cross(longitudinal, normal))
  if (!lateral) return null
  const centre: Vec3 = [0, 1, 2].map(
    axis => PALM_ASPECT_LANDMARKS.reduce((sum, id) => sum + point(id)[axis], 0) / PALM_ASPECT_LANDMARKS.length,
  ) as unknown as Vec3
  return { centre, lateral, longitudinal, normal }
}

/**
 * H1: the profile stretched across the palm by `stretch`, about the palm
 * centre. 1 leaves it unchanged; 1.05 makes the hand 5% wider for its length.
 *
 * The whole hand is stretched, fingers included, because fingers sit on their
 * MCPs: a wider palm spreads them apart with it.
 */
export const stretchProfileLaterally = (
  profile: HandProfile3D,
  stretch: number,
): HandProfile3D | null => {
  const frame = palmFrame(profile)
  if (!frame || !(stretch > 0)) return null
  const landmarks = profile.landmarks.map(point => {
    const offset = sub(point, frame.centre)
    const along = dot(offset, frame.lateral) * (stretch - 1)
    return [
      point[0] + frame.lateral[0] * along,
      point[1] + frame.lateral[1] * along,
      point[2] + frame.lateral[2] * along,
    ] as Vec3
  })
  return handProfile(landmarks, profile.handedness)
}

/** The profile's palm seen face-on: (lateral, longitudinal) per palm point. */
const faceOnPalm = (profile: HandProfile3D): Map<PalmId, [number, number]> | null => {
  const frame = palmFrame(profile)
  if (!frame) return null
  const map = new Map<PalmId, [number, number]>()
  for (const id of PALM_ASPECT_LANDMARKS) {
    const offset = sub(profile.landmarks[INDEX[id]], frame.centre)
    map.set(id, [dot(offset, frame.lateral), dot(offset, frame.longitudinal)])
  }
  return map
}

// ---------------------------------------------------------------------------
// Aspect-ratio definitions from 2D landmarks
// ---------------------------------------------------------------------------

/**
 * How "palm aspect ratio" is read off a 2D image. All but the last assume the
 * hand faces the camera squarely; they differ in how many landmarks they lean
 * on and so in how they react to noise, a missing point, or a wrist landmark
 * that is not where it should be.
 */
export const ASPECT_DEFINITIONS = [
  /** One chord over one length: |indexMCP-pinkyMCP| / |wrist-middleMCP|. */
  'indexPinkyOverWristMiddle',
  /** The polyline across all four MCPs, over the same length. */
  'mcpSpanOverWristMiddle',
  /** Median over three palm widths x four wrist-to-MCP lengths. */
  'medianOfPalmRatios',
  /** Least-squares fit of every palm point: similarity plus a lateral stretch. */
  'palmShapeFit',
] as const

export type AspectDefinition = (typeof ASPECT_DEFINITIONS)[number]

export interface AspectMeasurement {
  definition: AspectDefinition | 'profileShapeFit'
  /**
   * Lateral stretch relative to the template profile: the factor H1 applies.
   * A pure ratio — it cannot carry a length unit.
   */
  stretch: number | null
  /** RMS residual of a fit, in pixels; NaN for the plain ratio definitions. */
  residualPx: number
  usedLandmarkIds: readonly string[]
  rejectedLandmarkIds: readonly string[]
  refusedReason?: 'tooFewLandmarks' | 'degenerate' | 'mirrored'
}

/** Observed palm points in the lift's 2D convention (Y up), with confidence. */
const observedPalm = (
  observation: ScanObservation,
  minConfidence: number,
): { points: Map<PalmId, [number, number]>; rejected: string[] } => {
  const byName = new Map(observation.landmarks.map(landmark => [landmark.name, landmark]))
  const points = new Map<PalmId, [number, number]>()
  const rejected: string[] = []
  for (const id of PALM_ASPECT_LANDMARKS) {
    const landmark = byName.get(id)
    if (
      !landmark ||
      landmark.x === null ||
      landmark.y === null ||
      (landmark.confidence !== null && landmark.confidence < minConfidence)
    ) {
      rejected.push(id)
      continue
    }
    points.set(id, [landmark.x, -landmark.y])
  }
  return { points, rejected }
}

const span = (a: [number, number], b: [number, number]): number => Math.hypot(a[0] - b[0], a[1] - b[1])

const WIDTH_PAIRS: ReadonlyArray<[PalmId, PalmId]> = [
  ['indexMCP', 'pinkyMCP'],
  ['indexMCP', 'ringMCP'],
  ['middleMCP', 'pinkyMCP'],
]
const LENGTH_PAIRS: ReadonlyArray<[PalmId, PalmId]> = [
  ['wrist', 'indexMCP'],
  ['wrist', 'middleMCP'],
  ['wrist', 'ringMCP'],
  ['wrist', 'pinkyMCP'],
]

/**
 * A scale-invariant statistic of the palm for each ratio definition, or null
 * when the points it needs are missing. `normaliser` holds per-pair constants
 * so the median definition compares like with like.
 */
const ratioStatistic = (
  definition: Exclude<AspectDefinition, 'palmShapeFit'>,
  points: ReadonlyMap<PalmId, [number, number]>,
  normaliser?: ReadonlyMap<string, number>,
): number | null => {
  const get = (id: PalmId) => points.get(id)
  if (definition === 'indexPinkyOverWristMiddle') {
    const [i, p, w, m] = [get('indexMCP'), get('pinkyMCP'), get('wrist'), get('middleMCP')]
    if (!i || !p || !w || !m) return null
    const length = span(w, m)
    return length > 1e-9 ? span(i, p) / length : null
  }
  if (definition === 'mcpSpanOverWristMiddle') {
    const [i, m, r, p, w] = [get('indexMCP'), get('middleMCP'), get('ringMCP'), get('pinkyMCP'), get('wrist')]
    if (!i || !m || !r || !p || !w) return null
    const length = span(w, m)
    return length > 1e-9 ? (span(i, m) + span(m, r) + span(r, p)) / length : null
  }
  // medianOfPalmRatios: every available width over every available length,
  // each scaled by the template's own value for that pair, so the median is
  // taken over numbers that all mean "stretch relative to the template".
  const ratios: number[] = []
  for (const [a, b] of WIDTH_PAIRS) {
    const pa = get(a)
    const pb = get(b)
    if (!pa || !pb) continue
    for (const [c, d] of LENGTH_PAIRS) {
      const pc = get(c)
      const pd = get(d)
      if (!pc || !pd) continue
      const length = span(pc, pd)
      if (!(length > 1e-9)) continue
      const key = `${a}-${b}/${c}-${d}`
      ratios.push((span(pa, pb) / length) * (normaliser?.get(key) ?? 1))
    }
  }
  if (ratios.length === 0) return null
  ratios.sort((x, y) => x - y)
  const middle = Math.floor(ratios.length / 2)
  return ratios.length % 2 ? ratios[middle] : (ratios[middle - 1] + ratios[middle]) / 2
}

/** Per-pair constants making the template's median statistic exactly 1. */
const medianNormaliser = (template: ReadonlyMap<PalmId, [number, number]>): Map<string, number> => {
  const normaliser = new Map<string, number>()
  for (const [a, b] of WIDTH_PAIRS) {
    for (const [c, d] of LENGTH_PAIRS) {
      const length = span(template.get(c)!, template.get(d)!)
      normaliser.set(`${a}-${b}/${c}-${d}`, length / span(template.get(a)!, template.get(b)!))
    }
  }
  return normaliser
}

/**
 * Inverts a ratio statistic into a lateral stretch: the k for which the
 * template, stretched by k and seen face-on, gives the observed statistic.
 * Bisection, because the statistics are monotone in k but not linear in it
 * (a chord between MCPs is not purely lateral).
 */
const stretchForStatistic = (
  template: HandProfile3D,
  statistic: (points: ReadonlyMap<PalmId, [number, number]>) => number | null,
  target: number,
): number | null => {
  const at = (k: number): number | null => {
    const stretched = stretchProfileLaterally(template, k)
    const face = stretched ? faceOnPalm(stretched) : null
    return face ? statistic(face) : null
  }
  let low = 0.5
  let high = 2
  const lowValue = at(low)
  const highValue = at(high)
  if (lowValue === null || highValue === null) return null
  if (target <= lowValue || target >= highValue) return null
  for (let i = 0; i < 60; i += 1) {
    const middle = (low + high) / 2
    const value = at(middle)
    if (value === null) return null
    if (value < target) low = middle
    else high = middle
  }
  return (low + high) / 2
}

/**
 * The robust definition: fit every available palm point at once with a 2D
 * similarity (rotation, scale, translation) plus a stretch along the
 * template's lateral axis, and read the stretch off the fit.
 *
 * Five points give ten equations against five unknowns, so noise averages
 * down and a single missing point still leaves the fit over-determined.
 */
const palmShapeFit = (
  template: ReadonlyMap<PalmId, [number, number]>,
  observed: ReadonlyMap<PalmId, [number, number]>,
): { stretch: number; residualPx: number; mirrored: boolean } | null => {
  const ids = PALM_ASPECT_LANDMARKS.filter(id => observed.has(id))
  if (ids.length < 4) return null

  const centred = (map: ReadonlyMap<PalmId, [number, number]>, k: number, mirror: boolean) => {
    const raw = ids.map(id => {
      const point = map.get(id)!
      return [point[0] * k, mirror ? -point[1] : point[1]] as [number, number]
    })
    const cx = raw.reduce((sum, p) => sum + p[0], 0) / raw.length
    const cy = raw.reduce((sum, p) => sum + p[1], 0) / raw.length
    return raw.map(p => [p[0] - cx, p[1] - cy] as [number, number])
  }
  const target = centred(observed, 1, false)
  const targetEnergy = target.reduce((sum, p) => sum + p[0] * p[0] + p[1] * p[1], 0)

  // For a fixed stretch the best similarity is closed-form (complex least
  // squares), and so is its residual.
  const residualAt = (k: number, mirror: boolean): number => {
    const source = centred(template, k, mirror)
    let re = 0
    let im = 0
    let sourceEnergy = 0
    source.forEach((z, i) => {
      const u = target[i]
      re += z[0] * u[0] + z[1] * u[1]
      im += z[0] * u[1] - z[1] * u[0]
      sourceEnergy += z[0] * z[0] + z[1] * z[1]
    })
    if (!(sourceEnergy > 1e-18)) return Number.POSITIVE_INFINITY
    return Math.max(0, targetEnergy - (re * re + im * im) / sourceEnergy)
  }

  const best = (mirror: boolean) => {
    // Golden-section over the stretch, after a coarse bracket.
    let bestK = 1
    let bestValue = Number.POSITIVE_INFINITY
    for (let k = 0.6; k <= 1.6001; k += 0.05) {
      const value = residualAt(k, mirror)
      if (value < bestValue) {
        bestValue = value
        bestK = k
      }
    }
    let low = Math.max(0.5, bestK - 0.05)
    let high = bestK + 0.05
    const ratio = (Math.sqrt(5) - 1) / 2
    for (let i = 0; i < 80; i += 1) {
      const a = high - ratio * (high - low)
      const b = low + ratio * (high - low)
      if (residualAt(a, mirror) < residualAt(b, mirror)) high = b
      else low = a
    }
    const k = (low + high) / 2
    return { k, value: residualAt(k, mirror) }
  }

  const straight = best(false)
  const mirrored = best(true)
  const chosen = mirrored.value < straight.value ? { ...mirrored, mirrored: true } : { ...straight, mirrored: false }
  return {
    stretch: chosen.k,
    residualPx: Math.sqrt(chosen.value / ids.length),
    mirrored: chosen.mirrored,
  }
}

export interface CalibrationOptions {
  /** Landmarks below this confidence are treated as absent. Default 0.3. */
  minConfidence?: number
}

/**
 * Measures the palm's lateral stretch relative to `template` from one 2D
 * observation, with the chosen definition. Assumes a face-on hand.
 */
export const measurePalmStretch = (
  template: HandProfile3D,
  observation: ScanObservation,
  definition: AspectDefinition,
  options: CalibrationOptions = {},
): AspectMeasurement => {
  const { points, rejected } = observedPalm(observation, options.minConfidence ?? 0.3)
  const used = PALM_ASPECT_LANDMARKS.filter(id => points.has(id))
  const face = faceOnPalm(template)
  const result = (partial: Partial<AspectMeasurement>): AspectMeasurement => ({
    definition,
    stretch: null,
    residualPx: Number.NaN,
    usedLandmarkIds: used,
    rejectedLandmarkIds: rejected,
    ...partial,
  })
  if (!face) return result({ refusedReason: 'degenerate' })
  // Every longitudinal measure of the palm runs from the wrist: the four MCPs
  // lie nearly on a line and say nothing about the palm's length. Without the
  // wrist a fit would still return a stretch, and it would be noise.
  if (!points.has('wrist')) return result({ refusedReason: 'tooFewLandmarks' })

  if (definition === 'palmShapeFit') {
    const fit = palmShapeFit(face, points)
    if (!fit) return result({ refusedReason: 'tooFewLandmarks' })
    if (fit.mirrored) return result({ refusedReason: 'mirrored', residualPx: fit.residualPx })
    return result({ stretch: fit.stretch, residualPx: fit.residualPx })
  }

  const normaliser = definition === 'medianOfPalmRatios' ? medianNormaliser(face) : undefined
  const statistic = (map: ReadonlyMap<PalmId, [number, number]>) => ratioStatistic(definition, map, normaliser)
  const observedValue = statistic(points)
  if (observedValue === null) return result({ refusedReason: 'tooFewLandmarks' })
  const stretch = stretchForStatistic(template, statistic, observedValue)
  return stretch === null ? result({ refusedReason: 'degenerate' }) : result({ stretch })
}

export interface ProfileStretchOptions extends CalibrationOptions {
  /** Landmarks the 3D fit uses. Defaults to the palm points only. */
  landmarkIds?: readonly string[]
}

/**
 * The tilt-aware definition: fits the 3D template profile to every frame
 * with its own pose, and searches ONE lateral stretch shared by all of them.
 *
 * A hand held a little off face-on foreshortens one palm axis; a ratio read
 * straight off the image takes that for a differently shaped hand. Fitting the
 * 3D profile lets the pose absorb the tilt instead — as far as the template's
 * generic depth allows — and with frames at different tilts the stretch is the
 * only thing they must agree on, which is what separates it from the tilt.
 */
export const measureProfileStretch = (
  template: HandProfile3D,
  observations: readonly ScanObservation[],
  options: ProfileStretchOptions = {},
): AspectMeasurement & { perFrameResidualPx: readonly number[] } => {
  const landmarkIds = options.landmarkIds ?? PALM_ASPECT_LANDMARKS
  const failed = (reason: AspectMeasurement['refusedReason']) => ({
    definition: 'profileShapeFit' as const,
    stretch: null,
    residualPx: Number.NaN,
    usedLandmarkIds: [] as string[],
    rejectedLandmarkIds: [] as string[],
    refusedReason: reason,
    perFrameResidualPx: [] as number[],
  })
  if (observations.length === 0) return failed('tooFewLandmarks')
  // Same reason as the 2D definitions: on the palm points alone the wrist is
  // the only longitudinal anchor, so a frame without it cannot inform the
  // stretch and must not be fitted as if it could.
  if (landmarkIds.includes('wrist')) {
    const missingWrist = observations.some(observation => {
      const wrist = observation.landmarks.find(landmark => landmark.name === 'wrist')
      return !wrist || wrist.x === null || wrist.y === null
    })
    if (missingWrist && landmarkIds.length <= PALM_ASPECT_LANDMARKS.length) return failed('tooFewLandmarks')
  }

  const evaluate = (k: number) => {
    const stretched = stretchProfileLaterally(template, k)
    if (!stretched) return null
    const fits = observations.map(observation =>
      fitProfileToView(stretched, observation, { landmarkIds, minConfidence: options.minConfidence }),
    )
    if (fits.some(fit => fit === null)) return null
    const residuals = fits.map(fit => fit!.mismatchRmsPx)
    return {
      cost: residuals.reduce((sum, value) => sum + value * value, 0),
      residuals,
      fits,
    }
  }

  let bestK = 1
  let bestCost = Number.POSITIVE_INFINITY
  for (let k = 0.7; k <= 1.4001; k += 0.025) {
    const value = evaluate(k)
    if (value && value.cost < bestCost) {
      bestCost = value.cost
      bestK = k
    }
  }
  if (!Number.isFinite(bestCost)) return failed('tooFewLandmarks')

  let low = bestK - 0.025
  let high = bestK + 0.025
  const ratio = (Math.sqrt(5) - 1) / 2
  const cost = (k: number) => evaluate(k)?.cost ?? Number.POSITIVE_INFINITY
  for (let i = 0; i < 60; i += 1) {
    const a = high - ratio * (high - low)
    const b = low + ratio * (high - low)
    if (cost(a) < cost(b)) high = b
    else low = a
  }
  const k = (low + high) / 2
  const final = evaluate(k)
  if (!final) return failed('degenerate')

  return {
    definition: 'profileShapeFit',
    stretch: k,
    residualPx: Math.sqrt(final.cost / observations.length),
    usedLandmarkIds: final.fits[0]!.usedLandmarkIds,
    rejectedLandmarkIds: [...new Set(final.fits.flatMap(fit => fit!.rejectedLandmarkIds))],
    perFrameResidualPx: final.residuals,
  }
}

/**
 * H2: the template's depths with the person's in-plane layout.
 *
 * Every landmark's position across and along the palm is taken from a
 * face-on observation, brought into the template's palm frame by a similarity
 * fit on the palm points; only the depth out of the palm comes from the
 * template. That is everything a single face-on photo can say about a hand,
 * so it is the most a 2D calibration can supply.
 */
export const personalizeInPlane = (
  template: HandProfile3D,
  observation: ScanObservation,
  options: CalibrationOptions = {},
): HandProfile3D | null => {
  const frame = palmFrame(template)
  const face = faceOnPalm(template)
  if (!frame || !face) return null
  const { points } = observedPalm(observation, options.minConfidence ?? 0.3)
  const ids = PALM_ASPECT_LANDMARKS.filter(id => points.has(id))
  if (ids.length < 3) return null

  // Similarity taking observed palm points onto the template's face-on palm.
  const source = ids.map(id => points.get(id)!)
  const target = ids.map(id => face.get(id)!)
  const mean = (list: Array<[number, number]>) => [
    list.reduce((sum, p) => sum + p[0], 0) / list.length,
    list.reduce((sum, p) => sum + p[1], 0) / list.length,
  ]
  const [sx, sy] = mean(source)
  const [tx, ty] = mean(target)
  let re = 0
  let im = 0
  let energy = 0
  source.forEach((p, i) => {
    const z = [p[0] - sx, p[1] - sy]
    const u = [target[i][0] - tx, target[i][1] - ty]
    re += z[0] * u[0] + z[1] * u[1]
    im += z[0] * u[1] - z[1] * u[0]
    energy += z[0] * z[0] + z[1] * z[1]
  })
  if (!(energy > 1e-18)) return null
  const a = re / energy
  const b = im / energy
  const toFace = (x: number, y: number): [number, number] => {
    const dx = x - sx
    const dy = y - sy
    return [a * dx - b * dy + tx, b * dx + a * dy + ty]
  }

  const byName = new Map(observation.landmarks.map(landmark => [landmark.name, landmark]))
  const landmarks = template.landmarks.map((point, index) => {
    const observed = byName.get(LANDMARK_NAMES[index])
    const offset = sub(point, frame.centre)
    const depth = dot(offset, frame.normal)
    if (!observed || observed.x === null || observed.y === null) return point
    const [lateral, longitudinal] = toFace(observed.x, -observed.y)
    return [
      frame.centre[0] + frame.lateral[0] * lateral + frame.longitudinal[0] * longitudinal + frame.normal[0] * depth,
      frame.centre[1] + frame.lateral[1] * lateral + frame.longitudinal[1] * longitudinal + frame.normal[1] * depth,
      frame.centre[2] + frame.lateral[2] * lateral + frame.longitudinal[2] * longitudinal + frame.normal[2] * depth,
    ] as Vec3
  })
  return handProfile(landmarks, template.handedness)
}
