// NailSocket estimation in a canonical, scale-normalized hand frame.
//
// PoC stage 1 (#405): synthetic only. This module deliberately produces
// NORMALIZED sockets, never the contract's `NailSocket`, whose bedWidth and
// bedLength are defined in metres. A single monocular capture cannot recover
// absolute scale, so everything here is expressed in units of the finger's
// proximal phalanx length. Converting to metres is a separate, unsolved
// problem and there is intentionally no function here that does it.
//
// See docs/product/NAIL_SOCKET_POC_PLAN.md.

import {
  angleBetweenDeg,
  cross,
  distance,
  midpoint,
  normalize,
  orthonormalBasis,
  scale,
  sub,
  toBasisCoords,
  toBasisDirection,
} from './vec3.ts'
import type { OrthonormalBasis, Vec3 } from './vec3.ts'
import { FINGERS } from './nail3dContract.ts'
import type { Finger } from './nail3dContract.ts'

/** 21-point hand landmark layout (MediaPipe / Vision compatible ordering). */
export const LANDMARK_COUNT = 21
export const WRIST = 0

/** [MCP, PIP, DIP, TIP] landmark indices per finger. */
export const FINGER_LANDMARKS: Record<Finger, readonly [number, number, number, number]> = {
  thumb: [1, 2, 3, 4],
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20],
}

const INDEX_MCP = FINGER_LANDMARKS.index[0]
const PINKY_MCP = FINGER_LANDMARKS.pinky[0]

/**
 * Nail BED corners, ordered proximal edge first (cuticle side):
 * [proximalA, proximalB, distalB, distalA].
 *
 * These must be the nail *bed* — where the nail meets the finger — not the
 * free edge. The bed does not move when the nail grows or is extended; the
 * free edge does. Feeding a full nail outline here makes the socket move
 * whenever the nail changes, which is exactly what M6 exists to catch.
 */
export type NailBedCorners = readonly [Vec3, Vec3, Vec3, Vec3]

export interface CanonicalHandFrame {
  origin: Vec3
  basis: OrthonormalBasis
  /** Proximal phalanx length in input units; all lengths are divided by this. */
  scaleReferenceLength: number
}

/**
 * A socket expressed in the canonical hand frame, in normalized units.
 *
 * Deliberately NOT the contract's `NailSocket`: the `units` tag exists so a
 * normalized value can never be mistaken for the metre-valued contract type.
 */
export interface NormalizedNailSocket {
  readonly units: 'normalized'
  readonly scaleReference: 'proximalPhalanx'
  finger: Finger
  origin: Vec3
  normal: Vec3
  tangent: Vec3
  bedWidth: number
  bedLength: number
}

export interface SocketObservation {
  socket: NormalizedNailSocket
  frame: CanonicalHandFrame
  /** All 21 landmarks expressed in the canonical frame (used by M0). */
  canonicalLandmarks: Vec3[]
}

const isVec3 = (value: unknown): value is Vec3 =>
  Array.isArray(value) && value.length === 3 && value.every(n => typeof n === 'number' && Number.isFinite(n))

const validLandmarks = (landmarks: readonly Vec3[]): boolean =>
  landmarks.length === LANDMARK_COUNT && landmarks.every(isVec3)

/**
 * Builds the canonical frame for one finger.
 *
 * - origin: that finger's MCP
 * - +y: the finger axis (MCP -> PIP)
 * - +z: the palm normal, re-orthogonalized against +y
 * - scale: the proximal phalanx length
 *
 * The palm normal uses wrist / index MCP / pinky MCP rather than the finger's
 * own landmarks, so a single noisy fingertip cannot rotate the whole frame.
 *
 * Rigid motion of the hand moves the frame with it, so a socket expressed in
 * this frame is invariant to translation, rotation and uniform scale.
 */
export const buildCanonicalHandFrame = (
  landmarks: readonly Vec3[],
  finger: Finger,
): CanonicalHandFrame | null => {
  if (!validLandmarks(landmarks)) return null
  const [mcp, pip] = FINGER_LANDMARKS[finger]

  const fingerAxis = sub(landmarks[pip], landmarks[mcp])
  const scaleReferenceLength = distance(landmarks[pip], landmarks[mcp])
  if (!(scaleReferenceLength > 1e-9)) return null

  const palmNormal = cross(
    sub(landmarks[INDEX_MCP], landmarks[WRIST]),
    sub(landmarks[PINKY_MCP], landmarks[WRIST]),
  )
  const basis = orthonormalBasis(fingerAxis, palmNormal)
  if (!basis) return null

  return { origin: landmarks[mcp], basis, scaleReferenceLength }
}

