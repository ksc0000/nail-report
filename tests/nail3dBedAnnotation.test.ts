// Stage 8 — where does the remaining socket error come from, and which
// observation would have to get better to remove it?
//
// The question was posed about the nail-bed semantic landmarks, and they are
// measured here point by point and error type by error type. The first result
// reframes it, though: in the Stage 7 configuration the socket ORIGIN error is
// dominated not by the bed but by the hand landmarks that define the canonical
// frame — indexPIP above all — while the bed governs the socket's shape
// (normal, tangent, width, length). Both halves are pinned below.
//
// Every perturbation acts on Layer A pixel coordinates only (support module
// tests/support/bedAnnotation.ts); nothing estimated is written into Layer A,
// and no normalized value goes anywhere near a metre.
//
// Reported as median / p95 / worst over the eight-hand population, never as a
// mean.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { liftTwoView } from '../src/lib/nail3dMultiView.ts'
import { computeStability, swapInvariance } from '../src/lib/nail3dStability.ts'
import type { Capture } from '../src/lib/nail3dStability.ts'
import { LANDMARK_NAMES } from '../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import { syntheticHand } from './support/syntheticHand.ts'
import type { SyntheticOptions } from './support/syntheticHand.ts'
import { PERSONS, spread } from './support/handPopulation.ts'
import type { Spread } from './support/handPopulation.ts'
import { DEFAULT_CAMERA, projectToObservation } from './support/syntheticProjection.ts'
import {
  OPTIONAL_BED_POINTS,
  REQUIRED_BED_POINTS,
  applyBedErrors,
  bedScan,
  h1ProfileFor,
} from './support/bedAnnotation.ts'
import type { BedError, BedScanOptions, BedScanResult, BoundaryConfusion } from './support/bedAnnotation.ts'

const DRAWS = 4
const ALL4 = [...REQUIRED_BED_POINTS]
const ALL7 = [...REQUIRED_BED_POINTS, ...OPTIONAL_BED_POINTS]
const CUTICLE = ['cuticleSideA', 'cuticleSideB'] as const
const FREE_EDGE = ['freeEdgeSideA', 'freeEdgeSideB'] as const
const PROFILES = new Map(PERSONS.map(([name, geometry]) => [name, h1ProfileFor(geometry)]))

interface Pooled {
  origin: Spread
  normal: Spread
  tangent: Spread
  width: Spread
  length: Spread
  bedResidual: Spread
  results: BedScanResult[]
}

const absSpread = (values: readonly number[]): Spread => spread(values.map(Math.abs))

/** One condition over every person and `draws` independent draws. */
const pooled = (options: (draw: number) => Omit<BedScanOptions, 'profile'>, draws = DRAWS): Pooled => {
  const results: BedScanResult[] = []
  PERSONS.forEach(([name, geometry], personIndex) => {
    for (let d = 0; d < draws; d += 1) {
      const result = bedScan(geometry, {
        ...options(personIndex * 100 + d + 1),
        profile: PROFILES.get(name),
        seedA: 100 + personIndex * 31 + d * 7,
        seedB: 5000 + personIndex * 37 + d * 13,
      })
      assert.ok(result, 'scan failed')
      results.push(result)
    }
  })
  return {
    origin: absSpread(results.map(r => r.originPct)),
    normal: absSpread(results.map(r => r.normalDeg)),
    tangent: absSpread(results.map(r => r.tangentDeg)),
    width: absSpread(results.map(r => r.bedWidthPct)),
    length: absSpread(results.map(r => r.bedLengthPct)),
    bedResidual: absSpread(results.map(r => r.bedResidualPx)),
    results,
  }
}

const control = (bedErrors: BedError[] = [], extra: Partial<BedScanOptions> = {}): Omit<BedScanOptions, 'profile'> => ({
  pose: 'truth',
  bedErrors,
  ...extra,
})

