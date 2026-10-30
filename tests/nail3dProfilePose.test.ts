// Stage 6 — does a known Personal HandProfile break the Stage 5 ambiguity?
//
// Stage 5 established that with weak perspective and a free depth per point,
// the relative rotation's magnitude is exactly unobservable: the residual is
// flat to 1e-13 px across every assumed separation from 5 to 75 degrees. The
// depths were the problem, so the test here is what happens when they are no
// longer unknown.
//
// Three profile conditions, as the review asked:
//
//   A  the person's own geometry, exactly
//   B  their geometry with one parameter wrong, swept one parameter at a time
//   C  a generic profile — a different hand's shape
//
// Results are median / p95 / worst over independent noise draws and are judged
// against Stage 4.5's 2-4 degree relative-pose budget, with the baseline-axis
// component called out separately because that is the component no residual
// can police.
//
// The negative control matters as much as the positive result: with the
// profile removed from the very same data, Stage 5's exact ambiguity has to
// come back, or this file is measuring something other than what it claims.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  OBSERVABLE_MIN_PX_PER_DEG,
  PROFILE_POSE_METHOD,
  PROFILE_POSE_VERSION,
  estimateRelativeRotationWithProfile,
  handProfile,
  profileFitResidualPx,
} from '../src/lib/nail3dProfilePose.ts'
import type { HandProfile3D } from '../src/lib/nail3dProfilePose.ts'
import {
  POSE_BUDGET_DEG,
  estimateRelativeRotation,
  rotationDifference,
  toRotationVector,
} from '../src/lib/nail3dLandmarkPose.ts'
import { liftTwoView } from '../src/lib/nail3dMultiView.ts'
import { socketObservationsFrom } from '../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { estimateSocket, originOffsetRatio } from '../src/lib/nail3dSocket.ts'
import { add, multiplyMat3, normalize, rotationMat3, scale as vscale, transposeMat3 } from '../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../src/lib/vec3.ts'
import { syntheticHand } from './support/syntheticHand.ts'
import type { Finger } from '../src/lib/nail3dContract.ts'
import type { SyntheticHand, SyntheticOptions } from './support/syntheticHand.ts'
import {
  DEFAULT_CAMERA,
  cameraPosition,
  jitterObservation,
  lookAtRotation,
  projectToObservation,
  truthBed,
} from './support/syntheticProjection.ts'
import type { CameraSetup } from './support/syntheticProjection.ts'

const SECOND_CAMERA: CameraSetup = {
  scale: 1150,
  principalPoint: [1400, 1900],
  imageWidth: 3000,
  imageHeight: 4000,
}

const DISTANCE = 3.0
const PITCH_DEG = 35
/** The person's true hand geometry — what an exact profile would describe. */
const TRUE_GEOMETRY: SyntheticOptions = { palmArch: 0.15 }
/** Stage 4.5's realistic per-view annotation sigma. */
const REALISTIC_NOISE_PX = 2
const ALL_FINGERS: readonly Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky']

/**
 * Camera arc directions, as (azimuth, elevation) fractions of the separation.
 * `diagonal` is the azimuth-dominant one Stage 5 recommended.
 */
const DIRECTIONS = {
  elevation: [0, 1],
  azimuth: [1, 0],
  diagonal: [0.875, 0.5],
} as const

type DirectionName = keyof typeof DIRECTIONS

const centroid = (hand: SyntheticHand): Vec3 =>
  vscale(hand.landmarks.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / 21)

/**
 * A profile is the hand's landmarks in its own frame — no pose applied.
 * Nothing is in millimetres, and the fit never needs it to be.
 */
const profileFor = (geometry: SyntheticOptions): HandProfile3D => {
  const built = handProfile(syntheticHand(geometry).landmarks, 'right')
  assert.ok(built, 'profile did not build')
  return built
}

const observe = (
  hand: SyntheticHand,
  view: Mat3,
  camera: CameraSetup,
  jitterPx = 0,
  seed = 1,
): ScanObservation => {
  let observation = projectToObservation(hand, { camera, view })
  if (jitterPx) observation = jitterObservation(observation, { sigmaPx: jitterPx, seed })
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  assert.ok(parsed.ok, 'observation did not parse')
  if (!parsed.ok) throw new Error('unreachable')
  return parsed.value
}

interface Options {
  separationDeg?: number
  direction?: DirectionName
  /** The geometry the PROFILE describes — differs from the truth for B and C. */
  profileGeometry?: SyntheticOptions
  jitterPx?: number
  seedA?: number
  seedB?: number
  /** Finger flexion applied to the second shot only. */
  articulationDeg?: number
  set?: 'all21' | 'palmRigid'
}

