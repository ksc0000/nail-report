import Foundation

/// Phase 2 of the 立体スキャン roadmap (issue #389, `docs/product/nailous-scan-roadmap.md`):
/// turns per-angle photo measurements into `NailPlateParams` guesses. Each
/// function here is a pure fit over a small numeric summary of one angle's
/// photo (see `NailAngleMeasurer` for how those summaries are extracted from
/// pixels), so the matching math can be unit-tested and benchmarked without
/// any image/Vision dependency.
///
/// The curveV/thickness/curveH calibration constants are a first pass
/// derived from `NailGeometry`'s own mesh formula (see comments below), not
/// from real photos — real-photo tuning is follow-up work once a photo
/// corpus with ground truth exists.
enum NailShapeEstimator {
    struct TopEstimate {
        let shape: NailShape
        let corner: Float
        let length: Float
        let width: Float
        let confidence: Float
    }

    struct SideEstimate {
        let curveV: Float
        let thickness: Float
        let confidence: Float
    }

    struct CatPawEstimate {
        let curveH: Float
        let confidence: Float
    }

    /// Matches a measured half-width profile w(t) (t: 0 → 1 along the mask's
    /// long axis, normalized to its own peak) against every
    /// `NailGeometry.widthFactor` shape/corner combination via least squares,
    /// picking the closest. Which end is the cuticle isn't known from the
    /// mask alone, so both directions are tried and the better fit wins.
    static func estimateTop(widthProfile: [Float], aspectRatio: Float) -> TopEstimate? {
        guard widthProfile.count >= 6 else { return nil }
        let samples = widthProfile.count
        let cornerCandidates = stride(from: Float(-1), through: 1, by: 0.2).map { $0 }

        var best: (shape: NailShape, corner: Float, rmse: Float)?
        for shape in NailShape.allCases {
            for corner in cornerCandidates {
                var predicted = (0..<samples).map { i -> Float in
                    NailGeometry.widthFactor(t: Float(i) / Float(samples - 1), shape: shape, corner: corner)
                }
                let peak = predicted.max() ?? 1
                if peak > 0 { predicted = predicted.map { $0 / peak } }

                for candidate in [predicted, Array(predicted.reversed())] {
                    let rmse = rootMeanSquareError(widthProfile, candidate)
                    if best == nil || rmse < best!.rmse {
                        best = (shape, corner, rmse)
                    }
                }
            }
        }
        guard let best else { return nil }

        // An RMSE of 0 is a perfect match; ~0.25 (a quarter of the profile's
        // own normalized range) is treated as "no real match" and gated out
        // (roadmap: "信頼度ゲート: 低い項目は推定しない").
        let confidence = max(0, 1 - best.rmse / 0.25)
        guard confidence >= 0.5 else { return nil }

        let canonicalAspect = Float(NailGeometry.plateAspect(for: best.shape))
        let observedOverCanonical = canonicalAspect > 0 ? aspectRatio / canonicalAspect : 1
        // A single aspect ratio can't separate length from width in
        // isolation (a photo has no absolute scale reference); split the
        // deviation between them as a first-pass approximation. A wider-
        // than-canonical mask reads as both "shorter" and "wider".
        let delta = max(-1, min(1, (observedOverCanonical - 1) * 2))
        let length = max(-1, min(1, -delta))
        let width = max(-1, min(1, delta * 0.5))

        return TopEstimate(shape: best.shape, corner: best.corner, length: length, width: width, confidence: confidence)
    }

    /// `archRatio`: sagitta of the mask's centerline bow at its midpoint,
    /// divided by the mask's length — the side-view stand-in for
    /// `NailGeometry`'s lengthwise arch (`arch = 0.14 * curveV` at the
    /// midpoint, in the same plate units as its ~2.2-unit mean plate
    /// height). `thicknessRatio`: the free-edge band width divided by that
    /// same length, standing in for `thickness = 0.055 + 0.05 * thickness`.
    /// Both ratios are scale-invariant so they transfer from photo pixels
    /// without a physical size reference.
    static func estimateSide(archRatio: Float, thicknessRatio: Float) -> SideEstimate? {
        guard archRatio.isFinite, thicknessRatio.isFinite else { return nil }
        let meanPlateHeight: Float = 2.2
        let archSensitivity: Float = 0.14 / meanPlateHeight
        let rawCurveV = archRatio / archSensitivity

        let thicknessBaseline: Float = 0.055 / meanPlateHeight
        let thicknessSensitivity: Float = 0.05 / meanPlateHeight
        let rawThickness = (thicknessRatio - thicknessBaseline) / thicknessSensitivity

        let confidence = confidenceFromOverrun([rawCurveV, rawThickness])
        guard confidence >= 0.5 else { return nil }
        return SideEstimate(curveV: clamp(rawCurveV), thickness: clamp(rawThickness), confidence: confidence)
    }

    /// `sagittaOverChord`: how much the mask's width bulges at its widest
    /// row versus its neighbours nearby, relative to that width — the
    /// cat's-paw stand-in for the C-curve cross-section (`NailGeometry`'s
    /// `bulge` term, which is never zero even at curveH=0 since the plate
    /// always has some base convexity — hence the nonzero baseline below).
    static func estimateCatPaw(sagittaOverChord: Float) -> CatPawEstimate? {
        guard sagittaOverChord.isFinite else { return nil }
        let baseline: Float = 0.145
        let sensitivity: Float = 0.85 * baseline
        let raw = (sagittaOverChord - baseline) / sensitivity
        let confidence = confidenceFromOverrun([raw])
        guard confidence >= 0.5 else { return nil }
        return CatPawEstimate(curveH: clamp(raw), confidence: confidence)
    }

    private static func clamp(_ v: Float) -> Float { max(-1, min(1, v)) }

    /// 1 when every raw value already sits inside the representable [-1, 1]
    /// range; drops toward 0 the further any of them overshoots it (a sign
    /// the underlying photo measurement is unreliable, not just an extreme
    /// but real nail).
    private static func confidenceFromOverrun(_ raws: [Float]) -> Float {
        let overrun = raws.map { max(0, abs($0) - 1) }.max() ?? 0
        return max(0, 1 - overrun)
    }

    private static func rootMeanSquareError(_ a: [Float], _ b: [Float]) -> Float {
        guard a.count == b.count, !a.isEmpty else { return .infinity }
        let sumSquares = zip(a, b).reduce(Float(0)) { $0 + ($1.0 - $1.1) * ($1.0 - $1.1) }
        return sqrt(sumSquares / Float(a.count))
    }
}
