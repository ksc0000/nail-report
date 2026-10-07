// Stage 10 — the real-photo analysis kit (v2), checked before any photo exists.
//
// research/stage10/ is frozen before the first real capture so that nothing
// can be tuned to the photos afterwards. These tests are what make freezing it
// meaningful: on a synthetic stand-in in the exact on-disk format, the kit
// must (1) parse and pair what the protocol produces, (2) lift the cuticle
// probe exactly as the lift would, (3) stay quiet when nothing is wrong,
// (4) break the right criterion when one known fault is injected, and — v2 —
// (5) account for every session and compare F0 with F3dNoTip on matched
// sessions only, (6) read INCONCLUSIVE, never HOLD, when coverage or
// uncertainty is too thin, and (7) survive the stress the real photos can
// bring: a landmark Vision did not return, sessions never shot, marks not
// made, errors shared between DIP and PIP, a drift over the day. None of this
// is evidence about real photos.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildFrame } from '../src/lib/nail3dCanonicalFrames.ts'
import { identityView, liftTwoView } from '../src/lib/nail3dMultiView.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { estimateRelativeRotationWithProfile } from '../src/lib/nail3dProfilePose.ts'
import { FINGER_LANDMARKS } from '../src/lib/nail3dSocket.ts'
import {
  STAGE10_SCHEDULE,
  analyzeStage10,
  calibrate,
  checkConditions,
  frameRepeatability,
  isCalibrationName,
  liftPoint,
  parseAnnotationCsv,
  parseCaptureName,
} from '../research/stage10/kit.ts'
import type { NailSetId, Stage10Analysis } from '../research/stage10/kit.ts'
import {
  M6_DETECTABLE_FACTOR,
  THRESHOLDS,
  evaluateCriteria,
  measuredNoise,
  renderReport,
  screenShift,
  shiftChi2Threshold,
  simulateExpectation,
} from '../research/stage10/criteria.ts'
import type { SyntheticExpectation, Verdict } from '../research/stage10/criteria.ts'
import { mean, variance, welchDifference } from '../research/stage10/stats.ts'
import { dryRunDataset } from './support/stage10DryRun.ts'
import type { DryRunOptions } from './support/stage10DryRun.ts'
import { PERSONS } from './support/handPopulation.ts'

const parsedObservations = (raw: Record<string, ScanObservation>): Map<string, ScanObservation> =>
  new Map(
    Object.entries(raw).map(([id, observation]) => {
      const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
      assert.ok(parsed.ok, `${id}: ${parsed.ok ? '' : parsed.errors.join('; ')}`)
      return [id, parsed.value]
    }),
  )

const analyse = (options: DryRunOptions, schedule?: readonly NailSetId[]): Stage10Analysis => {
  const dataset = dryRunDataset(options)
  const annotations = parseAnnotationCsv(dataset.annotationsCsv)
  assert.deepEqual(annotations.errors, [])
  return analyzeStage10({
    observations: parsedObservations(dataset.observations),
    annotations: annotations.rows,
    capturedAt: new Map(Object.entries(dataset.capturedAt)),
    schedule,
  })
}

// One synthetic expectation for every verdict below, at the noise the
// fault-free stand-in measures (8 people x 1 seed keeps the suite quick).
let expectation: SyntheticExpectation | null = null
const expected = (): SyntheticExpectation => {
  expectation ??= simulateExpectation(measuredNoise(analyse({ seed: 99 })), 1)
  return expectation
}
const verdictFor = (options: DryRunOptions): { analysis: Stage10Analysis; verdict: Verdict } => {
  const analysis = analyse(options)
  return { analysis, verdict: evaluateCriteria(analysis, expected()) }
}
const criterion = (verdict: Verdict, id: string) => verdict.criteria.find(entry => entry.id === id)!
const status = (verdict: Verdict, id: string) => criterion(verdict, id).status

// ---------------------------------------------------------------------------
// Formats and the protocol
// ---------------------------------------------------------------------------

