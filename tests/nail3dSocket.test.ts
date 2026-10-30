// Canonical hand frame and NailSocket estimation (#405 PoC stage 1).
//
// The properties that matter before any real photo exists:
//   - the frame is invariant to where the hand is, how it is turned, and how
//     large it appears;
//   - the socket is expressed in normalized units and can never be mistaken
//     for the contract's metre-valued NailSocket;
//   - degenerate input is rejected rather than guessed at.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FINGERS } from '../src/lib/nail3dContract.ts'
import type { Finger } from '../src/lib/nail3dContract.ts'
import {
  FINGER_LANDMARKS,
  LANDMARK_COUNT,
  buildCanonicalHandFrame,
  estimateSocket,
  originOffsetRatio,
} from '../src/lib/nail3dSocket.ts'
import type { NormalizedNailSocket } from '../src/lib/nail3dSocket.ts'
import { distance, dot, length } from '../src/lib/vec3.ts'
import type { Vec3 } from '../src/lib/vec3.ts'
import { syntheticHand } from './support/syntheticHand.ts'

const observe = (finger: Finger, options = {}) => {
  const hand = syntheticHand(options)
  const observation = estimateSocket(hand.landmarks, hand.bedCorners[finger], finger)
  assert.ok(observation, `estimateSocket returned null for ${finger}`)
  return observation
}

const socketsClose = (a: NormalizedNailSocket, b: NormalizedNailSocket, tolerance: number, label: string) => {
  assert.ok(distance(a.origin, b.origin) < tolerance, `${label}: origin moved by ${distance(a.origin, b.origin)}`)
  assert.ok(distance(a.normal, b.normal) < tolerance, `${label}: normal moved`)
  assert.ok(distance(a.tangent, b.tangent) < tolerance, `${label}: tangent moved`)
  assert.ok(Math.abs(a.bedWidth - b.bedWidth) < tolerance, `${label}: bedWidth changed`)
  assert.ok(Math.abs(a.bedLength - b.bedLength) < tolerance, `${label}: bedLength changed`)
}

// ---------------------------------------------------------------------------
// Canonical hand frame
// ---------------------------------------------------------------------------

test('canonical frame is orthonormal and right-handed for every finger', () => {
  const hand = syntheticHand()
  for (const finger of FINGERS) {
    const frame = buildCanonicalHandFrame(hand.landmarks, finger)
    assert.ok(frame, `no frame for ${finger}`)
    const { x, y, z } = frame.basis
    for (const [name, axis] of [['x', x], ['y', y], ['z', z]] as const) {
      assert.ok(Math.abs(length(axis) - 1) < 1e-9, `${finger}.${name} not unit length`)
    }
    assert.ok(Math.abs(dot(x, y)) < 1e-9, `${finger}: x·y != 0`)
    assert.ok(Math.abs(dot(y, z)) < 1e-9, `${finger}: y·z != 0`)
    assert.ok(Math.abs(dot(x, z)) < 1e-9, `${finger}: x·z != 0`)
    assert.ok(frame.scaleReferenceLength > 0)
  }
})

test('canonical frame origin is the finger MCP and +y is the finger axis', () => {
  const hand = syntheticHand()
  const frame = buildCanonicalHandFrame(hand.landmarks, 'index')
  assert.ok(frame)
  const [mcp, pip] = FINGER_LANDMARKS.index
  assert.deepEqual(frame.origin, hand.landmarks[mcp])
  // +y must point from MCP toward PIP.
  const toPip: Vec3 = [
    hand.landmarks[pip][0] - hand.landmarks[mcp][0],
    hand.landmarks[pip][1] - hand.landmarks[mcp][1],
    hand.landmarks[pip][2] - hand.landmarks[mcp][2],
  ]
  assert.ok(dot(frame.basis.y, toPip) > 0)
  assert.ok(Math.abs(frame.scaleReferenceLength - length(toPip)) < 1e-9)
})

test('canonical frame rejects malformed landmark sets instead of guessing', () => {
  const hand = syntheticHand()
  assert.equal(buildCanonicalHandFrame(hand.landmarks.slice(0, 5), 'index'), null)
  assert.equal(buildCanonicalHandFrame([], 'index'), null)

  const withNaN = [...hand.landmarks]
  withNaN[FINGER_LANDMARKS.index[1]] = [Number.NaN, 0, 0]
  assert.equal(buildCanonicalHandFrame(withNaN, 'index'), null)

  // MCP and PIP collapsed onto each other: no finger axis, no scale.
  const collapsed = [...hand.landmarks]
  collapsed[FINGER_LANDMARKS.index[1]] = collapsed[FINGER_LANDMARKS.index[0]]
  assert.equal(buildCanonicalHandFrame(collapsed, 'index'), null)
})

// ---------------------------------------------------------------------------
// Invariance — the reason a canonical frame exists at all
// ---------------------------------------------------------------------------

