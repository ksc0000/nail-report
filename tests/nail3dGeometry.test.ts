// CND -> vertex data. No three.js, no WebGL: the shape of a nail is pure
// geometry and is verified here against the same contract fixtures the
// renderer will consume.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { NAIL_SHAPES, parseHandProfile, planNail3DRender } from '../src/lib/nail3dContract.ts'
import type { NailGeometry, NailShape, NailSocket } from '../src/lib/nail3dContract.ts'
import {
  DEFAULT_SEGMENTS_U,
  DEFAULT_SEGMENTS_V,
  buildNailMesh,
  buildPlacedNails,
  socketMatrix,
} from '../src/lib/nail3dGeometry.ts'
import type { NailMesh } from '../src/lib/nail3dGeometry.ts'

const FIXTURE_DIR = new URL('../contracts/nail3d/v1/fixtures/', import.meta.url)
const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(new URL(`${name}.json`, FIXTURE_DIR), 'utf-8'))

const socket = (over: Partial<NailSocket> = {}): NailSocket => ({
  finger: 'index',
  origin: [0, 0, 0],
  normal: [0, 0, 1],
  tangent: [0, 1, 0],
  bedWidth: 0.012,
  bedLength: 0.014,
  confidence: 0.9,
  ...over,
})

const geometry = (over: Partial<NailGeometry> = {}): NailGeometry => ({
  shape: 'almond',
  curveV: 0.4,
  curveH: 0.3,
  length: 0.018,
  thickness: 0.0006,
  confidence: 0.9,
  ...over,
})

const axis = (m: readonly number[], i: number): [number, number, number] =>
  [m[i * 4], m[i * 4 + 1], m[i * 4 + 2]]
const norm = (v: readonly number[]): number => Math.hypot(v[0], v[1], v[2])
const dot = (a: readonly number[], b: readonly number[]): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const everyFinite = (values: readonly number[]): boolean => values.every(Number.isFinite)

const assertMeshIsSane = (mesh: NailMesh, label: string) => {
  assert.ok(everyFinite(mesh.positions), `${label}: NaN/Infinity in positions`)
  assert.ok(everyFinite(mesh.normals), `${label}: NaN/Infinity in normals`)
  assert.ok(everyFinite(mesh.uvs), `${label}: NaN/Infinity in uvs`)
  assert.equal(mesh.positions.length % 3, 0, `${label}: positions not xyz triples`)
  assert.equal(mesh.normals.length, mesh.positions.length, `${label}: normal count`)
  assert.equal((mesh.uvs.length / 2) * 3, mesh.positions.length, `${label}: uv count`)
  assert.equal(mesh.indices.length % 3, 0, `${label}: indices not triangles`)

  const vertexCount = mesh.positions.length / 3
  for (const index of mesh.indices) {
    assert.ok(
      Number.isInteger(index) && index >= 0 && index < vertexCount,
      `${label}: index ${index} out of range`,
    )
  }
  for (let i = 0; i < mesh.normals.length; i += 3) {
    const len = Math.hypot(mesh.normals[i], mesh.normals[i + 1], mesh.normals[i + 2])
    assert.ok(Math.abs(len - 1) < 1e-6, `${label}: normal not unit length (${len})`)
  }
  for (const uv of mesh.uvs) {
    assert.ok(uv >= 0 && uv <= 1, `${label}: uv out of [0,1] (${uv})`)
  }
}

const extent = (mesh: NailMesh, component: 0 | 1 | 2) => {
  let min = Infinity
  let max = -Infinity
  for (let i = component; i < mesh.positions.length; i += 3) {
    min = Math.min(min, mesh.positions[i])
    max = Math.max(max, mesh.positions[i])
  }
  return { min, max }
}

// ---------------------------------------------------------------------------
// socketMatrix
// ---------------------------------------------------------------------------

test('socketMatrix builds an orthonormal right-handed basis at the socket origin', () => {
  const m = socketMatrix(socket({ origin: [0.01, -0.02, 0.03] }))
  assert.ok(m)
  assert.equal(m.length, 16)

  const [x, y, z] = [axis(m, 0), axis(m, 1), axis(m, 2)]
  for (const [name, v] of [['x', x], ['y', y], ['z', z]] as const) {
    assert.ok(Math.abs(norm(v) - 1) < 1e-9, `${name} axis not unit length`)
  }
  assert.ok(Math.abs(dot(x, y)) < 1e-9, 'x and y not perpendicular')
  assert.ok(Math.abs(dot(y, z)) < 1e-9, 'y and z not perpendicular')
  assert.ok(Math.abs(dot(x, z)) < 1e-9, 'x and z not perpendicular')

  // Right-handed: x cross y == z
  const cross = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  for (let i = 0; i < 3; i += 1) assert.ok(Math.abs(cross[i] - z[i]) < 1e-9, 'basis is left-handed')

  assert.deepEqual([m[12], m[13], m[14], m[15]], [0.01, -0.02, 0.03, 1])
})

