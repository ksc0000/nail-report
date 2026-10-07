// Stage 10A — the capture-pipeline smoke check (kit v2 gate), checked before any real photo.
//
// research/stage10/smoke.ts is what tells us, on a few real photos, whether
// the numbers land where they should: orientation, mirroring, coordinate
// frames, labels, parsing, the frozen analyzer in BOTH conditions, the
// return-to-V1 transfer, the blind DIP / PIP path, the capture record, git.
// These tests feed it the synthetic stand-in in the exact on-disk format —
// DIP / PIP going through the real blind plan and back — and then break one
// hand-off at a time; each break must be caught by the check meant for it,
// and only by that one. Nothing here measures anything about hands.

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { mergeBlindMarks, planBlindCrops, renderAnnotationCsv, toCrop } from '../research/stage10/blind.ts'
import type { BlindKey, BlindMark } from '../research/stage10/blind.ts'
import { STAGE10_SCHEDULE, analyzeStage10, parseAnnotationCsv, parseCaptureName } from '../research/stage10/kit.ts'
import type { Stage10Analysis } from '../research/stage10/kit.ts'
import { evaluateCriteria, measuredNoise, simulateExpectation } from '../research/stage10/criteria.ts'
import { NEGATIVE_CONTROL_PREFIX, handednessSign, jpegSize, smokeChecks, smokeReach } from '../research/stage10/smoke.ts'
import type { SmokeCheck, SmokeInput } from '../research/stage10/smoke.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { dryRunDataset } from './support/stage10DryRun.ts'

/** The Stage 10A set: two calibration frames, S1 (N0) with the unmoved repeat, S2 (N1), each with its return to V1. */
const KEEP = [
  'CAL-01',
  'CAL-02',
  'S1-N0-V1-1',
  'S1-N0-V1-2',
  'S1-N0-V2-1',
  'S1-N0-V2-2',
  'S1-N0-V1-3',
  'S2-N1-V1-1',
  'S2-N1-V2-1',
  'S2-N1-V1-3',
]
const MIRROR = `${NEGATIVE_CONTROL_PREFIX}S1-N0-V1-1`
const LENS = { model: 'iPhone back camera 6.86mm f/2.8', focalLength35mm: 77 }

type Raw = ScanObservation & Record<string, unknown>

interface SmokeData {
  observations: Record<string, Raw>
  /** Cuticle and free edge, marked on the upright copies. */
  annotationsCsv: string
  blindKey: BlindKey
  /** DIP / PIP, marked on the blind crops and mapped back. */
  blindCsv: string
  conditions: Record<string, unknown>
}

const parsed = (raw: Raw): ScanObservation => {
  const result = parseScanObservation(JSON.parse(JSON.stringify(raw)))
  assert.ok(result.ok)
  return result.value
}

/** A few photos' worth of the stand-in, as vision-dump.swift would write them, plus a deliberate mirror image. */
const smokeData = (options: { without?: string[]; returnShiftPx?: number; passes?: (1 | 2)[] } = {}): SmokeData => {
  const dataset = dryRunDataset({ seed: 11, returnToV1: { fingerShiftPx: options.returnShiftPx ?? 0 } })
  const keep = KEEP.filter(id => !options.without?.some(prefix => id.startsWith(prefix)))
  const observations: Record<string, Raw> = {}
  for (const id of keep) {
    const raw = JSON.parse(JSON.stringify(dataset.observations[id])) as Raw
    observations[`${id}.json`] = {
      ...raw,
      // The README has S2 shot with the phone held the other way, so the photos carry two EXIF orientations.
      image: { ...raw.image, exifOrientation: id.startsWith('S2-') ? 1 : 6 },
      visionChirality: 'right',
      landmarkModel: { provider: 'vision', request: 'VNDetectHumanHandPoseRequest', revision: 1 },
      capturedAtLocal: dataset.capturedAt[id],
      lens: LENS,
    }
  }
  if (observations['S1-N0-V1-1.json']) {
    observations[`${MIRROR}.json`] = mirrored({ ...observations['S1-N0-V1-1.json'], captureId: MIRROR, sessionId: MIRROR })
  }
  const rows = parseAnnotationCsv(dataset.annotationsCsv).rows.filter(row => keep.includes(row.captureId))
  // DIP / PIP go through the blind path: planned crops, the creases marked in crop pixels, mapped back.
  const shot1 = keep.filter(id => parseCaptureName(id)?.shot === 1).map(id => parsed(observations[`${id}.json`]))
  const blindKey = planBlindCrops(shot1, { seed: 5, passes: options.passes })
  const marks: BlindMark[] = blindKey.entries.flatMap(entry =>
    (['indexDIP', 'indexPIP'] as const).flatMap(point => {
      const row = rows.find(r => r.captureId === entry.captureId && r.pass === entry.pass && r.point === point)
      if (!row) return []
      const [x, y] = toCrop(entry.crop, row.x, row.y)
      return [{ blindId: entry.blindId, point, x, y }]
    }),
  )
  const merged = mergeBlindMarks(blindKey, marks)
  assert.deepEqual(merged.errors, [])
  return {
    observations,
    annotationsCsv: renderAnnotationCsv(rows.filter(row => row.point !== 'indexDIP' && row.point !== 'indexPIP')),
    blindKey,
    blindCsv: renderAnnotationCsv(merged.rows),
    conditions: dataset.conditions,
  }
}

