// Stage 7 — how little does the first-run Hand Calibration need to measure?
//
// Stage 6 made the Personal HandProfile a precondition and found that only the
// palm's aspect ratio had to be accurate. These tests check what that buys in
// practice, across a population of hand shapes (tests/support/handPopulation)
// rather than one convenient hand:
//
//   H0 generic profile
//   H1 generic profile stretched to the person's palm aspect ratio
//   H2 generic depths with the person's in-plane layout from a face-on photo
//   H3 the exact personal profile
//
// The headline is conditional, so it is pinned both ways: H1 is as good as H3
// when the daily pose is read from the palm landmarks, and is NOT when it is
// read from all 21 — because a single palm ratio cannot tell a wide palm from
// a short one, and the fingers notice the difference.
//
// Everything measured here is a ratio; no test reads a length in centimetres,
// and two of them check that nothing depends on one.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ASPECT_DEFINITIONS,
  CALIBRATION_VERSION,
  PALM_ASPECT_LANDMARKS,
  measurePalmStretch,
  measureProfileStretch,
  palmFrame,
  personalizeInPlane,
  stretchProfileLaterally,
} from '../src/lib/nail3dHandCalibration.ts'
import type { AspectDefinition } from '../src/lib/nail3dHandCalibration.ts'
import type { HandProfile3D } from '../src/lib/nail3dProfilePose.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { dot, sub } from '../src/lib/vec3.ts'
import { gaussianSource } from './support/syntheticHand.ts'
import type { SyntheticOptions } from './support/syntheticHand.ts'
import {
  GENERIC_PROFILE,
  PERSONS,
  calibrationFrame,
  dailyScan,
  profileOf,
  spread,
  trueStretch,
} from './support/handPopulation.ts'
import type { CalibrationFrame, Spread } from './support/handPopulation.ts'

const DRAWS = 4

type Tier = 'H0' | 'H1' | 'H2' | 'H3'

const tierProfile = (tier: Tier, geometry: SyntheticOptions): HandProfile3D => {
  if (tier === 'H0') return GENERIC_PROFILE
  if (tier === 'H3') return profileOf(geometry)
  if (tier === 'H1') {
    const stretched = stretchProfileLaterally(GENERIC_PROFILE, trueStretch(geometry))
    assert.ok(stretched)
    return stretched
  }
  const inPlane = personalizeInPlane(GENERIC_PROFILE, calibrationFrame(geometry))
  assert.ok(inPlane)
  return inPlane
}

interface Pooled {
  total: Spread
  baselineAxis: Spread
  orthogonal: Spread
  socketOrigin: Spread
  bedWidth: Spread
  bedLength: Spread
  mismatch: Spread
  perPersonBaselineMedian: number[]
}

/** Daily-scan errors pooled over every person and several noise draws. */
const pooled = (
  profileFor: (geometry: SyntheticOptions) => HandProfile3D,
  set: 'all21' | 'palmRigid',
  draws = DRAWS,
): Pooled => {
  const total: number[] = []
  const baselineAxis: number[] = []
  const orthogonal: number[] = []
  const socketOrigin: number[] = []
  const bedWidth: number[] = []
  const bedLength: number[] = []
  const mismatch: number[] = []
  const perPersonBaselineMedian: number[] = []
  for (const [, geometry] of PERSONS) {
    const profile = profileFor(geometry)
    const own: number[] = []
    for (let k = 0; k < draws; k += 1) {
      const result = dailyScan(geometry, profile, { set, seedA: 100 + k * 7, seedB: 5000 + k * 13 })
      assert.ok(result, 'daily scan produced no rotation')
      total.push(result.totalDeg)
      baselineAxis.push(result.baselineAxisDeg)
      orthogonal.push(result.orthogonalDeg)
      socketOrigin.push(result.socketOriginPct)
      bedWidth.push(result.bedWidthPct)
      bedLength.push(result.bedLengthPct)
      mismatch.push(result.mismatchPx)
      own.push(result.baselineAxisDeg)
    }
    perPersonBaselineMedian.push(spread(own).median)
  }
  return {
    total: spread(total),
    baselineAxis: spread(baselineAxis),
    orthogonal: spread(orthogonal),
    socketOrigin: spread(socketOrigin),
    bedWidth: spread(bedWidth),
    bedLength: spread(bedLength),
    mismatch: spread(mismatch),
    perPersonBaselineMedian,
  }
}

