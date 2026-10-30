// Layer A — ScanObservation parsing and the semantic nail-bed annotation.
//
// Two things are being pinned here:
//   - the bed is described by NAMED anatomical points, not an anonymous quad,
//     so a pixel-mask generator can later emit the same names;
//   - nothing estimated can get into Layer A, because once raw observations
//     and derived values are mixed the estimator can no longer be replaced.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BED_QUAD_ORDER,
  NAIL_BED_POINTS,
  OBSERVATION_SCHEMA_VERSION,
  REQUIRED_BED_POINTS,
  bedQuad2D,
  parseScanObservation,
} from '../src/lib/nail3dObservation.ts'
import type { NailBedAnnotation, ScanObservation } from '../src/lib/nail3dObservation.ts'
import { syntheticHand } from './support/syntheticHand.ts'
import { projectToObservation } from './support/syntheticProjection.ts'

const valid = (): Record<string, unknown> =>
  JSON.parse(JSON.stringify(projectToObservation(syntheticHand()))) as Record<string, unknown>

const expectErrors = (input: unknown, matcher: RegExp): string[] => {
  const result = parseScanObservation(input)
  assert.equal(result.ok, false, 'expected the observation to be rejected')
  if (result.ok) throw new Error('unreachable')
  assert.ok(
    result.errors.some(error => matcher.test(error)),
    `no error matched ${matcher}: ${JSON.stringify(result.errors)}`,
  )
  return result.errors
}

const parsed = (input: unknown): ScanObservation => {
  const result = parseScanObservation(input)
  assert.ok(result.ok, `expected ok, got ${JSON.stringify(result.ok ? null : result.errors)}`)
  if (!result.ok) throw new Error('unreachable')
  return result.value
}

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

test('a projected synthetic capture parses as a Layer A observation', () => {
  const observation = parsed(valid())
  assert.equal(observation.schemaVersion, OBSERVATION_SCHEMA_VERSION)
  assert.equal(observation.landmarks.length, 21)
  assert.equal(observation.nails.length, 1)
  assert.equal(observation.image.coordinateOrigin, 'topLeft')
  assert.equal(observation.image.units, 'pixels')
  assert.ok(Array.isArray(observation.missing))
})

test('camera is optional, and its absence is recorded rather than guessed', () => {
  const input = valid()
  delete input.camera
  const observation = parsed(input)
  assert.equal(observation.camera, undefined)
  assert.ok(observation.missing.includes('camera.focalLengthPx'))
})

test('a landmark the detector did not report is null, not zero', () => {
  const input = JSON.parse(
    JSON.stringify(projectToObservation(syntheticHand(), { omitLandmarks: ['middleDIP'] })),
  )
  const observation = parsed(input)
  const middleDip = observation.landmarks.find(landmark => landmark.name === 'middleDIP')
  assert.ok(middleDip)
  assert.equal(middleDip.x, null)
  assert.equal(middleDip.y, null)
  assert.equal(middleDip.confidence, null)
})

// ---------------------------------------------------------------------------
// Layer A holds observations only
// ---------------------------------------------------------------------------

for (const key of ['landmarks3d', 'handFrame', 'socket', 'liftVersion', 'depth', 'bedQuads3d']) {
  test(`a derived field is rejected, not ignored: ${key}`, () => {
    const input = valid()
    input[key] = {}
    expectErrors(input, new RegExp(`^${key}: derived values must not be stored in Layer A`))
  })
}

test('a skeleton-derived bed point is rejected — that is an estimate, not an observation', () => {
  const input = valid()
  const nails = input.nails as Array<Record<string, unknown>>
  const points = nails[0].points as Record<string, Record<string, unknown>>
  points.cuticleSideA.source = 'skeletonPrior'
  expectErrors(input, /source must be one of manual \| maskDerived/)
})

test('maskDerived is accepted, so an automatic generator can replace the annotator', () => {
  const input = valid()
  const nails = input.nails as Array<Record<string, unknown>>
  const points = nails[0].points as Record<string, Record<string, unknown>>
  for (const name of Object.keys(points)) points[name].source = 'maskDerived'
  const observation = parsed(input)
  assert.equal(observation.nails[0].points.cuticleSideA?.source, 'maskDerived')
})

test('missing must be present even when empty', () => {
  const input = valid()
  delete input.missing
  expectErrors(input, /^missing: required array/)
})

