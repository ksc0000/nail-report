// Stage 9 — canonical frames that do not amplify a single landmark.
//
// Stage 8 traced most of the socket-origin error to indexPIP: the standard
// frame (F0) takes its finger axis AND its scale from the one vector
// MCP -> PIP, with the nail ~1.7 phalanx lengths beyond. This file compares
// alternative frames built only from what a daily scan has — the lifted
// Layer B landmarks and the Personal HandProfile (src/lib/nail3dCanonicalFrames.ts)
// — and pins the answers to the seven Stage 9 questions.
//
// Each method is scored against ITS OWN definition applied to the true hand
// (tests/support/frameHarness.ts): the frames anchor in different places, so
// only a like-for-like reference is fair. No method ever reads that truth;
// the one diagnostic below that does (Q2) says so and is not a method.
//
// Result in one line: F3dNoTip — the profile's finger chain fitted to the
// palm, PIP and DIP, anchored at the fitted DIP, never reading TIP — halves
// F0's error, is unmoved by a biased wrist and by a nail that drags TIP with
// it, and pays for that with a DIP-flexion sensitivity the capture UX has to
// hold down. Reported as median / p95 / worst over the eight-hand population.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  FRAME_METHODS,
  applySimilarity,
  buildFrame,
  fitSimilarity,
} from '../src/lib/nail3dCanonicalFrames.ts'
import type { FrameMethod, Similarity } from '../src/lib/nail3dCanonicalFrames.ts'
import { personalizeInPlane, stretchProfileLaterally } from '../src/lib/nail3dHandCalibration.ts'
import type { HandProfile3D } from '../src/lib/nail3dProfilePose.ts'
import {
  FINGER_LANDMARKS,
  normalAngleDeg,
  originOffsetRatio,
  socketInFrame,
  tangentAngleDeg,
} from '../src/lib/nail3dSocket.ts'
import { computeStability, swapInvariance } from '../src/lib/nail3dStability.ts'
import type { Capture } from '../src/lib/nail3dStability.ts'
import { add, distance, dot, rotateAroundAxis } from '../src/lib/vec3.ts'
import type { Vec3 } from '../src/lib/vec3.ts'
import { h1ProfileFor } from './support/bedAnnotation.ts'
import { frameScan } from './support/frameHarness.ts'
import type { FrameScanOptions, MethodOutcome } from './support/frameHarness.ts'
import {
  GENERIC_PROFILE,
  PERSONS,
  calibrationFrame,
  profileOf,
  spread,
  trueStretch,
} from './support/handPopulation.ts'
import type { Spread } from './support/handPopulation.ts'
import type { SyntheticOptions } from './support/syntheticHand.ts'

const DRAWS = 4
const H1 = new Map(PERSONS.map(([name, geometry]) => [name, h1ProfileFor(geometry)]))
const REALISTIC = { pose: 'h1PalmRigid', landmarkNoisePx: 2, bedNoisePx: 2 } as const

type ScanOptions = Omit<FrameScanOptions, 'profile' | 'seedA' | 'seedB'>
type ProfileFor = (name: string, geometry: SyntheticOptions) => HandProfile3D

interface Pooled {
  origin: Spread
  normal: Spread
  tangent: Spread
  width: Spread
  length: Spread
  frameScale: Spread
  outcomes: MethodOutcome[]
}

const absSpread = (values: readonly number[]): Spread => spread(values.map(Math.abs))

/** One condition, every person, `draws` independent draws each. */
const pooled = (
  options: ScanOptions,
  methods: readonly FrameMethod[],
  { draws = DRAWS, profile = name => H1.get(name)! }: { draws?: number; profile?: ProfileFor } = {},
): Map<FrameMethod, Pooled> => {
  const collected = new Map<FrameMethod, MethodOutcome[]>(methods.map(method => [method, []]))
  PERSONS.forEach(([name, geometry], personIndex) => {
    for (let d = 0; d < draws; d += 1) {
      const result = frameScan(
        geometry,
        {
          ...options,
          profile: profile(name, geometry),
          seedA: 100 + personIndex * 31 + d * 7,
          seedB: 5000 + personIndex * 37 + d * 13,
        },
        methods,
      )
      assert.ok(result, `scan failed for ${name}`)
      for (const method of methods) {
        const outcome = result.get(method)
        assert.ok(outcome, `${method} failed for ${name}`)
        collected.get(method)!.push(outcome)
      }
    }
  })
  return new Map(
    [...collected].map(([method, outcomes]) => [
      method,
      {
        origin: absSpread(outcomes.map(o => o.originPct)),
        normal: absSpread(outcomes.map(o => o.normalDeg)),
        tangent: absSpread(outcomes.map(o => o.tangentDeg)),
        width: absSpread(outcomes.map(o => o.bedWidthPct)),
        length: absSpread(outcomes.map(o => o.bedLengthPct)),
        frameScale: absSpread(outcomes.map(o => o.frameError.scaleRatio * 100)),
        outcomes,
      },
    ]),
  )
}

