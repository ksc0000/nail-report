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

    init(
        title: String,
        shape: NailShape,
        finish: NailFinish,
        photoData: Data,
        salon: String = "",
        priceYen: Int? = nil,
        memo: String = "",
        tags: [String] = [],
        fingerPhotoData: [Data] = []
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
    }

    var shape: NailShape { NailShape(rawValue: shapeRaw) ?? .squoval }
    var finish: NailFinish { NailFinish(rawValue: finishRaw) ?? .gloss }

    var texture: UIImage? { UIImage(data: photoData) }

    var appearance: NailAppearance? {
        texture.map { NailAppearance(id: id.uuidString, texture: $0, finish: finish) }
    }

    /// Appearances for the five-piece set view; nil unless this record holds
    /// multiple finger textures.
    var setAppearances: [NailAppearance]? {
        guard fingerPhotoData.count > 1 else { return nil }
        let list = fingerPhotoData.enumerated().compactMap { index, data in
            UIImage(data: data).map {
                NailAppearance(id: "\(id.uuidString)-f\(index)", texture: $0, finish: finish)
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
