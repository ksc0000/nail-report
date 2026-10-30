// Stage 10A — does a real photo make it all the way through?
//
// A plumbing check before the 63-photo collection, not an experiment: a few
// real photos go photo -> vision-dump.swift -> upright copy -> manual
// annotation -> Layer A -> the frozen analyzer, and each hand-off is checked
// for the ways real data breaks a pipeline that synthetic data cannot —
// EXIF rotation, mirroring, a coordinate frame off by a turn, swapped labels,
// a CSV that does not match its image, a photo about to be committed.
//
// Nothing here measures accuracy or repeatability or compares F0 with
// F3dNoTip, and nothing computed from Stage 10A photos may be used in 10B.
// The checks below only say whether the numbers are where they should be.
//
// kit v2 widened the gate: every path 10B needs must run in BOTH conditions
// (S7), the camera must come back to V1 with nothing moved (S9), DIP / PIP must
// go through the blind crops and back (S10), and the capture record —
// geometry, session log, EXIF times, shot order, lens — must be complete (S11).
//
// Geometry used by the checks assumes the protocol's view: a RIGHT hand, back
// of the hand toward the camera. Both V1 and V2 keep the back of the hand in
// view, so the 2D handedness sign is the same in both.

import { LANDMARK_NAMES } from '../../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../../src/lib/nail3dObservation.ts'
import type { NailBedAnnotation } from '../../src/lib/nail3dObservation.ts'
import { toCrop } from './blind.ts'
import type { BlindKey } from './blind.ts'
import { PRIMARY_FRAMES, RETURN_SHOT, captureTimeValue, checkConditions, isCalibrationName, parseAnnotationCsv, parseCaptureName, shotOrder } from './kit.ts'
import type { CaptureName } from './kit.ts'
import type { AnnotationRow, NailSetId, Stage10Analysis } from './kit.ts'

export type SmokeStatus = 'PASS' | 'FAIL' | 'LOOK'

export interface SmokeCheck {
  id: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9' | 'S10' | 'S11'
  item: string
  status: SmokeStatus
  details: string[]
}

/** Photos named MIRROR-<anything> are deliberate mirror images: the mirroring check must catch them. */
export const NEGATIVE_CONTROL_PREFIX = 'MIRROR-'

export const IMAGE_EXTENSIONS = /\.(jpe?g|heic|heif|png|tiff?|dng|mov)$/i

// ---------------------------------------------------------------------------
// JPEG dimensions, straight from the header (no image library)
// ---------------------------------------------------------------------------