interface Outcome {
  estimate: ReturnType<typeof estimateRelativeRotationWithProfile>
  /** Same data with the profile removed — the Stage 5 negative control. */
  withoutProfile: ReturnType<typeof estimateRelativeRotation>
  error: ReturnType<typeof rotationDifference> | null
  truth: Mat3
  referenceView: Mat3
  reference: ScanObservation
  second: ScanObservation
  profile: HandProfile3D
  /** Socket origin error from the ESTIMATED pose, as a percentage of bed length. */
  socketOriginPct: number
  socketBedWidthPct: number
  socketBedLengthPct: number
  /** Socket origin error a PERFECT pose would have left, for comparison. */
  socketOriginWithTruePosePct: number
}

const run = (options: Options = {}): Outcome => {
  const separationDeg = options.separationDeg ?? 40
  const direction = DIRECTIONS[options.direction ?? 'diagonal']
  const pose = { rotationAxis: [1, 0, 0] as Vec3, rotationDeg: PITCH_DEG }
  const first = syntheticHand({ ...TRUE_GEOMETRY, pose })
  const second = syntheticHand({
    ...TRUE_GEOMETRY,
    pose,
    ...(options.articulationDeg
      ? {
          articulationDeg: Object.fromEntries(
            ALL_FINGERS.map(finger => [finger, options.articulationDeg]),
          ),
        }
      : {}),
  })

  const target = centroid(first)
  const referenceView = lookAtRotation(cameraPosition(DISTANCE, 0, 0, target), target)
  const secondView = lookAtRotation(
    cameraPosition(DISTANCE, separationDeg * direction[0], separationDeg * direction[1], target),
    target,
  )
  const truth = multiplyMat3(secondView, transposeMat3(referenceView))
  const jitter = options.jitterPx ?? 0

  const a = observe(first, referenceView, DEFAULT_CAMERA, jitter, options.seedA ?? 11)
  const b = observe(
    second,
    secondView,
    SECOND_CAMERA,
    jitter * (SECOND_CAMERA.scale / DEFAULT_CAMERA.scale),
    options.seedB ?? 977,
  )

  const profile = profileFor(options.profileGeometry ?? TRUE_GEOMETRY)
  const estimate = estimateRelativeRotationWithProfile(profile, a, b, { set: options.set ?? 'all21' })
  const withoutProfile = estimateRelativeRotation(a, b, { set: options.set ?? 'all21' })

  const axis = normalize(toRotationVector(truth)) ?? ([1, 0, 0] as Vec3)
  const fit = estimate.rotation ?? estimate.discardedRotation

  const truthSocket = estimateSocket(first.landmarks, truthBed(first, 'index'), 'index')
  assert.ok(truthSocket)
  const socketFrom = (relative: Mat3) => {
    const lifted = liftTwoView(
      a,
      b,
      { reference: { rotation: referenceView }, second: { rotation: multiplyMat3(relative, referenceView) } },
      ['index'],
    )
    if (!lifted.canonical) return null
    return socketObservationsFrom(lifted.canonical).get('index') ?? null
  }

  const estimated = fit ? socketFrom(fit) : null
  const perfect = socketFrom(truth)

  return {
    estimate,
    withoutProfile,
    error: fit ? rotationDifference(truth, fit, axis) : null,
    truth,
    referenceView,
    reference: a,
    second: b,
    profile,
    socketOriginPct: estimated ? Math.abs(originOffsetRatio(estimated.socket, truthSocket.socket) * 100) : Number.NaN,
    socketBedWidthPct: estimated ? (estimated.socket.bedWidth / truthSocket.socket.bedWidth - 1) * 100 : Number.NaN,
    socketBedLengthPct: estimated ? (estimated.socket.bedLength / truthSocket.socket.bedLength - 1) * 100 : Number.NaN,
    socketOriginWithTruePosePct: perfect
      ? Math.abs(originOffsetRatio(perfect.socket, truthSocket.socket) * 100)
      : Number.NaN,
  }
}

interface Spread {
  median: number
  p95: number
  worst: number
}

const spread = (values: readonly number[]): Spread => {
  assert.ok(values.length > 0, 'no values to summarise')
  const sorted = [...values].sort((a, b) => a - b)
  return {
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
    worst: sorted[sorted.length - 1],
  }
}

interface Summary {
  total: Spread
  baselineAxis: Spread
  orthogonal: Spread
  socketOrigin: Spread
  mismatch: Spread
}

const summarise = (options: Options, draws = 16): Summary => {
  const total: number[] = []
  const baselineAxis: number[] = []
  const orthogonal: number[] = []
  const socketOrigin: number[] = []
  const mismatch: number[] = []
  for (let k = 0; k < draws; k += 1) {
    const outcome = run({ ...options, seedA: 100 + k * 7, seedB: 5000 + k * 13 })
    if (outcome.error) {
      total.push(outcome.error.totalDeg)
      baselineAxis.push(outcome.error.baselineAxisDeg)
      orthogonal.push(outcome.error.orthogonalDeg)
    }
    if (Number.isFinite(outcome.socketOriginPct)) socketOrigin.push(outcome.socketOriginPct)
    if (Number.isFinite(outcome.estimate.profileMismatchRmsPx)) {
      mismatch.push(outcome.estimate.profileMismatchRmsPx)
    }
  }
  return {
    total: spread(total),
    baselineAxis: spread(baselineAxis),
    orthogonal: spread(orthogonal),
    socketOrigin: spread(socketOrigin),
    mismatch: spread(mismatch),
  }
}

