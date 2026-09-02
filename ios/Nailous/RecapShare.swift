import SwiftUI

/// Bottom sheet shown after tapping a month's share icon: the rendered recap
/// card plus the same trio `StampSheet` offers for a single-nail card
/// (Stories / save to Photos / system share), just for the whole month.
struct RecapSheet: View {
    let image: UIImage
    let monthTitle: String
    @State private var saved = false
    @Environment(\.openURL) private var openURL

    private static let storiesURL = URL(string: "instagram-stories://share?source_application=com.ksc0000.nailous")!
    private var canPostToStories: Bool { UIApplication.shared.canOpenURL(Self.storiesURL) }

    private func postToStories() {
        guard let png = image.pngData() else { return }
        UIPasteboard.general.setItems(
            [["com.instagram.sharedSticker.backgroundImage": png]],
            options: [.expirationDate: Date().addingTimeInterval(300)]
        )
        openURL(Self.storiesURL)
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    var body: some View {
        ZStack {
            Palette.paper.ignoresSafeArea()

            VStack(spacing: 16) {
                Text("\(monthTitle)のリキャップ")
                    .font(.system(size: 16, weight: .semibold, design: .serif))
                    .foregroundStyle(Palette.inkWarm)
                    .padding(.top, 20)

                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(maxHeight: 420)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .shadow(color: .black.opacity(0.18), radius: 14, y: 8)

                if canPostToStories {
                    Button(action: postToStories) {
                        Label("ストーリーズに投稿", systemImage: "camera.aperture")
                            .font(.system(size: 14.5, weight: .semibold))
                            .padding(.horizontal, 26)
                            .padding(.vertical, 13)
                            .background(Capsule().fill(Palette.goldGradient))
                            .foregroundStyle(Palette.ink0)
                    }
                }

                HStack(spacing: 12) {
                    Button {
                        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
                        saved = true
                        UINotificationFeedbackGenerator().notificationOccurred(.success)
                    } label: {
                        Label(
                            saved ? "保存しました" : "写真に保存",
                            systemImage: saved ? "checkmark" : "square.and.arrow.down"
                        )
                        .font(.system(size: 14, weight: .semibold))
                        .padding(.horizontal, 22)
                        .padding(.vertical, 12)
                        .background(
                            Capsule().fill(
                                saved || canPostToStories
                                    ? AnyShapeStyle(Color.black.opacity(0.06))
                                    : AnyShapeStyle(Palette.goldGradient)
                            )
                        )
                        .foregroundStyle(saved || canPostToStories ? Palette.inkWarm : Palette.ink0)
                    }

                    if let png = image.pngData() {
                        ShareLink(
                            item: StampPNG(data: png),
                            preview: SharePreview("Nailousリキャップ", image: Image(uiImage: image))
                        ) {
                            Label("共有", systemImage: "square.and.arrow.up")
                                .font(.system(size: 14, weight: .semibold))
                                .padding(.horizontal, 22)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color.black.opacity(0.06)))
                                .foregroundStyle(Palette.inkWarm)
                        }
                    }
                }

                Spacer(minLength: 20)
            }
            .padding(.horizontal, 24)
        }
    }
}