export const jpegSize = (bytes: Uint8Array): { width: number; height: number } | null => {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null
  let i = 2
  while (i + 3 < bytes.length) {
    if (bytes[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = bytes[i + 1]
    if (marker === 0xff) {
      i += 1
      continue
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      i += 2
      continue
    }
    if (marker === 0xd9 || marker === 0xda) return null // end of image / start of scan before any frame header
    const length = (bytes[i + 2] << 8) | bytes[i + 3]
    // Start-of-frame markers carry the size; C4 (DHT), C8 (JPG) and CC (DAC) do not.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (i + 8 >= bytes.length) return null
      return { height: (bytes[i + 5] << 8) | bytes[i + 6], width: (bytes[i + 7] << 8) | bytes[i + 8] }
    }
    i += 2 + length
  }
  return null
}

// ---------------------------------------------------------------------------
// Small 2D helpers over the raw JSON (raw, so the dump's extra fields are kept)
// ---------------------------------------------------------------------------

type Px = [number, number]

interface RawLandmark {
  name?: unknown
  x?: unknown
  y?: unknown
  confidence?: unknown
}

interface RawObservation {
  captureId?: unknown
  image?: { width?: unknown; height?: unknown; exifOrientation?: unknown }
  landmarks?: readonly RawLandmark[]
  visionChirality?: unknown
  landmarkModel?: { provider?: unknown }
  missing?: unknown
  capturedAtLocal?: unknown
  lens?: { focalLength35mm?: unknown; model?: unknown; focalLengthMm?: unknown; digitalZoom?: unknown }
}

const landmarkOf = (raw: RawObservation, name: string): Px | null => {
  const found = (raw.landmarks ?? []).find(landmark => landmark.name === name)
  return found && typeof found.x === 'number' && typeof found.y === 'number' ? [found.x, found.y] : null
}

const sub = (a: Px, b: Px): Px => [a[0] - b[0], a[1] - b[1]]
const cross = (a: Px, b: Px) => a[0] * b[1] - a[1] * b[0]
const length = (a: Px) => Math.hypot(a[0], a[1])
const fixed = (value: number, digits = 1) => (Number.isFinite(value) ? value.toFixed(digits) : 'n/a')

/** Where `point` falls along a -> b (0 at a, 1 at b), and how far off that line, in units of |ab|. */
const alongAndAcross = (point: Px, a: Px, b: Px): { t: number; off: number } => {
  const ab = sub(b, a)
  const ap = sub(point, a)
  const span = length(ab)
  if (!(span > 1e-9)) return { t: Number.NaN, off: Number.NaN }
  return { t: (ap[0] * ab[0] + ap[1] * ab[1]) / span ** 2, off: Math.abs(cross(ab, ap)) / span ** 2 }
}

/**
 * Positive for a right hand seen from its back (image y down): wrist ->
 * index MCP -> pinky MCP turns that way. A mirror image, a left hand or a palm
 * toward the camera flips it. Invariant to how the hand is rotated in the photo.
 */
export const handednessSign = (raw: RawObservation): number | null => {
  const wrist = landmarkOf(raw, 'wrist')
  const index = landmarkOf(raw, 'indexMCP')
  const pinky = landmarkOf(raw, 'pinkyMCP')
  if (!wrist || !index || !pinky) return null
  return Math.sign(cross(sub(index, wrist), sub(pinky, wrist)))
}

const FINGERS = ['index', 'middle', 'ring', 'pinky'] as const

// ---------------------------------------------------------------------------
// The checks
// ---------------------------------------------------------------------------

export interface SmokeInput {
  /** obs/*.json, by file name, as parsed JSON. */
  observations: Record<string, unknown>
  /** Upright JPEG size by captureId; null when no upright folder was given. */
  uprightSizes: Record<string, { width: number; height: number } | null> | null
  annotationsCsv: string | null
  /** Image files git tracks under research/. */
  trackedImages: readonly string[]
  /** Image files in the repository that git would add (untracked and not ignored). */
  addableImages: readonly string[]
  /** The frozen analyzer run in --smoke mode. */
  analyzer: { exitCode: number | null; message?: string; reach?: SmokeReach } | null
  /** blind/key.json, parsed; null when the blind path was not run. */
  blindKey?: BlindKey | null
  /** annotations-blind.csv (DIP / PIP mapped back from the blind crops); null when absent. */
  blindCsv?: string | null
  /** conditions.json, parsed; null when absent. */
  conditions?: Record<string, unknown> | null
}

/**
 * What a smoke run keeps from the frozen analysis: how far each capture got.
 * No metric (R / C / S, M1, M6, joint offsets) leaves the analysis, so nothing
 * computed from Stage 10A photos can be committed or read as a result.
 */
export interface SmokeReach {
  kitVersion: number
  counts: Stage10Analysis['counts']
  calibration: { profileBuilt: boolean; refused: string[] }
  /** Session counts per condition (counts, not metrics). */
  conditions: Record<NailSetId, { attempted: number; available: number; poseAccepted: number; primaryEligible: number }>
  pairs: Array<{
    session: string
    nailSet: string
    shot: number
    pose: { accepted: boolean; refusedReason?: string; mismatchPx: number }
    /** Frames that reached a socket origin from the cuticle probe. */
    framesReached: string[]
    /** Origin variants that exist in both primary frames (base, cuticlePass2, manualJointsPass2, …): which annotation paths ran. */
    variants: string[]
    cuticleProbe: boolean
    /** The full socket (bed corners in both views) exists in both primary frames. */
    fullSocket: boolean
    notes: string[]
  }>
  /** The analyzer's protocol notes (schedule, capture order). */
  protocol: string[]
  problems: string[]
}

export const smokeReach = (analysis: Stage10Analysis): SmokeReach => ({
  kitVersion: analysis.kitVersion,
  counts: analysis.counts,
  calibration: { profileBuilt: analysis.calibration.profile !== null, refused: analysis.calibration.refused },
  conditions: Object.fromEntries(
    (['N0', 'N1'] as const).map(set => {
      const c = analysis.accounting.conditions[set]
      return [set, { attempted: c.attempted, available: c.available, poseAccepted: c.poseAccepted, primaryEligible: c.primaryEligible }]
    }),
  ) as SmokeReach['conditions'],
  pairs: analysis.pairs.map(pair => ({
    session: pair.session,
    nailSet: pair.nailSet,
    shot: pair.shot,
    pose: { accepted: pair.pose.accepted, refusedReason: pair.pose.refusedReason, mismatchPx: pair.pose.mismatchPx },
    framesReached: (['F0', 'F3dNoTip', 'F3d', 'F4'] as const).filter(frame => pair.origins.base?.[frame]),
    variants: Object.keys(pair.origins).filter(variant =>
      PRIMARY_FRAMES.every(frame => pair.origins[variant as keyof typeof pair.origins]?.[frame]),
    ),
    cuticleProbe: Object.keys(pair.origins.base ?? {}).length > 0,
    fullSocket: PRIMARY_FRAMES.every(frame => pair.sockets[frame]),
    notes: pair.notes,
  })),
  protocol: analysis.protocol,
  problems: analysis.problems,
})

// ---------------------------------------------------------------------------
// Return-to-V1: did the hand or the camera move while the camera went to V2 and back?
// ---------------------------------------------------------------------------

const PALM_POINTS = ['wrist', 'thumbMCP', 'indexMCP', 'middleMCP', 'ringMCP', 'pinkyMCP']
const INDEX_CHAIN = ['indexPIP', 'indexDIP', 'indexTIP']

export interface TransferResult {
  /** Rigid part (palm similarity fit): camera endpoint error and/or the whole hand moving — not separable without fixed marks. */
  translation: number
  rotationDeg: number
  scaleChangePct: number
  /** Non-rigid part: the index finger's largest residual after the palm fit (the finger moved against the palm). */
  fingerResidual: number
  /** Unit of translation and residual: Vision's PIP–DIP length in the first photo, px. */
  unitPx: number
}

/** Palm similarity fit (complex least squares) from photo a to photo b; the index chain judged against it. */
export const transferBetween = (a: RawObservation, b: RawObservation): TransferResult | null => {
  const palm = PALM_POINTS.map(name => [landmarkOf(a, name), landmarkOf(b, name)] as const).filter(
    (pair): pair is readonly [Px, Px] => pair[0] !== null && pair[1] !== null,
  )
  const pip = landmarkOf(a, 'indexPIP')
  const dip = landmarkOf(a, 'indexDIP')
  if (palm.length < 4 || !pip || !dip) return null
  const unitPx = length(sub(dip, pip))
  const centre = (points: readonly Px[]): Px => [
    points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length,
  ]
  const ca = centre(palm.map(pair => pair[0]))
  const cb = centre(palm.map(pair => pair[1]))
  // z = Σ conj(a') b' / Σ |a'|²: b' ≈ z a' (rotation + scale).
  let re = 0
  let im = 0
  let norm = 0
  for (const [p, q] of palm) {
    const [ax, ay] = sub(p, ca)
    const [bx, by] = sub(q, cb)
    re += ax * bx + ay * by
    im += ax * by - ay * bx
    norm += ax * ax + ay * ay
  }
  const zr = re / norm
  const zi = im / norm
  const map = (p: Px): Px => {
    const [x, y] = sub(p, ca)
    return [cb[0] + zr * x - zi * y, cb[1] + zi * x + zr * y]
  }
  const residuals = INDEX_CHAIN.map(name => [landmarkOf(a, name), landmarkOf(b, name)] as const)
    .filter((pair): pair is readonly [Px, Px] => pair[0] !== null && pair[1] !== null)
    .map(([p, q]) => length(sub(map(p), q)))
  return {
    translation: length(sub(cb, ca)) / unitPx,
    rotationDeg: (Math.atan2(zi, zr) * 180) / Math.PI,
    scaleChangePct: (Math.hypot(zr, zi) - 1) * 100,
    fingerResidual: residuals.length ? Math.max(...residuals) / unitPx : Number.NaN,
    unitPx,
  }
}

/** Stage 10A gate for the return-to-V1 check (in Vision PIP–DIP lengths, and degrees / percent for the rigid part). */
export const TRANSFER_LIMITS = { fingerPass: 0.03, fingerFail: 0.06, translation: 0.05, rotationDeg: 1, scaleChangePct: 1 } as const

const status = (failures: string[], look = false): SmokeStatus => (failures.length ? 'FAIL' : look ? 'LOOK' : 'PASS')

export const smokeChecks = (input: SmokeInput): SmokeCheck[] => {
  const checks: SmokeCheck[] = []
  const raws = new Map<string, RawObservation>()
  for (const [file, value] of Object.entries(input.observations)) {
    const raw = value as RawObservation
    raws.set(typeof raw.captureId === 'string' ? raw.captureId : file.replace(/\.json$/, ''), raw)
  }
  const ids = [...raws.keys()].sort()
  const annotation = input.annotationsCsv === null ? null : parseAnnotationCsv(input.annotationsCsv)
  const blind = input.blindCsv ? parseAnnotationCsv(input.blindCsv) : null
  // Cuticle and free edge from annotations.csv, DIP / PIP from the blind crops.
  const rows: AnnotationRow[] = [...(annotation?.rows ?? []), ...(blind?.rows ?? [])]
  const names = ids.map(parseCaptureName).filter((name): name is CaptureName => name !== null)

  // S1 — vision-dump.swift ran on real photos and wrote what it should.
  {
    const failures: string[] = []
    const notes: string[] = []
    if (!ids.length) failures.push('no obs/*.json at all')
    if (input.uprightSizes) {
      for (const id of Object.keys(input.uprightSizes)) if (!raws.has(id)) failures.push(`${id}: upright copy without a JSON`)
      for (const id of ids) if (!(id in input.uprightSizes)) failures.push(`${id}: JSON without an upright copy`)
    }
    for (const id of ids) {
      const raw = raws.get(id)!
      const names = (raw.landmarks ?? []).map(landmark => landmark.name)
      if (raw.landmarkModel?.provider !== 'vision') failures.push(`${id}: landmarkModel.provider is not "vision"`)
      if (names.length !== 21 || LANDMARK_NAMES.some(name => !names.includes(name))) {
        failures.push(`${id}: the 21 landmark names are not this repository's names`)
        continue
      }
      const found = LANDMARK_NAMES.filter(name => landmarkOf(raw, name))
      const weak = (raw.landmarks ?? []).filter(l => typeof l.confidence === 'number' && l.confidence < 0.3).map(l => String(l.name))
      if (found.length < 21) {
        // The frozen F0 needs all 21 in both views of a pair; a gap is a finding.
        failures.push(`${id}: Vision gave ${found.length}/21 joints (missing: ${LANDMARK_NAMES.filter(n => !found.includes(n)).join(', ')})`)
      } else notes.push(`${id}: 21/21 joints${weak.length ? `, ${weak.length} below confidence 0.3 (${weak.join(', ')}) — the pose skips them, the lift does not` : ''}`)
    }
    checks.push({ id: 'S1', item: 'vision-dump.swift ran on the real photos', status: status(failures), details: [...failures, ...notes] })
  }

  // S2 — EXIF orientation applied once, the same way in the JSON and the upright copy; no mirroring.
  {
    const failures: string[] = []
    const notes: string[] = []
    for (const id of ids) {
      const raw = raws.get(id)!
      const width = Number(raw.image?.width)
      const height = Number(raw.image?.height)
      const orientation = Number(raw.image?.exifOrientation)
      const negative = id.startsWith(NEGATIVE_CONTROL_PREFIX)
      if (!(orientation >= 1 && orientation <= 8)) failures.push(`${id}: exifOrientation ${String(raw.image?.exifOrientation)} is not 1-8`)
      const size = input.uprightSizes?.[id]
      if (input.uprightSizes && !size) failures.push(`${id}: upright copy unreadable`)
      if (size && (size.width !== width || size.height !== height)) {
        const turned = size.width === height && size.height === width
        failures.push(`${id}: JSON says ${width}x${height}, upright copy is ${size.width}x${size.height}${turned ? ' — a quarter turn: orientation applied in one and not the other' : ''}`)
      }
      const sign = handednessSign(raw)
      const chirality = raw.visionChirality
      const mirrored = sign !== null && sign < 0
      if (negative) {
        // The deliberate mirror image must be caught, or the check proves nothing.
        if (!mirrored) failures.push(`${id}: negative control NOT detected as mirrored (sign ${sign})`)
        else notes.push(`${id}: negative control detected as mirrored (Vision chirality: ${String(chirality)})`)
        continue
      }
      if (sign === null) failures.push(`${id}: wrist / index MCP / pinky MCP missing, handedness not checkable`)
      else if (mirrored) failures.push(`${id}: looks mirrored, a left hand, or the palm toward the camera (handedness sign < 0)`)
      if (chirality === 'left') failures.push(`${id}: Vision calls it a LEFT hand`)
      notes.push(`${id}: orientation ${orientation}, ${width}x${height}, handedness ${mirrored ? 'MIRRORED' : 'right/back'}, Vision chirality ${String(chirality)}`)
    }
    // A check that was never shown a mirror image, or a rotated photo, has not been tested on real data.
    if (!ids.some(id => id.startsWith(NEGATIVE_CONTROL_PREFIX))) {
      failures.push(`no ${NEGATIVE_CONTROL_PREFIX}* photo: without the deliberate mirror image the mirroring check is unproven`)
    }
    const orientations = [...new Set(ids.filter(id => !id.startsWith(NEGATIVE_CONTROL_PREFIX)).map(id => String(raws.get(id)!.image?.exifOrientation)))]
    const oneOrientation = orientations.length < 2
    if (oneOrientation) {
      notes.unshift(`every photo has EXIF orientation ${orientations.join(', ')}: the rotation path is not exercised — shoot some with the phone held the other way`)
    }
    checks.push({ id: 'S2', item: 'EXIF / orientation / mirroring', status: status(failures, oneOrientation), details: [...failures, ...notes] })
  }

  // S3 — the landmarks are in the upright image's frame (bounds here; alignment by eye on the overlays).
  {
    const failures: string[] = []
    for (const id of ids) {
      const raw = raws.get(id)!
      const width = Number(raw.image?.width)
      const height = Number(raw.image?.height)
      for (const landmark of raw.landmarks ?? []) {
        if (typeof landmark.x !== 'number' || typeof landmark.y !== 'number') continue
        if (landmark.x < 0 || landmark.x > width || landmark.y < 0 || landmark.y > height) {
          failures.push(`${id}: ${String(landmark.name)} at (${fixed(landmark.x)}, ${fixed(landmark.y)}) is outside ${width}x${height}`)
        }
      }
    }
    checks.push({
      id: 'S3',
      item: 'upright image and landmark coordinates agree',
      status: status(failures, true),
      details: failures.length
        ? failures
        : ['every landmark is inside its image; open the *.overlay.svg files: the dots must sit on the joints, the index chain labels in order'],
    })
  }

  // S4 — the annotation CSV is in the same frame as the image and Vision.
  {
    const failures: string[] = []
    const notes: string[] = []
    if (!annotation) failures.push('annotations.csv not found')
    else failures.push(...annotation.errors)
    if (blind) failures.push(...blind.errors.map(error => `annotations-blind.csv: ${error}`))
    const annotatedIds = [...new Set(rows.map(row => row.captureId))].sort()
    const beyond: Record<string, Record<string, number>> = { V1: {}, V2: {} }
    const get = (id: string, pass: 1 | 2, point: AnnotationRow['point']): Px | null => {
      const row = rows.find(r => r.captureId === id && r.pass === pass && r.point === point)
      return row ? [row.x, row.y] : null
    }
    for (const id of annotatedIds) {
      const raw = raws.get(id)
      if (!raw) {
        failures.push(`${id}: annotated but no obs/${id}.json`)
        continue
      }
      const width = Number(raw.image?.width)
      const height = Number(raw.image?.height)
      for (const row of rows.filter(r => r.captureId === id)) {
        if (row.x < 0 || row.x > width || row.y < 0 || row.y > height) failures.push(`${id}: ${row.point} pass ${row.pass} outside the image`)
      }
      // Each annotated joint must be nearest to Vision's joint of the same name.
      for (const joint of ['indexDIP', 'indexPIP'] as const) {
        for (const pass of [1, 2] as const) {
          const marked = get(id, pass, joint)
          if (!marked) continue
          let nearest = ''
          let best = Number.POSITIVE_INFINITY
          for (const name of LANDMARK_NAMES) {
            const at = landmarkOf(raw, name)
            if (at && length(sub(at, marked)) < best) {
              best = length(sub(at, marked))
              nearest = name
            }
          }
          if (nearest !== joint) failures.push(`${id}: ${joint} (pass ${pass}) is nearest to Vision's ${nearest} — labels swapped or frames differ`)
        }
      }
      const dip = landmarkOf(raw, 'indexDIP')
      const tip = landmarkOf(raw, 'indexTIP')
      const cuticleA = get(id, 1, 'cuticleSideA')
      const cuticleB = get(id, 1, 'cuticleSideB')
      if (dip && tip && cuticleA && cuticleB) {
        const middle: Px = [(cuticleA[0] + cuticleB[0]) / 2, (cuticleA[1] + cuticleB[1]) / 2]
        const { t, off } = alongAndAcross(middle, dip, tip)
        if (!(t > -0.25 && t < 1 && off < 0.6)) failures.push(`${id}: the cuticle is not between Vision's DIP and TIP (at ${fixed(t, 2)} along, ${fixed(off, 2)} off)`)
        // Side A is the thumb side. For a right hand seen from its back (image
        // y down), cross(DIP -> TIP, B -> A) is negative; positive means A and B are swapped.
        if (cross(sub(tip, dip), sub(cuticleA, cuticleB)) > 0) failures.push(`${id}: cuticleSideA is on the pinky side — A and B swapped`)
        const freeA = get(id, 1, 'freeEdgeSideA')
        const freeB = get(id, 1, 'freeEdgeSideB')
        if (freeA && freeB) {
          const edge = alongAndAcross([(freeA[0] + freeB[0]) / 2, (freeA[1] + freeB[1]) / 2], dip, tip)
          if (!(edge.t > t)) failures.push(`${id}: the free edge is not distal of the cuticle — cuticle and free edge swapped?`)
          if (cross(sub(tip, dip), sub(freeA, freeB)) > 0) failures.push(`${id}: freeEdgeSideA is on the pinky side — A and B swapped`)
        }
        notes.push(`${id}: cuticle at ${fixed(t, 2)} of DIP -> TIP`)
        // Where the cuticle sits past the annotator's own DIP crease, in PIP–DIP lengths: the same skin fold in N0 and N1.
        const creasePip = get(id, 1, 'indexPIP')
        const creaseDip = get(id, 1, 'indexDIP')
        const name = parseCaptureName(id)
        if (creasePip && creaseDip && name) beyond[name.view][name.nailSet] = alongAndAcross(middle, creaseDip, [2 * creaseDip[0] - creasePip[0], 2 * creaseDip[1] - creasePip[1]]).t
      }
    }
    for (const view of ['V1', 'V2'] as const) {
      const { N0, N1 } = beyond[view]
      if (N0 !== undefined && N1 !== undefined) {
        notes.push(`${view}: the cuticle sits ${fixed(N0, 2)} (N0) and ${fixed(N1, 2)} (N1) PIP–DIP lengths past the DIP crease — the same skin fold should sit at about the same place; a tip's edge would sit further out (look at the N1 overlay)`)
      }
    }
    if (!annotatedIds.length && annotation) failures.push('annotations.csv has no rows')
    checks.push({ id: 'S4', item: 'annotation CSV and image coordinates agree', status: status(failures), details: [...failures, ...notes] })
  }

  // S5 — Vision's joint ids are the joints this repository thinks they are.
  {
    const failures: string[] = []
    for (const id of ids) {
      if (id.startsWith(NEGATIVE_CONTROL_PREFIX)) continue
      const raw = raws.get(id)!
      const wrist = landmarkOf(raw, 'wrist')
      if (!wrist) continue
      for (const finger of FINGERS) {
        const chain = ['MCP', 'PIP', 'DIP', 'TIP'].map(joint => landmarkOf(raw, `${finger}${joint}`))
        if (chain.some(point => !point)) continue
        const reach = chain.map(point => length(sub(point!, wrist)))
        if (!(reach[0] < reach[1] && reach[1] < reach[2] && reach[2] < reach[3])) {
          failures.push(`${id}: ${finger} MCP/PIP/DIP/TIP are not in order outward from the wrist`)
        }
      }
      const pip = landmarkOf(raw, 'indexPIP')
      const dip = landmarkOf(raw, 'indexDIP')
      const tip = landmarkOf(raw, 'indexTIP')
      if (pip && dip && tip) {
        const { t, off } = alongAndAcross(dip, pip, tip)
        if (!(t > 0.2 && t < 0.8 && off < 0.3)) failures.push(`${id}: indexDIP is not between indexPIP and indexTIP (at ${fixed(t, 2)}, ${fixed(off, 2)} off)`)
      }
      const thumb = landmarkOf(raw, 'thumbMCP')
      const mcps = FINGERS.map(finger => landmarkOf(raw, `${finger}MCP`))
      if (thumb && mcps.every(Boolean)) {
        const gaps = mcps.map(point => length(sub(point!, thumb)))
        if (!(gaps[0] < gaps[1] && gaps[1] < gaps[2] && gaps[2] < gaps[3])) {
          failures.push(`${id}: the MCPs are not ordered index -> pinky away from the thumb`)
        }
      }
    }
    checks.push({
      id: 'S5',
      item: 'DIP / PIP / TIP landmark ids are the expected joints',
      status: status(failures),
      details: failures.length ? failures : ['every finger runs MCP -> TIP outward, indexDIP lies between indexPIP and indexTIP, index is the finger next to the thumb'],
    })
  }

  // S6 — Layer A passes the parser, alone and with the hand-marked bed merged in.
  {
    const failures: string[] = []
    let merged = 0
    for (const [file, value] of Object.entries(input.observations)) {
      const parsed = parseScanObservation(value)
      if (!parsed.ok) {
        failures.push(`${file}: ${parsed.errors.join('; ')}`)
        continue
      }
      const id = parsed.value.captureId
      const corner = (point: AnnotationRow['point']) => rows.find(r => r.captureId === id && r.pass === 1 && r.point === point)
      const corners = (['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB'] as const).map(corner)
      if (corners.some(row => !row)) continue
      const [a, b, c, d] = corners as AnnotationRow[]
      const point = (row: AnnotationRow) => ({ x: row.x, y: row.y, confidence: null, source: 'manual' as const })
      const nail: NailBedAnnotation = {
        finger: 'index',
        sideAToward: 'thumb',
        points: { cuticleSideA: point(a), cuticleSideB: point(b), freeEdgeSideA: point(c), freeEdgeSideB: point(d) },
      }
      const withBed = parseScanObservation({ ...(value as object), nails: [nail], missing: [] })
      if (!withBed.ok) failures.push(`${file} + bed: ${withBed.errors.join('; ')}`)
      else merged += 1
    }
    checks.push({
      id: 'S6',
      item: 'Layer A JSON passes the parser',
      status: status(failures),
      details: failures.length ? failures : [`${Object.keys(input.observations).length} observations parse; ${merged} also parse with the hand-marked bed merged in`],
    })
  }

  // S7 — the frozen analyzer reads the real data to the end.
  {
    const failures: string[] = []
    const notes: string[] = []
    const run = input.analyzer
    if (!run) failures.push('the analyzer was not run')
    else if (run.exitCode !== 0) failures.push(`analyze.ts --smoke exited with ${String(run.exitCode)}: ${run.message ?? ''}`)
    else if (!run.reach) failures.push('analyze.ts --smoke wrote no smoke-report.json')
    else {
      // Every path Stage 10B needs must run on real data, in BOTH conditions: one condition passing is not a pass.
      const reach = run.reach
      notes.push(`calibration frames ${reach.counts.calibration}, H1 profile ${reach.calibration.profileBuilt ? 'built' : 'NOT built'}; annotated pairs ${reach.counts.annotatedPairs}, poses accepted ${reach.counts.posesAccepted}`)
      const of = (set: string) => reach.pairs.filter(pair => pair.nailSet === set)
      const primary = (pair: SmokeReach['pairs'][number]) => pair.framesReached.includes('F0') && pair.framesReached.includes('F3dNoTip')
      if (!reach.calibration.profileBuilt) failures.push('no H1 profile — the calibration frames did not reach the pose')
      for (const set of ['N0', 'N1']) {
        if (!of(set).length) failures.push(`${set} path: no ${set} pair (shot 1 in BOTH views)`)
        else if (!of(set).some(primary)) failures.push(`${set} path: no ${set} pair reached a socket origin in both F0 and F3dNoTip`)
      }
      if (!of('N0').some(pair => pair.fullSocket)) failures.push('N0 full socket: no N0 pair has the full socket (all four bed corners in both views) in F0 and F3dNoTip')
      if (!of('N1').some(pair => pair.cuticleProbe)) failures.push('N1 cuticle: no N1 pair has the cuticle marked in both views')
      if (!reach.pairs.some(pair => pair.variants.includes('cuticlePass2') && pair.variants.includes('manualJointsPass2'))) {
        failures.push('repeated annotation path: no pair has a pass-2 cuticle AND pass-2 DIP/PIP through to the origin')
      }
      for (const pair of reach.pairs) {
        notes.push(`${pair.session} ${pair.nailSet}: ${pair.notes.length ? pair.notes.join('; ') : 'every stage ran'} (paths: ${pair.variants.join(', ') || 'none'})`)
      }
      notes.push(...reach.problems.map(problem => `analyzer problem: ${problem}`))
    }
    checks.push({ id: 'S7', item: 'the frozen analyzer reads the real data to the end, in N0 and in N1', status: status(failures), details: [...failures, ...notes] })
  }

  // S8 — photos stay out of git.
  {
    const failures = [
      ...input.trackedImages.map(file => `${file}: an image is tracked by git`),
      ...input.addableImages.map(file => `${file}: an image git would add (not ignored)`),
    ]
    checks.push({
      id: 'S8',
      item: 'photos do not enter git',
      status: status(failures),
      details: failures.length ? failures : ['no image is tracked under research/, and none in the repository is addable'],
    })
  }

  // S9 — physical transfer: back at V1 after V2, did the finger, the hand or the camera move?
  {
    const failures: string[] = []
    const notes: string[] = []
    let look = false
    const pct = (value: number) => `${fixed(value * 100, 1)}%`
    const returns = names.filter(name => name.view === 'V1' && name.shot === RETURN_SHOT)
    if (!returns.length) failures.push(`no return-to-V1 photo (S<n>-<N0|N1>-V1-${RETURN_SHOT}, taken after V2): the physical transfer is unchecked`)
    for (const name of returns) {
      const first = raws.get(`${name.session}-${name.nailSet}-V1-1`)
      if (!first) {
        failures.push(`${name.captureId}: no ${name.session}-${name.nailSet}-V1-1 to compare with`)
        continue
      }
      const result = transferBetween(first, raws.get(name.captureId)!)
      if (!result) {
        failures.push(`${name.captureId}: palm or index landmarks missing, the transfer cannot be measured`)
        continue
      }
      const repeat = raws.get(`${name.session}-${name.nailSet}-V1-2`)
      const floor = repeat ? transferBetween(first, repeat) : null
      const line =
        `${name.captureId} vs V1-1: index finger ${pct(result.fingerResidual)} of PIP–DIP off after the palm fit; palm ${pct(result.translation)}, ${fixed(result.rotationDeg, 2)}°, scale ${fixed(result.scaleChangePct, 2)}%` +
        (floor ? ` (unmoved repeat V1-2: finger ${pct(floor.fingerResidual)}, palm ${pct(floor.translation)})` : '')
      if (result.fingerResidual > TRANSFER_LIMITS.fingerFail) failures.push(`${line} — the finger moved against the palm during the transfer`)
      else if (result.fingerResidual > TRANSFER_LIMITS.fingerPass) {
        look = true
        notes.push(`${line} — the finger may have moved; compare the overlays`)
      } else notes.push(line)
      if (
        result.translation > TRANSFER_LIMITS.translation ||
        Math.abs(result.rotationDeg) > TRANSFER_LIMITS.rotationDeg ||
        Math.abs(result.scaleChangePct) > TRANSFER_LIMITS.scaleChangePct
      ) {
        look = true
        notes.push(`${name.captureId}: the camera endpoint did not return to the same position / orientation, or the whole hand moved (not separable without fixed marks)`)
      }
    }
    checks.push({ id: 'S9', item: 'physical transfer: back at V1 after V2, nothing moved', status: status(failures, look), details: [...failures, ...notes] })
  }

  // S10 — the blind DIP / PIP path: crops planned, marked, and mapped back onto the upright image.
  {
    const failures: string[] = []
    const key = input.blindKey ?? null
    const marked = names.filter(name => name.shot === 1)
    if (!key) failures.push('blind/key.json not found: the blind DIP / PIP path was not run (blind-cli.ts plan)')
    else {
      if (key.kind !== 'stage10-blind-key') failures.push('blind/key.json is not a Stage 10 blind key')
      failures.push(...key.unplanned.map(entry => `not planned: ${entry}`))
      for (const name of marked) {
        for (const pass of [1, 2] as const) {
          if (!key.entries.some(entry => entry.captureId === name.captureId && entry.pass === pass)) failures.push(`${name.captureId}: no pass-${pass} crop in the key`)
        }
      }
      for (const entry of key.entries) if (/S\d|N[01]|V[12]|CAL/.test(entry.blindId)) failures.push(`${entry.blindId}: the crop's ID gives the photo away`)
    }
    if (!input.blindCsv) failures.push('annotations-blind.csv not found: the blind marks were not merged (blind-cli.ts merge)')
    else if (blind) {
      if (blind.rows.some(row => row.point !== 'indexDIP' && row.point !== 'indexPIP')) failures.push('annotations-blind.csv carries points other than indexDIP / indexPIP')
      for (const entry of key?.entries ?? []) {
        for (const point of ['indexDIP', 'indexPIP'] as const) {
          const row = blind.rows.find(r => r.captureId === entry.captureId && r.pass === entry.pass && r.point === point)
          if (!row) {
            failures.push(`${entry.blindId} (${entry.captureId}, pass ${entry.pass}): no ${point}`)
            continue
          }
          const [u, v] = toCrop(entry.crop, row.x, row.y)
          if (u < -0.5 || v < -0.5 || u > entry.crop.width + 0.5 || v > entry.crop.height + 0.5) {
            failures.push(`${entry.captureId} pass ${entry.pass} ${point}: maps outside its crop — the key and the marks do not belong together`)
          }
        }
      }
    }
    if (annotation?.rows.some(row => row.point === 'indexDIP' || row.point === 'indexPIP')) failures.push('annotations.csv carries indexDIP / indexPIP: marked unblinded (they belong to the blind crops)')
    checks.push({
      id: 'S10',
      item: 'blind DIP / PIP path: crops, marks, back onto the upright image',
      status: status(failures, true),
      details: [
        ...failures,
        `${key?.entries.length ?? 0} crops in the key; S4 checks the mapped-back marks against Vision's joints`,
        'open the crops of both passes: the DIP and PIP creases must be inside them, the nail and any tip must not',
      ],
    })
  }

  // S11 — the capture record: geometry, session log, capture times, shot order, lens.
  {
    const failures: string[] = [...checkConditions(input.conditions ?? undefined)]
    const notes: string[] = []
    let look = false
    const photos = ids.filter(id => !id.startsWith(NEGATIVE_CONTROL_PREFIX))
    const time = (id: string) => captureTimeValue(String(raws.get(id)?.capturedAtLocal ?? ''))
    const untimed = photos.filter(id => !Number.isFinite(time(id)))
    if (untimed.length) failures.push(`no capture time (EXIF DateTimeOriginal) for ${untimed.join(', ')}`)
    const sessions = [...new Set(names.map(name => name.session))]
    for (const session of sessions) {
      const shots = names.filter(name => name.session === session && Number.isFinite(time(name.captureId))).sort((a, b) => shotOrder(a) - shotOrder(b))
      for (let k = 1; k < shots.length; k += 1) {
        if (time(shots[k].captureId) < time(shots[k - 1].captureId)) {
          failures.push(`${session}: ${shots[k].captureId} was taken before ${shots[k - 1].captureId} — the protocol order is V1 1, 2 → V2 1, 2 → V1 ${RETURN_SHOT}`)
        }
      }
    }
    const lenses = new Set(
      photos.map(id => {
        const lens = raws.get(id)!.lens
        return `${String(lens?.model ?? 'lens ?')}, ${String(lens?.focalLength35mm ?? '?')} mm (35 mm eq.)`
      }),
    )
    if (lenses.size > 1) {
      look = true
      notes.push(`more than one lens or focal length among the photos (${[...lenses].join(' | ')}): a lens switch changes the projection — lock the lens`)
    } else if (lenses.size) notes.push(`every photo: ${[...lenses][0]}`)
    const views = (input.conditions?.views ?? {}) as Record<string, Record<string, unknown> | undefined>
    for (const view of ['V1', 'V2']) {
      const entry = views[view]
      if (entry) notes.push(`${view}: ${String(entry.lens)}, zoom ${String(entry.zoom)}, ${String(entry.distanceCm)} cm, endpoint: ${String(entry.endpoint)}`)
    }
    checks.push({ id: 'S11', item: 'capture record: geometry, session log, capture times and order, lens', status: status(failures, look), details: [...failures, ...notes] })
  }

  return checks
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

export const renderSmokeChecks = (checks: readonly SmokeCheck[], header: { dataDir: string; kitCommit?: string }): string => {
  const lines = [
    '# Stage 10A — capture pipeline smoke check',
    '',
    `Data: \`${header.dataDir}\`${header.kitCommit ? ` · kit ${header.kitCommit}` : ''}`,
    '',
    '**Plumbing only.** No accuracy, repeatability or F0/F3dNoTip conclusion is drawn from these photos, and none of them is used in Stage 10B.',
    '',
    '| | check | status |',
    '| --- | --- | --- |',
    ...checks.map(check => `| ${check.id} | ${check.item} | **${check.status}** |`),
    '',
  ]
  for (const check of checks) {
    lines.push(`## ${check.id} — ${check.item}: ${check.status}`, '', ...check.details.map(detail => `- ${detail}`), '')
  }
  return `${lines.join('\n')}\n`
}

/** What analyze.ts --smoke prints: which stage each capture reached, and no numbers that could be read as a result. */
export const renderSmokeReport = (reach: SmokeReach, header: { title: string; kitCommit?: string }): string => {
  const lines = [
    `# ${header.title}`,
    '',
    `kit v${reach.kitVersion}${header.kitCommit ? ` @ ${header.kitCommit}` : ''}`,
    '',
    '**Stage 10A smoke run: the pipeline only.** The Stage 10 verdict is not evaluated and no metric is printed — nothing here is accuracy, repeatability or an F0 / F3dNoTip comparison.',
    '',
    `- Calibration frames: ${reach.counts.calibration}; H1 profile ${reach.calibration.profileBuilt ? 'built' : 'NOT built'}${reach.calibration.refused.length ? ` (refused: ${reach.calibration.refused.join('; ')})` : ''}`,
    `- Captures named by the protocol: ${reach.counts.captures}; annotated pairs: ${reach.counts.annotatedPairs}; poses accepted: ${reach.counts.posesAccepted}`,
    ...(['N0', 'N1'] as const).map(set => {
      const c = reach.conditions[set]
      return `- ${set}: attempted ${c.attempted}, available ${c.available}, pose accepted ${c.poseAccepted}, F0 and F3dNoTip both reached ${c.primaryEligible}`
    }),
    '',
    '| pair | pose | profile mismatch px | frames reached | annotation paths | cuticle probe | full socket | notes |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ]
  for (const pair of reach.pairs) {
    lines.push(
      `| ${pair.session} ${pair.nailSet} shot ${pair.shot} | ${pair.pose.accepted ? 'accepted' : `refused (${pair.pose.refusedReason ?? '?'})`} | ${fixed(pair.pose.mismatchPx)} | ${pair.framesReached.join(' ') || '—'} | ${pair.variants.join(' ') || '—'} | ${pair.cuticleProbe ? 'yes' : 'no'} | ${pair.fullSocket ? 'yes' : 'no'} | ${pair.notes.join('; ') || '—'} |`,
    )
  }
  lines.push('', reach.protocol.length ? '**Protocol notes:**' : 'No protocol note.', ...reach.protocol.map(note => `- ${note}`))
  lines.push('', reach.problems.length ? '**Problems:**' : 'No problems reported.', ...reach.problems.map(problem => `- ${problem}`))
  return `${lines.join('\n')}\n`
}

/** The overlay drawn over an upright copy: Vision's joints and the hand-marked points, for the eye. */
export const overlaySvg = (raw: unknown, imageFile: string, rows: readonly AnnotationRow[]): string => {
  const observation = raw as RawObservation
  const width = Number(observation.image?.width)
  const height = Number(observation.image?.height)
  const r = Math.max(width, height) / 250
  const font = r * 2.4
  const out: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<image href="${imageFile}" x="0" y="0" width="${width}" height="${height}"/>`,
  ]
  const wrist = landmarkOf(observation, 'wrist')
  const chains: string[][] = [
    ['thumbMCP', 'thumbPIP', 'thumbDIP', 'thumbTIP'],
    ...FINGERS.map(finger => ['MCP', 'PIP', 'DIP', 'TIP'].map(joint => `${finger}${joint}`)),
  ]
  for (const chain of chains) {
    const points = [wrist, ...chain.map(name => landmarkOf(observation, name))].filter((p): p is Px => p !== null)
    out.push(`<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="#00e5ff" stroke-width="${r / 2}" opacity="0.8"/>`)
  }
  for (const name of LANDMARK_NAMES) {
    const at = landmarkOf(observation, name)
    if (!at) continue
    const isIndex = name.startsWith('index')
    out.push(`<circle cx="${at[0]}" cy="${at[1]}" r="${isIndex ? r * 1.3 : r}" fill="${isIndex ? '#ffea00' : '#00e5ff'}" stroke="#000" stroke-width="${r / 4}"/>`)
    if (isIndex || name === 'wrist' || name === 'thumbMCP' || name === 'pinkyMCP') {
      out.push(`<text x="${at[0] + r * 1.8}" y="${at[1] - r}" font-size="${font}" fill="#ffea00" stroke="#000" stroke-width="${r / 6}">${name}</text>`)
    }
  }
  for (const row of rows) {
    const s = r * 1.4
    const colour = row.pass === 1 ? '#ff2bd6' : '#ff8a00'
    out.push(
      `<path d="M${row.x - s},${row.y - s}L${row.x + s},${row.y + s}M${row.x - s},${row.y + s}L${row.x + s},${row.y - s}" stroke="${colour}" stroke-width="${r / 2.5}"/>`,
      `<text x="${row.x + r * 1.8}" y="${row.y + r * 2.5}" font-size="${font * 0.8}" fill="${colour}" stroke="#000" stroke-width="${r / 8}">${row.point}${row.pass === 2 ? ' (2)' : ''}</text>`,
    )
  }
  out.push('</svg>')
  return `${out.join('\n')}\n`
}

/** Which captures the protocol knows; MIRROR-* and other names are reported, not analysed. */
export const describeIds = (ids: readonly string[]) => ({
  calibration: ids.filter(isCalibrationName),
  captures: ids.filter(id => parseCaptureName(id)),
  other: ids.filter(id => !isCalibrationName(id) && !parseCaptureName(id)),
})
