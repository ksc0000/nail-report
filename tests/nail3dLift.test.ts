// Layer B — 2D observation -> canonical 3D -> NormalizedNailSocket -> M0-M6.
//
// The chain is exercised end to end on synthetic data, where the 3D truth is
// known but only its 2D projection reaches the lift. That makes two different
// things measurable:
//
//   repeatability — does the same hand photographed under independent
//                   conditions produce the same socket? (the PoC's real question)
//   lift bias     — how far is the reconstruction from the 3D it came from?
//                   (a separate question, which repeatability cannot see)
//
// A lift can be perfectly repeatable and consistently wrong. Both are checked.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  LANDMARK_NAMES,
  liftObservation,
  measureLiftBias,
  minimumTiltDepths,
  socketObservationsFrom,
} from '../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { computeStability, swapInvariance } from '../src/lib/nail3dStability.ts'
import type { Capture } from '../src/lib/nail3dStability.ts'
import { originOffsetRatio, normalAngleDeg } from '../src/lib/nail3dSocket.ts'
import type { SocketObservation } from '../src/lib/nail3dSocket.ts'
import type { Vec3 } from '../src/lib/vec3.ts'
import { syntheticHand } from './support/syntheticHand.ts'
import type { SyntheticOptions } from './support/syntheticHand.ts'
import { DEFAULT_CAMERA, projectToObservation, truthBed } from './support/syntheticProjection.ts'
import type { CameraSetup } from './support/syntheticProjection.ts'

const ANGLE_EPS_DEG = 1e-4

/** One capture: a 3D hand, a camera, and the 2D observation that reaches the lift. */
const capture = (
  handOptions: SyntheticOptions = {},
  camera: CameraSetup = DEFAULT_CAMERA,
  ids: { captureId?: string; sessionId?: string } = {},
) => {
  const hand = syntheticHand(handOptions)
  const observation = projectToObservation(hand, { camera, ...ids })
  // Round-trip through the parser so the tests use the same path a file would.
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  assert.ok(parsed.ok, `observation did not parse: ${JSON.stringify(parsed.ok ? null : parsed.errors)}`)
  if (!parsed.ok) throw new Error('unreachable')
  return { hand, observation: parsed.value }
}

const socketFor = (observation: ScanObservation): SocketObservation => {
  const canonical = liftObservation(observation)
  assert.ok(canonical, 'lift returned null')
  const sockets = socketObservationsFrom(canonical)
  const socket = sockets.get('index')
  assert.ok(socket, 'no socket for the index finger')
  return socket
}

// ---------------------------------------------------------------------------
// The chain runs
// ---------------------------------------------------------------------------

test('projection -> parse -> lift -> socket produces a normalized socket', () => {
  const { observation } = capture()
  const canonical = liftObservation(observation)
  assert.ok(canonical)

  assert.equal(canonical.liftVersion, 1)
  assert.equal(canonical.landmarks3d.length, 21)
  assert.ok(canonical.landmarks3d.every(point => point !== null))
  assert.equal(canonical.beds.length, 1)
  assert.equal(canonical.beds[0].finger, 'index')

  const socket = socketFor(observation)
  assert.equal(socket.socket.units, 'normalized')
  assert.equal(socket.socket.scaleReference, 'proximalPhalanx')
  assert.equal(socket.socket.finger, 'index')
  assert.ok(socket.socket.bedWidth > 0 && socket.socket.bedLength > 0)
  assert.ok(socket.socket.normal[2] > 0, 'nail should face away from the palm')
})

test('weak perspective preserves x/y exactly, so the reprojection residual is ~0', () => {
  const { observation } = capture()
  const canonical = liftObservation(observation)
  assert.ok(canonical)
  assert.ok(
    canonical.residuals.reprojectionRmsPx < 1e-9,
    `reprojection residual ${canonical.residuals.reprojectionRmsPx} — the lift moved a landmark`,
  )
})

test('every unmeasurable quantity is declared as an assumption', () => {
  const { observation } = capture()
  const canonical = liftObservation(observation)
  assert.ok(canonical)
  const joined = canonical.assumptions.join(' | ')
  for (const expected of ['weak perspective', 'fronto-parallel', 'generic ratios', 'least tilted', 'absolute scale is NOT recovered']) {
    assert.ok(joined.includes(expected), `assumption not declared: ${expected}`)
  }
  assert.equal(canonical.liftMethod, 'weakPerspective+planarPalm+minimumTilt')
})

