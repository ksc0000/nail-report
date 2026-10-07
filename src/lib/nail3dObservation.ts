// Layer A — ScanObservation: what was actually seen in one 2D image.
//
// Nothing here is estimated. No depth, no 3D, no interpolation, no defaults
// standing in for measurements. Anything that could not be observed is named
// in `missing` instead of being filled in, so a later re-analysis can tell
// "not measured" apart from "measured as zero".
//
// The nail bed is NOT an anonymous point[4]. Each point is a named anatomical
// landmark, so a future pixel-mask generator can emit the same names and drop
// straight in where a person is annotating today.
//
// See docs/product/SCAN_OBSERVATION_CONTRACT.md.

import { FINGERS } from './nail3dContract.ts'
import type { Finger } from './nail3dContract.ts'

export const OBSERVATION_SCHEMA_VERSION = 1

// ---------------------------------------------------------------------------
// Semantic nail-bed landmarks
// ---------------------------------------------------------------------------

/**
 * Named points on the nail BED. Sides A/B are disambiguated by
 * `sideAToward`, so the names survive either hand.
 *
 * Each is something a person can point at and a mask can find:
 *  - cuticle*   : the proximal boundary, where the plate leaves the eponychium
 *  - freeEdge*  : the bed/free-edge boundary (the "smile line"), NOT the tip
 *  - bedWall*   : the lateral nail folds, halfway along the bed
 */
export const NAIL_BED_POINTS = [
  'cuticleSideA',
  'cuticleSideB',
  'freeEdgeSideA',
  'freeEdgeSideB',
  'cuticleApex',
  'bedWallSideA',
  'bedWallSideB',
] as const

export type NailBedPointName = (typeof NAIL_BED_POINTS)[number]

/** The four that define the bed. Without all four there is no socket. */
export const REQUIRED_BED_POINTS: readonly NailBedPointName[] = [
  'cuticleSideA',
  'cuticleSideB',
  'freeEdgeSideA',
  'freeEdgeSideB',
]

/**
 * Where a point came from.
 *
 * `skeletonPrior` is deliberately NOT allowed: a point derived from the hand
 * skeleton is an estimate, not an observation, and letting one into Layer A
 * is how a socket ends up measuring the skeleton instead of the nail.
 */
export const OBSERVED_POINT_SOURCES = ['manual', 'maskDerived'] as const
export type ObservedPointSource = (typeof OBSERVED_POINT_SOURCES)[number]

export interface ObservedPoint2D {
  /** Pixels, origin top-left, in the orientation-applied image. */
  x: number
  y: number
  confidence: number | null
  source: ObservedPointSource
}

export interface NailBedAnnotation {
  finger: Finger
  /** Which anatomical side "A" refers to. Lets a mask generator agree with a person. */
  sideAToward: 'thumb' | 'pinky'
  points: Partial<Record<NailBedPointName, ObservedPoint2D>>
  /**
   * Present only when the free edge was separately outlined. Never used for
   * the socket — recorded so a later analysis can check the separation.
   */
  freeEdgeOutline?: readonly (readonly [number, number])[]
}

export interface ObservedLandmark2D {
  name: string
  /** null when the detector did not report this joint. Never 0 as a stand-in. */
  x: number | null
  y: number | null
  confidence: number | null
}

export interface ObservationImage {
  width: number
  height: number
  exifOrientation: number
  coordinateOrigin: 'topLeft'
  units: 'pixels'
}

export interface ObservationCamera {
  focalLengthPx: number
  principalPointPx: readonly [number, number]
  source: 'avCameraCalibrationData' | 'exifDerived' | 'assumed'
}

