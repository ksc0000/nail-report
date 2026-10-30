// Stage 4.5 — how accurately must the relative pose be known?
//
// Stage 4 showed a two-view lift recovers the degree of freedom one view
// cannot see, and that a wrong relative pose corrupts the result without
// showing up in the reprojection residual. That raises the question this file
// answers: what pose accuracy does a usable socket actually require, and how
// does that compare with the other error sources?
//
// Three inputs are injected independently and propagated all the way to the
// NormalizedNailSocket — origin, normal, tangent, bedWidth, bedLength — rather
// than to the bed normal alone, because the socket is what the product uses:
//
//   1. relative rotation error        (what device odometry would get wrong)
//   2. camera position error          (which matters only via view direction)
//   3. nail-bed annotation error      (independent per view)
//
// It also measures hand motion between the two shots, which turns out to be
// the same thing as a pose error — the finding that decides which capture
// model can work at all.
//
// Nothing here estimates pose. It measures what a pose error costs.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { liftTwoView } from '../src/lib/nail3dMultiView.ts'
import { socketObservationsFrom } from '../src/lib/nail3dLift.ts'
import { parseScanObservation } from '../src/lib/nail3dObservation.ts'
import {
  estimateSocket,
  normalAngleDeg,
  originOffsetRatio,
  tangentAngleDeg,
} from '../src/lib/nail3dSocket.ts'
import type { NormalizedNailSocket } from '../src/lib/nail3dSocket.ts'
import { add, multiplyMat3, normalize, rotationMat3, scale as vscale } from '../src/lib/vec3.ts'
import type { Mat3, Vec3 } from '../src/lib/vec3.ts'
import { syntheticHand } from './support/syntheticHand.ts'
import type { SyntheticHand } from './support/syntheticHand.ts'
import {
  DEFAULT_CAMERA,
  cameraPosition,
  jitterObservation,
  lookAtRotation,
  projectToObservation,
  truthBed,
} from './support/syntheticProjection.ts'
import type { CameraSetup } from './support/syntheticProjection.ts'

const SECOND_CAMERA: CameraSetup = {
  scale: 1150,
  principalPoint: [1400, 1900],
  imageWidth: 3000,
  imageHeight: 4000,
}

/** Camera distance in hand units; the synthetic hand is ~1.5 units tall. */
const DISTANCE = 3.0
/** Second view, degrees over the fingertip — Stage 4's best direction. */
const SEPARATION_DEG = 25
/** The hard case: the hand tilted about the bed's own width axis. */
const PITCH_DEG = 35

const X_AXIS: Vec3 = [1, 0, 0]
const Y_AXIS: Vec3 = [0, 1, 0]
const Z_AXIS: Vec3 = [0, 0, 1]

const degrees = (value: number): number => (value * Math.PI) / 180

const centroid = (hand: SyntheticHand): Vec3 =>
  vscale(
    hand.landmarks.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]),
    1 / hand.landmarks.length,
  )

const observe = (hand: SyntheticHand, view: Mat3, camera: CameraSetup, jitterPx = 0, seed = 1) => {
  let observation = projectToObservation(hand, { camera, view })
  if (jitterPx) observation = jitterObservation(observation, { sigmaPx: jitterPx, seed })
  const parsed = parseScanObservation(JSON.parse(JSON.stringify(observation)))
  assert.ok(parsed.ok, 'observation did not parse')
  if (!parsed.ok) throw new Error('unreachable')
  return parsed.value
}

/** The socket the 3D truth itself produces — what every error is measured against. */
const truthSocket = (hand: SyntheticHand): NormalizedNailSocket => {
  const estimated = estimateSocket(hand.landmarks, truthBed(hand, 'index'), 'index')
  assert.ok(estimated, 'no ground-truth socket')
  return estimated.socket
}

interface SocketError {
  /** Origin displacement, as a percentage of bed length (the T_pos unit). */
  originPct: number
  normalDeg: number
  tangentDeg: number
  /** Signed percentage error in each dimension (the T_size unit). */
  widthPct: number
  lengthPct: number
}

const socketError = (got: NormalizedNailSocket, truth: NormalizedNailSocket): SocketError => ({
  originPct: originOffsetRatio(got, truth) * 100,
  normalDeg: normalAngleDeg(got, truth) ?? Number.NaN,
  tangentDeg: tangentAngleDeg(got, truth) ?? Number.NaN,
  widthPct: (got.bedWidth / truth.bedWidth - 1) * 100,
  lengthPct: (got.bedLength / truth.bedLength - 1) * 100,
})

interface Scene {
  hand: SyntheticHand
  reference: Mat3
  second: Mat3
  target: Vec3
}