/** Repeatability M1-M4 and M6 over six captures per person. */
const repeatability = (options: (seed: number) => Omit<BedScanOptions, 'profile'>) => {
  const m1: number[] = []
  const m2: number[] = []
  const m4: number[] = []
  const m6: number[] = []
  for (const [name, geometry] of PERSONS) {
    const captures: Capture[] = []
    for (let k = 0; k < 6; k += 1) {
      const result = bedScan(geometry, {
        ...options(k + 1),
        profile: PROFILES.get(name),
        seedA: 300 + k * 7,
        seedB: 7000 + k * 13,
      })
      assert.ok(result)
      captures.push({ sessionId: `s${k % 2}`, observation: result.socket })
    }
    const report = computeStability(captures)
    assert.ok(report)
    m1.push(report.m1Origin.rms * 100)
    m2.push(report.m2Normal.rms)
    m4.push(report.m4Dimensions.bedLengthCv * 100)
    const before = bedScan(geometry, { ...options(91), profile: PROFILES.get(name), seedA: 401, seedB: 8001 })
    const after = bedScan(geometry, {
      ...options(92),
      profile: PROFILES.get(name),
      seedA: 402,
      seedB: 8002,
      freeEdgeFraction: 0.5,
    })
    assert.ok(before && after)
    const swap = swapInvariance(before.socket, after.socket)
    assert.ok(swap)
    m6.push(swap.originRatio * 100)
  }
  return { m1: spread(m1), m2: spread(m2), m4: spread(m4), m6: spread(m6) }
}

// ---------------------------------------------------------------------------
// The instrument
// ---------------------------------------------------------------------------

test('with no injected error the control recovers the socket exactly', () => {
  const clean = pooled(() => control(), 1)
  assert.ok(clean.origin.worst < 1e-9)
  assert.ok(clean.normal.worst < 1e-4)
  assert.ok(clean.length.worst < 1e-9)
  assert.ok(clean.bedResidual.worst < 1e-9)
})

test('perturbations stay in Layer A: pixel coordinates move, nothing derived is added', () => {
  const hand = syntheticHand({ palmArch: 0.15 })
  const a = projectToObservation(hand, { camera: DEFAULT_CAMERA })
  const b = projectToObservation(hand, { camera: DEFAULT_CAMERA })
  const [pa, pb] = applyBedErrors(a, b, [{ kind: 'common', points: ALL4, axis: 'along', px: 3 }], {
    kind: 'distalAtTip',
    fractionOfBedLength: 0.2,
  })
  for (const view of [pa, pb]) {
    const parsed = parseScanObservation(JSON.parse(JSON.stringify(view)))
    assert.ok(parsed.ok, 'a perturbed observation must still be a valid Layer A observation')
    assert.deepEqual(Object.keys(view).sort(), Object.keys(a).sort())
  }
  // The hand landmarks are untouched by a bed error.
  assert.deepEqual(pa.landmarks, a.landmarks)
})

test('the lift ignores optional bed points unless asked, so nothing changes by default', () => {
  const hand = syntheticHand({ palmArch: 0.15, pose: { rotationAxis: [1, 0, 0], rotationDeg: 35 } })
  const withOptional = (view: [number, number, number, number, number, number, number, number, number]) =>
    projectToObservation(hand, { camera: DEFAULT_CAMERA, view, optionalBedPoints: true })
  const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1] as [number, number, number, number, number, number, number, number, number]
  const tilted = [0.9, 0, 0.436, 0, 1, 0, -0.436, 0, 0.9] as [number, number, number, number, number, number, number, number, number]
  const a = withOptional(identity)
  const b = withOptional(tilted)
  const setup = { reference: { rotation: identity }, second: { rotation: tilted } }
  const plain = liftTwoView(a, b, setup, ['index'])
  assert.equal(plain.canonical?.beds[0].optional, undefined)
  const opted = liftTwoView(a, b, setup, ['index'], { optionalBedPoints: true })
  assert.ok(opted.canonical?.beds[0].optional?.cuticleApex)
  assert.ok(opted.canonical?.beds[0].optional?.bedWallSideA)
  assert.ok(typeof plain.residuals.bedReprojectionRmsPx.index === 'number')
})

// ---------------------------------------------------------------------------
// The decomposition: what the current error is made of
// ---------------------------------------------------------------------------