/** The socket change between two scans of each person, as a spread. */
const between = (
  first: ScanOptions,
  second: ScanOptions,
  methods: readonly FrameMethod[],
): Map<FrameMethod, { origin: Spread; normal: Spread; tangent: Spread }> => {
  const origin = new Map<FrameMethod, number[]>(methods.map(m => [m, []]))
  const normal = new Map<FrameMethod, number[]>(methods.map(m => [m, []]))
  const tangent = new Map<FrameMethod, number[]>(methods.map(m => [m, []]))
  for (const [name, geometry] of PERSONS) {
    const a = frameScan(geometry, { ...first, profile: H1.get(name)! }, methods)
    const b = frameScan(geometry, { ...second, profile: H1.get(name)! }, methods)
    assert.ok(a && b)
    for (const method of methods) {
      const x = a.get(method)!.socket.socket
      const y = b.get(method)!.socket.socket
      origin.get(method)!.push(originOffsetRatio(y, x) * 100)
      normal.get(method)!.push(normalAngleDeg(y, x)!)
      tangent.get(method)!.push(tangentAngleDeg(y, x)!)
    }
  }
  return new Map(
    methods.map(m => [m, { origin: spread(origin.get(m)!), normal: spread(normal.get(m)!), tangent: spread(tangent.get(m)!) }]),
  )
}

const angleDeg = (a: Vec3, b: Vec3) => (Math.acos(Math.min(1, Math.max(-1, dot(a, b)))) * 180) / Math.PI

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

test('fitSimilarity recovers a known similarity, also from the nearly planar palm points', () => {
  const profile = profileOf(PERSONS[2][1])
  const truth: Similarity = {
    rotation: (() => {
      // Rotation by 0.7 rad about a skew axis, built column by column.
      const axis: Vec3 = [0.3, -0.5, 0.81]
      const columns = ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]).map(e => rotateAroundAxis(e, axis, 0.7))
      return [0, 1, 2].flatMap(row => columns.map(column => column[row]))
    })(),
    scale: 412.5,
    translation: [1500, -2000, 37],
    residual: 0,
  }
  for (const names of [
    [0, 1, 5, 9, 13, 17, 8, 12],
    [0, 1, 5, 9, 13, 17], // wrist + the five MCPs: the palm fit, nearly coplanar
  ]) {
    const from = names.map(i => profile.landmarks[i])
    const to = from.map(point => applySimilarity(truth, point))
    const fit = fitSimilarity(from, to)
    assert.ok(fit)
    assert.ok(Math.abs(fit.scale / truth.scale - 1) < 1e-12)
    for (let i = 0; i < 9; i += 1) assert.ok(Math.abs(fit.rotation[i] - truth.rotation[i]) < 1e-12)
    assert.ok(distance(fit.translation, truth.translation) < 1e-8)
    assert.ok(fit.residual < 1e-8)
  }
})

test('with the exact profile and clean observations every method recovers its definition, and the definitions collapse', () => {
  for (const [name, geometry] of PERSONS) {
    const result = frameScan(geometry, { pose: 'truth', profile: profileOf(geometry) }, FRAME_METHODS)
    assert.ok(result, name)
    for (const method of FRAME_METHODS) assert.ok(result.get(method)!.originPct < 1e-6, `${name} ${method}`)

    // F1, F1nw and F3 are attempts at F0's own frame; with the exact profile
    // they ARE F0. The three F3d variants likewise collapse onto F4 (DIP
    // origin, DIP -> TIP axis), since the exact chain needs no articulation.
    const same = (a: FrameMethod, b: FrameMethod) => {
      const x = result.get(a)!.truthFrame.frame
      const y = result.get(b)!.truthFrame.frame
      assert.ok(distance(x.origin, y.origin) / y.scaleReferenceLength < 1e-6, `${name} ${a} origin`)
      assert.ok(angleDeg(x.basis.y, y.basis.y) < 1e-4, `${name} ${a} axis`)
      assert.ok(Math.abs(x.scaleReferenceLength / y.scaleReferenceLength - 1) < 1e-6, `${name} ${a} scale`)
    }
    for (const method of ['F1', 'F1nw', 'F3'] as const) same(method, 'F0')
    for (const method of ['F3d', 'F3dDir', 'F3dNoTip'] as const) same(method, 'F4')
  }
})

