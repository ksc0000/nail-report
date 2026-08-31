import UIKit

/// `UIImage` entry point for `NailDetector`'s CGImage/Vision core, used by
/// the iOS app (PhotoCropView). Kept in its own file so the shared detection
/// core in `NailDetector.swift` stays UIKit-free and can be compiled
/// standalone by the macOS bench tool (`ios/BenchTool`, see #360).
extension NailDetector {
    static func detectNails(in image: UIImage) async -> (nails: [DetectedNail], quality: DetectionQuality) {
        guard let cgImage = image.cgImage else { return ([], assessQuality(nails: [], ambiguousJoints: 0, handCount: 0)) }
        let orientation = CGImagePropertyOrientation(image.imageOrientation)
        return await detectNails(cgImage: cgImage, orientation: orientation)
    }
}

extension CGImagePropertyOrientation {
    init(_ orientation: UIImage.Orientation) {
        switch orientation {
        case .up: self = .up
        case .down: self = .down
        case .left: self = .left
        case .right: self = .right
        case .upMirrored: self = .upMirrored
        case .downMirrored: self = .downMirrored
        case .leftMirrored: self = .leftMirrored
        case .rightMirrored: self = .rightMirrored
        @unknown default: self = .up
        }
    }
}