test('socket is invariant to translation', () => {
  const base = observe('index')
  const moved = observe('index', { pose: { translation: [12.5, -3.25, 7.75] as Vec3 } })
  socketsClose(base.socket, moved.socket, 1e-9, 'translation')
})

test('socket is invariant to rotation', () => {
  const base = observe('index')
  for (const degrees of [37, 90, 180, 263]) {
    const turned = observe('index', {
      pose: { rotationAxis: [0.3, 0.7, -0.5] as Vec3, rotationDeg: degrees },
    })
    socketsClose(base.socket, turned.socket, 1e-9, `rotation ${degrees}deg`)
  }
})

test('socket is invariant to combined translation, rotation and scale', () => {
  const base = observe('middle')
  const posed = observe('middle', {
    pose: {
      translation: [-40, 8, 2.5] as Vec3,
      rotationAxis: [-0.2, 0.4, 0.9] as Vec3,
      rotationDeg: 115,
      scale: 6.25,
    },
  })
  socketsClose(base.socket, posed.socket, 1e-9, 'rigid + scale')
})

// ---------------------------------------------------------------------------
// Normalized units — the socket must never read as metres
// ---------------------------------------------------------------------------

test('socket is tagged as normalized against the proximal phalanx', () => {
  const { socket } = observe('index')
  assert.equal(socket.units, 'normalized')
  assert.equal(socket.scaleReference, 'proximalPhalanx')
})

test('bed dimensions do not change when the hand is scaled — they are not metres', () => {
  // A metre-valued socket would grow with the hand. A normalized one does not.
  const small = observe('ring', { pose: { scale: 0.05 } })
  const large = observe('ring', { pose: { scale: 20 } })
  assert.ok(Math.abs(small.socket.bedWidth - large.socket.bedWidth) < 1e-9)
  assert.ok(Math.abs(small.socket.bedLength - large.socket.bedLength) < 1e-9)
  // Sanity: the underlying frame really did change size by 400x.
  assert.ok(large.frame.scaleReferenceLength / small.frame.scaleReferenceLength > 300)
})

test('normalized bed dimensions are plausible fractions, not metre magnitudes', () => {
  for (const finger of FINGERS) {
    const { socket } = observe(finger)
    assert.ok(socket.bedWidth > 0.05 && socket.bedWidth < 2, `${finger} bedWidth=${socket.bedWidth}`)
    assert.ok(socket.bedLength > 0.05 && socket.bedLength < 2, `${finger} bedLength=${socket.bedLength}`)
  }
})

// ---------------------------------------------------------------------------
// Socket estimation
// ---------------------------------------------------------------------------

test('socket is produced for every finger with a dorsal-facing normal', () => {
  for (const finger of FINGERS) {
    const { socket, canonicalLandmarks } = observe(finger)
    assert.equal(socket.finger, finger)
    assert.equal(canonicalLandmarks.length, LANDMARK_COUNT)
    assert.ok(Math.abs(length(socket.normal) - 1) < 1e-9, `${finger}: normal not unit length`)
    assert.ok(Math.abs(length(socket.tangent) - 1) < 1e-9, `${finger}: tangent not unit length`)
    // Dorsal side of the canonical frame is +z.
    assert.ok(socket.normal[2] > 0, `${finger}: normal points into the palm`)
    // The nail runs along the finger, so the tangent leans toward +y.
    assert.ok(socket.tangent[1] > 0.5, `${finger}: tangent does not follow the finger`)
  }
})

test('corner winding does not flip the normal', () => {
  const hand = syntheticHand()
  const corners = hand.bedCorners.index
  const reversed = [corners[3], corners[2], corners[1], corners[0]] as typeof corners

  const forward = estimateSocket(hand.landmarks, corners, 'index')
  const backward = estimateSocket(hand.landmarks, reversed, 'index')
  assert.ok(forward && backward)
  assert.ok(forward.socket.normal[2] > 0 && backward.socket.normal[2] > 0)
  assert.ok(distance(forward.socket.normal, backward.socket.normal) < 1e-9)
})

test('estimateSocket rejects degenerate quads', () => {
  const hand = syntheticHand()
  const corner = hand.bedCorners.index[0]
  const collapsed = [corner, corner, corner, corner] as typeof hand.bedCorners.index
  assert.equal(estimateSocket(hand.landmarks, collapsed, 'index'), null)

  const [a, b, , d] = hand.bedCorners.index
  const notFinite: typeof hand.bedCorners.index = [a, b, [Number.POSITIVE_INFINITY, 0, 0], d]
  assert.equal(estimateSocket(hand.landmarks, notFinite, 'index'), null)

  assert.equal(estimateSocket(hand.landmarks.slice(0, 3), hand.bedCorners.index, 'index'), null)
})

// ---------------------------------------------------------------------------
// Injected displacement is reported at its true size
// ---------------------------------------------------------------------------

test('originOffsetRatio reports zero for identical sockets', () => {
  const a = observe('index').socket
  const b = observe('index').socket
  assert.ok(originOffsetRatio(a, b) < 1e-12)
})