test('a missing palm landmark yields no frame rather than an invented one', () => {
  for (const name of ['wrist', 'indexMCP', 'pinkyMCP']) {
    const hand = syntheticHand()
    const raw = projectToObservation(hand, { omitLandmarks: [name] })
    const parsed = parseScanObservation(JSON.parse(JSON.stringify(raw)))
    assert.ok(parsed.ok)
    if (!parsed.ok) throw new Error('unreachable')
    assert.equal(liftObservation(parsed.value), null, `lift should fail without ${name}`)
  }
})

test('landmark names cover all 21 joints exactly once', () => {
  assert.equal(LANDMARK_NAMES.length, 21)
  assert.equal(new Set(LANDMARK_NAMES).size, 21)
  assert.ok(LANDMARK_NAMES.includes('wrist'))
  assert.ok(LANDMARK_NAMES.includes('indexTIP'))
})

// ---------------------------------------------------------------------------
// minimum-tilt solver
// ---------------------------------------------------------------------------

test('a projected quad that is already square is read as fronto-parallel', () => {
  const { p, q } = minimumTiltDepths([10, 0], [0, 20])
  assert.equal(p, 0)
  assert.equal(q, 0)
})

test('the minimum-tilt solution satisfies rectangularity and is the smallest such', () => {
  const across: [number, number] = [10, 3]
  const along: [number, number] = [-2, 18]
  const { p, q } = minimumTiltDepths(across, along)

  // 3D axes must be perpendicular.
  const acrossDotAlong = across[0] * along[0] + across[1] * along[1] + p * q
  assert.ok(Math.abs(acrossDotAlong) < 1e-9, `not perpendicular: ${acrossDotAlong}`)

  // No other consistent solution has a smaller p^2 + q^2.
  const c = p * q
  for (const candidate of [0.25, 0.5, 2, 4]) {
    const altP = p * candidate
    const altQ = c / altP
    assert.ok(p * p + q * q <= altP * altP + altQ * altQ + 1e-9, 'not the minimum-norm solution')
  }
})

// ---------------------------------------------------------------------------
// Repeatability — the PoC's actual question
// ---------------------------------------------------------------------------

test('camera scale and framing do not change the socket', () => {
  const reference = socketFor(capture().observation)
  const cameras: CameraSetup[] = [
    { scale: 420, principalPoint: [800, 600], imageWidth: 1600, imageHeight: 1200 },
    { scale: 1800, principalPoint: [2000, 2600], imageWidth: 4000, imageHeight: 5200 },
    { scale: 900, principalPoint: [100, 90], imageWidth: 3024, imageHeight: 4032 },
  ]
  for (const camera of cameras) {
    const socket = socketFor(capture({}, camera).observation)
    assert.ok(
      originOffsetRatio(socket.socket, reference.socket) < 1e-9,
      `origin moved with the camera: ${originOffsetRatio(socket.socket, reference.socket)}`,
    )
    assert.ok((normalAngleDeg(socket.socket, reference.socket) ?? 9) < ANGLE_EPS_DEG)
  }
})

test('rotating the hand in the image plane does not change the socket', () => {
  // The palm stays fronto-parallel, so the lift's assumption still holds.
  const reference = socketFor(capture().observation)
  for (const degrees of [25, 90, 200]) {
    const socket = socketFor(
      capture({ pose: { rotationAxis: [0, 0, 1] as Vec3, rotationDeg: degrees } }).observation,
    )
    assert.ok(
      originOffsetRatio(socket.socket, reference.socket) < 1e-6,
      `in-plane rotation ${degrees}deg moved the origin`,
    )
    assert.ok((normalAngleDeg(socket.socket, reference.socket) ?? 9) < 1e-3)
  }
})

test('independent captures of one hand are repeatable (M1-M4 near zero)', () => {
  // Different framing, different scale, different in-plane rotation: the
  // things that genuinely vary between two photos of the same hand.
  const setups: Array<{ options: SyntheticOptions; camera: CameraSetup }> = [
    { options: {}, camera: DEFAULT_CAMERA },
    {
      options: { pose: { rotationAxis: [0, 0, 1] as Vec3, rotationDeg: 12 } },
      camera: { scale: 1200, principalPoint: [1000, 1400], imageWidth: 2400, imageHeight: 3200 },
    },
    {
      options: { pose: { rotationAxis: [0, 0, 1] as Vec3, rotationDeg: -31, translation: [3, -2, 0] as Vec3 } },
      camera: { scale: 640, principalPoint: [700, 980], imageWidth: 1400, imageHeight: 2000 },
    },
    {
      options: { pose: { rotationAxis: [0, 0, 1] as Vec3, rotationDeg: 75, scale: 2.5 } },
      camera: { scale: 300, principalPoint: [500, 650], imageWidth: 1000, imageHeight: 1400 },
    },
  ]

  const captures: Capture[] = setups.map((setup, index) => ({
    sessionId: `s${index}`,
    observation: socketFor(capture(setup.options, setup.camera).observation),
  }))

  const report = computeStability(captures)
  assert.ok(report)
  assert.ok(report.m0CanonicalFrame.rms < 1e-6, `M0=${report.m0CanonicalFrame.rms}`)
  assert.ok(report.m1Origin.rms < 1e-6, `M1=${report.m1Origin.rms}`)
  assert.ok(report.m2Normal.rms < 1e-3, `M2=${report.m2Normal.rms}`)
  assert.ok(report.m3Tangent.rms < 1e-3, `M3=${report.m3Tangent.rms}`)
  assert.ok(report.m4Dimensions.bedLengthCv < 1e-6, `M4=${report.m4Dimensions.bedLengthCv}`)
})