test('hand-landmark noise, not bed annotation, dominates the socket origin', () => {
  // At the same 2 px, the hand landmarks cost the origin ~3x what the bed does,
  // because the origin is expressed in a frame those landmarks define.
  const bedOnly = pooled(d => control([{ kind: 'random', points: ALL4, axis: 'both', px: 2, seed: d }]))
  const landmarksOnly = pooled(() => control([], { landmarkNoisePx: 2 }))
  assert.ok(landmarksOnly.origin.median > 2 * bedOnly.origin.median, `${landmarksOnly.origin.median} vs ${bedOnly.origin.median}`)
  // ...while for the socket's SHAPE it is the other way round.
  assert.ok(bedOnly.length.p95 > 3 * landmarksOnly.length.p95, `length ${bedOnly.length.p95} vs ${landmarksOnly.length.p95}`)
  // The normal leans the same way, less steeply (~1.6x).
  assert.ok(bedOnly.normal.median > 1.3 * landmarksOnly.normal.median, `normal ${bedOnly.normal.median} vs ${landmarksOnly.normal.median}`)
})

test('of all 21 hand landmarks, indexPIP alone carries the origin error', () => {
  // The frame takes its finger axis AND its scale from MCP -> PIP, and the bed
  // sits ~1.7 phalanx lengths further out: a PIP error both rotates and
  // rescales the coordinates the origin is written in.
  const pipOnly = pooled(() => control([], { landmarkNoisePx: 2, noisyLandmarks: ['indexPIP'] }))
  const allLandmarks = pooled(() => control([], { landmarkNoisePx: 2 }))
  const frameInputs = ['wrist', 'indexMCP', 'indexPIP', 'pinkyMCP']
  const everythingElse = pooled(() =>
    control([], { landmarkNoisePx: 2, noisyLandmarks: LANDMARK_NAMES.filter(name => !frameInputs.includes(name)) }),
  )
  assert.ok(pipOnly.origin.median > 0.8 * allLandmarks.origin.median, `PIP ${pipOnly.origin.median} vs all ${allLandmarks.origin.median}`)
  assert.ok(everythingElse.origin.p95 < 0.5, `non-frame landmarks: ${everythingElse.origin.p95}`)
})

// ---------------------------------------------------------------------------
// A. Which bed point matters for what
// ---------------------------------------------------------------------------

test('A: only the cuticle points move the origin; the free-edge points cannot', () => {
  for (const point of CUTICLE) {
    const result = pooled(d => control([{ kind: 'random', points: [point], axis: 'both', px: 3, seed: d }]))
    assert.ok(result.origin.median > 1, `${point}: ${result.origin.median}`)
  }
  for (const point of FREE_EDGE) {
    const result = pooled(d => control([{ kind: 'random', points: [point], axis: 'both', px: 3, seed: d }]))
    assert.ok(result.origin.p95 < 0.1, `${point}: ${result.origin.p95}`)
    // But they do reach the shape.
    assert.ok(result.length.median > 0.5 && result.tangent.median > 0.2, point)
  }
})

test('A: the width is read from the cuticle edge alone', () => {
  // The free-edge points reach it only through the lift's shared scale ratio:
  // thousandths of a percent.
  for (const point of FREE_EDGE) {
    const result = pooled(d => control([{ kind: 'random', points: [point], axis: 'across', px: 3, seed: d }]))
    assert.ok(result.width.worst < 0.05, `${point} moved the width: ${result.width.worst}`)
  }
  const cuticle = pooled(d => control([{ kind: 'random', points: ['cuticleSideA'], axis: 'across', px: 3, seed: d }]))
  assert.ok(cuticle.width.median > 0.5, `cuticle width ${cuticle.width.median}`)
})

test('A: per pixel, an error inconsistent between views is the costliest across the nail', () => {
  // Per cuticle point and per pixel: common across ~0.56%, view-inconsistent
  // across ~1.23% — the inconsistency is read as parallax and amplified.
  const common = pooled(() => control([{ kind: 'common', points: ['cuticleSideA'], axis: 'across', px: 2 }]), 1)
  const inconsistent = pooled(() => control([{ kind: 'viewSpecific', points: ['cuticleSideA'], axis: 'across', px: 2 }]), 1)
  assert.ok(inconsistent.origin.median > 2 * common.origin.median, `${inconsistent.origin.median} vs ${common.origin.median}`)
})