test('the frames read only Layer B landmarks and the profile — never the truth', () => {
  const [name, geometry] = PERSONS[0]
  const result = frameScan(geometry, { ...REALISTIC, profile: H1.get(name)! }, ['F0'])
  assert.ok(result)
  const landmarks = result.get('F0')!.lifted.landmarks
  // The signature is the whole input: a profile-based method without a
  // profile refuses, F0 does not look at one, and the result is a pure
  // function of what it is given.
  for (const method of ['F1', 'F1nw', 'F2', 'F3', 'F3d', 'F3dDir', 'F3dNoTip', 'F4'] as const) {
    assert.equal(buildFrame(method, landmarks, 'index'), null, method)
  }
  const plain = buildFrame('F0', landmarks, 'index')
  const withProfile = buildFrame('F0', landmarks, 'index', GENERIC_PROFILE)
  assert.deepEqual(plain, withProfile)
  for (const method of FRAME_METHODS) {
    assert.deepEqual(buildFrame(method, landmarks, 'index', H1.get(name)), buildFrame(method, landmarks, 'index', H1.get(name)))
  }
  // F3dNoTip never reads TIP: wiping it out changes nothing.
  const tipIndex = FINGER_LANDMARKS.index[3]
  const noTip = landmarks.map((point, i) => (i === tipIndex ? ([Number.NaN, Number.NaN, Number.NaN] as Vec3) : point))
  assert.deepEqual(buildFrame('F3dNoTip', noTip, 'index', H1.get(name)), buildFrame('F3dNoTip', landmarks, 'index', H1.get(name)))
  assert.equal(buildFrame('F3d', noTip, 'index', H1.get(name)), null)
})

// ---------------------------------------------------------------------------
// Q1 / Q2 — the PIP amplification, and what carries it
// ---------------------------------------------------------------------------

test('Q1: indexPIP 2px — F0 amplifies it; frames that do not hang on MCP -> PIP do not', () => {
  const methods = ['F0', 'F1', 'F2', 'F3', 'F3d', 'F3dNoTip', 'F4'] as const
  const pip = pooled({ pose: 'truth', landmarkNoisePx: 2, noisyLandmarks: ['indexPIP'] }, methods)
  const o = (m: FrameMethod) => pip.get(m)!.origin
  // Measured, 8 people x 8 draws (origin %, median / p95):
  //   F0 8.41 / 16.52   F1 0.05 / 0.10   F2 0.67 / 1.43   F3 3.34 / 7.89
  //   F3d 0.97 / 1.94   F3dNoTip 2.01 / 4.12   F4 0.01 / 0.03
  // Stage 8 reported 12.3% p95 for F0: its draws shared 8 noise realizations
  // across all people. Drawn independently per person, the p95 is ~16.5%.
  assert.ok(o('F0').p95 > 12, `F0 p95 ${o('F0').p95}`)
  assert.ok(o('F3dNoTip').p95 < 0.35 * o('F0').p95, `F3dNoTip ${o('F3dNoTip').p95}`)
  assert.ok(o('F3d').p95 < 0.2 * o('F0').p95)
  assert.ok(o('F2').p95 < 0.15 * o('F0').p95, 'F2: axis averaged over four joints, scale from the palm')
  assert.ok(o('F1').p95 < 0.5, 'F1 reads no finger landmark at all')
  assert.ok(o('F4').p95 < 0.1, 'F4 reads only DIP and TIP')
  // F3 still anchors its axis on the fitted PIP: half-way.
  assert.ok(o('F3').p95 > o('F3dNoTip').p95 && o('F3').p95 < 0.6 * o('F0').p95)
})

