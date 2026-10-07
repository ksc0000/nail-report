// Stage 9 — canonical frames that do not amplify one landmark.
//
// Stage 8 traced most of the socket-origin error to indexPIP: the standard
// frame (F0) takes BOTH its finger axis and its normalising scale from the
// single vector MCP -> PIP, and the nail bed sits about 1.7 phalanx lengths
// beyond it, so a PIP error rotates and rescales the coordinates the socket is
// written in. This module builds alternative frames from what a daily scan
// actually has — the lifted Layer B landmarks and the Personal HandProfile —
// so they can be compared on equal terms:
//
//   F0        MCP -> PIP axis and scale (the current definition, the baseline)
//   F1        the profile fitted to the palm points; the frame is the profile's
//             own index frame carried by that fit. No finger landmark is used.
//   F1nw      the same, fitted without the wrist (Stage 7's largest hazard)
//   F2        a line fit through MCP, PIP, DIP and TIP for the axis, the palm
//             span for the scale — no profile, and no single point decides
//   F3        F1's palm fit, plus a low-dimensional articulation of the
//             profile's finger chain fitted to PIP, DIP and TIP; axis from the
//             fitted chain, origin and scale from the palm fit
//   F3d       F3, anchored on the fitted DISTAL phalanx, where the nail is
//   F3dDir    F3d, but TIP enters the chain fit as a DIRECTION from DIP only,
//             so moving it along the finger changes nothing
//   F3dNoTip  F3d, with the chain fitted to PIP and DIP only: TIP is never
//             read, and the DIP angle stays at the calibrated posture
//   F4        anchored on the observed DIP with the DIP -> TIP axis — the
//             plain distal-phalanx frame, for comparison with F3d
//
// The three F3d variants exist because TIP is the landmark nearest the nail:
// it is the one a long nail or an extension could pull with it, and a frame
// that reads it can move when only the NailSet changed. Stage 9's candidate
// is F3dNoTip (docs/product/NAIL_SOCKET_POC_PLAN.md §6-K); `estimateSocket`
// still uses F0, and nothing in the product reads this module.
//
// No method reads ground truth. Every input is a Layer B landmark or the
// profile, both of which exist on a daily scan.
//
// The frames differ in WHERE they are anchored, so the same nail has
// different coordinates in each. They are therefore compared through
// repeatability, placement invariance and each method's error against its own
// definition applied to the true hand — never by comparing coordinates across
// definitions.

import type { Finger } from './nail3dContract.ts'
import { FINGER_LANDMARKS, WRIST, buildCanonicalHandFrame } from './nail3dSocket.ts'
import type { CanonicalHandFrame } from './nail3dSocket.ts'
import type { HandProfile3D } from './nail3dProfilePose.ts'
import { LANDMARK_NAMES } from './nail3dLift.ts'
import { add, cross, distance, dot, normalize, orthonormalBasis, rotateAroundAxis, scale, sub } from './vec3.ts'
import type { Vec3 } from './vec3.ts'

export const FRAME_METHODS = ['F0', 'F1', 'F1nw', 'F2', 'F3', 'F3d', 'F3dDir', 'F3dNoTip', 'F4'] as const
export type FrameMethod = (typeof FRAME_METHODS)[number]

/** Landmarks the palm fits read, by name. */
export const PALM_FIT_WITH_WRIST = ['wrist', 'thumbMCP', 'indexMCP', 'middleMCP', 'ringMCP', 'pinkyMCP'] as const
export const PALM_FIT_WITHOUT_WRIST = ['thumbMCP', 'indexMCP', 'middleMCP', 'ringMCP', 'pinkyMCP'] as const

// ---------------------------------------------------------------------------
// Similarity fit (Horn's quaternion method)
// ---------------------------------------------------------------------------

export interface Similarity {
  /** Row-major rotation taking profile coordinates into the scene. */
  rotation: number[]
  scale: number
  translation: Vec3
  /** RMS residual of the fitted points, in scene units. */
  residual: number
}

const applyRotation = (r: readonly number[], v: Vec3): Vec3 => [
  r[0] * v[0] + r[1] * v[1] + r[2] * v[2],
  r[3] * v[0] + r[4] * v[1] + r[5] * v[2],
  r[6] * v[0] + r[7] * v[1] + r[8] * v[2],
]

