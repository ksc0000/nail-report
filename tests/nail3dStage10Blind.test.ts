// Stage 10 — blind DIP / PIP annotation, checked before any crop is drawn.
//
// research/stage10/blind.ts computes every crop and the transform that
// blind-crops.swift applies; the Swift side does no geometry. So what can go
// wrong with the pixels is decided here: the crop must show the finger from
// beyond the PIP to just past the DIP — never the nail — the right way up and
// unmirrored, a crop pixel must map back onto the upright pixel it shows, the
// CoreGraphics transform must agree with that map, and nothing about the
// crops may give away the photo or the nail set.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BLIND_GEOMETRY,
  cgTransformFor,
  cropFor,
  mergeBlindMarks,
  parseBlindCsv,
  planBlindCrops,
  renderAnnotationCsv,
  toCrop,
  toUpright,
} from '../research/stage10/blind.ts'
import type { BlindMark } from '../research/stage10/blind.ts'
import { parseAnnotationCsv, parseCaptureName } from '../research/stage10/kit.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import type { ScanObservation } from '../src/lib/nail3dObservation.ts'
import { dryRunDataset } from './support/stage10DryRun.ts'

const shot1 = (): { photos: ScanObservation[]; csv: string } => {
  const dataset = dryRunDataset({ seed: 21 })
  const photos = Object.values(dataset.observations)
    .filter(raw => parseCaptureName(raw.captureId)?.shot === 1)
    .map(raw => {
      const parsed = parseScanObservation(JSON.parse(JSON.stringify(raw)))
      assert.ok(parsed.ok)
      return parsed.value
    })
  return { photos, csv: dataset.annotationsCsv }
}

test('a crop maps back onto the upright image exactly, and its axes are a rotation (no mirror)', () => {
  const draw = () => 0.5
  const crop = cropFor([1500, 2400], [1560, 2100], BLIND_GEOMETRY, draw)!
  for (const [u, v] of [[0, 0], [crop.width, 0], [37.5, 210.25], [crop.width, crop.height]]) {
    const [x, y] = toUpright(crop, u, v)
    const [u2, v2] = toCrop(crop, x, y)
    assert.ok(Math.abs(u2 - u) < 1e-9 && Math.abs(v2 - v) < 1e-9)
  }
  assert.ok(Math.abs(Math.hypot(crop.ux, crop.uy) - 1) < 1e-12 && Math.abs(crop.ux * crop.vx + crop.uy * crop.vy) < 1e-12)
  // det [u v] = +1 in image coordinates: a rotation, never a reflection.
  assert.ok(Math.abs(crop.ux * crop.vy - crop.uy * crop.vx - 1) < 1e-12)
})

test('the finger points up in the crop, the DIP sits just below its top edge, and the nail is outside it', () => {
  const pip: [number, number] = [1500, 2400]
  const dip: [number, number] = [1560, 2100]
  const length = Math.hypot(dip[0] - pip[0], dip[1] - pip[1])
  const crop = cropFor(pip, dip, BLIND_GEOMETRY, () => 0.5)!
  const [pu, pv] = toCrop(crop, ...pip)
  const [du, dv] = toCrop(crop, ...dip)
  assert.ok(dv < pv, 'DIP above PIP')
  assert.ok(Math.abs(du - pu) < 1e-9, 'the finger is vertical in the crop')
  assert.ok(Math.abs(dv - BLIND_GEOMETRY.distalMargin * length) < 1e-9, 'DIP sits the distal margin below the top edge')
  // A third of the PIP–DIP length past the DIP — about where the nail fold starts — is above the crop.
  const fold: [number, number] = [dip[0] + ((dip[0] - pip[0]) / length) * 0.33 * length, dip[1] + ((dip[1] - pip[1]) / length) * 0.33 * length]
  assert.ok(toCrop(crop, ...fold)[1] < 0, 'the nail is not in the crop')
  // The PIP is inside, with room below it.
  assert.ok(pv > 0 && pv < crop.height - 0.4 * length && pu > 0 && pu < crop.width)
})

test('the CoreGraphics transform blind-crops.swift applies agrees with the crop map', () => {
  const crop = cropFor([1500, 2400], [1700, 2150], BLIND_GEOMETRY, () => 0.3)!
  const uprightHeight = 4032
  const cg = cgTransformFor(crop, uprightHeight)
  // CoreGraphics draws the upright image into (0, 0, w, h) with y up, so its pixel (x, y) sits at user (x, H − y);
  // the bitmap's top row is crop row v = 0, so device (u, cropHeight − v).
  for (const [x, y] of [[1500, 2400], [1700, 2150], [1610.5, 2302.25]]) {
    const [u, v] = toCrop(crop, x, y)
    const userY = uprightHeight - y
    const deviceX = cg.a * x + cg.c * userY + cg.tx
    const deviceY = cg.b * x + cg.d * userY + cg.ty
    assert.ok(Math.abs(deviceX - u) < 1e-9, `x ${deviceX} vs ${u}`)
    assert.ok(Math.abs(deviceY - (crop.height - v)) < 1e-9, `y ${deviceY} vs ${crop.height - v}`)
  }
  // Still a rotation in CoreGraphics' own (y-up) frame.
  assert.ok(Math.abs(cg.a * cg.d - cg.b * cg.c - 1) < 1e-12)
})

