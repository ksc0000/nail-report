// Canonical Nail Data contract v1 — parse and INV-3 fallback verification.
//
// The fixtures in contracts/nail3d/v1/fixtures are the platform-neutral
// contract artifact: the iOS Scan Engine must produce data these accept, and
// Web must degrade exactly as asserted here. Fixtures are read from disk (not
// imported) so this test verifies the same bytes iOS would consume.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  MAX_SUPPORTED_CONTRACT_VERSION,
  NAIL3D_CONTRACT_VERSION,
  parseHandProfile,
  planNail3DRender,
} from '../src/lib/nail3dContract.ts'
import type { Nail3DPlan } from '../src/lib/nail3dContract.ts'

const FIXTURE_DIR = new URL('../contracts/nail3d/v1/fixtures/', import.meta.url)

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(new URL(`${name}.json`, FIXTURE_DIR), 'utf-8'))

const TEX = 'users/u1/nailItems/item1/nail3d'

// Narrowing helpers keep the assertions readable without casts.
const expectLevel = <L extends Nail3DPlan['level']>(
  plan: Nail3DPlan,
  level: L,
): Extract<Nail3DPlan, { level: L }> => {
  assert.equal(plan.level, level, `expected ${level}, got ${plan.level}: ${JSON.stringify(plan)}`)
  return plan as Extract<Nail3DPlan, { level: L }>
}

const expectL0 = (plan: Nail3DPlan, reason: string) => {
  const l0 = expectLevel(plan, 'L0')
  assert.equal(l0.reason, reason, l0.detail)
}

// ---------------------------------------------------------------------------
// Baseline: the contract version this repo speaks
// ---------------------------------------------------------------------------

test('contract version constants are consistent', () => {
  assert.equal(NAIL3D_CONTRACT_VERSION, 1)
  assert.equal(MAX_SUPPORTED_CONTRACT_VERSION, 1)
})

// ---------------------------------------------------------------------------
// valid full / partial -> L2
// ---------------------------------------------------------------------------

test('valid full NailSet with matching HandProfile renders at L2', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-right'),
  })
  const l2 = expectLevel(plan, 'L2')
  assert.equal(l2.nails.length, 5)
  assert.deepEqual(l2.droppedFingers, [])
  assert.equal(l2.nailSet.completeness, 'full')
  assert.equal(l2.handProfile.handedness, 'right')
  assert.equal(l2.nails[0].geometry.shape, 'almond')
})

test('valid partial NailSet (3 nails) renders at L2 without inventing nails', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-partial'),
    handProfile: fixture('handprofile-valid-right'),
  })
  const l2 = expectLevel(plan, 'L2')
  assert.equal(l2.nailSet.completeness, 'partial')
  assert.equal(l2.nails.length, 3)
  assert.deepEqual(
    l2.nails.map(nail => nail.socketRef),
    ['thumb', 'index', 'middle'],
  )
})

test('nails without a matching socket are dropped, the rest still render', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-partial-sockets'),
  })
  const l2 = expectLevel(plan, 'L2')
  assert.equal(l2.nails.length, 3)
  assert.deepEqual(l2.droppedFingers, ['ring', 'pinky'])
})

// ---------------------------------------------------------------------------
// INV-3: absent and unknown / invalid contractVersion -> L0
// ---------------------------------------------------------------------------

test('absent NailSet is a normal L0 record, not an error', () => {
  expectL0(planNail3DRender({ nailSet: undefined }), 'absent')
  expectL0(planNail3DRender({ nailSet: null }), 'absent')
})

test('unknown (future) contractVersion falls back to L0', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-unknown-contract-version'),
    handProfile: fixture('handprofile-valid-right'),
  })
  expectL0(plan, 'unsupported-contract-version')
})

test('a future contractVersion renders once support is declared', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-unknown-contract-version'),
    handProfile: fixture('handprofile-unsupported-version'),
    maxSupportedContractVersion: 999,
  })
  // Proves the gate is the declared ceiling, not a hard-coded 1.
  expectLevel(plan, 'L2')
})

test('non-numeric or missing contractVersion falls back to L0', () => {
  expectL0(
    planNail3DRender({ nailSet: fixture('nailset-invalid-contract-version') }),
    'invalid-contract-version',
  )
  expectL0(
    planNail3DRender({ nailSet: fixture('nailset-missing-contract-version') }),
    'invalid-contract-version',
  )
})

// ---------------------------------------------------------------------------
// INV-3: malformed -> L0 (no partial rendering of untrusted data)
// ---------------------------------------------------------------------------

for (const name of [
  'nailset-malformed-missing-geometry-field',
  'nailset-malformed-handedness',
  'nailset-malformed-completeness-mismatch',
  'nailset-malformed-duplicate-socket',
  'nailset-malformed-uvtransform',
]) {
  test(`malformed fixture falls back to L0: ${name}`, () => {
    const plan = planNail3DRender({
      nailSet: fixture(name),
      handProfile: fixture('handprofile-valid-right'),
    })
    expectL0(plan, 'malformed')
  })
}

// ---------------------------------------------------------------------------
// INV-3: HandProfile missing / unusable -> L1 (2.5D), or L0 without a height map
// ---------------------------------------------------------------------------

test('missing HandProfile degrades to L1 when a height map exists', () => {
  const plan = planNail3DRender({ nailSet: fixture('nailset-valid-full') })
  const l1 = expectLevel(plan, 'L1')
  assert.equal(l1.reason, 'hand-profile-missing')
  assert.equal(l1.nails.length, 5)
})

