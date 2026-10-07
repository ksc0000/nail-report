// Stage 10 — blind DIP / PIP annotation, the operator's side (blind.ts has the rules).
//
//   node --experimental-strip-types research/stage10/blind-cli.ts plan <data-dir> <blind-dir> [--seed N]
//   swift research/stage10/blind-crops.swift <data-dir>/blind/key.json <upright-dir> <blind-dir>
//   ... mark indexDIP and indexPIP on <blind-dir>/pass1/*.jpg, in the order of pass1/order.txt,
//       into pass1/marks.csv (blindId,point,x,y, crop pixels); only then pass 2 the same way ...
//   node --experimental-strip-types research/stage10/blind-cli.ts merge <data-dir> <blind-dir>/pass1/marks.csv <blind-dir>/pass2/marks.csv
//
// `plan` writes the key to <data-dir>/blind/key.json — do not open it, or the
// data folder, while marking — and, per pass, order.txt and an empty
// marks.csv into <blind-dir> (outside the repository). `merge` opens the key
// and writes <data-dir>/annotations-blind.csv, which analyze.ts reads.

import { randomInt } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../../src/lib/nail3dObservation.ts'
import { mergeBlindMarks, parseBlindCsv, planBlindCrops, renderAnnotationCsv } from './blind.ts'
import type { BlindKey, BlindMark } from './blind.ts'
import { parseCaptureName } from './kit.ts'

function usage(): never {
  process.stderr.write(
    'usage: blind-cli.ts plan <data-dir> <blind-dir> [--seed N]\n       blind-cli.ts merge <data-dir> <marks.csv> [<marks.csv> ...]\n',
  )
  process.exit(2)
}

const [command, dataDir, ...rest] = process.argv.slice(2)
if (!command || !dataDir) usage()
const keyPath = path.join(dataDir, 'blind', 'key.json')

if (command === 'plan') {
  const blindDir = rest.find(arg => !arg.startsWith('--'))
  if (!blindDir) usage()
  const seedAt = rest.indexOf('--seed')
  const seed = seedAt >= 0 ? Number(rest[seedAt + 1]) : randomInt(1, 2 ** 31 - 1)
  if (!Number.isInteger(seed)) usage()
  if (existsSync(keyPath)) {
    process.stderr.write(`${keyPath} exists: a second plan would give the annotator a second look at the same photos. Remove it only if nothing was marked yet.\n`)
    process.exit(1)
  }
  const obsDir = path.join(dataDir, 'obs')
  const photos: ScanObservation[] = []
  for (const file of readdirSync(obsDir).filter(name => name.endsWith('.json')).sort()) {
    const parsed = parseScanObservation(JSON.parse(readFileSync(path.join(obsDir, file), 'utf8')) as unknown)
    if (!parsed.ok) {
      process.stderr.write(`obs/${file}: ${parsed.errors.join('; ')}\n`)
      continue
    }
    // The photos DIP / PIP are marked on: shot 1 of every session, both views.
    if (parseCaptureName(parsed.value.captureId)?.shot === 1) photos.push(parsed.value)
  }
  const key = planBlindCrops(photos, { seed })
  mkdirSync(path.dirname(keyPath), { recursive: true })
  writeFileSync(keyPath, `${JSON.stringify(key, null, 2)}\n`)
  for (const pass of [1, 2] as const) {
    const dir = path.join(blindDir, `pass${pass}`)
    mkdirSync(dir, { recursive: true })
    const order = key.entries.filter(entry => entry.pass === pass).sort((a, b) => a.order - b.order)
    writeFileSync(path.join(dir, 'order.txt'), `${order.map(entry => entry.blindId).join('\n')}\n`)
    writeFileSync(path.join(dir, 'marks.csv'), 'blindId,point,x,y\n')
  }
  for (const entry of key.unplanned) process.stderr.write(`not planned: ${entry}\n`)
  process.stdout.write(
    `planned ${key.entries.length} crops (${photos.length} photos x 2 passes); key in ${keyPath} — keep it closed.\n` +
      `next: swift research/stage10/blind-crops.swift ${keyPath} <upright-dir> ${blindDir}\n`,
  )
} else if (command === 'merge') {
  if (!rest.length) usage()
  const key = JSON.parse(readFileSync(keyPath, 'utf8')) as BlindKey
  const marks: BlindMark[] = []
  const errors: string[] = []
  for (const file of rest) {
    const parsed = parseBlindCsv(readFileSync(file, 'utf8'))
    marks.push(...parsed.rows)
    errors.push(...parsed.errors.map(error => `${file}: ${error}`))
  }
  const seen = new Set<string>()
  for (const mark of marks) {
    if (seen.has(`${mark.blindId}|${mark.point}`)) errors.push(`${mark.blindId} ${mark.point}: marked in two files`)
    seen.add(`${mark.blindId}|${mark.point}`)
  }
  const merged = mergeBlindMarks(key, marks)
  errors.push(...merged.errors)
  for (const entry of merged.unmarked) process.stderr.write(`unmarked (stays missing, never guessed): ${entry}\n`)
  if (errors.length) {
    for (const error of errors) process.stderr.write(`error: ${error}\n`)
    process.stderr.write('nothing written: fix the marks and merge again\n')
    process.exit(1)
  }
  const out = path.join(dataDir, 'annotations-blind.csv')
  writeFileSync(out, renderAnnotationCsv(merged.rows))
  process.stdout.write(`wrote ${merged.rows.length} DIP / PIP marks to ${out}\n`)
} else usage()
