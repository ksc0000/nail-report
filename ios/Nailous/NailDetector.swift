import CoreGraphics
import UIKit
import Vision

/// A fingertip (= nail) candidate detected in a photo, in the photo's
/// display coordinate space (top-left origin, image points).
struct DetectedNail: Identifiable {
    let id = UUID()
    let center: CGPoint // image coords, top-left origin, in image points
    let cropHeight: CGFloat // suggested crop height in image points
    let axisAngle: CGFloat // finger DIP→TIP direction vs straight-up, radians
}

/// Fingertip detection via Vision hand-pose, extracted from `PhotoCropView`
/// so it can be exercised standalone (e.g. by the detection benchmark).
enum NailDetector {
    /// Finds fingertips with Vision hand-pose detection. Hand pose expects
    /// upright hands, so the photo is tried in four orientations (fingers
    /// down / sideways happen a lot in nail photos) and results are merged
    /// back into the displayed image's coordinate space.
    static func detectNails(in image: UIImage) async -> [DetectedNail] {
        let detectionImage = normalizedForDetection(image)
        guard let cgImage = detectionImage.cgImage else { return [] }
        let displaySize = image.size
        return await Task.detached(priority: .userInitiated) { () -> [DetectedNail] in
            // (orientation Vision applies, inverse map back to display space)
            let attempts: [(CGImagePropertyOrientation, (CGPoint) -> CGPoint)] = [
                (.up, { $0 }),
                (.right, { CGPoint(x: 1 - $0.y, y: $0.x) }),
                (.left, { CGPoint(x: $0.y, y: 1 - $0.x) }),
                (.down, { CGPoint(x: 1 - $0.x, y: 1 - $0.y) }),
            ]
            var merged: [DetectedNail] = []
            for (orientation, unmap) in attempts {
                let found = runHandPose(
                    cgImage: cgImage,
                    orientation: orientation,
                    unmap: unmap,
                    displaySize: displaySize
                )
                for nail in found {
                    let isDuplicate = merged.contains { existing in
                        let d = hypot(existing.center.x - nail.center.x, existing.center.y - nail.center.y)
                        return d < max(existing.cropHeight, nail.cropHeight) * 0.6
                    }
                    if !isDuplicate { merged.append(nail) }
                }
                if merged.count >= 5 { break }
            }
            return merged
        }.value
    }

    /// One hand-pose pass at a given orientation; points are unmapped back to
    /// the displayed image space before sizes/angles are computed.
    static func runHandPose(
        cgImage: CGImage,
        orientation: CGImagePropertyOrientation,
        unmap: (CGPoint) -> CGPoint,
        displaySize: CGSize
    ) -> [DetectedNail] {
        let request = VNDetectHumanHandPoseRequest()
        request.maximumHandCount = 2
        let handler = VNImageRequestHandler(cgImage: cgImage, orientation: orientation, options: [:])
        try? handler.perform([request])
        guard let observations = request.results, !observations.isEmpty else { return [] }

        let jointPairs: [(VNHumanHandPoseObservation.JointName, VNHumanHandPoseObservation.JointName)] = [
            (.thumbTip, .thumbIP),
            (.indexTip, .indexDIP),
            (.middleTip, .middleDIP),
            (.ringTip, .ringDIP),
            (.littleTip, .littleDIP),
        ]

        var nails: [DetectedNail] = []
        for observation in observations {
            for (tipName, dipName) in jointPairs {
                guard let tip = try? observation.recognizedPoint(tipName), tip.confidence > 0.35,
                      let dip = try? observation.recognizedPoint(dipName), dip.confidence > 0.2
                else { continue }
                // Vision: normalized, bottom-left origin → display space (top-left origin)
                let tipNorm = unmap(CGPoint(x: tip.location.x, y: tip.location.y))
                let dipNorm = unmap(CGPoint(x: dip.location.x, y: dip.location.y))
                let tipPoint = CGPoint(x: tipNorm.x * displaySize.width, y: (1 - tipNorm.y) * displaySize.height)
                let dipPoint = CGPoint(x: dipNorm.x * displaySize.width, y: (1 - dipNorm.y) * displaySize.height)
                let vx = tipPoint.x - dipPoint.x
                let vy = tipPoint.y - dipPoint.y
                let segment = hypot(vx, vy)
                guard segment > 4 else { continue }
                let axisAngle = atan2(vx, -vy)
                let nailCenter = CGPoint(
                    x: tipPoint.x - vx * 0.32,
                    y: tipPoint.y - vy * 0.32
                )
                nails.append(
                    DetectedNail(center: nailCenter, cropHeight: segment * 1.2, axisAngle: axisAngle)
                )
            }
        }
        return nails
    }

    /// Bakes EXIF orientation out and downsizes for fast multi-pass detection.
    static func normalizedForDetection(_ image: UIImage) -> UIImage {
        let maxDimension: CGFloat = 1800
        let scale = min(1, maxDimension / max(image.size.width, image.size.height))
        if scale == 1 && image.imageOrientation == .up { return image }
        let size = CGSize(width: image.size.width * scale, height: image.size.height * scale)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            image.draw(in: CGRect(origin: .zero, size: size))
        }
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
