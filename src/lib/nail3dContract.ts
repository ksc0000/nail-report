// Canonical Nail Data (CND) contract v1 — parser and render-level planner.
//
// This module is the Web-side implementation of the contract defined in
// docs/product/CANONICAL_NAIL_DATA_CONTRACT.md. The contract is the shared
// boundary between the iOS Scan Engine (producer) and Web/R3F (consumer).
//
// It has no Firebase/React/DOM dependency on purpose: the same rules are
// verified against the platform-neutral fixtures in contracts/nail3d/v1.
//
// INV-3: an unknown contractVersion, malformed data, a missing HandProfile or
// an unavailable texture must degrade to a lower render level and must never
// throw. L0 means "show the photo record only" and is always a valid outcome.

export const NAIL3D_CONTRACT_VERSION = 1
export const MAX_SUPPORTED_CONTRACT_VERSION = 1

export const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const
export const NAIL_SHAPES = ['round', 'square', 'almond', 'coffin', 'stiletto'] as const
export const HANDEDNESS_VALUES = ['left', 'right'] as const
export const COMPLETENESS_VALUES = ['full', 'partial'] as const

export const BONE_LENGTH_COUNT = 20
export const FINGER_COUNT = 5

export type Finger = (typeof FINGERS)[number]
export type NailShape = (typeof NAIL_SHAPES)[number]
export type Handedness = (typeof HANDEDNESS_VALUES)[number]
export type Completeness = (typeof COMPLETENESS_VALUES)[number]

export type Vec2 = readonly [number, number]
export type Vec3 = readonly [number, number, number]
export type Mat3 = readonly number[]

export interface NailSocket {
  finger: Finger
  origin: Vec3
  normal: Vec3
  tangent: Vec3
  bedWidth: number
  bedLength: number
  confidence: number
}

export interface CanonicalPose {
  wristOrigin: Vec3
  palmNormal: Vec3
  palmTangent: Vec3
}

export interface HandProfileSource {
  deviceClass: string
  capturedAt: string
  sampleCount: number
}

export interface HandProfile {
  contractVersion: number
  reconstructionVersion: number
  handedness: Handedness
  boneLengths: readonly number[]
  fingerRadii: readonly number[]
  canonicalPose: CanonicalPose
  nailSockets: readonly NailSocket[]
  source: HandProfileSource
}

export interface NailGeometry {
  shape: NailShape
  curveV: number
  curveH: number
  length: number
  thickness: number
  confidence: number
  outline?: readonly Vec2[]
}

export interface NailTexture {
  textureRef: string
  uvTransform: Mat3
  heightMapRef?: string
  normalMapRef?: string
}

export interface NailEntry {
  socketRef: Finger
  geometry: NailGeometry
  texture: NailTexture
}

export interface NailSet {
  contractVersion: number
  reconstructionVersion: number
  handedness: Handedness
  handProfileRef: string
  nails: readonly NailEntry[]
  completeness: Completeness
  quality: { overall: number }
}

// ---------------------------------------------------------------------------
// Primitive guards. Everything takes `unknown`: inputs come from Firestore or
// from another platform's writer, so nothing may be assumed.
// ---------------------------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isUnitNumber = (value: unknown): value is number =>
  isFiniteNumber(value) && value >= 0 && value <= 1

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0

const isNumberArrayOfLength = (value: unknown, length: number): value is number[] =>
  Array.isArray(value) && value.length === length && value.every(isFiniteNumber)

const isMember = <T extends string>(value: unknown, allowed: readonly T[]): value is T =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)

const asVec3 = (value: unknown): Vec3 | null =>
  isNumberArrayOfLength(value, 3) ? ([value[0], value[1], value[2]] as Vec3) : null

// ---------------------------------------------------------------------------
// Object parsers. Each returns null instead of throwing, so a single bad field
// degrades the render level rather than breaking the record.
// ---------------------------------------------------------------------------