/** Newell's method: a plane normal that tolerates corners not being exactly planar. */
const planeNormal = (corners: NailBedCorners): Vec3 | null => {
  let nx = 0
  let ny = 0
  let nz = 0
  for (let i = 0; i < corners.length; i += 1) {
    const current = corners[i]
    const next = corners[(i + 1) % corners.length]
    nx += (current[1] - next[1]) * (current[2] + next[2])
    ny += (current[2] - next[2]) * (current[0] + next[0])
    nz += (current[0] - next[0]) * (current[1] + next[1])
  }
  return normalize([nx, ny, nz])
}

/**
 * Estimates the socket for one finger from landmarks and nail BED corners.
 *
 * This is the baseline estimator: the socket is read from the corners with no
 * skeletal constraint beyond the frame. Constraining it to the bone (fallback
 * F2 in the PoC plan) is a later variant to be compared against this one.
 *
 * Returns null when the inputs cannot produce a frame or a non-degenerate
 * quad, so the caller drops the observation instead of recording a guess.
 */
export const estimateSocket = (
  landmarks: readonly Vec3[],
  corners: NailBedCorners,
  finger: Finger,
): SocketObservation | null => {
  const frame = buildCanonicalHandFrame(landmarks, finger)
  if (!frame) return null
  return socketInFrame(frame, landmarks, corners, finger)
}

/**
 * The socket read from bed corners in a GIVEN frame.
 *
 * `estimateSocket` is this with the standard MCP -> PIP frame. Stage 9 feeds
 * other frame definitions through the same arithmetic, so that any difference
 * in the result comes from the frame and from nothing else.
 */
export const socketInFrame = (
  frame: CanonicalHandFrame,
  landmarks: readonly Vec3[],
  corners: NailBedCorners,
  finger: Finger,
): SocketObservation | null => {
  if (!corners.every(isVec3)) return null
  if (!(frame.scaleReferenceLength > 1e-9)) return null

  const [proximalA, proximalB, distalB, distalA] = corners
  const proximalMid = midpoint(proximalA, proximalB)
  const distalMid = midpoint(distalA, distalB)

  const tangentWorld = normalize(sub(distalMid, proximalMid))
  const widthWorld = distance(proximalA, proximalB)
  const bedLengthWorld = distance(distalMid, proximalMid)
  if (!tangentWorld || !(widthWorld > 1e-9) || !(bedLengthWorld > 1e-9)) return null

  let normalWorld = planeNormal(corners)
  if (!normalWorld) return null
  // The nail faces away from the palm: align the plane normal with the frame's
  // +z (dorsal) direction so corner winding cannot flip it.
  if (toBasisDirection(normalWorld, frame.basis)[2] < 0) normalWorld = scale(normalWorld, -1)

  const invScale = 1 / frame.scaleReferenceLength
  const originCanonical = toBasisCoords(proximalMid, frame.origin, frame.basis)

  const socket: NormalizedNailSocket = {
    units: 'normalized',
    scaleReference: 'proximalPhalanx',
    finger,
    origin: scale(originCanonical, invScale),
    normal: toBasisDirection(normalWorld, frame.basis),
    tangent: toBasisDirection(tangentWorld, frame.basis),
    bedWidth: widthWorld * invScale,
    bedLength: bedLengthWorld * invScale,
  }

  const canonicalLandmarks = landmarks.map(point =>
    scale(toBasisCoords(point, frame.origin, frame.basis), invScale),
  )

  return { socket, frame, canonicalLandmarks }
}

/** Angular difference between two sockets' normals, in degrees. */
export const normalAngleDeg = (a: NormalizedNailSocket, b: NormalizedNailSocket): number | null =>
  angleBetweenDeg(a.normal, b.normal)

/** Angular difference between two sockets' tangents, in degrees. */
export const tangentAngleDeg = (a: NormalizedNailSocket, b: NormalizedNailSocket): number | null =>
  angleBetweenDeg(a.tangent, b.tangent)

/**
 * Origin displacement between two sockets, as a fraction of the reference
 * socket's bed length — the unit the perceptual threshold is calibrated in.
 */
export const originOffsetRatio = (
  socket: NormalizedNailSocket,
  reference: NormalizedNailSocket,
): number => distance(socket.origin, reference.origin) / reference.bedLength

export const isFinger = (value: unknown): value is Finger =>
  typeof value === 'string' && (FINGERS as readonly string[]).includes(value)