const ANGLE_EPS_DEG = 1e-3

// ---------------------------------------------------------------------------
// 1. The ambiguity is gone — and the control proves it was there
// ---------------------------------------------------------------------------

test('an exact profile recovers the relative rotation exactly from clean images', () => {
  for (const direction of ['elevation', 'azimuth', 'diagonal'] as const) {
    for (const separationDeg of [25, 40, 60]) {
      const outcome = run({ direction, separationDeg })
      assert.equal(outcome.estimate.refusedReason, undefined, `${direction} @ ${separationDeg}`)
      assert.ok(outcome.estimate.rotation, `${direction} @ ${separationDeg} returned no rotation`)
      assert.ok(outcome.error)
      assert.ok(
        outcome.error.totalDeg < ANGLE_EPS_DEG,
        `${direction} @ ${separationDeg}: ${outcome.error.totalDeg} deg`,
      )
      assert.ok(outcome.estimate.profileMismatchRmsPx < 1e-6)
      assert.ok(outcome.estimate.confidence > 0.999, `confidence ${outcome.estimate.confidence}`)
    }
  }
})

test('NEGATIVE CONTROL: removing the profile brings Stage 5 exact ambiguity straight back', () => {
  // The same two observations, the same landmarks, the only difference being
  // whether the depths are known. Without the profile the fit still reaches a
  // ~0 residual and is still refused, because the magnitude is unobservable.
  for (const separationDeg of [25, 40, 60]) {
    const outcome = run({ separationDeg })
    assert.ok(outcome.estimate.rotation, 'with a profile it should succeed')

    const control = outcome.withoutProfile
    assert.equal(control.refusedReason, 'notObservable', `@ ${separationDeg}`)
    assert.equal(control.rotation, null)
    assert.equal(control.confidence, 0)
    assert.ok(control.residualRmsPx < 1e-6, `the bad fit still fits: ${control.residualRmsPx}`)
    assert.equal(Number.isFinite(control.observability?.conditionNumber ?? Infinity), false)
    assert.ok((control.observability?.weakestPxPerDeg ?? 1) < OBSERVABLE_MIN_PX_PER_DEG)
  }
})

test('the residual landscape has a single sharp minimum at the truth, not a flat valley', () => {
  // Stage 5's landscape was flat to 1e-13 px from 5 to 75 degrees. This one
  // is a V: ~190 px at 5 degrees, ~1 px at the true 40, ~270 px at 75, and it
  // falls and rises monotonically on either side.
  const outcome = run({ separationDeg: 40, direction: 'diagonal' })
  const referenceFit = outcome.estimate.referenceFit
  assert.ok(referenceFit)

  const axis = normalize(toRotationVector(outcome.truth)) ?? ([1, 0, 0] as Vec3)
  const trueAngleDeg =
    (Math.acos(
      Math.min(1, Math.max(-1, (outcome.truth[0] + outcome.truth[4] + outcome.truth[8] - 1) / 2)),
    ) *
      180) /
    Math.PI

  const at = (degrees: number): number =>
    profileFitResidualPx(
      outcome.profile,
      outcome.second,
      multiplyMat3(rotationMat3(axis, (degrees * Math.PI) / 180), referenceFit.rotation),
      { set: 'all21' },
    )

  const below = [5, 15, 25, 35].map(at)
  const above = [45, 55, 65, 75].map(at)
  const atTruth = at(trueAngleDeg)

  assert.ok(atTruth < 1e-6, `residual at the truth should vanish: ${atTruth}`)
  // Monotonic approach from both sides.
  for (let i = 1; i < below.length; i += 1) {
    assert.ok(below[i] < below[i - 1], `below the truth should descend: ${below}`)
  }
  for (let i = 1; i < above.length; i += 1) {
    assert.ok(above[i] > above[i - 1], `above the truth should climb: ${above}`)
  }
  // And the slope is steep enough that a degree is unmistakable.
  const oneDegreeOff = Math.min(at(trueAngleDeg - 1), at(trueAngleDeg + 1))
  assert.ok(oneDegreeOff > 3, `one degree off should cost pixels: ${oneDegreeOff}`)
})