test('Q2: in F0 the axis and the scale each carry about half of the PIP amplification', () => {
  // DIAGNOSTIC, not a method: it reads the truth frame to hold one half fixed.
  const full: number[] = []
  const axisOnly: number[] = []
  const scaleOnly: number[] = []
  PERSONS.forEach(([name, geometry], personIndex) => {
    for (let d = 0; d < 8; d += 1) {
      const result = frameScan(
        geometry,
        {
          pose: 'truth',
          profile: H1.get(name)!,
          landmarkNoisePx: 2,
          noisyLandmarks: ['indexPIP'],
          seedA: 100 + personIndex * 31 + d * 7,
          seedB: 5000 + personIndex * 37 + d * 13,
        },
        ['F0'],
      )
      const outcome = result?.get('F0')
      assert.ok(outcome)
      const estimate = outcome.frame.frame
      const truth = outcome.truthFrame.frame
      const axisFrame = { ...estimate, scaleReferenceLength: truth.scaleReferenceLength }
      const scaleFrame = { origin: add(truth.origin, outcome.commonShift), basis: truth.basis, scaleReferenceLength: estimate.scaleReferenceLength }
      const read = (frame: typeof estimate) =>
        originOffsetRatio(socketInFrame(frame, outcome.lifted.landmarks, outcome.lifted.bed, 'index')!.socket, outcome.truth.socket) * 100
      full.push(outcome.originPct)
      axisOnly.push(read(axisFrame))
      scaleOnly.push(read(scaleFrame))
    }
  })
  const meanSquare = (values: number[]) => values.reduce((sum, v) => sum + v * v, 0) / values.length
  const axisShare = meanSquare(axisOnly) / meanSquare(full)
  const scaleShare = meanSquare(scaleOnly) / meanSquare(full)
  // Measured: axis 51%, scale 52% of the mean-square error (they are nearly
  // independent, so the shares add to ~1). Neither alone explains it.
  assert.ok(axisShare > 0.35 && axisShare < 0.65, `axis share ${axisShare}`)
  assert.ok(scaleShare > 0.35 && scaleShare < 0.65, `scale share ${scaleShare}`)
  assert.ok(Math.abs(axisShare + scaleShare - 1) < 0.15)
})

// ---------------------------------------------------------------------------
// Q3 and the realistic daily scan
// ---------------------------------------------------------------------------

test('Q3: building the frame from the profile lowers the H1 floor and the landmark floor together', () => {
  const methods = ['F0', 'F3d', 'F3dNoTip'] as const
  const floor = pooled({ pose: 'h1PalmRigid' }, methods, { draws: 1 })
  const landmark = pooled({ pose: 'truth', landmarkNoisePx: 2 }, methods)
  // Noise-free H1 floor, p95: F0 4.60 -> F3d 2.56, F3dNoTip 2.98.
  // Landmark floor (true pose, all 21 at 2px), p95: F0 16.57 -> 6.54, 8.84.
  assert.ok(Math.abs(floor.get('F0')!.origin.p95 - 4.6) < 0.1, 'the Stage 7 floor, reproduced')
  assert.ok(floor.get('F3dNoTip')!.origin.p95 < 0.75 * floor.get('F0')!.origin.p95)
  assert.ok(floor.get('F3d')!.origin.p95 < 0.65 * floor.get('F0')!.origin.p95)
  assert.ok(landmark.get('F3dNoTip')!.origin.p95 < 0.65 * landmark.get('F0')!.origin.p95)
  assert.ok(landmark.get('F3d')!.origin.p95 < 0.5 * landmark.get('F0')!.origin.p95)
})

test('realistic daily scan: F3dNoTip roughly halves the origin error and leaves the shape alone', () => {
  const methods = ['F0', 'F3d', 'F3dNoTip', 'F4'] as const
  const real = pooled(REALISTIC, methods)
  const f0 = real.get('F0')!
  const best = real.get('F3dNoTip')!
  // 8 x 8, origin %: F0 9.86 / 18.84 / 23.67, F3dNoTip 5.63 / 10.48 / 13.03,
  // F3d 4.47 / 8.65 / 11.51, F4 5.78 / 11.98 / 17.02.
  assert.ok(best.origin.median < 0.65 * f0.origin.median, `median ${best.origin.median} vs ${f0.origin.median}`)
  assert.ok(best.origin.p95 < 0.65 * f0.origin.p95, `p95 ${best.origin.p95} vs ${f0.origin.p95}`)
  assert.ok(best.origin.worst < 0.7 * f0.origin.worst)
  // The shape belongs to the bed points, which every frame reads alike.
  assert.ok(best.normal.p95 < 1.25 * f0.normal.p95)
  assert.ok(best.tangent.p95 < 1.25 * f0.tangent.p95)
  assert.ok(Math.abs(best.width.p95 - f0.width.p95) < 1.5)
  assert.ok(Math.abs(best.length.p95 - f0.length.p95) < 1.5)
  // Scale from six palm points instead of one phalanx: a third of the error.
  assert.ok(best.frameScale.p95 < 0.5 * f0.frameScale.p95)
})

