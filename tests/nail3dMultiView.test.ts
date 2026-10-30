// Layer B v2 — does a second view recover the degree of freedom one view cannot see?
//
// Stage 3 proved the single-view lift is blind to tilt about the nail bed's own
// width axis: that rotation foreshortens the bed without skewing it, so the
// projection matches a shorter fronto-parallel bed exactly. These tests pin
// down what a second view does and does not fix.
//
// Four questions are measured, in this order:
//   1. how much the pitch bias actually drops         (it goes to zero)
//   2. from what view separation that becomes real    (far later than legality)
//   3. which second viewpoint carries most information (perpendicular to the width axis)
//   4. how sensitive the result is to input error     (annotation and pose)
//
// Everything is synthetic and nothing is converted to metric scale. Layer A's
// format and Layer C / M0-M6 are unchanged on purpose: only the lift is swapped.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DEFAULT_MIN_VIEW_SEPARATION,
  MULTIVIEW_LIFT_METHOD,
  MULTIVIEW_LIFT_VERSION,
  RECOMMENDED_VIEW_SEPARATION,
  identityView,
  liftTwoView,
} from '../src/lib/nail3dMultiView.ts'
import type { MultiViewResult } from '../src/lib/nail3dMultiView.ts'
import { liftObservation, measureLiftBias, socketObservationsFrom } from '../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { computeStability } from '../src/lib/nail3dStability.ts'
import type { Capture } from '../src/lib/nail3dStability.ts'
import { IDENTITY_MAT3, rotationMat3 } from '../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../src/lib/vec3.ts'
import { syntheticHand } from './support/syntheticHand.ts'
import type { SyntheticHand } from './support/syntheticHand.ts'
import {
  DEFAULT_CAMERA,
  jitterObservation,
  projectToObservation,
  truthBed,
  viewRotation,
} from './support/syntheticProjection.ts'
import type { CameraSetup } from './support/syntheticProjection.ts'

/**
 * A deliberately different second camera: another scale and principal point,
 * so nothing can quietly depend on the two views sharing a calibration.
 */
const SECOND_CAMERA: CameraSetup = {
  scale: 1150,
  principalPoint: [1400, 1900],
  imageWidth: 3000,
  imageHeight: 4000,
}

/**
 * An exact match comes back as a few millionths of a degree, because acos
 * loses precision next to 1. Anything under this is "the same direction".
 */
const ANGLE_EPS_DEG = 1e-4

const X_AXIS: Vec3 = [1, 0, 0]
const Y_AXIS: Vec3 = [0, 1, 0]
const Z_AXIS: Vec3 = [0, 0, 1]

/** A hand pitched about its own width axis — the rotation one view cannot see. */
const pitchedHand = (degrees: number): SyntheticHand =>
  syntheticHand(degrees === 0 ? {} : { pose: { rotationAxis: X_AXIS, rotationDeg: degrees } })

const observe = (
  hand: SyntheticHand,
  options: { view?: Mat3; camera?: CameraSetup; jitterPx?: number; seed?: number } = {},
): ScanObservation => {
  let observation = projectToObservation(hand, {
    camera: options.camera ?? DEFAULT_CAMERA,
    view: options.view ?? IDENTITY_MAT3,
  })
  if (options.jitterPx) {
    observation = jitterObservation(observation, { sigmaPx: options.jitterPx, seed: options.seed })
  }
  // Round-trip through the parser, so the tests use the path a file would.
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  assert.ok(parsed.ok, `observation did not parse: ${JSON.stringify(parsed.ok ? null : parsed.errors)}`)
  if (!parsed.ok) throw new Error('unreachable')
  return parsed.value
}

interface Trial {
  /** Single-view bed-normal error against the 3D truth, in degrees. */
  v1NormalDeg: number
  /** Two-view bed-normal error, or null when the lift refused. */
  v2NormalDeg: number | null
  result: MultiViewResult
}

/**
 * Runs both lifts on the same hand: v1 from the reference view alone, v2 from
 * the reference plus a second view rotated by `separationDeg` about `axis`.
 *
 * Annotation noise is drawn separately for each view, and scaled by that
 * view's own pixels-per-unit, because a person annotates each photo
 * independently. Jittering the 3D hand once and projecting it twice would give
 * both views the same error, which a two-view lift then reconstructs exactly —
 * a measurement that looks like noise immunity and is really a shared offset.
 */