test('A: origin error grows linearly with the cuticle error', () => {
  const at = (px: number) =>
    pooled(() => control([{ kind: 'common', points: [...CUTICLE], axis: 'along', px }]), 1).origin.median
  const one = at(1)
  assert.ok(Math.abs(at(2) / one - 2) < 0.02 && Math.abs(at(5) / one - 5) < 0.05, `${one} ${at(2)} ${at(5)}`)
})

// ---------------------------------------------------------------------------
// B. Random versus systematic, at the same 2 px
// ---------------------------------------------------------------------------

test('B: a systematic error common to both views costs more at the median and is invisible', () => {
  const random = pooled(d => control([{ kind: 'random', points: ALL4, axis: 'both', px: 2, seed: d }]))
  const common = pooled(() => control([{ kind: 'common', points: ALL4, axis: 'along', px: 2 }]), 1)
  assert.ok(common.origin.median > random.origin.median, `${common.origin.median} vs ${random.origin.median}`)
  // Random error shows in the bed residual; the common shift barely does.
  assert.ok(random.bedResidual.median > 1, `random residual ${random.bedResidual.median}`)
  assert.ok(common.bedResidual.worst < 0.3, `common residual ${common.bedResidual.worst}`)
})

test('B: repeatability metrics see random annotation error and are blind to a common one', () => {
  const random = repeatability(seed => control([{ kind: 'random', points: ALL4, axis: 'both', px: 2, seed }]))
  assert.ok(random.m1.median > 2, `M1 ${random.m1.median}`)
  assert.ok(random.m2.median > 0.5 && random.m4.median > 1)
  assert.ok(random.m6.median > 1, `M6 ${random.m6.median}`)

  // The same bias in every capture is perfectly repeatable — and wrong.
  const common = repeatability(() => control([{ kind: 'common', points: ALL4, axis: 'along', px: 2 }]))
  // (M2 is an angle out of acos, which rounds to ~1e-6 degrees near zero.)
  assert.ok(common.m1.worst < 1e-6 && common.m2.worst < 1e-4 && common.m6.worst < 1e-6, `common bias must not show in M1-M6: ${JSON.stringify(common)}`)
  const absolute = pooled(() => control([{ kind: 'common', points: ALL4, axis: 'along', px: 2 }]), 1)
  assert.ok(absolute.origin.median > 3, `while the socket is ${absolute.origin.median}% off`)
})

// ---------------------------------------------------------------------------
// C. What the residual cannot see
// ---------------------------------------------------------------------------

test('C: the bed residual misses common, asymmetric and boundary errors, and sees the rest', () => {
  const residual = (errors: BedError[], confusion?: BoundaryConfusion) =>
    pooled(() => control(errors, { confusion }), 1).bedResidual.worst
  const invisible: Array<[string, number]> = [
    ['common across', residual([{ kind: 'common', points: ALL4, axis: 'across', px: 2 }])],
    ['asymmetric', residual([{ kind: 'asymmetric', points: ALL4, axis: 'across', px: 2 }])],
    ['distal at nail tip', residual([], { kind: 'distalAtTip', fractionOfBedLength: 0.25 })],
    ['cuticle too distal', residual([], { kind: 'cuticleTooDistal', fractionOfBedLength: 0.25 })],
    ['labels swapped', residual([], { kind: 'swap' })],
  ]
  for (const [name, value] of invisible) assert.ok(value < 0.1, `${name}: residual ${value}`)

  const visible = pooled(() => control([{ kind: 'viewSpecific', points: ALL4, axis: 'along', px: 2 }]), 1)
  assert.ok(visible.bedResidual.median > 1.5, `view-inconsistent error: ${visible.bedResidual.median}`)
})

