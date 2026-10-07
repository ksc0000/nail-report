// Stage 10 — run the frozen analysis on a capture folder.
//
//   node --experimental-strip-types research/stage10/analyze.ts <data-dir>
//   node --experimental-strip-types research/stage10/analyze.ts <data-dir> --smoke
//   node --experimental-strip-types research/stage10/analyze.ts --dry-run
//
// <data-dir> holds obs/*.json (one Layer A per photo, from vision-dump.swift),
// annotations.csv and, optionally, conditions.json. The report is written to
// <data-dir>/report.md and report.json. Photos are never read: only numbers.
//
// --smoke (Stage 10A) runs every stage of the same frozen analysis on a few
// photos but evaluates no criterion and writes no metric: smoke-report.md/json
// say only which stage each capture reached.
//
// --dry-run analyses a synthetic stand-in in the same format. It checks the
// pipeline; it is NOT evidence and its report says so on the first line.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { dryRunDataset } from '../../tests/support/stage10DryRun.ts'
import { evaluateCriteria, measuredNoise, renderReport, simulateExpectation } from './criteria.ts'
import { analyzeStage10, parseAnnotationCsv } from './kit.ts'
import { renderSmokeReport, smokeReach } from './smoke.ts'

const FROZEN_PATHS = ['research/stage10', 'src/lib', 'tests/support']

/**
 * The last commit that changed the analysis or the code it calls — not HEAD,
 * which will be a data commit — so a report shows which frozen analysis
 * produced it, and an analysis changed after the data shows up as a later one.
 */
const kitCommit = (): string | undefined => {
  try {
    const commit = execFileSync('git', ['log', '-1', '--format=%h %cs', '--', ...FROZEN_PATHS, ':!research/stage10/data'], {
      encoding: 'utf8',
    }).trim()
    const dirty = execFileSync('git', ['status', '--porcelain', '--', ...FROZEN_PATHS], { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.trim() && !line.includes('/data/'))
    return dirty.length ? `${commit} + UNCOMMITTED CHANGES to the analysis (not the pre-registered kit)` : commit
  } catch {
    return undefined
  }
}

const parseAll = (raw: Record<string, unknown>): { observations: Map<string, ScanObservation>; errors: string[] } => {
  const observations = new Map<string, ScanObservation>()
  const errors: string[] = []
  for (const [name, value] of Object.entries(raw)) {
    // vision-dump.swift keeps Vision's own left/right call beside the declared hand.
    const chirality = (value as { visionChirality?: unknown }).visionChirality
    if (chirality === 'left') errors.push(`${name}: Vision saw a LEFT hand; the protocol and the H1 template are right-handed`)
    const parsed = parseScanObservation(value)
    if (parsed.ok) observations.set(parsed.value.captureId, parsed.value)
    else errors.push(`${name}: ${parsed.errors.join('; ')}`)
  }
  return { observations, errors }
}

const main = () => {
  const args = process.argv.slice(2)
  const smoke = args.includes('--smoke')
  const argument = args.find(arg => arg !== '--smoke')
  if (!argument) {
    process.stderr.write('usage: analyze.ts <data-dir> [--smoke] | --dry-run\n')
    process.exit(2)
  }
  const ioProblems: string[] = []

  let rawObservations: Record<string, unknown>
  let annotationsCsv: string
  let conditions: Record<string, unknown> | undefined
  let outDir: string | null = null
  let title: string

  if (argument === '--dry-run') {
    const dataset = dryRunDataset()
    rawObservations = JSON.parse(JSON.stringify(dataset.observations)) as Record<string, unknown>
    annotationsCsv = dataset.annotationsCsv
    conditions = dataset.conditions
    title = 'Stage 10 — DRY RUN on synthetic data (pipeline check, NOT evidence)'
  } else {
    const obsDir = path.join(argument, 'obs')
    if (!existsSync(obsDir)) {
      process.stderr.write(`${obsDir} not found: run vision-dump.swift into <data-dir>/obs first\n`)
      process.exit(2)
    }
    rawObservations = {}
    for (const file of readdirSync(obsDir).filter(name => name.endsWith('.json'))) {
      try {
        rawObservations[file] = JSON.parse(readFileSync(path.join(obsDir, file), 'utf8')) as unknown
      } catch (error) {
        ioProblems.push(`obs/${file}: not valid JSON (${String(error)})`)
      }
    }
    const csvPath = path.join(argument, 'annotations.csv')
    annotationsCsv = existsSync(csvPath) ? readFileSync(csvPath, 'utf8') : ''
    if (!existsSync(csvPath)) ioProblems.push('annotations.csv not found: nothing is annotated')
    const conditionsPath = path.join(argument, 'conditions.json')
    try {
      conditions = existsSync(conditionsPath) ? (JSON.parse(readFileSync(conditionsPath, 'utf8')) as Record<string, unknown>) : undefined
    } catch (error) {
      ioProblems.push(`conditions.json: not valid JSON (${String(error)})`)
    }
    outDir = argument
    title = smoke
      ? `Stage 10A smoke run: ${path.basename(path.resolve(argument))}`
      : `Stage 10 — real-photo PoC: ${path.basename(path.resolve(argument))}`
  }

  const { observations, errors } = parseAll(rawObservations)
  const annotations = annotationsCsv ? parseAnnotationCsv(annotationsCsv) : { rows: [], errors: [] }
  const analysis = analyzeStage10({ observations, annotations: annotations.rows })
  analysis.problems.unshift(...ioProblems, ...errors.map(error => `Layer A rejected: ${error}`), ...annotations.errors)

  if (smoke && outDir) {
    // Stage 10A: every stage of the frozen analysis has run above; no
    // criterion is evaluated and only how far each capture got is written.
    const reach = smokeReach(analysis)
    const report = renderSmokeReport(reach, { title, kitCommit: kitCommit() })
    writeFileSync(path.join(outDir, 'smoke-report.md'), report)
    writeFileSync(path.join(outDir, 'smoke-report.json'), `${JSON.stringify({ reach }, null, 2)}\n`)
    process.stdout.write(report)
    return
  }

  const expected = simulateExpectation(measuredNoise(analysis))
  const verdict = evaluateCriteria(analysis, expected)
  const report = renderReport(analysis, expected, verdict, { title, kitCommit: kitCommit(), conditions })

  if (outDir) {
    writeFileSync(path.join(outDir, 'report.md'), report)
    writeFileSync(path.join(outDir, 'report.json'), `${JSON.stringify({ analysis, expected, verdict }, null, 2)}\n`)
    process.stdout.write(`wrote ${path.join(outDir, 'report.md')} and report.json\n`)
  }
  process.stdout.write(report)
}

main()
