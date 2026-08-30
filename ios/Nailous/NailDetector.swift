import CoreGraphics
import CoreImage
import Foundation
import Vision

/// A fingertip (= nail) candidate detected in a photo, in the photo's
/// display coordinate space (top-left origin, image points).
struct DetectedNail: Identifiable {
    let id = UUID()
    let center: CGPoint // image coords, top-left origin, in image points
    let cropHeight: CGFloat // suggested crop height in image points
    let axisAngle: CGFloat // finger DIP→TIP direction vs straight-up, radians
}

/// Fingertip detection via Vision hand-pose.
///
/// Built on CGImage/CoreImage/Vision only (no UIKit), so the exact same
/// detection core runs both in the iOS app (see `NailDetector+UIImage.swift`
/// for the `UIImage` entry point) and in the macOS bench tool
/// (`ios/BenchTool`, driven by `scripts/bench-detect.sh`). The iOS Simulator's
/// `VNDetectHumanHandPoseRequest` reliably returns zero hands even on real
/// photos (see #360), so detection accuracy can only be measured by running
/// this core directly on macOS.
enum NailDetector {
    /// Finds fingertips with Vision hand-pose detection. Hand pose expects
    /// upright hands, so the photo is tried in four orientations (fingers
    /// down / sideways happen a lot in nail photos) and results are merged
    /// back into the displayed image's coordinate space.
    ///
    /// - Parameters:
    ///   - cgImage: the raw, un-oriented pixel buffer (as decoded from disk).
    ///   - orientation: the image's EXIF/source orientation to bake in before
    ///     detection, so `cgImage`'s pixels don't need to be pre-rotated.
    static func detectNails(cgImage: CGImage, orientation: CGImagePropertyOrientation) async -> [DetectedNail] {
        guard let (normalized, displaySize) = normalizedForDetection(cgImage, orientation: orientation) else { return [] }
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
                    cgImage: normalized,
                    orientation: orientation,
                    unmap: unmap,
                    displaySize: displaySize
                )
                // Dedup against nails accumulated from *earlier* orientation
                // attempts only (the same physical finger re-detected on a
                // different pass). Candidates within `found` itself are each
                // a distinct named joint (at most 5 fingers x 2 hands), so
                // comparing them against each other as they're appended
                // wrongly dropped adjacent fingers, or a second hand's
                // fingers near the first hand, as "duplicates" of one
                // another purely from being close together in the photo.
                let priorAttempts = merged
                for nail in found {
                    let isDuplicate = priorAttempts.contains { existing in
                        let d = hypot(existing.center.x - nail.center.x, existing.center.y - nail.center.y)
                        return d < max(existing.cropHeight, nail.cropHeight) * 0.6
                    }
                    if !isDuplicate { merged.append(nail) }
                }
                // maximumHandCount is 2, so up to 10 nails (two full hands) can
                // legitimately be found; breaking at 5 stopped scanning further
                // orientations as soon as one hand was captured, so a second
                // hand held at a different angle in the same photo was never
                // looked for.
                if merged.count >= 10 { break }
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
        do {
            try handler.perform([request])
        } catch {
            // Surfaced in bench runs; silently degraded in the app (a failed
            // pass just yields no candidates for this orientation).
            if diagnosticsEnabled {
                print("BENCH_DIAG handpose perform failed (orientation \(orientation.rawValue)): \(error)")
            }
        }
        if diagnosticsEnabled {
            print("BENCH_DIAG orientation \(orientation.rawValue): hands=\(request.results?.count ?? 0)")
        }
        guard let observations = request.results, !observations.isEmpty else { return [] }

        // Fraction of the tip→DIP segment to back off from the tip to land on the
        // nail's visual center, per finger. Tuned against hand-annotated
        // ground-truth centers on real photos (see
        // ios/BenchmarkAssets/manifest.json `expectedNailCenters`, #356):
        // index/middle/ring clustered tightly around 0.34-0.36 (up from the prior
        // flat 0.32), while the little finger's shorter nail bed consistently
        // measured lower. The thumb sample was too noisy (near-edge-on framing
        // shrinks its tip→DIP segment to a few dozen points, making the fraction
        // numerically unstable) to justify moving off the original value.
        let jointPairs: [(VNHumanHandPoseObservation.JointName, VNHumanHandPoseObservation.JointName, CGFloat)] = [
            (.thumbTip, .thumbIP, 0.32),
            (.indexTip, .indexDIP, 0.34),
            (.middleTip, .middleDIP, 0.34),
            (.ringTip, .ringDIP, 0.34),
            (.littleTip, .littleDIP, 0.22),
        ]

