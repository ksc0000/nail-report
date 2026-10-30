// Socket stability metrics M0-M6 (#405 PoC stage 1).
//
// The purpose of this stage is NOT to show that sockets are stable — synthetic
// sockets trivially are. It is to show the evaluator *detects error of a known
// size*, so that a number coming out of real photos can be believed.
//
// Every test therefore injects a known fault and asserts the metric reports it.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { estimateSocket, originOffsetRatio, normalAngleDeg, tangentAngleDeg } from '../src/lib/nail3dSocket.ts'
import type { NailBedCorners, SocketObservation } from '../src/lib/nail3dSocket.ts'
import { computeStability, swapInvariance } from '../src/lib/nail3dStability.ts'
import type { Capture } from '../src/lib/nail3dStability.ts'
import type { Vec3 } from '../src/lib/vec3.ts'
import { shiftBedCorners, syntheticHand, tiltBedCorners } from './support/syntheticHand.ts'

type Options = Parameters<typeof syntheticHand>[0]

/**
 * "Zero" for an angle, in degrees. acos loses precision near 1, so two
 * directions that are identical to double precision still come back a few
 * 1e-6 degrees apart. Anything below this is numerically indistinguishable
 * from no rotation at all.
 */
const ANGLE_EPS_DEG = 1e-4

const observeWith = (corners: NailBedCorners, landmarks: readonly Vec3[]): SocketObservation => {
  const observation = estimateSocket(landmarks, corners, 'index')
  assert.ok(observation, 'estimateSocket returned null')
  return observation
}

const observe = (options: Options = {}): SocketObservation => {
  const hand = syntheticHand(options)
  return observeWith(hand.bedCorners.index, hand.landmarks)
}

/** n captures across s sessions, differing only by the given noise. */
const captureSet = (sessions: number, frames: number, options: Options = {}): Capture[] => {
  const captures: Capture[] = []
  let seed = 1
  for (let session = 0; session < sessions; session += 1) {
    for (let frame = 0; frame < frames; frame += 1) {
      seed += 1
      captures.push({
        sessionId: `s${session}`,
        observation: observe({ ...options, seed }),
      })
    }
  }
  return captures
}

const report = (captures: Capture[]) => {
  const result = computeStability(captures)
  assert.ok(result, 'computeStability returned null')
  return result
}

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

test('computeStability refuses fewer than two captures rather than reporting zero', () => {
  assert.equal(computeStability([]), null)
  assert.equal(computeStability([{ sessionId: 's0', observation: observe() }]), null)
})

test('identical captures report no scatter', () => {
  const observation = observe()
  const result = report([
    { sessionId: 's0', observation },
    { sessionId: 's1', observation },
  ])
  assert.ok(result.m0CanonicalFrame.rms < 1e-12)
  assert.ok(result.m1Origin.rms < 1e-12)
  assert.ok(result.m2Normal.rms < ANGLE_EPS_DEG)
  assert.ok(result.m3Tangent.rms < ANGLE_EPS_DEG)
  assert.ok(result.m4Dimensions.bedLengthCv < 1e-12)
})

test('metrics are invariant to rigid motion between captures', () => {
  // The hand being somewhere else is not instability.
  const captures: Capture[] = [
    { sessionId: 's0', observation: observe() },
    { sessionId: 's1', observation: observe({ pose: { translation: [25, -9, 4] as Vec3 } }) },
    { sessionId: 's2', observation: observe({ pose: { rotationAxis: [0.1, 0.9, 0.4] as Vec3, rotationDeg: 140 } }) },
    { sessionId: 's3', observation: observe({ pose: { scale: 9 } }) },
  ]
  const result = report(captures)
  assert.ok(result.m0CanonicalFrame.rms < 1e-9, `M0=${result.m0CanonicalFrame.rms}`)
  assert.ok(result.m1Origin.rms < 1e-9, `M1=${result.m1Origin.rms}`)
  assert.ok(result.m2Normal.rms < ANGLE_EPS_DEG, `M2=${result.m2Normal.rms}`)
})

// ---------------------------------------------------------------------------
// Injected displacement: 2 / 5 / 10 / 20%
// ---------------------------------------------------------------------------