test('the plan: every annotated photo in both passes, each pass in its own random order under its own IDs', () => {
  const { photos } = shot1()
  const key = planBlindCrops(photos, { seed: 9 })
  assert.equal(key.entries.length, 2 * photos.length)
  assert.deepEqual(key.unplanned, [])
  for (const pass of [1, 2] as const) {
    const entries = key.entries.filter(entry => entry.pass === pass)
    assert.deepEqual(entries.map(e => e.captureId).sort(), photos.map(p => p.captureId).sort())
    assert.deepEqual(entries.map(e => e.order).sort((a, b) => a - b), entries.map((_, i) => i + 1))
  }
  const ids = key.entries.map(entry => entry.blindId)
  assert.equal(new Set(ids).size, ids.length)
  // Nothing in an ID tells the session, the condition or the view.
  for (const id of ids) assert.match(id, /^B[12]-[ACDEFGHJKLMNPQRTUVWXY34679]{4}$/)
  // The two passes do not present the photos in the same order, nor through the same window.
  const sequence = (pass: number) => key.entries.filter(e => e.pass === pass).sort((a, b) => a.order - b.order).map(e => e.captureId)
  assert.notDeepEqual(sequence(1), sequence(2))
  const window = (pass: number, id: string) => key.entries.find(e => e.pass === pass && e.captureId === id)!.crop
  assert.notDeepEqual(window(1, photos[0].captureId), window(2, photos[0].captureId))
  // Reproducible from the seed in the key.
  assert.deepEqual(planBlindCrops(photos, { seed: 9 }), key)
})

test('the crops of N0 and N1 photos come from the same rule: their sizes do not separate the conditions', () => {
  const { photos } = shot1()
  const key = planBlindCrops(photos, { seed: 4 })
  const sizes = (set: string) => key.entries.filter(e => e.captureId.includes(`-${set}-`)).map(e => e.crop.height / e.crop.width)
  const range = (values: number[]) => [Math.min(...values), Math.max(...values)]
  const [n0, n1] = [range(sizes('N0')), range(sizes('N1'))]
  // The ranges overlap: aspect alone cannot tell a crop's nail set.
  assert.ok(n0[0] <= n1[1] && n1[0] <= n0[1], `${n0} vs ${n1}`)
})

test('round trip: creases marked on the crops come back as the annotator\'s marks on the upright photo', () => {
  const { photos, csv } = shot1()
  const key = planBlindCrops(photos, { seed: 13 })
  const rows = parseAnnotationCsv(csv).rows
  const marks: BlindMark[] = key.entries.flatMap(entry =>
    (['indexDIP', 'indexPIP'] as const).map(point => {
      const row = rows.find(r => r.captureId === entry.captureId && r.pass === entry.pass && r.point === point)!
      const [x, y] = toCrop(entry.crop, row.x, row.y)
      // Inside the crop, as a person could mark it.
      assert.ok(x > 0 && y > 0 && x < entry.crop.width && y < entry.crop.height, `${entry.captureId} ${point}`)
      return { blindId: entry.blindId, point, x, y }
    }),
  )
  const merged = mergeBlindMarks(key, marks)
  assert.deepEqual(merged.errors, [])
  assert.deepEqual(merged.unmarked, [])
  for (const row of merged.rows) {
    const original = rows.find(r => r.captureId === row.captureId && r.pass === row.pass && r.point === row.point)!
    assert.ok(Math.hypot(row.x - original.x, row.y - original.y) < 1e-6)
  }
  // And through the CSV the analysis reads.
  assert.deepEqual(parseAnnotationCsv(renderAnnotationCsv(merged.rows)).errors, [])
})

test('merging reports what it cannot use — never guesses', () => {
  const { photos } = shot1()
  const key = planBlindCrops(photos.slice(0, 2), { seed: 2 })
  const [first] = key.entries
  const merged = mergeBlindMarks(key, [
    { blindId: first.blindId, point: 'indexDIP', x: 10, y: 10 },
    { blindId: first.blindId, point: 'indexPIP', x: -5, y: 10 },
    { blindId: 'B1-ZZZZ', point: 'indexDIP', x: 1, y: 1 },
  ])
  assert.equal(merged.rows.length, 1)
  assert.ok(merged.errors.some(e => e.includes('outside')))
  assert.ok(merged.errors.some(e => e.includes('not in the key')))
  // A mark that was made but cannot be used is an error, not "unmarked"; every crop nobody marked is listed.
  assert.ok(!merged.unmarked.some(entry => entry.startsWith(first.blindId)))
  assert.equal(merged.unmarked.length, 2 * key.entries.length - 2)
})

test('the marks file is strict: header, point names, numbers, no duplicates; spreadsheet quoting is fine', () => {
  const good = parseBlindCsv('\ufeff"blindId","point","x","y"\r\n"B1-ACDE","indexDIP","10.5","20"\r\n')
  assert.deepEqual(good.errors, [])
  assert.deepEqual(good.rows, [{ blindId: 'B1-ACDE', point: 'indexDIP', x: 10.5, y: 20 }])
  const bad = parseBlindCsv(['id,point,x,y', 'B1-ACDE,cuticleSideA,1,2', 'B1-ACDE,indexPIP,one,2', 'B1-ACDE,indexDIP,1,2', 'B1-ACDE,indexDIP,1,2'].join('\n'))
  assert.equal(bad.rows.length, 1)
  assert.equal(bad.errors.length, 4, bad.errors.join(' | '))
})

test('a photo without Vision\'s PIP or DIP gets no crop, and the plan says so', () => {
  const { photos } = shot1()
  const blinded = { ...photos[0], landmarks: photos[0].landmarks.map(l => (l.name === 'indexDIP' ? { ...l, x: null, y: null, confidence: null } : l)) }
  const key = planBlindCrops([blinded, photos[1]], { seed: 3 })
  assert.equal(key.entries.length, 2)
  assert.equal(key.unplanned.length, 1)
  assert.match(key.unplanned[0], new RegExp(blinded.captureId))
})
