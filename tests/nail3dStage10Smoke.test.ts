// Stage 10A — the capture-pipeline smoke check, checked before any real photo.
//
// research/stage10/smoke.ts is what tells us, on a few real photos, whether
// the numbers land where they should: orientation, mirroring, coordinate
// frames, labels, parsing, the frozen analyzer, git. These tests feed it the
// synthetic stand-in in the exact on-disk format and then break one hand-off
// at a time; each break must be caught by the check meant for it, and only by
// that one. Nothing here measures anything about hands.

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { analyzeStage10, parseAnnotationCsv } from '../research/stage10/kit.ts'
import type { Stage10Analysis } from '../research/stage10/kit.ts'
import { evaluateCriteria, measuredNoise, simulateExpectation } from '../research/stage10/criteria.ts'
import { NEGATIVE_CONTROL_PREFIX, handednessSign, jpegSize, smokeChecks, smokeReach } from '../research/stage10/smoke.ts'
import type { SmokeCheck, SmokeInput } from '../research/stage10/smoke.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { dryRunDataset } from './support/stage10DryRun.ts'

const KEEP = ['CAL-01', 'CAL-02', 'S1-N0-V1-1', 'S1-N0-V1-2', 'S1-N0-V2-1', 'S1-N0-V2-2', 'S2-N1-V1-1', 'S2-N1-V2-1']
const MIRROR = `${NEGATIVE_CONTROL_PREFIX}S1-N0-V1-1`

type Raw = ScanObservation & Record<string, unknown>

/** A few photos' worth of the stand-in, as vision-dump.swift would write them, plus a deliberate mirror image. */
const smokeData = () => {
  const dataset = dryRunDataset({ seed: 11 })
  const observations: Record<string, Raw> = {}
  for (const id of KEEP) {
    const raw = JSON.parse(JSON.stringify(dataset.observations[id])) as Raw
    observations[`${id}.json`] = {
      ...raw,
      // The README has S2 shot with the phone held the other way, so the photos carry two EXIF orientations.
      image: { ...raw.image, exifOrientation: id.startsWith('S2-') ? 1 : 6 },
      visionChirality: 'right',
      landmarkModel: { provider: 'vision', request: 'VNDetectHumanHandPoseRequest', revision: 1 },
    }
  }
  const source = observations['S1-N0-V1-1.json']
  observations[`${MIRROR}.json`] = mirrored({ ...source, captureId: MIRROR, sessionId: MIRROR })
  const rows = dataset.annotationsCsv.trim().split('\n')
  const annotationsCsv = [rows[0], ...rows.slice(1).filter(row => KEEP.includes(row.split(',')[0]))].join('\n') + '\n'
  return { observations, annotationsCsv }
}

const mirrored = (raw: Raw): Raw => ({
  ...raw,
  landmarks: raw.landmarks.map(l => (l.x === null ? l : { ...l, x: raw.image.width - l.x })),
})

const sizesOf = (observations: Record<string, Raw>) =>
  Object.fromEntries(Object.values(observations).map(raw => [raw.captureId, { width: raw.image.width, height: raw.image.height }]))

const analyse = (observations: Record<string, Raw>, csv: string): Stage10Analysis => {
  const parsed = new Map<string, ScanObservation>()
  for (const raw of Object.values(observations)) {
    const result = parseScanObservation(JSON.parse(JSON.stringify(raw)))
    if (result.ok) parsed.set(result.value.captureId, result.value)
  }
  return analyzeStage10({ observations: parsed, annotations: parseAnnotationCsv(csv).rows })
}

const input = (overrides: Partial<SmokeInput> = {}, data = smokeData()): SmokeInput => ({
  observations: data.observations,
  uprightSizes: sizesOf(data.observations),
  annotationsCsv: data.annotationsCsv,
  trackedImages: [],
  addableImages: [],
  analyzer: { exitCode: 0, reach: smokeReach(analyse(data.observations, data.annotationsCsv)) },
  ...overrides,
})

const byId = (checks: SmokeCheck[]) => Object.fromEntries(checks.map(check => [check.id, check]))
/** Every check's status, so a test can assert that ONLY the intended one changed. */
const statuses = (checks: SmokeCheck[]) => Object.fromEntries(checks.map(check => [check.id, check.status]))
const CLEAN = { S1: 'PASS', S2: 'PASS', S3: 'LOOK', S4: 'PASS', S5: 'PASS', S6: 'PASS', S7: 'PASS', S8: 'PASS' }
const failsOnly = (checks: SmokeCheck[], id: keyof typeof CLEAN) =>
  assert.deepEqual(statuses(checks), { ...CLEAN, [id]: 'FAIL' }, JSON.stringify(byId(checks)[id].details))

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