for (const ratio of [0.02, 0.05, 0.1, 0.2]) {
  test(`a ${ratio * 100}% origin shift is reported at its true size`, () => {
    const hand = syntheticHand()
    const clean = observeWith(hand.bedCorners.index, hand.landmarks)
    const shifted = observeWith(shiftBedCorners(hand.bedCorners.index, ratio), hand.landmarks)

    const measured = originOffsetRatio(shifted.socket, clean.socket)
    assert.ok(
      Math.abs(measured - ratio) < ratio * 0.02,
      `injected ${ratio}, measured ${measured}`,
    )

    // A shift along the bed's own width leaves orientation and size alone,
    // so the other metrics must stay quiet.
    assert.ok((normalAngleDeg(shifted.socket, clean.socket) ?? 99) < ANGLE_EPS_DEG)
    assert.ok((tangentAngleDeg(shifted.socket, clean.socket) ?? 99) < ANGLE_EPS_DEG)
    assert.ok(Math.abs(shifted.socket.bedLength - clean.socket.bedLength) < 1e-9)

    // M1 over a balanced pair is the scatter about the midpoint, i.e. half.
    const result = report([
      { sessionId: 's0', observation: clean },
      { sessionId: 's1', observation: shifted },
    ])
    assert.ok(
      Math.abs(result.m1Origin.rms - ratio / 2) < ratio * 0.02,
      `M1=${result.m1Origin.rms}, expected ~${ratio / 2}`,
    )
  })
}

test('M1 grows monotonically with the injected shift', () => {
  const hand = syntheticHand()
  const clean = observeWith(hand.bedCorners.index, hand.landmarks)
  let previous = -1
  for (const ratio of [0.02, 0.05, 0.1, 0.2]) {
    const shifted = observeWith(shiftBedCorners(hand.bedCorners.index, ratio), hand.landmarks)
    const measured = report([
      { sessionId: 's0', observation: clean },
      { sessionId: 's1', observation: shifted },
    ]).m1Origin.rms
    assert.ok(measured > previous, `M1 did not grow at ratio ${ratio}`)
    previous = measured
  }
})

// ---------------------------------------------------------------------------
// Injected tilt
// ---------------------------------------------------------------------------

for (const degrees of [2, 5, 10, 20]) {
  test(`a ${degrees} degree tilt is reported at its true size`, () => {
    const hand = syntheticHand()
    const clean = observeWith(hand.bedCorners.index, hand.landmarks)
    const tilted = observeWith(tiltBedCorners(hand.bedCorners.index, degrees), hand.landmarks)

    const measured = normalAngleDeg(tilted.socket, clean.socket)
    assert.ok(measured !== null)
    assert.ok(Math.abs(measured - degrees) < 0.05, `injected ${degrees}deg, measured ${measured}`)

    // Tilting about the proximal edge pivots the quad, so the origin stays put.
    assert.ok(originOffsetRatio(tilted.socket, clean.socket) < 1e-9)
  })
}

// ---------------------------------------------------------------------------
// Noise: which metric moves tells you where the error came from
// ---------------------------------------------------------------------------

test('corner noise disturbs the socket but not the canonical frame', () => {
  // Landmarks are untouched, so M0 must stay exactly zero while M1 rises.
  const quiet = report(captureSet(3, 3, { cornerNoise: 0.01 }))
  const loud = report(captureSet(3, 3, { cornerNoise: 0.06 }))

  assert.ok(quiet.m0CanonicalFrame.rms < 1e-12, `M0 should be 0, got ${quiet.m0CanonicalFrame.rms}`)
  assert.ok(loud.m0CanonicalFrame.rms < 1e-12)
  assert.ok(loud.m1Origin.rms > quiet.m1Origin.rms * 2, 'M1 did not scale with corner noise')
  assert.ok(loud.m2Normal.rms > quiet.m2Normal.rms, 'M2 did not scale with corner noise')
})

test('landmark noise disturbs the canonical frame, and M0 reports it', () => {
  const quiet = report(captureSet(3, 3, { landmarkNoise: 0.005 }))
  const loud = report(captureSet(3, 3, { landmarkNoise: 0.03 }))

  assert.ok(quiet.m0CanonicalFrame.rms > 0, 'M0 stayed zero despite landmark noise')
  assert.ok(loud.m0CanonicalFrame.rms > quiet.m0CanonicalFrame.rms * 2, 'M0 did not scale with noise')
  assert.ok(loud.m1Origin.rms > quiet.m1Origin.rms, 'M1 did not scale with landmark noise')
})