test('socketMatrix re-orthogonalizes a normal that is not perpendicular to the tangent', () => {
  // A scan will rarely produce an exactly orthogonal pair.
  const m = socketMatrix(socket({ tangent: [0, 1, 0], normal: [0, 0.4, 1] }))
  assert.ok(m)
  const [y, z] = [axis(m, 1), axis(m, 2)]
  assert.ok(Math.abs(dot(y, z)) < 1e-9, 'axes not re-orthogonalized')
})

test('socketMatrix rejects degenerate axes instead of guessing a pose', () => {
  assert.equal(socketMatrix(socket({ tangent: [0, 0, 0] })), null)
  assert.equal(socketMatrix(socket({ normal: [0, 0, 0] })), null)
  // normal parallel to tangent leaves nothing to orthogonalize
  assert.equal(socketMatrix(socket({ tangent: [0, 1, 0], normal: [0, 2, 0] })), null)
})

// ---------------------------------------------------------------------------
// buildNailMesh
// ---------------------------------------------------------------------------

for (const shape of NAIL_SHAPES) {
  test(`buildNailMesh produces a sane mesh for shape: ${shape}`, () => {
    const mesh = buildNailMesh(geometry({ shape: shape as NailShape }), socket())
    assert.ok(mesh)
    assertMeshIsSane(mesh, shape)
  })
}

test('mesh is a closed shell: top, bottom and rim', () => {
  const mesh = buildNailMesh(geometry(), socket())
  assert.ok(mesh)

  const nu = DEFAULT_SEGMENTS_U
  const nv = DEFAULT_SEGMENTS_V
  const gridVertices = (nu + 1) * (nv + 1)
  assert.equal(mesh.positions.length / 3, gridVertices * 2, 'expected top + bottom grids')

  const surfaceTris = nu * nv * 2 * 2 // top + bottom
  const rimQuads = 2 * nu + 2 * nv // perimeter segments
  assert.equal(mesh.indices.length / 3, surfaceTris + rimQuads * 2)
})

test('mesh stays inside the nail bed width and runs from cuticle to tip', () => {
  const s = socket({ bedWidth: 0.012 })
  const g = geometry({ shape: 'square', length: 0.018 })
  const mesh = buildNailMesh(g, s)
  assert.ok(mesh)

  const x = extent(mesh, 0)
  assert.ok(x.max <= s.bedWidth / 2 + 1e-12, 'nail is wider than its bed')
  assert.ok(x.min >= -s.bedWidth / 2 - 1e-12, 'nail is wider than its bed')
  // A square nail keeps nearly full width, so it should use most of the bed.
  assert.ok(x.max > s.bedWidth / 2 * 0.9, 'square nail unexpectedly narrow')

  const y = extent(mesh, 1)
  assert.ok(Math.abs(y.min) < 1e-12, 'nail does not start at the cuticle')
  assert.ok(Math.abs(y.max - g.length) < 1e-12, 'nail does not reach its tip length')
})

test('tapered shapes narrow toward the tip, square does not', () => {
  const s = socket()
  const widthAtTip = (shape: NailShape): number => {
    const mesh = buildNailMesh(geometry({ shape }), s)
    assert.ok(mesh)
    // Last row of the top grid is the tip.
    const rowStride = DEFAULT_SEGMENTS_U + 1
    const first = DEFAULT_SEGMENTS_V * rowStride
    const last = first + DEFAULT_SEGMENTS_U
    return Math.abs(mesh.positions[last * 3] - mesh.positions[first * 3])
  }

  const square = widthAtTip('square')
  assert.ok(widthAtTip('stiletto') < square * 0.2, 'stiletto should taper to a point')
  assert.ok(widthAtTip('almond') < square * 0.3, 'almond should taper')
  assert.ok(widthAtTip('coffin') < square * 0.6, 'coffin should taper to a flat tip')
  assert.ok(widthAtTip('coffin') > widthAtTip('stiletto'), 'coffin tip is wider than stiletto')
  assert.ok(square > s.bedWidth * 0.8, 'square should stay near full width')
})

test('a pointed tip is a thin edge, not a zero-area singularity', () => {
  const mesh = buildNailMesh(geometry({ shape: 'stiletto' }), socket())
  assert.ok(mesh)
  const rowStride = DEFAULT_SEGMENTS_U + 1
  const first = DEFAULT_SEGMENTS_V * rowStride
  const last = first + DEFAULT_SEGMENTS_U
  const tipWidth = Math.abs(mesh.positions[last * 3] - mesh.positions[first * 3])
  assert.ok(tipWidth > 0, 'tip collapsed to a point, normals would be undefined')
  assertMeshIsSane(mesh, 'stiletto tip')
})