test('clean data: every check passes, the mirror control is caught, the overlays are left for the eye', () => {
  const checks = smokeChecks(input())
  assert.deepEqual(statuses(checks), CLEAN, JSON.stringify(checks.filter(c => c.status === 'FAIL')))
  assert.ok(byId(checks).S2.details.some(detail => detail.includes('negative control detected as mirrored')))
})

// --- one broken hand-off at a time ------------------------------------------

test('orientation applied in the JSON but not the upright copy: S2 sees the quarter turn', () => {
  const data = smokeData()
  const sizes = sizesOf(data.observations)
  sizes['S1-N0-V2-1'] = { width: sizes['S1-N0-V2-1'].height, height: sizes['S1-N0-V2-1'].width }
  const checks = smokeChecks(input({ uprightSizes: sizes }, data))
  failsOnly(checks, 'S2')
  assert.ok(byId(checks).S2.details.some(detail => detail.includes('quarter turn')))
})

test('a mirrored photo, a left hand, or a mirror control that is not mirrored: S2', () => {
  const flipped = smokeData()
  flipped.observations['S2-N1-V1-1.json'] = mirrored(flipped.observations['S2-N1-V1-1.json'])
  // The annotations still describe the unmirrored image, so S4 fails too: both are right to.
  assert.equal(byId(smokeChecks(input({}, flipped))).S2.status, 'FAIL')

  const left = smokeData()
  left.observations['S1-N0-V1-2.json'] = { ...left.observations['S1-N0-V1-2.json'], visionChirality: 'left' }
  failsOnly(smokeChecks(input({}, left)), 'S2')

  const missed = smokeData()
  missed.observations[`${MIRROR}.json`] = { ...missed.observations['S1-N0-V1-1.json'], captureId: MIRROR, sessionId: MIRROR }
  const checks = smokeChecks(input({}, missed))
  failsOnly(checks, 'S2')
  assert.ok(byId(checks).S2.details.some(detail => detail.includes('NOT detected')))
})

test('no mirror control, or no rotated photo: S2 has not been tested on these photos', () => {
  const noControl = smokeData()
  delete noControl.observations[`${MIRROR}.json`]
  const checks = smokeChecks(input({}, noControl))
  failsOnly(checks, 'S2')
  assert.ok(byId(checks).S2.details.some(detail => detail.includes('unproven')))

  const upright = smokeData()
  for (const raw of Object.values(upright.observations)) raw.image = { ...raw.image, exifOrientation: 1 }
  const looks = smokeChecks(input({}, upright))
  assert.deepEqual(statuses(looks), { ...CLEAN, S2: 'LOOK' })
  assert.ok(byId(looks).S2.details.some(detail => detail.includes('rotation path is not exercised')))
})

test('Vision coordinates in a different frame from the image: S3 (outside it) and S4 (labels no longer meet)', () => {
  const data = smokeData()
  const raw = data.observations['S1-N0-V1-1.json']
  data.observations['S1-N0-V1-1.json'] = { ...raw, landmarks: raw.landmarks.map(l => (l.x === null || l.y === null ? l : { ...l, x: l.y, y: l.x })) }
  const checks = byId(smokeChecks(input({}, data)))
  assert.equal(checks.S3.status, 'FAIL')
  assert.equal(checks.S4.status, 'FAIL')
})

test('annotation mistakes: DIP/PIP labels swapped, or cuticle sides swapped — S4', () => {
  const swapLabels = smokeData()
  swapLabels.annotationsCsv = swapLabels.annotationsCsv
    .replace(/S1-N0-V1-1,1,indexDIP/, 'S1-N0-V1-1,1,TMP')
    .replace(/S1-N0-V1-1,1,indexPIP/, 'S1-N0-V1-1,1,indexDIP')
    .replace(/S1-N0-V1-1,1,TMP/, 'S1-N0-V1-1,1,indexPIP')
  failsOnly(smokeChecks(input({ analyzer: input({}, swapLabels).analyzer }, swapLabels)), 'S4')

  const swapSides = smokeData()
  swapSides.annotationsCsv = swapSides.annotationsCsv
    .replace(/S1-N0-V2-1,1,cuticleSideA/, 'S1-N0-V2-1,1,TMP')
    .replace(/S1-N0-V2-1,1,cuticleSideB/, 'S1-N0-V2-1,1,cuticleSideA')
    .replace(/S1-N0-V2-1,1,TMP/, 'S1-N0-V2-1,1,cuticleSideB')
  const checks = smokeChecks(input({ analyzer: input({}, swapSides).analyzer }, swapSides))
  failsOnly(checks, 'S4')
  assert.ok(byId(checks).S4.details.some(detail => detail.includes('A and B swapped')))
})