test('missing HandProfile falls back to L0 when no height map exists', () => {
  const plan = planNail3DRender({ nailSet: fixture('nailset-valid-no-heightmap') })
  expectL0(plan, 'hand-profile-missing')
})

for (const name of [
  'handprofile-unsupported-version',
  'handprofile-malformed-socket',
  'handprofile-malformed-bonelengths',
]) {
  test(`unusable HandProfile degrades to L1: ${name}`, () => {
    const plan = planNail3DRender({
      nailSet: fixture('nailset-valid-full'),
      handProfile: fixture(name),
    })
    assert.equal(expectLevel(plan, 'L1').reason, 'hand-profile-missing')
  })
}

test('handedness mismatch is not rendered as if it matched', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-left'),
  })
  const l1 = expectLevel(plan, 'L1')
  assert.match(l1.detail, /handedness mismatch/)
})

test('a HandProfile whose sockets do not match the NailSet degrades to L1', () => {
  const nailSet = fixture('nailset-valid-partial') as Record<string, unknown>
  // Right-hand profile holding only the two fingers this partial set lacks.
  const handProfile = fixture('handprofile-valid-right') as Record<string, unknown>
  const sockets = handProfile.nailSockets as Array<{ finger: string }>
  handProfile.nailSockets = sockets.filter(socket => socket.finger === 'pinky')
  const plan = planNail3DRender({ nailSet, handProfile })
  assert.match(expectLevel(plan, 'L1').detail, /no NailSocket matches/)
})

// ---------------------------------------------------------------------------
// INV-3: texture unavailable
// ---------------------------------------------------------------------------

test('one unavailable texture drops that nail only', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-right'),
    unavailableRefs: [`${TEX}/tex_middle.webp`],
  })
  const l2 = expectLevel(plan, 'L2')
  assert.equal(l2.nails.length, 4)
  assert.deepEqual(l2.droppedFingers, ['middle'])
})

test('all textures unavailable falls back to L0', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    handProfile: fixture('handprofile-valid-right'),
    unavailableRefs: ['thumb', 'index', 'middle', 'ring', 'pinky'].map(
      finger => `${TEX}/tex_${finger}.webp`,
    ),
  })
  expectL0(plan, 'texture-unavailable')
})

test('an unavailable height map cannot be used for the L1 fallback', () => {
  const plan = planNail3DRender({
    nailSet: fixture('nailset-valid-full'),
    unavailableRefs: ['thumb', 'index', 'middle', 'ring', 'pinky'].map(
      finger => `${TEX}/height_${finger}.webp`,
    ),
  })
  expectL0(plan, 'hand-profile-missing')
})

// ---------------------------------------------------------------------------
// C1: additive-only changes must not break older readers
// ---------------------------------------------------------------------------

test('unknown additive fields are ignored, not treated as malformed', () => {
  const nailSet = fixture('nailset-valid-full') as Record<string, unknown>
  nailSet.futureTopLevelField = { anything: true }
  const nails = nailSet.nails as Array<Record<string, unknown>>
  nails[0].futureNailField = 42
  ;(nails[0].geometry as Record<string, unknown>).futureGeometryField = 'x'

  const plan = planNail3DRender({ nailSet, handProfile: fixture('handprofile-valid-right') })
  assert.equal(expectLevel(plan, 'L2').nails.length, 5)
})

// ---------------------------------------------------------------------------
// INV-3: never throw, whatever arrives
// ---------------------------------------------------------------------------

test('hostile or nonsense input never throws and always yields a plan', () => {
  const inputs: unknown[] = [
    'a string',
    42,
    [],
    [1, 2, 3],
    true,
    { contractVersion: 1 },
    { contractVersion: 0 },
    { contractVersion: -1 },
    { contractVersion: 1.5 },
    { contractVersion: Number.NaN },
    { contractVersion: 1, nails: [] },
    { contractVersion: 1, nails: 'not-an-array' },
    { contractVersion: 1, nails: [null, undefined] },
    { contractVersion: 1, nails: Array.from({ length: 9 }, () => ({})) },
  ]
  for (const nailSet of inputs) {
    const plan = planNail3DRender({ nailSet, handProfile: 'garbage' })
    assert.equal(plan.level, 'L0', `expected L0 for ${JSON.stringify(nailSet)}`)
  }
})

test('a getter that throws is contained and degrades to L0', () => {
  const nailSet = {
    get contractVersion(): number {
      throw new Error('boom')
    },
  }
  expectL0(planNail3DRender({ nailSet }), 'malformed')
})

// ---------------------------------------------------------------------------
// parseHandProfile used directly (iOS-side writers validate with the same rules)
// ---------------------------------------------------------------------------

test('parseHandProfile accepts valid profiles and rejects unusable ones', () => {
  const valid = parseHandProfile(fixture('handprofile-valid-right'))
  assert.ok(valid)
  assert.equal(valid.nailSockets.length, 5)
  assert.equal(valid.boneLengths.length, 20)
  assert.equal(valid.canonicalPose.wristOrigin.length, 3)

  assert.equal(parseHandProfile(fixture('handprofile-unsupported-version')), null)
  assert.equal(parseHandProfile(fixture('handprofile-malformed-socket')), null)
  assert.equal(parseHandProfile(fixture('handprofile-malformed-bonelengths')), null)
  assert.equal(parseHandProfile(undefined), null)
  assert.equal(parseHandProfile('nope'), null)
})
