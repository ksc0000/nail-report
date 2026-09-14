import UIKit

/// Ties `NailAngleMeasurer` (photo → numeric summary) and
/// `NailShapeEstimator` (numeric summary → NailPlateParams guess) together
/// for a completed 立体スキャン capture (issue #389). A failing angle (bad
/// segmentation, low fit confidence) just leaves those fields untouched —
/// the roadmap's "推定失敗時にユーザー体験が壊れない（手動値のまま）".
enum AutoScanEstimator {
    enum Field: String, Hashable, CaseIterable {
        case shape, corner, length, width, curveV, thickness, curveH
    }

    struct Result {
        var shape: NailShape?
        var params = NailPlateParams()
        var fields: Set<Field> = []

        /// Writes only the estimated fields onto the caller's state; untouched
        /// fields keep whatever the user (or the shape default) had.
        func apply(to shape: inout NailShape, params: inout NailPlateParams) {
            if fields.contains(.shape), let estimated = self.shape { shape = estimated }
            if fields.contains(.corner) { params.corner = self.params.corner }
            if fields.contains(.length) { params.length = self.params.length }
            if fields.contains(.width) { params.width = self.params.width }
            if fields.contains(.curveV) { params.curveV = self.params.curveV }
            if fields.contains(.thickness) { params.thickness = self.params.thickness }
            if fields.contains(.curveH) { params.curveH = self.params.curveH }
        }
    }

    struct HandResult {
        /// One entry per finger texture (thumb→pinky); nil where the fit
        /// wasn't confident.
        var fingerShapes: [NailShape?] = []
        var result = Result()
    }

    /// Hand capture: each finger's cropped top texture gives that finger's
    /// shape; the side / curled references give the curves shared by the
    /// hand. The record's overall shape is the most common finger shape.
    static func estimateHand(fingers: [UIImage], angles: [UIImage?]) -> HandResult {
        var hand = HandResult()
        hand.fingerShapes = fingers.map { image in
            guard let cg = image.cgImage,
                  let mask = NailAngleMeasurer.mask(for: cg),
                  let (profile, aspect) = NailAngleMeasurer.topWidthProfile(mask: mask),
                  let estimate = NailShapeEstimator.estimateTop(widthProfile: profile, aspectRatio: aspect)
            else { return nil }
            return estimate.shape
        }
        var references = angles
        if references.indices.contains(AngleStep.top.rawValue) {
            references[AngleStep.top.rawValue] = nil // the hand's top shot is not a single-nail view
        }
        hand.result = estimate(from: references)
        let counts = Dictionary(grouping: hand.fingerShapes.compactMap { $0 }, by: { $0 }).mapValues(\.count)
        if let best = counts.max(by: { $0.value < $1.value || ($0.value == $1.value && $0.key.rawValue > $1.key.rawValue) })?.key {
            hand.result.shape = best
            hand.result.fields.insert(.shape)
        }
        return hand
    }

    /// `NailRecord.anglePhotoData` → the 4-slot image array `estimate` takes.
    static func slots(from angleData: [Data]) -> [UIImage?] {
        var photos: [UIImage?] = Array(repeating: nil, count: AngleStep.allCases.count)
        for (index, data) in angleData.enumerated() where index < photos.count && !data.isEmpty {
            photos[index] = UIImage(data: data)
        }
        return photos
    }

    /// Persistence helpers for the "推定" badges (`NailRecord.autoEstimatedRaw`).
    static func encode(_ fields: Set<Field>) -> String {
        fields.map(\.rawValue).sorted().joined(separator: ",")
    }

    static func decode(_ raw: String) -> Set<Field> {
        Set(raw.split(separator: ",").compactMap { Field(rawValue: String($0)) })
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
            if agrees, let curveV = NailShapeEstimator.estimateCurveV(archRatio: archRatio) {
                result.params.curveV = curveV.value
                result.fields.insert(.curveV)
            }
            if agrees, let thickness = NailShapeEstimator.estimateThickness(thicknessRatio: thicknessRatio) {
                result.params.thickness = thickness.value
                result.fields.insert(.thickness)
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
