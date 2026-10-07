// Stage 10 — the few statistics the analysis needs, without a dependency.
//
// Everything here is session-level: one value per placement of the hand, so
// a session is the unit of replication and the only thing resampled.

/** ln Γ(x) for x > 0 (Lanczos, g = 7). */
const logGamma = (x: number): number => {
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x)
  const z = x - 1
  let sum = c[0]
  for (let i = 1; i < 9; i += 1) sum += c[i] / (z + i)
  const t = z + 7.5
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(sum)
}

/** Continued fraction for the incomplete beta (modified Lentz). */
const betaFraction = (x: number, a: number, b: number): number => {
  const tiny = 1e-300
  let c = 1
  let d = 1 - ((a + b) * x) / (a + 1)
  if (Math.abs(d) < tiny) d = tiny
  d = 1 / d
  let h = d
  for (let m = 1; m <= 300; m += 1) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < tiny) d = tiny
    c = 1 + aa / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1))
    d = 1 + aa * d
    if (Math.abs(d) < tiny) d = tiny
    c = 1 + aa / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const delta = d * c
    h *= delta
    if (Math.abs(delta - 1) < 1e-14) break
  }
  return h
}

/** Regularized incomplete beta I_x(a, b). */
export const incompleteBeta = (x: number, a: number, b: number): number => {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const front = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  return x < (a + 1) / (a + b + 2) ? (front * betaFraction(x, a, b)) / a : 1 - (front * betaFraction(1 - x, b, a)) / b
}

export const studentTCdf = (t: number, dof: number): number => {
  const tail = 0.5 * incompleteBeta(dof / (dof + t * t), dof / 2, 0.5)
  return t >= 0 ? 1 - tail : tail
}

/** The t value with P(T <= t) = p, by bisection (dof may be fractional, as Welch's is). */
export const studentTQuantile = (p: number, dof: number): number => {
  if (!(dof > 0) || !(p > 0 && p < 1)) return Number.NaN
  let lo = -1e4
  let hi = 1e4
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2
    if (studentTCdf(mid, dof) < p) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export const mean = (values: readonly number[]): number =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : Number.NaN

/** Sample variance (n − 1). */
export const variance = (values: readonly number[]): number => {
  if (values.length < 2) return Number.NaN
  const m = mean(values)
  return values.reduce((sum, value) => sum + (value - m) ** 2, 0) / (values.length - 1)
}

export interface WelchDifference {
  /** mean(b) − mean(a). */
  delta: number
  se: number
  /** Welch–Satterthwaite degrees of freedom. */
  dof: number
  /** 95% interval for delta, t(dof). */
  ci95: [number, number]
}

/** Difference of two session means, each group with its own variance. */
export const welchDifference = (a: readonly number[], b: readonly number[]): WelchDifference => {
  if (a.length < 2 || b.length < 2) return { delta: Number.NaN, se: Number.NaN, dof: Number.NaN, ci95: [Number.NaN, Number.NaN] }
  const va = variance(a) / a.length
  const vb = variance(b) / b.length
  const delta = mean(b) - mean(a)
  const se = Math.sqrt(va + vb)
  const dof = se > 0 ? (va + vb) ** 2 / (va ** 2 / (a.length - 1) + vb ** 2 / (b.length - 1)) : Number.NaN
  const half = studentTQuantile(0.975, dof) * se
  return { delta, se, dof, ci95: [delta - half, delta + half] }
}

export interface Jackknife {
  estimate: number
  /** Delete-one standard error. */
  se: number
  /** Units actually left out (replicates with a finite value). */
  units: number
  /** 95% interval, estimate ± t(units − 1) · se. */
  ci95: [number, number]
}

/**
 * Delete-one jackknife over sessions. `statistic` is recomputed from scratch
 * on every subset, so anything that depends on the sample (centring, units)
 * is left out together with the session.
 */
export const jackknife = <T>(units: readonly T[], statistic: (subset: readonly T[]) => number): Jackknife => {
  const estimate = statistic(units)
  const replicates = units.map((_, index) => statistic(units.filter((__, other) => other !== index))).filter(Number.isFinite)
  const n = replicates.length
  if (!Number.isFinite(estimate) || n < 3 || n !== units.length) {
    return { estimate, se: Number.NaN, units: n, ci95: [Number.NaN, Number.NaN] }
  }
  const average = mean(replicates)
  const se = Math.sqrt(((n - 1) / n) * replicates.reduce((sum, value) => sum + (value - average) ** 2, 0))
  const half = studentTQuantile(0.975, n - 1) * se
  return { estimate, se, units: n, ci95: [estimate - half, estimate + half] }
}