test('capture names carry session, nail set, view and shot; anything else is reported, not guessed', () => {
  assert.deepEqual(parseCaptureName('S3-N1-V2-1'), { captureId: 'S3-N1-V2-1', session: 'S3', nailSet: 'N1', view: 'V2', shot: 1 })
  assert.equal(parseCaptureName('S3-N2-V2-1'), null)
  assert.equal(parseCaptureName('IMG_0042'), null)
  assert.ok(isCalibrationName('CAL-07'))
  assert.ok(!isCalibrationName('S1-N0-V1-1'))
})

test('the annotation CSV is strict: header, pass, point names, numbers, no duplicates', () => {
  const good = parseAnnotationCsv('captureId,pass,point,x,y\nS1-N0-V1-1,1,cuticleSideA,10.5,20\n# a comment\n')
  assert.deepEqual(good.errors, [])
  assert.deepEqual(good.rows, [{ captureId: 'S1-N0-V1-1', pass: 1, point: 'cuticleSideA', x: 10.5, y: 20 }])
  const bad = parseAnnotationCsv(
    [
      'id,pass,point,x,y',
      'S1-N0-V1-1,3,cuticleSideA,1,2',
      'S1-N0-V1-1,1,nailTip,1,2',
      'S1-N0-V1-1,1,indexDIP,one,2',
      'S1-N0-V1-1,1,indexPIP,1,2',
      'S1-N0-V1-1,1,indexPIP,1,2',
    ].join('\n'),
  )
  assert.equal(bad.rows.length, 1)
  assert.equal(bad.errors.length, 5, bad.errors.join(' | '))
})

test('the schedule is ABBA x 3: time-balanced, so a linear drift cannot pose as a nail-set shift', () => {
  assert.equal(STAGE10_SCHEDULE.join(' '), 'N0 N1 N1 N0 N0 N1 N1 N0 N0 N1 N1 N0')
  const index = (set: NailSetId) => mean(STAGE10_SCHEDULE.flatMap((entry, i) => (entry === set ? [i + 1] : [])))
  assert.equal(index('N0'), 6.5)
  assert.equal(index('N1'), 6.5)
})

test('the stand-in is valid Layer A in the ABBA order, with capture times, every gap named', () => {
  const dataset = dryRunDataset({ seed: 3 })
  const observations = parsedObservations(dataset.observations)
  assert.equal([...observations.keys()].filter(isCalibrationName).length, 15)
  assert.equal([...observations.keys()].filter(id => parseCaptureName(id)).length, 48)
  for (const [id, observation] of observations) {
    assert.equal(observation.nails.length, 0, 'nail-bed points come from the annotation file, not from Vision')
    assert.ok(observation.missing.includes('nails'))
    assert.equal(observation.landmarks.length, 21)
    assert.ok(dataset.capturedAt[id], `${id} has a capture time`)
    const name = parseCaptureName(id)
    if (name) assert.equal(name.nailSet, STAGE10_SCHEDULE[Number(name.session.slice(1)) - 1], id)
  }
  // Shot 1 only is annotated; N1 has no free edge (a long opaque nail hides it).
  const rows = parseAnnotationCsv(dataset.annotationsCsv).rows
  assert.ok(rows.every(row => parseCaptureName(row.captureId)!.shot === 1))
  assert.ok(!rows.some(row => row.captureId.includes('-N1-') && row.point.startsWith('freeEdge')))
  assert.equal(rows.length, 12 * 6 + 12 * 4 + 24 * 4)
  assert.deepEqual(checkConditions(dataset.conditions), [], 'the stand-in records everything conditions.json must')
})

test('conditions.json: the capture geometry, the endpoints and the session log are required, and reported when missing', () => {
  const full = dryRunDataset({ seed: 3 }).conditions
  const views = full.views as Record<string, Record<string, unknown>>
  const broken = { ...full, views: { V1: views.V1, V2: { ...views.V2, distanceCm: undefined } }, handSupport: '', sessionLog: undefined }
  const problems = checkConditions(broken)
  assert.ok(problems.some(p => p.includes('views.V2.distanceCm')))
  assert.ok(problems.some(p => p.includes('handSupport')))
  assert.ok(problems.some(p => p.includes('sessionLog')))
  assert.deepEqual(checkConditions(undefined).length, 1)
})

