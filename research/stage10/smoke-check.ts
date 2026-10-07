// Stage 10A — run the capture-pipeline smoke check on a few real photos.
//
//   node --experimental-strip-types research/stage10/smoke-check.ts <data-dir> <upright-dir>
//
// <data-dir> is the smoke folder (obs/*.json from vision-dump.swift,
// annotations.csv, blind/key.json and annotations-blind.csv from the blind
// DIP / PIP path, conditions.json); <upright-dir> holds the --upright copies.
// Writes <data-dir>/smoke-check.md, runs the frozen analyzer in --smoke mode
// (which writes smoke-report.md/json), and draws <upright-dir>/<id>.overlay.svg
// for the by-eye check. Exits 1 if any check FAILs. Plumbing only: see smoke.ts.

import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import type { BlindKey } from './blind.ts'
import { parseAnnotationCsv } from './kit.ts'
import { IMAGE_EXTENSIONS, jpegSize, overlaySvg, renderSmokeChecks, smokeChecks } from './smoke.ts'
import type { SmokeReach } from './smoke.ts'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')

const git = (args: string[]): string => {
  try {
    return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' })
  } catch {
    return ''
  }
}

const main = () => {
  const [dataDir, uprightDir] = process.argv.slice(2)
  if (!dataDir || !uprightDir) {
    process.stderr.write('usage: smoke-check.ts <data-dir> <upright-dir>\n')
    process.exit(2)
  }

  const obsDir = path.join(dataDir, 'obs')
  const observations: Record<string, unknown> = {}
  if (existsSync(obsDir)) {
    for (const file of readdirSync(obsDir).filter(name => name.endsWith('.json'))) {
      try {
        observations[file] = JSON.parse(readFileSync(path.join(obsDir, file), 'utf8')) as unknown
      } catch (error) {
        observations[file] = { invalidJson: String(error) }
      }
    }
  }

  const uprightSizes: Record<string, { width: number; height: number } | null> = {}
  const uprightFiles = new Map<string, string>()
  if (existsSync(uprightDir)) {
    for (const file of readdirSync(uprightDir).filter(name => /\.jpe?g$/i.test(name))) {
      const id = file.replace(/\.jpe?g$/i, '')
      uprightFiles.set(id, file)
      uprightSizes[id] = jpegSize(new Uint8Array(readFileSync(path.join(uprightDir, file))))
    }
  }

  const csvPath = path.join(dataDir, 'annotations.csv')
  const annotationsCsv = existsSync(csvPath) ? readFileSync(csvPath, 'utf8') : null
  const blindPath = path.join(dataDir, 'annotations-blind.csv')
  const blindCsv = existsSync(blindPath) ? readFileSync(blindPath, 'utf8') : null
  const readJson = <T>(file: string): T | null => {
    try {
      return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : null
    } catch {
      return null
    }
  }
  const blindKey = readJson<BlindKey>(path.join(dataDir, 'blind', 'key.json'))
  const conditions = readJson<Record<string, unknown>>(path.join(dataDir, 'conditions.json'))

  const trackedImages = git(['ls-files', '--', 'research']).split('\n').filter(file => IMAGE_EXTENSIONS.test(file))
  const addableImages = git(['status', '--porcelain', '--untracked-files=all'])
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.slice(3).split(' -> ').pop()!.replace(/^"|"$/g, ''))
    .filter(file => IMAGE_EXTENSIONS.test(file))

  // The frozen analyzer, run exactly as Stage 10B will run it, in --smoke mode.
  const run = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', path.join(here, 'analyze.ts'), dataDir, '--smoke'], {
    encoding: 'utf8',
  })
  const reportPath = path.join(dataDir, 'smoke-report.json')
  let reach: SmokeReach | undefined
  if (run.status === 0 && existsSync(reportPath)) {
    reach = (JSON.parse(readFileSync(reportPath, 'utf8')) as { reach: SmokeReach }).reach
  }

  const checks = smokeChecks({
    observations,
    uprightSizes: existsSync(uprightDir) ? uprightSizes : null,
    annotationsCsv,
    trackedImages,
    addableImages,
    analyzer: { exitCode: run.status, message: (run.stderr || '').split('\n').slice(-6).join(' '), reach },
    blindKey,
    blindCsv,
    conditions,
  })

  const rows = [...(annotationsCsv ? parseAnnotationCsv(annotationsCsv).rows : []), ...(blindCsv ? parseAnnotationCsv(blindCsv).rows : [])]
  for (const value of Object.values(observations)) {
    const id = (value as { captureId?: unknown }).captureId
    if (typeof id !== 'string' || !uprightFiles.has(id)) continue
    writeFileSync(path.join(uprightDir, `${id}.overlay.svg`), overlaySvg(value, uprightFiles.get(id)!, rows.filter(row => row.captureId === id)))
  }

  const commit = git(['log', '-1', '--format=%h %cs', '--', 'research/stage10', 'src/lib', 'tests/support', ':!research/stage10/data']).trim()
  const markdown = renderSmokeChecks(checks, { dataDir, kitCommit: commit || undefined })
  writeFileSync(path.join(dataDir, 'smoke-check.md'), markdown)
  for (const check of checks) process.stdout.write(`${check.id} ${check.status.padEnd(4)} ${check.item}\n`)
  process.stdout.write(`\nwrote ${path.join(dataDir, 'smoke-check.md')}; overlays in ${uprightDir}\n`)
  process.exit(checks.some(check => check.status === 'FAIL') ? 1 : 0)
}

main()