test('C: a boundary confusion moves the socket by exactly its own size, silently', () => {
  const tip = pooled(() => control([], { confusion: { kind: 'distalAtTip', fractionOfBedLength: 0.25 } }), 1)
  assert.ok(Math.abs(tip.length.median - 25) < 0.1, `length ${tip.length.median}`)
  assert.ok(tip.origin.worst < 1e-6, 'the distal points cannot move the origin')
  const lunula = pooled(() => control([], { confusion: { kind: 'cuticleTooDistal', fractionOfBedLength: 0.1 } }), 1)
  assert.ok(Math.abs(lunula.origin.median - 10) < 0.1, `origin ${lunula.origin.median}`)
})

test('C: M6 catches a distal boundary that follows the nail tip', () => {
  // Placed at the tip, the "bed" grows with the nail — the Stage 1 failure,
  // invisible in any single scan and plain across a nail change.
  const geometry = PERSONS[0][1]
  const short = bedScan(geometry, { pose: 'truth', confusion: { kind: 'distalAtTip', fractionOfBedLength: 0 } })
  const long = bedScan(geometry, { pose: 'truth', confusion: { kind: 'distalAtTip', fractionOfBedLength: 0.5 } })
  assert.ok(short && long)
  const swap = swapInvariance(short.socket, long.socket)
  assert.ok(swap && Math.abs(swap.bedLengthRatio - 0.5) < 1e-6, `M6 length ${swap?.bedLengthRatio}`)
})

test('C: a cuticle/free-edge swap is caught for free by the tangent direction', () => {
  // The canonical frame's +y runs along the finger, so a real bed's tangent
  // points distally. A swap reverses it — no residual needed.
  const geometry = PERSONS[2][1]
  const clean = bedScan(geometry, { pose: 'truth' })
  const swapped = bedScan(geometry, { pose: 'truth', confusion: { kind: 'swap' } })
  assert.ok(clean && swapped)
  assert.ok(clean.socket.socket.tangent[1] > 0.5, `clean tangent ${clean.socket.socket.tangent}`)
  assert.ok(swapped.socket.socket.tangent[1] < -0.5, `swapped tangent ${swapped.socket.socket.tangent}`)
  assert.ok(Math.abs(swapped.tangentDeg - 180) < 1e-6)
})

// ---------------------------------------------------------------------------
// D. Optional landmarks, actually used
// ---------------------------------------------------------------------------

test('D: optional points that the estimator does not read change nothing', () => {
  const errors = (seed: number): BedError[] => [{ kind: 'random', points: ALL7, axis: 'both', px: 2, seed }]
  const present = pooled(d => control(errors(d), { optionalBedPoints: true, estimator: { kind: 'quad' } }))
  const absent = pooled(d => control(errors(d), { optionalBedPoints: true }))
  assert.equal(present.origin.median, absent.origin.median)
})

test('D: used, the apex trims the origin and the walls trim the width — modestly', () => {
  // 48 draws per person: the tails here are close enough that eight draws
  // gave the opposite answer.
  const errors = (seed: number): BedError[] => [{ kind: 'random', points: ALL7, axis: 'both', px: 2, seed: 1000 + seed }]
  const quad = pooled(d => control(errors(d), { optionalBedPoints: true, estimator: { kind: 'quad' } }), 48)
  const apex = pooled(d => control(errors(d), { optionalBedPoints: true, estimator: { kind: 'fused', cuticleApex: true } }), 48)
  const walls = pooled(d => control(errors(d), { optionalBedPoints: true, estimator: { kind: 'fused', bedWalls: true } }), 48)
  assert.ok(apex.origin.median < quad.origin.median * 0.95, `apex origin ${apex.origin.median} vs ${quad.origin.median}`)
  assert.ok(apex.origin.worst < quad.origin.worst, `apex worst ${apex.origin.worst} vs ${quad.origin.worst}`)
  assert.ok(walls.width.p95 < quad.width.p95 * 0.85, `walls width ${walls.width.p95} vs ${quad.width.p95}`)
  // No miracle: the apex does not halve anything.
  assert.ok(apex.origin.median > quad.origin.median * 0.7)
})