export const applySimilarity = (t: Similarity, point: Vec3): Vec3 =>
  add(scale(applyRotation(t.rotation, point), t.scale), t.translation)

/** Eigen-decomposition of a symmetric 4x4 matrix by cyclic Jacobi rotations. */
const jacobi4 = (input: number[][]): { values: number[]; vectors: number[][] } => {
  const a = input.map(row => [...row])
  const v = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]
  for (let sweep = 0; sweep < 60; sweep += 1) {
    let off = 0
    for (let p = 0; p < 4; p += 1) for (let q = p + 1; q < 4; q += 1) off += a[p][q] * a[p][q]
    if (off < 1e-24) break
    for (let p = 0; p < 4; p += 1) {
      for (let q = p + 1; q < 4; q += 1) {
        if (Math.abs(a[p][q]) < 1e-300) continue
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const s = t * c
        for (let k = 0; k < 4; k += 1) {
          const akp = a[k][p]
          const akq = a[k][q]
          a[k][p] = c * akp - s * akq
          a[k][q] = s * akp + c * akq
        }
        for (let k = 0; k < 4; k += 1) {
          const apk = a[p][k]
          const aqk = a[q][k]
          a[p][k] = c * apk - s * aqk
          a[q][k] = s * apk + c * aqk
        }
        for (let k = 0; k < 4; k += 1) {
          const vkp = v[k][p]
          const vkq = v[k][q]
          v[k][p] = c * vkp - s * vkq
          v[k][q] = s * vkp + c * vkq
        }
      }
    }
  }
  return { values: [a[0][0], a[1][1], a[2][2], a[3][3]], vectors: v }
}

/**
 * Least-squares similarity taking `from` onto `to`.
 *
 * Horn's quaternion method rather than an SVD of the cross-covariance: the
 * palm points are nearly coplanar, which makes that matrix nearly singular,
 * and the quaternion eigenproblem stays well posed there.
 */
export const fitSimilarity = (from: readonly Vec3[], to: readonly Vec3[]): Similarity | null => {
  if (from.length !== to.length || from.length < 3) return null
  const n = from.length
  const mean = (points: readonly Vec3[]): Vec3 =>
    scale(points.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / n)
  const fromMean = mean(from)
  const toMean = mean(to)
  const x = from.map(point => sub(point, fromMean))
  const y = to.map(point => sub(point, toMean))

  const s = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < n; i += 1) {
    for (let a = 0; a < 3; a += 1) for (let b = 0; b < 3; b += 1) s[a * 3 + b] += x[i][a] * y[i][b]
  }
  const [sxx, sxy, sxz, syx, syy, syz, szx, szy, szz] = s
  const { values, vectors } = jacobi4([
    [sxx + syy + szz, syz - szy, szx - sxz, sxy - syx],
    [syz - szy, sxx - syy - szz, sxy + syx, szx + sxz],
    [szx - sxz, sxy + syx, -sxx + syy - szz, syz + szy],
    [sxy - syx, szx + sxz, syz + szy, -sxx - syy + szz],
  ])
  let best = 0
  for (let i = 1; i < 4; i += 1) if (values[i] > values[best]) best = i
  const [w, qx, qy, qz] = [vectors[0][best], vectors[1][best], vectors[2][best], vectors[3][best]]
  const rotation = [
    1 - 2 * (qy * qy + qz * qz), 2 * (qx * qy - w * qz), 2 * (qx * qz + w * qy),
    2 * (qx * qy + w * qz), 1 - 2 * (qx * qx + qz * qz), 2 * (qy * qz - w * qx),
    2 * (qx * qz - w * qy), 2 * (qy * qz + w * qx), 1 - 2 * (qx * qx + qy * qy),
  ]

  let numerator = 0
  let denominator = 0
  for (let i = 0; i < n; i += 1) {
    numerator += dot(y[i], applyRotation(rotation, x[i]))
    denominator += dot(x[i], x[i])
  }
  if (!(denominator > 1e-18)) return null
  const fittedScale = numerator / denominator
  if (!(fittedScale > 0)) return null
  const translation = sub(toMean, scale(applyRotation(rotation, fromMean), fittedScale))
  const transform: Similarity = { rotation, scale: fittedScale, translation, residual: 0 }
  let squared = 0
  for (let i = 0; i < n; i += 1) squared += distance(applySimilarity(transform, from[i]), to[i]) ** 2
  return { ...transform, residual: Math.sqrt(squared / n) }
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const indexOf = (name: string): number => LANDMARK_NAMES.indexOf(name)

