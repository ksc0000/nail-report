import SwiftUI
import UniformTypeIdentifiers

/// Transparent-PNG payload for ShareLink (Notes, LINE, save to Photos…).
struct StampPNG: Transferable {
    let data: Data

    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .png) { $0.data }
    }
}

extension UIImage {
    /// Crops the image to its non-transparent content (plus padding) so the
    /// stamp pastes as a tight sticker, not a huge mostly-empty rectangle.
    func trimmedTransparency(padding: CGFloat = 24) -> UIImage {
        guard let cgImage else { return self }
        let width = cgImage.width
        let height = cgImage.height
        guard width > 0, height > 0,
              let context = CGContext(
                  data: nil,
                  width: width,
                  height: height,
                  bitsPerComponent: 8,
                  bytesPerRow: width * 4,
                  space: CGColorSpaceCreateDeviceRGB(),
                  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
              )
        else { return self }
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        guard let raw = context.data else { return self }
        let pixels = raw.bindMemory(to: UInt8.self, capacity: width * height * 4)

        var minX = width, maxX = -1, minY = height, maxY = -1
        for y in 0..<height {
            let row = y * width * 4
            for x in 0..<width {
                if pixels[row + x * 4 + 3] > 8 {
                    if x < minX { minX = x }
                    if x > maxX { maxX = x }
                    if y < minY { minY = y }
                    if y > maxY { maxY = y }
                }
            }
        }
        guard maxX >= minX, maxY >= minY else { return self }

        let pad = Int(padding * scale)
        let cropX = max(0, minX - pad)
        let cropY = max(0, minY - pad)
        let cropRect = CGRect(
            x: cropX,
            y: cropY,
            width: min(width, maxX + pad) - cropX,
            height: min(height, maxY + pad) - cropY
        )
        guard let cropped = cgImage.cropping(to: cropRect) else { return self }
        return UIImage(cgImage: cropped, scale: scale, orientation: imageOrientation)
    }
}

/// Bottom sheet shown after tapping the stamp button: preview + copy + share
/// + a seamless turntable-loop video for Stories.
struct StampSheet: View {
    let image: UIImage
    var makeVideo: (() async throws -> URL)?
    @State private var copied = false
    @State private var isExportingVideo = false
    @State private var videoURL: URL?

    var body: some View {
        ZStack {
            StageBackground()

            VStack(spacing: 16) {
                Text("ネイルスタンプ")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(.white)
                    .padding(.top, 20)

                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(maxHeight: 210)
                    .shadow(color: .black.opacity(0.5), radius: 14, y: 8)

                Text("コピーして、Instagramストーリーの文字入力画面で\n長押し→ペーストするとステッカーになります")
                    .font(.system(size: 12))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.white.opacity(0.6))
                    .lineSpacing(3)

                HStack(spacing: 12) {
                    Button {
                        if let png = image.pngData() {
                            UIPasteboard.general.setData(
                                png,
                                forPasteboardType: UTType.png.identifier
                            )
                            copied = true
                            UINotificationFeedbackGenerator().notificationOccurred(.success)
                        }
                    } label: {
                        Label(
                            copied ? "コピーしました" : "コピー",
                            systemImage: copied ? "checkmark" : "doc.on.doc"
                        )
                        .font(.system(size: 14, weight: .semibold))
                        .padding(.horizontal, 22)
                        .padding(.vertical, 12)
                        .background(
                            Capsule().fill(
                                copied
                                    ? Color(red: 0.45, green: 0.72, blue: 0.52)
                                    : Color(red: 0.83, green: 0.54, blue: 0.61)
                            )
                        )
                        .foregroundStyle(.white)
                    }

                    if let png = image.pngData() {
                        ShareLink(
                            item: StampPNG(data: png),
                            preview: SharePreview("Nailousスタンプ", image: Image(uiImage: image))
                        ) {
                            Label("共有", systemImage: "square.and.arrow.up")
                                .font(.system(size: 14, weight: .semibold))
                                .padding(.horizontal, 22)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color.white.opacity(0.15)))
                                .foregroundStyle(.white)
                        }
                    }
                }

                if makeVideo != nil {
                    Group {
                        if let videoURL {
                            ShareLink(item: videoURL) {
                                Label("動画を共有（写真に保存→ストーリーへ）", systemImage: "film")
                                    .font(.system(size: 13.5, weight: .semibold))
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 11)
                                    .background(Capsule().fill(Color(red: 0.55, green: 0.45, blue: 0.75)))
                                    .foregroundStyle(.white)
                            }
                        } else if isExportingVideo {
                            HStack(spacing: 8) {
                                ProgressView().tint(.white)
                                Text("回転動画を作成中…")
                                    .font(.system(size: 13))
                                    .foregroundStyle(.white.opacity(0.75))
                            }
                            .padding(.vertical, 11)
                        } else {
                            Button {
                                guard let makeVideo else { return }
                                isExportingVideo = true
                                Task {
                                    defer { isExportingVideo = false }
                                    videoURL = try? await makeVideo()
                                    if videoURL != nil {
                                        UINotificationFeedbackGenerator().notificationOccurred(.success)
                                    }
                                }
                            } label: {
                                Label("回転動画を作成（3秒ループ）", systemImage: "film")
                                    .font(.system(size: 13.5, weight: .semibold))
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 11)
                                    .background(Capsule().fill(Color.white.opacity(0.15)))
                                    .foregroundStyle(.white)
                            }
                        }
                    }
                }

                Spacer(minLength: 20)
            }
        }
        .preferredColorScheme(.dark)
    }
}