test('pixel coordinates and a top-left origin are enforced', () => {
  const normalized = valid()
  ;(normalized.image as Record<string, unknown>).units = 'normalized'
  expectErrors(normalized, /image\.units: must be "pixels"/)

  const bottomLeft = valid()
  ;(bottomLeft.image as Record<string, unknown>).coordinateOrigin = 'bottomLeft'
  expectErrors(bottomLeft, /image\.coordinateOrigin: must be "topLeft"/)
})

test('a half-present landmark is rejected rather than half-trusted', () => {
  const input = valid()
  const landmarks = input.landmarks as Array<Record<string, unknown>>
  landmarks[0].y = null
  expectErrors(input, /x and y must both be present or both null/)
})

test('a malformed camera is rejected instead of being partly believed', () => {
  const input = valid()
  input.camera = { focalLengthPx: 'long', principalPointPx: [1, 2], source: 'assumed' }
  expectErrors(input, /camera: malformed/)
})

// ---------------------------------------------------------------------------
// The bed is semantic, not an anonymous quad
// ---------------------------------------------------------------------------

test('every required bed point is named and its absence is reported by name', () => {
  assert.deepEqual(REQUIRED_BED_POINTS, ['cuticleSideA', 'cuticleSideB', 'freeEdgeSideA', 'freeEdgeSideB'])
  for (const required of REQUIRED_BED_POINTS) {
    const input = valid()
    const nails = input.nails as Array<Record<string, unknown>>
    delete (nails[0].points as Record<string, unknown>)[required]
    expectErrors(input, new RegExp(`points\\.${required}: required and absent`))
  }
})

test('optional bed points are accepted and carried through', () => {
  const input = valid()
  const nails = input.nails as Array<Record<string, unknown>>
  const points = nails[0].points as Record<string, unknown>
  points.cuticleApex = { x: 100, y: 200, confidence: 0.8, source: 'manual' }
  points.bedWallSideA = { x: 90, y: 210, confidence: null, source: 'maskDerived' }
  const observation = parsed(input)
  assert.ok(observation.nails[0].points.cuticleApex)
  assert.ok(observation.nails[0].points.bedWallSideA)
  // All optional names are part of the vocabulary a mask generator can target.
  assert.ok(NAIL_BED_POINTS.includes('cuticleApex'))
  assert.ok(NAIL_BED_POINTS.includes('bedWallSideB'))
})

test('an unknown point name is rejected so the vocabulary stays shared', () => {
  const input = valid()
  const nails = input.nails as Array<Record<string, unknown>>
  ;(nails[0].points as Record<string, unknown>).nailCentre = {
    x: 1,
    y: 2,
    confidence: null,
    source: 'manual',
  }
  expectErrors(input, /points\.nailCentre: not a known nail-bed landmark/)
})

test('sideAToward is required so "side A" means the same thing to a person and a mask', () => {
  const input = valid()
  const nails = input.nails as Array<Record<string, unknown>>
  delete nails[0].sideAToward
  expectErrors(input, /sideAToward: must be "thumb" or "pinky"/)
})

test('bedQuad2D orders the named points into the quad the estimator expects', () => {
  const observation = parsed(valid())
  const quad = bedQuad2D(observation.nails[0])
  assert.ok(quad)
  assert.equal(quad.length, 4)
  assert.deepEqual(BED_QUAD_ORDER, ['cuticleSideA', 'cuticleSideB', 'freeEdgeSideB', 'freeEdgeSideA'])
  // Proximal edge first: the first two are the cuticle corners.
  assert.deepEqual(quad[0], observation.nails[0].points.cuticleSideA)
  assert.deepEqual(quad[1], observation.nails[0].points.cuticleSideB)
})

test('bedQuad2D refuses an incomplete bed rather than closing the quad itself', () => {
  const observation = parsed(valid())
  const partial: NailBedAnnotation = {
    ...observation.nails[0],
    points: { cuticleSideA: observation.nails[0].points.cuticleSideA },
  }
  assert.equal(bedQuad2D(partial), null)
})

test('a free-edge outline may be recorded but is kept out of the bed quad', () => {
  const input = valid()
  const nails = input.nails as Array<Record<string, unknown>>
  nails[0].freeEdgeOutline = [
    [10, 20],
    [30, 40],
  ]
  const observation = parsed(input)
  assert.equal(observation.nails[0].freeEdgeOutline?.length, 2)
  const quad = bedQuad2D(observation.nails[0])
  assert.ok(quad)
  // The quad is still the four bed corners; the free edge took no part in it.
  assert.equal(quad.length, 4)
})