test('curveV curls the tip downward and curveH arches the cross-section', () => {
  const flat = buildNailMesh(geometry({ curveV: 0, curveH: 0 }), socket())
  const curled = buildNailMesh(geometry({ curveV: 1, curveH: 0 }), socket())
  const arched = buildNailMesh(geometry({ curveV: 0, curveH: 1 }), socket())
  assert.ok(flat && curled && arched)

  assert.ok(extent(flat, 2).max - extent(flat, 2).min > 0, 'flat nail should still have thickness')
  assert.ok(extent(curled, 2).min < extent(flat, 2).min, 'curveV did not curl the tip down')
  assert.ok(extent(arched, 2).min < extent(flat, 2).min, 'curveH did not arch the cross-section')
})

test('thickness separates the top and bottom surfaces', () => {
  const thin = buildNailMesh(geometry({ thickness: 0.0003, curveV: 0, curveH: 0 }), socket())
  const thick = buildNailMesh(geometry({ thickness: 0.0020, curveV: 0, curveH: 0 }), socket())
  assert.ok(thin && thick)
  const span = (m: NailMesh) => extent(m, 2).max - extent(m, 2).min
  assert.ok(Math.abs(span(thin) - 0.0003) < 1e-9)
  assert.ok(Math.abs(span(thick) - 0.0020) < 1e-9)
})

test('buildNailMesh rejects degenerate dimensions instead of emitting bad geometry', () => {
  assert.equal(buildNailMesh(geometry({ length: 0 }), socket()), null)
  assert.equal(buildNailMesh(geometry({ thickness: 0 }), socket()), null)
  assert.equal(buildNailMesh(geometry(), socket({ bedWidth: 0 })), null)
})

test('segment counts are honoured and clamped to a usable minimum', () => {
  const coarse = buildNailMesh(geometry(), socket(), { segmentsU: 2, segmentsV: 2 })
  assert.ok(coarse)
  assert.equal(coarse.positions.length / 3, 3 * 3 * 2)

  const clamped = buildNailMesh(geometry(), socket(), { segmentsU: 0, segmentsV: -5 })
  assert.ok(clamped)
  assert.equal(clamped.positions.length / 3, 3 * 3 * 2, 'segments should clamp to 2, not collapse')
})

// ---------------------------------------------------------------------------
// contract fixtures -> placed meshes
// ---------------------------------------------------------------------------

test('a valid full NailSet becomes five placed meshes in finger order', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-right'),
  })
  assert.equal(plan.level, 'L2')
  if (plan.level !== 'L2') return

  const placed = buildPlacedNails(plan.nails, plan.handProfile)
  assert.deepEqual(
    placed.map(p => p.finger),
    ['thumb', 'index', 'middle', 'ring', 'pinky'],
  )
  for (const nail of placed) {
    assertMeshIsSane(nail.mesh, nail.finger)
    assert.equal(nail.matrix.length, 16)
    assert.ok(nail.textureRef.length > 0)
    assert.ok(nail.heightMapRef)
  }
})

test('a partial NailSet produces only the nails it has, inventing nothing', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-partial'),
    handProfile: fixture('handprofile-valid-right'),
  })
  assert.equal(plan.level, 'L2')
  if (plan.level !== 'L2') return

  const placed = buildPlacedNails(plan.nails, plan.handProfile)
  assert.deepEqual(placed.map(p => p.finger), ['thumb', 'index', 'middle'])
})

test('nails whose socket is missing are dropped, not misplaced', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-partial-sockets'),
  })
  assert.equal(plan.level, 'L2')
  if (plan.level !== 'L2') return

  const placed = buildPlacedNails(plan.nails, plan.handProfile)
  assert.deepEqual(placed.map(p => p.finger), ['thumb', 'index', 'middle'])
})

test('a nail with a degenerate socket is dropped rather than rendered in a guessed pose', () => {
  const profile = parseHandProfile(fixture('handprofile-valid-right'))
  assert.ok(profile)
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-right'),
  })
  if (plan.level !== 'L2') throw new Error('expected L2')

  const broken = {
    ...profile,
    nailSockets: profile.nailSockets.map(s =>
      s.finger === 'ring' ? { ...s, tangent: [0, 0, 0] as [number, number, number] } : s,
    ),
  }
  const placed = buildPlacedNails(plan.nails, broken)
  assert.deepEqual(placed.map(p => p.finger), ['thumb', 'index', 'middle', 'pinky'])
})

test('two NailSets on the same socket produce identical placement (swap comparison)', () => {
  // The point of Personal Hand Base + Replaceable Nail Set: changing the nail
  // must not move the hand. Same socket, different geometry -> same matrix.
  const s = socket({ finger: 'middle' })
  const a = socketMatrix(s)
  const b = socketMatrix(s)
  assert.deepEqual(a, b)

  const january = buildNailMesh(geometry({ shape: 'almond', length: 0.018 }), s)
  const february = buildNailMesh(geometry({ shape: 'coffin', length: 0.022 }), s)
  assert.ok(january && february)
  // Both start at the cuticle in the same place; only the free edge differs.
  assert.equal(january.positions[1], february.positions[1])
  assert.ok(extent(february, 1).max > extent(january, 1).max)
})
