// Stage 10 — the pre-registered break criteria (kit v2), and the synthetic
// expectation they are judged against.
//
// A real dataset here is small (12 placements), and a statistic from 12
// placements scatters even when nothing is wrong: in the protocol geometry the
// synthetic F3dNoTip/F0 ratio alone ranges 0.50–1.01 over 24 simulated
// datasets. So the criteria that concern the frame and the pose do not use
// fixed numbers. They compare the real result with the SAME protocol simulated
// at the noise level actually measured on the photos, with the same sample
// size.
//
// Four statuses, and what each one may be read as:
//   BREAK         the synthetic assumption failed by the pre-registered rule.
//   WEAKENED      (B5 only) F3dNoTip is steadier than F0, but by less than
//                 synthetic predicts.
//   HOLD          within the sensitivity of this experiment, no break was
//                 detected. NOT "equivalent", NOT "invariant": a HOLD always
//                 carries what the experiment could have detected.
//   INCONCLUSIVE  coverage or uncertainty too thin to say either. The
//                 experiment stays at 12 sessions; INCONCLUSIVE is an accepted
//                 outcome, not a reason to collect more on the fly.
//
// B2's cutoff is an EMPIRICAL SCREENING RULE, not a formal significance test:
// it sums two squared Welch ratios as if the along and across components were
// independent and reads the sum against F(2, n − 2), which is not that
// statistic's null distribution (a proper two-sample test would use the 2x2
// covariance, Hotelling's T²; normality is assumed too). Its false-alarm rate
// is therefore measured, on synthetic data, rather than claimed
// (tests/nail3dStage10Kit.test.ts, docs §6-L).
//
// Q5 is a reference-substitution SENSITIVITY analysis (kit.ts
// ReferenceSubstitution), never a causal attribution: the largest share is a
// candidate for the next step, not "the cause".
//
// The thresholds below were fixed before any real photo existed
// (docs/product/NAIL_SOCKET_POC_PLAN.md §6-L; v2 after the independent review,
// still before any photo). Changing one after seeing data is allowed only as a
// new, separately reported analysis.

import { PERSONS } from '../../tests/support/handPopulation.ts'
import { dryRunBedLengthPx, dryRunDataset } from '../../tests/support/stage10DryRun.ts'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import { analyzeStage10, parseAnnotationCsv } from './kit.ts'
import type { JointStats, NailSetId, Stage10Analysis, Stage10Frame } from './kit.ts'

/** Stage 8/9 modelled every landmark at 2 px on a 55 px bed. */
export const SYNTHETIC_LANDMARK_SIGMA_PCT = (2 / 55) * 100

export const THRESHOLDS = {
  /** B1: real per-axis detector noise above twice the synthetic assumption. */
  landmarkNoiseFactor: 2,
  /**
   * B2 screening rule: a nail-set shift is flagged when it is larger than this,
   * % bed length, AND its screening statistic (sum of the two squared Welch
   * ratios) exceeds the limit F(2, n − 2) puts at 0.05 / 4 (two joints x two
   * views). An empirical screening rule — see the header.
   */
  nailSetShiftPct: 3,
  nailSetAlpha: 0.05 / 4,
  /**
   * B2 may read HOLD only if its screening rule would flag a shift this large,
   * % bed length, with ~80% probability at the measured session-level
   * uncertainty (twice the 3% rule). Otherwise INCONCLUSIVE.
   */
  nailSetSensitivityPct: 6,
  /** B3: pose refusals, and the median pose deviation against its simulated median (one outlier capture cannot trip it). */
  poseRefusalRate: 0.2,
  poseScatterFactor: 2,
  /** B4: origin repeatability against the simulated median. */
  repeatabilityFactor: 2,
  /** B5: F3dNoTip must beat F0 (the 95% interval of the ratio, not only its point); and must not move with the nail set beyond chance. */
  frameRatio: 1,
  m6ChanceFactor: 2,
  /**
   * B6: spread of the F3d − F3dNoTip axis gap, degrees, and against its
   * simulated median. The gap follows only ~55% of a real DIP flexion in
   * synthetic, so 1.5 degrees of gap is ~3 degrees of DIP angle.
   */
  axisGapDeg: 1.5,
  axisGapFactor: 2.5,
  /** B7: share of the origin variance the reference substitutions leave. */
  remainderShare: 0.5,
  /** Coverage: usable sessions per condition (of 6 scheduled) a criterion needs to read anything but INCONCLUSIVE. */
  minSessionsPerCondition: 5,
} as const

/** z for 80% power: the B2 sensitivity is quoted at this power. */
const Z_POWER_80 = 0.8416
/**
 * M6 screening (flag above 2x its chance rms) flags a nail-set shift of ~2.4x
 * the chance rms with ~80% probability (3D, chance estimated from six sessions
 * a side; checked by simulation in tests/nail3dStage10Kit.test.ts).
 */
export const M6_DETECTABLE_FACTOR = 2.4

// ---------------------------------------------------------------------------
// The synthetic expectation at the measured noise
// ---------------------------------------------------------------------------

export interface MeasuredNoise {
  /** Per-axis detector noise, % bed length (V1, DIP and PIP averaged). */
  detectorPct: number
  /** Per-axis annotator noise, % bed length (V1). */
  annotatorPct: number
}