const mirrored = (raw: Raw): Raw => ({
  ...raw,
  landmarks: raw.landmarks.map(l => (l.x === null ? l : { ...l, x: raw.image.width - l.x })),
})

const sizesOf = (observations: Record<string, Raw>) =>
  Object.fromEntries(Object.values(observations).map(raw => [raw.captureId, { width: raw.image.width, height: raw.image.height }]))

/** The frozen analyzer as analyze.ts --smoke runs it: both annotation files, capture times, the first two scheduled sessions. */
const analyse = (data: SmokeData): Stage10Analysis => {
  const observations = new Map<string, ScanObservation>()
  const capturedAt = new Map<string, string>()
  for (const raw of Object.values(data.observations)) {
    const result = parseScanObservation(JSON.parse(JSON.stringify(raw)))
    if (result.ok) observations.set(result.value.captureId, result.value)
    if (typeof raw.capturedAtLocal === 'string') capturedAt.set(raw.captureId, raw.capturedAtLocal)
  }
  const annotations = [...parseAnnotationCsv(data.annotationsCsv).rows, ...parseAnnotationCsv(data.blindCsv).rows]
  return analyzeStage10({ observations, annotations, capturedAt, schedule: STAGE10_SCHEDULE.slice(0, 2) })
}

const input = (overrides: Partial<SmokeInput> = {}, data = smokeData()): SmokeInput => ({
  observations: data.observations,
  uprightSizes: sizesOf(data.observations),
  annotationsCsv: data.annotationsCsv,
  blindKey: data.blindKey,
  blindCsv: data.blindCsv,
  conditions: data.conditions,
  trackedImages: [],
  addableImages: [],
  analyzer: { exitCode: 0, reach: smokeReach(analyse(data)) },
  ...overrides,
})

const byId = (checks: SmokeCheck[]) => Object.fromEntries(checks.map(check => [check.id, check]))
/** Every check's status, so a test can assert that ONLY the intended one changed. */
const statuses = (checks: SmokeCheck[]) => Object.fromEntries(checks.map(check => [check.id, check.status]))
const CLEAN = {
  S1: 'PASS',
  S2: 'PASS',
  S3: 'LOOK',
  S4: 'PASS',
  S5: 'PASS',
  S6: 'PASS',
  S7: 'PASS',
  S8: 'PASS',
  S9: 'PASS',
  S10: 'LOOK',
  S11: 'PASS',
}
const failsOnly = (checks: SmokeCheck[], id: keyof typeof CLEAN) =>
  assert.deepEqual(statuses(checks), { ...CLEAN, [id]: 'FAIL' }, JSON.stringify(byId(checks)[id].details))
const details = (checks: SmokeCheck[], id: keyof typeof CLEAN) => byId(checks)[id].details.join(' | ')

/** A JPEG that is only headers: SOI, an EXIF-like APP1, a baseline frame header, EOI. */
const jpegHeader = (width: number, height: number, sof = 0xc0) =>
  new Uint8Array([
    0xff, 0xd8,
    0xff, 0xe1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
    0xff, sof, 0x00, 0x11, 0x08, height >> 8, height & 0xff, width >> 8, width & 0xff,
    0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xff, 0xd9,
  ])

// ---------------------------------------------------------------------------

test('jpegSize reads the frame header past other segments, baseline or progressive', () => {
  assert.deepEqual(jpegSize(jpegHeader(3024, 4032)), { width: 3024, height: 4032 })
  assert.deepEqual(jpegSize(jpegHeader(5712, 4284, 0xc2)), { width: 5712, height: 4284 })
  assert.equal(jpegSize(new Uint8Array([0x89, 0x50, 0x4e, 0x47])), null)
})