test('observability becomes finite, where Stage 5 reported infinity', () => {
  for (const separationDeg of [25, 40, 60]) {
    const outcome = run({ separationDeg, jitterPx: REALISTIC_NOISE_PX })
    const observability = outcome.estimate.observability
    assert.ok(observability)
    assert.ok(
      observability.conditionNumber > 1 && observability.conditionNumber < 10,
      `condition number ${observability.conditionNumber}`,
    )
    assert.ok(
      observability.weakestPxPerDeg > OBSERVABLE_MIN_PX_PER_DEG * 10,
      `weakest ${observability.weakestPxPerDeg} px/deg`,
    )
    // The predicted 1-sigma is well inside the budget, and finite.
    assert.ok(
      observability.baselineAxisSigmaDeg < 1,
      `baseline-axis sigma ${observability.baselineAxisSigmaDeg}`,
    )
    assert.ok(outcome.estimate.confidence > 0.9, `confidence ${outcome.estimate.confidence}`)
  }
})

test('the method names itself, and a profile must have all 21 landmarks', () => {
  assert.equal(PROFILE_POSE_VERSION, 1)
  assert.equal(PROFILE_POSE_METHOD, 'twoViewOrthographic+knownHandProfile')
  assert.equal(handProfile([[0, 0, 0]], 'right'), null)
  const built = handProfile(syntheticHand(TRUE_GEOMETRY).landmarks, 'right')
  assert.ok(built)
  // Tagged, so a shape can never be read as a metre value.
  assert.equal(built.units, 'profile')
})

// ---------------------------------------------------------------------------
// 2. A: the exact profile, under realistic noise and at every direction
// ---------------------------------------------------------------------------

test('A: an exact profile is inside the Stage 4.5 budget everywhere, with room to spare', () => {
  for (const direction of ['elevation', 'azimuth', 'diagonal'] as const) {
    for (const separationDeg of [25, 40, 60]) {
      const summary = summarise({ direction, separationDeg, jitterPx: REALISTIC_NOISE_PX })
      const label = `${direction} @ ${separationDeg}`
      // Median, p95 and worst case are all checked: a mean would hide the
      // captures that matter.
      assert.ok(summary.total.median < 0.5, `${label}: median ${summary.total.median}`)
      assert.ok(summary.total.p95 < 1, `${label}: p95 ${summary.total.p95}`)
      assert.ok(summary.total.worst < POSE_BUDGET_DEG / 2, `${label}: worst ${summary.total.worst}`)
      assert.ok(
        summary.baselineAxis.worst < 1,
        `${label}: baseline-axis worst ${summary.baselineAxis.worst}`,
      )
    }
  }
})

test('A: the estimated pose adds nothing measurable over a perfect pose', () => {
  // The headline. What is left in the socket is annotation noise, not pose
  // error, so a known profile removes the relative pose as an error source.
  for (const jitterPx of [1, 2, 5]) {
    const estimated: number[] = []
    const perfect: number[] = []
    for (let k = 0; k < 16; k += 1) {
      const outcome = run({ jitterPx, seedA: 100 + k * 7, seedB: 5000 + k * 13 })
      estimated.push(outcome.socketOriginPct)
      perfect.push(outcome.socketOriginWithTruePosePct)
    }
    const withEstimate = spread(estimated)
    const withTruth = spread(perfect)
    assert.ok(
      Math.abs(withEstimate.median - withTruth.median) < 0.3,
      `${jitterPx}px: ${withEstimate.median} vs ${withTruth.median}`,
    )
    assert.ok(
      Math.abs(withEstimate.p95 - withTruth.p95) < 0.5,
      `${jitterPx}px p95: ${withEstimate.p95} vs ${withTruth.p95}`,
    )
  }
})

test('A: bed dimensions survive too', () => {
  const widths: number[] = []
  const lengths: number[] = []
  for (let k = 0; k < 16; k += 1) {
    const outcome = run({ jitterPx: REALISTIC_NOISE_PX, seedA: 100 + k * 7, seedB: 5000 + k * 13 })
    widths.push(Math.abs(outcome.socketBedWidthPct))
    lengths.push(Math.abs(outcome.socketBedLengthPct))
  }
  // Dominated by annotation noise, which Stage 4.5 put at ~2.7% and ~5.9% for
  // 2 px — so the pose is contributing little or nothing here either.
  assert.ok(spread(widths).p95 < 8, `bedWidth p95 ${spread(widths).p95}`)
  assert.ok(spread(lengths).p95 < 12, `bedLength p95 ${spread(lengths).p95}`)
})

// ---------------------------------------------------------------------------
// 3. B: how wrong may the profile be? (scale separated from shape)
// ---------------------------------------------------------------------------