const valid = (points: readonly (Vec3 | null | undefined)[]): points is Vec3[] =>
  points.every(point => point !== null && point !== undefined && point.every(Number.isFinite))

const palmNormalOf = (landmarks: readonly Vec3[]): Vec3 =>
  cross(
    sub(landmarks[FINGER_LANDMARKS.index[0]], landmarks[WRIST]),
    sub(landmarks[FINGER_LANDMARKS.pinky[0]], landmarks[WRIST]),
  )

/** The proximal-phalanx length the profile has per unit of palm span. */
const phalanxPerSpan = (profile: HandProfile3D, finger: Finger): number => {
  const [mcp, pip] = FINGER_LANDMARKS[finger]
  const span = distance(profile.landmarks[FINGER_LANDMARKS.index[0]], profile.landmarks[FINGER_LANDMARKS.pinky[0]])
  return distance(profile.landmarks[mcp], profile.landmarks[pip]) / span
}

/**
 * Nelder-Mead in n dimensions; deterministic, starting from `start`. Stops
 * early once the simplex has collapsed (parameters within 1e-9 of the best
 * vertex and costs within 1e-12 of it, relative), long before any result moves.
 */
const nelderMead = (objective: (x: number[]) => number, start: number[], step: number, iterations: number): number[] => {
  const n = start.length
  let simplex = [start, ...start.map((_, i) => start.map((value, j) => (i === j ? value + step : value)))].map(x => ({
    x,
    value: objective(x),
  }))
  const blend = (a: number[], b: number[], t: number) => a.map((value, i) => value + (b[i] - value) * t)
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    simplex.sort((a, b) => a.value - b.value)
    const best = simplex[0]
    const collapsed =
      simplex[n].value - best.value <= 1e-12 * (1 + Math.abs(best.value)) &&
      simplex.every(vertex => vertex.x.every((value, i) => Math.abs(value - best.x[i]) <= 1e-9))
    if (collapsed) break
    const worst = simplex[n]
    const centroid = simplex
      .slice(0, n)
      .reduce((sum, vertex) => sum.map((value, i) => value + vertex.x[i] / n), new Array(n).fill(0) as number[])
    const reflected = blend(worst.x, centroid, 2)
    const reflectedValue = objective(reflected)
    if (reflectedValue < simplex[0].value) {
      const expanded = blend(worst.x, centroid, 3)
      const expandedValue = objective(expanded)
      simplex[n] = expandedValue < reflectedValue ? { x: expanded, value: expandedValue } : { x: reflected, value: reflectedValue }
      continue
    }
    if (reflectedValue < simplex[n - 1].value) {
      simplex[n] = { x: reflected, value: reflectedValue }
      continue
    }
    const contracted = blend(worst.x, centroid, 0.5)
    const contractedValue = objective(contracted)
    if (contractedValue < worst.value) {
      simplex[n] = { x: contracted, value: contractedValue }
      continue
    }
    simplex = simplex.map((vertex, i) => {
      if (i === 0) return vertex
      const x = blend(simplex[0].x, vertex.x, 0.5)
      return { x, value: objective(x) }
    })
  }
  simplex.sort((a, b) => a.value - b.value)
  return simplex[0].x
}

// ---------------------------------------------------------------------------
// The frames
// ---------------------------------------------------------------------------

export interface FrameResult {
  frame: CanonicalHandFrame
  /** The palm similarity, for the profile-based methods. */
  palmFit?: Similarity
  /** Fitted chain: MCP flex, MCP abduction, PIP flex, DIP flex (radians), log length scale. */
  articulation?: readonly number[]
  /** RMS residual of the finger-chain fit, in scene units. */
  chainResidual?: number
}

/** The profile's own index frame carried into the scene by a palm fit. */
const profileFrameThrough = (profile: HandProfile3D, fit: Similarity, finger: Finger): CanonicalHandFrame | null => {
  const own = buildCanonicalHandFrame(profile.landmarks, finger)
  if (!own) return null
  const basis = {
    x: applyRotation(fit.rotation, own.basis.x),
    y: applyRotation(fit.rotation, own.basis.y),
    z: applyRotation(fit.rotation, own.basis.z),
  }
  return {
    origin: applySimilarity(fit, own.origin),
    basis,
    scaleReferenceLength: fit.scale * own.scaleReferenceLength,
  }
}