/** Calibration stretch error in percent, pooled over persons and draws. */
const calibrationError = (
  measure: (geometry: SyntheticOptions, draw: number) => number | null,
  draws = DRAWS,
): { signed: Spread; absolute: Spread } => {
  const signed: number[] = []
  const absolute: number[] = []
  for (const [, geometry] of PERSONS) {
    const target = trueStretch(geometry)
    for (let d = 0; d < draws; d += 1) {
      const stretch = measure(geometry, d)
      assert.ok(stretch !== null, 'calibration refused unexpectedly')
      const error = (stretch / target - 1) * 100
      signed.push(error)
      absolute.push(Math.abs(error))
    }
  }
  return { signed: spread(signed), absolute: spread(absolute) }
}

const singleFrame = (definition: AspectDefinition, frame: CalibrationFrame) =>
  (geometry: SyntheticOptions): number | null =>
    measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry, frame), definition).stretch

/**
 * A realistic hold: the user aims for face-on and wobbles about a systematic
 * posture from frame to frame — tilt +-3 degrees, wrist landmark +-2% of palm
 * length, 2 px of noise. Frames are independent draws, which a real capture
 * only approximates if they are spread over a few seconds of natural motion.
 */
const heldFrames = (
  posture: { yawDeg?: number; pitchDeg?: number; wristShift?: number; wobble?: number },
  count: number,
  seed: number,
): CalibrationFrame[] => {
  const gaussian = gaussianSource(seed)
  const wobble = posture.wobble ?? 1
  return Array.from({ length: count }, (_, i) => ({
    yawDeg: (posture.yawDeg ?? 0) + gaussian() * 3 * wobble,
    pitchDeg: (posture.pitchDeg ?? 0) + gaussian() * 3 * wobble,
    wristShift: (posture.wristShift ?? 0) + gaussian() * 0.02 * wobble,
    jitterPx: 2,
    seed: seed * 31 + i,
  }))
}

const averagedStretch = (geometry: SyntheticOptions, frames: readonly CalibrationFrame[]): number => {
  const stretches = frames.map(frame => {
    const stretch = measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry, frame), 'palmShapeFit').stretch
    assert.ok(stretch !== null)
    return stretch
  })
  return stretches.reduce((sum, value) => sum + value, 0) / stretches.length
}

// ---------------------------------------------------------------------------
// The profile operations themselves
// ---------------------------------------------------------------------------

test('the lateral stretch moves points across the palm only, about its centre', () => {
  assert.equal(CALIBRATION_VERSION, 1)
  const frame = palmFrame(GENERIC_PROFILE)
  assert.ok(frame)
  // Orthonormal palm axes.
  assert.ok(Math.abs(dot(frame.lateral, frame.longitudinal)) < 1e-9)
  assert.ok(Math.abs(dot(frame.lateral, frame.normal)) < 1e-9)
  assert.ok(Math.abs(dot(frame.longitudinal, frame.normal)) < 1e-9)

  const identity = stretchProfileLaterally(GENERIC_PROFILE, 1)
  assert.deepEqual(identity?.landmarks, GENERIC_PROFILE.landmarks)

  const wider = stretchProfileLaterally(GENERIC_PROFILE, 1.1)
  assert.ok(wider)
  wider.landmarks.forEach((point, index) => {
    const before = sub(GENERIC_PROFILE.landmarks[index], frame.centre)
    const after = sub(point, frame.centre)
    assert.ok(Math.abs(dot(after, frame.lateral) - 1.1 * dot(before, frame.lateral)) < 1e-9)
    assert.ok(Math.abs(dot(after, frame.longitudinal) - dot(before, frame.longitudinal)) < 1e-9)
    assert.ok(Math.abs(dot(after, frame.normal) - dot(before, frame.normal)) < 1e-9)
  })
  assert.equal(stretchProfileLaterally(GENERIC_PROFILE, 0), null)
})

test('the palm aspect is read from the wrist and the four finger MCPs, never the thumb', () => {
  assert.deepEqual(PALM_ASPECT_LANDMARKS, ['wrist', 'indexMCP', 'middleMCP', 'ringMCP', 'pinkyMCP'])
  const measured = measurePalmStretch(GENERIC_PROFILE, calibrationFrame(PERSONS[0][1]), 'palmShapeFit')
  assert.deepEqual(measured.usedLandmarkIds, PALM_ASPECT_LANDMARKS)
})

