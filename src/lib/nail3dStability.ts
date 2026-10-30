// Socket stability metrics M0-M6 for the #405 PoC.
//
// Everything is computed in the canonical hand frame and in normalized units
// (fractions of the proximal phalanx length), so the numbers are invariant to
// where the hand was, how it was rotated, and how large it appeared.
//
// M0 and M5 are diagnostic: they say *why* a socket is unstable, which decides
// which fallback to reach for. M1-M4 are the CI-checkable proxies for the
// perceptual judgement, and M6 tests the product claim directly.
//
// See docs/product/NAIL_SOCKET_POC_PLAN.md §3.

import { distance, mean, normalize, sub } from './vec3.ts'
import type { Vec3 } from './vec3.ts'
import { normalAngleDeg, tangentAngleDeg } from './nail3dSocket.ts'
import type { NormalizedNailSocket, SocketObservation } from './nail3dSocket.ts'

export interface Capture {
  /** Captures sharing a sessionId were taken without re-presenting the hand. */
  sessionId: string
  observation: SocketObservation
}

export interface Spread {
  rms: number
  p95: number
}

export interface StabilityReport {
  captureCount: number
  sessionCount: number
  /** M0 — does the hand look the same in its own frame? Normalized units. */
  m0CanonicalFrame: Spread
  /** M1 — socket origin scatter, as a fraction of bed length. */
  m1Origin: Spread
  /** M2 — nail-surface normal scatter, in degrees. */
  m2Normal: Spread
  /** M3 — finger-axis scatter, in degrees. */
  m3Tangent: Spread
  /** M4 — coefficient of variation of the bed dimensions. */
  m4Dimensions: { bedWidthCv: number; bedLengthCv: number }
  /** M5 — within-session vs between-session origin scatter. */
  m5Decomposition: {
    intraSession: number
    interSession: number
    /** interSession / intraSession. Large means the frame, not the detector. */
    ratio: number
  }
}

export interface SwapInvariance {
  /** M6 — origin displacement as a fraction of the reference bed length. */
  originRatio: number
  normalDeg: number
  tangentDeg: number
  bedWidthRatio: number
  bedLengthRatio: number
}

const rms = (values: readonly number[]): number => {
  if (values.length === 0) return 0
  const total = values.reduce((sum, value) => sum + value * value, 0)
  return Math.sqrt(total / values.length)
}

/** Nearest-rank p95; with few samples this is the worst or near-worst value. */
const p95 = (values: readonly number[]): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.max(1, Math.ceil(0.95 * sorted.length))
  return sorted[rank - 1]
}

const spreadOf = (values: readonly number[]): Spread => ({ rms: rms(values), p95: p95(values) })

const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length

const coefficientOfVariation = (values: readonly number[]): number => {
  if (values.length === 0) return 0
  const avg = average(values)
  if (!(Math.abs(avg) > 1e-12)) return 0
  const variance = average(values.map(value => (value - avg) ** 2))
  return Math.sqrt(variance) / Math.abs(avg)
}

/** Mean direction of a set of unit vectors; null if they cancel out. */
const meanDirection = (directions: readonly Vec3[]): Vec3 | null => {
  const summed = mean(directions)
  return summed ? normalize(summed) : null
}

const angleSpread = (
  sockets: readonly NormalizedNailSocket[],
  reference: NormalizedNailSocket,
  angleFn: (a: NormalizedNailSocket, b: NormalizedNailSocket) => number | null,
): Spread => {
  const angles: number[] = []
  for (const socket of sockets) {
    const angle = angleFn(socket, reference)
    if (angle !== null) angles.push(angle)
  }
  return spreadOf(angles)
}

/** Builds a synthetic reference socket carrying only the averaged directions. */
const referenceWithDirections = (
  base: NormalizedNailSocket,
  normal: Vec3,
  tangent: Vec3,
): NormalizedNailSocket => ({ ...base, normal, tangent })

/**
 * Computes M0-M5 over a set of captures.
 *
 * Returns null for fewer than two captures: a single observation has no
 * scatter to report, and returning zeros would read as "perfectly stable".
 */