const scene = (separationDeg = SEPARATION_DEG): Scene => {
  const hand = syntheticHand({ pose: { rotationAxis: X_AXIS, rotationDeg: PITCH_DEG } })
  const target = centroid(hand)
  return {
    hand,
    target,
    reference: lookAtRotation(cameraPosition(DISTANCE, 0, 0, target), target),
    second: lookAtRotation(cameraPosition(DISTANCE, 0, separationDeg, target), target),
  }
}

interface Outcome {
  error: SocketError
  reprojectionRmsPx: number
  viewSeparationIndex: number
}

/**
 * Runs the two-view lift on one scene.
 *
 * `believedSecond` is the rotation handed to the lift, which may differ from
 * the one the second image was actually taken with; `actualSecond` lets the
 * hand move between shots by changing the true view without telling the lift.
 */
const run = (options: {
  scene?: Scene
  believedSecond?: Mat3
  actualSecond?: Mat3
  jitterPx?: number
  seedA?: number
  seedB?: number
}): Outcome => {
  const current = options.scene ?? scene()
  const jitter = options.jitterPx ?? 0
  const reference = observe(current.hand, current.reference, DEFAULT_CAMERA, jitter, options.seedA ?? 11)
  const second = observe(
    current.hand,
    options.actualSecond ?? current.second,
    SECOND_CAMERA,
    jitter * (SECOND_CAMERA.scale / DEFAULT_CAMERA.scale),
    options.seedB ?? 977,
  )

  const result = liftTwoView(
    reference,
    second,
    {
      reference: { rotation: current.reference },
      second: { rotation: options.believedSecond ?? current.second },
    },
    ['index'],
  )
  assert.ok(result.canonical, `the lift refused: ${result.residuals.refusedReason}`)
  const socket = socketObservationsFrom(result.canonical).get('index')
  assert.ok(socket, 'no socket from the lifted observation')

  return {
    error: socketError(socket.socket, truthSocket(current.hand)),
    reprojectionRmsPx: result.residuals.reprojectionRmsPx,
    viewSeparationIndex: result.residuals.viewSeparationIndex,
  }
}

/** A rotation error of `deg` about `axis`, applied to the second view. */
const misrotate = (current: Scene, axis: Vec3, deg: number): Mat3 =>
  multiplyMat3(rotationMat3(axis, degrees(deg)), current.second)

const meanOriginPct = (make: (seedA: number, seedB: number) => Outcome, draws = 12): number => {
  let total = 0
  for (let k = 0; k < draws; k += 1) total += make(100 + k * 7, 5000 + k * 13).error.originPct
  return total / draws
}

// ---------------------------------------------------------------------------
// The floor
// ---------------------------------------------------------------------------

test('with the true pose and no noise, the socket is exact', () => {
  const outcome = run({})
  assert.ok(outcome.error.originPct < 1e-6, `origin ${outcome.error.originPct}`)
  assert.ok(outcome.error.normalDeg < 1e-4, `normal ${outcome.error.normalDeg}`)
  assert.ok(Math.abs(outcome.error.widthPct) < 1e-6)
  assert.ok(Math.abs(outcome.error.lengthPct) < 1e-6)
})

// ---------------------------------------------------------------------------
// 1. Relative rotation error
// ---------------------------------------------------------------------------

test('a separation-angle error propagates linearly, and the origin carries it', () => {
  // Per degree, at 25 degrees of separation: ~3.4% of bed length on the
  // origin, ~2.4% on bedWidth, and only ~0.21 degrees on the normal.
  const current = scene()
  for (const [deg, origin, width, normal] of [
    [0.25, 0.86, 0.61, 0.053],
    [0.5, 1.72, 1.21, 0.106],
    [1, 3.42, 2.39, 0.211],
    [2, 6.76, 4.67, 0.4],
    [5, 16.24, 10.78, 0.88],
  ] as const) {
    const outcome = run({ scene: current, believedSecond: misrotate(current, X_AXIS, deg) })
    assert.ok(Math.abs(outcome.error.originPct - origin) < 0.05, `${deg} deg -> origin ${outcome.error.originPct}`)
    assert.ok(Math.abs(outcome.error.widthPct - width) < 0.05, `${deg} deg -> width ${outcome.error.widthPct}`)
    assert.ok(Math.abs(outcome.error.normalDeg - normal) < 0.02, `${deg} deg -> normal ${outcome.error.normalDeg}`)
  }
})

