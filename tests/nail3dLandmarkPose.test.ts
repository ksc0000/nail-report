// Stage 5 — can the landmarks supply the relative rotation the lift needs?
//
// The hypothesis under test was a degree-of-freedom count: 21 landmarks give
// 42 equations against 25 unknowns, so the rotation ought to be determined.
// These tests measure it instead, and the count turns out to be wrong about
// where the redundancy sits.
//
// Two landmark sets are compared throughout, with their members named in
// `POSE_LANDMARK_SETS` so a result can always say what produced it:
//
//   all21     — every landmark; depends on the fingers holding still
//   palmRigid — wrist, thumbMCP, indexMCP, middleMCP, ringMCP, pinkyMCP;
//               nearly immune to finger movement, nearly coplanar
//
// Results are reported as median / p95 / worst over independent noise draws,
// never as a mean: the question is whether a capture can be trusted, and a
// mean hides the captures that cannot.
//
// ⚠ The nail bed is never an input here. It is held back so its own residual
// stays an independent check, and one test below pins that.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  OBSERVABLE_MIN_PX_PER_DEG,
  POSE_BUDGET_DEG,
  POSE_LANDMARK_SETS,
  axisDisagreementDeg,
  estimateRelativeRotation,
  poseDisagreement,
  rotationDifference,
  toRotationVector,
} from '../src/lib/nail3dLandmarkPose.ts'
import type { LandmarkPoseEstimate, PoseLandmarkSetName } from '../src/lib/nail3dLandmarkPose.ts'
import { liftTwoView } from '../src/lib/nail3dMultiView.ts'
import { socketObservationsFrom } from '../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import {
  estimateSocket,
  normalAngleDeg,
  originOffsetRatio,
} from '../src/lib/nail3dSocket.ts'
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
/** A realistic transverse metacarpal arch, so the palm is not a flat plane. */
const PALM_ARCH = 0.15
const ALL_FINGERS: readonly Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky']

const centroid = (hand: SyntheticHand): Vec3 =>
  vscale(hand.landmarks.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / 21)

const observe = (
  hand: SyntheticHand,
  view: Mat3,
  camera: CameraSetup,
  options: { jitterPx?: number; seed?: number; lowConfidence?: readonly string[]; missing?: readonly string[] } = {},
): ScanObservation => {
  let observation = projectToObservation(hand, { camera, view })
  if (options.jitterPx) {
    observation = jitterObservation(observation, { sigmaPx: options.jitterPx, seed: options.seed })
  }
  if (options.lowConfidence || options.missing) {
    observation = {
      ...observation,
      landmarks: observation.landmarks.map(landmark =>
        options.missing?.includes(landmark.name)
          ? { ...landmark, x: null, y: null, confidence: null }
          : options.lowConfidence?.includes(landmark.name)
            ? { ...landmark, confidence: 0.1 }
            : landmark,
      ),
    }
  }
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  assert.ok(parsed.ok, 'observation did not parse')
  if (!parsed.ok) throw new Error('unreachable')
  return parsed.value
}

interface SceneOptions {
  separationDeg: number
  /** Move the camera across the hand instead of over the fingertip. */
  azimuth?: boolean
  hand?: SyntheticOptions
  /** Applied to the SECOND view's hand only: it changed between the shots. */
  delta?: SyntheticOptions
  jitterPx?: number
  seedA?: number
  seedB?: number
  lowConfidence?: readonly string[]
  missing?: readonly string[]
}

interface Trial {
  estimate: LandmarkPoseEstimate
  truth: Mat3
  /** Error of whatever rotation the fit landed on, split by axis. */
  fitError: ReturnType<typeof rotationDifference> | null
  /** Error of the rotation AXIS alone — the part that may be observable. */
  axisErrorDeg: number
}