export const computeStability = (captures: readonly Capture[]): StabilityReport | null => {
  if (captures.length < 2) return null

  const observations = captures.map(capture => capture.observation)
  const sockets = observations.map(observation => observation.socket)

  // --- M0: spread of every landmark in its own canonical frame -------------
  const landmarkCount = observations[0].canonicalLandmarks.length
  const consistent = observations.every(
    observation => observation.canonicalLandmarks.length === landmarkCount,
  )
  if (!consistent || landmarkCount === 0) return null

  const landmarkSpreads: number[] = []
  for (let index = 0; index < landmarkCount; index += 1) {
    const points = observations.map(observation => observation.canonicalLandmarks[index])
    const centre = mean(points)
    if (!centre) continue
    landmarkSpreads.push(rms(points.map(point => distance(point, centre))))
  }

  // --- M1: origin scatter, normalized by bed length ------------------------
  const origins = sockets.map(socket => socket.origin)
  const originCentre = mean(origins)
  if (!originCentre) return null
  const bedLengths = sockets.map(socket => socket.bedLength)
  const referenceBedLength = average(bedLengths)
  const originOffsets =
    referenceBedLength > 1e-12
      ? origins.map(origin => distance(origin, originCentre) / referenceBedLength)
      : origins.map(() => 0)

  // --- M2 / M3: direction scatter about the mean direction -----------------
  const normalMean = meanDirection(sockets.map(socket => socket.normal))
  const tangentMean = meanDirection(sockets.map(socket => socket.tangent))
  const reference = referenceWithDirections(
    sockets[0],
    normalMean ?? sockets[0].normal,
    tangentMean ?? sockets[0].tangent,
  )

  // --- M5: within-session vs between-session -------------------------------
  const bySession = new Map<string, Vec3[]>()
  for (const capture of captures) {
    const list = bySession.get(capture.sessionId) ?? []
    list.push(capture.observation.socket.origin)
    bySession.set(capture.sessionId, list)
  }

  const intraOffsets: number[] = []
  const sessionCentres: Vec3[] = []
  for (const sessionOrigins of bySession.values()) {
    const centre = mean(sessionOrigins)
    if (!centre) continue
    sessionCentres.push(centre)
    for (const origin of sessionOrigins) {
      intraOffsets.push(distance(origin, centre) / Math.max(referenceBedLength, 1e-12))
    }
  }
  const overallCentre = mean(sessionCentres) ?? originCentre
  const interOffsets = sessionCentres.map(
    centre => distance(centre, overallCentre) / Math.max(referenceBedLength, 1e-12),
  )
  const intraSession = rms(intraOffsets)
  const interSession = rms(interOffsets)

  return {
    captureCount: captures.length,
    sessionCount: bySession.size,
    m0CanonicalFrame: spreadOf(landmarkSpreads),
    m1Origin: spreadOf(originOffsets),
    m2Normal: angleSpread(sockets, reference, normalAngleDeg),
    m3Tangent: angleSpread(sockets, reference, tangentAngleDeg),
    m4Dimensions: {
      bedWidthCv: coefficientOfVariation(sockets.map(socket => socket.bedWidth)),
      bedLengthCv: coefficientOfVariation(bedLengths),
    },
    m5Decomposition: {
      intraSession,
      interSession,
      ratio: intraSession > 1e-12 ? interSession / intraSession : Infinity,
    },
  }
}

/**
 * M6 — does the socket stay put when the nail itself changes?
 *
 * `before` and `after` are observations of the same finger with a different
 * nail on it. The socket is the nail *bed*, so it must not move. This is the
 * product claim of Personal Hand Base + Replaceable Nail Set stated as a
 * measurement.
 */
export const swapInvariance = (
  before: SocketObservation,
  after: SocketObservation,
): SwapInvariance | null => {
  const a = before.socket
  const b = after.socket
  if (a.finger !== b.finger) return null
  if (!(a.bedLength > 1e-12) || !(a.bedWidth > 1e-12)) return null

  const normalDeg = normalAngleDeg(a, b)
  const tangentDeg = tangentAngleDeg(a, b)
  if (normalDeg === null || tangentDeg === null) return null

  return {
    originRatio: distance(sub(b.origin, a.origin), [0, 0, 0]) / a.bedLength,
    normalDeg,
    tangentDeg,
    bedWidthRatio: Math.abs(b.bedWidth - a.bedWidth) / a.bedWidth,
    bedLengthRatio: Math.abs(b.bedLength - a.bedLength) / a.bedLength,
  }
}