test('the handedness sign is positive for the right hand seen from its back, and a mirror flips it', () => {
  const { observations } = smokeData()
  for (const id of KEEP) assert.equal(handednessSign(observations[`${id}.json`]), 1, id)
  assert.equal(handednessSign(observations[`${MIRROR}.json`]), -1)
})

test('clean data: every check passes in both conditions; the mirror is caught; overlays and crops are left for the eye', () => {
  const checks = smokeChecks(input())
  assert.deepEqual(statuses(checks), CLEAN, JSON.stringify(checks.filter(c => c.status === 'FAIL')))
  assert.ok(byId(checks).S2.details.some(detail => detail.includes('negative control detected as mirrored')))
  assert.match(details(checks, 'S10'), /the nail and any tip must not/)
  assert.match(details(checks, 'S4'), /\(N0\) and .* \(N1\) PIP–DIP lengths past the DIP crease/)
})

// --- one broken hand-off at a time ------------------------------------------

test('orientation applied in the JSON but not the upright copy: S2 sees the quarter turn', () => {
  const data = smokeData()
  const sizes = sizesOf(data.observations)
  sizes['S1-N0-V2-1'] = { width: sizes['S1-N0-V2-1'].height, height: sizes['S1-N0-V2-1'].width }
  const checks = smokeChecks(input({ uprightSizes: sizes }, data))
  failsOnly(checks, 'S2')
  assert.match(details(checks, 'S2'), /quarter turn/)
})

test('a mirrored photo, a left hand, or a mirror control that is not mirrored: S2', () => {
  const flipped = smokeData()
  flipped.observations['S2-N1-V1-1.json'] = mirrored(flipped.observations['S2-N1-V1-1.json'])
  // The annotations still describe the unmirrored image, so S4 (and the transfer, S9) fail too: all are right to.
  assert.equal(byId(smokeChecks(input({}, flipped))).S2.status, 'FAIL')

  const left = smokeData()
  left.observations['S1-N0-V1-2.json'] = { ...left.observations['S1-N0-V1-2.json'], visionChirality: 'left' }
  failsOnly(smokeChecks(input({}, left)), 'S2')

  const missed = smokeData()
  missed.observations[`${MIRROR}.json`] = { ...missed.observations['S1-N0-V1-1.json'], captureId: MIRROR, sessionId: MIRROR }
  const checks = smokeChecks(input({}, missed))
  failsOnly(checks, 'S2')
  assert.match(details(checks, 'S2'), /NOT detected/)
})

test('no mirror control, or no rotated photo: S2 has not been tested on these photos', () => {
  const noControl = smokeData()
  delete noControl.observations[`${MIRROR}.json`]
  const checks = smokeChecks(input({}, noControl))
  failsOnly(checks, 'S2')
  assert.match(details(checks, 'S2'), /unproven/)

  const upright = smokeData()
  for (const raw of Object.values(upright.observations)) raw.image = { ...raw.image, exifOrientation: 1 }
  const looks = smokeChecks(input({}, upright))
  assert.deepEqual(statuses(looks), { ...CLEAN, S2: 'LOOK' })
  assert.match(details(looks, 'S2'), /rotation path is not exercised/)
})

test('Vision coordinates in a different frame from the image: S3 (outside it) and S4 (labels no longer meet)', () => {
  const data = smokeData()
  const raw = data.observations['S1-N0-V2-1.json']
  data.observations['S1-N0-V2-1.json'] = { ...raw, landmarks: raw.landmarks.map(l => (l.x === null || l.y === null ? l : { ...l, x: l.y, y: l.x })) }
  const checks = byId(smokeChecks(input({}, data)))
  assert.equal(checks.S3.status, 'FAIL')
  assert.equal(checks.S4.status, 'FAIL')
})