const trial = (set: PoseLandmarkSetName, options: SceneOptions): Trial => {
  const base: SyntheticOptions = {
    palmArch: PALM_ARCH,
    pose: { rotationAxis: [1, 0, 0], rotationDeg: PITCH_DEG },
    ...options.hand,
  }
  const first = syntheticHand(base)
  const secondHand = syntheticHand({ ...base, ...options.delta })
  const target = centroid(first)
  const reference = lookAtRotation(cameraPosition(DISTANCE, 0, 0, target), target)
  const second = lookAtRotation(
    options.azimuth
      ? cameraPosition(DISTANCE, options.separationDeg, 0, target)
      : cameraPosition(DISTANCE, 0, options.separationDeg, target),
    target,
  )
  const truth = multiplyMat3(second, transposeMat3(reference))
  const jitter = options.jitterPx ?? 0

  const estimate = estimateRelativeRotation(
    observe(first, reference, DEFAULT_CAMERA, {
      jitterPx: jitter,
      seed: options.seedA ?? 11,
      lowConfidence: options.lowConfidence,
      missing: options.missing,
    }),
    observe(secondHand, second, SECOND_CAMERA, {
      jitterPx: jitter * (SECOND_CAMERA.scale / DEFAULT_CAMERA.scale),
      seed: options.seedB ?? 977,
      lowConfidence: options.lowConfidence,
      missing: options.missing,
    }),
    { set },
  )

  const fit = estimate.rotation ?? estimate.discardedRotation
  const axis = normalize(toRotationVector(truth)) ?? ([1, 0, 0] as Vec3)
  return {
    estimate,
    truth,
    fitError: fit ? rotationDifference(truth, fit, axis) : null,
    axisErrorDeg: estimate.axisDirection
      ? axisDisagreementDeg(estimate.axisDirection, truth)
      : Number.NaN,
  }
}

interface Spread {
  median: number
  p95: number
  worst: number
}

const spread = (values: readonly number[]): Spread => {
  const sorted = [...values].sort((a, b) => a - b)
  return {
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
    worst: sorted[sorted.length - 1],
  }
}

/** Axis error over independent noise draws — the headline Stage 5 metric. */
const axisSpread = (set: PoseLandmarkSetName, options: SceneOptions, draws = 24): Spread => {
  const values: number[] = []
  for (let k = 0; k < draws; k += 1) {
    const value = trial(set, { ...options, seedA: 100 + k * 7, seedB: 5000 + k * 13 }).axisErrorDeg
    if (Number.isFinite(value)) values.push(value)
  }
  assert.ok(values.length > 0, 'every draw refused')
  return spread(values)
}

const articulate = (degrees: number, fingers: readonly Finger[] = ALL_FINGERS): SyntheticOptions => ({
  articulationDeg: Object.fromEntries(fingers.map(finger => [finger, degrees])),
})

/** An exact match reads as a few millionths of a degree out of acos. */
const ANGLE_EPS_DEG = 1e-3

// ---------------------------------------------------------------------------
// 1. The rotation MAGNITUDE is not observable — exactly, not just poorly
// ---------------------------------------------------------------------------

test('both landmark sets refuse the rotation at every separation', () => {
  // The fit reaches a residual of ~1e-13 px and still lands tens of degrees
  // from the truth. That is a flat valley, not a minimum, so the estimator
  // withholds the rotation instead of returning the angle it stopped at.
  for (const set of ['all21', 'palmRigid'] as const) {
    for (const separationDeg of [10, 25, 40, 60]) {
      const run = trial(set, { separationDeg })
      assert.equal(run.estimate.refusedReason, 'notObservable', `${set} @ ${separationDeg}`)
      assert.equal(run.estimate.rotation, null, `${set} @ ${separationDeg} returned a rotation`)
      assert.equal(run.estimate.confidence, 0)
      assert.ok(run.estimate.residualRmsPx < 1e-6, `residual ${run.estimate.residualRmsPx}`)
    }
  }
})

test('the whole error is about the baseline axis, and none of it is perpendicular', () => {
  // This is the signature of the one-parameter ambiguity: the direction of the
  // rotation is recovered, its size is not.
  for (const set of ['all21', 'palmRigid'] as const) {
    const alongAxis: number[] = []
    for (const separationDeg of [10, 25, 40, 60]) {
      const run = trial(set, { separationDeg })
      assert.ok(run.fitError)
      assert.ok(
        run.fitError.orthogonalDeg < ANGLE_EPS_DEG,
        `${set} @ ${separationDeg}: perpendicular error ${run.fitError.orthogonalDeg}`,
      )
      alongAxis.push(run.fitError.baselineAxisDeg)
    }
    // The magnitude the fit lands on wanders over tens of degrees as the
    // geometry changes, which is what an unconstrained parameter does. One of
    // these runs happens to stop within a couple of degrees of the truth —
    // that is luck inside a flat valley, not a measurement, and the estimator
    // refuses it just the same.
    assert.ok(
      Math.max(...alongAxis) - Math.min(...alongAxis) > 10,
      `${set}: baseline-axis errors should wander, got ${alongAxis}`,
    )
    assert.ok(Math.max(...alongAxis) > POSE_BUDGET_DEG, `${set}: ${alongAxis}`)
  }
})