const palmFit = (
  profile: HandProfile3D,
  landmarks: readonly (Vec3 | null)[],
  names: readonly string[],
): Similarity | null => {
  const indices = names.map(indexOf)
  const scene = indices.map(i => landmarks[i])
  const model = indices.map(i => profile.landmarks[i])
  if (!valid(scene) || !valid(model)) return null
  return fitSimilarity(model, scene)
}

/** Angle from `from` to `to` about `axis`, both projected onto its normal plane. */
const signedAngle = (from: Vec3, to: Vec3, axis: Vec3): number => {
  const a = normalize(sub(from, scale(axis, dot(from, axis))))
  const b = normalize(sub(to, scale(axis, dot(to, axis))))
  if (!a || !b) return 0
  return Math.atan2(dot(cross(a, b), axis), dot(a, b))
}

/** How the finger-chain fit reads the TIP landmark. */
type TipUse = 'point' | 'direction' | 'none'

/**
 * Fits a low-dimensional articulation of the profile's finger chain — flexion
 * and abduction at the MCP joint, flexion at PIP and DIP, and one uniform
 * finger-length scale — so that it lands on the observed PIP, DIP and TIP.
 * The profile supplies the bone proportions and the resting curl; the day's
 * landmarks only choose five numbers.
 *
 * `tip` decides what TIP contributes: its position ('point'), only its
 * direction from the observed DIP ('direction'), or nothing ('none', when the
 * DIP angle is held at the calibrated posture by the prior).
 *
 * The length scale is there because an H1 profile carries no finger lengths:
 * without it a chain that cannot reach the observed joints settles into one of
 * two contorted fits (PIP and DIP bent hard in opposite directions), and a
 * pixel of noise flips between them. A weak prior keeps the articulation near
 * the calibrated posture for the same reason. Before both were added, F3 and
 * F3d showed outliers of up to 162% origin and 49 degrees of axis
 * (docs/product/NAIL_SOCKET_POC_PLAN.md §6-K A).
 */