export const measuredNoise = (analysis: Stage10Analysis): MeasuredNoise => {
  const v1 = analysis.joints.filter(joint => joint.view === 'V1')
  const average = (values: number[]) => {
    const finite = values.filter(Number.isFinite)
    return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : Number.NaN
  }
  return {
    detectorPct: average(v1.map(joint => joint.sdDetector)),
    annotatorPct: average(v1.map(joint => joint.sdAnnotator)),
  }
}

export interface Distribution {
  median: number
  p90: number
  max: number
  values: number[]
}

const distribution = (values: number[]): Distribution => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  const at = (q: number) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] : Number.NaN)
  return { median: at(0.5), p90: at(0.9), max: sorted.length ? sorted[sorted.length - 1] : Number.NaN, values: sorted }
}

export interface SyntheticExpectation {
  noise: MeasuredNoise
  datasets: number
  m1: Record<'F0' | 'F3dNoTip', Distribution>
  ratio: Distribution
  poseMedianDeg: Distribution
  axisGapSdDeg: Distribution
  remainder: Distribution
}

const analyseDryRun = (options: Parameters<typeof dryRunDataset>[0]) => {
  const dataset = dryRunDataset(options)
  const observations = new Map(
    Object.entries(dataset.observations).map(([id, raw]) => {
      const parsed = parseScanObservation(JSON.parse(JSON.stringify(raw)))
      if (!parsed.ok) throw new Error(`${id}: ${parsed.errors.join('; ')}`)
      return [id, parsed.value]
    }),
  )
  return analyzeStage10({
    observations,
    annotations: parseAnnotationCsv(dataset.annotationsCsv).rows,
    capturedAt: new Map(Object.entries(dataset.capturedAt)),
  })
}

/**
 * The Stage 10 protocol simulated over the Stage 7 population at the measured
 * noise: the same ABBA sessions, views, nail sets and annotation passes, no
 * faults, no posture change between sessions, no hand motion between the
 * views, the nominal rig geometry. What the synthetic model says the real
 * numbers should look like.
 */
export const simulateExpectation = (noise: MeasuredNoise, seeds = 3): SyntheticExpectation => {
  // No measured noise (too few annotated photos): there is nothing to simulate
  // at, and every criterion that needs the expectation reads INCONCLUSIVE.
  if (!Number.isFinite(noise.detectorPct)) {
    const none = distribution([])
    return { noise, datasets: 0, m1: { F0: none, F3dNoTip: none }, ratio: none, poseMedianDeg: none, axisGapSdDeg: none, remainder: none }
  }
  const m1F0: number[] = []
  const m1F3: number[] = []
  const ratio: number[] = []
  const pose: number[] = []
  const gap: number[] = []
  const remainder: number[] = []
  PERSONS.forEach(([, geometry], personIndex) => {
    const bed = dryRunBedLengthPx(geometry)
    for (let seed = 1; seed <= seeds; seed += 1) {
      const analysis = analyseDryRun({
        geometry,
        seed: 1000 + personIndex * 17 + seed,
        detectorSigmaPx: (noise.detectorPct / 100) * bed,
        annotatorSigmaPx: Number.isFinite(noise.annotatorPct) ? (noise.annotatorPct / 100) * bed : 1,
      })
      const frame = (name: Stage10Frame) => analysis.frames.find(entry => entry.frame === name)!
      m1F0.push(frame('F0').m1Pooled)
      m1F3.push(frame('F3dNoTip').m1Pooled)
      ratio.push(analysis.primary.ratio)
      pose.push(analysis.pose.acrossSessionsMedianDeg)
      gap.push(analysis.axisGap.sdDeg)
      remainder.push(analysis.substitution.find(entry => entry.frame === 'F3dNoTip')!.remainder)
    }
  })
  return {
    noise,
    datasets: m1F0.length,
    m1: { F0: distribution(m1F0), F3dNoTip: distribution(m1F3) },
    ratio: distribution(ratio),
    poseMedianDeg: distribution(pose),
    axisGapSdDeg: distribution(gap),
    remainder: distribution(remainder),
  }
}

// ---------------------------------------------------------------------------
// The criteria
// ---------------------------------------------------------------------------

/**
 * The B2 screening limit for the sum of two squared Welch ratios: the value
 * F(2, dof) puts at tail probability alpha, as 2F. Used as a screening cutoff
 * whose false-alarm rate is measured, not as a p-value (see the header).
 */
export const shiftChi2Threshold = (dof: number, alpha: number = THRESHOLDS.nailSetAlpha): number =>
  dof > 0 ? dof * (alpha ** (-2 / dof) - 1) : Number.POSITIVE_INFINITY

export type Status = 'BREAK' | 'WEAKENED' | 'HOLD' | 'INCONCLUSIVE'

export interface Criterion {
  id: 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7'
  question: string
  assumption: string
  measured: string
  rule: string
  status: Status
  /** Why this status: what tripped, or the coverage / uncertainty that kept it from a call. */
  basis: string
  /** What this experiment could have detected, when that is known. */
  sensitivity: string
}

const f = (value: number, digits = 2) => (Number.isFinite(value) ? value.toFixed(digits) : 'n/a')
const interval = ([lo, hi]: readonly [number, number], digits = 2) => `[${f(lo, digits)}, ${f(hi, digits)}]`

