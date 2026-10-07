// Synthetic hand generator for the #405 socket PoC (stage 1).
//
// Produces 21 landmarks plus nail-bed and full-nail quads for a known hand,
// with controllable rigid pose, uniform scale, Gaussian noise and nail length.
// Everything is deterministic given a seed, so a failing metric is always
// reproducible.
//
// The point of stage 1 is to prove the estimator and the metrics *detect*
// error before any real photo exists, so this generator has to be able to
// inject error of a known size.

import type { Finger } from '../../src/lib/nail3dContract.ts'
import type { NailBedCorners } from '../../src/lib/nail3dSocket.ts'
import { FINGER_LANDMARKS, LANDMARK_COUNT, WRIST } from '../../src/lib/nail3dSocket.ts'
import { add, cross, distance, normalize, scale, sub } from '../../src/lib/vec3.ts'
import type { Vec3 } from '../../src/lib/vec3.ts'

// --- deterministic randomness ----------------------------------------------

const mulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Exported so each view of a multi-view capture can draw its OWN annotation
 * noise. Perturbing the 3D hand once and projecting it twice gives both views
 * identical error, which a two-view lift then reconstructs perfectly — the
 * error has to be injected per view, in pixels, to mean anything.
 */
export const gaussianSource = (seed: number): (() => number) => {
  const random = mulberry32(seed)
  return () => {
    // Box-Muller; the uniform is clamped away from 0 to avoid log(0).
    const u = Math.max(random(), 1e-12)
    const v = random()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
}

// --- hand layout (arbitrary "hand units"; scale is applied by the pose) -----

interface FingerLayout {
  mcp: Vec3
  /** proximal, middle, distal bone lengths */
  bones: readonly [number, number, number]
  /** radians of curl applied cumulatively per joint, toward the palm (-z) */
  curl: number
}

const LAYOUT: Record<Finger, FingerLayout> = {
  thumb: { mcp: [-0.40, 0.30, 0.04], bones: [0.30, 0.25, 0.18], curl: 0.22 },
  index: { mcp: [-0.15, 0.85, 0.0], bones: [0.42, 0.26, 0.18], curl: 0.10 },
  middle: { mcp: [0.0, 0.90, 0.0], bones: [0.46, 0.29, 0.19], curl: 0.09 },
  ring: { mcp: [0.15, 0.86, 0.0], bones: [0.42, 0.27, 0.18], curl: 0.11 },
  pinky: { mcp: [0.30, 0.78, 0.0], bones: [0.33, 0.20, 0.16], curl: 0.13 },
}

/** Bed length and width as fractions of the distal phalanx length. */
const BED_LENGTH_FRACTION = 0.55
const BED_WIDTH_FRACTION = 0.62
const FINGER_RADIUS_FRACTION = 0.30

export interface HandPose {
  translation: Vec3
  rotationAxis: Vec3
  rotationDeg: number
  scale: number
}

export const IDENTITY_POSE: HandPose = {
  translation: [0, 0, 0],
  rotationAxis: [0, 0, 1],
  rotationDeg: 0,
  scale: 1,
}

export interface SyntheticOptions {
  pose?: Partial<HandPose>
  /** Landmark noise sigma, as a fraction of the proximal phalanx length. */
  landmarkNoise?: number
  /** Nail-corner noise sigma, as a fraction of the bed length. */
  cornerNoise?: number
  /** Free edge beyond the bed, as a fraction of the bed length. */
  freeEdgeFraction?: number
  /**
   * Depth of the transverse metacarpal arch, as a fraction of palm width:
   * how far the middle MCP stands above the line from the index to the pinky.
   *
   * This is the hand's only non-finger depth, so it is what makes a
   * palm-only point set anything other than a plane. A real hand is around
   * 0.12-0.18; the default is 0, which keeps the palm exactly flat.
   */
  palmArch?: number
  /** Scales every depth about the palm plane: a thinner or thicker hand. */
  depthScale?: number
  /** Per-finger bone-length multiplier — finger proportion variation. */
  fingerScale?: Partial<Record<Finger, number>>
  /** Extra curl per joint, in degrees, added to the layout — articulation. */
  articulationDeg?: Partial<Record<Finger, number>>
  seed?: number
}

/** Curls the distal edge of a quad toward the palm, as real free edges do. */
const curlDistalEdge = (corners: NailBedCorners, drop: Vec3): NailBedCorners =>
  [corners[0], corners[1], add(corners[2], drop), add(corners[3], drop)] as unknown as NailBedCorners

export interface SyntheticHand {
  landmarks: Vec3[]
  bedCorners: Record<Finger, NailBedCorners>
  /** Bed plus free edge — what a naive full-nail outline would give. */
  fullNailCorners: Record<Finger, NailBedCorners>
}

/** Rodrigues rotation. */
const rotate = (point: Vec3, axis: Vec3, radians: number): Vec3 => {
  const k = normalize(axis)
  if (!k || radians === 0) return point
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return add(
    add(scale(point, cos), scale(cross(k, point), sin)),
    scale(k, (1 - cos) * (k[0] * point[0] + k[1] * point[1] + k[2] * point[2])),
  )
}

const applyPose = (point: Vec3, pose: HandPose): Vec3 =>
  add(rotate(scale(point, pose.scale), pose.rotationAxis, (pose.rotationDeg * Math.PI) / 180), pose.translation)

interface FingerChain {
  joints: [Vec3, Vec3, Vec3, Vec3]
  distalDir: Vec3
  dorsal: Vec3
  lateral: Vec3
  distalLength: number
}

/** The metacarpal arch: how far this finger's MCP stands off the palm plane. */
const archHeight = (finger: Finger, palmArch: number): number => {
  if (!palmArch) return 0
  const indexX = LAYOUT.index.mcp[0]
  const pinkyX = LAYOUT.pinky.mcp[0]
  const halfWidth = (pinkyX - indexX) / 2
  const centre = (pinkyX + indexX) / 2
  const offset = (LAYOUT[finger].mcp[0] - centre) / halfWidth
  // A parabola across the palm, peaking between the middle and ring MCPs and
  // falling to zero at the index and pinky — the shape of a real arch.
  return palmArch * (pinkyX - indexX) * Math.max(0, 1 - offset * offset)
}

const buildFingerChain = (
  finger: Finger,
  options: { palmArch?: number; boneScale?: number; extraCurlDeg?: number } = {},
): FingerChain => {
  const layout = LAYOUT[finger]
  const boneScale = options.boneScale ?? 1
  const curl = layout.curl + ((options.extraCurlDeg ?? 0) * Math.PI) / 180
  const mcp: Vec3 = [
    layout.mcp[0],
    layout.mcp[1],
    layout.mcp[2] + archHeight(finger, options.palmArch ?? 0),
  ]
  const joints: Vec3[] = [mcp]
  let direction: Vec3 = normalize([finger === 'thumb' ? -0.45 : 0, 1, 0]) ?? [0, 1, 0]
  const lateral: Vec3 = [1, 0, 0]

  for (let i = 0; i < 3; i += 1) {
    // Each joint curls a little toward the palm, so the nail plane is never
    // exactly axis-aligned and the frame is genuinely exercised.
    direction = normalize(rotate(direction, lateral, curl)) ?? direction
    joints.push(add(joints[i], scale(direction, layout.bones[i] * boneScale)))
  }

  const distalDir = normalize(sub(joints[3], joints[2])) ?? [0, 1, 0]
  const dorsal = normalize(cross(lateral, distalDir)) ?? [0, 0, 1]
  return {
    joints: joints as [Vec3, Vec3, Vec3, Vec3],
    distalDir,
    dorsal,
    lateral,
    distalLength: distance(joints[3], joints[2]),
  }
}

const bedQuad = (chain: FingerChain, lengthFraction: number): NailBedCorners => {
  const bedLength = chain.distalLength * lengthFraction
  const halfWidth = (chain.distalLength * BED_WIDTH_FRACTION) / 2
  const radius = chain.distalLength * FINGER_RADIUS_FRACTION

  // Proximal edge sits a little past the DIP, lifted onto the dorsal surface.
  const proximalCentre = add(
    add(chain.joints[2], scale(chain.distalDir, chain.distalLength * 0.12)),
    scale(chain.dorsal, radius),
  )
  const distalCentre = add(proximalCentre, scale(chain.distalDir, bedLength))
  const side = scale(chain.lateral, halfWidth)

  return [
    sub(proximalCentre, side),
    add(proximalCentre, side),
    add(distalCentre, side),
    sub(distalCentre, side),
  ]
}

/**
 * Builds a synthetic hand.
 *
 * `freeEdgeFraction` only lengthens `fullNailCorners`; `bedCorners` are
 * unaffected, because a nail bed does not move when the nail grows. Feeding
 * `fullNailCorners` into the estimator is how the M6 failure mode is staged.
 */
export const syntheticHand = (options: SyntheticOptions = {}): SyntheticHand => {
  const pose: HandPose = { ...IDENTITY_POSE, ...options.pose }
  const gaussian = gaussianSource(options.seed ?? 1)
  const freeEdge = options.freeEdgeFraction ?? 0

  const depthScale = options.depthScale ?? 1
  // A thinner or thicker hand: every depth about the palm plane is scaled
  // before the pose is applied, so the whole hand flattens together.
  const toWorld = (point: Vec3): Vec3 =>
    applyPose(depthScale === 1 ? point : [point[0], point[1], point[2] * depthScale], pose)

  const landmarks: Vec3[] = new Array<Vec3>(LANDMARK_COUNT).fill([0, 0, 0])
  // The wrist takes part in the palm normal, so it must be posed like any
  // other landmark — leaving it at the origin silently breaks translation
  // invariance while rotation still passes.
  landmarks[WRIST] = toWorld([0, 0, 0])

  const bedCorners = {} as Record<Finger, NailBedCorners>
  const fullNailCorners = {} as Record<Finger, NailBedCorners>

  for (const finger of Object.keys(LAYOUT) as Finger[]) {
    const chain = buildFingerChain(finger, {
      palmArch: options.palmArch,
      boneScale: options.fingerScale?.[finger],
      extraCurlDeg: options.articulationDeg?.[finger],
    })
    const indices = FINGER_LANDMARKS[finger]
    const proximalLength = LAYOUT[finger].bones[0]

    indices.forEach((landmarkIndex, jointIndex) => {
      let point = chain.joints[jointIndex]
      if (options.landmarkNoise) {
        const sigma = options.landmarkNoise * proximalLength
        point = add(point, [gaussian() * sigma, gaussian() * sigma, gaussian() * sigma])
      }
      landmarks[landmarkIndex] = toWorld(point)
    })

    const bedLength = chain.distalLength * BED_LENGTH_FRACTION
    const bed = bedQuad(chain, BED_LENGTH_FRACTION)
    // A longer nail is not just a longer rectangle: the free edge also curls
    // toward the palm, which tilts the plane a naive full-nail outline fits.
    const full = curlDistalEdge(
      bedQuad(chain, BED_LENGTH_FRACTION * (1 + freeEdge)),
      scale(chain.dorsal, -bedLength * freeEdge * 0.4),
    )

    const withNoise = (corners: NailBedCorners): NailBedCorners =>
      corners.map(corner => {
        if (!options.cornerNoise) return toWorld(corner)
        const sigma = options.cornerNoise * bedLength
        const jittered = add(corner, [gaussian() * sigma, gaussian() * sigma, gaussian() * sigma])
        return toWorld(jittered)
      }) as unknown as NailBedCorners

    bedCorners[finger] = withNoise(bed)
    fullNailCorners[finger] = withNoise(full)
  }

  return { landmarks, bedCorners, fullNailCorners }
}

/**
 * Moves a bed quad by a known fraction of its own length, along its own
 * surface. Used to check that M1 reports the displacement that was injected.
 */
export const shiftBedCorners = (corners: NailBedCorners, ratio: number): NailBedCorners => {
  const [proximalA, proximalB, distalB] = corners
  const widthDir = normalize(sub(proximalB, proximalA)) ?? ([1, 0, 0] as Vec3)
  const bedLength = distance(distalB, proximalB)
  const offset = scale(widthDir, bedLength * ratio)
  return corners.map(corner => add(corner, offset)) as unknown as NailBedCorners
}

/** Tilts a bed quad about its own width axis by a known angle, in degrees. */
export const tiltBedCorners = (corners: NailBedCorners, degrees: number): NailBedCorners => {
  const [proximalA, proximalB] = corners
  const axis = normalize(sub(proximalB, proximalA)) ?? ([1, 0, 0] as Vec3)
  const pivot = scale(add(proximalA, proximalB), 0.5)
  const radians = (degrees * Math.PI) / 180
  return corners.map(corner =>
    add(pivot, rotate(sub(corner, pivot), axis, radians)),
  ) as unknown as NailBedCorners
}