test('Vision joint ids mapped wrong — DIP and TIP, or index and middle — S5', () => {
  const rename = (data: ReturnType<typeof smokeData>, id: string, a: string, b: string) => {
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

test('the analyzer failing, or reading the data without reaching a frame: S7', () => {
  failsOnly(smokeChecks(input({ analyzer: { exitCode: 1, message: 'TypeError: boom' } })), 'S7')
  const data = smokeData()
  const blind = analyse(
    Object.fromEntries(Object.entries(data.observations).filter(([file]) => !file.startsWith('CAL-'))),
    data.annotationsCsv,
  )
  const checks = smokeChecks(input({ analyzer: { exitCode: 0, reach: smokeReach(blind) } }, data))
  failsOnly(checks, 'S7')
  assert.ok(byId(checks).S7.details.some(detail => detail.includes('no H1 profile')))
})

test('a photo tracked or about to be committed: S8', () => {
  failsOnly(smokeChecks(input({ trackedImages: ['research/stage10/data/smoke/S1-N0-V1-1.jpg'] })), 'S8')
  failsOnly(smokeChecks(input({ addableImages: ['photos/IMG_0001.HEIC'] })), 'S8')
})

// --- formats and the frozen analyzer on a few photos -------------------------

test('a spreadsheet-exported CSV (BOM, CRLF, quoted cells) reads exactly like a plain one', () => {
  const plain = 'captureId,pass,point,x,y\nS1-N0-V1-1,1,cuticleSideA,10.5,20\n'
  const exported = '﻿"captureId","pass","point","x","y"\r\n"S1-N0-V1-1","1","cuticleSideA","10.5","20"\r\n'
  assert.deepEqual(parseAnnotationCsv(exported), parseAnnotationCsv(plain))
  assert.deepEqual(parseAnnotationCsv(plain).errors, [])
})

test('on a few photos the criteria cannot be judged, and say N/A rather than HOLD', () => {
  const data = smokeData()
  const analysis = analyse(data.observations, data.annotationsCsv)
  const expectation = simulateExpectation(measuredNoise(analysis))
  assert.equal(expectation.datasets, 0, 'no noise estimate from two pairs: nothing to simulate at')
  for (const criterion of evaluateCriteria(analysis, expectation).criteria) assert.equal(criterion.status, 'N/A', criterion.id)
})

test('end to end on disk: smoke-check.ts runs the frozen analyzer in --smoke mode and draws the overlays', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'stage10a-'))
  try {
    const dataDir = path.join(root, 'smoke')
    const uprightDir = path.join(root, 'upright')
    mkdirSync(path.join(dataDir, 'obs'), { recursive: true })
    mkdirSync(uprightDir)
    const data = smokeData()
    for (const [file, raw] of Object.entries(data.observations)) {
      writeFileSync(path.join(dataDir, 'obs', file), JSON.stringify(raw, null, 2))
      writeFileSync(path.join(uprightDir, `${raw.captureId}.jpg`), jpegHeader(raw.image.width, raw.image.height))
    }
    writeFileSync(path.join(dataDir, 'annotations.csv'), data.annotationsCsv)

    const run = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'research/stage10/smoke-check.ts', dataDir, uprightDir], {
      encoding: 'utf8',
    })
    assert.equal(run.status, 0, run.stdout + run.stderr)
    const report = readFileSync(path.join(dataDir, 'smoke-check.md'), 'utf8')
    for (const id of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']) assert.ok(report.includes(`| ${id} |`), id)
    assert.ok(!report.includes('**FAIL**'))
    assert.ok(existsSync(path.join(uprightDir, 'S1-N0-V1-1.overlay.svg')))
    // The analyzer's smoke output carries no verdict and no metric.
    const smokeReport = readFileSync(path.join(dataDir, 'smoke-report.md'), 'utf8')
    for (const word of ['Verdict', 'BREAK', 'HOLD', 'M1', 'M6', 'Bottleneck']) assert.ok(!smokeReport.includes(word), word)
    // Nor does the JSON that gets committed: only how far each capture got.
    const smokeJson = JSON.parse(readFileSync(path.join(dataDir, 'smoke-report.json'), 'utf8')) as Record<string, Record<string, unknown>>
    assert.deepEqual(Object.keys(smokeJson), ['reach'])
    assert.deepEqual(Object.keys(smokeJson.reach).sort(), ['calibration', 'counts', 'kitVersion', 'pairs', 'problems'])
    for (const key of ['joints', 'frames', 'attribution', 'tipReach', 'axisGap', 'origins', 'sockets', 'm1', 'm6', 'stretch']) {
      assert.ok(!JSON.stringify(smokeJson).includes(`"${key}"`), key)
    }
    assert.ok(!existsSync(path.join(dataDir, 'report.md')), 'a smoke run must not leave a Stage 10 report behind')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