const parseNailSocket = (value: unknown): NailSocket | null => {
  if (!isRecord(value)) return null
  const origin = asVec3(value.origin)
  const normal = asVec3(value.normal)
  const tangent = asVec3(value.tangent)
  if (!origin || !normal || !tangent) return null
  if (!isMember(value.finger, FINGERS)) return null
  if (!isFiniteNumber(value.bedWidth) || value.bedWidth <= 0) return null
  if (!isFiniteNumber(value.bedLength) || value.bedLength <= 0) return null
  if (!isUnitNumber(value.confidence)) return null
  return {
    finger: value.finger,
    origin,
    normal,
    tangent,
    bedWidth: value.bedWidth,
    bedLength: value.bedLength,
    confidence: value.confidence,
  }
}

const parseCanonicalPose = (value: unknown): CanonicalPose | null => {
  if (!isRecord(value)) return null
  const wristOrigin = asVec3(value.wristOrigin)
  const palmNormal = asVec3(value.palmNormal)
  const palmTangent = asVec3(value.palmTangent)
  if (!wristOrigin || !palmNormal || !palmTangent) return null
  return { wristOrigin, palmNormal, palmTangent }
}

const parseSource = (value: unknown): HandProfileSource | null => {
  if (!isRecord(value)) return null
  if (!isNonEmptyString(value.deviceClass)) return null
  if (!isNonEmptyString(value.capturedAt)) return null
  if (!isPositiveInteger(value.sampleCount)) return null
  return {
    deviceClass: value.deviceClass,
    capturedAt: value.capturedAt,
    sampleCount: value.sampleCount,
  }
}

const parseGeometry = (value: unknown): NailGeometry | null => {
  if (!isRecord(value)) return null
  if (!isMember(value.shape, NAIL_SHAPES)) return null
  if (!isFiniteNumber(value.curveV)) return null
  if (!isFiniteNumber(value.curveH)) return null
  if (!isFiniteNumber(value.length) || value.length < 0) return null
  if (!isFiniteNumber(value.thickness) || value.thickness <= 0) return null
  if (!isUnitNumber(value.confidence)) return null

  const geometry: NailGeometry = {
    shape: value.shape,
    curveV: value.curveV,
    curveH: value.curveH,
    length: value.length,
    thickness: value.thickness,
    confidence: value.confidence,
  }

  // `outline` is optional, but a present-and-invalid outline is a producer bug.
  if (value.outline !== undefined) {
    if (!Array.isArray(value.outline)) return null
    const outline: Vec2[] = []
    for (const point of value.outline) {
      if (!isNumberArrayOfLength(point, 2)) return null
      outline.push([point[0], point[1]] as Vec2)
    }
    return { ...geometry, outline }
  }
  return geometry
}

const parseTexture = (value: unknown): NailTexture | null => {
  if (!isRecord(value)) return null
  if (!isNonEmptyString(value.textureRef)) return null
  if (!isNumberArrayOfLength(value.uvTransform, 9)) return null
  if (value.heightMapRef !== undefined && !isNonEmptyString(value.heightMapRef)) return null
  if (value.normalMapRef !== undefined && !isNonEmptyString(value.normalMapRef)) return null
  return {
    textureRef: value.textureRef,
    uvTransform: value.uvTransform,
    ...(value.heightMapRef !== undefined ? { heightMapRef: value.heightMapRef } : {}),
    ...(value.normalMapRef !== undefined ? { normalMapRef: value.normalMapRef } : {}),
  }
}

const parseNailEntry = (value: unknown): NailEntry | null => {
  if (!isRecord(value)) return null
  if (!isMember(value.socketRef, FINGERS)) return null
  const geometry = parseGeometry(value.geometry)
  const texture = parseTexture(value.texture)
  if (!geometry || !texture) return null
  return { socketRef: value.socketRef, geometry, texture }
}

const isSupportedVersion = (value: unknown, max: number): value is number =>
  isPositiveInteger(value) && value <= max

/**
 * Parses a HandProfile document. Returns null when absent, unsupported or
 * malformed — all of which the planner treats as "no HandProfile".
 */