// ---------------------------------------------------------------------------
// 1. Which tier is enough — and why the answer depends on the daily landmarks
// ---------------------------------------------------------------------------

test('with a palm-only daily pose, H1 performs like the exact profile', () => {
  const h0 = pooled(geometry => tierProfile('H0', geometry), 'palmRigid')
  const h1 = pooled(geometry => tierProfile('H1', geometry), 'palmRigid')
  const h3 = pooled(geometry => tierProfile('H3', geometry), 'palmRigid')

  // H1 sits within half a degree of H3 at the median and p95 of the
  // baseline-axis component — the one no residual can police.
  assert.ok(Math.abs(h1.baselineAxis.median - h3.baselineAxis.median) < 0.5, `${h1.baselineAxis.median} vs ${h3.baselineAxis.median}`)
  assert.ok(h1.baselineAxis.p95 < h3.baselineAxis.p95 + 1, `${h1.baselineAxis.p95} vs ${h3.baselineAxis.p95}`)
  assert.ok(h1.total.worst < 4, `H1 worst ${h1.total.worst}`)
  // While the generic profile is far outside the budget on palm landmarks.
  assert.ok(h0.total.p95 > 8, `H0 p95 ${h0.total.p95}`)
  // The socket, dominated by annotation noise, cannot tell H1 from H3.
  assert.ok(Math.abs(h1.socketOrigin.median - h3.socketOrigin.median) < 2)
})

test('with an all-21 daily pose, H1 is NOT enough — the fingers see what one ratio cannot', () => {
  const h1 = pooled(geometry => tierProfile('H1', geometry), 'all21')
  const h2 = pooled(geometry => tierProfile('H2', geometry), 'all21')
  const h3 = pooled(geometry => tierProfile('H3', geometry), 'all21')
  assert.ok(h1.total.p95 > 3.5, `H1 p95 ${h1.total.p95}`)
  // The in-plane layout from a face-on photo restores it.
  assert.ok(h2.total.p95 < 1.5, `H2 p95 ${h2.total.p95}`)
  assert.ok(h3.total.p95 < 0.5, `H3 p95 ${h3.total.p95}`)
})

test('a short palm and a wide palm raise the aspect alike, and H1 corrects them differently', () => {
  // P1 differs only in width, P3 only in palm length. Both have a palm aspect
  // about 10% above generic, so H1 applies nearly the same stretch to both —
  // right for P1, wrong for P3, whose FINGERS are now too short relative to
  // the stretched palm. On an all-21 pose that makes H1 worse than no
  // calibration at all for P3.
  const wide = PERSONS[0][1]
  const short = PERSONS[2][1]
  assert.ok(Math.abs(trueStretch(wide) - trueStretch(short)) < 0.02)

  const median = (geometry: SyntheticOptions, tier: Tier) => {
    const values: number[] = []
    for (let k = 0; k < DRAWS; k += 1) {
      const result = dailyScan(geometry, tierProfile(tier, geometry), { seedA: 100 + k * 7, seedB: 5000 + k * 13 })
      assert.ok(result)
      values.push(result.totalDeg)
    }
    return spread(values).median
  }
  assert.ok(median(wide, 'H1') < median(wide, 'H0') / 2, 'H1 should fix the wide palm')
  assert.ok(median(short, 'H1') > median(short, 'H0'), 'H1 should make the short palm worse on all21')
})

// ---------------------------------------------------------------------------
// 2. How accurately must the aspect be measured?
// ---------------------------------------------------------------------------

