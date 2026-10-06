// Controlled socket perturbation for perceptual calibration (#405).
//
// The calibration asks a person where a socket error *starts to look wrong*.
// To ask that question we must be able to inject an error of an exactly known
// size along one axis at a time, leaving everything else untouched.
//
// All amounts are RELATIVE (a fraction of the socket's own bed length, an
// angle, a scale ratio), so this works directly on the contract's metre-valued
// NailSocket without needing — or implying — any unit conversion.
//
// Each knob maps to one technical metric:
//   originShiftRatio  -> M1 / T_pos      (fraction of bed length)
//   normalTiltDeg     -> M2 / T_normal   (degrees)
//   tangentRotationDeg-> M3 / T_tangent  (degrees)
//   sizeScaleRatio    -> M4 / T_size     (coefficient of variation)

import { add, cross, degToRad, dot, normalize, rotateAroundAxis, scale, sub } from './vec3.ts'
import type { Vec3 } from './vec3.ts'
import type { HandProfile, NailSocket } from './nail3dContract.ts'

/** Which way the socket origin is displaced. */
export type OriginAxis = 'lateral' | 'longitudinal' | 'normal'

/** Which bed dimension the size perturbation touches. */
export type SizeMode = 'uniform' | 'width' | 'length'

export interface SocketPerturbation {
  /** Origin displacement, as a fraction of the socket's bed length. */
  originShiftRatio?: number
  originAxis?: OriginAxis
  /** Roll of the nail surface about the finger axis, in degrees. */
  normalTiltDeg?: number
  /** Yaw of the finger axis about the surface normal, in degrees. */
  tangentRotationDeg?: number
  /** Bed size change as a fraction, e.g. 0.1 for +10%. */
  sizeScaleRatio?: number
  sizeMode?: SizeMode
}

export const NO_PERTURBATION: SocketPerturbation = {}

export const PERTURBATION_DIMENSIONS = ['origin', 'normal', 'tangent', 'size'] as const
export type PerturbationDimension = (typeof PERTURBATION_DIMENSIONS)[number]

const asVec3 = (value: readonly number[]): Vec3 => [value[0], value[1], value[2]]

/**
 * The socket's own axis set. `lateral` completes the frame: it runs across the
 * nail, which is the direction a nail visibly slides off the finger.
 *
 * The axes are re-orthogonalized with the tangent held fixed, matching
 * `socketMatrix()` in nail3dGeometry. A scan does not guarantee a right angle
 * between tangent and normal, and without this a "5 degree" tilt about the
 * tangent would turn the normal by less than 5 degrees — the slider would lie
 * about the size of the error being judged.
 */
const socketAxes = (socket: NailSocket): { tangent: Vec3; normal: Vec3; lateral: Vec3 } | null => {
  const tangent = normalize(asVec3(socket.tangent))
  if (!tangent) return null
  const rawNormal = asVec3(socket.normal)
  const normal = normalize(sub(rawNormal, scale(tangent, dot(rawNormal, tangent))))
  if (!normal) return null
  const lateral = normalize(cross(tangent, normal))
  if (!lateral) return null
  return { tangent, normal, lateral }
}

/**
 * Applies a perturbation to one socket.
 *
 * Rotations are taken about the ORIGINAL axes, so the knobs stay independent:
 * a normal tilt leaves the tangent exactly where it was and vice versa.
 *
 * Returns the socket unchanged when its axes are degenerate — there is nothing
 * meaningful to perturb, and silently producing NaN would poison the view.
 */
