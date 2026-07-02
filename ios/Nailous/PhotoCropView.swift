import SwiftUI

/// Position the photo under a nail-shaped window: drag to move, pinch to zoom,
/// then bake the visible region into the 512×768 nail texture.
struct PhotoCropView: View {
    let image: UIImage
    let nailShape: NailShape
    let onConfirm: (UIImage) -> Void
    let onCancel: () -> Void

    @State private var zoom: CGFloat = 1
    @State private var zoomAnchor: CGFloat = 1
    @State private var offset: CGSize = .zero
    @State private var offsetAnchor: CGSize = .zero

    private let window = CGSize(width: 216, height: 324) // 2:3, matches texture

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

                VStack {
                    Text("ドラッグとピンチで、爪に入れたい部分を合わせます")
                        .font(.system(size: 13))
                        .foregroundStyle(.white.opacity(0.75))
                        .padding(.top, 18)
                    Spacer()
                    HStack(spacing: 14) {
                        Button(action: onCancel) {
                            Text("キャンセル")
                                .font(.system(size: 15, weight: .medium))
                                .padding(.horizontal, 24)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color.white.opacity(0.12)))
                                .foregroundStyle(.white)
                        }
                        Button {
                            onConfirm(bakeTexture())
                        } label: {
                            Text("この位置で決定")
                                .font(.system(size: 15, weight: .semibold))
                                .padding(.horizontal, 28)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color(red: 0.83, green: 0.54, blue: 0.61)))
                                .foregroundStyle(.white)
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
            .contentShape(Rectangle())
            .gesture(
                SimultaneousGesture(
                    MagnificationGesture()
                        .onChanged { value in
                            zoom = min(6, max(1, zoomAnchor * value))
                            offset = clampedOffset(offset)
                        }
                        .onEnded { _ in
                            zoomAnchor = zoom
                            offsetAnchor = offset
                        },
                    DragGesture()
                        .onChanged { value in
                            offset = clampedOffset(
                                CGSize(
                                    width: offsetAnchor.width + value.translation.width,
                                    height: offsetAnchor.height + value.translation.height
                                )
                            )
                        }
                        .onEnded { _ in offsetAnchor = offset }
                )
            )
        }
        .preferredColorScheme(.dark)
    }

    /// Keeps the photo covering the crop window.
    private func clampedOffset(_ proposed: CGSize) -> CGSize {
        let scale = fillScale * zoom
        let maxX = max(0, (image.size.width * scale - window.width) / 2)
        let maxY = max(0, (image.size.height * scale - window.height) / 2)
        return CGSize(
            width: min(maxX, max(-maxX, proposed.width)),
            height: min(maxY, max(-maxY, proposed.height))
        )
    }

    /// Renders the window region of the positioned photo into the texture size.
    private func bakeTexture() -> UIImage {
        let scale = fillScale * zoom
        let cropSize = CGSize(width: window.width / scale, height: window.height / scale)
        let centerX = image.size.width / 2 - offset.width / scale
        let centerY = image.size.height / 2 - offset.height / scale
        let cropRect = CGRect(
            x: centerX - cropSize.width / 2,
            y: centerY - cropSize.height / 2,
            width: cropSize.width,
            height: cropSize.height
        )

        let target = CGSize(width: 512, height: 768)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: target, format: format).image { _ in
            let renderScale = target.width / cropRect.width
            let drawSize = CGSize(
                width: image.size.width * renderScale,
                height: image.size.height * renderScale
            )
            let origin = CGPoint(x: -cropRect.minX * renderScale, y: -cropRect.minY * renderScale)
            image.draw(in: CGRect(origin: origin, size: drawSize))
        }
    }
}