test('aspect error: about 1% stays at the calibration floor, and 5% does NOT hold 2 degrees', () => {
  // Stage 6 measured +5% palm width at 1.83 degrees with an otherwise exact
  // profile and all 21 landmarks. Across hand shapes, with H1 and the palm
  // landmarks the daily pose depends on, 5% costs nearly twice that at p95 —
  // and even a perfect aspect leaves H1 a p95 near 2 degrees, so the 2-degree
  // line is a floor to stay near, not a margin to spend.
  const at = (eps: number) =>
    pooled(
      geometry => {
        const stretched = stretchProfileLaterally(GENERIC_PROFILE, trueStretch(geometry) * (1 + eps))
        assert.ok(stretched)
        return stretched
      },
      'palmRigid',
    )
  const floor = at(0)
  assert.ok(floor.baselineAxis.p95 < 2.5, `0%: baseline-axis p95 ${floor.baselineAxis.p95}`)
  for (const eps of [0.01, -0.01]) {
    const result = at(eps)
    assert.ok(
      result.baselineAxis.p95 < floor.baselineAxis.p95 + 0.9,
      `${eps * 100}%: baseline-axis p95 ${result.baselineAxis.p95} against a floor of ${floor.baselineAxis.p95}`,
    )
    assert.ok(result.baselineAxis.p95 < 3, `${eps * 100}%: p95 ${result.baselineAxis.p95}`)
  }
  const fivePercent = at(0.05)
  assert.ok(fivePercent.baselineAxis.p95 > 3.5, `+5%: baseline-axis p95 ${fivePercent.baselineAxis.p95}`)
  const tenPercent = at(0.1)
  assert.ok(tenPercent.baselineAxis.median > 4, `+10%: baseline-axis median ${tenPercent.baselineAxis.median}`)
})

// ---------------------------------------------------------------------------
// 3. Which 2D definition of "aspect"?
// ---------------------------------------------------------------------------

test('palmShapeFit is the only definition with no built-in bias across hand shapes', () => {
  const exact = calibrationError(singleFrame('palmShapeFit', {}), 1)
  assert.ok(exact.absolute.worst < 1e-6, `palmShapeFit worst ${exact.absolute.worst}`)
  // A polyline across the MCPs reads each person's MCP placement as shape.
  const polyline = calibrationError(singleFrame('mcpSpanOverWristMiddle', {}), 1)
  assert.ok(polyline.absolute.worst > 2, `mcpSpan worst ${polyline.absolute.worst}`)
})

test('palmShapeFit has the tightest tail under landmark noise', () => {
  const noisy = (definition: AspectDefinition) =>
    calibrationError((geometry, d) => singleFrame(definition, { jitterPx: 2, seed: 100 + d * 7 })(geometry))
  const fit = noisy('palmShapeFit')
  for (const other of ASPECT_DEFINITIONS.filter(definition => definition !== 'palmShapeFit')) {
    assert.ok(noisy(other).absolute.p95 > fit.absolute.p95, `${other} should have a wider p95 than palmShapeFit (${fit.absolute.p95})`)
  }
  assert.ok(fit.absolute.p95 < 1.6, `palmShapeFit p95 ${fit.absolute.p95}`)
})

test('⚠ every palm definition inherits a wrist-landmark shift almost one-for-one', () => {
  // The wrist is the palm's only proximal landmark, so palm length — and with
  // it the aspect — moves with wherever the detector puts it. No combination
  // of palm distances escapes that.
  for (const definition of ASPECT_DEFINITIONS) {
    const shifted = calibrationError(singleFrame(definition, { wristShift: 0.05 }), 1)
    assert.ok(
      shifted.signed.median > 4.5 && shifted.signed.median < 6.5,
      `${definition}: 5% wrist shift -> ${shifted.signed.median}% aspect error`,
    )
  }
})

test('tilt biases the aspect in opposite directions about the two palm axes', () => {
  // Yaw compresses the width, pitch compresses the length.
  const yaw = calibrationError(singleFrame('palmShapeFit', { yawDeg: 10 }), 1)
  const pitch = calibrationError(singleFrame('palmShapeFit', { pitchDeg: 10 }), 1)
  assert.ok(yaw.signed.median < -1, `yaw 10: ${yaw.signed.median}`)
  assert.ok(pitch.signed.median > 1.5, `pitch 10: ${pitch.signed.median}`)
  // And it grows fast: 20 degrees of pitch is far outside the 2% target.
  const steep = calibrationError(singleFrame('palmShapeFit', { pitchDeg: 20 }), 1)
  assert.ok(steep.signed.median > 6, `pitch 20: ${steep.signed.median}`)
})

