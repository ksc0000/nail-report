// Stage 10 — the real-photo analysis kit, checked before any photo exists.
//
// research/stage10/ is frozen before the first real capture so that nothing
// can be tuned to the photos afterwards. These tests are what make freezing it
// meaningful: on a synthetic stand-in in the exact on-disk format, the kit
// must (1) parse and pair what the protocol produces, (2) lift the cuticle
// probe exactly as the lift would, (3) stay quiet when nothing is wrong, and
// (4) break the right criterion and name the right bottleneck when one known
// fault is injected. None of this is evidence about real photos.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { identityView, liftTwoView } from '../src/lib/nail3dMultiView.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { estimateRelativeRotationWithProfile } from '../src/lib/nail3dProfilePose.ts'
import { calibrate, liftPoint, parseAnnotationCsv, parseCaptureName, isCalibrationName, analyzeStage10 } from '../research/stage10/kit.ts'
import type { Stage10Analysis } from '../research/stage10/kit.ts'
import {
  evaluateCriteria,
  measuredNoise,
  renderReport,
  shiftChi2Threshold,
  simulateExpectation,
} from '../research/stage10/criteria.ts'
import type { SyntheticExpectation, Verdict } from '../research/stage10/criteria.ts'
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

const analyse = (options: DryRunOptions): Stage10Analysis => {
  const dataset = dryRunDataset(options)
  const annotations = parseAnnotationCsv(dataset.annotationsCsv)
  assert.deepEqual(annotations.errors, [])
  return analyzeStage10({ observations: parsedObservations(dataset.observations), annotations: annotations.rows })
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
const status = (verdict: Verdict, id: string) => verdict.criteria.find(criterion => criterion.id === id)!.status

// ---------------------------------------------------------------------------
// Formats
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

test('the stand-in is valid Layer A: Vision-like landmarks, no nails, every gap named', () => {
  const dataset = dryRunDataset({ seed: 3 })
  const observations = parsedObservations(dataset.observations)
  assert.equal([...observations.keys()].filter(isCalibrationName).length, 15)
  assert.equal([...observations.keys()].filter(id => parseCaptureName(id)).length, 48)
  for (const observation of observations.values()) {
    assert.equal(observation.nails.length, 0, 'nail-bed points come from the annotation file, not from Vision')
    assert.ok(observation.missing.includes('nails'))
    assert.equal(observation.landmarks.length, 21)
  }
  // Shot 1 only is annotated; N1 has no free edge (a long opaque nail hides it).
  const rows = parseAnnotationCsv(dataset.annotationsCsv).rows
  assert.ok(rows.every(row => parseCaptureName(row.captureId)!.shot === 1))
  assert.ok(!rows.some(row => row.captureId.includes('-N1-') && row.point.startsWith('freeEdge')))
  assert.equal(rows.length, 12 * 6 + 12 * 4 + 24 * 4)
})

// ---------------------------------------------------------------------------
// The probe lift is the lift
// ---------------------------------------------------------------------------

test('liftPoint reproduces the lift\'s own bed corners exactly', () => {
  // A capture pair with a full bed, from the Stage 7 machinery.
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

// ---------------------------------------------------------------------------
// The analysis on a fault-free stand-in
// ---------------------------------------------------------------------------

test('fault-free: every pair is posed and every number exists; F3dNoTip is steadier than F0', () => {
  const analysis = analyse({ seed: 700 })
  assert.deepEqual(analysis.problems, [])
  assert.equal(analysis.counts.annotatedPairs, 12)
  assert.equal(analysis.counts.posesAccepted, 12)
  // The H1 stretch is measured, from 15 frames, to a fraction of a percent.
  assert.ok(analysis.calibration.stretchSe < 0.005)
  for (const joint of analysis.joints) {
    assert.ok(Number.isFinite(joint.sdDetector) && Number.isFinite(joint.sdAnnotator) && Number.isFinite(joint.sdShotFloor))
    // The shot floor (an unmoved hand) is far below placement-to-placement scatter.
    assert.ok(joint.sdShotFloor < joint.sdDetector, `${joint.joint}/${joint.view}`)
  }
  const m1 = (frame: string) => analysis.frames.find(entry => entry.frame === frame)!.m1Pooled
  assert.ok(m1('F3dNoTip') < m1('F0'), `${m1('F3dNoTip')} vs ${m1('F0')}`)
  // Synthetic says the origin scatter is mostly the DIP/PIP detector noise.
  const shares = analysis.attribution.find(entry => entry.frame === 'F3dNoTip')!
  assert.ok(shares.pipDipDetector > shares.cuticleAnnotation && shares.pipDipDetector > shares.pose)
})

test('fault-free: no criterion breaks', () => {
  const { verdict } = verdictFor({ seed: 700 })
  for (const criterion of verdict.criteria) assert.notEqual(criterion.status, 'BREAK', `${criterion.id}: ${criterion.measured}`)
})

test('the nail-set test is calibrated for six placements a side', () => {
  // Under no shift, chi2/2 follows F(2, n-2); the 0.05/4 limit for 12 photos.
  assert.ok(Math.abs(shiftChi2Threshold(10) - 14.02) < 0.01)
  // The naive chi-square(2) limit would be 8.76 — the small-sample tail is heavier.
  assert.ok(shiftChi2Threshold(10) > 8.76 && shiftChi2Threshold(1000) < 8.9)
})

// ---------------------------------------------------------------------------
// One known fault at a time: the right criterion, the right bottleneck
// ---------------------------------------------------------------------------

test('a long nail that moves Vision\'s DIP breaks B2, and the bottleneck says so', () => {
  const { verdict } = verdictFor({ seed: 702, geometry: PERSONS[2][1], nailSetDipShiftPx: 8 })
  assert.equal(status(verdict, 'B2'), 'BREAK')
  assert.equal(verdict.bottleneck.name, 'nail-set-dependent DIP/PIP detection')
})

/** One fault, four people: a criterion's power is a rate, so it is tested as one. */
const outcomes = (fault: DryRunOptions, firstSeed: number) =>
  [0, 1, 2, 3].map(i => verdictFor({ seed: firstSeed + i * 10, geometry: PERSONS[(i * 3 + 1) % 8][1], ...fault }).verdict)

test('noisy palm landmarks break the pose criterion, and the bottleneck is the pose', () => {
  // 4 px of extra error on the six palm points only. Measured over 16 runs:
  // B3 breaks 15 times; when it does not, the attribution still ranks the pose first.
  const verdicts = outcomes({ palmSigmaPx: 4 }, 713)
  assert.ok(verdicts.filter(v => status(v, 'B3') === 'BREAK').length >= 3)
  assert.ok(verdicts.filter(v => v.bottleneck.name.startsWith('pose')).length >= 3)
})

test('a finger bent differently each session breaks B6, and the bottleneck is the posture, not the detector', () => {
  // 4 degrees per joint between sessions. Measured over 16 runs: B6 breaks 15
  // times. Without B6 ranked ahead of the attribution, the posture would be
  // misread as detector noise (the annotator's creases move against Vision's
  // joints when the finger bends).
  const verdicts = outcomes({ flexSigmaDeg: 4 }, 714)
  assert.ok(verdicts.filter(v => status(v, 'B6') === 'BREAK').length >= 3)
  assert.ok(verdicts.filter(v => v.bottleneck.name === 'DIP posture between sessions (capture UX)').length >= 3)
})

test('a TIP dragged onto the nail moves Vision\'s fingertip and F3d, but not F3dNoTip', () => {
  const analysis = analyse({ seed: 705, geometry: PERSONS[5][1], tipFollowsNail: 'dorsalTip' })
  const frame = (name: string) => analysis.frames.find(entry => entry.frame === name)!
  // TIP reach grows with the long nail, in both views, by much more than its error.
  for (const view of ['V1', 'V2'] as const) {
    const reach = analysis.tipReach[view]
    assert.ok(reach.shift > 3 * reach.shiftSe, `${view}: ${reach.shift} ± ${reach.shiftSe}`)
  }
  // F3d reads TIP: its origin jumps between nail sets. F3dNoTip stays within chance.
  assert.ok(frame('F3d').m6 > 2 * frame('F3d').m6Chance, `F3d ${frame('F3d').m6} vs ${frame('F3d').m6Chance}`)
  assert.ok(frame('F3dNoTip').m6 < 2 * frame('F3dNoTip').m6Chance)
})

test('the report states what it is and carries every criterion', () => {
  const { analysis, verdict } = verdictFor({ seed: 700 })
  const report = renderReport(analysis, expected(), verdict, { title: 'DRY RUN — not evidence' })
  assert.ok(report.startsWith('# DRY RUN — not evidence'))
  assert.ok(report.includes('Nothing here is accuracy'))
  for (const id of ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']) assert.ok(report.includes(`| ${id} |`), id)
  assert.ok(report.includes('**Bottleneck:'))
})