test('protocol deviations are reported, not corrected: wrong order, out-of-order shots, sessions shot out of turn', () => {
  // The same data read against the old alternating order: every ABAB/ABBA difference is named.
  const abab: NailSetId[] = Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? 'N0' : 'N1'))
  const analysis = analyse({ seed: 11, schedule: abab })
  assert.equal(analysis.protocol.filter(note => note.includes('the ABBA schedule says')).length, 6)
  // Capture times: S5 shot before S4, and a V2 photo before V1 within a session.
  const dataset = dryRunDataset({ seed: 11 })
  const times = { ...dataset.capturedAt }
  ;[times['S4-N0-V1-1'], times['S5-N0-V1-1']] = [times['S5-N0-V1-1'], times['S4-N0-V1-1']]
  times['S7-N1-V2-1'] = '2026:10:20 08:00:00'
  const reordered = analyzeStage10({
    observations: parsedObservations(dataset.observations),
    annotations: parseAnnotationCsv(dataset.annotationsCsv).rows,
    capturedAt: new Map(Object.entries(times)),
  })
  assert.ok(reordered.protocol.some(note => note.startsWith('S7:') && note.includes('taken before')), reordered.protocol.join(' | '))
  assert.ok(reordered.protocol.some(note => note.includes('started before')), reordered.protocol.join(' | '))
})

// ---------------------------------------------------------------------------
// The probe lift is the lift
// ---------------------------------------------------------------------------

test('liftPoint reproduces the lift\'s own bed corners exactly', () => {
  const dataset = dryRunDataset({ seed: 5 })
  const observations = parsedObservations(dataset.observations)
  const rows = parseAnnotationCsv(dataset.annotationsCsv).rows
  const profile = calibrate([...observations.values()].filter(o => isCalibrationName(o.captureId))).profile
  assert.ok(profile)
  const corner = (id: string, point: string) => {
    const row = rows.find(r => r.captureId === id && r.pass === 1 && r.point === point)!
    return { x: row.x, y: row.y, confidence: null, source: 'manual' as const }
  }
  const withBed = (id: string): ScanObservation => ({
    ...observations.get(id)!,
    nails: [
      {
        finger: 'index',
        sideAToward: 'thumb',
        points: {
          cuticleSideA: corner(id, 'cuticleSideA'),
          cuticleSideB: corner(id, 'cuticleSideB'),
          freeEdgeSideA: corner(id, 'freeEdgeSideA'),
          freeEdgeSideB: corner(id, 'freeEdgeSideB'),
        },
      },
    ],
  })
  const a = withBed('S1-N0-V1-1')
  const b = withBed('S1-N0-V2-1')
  const rotation = estimateRelativeRotationWithProfile(profile, a, b, { set: 'palmRigid' }).rotation
  assert.ok(rotation)
  const lifted = liftTwoView(a, b, { reference: identityView, second: { rotation } }, ['index'])
  const bed = lifted.canonical?.beds[0]
  assert.ok(bed)
  const wrist = (o: ScanObservation) => {
    const w = o.landmarks.find(l => l.name === 'wrist')!
    return [w.x!, -w.y!] as [number, number]
  }
  const probe = { wristA: wrist(a), wristB: wrist(b), relative: rotation, u: lifted.residuals.viewScaleRatio }
  const names = ['cuticleSideA', 'cuticleSideB', 'freeEdgeSideB', 'freeEdgeSideA'] as const
  names.forEach((name, index) => {
    const p = a.nails[0].points[name]!
    const q = b.nails[0].points[name]!
    const point = liftPoint(probe, [p.x, p.y], [q.x, q.y])
    for (let axis = 0; axis < 3; axis += 1) assert.ok(Math.abs(point[axis] - bed.quad[index][axis]) < 1e-9, `${name}[${axis}]`)
  })
})