test('D: an apex sharing the cuticle bias cannot remove it', () => {
  const shared = pooled(
    () =>
      control([{ kind: 'common', points: ['cuticleSideA', 'cuticleSideB', 'cuticleApex'], axis: 'along', px: 2 }], {
        optionalBedPoints: true,
        estimator: { kind: 'fused', cuticleApex: true },
      }),
    1,
  )
  const plain = pooled(() => control([{ kind: 'common', points: [...CUTICLE], axis: 'along', px: 2 }]), 1)
  assert.ok(Math.abs(shared.origin.median - plain.origin.median) < 0.05, `${shared.origin.median} vs ${plain.origin.median}`)
})

test('D: in the realistic setting the optional points cannot touch the dominant error', () => {
  const errors = (seed: number): BedError[] => [{ kind: 'random', points: ALL7, axis: 'both', px: 2, seed }]
  const realistic = { pose: 'h1PalmRigid' as const, landmarkNoisePx: 2, optionalBedPoints: true }
  const quad = pooled(d => ({ ...realistic, bedErrors: errors(d), estimator: { kind: 'quad' } }))
  const all = pooled(d => ({ ...realistic, bedErrors: errors(d), estimator: { kind: 'fused', cuticleApex: true, bedWalls: true } }))
  assert.ok(Math.abs(all.origin.median - quad.origin.median) < 1.5, `${all.origin.median} vs ${quad.origin.median}`)
  assert.ok(all.origin.median > 7, `still dominated by the frame: ${all.origin.median}`)
})

// ---------------------------------------------------------------------------
// E. What precision a target needs
// ---------------------------------------------------------------------------

test('E: with H1 + palmRigid the origin has a ~4.6% p95 floor that no annotation can lower', () => {
  // Perfect observations, Stage 7's profile: the floor comes from the profile
  // mismatch (P8's MCP layout), so 3% p95 is out of reach on this path.
  const perfect = pooled(() => ({ pose: 'h1PalmRigid' }), 1)
  assert.ok(perfect.origin.p95 > 3.5 && perfect.origin.p95 < 6, `floor p95 ${perfect.origin.p95}`)
})

test('E: with the true pose, bed-only error costs ~3% of origin p95 per pixel at this resolution', () => {
  for (const [px, expected] of [[1, 3], [2, 6]] as const) {
    const result = pooled(d => control([{ kind: 'random', points: ALL4, axis: 'both', px, seed: d }]), 8)
    assert.ok(Math.abs(result.origin.p95 - expected) < 1.2, `${px}px -> p95 ${result.origin.p95}`)
  }
})

// ---------------------------------------------------------------------------
// F. Pixels are not the unit — bed length is
// ---------------------------------------------------------------------------

test('F: the same error as a fraction of bed length gives the same socket at any resolution', () => {
  const at = (resolution: number, px: number) =>
    pooled(d => control([{ kind: 'random', points: ALL4, axis: 'both', px, seed: d }], { resolution }), 2)
  const base = at(1, 2)
  for (const resolution of [0.5, 2, 4]) {
    const scaled = at(resolution, 2 * resolution)
    assert.ok(Math.abs(scaled.origin.median - base.origin.median) < 1e-6, `resolution ${resolution}`)
    // A fixed pixel error costs in inverse proportion to resolution (to within
    // the slight nonlinearity of a larger relative error at low resolution).
    const fixed = at(resolution, 2)
    const expected = base.origin.median / resolution
    assert.ok(Math.abs(fixed.origin.median / expected - 1) < 0.01, `fixed px at ${resolution}: ${fixed.origin.median} vs ${expected}`)
  }
})

test('F: the bed in this synthetic capture is only ~55 px long, so its pixel figures are conservative', () => {
  const lengths = pooled(() => control(), 1).results.map(result => result.bedLengthPx)
  const median = spread(lengths).median
  assert.ok(median > 45 && median < 65, `bed length ${median} px`)
})

// ---------------------------------------------------------------------------
// Population sanity
// ---------------------------------------------------------------------------

test('every result above was pooled over the eight-hand population', () => {
  assert.equal(PERSONS.length, 8)
  const geometries = new Set(PERSONS.map(([, geometry]) => JSON.stringify(geometry as SyntheticOptions)))
  assert.equal(geometries.size, 8)
})