test('observability reports the unconstrained direction rather than a clean residual', () => {
  const run = trial('all21', { separationDeg: 40 })
  const observability = run.estimate.observability
  assert.ok(observability)
  assert.ok(
    observability.weakestPxPerDeg < OBSERVABLE_MIN_PX_PER_DEG,
    `weakest ${observability.weakestPxPerDeg} px/deg`,
  )
  assert.equal(Number.isFinite(observability.conditionNumber), false)
  assert.equal(Number.isFinite(observability.weakestSigmaDeg), false)
  // The unconstrained direction IS the baseline axis.
  const baselineAxis = normalize(toRotationVector(run.truth)) ?? ([1, 0, 0] as Vec3)
  assert.ok(
    axisDisagreementDeg(observability.weakestAxis, rotationMat3(baselineAxis, 0.5)) < 1,
    `weakest axis ${observability.weakestAxis} vs baseline ${baselineAxis}`,
  )
})

test('no amount of hand depth, thickness or proportion makes the magnitude observable', () => {
  // If this were a conditioning problem, a deeper hand would fix it. It is
  // not: the depths absorb one image equation per point whatever the shape.
  const variations: Array<[string, SyntheticOptions]> = [
    ['flat palm', { palmArch: 0 }],
    ['deep arch', { palmArch: 0.25 }],
    ['thin hand', { palmArch: PALM_ARCH, depthScale: 0.5 }],
    ['thick hand', { palmArch: PALM_ARCH, depthScale: 2 }],
    [
      'varied finger proportions',
      { palmArch: PALM_ARCH, fingerScale: { thumb: 1.2, index: 0.85, middle: 1.1, ring: 0.9, pinky: 1.25 } },
    ],
  ]
  for (const [name, hand] of variations) {
    const run = trial('all21', { separationDeg: 40, hand })
    assert.equal(run.estimate.refusedReason, 'notObservable', name)
    assert.ok((run.estimate.observability?.weakestPxPerDeg ?? 1) < OBSERVABLE_MIN_PX_PER_DEG, name)
  }
})

// ---------------------------------------------------------------------------
// 2. The rotation AXIS is observable, and well
// ---------------------------------------------------------------------------

test('the axis direction is recovered exactly from a clean capture', () => {
  for (const set of ['all21', 'palmRigid'] as const) {
    for (const separationDeg of [10, 25, 40, 60]) {
      const run = trial(set, { separationDeg })
      assert.ok(
        run.axisErrorDeg < ANGLE_EPS_DEG,
        `${set} @ ${separationDeg}: axis error ${run.axisErrorDeg}`,
      )
    }
  }
})

test('all21 holds the axis inside the Stage 4.5 budget under realistic noise', () => {
  // 2 px per view is the annotation sigma Stage 4.5 called realistic.
  const wide = axisSpread('all21', { separationDeg: 40, jitterPx: 2 })
  assert.ok(wide.median < 1.5, `median ${wide.median}`)
  assert.ok(wide.p95 < POSE_BUDGET_DEG, `p95 ${wide.p95}`)
  assert.ok(wide.worst < 2 * POSE_BUDGET_DEG, `worst ${wide.worst}`)

  // A narrow baseline costs precision here too, as everywhere else.
  const narrow = axisSpread('all21', { separationDeg: 10, jitterPx: 2 })
  assert.ok(narrow.median > wide.median * 2, `${narrow.median} vs ${wide.median}`)
})

test('palm-only loses the axis to noise, by a factor of several', () => {
  const all = axisSpread('all21', { separationDeg: 40, jitterPx: 2 })
  const palm = axisSpread('palmRigid', { separationDeg: 40, jitterPx: 2 })
  assert.ok(palm.median > all.median * 3, `palm ${palm.median} vs all ${all.median}`)
  // And its p95 is far outside the budget, so individual captures are unusable.
  assert.ok(palm.p95 > POSE_BUDGET_DEG * 3, `palm p95 ${palm.p95}`)
})