test('tilting the hand out of plane breaks the planar-palm assumption, and the metrics see it', () => {
  // The lift pins the palm to Z = 0, so a hand tilted toward or away from the
  // camera is reconstructed wrongly. Repeatability must NOT look clean here —
  // if it did, the metrics would be blind to the lift's main failure mode.
  const reference = socketFor(capture().observation)
  const tilted = socketFor(
    capture({ pose: { rotationAxis: [1, 0, 0] as Vec3, rotationDeg: 30 } }).observation,
  )
  const offset = originOffsetRatio(tilted.socket, reference.socket)
  const angle = normalAngleDeg(tilted.socket, reference.socket) ?? 0
  assert.ok(
    offset > 0.01 || angle > 1,
    `out-of-plane tilt went undetected (origin ${offset}, normal ${angle} deg)`,
  )
})

test('the depth prior reports when it disagrees with the projection', () => {
  // Generic phalanx ratios will not match an individual hand. When a bone
  // projects LONGER than its prior the depth is clamped to zero and counted,
  // so the mismatch is visible instead of silently distorting the chain.
  const { observation } = capture()
  const canonical = liftObservation(observation)
  assert.ok(canonical)
  assert.ok(Number.isInteger(canonical.residuals.clampedBones))
  assert.equal(canonical.residuals.depthResolved, canonical.residuals.clampedBones === 0)
})

// ---------------------------------------------------------------------------
// Lift bias — a separate question from repeatability
// ---------------------------------------------------------------------------

test('lift bias against the 3D truth is measurable and bounded', () => {
  const { hand, observation } = capture()
  const canonical = liftObservation(observation)
  assert.ok(canonical)

  const bias = measureLiftBias(
    canonical.landmarks3d,
    hand.landmarks,
    canonical.beds[0].quad,
    truthBed(hand, 'index'),
  )

  assert.ok(Number.isFinite(bias.landmarkRms))
  assert.ok(bias.landmarkRms < 0.5, `landmark bias ${bias.landmarkRms} is implausibly large`)
  assert.ok(bias.bedNormalDeg !== null)
  assert.ok(Number.isFinite(bias.bedNormalDeg))
})

test('tilt about the finger long axis IS observable, and is under-estimated', () => {
  // Rotating about the finger's long axis skews the projected quad, so the
  // tilt leaves a trace the solver can use. The declared minimum-tilt bias
  // then shows up as a ratio below 1.
  for (const degrees of [20, 35, 50]) {
    const { hand, observation } = capture({
      pose: { rotationAxis: [0, 1, 0] as Vec3, rotationDeg: degrees },
    })
    const canonical = liftObservation(observation)
    assert.ok(canonical)
    assert.ok(
      Math.abs(canonical.residuals.bedSkewCosine.index ?? 0) > 0.01,
      `no skew to work from at ${degrees}deg`,
    )

    const bias = measureLiftBias(
      canonical.landmarks3d,
      hand.landmarks,
      canonical.beds[0].quad,
      truthBed(hand, 'index'),
    )
    assert.ok(bias.tiltRatio !== null, 'tilt ratio could not be computed')
    assert.ok(bias.tiltRatio > 0, `tilt was not recovered at all at ${degrees}deg`)
    assert.ok(
      bias.tiltRatio <= 1 + 1e-6,
      `minimum-tilt should not over-estimate slant, got ${bias.tiltRatio}`,
    )
  }
})