const trial = (options: {
  pitchDeg: number
  axis?: Vec3
  separationDeg: number
  jitterPx?: number
  seedA?: number
  seedB?: number
  /** Degrees of error in the relative pose handed to the lift. */
  poseErrorDeg?: number
  minViewSeparation?: number
}): Trial => {
  const hand = pitchedHand(options.pitchDeg)
  const axis = options.axis ?? Y_AXIS
  const trueView = viewRotation(axis, options.separationDeg)
  const jitterPx = options.jitterPx ?? 0

  const reference = observe(hand, { jitterPx, seed: options.seedA ?? 11 })
  const second = observe(hand, {
    view: trueView,
    camera: SECOND_CAMERA,
    // Same physical annotation error, expressed in the second view's pixels.
    jitterPx: jitterPx * (SECOND_CAMERA.scale / DEFAULT_CAMERA.scale),
    seed: options.seedB ?? 977,
  })

  const canonical1 = liftObservation(reference)
  assert.ok(canonical1, 'single-view lift returned null')
  const v1 = measureLiftBias(
    canonical1.landmarks3d,
    hand.landmarks,
    canonical1.beds[0].quad,
    truthBed(hand, 'index'),
  )

  const told =
    options.poseErrorDeg === undefined || options.poseErrorDeg === 0
      ? trueView
      : viewRotation(axis, options.separationDeg + options.poseErrorDeg)

  const result = liftTwoView(
    reference,
    second,
    {
      reference: identityView,
      second: { rotation: told },
      minViewSeparation: options.minViewSeparation,
    },
    ['index'],
  )

  const v2 = result.canonical
    ? measureLiftBias(
        result.canonical.landmarks3d,
        hand.landmarks,
        result.canonical.beds[0].quad,
        truthBed(hand, 'index'),
      )
    : null

  return { v1NormalDeg: v1.bedNormalDeg ?? 0, v2NormalDeg: v2?.bedNormalDeg ?? null, result }
}

/** Mean two-view error over several independent noise draws. */
const meanV2Error = (options: Parameters<typeof trial>[0], draws = 8): number => {
  let total = 0
  for (let k = 0; k < draws; k += 1) {
    const run = trial({ ...options, seedA: 100 + k * 7, seedB: 5000 + k * 13 })
    assert.ok(run.v2NormalDeg !== null, 'the two-view lift refused unexpectedly')
    total += run.v2NormalDeg
  }
  return total / draws
}

// ---------------------------------------------------------------------------
// 1. The blind degree of freedom is genuinely recovered
// ---------------------------------------------------------------------------

test('a second view recovers the pitch the single view cannot see, at every pitch', () => {
  for (const pitch of [0, 10, 20, 35, 50]) {
    const run = trial({ pitchDeg: pitch, separationDeg: 25 })
    assert.ok(run.v2NormalDeg !== null, `pitch ${pitch}: two-view lift refused`)
    // The whole point: v2's bed normal matches the 3D it was projected from.
    assert.ok(run.v2NormalDeg < ANGLE_EPS_DEG, `pitch ${pitch}: v2 normal error ${run.v2NormalDeg}`)
    // ... while v1's error is large and grows one-for-one with the pitch.
    assert.ok(run.v1NormalDeg > 15, `pitch ${pitch}: v1 normal error ${run.v1NormalDeg}`)
  }
})

test('the single-view error grows with the pitch while the two-view error does not', () => {
  const flat = trial({ pitchDeg: 0, separationDeg: 25 })
  const steep = trial({ pitchDeg: 50, separationDeg: 25 })
  // Each degree of pitch adds about a degree of single-view error.
  assert.ok(
    steep.v1NormalDeg - flat.v1NormalDeg > 45,
    `v1 should degrade with pitch: ${flat.v1NormalDeg} -> ${steep.v1NormalDeg}`,
  )
  assert.ok((steep.v2NormalDeg ?? 1) < ANGLE_EPS_DEG && (flat.v2NormalDeg ?? 1) < ANGLE_EPS_DEG)
})

test('the recovered hand reprojects into the second view, so the solve is not fitting noise', () => {
  const run = trial({ pitchDeg: 35, separationDeg: 25 })
  assert.ok(run.result.residuals.reprojectionRmsPx < 1e-6)
  // The scale ratio is solved, not assumed: it is the ratio of the two cameras.
  assert.ok(
    Math.abs(run.result.residuals.viewScaleRatio - SECOND_CAMERA.scale / DEFAULT_CAMERA.scale) < 1e-9,
    `scale ratio ${run.result.residuals.viewScaleRatio}`,
  )
})