test('F3dNoTip is not TIP-free end to end: its frame builder ignores TIP, but the lift\'s scale ratio reads it', () => {
  const dataset = dryRunDataset({ seed: 5 })
  const observations = parsedObservations(dataset.observations)
  const profile = calibrate([...observations.values()].filter(o => isCalibrationName(o.captureId))).profile!
  const a = observations.get('S1-N0-V1-1')!
  const b = observations.get('S1-N0-V2-1')!
  const rotation = estimateRelativeRotationWithProfile(profile, a, b, { set: 'palmRigid' }).rotation!
  const lift = (second: ScanObservation) => liftTwoView(a, second, { reference: identityView, second: { rotation } }, ['index'])
  const moved: ScanObservation = {
    ...b,
    landmarks: b.landmarks.map(l => (l.name === 'indexTIP' ? { ...l, y: (l.y ?? 0) - 25 } : l)),
  }
  const before = lift(b)
  const after = lift(moved)
  // Only the V2 TIP moved, yet the one scale ratio the lift solves from every landmark changed ...
  assert.notEqual(before.residuals.viewScaleRatio, after.residuals.viewScaleRatio)
  const frameOf = (landmarks: readonly (readonly number[] | null)[]) => buildFrame('F3dNoTip', landmarks as never, 'index', profile)!.frame
  const f1 = frameOf(before.canonical!.landmarks3d)
  const f2 = frameOf(after.canonical!.landmarks3d)
  // ... so F3dNoTip's frame moved with it,
  assert.ok(Math.hypot(...f1.origin.map((v, i) => v - f2.origin[i])) > 1e-6)
  // while the frame builder itself does not read TIP at all.
  const withoutTip = before.canonical!.landmarks3d.map((point, index) => (index === FINGER_LANDMARKS.index[3] ? null : point))
  assert.deepEqual(frameOf(withoutTip), f1)
})

// ---------------------------------------------------------------------------
// The analysis on a fault-free stand-in
// ---------------------------------------------------------------------------

test('fault-free: every session accounted for and matched; F3dNoTip steadier than F0', () => {
  const analysis = analyse({ seed: 700 })
  assert.deepEqual(analysis.problems, [])
  assert.deepEqual(analysis.protocol, [])
  for (const set of ['N0', 'N1'] as const) {
    const c = analysis.accounting.conditions[set]
    assert.deepEqual(
      [c.attempted, c.available, c.poseAccepted, c.frameAccepted.F0, c.frameAccepted.F3dNoTip, c.primaryEligible, c.q5Matched],
      [6, 6, 6, 6, 6, 6, 6],
      set,
    )
    assert.equal(c.meanSessionIndex, 6.5)
  }
  assert.ok(analysis.accounting.sessions.every(account => account.excluded.length === 0))
  assert.ok(analysis.calibration.stretchSe < 0.005)
  for (const joint of analysis.joints) {
    assert.deepEqual(joint.rows, { N0: 6, N1: 6 })
    assert.ok(joint.sdShotFloor < joint.sdDetector, `${joint.joint}/${joint.view}`)
  }
  const m1 = (frame: string) => analysis.frames.find(entry => entry.frame === frame)!.m1Pooled
  assert.ok(m1('F3dNoTip') < m1('F0'), `${m1('F3dNoTip')} vs ${m1('F0')}`)
  assert.ok(Math.abs(analysis.primary.ratio - m1('F3dNoTip') / m1('F0')) < 1e-12)
  assert.ok(analysis.primary.ratioCi95[0] < analysis.primary.ratio && analysis.primary.ratio < analysis.primary.ratioCi95[1])
  // Synthetic says the origin scatter follows Vision's DIP/PIP: substituting the creases changes it most.
  const shares = analysis.substitution.find(entry => entry.frame === 'F3dNoTip')!
  assert.ok(shares.creaseJoints > shares.cuticleNoise && shares.creaseJoints > shares.rigPose)
})

test('fault-free: no criterion breaks', () => {
  const { verdict } = verdictFor({ seed: 700 })
  for (const entry of verdict.criteria) assert.notEqual(entry.status, 'BREAK', `${entry.id}: ${entry.measured}`)
  assert.notEqual(verdict.nextStep.kind, 'first-break')
})

// ---------------------------------------------------------------------------
// The B2 screening rule: what it is, and what it is not
// ---------------------------------------------------------------------------