export interface ScanObservation {
  schemaVersion: number
  captureId: string
  /** Captures sharing this were taken without re-presenting the hand. */
  sessionId: string
  handedness: 'left' | 'right'
  handednessSource: 'visionChirality' | 'userSelected' | 'assumed'
  image: ObservationImage
  camera?: ObservationCamera
  landmarks: readonly ObservedLandmark2D[]
  nails: readonly NailBedAnnotation[]
  /** Required. Names every field the producer could not supply. */
  missing: readonly string[]
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

export type ParseResult<T> = { ok: true; value: T } | { ok: false; errors: string[] }

/**
 * Keys that belong to a later layer. Seeing one here means raw observations
 * and derived values have been mixed, which breaks re-analysis — so it is an
 * error, not something to ignore.
 */
const FORBIDDEN_DERIVED_KEYS = [
  'landmarks3d',
  'handFrame',
  'bedQuads3d',
  'socket',
  'nailSocket',
  'normalizedSocket',
  'liftVersion',
  'depth',
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0

const isMember = <T extends string>(value: unknown, allowed: readonly T[]): value is T =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)

const parsePoint = (value: unknown, path: string, errors: string[]): ObservedPoint2D | null => {
  if (!isRecord(value)) {
    errors.push(`${path}: not an object`)
    return null
  }
  if (!isFiniteNumber(value.x) || !isFiniteNumber(value.y)) {
    errors.push(`${path}: x/y must be finite pixel coordinates`)
    return null
  }
  if (!isMember(value.source, OBSERVED_POINT_SOURCES)) {
    errors.push(
      `${path}: source must be one of ${OBSERVED_POINT_SOURCES.join(' | ')} ` +
        `(got ${String(value.source)}; a skeleton-derived point is an estimate, not an observation)`,
    )
    return null
  }
  const confidence = value.confidence
  if (confidence !== null && confidence !== undefined && !isFiniteNumber(confidence)) {
    errors.push(`${path}.confidence: must be a number or null`)
    return null
  }
  return {
    x: value.x,
    y: value.y,
    confidence: isFiniteNumber(confidence) ? confidence : null,
    source: value.source,
  }
}

const parseNail = (value: unknown, index: number, errors: string[]): NailBedAnnotation | null => {
  const path = `nails[${index}]`
  if (!isRecord(value)) {
    errors.push(`${path}: not an object`)
    return null
  }
  if (!isMember(value.finger, FINGERS)) {
    errors.push(`${path}.finger: unknown finger ${String(value.finger)}`)
    return null
  }
  if (!isMember(value.sideAToward, ['thumb', 'pinky'] as const)) {
    errors.push(`${path}.sideAToward: must be "thumb" or "pinky" so sides A/B are unambiguous`)
    return null
  }
  if (!isRecord(value.points)) {
    errors.push(`${path}.points: must be an object keyed by landmark name`)
    return null
  }

  const points: Partial<Record<NailBedPointName, ObservedPoint2D>> = {}
  for (const [key, raw] of Object.entries(value.points)) {
    if (!isMember(key, NAIL_BED_POINTS)) {
      errors.push(`${path}.points.${key}: not a known nail-bed landmark`)
      continue
    }
    const point = parsePoint(raw, `${path}.points.${key}`, errors)
    if (point) points[key] = point
  }

  for (const required of REQUIRED_BED_POINTS) {
    if (!points[required]) errors.push(`${path}.points.${required}: required and absent`)
  }

  const annotation: NailBedAnnotation = {
    finger: value.finger,
    sideAToward: value.sideAToward,
    points,
  }

  if (value.freeEdgeOutline !== undefined) {
    if (
      !Array.isArray(value.freeEdgeOutline) ||
      !value.freeEdgeOutline.every(
        point => Array.isArray(point) && point.length === 2 && point.every(isFiniteNumber),
      )
    ) {
      errors.push(`${path}.freeEdgeOutline: must be an array of [x, y] pairs`)
      return null
    }
    return {
      ...annotation,
      freeEdgeOutline: value.freeEdgeOutline.map(point => [point[0], point[1]] as const),
    }
  }
  return annotation
}

/**
 * Parses a Layer A observation.
 *
 * Returns every problem found rather than the first, so an annotation pass can
 * be corrected in one go.
 */
export const parseScanObservation = (input: unknown): ParseResult<ScanObservation> => {
  const errors: string[] = []
  if (!isRecord(input)) return { ok: false, errors: ['observation: not an object'] }

  for (const key of FORBIDDEN_DERIVED_KEYS) {
    if (key in input) {
      errors.push(
        `${key}: derived values must not be stored in Layer A ` +
          '(keep raw observations separable so the estimator can be replaced)',
      )
    }
  }

  if (input.schemaVersion !== OBSERVATION_SCHEMA_VERSION) {
    errors.push(`schemaVersion: expected ${OBSERVATION_SCHEMA_VERSION}, got ${String(input.schemaVersion)}`)
  }
  if (!isNonEmptyString(input.captureId)) errors.push('captureId: required')
  if (!isNonEmptyString(input.sessionId)) errors.push('sessionId: required (M5 needs it)')
  if (!isMember(input.handedness, ['left', 'right'] as const)) errors.push('handedness: must be left or right')
  if (!isMember(input.handednessSource, ['visionChirality', 'userSelected', 'assumed'] as const)) {
    errors.push('handednessSource: required')
  }

  const image = input.image
  if (!isRecord(image)) {
    errors.push('image: required')
  } else {
    if (!isFiniteNumber(image.width) || !isFiniteNumber(image.height)) errors.push('image: width/height required')
    if (image.coordinateOrigin !== 'topLeft') errors.push('image.coordinateOrigin: must be "topLeft"')
    if (image.units !== 'pixels') errors.push('image.units: must be "pixels" (normalizing is Layer B)')
    if (!isFiniteNumber(image.exifOrientation)) errors.push('image.exifOrientation: required')
  }

  let camera: ObservationCamera | undefined
  if (input.camera !== undefined) {
    const raw = input.camera
    if (
      !isRecord(raw) ||
      !isFiniteNumber(raw.focalLengthPx) ||
      !Array.isArray(raw.principalPointPx) ||
      raw.principalPointPx.length !== 2 ||
      !raw.principalPointPx.every(isFiniteNumber) ||
      !isMember(raw.source, ['avCameraCalibrationData', 'exifDerived', 'assumed'] as const)
    ) {
      errors.push('camera: malformed (omit it and list it in `missing` instead of guessing)')
    } else {
      camera = {
        focalLengthPx: raw.focalLengthPx,
        principalPointPx: [raw.principalPointPx[0], raw.principalPointPx[1]],
        source: raw.source,
      }
    }
  }

  const landmarks: ObservedLandmark2D[] = []
  if (!Array.isArray(input.landmarks)) {
    errors.push('landmarks: required array')
  } else {
    input.landmarks.forEach((raw, index) => {
      if (!isRecord(raw) || !isNonEmptyString(raw.name)) {
        errors.push(`landmarks[${index}]: needs a name`)
        return
      }
      const hasX = isFiniteNumber(raw.x)
      const hasY = isFiniteNumber(raw.y)
      if (hasX !== hasY) {
        errors.push(`landmarks[${index}]: x and y must both be present or both null`)
        return
      }
      landmarks.push({
        name: raw.name,
        x: hasX ? (raw.x as number) : null,
        y: hasY ? (raw.y as number) : null,
        confidence: isFiniteNumber(raw.confidence) ? raw.confidence : null,
      })
    })
  }

  const nails: NailBedAnnotation[] = []
  if (!Array.isArray(input.nails)) {
    errors.push('nails: required array')
  } else {
    input.nails.forEach((raw, index) => {
      const nail = parseNail(raw, index, errors)
      if (nail) nails.push(nail)
    })
  }

  if (!Array.isArray(input.missing) || !input.missing.every(isNonEmptyString)) {
    errors.push('missing: required array of field paths (use [] when nothing is missing)')
  }

  if (errors.length > 0) return { ok: false, errors }

  return {
    ok: true,
    value: {
      schemaVersion: OBSERVATION_SCHEMA_VERSION,
      captureId: input.captureId as string,
      sessionId: input.sessionId as string,
      handedness: input.handedness as 'left' | 'right',
      handednessSource: input.handednessSource as ScanObservation['handednessSource'],
      image: {
        width: (image as Record<string, number>).width,
        height: (image as Record<string, number>).height,
        exifOrientation: (image as Record<string, number>).exifOrientation,
        coordinateOrigin: 'topLeft',
        units: 'pixels',
      },
      ...(camera ? { camera } : {}),
      landmarks,
      nails,
      missing: input.missing as string[],
    },
  }
}

// ---------------------------------------------------------------------------
// Semantic points -> the ordered quad the geometry code expects
// ---------------------------------------------------------------------------

/**
 * Winding used by `estimateSocket`: proximal edge first, then distal.
 * Keeping the mapping in one place means the semantic names are the contract
 * and the ordering is an implementation detail of the estimator.
 */
export const BED_QUAD_ORDER: readonly NailBedPointName[] = [
  'cuticleSideA',
  'cuticleSideB',
  'freeEdgeSideB',
  'freeEdgeSideA',
]

/** The four bed corners in quad order, or null when any is missing. */
export const bedQuad2D = (
  annotation: NailBedAnnotation,
): [ObservedPoint2D, ObservedPoint2D, ObservedPoint2D, ObservedPoint2D] | null => {
  const quad = BED_QUAD_ORDER.map(name => annotation.points[name])
  if (quad.some(point => point === undefined)) return null
  return quad as [ObservedPoint2D, ObservedPoint2D, ObservedPoint2D, ObservedPoint2D]
}
