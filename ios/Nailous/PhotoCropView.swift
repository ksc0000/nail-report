import CoreImage
import CoreImage.CIFilterBuiltins
import SwiftUI

/// Position the photo under a nail-shaped window: whole-hand photos get
/// fingertip auto-detection (tap a marker to jump-zoom onto that nail), then
/// drag / pinch to fine-tune, and bake the window into the 512×768 texture.
struct PhotoCropView: View {
    let image: UIImage
    @Binding var nailShape: NailShape
    /// Camera captures are a single close-up nail — skip 5-finger detection.
    var forceSingle: Bool = false
    let onConfirm: (UIImage) -> Void
    var onConfirmSet: (([UIImage]) -> Void)?
    let onCancel: () -> Void

    @State private var zoom: CGFloat = 1
    @State private var zoomAnchor: CGFloat = 1
    @State private var offset: CGSize = .zero
    @State private var offsetAnchor: CGSize = .zero
    @State private var rotation: CGFloat = 0
    @State private var rotationAnchor: CGFloat = 0
    @State private var detectedNails: [DetectedNail] = []
    @State private var previewTexture: UIImage?
    @State private var collected: [UIImage] = []
    @State private var sortedNails: [DetectedNail] = []
    @State private var currentIndex: Int = 0
    @State private var lastAddedSignature = ""
    @State private var suggestsRetake = false

    private let window = CGSize(width: 216, height: 324) // 2:3, matches texture
    private let maxZoom: CGFloat = 16

    private var currentTarget: DetectedNail? {
        sortedNails.indices.contains(currentIndex) ? sortedNails[currentIndex] : nil
    }

    /// Guided multi-nail flow only when we actually found several nails; a
    /// single/zero detection falls back to the simple position-and-confirm path
    /// (fixes bogus 5-nail attempts on close-ups and single-nail photos).
    private var guidedMode: Bool { !forceSingle && sortedNails.count >= 2 }

    private var allCollected: Bool {
        guidedMode && collected.count >= min(5, sortedNails.count)
    }

    /// Fingerprint of the current framing; adding twice from the same pose is
    /// almost certainly an accidental duplicate.
    private var poseSignature: String {
        String(
            format: "%d|%.3f|%.1f|%.1f|%.3f",
            currentIndex, zoom, offset.width, offset.height, rotation
        )
    }

    private var isDuplicatePose: Bool {
        !collected.isEmpty && poseSignature == lastAddedSignature
    }

    /// Aspect-fill scale that makes the photo just cover the window at zoom 1.
    private var fillScale: CGFloat {
        max(window.width / image.size.width, window.height / image.size.height)
    }