test('the B2 cutoff is F(2, n − 2) at 0.05/4 — used as an empirical screening rule, not a p-value', () => {
  assert.ok(Math.abs(shiftChi2Threshold(10) - 14.02) < 0.01)
  assert.ok(shiftChi2Threshold(10) > 8.76 && shiftChi2Threshold(1000) < 8.9)
})

/** The screening statistic on two groups of six, along/across correlated by rho: its rate of flags. */
const screenRate = (rho: number, shift: number, trials: number, seed = 1) => {
  let state = seed
  const uniform = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return (state + 0.5) / 4294967296
  }
  const gauss = () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform())
  const limit = shiftChi2Threshold(10)
  let flags = 0
  for (let t = 0; t < trials; t += 1) {
    const group = (offset: number) =>
      Array.from({ length: 6 }, () => {
        const z1 = gauss()
        return [z1 + offset, rho * z1 + Math.sqrt(1 - rho * rho) * gauss()]
      })
    const a = group(0)
    const b = group(shift)
    const along = welchDifference(a.map(p => p[0]), b.map(p => p[0]))
    const across = welchDifference(a.map(p => p[1]), b.map(p => p[1]))
    if ((along.delta / along.se) ** 2 + (across.delta / across.se) ** 2 > limit) flags += 1
  }
  return flags / trials
}

test('stress: under correlated along/across errors the screening rule flags more than its nominal 1.25% — hence a screening rule', () => {
  const independent = screenRate(0, 0, 20000)
  const correlated = screenRate(0.9, 0, 20000)
  // Measured: ~1.1% independent, ~2.2% at rho = 0.9 (and ~2.5% at rho = 1), per joint and view.
  assert.ok(independent < 0.0175, `independent ${independent}`)
  assert.ok(correlated > 0.0175 && correlated < 0.035, `correlated ${correlated}`)
})

test('the B2 sensitivity is what the rule flags with ~80% probability', () => {
  // detectable80 = (√limit + z0.8) · SE; at six a side, SE = σ·√(2/6).
  const detectable = (Math.sqrt(shiftChi2Threshold(10)) + 0.8416) * Math.sqrt(2 / 6)
  const power = screenRate(0, detectable, 10000, 7)
  assert.ok(power > 0.75 && power < 0.85, `power ${power}`)
})

test('the M6 sensitivity factor: a shift of 2.4x the chance rms is flagged ~80% of the time', () => {
  let state = 3
  const uniform = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return (state + 0.5) / 4294967296
  }
  const gauss = () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform())
  const trials = 6000
  let flags = 0
  for (let t = 0; t < trials; t += 1) {
    const chanceTrue = Math.sqrt(3 * (2 / 6))
    const a = Array.from({ length: 6 }, () => [gauss(), gauss(), gauss()])
    const b = Array.from({ length: 6 }, () => [gauss() + M6_DETECTABLE_FACTOR * chanceTrue, gauss(), gauss()])
    const centre = (p: number[][]) => [0, 1, 2].map(k => mean(p.map(q => q[k])))
    const spread = (p: number[][]) => [0, 1, 2].reduce((sum, k) => sum + variance(p.map(q => q[k])) * 5, 0)
    const chance = Math.sqrt(((spread(a) + spread(b)) / 10) * (2 / 6))
    const [ca, cb] = [centre(a), centre(b)]
    if (Math.hypot(cb[0] - ca[0], cb[1] - ca[1], cb[2] - ca[2]) > THRESHOLDS.m6ChanceFactor * chance) flags += 1
  }
  assert.ok(flags / trials > 0.75 && flags / trials < 0.86, `${flags / trials}`)
})

// ---------------------------------------------------------------------------
// HOLD is not INCONCLUSIVE: coverage and uncertainty
// ---------------------------------------------------------------------------