test('p95 is at least the rms, and both rise together', () => {
  const result = report(captureSet(3, 3, { cornerNoise: 0.04 }))
  assert.ok(result.m1Origin.p95 >= result.m1Origin.rms * 0.9)
  assert.ok(result.m2Normal.p95 >= result.m2Normal.rms * 0.9)
})

// ---------------------------------------------------------------------------
// M5: within-session vs between-session
// ---------------------------------------------------------------------------

test('M5 attributes per-frame jitter to within-session scatter', () => {
  const result = report(captureSet(4, 4, { cornerNoise: 0.03 }))
  assert.equal(result.sessionCount, 4)
  assert.equal(result.captureCount, 16)
  // All sessions are drawn from the same distribution, so session means sit
  // close together: the scatter is inside sessions, not between them.
  assert.ok(
    result.m5Decomposition.ratio < 1,
    `expected intra-dominated, got ratio ${result.m5Decomposition.ratio}`,
  )
})

test('M5 attributes a per-session bias to between-session scatter', () => {
  const hand = syntheticHand()
  const captures: Capture[] = []
  // Each session is offset by a different amount; frames inside a session
  // differ only by a trace of jitter.
  const sessionBias = [0, 0.08, -0.06, 0.12]
  sessionBias.forEach((bias, session) => {
    for (let frame = 0; frame < 3; frame += 1) {
      const corners = shiftBedCorners(hand.bedCorners.index, bias + frame * 0.0005)
      captures.push({
        sessionId: `s${session}`,
        observation: observeWith(corners, hand.landmarks),
      })
    }
  })

  const result = report(captures)
  assert.ok(
    result.m5Decomposition.ratio > 3,
    `expected inter-dominated, got ratio ${result.m5Decomposition.ratio}`,
  )
  assert.ok(result.m5Decomposition.interSession > result.m5Decomposition.intraSession)
})

// ---------------------------------------------------------------------------
// M6: the product claim — the socket must not move when the nail changes
// ---------------------------------------------------------------------------

test('M6 is clean when the socket is read from the nail BED', () => {
  const short = syntheticHand({ freeEdgeFraction: 0 })
  const long = syntheticHand({ freeEdgeFraction: 0.9 })

  const before = observeWith(short.bedCorners.index, short.landmarks)
  const after = observeWith(long.bedCorners.index, long.landmarks)

  const result = swapInvariance(before, after)
  assert.ok(result)
  assert.ok(result.originRatio < 1e-9, `origin moved: ${result.originRatio}`)
  assert.ok(result.normalDeg < ANGLE_EPS_DEG, `normal turned: ${result.normalDeg}`)
  assert.ok(result.bedLengthRatio < 1e-9, `bedLength changed: ${result.bedLengthRatio}`)
})

test('M6 catches a socket read from the FULL nail outline instead of the bed', () => {
  // The failure mode the metric exists for: if the free edge is included, a
  // longer nail inflates the bed and tilts the fitted plane, so the "hand"
  // silently changes whenever the nail does.
  const short = syntheticHand({ freeEdgeFraction: 0 })
  const long = syntheticHand({ freeEdgeFraction: 0.9 })

  const before = observeWith(short.fullNailCorners.index, short.landmarks)
  const after = observeWith(long.fullNailCorners.index, long.landmarks)

  const result = swapInvariance(before, after)
  assert.ok(result)
  assert.ok(result.bedLengthRatio > 0.5, `bedLength barely moved: ${result.bedLengthRatio}`)
  assert.ok(result.normalDeg > 5, `plane barely tilted: ${result.normalDeg}`)
})

test('M6 refuses to compare sockets from different fingers', () => {
  const hand = syntheticHand()
  const index = observeWith(hand.bedCorners.index, hand.landmarks)
  const ring = estimateSocket(hand.landmarks, hand.bedCorners.ring, 'ring')
  assert.ok(ring)
  assert.equal(swapInvariance(index, ring), null)
})

test('M6 reports an injected shift at its true size', () => {
  const hand = syntheticHand()
  const before = observeWith(hand.bedCorners.index, hand.landmarks)
  const after = observeWith(shiftBedCorners(hand.bedCorners.index, 0.07), hand.landmarks)

  const result = swapInvariance(before, after)
  assert.ok(result)
  assert.ok(Math.abs(result.originRatio - 0.07) < 0.07 * 0.02, `measured ${result.originRatio}`)
})