export const perturbSocket = (socket: NailSocket, perturbation: SocketPerturbation): NailSocket => {
  const axes = socketAxes(socket)
  if (!axes) return socket

  const {
    originShiftRatio = 0,
    originAxis = 'lateral',
    normalTiltDeg = 0,
    tangentRotationDeg = 0,
    sizeScaleRatio = 0,
    sizeMode = 'uniform',
  } = perturbation

  let origin = asVec3(socket.origin)
  if (originShiftRatio !== 0) {
    const direction =
      originAxis === 'longitudinal' ? axes.tangent : originAxis === 'normal' ? axes.normal : axes.lateral
    origin = add(origin, scale(direction, originShiftRatio * socket.bedLength))
  }

  // Roll the surface about the finger axis; the tangent is unaffected.
  const normal =
    normalTiltDeg === 0 ? axes.normal : rotateAroundAxis(axes.normal, axes.tangent, degToRad(normalTiltDeg))
  // Yaw the finger axis about the surface normal; the normal is unaffected.
  const tangent =
    tangentRotationDeg === 0
      ? axes.tangent
      : rotateAroundAxis(axes.tangent, axes.normal, degToRad(tangentRotationDeg))

  const widthFactor = sizeMode === 'length' ? 1 : 1 + sizeScaleRatio
  const lengthFactor = sizeMode === 'width' ? 1 : 1 + sizeScaleRatio

  return {
    ...socket,
    origin: [origin[0], origin[1], origin[2]],
    normal: [normal[0], normal[1], normal[2]],
    tangent: [tangent[0], tangent[1], tangent[2]],
    bedWidth: Math.max(socket.bedWidth * widthFactor, 1e-9),
    bedLength: Math.max(socket.bedLength * lengthFactor, 1e-9),
  }
}

/**
 * Applies the same perturbation to every socket of a HandProfile, or only to
 * the listed fingers.
 */
export const perturbHandProfile = (
  profile: HandProfile,
  perturbation: SocketPerturbation,
  fingers?: readonly string[],
): HandProfile => ({
  ...profile,
  nailSockets: profile.nailSockets.map(socket =>
    !fingers || fingers.includes(socket.finger) ? perturbSocket(socket, perturbation) : socket,
  ),
})

/**
 * The technical metric a given perturbation corresponds to.
 *
 * `pairwise` is the value measured between the two views the person is
 * comparing (what M6 and `originOffsetRatio` report). `m1Equivalent` is what
 * M1 would report over those same two captures: M1 is a scatter about the
 * mean, so a balanced pair reads half the injected displacement. Showing both
 * keeps the recorded threshold from being misread by a factor of two.
 */
export interface MetricCorrespondence {
  dimension: PerturbationDimension
  pairwise: number
  m1Equivalent?: number
  unit: 'bedLengthRatio' | 'degrees' | 'scaleRatio'
  metric: 'M1' | 'M2' | 'M3' | 'M4'
}

export const metricCorrespondence = (
  dimension: PerturbationDimension,
  amount: number,
): MetricCorrespondence => {
  switch (dimension) {
    case 'origin':
      return {
        dimension,
        pairwise: amount,
        m1Equivalent: amount / 2,
        unit: 'bedLengthRatio',
        metric: 'M1',
      }
    case 'normal':
      return { dimension, pairwise: amount, m1Equivalent: amount / 2, unit: 'degrees', metric: 'M2' }
    case 'tangent':
      return { dimension, pairwise: amount, m1Equivalent: amount / 2, unit: 'degrees', metric: 'M3' }
    case 'size':
      // CV of the two bed values {s, s*(1+a)} about their mean.
      return {
        dimension,
        pairwise: amount,
        m1Equivalent: Math.abs(amount) / (2 + amount),
        unit: 'scaleRatio',
        metric: 'M4',
      }
  }
}

/** Builds the perturbation for one dimension at a given amount. */
export const perturbationFor = (
  dimension: PerturbationDimension,
  amount: number,
  options: { originAxis?: OriginAxis; sizeMode?: SizeMode } = {},
): SocketPerturbation => {
  switch (dimension) {
    case 'origin':
      return { originShiftRatio: amount, originAxis: options.originAxis ?? 'lateral' }
    case 'normal':
      return { normalTiltDeg: amount }
    case 'tangent':
      return { tangentRotationDeg: amount }
    case 'size':
      return { sizeScaleRatio: amount, sizeMode: options.sizeMode ?? 'uniform' }
  }
}