    var body: some View {
        GeometryReader { proxy in
            let center = CGPoint(x: proxy.size.width / 2, y: proxy.size.height / 2)
            let scale = fillScale * zoom

            ZStack {
                Color.black.ignoresSafeArea()

                Image(uiImage: image)
                    .resizable()
                    .frame(width: image.size.width * scale, height: image.size.height * scale)
                    .rotationEffect(.radians(rotation))
                    .position(center)
                    .offset(offset)

                // Dim everything except the nail-shaped window
                ZStack {
                    Color.black.opacity(0.6)
                    NailSilhouette(nailShape: nailShape)
                        .frame(width: window.width, height: window.height)
                        .blendMode(.destinationOut)
                }
                .compositingGroup()
                .allowsHitTesting(false)
                .ignoresSafeArea()

                NailSilhouette(nailShape: nailShape)
                    .stroke(.white.opacity(0.85), lineWidth: 1.5)
                    .frame(width: window.width, height: window.height)
                    .allowsHitTesting(false)

                // Fingertip markers — tap to jump onto that nail
                ForEach(detectedNails) { nail in
                    Button {
                        if let index = sortedNails.firstIndex(where: { $0.id == nail.id }) {
                            currentIndex = index
                        }
                        focus(on: nail)
                    } label: {
                        ZStack {
                            Circle()
                                .strokeBorder(
                                    nail.id == currentTarget?.id
                                        ? Palette.goldBright
                                        : .white.opacity(0.9),
                                    lineWidth: nail.id == currentTarget?.id ? 3 : 1.5
                                )
                                .frame(width: 26, height: 26)
                            Circle()
                                .fill(Palette.gold.opacity(0.9))
                                .frame(width: 10, height: 10)
                        }
                        .shadow(color: .black.opacity(0.6), radius: 4)
                    }
                    .position(markerPosition(for: nail, center: center, scale: scale))
                }

                VStack {
                    Text(
                        !guidedMode
                            ? "ドラッグとピンチで、爪に入れたい部分を合わせます"
                            : allCollected
                                ? "全部そろいました。「完了」でセットにします"
                                : "\(collected.count + 1)本目：枠に合わせて「この爪を追加」"
                    )
                    .font(.system(size: 13))
                    .foregroundStyle(.white.opacity(0.8))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Capsule().fill(Color.black.opacity(0.45)))
                    .padding(.top, 14)

                    if suggestsRetake {
                        Text("指をまっすぐ伸ばして撮り直すと、検出の精度が上がります。このまま位置を手動で合わせても使えます")
                            .font(.system(size: 12))
                            .foregroundStyle(.white.opacity(0.75))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 7)
                            .background(Capsule().fill(Color.black.opacity(0.4)))
                            .padding(.top, 6)
                    }

                    HStack(spacing: 6) {
                        ForEach(NailShape.allCases) { candidate in
                            Button {
                                nailShape = candidate
                            } label: {
                                Text(candidate.label)
                                    .font(.system(size: 11.5, weight: .medium))
                                    .padding(.horizontal, 11)
                                    .padding(.vertical, 6)
                                    .background(
                                        Capsule().fill(
                                            nailShape == candidate
                                                ? Color.white.opacity(0.92)
                                                : Color.black.opacity(0.45)
                                        )
                                    )
                                    .foregroundStyle(
                                        nailShape == candidate
                                            ? Color(red: 0.2, green: 0.1, blue: 0.18)
                                            : .white.opacity(0.8)
                                    )
                            }
                        }
                    }
                    .padding(.top, 8)

                    Spacer()

                    if let previewTexture {
                        HStack {
                            Spacer()
                            VStack(spacing: 4) {
                                NailSceneView(
                                    appearance: NailAppearance(
                                        id: "crop-preview-\(previewTexture.hashValue)",
                                        texture: previewTexture,
                                        finish: .gloss
                                    ),
                                    shape: nailShape,
                                    mode: .single
                                )
                                .frame(width: 96, height: 150)
                                .allowsHitTesting(false)
                                Text("プレビュー")
                                    .font(.system(size: 10))
                                    .foregroundStyle(.white.opacity(0.6))
                            }
                            .padding(8)
                            .background(RoundedRectangle(cornerRadius: 14).fill(Color.black.opacity(0.45)))
                            .padding(.trailing, 14)
                        }
                        .padding(.bottom, 6)
                    }
                    if !collected.isEmpty {
                        HStack(spacing: 8) {
                            ForEach(Array(collected.enumerated()), id: \.offset) { index, texture in
                                Image(uiImage: texture)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 34, height: 51)
                                    .clipShape(RoundedRectangle(cornerRadius: 7))
                                    .overlay(
                                        Text("\(index + 1)")
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundStyle(.white)
                                            .padding(3),
                                        alignment: .topLeading
                                    )
                            }
                        }
                        .padding(.vertical, 6)
                        .padding(.horizontal, 12)
                        .background(Capsule().fill(Color.black.opacity(0.4)))
                        .padding(.bottom, 8)
                    }

                    HStack(spacing: 10) {
                        Button(action: onCancel) {
                            Text("キャンセル")
                                .font(.system(size: 14, weight: .medium))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color.white.opacity(0.12)))
                                .foregroundStyle(.white)
                        }
                        if guidedMode && collected.count < 5 {
                            Button(action: addCurrentNail) {
                                Text("この爪を追加（\(min(collected.count + 1, 5))本目）")
                                    .font(.system(size: 14, weight: .semibold))
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 12)
                                    .background(
                                        Capsule().fill(
                                            isDuplicatePose || allCollected
                                                ? Color.white.opacity(0.22)
                                                : Palette.gold
                                        )
                                    )
                                    .foregroundStyle(.white.opacity(isDuplicatePose ? 0.45 : 1))
                            }
                            .disabled(isDuplicatePose)
                        }
                        if collected.isEmpty && !guidedMode {
                            Button {
                                onConfirm(bakeCurrent())
                            } label: {
                                Text("この位置で決定")
                                    .font(.system(size: 14, weight: .semibold))
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 12)
                                    .background(Capsule().fill(Palette.goldGradient))
                                    .foregroundStyle(.white)
                            }
                        } else if !collected.isEmpty {
                            Button {
                                if collected.count > 1, let onConfirmSet {
                                    onConfirmSet(collected)
                                } else if let single = collected.first {
                                    onConfirm(single)
                                }
                            } label: {
                                Text("完了（\(collected.count)本）")
                                    .font(.system(size: 14, weight: .semibold))
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 12)
                                    .background(
                                        Capsule().fill(
                                            allCollected
                                                ? Palette.gold
                                                : Color.white.opacity(0.22)
                                        )
                                    )
                                    .foregroundStyle(.white)
                            }
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
            .contentShape(Rectangle())
            .gesture(
                SimultaneousGesture(
                    SimultaneousGesture(
                        MagnificationGesture()
                            .onChanged { value in
                                let pivot = anchorImagePointAtWindowCenter()
                                zoom = min(maxZoom, max(1, zoomAnchor * value))
                                offset = clampedOffset(offsetKeeping(pivot, atWindowCenterWithZoom: zoom, rotation: rotation))
                            }
                            .onEnded { _ in commitAnchors() },
                        RotationGesture()
                            .onChanged { value in
                                let pivot = anchorImagePointAtWindowCenter()
                                rotation = rotationAnchor + CGFloat(value.radians)
                                offset = clampedOffset(offsetKeeping(pivot, atWindowCenterWithZoom: zoom, rotation: rotation))
                            }
                            .onEnded { _ in commitAnchors() }
                    ),
                    DragGesture()
                        .onChanged { value in
                            offset = clampedOffset(
                                CGSize(
                                    width: offsetAnchor.width + value.translation.width,
                                    height: offsetAnchor.height + value.translation.height
                                )
                            )
                        }
                        .onEnded { _ in commitAnchors() }
                )
            )
        }
        .preferredColorScheme(.dark)
        .task {
            if forceSingle {
                previewTexture = bakeCurrent()
                return
            }
            let result = await NailDetector.detectNails(in: image)
            let found = result.nails.sorted { $0.center.x < $1.center.x }
            suggestsRetake = result.quality.suggestsRetake
            if found.count >= 2 {
                // Guided tour: thumb → pinky, starting zoomed on the first nail.
                detectedNails = found
                sortedNails = found
                currentIndex = 0
                focus(on: found[0])
            } else if let one = found.first {
                // One nail found: auto-frame it, but stay in the simple path.
                focus(on: one)
            } else {
                previewTexture = bakeCurrent()
            }
        }
    }

    private func addCurrentNail() {
        guard !isDuplicatePose else { return }
        collected.append(bakeCurrent())
        lastAddedSignature = poseSignature
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        // advance to the next detected nail
        if currentIndex + 1 < sortedNails.count {
            currentIndex += 1
            focus(on: sortedNails[currentIndex])
        }
    }

    // MARK: - Geometry

    /// View transform: T(p) = R_rotation((p - imgCenter) * scale) + center + offset
    private func markerPosition(for nail: DetectedNail, center: CGPoint, scale: CGFloat) -> CGPoint {
        let dx = (nail.center.x - image.size.width / 2) * scale
        let dy = (nail.center.y - image.size.height / 2) * scale
        let rx = dx * cos(rotation) - dy * sin(rotation)
        let ry = dx * sin(rotation) + dy * cos(rotation)
        return CGPoint(x: center.x + rx + offset.width, y: center.y + ry + offset.height)
    }

    /// Offset that places image point `p` at the window center for the given
    /// zoom and rotation.
    private func offsetKeeping(_ p: CGPoint, atWindowCenterWithZoom newZoom: CGFloat, rotation angle: CGFloat) -> CGSize {
        let s = fillScale * newZoom
        let dx = (p.x - image.size.width / 2) * s
        let dy = (p.y - image.size.height / 2) * s
        let rx = dx * cos(angle) - dy * sin(angle)
        let ry = dx * sin(angle) + dy * cos(angle)
        return CGSize(width: -rx, height: -ry)
    }

    /// Image point currently under the window center, from the gesture anchors.
    private func anchorImagePointAtWindowCenter() -> CGPoint {
        let s = fillScale * zoomAnchor
        let rx = -offsetAnchor.width
        let ry = -offsetAnchor.height
        let dx = rx * cos(-rotationAnchor) - ry * sin(-rotationAnchor)
        let dy = rx * sin(-rotationAnchor) + ry * cos(-rotationAnchor)
        return CGPoint(x: image.size.width / 2 + dx / s, y: image.size.height / 2 + dy / s)
    }

    private func commitAnchors() {
        zoomAnchor = zoom
        offsetAnchor = offset
        rotationAnchor = rotation
        previewTexture = bakeCurrent()
    }

    private func focus(on nail: DetectedNail) {
        let targetScale = window.height / nail.cropHeight
        let newZoom = min(maxZoom, max(1, targetScale / fillScale))
        let newRotation = -nail.axisAngle // finger axis → straight up
        let newOffset = offsetKeeping(nail.center, atWindowCenterWithZoom: newZoom, rotation: newRotation)
        withAnimation(.spring(duration: 0.5)) {
            zoom = newZoom
            rotation = newRotation
            offset = newOffset
        }
        zoomAnchor = newZoom
        rotationAnchor = newRotation
        offsetAnchor = newOffset
        previewTexture = bakeTexture(zoom: newZoom, rotation: newRotation, offset: newOffset)
    }

    /// Keeps the photo (its rotated bounding box) covering the crop window.
    private func clampedOffset(_ proposed: CGSize, zoom zoomOverride: CGFloat? = nil) -> CGSize {
        let scale = fillScale * (zoomOverride ?? zoom)
        let w = image.size.width * scale
        let h = image.size.height * scale
        let boundW = abs(w * cos(rotation)) + abs(h * sin(rotation))
        let boundH = abs(w * sin(rotation)) + abs(h * cos(rotation))
        let maxX = max(0, (boundW - window.width) / 2)
        let maxY = max(0, (boundH - window.height) / 2)
        return CGSize(
            width: min(maxX, max(-maxX, proposed.width)),
            height: min(maxY, max(-maxY, proposed.height))
        )
    }

    /// Renders the window region of the positioned (zoomed, rotated) photo
    /// into the texture size, applying the same transform chain as the view.
    /// 1024×1536 keeps fine detail (glitter, art) crisp on the full-screen nail.
    private func bakeTexture(zoom: CGFloat, rotation: CGFloat, offset: CGSize) -> UIImage {
        let target = CGSize(width: 1024, height: 1536)
        let k = window.width / target.width // window pts per target px
        let scale = fillScale * zoom
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        let baked = UIGraphicsImageRenderer(size: target, format: format).image { ctx in
            let cg = ctx.cgContext
            cg.interpolationQuality = .high
            cg.translateBy(x: target.width / 2, y: target.height / 2)
            cg.scaleBy(x: 1 / k, y: 1 / k)
            cg.translateBy(x: offset.width, y: offset.height)
            cg.rotate(by: rotation)
            cg.scaleBy(x: scale, y: scale)
            cg.translateBy(x: -image.size.width / 2, y: -image.size.height / 2)
            image.draw(in: CGRect(origin: .zero, size: image.size))
        }
        // Upscale factor from the source region to the texture: beyond ~1.4x
        // the result blurs, so recover perceived detail with a light sharpen.
        let sourceRegionWidth = window.width / scale
        let upscale = target.width / max(1, sourceRegionWidth)
        guard upscale > 1.4 else { return baked }
        return Self.sharpened(baked, amount: min(0.55, 0.18 * upscale))
    }

    private static let ciContext = CIContext()

    private static func sharpened(_ image: UIImage, amount: Double) -> UIImage {
        guard let input = CIImage(image: image) else { return image }
        let filter = CIFilter.sharpenLuminance()
        filter.inputImage = input
        filter.sharpness = Float(amount)
        guard let output = filter.outputImage,
              let cgImage = ciContext.createCGImage(output, from: input.extent) else { return image }
        return UIImage(cgImage: cgImage)
    }

    private func bakeCurrent() -> UIImage {
        bakeTexture(zoom: zoom, rotation: rotation, offset: offset)
    }

    /// Auto-bake one detected nail (same jump the marker tap performs).
    private func autoBake(_ nail: DetectedNail) -> UIImage {
        let targetScale = window.height / nail.cropHeight
        let z = min(maxZoom, max(1, targetScale / fillScale))
        let r = -nail.axisAngle
        let o = offsetKeeping(nail.center, atWindowCenterWithZoom: z, rotation: r)
        return bakeTexture(zoom: z, rotation: r, offset: o)
    }

}