test('B: global scale error costs exactly nothing — absolute size is not needed', () => {
  // Each view solves its own scale, so a uniformly larger or smaller profile
  // is absorbed completely. This is the same stance the whole contract takes:
  // the profile supplies SHAPE, never size.
  const exact = summarise({ jitterPx: REALISTIC_NOISE_PX })
  for (const scale of [0.8, 1.02, 1.1, 1.2]) {
    const scaled = summarise({
      jitterPx: REALISTIC_NOISE_PX,
      profileGeometry: { ...TRUE_GEOMETRY, pose: { scale } },
    })
    // Not "close" — the same answer, down to floating-point noise, which is
    // a stronger statement than a tolerance band: the scale is not an input
    // the result depends on at all.
    // Agreement to a millionth of a degree; what is left is the arithmetic of
    // multiplying the profile by a constant, not a change in the answer.
    assert.ok(Math.abs(scaled.total.median - exact.total.median) < 1e-6, `scale ${scale}: ${scaled.total.median} vs ${exact.total.median}`)
    assert.ok(Math.abs(scaled.baselineAxis.p95 - exact.baselineAxis.p95) < 1e-6, `scale ${scale}`)
    assert.ok(Math.abs(scaled.socketOrigin.p95 - exact.socketOrigin.p95) < 1e-6, `scale ${scale}`)
  }
})

test('B: palm width is the binding parameter, and it sets the calibration requirement', () => {
  // An error in palm width is an error in the hand's ASPECT RATIO, which is
  // exactly what foreshortening is read against — so it masquerades as a
  // rotation. Measured baseline-axis error, median over 16 draws:
  //   +2% -> 0.75   +5% -> 1.83   +10% -> 3.70   +20% -> 7.65 degrees
  const measured = [1.02, 1.05, 1.1, 1.2].map(palmWidthScale => ({
    palmWidthScale,
    summary: summarise({
      jitterPx: REALISTIC_NOISE_PX,
      profileGeometry: { ...TRUE_GEOMETRY, palmWidthScale },
    }),
  }))

  // Monotone and close to linear in the error.
  for (let i = 1; i < measured.length; i += 1) {
    assert.ok(
      measured[i].summary.baselineAxis.median > measured[i - 1].summary.baselineAxis.median,
      `should worsen monotonically: ${measured.map(m => m.summary.baselineAxis.median)}`,
    )
  }
  // 5% of palm width is about the 2-degree mark; 10% is about the 4-degree one.
  assert.ok(Math.abs(measured[1].summary.baselineAxis.median - 1.83) < 0.3, `+5%: ${measured[1].summary.baselineAxis.median}`)
  assert.ok(measured[1].summary.baselineAxis.worst < 2.5, `+5% worst: ${measured[1].summary.baselineAxis.worst}`)
  assert.ok(Math.abs(measured[2].summary.baselineAxis.median - 3.7) < 0.4, `+10%: ${measured[2].summary.baselineAxis.median}`)
  assert.ok(measured[3].summary.baselineAxis.median > POSE_BUDGET_DEG, `+20%: ${measured[3].summary.baselineAxis.median}`)
})

test('B: every other profile parameter is far more forgiving than palm width', () => {
  // Even a completely flat palm, 20% wrong finger lengths, 5%-of-width MCP
  // displacement or a 50% thickness error keeps the baseline-axis component
  // near a degree — an order of magnitude of slack compared with width.
  const cases: Array<[string, SyntheticOptions]> = [
    ['flat palm (arch 0.15 -> 0)', { palmArch: 0 }],
    ['deep arch (0.15 -> 0.25)', { palmArch: 0.25 }],
    ['thickness x1.5', { depthScale: 1.5 }],
    ['thickness x0.7', { depthScale: 0.7 }],
    [
      'finger lengths +-20%',
      { fingerScale: { thumb: 1.2, index: 0.8, middle: 1.2, ring: 0.8, pinky: 1.2 } },
    ],
    ['MCP jitter 5% of palm width', { mcpJitter: 0.05 }],
  ]
  for (const [name, delta] of cases) {
    const summary = summarise({
      jitterPx: REALISTIC_NOISE_PX,
      profileGeometry: { ...TRUE_GEOMETRY, ...delta },
    })
    assert.ok(
      summary.baselineAxis.p95 < 1.5,
      `${name}: baseline-axis p95 ${summary.baselineAxis.p95}`,
    )
    assert.ok(summary.total.p95 < POSE_BUDGET_DEG, `${name}: total p95 ${summary.total.p95}`)
  }
})

test('B: ⚠ the mismatch residual detects shape error, but is weakest exactly where it matters most', () => {
  // A wrong profile shows up in its own fit residual, which is the natural
  // place to reject on. The catch: finger-length error is loud and nearly
  // harmless, while palm-width error is quiet and does the damage. The
  // residual is therefore not a sufficient guard for the parameter that binds.
  const floor = summarise({ jitterPx: REALISTIC_NOISE_PX }).mismatch.median

  const fingerLengths = summarise({
    jitterPx: REALISTIC_NOISE_PX,
    profileGeometry: {
      ...TRUE_GEOMETRY,
      fingerScale: { thumb: 1.05, index: 0.95, middle: 1.05, ring: 0.95, pinky: 1.05 },
    },
  })
  // Loud: ~6x the floor, for a baseline-axis cost under a degree.
  assert.ok(fingerLengths.mismatch.median > floor * 4, `finger lengths: ${fingerLengths.mismatch.median} vs ${floor}`)
  assert.ok(fingerLengths.baselineAxis.median < 1)

  const palmWidth = summarise({
    jitterPx: REALISTIC_NOISE_PX,
    profileGeometry: { ...TRUE_GEOMETRY, palmWidthScale: 1.05 },
  })
  // Quiet: barely above the floor, for a baseline-axis cost at the 2-degree mark.
  assert.ok(palmWidth.mismatch.median < floor * 1.6, `palm width: ${palmWidth.mismatch.median} vs ${floor}`)
  assert.ok(palmWidth.baselineAxis.median > 1.5)
})