test('annotation mistakes: blind DIP/PIP labels swapped, or cuticle sides swapped — S4 only', () => {
  const swapLabels = smokeData()
  swapLabels.blindCsv = swapLabels.blindCsv
    .replace(/S1-N0-V1-1,1,indexDIP/, 'S1-N0-V1-1,1,TMP')
    .replace(/S1-N0-V1-1,1,indexPIP/, 'S1-N0-V1-1,1,indexDIP')
    .replace(/S1-N0-V1-1,1,TMP/, 'S1-N0-V1-1,1,indexPIP')
  failsOnly(smokeChecks(input({}, swapLabels)), 'S4')

  const swapSides = smokeData()
  swapSides.annotationsCsv = swapSides.annotationsCsv
    .replace(/S1-N0-V2-1,1,cuticleSideA/, 'S1-N0-V2-1,1,TMP')
    .replace(/S1-N0-V2-1,1,cuticleSideB/, 'S1-N0-V2-1,1,cuticleSideA')
    .replace(/S1-N0-V2-1,1,TMP/, 'S1-N0-V2-1,1,cuticleSideB')
  const checks = smokeChecks(input({}, swapSides))
  failsOnly(checks, 'S4')
  assert.match(details(checks, 'S4'), /A and B swapped/)
})

test('Vision joint ids mapped wrong — DIP and TIP, or index and middle — S5', () => {
  const rename = (data: SmokeData, id: string, a: string, b: string) => {
    const raw = data.observations[`${id}.json`]
    data.observations[`${id}.json`] = {
      ...raw,
      landmarks: raw.landmarks.map(l => (l.name === a ? { ...l, name: b } : l.name === b ? { ...l, name: a } : l)),
    }
  }
  const tipDip = smokeData()
  rename(tipDip, 'CAL-02', 'indexDIP', 'indexTIP')
  assert.equal(byId(smokeChecks(input({}, tipDip))).S5.status, 'FAIL')

  const fingers = smokeData()
  rename(fingers, 'CAL-01', 'indexMCP', 'middleMCP')
  assert.equal(byId(smokeChecks(input({}, fingers))).S5.status, 'FAIL')
})

test('a joint Vision did not give, a JSON the parser rejects: S1 and S6', () => {
  const gap = smokeData()
  const raw = gap.observations['S1-N0-V1-2.json']
  gap.observations['S1-N0-V1-2.json'] = {
    ...raw,
    landmarks: raw.landmarks.map(l => (l.name === 'ringTIP' ? { ...l, x: null, y: null, confidence: null } : l)),
  }
  const checks = byId(smokeChecks(input({}, gap)))
  assert.equal(checks.S1.status, 'FAIL')
  assert.ok(checks.S1.details.some(detail => detail.includes('20/21')))

  const broken = smokeData()
  const { missing: _missing, ...withoutMissing } = broken.observations['CAL-02.json']
  void _missing
  broken.observations['CAL-02.json'] = withoutMissing as Raw
  assert.equal(byId(smokeChecks(input({}, broken))).S6.status, 'FAIL')
})

// --- S7: every path in BOTH conditions ----------------------------------------

test('the analyzer failing, or reading the data without reaching a frame: S7', () => {
  failsOnly(smokeChecks(input({ analyzer: { exitCode: 1, message: 'TypeError: boom' } })), 'S7')
  const data = smokeData()
  const withoutCalibration = { ...data, observations: Object.fromEntries(Object.entries(data.observations).filter(([file]) => !file.startsWith('CAL-'))) }
  const checks = smokeChecks(input({ analyzer: { exitCode: 0, reach: smokeReach(analyse(withoutCalibration)) } }, data))
  failsOnly(checks, 'S7')
  assert.match(details(checks, 'S7'), /no H1 profile/)
})

test('S7 does not pass on one condition: without the N1 session the N1 path and the N1 cuticle are missing', () => {
  const checks = smokeChecks(input({}, smokeData({ without: ['S2-'] })))
  // S2 also looks: without the sideways S2 photos only one EXIF orientation is left.
  assert.deepEqual(statuses(checks), { ...CLEAN, S2: 'LOOK', S7: 'FAIL' })
  assert.match(details(checks, 'S7'), /N1 path/)
  assert.match(details(checks, 'S7'), /N1 cuticle/)
})

test('S7 needs the N0 full socket: without the V2 free edge there is none', () => {
  const data = smokeData()
  data.annotationsCsv = data.annotationsCsv
    .split('\n')
    .filter(line => !(line.startsWith('S1-N0-V2-1,1,freeEdge')))
    .join('\n')
  const checks = smokeChecks(input({}, data))
  failsOnly(checks, 'S7')
  assert.match(details(checks, 'S7'), /N0 full socket/)
})

