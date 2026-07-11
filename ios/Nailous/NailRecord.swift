import SwiftData
import UIKit

/// One saved nail: the user's photo (pre-cropped to the nail-texture aspect)
/// plus metadata. Local-first; Firebase sync is a later phase.
@Model
final class NailRecord {
    var id: UUID
    var title: String
    var createdAt: Date
    var shapeRaw: String
    var finishRaw: String
    var photoData: Data
    // Story fields (defaults keep lightweight migration painless)
    var salon: String = ""
    var priceYen: Int?
    var memo: String = ""
    var tags: [String] = []
    /// Per-finger textures (left→right in the source photo) when a whole hand
    /// was captured at once. Empty for single-nail records.
    var fingerPhotoData: [Data] = []
    /// Set when this design is on the user's actual nails right now; at most
    /// one record wears it at a time.
    var wornSince: Date?
    // Plate tuning sliders (-1…+1 each, 0 = the shape's stock look)
    var lengthAdj: Float = 0
    var widthAdj: Float = 0
    var curveHAdj: Float = 0
    var curveVAdj: Float = 0
    var thicknessAdj: Float = 0
    var cornerAdj: Float = 0

    init(
        title: String,
        shape: NailShape,
        finish: NailFinish,
        photoData: Data,
        salon: String = "",
        priceYen: Int? = nil,
        memo: String = "",
        tags: [String] = [],
        fingerPhotoData: [Data] = [],
        plateParams: NailPlateParams = .default
    ) {
        self.id = UUID()
        self.title = title
        self.createdAt = Date()
        self.shapeRaw = shape.rawValue
        self.finishRaw = finish.rawValue
        self.photoData = photoData
        self.salon = salon
        self.priceYen = priceYen
        self.memo = memo
        self.tags = tags
        self.fingerPhotoData = fingerPhotoData
        self.lengthAdj = plateParams.length
        self.widthAdj = plateParams.width
        self.curveHAdj = plateParams.curveH
        self.curveVAdj = plateParams.curveV
        self.thicknessAdj = plateParams.thickness
        self.cornerAdj = plateParams.corner
    }

    var shape: NailShape { NailShape(rawValue: shapeRaw) ?? .squoval }

    /// 1-based days worn (marked today = day 1); nil when not wearing.
    var wearDays: Int? {
        guard let wornSince else { return nil }
        let days = Calendar.current.dateComponents([.day], from: wornSince, to: Date()).day ?? 0
        return days + 1
    }

    var plateParams: NailPlateParams {
        NailPlateParams(
            length: lengthAdj,
            width: widthAdj,
            curveH: curveHAdj,
            curveV: curveVAdj,
            thickness: thicknessAdj,
            corner: cornerAdj
        )
    }
    var finish: NailFinish { NailFinish(rawValue: finishRaw) ?? .gloss }

    var texture: UIImage? { UIImage(data: photoData) }

    var appearance: NailAppearance? {
        texture.map {
            NailAppearance(id: "\(id.uuidString)-\(photoData.hashValue)", texture: $0, finish: finish)
        }
    }

    /// Appearances for the five-piece set view; nil unless this record holds
    /// multiple finger textures.
    var setAppearances: [NailAppearance]? {
        guard fingerPhotoData.count > 1 else { return nil }
        let list = fingerPhotoData.enumerated().compactMap { index, data in
            UIImage(data: data).map {
                NailAppearance(id: "\(id.uuidString)-f\(index)-\(data.hashValue)", texture: $0, finish: finish)
            }
        }
        return list.count > 1 ? list : nil
    }
}

extension UIImage {
    /// Center-crops and scales the photo to the nail-texture aspect (512×768,
    /// portrait 2:3). Also bakes in EXIF orientation.
    func nailTexture() -> UIImage {
        let target = CGSize(width: 512, height: 768)
        let scale = max(target.width / size.width, target.height / size.height)
        let scaled = CGSize(width: size.width * scale, height: size.height * scale)
        let origin = CGPoint(
            x: (target.width - scaled.width) / 2,
            y: (target.height - scaled.height) / 2
        )
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: target, format: format).image { _ in
            draw(in: CGRect(origin: origin, size: scaled))
        }
    }
}
