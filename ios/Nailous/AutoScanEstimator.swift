import UIKit

/// Ties `NailAngleMeasurer` (photo → numeric summary) and
/// `NailShapeEstimator` (numeric summary → NailPlateParams guess) together
/// for a completed 立体スキャン capture (issue #389). A failing angle (bad
/// segmentation, low fit confidence) just leaves those fields untouched —
/// the roadmap's "推定失敗時にユーザー体験が壊れない（手動値のまま）".
enum AutoScanEstimator {
    enum Field: Hashable {
        case shape, corner, length, width, curveV, thickness, curveH
    }

    struct Result {
        var shape: NailShape?
        var params = NailPlateParams()
        var fields: Set<Field> = []
    }

    /// `photos` is `NailRecord.anglePhotoData`-shaped: 4 slots in
    /// `AngleStep` order, nil where that angle wasn't captured.
    static func estimate(from photos: [UIImage?]) -> Result {
        var result = Result()

        if let top = photo(photos, .top), let cg = top.cgImage,
           let mask = NailAngleMeasurer.mask(for: cg),
           let (profile, aspect) = NailAngleMeasurer.topWidthProfile(mask: mask),
           let estimate = NailShapeEstimator.estimateTop(widthProfile: profile, aspectRatio: aspect) {
            result.shape = estimate.shape
            result.params.corner = estimate.corner
            result.params.length = estimate.length
            result.params.width = estimate.width
            result.fields.formUnion([.shape, .corner, .length, .width])
        }

        let sideMeasurements: [(archRatio: Float, thicknessRatio: Float)] = [AngleStep.side, .otherSide].compactMap { step in
            guard let image = photo(photos, step), let cg = image.cgImage,
                  let mask = NailAngleMeasurer.mask(for: cg)
            else { return nil }
            return NailAngleMeasurer.sideArchAndThickness(mask: mask)
        }
        if !sideMeasurements.isEmpty {
            // Both angles disagreeing sharply is itself a low-confidence
            // signal (roadmap: "乖離が大きければ不採用").
            let agrees = sideMeasurements.count < 2 || abs(sideMeasurements[0].archRatio - sideMeasurements[1].archRatio) < 0.08
            let archRatio = sideMeasurements.map(\.archRatio).reduce(0, +) / Float(sideMeasurements.count)
            let thicknessRatio = sideMeasurements.map(\.thicknessRatio).reduce(0, +) / Float(sideMeasurements.count)
            if agrees, let estimate = NailShapeEstimator.estimateSide(archRatio: archRatio, thicknessRatio: thicknessRatio) {
                result.params.curveV = estimate.curveV
                result.params.thickness = estimate.thickness
                result.fields.formUnion([.curveV, .thickness])
            }
        }

        if let catImage = photo(photos, .catHand), let cg = catImage.cgImage,
           let mask = NailAngleMeasurer.mask(for: cg),
           let ratio = NailAngleMeasurer.catPawSagittaOverChord(mask: mask),
           let estimate = NailShapeEstimator.estimateCatPaw(sagittaOverChord: ratio) {
            result.params.curveH = estimate.curveH
            result.fields.insert(.curveH)
        }

        return result
    }

    private static func photo(_ photos: [UIImage?], _ step: AngleStep) -> UIImage? {
        photos.indices.contains(step.rawValue) ? photos[step.rawValue] : nil
    }
}