test('S7 needs the repeated annotation path; without pass 2 the blind path (S10) is incomplete too', () => {
  const data = smokeData({ passes: [1] })
  data.annotationsCsv = data.annotationsCsv
    .split('\n')
    .filter(line => !/,2,cuticleSide/.test(line))
    .join('\n')
  const checks = smokeChecks(input({}, data))
  assert.deepEqual(statuses(checks), { ...CLEAN, S7: 'FAIL', S10: 'FAIL' })
  assert.match(details(checks, 'S7'), /repeated annotation path/)
  assert.match(details(checks, 'S10'), /no pass-2 crop/)
})

// --- S9: the physical transfer --------------------------------------------------

test('S9: the finger moving before the return to V1 fails; a small move asks for a look; no return shot fails', () => {
  // The index finger slides along itself by 30 px (~8% of Vision's PIP–DIP) before V1 is shot again.
  const moved = smokeChecks(input({}, smokeData({ returnShiftPx: 30 })))
  failsOnly(moved, 'S9')
  assert.match(details(moved, 'S9'), /the finger moved against the palm/)
  // 17 px (~4.5%): between the pass and fail limits.
  assert.deepEqual(statuses(smokeChecks(input({}, smokeData({ returnShiftPx: 17 })))), { ...CLEAN, S9: 'LOOK' })
  // No return shot at all.
  const unchecked = smokeChecks(input({}, smokeData({ without: ['S1-N0-V1-3', 'S2-N1-V1-3'] })))
  failsOnly(unchecked, 'S9')
  assert.match(details(unchecked, 'S9'), /no return-to-V1 photo/)
})

test('S9: the whole picture shifted on return — the camera endpoint did not come back (or the whole hand moved) — asks for a look', () => {
  const data = smokeData()
  const raw = data.observations['S2-N1-V1-3.json']
  data.observations['S2-N1-V1-3.json'] = { ...raw, landmarks: raw.landmarks.map(l => (l.x === null || l.y === null ? l : { ...l, x: l.x + 40, y: l.y - 25 })) }
  const checks = smokeChecks(input({}, data))
  assert.deepEqual(statuses(checks), { ...CLEAN, S9: 'LOOK' })
  assert.match(details(checks, 'S9'), /camera endpoint did not return/)
})

// --- S10: the blind path ---------------------------------------------------------

test('S10: no blind key, DIP/PIP marked unblinded, or marks that do not belong to the key', () => {
  failsOnly(smokeChecks(input({ blindKey: null })), 'S10')

  const unblinded = smokeData()
  unblinded.annotationsCsv = `${unblinded.annotationsCsv.trimEnd()}\nS1-N0-V1-1,1,indexDIP,1500,2000\n`
  const both = byId(smokeChecks(input({}, unblinded)))
  assert.equal(both.S10.status, 'FAIL')
  assert.match(both.S10.details.join(' '), /marked unblinded/)

  const foreign = smokeData()
  foreign.blindCsv = foreign.blindCsv.replace(/^(S2-N1-V2-1,2,indexDIP),([\d.]+),([\d.]+)$/m, (_, head: string, x: string, y: string) => `${head},${(Number(x) + 900).toFixed(2)},${y}`)
  const checks = byId(smokeChecks(input({}, foreign)))
  assert.equal(checks.S10.status, 'FAIL')
  assert.match(checks.S10.details.join(' '), /maps outside its crop/)
})

// --- S11: the capture record -------------------------------------------------------

test('S11: conditions.json missing, a photo without a capture time, the return shot taken before V2, a lens switch', () => {
  failsOnly(smokeChecks(input({ conditions: null })), 'S11')

  const untimed = smokeData()
  delete untimed.observations['S1-N0-V2-2.json'].capturedAtLocal
  failsOnly(smokeChecks(input({}, untimed)), 'S11')

  const early = smokeData()
  early.observations['S2-N1-V1-3.json'] = { ...early.observations['S2-N1-V1-3.json'], capturedAtLocal: '2026:10:20 09:00:01' }
  const order = smokeChecks(input({}, early))
  failsOnly(order, 'S11')
  assert.match(details(order, 'S11'), /taken before/)

  const switched = smokeData()
  switched.observations['S1-N0-V2-2.json'] = { ...switched.observations['S1-N0-V2-2.json'], lens: { model: 'iPhone back camera 6.86mm f/1.78', focalLength35mm: 24 } }
  const lens = smokeChecks(input({}, switched))
  assert.deepEqual(statuses(lens), { ...CLEAN, S11: 'LOOK' })
  assert.match(details(lens, 'S11'), /lock the lens/)
})