const fitChain = (
  profile: HandProfile3D,
  fit: Similarity,
  landmarks: readonly (Vec3 | null)[],
  finger: Finger,
  tip: TipUse,
): { joints: [Vec3, Vec3, Vec3, Vec3]; lateral: Vec3; normal: Vec3; angles: number[]; residual: number } | null => {
  const own = buildCanonicalHandFrame(profile.landmarks, finger)
  if (!own) return null
  const chain = FINGER_LANDMARKS[finger]
  // PIP and DIP always; TIP only when the fit reads it (observed[2] exists then).
  const observed = (tip === 'none' ? chain.slice(1, 3) : chain.slice(1, 4)).map(i => landmarks[i])
  if (!valid(observed)) return null
  const mapped = chain.map(i => applySimilarity(fit, profile.landmarks[i])) as [Vec3, Vec3, Vec3, Vec3]
  const lateral = normalize(applyRotation(fit.rotation, own.basis.x)) ?? ([1, 0, 0] as Vec3)
  const normal = normalize(applyRotation(fit.rotation, own.basis.z)) ?? ([0, 0, 1] as Vec3)
  const segments = [sub(mapped[1], mapped[0]), sub(mapped[2], mapped[1]), sub(mapped[3], mapped[2])]
  const reference = distance(mapped[1], mapped[0])

  const pose = (params: number[]): [Vec3, Vec3, Vec3, Vec3] => {
    const [mcpFlex, mcpAbduct, pipFlex, dipFlex, logLength] = params
    const length = Math.exp(logLength)
    const turn = (v: Vec3) => rotateAroundAxis(rotateAroundAxis(scale(v, length), lateral, mcpFlex), normal, mcpAbduct)
    const axisAfter = rotateAroundAxis(lateral, normal, mcpAbduct)
    const d1 = turn(segments[0])
    const d2 = rotateAroundAxis(turn(segments[1]), axisAfter, pipFlex)
    const d3 = rotateAroundAxis(turn(segments[2]), axisAfter, pipFlex + dipFlex)
    const pip = add(mapped[0], d1)
    const dip = add(pip, d2)
    return [mapped[0], pip, dip, add(dip, d3)]
  }
  // Prior: an articulation of ~0.2 rad, or a 20% length change, costs about as
  // much as one landmark being a few pixels off.
  const prior = 0.02 * reference * reference
  // For 'direction', the observed distal direction is compared with the fitted
  // one; scaled by the fitted distal length, it costs like a TIP displaced
  // across the finger, and a TIP displaced ALONG the finger costs nothing.
  const observedDistal = tip === 'direction' ? normalize(sub(observed[2], observed[1])) : null
  const tipCost = (joints: [Vec3, Vec3, Vec3, Vec3]): number => {
    if (tip === 'point') return distance(joints[3], observed[2]) ** 2
    if (tip === 'none' || !observedDistal) return 0
    const distal = sub(joints[3], joints[2])
    const length = Math.hypot(distal[0], distal[1], distal[2])
    return length > 1e-12 ? distance(scale(distal, 1 / length), observedDistal) ** 2 * length * length : 0
  }
  const fitCostOf = (joints: [Vec3, Vec3, Vec3, Vec3]): number =>
    distance(joints[1], observed[0]) ** 2 + distance(joints[2], observed[1]) ** 2 + tipCost(joints)
  const cost = (params: number[]) =>
    fitCostOf(pose(params)) + prior * (params[0] ** 2 + params[1] ** 2 + params[2] ** 2 + params[3] ** 2 + params[4] ** 2)

  // Closed-form start: each joint angle from its own segment, in order.
  const start = (() => {
    // The length guess reads the farthest joint the fit is allowed to use.
    const lengthGuess =
      tip === 'point'
        ? Math.log(distance(observed[2], mapped[0]) / Math.max(1e-9, distance(mapped[3], mapped[0])))
        : Math.log(distance(observed[1], mapped[0]) / Math.max(1e-9, distance(mapped[2], mapped[0])))
    const params = [0, 0, 0, 0, lengthGuess]
    const toPip = sub(observed[0], mapped[0])
    params[0] = signedAngle(segments[0], toPip, lateral)
    params[1] = signedAngle(segments[0], toPip, normal)
    let joints = pose(params)
    params[2] = signedAngle(sub(joints[2], joints[1]), sub(observed[1], joints[1]), lateral)
    joints = pose(params)
    if (tip !== 'none') {
      const towardTip = tip === 'point' ? sub(observed[2], joints[2]) : sub(observed[2], observed[1])
      params[3] = signedAngle(sub(joints[3], joints[2]), towardTip, lateral)
    }
    return params
  })()

  let best = nelderMead(cost, start, 0.05, 400)
  best = nelderMead(cost, best, 0.005, 400)
  // Also from the calibrated posture, in case the closed-form start misled.
  let neutral = nelderMead(cost, [0, 0, 0, 0, start[4]], 0.05, 400)
  neutral = nelderMead(cost, neutral, 0.005, 400)
  if (cost(neutral) < cost(best)) best = neutral

  const joints = pose(best)
  const residual = Math.sqrt(fitCostOf(joints) / (tip === 'none' ? 2 : 3))
  return {
    joints,
    lateral: rotateAroundAxis(lateral, normal, best[1]),
    normal,
    angles: best,
    residual,
  }
}

/**
 * Builds the canonical frame for `finger` by `method` from lifted landmarks
 * and, where the method needs one, the Personal HandProfile.
 */