test('the gain holds at 25, 40 and 60 degrees of view separation', () => {
  // p95: 25deg F0 29.53 / F3dNoTip 16.20; 40deg 18.84 / 10.48; 60deg 12.62 / 7.44.
  for (const separationDeg of [25, 40, 60]) {
    const real = pooled({ ...REALISTIC, separationDeg }, ['F0', 'F3dNoTip'], { draws: 3 })
    const ratio = real.get('F3dNoTip')!.origin.p95 / real.get('F0')!.origin.p95
    assert.ok(ratio < 0.7, `${separationDeg}deg: ratio ${ratio}`)
  }
})

// ---------------------------------------------------------------------------
// Q4 — the wrist
// ---------------------------------------------------------------------------

test('Q4: a biased wrist breaks frames hung on the palm fit, not F3dNoTip', () => {
  const methods = ['F0', 'F1', 'F1nw', 'F3', 'F3dNoTip'] as const
  // Definitional, true pose and no noise: what each frame does with a wrist
  // the detector places 3% of palm length off, identically in both views.
  const shifted = pooled({ pose: 'truth', wristShift: 0.03 }, methods, { draws: 1 })
  const o = (m: FrameMethod) => shifted.get(m)!.origin
  // F1 11.41, F3 11.19: the whole finger hangs on a palm fit the wrist tilts.
  assert.ok(o('F1').median > 8 && o('F3').median > 8)
  // F1nw leaves the wrist out, F0 uses it only for the palm normal (the shift
  // stays in the palm plane), F3dNoTip pins its origin on the fitted DIP.
  assert.ok(o('F1nw').worst < 0.05 && o('F0').worst < 0.05)
  assert.ok(o('F3dNoTip').worst < 1.5, `F3dNoTip ${o('F3dNoTip').worst}`)

  // Through the realistic pose, which reads the wrist too (8 x 8, p95):
  //   wrist +3%: F1 45.37, F3 43.83, F0 18.64, F3dNoTip 11.04 (9.09 unbiased).
  const real = pooled({ pose: 'h1PalmRigid', landmarkNoisePx: 2, wristShift: 0.03 }, ['F0', 'F1', 'F3dNoTip'], { draws: 3 })
  assert.ok(real.get('F1')!.origin.p95 > 25)
  assert.ok(real.get('F3dNoTip')!.origin.p95 < 0.75 * real.get('F0')!.origin.p95)
})

// ---------------------------------------------------------------------------
// Q5 — articulation
// ---------------------------------------------------------------------------

test('Q5: when the finger flexes, F0 and F1 move with it; the distal frames barely do', () => {
  const methods = ['F0', 'F1', 'F3', 'F3d', 'F3dNoTip', 'F4'] as const
  // Noise-free, true pose: the socket's change between a neutral scan and one
  // with every finger joint flexed 2 degrees more. The bed has not moved on
  // the distal phalanx, so an articulation-invariant frame would read zero.
  const flexed = between({ pose: 'truth' }, { pose: 'truth', articulationDeg: 2 }, methods)
  const origin = (m: FrameMethod) => flexed.get(m)!.origin.median
  const normal = (m: FrameMethod) => flexed.get(m)!.normal.median
  // Per degree: F0 5.5%, F1 17.5%, F3 5.4%, F3dNoTip 1.2%, F3d 0.42%, F4 0.54%.
  assert.ok(origin('F0') > 9 && origin('F1') > 30 && origin('F3') > 9, `F0 ${origin('F0')} F1 ${origin('F1')}`)
  assert.ok(origin('F3dNoTip') < 0.3 * origin('F0'), `F3dNoTip ${origin('F3dNoTip')}`)
  assert.ok(origin('F3d') < 1.2 && origin('F4') < 1.5)
  // The price of never reading TIP: the DIP angle is held at the calibrated
  // posture, so the normal follows DIP flexion one-for-one-ish (2.18 deg at 2
  // deg), where the TIP-reading frames stay put. F0 turns twice as far.
  assert.ok(normal('F3dNoTip') > 1.5 && normal('F3dNoTip') < 2.6, `F3dNoTip normal ${normal('F3dNoTip')}`)
  assert.ok(normal('F3d') < 0.5 && normal('F4') < 0.1)
  assert.ok(normal('F0') > 3.5)

  // Estimation itself does not degrade with flexion (scan error vs own truth).
  const neutral = pooled(REALISTIC, ['F3dNoTip'], { draws: 2 }).get('F3dNoTip')!.origin
  const bent = pooled({ ...REALISTIC, articulationDeg: 5 }, ['F3dNoTip'], { draws: 2 }).get('F3dNoTip')!.origin
  assert.ok(bent.p95 < 1.25 * neutral.p95, `${bent.p95} vs ${neutral.p95}`)
})