test('B: a mismatch threshold can be asked for, and refuses when crossed', () => {
  const bad = run({
    jitterPx: REALISTIC_NOISE_PX,
    profileGeometry: {
      ...TRUE_GEOMETRY,
      fingerScale: { thumb: 1.2, index: 0.8, middle: 1.2, ring: 0.8, pinky: 1.2 },
    },
  })
  assert.ok(bad.estimate.profileMismatchRmsPx > 20)

  const profile = profileFor({
    ...TRUE_GEOMETRY,
    fingerScale: { thumb: 1.2, index: 0.8, middle: 1.2, ring: 0.8, pinky: 1.2 },
  })
  const refused = estimateRelativeRotationWithProfile(profile, bad.reference, bad.second, {
    set: 'all21',
    maxProfileMismatchPx: 10,
  })
  assert.equal(refused.refusedReason, 'profileMismatch')
  assert.equal(refused.rotation, null)
  assert.ok(refused.discardedRotation)
  // Off by default, so Stage 6 measures the mismatch rather than assuming it.
  assert.equal(
    estimateRelativeRotationWithProfile(profile, bad.reference, bad.second, { set: 'all21' })
      .refusedReason,
    undefined,
  )
})

// ---------------------------------------------------------------------------
// 4. C: a generic profile
// ---------------------------------------------------------------------------

/** Another person's hand: a flatter, wider, thinner hand with other fingers. */
const GENERIC_GEOMETRY: SyntheticOptions = {
  palmArch: 0.09,
  palmWidthScale: 1.12,
  depthScale: 0.8,
  fingerScale: { thumb: 1.15, index: 0.88, middle: 1.08, ring: 0.9, pinky: 1.2 },
}

test('C: a generic profile misses the budget, and says so in its residual', () => {
  for (const separationDeg of [25, 40, 60]) {
    const generic = summarise({
      separationDeg,
      jitterPx: REALISTIC_NOISE_PX,
      profileGeometry: { ...TRUE_GEOMETRY, ...GENERIC_GEOMETRY },
    })
    // 4.6-6.5 degrees total, essentially all of it on the baseline axis.
    assert.ok(
      generic.baselineAxis.median > POSE_BUDGET_DEG,
      `@ ${separationDeg}: baseline-axis ${generic.baselineAxis.median}`,
    )
    // But it is at least obvious: ~15x the exact profile's mismatch.
    const exact = summarise({ separationDeg, jitterPx: REALISTIC_NOISE_PX })
    assert.ok(
      generic.mismatch.median > exact.mismatch.median * 8,
      `@ ${separationDeg}: mismatch ${generic.mismatch.median} vs ${exact.mismatch.median}`,
    )
  }
})

test('C: a generic profile still beats having no profile at all', () => {
  // Worth stating plainly: 5-6 degrees is outside the budget but finite and
  // on the right axis, where the landmark-only route gave nothing usable.
  const generic = summarise({
    jitterPx: REALISTIC_NOISE_PX,
    profileGeometry: { ...TRUE_GEOMETRY, ...GENERIC_GEOMETRY },
  })
  assert.ok(generic.total.worst < 10, `worst ${generic.total.worst}`)
  const outcome = run({ jitterPx: REALISTIC_NOISE_PX, profileGeometry: { ...TRUE_GEOMETRY, ...GENERIC_GEOMETRY } })
  assert.ok(outcome.estimate.rotation, 'a generic profile should still produce a rotation')
  assert.equal(outcome.withoutProfile.rotation, null, 'while no profile produces none')
})

// ---------------------------------------------------------------------------
// 5. all21 vs palmRigid, now that the depths are known
// ---------------------------------------------------------------------------

test('palmRigid becomes usable once the profile supplies the depths', () => {
  // Stage 5 measured palm-only at median 5.99 / p95 20.79 degrees on the axis
  // alone. With a known shape, six points are enough: the near-coplanarity
  // that starved it mattered only because the depths were unknown.
  for (const separationDeg of [25, 40, 60]) {
    const palm = summarise({ separationDeg, jitterPx: REALISTIC_NOISE_PX, set: 'palmRigid' })
    assert.ok(palm.total.p95 < 2, `@ ${separationDeg}: p95 ${palm.total.p95}`)
    assert.ok(palm.total.worst < POSE_BUDGET_DEG, `@ ${separationDeg}: worst ${palm.total.worst}`)
  }
})

