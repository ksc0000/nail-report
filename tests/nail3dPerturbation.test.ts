// Controlled socket perturbation (#405 perceptual calibration).
//
// The calibration is only worth anything if the amount shown on the slider is
// the amount actually injected, and if each knob moves one thing and nothing
// else. These tests pin both.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  NO_PERTURBATION,
  metricCorrespondence,
  perturbHandProfile,
  perturbSocket,
  perturbationFor,
} from '../src/lib/nail3dPerturbation.ts'
import type { OriginAxis, SizeMode } from '../src/lib/nail3dPerturbation.ts'
import type { HandProfile, NailSocket } from '../src/lib/nail3dContract.ts'
import { angleBetweenDeg, distance, dot, normalize, scale, sub } from '../src/lib/vec3.ts'
import type { Vec3 } from '../src/lib/vec3.ts'

// Deliberately not axis-aligned, so an accidental axis mix-up shows up, but
// orthogonal, as a well-formed socket is.
const TANGENT = normalize([0.05, 0.99, -0.13]) as Vec3
const NORMAL = normalize(
  sub([0.2, 0.1, 0.97], scale(TANGENT, dot([0.2, 0.1, 0.97], TANGENT))),
) as Vec3

const socket = (over: Partial<NailSocket> = {}): NailSocket => ({
  finger: 'index',
  origin: [0.011, -0.004, 0.082],
  normal: [NORMAL[0], NORMAL[1], NORMAL[2]],
  tangent: [TANGENT[0], TANGENT[1], TANGENT[2]],
  bedWidth: 0.0125,
  bedLength: 0.0142,
  confidence: 0.9,
  ...over,
})

const asVec = (value: readonly number[]): Vec3 => [value[0], value[1], value[2]]

const ANGLE_EPS_DEG = 1e-4

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

test('no perturbation leaves the socket untouched', () => {
  const base = socket()
  const result = perturbSocket(base, NO_PERTURBATION)
  assert.deepEqual(result.origin, base.origin)
  assert.equal(result.bedWidth, base.bedWidth)
  assert.equal(result.bedLength, base.bedLength)
  assert.ok((angleBetweenDeg(asVec(result.normal), asVec(base.normal)) ?? 9) < ANGLE_EPS_DEG)
  assert.ok((angleBetweenDeg(asVec(result.tangent), asVec(base.tangent)) ?? 9) < ANGLE_EPS_DEG)
})

test('a degenerate socket is returned unchanged rather than turned into NaN', () => {
  const broken = socket({ tangent: [0, 0, 0] })
  assert.deepEqual(perturbSocket(broken, { originShiftRatio: 0.2 }), broken)
  const parallel = socket({ tangent: [0, 0, 1], normal: [0, 0, 2] })
  assert.deepEqual(perturbSocket(parallel, { normalTiltDeg: 10 }), parallel)
})

// ---------------------------------------------------------------------------
// Origin shift — the T_pos knob
// ---------------------------------------------------------------------------

for (const ratio of [0.02, 0.05, 0.1, 0.2]) {
  test(`an origin shift of ${ratio} moves the origin by exactly that share of the bed length`, () => {
    const base = socket()
    const moved = perturbSocket(base, { originShiftRatio: ratio, originAxis: 'lateral' })
    const displacement = distance(asVec(moved.origin), asVec(base.origin))
    assert.ok(
      Math.abs(displacement / base.bedLength - ratio) < 1e-12,
      `expected ${ratio}, got ${displacement / base.bedLength}`,
    )
    // This is the quantity the threshold is recorded in.
    assert.ok(Math.abs(displacement - ratio * base.bedLength) < 1e-15)
  })
}

const axisChecks: Array<[OriginAxis, (base: NailSocket, direction: Vec3) => void]> = [
  [
    'lateral',
    (base, direction) => {
      assert.ok(Math.abs(dot(direction, asVec(base.tangent))) < 1e-9, 'lateral is not across the nail')
      assert.ok(Math.abs(dot(direction, asVec(base.normal))) < 1e-9, 'lateral is not in the nail plane')
    },
  ],
  [
    'longitudinal',
    (base, direction) => {
      assert.ok((angleBetweenDeg(direction, asVec(base.tangent)) ?? 9) < ANGLE_EPS_DEG)
    },
  ],
  [
    'normal',
    (base, direction) => {
      assert.ok((angleBetweenDeg(direction, asVec(base.normal)) ?? 9) < ANGLE_EPS_DEG)
    },
  ],
]