export const parseHandProfile = (
  value: unknown,
  maxSupportedContractVersion: number = MAX_SUPPORTED_CONTRACT_VERSION,
): HandProfile | null => {
  if (!isRecord(value)) return null
  if (!isSupportedVersion(value.contractVersion, maxSupportedContractVersion)) return null
  if (!isPositiveInteger(value.reconstructionVersion)) return null
  if (!isMember(value.handedness, HANDEDNESS_VALUES)) return null
  if (!isNumberArrayOfLength(value.boneLengths, BONE_LENGTH_COUNT)) return null
  if (!isNumberArrayOfLength(value.fingerRadii, FINGER_COUNT)) return null

  const canonicalPose = parseCanonicalPose(value.canonicalPose)
  const source = parseSource(value.source)
  if (!canonicalPose || !source) return null

  if (!Array.isArray(value.nailSockets) || value.nailSockets.length === 0) return null
  if (value.nailSockets.length > FINGER_COUNT) return null
  const nailSockets: NailSocket[] = []
  const seen = new Set<Finger>()
  for (const raw of value.nailSockets) {
    const socket = parseNailSocket(raw)
    if (!socket || seen.has(socket.finger)) return null
    seen.add(socket.finger)
    nailSockets.push(socket)
  }

  return {
    contractVersion: value.contractVersion,
    reconstructionVersion: value.reconstructionVersion,
    handedness: value.handedness,
    boneLengths: value.boneLengths,
    fingerRadii: value.fingerRadii,
    canonicalPose,
    nailSockets,
    source,
  }
}

/**
 * Parses a NailSet document, assuming its contractVersion was already checked.
 * Returns null for malformed data.
 */
const parseNailSetBody = (value: Record<string, unknown>): NailSet | null => {
  if (!isPositiveInteger(value.reconstructionVersion)) return null
  if (!isMember(value.handedness, HANDEDNESS_VALUES)) return null
  if (!isNonEmptyString(value.handProfileRef)) return null
  if (!isMember(value.completeness, COMPLETENESS_VALUES)) return null
  if (!isRecord(value.quality) || !isUnitNumber(value.quality.overall)) return null

  if (!Array.isArray(value.nails) || value.nails.length === 0) return null
  if (value.nails.length > FINGER_COUNT) return null
  const nails: NailEntry[] = []
  const seen = new Set<Finger>()
  for (const raw of value.nails) {
    const nail = parseNailEntry(raw)
    if (!nail || seen.has(nail.socketRef)) return null
    seen.add(nail.socketRef)
    nails.push(nail)
  }

  // `completeness` must agree with the data, otherwise the producer is buggy
  // and we cannot trust the rest of the document.
  if (value.completeness === 'full' && nails.length !== FINGER_COUNT) return null
  if (value.completeness === 'partial' && nails.length === FINGER_COUNT) return null

  return {
    contractVersion: value.contractVersion as number,
    reconstructionVersion: value.reconstructionVersion,
    handedness: value.handedness,
    handProfileRef: value.handProfileRef,
    nails,
    completeness: value.completeness,
    quality: { overall: value.quality.overall },
  }
}

// ---------------------------------------------------------------------------
// Render-level planning (INV-3)
// ---------------------------------------------------------------------------

/**
 * L0 — photo only (always valid).
 * L1 — 2.5D from a height map; needs no HandProfile.
 * L2 — parametric NailSet placed on the HandProfile's sockets.
 *
 * L3 (hand + 10 nails) composes two L2 plans and is decided a level above
 * this function, which only ever sees one NailSet.
 */
export type RenderLevel = 'L0' | 'L1' | 'L2'

export type FallbackReason =
  | 'absent'
  | 'invalid-contract-version'
  | 'unsupported-contract-version'
  | 'malformed'
  | 'hand-profile-missing'
  | 'texture-unavailable'

export interface Nail3DPlanL0 {
  level: 'L0'
  reason: FallbackReason
  detail: string
}

export interface Nail3DPlanL1 {
  level: 'L1'
  reason: FallbackReason
  detail: string
  nailSet: NailSet
  nails: readonly NailEntry[]
  droppedFingers: readonly Finger[]
}

export interface Nail3DPlanL2 {
  level: 'L2'
  nailSet: NailSet
  handProfile: HandProfile
  nails: readonly NailEntry[]
  droppedFingers: readonly Finger[]
}

export type Nail3DPlan = Nail3DPlanL0 | Nail3DPlanL1 | Nail3DPlanL2