test('finger flexion leaves every palm definition untouched, and wrecks a fit that reads the fingers', () => {
  for (const definition of ASPECT_DEFINITIONS) {
    const straight = calibrationError(singleFrame(definition, {}), 1)
    const flexed = calibrationError(singleFrame(definition, { flexDeg: 20 }), 1)
    assert.ok(Math.abs(flexed.signed.median - straight.signed.median) < 1e-9, definition)
  }
  const allLandmarks = calibrationError(
    geometry =>
      measureProfileStretch(GENERIC_PROFILE, [calibrationFrame(geometry, { flexDeg: 10 })], {
        landmarkIds: [...PALM_ASPECT_LANDMARKS, 'indexPIP', 'indexDIP', 'indexTIP', 'middlePIP', 'middleDIP', 'middleTIP',
          'ringPIP', 'ringDIP', 'ringTIP', 'pinkyPIP', 'pinkyDIP', 'pinkyTIP'],
      }).stretch,
    1,
  )
  assert.ok(allLandmarks.absolute.median > 5, `finger-reading fit under flexion: ${allLandmarks.absolute.median}`)
})

test('a missing MCP degrades palmShapeFit gracefully; a missing wrist is refused', () => {
  const drop = (observation: ScanObservation, names: readonly string[]): ScanObservation => ({
    ...observation,
    landmarks: observation.landmarks.map(landmark =>
      names.includes(landmark.name) ? { ...landmark, x: null, y: null, confidence: null } : landmark,
    ),
  })
  const withoutRing = calibrationError((geometry, d) =>
    measurePalmStretch(
      GENERIC_PROFILE,
      drop(calibrationFrame(geometry, { jitterPx: 2, seed: 100 + d * 7 }), ['ringMCP']),
      'palmShapeFit',
    ).stretch,
  )
  assert.ok(withoutRing.absolute.p95 < 3, `ringMCP missing: p95 ${withoutRing.absolute.p95}`)

  // Without the wrist the four MCPs lie nearly on a line and carry no length:
  // every definition refuses rather than return noise.
  const noWrist = drop(calibrationFrame(PERSONS[0][1]), ['wrist'])
  for (const definition of ASPECT_DEFINITIONS) {
    const measured = measurePalmStretch(GENERIC_PROFILE, noWrist, definition)
    assert.equal(measured.stretch, null, definition)
    assert.equal(measured.refusedReason, 'tooFewLandmarks', definition)
    assert.deepEqual(measured.rejectedLandmarkIds, ['wrist'])
  }
  assert.equal(measureProfileStretch(GENERIC_PROFILE, [noWrist]).stretch, null)
})

// ---------------------------------------------------------------------------
// 4. How many frames, and which ones?
// ---------------------------------------------------------------------------

test('B: averaging frames removes the wobble a single frame cannot', () => {
  const protocol = (count: number) =>
    calibrationError((geometry, d) => averagedStretch(geometry, heldFrames({}, count, 1000 + d * 17)))
  const one = protocol(1)
  const fifteen = protocol(15)
  assert.ok(one.absolute.p95 > 4, `one frame p95 ${one.absolute.p95}`)
  assert.ok(fifteen.absolute.p95 < one.absolute.p95 / 3, `${one.absolute.p95} -> ${fifteen.absolute.p95}`)
  assert.ok(fifteen.absolute.p95 < 1.2, `fifteen frames p95 ${fifteen.absolute.p95}`)
})

test('B: a systematic posture error survives averaging', () => {
  const pitched = calibrationError((geometry, d) =>
    averagedStretch(geometry, heldFrames({ pitchDeg: 8 }, 15, 1000 + d * 17)),
  )
  assert.ok(pitched.signed.median > 1.4, `pitch 8 after 15 frames: ${pitched.signed.median}`)
  const shifted = calibrationError((geometry, d) =>
    averagedStretch(geometry, heldFrames({ wristShift: 0.03 }, 15, 1000 + d * 17)),
  )
  assert.ok(shifted.signed.median > 3, `wrist +3% after 15 frames: ${shifted.signed.median}`)
})

