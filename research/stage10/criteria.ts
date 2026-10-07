// Stage 10 — the pre-registered break criteria, and the synthetic expectation
// they are judged against.
//
// A real dataset here is small (12 placements), and a statistic from 12
// placements scatters even when nothing is wrong: in the protocol geometry the
// synthetic F3dNoTip/F0 ratio alone ranges 0.50–1.01 over 24 simulated
// datasets. So the criteria that concern the frame and the pose do not use
// fixed numbers. They compare the real result with the SAME protocol simulated
// at the noise level actually measured on the photos, with the same sample
// size. A criterion breaks only when the real data falls outside what the
// synthetic model produces under those conditions.
//
// The thresholds below were fixed before any real photo existed
// (docs/product/NAIL_SOCKET_POC_PLAN.md §6-L). Changing one after seeing data
// is allowed only as a new, separately reported analysis.

import { PERSONS } from '../../tests/support/handPopulation.ts'
import { dryRunBedLengthPx, dryRunDataset } from '../../tests/support/stage10DryRun.ts'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import { analyzeStage10, parseAnnotationCsv } from './kit.ts'
import type { Stage10Analysis, Stage10Frame } from './kit.ts'

/** Stage 8/9 modelled every landmark at 2 px on a 55 px bed. */
export const SYNTHETIC_LANDMARK_SIGMA_PCT = (2 / 55) * 100

export const THRESHOLDS = {
  /** B1: real per-axis detector noise above twice the synthetic assumption. */
  landmarkNoiseFactor: 2,
  /**
   * B2: a nail-set shift must be both significant and this large, % bed length.
   * Significance: p < 0.05 / 4 (two joints x two views), with chi2/2 read
   * against F(2, n - 2) — each standard error comes from about six
   * placements, so a plain chi-square tail would cry wolf about one run in ten.
   */
  nailSetShiftPct: 3,
  nailSetAlpha: 0.05 / 4,
  /** B3: pose refusals, and the median pose deviation against its simulated median (one outlier capture cannot trip it). */
  poseRefusalRate: 0.2,
  poseScatterFactor: 2,
  /** B4: origin repeatability against the simulated median. */
  repeatabilityFactor: 2,
  /** B5: F3dNoTip must beat F0; and must not move with the nail set beyond chance. */
  frameRatio: 1,
  m6ChanceFactor: 2,
  /**
   * B6: spread of the F3d − F3dNoTip axis gap, degrees, and against its
   * simulated median. The gap follows only ~55% of a real DIP flexion in
   * synthetic, so 1.5 degrees of gap is ~3 degrees of DIP angle.
   */
  axisGapDeg: 1.5,
  axisGapFactor: 2.5,
  /** B7: share of the origin variance the substitution cannot attribute. */
  remainderShare: 0.5,
} as const

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
  return analyzeStage10({ observations, annotations: parseAnnotationCsv(dataset.annotationsCsv).rows })
}

/**
 * The Stage 10 protocol simulated over the Stage 7 population at the measured
 * noise: the same sessions, views, nail sets and annotation passes, no faults,
 * no posture change between sessions. What the synthetic model says the real
 * numbers should look like.
 */