/** The B2 screening rule applied to one joint in one view. */
export interface ShiftScreen {
  joint: JointStats['joint']
  view: JointStats['view']
  rows: Record<NailSetId, number>
  /** (Δalong / SE)² + (Δacross / SE)². */
  chi2: number
  limit: number
  flagged: boolean
  /** Upper end of |shift| over the per-component 95% intervals (a box bound), % bed length. */
  upper95: number
  /** Shift the screening rule flags with ~80% probability at these SEs (≈ (√limit + z0.8) · the larger SE), % bed length. */
  detectable80: number
  status: Status
  basis: string
}

export const screenShift = (joint: JointStats): ShiftScreen => {
  const { shiftAlong: a, shiftAcross: c } = joint
  const rows = joint.rows.N0 + joint.rows.N1
  const chi2 = (a.delta / a.se) ** 2 + (c.delta / c.se) ** 2
  const limit = shiftChi2Threshold(rows - 2)
  const flagged = chi2 > limit && joint.nailSetShift > THRESHOLDS.nailSetShiftPct
  const reach = (ci: readonly [number, number]) => Math.max(Math.abs(ci[0]), Math.abs(ci[1]))
  const upper95 = Math.hypot(reach(a.ci95), reach(c.ci95))
  const detectable80 = (Math.sqrt(limit) + Z_POWER_80) * Math.max(a.se, c.se)
  const min = THRESHOLDS.minSessionsPerCondition
  let status: Status
  let basis: string
  if (joint.rows.N0 < min || joint.rows.N1 < min) {
    status = 'INCONCLUSIVE'
    basis = `coverage N0 ${joint.rows.N0}, N1 ${joint.rows.N1} (< ${min})${flagged ? '; the screening rule flagged it on this partial data' : ''}`
  } else if (!Number.isFinite(chi2)) {
    status = 'INCONCLUSIVE'
    basis = 'not computable'
  } else if (flagged) {
    status = 'BREAK'
    basis = `screening rule: |shift| ${f(joint.nailSetShift)}% > ${THRESHOLDS.nailSetShiftPct}% and ${f(chi2, 1)} > ${f(limit, 1)}`
  } else if (!(detectable80 <= THRESHOLDS.nailSetSensitivityPct)) {
    status = 'INCONCLUSIVE'
    basis = `uncertainty: only shifts ≳ ${f(detectable80, 1)}% would be flagged (needs ≤ ${THRESHOLDS.nailSetSensitivityPct}%)`
  } else {
    status = 'HOLD'
    basis = `no shift flagged; ≳ ${f(detectable80, 1)}% would have been, with ~80% probability`
  }
  return { joint: joint.joint, view: joint.view, rows: joint.rows, chi2, limit, flagged, upper95, detectable80, status, basis }
}

/** BREAK if any part breaks, else INCONCLUSIVE if any part is, else HOLD. */
const combine = (statuses: readonly Status[]): Status =>
  statuses.includes('BREAK') ? 'BREAK' : statuses.includes('INCONCLUSIVE') || !statuses.length ? 'INCONCLUSIVE' : 'HOLD'

export interface NextStep {
  /** first-break: an assumption broke, by the pre-registered order. candidate: nothing in the order broke; the largest Q5 substitution share — a candidate, not a cause. */
  kind: 'first-break' | 'candidate' | 'none'
  name: string
  reason: string
  /** Criteria earlier in the order that read INCONCLUSIVE: the order cannot rule them out. */
  caveats: string[]
  conclusive: boolean
}

export interface Verdict {
  criteria: Criterion[]
  shifts: ShiftScreen[]
  nextStep: NextStep
}