export const buildFrame = (
  method: FrameMethod,
  landmarks: readonly (Vec3 | null)[],
  finger: Finger,
  profile?: HandProfile3D,
): FrameResult | null => {
  const all = landmarks
  const [mcpIndex, pipIndex, dipIndex, tipIndex] = FINGER_LANDMARKS[finger]

  if (method === 'F0') {
    if (!valid(all)) return null
    const frame = buildCanonicalHandFrame(all, finger)
    return frame ? { frame } : null
  }

  if (method === 'F1' || method === 'F1nw') {
    if (!profile) return null
    const fit = palmFit(profile, all, method === 'F1' ? PALM_FIT_WITH_WRIST : PALM_FIT_WITHOUT_WRIST)
    if (!fit) return null
    const frame = profileFrameThrough(profile, fit, finger)
    return frame ? { frame, palmFit: fit } : null
  }

  if (method === 'F2' || method === 'F4') {
    if (!valid(all) || !profile) return null
    const span = distance(all[FINGER_LANDMARKS.index[0]], all[FINGER_LANDMARKS.pinky[0]])
    // Scale from the palm span — a different observable from the axis — via
    // the profile's phalanx-to-span ratio, so the unit stays "proximal phalanx".
    const scaleReferenceLength = span * phalanxPerSpan(profile, finger)
    if (!(scaleReferenceLength > 1e-9)) return null

    if (method === 'F4') {
      const basis = orthonormalBasis(sub(all[tipIndex], all[dipIndex]), palmNormalOf(all))
      return basis ? { frame: { origin: all[dipIndex], basis, scaleReferenceLength } } : null
    }
    // F2: principal direction of MCP, PIP, DIP, TIP; origin = the MCP's foot
    // on that line, so a single noisy MCP does not move it along the finger.
    const points = [all[mcpIndex], all[pipIndex], all[dipIndex], all[tipIndex]]
    const centre = scale(points.reduce<Vec3>((sum, point) => add(sum, point), [0, 0, 0]), 1 / points.length)
    let direction: Vec3 = sub(points[3], points[0])
    for (let i = 0; i < 30; i += 1) {
      // Power iteration on the scatter matrix.
      let next: Vec3 = [0, 0, 0]
      for (const point of points) {
        const d = sub(point, centre)
        next = add(next, scale(d, dot(d, direction)))
      }
      direction = normalize(next) ?? direction
    }
    const basis = orthonormalBasis(direction, palmNormalOf(all))
    if (!basis) return null
    const origin = add(centre, scale(basis.y, dot(sub(all[mcpIndex], centre), basis.y)))
    return { frame: { origin, basis, scaleReferenceLength } }
  }

  // F3 and the F3d family: palm fit for scale, chain fit for origin and axis.
  if (!profile) return null
  const fit = palmFit(profile, all, PALM_FIT_WITH_WRIST)
  if (!fit) return null
  const tipUse: TipUse = method === 'F3dDir' ? 'direction' : method === 'F3dNoTip' ? 'none' : 'point'
  const chain = fitChain(profile, fit, all, finger, tipUse)
  if (!chain) return null
  const own = buildCanonicalHandFrame(profile.landmarks, finger)
  if (!own) return null
  const scaleReferenceLength = fit.scale * own.scaleReferenceLength
  const [mcp, pip, dip, tip] = chain.joints
  const anchoredDistally = method !== 'F3'
  const axis = anchoredDistally ? sub(tip, dip) : sub(pip, mcp)
  const basis = orthonormalBasis(axis, chain.normal)
  if (!basis) return null
  return {
    frame: { origin: anchoredDistally ? dip : mcp, basis, scaleReferenceLength },
    palmFit: fit,
    articulation: chain.angles,
    chainResidual: chain.residual,
  }
}

// ---------------------------------------------------------------------------
// Comparing a frame with its reference
// ---------------------------------------------------------------------------

export interface FrameError {
  /** Origin displacement, in units of the reference frame's scale. */
  originInScale: number
  /** Angle between the finger axes, in degrees. */
  axisDeg: number
  /** Angle between the dorsal (+z) axes, in degrees. */
  normalDeg: number
  /** Relative scale error. */
  scaleRatio: number
}

const angleDeg = (a: Vec3, b: Vec3): number => (Math.acos(Math.min(1, Math.max(-1, dot(a, b)))) * 180) / Math.PI

/**
 * Error of `estimate` against `reference`, both in the same coordinates.
 * `commonShift` removes a translation shared by every lifted point (the
 * lift's depth anchor), which moves the frame and the bed together and so
 * cannot affect a socket.
 */
export const frameError = (
  estimate: CanonicalHandFrame,
  reference: CanonicalHandFrame,
  commonShift: Vec3 = [0, 0, 0],
): FrameError => ({
  originInScale: distance(sub(estimate.origin, commonShift), reference.origin) / reference.scaleReferenceLength,
  axisDeg: angleDeg(estimate.basis.y, reference.basis.y),
  normalDeg: angleDeg(estimate.basis.z, reference.basis.z),
  scaleRatio: estimate.scaleReferenceLength / reference.scaleReferenceLength - 1,
})