for (const [axis, check] of axisChecks) {
  test(`origin shift along "${axis}" uses the right direction`, () => {
    const base = socket()
    const moved = perturbSocket(base, { originShiftRatio: 0.1, originAxis: axis })
    check(base, sub(asVec(moved.origin), asVec(base.origin)))
  })
}

test('an origin shift moves nothing but the origin', () => {
  const base = socket()
  const moved = perturbSocket(base, { originShiftRatio: 0.25 })
  assert.equal(moved.bedWidth, base.bedWidth)
  assert.equal(moved.bedLength, base.bedLength)
  assert.ok((angleBetweenDeg(asVec(moved.normal), asVec(base.normal)) ?? 9) < ANGLE_EPS_DEG)
  assert.ok((angleBetweenDeg(asVec(moved.tangent), asVec(base.tangent)) ?? 9) < ANGLE_EPS_DEG)
})

// ---------------------------------------------------------------------------
// Normal tilt / tangent rotation — the T_normal and T_tangent knobs
// ---------------------------------------------------------------------------

for (const degrees of [1, 2, 5, 10, 20]) {
  test(`a normal tilt of ${degrees} degrees turns the normal by exactly that much`, () => {
    const base = socket()
    const tilted = perturbSocket(base, { normalTiltDeg: degrees })
    const measured = angleBetweenDeg(asVec(tilted.normal), asVec(base.normal))
    assert.ok(measured !== null)
    assert.ok(Math.abs(measured - degrees) < 1e-9, `expected ${degrees}, got ${measured}`)
    // Rolling about the finger axis must leave the finger axis alone.
    assert.ok((angleBetweenDeg(asVec(tilted.tangent), asVec(base.tangent)) ?? 9) < ANGLE_EPS_DEG)
    assert.deepEqual(tilted.origin, base.origin)
  })

  test(`a tangent rotation of ${degrees} degrees turns the tangent by exactly that much`, () => {
    const base = socket()
    const turned = perturbSocket(base, { tangentRotationDeg: degrees })
    const measured = angleBetweenDeg(asVec(turned.tangent), asVec(base.tangent))
    assert.ok(measured !== null)
    assert.ok(Math.abs(measured - degrees) < 1e-9, `expected ${degrees}, got ${measured}`)
    // Yawing about the surface normal must leave the surface normal alone.
    assert.ok((angleBetweenDeg(asVec(turned.normal), asVec(base.normal)) ?? 9) < ANGLE_EPS_DEG)
  })
}

test('normal tilt and tangent rotation can be combined without interfering', () => {
  const base = socket()
  const both = perturbSocket(base, { normalTiltDeg: 7, tangentRotationDeg: 11 })
  assert.ok(Math.abs((angleBetweenDeg(asVec(both.normal), asVec(base.normal)) ?? 0) - 7) < 1e-9)
  assert.ok(Math.abs((angleBetweenDeg(asVec(both.tangent), asVec(base.tangent)) ?? 0) - 11) < 1e-9)
})

// ---------------------------------------------------------------------------
// Size — the T_size knob
// ---------------------------------------------------------------------------

const sizeCases: Array<[SizeMode, boolean, boolean]> = [
  ['uniform', true, true],
  ['width', true, false],
  ['length', false, true],
]

for (const [mode, widthChanges, lengthChanges] of sizeCases) {
  test(`size mode "${mode}" scales only what it should`, () => {
    const base = socket()
    const scaled = perturbSocket(base, { sizeScaleRatio: 0.15, sizeMode: mode })
    const widthRatio = scaled.bedWidth / base.bedWidth
    const lengthRatio = scaled.bedLength / base.bedLength
    assert.ok(Math.abs(widthRatio - (widthChanges ? 1.15 : 1)) < 1e-12, `width ratio ${widthRatio}`)
    assert.ok(Math.abs(lengthRatio - (lengthChanges ? 1.15 : 1)) < 1e-12, `length ratio ${lengthRatio}`)
    assert.deepEqual(scaled.origin, base.origin)
  })
}

test('size never collapses to zero or negative', () => {
  const base = socket()
  const crushed = perturbSocket(base, { sizeScaleRatio: -5 })
  assert.ok(crushed.bedWidth > 0)
  assert.ok(crushed.bedLength > 0)
})

// ---------------------------------------------------------------------------
// HandProfile application
// ---------------------------------------------------------------------------