export const evaluateCriteria = (analysis: Stage10Analysis, expected: SyntheticExpectation): Verdict => {
  const criteria: Criterion[] = []
  const min = THRESHOLDS.minSessionsPerCondition
  const covered = (counts: Record<NailSetId, number>) => counts.N0 >= min && counts.N1 >= min
  const coverage = (label: string, counts: Record<NailSetId, number>) => `coverage ${label}: N0 ${counts.N0}, N1 ${counts.N1} (needs ≥ ${min} each)`
  const conditions = analysis.accounting.conditions

  // B1 — landmark noise level (Q1)
  const v1 = analysis.joints.filter(joint => joint.view === 'V1')
  const v1Rows = { N0: Math.min(...v1.map(j => j.rows.N0)), N1: Math.min(...v1.map(j => j.rows.N1)) }
  const worstV1 = Math.max(...v1.map(joint => joint.sdDetector).filter(Number.isFinite))
  const b1Limit = THRESHOLDS.landmarkNoiseFactor * SYNTHETIC_LANDMARK_SIGMA_PCT
  criteria.push({
    id: 'B1',
    question: 'Q1',
    assumption: `every landmark ±${f(SYNTHETIC_LANDMARK_SIGMA_PCT, 1)}% bed length per axis (2 px on 55 px, Stage 8/9)`,
    measured: v1.map(joint => `${joint.joint} ${f(joint.sdDetector)}%`).join(', ') + ' (V1, placement to placement)',
    rule: `BREAK if DIP or PIP > ${THRESHOLDS.landmarkNoiseFactor}× the assumption`,
    ...(!v1.length || !covered(v1Rows)
      ? { status: 'INCONCLUSIVE' as const, basis: coverage('V1 DIP/PIP rows', v1.length ? v1Rows : { N0: 0, N1: 0 }) }
      : !Number.isFinite(worstV1)
        ? { status: 'INCONCLUSIVE' as const, basis: 'not computable' }
        : worstV1 > b1Limit
          ? { status: 'BREAK' as const, basis: `${f(worstV1)}% > ${f(b1Limit, 1)}%` }
          : { status: 'HOLD' as const, basis: `${f(worstV1)}% ≤ ${f(b1Limit, 1)}%` }),
    sensitivity:
      "Vision − crease scatter is detector noise AND posture: a finger bent differently between sessions moves the creases against Vision's joints, so a B1 BREAK does not by itself say which (dry run: 4° per joint breaks B1 10/16)",
  })

  // B2 — the nail set moves DIP / PIP (Q2): empirical screening rule + session-level uncertainty
  const shifts = analysis.joints.map(screenShift)
  const b2 = combine(shifts.map(shift => shift.status))
  criteria.push({
    id: 'B2',
    question: 'Q2',
    assumption: 'a nail set moves only TIP; DIP and PIP stay (Stage 9 §H)',
    measured: shifts
      .map((shift, index) => {
        const joint = analysis.joints[index]
        return `${shift.joint}/${shift.view} ${f(joint.nailSetShift)}% (along ${interval(joint.shiftAlong.ci95)}, across ${interval(joint.shiftAcross.ci95)}; screen ${f(shift.chi2, 1)}/${f(shift.limit, 1)})`
      })
      .join('; '),
    rule: `screening rule (empirical, not a formal test): BREAK if any |shift| > ${THRESHOLDS.nailSetShiftPct}% AND screen > its F(2, n−2) cutoff at 0.05/4. HOLD only if ≥ ${min} sessions per condition and a ${THRESHOLDS.nailSetSensitivityPct}% shift would be flagged with ~80% probability`,
    status: b2,
    basis: shifts
      .filter(shift => shift.status === b2)
      .map(shift => `${shift.joint}/${shift.view}: ${shift.basis}`)
      .join('; '),
    sensitivity: shifts.map(shift => `${shift.joint}/${shift.view} ≳ ${f(shift.detectable80, 1)}%`).join(', '),
  })

  // B3 — pose (Q4)
  const poseLimit = THRESHOLDS.poseScatterFactor * expected.poseMedianDeg.median
  const available = { N0: conditions.N0.available, N1: conditions.N1.available }
  criteria.push({
    id: 'B3',
    question: 'Q4',
    assumption: 'H1 + palmRigid recovers the relative pose as well as in synthetic (Stage 7); the hand does not move between the views and the endpoints repeat',
    measured: `refusals ${f(analysis.pose.refusalRate * 100, 0)}%, median deviation from the rig mean ${f(analysis.pose.acrossSessionsMedianDeg)}° (synthetic ${f(expected.poseMedianDeg.median)}°) — pose estimator, hand motion between the views, camera endpoint and model inconsistency together`,
    rule: `BREAK if refusals > ${THRESHOLDS.poseRefusalRate * 100}% or deviation > ${THRESHOLDS.poseScatterFactor}× synthetic`,
    ...(!covered(available)
      ? { status: 'INCONCLUSIVE' as const, basis: coverage('available pairs', available) }
      : analysis.pose.refusalRate > THRESHOLDS.poseRefusalRate
        ? { status: 'BREAK' as const, basis: `refusals ${f(analysis.pose.refusalRate * 100, 0)}%` }
        : !Number.isFinite(poseLimit) || !Number.isFinite(analysis.pose.acrossSessionsMedianDeg)
          ? { status: 'INCONCLUSIVE' as const, basis: 'no synthetic expectation or no accepted pose' }
          : analysis.pose.acrossSessionsMedianDeg > poseLimit
            ? { status: 'BREAK' as const, basis: `${f(analysis.pose.acrossSessionsMedianDeg)}° > ${f(poseLimit)}°` }
            : { status: 'HOLD' as const, basis: `${f(analysis.pose.acrossSessionsMedianDeg)}° ≤ ${f(poseLimit)}°` }),
    sensitivity: '',
  })

  // B4 — origin repeatability vs the synthetic model at the measured noise (Q4), primary set
  const frame = (name: Stage10Frame) => analysis.frames.find(entry => entry.frame === name)!
  const primaryCounts = { N0: analysis.primary.sessions.N0.length, N1: analysis.primary.sessions.N1.length }
  const over = (['F0', 'F3dNoTip'] as const).filter(name => frame(name).m1Pooled > THRESHOLDS.repeatabilityFactor * expected.m1[name].median)
  criteria.push({
    id: 'B4',
    question: 'Q4',
    assumption: 'the synthetic error model explains the real scatter at the measured noise',
    measured: (['F0', 'F3dNoTip'] as const)
      .map(name => `${name} M1 ${f(frame(name).m1Pooled)}% (synthetic ${f(expected.m1[name].median)}%)`)
      .join(', ') + ' on matched sessions',
    rule: `BREAK if either > ${THRESHOLDS.repeatabilityFactor}× synthetic median`,
    ...(!covered(primaryCounts)
      ? { status: 'INCONCLUSIVE' as const, basis: coverage('primary (matched) sessions', primaryCounts) }
      : (['F0', 'F3dNoTip'] as const).some(name => !Number.isFinite(frame(name).m1Pooled) || !Number.isFinite(expected.m1[name].median))
        ? { status: 'INCONCLUSIVE' as const, basis: 'not computable (no unit or no synthetic expectation)' }
        : over.length
          ? { status: 'BREAK' as const, basis: `${over.join(', ')} over ${THRESHOLDS.repeatabilityFactor}× synthetic` }
          : { status: 'HOLD' as const, basis: `both within ${THRESHOLDS.repeatabilityFactor}× synthetic` }),
    sensitivity: '',
  })

  // B5 — F3dNoTip against F0 (Q3), paired, with a session-level interval
  const { ratio, ratioCi95, logRatio } = analysis.primary
  const m6 = frame('F3dNoTip').m6
  const m6Chance = frame('F3dNoTip').m6Chance
  const moves = Number.isFinite(m6) && Number.isFinite(m6Chance) && m6 > THRESHOLDS.m6ChanceFactor * m6Chance
  let b5: Pick<Criterion, 'status' | 'basis'>
  if (!covered(primaryCounts)) b5 = { status: 'INCONCLUSIVE', basis: coverage('primary (matched) sessions', primaryCounts) }
  else if (!Number.isFinite(ratio) || !Number.isFinite(ratioCi95[0]) || !Number.isFinite(ratioCi95[1])) b5 = { status: 'INCONCLUSIVE', basis: 'ratio or its interval not computable' }
  else if (moves) b5 = { status: 'BREAK', basis: `F3dNoTip M6 ${f(m6)}% > ${THRESHOLDS.m6ChanceFactor}× chance ${f(m6Chance)}% (screening)` }
  else if (ratioCi95[0] >= THRESHOLDS.frameRatio) b5 = { status: 'BREAK', basis: `ratio interval ${interval(ratioCi95)} lies at or above ${THRESHOLDS.frameRatio}` }
  else if (ratioCi95[1] >= THRESHOLDS.frameRatio) b5 = { status: 'INCONCLUSIVE', basis: `ratio interval ${interval(ratioCi95)} includes ${THRESHOLDS.frameRatio}: this experiment cannot tell whether F3dNoTip is steadier` }
  else if (!Number.isFinite(expected.ratio.p90)) b5 = { status: 'INCONCLUSIVE', basis: 'no synthetic expectation for WEAKENED' }
  else if (ratio > expected.ratio.p90) b5 = { status: 'WEAKENED', basis: `ratio ${f(ratio)} above synthetic p90 ${f(expected.ratio.p90)}` }
  else b5 = { status: 'HOLD', basis: `ratio interval ${interval(ratioCi95)} below ${THRESHOLDS.frameRatio}; no M6 flag` }
  criteria.push({
    id: 'B5',
    question: 'Q3',
    assumption:
      'F3dNoTip is steadier than F0 and does not move with the nail set (Stage 9). Its frame builder ignores TIP, but the lift solves one scale ratio from every landmark incl. TIP, so an M6 can also come through the lift',
    measured: `M1 ratio F3dNoTip/F0 ${f(ratio)} ${interval(ratioCi95)} (jackknife over ${logRatio.units} matched sessions; synthetic median ${f(expected.ratio.median)}, p90 ${f(expected.ratio.p90)}); F3dNoTip M6 ${f(m6)}% vs chance ${f(m6Chance)}%`,
    rule: `BREAK if the ratio's 95% interval lies at or above ${THRESHOLDS.frameRatio}, or M6 > ${THRESHOLDS.m6ChanceFactor}× chance (screening); INCONCLUSIVE if the interval includes ${THRESHOLDS.frameRatio}; WEAKENED if below ${THRESHOLDS.frameRatio} but the ratio exceeds synthetic p90`,
    ...b5,
    sensitivity: `ratio ${interval(ratioCi95)}; nail-set shifts of F3dNoTip's origin below ≈ ${f(M6_DETECTABLE_FACTOR * m6Chance, 1)}% (${M6_DETECTABLE_FACTOR}× chance) would likely go unflagged. The M6 screen is empirical too: its false-alarm rate depends on how anisotropic the origin scatter is (dry run: 2 of 80 fault-free datasets)`,
  })

  // B6 — DIP posture held by the capture UX (Q4)
  const gapLimit = Math.max(THRESHOLDS.axisGapDeg, THRESHOLDS.axisGapFactor * expected.axisGapSdDeg.median)
  criteria.push({
    id: 'B6',
    question: 'Q4',
    assumption: 'the DIP angle repeats under the capture instructions (F3dNoTip holds it at calibration)',
    measured: `F3d − F3dNoTip axis gap SD ${f(analysis.axisGap.sdDeg)}° over ${analysis.axisGap.sessions} N0 sessions (synthetic ${f(expected.axisGapSdDeg.median)}°)`,
    rule: `BREAK if > ${f(gapLimit, 1)}° (max of ${THRESHOLDS.axisGapDeg}° and ${THRESHOLDS.axisGapFactor}× synthetic)`,
    ...(analysis.axisGap.sessions < min
      ? { status: 'INCONCLUSIVE' as const, basis: `coverage: ${analysis.axisGap.sessions} N0 sessions (needs ≥ ${min})` }
      : !Number.isFinite(analysis.axisGap.sdDeg) || !Number.isFinite(gapLimit)
        ? { status: 'INCONCLUSIVE' as const, basis: 'not computable' }
        : analysis.axisGap.sdDeg > gapLimit
          ? { status: 'BREAK' as const, basis: `${f(analysis.axisGap.sdDeg)}° > ${f(gapLimit, 1)}°` }
          : { status: 'HOLD' as const, basis: `${f(analysis.axisGap.sdDeg)}° ≤ ${f(gapLimit, 1)}°` }),
    sensitivity:
      "the limit scales with the synthetic gap at the MEASURED detector noise, which a posture change inflates (see B1): judged that way, B6 did not respond to 4–6° per joint in the dry run (0/16) while B1 did — a B6 HOLD does not rule out a posture change",
  })

  // B7 — the origin budget closes (Q5), matched sessions
  const shares = analysis.substitution.find(entry => entry.frame === 'F3dNoTip')!
  const q5Counts = { N0: conditions.N0.q5Matched, N1: conditions.N1.q5Matched }
  criteria.push({
    id: 'B7',
    question: 'Q5',
    assumption: 'with the cuticle marked by hand, the origin scatter is what landmarks + annotation + pose make of it (Stage 8/9)',
    measured: `F3dNoTip, ${shares.sessions} matched sessions: creases for Vision's DIP/PIP ${f(shares.creaseJoints * 100, 0)}%, cuticle pass-2 noise ${f(shares.cuticleNoise * 100, 0)}%, rig-mean pose ${f(shares.rigPose * 100, 0)}%; left after all three substitutions ${f(shares.remainder * 100, 0)}% (synthetic ${f(expected.remainder.median * 100, 0)}%)`,
    rule: `BREAK if more than ${THRESHOLDS.remainderShare * 100}% is left (a sensitivity analysis: substitutions by references, not true errors removed)`,
    ...(!covered(q5Counts)
      ? { status: 'INCONCLUSIVE' as const, basis: coverage('Q5 matched sessions', q5Counts) }
      : !Number.isFinite(shares.remainder)
        ? { status: 'INCONCLUSIVE' as const, basis: 'not computable' }
        : shares.remainder > THRESHOLDS.remainderShare
          ? { status: 'BREAK' as const, basis: `${f(shares.remainder * 100, 0)}% left` }
          : { status: 'HOLD' as const, basis: `${f(shares.remainder * 100, 0)}% left` }),
    sensitivity: '',
  })

  // What to look at next, by the order fixed in advance. Not a causal claim.
  const status = (id: Criterion['id']) => criteria.find(criterion => criterion.id === id)!.status
  const order: [Criterion['id'], string, string][] = [
    ['B3', 'pose / hand motion / model inconsistency (H1 + palmRigid on a stand)', 'every frame and socket number rides on the per-session pose'],
    [
      'B2',
      'nail-set-dependent DIP/PIP detection',
      `the screening rule flagged ${shifts.filter(s => s.status === 'BREAK').map(s => `${s.joint}/${s.view}`).join(', ')}; F3dNoTip reads both, so its nail-set invariance fails`,
    ],
    [
      'B6',
      'DIP posture between sessions (capture UX)',
      'F3dNoTip holds the DIP at its calibrated angle, so a finger that bends differently each time moves the socket (checked before Q5: posture also moves the creases against Vision\'s joints)',
    ],
  ]
  const caveats: string[] = []
  let nextStep: NextStep | null = null
  for (const [id, name, why] of order) {
    if (status(id) === 'BREAK') {
      nextStep = { kind: 'first-break', name, reason: `${id} broke: ${why}`, caveats: [...caveats], conclusive: true }
      break
    }
    if (status(id) === 'INCONCLUSIVE') caveats.push(`${id} INCONCLUSIVE — ${criteria.find(c => c.id === id)!.basis}`)
  }
  if (!nextStep) {
    const ranked = (
      [
        ["Vision's DIP/PIP (substituting the annotator's creases)", shares.creaseJoints],
        ['cuticle annotation noise', shares.cuticleNoise],
        ['pose / hand motion / model inconsistency (substituting the rig-mean pose)', shares.rigPose],
        ['what the substitutions leave (outside the synthetic model: perspective, palm landmarks, lift)', shares.remainder],
      ] as [string, number][]
    )
      .filter(([, share]) => Number.isFinite(share))
      .sort((a, b) => b[1] - a[1])
    const [first, second] = ranked
    if (status('B7') === 'INCONCLUSIVE') caveats.push(`B7 INCONCLUSIVE — ${criteria.find(c => c.id === 'B7')!.basis}`)
    nextStep = first
      ? {
          kind: 'candidate',
          name: first[0],
          reason: `no assumption in the order broke; the largest Q5 substitution share for F3dNoTip (${f(first[1] * 100, 0)}%${second ? `; next ${second[0]} ${f(second[1] * 100, 0)}%` : ''}) — a sensitivity, not a cause`,
          caveats,
          conclusive: status('B7') !== 'INCONCLUSIVE' && (!second || first[1] >= 1.5 * Math.max(second[1], 1e-9)),
        }
      : { kind: 'none', name: 'n/a', reason: 'no break in the order and no Q5 substitution available', caveats, conclusive: false }
  }
  return { criteria, shifts, nextStep }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

export const renderReport = (
  analysis: Stage10Analysis,
  expected: SyntheticExpectation,
  verdict: Verdict,
  header: { title: string; kitCommit?: string; conditions?: Record<string, unknown> },
): string => {
  const lines: string[] = []
  // A pipe inside a cell (|shift|) would split the Markdown table: escape it.
  const row = (cells: (string | number)[]) => `| ${cells.map(cell => (typeof cell === 'number' ? f(cell) : cell.replace(/\|/g, '\\|'))).join(' | ')} |`
  const divider = (n: number) => row(Array.from({ length: n }, () => '---'))
  lines.push(`# ${header.title}`, '')
  lines.push(
    `kit v${analysis.kitVersion}${header.kitCommit ? ` @ ${header.kitCommit}` : ''} · R = repeatability, C = consistency of two routes on one photo, S = shift between conditions. Nothing here is accuracy: there is no 3D truth.`,
    '',
    '**Statuses.** BREAK: the assumption failed by the pre-registered rule. HOLD: within the sensitivity of this experiment, no break was detected — not "equivalent", not "invariant". INCONCLUSIVE: coverage or uncertainty too thin to say either. WEAKENED (B5): steadier, but by less than synthetic predicts.',
    '',
  )
  if (header.conditions) lines.push('```json', JSON.stringify(header.conditions, null, 2), '```', '')
  lines.push(
    `Calibration frames ${analysis.counts.calibration}, captures ${analysis.counts.captures}. H1 stretch ${f(analysis.calibration.stretch ?? Number.NaN, 3)} ± ${f(analysis.calibration.stretchSe, 3)}. Bed length V1 ${f(analysis.bedLengthPx.V1, 0)} px, V2 ${f(analysis.bedLengthPx.V2, 0)} px.`,
    '',
  )

  lines.push('## Data accounting (sessions)', '')
  lines.push(row(['condition', 'attempted', 'available', 'pose accepted', 'F0 accepted', 'F3dNoTip accepted', 'primary eligible (both)', 'Q5 matched', 'mean session index']), divider(9))
  for (const set of ['N0', 'N1'] as const) {
    const c = analysis.accounting.conditions[set]
    lines.push(row([set, String(c.attempted), String(c.available), String(c.poseAccepted), String(c.frameAccepted.F0), String(c.frameAccepted.F3dNoTip), String(c.primaryEligible), String(c.q5Matched), f(c.meanSessionIndex, 1)]))
  }
  const stopped = analysis.accounting.sessions.filter(account => account.excluded.length)
  lines.push('', stopped.length ? '**Sessions that left the analysis, and why:**' : 'Every session reached Q5.', ...stopped.map(account => `- ${account.session} (${account.nailSet}): ${account.excluded.join('; ')}`))
  if (analysis.accounting.unusedCaptures.length) lines.push('', '**Photos not used:**', ...analysis.accounting.unusedCaptures.map(entry => `- ${entry}`))
  lines.push('', analysis.protocol.length ? '**Protocol deviations:**' : 'No protocol deviation found.', ...analysis.protocol.map(entry => `- ${entry}`), '')
  if (analysis.problems.length) lines.push('**Problems:**', ...analysis.problems.map(problem => `- ${problem}`), '')

  lines.push('## Verdict', '', row(['', 'question', 'synthetic assumption', 'measured', 'rule', 'status', 'basis']), divider(7))
  for (const criterion of verdict.criteria) {
    lines.push(row([criterion.id, criterion.question, criterion.assumption, criterion.measured, criterion.rule, `**${criterion.status}**`, criterion.basis]))
  }
  const sensitivities = verdict.criteria.filter(entry => entry.sensitivity)
  if (sensitivities.length) {
    lines.push('', '**What each criterion could see:**', ...sensitivities.map(entry => `- ${entry.id}: ${entry.sensitivity}`))
  }
  const next = verdict.nextStep
  lines.push(
    '',
    `**${next.kind === 'first-break' ? 'First broken assumption' : next.kind === 'candidate' ? 'Candidate for the next step (not a causal attribution)' : 'Next step'}: ${next.name}** — ${next.reason}${next.conclusive ? '' : ' (INCONCLUSIVE)'}`,
    ...next.caveats.map(caveat => `- caveat: ${caveat}`),
    '',
  )

  lines.push('## Q1/Q2 — landmarks, Vision against the annotator on the same photo (% bed length)', '')
  lines.push('S is N1 − N0 of (Vision − annotator), with session-level 95% Welch intervals. The screen is an empirical rule, not a p-value; "detectable" is the shift it flags with ~80% probability.', '')
  lines.push(row(['joint', 'view', 'sessions N0/N1', 'C offset along/across', 'C annotator', 'R detector', 'R shot floor', 'S along [95%]', 'S across [95%]', 'screen / cutoff', 'detectable', 'status']), divider(12))
  analysis.joints.forEach((joint, index) => {
    const shift = verdict.shifts[index]
    lines.push(
      row([
        joint.joint,
        joint.view,
        `${joint.rows.N0}/${joint.rows.N1}`,
        `${f(joint.offsetAlong)} / ${f(joint.offsetAcross)}`,
        joint.sdAnnotator,
        joint.sdDetector,
        joint.sdShotFloor,
        `${f(joint.shiftAlong.delta)} ${interval(joint.shiftAlong.ci95)}`,
        `${f(joint.shiftAcross.delta)} ${interval(joint.shiftAcross.ci95)}`,
        `${f(shift.chi2, 1)} / ${f(shift.limit, 1)}`,
        f(shift.detectable80, 1),
        shift.status,
      ]),
    )
  })
  const excludedRows = analysis.joints.flatMap(joint => joint.excluded.map(reason => `${joint.joint}/${joint.view} — ${reason}`))
  if (excludedRows.length) lines.push('', '**Rows left out:**', ...excludedRows.map(entry => `- ${entry}`))
  lines.push('', "TIP (Vision's fingertip beyond the annotator's DIP crease, % bed length):", '')
  for (const view of ['V1', 'V2'] as const) {
    const reach = analysis.tipReach[view]
    lines.push(`- ${view}: N0 ${f(reach.n0)}, N1 ${f(reach.n1)}, shift ${f(reach.shift.delta)} ${interval(reach.shift.ci95)}`)
  }

  lines.push('', '## Q3/Q4 — frames and socket on matched sessions (% bed length)', '')
  lines.push(
    `Primary set (F0 AND F3dNoTip valid): N0 ${analysis.primary.sessions.N0.join(' ') || '—'} · N1 ${analysis.primary.sessions.N1.join(' ') || '—'}; unit from N0 ${analysis.primary.unitSessions.join(' ') || '—'}. F3dNoTip / F0 = ${f(analysis.primary.ratio)} ${interval(analysis.primary.ratioCi95)} (delete-one-session jackknife on the log ratio, t(${Math.max(0, analysis.primary.logRatio.units - 1)})). F3d and F4 are descriptive only and are never selected from these data.`,
    '',
  )
  lines.push(row(['frame', 'sessions N0/N1', 'R M1 N0', 'R M1 N1', 'R M1 pooled', 'synthetic M1 (median)', 'S M6', 'M6 chance (rms)', 'full socket M0 / M1 / M2° / M3° / M4%']), divider(9))
  for (const entry of analysis.frames) {
    const synthetic = entry.frame === 'F0' || entry.frame === 'F3dNoTip' ? f(expected.m1[entry.frame].median) : '—'
    const socket = entry.socket ? `${f(entry.socket.m0, 3)} / ${f(entry.socket.m1)} / ${f(entry.socket.m2)} / ${f(entry.socket.m3)} / ${f(entry.socket.m4)}` : 'n/a'
    lines.push(row([entry.frame, `${entry.sessions.N0}/${entry.sessions.N1}`, entry.m1.N0, entry.m1.N1, entry.m1Pooled, synthetic, entry.m6, entry.m6Chance, socket]))
  }
  lines.push(
    '',
    `Pose (per session, about the rig mean — pose estimator, hand motion between the views, camera endpoint and model inconsistency are not separable here): refusals ${f(analysis.pose.refusalRate * 100, 0)}%, median ${f(analysis.pose.acrossSessionsMedianDeg)}° / p95 ${f(analysis.pose.acrossSessionsP95Deg)}°, shot floor ${f(analysis.pose.shotFloorMedianDeg)}°, profile mismatch ${f(analysis.pose.mismatchMedianPx)} px. Axis gap F3d − F3dNoTip (N0, ${analysis.axisGap.sessions} sessions): median ${f(analysis.axisGap.medianDeg)}°, SD ${f(analysis.axisGap.sdDeg)}°.`,
  )

  lines.push('', '## Q5 — reference-substitution sensitivity (matched sessions; not a causal attribution)', '')
  lines.push(
    "Each share is how much the origin variance changes when ONE input is replaced by a reference, on the same sessions: the annotator's creases for Vision's DIP/PIP (their own pass-2 noise taken out), the rig-mean pose for each session's estimate (which also absorbs hand motion, endpoint error and model inconsistency), and pass 1 vs 2 for the cuticle. A reference has its own convention and error: no share is a \"true error removed\". Not additive; can be negative.",
    '',
  )
  lines.push(row(['frame', 'sessions', 'variance %²', 'creases for DIP/PIP', 'cuticle noise', 'rig-mean pose', 'left after all three']), divider(7))
  for (const entry of analysis.substitution) {
    lines.push(row([entry.frame, String(entry.sessions), entry.total, `${f(entry.creaseJoints * 100, 0)}%`, `${f(entry.cuticleNoise * 100, 0)}%`, `${f(entry.rigPose * 100, 0)}%`, `${f(entry.remainder * 100, 0)}%`]))
  }
  lines.push('', `Synthetic expectation: ${expected.datasets} simulated datasets of this protocol at detector ${f(expected.noise.detectorPct)}% / annotator ${f(expected.noise.annotatorPct)}% per axis.`)
  return `${lines.join('\n')}\n`
}