test('canonicalization hides a pose error in the normal and moves it into origin and size', () => {
  // Stage 4 measured the bed normal in world coordinates and saw a pose error
  // transfer ~1:1. In the canonical frame the landmarks are distorted by the
  // same wrong pose, so most of the normal error is common-mode and cancels —
  // but the error does not vanish, it reappears as origin and bedWidth error.
  // Watching the normal alone would badly understate the pose requirement.
  const current = scene()
  const outcome = run({ scene: current, believedSecond: misrotate(current, X_AXIS, 5) })
  assert.ok(outcome.error.normalDeg < 1, `normal should stay small: ${outcome.error.normalDeg}`)
  assert.ok(outcome.error.originPct > 15, `origin should be large: ${outcome.error.originPct}`)
  assert.ok(outcome.error.widthPct > 10, `width should be large: ${outcome.error.widthPct}`)
})

test('the damaging rotation error is exactly the invisible one', () => {
  // The error component about the baseline axis leaves no residual at all and
  // costs the most; rotating the error axis away from the baseline makes it
  // visible and simultaneously makes it harmless. The two curves are opposite,
  // which is the whole problem: the residual polices everything except the one
  // component that matters.
  const current = scene()
  const sampled = [0, 30, 60, 90].map(mix => {
    const radians = degrees(mix)
    const axis = normalize([Math.cos(radians), Math.sin(radians), 0] as Vec3) ?? X_AXIS
    const believedSecond = multiplyMat3(rotationMat3(axis, degrees(1)), current.second)
    return run({ scene: current, believedSecond })
  })

  // Residual climbs monotonically as the error turns away from the baseline...
  for (let i = 1; i < sampled.length; i += 1) {
    assert.ok(
      sampled[i].reprojectionRmsPx > sampled[i - 1].reprojectionRmsPx,
      `residual should grow: ${sampled.map(s => s.reprojectionRmsPx)}`,
    )
    // ... while the socket error falls.
    assert.ok(
      sampled[i].error.originPct < sampled[i - 1].error.originPct,
      `origin error should fall: ${sampled.map(s => s.error.originPct)}`,
    )
  }
  // About the baseline axis: invisible and maximally damaging.
  assert.ok(sampled[0].reprojectionRmsPx < 1e-6, `${sampled[0].reprojectionRmsPx}`)
  assert.ok(sampled[0].error.originPct > 3)
  // Perpendicular to it: loud and nearly harmless.
  assert.ok(sampled[3].reprojectionRmsPx > 15, `${sampled[3].reprojectionRmsPx}`)
  assert.ok(sampled[3].error.originPct < 0.5)
})

test('a roll error is visible in the residual', () => {
  const current = scene()
  const outcome = run({ scene: current, believedSecond: misrotate(current, Z_AXIS, 1) })
  assert.ok(outcome.reprojectionRmsPx > 5, `roll should show up: ${outcome.reprojectionRmsPx}`)
})

// ---------------------------------------------------------------------------
// 2. Camera position error — it only matters through the view direction
// ---------------------------------------------------------------------------

test('an error in the camera distance costs nothing at all', () => {
  // Weak perspective plus a solved scale ratio means moving along the view
  // direction changes neither the direction nor anything the lift uses. The
  // hand's distance therefore does not have to be known.
  const current = scene()
  const toCamera = cameraPosition(DISTANCE, 0, SEPARATION_DEG, current.target)
  const offset: Vec3 = [
    toCamera[0] - current.target[0],
    toCamera[1] - current.target[1],
    toCamera[2] - current.target[2],
  ]

  for (const wrongBy of [0.05, 0.2]) {
    const believedPosition = add(current.target, vscale(offset, 1 + wrongBy))
    const outcome = run({
      scene: current,
      believedSecond: lookAtRotation(believedPosition, current.target),
    })
    assert.ok(outcome.error.originPct < 1e-6, `${wrongBy} distance error -> ${outcome.error.originPct}`)
  }
})

test('a sideways camera position error acts as the view-direction error it implies', () => {
  // The conversion is just geometry: a displacement perpendicular to the view
  // direction, divided by the distance to the hand, is the angle. 1% of the
  // distance is ~0.6 degrees here, which is why the position requirement is
  // far looser than the angular one.
  const current = scene()
  const truePosition = cameraPosition(DISTANCE, 0, SEPARATION_DEG, current.target)

  const small = run({
    scene: current,
    believedSecond: lookAtRotation(add(truePosition, [0.01 * DISTANCE, 0, 0]), current.target),
  })
  const large = run({
    scene: current,
    believedSecond: lookAtRotation(add(truePosition, [0.05 * DISTANCE, 0, 0]), current.target),
  })

  assert.ok(Math.abs(small.error.originPct - 1.78) < 0.1, `1% -> ${small.error.originPct}`)
  assert.ok(Math.abs(large.error.originPct - 17.9) < 0.5, `5% -> ${large.error.originPct}`)
  // Sideways displacement tilts the view about an axis across the baseline, so
  // unlike a separation-angle error this one does show in the residual.
  assert.ok(small.reprojectionRmsPx > 1, `should be visible: ${small.reprojectionRmsPx}`)
})