test("palm-only's axis precision is set by the arch depth — a per-person property", () => {
  // Six nearly coplanar points carry rotation information only through the
  // metacarpal arch, so a flatter hand is worse. all21 barely notices.
  const flatPalm = axisSpread('palmRigid', { separationDeg: 40, jitterPx: 2, hand: { palmArch: 0 } })
  const deepArch = axisSpread('palmRigid', { separationDeg: 40, jitterPx: 2, hand: { palmArch: 0.25 } })
  assert.ok(flatPalm.median > deepArch.median * 2, `flat ${flatPalm.median} vs deep ${deepArch.median}`)

  const flatAll = axisSpread('all21', { separationDeg: 40, jitterPx: 2, hand: { palmArch: 0 } })
  const deepAll = axisSpread('all21', { separationDeg: 40, jitterPx: 2, hand: { palmArch: 0.25 } })
  assert.ok(flatAll.median < deepAll.median * 2, `all21 should barely care: ${flatAll.median} / ${deepAll.median}`)
})

// ---------------------------------------------------------------------------
// 3. Finger articulation — where the extra points turn into a liability
// ---------------------------------------------------------------------------

test('with a baseline across the hand, more points make the estimate WORSE once fingers move', () => {
  // The crossover sits below one degree of flexion: all21 wins only on a hand
  // that is perfectly still, and palmRigid is exactly immune at every level.
  const still = {
    all: axisSpread('all21', { separationDeg: 40, azimuth: true, jitterPx: 2 }),
    palm: axisSpread('palmRigid', { separationDeg: 40, azimuth: true, jitterPx: 2 }),
  }
  assert.ok(still.all.median < still.palm.median, `rigid: all ${still.all.median} palm ${still.palm.median}`)

  for (const flexion of [1, 2, 5]) {
    const all = axisSpread('all21', {
      separationDeg: 40,
      azimuth: true,
      jitterPx: 2,
      delta: articulate(flexion),
    })
    const palm = axisSpread('palmRigid', {
      separationDeg: 40,
      azimuth: true,
      jitterPx: 2,
      delta: articulate(flexion),
    })
    assert.ok(
      all.median > palm.median,
      `${flexion} deg of flexion: all21 ${all.median} should be worse than palm ${palm.median}`,
    )
    // palmRigid is unchanged by flexion, to the last digit.
    assert.ok(Math.abs(palm.median - still.palm.median) < 1e-9, `palm moved: ${palm.median}`)
  }

  // And it degrades roughly linearly with the flexion angle.
  const oneDegree = axisSpread('all21', { separationDeg: 40, azimuth: true, jitterPx: 2, delta: articulate(1) })
  const fiveDegrees = axisSpread('all21', { separationDeg: 40, azimuth: true, jitterPx: 2, delta: articulate(5) })
  assert.ok(fiveDegrees.median > oneDegree.median * 4, `${oneDegree.median} -> ${fiveDegrees.median}`)
})

test('articulation shows in the residual, so non-rigidity is detectable — unlike the pose magnitude', () => {
  const still = trial('all21', { separationDeg: 40, azimuth: true })
  assert.ok(still.estimate.residualRmsPx < 1e-6)
  for (const flexion of [1, 2, 5]) {
    const moved = trial('all21', { separationDeg: 40, azimuth: true, delta: articulate(1 * flexion, ['index']) })
    assert.ok(
      moved.estimate.residualRmsPx > 2 * flexion,
      `${flexion} deg of index flexion -> residual ${moved.estimate.residualRmsPx}`,
    )
  }
})

test('⚠ with a baseline over the fingertip, flexion is invisible to the landmarks entirely', () => {
  // Finger flexion and Stage 4's preferred baseline share an axis, so the
  // flexion lands wholly in the component the images cannot see: no axis
  // error, no residual, nothing to reject on. The next test shows it is
  // nevertheless wrecking the socket.
  for (const flexion of [1, 2, 5]) {
    const run = trial('all21', { separationDeg: 40, delta: articulate(flexion) })
    assert.ok(run.axisErrorDeg < ANGLE_EPS_DEG, `${flexion} deg -> axis error ${run.axisErrorDeg}`)
    assert.ok(run.estimate.residualRmsPx < 1e-6, `${flexion} deg -> residual ${run.estimate.residualRmsPx}`)
  }
})

