// Stage 10 — blind DIP / PIP annotation.
//
// The annotator marks the DIP and PIP skin creases on crops that do not show
// which nail set the photo was taken with: each crop is rotated so the finger
// points up and is cut off just distal to Vision's DIP — proximal to the nail
// fold, so neither the nail nor a tip is in it — and the crops come in a
// random order, under random IDs, without Vision's points drawn on them and
// without any earlier mark (pass 2 gets new IDs, a new order and a shifted
// window). The key that maps a crop back to its photo, and a crop pixel back
// to the upright image, stays closed until the marks are in.
//
// The cuticle and the free edge ARE the nail, so they cannot be blinded; they
// are marked on the full upright copies as before (annotations.csv).
//
// Geometry is computed here, where it is tested. blind-crops.swift only
// applies the transform stored in the key.

import type { ScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { AnnotationRow } from './kit.ts'

/** Upright position of crop pixel (0, 0), and the crop's u (right) and v (down) axes in upright pixels (orthonormal). */
export interface CropFrame {
  originX: number
  originY: number
  ux: number
  uy: number
  vx: number
  vy: number
  width: number
  height: number
}

/** The CoreGraphics transform from the upright image's user space (origin bottom-left) to the crop's bitmap. */
export interface CgTransform {
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number
}

export interface BlindEntry {
  blindId: string
  captureId: string
  pass: 1 | 2
  /** Position in that pass's presentation order (1 = first). */
  order: number
  crop: CropFrame
  cg: CgTransform
  uprightWidth: number
  uprightHeight: number
}

export interface BlindGeometry {
  /** How far the crop reaches beyond Vision's DIP, in PIP–DIP lengths. Small enough to stay proximal to the nail fold. */
  distalMargin: number
  /** How far it reaches proximal to Vision's PIP, drawn per crop from this range. */
  proximalMargin: [number, number]
  /** Half the crop's width. */
  halfWidth: number
  /** Random sideways shift of the window, ± this. */
  lateralJitter: number
}

export const BLIND_GEOMETRY: BlindGeometry = { distalMargin: 0.15, proximalMargin: [0.5, 0.7], halfWidth: 0.55, lateralJitter: 0.08 }

export interface BlindKey {
  kind: 'stage10-blind-key'
  version: 1
  seed: number
  geometry: BlindGeometry
  entries: BlindEntry[]
  /** Captures no crop could be planned for, with the reason (never silently dropped). */
  unplanned: string[]
}

/** Small seeded generator (mulberry32): the plan is reproducible from the seed in the key. */
const random = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ID_ALPHABET = 'ACDEFGHJKLMNPQRTUVWXY34679'

const landmark = (observation: ScanObservation, name: string): [number, number] | null => {
  const found = observation.landmarks.find(entry => entry.name === name)
  return found && found.x !== null && found.y !== null ? [found.x, found.y] : null
}

export const toUpright = (crop: CropFrame, u: number, v: number): [number, number] => [
  crop.originX + u * crop.ux + v * crop.vx,
  crop.originY + u * crop.uy + v * crop.vy,
]

export const toCrop = (crop: CropFrame, x: number, y: number): [number, number] => {
  const dx = x - crop.originX
  const dy = y - crop.originY
  return [dx * crop.ux + dy * crop.uy, dx * crop.vx + dy * crop.vy]
}

/**
 * The CoreGraphics transform for one crop. The upright image is drawn into
 * rect (0, 0, width, height) of a user space with y up; the crop bitmap has
 * y up as well, and its top row is crop row v = 0. So user (X, H − Y) must
 * land on device (u, cropHeight − v).
 */
export const cgTransformFor = (crop: CropFrame, uprightHeight: number): CgTransform => ({
  a: crop.ux,
  b: -crop.vx,
  c: -crop.uy,
  d: crop.vy,
  tx: crop.uy * uprightHeight - crop.ux * crop.originX - crop.uy * crop.originY,
  ty: crop.height - crop.vy * uprightHeight + crop.vx * crop.originX + crop.vy * crop.originY,
})

/** The crop window for one photo, from Vision's PIP and DIP in it. */
export const cropFor = (
  pip: [number, number],
  dip: [number, number],
  geometry: BlindGeometry,
  draw: () => number,
): CropFrame | null => {
  const length = Math.hypot(dip[0] - pip[0], dip[1] - pip[1])
  if (!(length > 1)) return null
  // Along the finger (PIP -> DIP), and the crop's right-hand axis: finger up, no mirror.
  const ax = (dip[0] - pip[0]) / length
  const ay = (dip[1] - pip[1]) / length
  const rx = -ay
  const ry = ax
  const top = length * (1 + geometry.distalMargin)
  const bottom = -length * (geometry.proximalMargin[0] + draw() * (geometry.proximalMargin[1] - geometry.proximalMargin[0]))
  const half = length * geometry.halfWidth
  const shift = length * geometry.lateralJitter * (2 * draw() - 1)
  return {
    originX: pip[0] + ax * top + rx * (shift - half),
    originY: pip[1] + ay * top + ry * (shift - half),
    ux: rx,
    uy: ry,
    vx: -ax,
    vy: -ay,
    width: Math.ceil(2 * half),
    height: Math.ceil(top - bottom),
  }
}

/**
 * The blind plan: one crop per annotated photo per pass, each pass in its own
 * random order under its own random IDs.
 */
export const planBlindCrops = (
  photos: readonly ScanObservation[],
  options: { seed: number; geometry?: BlindGeometry; passes?: readonly (1 | 2)[] },
): BlindKey => {
  const geometry = options.geometry ?? BLIND_GEOMETRY
  const draw = random(options.seed)
  const used = new Set<string>()
  const newId = (pass: 1 | 2) => {
    for (;;) {
      let id = `B${pass}-`
      for (let i = 0; i < 4; i += 1) id += ID_ALPHABET[Math.floor(draw() * ID_ALPHABET.length)]
      if (!used.has(id)) {
        used.add(id)
        return id
      }
    }
  }
  const entries: BlindEntry[] = []
  const unplanned: string[] = []
  const passes = options.passes ?? ([1, 2] as const)
  for (const pass of passes) {
    const planned: BlindEntry[] = []
    for (const photo of photos) {
      const pip = landmark(photo, 'indexPIP')
      const dip = landmark(photo, 'indexDIP')
      const crop = pip && dip ? cropFor(pip, dip, geometry, draw) : null
      if (!crop) {
        if (pass === passes[0]) unplanned.push(`${photo.captureId}: Vision gave no usable indexPIP / indexDIP to place the crop`)
        continue
      }
      planned.push({
        blindId: newId(pass),
        captureId: photo.captureId,
        pass,
        order: 0,
        crop,
        cg: cgTransformFor(crop, photo.image.height),
        uprightWidth: photo.image.width,
        uprightHeight: photo.image.height,
      })
    }
    // Fisher–Yates: the presentation order of this pass.
    for (let i = planned.length - 1; i > 0; i -= 1) {
      const j = Math.floor(draw() * (i + 1))
      ;[planned[i], planned[j]] = [planned[j], planned[i]]
    }
    planned.forEach((entry, index) => {
      entry.order = index + 1
    })
    entries.push(...planned)
  }
  return { kind: 'stage10-blind-key', version: 1, seed: options.seed, geometry, entries, unplanned }
}

export interface BlindMark {
  blindId: string
  point: 'indexDIP' | 'indexPIP'
  x: number
  y: number
}

/** What the annotator writes for the crops: blindId,point,x,y (crop pixels). */
export const parseBlindCsv = (text: string): { rows: BlindMark[]; errors: string[] } => {
  const rows: BlindMark[] = []
  const errors: string[] = []
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'))
  if (!lines.length) return { rows, errors: ['blind marks: empty'] }
  if (lines[0].replace(/[\s"]/g, '') !== 'blindId,point,x,y') errors.push('blind marks: the header must be blindId,point,x,y')
  const seen = new Set<string>()
  lines.slice(1).forEach((line, index) => {
    const where = `blind marks line ${index + 2}`
    const cells = line.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1').trim())
    if (cells.length !== 4) {
      errors.push(`${where}: expected 4 columns`)
      return
    }
    const [blindId, point, xText, yText] = cells
    const x = Number(xText)
    const y = Number(yText)
    if (point !== 'indexDIP' && point !== 'indexPIP') errors.push(`${where}: point must be indexDIP or indexPIP`)
    else if (!Number.isFinite(x) || !Number.isFinite(y)) errors.push(`${where}: x and y must be numbers`)
    else if (seen.has(`${blindId}|${point}`)) errors.push(`${where}: ${point} of ${blindId} given twice`)
    else {
      seen.add(`${blindId}|${point}`)
      rows.push({ blindId, point, x, y })
    }
  })
  return { rows, errors }
}

/**
 * Opens the key: crop marks -> annotations in upright pixels. A mark outside
 * its crop, an unknown ID, or a crop left unmarked is reported, never guessed.
 */
export const mergeBlindMarks = (
  key: BlindKey,
  marks: readonly BlindMark[],
): { rows: AnnotationRow[]; errors: string[]; unmarked: string[] } => {
  const errors: string[] = []
  const rows: AnnotationRow[] = []
  const byId = new Map(key.entries.map(entry => [entry.blindId, entry]))
  for (const mark of marks) {
    const entry = byId.get(mark.blindId)
    if (!entry) {
      errors.push(`${mark.blindId}: not in the key`)
      continue
    }
    if (mark.x < 0 || mark.y < 0 || mark.x > entry.crop.width || mark.y > entry.crop.height) {
      errors.push(`${mark.blindId} ${mark.point}: (${mark.x}, ${mark.y}) is outside its ${entry.crop.width}x${entry.crop.height} crop`)
      continue
    }
    const [x, y] = toUpright(entry.crop, mark.x, mark.y)
    rows.push({ captureId: entry.captureId, pass: entry.pass, point: mark.point, x, y })
  }
  const unmarked = key.entries.flatMap(entry =>
    (['indexDIP', 'indexPIP'] as const)
      .filter(point => !marks.some(mark => mark.blindId === entry.blindId && mark.point === point))
      .map(point => `${entry.blindId} (${entry.captureId}, pass ${entry.pass}): no ${point}`),
  )
  return { rows, errors, unmarked }
}

export const renderAnnotationCsv = (rows: readonly AnnotationRow[]): string =>
  `${['captureId,pass,point,x,y', ...rows.map(row => `${row.captureId},${row.pass},${row.point},${row.x.toFixed(2)},${row.y.toFixed(2)}`)].join('\n')}\n`