// ---------------------------------------------------------------------------
// Q6 — how much HandProfile
// ---------------------------------------------------------------------------

test('Q6: H1 suffices for F3dNoTip at realistic landmark noise; H2 pays only below ~1px', () => {
  const h2 = new Map(PERSONS.map(([name, geometry]) => [name, personalizeInPlane(GENERIC_PROFILE, calibrationFrame(geometry))!]))
  const h1Off = new Map(
    PERSONS.map(([name, geometry]) => [name, stretchProfileLaterally(GENERIC_PROFILE, trueStretch(geometry) * 1.02)!]),
  )
  const run = (options: ScanOptions, profiles: Map<string, HandProfile3D>, draws = 3) =>
    pooled(options, ['F3dNoTip'], { draws, profile: name => profiles.get(name)! }).get('F3dNoTip')!.origin

  // Realistic (8 x 8, p95): H1 10.48, aspect +2% 11.49 / -2% 10.46, H2 10.56, H3 10.43.
  const realH1 = run(REALISTIC, H1)
  assert.ok(Math.abs(run(REALISTIC, h2).p95 / realH1.p95 - 1) < 0.12, 'H2 buys nothing at 2px')
  assert.ok(Math.abs(run(REALISTIC, h1Off).p95 / realH1.p95 - 1) < 0.15, 'a 2% calibration error is absorbed')
  // Noise-free floor: H1 2.98 -> H2 0.99. At 0.5px landmarks the floor shows
  // (H1 3.24 vs H2 2.24); from 1px up the landmarks drown it.
  assert.ok(run({ pose: 'h1PalmRigid' }, h2, 1).p95 < 0.5 * run({ pose: 'h1PalmRigid' }, H1, 1).p95)
  const fine = { pose: 'h1PalmRigid', landmarkNoisePx: 0.5 } as const
  assert.ok(run(fine, h2).p95 < 0.85 * run(fine, H1).p95)

  // F1 is different: its scale is the palm fit times the PROFILE's phalanx, so
  // an H1 profile (generic finger lengths) biases it — by 7.9% median here.
  // H2 calibrates the fingers and brings that to ~0.5%.
  const scaleBias = (profiles: Map<string, HandProfile3D>) =>
    spread(
      PERSONS.map(([name, geometry]) => {
        const result = frameScan(geometry, { pose: 'truth', profile: profiles.get(name)! }, ['F0', 'F1'])!
        const f1 = result.get('F1')!.truthFrame.frame
        const anatomical = result.get('F0')!.truthFrame.frame
        return Math.abs(f1.scaleReferenceLength / anatomical.scaleReferenceLength - 1) * 100
      }),
    )
  assert.ok(scaleBias(H1).median > 4, `F1 H1 scale bias ${scaleBias(H1).median}`)
  assert.ok(scaleBias(h2).median < 1.5, `F1 H2 scale bias ${scaleBias(h2).median}`)
})

// ---------------------------------------------------------------------------
// Q7 — same HandProfile, different NailSet
// ---------------------------------------------------------------------------

const swaps = (
  stress: FrameScanOptions['tipFollowsNail'],
  methods: readonly FrameMethod[],
  options: ScanOptions,
  draws = 2,
) => {
  const origin = new Map<FrameMethod, number[]>(methods.map(m => [m, []]))
  const normal = new Map<FrameMethod, number[]>(methods.map(m => [m, []]))
  const length = new Map<FrameMethod, number[]>(methods.map(m => [m, []]))
  PERSONS.forEach(([name, geometry], personIndex) => {
    for (let d = 0; d < draws; d += 1) {
      const scan = (freeEdgeFraction: number, offset: number) =>
        frameScan(
          geometry,
          {
            ...options,
            profile: H1.get(name)!,
            freeEdgeFraction,
            tipFollowsNail: stress,
            seedA: 401 + personIndex + offset + d * 59,
            seedB: 8001 + personIndex + offset + d * 61,
          },
          methods,
        )
      const before = scan(0, 0)
      const after = scan(0.5, 1)
      assert.ok(before && after)
      for (const method of methods) {
        const swap = swapInvariance(before.get(method)!.socket, after.get(method)!.socket)
        assert.ok(swap)
        origin.get(method)!.push(swap.originRatio * 100)
        normal.get(method)!.push(swap.normalDeg)
        length.get(method)!.push(swap.bedLengthRatio * 100)
      }
    }
  })
  return new Map(
    methods.map(m => [m, { origin: spread(origin.get(m)!), normal: spread(normal.get(m)!), length: spread(length.get(m)!) }]),
  )
}

