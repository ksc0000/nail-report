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
    /// Interior angle at the DIP joint between PIP→DIP and DIP→TIP, degrees.
    /// 180° is a straight finger; smaller means more curled. `nil` when the
    /// PIP joint wasn't measurable (thumb has no PIP, or Vision's confidence
    /// was too low) — see `DetectionQuality` (#366).
    var curlDegrees: CGFloat?
}

/// Photo-level signal for "was this framing easy for Vision's hand-pose to
/// read correctly", computed alongside detection rather than post-hoc on its
/// results. #361 found that post-processing can't recover a bad tip
/// placement (curled/crossed/close-up fingers make Vision place the tip
/// joint away from the actual fingertip, with no per-candidate signal that
/// distinguishes it from a good detection) — so instead of trying to correct
/// results, this flags the *framing* so the app can suggest a retake while
/// still using whatever was detected.
struct DetectionQuality: Encodable {
    /// Mean curl angle (degrees) across nails where it was measurable.
    let meanCurlDegrees: Double?
    /// Most-curled single finger (degrees); a bent pose can still average
    /// out if only one finger is curled, so this catches that case too.
    let minCurlDegrees: Double?
    /// Same-hand joints Vision assigned to essentially the same physical
    /// fingertip (#363) — a direct sign the pose confused Vision (crossed or
    /// overlapping fingers).
    let ambiguousJoints: Int
    /// Hands Vision located in the photo (0 when it found none).
    let handCount: Int
    /// Nails found per located hand — the signal the retake hint keys off.
    let nailsPerHand: Double?
    /// Suggest "retake with fingers extended" to the user.
    let suggestsRetake: Bool
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
    static func detectNails(
        cgImage: CGImage,
        orientation: CGImagePropertyOrientation
    ) async -> (nails: [DetectedNail], quality: DetectionQuality) {
        guard let (normalized, displaySize) = normalizedForDetection(cgImage, orientation: orientation) else {
            return ([], assessQuality(nails: [], ambiguousJoints: 0, handCount: 0))
        }
        return await Task.detached(priority: .userInitiated) { () -> (nails: [DetectedNail], quality: DetectionQuality) in
            // (orientation Vision applies, inverse map back to display space)
            let attempts: [(CGImagePropertyOrientation, (CGPoint) -> CGPoint)] = [
                (.up, { $0 }),
                (.right, { CGPoint(x: 1 - $0.y, y: $0.x) }),
                (.left, { CGPoint(x: $0.y, y: 1 - $0.x) }),
                (.down, { CGPoint(x: 1 - $0.x, y: 1 - $0.y) }),
            ]
            var merged: [DetectedNail] = []
            var ambiguousJoints = 0
            var handCount = 0

            // Runs `passAttempts` (all four cardinal orientations by default)
            // against `image` restricted to `regionOfInterest` (full frame by
            // default), merging any newly found nails into `merged` (deduped
            // against nails already present before this call), and returns
            // how many were added.
            func runPasses(
                on image: CGImage,
                regionOfInterest: CGRect = CGRect(x: 0, y: 0, width: 1, height: 1),
                passAttempts: [(CGImagePropertyOrientation, (CGPoint) -> CGPoint)] = attempts
            ) -> Int {
                let before = merged.count
                for (orientation, unmap) in passAttempts {
                    let (found, ambiguous, hands) = runHandPose(
                        cgImage: image,
                        orientation: orientation,
                        unmap: unmap,
                        displaySize: displaySize,
                        regionOfInterest: regionOfInterest
                    )
                    ambiguousJoints += ambiguous
                    handCount = max(handCount, hands)
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
                return merged.count - before
            }

            _ = runPasses(on: normalized)

            // #386: maximumHandCount is 2, but two overlapping/interlocked
            // hands can still resolve as a single Vision "hand" (its pose
            // model fits one skeleton across joints that actually belong to
            // both physical hands) — full-frame occlusion of the found
            // joints' own bounding box doesn't help there, since those
            // joints are already spread across both hands. Instead, restrict
            // Vision's search to each half of the frame in turn (with
            // generous overlap so a hand isn't cut in half) via
            // `regionOfInterest` — a smaller, single-hand-sized frame is
            // more likely to resolve as its own clean hand than the full
            // two-hand frame is.
            //
            // Gated on the same nails-per-hand ratio `assessQuality` uses for
            // the retake hint (#366), not just `handCount < 2`: a cleanly
            // detected single-hand photo also has `handCount == 1`, and
            // re-running a half-crop search there just re-finds the same
            // hand at slightly shifted joint positions that don't dedupe
            // against the original — turning one correct hand into a phantom
            // second one. Only photos that already look under-detected (few
            // nails per hand found so far) are worth the extra search.
            let nailsPerHandSoFar = handCount > 0 ? Double(merged.count) / Double(handCount) : nil
            if handCount < 2, merged.count < 10, (nailsPerHandSoFar ?? .greatestFiniteMagnitude) < 4.5 {
                let quadrants: [CGRect] = [
                    CGRect(x: 0, y: 0, width: 0.62, height: 1), // left 62% (Vision ROI: bottom-left origin, x unaffected by the flip)
                    CGRect(x: 0.38, y: 0, width: 0.62, height: 1), // right 62%
                    CGRect(x: 0, y: 0.38, width: 1, height: 0.62), // top 62% (high y = top in Vision's bottom-left space)
                    CGRect(x: 0, y: 0, width: 1, height: 0.62), // bottom 62%
                    // Two hands photographed interlocked along a diagonal
                    // (fingers meeting corner-to-corner rather than a clean
                    // left/right or top/bottom split) can still be cut apart
                    // by a corner crop even when no half-crop above isolates
                    // either hand cleanly.
                    CGRect(x: 0, y: 0.38, width: 0.62, height: 0.62), // top-left
                    CGRect(x: 0.38, y: 0.38, width: 0.62, height: 0.62), // top-right
                    CGRect(x: 0, y: 0, width: 0.62, height: 0.62), // bottom-left
                    CGRect(x: 0.38, y: 0, width: 0.62, height: 0.62), // bottom-right
                ]
                let before = merged.count
                for roi in quadrants {
                    if merged.count >= 10 { break }
                    _ = runPasses(on: normalized, regionOfInterest: roi)
                }
                if merged.count > before { handCount = min(2, handCount + 1) }
            }

            // #396: even after the quadrant re-search, some photos still come
            // up short — Vision's hand-pose model only ever resolves one
            // fused skeleton across both hands, at *every* cardinal
            // orientation and *every* quadrant crop tried above, because the
            // hands themselves are held at a diagonal angle the four
            // cardinal orientations don't align with. Debugging
            // real_beige_bothhands.jpg (a full 15°-step sweep) found far
            // richer joint confidence at off-axis angles (e.g. ~300°/315°)
            // than at any of 0/90/180/270 — so as a last resort, physically
            // re-render the frame at several diagonal angles via CoreImage
            // and retry. This is the most expensive fallback (each angle is
            // a full re-render + Vision pass), so it stays behind the same
            // under-detected gate as the quadrant stage above, re-evaluated
            // against its outcome.
            // Unlike the quadrant stage's gate, this doesn't also check
            // `handCount < 2`: the quadrant stage above already bumps
            // `handCount` to 2 as soon as it finds anything extra, so gating
            // on it here would make this stage unreachable right after a
            // quadrant pass helped even a little. `nailsPerHand` alone is
            // still an accurate under-detected signal either way.
            let nailsPerHandAfterQuadrants = handCount > 0 ? Double(merged.count) / Double(handCount) : nil
            if merged.count < 10, (nailsPerHandAfterQuadrants ?? .greatestFiniteMagnitude) < 4.5 {
                let before = merged.count
                for degrees in [300.0, 315.0, 60.0, 240.0, 330.0, 30.0, 210.0, 150.0] {
                    if merged.count >= 10 { break }
                    guard let rotated = rotatedForDetection(normalized, degrees: degrees) else { continue }
                    _ = runPasses(on: rotated, passAttempts: [(.up, rotationUnmap(degrees: degrees))])
                }
                if merged.count > before { handCount = min(2, handCount + 1) }
            }

            return (merged, assessQuality(nails: merged, ambiguousJoints: ambiguousJoints, handCount: handCount))
        }.value
    }

    /// Photo-level "was this an easy framing" signal (#366) computed
    /// alongside detection, not from its results after the fact — see
    /// `DetectionQuality`.
    static func assessQuality(
        nails: [DetectedNail],
        ambiguousJoints: Int,
        handCount: Int
    ) -> DetectionQuality {
        let curls = nails.compactMap(\.curlDegrees)
        let meanCurl = curls.isEmpty ? nil : Double(curls.reduce(0, +)) / Double(curls.count)
        let minCurl = curls.min().map(Double.init)

        // How many nails we found per hand Vision actually located. A hand it
        // can see should yield about five; landing far short means the pose
        // defeated the joint model, which is exactly when the user is better
        // served by re-framing than by us guessing.
        //
        // Calibrated on ios/BenchmarkAssets (#366). Every correctly detected
        // photo sits at 4.0-5.0 nails per hand — including the ones with a
        // sharply bent finger (44°) or several same-fingertip collisions,
        // which is why neither curl angle nor ambiguousJoints can be the
        // trigger: both fire on photos that detected perfectly. Good photos
        // all land at 5.0 or above (the five-fingers ceiling), the
        // under-detected ones at 3.0-4.0, so 4.5 splits them cleanly.
        //
        // The metric can only be inflated, never deflated, by Vision's own
        // error: it undercounts hands (one bench photo reports 8 nails over
        // "1" hand), which hides problems rather than inventing them. So a
        // low ratio really does mean nails are missing, and a false retake
        // prompt — the failure that would actually annoy someone whose photo
        // was fine — stays unlikely even at this tighter line.
        let nailsPerHand = handCount > 0 ? Double(nails.count) / Double(handCount) : nil
        let suggestsRetake = (nailsPerHand ?? .greatestFiniteMagnitude) < 4.5

        return DetectionQuality(
            meanCurlDegrees: meanCurl,
            minCurlDegrees: minCurl,
            ambiguousJoints: ambiguousJoints,
            handCount: handCount,
            nailsPerHand: nailsPerHand,
            suggestsRetake: suggestsRetake
        )
    }

    /// One hand-pose pass at a given orientation; points are unmapped back to
    /// the displayed image space before sizes/angles are computed.
    static func runHandPose(
        cgImage: CGImage,
        orientation: CGImagePropertyOrientation,
        unmap: (CGPoint) -> CGPoint,
        displaySize: CGSize,
        regionOfInterest: CGRect = CGRect(x: 0, y: 0, width: 1, height: 1)
    ) -> (nails: [DetectedNail], ambiguousJoints: Int, handCount: Int) {
        let request = VNDetectHumanHandPoseRequest()
        request.maximumHandCount = 2
        request.regionOfInterest = regionOfInterest
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
        guard let observations = request.results, !observations.isEmpty else { return ([], 0, 0) }

        // Fraction of the tip→DIP segment to back off from the tip to land on the
        // nail's visual center, per finger. Tuned against hand-annotated
        // ground-truth centers on real photos (see
        // ios/BenchmarkAssets/manifest.json `expectedNailCenters`, #356):
        // index/middle/ring clustered tightly around 0.34-0.36 (up from the prior
        // flat 0.32), while the little finger's shorter nail bed consistently
        // measured lower. The thumb sample was too noisy (near-edge-on framing
        // shrinks its tip→DIP segment to a few dozen points, making the fraction
        // numerically unstable) to justify moving off the original value.
        //
        // The optional 4th element is the PIP joint used to measure how
        // curled the finger is (#366) — omitted for the thumb, which has no
        // PIP joint and whose curl behaves differently anatomically anyway.
        let jointPairs: [(VNHumanHandPoseObservation.JointName, VNHumanHandPoseObservation.JointName, CGFloat, VNHumanHandPoseObservation.JointName?)] = [
            (.thumbTip, .thumbIP, 0.32, nil),
            (.indexTip, .indexDIP, 0.34, .indexPIP),
            (.middleTip, .middleDIP, 0.34, .middlePIP),
            (.ringTip, .ringDIP, 0.34, .ringPIP),
            (.littleTip, .littleDIP, 0.22, .littlePIP),
        ]

        var nails: [DetectedNail] = []
        var ambiguousJoints = 0
        for observation in observations {
            var candidates: [(nail: DetectedNail, confidence: Float)] = []
            for (tipName, dipName, tipFraction, pipName) in jointPairs {
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
                let curlDegrees: CGFloat? = pipName.flatMap { pipName -> CGFloat? in
                    guard let pip = try? observation.recognizedPoint(pipName), pip.confidence > 0.1 else { return nil }
                    let pipNorm = unmap(CGPoint(x: pip.location.x, y: pip.location.y))
                    let pipPoint = CGPoint(x: pipNorm.x * displaySize.width, y: (1 - pipNorm.y) * displaySize.height)
                    // Interior angle at the DIP between DIP→PIP and DIP→TIP;
                    // 180° is a straight finger, smaller is more bent.
                    let ux = pipPoint.x - dipPoint.x, uy = pipPoint.y - dipPoint.y
                    let pipSegment = hypot(ux, uy)
                    guard pipSegment > 4 else { return nil }
                    // DIP→PIP vs DIP→TIP (= vx, vy): a straight finger has
                    // PIP and TIP on opposite sides of the DIP, so these
                    // point in roughly opposite directions (~180°); a curled
                    // finger brings the tip back toward the PIP (~0°).
                    let cosTheta = (ux * vx + uy * vy) / (pipSegment * segment)
                    return CGFloat(acos(max(-1, min(1, cosTheta)))) * 180 / .pi
                }
                candidates.append((
                    DetectedNail(center: nailCenter, cropHeight: segment * 1.2, axisAngle: axisAngle, curlDegrees: curlDegrees),
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
            ambiguousJoints += candidates.count - kept.count
            nails.append(contentsOf: kept.map(\.nail))
        }
        return (nails, ambiguousJoints, observations.count)
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

    /// Rotates `image` in-plane by `degrees` about its center, keeping the
    /// same canvas extent (corners rotated outside the original frame are
    /// simply not sampled; content rotated in from beyond the original
    /// corners is transparent). Used by the #396 diagonal fallback: Vision's
    /// hand-pose model can be far more confident about a hand's joints at an
    /// off-axis angle than at any of the four cardinal orientations, when the
    /// hand itself is held at a diagonal in the photo.
    static func rotatedForDetection(_ image: CGImage, degrees: CGFloat) -> CGImage? {
        let radians = degrees * .pi / 180
        let ciImage = CIImage(cgImage: image)
        let extent = ciImage.extent
        let center = CGPoint(x: extent.midX, y: extent.midY)
        let transform = CGAffineTransform(translationX: center.x, y: center.y)
            .rotated(by: radians)
            .translatedBy(x: -center.x, y: -center.y)
        let rotated = ciImage.transformed(by: transform)
        let context = CIContext()
        return context.createCGImage(rotated, from: extent)
    }

    /// Inverse of the rotation `rotatedForDetection(_:degrees:)` applies,
    /// expressed on the normalized (0-1) point space Vision reports joints
    /// in: maps a point found in the rotated image back to its position in
    /// the original, unrotated frame.
    static func rotationUnmap(degrees: CGFloat) -> (CGPoint) -> CGPoint {
        let radians = -degrees * .pi / 180
        let cosTheta = cos(radians)
        let sinTheta = sin(radians)
        return { point in
            let dx = point.x - 0.5
            let dy = point.y - 0.5
            return CGPoint(
                x: 0.5 + dx * cosTheta - dy * sinTheta,
                y: 0.5 + dx * sinTheta + dy * cosTheta
            )
        }
    }

    /// Gates verbose `BENCH_DIAG` logging used by both the in-app
    /// `-benchDetect` path and the macOS bench tool, without requiring
    /// UIKit-only types (like `DetectionBenchmark`) to be linked in.
    static var diagnosticsEnabled: Bool {
        ProcessInfo.processInfo.arguments.contains("-benchDetect")
    }
}