test('stress: sessions never shot leave the analysis by name, and B2–B5 / B7 read INCONCLUSIVE, not HOLD', () => {
  // Three of the six N1 sessions missing.
  const { analysis, verdict } = verdictFor({ seed: 721, skipSessions: [2, 3, 6] })
  const n1 = analysis.accounting.conditions.N1
  assert.deepEqual([n1.attempted, n1.available, n1.primaryEligible], [6, 3, 3])
  for (const session of ['S2', 'S3', 'S6']) {
    assert.deepEqual(analysis.accounting.sessions.find(a => a.session === session)!.excluded, ['no photo'])
    assert.ok(analysis.protocol.some(note => note.startsWith(`${session} (N1): no photo`)))
  }
  for (const id of ['B2', 'B3', 'B4', 'B5', 'B7']) {
    assert.equal(status(verdict, id), 'INCONCLUSIVE', `${id}: ${criterion(verdict, id).basis}`)
    assert.match(criterion(verdict, id).basis, /coverage/)
  }
})

test('stress: a noisy detector makes B2 INCONCLUSIVE by its own uncertainty, never a HOLD it cannot support', () => {
  const { verdict } = verdictFor({ seed: 722, detectorSigmaPx: 6 })
  assert.equal(status(verdict, 'B2'), 'INCONCLUSIVE')
  assert.match(criterion(verdict, 'B2').basis, /uncertainty/)
  for (const shift of verdict.shifts) assert.ok(shift.status !== 'HOLD' || shift.detectable80 <= THRESHOLDS.nailSetSensitivityPct)
})

test('B5 reads INCONCLUSIVE when the ratio interval includes 1, HOLD only when it lies below', () => {
  // The rule on the analysis itself: shift the interval, keep everything else.
  const { analysis } = verdictFor({ seed: 700 })
  const at = (ci: [number, number], ratio: number) =>
    evaluateCriteria({ ...analysis, primary: { ...analysis.primary, ratio, ratioCi95: ci } }, expected()).criteria.find(c => c.id === 'B5')!.status
  assert.equal(at([0.4, 0.9], 0.6), 'HOLD')
  assert.equal(at([0.6, 1.2], 0.85), 'INCONCLUSIVE')
  assert.equal(at([1.05, 1.6], 1.3), 'BREAK')
})

// ---------------------------------------------------------------------------
// Paired: F0 and F3dNoTip on the same sessions only
// ---------------------------------------------------------------------------

test('stress: a landmark Vision did not return refuses F0 there; the comparison drops the session for BOTH frames, by name', () => {
  // pinkyTIP missing in V2 of S2 (N1) and S5 (N0): F0 needs all 21, F3dNoTip does not.
  const analysis = analyse({
    seed: 731,
    dropLandmarks: [
      { session: 2, view: 'V2', name: 'pinkyTIP' },
      { session: 5, view: 'V2', name: 'pinkyTIP' },
    ],
  })
  for (const session of ['S2', 'S5']) {
    const account = analysis.accounting.sessions.find(a => a.session === session)!
    assert.equal(account.frames.F0, false)
    assert.equal(account.frames.F3dNoTip, true)
    assert.equal(account.primaryEligible, false)
    assert.ok(account.excluded.includes('F0 refused'), account.excluded.join('; '))
  }
  assert.equal(analysis.accounting.conditions.N0.frameAccepted.F3dNoTip, 6)
  assert.equal(analysis.accounting.conditions.N0.primaryEligible, 5)
  // Both primary frames are computed on the same ten sessions.
  const frame = (name: string) => analysis.frames.find(entry => entry.frame === name)!
  assert.deepEqual(frame('F0').sessions, { N0: 5, N1: 5 })
  assert.deepEqual(frame('F3dNoTip').sessions, { N0: 5, N1: 5 })
  assert.equal(analysis.primary.sessions.N0.length + analysis.primary.sessions.N1.length, 10)
  // Unpaired, F3dNoTip would have used its twelve sessions against F0's ten: a different number.
  const all = new Set(analysis.accounting.sessions.map(a => a.session))
  const unpaired = frameRepeatability(analysis.pairs, 'F3dNoTip', all)
  assert.deepEqual(unpaired.sessions, { N0: 6, N1: 6 })
  assert.notEqual(unpaired.m1Pooled, frame('F3dNoTip').m1Pooled)
})