export interface Nail3DPlanInput {
  /** Raw `nailItems/{id}/nail3d/current` data, or null/undefined when absent. */
  nailSet: unknown
  /** Raw `handProfiles/{handedness}` data. Absent is a normal case (-> L1/L0). */
  handProfile?: unknown
  /** Storage refs known to be unfetchable (missing object, denied, offline). */
  unavailableRefs?: readonly string[]
  maxSupportedContractVersion?: number
}

const l0 = (reason: FallbackReason, detail: string): Nail3DPlanL0 => ({ level: 'L0', reason, detail })

const hasUsableHeightMap = (nails: readonly NailEntry[], unavailable: ReadonlySet<string>): boolean =>
  nails.some(
    nail => nail.texture.heightMapRef !== undefined && !unavailable.has(nail.texture.heightMapRef),
  )

const plan = (input: Nail3DPlanInput): Nail3DPlan => {
  const max = isPositiveInteger(input.maxSupportedContractVersion)
    ? input.maxSupportedContractVersion
    : MAX_SUPPORTED_CONTRACT_VERSION

  // 1. absent — a record without a 3D layer is a normal, complete record.
  if (input.nailSet === null || input.nailSet === undefined) {
    return l0('absent', 'no NailSet document')
  }
  if (!isRecord(input.nailSet)) {
    return l0('malformed', 'NailSet is not an object')
  }

  // 2/3. version gate before reading anything else.
  const version = input.nailSet.contractVersion
  if (!isPositiveInteger(version)) {
    return l0('invalid-contract-version', `contractVersion is not a positive integer: ${String(version)}`)
  }
  if (version > max) {
    return l0('unsupported-contract-version', `contractVersion ${version} > supported ${max}`)
  }

  // 4. shape validation.
  const nailSet = parseNailSetBody(input.nailSet)
  if (!nailSet) {
    return l0('malformed', 'NailSet failed validation')
  }

  // 5. canonical textures must be fetchable; a nail without its texture cannot
  //    be rendered, but the remaining nails still can.
  const unavailable = new Set(input.unavailableRefs ?? [])
  const withTexture = nailSet.nails.filter(nail => !unavailable.has(nail.texture.textureRef))
  const droppedForTexture = nailSet.nails
    .filter(nail => unavailable.has(nail.texture.textureRef))
    .map(nail => nail.socketRef)
  if (withTexture.length === 0) {
    return l0('texture-unavailable', 'no nail texture could be resolved')
  }

  // 6. HandProfile: absent, unsupported, malformed or mismatched all mean
  //    "cannot place nails in 3D" -> 2.5D when a height map exists, else L0.
  const handProfile = parseHandProfile(input.handProfile, max)
  const degradeToL1 = (detail: string): Nail3DPlan =>
    hasUsableHeightMap(withTexture, unavailable)
      ? {
          level: 'L1',
          reason: 'hand-profile-missing',
          detail,
          nailSet,
          nails: withTexture,
          droppedFingers: droppedForTexture,
        }
      : l0('hand-profile-missing', `${detail}; no usable height map for 2.5D`)

  if (!handProfile) {
    return degradeToL1('HandProfile absent, unsupported or malformed')
  }
  if (handProfile.handedness !== nailSet.handedness) {
    return degradeToL1(
      `handedness mismatch: profile=${handProfile.handedness} nailSet=${nailSet.handedness}`,
    )
  }

  // 7. every rendered nail needs its socket in the profile.
  const sockets = new Set(handProfile.nailSockets.map(socket => socket.finger))
  const placeable = withTexture.filter(nail => sockets.has(nail.socketRef))
  if (placeable.length === 0) {
    return degradeToL1('no NailSocket matches the NailSet entries')
  }

  const dropped = [
    ...droppedForTexture,
    ...withTexture.filter(nail => !sockets.has(nail.socketRef)).map(nail => nail.socketRef),
  ]
  return { level: 'L2', nailSet, handProfile, nails: placeable, droppedFingers: dropped }
}

/**
 * Decides how much of the 3D layer can be rendered. Never throws: any
 * unexpected input collapses to an L0 plan so the photo record stays usable.
 */
export const planNail3DRender = (input: Nail3DPlanInput): Nail3DPlan => {
  try {
    return plan(input)
  } catch (error) {
    return l0('malformed', `unexpected parse error: ${String(error)}`)
  }
}