test('C: adding an oblique view does not separate shape from tilt', () => {
  // A near-planar palm under weak perspective gives an affine image per view,
  // and the stretch of a plane is not recoverable from affine views with
  // unknown poses however many are taken. The 3D fit has only the generic
  // depth to break the tie, and that depth is wrong for each person.
  const oblique = calibrationError((geometry, d) => {
    const [front] = heldFrames({}, 1, 1000 + d * 17)
    const [other] = heldFrames({}, 1, 8777 + d * 17)
    return measureProfileStretch(GENERIC_PROFILE, [
      calibrationFrame(geometry, front),
      calibrationFrame(geometry, { ...other, yawDeg: (other.yawDeg ?? 0) + 20 }),
    ]).stretch
  })
  const fiveFaceOn = calibrationError((geometry, d) => averagedStretch(geometry, heldFrames({}, 5, 1000 + d * 17)))
  assert.ok(oblique.absolute.p95 > fiveFaceOn.absolute.p95 * 2, `C p95 ${oblique.absolute.p95} vs B5 ${fiveFaceOn.absolute.p95}`)
})

test('end to end: fifteen face-on frames land at the 2-degree line, well inside 4', () => {
  // Calibration error and daily-scan noise together. The exact profile on the
  // same palm landmarks sits at a p95 of ~1.3 degrees; fifteen averaged frames
  // add roughly half to a full degree on top, depending on the draw.
  const calibrated = pooled(geometry => {
    const stretch = averagedStretch(geometry, heldFrames({}, 15, 1000 + 17))
    const profile = stretchProfileLaterally(GENERIC_PROFILE, stretch)
    assert.ok(profile)
    return profile
  }, 'palmRigid')
  const exact = pooled(geometry => profileOf(geometry), 'palmRigid')
  assert.ok(calibrated.baselineAxis.p95 < 2.5, `baseline-axis p95 ${calibrated.baselineAxis.p95}`)
  assert.ok(calibrated.baselineAxis.p95 < exact.baselineAxis.p95 + 1.2, `${calibrated.baselineAxis.p95} vs exact ${exact.baselineAxis.p95}`)
  assert.ok(calibrated.total.worst < 3.5, `total worst ${calibrated.total.worst}`)
})

// ---------------------------------------------------------------------------
// 5. Nothing measured in centimetres
// ---------------------------------------------------------------------------

test('the measured stretch does not depend on camera distance or hand size', () => {
  const geometry = PERSONS[6][1]
  const reference = measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry), 'palmShapeFit').stretch
  assert.ok(reference !== null)
  const variations: CalibrationFrame[] = [
    { camera: { scale: 450, principalPoint: [756, 1008], imageWidth: 1512, imageHeight: 2016 } },
    { camera: { scale: 1800, principalPoint: [3024, 4032], imageWidth: 6048, imageHeight: 8064 } },
    { handScale: 0.8 },
    { handScale: 1.2 },
  ]
  for (const variation of variations) {
    const stretch = measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry, variation), 'palmShapeFit').stretch
    assert.ok(stretch !== null)
    assert.ok(Math.abs(stretch - reference) < 1e-6, `${JSON.stringify(variation)} -> ${stretch} vs ${reference}`)
  }
})

// ---------------------------------------------------------------------------
// 6. Can a bad calibration be caught?
// ---------------------------------------------------------------------------

test('⚠ the daily mismatch residual does not reveal an aspect error', () => {
  // It barely moves, and not even in a consistent direction: a 10% aspect
  // error leaves the median mismatch LOWER than a correct one.
  const mismatchAt = (eps: number) =>
    pooled(
      geometry => {
        const stretched = stretchProfileLaterally(GENERIC_PROFILE, trueStretch(geometry) * (1 + eps))
        assert.ok(stretched)
        return stretched
      },
      'palmRigid',
    ).mismatch.median
  const correct = mismatchAt(0)
  const wrong = mismatchAt(0.1)
  assert.ok(Math.abs(wrong / correct - 1) < 0.3, `mismatch ${correct} -> ${wrong}`)
})

test('the frame-to-frame spread flags an unsteady hold, but not a steady wrong posture', () => {
  const spreadOf = (posture: Parameters<typeof heldFrames>[0]) => {
    const values: number[] = []
    for (const [, geometry] of PERSONS) {
      for (let d = 0; d < DRAWS; d += 1) {
        const stretches = heldFrames(posture, 15, 1000 + d * 17).map(frame => {
          const stretch = measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry, frame), 'palmShapeFit').stretch
          assert.ok(stretch !== null)
          return stretch
        })
        const mean = stretches.reduce((sum, value) => sum + value, 0) / stretches.length
        values.push((Math.sqrt(stretches.reduce((sum, value) => sum + (value - mean) ** 2, 0) / stretches.length) / mean) * 100)
      }
    }
    return spread(values).median
  }
  const steady = spreadOf({})
  assert.ok(spreadOf({ wobble: 2 }) > steady * 1.7, 'doubling the wobble should show')
  assert.ok(spreadOf({ pitchDeg: 8 }) < steady * 1.3, 'a consistent tilt should not')
})