test('all21 still beats palmRigid on a still hand, by about 4x', () => {
  const all = summarise({ jitterPx: REALISTIC_NOISE_PX, set: 'all21' })
  const palm = summarise({ jitterPx: REALISTIC_NOISE_PX, set: 'palmRigid' })
  assert.ok(palm.total.median > all.total.median * 2, `${palm.total.median} vs ${all.total.median}`)
})

test('under articulation all21 keeps the baseline axis clean on the recommended direction', () => {
  // The Stage 5 crossover does not simply repeat here. On the azimuth-dominant
  // diagonal, flexion pushes all21's error into the ORTHOGONAL component —
  // the one a residual can see — and leaves the unpoliceable baseline-axis
  // component under half a degree even at 5 degrees of flexion.
  for (const articulationDeg of [1, 2, 5]) {
    const all = summarise({ jitterPx: REALISTIC_NOISE_PX, articulationDeg, set: 'all21' })
    const palm = summarise({ jitterPx: REALISTIC_NOISE_PX, articulationDeg, set: 'palmRigid' })

    assert.ok(all.baselineAxis.worst < 1, `${articulationDeg} deg: all21 baseline-axis ${all.baselineAxis.worst}`)
    assert.ok(all.orthogonal.median > all.baselineAxis.median, `${articulationDeg} deg: error should go orthogonal`)
    // palmRigid is completely unmoved by flexion, as in Stage 5.
    const still = summarise({ jitterPx: REALISTIC_NOISE_PX, set: 'palmRigid' })
    assert.ok(Math.abs(palm.total.median - still.total.median) < 1e-9, `palmRigid moved: ${palm.total.median}`)
  }
})

test('with a baseline over the fingertip, articulation DOES corrupt all21 and palmRigid wins', () => {
  // The direction-dependence Stage 5 found survives: when the baseline shares
  // the flexion axis, flexion lands on the baseline axis after all, and the
  // flexion-immune set is the safer one.
  const all = summarise({
    direction: 'elevation',
    jitterPx: REALISTIC_NOISE_PX,
    articulationDeg: 5,
    set: 'all21',
  })
  const palm = summarise({
    direction: 'elevation',
    jitterPx: REALISTIC_NOISE_PX,
    articulationDeg: 5,
    set: 'palmRigid',
  })
  assert.ok(all.baselineAxis.median > POSE_BUDGET_DEG, `all21 baseline-axis ${all.baselineAxis.median}`)
  assert.ok(palm.baselineAxis.median < 1, `palmRigid baseline-axis ${palm.baselineAxis.median}`)
})

test("all21's mismatch residual is the articulation detector; palmRigid's is blind to it", () => {
  // Which is why running both is worth more than choosing one: all21 sees the
  // flexion, palmRigid is unaffected by it.
  const floor = summarise({ jitterPx: REALISTIC_NOISE_PX, set: 'all21' }).mismatch.median
  const palmFloor = summarise({ jitterPx: REALISTIC_NOISE_PX, set: 'palmRigid' }).mismatch.median
  for (const articulationDeg of [1, 2, 5]) {
    const all = summarise({ jitterPx: REALISTIC_NOISE_PX, articulationDeg, set: 'all21' })
    const palm = summarise({ jitterPx: REALISTIC_NOISE_PX, articulationDeg, set: 'palmRigid' })
    assert.ok(
      all.mismatch.median > floor * (1 + 0.5 * articulationDeg),
      `${articulationDeg} deg: ${all.mismatch.median} against a floor of ${floor}`,
    )
    assert.ok(Math.abs(palm.mismatch.median - palmFloor) < 1e-9, `${articulationDeg} deg: palm ${palm.mismatch.median}`)
  }
})

test('articulation still wrecks the socket whichever set is used — it is a rejection problem', () => {
  // Both sets land within a point or two of each other on the socket, because
  // the damage comes from the nail bed itself having moved, not from the pose.
  // No choice of landmark set fixes that.
  const all = summarise({ jitterPx: REALISTIC_NOISE_PX, articulationDeg: 5, set: 'all21' })
  const palm = summarise({ jitterPx: REALISTIC_NOISE_PX, articulationDeg: 5, set: 'palmRigid' })
  assert.ok(all.socketOrigin.median > 20, `all21 socket origin ${all.socketOrigin.median}`)
  assert.ok(palm.socketOrigin.median > 20, `palmRigid socket origin ${palm.socketOrigin.median}`)
})

// ---------------------------------------------------------------------------
// 6. Guards carried over from the earlier stages
// ---------------------------------------------------------------------------