test('Q7: same HandProfile, different NailSet — placement invariance holds, and improves', () => {
  // A short nail, then a long one; the bed is the same, so the socket must be.
  // Realistic noise, 8 people x 8 draws (M6 origin %, median / p95 / worst):
  //   F0 11.92 / 26.91 / 38.78   F3dNoTip 8.27 / 15.05 / 20.51
  // bedWidth and bedLength are the bed's own business (2.2-4.0% median).
  const m6 = swaps(undefined, ['F0', 'F3dNoTip'], REALISTIC, 8)
  const m6Of = (m: FrameMethod) => m6.get(m)!
  const m6Message = JSON.stringify({ F0: m6Of('F0'), F3dNoTip: m6Of('F3dNoTip') })
  assert.ok(m6Of('F3dNoTip').origin.median < 0.8 * m6Of('F0').origin.median, m6Message)
  assert.ok(m6Of('F3dNoTip').origin.p95 < 0.75 * m6Of('F0').origin.p95, m6Message)
  assert.ok(m6Of('F3dNoTip').length.median < m6Of('F0').length.median + 0.5, m6Message)

  // Noise-free, the swap is exact in every frame: no frame reads the nail.
  const clean = swaps(undefined, FRAME_METHODS, { pose: 'truth' }, 1)
  for (const method of FRAME_METHODS) assert.ok(clean.get(method)!.origin.worst < 1e-6, method)
})

test('a TIP that follows the nail moves every frame that reads TIP, and only those', () => {
  // Stress, not a claim about any detector (tests/support/syntheticHand.ts):
  // the long nail drags the TIP landmark out along the finger ('axial'), or
  // out and up onto the nail ('dorsalTip'). Noise-free, true pose, so what
  // remains is the frame definition itself. Measured (origin % / normal deg):
  //   axial:      F3d 21.1 / 0.1, F2 3.1 / 0.4; F0, F3dDir, F3dNoTip, F4 0
  //   dorsalTip:  F3d 17.2 / 11.7, F3dDir 13.0 / 12.2, F4 13.6 / 13.2,
  //               F2 26.1 / 3.2; F0, F3dNoTip 0 / 0
  const methods = ['F0', 'F2', 'F3d', 'F3dDir', 'F3dNoTip', 'F4'] as const
  const axial = swaps('axial', methods, { pose: 'truth' }, 1)
  const dorsal = swaps('dorsalTip', methods, { pose: 'truth' }, 1)
  assert.ok(axial.get('F3d')!.origin.median > 15, 'TIP as a point: the chain stretches after it')
  for (const method of ['F0', 'F3dDir', 'F3dNoTip', 'F4'] as const) assert.ok(axial.get(method)!.origin.worst < 1e-6, method)
  assert.ok(axial.get('F2')!.origin.median > 1, 'F2 fits a line through TIP too')
  for (const method of ['F3d', 'F3dDir', 'F4'] as const) {
    assert.ok(dorsal.get(method)!.origin.median > 10 && dorsal.get(method)!.normal.median > 8, method)
  }
  for (const method of ['F0', 'F3dNoTip'] as const) {
    assert.ok(dorsal.get(method)!.origin.worst < 1e-6 && dorsal.get(method)!.normal.worst < 1e-6, method)
  }
})

// ---------------------------------------------------------------------------
// M0-M5 and the error that is left
// ---------------------------------------------------------------------------