test('stress: a missing pass-2 mark takes the session out of Q5 for every substitution, and says which', () => {
  const analysis = analyse({ seed: 732, skipAnnotations: [{ session: 4, points: ['cuticleSideA'], pass: 2 }] })
  const s4 = analysis.accounting.sessions.find(a => a.session === 'S4')!
  assert.equal(s4.primaryEligible, true)
  assert.equal(s4.q5Matched, false)
  assert.ok(s4.excluded.some(reason => reason.includes('no pass-2 cuticle')), s4.excluded.join('; '))
  for (const entry of analysis.substitution.filter(e => e.frame === 'F0' || e.frame === 'F3dNoTip')) assert.equal(entry.sessions, 11)
})

test('stress: an unmarked cuticle takes the session out of the primary comparison with the reason', () => {
  const analysis = analyse({ seed: 733, skipAnnotations: [{ session: 7, points: ['cuticleSideB'], pass: 1 }] })
  const s7 = analysis.accounting.sessions.find(a => a.session === 'S7')!
  assert.equal(s7.poseAccepted, true)
  assert.equal(s7.primaryEligible, false)
  assert.ok(s7.excluded.some(reason => reason.startsWith('cuticle not marked')), s7.excluded.join('; '))
})

// ---------------------------------------------------------------------------
// Time balance
// ---------------------------------------------------------------------------

test('stress: a linear drift over the day cancels exactly in ABBA, and poses as a nail-set shift in ABAB', () => {
  const abab: NailSetId[] = Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? 'N0' : 'N1'))
  const along = (schedule: readonly NailSetId[] | undefined, drift: number) =>
    analyse({ seed: 741, driftPxPerSession: drift, schedule }, schedule)
      .joints.filter(joint => joint.view === 'V1')
      .map(joint => joint.shiftAlong.delta)
  const effect = (schedule?: readonly NailSetId[]) => {
    const withDrift = along(schedule, 3)
    const without = along(schedule, 0)
    return withDrift.map((value, index) => value - without[index])
  }
  // ABBA: both conditions sit at mean session 6.5, so 3 px per session adds nothing (to within how
  // the drift projects onto each session's own annotated finger axis: ~1e-5 % of the bed).
  for (const value of effect()) assert.ok(Math.abs(value) < 1e-3, `ABBA ${value}`)
  // ABAB: N1 sits one session later on average, so the drift appears as ~3 px (~2% of the bed) of "shift".
  for (const value of effect(abab)) assert.ok(value > 1.5 && value < 3, `ABAB ${value}`)
})

test('stress: a detector error shared by DIP and PIP and by both views, with no nail-set effect, does not break B2 by itself', () => {
  // 3 px per session, 45° to the finger (along and across together), the same in V1 and V2.
  const verdicts = [0, 1, 2, 3].map(i => verdictFor({ seed: 751 + i, geometry: PERSONS[(i * 3 + 2) % 8][1], correlatedJointErrorPx: { px: 3, angleDeg: 45 } }).verdict)
  assert.ok(verdicts.filter(v => status(v, 'B2') === 'BREAK').length <= 1, verdicts.map(v => criterion(v, 'B2').basis).join(' | '))
  for (const verdict of verdicts) for (const shift of verdict.shifts) assert.ok(Number.isFinite(shift.chi2))
})

// ---------------------------------------------------------------------------
// One known fault at a time: the right criterion, the right first break
// ---------------------------------------------------------------------------

test('a long nail that moves Vision\'s DIP trips the B2 screening rule, and the first broken assumption says so', () => {
  const { verdict } = verdictFor({ seed: 702, geometry: PERSONS[2][1], nailSetDipShiftPx: 8 })
  assert.equal(status(verdict, 'B2'), 'BREAK')
  assert.equal(verdict.nextStep.kind, 'first-break')
  assert.equal(verdict.nextStep.name, 'nail-set-dependent DIP/PIP detection')
  assert.ok(screenShift(verdictFor({ seed: 702, geometry: PERSONS[2][1], nailSetDipShiftPx: 8 }).analysis.joints.find(j => j.joint === 'indexDIP' && j.view === 'V1')!).flagged)
})