test('a photo tracked or about to be committed: S8', () => {
  failsOnly(smokeChecks(input({ trackedImages: ['research/stage10/data/smoke/S1-N0-V1-1.jpg'] })), 'S8')
  failsOnly(smokeChecks(input({ addableImages: ['photos/IMG_0001.HEIC'] })), 'S8')
})

// --- formats and the frozen analyzer on a few photos -------------------------

test('a spreadsheet-exported CSV (BOM, CRLF, quoted cells) reads exactly like a plain one', () => {
  const plain = 'captureId,pass,point,x,y\nS1-N0-V1-1,1,cuticleSideA,10.5,20\n'
  const exported = '\ufeff"captureId","pass","point","x","y"\r\n"S1-N0-V1-1","1","cuticleSideA","10.5","20"\r\n'
  assert.deepEqual(parseAnnotationCsv(exported), parseAnnotationCsv(plain))
  assert.deepEqual(parseAnnotationCsv(plain).errors, [])
})

test('on a few photos every criterion reads INCONCLUSIVE — never HOLD', () => {
  const analysis = analyse(smokeData())
  const expectation = simulateExpectation(measuredNoise(analysis))
  assert.equal(expectation.datasets, 0, 'no noise estimate from two pairs: nothing to simulate at')
  const verdict = evaluateCriteria(analysis, expectation)
  for (const entry of [...verdict.criteria, ...verdict.diagnostics]) assert.equal(entry.status, 'INCONCLUSIVE', entry.id)
})

test('end to end on disk: smoke-check.ts runs the frozen analyzer in --smoke mode, reads the blind path and the record, draws the overlays', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'stage10a-'))
  try {
    const dataDir = path.join(root, 'smoke')
    const uprightDir = path.join(root, 'upright')
    mkdirSync(path.join(dataDir, 'obs'), { recursive: true })
    mkdirSync(path.join(dataDir, 'blind'), { recursive: true })
    mkdirSync(uprightDir)
    const data = smokeData()
    for (const [file, raw] of Object.entries(data.observations)) {
      writeFileSync(path.join(dataDir, 'obs', file), JSON.stringify(raw, null, 2))
      writeFileSync(path.join(uprightDir, `${raw.captureId}.jpg`), jpegHeader(raw.image.width, raw.image.height))
    }
    writeFileSync(path.join(dataDir, 'annotations.csv'), data.annotationsCsv)
    writeFileSync(path.join(dataDir, 'annotations-blind.csv'), data.blindCsv)
    writeFileSync(path.join(dataDir, 'blind', 'key.json'), JSON.stringify(data.blindKey, null, 2))
    writeFileSync(path.join(dataDir, 'conditions.json'), JSON.stringify(data.conditions, null, 2))

    const run = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'research/stage10/smoke-check.ts', dataDir, uprightDir], {
      encoding: 'utf8',
    })
    assert.equal(run.status, 0, run.stdout + run.stderr)
    const report = readFileSync(path.join(dataDir, 'smoke-check.md'), 'utf8')
    for (const id of Object.keys(CLEAN)) assert.ok(report.includes(`| ${id} |`), id)
    assert.ok(!report.includes('**FAIL**'), report)
    assert.ok(existsSync(path.join(uprightDir, 'S1-N0-V1-1.overlay.svg')))
    // The analyzer's smoke output carries no verdict and no metric.
    const smokeReport = readFileSync(path.join(dataDir, 'smoke-report.md'), 'utf8')
    for (const word of ['Verdict', 'BREAK', 'HOLD', 'INCONCLUSIVE', 'M1', 'M6', 'Bottleneck']) assert.ok(!smokeReport.includes(word), word)
    // Nor does the JSON that gets committed: only how far each capture got.
    const smokeJson = JSON.parse(readFileSync(path.join(dataDir, 'smoke-report.json'), 'utf8')) as Record<string, Record<string, unknown>>
    assert.deepEqual(Object.keys(smokeJson), ['reach'])
    assert.deepEqual(Object.keys(smokeJson.reach).sort(), ['calibration', 'conditions', 'counts', 'kitVersion', 'pairs', 'problems', 'protocol'])
    for (const key of ['joints', 'frames', 'substitution', 'tipReach', 'axisGap', 'origins', 'sockets', 'm1', 'm6', 'stretch', 'ratio']) {
      assert.ok(!JSON.stringify(smokeJson).includes(`"${key}"`), key)
    }
    assert.ok(!existsSync(path.join(dataDir, 'report.md')), 'a smoke run must not leave a Stage 10 report behind')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