test('that invisible flexion is destroying the socket, and the baseline direction decides how much', () => {
  // With the TRUE pose handed to the lift, so only the hand's own movement is
  // at fault. Over the fingertip: 8.6% of bed length per degree of flexion and
  // a reprojection residual of exactly zero. Across the hand: a quarter of the
  // damage and a residual that shouts.
  const measure = (azimuth: boolean, flexionDeg: number) => {
    const base: SyntheticOptions = {
      palmArch: PALM_ARCH,
      pose: { rotationAxis: [1, 0, 0], rotationDeg: PITCH_DEG },
    }
    const first = syntheticHand(base)
    const moved = syntheticHand({ ...base, ...articulate(flexionDeg, ['index']) })
    const target = centroid(first)
    const reference = lookAtRotation(cameraPosition(DISTANCE, 0, 0, target), target)
    const second = lookAtRotation(
      azimuth ? cameraPosition(DISTANCE, 40, 0, target) : cameraPosition(DISTANCE, 0, 40, target),
      target,
    )
    const result = liftTwoView(
      observe(first, reference, DEFAULT_CAMERA),
      observe(moved, second, SECOND_CAMERA),
      { reference: { rotation: reference }, second: { rotation: second } },
      ['index'],
    )
    assert.ok(result.canonical)
    const socket = socketObservationsFrom(result.canonical).get('index')
    assert.ok(socket)
    const truth = estimateSocket(first.landmarks, truthBed(first, 'index'), 'index')
    assert.ok(truth)
    return {
      originPct: originOffsetRatio(socket.socket, truth.socket) * 100,
      normalDeg: normalAngleDeg(socket.socket, truth.socket) ?? Number.NaN,
      residualPx: result.residuals.reprojectionRmsPx,
    }
  }

  const overFingertip = measure(false, 1)
  const acrossHand = measure(true, 1)

  // Over the fingertip: large damage, zero signal.
  assert.ok(overFingertip.originPct > 7, `origin ${overFingertip.originPct}`)
  assert.ok(overFingertip.residualPx < 1e-6, `residual ${overFingertip.residualPx}`)
  // Across the hand: much less damage, and loudly visible.
  assert.ok(acrossHand.originPct < overFingertip.originPct / 3, `origin ${acrossHand.originPct}`)
  assert.ok(acrossHand.residualPx > 3, `residual ${acrossHand.residualPx}`)
})

// ---------------------------------------------------------------------------
// 4. Confidence, missing landmarks, handedness
// ---------------------------------------------------------------------------

test('low-confidence and absent landmarks are rejected by name, and the rest still estimates', () => {
  const tips = ALL_FINGERS.map(finger => `${finger}TIP`)
  const lowered = trial('all21', { separationDeg: 40, jitterPx: 2, lowConfidence: tips })
  assert.deepEqual([...lowered.estimate.rejectedLandmarkIds].sort(), [...tips].sort())
  assert.equal(lowered.estimate.usedLandmarkIds.length, 21 - tips.length)
  assert.ok(!lowered.estimate.usedLandmarkIds.some(id => tips.includes(id)))

  // Dropping them outright gives the same answer, since the threshold already
  // excluded them: a low confidence is treated as absent, not down-weighted
  // into mattering anyway.
  const dropped = trial('all21', { separationDeg: 40, jitterPx: 2, missing: tips })
  assert.equal(dropped.estimate.usedLandmarkIds.length, lowered.estimate.usedLandmarkIds.length)
  assert.ok(Math.abs(dropped.axisErrorDeg - lowered.axisErrorDeg) < 1e-9)
})

test('losing landmarks degrades the axis gracefully rather than cliff-edging', () => {
  const full = axisSpread('all21', { separationDeg: 40, jitterPx: 2 })
  const noTips = axisSpread('all21', {
    separationDeg: 40,
    jitterPx: 2,
    missing: ALL_FINGERS.map(finger => `${finger}TIP`),
  })
  const noTipsOrDips = axisSpread('all21', {
    separationDeg: 40,
    jitterPx: 2,
    missing: ALL_FINGERS.flatMap(finger => [`${finger}TIP`, `${finger}DIP`]),
  })
  assert.ok(noTips.median >= full.median, `${full.median} -> ${noTips.median}`)
  assert.ok(noTipsOrDips.median < 6, `11 landmarks should still work: ${noTipsOrDips.median}`)
})