test('the nail-bed annotation cannot influence the profile-based estimate either', () => {
  // Same guard as Stage 5: the bed's residual is the pipeline's one
  // independent check on a pose, so no estimator may consume it.
  const outcome = run()
  const wreck = (observation: ScanObservation): ScanObservation => ({
    ...observation,
    nails: observation.nails.map(nail => ({
      ...nail,
      points: Object.fromEntries(
        Object.entries(nail.points).map(([name, point]) => [
          name,
          point ? { ...point, x: point.x + 300, y: point.y - 300 } : point,
        ]),
      ) as typeof nail.points,
    })),
  })

  const clean = estimateRelativeRotationWithProfile(outcome.profile, outcome.reference, outcome.second, { set: 'all21' })
  const wrecked = estimateRelativeRotationWithProfile(
    outcome.profile,
    wreck(outcome.reference),
    wreck(outcome.second),
    { set: 'all21' },
  )
  assert.deepEqual(wrecked.rotation, clean.rotation)
  assert.equal(wrecked.profileMismatchRmsPx, clean.profileMismatchRmsPx)
})

test('a landmark missing in either view is dropped from both fits, by name', () => {
  const outcome = run()
  const drop = (observation: ScanObservation, names: readonly string[]): ScanObservation => ({
    ...observation,
    landmarks: observation.landmarks.map(landmark =>
      names.includes(landmark.name)
        ? { ...landmark, x: null, y: null, confidence: null }
        : landmark,
    ),
  })

  const estimate = estimateRelativeRotationWithProfile(
    outcome.profile,
    drop(outcome.reference, ['indexTIP']),
    drop(outcome.second, ['pinkyTIP']),
    { set: 'all21' },
  )
  // Both are gone, so the two poses are fitted to the same subset.
  assert.ok(!estimate.usedLandmarkIds.includes('indexTIP'))
  assert.ok(!estimate.usedLandmarkIds.includes('pinkyTIP'))
  assert.equal(estimate.usedLandmarkIds.length, 19)
  assert.ok(estimate.rotation, 'it should still estimate from 19 landmarks')
})

test('too few landmarks is refused — but a known shape needs fewer of them', () => {
  const outcome = run()
  const keep = ['wrist', 'indexMCP', 'pinkyMCP']
  const strip = (observation: ScanObservation): ScanObservation => ({
    ...observation,
    landmarks: observation.landmarks.map(landmark =>
      keep.includes(landmark.name) ? landmark : { ...landmark, x: null, y: null, confidence: null },
    ),
  })
  const refused = estimateRelativeRotationWithProfile(outcome.profile, strip(outcome.reference), strip(outcome.second), {
    set: 'all21',
  })
  assert.equal(refused.refusedReason, 'tooFewLandmarks')

  // Four suffice, because there are no per-point depths left to solve.
  const four = [...keep, 'middleMCP']
  const stripToFour = (observation: ScanObservation): ScanObservation => ({
    ...observation,
    landmarks: observation.landmarks.map(landmark =>
      four.includes(landmark.name) ? landmark : { ...landmark, x: null, y: null, confidence: null },
    ),
  })
  const estimate = estimateRelativeRotationWithProfile(
    outcome.profile,
    stripToFour(outcome.reference),
    stripToFour(outcome.second),
    { set: 'all21' },
  )
  assert.equal(estimate.usedLandmarkIds.length, 4)
  assert.notEqual(estimate.refusedReason, 'tooFewLandmarks')
})

test('the depth branch is chosen by handedness, since both project identically', () => {
  const outcome = run()
  assert.ok(outcome.estimate.referenceFit)
  assert.ok(outcome.estimate.secondFit)
  // The synthetic hand is a right hand and the profile says so, so both views
  // keep the solved branch.
  assert.equal(outcome.estimate.referenceFit.depthBranch, 'asSolved')
  assert.equal(outcome.estimate.secondFit.depthBranch, 'asSolved')

  // Labelled left, the prior flips both views instead — and the fit is just as
  // good, which is the point: the images cannot tell.
  const mislabelled = handProfile(outcome.profile.landmarks, 'left')
  assert.ok(mislabelled)
  const flipped = estimateRelativeRotationWithProfile(mislabelled, outcome.reference, outcome.second, {
    set: 'all21',
  })
  assert.equal(flipped.referenceFit?.depthBranch, 'mirrored')
  assert.equal(flipped.secondFit?.depthBranch, 'mirrored')
  assert.ok(
    Math.abs((flipped.referenceFit?.mismatchRmsPx ?? 1) - outcome.estimate.referenceFit.mismatchRmsPx) < 1e-9,
  )
})

test('each view solves its own scale, so the view scale ratio comes out of the cameras', () => {
  const outcome = run()
  assert.ok(
    Math.abs(outcome.estimate.viewScaleRatio - SECOND_CAMERA.scale / DEFAULT_CAMERA.scale) < 1e-6,
    `scale ratio ${outcome.estimate.viewScaleRatio}`,
  )
})