/** One fault, four people: a criterion's power is a rate, so it is tested as one. */
const outcomes = (fault: DryRunOptions, firstSeed: number) =>
  [0, 1, 2, 3].map(i => verdictFor({ seed: firstSeed + i * 10, geometry: PERSONS[(i * 3 + 1) % 8][1], ...fault }).verdict)

// The two tests below check the WIRING — the right criterion and the right first break for a large
// fault, against one reference expectation. What the criteria can detect when, as with real data,
// the expectation is simulated at the noise measured on the same photos is measured in §6-L.

test('noisy palm landmarks break the pose criterion, named as pose / hand motion / model inconsistency', () => {
  const verdicts = outcomes({ palmSigmaPx: 8 }, 713)
  assert.ok(verdicts.filter(v => status(v, 'B3') === 'BREAK').length >= 3)
  assert.ok(verdicts.filter(v => v.nextStep.name.startsWith('pose / hand motion / model inconsistency')).length >= 3)
})

test('a finger bent differently each session breaks B6, and the posture comes before the Q5 substitutions', () => {
  const verdicts = outcomes({ flexSigmaDeg: 8 }, 714)
  assert.ok(verdicts.filter(v => status(v, 'B6') === 'BREAK').length >= 3)
  assert.ok(verdicts.filter(v => v.nextStep.name === 'DIP posture between sessions (capture UX)').length >= 3)
})

test('known limit: judged as real data is (expectation at the noise measured on the same photos), a 4° posture change reads as B1, not B6', () => {
  // The posture moves the annotator's creases against Vision's joints, which the measured detector
  // noise absorbs; the expectation is then simulated at that inflated noise, and B6's limit grows with it.
  const clean = analyse({ seed: 700, geometry: PERSONS[0][1] })
  const bent = analyse({ seed: 700, geometry: PERSONS[0][1], flexSigmaDeg: 4 })
  assert.ok(measuredNoise(bent).detectorPct > 3 * measuredNoise(clean).detectorPct)
  const verdict = evaluateCriteria(bent, simulateExpectation(measuredNoise(bent), 1))
  assert.equal(status(verdict, 'B1'), 'BREAK')
  assert.equal(status(verdict, 'B6'), 'HOLD')
})

test('a TIP dragged onto the nail moves Vision\'s fingertip and F3d, while F3dNoTip stays within chance', () => {
  const analysis = analyse({ seed: 705, geometry: PERSONS[5][1], tipFollowsNail: 'dorsalTip' })
  const frame = (name: string) => analysis.frames.find(entry => entry.frame === name)!
  for (const view of ['V1', 'V2'] as const) {
    const reach = analysis.tipReach[view]
    assert.ok(reach.shift.ci95[0] > 0, `${view}: ${reach.shift.delta} ${reach.shift.ci95}`)
  }
  assert.ok(frame('F3d').m6 > 2 * frame('F3d').m6Chance, `F3d ${frame('F3d').m6} vs ${frame('F3d').m6Chance}`)
  assert.ok(frame('F3dNoTip').m6 < 2 * frame('F3dNoTip').m6Chance)
})

// ---------------------------------------------------------------------------
// The report
// ---------------------------------------------------------------------------

test('the report states what it is, accounts for every session, and claims no cause', () => {
  const { analysis, verdict } = verdictFor({ seed: 700 })
  const report = renderReport(analysis, expected(), verdict, { title: 'DRY RUN — not evidence' })
  assert.ok(report.startsWith('# DRY RUN — not evidence'))
  assert.ok(report.includes('Nothing here is accuracy'))
  assert.ok(report.includes('within the sensitivity of this experiment, no break was detected'))
  assert.ok(report.includes('## Data accounting (sessions)'))
  for (const id of ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']) assert.ok(report.includes(`| ${id} |`), id)
  assert.ok(report.includes('not a causal attribution'))
  assert.ok(report.includes('empirical, not a formal test'))
  assert.ok(!/\bperfect\b/i.test(report), 'no "perfect input" wording')
  assert.ok(!report.includes('**Bottleneck'), 'no causal bottleneck heading')
})