// ---------------------------------------------------------------------------
// 2. Degeneracy is detected, not papered over
// ---------------------------------------------------------------------------

test('two identical views are refused rather than turned into a 3D bed', () => {
  const run = trial({ pitchDeg: 35, separationDeg: 0 })
  assert.equal(run.result.canonical, null)
  assert.equal(run.result.residuals.depthObservable, false)
  assert.equal(run.result.residuals.refusedReason, 'viewsTooSimilar')
  assert.equal(run.result.residuals.separationQuality, 'degenerate')
  assert.ok(run.result.residuals.viewSeparationIndex < 1e-12)
})

test('a roll about the viewing axis is exactly degenerate, however large', () => {
  // Rolling the camera rotates the image. It moves no part of the world Z axis
  // into the image plane, so it adds no depth information at any angle.
  for (const degrees of [5, 25, 90]) {
    const run = trial({ pitchDeg: 35, axis: Z_AXIS, separationDeg: degrees })
    assert.ok(run.result.residuals.viewSeparationIndex < 1e-12, `roll ${degrees}`)
    assert.equal(run.result.canonical, null, `roll ${degrees} should not resolve depth`)
    assert.equal(run.result.residuals.refusedReason, 'viewsTooSimilar')
  }
})

test('the separation threshold is where refusal turns into a solve', () => {
  // The index is the sine of the out-of-plane separation, so the default
  // threshold sits just under 3 degrees.
  const below = trial({ pitchDeg: 35, separationDeg: 2 })
  assert.ok(below.result.residuals.viewSeparationIndex < DEFAULT_MIN_VIEW_SEPARATION)
  assert.equal(below.result.canonical, null)
  assert.equal(below.result.residuals.refusedReason, 'viewsTooSimilar')

  const above = trial({ pitchDeg: 35, separationDeg: 3 })
  assert.ok(above.result.residuals.viewSeparationIndex > DEFAULT_MIN_VIEW_SEPARATION)
  assert.ok(above.result.canonical)
  assert.equal(above.result.residuals.depthObservable, true)
})

test('clearing the threshold is reported as weak, not as adequate', () => {
  // This is the trap the grade exists for: at 3 degrees of separation the
  // algebra is solvable and the noiseless answer is exact, yet 5 px of
  // annotation error already costs tens of degrees. Legal is not usable.
  const weak = trial({ pitchDeg: 35, separationDeg: 3 })
  assert.equal(weak.result.residuals.separationQuality, 'weak')

  const adequate = trial({ pitchDeg: 35, separationDeg: 25 })
  assert.ok(adequate.result.residuals.viewSeparationIndex >= RECOMMENDED_VIEW_SEPARATION)
  assert.equal(adequate.result.residuals.separationQuality, 'adequate')
})

test('the caller can demand more separation than the default', () => {
  const run = trial({ pitchDeg: 35, separationDeg: 10, minViewSeparation: 0.5 })
  assert.equal(run.result.canonical, null)
  assert.equal(run.result.residuals.refusedReason, 'viewsTooSimilar')
  assert.equal(run.result.residuals.separationQuality, 'degenerate')
})

test('a view with no usable correspondences is refused with its own reason', () => {
  const hand = pitchedHand(35)
  const reference = observe(hand)
  const second = observe(hand, { view: viewRotation(Y_AXIS, 25), camera: SECOND_CAMERA })
  // Strip the wrist, which anchors the frame.
  const anchorless: ScanObservation = {
    ...second,
    landmarks: second.landmarks.map(landmark =>
      landmark.name === 'wrist' ? { ...landmark, x: null, y: null, confidence: null } : landmark,
    ),
  }
  const run = liftTwoView(
    reference,
    anchorless,
    { reference: identityView, second: { rotation: viewRotation(Y_AXIS, 25) } },
    ['index'],
  )
  assert.equal(run.canonical, null)
  assert.equal(run.residuals.refusedReason, 'tooFewCorrespondences')
})

// ---------------------------------------------------------------------------
// 3. How much separation, and in which direction
// ---------------------------------------------------------------------------