test('too few landmarks is refused with its own reason, not estimated anyway', () => {
  const run = trial('palmRigid', {
    separationDeg: 40,
    missing: ['indexMCP', 'middleMCP', 'ringMCP'],
  })
  assert.equal(run.estimate.refusedReason, 'tooFewLandmarks')
  assert.equal(run.estimate.rotation, null)
  assert.equal(run.estimate.axisDirection, null)
  assert.equal(run.estimate.observability, null)
  assert.equal(run.estimate.confidence, 0)
})

test('the two depth branches fit identically, so handedness is what picks one', () => {
  const base: SyntheticOptions = {
    palmArch: PALM_ARCH,
    pose: { rotationAxis: [1, 0, 0], rotationDeg: PITCH_DEG },
  }
  const hand = syntheticHand(base)
  const target = centroid(hand)
  const reference = lookAtRotation(cameraPosition(DISTANCE, 0, 0, target), target)
  const second = lookAtRotation(cameraPosition(DISTANCE, 0, 40, target), target)

  const estimates = (['right', 'left'] as const).map(handedness =>
    estimateRelativeRotation(
      { ...observe(hand, reference, DEFAULT_CAMERA), handedness },
      { ...observe(hand, second, SECOND_CAMERA), handedness },
      { set: 'all21' },
    ),
  )

  // Identical residual and identical scale ratio: the images cannot tell the
  // branches apart, which is why the prior has to.
  assert.ok(Math.abs(estimates[0].residualRmsPx - estimates[1].residualRmsPx) < 1e-12)
  assert.ok(Math.abs(estimates[0].viewScaleRatio - estimates[1].viewScaleRatio) < 1e-9)
  // The synthetic hand is a right hand, so only the right-handed prior keeps
  // the solved branch.
  assert.equal(estimates[0].depthBranch, 'asSolved')
  assert.equal(estimates[1].depthBranch, 'mirrored')
})

// ---------------------------------------------------------------------------
// 5. The nail bed stays out
// ---------------------------------------------------------------------------