test('tilt about the BED WIDTH axis is invisible in one view, and the residual says so', () => {
  // The blind spot of this baseline. Rotating about the bed's own width axis
  // foreshortens the bed without skewing it, so the projected quad stays
  // square however far the nail is pitched. The lift must not pretend to have
  // measured an orientation it cannot see — it reports zero skew, and the
  // reconstructed normal stays at the camera axis.
  let previousBedLength: number | null = null
  for (const degrees of [0, 20, 45]) {
    const { hand, observation } = capture(
      degrees === 0 ? {} : { pose: { rotationAxis: [1, 0, 0] as Vec3, rotationDeg: degrees } },
    )
    const canonical = liftObservation(observation)
    assert.ok(canonical)

    assert.ok(
      Math.abs(canonical.residuals.bedSkewCosine.index ?? 1) < 1e-9,
      `expected no skew at ${degrees}deg, got ${canonical.residuals.bedSkewCosine.index}`,
    )
    assert.equal(canonical.residuals.bedTiltMagnitudePx.index, 0)

    // The true normal keeps turning while the reconstruction does not, so the
    // error grows one-for-one with the real tilt.
    const bias = measureLiftBias(
      canonical.landmarks3d,
      hand.landmarks,
      canonical.beds[0].quad,
      truthBed(hand, 'index'),
    )
    assert.ok(bias.bedNormalDeg !== null)
    if (degrees > 0) {
      assert.ok(
        bias.bedNormalDeg > degrees - 1,
        `normal error ${bias.bedNormalDeg} should track the unseen tilt ${degrees}`,
      )
    }

    // The foreshortening is absorbed into bedLength instead.
    const socket = socketFor(observation)
    if (previousBedLength !== null) {
      assert.ok(
        socket.socket.bedLength < previousBedLength,
        'foreshortening should shorten the reconstructed bed',
      )
    }
    previousBedLength = socket.socket.bedLength
  }
})

test('a perfectly fronto-parallel bed is reconstructed without inventing tilt', () => {
  // across . along = 0 in the projection, so the solver must return zero depth
  // rather than a plausible-looking slant.
  const { p, q } = minimumTiltDepths([30, 0], [0, 45])
  assert.equal(p, 0)
  assert.equal(q, 0)
})

// ---------------------------------------------------------------------------
// M0-M6 connection
// ---------------------------------------------------------------------------

test('M5 separates within-session from between-session over lifted captures', () => {
  const captures: Capture[] = []
  for (let session = 0; session < 3; session += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      captures.push({
        sessionId: `s${session}`,
        observation: socketFor(
          capture(
            { pose: { rotationAxis: [0, 0, 1] as Vec3, rotationDeg: session * 20 + frame } },
            DEFAULT_CAMERA,
          ).observation,
        ),
      })
    }
  }
  const report = computeStability(captures)
  assert.ok(report)
  assert.equal(report.sessionCount, 3)
  assert.equal(report.captureCount, 9)
  assert.ok(Number.isFinite(report.m5Decomposition.intraSession))
  assert.ok(Number.isFinite(report.m5Decomposition.interSession))
})

test('M6 stays clean through the whole chain when the nail grows', () => {
  // The bed is annotated, the free edge is not part of it, so a longer nail
  // must not move the socket — end to end, not just in Stage 1.
  const before = socketFor(capture({ freeEdgeFraction: 0 }).observation)
  const after = socketFor(capture({ freeEdgeFraction: 0.9 }).observation)

  const result = swapInvariance(before, after)
  assert.ok(result)
  assert.ok(result.originRatio < 1e-9, `origin moved: ${result.originRatio}`)
  assert.ok(result.normalDeg < ANGLE_EPS_DEG, `normal turned: ${result.normalDeg}`)
  assert.ok(result.bedLengthRatio < 1e-9, `bedLength changed: ${result.bedLengthRatio}`)
})

test('corner annotation noise reaches M1 through the chain', () => {
  const clean = socketFor(capture().observation)
  const noisy = socketFor(capture({ cornerNoise: 0.05, seed: 7 }).observation)
  const report = computeStability([
    { sessionId: 's0', observation: clean },
    { sessionId: 's1', observation: noisy },
  ])
  assert.ok(report)
  assert.ok(report.m1Origin.rms > 0, 'annotation noise did not reach M1')
})

// ---------------------------------------------------------------------------
// Normalized values stay normalized
// ---------------------------------------------------------------------------

test('nothing in this chain produces a metre-valued socket', () => {
  const small = socketFor(
    capture({}, { scale: 120, principalPoint: [200, 300], imageWidth: 640, imageHeight: 900 })
      .observation,
  )
  const large = socketFor(
    capture({}, { scale: 2400, principalPoint: [3000, 4000], imageWidth: 6000, imageHeight: 8000 })
      .observation,
  )
  // A metre-valued socket would grow with the image; a normalized one does not.
  assert.ok(Math.abs(small.socket.bedWidth - large.socket.bedWidth) < 1e-9)
  assert.ok(Math.abs(small.socket.bedLength - large.socket.bedLength) < 1e-9)
  assert.equal(small.socket.units, 'normalized')
})