// ---------------------------------------------------------------------------
// 3. Annotation error
// ---------------------------------------------------------------------------

test('annotation error costs about 4% of bed length per pixel, per view', () => {
  const one = meanOriginPct((seedA, seedB) => run({ jitterPx: 1, seedA, seedB }))
  const two = meanOriginPct((seedA, seedB) => run({ jitterPx: 2, seedA, seedB }))
  assert.ok(Math.abs(one - 4.22) < 0.3, `1 px -> ${one}`)
  assert.ok(Math.abs(two - 8.38) < 0.5, `2 px -> ${two}`)
})

test('one degree of pose error is worth about a pixel of annotation error', () => {
  // The two budgets are the same size, so pose accuracy cannot be pushed far
  // past annotation accuracy and still buy anything.
  const current = scene()
  const perDegree = run({ scene: current, believedSecond: misrotate(current, X_AXIS, 1) }).error.originPct
  const perPixel = meanOriginPct((seedA, seedB) => run({ jitterPx: 1, seedA, seedB }))
  assert.ok(perDegree / perPixel > 0.5 && perDegree / perPixel < 2, `${perDegree} vs ${perPixel}`)
})

// ---------------------------------------------------------------------------
// 4. Hand motion between the shots
// ---------------------------------------------------------------------------

test('the hand moving between shots is the same error as the camera pose being wrong', () => {
  // This is what decides the capture model. Device odometry measures the
  // camera against the world; the lift needs the camera against the HAND. If
  // the hand turns by a degree between the two shots, the result is damaged
  // as badly as if the pose were a degree wrong — and odometry cannot see it.
  const current = scene()
  for (const deg of [0.5, 1, 2]) {
    const handMoved = run({
      scene: current,
      // The hand turned, so the second image really shows a different view...
      actualSecond: multiplyMat3(current.second, rotationMat3(X_AXIS, degrees(deg))),
      // ... but the lift is told the camera pose, which is still correct.
    })
    const poseWrong = run({ scene: current, believedSecond: misrotate(current, X_AXIS, deg) })
    // Not identical to the last digit — the hand turns about its own axis and
    // the camera about the camera's — but the same size to within a few
    // percent, which is what a budget is made of.
    assert.ok(
      Math.abs(handMoved.error.originPct / poseWrong.error.originPct - 1) < 0.05,
      `${deg} deg: hand moved ${handMoved.error.originPct} vs pose wrong ${poseWrong.error.originPct}`,
    )
    // And it is just as invisible.
    assert.ok(handMoved.reprojectionRmsPx < 1e-6, `${deg} deg left a residual: ${handMoved.reprojectionRmsPx}`)
  }
})

test('hand motion across the baseline axis is visible, the same way a pose error is', () => {
  const current = scene()
  const outcome = run({
    scene: current,
    actualSecond: multiplyMat3(current.second, rotationMat3(Y_AXIS, degrees(1))),
  })
  assert.ok(outcome.reprojectionRmsPx > 5, `should be visible: ${outcome.reprojectionRmsPx}`)
})

// ---------------------------------------------------------------------------
// 5. A wider baseline helps both budgets
// ---------------------------------------------------------------------------

test('a wider baseline reduces pose sensitivity and annotation sensitivity together', () => {
  // There is no trade-off to balance here: widening the separation is simply
  // better on both axes, which makes it the first thing the capture UX should
  // buy.
  const measure = (separationDeg: number) => {
    const current = scene(separationDeg)
    return {
      perDegree: run({ scene: current, believedSecond: misrotate(current, X_AXIS, 1) }).error.originPct,
      perTwoPixels: meanOriginPct((seedA, seedB) => run({ scene: current, jitterPx: 2, seedA, seedB })),
    }
  }

  const narrow = measure(10)
  const middling = measure(25)
  const wide = measure(60)

  assert.ok(
    narrow.perDegree > middling.perDegree && middling.perDegree > wide.perDegree,
    `pose: ${narrow.perDegree} / ${middling.perDegree} / ${wide.perDegree}`,
  )
  assert.ok(
    narrow.perTwoPixels > middling.perTwoPixels && middling.perTwoPixels > wide.perTwoPixels,
    `annotation: ${narrow.perTwoPixels} / ${middling.perTwoPixels} / ${wide.perTwoPixels}`,
  )
  // Going from 10 to 60 degrees roughly quarters the pose sensitivity.
  assert.ok(narrow.perDegree / wide.perDegree > 3.5, `${narrow.perDegree} / ${wide.perDegree}`)
})