        var nails: [DetectedNail] = []
        for observation in observations {
            var candidates: [(nail: DetectedNail, confidence: Float)] = []
            for (tipName, dipName, tipFraction) in jointPairs {
                guard let tip = try? observation.recognizedPoint(tipName), tip.confidence > 0.15,
                      let dip = try? observation.recognizedPoint(dipName), dip.confidence > 0.1
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
                    x: tipPoint.x - vx * tipFraction,
                    y: tipPoint.y - vy * tipFraction
                )
                candidates.append((
                    DetectedNail(center: nailCenter, cropHeight: segment * 1.2, axisAngle: axisAngle),
                    tip.confidence + dip.confidence
                ))
            }
            // Within a single hand's observation, Vision can misassign two
            // different joint names (e.g. middle/ring tip) to essentially the
            // same physical fingertip when fingers cross or overlap in the
            // photo (#363: a crossed-hands pose produced middle/ring tips
            // 43px apart at a 0.61 confidence ratio, well inside anatomical
            // finger spacing). But close spacing alone isn't a reliable
            // signal: real adjacent fingers in a normal pose can measure just
            // as close (in a closeup photo, segment length — which
            // `cropHeight` scales from — can be a large fraction of the
            // whole hand's span, so a distance-only threshold at any
            // reasonably permissive factor also collapsed genuine
            // ring/pinky-type pairs that both had high, near-equal
            // confidence). So this only drops a close candidate when it is
            // *also* meaningfully less confident than the one it collides
            // with (< 0.8x) — a real second finger detected independently
            // tends to have comparable confidence to its neighbor, while a
            // misassigned duplicate of an already-found joint is markedly
            // weaker. Candidates from *different* observations (different
            // hands) are never compared here — two hands' fingers
            // legitimately land near each other without being duplicates of
            // one another.
            var kept: [(nail: DetectedNail, confidence: Float)] = []
            for (nail, confidence) in candidates.sorted(by: { $0.confidence > $1.confidence }) {
                let isDuplicate = kept.contains { existing in
                    let d = hypot(existing.nail.center.x - nail.center.x, existing.nail.center.y - nail.center.y)
                    return d < max(existing.nail.cropHeight, nail.cropHeight) * 0.45
                        && confidence < existing.confidence * 0.8
                }
                if !isDuplicate { kept.append((nail, confidence)) }
            }
            nails.append(contentsOf: kept.map(\.nail))
        }
        return nails
    }

    /// Bakes the source orientation out (via CoreImage, which handles all 8
    /// EXIF orientations correctly) and downsizes for fast multi-pass
    /// detection. Returns the normalized, upright image plus its size in
    /// "display points" (the oriented size, pre-downscale) — the coordinate
    /// space `DetectedNail.center` is expressed in.
    static func normalizedForDetection(
        _ cgImage: CGImage,
        orientation: CGImagePropertyOrientation
    ) -> (image: CGImage, displaySize: CGSize)? {
        let maxDimension: CGFloat = 1800
        let oriented = CIImage(cgImage: cgImage).oriented(orientation)
        let displaySize = oriented.extent.size
        let scale = min(1, maxDimension / max(displaySize.width, displaySize.height))
        let scaled = scale < 1 ? oriented.transformed(by: CGAffineTransform(scaleX: scale, y: scale)) : oriented
        let context = CIContext()
        guard let normalized = context.createCGImage(scaled, from: scaled.extent) else { return nil }
        return (normalized, displaySize)
    }

    /// Gates verbose `BENCH_DIAG` logging used by both the in-app
    /// `-benchDetect` path and the macOS bench tool, without requiring
    /// UIKit-only types (like `DetectionBenchmark`) to be linked in.
    static var diagnosticsEnabled: Bool {
        ProcessInfo.processInfo.arguments.contains("-benchDetect")
    }
}