export const simulateExpectation = (noise: MeasuredNoise, seeds = 3): SyntheticExpectation => {
  // No measured noise (too few annotated photos): there is nothing to simulate
  // at, and every criterion that needs the expectation reads N/A.
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
      ratio.push(frame('F3dNoTip').m1Pooled / frame('F0').m1Pooled)
      pose.push(analysis.pose.acrossSessionsMedianDeg)
      gap.push(analysis.axisGap.sdDeg)
      remainder.push(analysis.attribution.find(entry => entry.frame === 'F3dNoTip')!.remainder)
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

/** The chi-square (sum of two squared t-like ratios) that F(2, dof) puts at tail probability alpha. */
export const shiftChi2Threshold = (dof: number, alpha: number = THRESHOLDS.nailSetAlpha): number =>
  dof > 0 ? dof * (alpha ** (-2 / dof) - 1) : Number.POSITIVE_INFINITY

export type Status = 'BREAK' | 'WEAKENED' | 'HOLD' | 'N/A'

export interface Criterion {
  id: 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7'
  question: string
  assumption: string
  measured: string
  rule: string
  status: Status
}

const f = (value: number, digits = 2) => (Number.isFinite(value) ? value.toFixed(digits) : 'n/a')

export interface Verdict {
  criteria: Criterion[]
  bottleneck: { name: string; reason: string; conclusive: boolean }
}

export const evaluateCriteria = (analysis: Stage10Analysis, expected: SyntheticExpectation): Verdict => {
  const criteria: Criterion[] = []
  const v1 = analysis.joints.filter(joint => joint.view === 'V1')

  // B1 — landmark noise level (Q1)
  const worstV1 = Math.max(...v1.map(joint => joint.sdDetector).filter(Number.isFinite))
  criteria.push({
    id: 'B1',
    question: 'Q1',
    assumption: `every landmark ±${f(SYNTHETIC_LANDMARK_SIGMA_PCT, 1)}% bed length per axis (2 px on 55 px, Stage 8/9)`,
    measured: v1.map(joint => `${joint.joint} ${f(joint.sdDetector)}%`).join(', ') + ' (V1, placement to placement)',
    rule: `BREAK if DIP or PIP > ${THRESHOLDS.landmarkNoiseFactor}× the assumption`,
    status: !Number.isFinite(worstV1)
      ? 'N/A'
      : worstV1 > THRESHOLDS.landmarkNoiseFactor * SYNTHETIC_LANDMARK_SIGMA_PCT
        ? 'BREAK'
        : 'HOLD',
  })

  // B2 — the nail set moves DIP / PIP (Q2)
  const shifted = analysis.joints.filter(
    joint => joint.shiftChi2 > shiftChi2Threshold(joint.photos - 2) && joint.nailSetShift > THRESHOLDS.nailSetShiftPct,
  )
  const anyShift = analysis.joints.some(joint => Number.isFinite(joint.shiftChi2))
  criteria.push({
    id: 'B2',
    question: 'Q2',
    assumption: 'a nail set moves only TIP; DIP and PIP stay (Stage 9 §H)',
    measured: analysis.joints
      .map(joint => `${joint.joint}/${joint.view} ${f(joint.nailSetShift)}% (χ² ${f(joint.shiftChi2, 1)} / ${f(shiftChi2Threshold(joint.photos - 2), 1)})`)
      .join(', '),
    rule: `BREAK if any |shift| > ${THRESHOLDS.nailSetShiftPct}% AND χ² over its F(2, n−2) limit (p < 0.05/4)`,
    status: !anyShift ? 'N/A' : shifted.length ? 'BREAK' : 'HOLD',
  })

  // B3 — pose (Q4)
  const poseLimit = THRESHOLDS.poseScatterFactor * expected.poseMedianDeg.median
  criteria.push({
    id: 'B3',
    question: 'Q4',
    assumption: 'H1 + palmRigid recovers the relative pose as well as in synthetic (Stage 7)',
    measured: `refusals ${f(analysis.pose.refusalRate * 100, 0)}%, median deviation ${f(analysis.pose.acrossSessionsMedianDeg)}° (synthetic ${f(expected.poseMedianDeg.median)}°)`,
    rule: `BREAK if refusals > ${THRESHOLDS.poseRefusalRate * 100}% or scatter > ${THRESHOLDS.poseScatterFactor}× synthetic`,
    // A comparison with an unknown (NaN) limit is not a pass: it is N/A.
    status: !Number.isFinite(analysis.pose.refusalRate)
      ? 'N/A'
      : analysis.pose.refusalRate > THRESHOLDS.poseRefusalRate
        ? 'BREAK'
        : !Number.isFinite(poseLimit) || !Number.isFinite(analysis.pose.acrossSessionsMedianDeg)
          ? 'N/A'
          : analysis.pose.acrossSessionsMedianDeg > poseLimit
            ? 'BREAK'
            : 'HOLD',
  })

  // B4 — origin repeatability vs the synthetic model at the measured noise (Q4)
  const frame = (name: Stage10Frame) => analysis.frames.find(entry => entry.frame === name)!
  const over = (['F0', 'F3dNoTip'] as const).filter(
    name => frame(name).m1Pooled > THRESHOLDS.repeatabilityFactor * expected.m1[name].median,
  )
  criteria.push({
    id: 'B4',
    question: 'Q4',
    assumption: 'the synthetic error model explains the real scatter at the measured noise',
    measured: (['F0', 'F3dNoTip'] as const)
      .map(name => `${name} M1 ${f(frame(name).m1Pooled)}% (synthetic ${f(expected.m1[name].median)}%)`)
      .join(', '),
    rule: `BREAK if either > ${THRESHOLDS.repeatabilityFactor}× synthetic median`,
    status: (['F0', 'F3dNoTip'] as const).some(
      name => !Number.isFinite(frame(name).m1Pooled) || !Number.isFinite(expected.m1[name].median),
    )
      ? 'N/A'
      : over.length
        ? 'BREAK'
        : 'HOLD',
  })

  // B5 — F3dNoTip against F0 (Q3)
  const ratio = frame('F3dNoTip').m1Pooled / frame('F0').m1Pooled
  const m6Known = Number.isFinite(frame('F3dNoTip').m6) && Number.isFinite(frame('F3dNoTip').m6Chance)
  const moves = m6Known && frame('F3dNoTip').m6 > THRESHOLDS.m6ChanceFactor * frame('F3dNoTip').m6Chance
  criteria.push({
    id: 'B5',
    question: 'Q3',
    assumption: 'F3dNoTip is steadier than F0 and does not move with the nail set (Stage 9)',
    measured: `M1 ratio ${f(ratio)} (synthetic median ${f(expected.ratio.median)}, p90 ${f(expected.ratio.p90)}); F3dNoTip M6 ${f(frame('F3dNoTip').m6)}% vs chance ${f(frame('F3dNoTip').m6Chance)}%`,
    rule: `BREAK if ratio ≥ ${THRESHOLDS.frameRatio} or M6 > ${THRESHOLDS.m6ChanceFactor}× chance; WEAKENED if ratio > synthetic p90`,
    status: !Number.isFinite(ratio)
      ? 'N/A'
      : ratio >= THRESHOLDS.frameRatio || moves
        ? 'BREAK'
        : !m6Known || !Number.isFinite(expected.ratio.p90)
          ? 'N/A'
          : ratio > expected.ratio.p90
            ? 'WEAKENED'
            : 'HOLD',
  })

  // B6 — DIP posture held by the capture UX (Q4)
  const gapLimit = Math.max(THRESHOLDS.axisGapDeg, THRESHOLDS.axisGapFactor * expected.axisGapSdDeg.median)
  criteria.push({
    id: 'B6',
    question: 'Q4',
    assumption: 'the DIP angle repeats under the capture instructions (F3dNoTip holds it at calibration)',
    measured: `F3d − F3dNoTip axis gap SD ${f(analysis.axisGap.sdDeg)}° (synthetic ${f(expected.axisGapSdDeg.median)}°)`,
    rule: `BREAK if > ${f(gapLimit, 1)}° (max of ${THRESHOLDS.axisGapDeg}° and ${THRESHOLDS.axisGapFactor}× synthetic)`,
    status:
      !Number.isFinite(analysis.axisGap.sdDeg) || !Number.isFinite(gapLimit)
        ? 'N/A'
        : analysis.axisGap.sdDeg > gapLimit
          ? 'BREAK'
          : 'HOLD',
  })

  // B7 — the origin budget closes (Q5)
  const shares = analysis.attribution.find(entry => entry.frame === 'F3dNoTip')!
  criteria.push({
    id: 'B7',
    question: 'Q5',
    assumption: 'with the cuticle marked by hand, the origin scatter is landmarks + annotation + pose (Stage 8/9)',
    measured: `F3dNoTip variance removed by a perfect DIP/PIP ${f(shares.pipDipDetector * 100, 0)}%, cuticle ${f(shares.cuticleAnnotation * 100, 0)}%, pose ${f(shares.pose * 100, 0)}%; left with all three perfect ${f(shares.remainder * 100, 0)}% (synthetic ${f(expected.remainder.median * 100, 0)}%)`,
    rule: `BREAK if more than ${THRESHOLDS.remainderShare * 100}% is left`,
    status: !Number.isFinite(shares.remainder) ? 'N/A' : shares.remainder > THRESHOLDS.remainderShare ? 'BREAK' : 'HOLD',
  })

  // The single bottleneck, by the rule fixed in advance.
  const status = (id: Criterion['id']) => criteria.find(criterion => criterion.id === id)!.status
  let bottleneck: Verdict['bottleneck']
  if (status('B3') === 'BREAK') {
    bottleneck = { name: 'pose (H1 + palmRigid)', reason: 'B3 broke; every frame and socket number rides on the pose', conclusive: true }
  } else if (status('B2') === 'BREAK') {
    bottleneck = {
      name: 'nail-set-dependent DIP/PIP detection',
      reason: `B2 broke (${shifted.map(joint => `${joint.joint}/${joint.view}`).join(', ')}); F3dNoTip reads both, so the product invariant fails`,
      conclusive: true,
    }
  } else if (status('B6') === 'BREAK') {
    // Before the attribution: a posture change between sessions also moves
    // the annotator's skin creases against Vision's joints, which the
    // substitution would misread as detector noise.
    bottleneck = {
      name: 'DIP posture between sessions (capture UX)',
      reason: 'B6 broke; F3dNoTip holds the DIP at its calibrated angle, so a finger that bends differently each time moves the socket',
      conclusive: true,
    }
  } else {
    const ranked = (
      [
        ['indexDIP / indexPIP detection', shares.pipDipDetector],
        ['cuticle annotation', shares.cuticleAnnotation],
        ['pose estimate', shares.pose],
        ['what is left — outside the synthetic model (perspective, palm landmarks, lift)', shares.remainder],
      ] as [string, number][]
    )
      .filter(([, share]) => Number.isFinite(share))
      .sort((a, b) => b[1] - a[1])
    const [first, second] = ranked
    const conclusive = !second || first[1] >= 1.5 * Math.max(second[1], 1e-9)
    bottleneck = {
      name: first ? first[0] : 'n/a',
      reason: first
        ? `removes the most of F3dNoTip's origin variance if made perfect (${f(first[1] * 100, 0)}%${second ? `; next ${second[0]} ${f(second[1] * 100, 0)}%` : ''})`
        : 'no attribution available',
      conclusive,
    }
  }
  return { criteria, bottleneck }
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
  const row = (cells: (string | number)[]) => `| ${cells.map(cell => (typeof cell === 'number' ? f(cell) : cell)).join(' | ')} |`
  lines.push(`# ${header.title}`, '')
  lines.push(`kit v${analysis.kitVersion}${header.kitCommit ? ` @ ${header.kitCommit}` : ''} · R = repeatability, C = consistency of two routes on one photo, S = shift between conditions. Nothing here is accuracy: there is no 3D truth.`, '')
  if (header.conditions) lines.push('```json', JSON.stringify(header.conditions, null, 2), '```', '')
  lines.push(`Calibration frames ${analysis.counts.calibration}, captures ${analysis.counts.captures}, annotated pairs ${analysis.counts.annotatedPairs}, poses accepted ${analysis.counts.posesAccepted}. H1 stretch ${f(analysis.calibration.stretch ?? Number.NaN, 3)} ± ${f(analysis.calibration.stretchSe, 3)}. Bed length V1 ${f(analysis.bedLengthPx.V1, 0)} px, V2 ${f(analysis.bedLengthPx.V2, 0)} px.`, '')
  if (analysis.problems.length) lines.push('**Problems:**', ...analysis.problems.map(problem => `- ${problem}`), '')

  lines.push('## Verdict', '', row(['', 'question', 'synthetic assumption', 'measured', 'rule', 'status']), row(['---', '---', '---', '---', '---', '---']))
  for (const criterion of verdict.criteria) {
    lines.push(row([criterion.id, criterion.question, criterion.assumption, criterion.measured, criterion.rule, `**${criterion.status}**`]))
  }
  lines.push('', `**Bottleneck: ${verdict.bottleneck.name}** — ${verdict.bottleneck.reason}${verdict.bottleneck.conclusive ? '' : ' (INCONCLUSIVE: the top two are within 1.5×)'}`, '')

  lines.push('## Q1/Q2 — landmarks, Vision against the annotator on the same photo (% bed length)', '')
  lines.push(row(['joint', 'view', 'C offset along/across', 'C annotator', 'R detector', 'R shot floor', 'S nail set (along/across)', 'χ²']), row(['---', '---', '---', '---', '---', '---', '---', '---']))
  for (const joint of analysis.joints) {
    lines.push(row([joint.joint, joint.view, `${f(joint.offsetAlong)} / ${f(joint.offsetAcross)}`, joint.sdAnnotator, joint.sdDetector, joint.sdShotFloor, `${f(joint.shiftAlong)} / ${f(joint.shiftAcross)}`, f(joint.shiftChi2, 1)]))
  }
  lines.push('', 'TIP (Vision\'s fingertip beyond the annotator\'s DIP crease, % bed length):', '')
  for (const view of ['V1', 'V2'] as const) {
    const reach = analysis.tipReach[view]
    lines.push(`- ${view}: N0 ${f(reach.n0)}, N1 ${f(reach.n1)}, shift ${f(reach.shift)} ± ${f(reach.shiftSe)}`)
  }

  lines.push('', '## Q3/Q4 — frames and socket (% bed length)', '')
  lines.push(row(['frame', 'R M1 N0', 'R M1 N1', 'R M1 pooled', 'synthetic M1 (median)', 'S M6', 'M6 by chance', 'full socket M0 / M1 / M2° / M3° / M4%']), row(['---', '---', '---', '---', '---', '---', '---', '---']))
  for (const entry of analysis.frames) {
    const synthetic = entry.frame === 'F0' || entry.frame === 'F3dNoTip' ? f(expected.m1[entry.frame].median) : '—'
    const socket = entry.socket ? `${f(entry.socket.m0, 3)} / ${f(entry.socket.m1)} / ${f(entry.socket.m2)} / ${f(entry.socket.m3)} / ${f(entry.socket.m4)}` : 'n/a'
    lines.push(row([entry.frame, entry.m1.N0, entry.m1.N1, entry.m1Pooled, synthetic, entry.m6, entry.m6Chance, socket]))
  }
  lines.push('', `Pose: refusals ${f(analysis.pose.refusalRate * 100, 0)}%, deviation from the rig mean median ${f(analysis.pose.acrossSessionsMedianDeg)}° / p95 ${f(analysis.pose.acrossSessionsP95Deg)}°, shot floor ${f(analysis.pose.shotFloorMedianDeg)}°, profile mismatch ${f(analysis.pose.mismatchMedianPx)} px. Axis gap F3d − F3dNoTip: median ${f(analysis.axisGap.medianDeg)}°, SD ${f(analysis.axisGap.sdDeg)}°.`)

  lines.push('', '## Q5 — where the origin scatter comes from', '')
  lines.push('Counterfactuals on the same captures: the fraction of the origin variance removed if ONE input were noise-free (not additive — the palm points feed both the pose and the palm fit), and the fraction left when all three are noise-free together.', '')
  lines.push(row(['frame', 'captures', 'variance %²', 'perfect DIP/PIP', 'perfect cuticle', 'perfect pose', 'left with all three']), row(['---', '---', '---', '---', '---', '---', '---']))
  for (const entry of analysis.attribution) {
    lines.push(row([entry.frame, String(entry.captures), entry.total, `${f(entry.pipDipDetector * 100, 0)}%`, `${f(entry.cuticleAnnotation * 100, 0)}%`, `${f(entry.pose * 100, 0)}%`, `${f(entry.remainder * 100, 0)}%`]))
  }
  lines.push('', `Synthetic expectation: ${expected.datasets} simulated datasets of this protocol at detector ${f(expected.noise.detectorPct)}% / annotator ${f(expected.noise.annotatorPct)}% per axis.`)
  return `${lines.join('\n')}\n`
}