test('more separation buys accuracy under annotation noise', () => {
  // Noiseless, every separation above the threshold is exact, so the cost of a
  // small baseline is only visible once the input has error in it.
  const narrow = meanV2Error({ pitchDeg: 35, separationDeg: 5, jitterPx: 5 })
  const middling = meanV2Error({ pitchDeg: 35, separationDeg: 15, jitterPx: 5 })
  const wide = meanV2Error({ pitchDeg: 35, separationDeg: 40, jitterPx: 5 })

  assert.ok(narrow > middling && middling > wide, `${narrow} / ${middling} / ${wide}`)
  // A barely-legal baseline is no better than the single-view guess it replaced.
  assert.ok(narrow > 30, `5 degrees of separation should be useless: ${narrow}`)
  assert.ok(wide < 12, `40 degrees of separation should be usable: ${wide}`)
})

test('the informative second viewpoint moves perpendicular to the bed width axis', () => {
  // At the same separation index, rotating the second view about X (the bed's
  // width axis — the camera moving over or under the fingertip) beats rotating
  // about Y (moving sideways across the hand). Depth has to be resolved along
  // the bed's foreshortened length, and only the first baseline spreads the
  // bed's own points in the direction the second view gains.
  for (const pitch of [0, 35]) {
    const aboutWidthAxis = meanV2Error({ pitchDeg: pitch, axis: X_AXIS, separationDeg: 25, jitterPx: 5 })
    const acrossHand = meanV2Error({ pitchDeg: pitch, axis: Y_AXIS, separationDeg: 25, jitterPx: 5 })
    assert.ok(
      aboutWidthAxis < acrossHand * 0.8,
      `pitch ${pitch}: about X ${aboutWidthAxis} should beat about Y ${acrossHand}`,
    )
  }
})

// ---------------------------------------------------------------------------
// 4. Sensitivity to input error
// ---------------------------------------------------------------------------

test('annotation noise degrades the two-view bed normal roughly linearly', () => {
  const quiet = meanV2Error({ pitchDeg: 35, separationDeg: 25, jitterPx: 1 })
  const loud = meanV2Error({ pitchDeg: 35, separationDeg: 25, jitterPx: 10 })
  // ~2.5 degrees of normal error per pixel of per-view annotation sigma.
  assert.ok(quiet > 1 && quiet < 4, `1 px -> ${quiet} deg`)
  assert.ok(loud > 4 * quiet, `10 px should cost far more than 1 px: ${quiet} -> ${loud}`)
})

test('even noisy, the two-view lift beats the single-view blind spot it replaces', () => {
  const run = trial({ pitchDeg: 35, separationDeg: 25, jitterPx: 5, seedA: 100, seedB: 5000 })
  assert.ok(run.v2NormalDeg !== null)
  assert.ok(
    run.v2NormalDeg < run.v1NormalDeg / 3,
    `v2 ${run.v2NormalDeg} vs v1 ${run.v1NormalDeg}`,
  )
})

test('an error in the supplied relative pose transfers about one-for-one', () => {
  for (const [poseErrorDeg, expected] of [
    [1, 1.19],
    [2, 2.35],
    [5, 5.68],
  ] as const) {
    const run = trial({ pitchDeg: 35, separationDeg: 25, poseErrorDeg })
    assert.ok(run.v2NormalDeg !== null)
    assert.ok(
      Math.abs(run.v2NormalDeg - expected) < 0.1,
      `pose error ${poseErrorDeg} deg -> normal error ${run.v2NormalDeg}, expected ~${expected}`,
    )
  }
})

test('a wrong relative pose leaves no reprojection residual, so the residual cannot police it', () => {
  // This is the finding that decides how the relative pose must be obtained:
  // the two-view orthographic system has no redundancy against a rotation
  // error, so it absorbs a wrong pose into the depths and still reprojects
  // perfectly. The pose has to be measured by something else (device
  // odometry), to around a degree, because nothing in the images will flag it.
  const run = trial({ pitchDeg: 35, separationDeg: 25, poseErrorDeg: 5 })
  assert.ok(run.v2NormalDeg !== null && run.v2NormalDeg > 5)
  assert.ok(
    run.result.residuals.reprojectionRmsPx < 1e-6,
    `a 5 degree pose error should still reproject cleanly: ${run.result.residuals.reprojectionRmsPx}`,
  )
  assert.equal(
    run.result.canonical?.assumptions.some(line => line.includes('~1:1')),
    true,
    'the assumption list must say the pose error transfers into the result',
  )
})

// ---------------------------------------------------------------------------
// Layers A and C are untouched
// ---------------------------------------------------------------------------