test('once the profile fixes the magnitude, an external pose would see an aspect error', () => {
  // Stage 5 found the landmark-only magnitude meaningless, so a magnitude
  // disagreement with an external pose compared against nothing. With a
  // profile the magnitude is real, and it moves with the aspect error —
  // which makes an external relative pose a valid check on calibration.
  const geometry = PERSONS[6][1]
  const magnitudeError = (eps: number) => {
    const profile = stretchProfileLaterally(GENERIC_PROFILE, trueStretch(geometry) * (1 + eps))
    assert.ok(profile)
    const result = dailyScan(geometry, profile, { set: 'palmRigid', jitterPx: 0 })
    assert.ok(result)
    return result.baselineAxisDeg
  }
  const errors = [0, 0.02, 0.05, 0.1].map(magnitudeError)
  for (let i = 1; i < errors.length; i += 1) assert.ok(errors[i] > errors[i - 1], `${errors}`)
  assert.ok(errors[3] > 5, `10% aspect error -> ${errors[3]} deg`)
})

// ---------------------------------------------------------------------------
// 7. H2 and its weakness
// ---------------------------------------------------------------------------

test('H2 is precise from a clean frame and fragile to finger flexion in it', () => {
  const fromFrame = (frame: CalibrationFrame) =>
    pooled(geometry => {
      const profile = personalizeInPlane(GENERIC_PROFILE, calibrationFrame(geometry, frame))
      assert.ok(profile)
      return profile
    }, 'all21')
  const clean = fromFrame({ jitterPx: 2, seed: 300 })
  const flexed = fromFrame({ jitterPx: 2, seed: 300, flexDeg: 5 })
  assert.ok(clean.total.p95 < 1.5, `clean H2 p95 ${clean.total.p95}`)
  assert.ok(flexed.total.p95 > 3, `5-degree flexion H2 p95 ${flexed.total.p95}`)
})

test('H1 on palm landmarks is immune to flexion in the calibration frame', () => {
  const stretchFrom = (frame: CalibrationFrame) => (geometry: SyntheticOptions) =>
    measurePalmStretch(GENERIC_PROFILE, calibrationFrame(geometry, frame), 'palmShapeFit').stretch
  for (const [, geometry] of PERSONS) {
    assert.equal(stretchFrom({ flexDeg: 10 })(geometry), stretchFrom({})(geometry))
  }
})

test('personalizeInPlane keeps the template depths and refuses a palm it cannot place', () => {
  const geometry = PERSONS[3][1]
  const profile = personalizeInPlane(GENERIC_PROFILE, calibrationFrame(geometry))
  assert.ok(profile)
  const frame = palmFrame(GENERIC_PROFILE)
  assert.ok(frame)
  profile.landmarks.forEach((point, index) => {
    const template = GENERIC_PROFILE.landmarks[index]
    assert.ok(
      Math.abs(dot(sub(point, frame.centre), frame.normal) - dot(sub(template, frame.centre), frame.normal)) < 1e-9,
      'depth must come from the template',
    )
  })
  const stripped: ScanObservation = {
    ...calibrationFrame(geometry),
    landmarks: calibrationFrame(geometry).landmarks.map(landmark =>
      ['wrist', 'indexMCP', 'middleMCP'].includes(landmark.name)
        ? { ...landmark, x: null, y: null, confidence: null }
        : landmark,
    ),
  }
  assert.equal(personalizeInPlane(GENERIC_PROFILE, stripped), null)
})

test('the nail bed takes no part in calibration', () => {
  const geometry = PERSONS[1][1]
  const observation = calibrationFrame(geometry, { jitterPx: 2, seed: 7 })
  const wrecked: ScanObservation = {
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
  }
  for (const definition of ASPECT_DEFINITIONS) {
    assert.equal(
      measurePalmStretch(GENERIC_PROFILE, wrecked, definition).stretch,
      measurePalmStretch(GENERIC_PROFILE, observation, definition).stretch,
      definition,
    )
  }
})