test('M1-M5: only the origin repeatability changes; M5 flags a frame that moves with flexion', () => {
  const methods = ['F0', 'F1', 'F3dNoTip'] as const
  const report = (flexDeg: number) => {
    const out = new Map<FrameMethod, ReturnType<typeof computeStability>[]>(methods.map(m => [m, []]))
    PERSONS.forEach(([name, geometry], personIndex) => {
      const captures = new Map<FrameMethod, Capture[]>(methods.map(m => [m, []]))
      for (let k = 0; k < 6; k += 1) {
        const session = k < 3 ? 's0' : 's1'
        const result = frameScan(
          geometry,
          {
            ...REALISTIC,
            profile: H1.get(name)!,
            articulationDeg: session === 's1' ? flexDeg : 0,
            seedA: 300 + personIndex * 31 + k * 7,
            seedB: 7000 + personIndex * 37 + k * 13,
          },
          methods,
        )
        assert.ok(result)
        for (const method of methods) captures.get(method)!.push({ sessionId: session, observation: result.get(method)!.socket })
      }
      for (const method of methods) out.get(method)!.push(computeStability(captures.get(method)!))
    })
    return (method: FrameMethod, pick: (r: NonNullable<ReturnType<typeof computeStability>>) => number) =>
      spread(out.get(method)!.map(r => pick(r!)))
  }
  const steady = report(0)
  // M1 origin rms (8 x 6 captures): F0 9.75, F3dNoTip 5.33 (median of people).
  assert.ok(steady('F3dNoTip', r => r.m1Origin.rms).median < 0.7 * steady('F0', r => r.m1Origin.rms).median)
  // M2-M4 are the bed's: within a quarter of each other.
  for (const pick of [
    (r: NonNullable<ReturnType<typeof computeStability>>) => r.m2Normal.rms,
    (r: NonNullable<ReturnType<typeof computeStability>>) => r.m3Tangent.rms,
    (r: NonNullable<ReturnType<typeof computeStability>>) => r.m4Dimensions.bedLengthCv,
  ]) {
    const ratio = steady('F3dNoTip', pick).median / steady('F0', pick).median
    assert.ok(ratio > 0.75 && ratio < 1.33, `ratio ${ratio}`)
  }

  // Second session with 5 degrees more flexion. M5's between/within ratio:
  // F0 1.79, F1 7.54, F3dNoTip 0.90 (no session effect at all: 0.30-0.62).
  const flexed = report(5)
  assert.ok(flexed('F0', r => r.m5Decomposition.ratio).median > 1.2)
  assert.ok(flexed('F1', r => r.m5Decomposition.ratio).median > 3)
  assert.ok(flexed('F3dNoTip', r => r.m5Decomposition.ratio).median < 1.2)
  assert.ok(
    flexed('F3dNoTip', r => r.m5Decomposition.interSession).median <
      0.4 * flexed('F0', r => r.m5Decomposition.interSession).median,
  )
})

test('what dominates now: indexDIP and the cuticle, no longer indexPIP', () => {
  const methods = ['F0', 'F3dNoTip'] as const
  const only = (noisyLandmarks: string[]) => pooled({ pose: 'h1PalmRigid', landmarkNoisePx: 2, noisyLandmarks }, methods, { draws: 3 })
  const dip = only(['indexDIP'])
  const pip = only(['indexPIP'])
  const bed = pooled({ pose: 'h1PalmRigid', bedNoisePx: 2 }, methods, { draws: 3 })
  // Under H1 + palmRigid, origin % p95 (8 x 8):
  //   indexDIP 2px  F0 4.61  F3dNoTip 8.00   <- the new anchor
  //   indexPIP 2px  F0 16.22 F3dNoTip 4.70
  //   bed 2px       F0 6.58  F3dNoTip 6.62   <- about the same: it is the bed
  //   floor         F0 4.60  F3dNoTip 2.98
  const p95 = (pool: Map<FrameMethod, Pooled>, m: FrameMethod) => pool.get(m)!.origin.p95
  assert.ok(p95(dip, 'F3dNoTip') > p95(pip, 'F3dNoTip'))
  assert.ok(p95(bed, 'F3dNoTip') > p95(pip, 'F3dNoTip'))
  assert.ok(p95(pip, 'F0') > 3 * p95(pip, 'F3dNoTip'))
  // The bed's share is read the same way in every frame; it differs only
  // through the lift, where bed points share the solve with the landmarks.
  const bedRatio = p95(bed, 'F3dNoTip') / p95(bed, 'F0')
  assert.ok(bedRatio > 0.75 && bedRatio < 1.25, `bed ratio ${bedRatio}`)
  // DIP is an anchor, not a lever: its error moves the origin about 1:1
  // instead of turning the frame, which is why it costs half what PIP did in F0.
  assert.ok(p95(dip, 'F3dNoTip') < 0.6 * p95(pip, 'F0'))
})