const profile = (): HandProfile => ({
  contractVersion: 1,
  reconstructionVersion: 1,
  handedness: 'right',
  boneLengths: Array.from({ length: 20 }, (_, i) => 0.03 + i * 0.002),
  fingerRadii: [0.0095, 0.0085, 0.0088, 0.008, 0.0068],
  canonicalPose: { wristOrigin: [0, 0, 0], palmNormal: [0, 1, 0], palmTangent: [0, 0, 1] },
  nailSockets: [socket({ finger: 'index' }), socket({ finger: 'middle' })],
  source: { deviceClass: 'test', capturedAt: '2026-10-06T00:00:00Z', sampleCount: 1 },
})

test('perturbHandProfile moves every socket by default', () => {
  const base = profile()
  const moved = perturbHandProfile(base, { originShiftRatio: 0.1 })
  moved.nailSockets.forEach((result, index) => {
    const original = base.nailSockets[index]
    const offset = distance(asVec(result.origin), asVec(original.origin)) / original.bedLength
    assert.ok(Math.abs(offset - 0.1) < 1e-12)
  })
  // The rest of the profile is untouched.
  assert.deepEqual(moved.boneLengths, base.boneLengths)
  assert.deepEqual(moved.canonicalPose, base.canonicalPose)
})

test('perturbHandProfile can target a single finger', () => {
  const base = profile()
  const moved = perturbHandProfile(base, { originShiftRatio: 0.1 }, ['middle'])
  assert.deepEqual(moved.nailSockets[0].origin, base.nailSockets[0].origin)
  assert.notDeepEqual(moved.nailSockets[1].origin, base.nailSockets[1].origin)
})

// ---------------------------------------------------------------------------
// Metric correspondence — what the recorded number means
// ---------------------------------------------------------------------------

test('origin, normal and tangent map to half the injected amount over a balanced pair', () => {
  // M1-M3 are scatter about the mean, so two captures sit half the injected
  // displacement from their midpoint. The UI shows both so a recorded
  // threshold is not misread by a factor of two.
  for (const dimension of ['origin', 'normal', 'tangent'] as const) {
    const correspondence = metricCorrespondence(dimension, 0.12)
    assert.ok(Math.abs(correspondence.pairwise - 0.12) < 1e-12)
    assert.ok(Math.abs((correspondence.m1Equivalent ?? 0) - 0.06) < 1e-12)
  }
})

test('size maps to the coefficient of variation of the two bed values', () => {
  const amount = 0.2
  const correspondence = metricCorrespondence('size', amount)
  assert.equal(correspondence.metric, 'M4')

  // Compare against the CV computed directly from the two values.
  const values = [1, 1 + amount]
  const avg = (values[0] + values[1]) / 2
  const sd = Math.sqrt(((values[0] - avg) ** 2 + (values[1] - avg) ** 2) / 2)
  assert.ok(Math.abs((correspondence.m1Equivalent ?? 0) - sd / avg) < 1e-12)
})

test('perturbationFor builds the knob for each dimension', () => {
  assert.deepEqual(perturbationFor('origin', 0.1), { originShiftRatio: 0.1, originAxis: 'lateral' })
  assert.deepEqual(perturbationFor('origin', 0.1, { originAxis: 'normal' }), {
    originShiftRatio: 0.1,
    originAxis: 'normal',
  })
  assert.deepEqual(perturbationFor('normal', 4), { normalTiltDeg: 4 })
  assert.deepEqual(perturbationFor('tangent', 4), { tangentRotationDeg: 4 })
  assert.deepEqual(perturbationFor('size', 0.1, { sizeMode: 'width' }), {
    sizeScaleRatio: 0.1,
    sizeMode: 'width',
  })
})

test('non-orthogonal input is squared up so the slider still means what it says', () => {
  // A scan does not guarantee a right angle between tangent and normal.
  const skewed = socket({ normal: [0.1, 0.6, 0.79] })
  assert.ok(Math.abs(dot(asVec(skewed.normal), asVec(skewed.tangent))) > 0.1, 'fixture is not skewed')

  const tilted = perturbSocket(skewed, { normalTiltDeg: 8 })
  const squared = perturbSocket(skewed, NO_PERTURBATION)

  // Output axes are orthogonal...
  assert.ok(Math.abs(dot(asVec(tilted.normal), asVec(tilted.tangent))) < 1e-12)
  // ...and the tilt is exactly the 8 degrees the slider showed.
  const measured = angleBetweenDeg(asVec(tilted.normal), asVec(squared.normal))
  assert.ok(measured !== null && Math.abs(measured - 8) < 1e-9, `measured ${measured}`)
})