test('both views are plain Layer A observations — camera pose is a lift input', () => {
  const hand = pitchedHand(35)
  const second = observe(hand, { view: viewRotation(Y_AXIS, 25), camera: SECOND_CAMERA })
  // Pose is passed to the lift, never stored as an observation, so Layer A
  // still parses under the unchanged v1 schema and holds no derived values.
  assert.equal(second.schemaVersion, 1)
  assert.ok(!('viewPose' in second))
  assert.ok(!('liftVersion' in second))
})

test('the v2 result declares its own version and method', () => {
  const run = trial({ pitchDeg: 35, separationDeg: 25 })
  assert.equal(run.result.canonical?.liftVersion, MULTIVIEW_LIFT_VERSION)
  assert.equal(run.result.canonical?.liftVersion, 2)
  assert.equal(run.result.canonical?.liftMethod, MULTIVIEW_LIFT_METHOD)
})

test('Layer C and M0-M6 consume the v2 output unchanged', () => {
  // The same socket estimator and the same metrics, with no v2-specific path:
  // that is what makes the lift replaceable.
  const captures: Capture[] = [25, 30, 35].map((separation, index) => {
    const run = trial({ pitchDeg: 35, separationDeg: separation })
    assert.ok(run.result.canonical)
    const socket = socketObservationsFrom(run.result.canonical).get('index')
    assert.ok(socket, `no socket at separation ${separation}`)
    assert.equal(socket.socket.units, 'normalized')
    return { sessionId: `s${index}`, observation: socket }
  })

  const report = computeStability(captures)
  assert.ok(report)
  assert.equal(report.captureCount, 3)
  // The same hand seen through different baselines must give the same socket.
  assert.ok(report.m0CanonicalFrame.rms < 1e-6, `M0=${report.m0CanonicalFrame.rms}`)
  assert.ok(report.m1Origin.rms < 1e-6, `M1=${report.m1Origin.rms}`)
  assert.ok(report.m2Normal.rms < 1e-3, `M2=${report.m2Normal.rms}`)
  assert.ok(report.m4Dimensions.bedLengthCv < 1e-6, `M4=${report.m4Dimensions.bedLengthCv}`)
})

test('nothing in the v2 result claims a metric scale', () => {
  const run = trial({ pitchDeg: 35, separationDeg: 25 })
  const canonical = run.result.canonical
  assert.ok(canonical)
  // Lengths stay in reference-view pixels, and the assumption list says so.
  assert.ok(canonical.scaleReferencePx > 0)
  assert.ok(
    canonical.assumptions.some(line => line.includes('absolute scale is NOT recovered')),
    JSON.stringify(canonical.assumptions),
  )
  assert.ok(!('scaleMm' in canonical) && !('units' in canonical))
})

test('the single-view skew measure is absent from v2 rather than reported as zero', () => {
  // In v1 a zero skew cosine means "could not measure". Depth now comes from
  // the two views, so the measure does not apply and must not be emitted —
  // a zero there would read as a measurement that was never made.
  const run = trial({ pitchDeg: 35, separationDeg: 25 })
  assert.deepEqual(run.result.canonical?.residuals.bedSkewCosine, {})
  assert.equal(run.result.canonical?.residuals.depthResolved, true)
  assert.equal(run.result.canonical?.residuals.clampedBones, 0)
})

test('the relative pose is what matters, not either view on its own', () => {
  // Rotating both views together leaves the relative rotation unchanged, so
  // the separation index and the recovered bed must not move.
  const hand = pitchedHand(35)
  const common = rotationMat3(Y_AXIS, 0.3)
  const relative = viewRotation(Y_AXIS, 25)

  const plain = liftTwoView(
    observe(hand),
    observe(hand, { view: relative, camera: SECOND_CAMERA }),
    { reference: identityView, second: { rotation: relative } },
    ['index'],
  )

  const rotated = liftTwoView(
    observe(hand, { view: common }),
    observe(hand, { view: viewRotation(Y_AXIS, 25 + (0.3 * 180) / Math.PI), camera: SECOND_CAMERA }),
    {
      reference: { rotation: common },
      second: { rotation: viewRotation(Y_AXIS, 25 + (0.3 * 180) / Math.PI) },
    },
    ['index'],
  )

  assert.ok(plain.canonical && rotated.canonical)
  assert.ok(
    Math.abs(plain.residuals.viewSeparationIndex - rotated.residuals.viewSeparationIndex) < 1e-9,
    `${plain.residuals.viewSeparationIndex} vs ${rotated.residuals.viewSeparationIndex}`,
  )
  assert.ok(Math.abs(plain.residuals.viewScaleRatio - rotated.residuals.viewScaleRatio) < 1e-9)
})