test('the nail-bed annotation cannot influence the estimate', () => {
  // The estimator's input type exposes `landmarks` only. This pins the
  // consequence: moving every bed point by 300 px changes nothing, which is
  // what keeps the bed's own residual an independent check on the pose.
  const base: SyntheticOptions = {
    palmArch: PALM_ARCH,
    pose: { rotationAxis: [1, 0, 0], rotationDeg: PITCH_DEG },
  }
  const hand = syntheticHand(base)
  const target = centroid(hand)
  const reference = lookAtRotation(cameraPosition(DISTANCE, 0, 0, target), target)
  const second = lookAtRotation(cameraPosition(DISTANCE, 0, 40, target), target)
  const a = observe(hand, reference, DEFAULT_CAMERA)
  const b = observe(hand, second, SECOND_CAMERA)

  const wreckBeds = (observation: ScanObservation): ScanObservation => ({
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

  const clean = estimateRelativeRotation(a, b, { set: 'all21' })
  const wrecked = estimateRelativeRotation(wreckBeds(a), wreckBeds(b), { set: 'all21' })
  assert.deepEqual(wrecked.discardedRotation, clean.discardedRotation)
  assert.equal(wrecked.residualRmsPx, clean.residualRmsPx)
  assert.deepEqual(wrecked.usedLandmarkIds, clean.usedLandmarkIds)
})

test('the named sets say exactly which landmarks they use', () => {
  assert.equal(POSE_LANDMARK_SETS.all21.length, 21)
  assert.deepEqual(POSE_LANDMARK_SETS.palmRigid, [
    'wrist',
    'thumbMCP',
    'indexMCP',
    'middleMCP',
    'ringMCP',
    'pinkyMCP',
  ])
  const run = trial('palmRigid', { separationDeg: 40 })
  assert.deepEqual(run.estimate.usedLandmarkIds, POSE_LANDMARK_SETS.palmRigid)
  assert.equal(run.estimate.set, 'palmRigid')
})

// ---------------------------------------------------------------------------
// 6. Cross-check arithmetic (no platform code)
// ---------------------------------------------------------------------------

test('rotationDifference splits an error into its baseline-axis and perpendicular parts', () => {
  const axis: Vec3 = [1, 0, 0]
  const truth = rotationMat3(axis, (25 * Math.PI) / 180)

  const alongAxis = multiplyMat3(rotationMat3(axis, (3 * Math.PI) / 180), truth)
  const along = rotationDifference(truth, alongAxis, axis)
  assert.ok(Math.abs(along.totalDeg - 3) < 1e-6)
  assert.ok(Math.abs(along.baselineAxisDeg - 3) < 1e-6)
  assert.ok(along.orthogonalDeg < 1e-6)

  const acrossAxis = multiplyMat3(rotationMat3([0, 0, 1], (3 * Math.PI) / 180), truth)
  const across = rotationDifference(truth, acrossAxis, axis)
  assert.ok(Math.abs(across.totalDeg - 3) < 1e-6)
  assert.ok(across.baselineAxisDeg < 1e-6)
  assert.ok(Math.abs(across.orthogonalDeg - 3) < 1e-6)
})

test('poseDisagreement separates the part a cross-check can police from the part it cannot', () => {
  const landmarkRotation = rotationMat3([1, 0, 0], (25 * Math.PI) / 180)
  // An external pose that differs only in magnitude about the same axis: the
  // landmarks said nothing about that, so this disagreement is uninformative.
  const sameAxis = rotationMat3([1, 0, 0], (31 * Math.PI) / 180)
  const magnitudeOnly = poseDisagreement(landmarkRotation, sameAxis)
  assert.ok(Math.abs(magnitudeOnly.baselineAxisDeg - 6) < 1e-6)
  assert.ok(magnitudeOnly.orthogonalDeg < 1e-6)
  assert.ok(axisDisagreementDeg([1, 0, 0], sameAxis) < 1e-6)

  // An external pose about a different axis: that the landmarks DO contradict.
  // Two 25-degree rotations about axes 11.3 degrees apart differ by about
  // 2*sin(25/2)*11.3 = 4.9 degrees, all of it perpendicular.
  const tilted = rotationMat3(normalize([1, 0.2, 0]) ?? [1, 0, 0], (25 * Math.PI) / 180)
  const tiltedGap = poseDisagreement(landmarkRotation, tilted)
  assert.ok(tiltedGap.orthogonalDeg > 4, `perpendicular disagreement ${tiltedGap.orthogonalDeg}`)
  assert.ok(tiltedGap.baselineAxisDeg < 1, `should be perpendicular: ${tiltedGap.baselineAxisDeg}`)
  const axisGap = axisDisagreementDeg([1, 0, 0], tilted)
  assert.ok(Math.abs(axisGap - (Math.atan2(0.2, 1) * 180) / Math.PI) < 1e-6, `axis gap ${axisGap}`)
})

test('axisDisagreementDeg ignores the sign convention of the axis', () => {
  const rotation = rotationMat3([0, 1, 0], (30 * Math.PI) / 180)
  assert.ok(axisDisagreementDeg([0, 1, 0], rotation) < 1e-9)
  assert.ok(axisDisagreementDeg([0, -1, 0], rotation) < 1e-9)
})

test('a landmark axis estimate from a real capture agrees with an external pose to within its own noise', () => {
  // The usable half of the Stage 4.5 cross-check, end to end: the landmark
  // axis against the pose an external source would report.
  const run = trial('all21', { separationDeg: 40, jitterPx: 2, seedA: 100, seedB: 5000 })
  assert.ok(run.estimate.axisDirection)
  const gap = axisDisagreementDeg(run.estimate.axisDirection, run.truth)
  assert.ok(gap < POSE_BUDGET_DEG, `axis gap ${gap}`)
  // A fabricated external pose 10 degrees off axis is caught.
  const wrongAxis = multiplyMat3(rotationMat3([0, 0, 1], (10 * Math.PI) / 180), run.truth)
  assert.ok(axisDisagreementDeg(run.estimate.axisDirection, wrongAxis) > 5)
})
