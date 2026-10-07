// Stage 8 — a socket estimator that actually uses the optional bed points.
//
// Layer A has carried cuticleApex and the two bed-wall points since Stage 3,
// but nothing downstream read them: the lift lifted four corners and the
// socket was read from those four. Counting points that no estimator consumes
// says nothing about whether they help, so this variant consumes them, each
// where it carries the most direct information:
//
//   cuticleApex   a second observation of the proximal end, so it is fused into
//                 the ORIGIN (inverse-variance with the cuticle chord midpoint)
//                 and joins the bed outline for the normal;
//   bed walls     a second measurement of the bed's WIDTH and two more outline
//                 points for the normal.
//
// Deliberately not done: pulling the origin toward the free edge or the walls.
// A line fit through proximal, wall and distal midpoints would shave a little
// noise off the origin, but it would make the origin move whenever the free
// edge is misplaced — the exact coupling Stage 1 showed has to be kept out.
//
// ⚠ The synthetic bed is a flat rectangle, so the apex lies ON the cuticle
// chord and the wall width equals the cuticle width. A real cuticle is curved
// (its apex sits proximal of the chord by the sagitta) and a real bed tapers.
// Fusing as below then shifts the origin proximally by a third of the sagitta
// and averages two different widths. Using these points on real nails needs
// that shape modelled, not assumed away.
//
// The default `estimateSocket` is untouched; this is a variant to compare
// against it, emitting the same NormalizedNailSocket type.

import type { Finger } from './nail3dContract.ts'
import type { LiftedBed } from './nail3dLift.ts'
import { buildCanonicalHandFrame } from './nail3dSocket.ts'
import type { NormalizedNailSocket, SocketObservation } from './nail3dSocket.ts'
import { distance, midpoint, normalize, scale, sub, toBasisCoords, toBasisDirection } from './vec3.ts'
import type { Vec3 } from './vec3.ts'

export interface BedFusionOptions {
  /** Fuse cuticleApex into the origin and the outline. */
  cuticleApex?: boolean
  /** Use the bed walls for the width and the outline. */
  bedWalls?: boolean
}

/** Newell's method over an ordered outline: the area-weighted plane normal. */
const outlineNormal = (outline: readonly Vec3[]): Vec3 | null => {
  let nx = 0
  let ny = 0
  let nz = 0
  for (let i = 0; i < outline.length; i += 1) {
    const current = outline[i]
    const next = outline[(i + 1) % outline.length]
    nx += (current[1] - next[1]) * (current[2] + next[2])
    ny += (current[2] - next[2]) * (current[0] + next[0])
    nz += (current[0] - next[0]) * (current[1] + next[1])
  }
  return normalize([nx, ny, nz])
}

export const estimateSocketFused = (
  landmarks: readonly Vec3[],
  bed: LiftedBed,
  finger: Finger,
  options: BedFusionOptions = {},
): SocketObservation | null => {
  const frame = buildCanonicalHandFrame(landmarks, finger)
  if (!frame) return null

  const [cuticleA, cuticleB, freeEdgeB, freeEdgeA] = bed.quad
  const apex = options.cuticleApex ? bed.optional?.cuticleApex : undefined
  const wallA = options.bedWalls ? bed.optional?.bedWallSideA : undefined
  const wallB = options.bedWalls ? bed.optional?.bedWallSideB : undefined

  // The chord midpoint averages two points, the apex is one: weights 2 : 1.
  const chordMid = midpoint(cuticleA, cuticleB)
  const proximal: Vec3 = apex
    ? [
        (2 * chordMid[0] + apex[0]) / 3,
        (2 * chordMid[1] + apex[1]) / 3,
        (2 * chordMid[2] + apex[2]) / 3,
      ]
    : chordMid
  const distal = midpoint(freeEdgeA, freeEdgeB)

  const tangentWorld = normalize(sub(distal, proximal))
  const cuticleWidth = distance(cuticleA, cuticleB)
  const widthWorld = wallA && wallB ? (cuticleWidth + distance(wallA, wallB)) / 2 : cuticleWidth
  const lengthWorld = distance(distal, proximal)
  if (!tangentWorld || !(widthWorld > 1e-9) || !(lengthWorld > 1e-9)) return null

  // Outline in boundary order, with whichever optional points are in use.
  const outline: Vec3[] = [cuticleA]
  if (apex) outline.push(apex)
  outline.push(cuticleB)
  if (wallB) outline.push(wallB)
  outline.push(freeEdgeB, freeEdgeA)
  if (wallA) outline.push(wallA)

  let normalWorld = outlineNormal(outline)
  if (!normalWorld) return null
  if (toBasisDirection(normalWorld, frame.basis)[2] < 0) normalWorld = scale(normalWorld, -1)

  const invScale = 1 / frame.scaleReferenceLength
  const socket: NormalizedNailSocket = {
    units: 'normalized',
    scaleReference: 'proximalPhalanx',
    finger,
    origin: scale(toBasisCoords(proximal, frame.origin, frame.basis), invScale),
    normal: toBasisDirection(normalWorld, frame.basis),
    tangent: toBasisDirection(tangentWorld, frame.basis),
    bedWidth: widthWorld * invScale,
    bedLength: lengthWorld * invScale,
  }
  return {
    socket,
    frame,
    canonicalLandmarks: landmarks.map(point => scale(toBasisCoords(point, frame.origin, frame.basis), invScale)),
  }
}
