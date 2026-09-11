import AVFoundation
import SwiftUI
import UIKit

/// What the camera was asked to frame: one nail up close, or the whole hand
/// for fingertip detection afterwards.
enum CaptureMode: String, CaseIterable, Identifiable {
    case single
    case hand

    var id: String { rawValue }

    var label: String {
        switch self {
        case .single: return "1本"
        case .hand: return "手全体"
        }
    }

    var hint: String {
        switch self {
        case .single: return "枠に爪を合わせて、真上から近づいて"
        case .hand: return "手の甲を上にして、指を伸ばして枠に"
        }
    }
}

/// In-app camera whose guide is the crop: the nail-shaped window on screen
/// is exactly the region handed to the crop step (plus a margin to nudge),
/// so what you framed is what you get. Whole-hand mode hands the full photo
/// to fingertip detection instead.
struct NailCameraView: View {
    @Binding var nailShape: NailShape
    let onCapture: (UIImage, CaptureMode) -> Void
    let onCancel: () -> Void

    @StateObject private var camera = CameraController()
    @State private var mode: CaptureMode = .single
    @State private var isCapturing = false

    /// Margin around the single-nail guide kept in the crop (30% each axis).
    static let singleMargin: CGFloat = 1.3

    var body: some View {
        GeometryReader { proxy in
            let size = proxy.size
            let guide = guideRect(in: size)
            ZStack {
                Color.black.ignoresSafeArea()

                if camera.isAvailable {
                    CameraPreview(session: camera.session)
                        .ignoresSafeArea()
                } else {
                    VStack(spacing: 10) {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 28))
                        Text(camera.unavailableReason ?? "カメラを使えません")
                            .font(.system(size: 13))
                    }
                    .foregroundStyle(.white.opacity(0.7))
                }

                // Dim outside the guide.
                ZStack {
                    Color.black.opacity(0.55)
                    guideShape(in: guide)
                        .blendMode(.destinationOut)
                }
                .compositingGroup()
                .ignoresSafeArea()
                .allowsHitTesting(false)

                guideStroke(in: guide)
                    .allowsHitTesting(false)

                VStack(spacing: 10) {
                    Text(mode.hint)
                        .font(.system(size: 13))
                        .foregroundStyle(.white.opacity(0.85))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Capsule().fill(Color.black.opacity(0.45)))
                        .padding(.top, windowSafeInsets.top + 10)

                    HStack(spacing: 6) {
                        ForEach(CaptureMode.allCases) { candidate in
                            pill(candidate.label, isOn: mode == candidate) { mode = candidate }
                        }
                    }

                    if mode == .single {
                        HStack(spacing: 6) {
                            ForEach(NailShape.allCases) { candidate in
                                pill(candidate.label, isOn: nailShape == candidate, small: true) {
                                    nailShape = candidate
                                }
                            }
                        }
                    }

                    Spacer()

                    HStack {
                        Button(action: onCancel) {
                            Text("キャンセル")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(.white)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color.white.opacity(0.12)))
                        }
                        Spacer()
                        Button {
                            shoot(previewSize: size, guide: guide)
                        } label: {
                            ZStack {
                                Circle().stroke(.white, lineWidth: 3).frame(width: 72, height: 72)
                                Circle().fill(.white).frame(width: 60, height: 60)
                            }
                        }
                        .disabled(!camera.isAvailable || isCapturing)
                        .opacity(camera.isAvailable ? 1 : 0.3)
                        .accessibilityLabel("撮影")
                        Spacer()
                        // Balances the cancel button so the shutter stays centred.
                        Color.clear.frame(width: 96, height: 1)
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, windowSafeInsets.bottom + 14)
                }
            }
        }
        .environment(\.colorScheme, .dark)
        .onAppear { camera.start() }
        .onDisappear { camera.stop() }
    }

    /// The cover ignores the safe area so the preview fills the screen; the
    /// controls still need to clear the status bar and home indicator.
    private var windowSafeInsets: UIEdgeInsets {
        let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
        return scene?.keyWindow?.safeAreaInsets ?? .zero
    }

    // MARK: - Guide

    /// Single: a 2:3 nail window (same ratio as the crop window), a little
    /// above centre so the hand below it stays visible. Hand: a tall rounded
    /// field for the whole hand.
    private func guideRect(in size: CGSize) -> CGRect {
        switch mode {
        case .single:
            // Same proportions as the crop window for this shape.
            let height = size.width * 0.75
            let width = height * NailGeometry.plateAspect(for: nailShape)
            return CGRect(x: (size.width - width) / 2, y: size.height * 0.46 - height / 2, width: width, height: height)
        case .hand:
            let width = size.width * 0.78
            let height = size.height * 0.56
            return CGRect(x: (size.width - width) / 2, y: size.height * 0.47 - height / 2, width: width, height: height)
        }
    }

    @ViewBuilder
    private func guideShape(in rect: CGRect) -> some View {
        switch mode {
        case .single:
            NailSilhouette(nailShape: nailShape)
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        case .hand:
            RoundedRectangle(cornerRadius: 28)
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        }
    }

    @ViewBuilder
    private func guideStroke(in rect: CGRect) -> some View {
        switch mode {
        case .single:
            NailSilhouette(nailShape: nailShape)
                .stroke(.white.opacity(0.9), style: StrokeStyle(lineWidth: 1.5, dash: [7, 5]))
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        case .hand:
            RoundedRectangle(cornerRadius: 28)
                .stroke(.white.opacity(0.9), style: StrokeStyle(lineWidth: 1.5, dash: [7, 5]))
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        }
    }

    private func pill(_ title: String, isOn: Bool, small: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: small ? 11.5 : 13, weight: .medium))
                .padding(.horizontal, small ? 11 : 14)
                .padding(.vertical, small ? 6 : 7)
                .background(Capsule().fill(isOn ? Color.white.opacity(0.92) : Color.black.opacity(0.45)))
                .foregroundStyle(isOn ? Palette.inkWarm : .white.opacity(0.85))
        }
    }

    // MARK: - Capture

    private func shoot(previewSize: CGSize, guide: CGRect) {
        guard !isCapturing else { return }
        isCapturing = true
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        camera.capture { image in
            defer { isCapturing = false }
            guard let image else { return }
            let upright = image.uprightCopy()
            switch mode {
            case .hand:
                onCapture(upright, .hand)
            case .single:
                let rect = CaptureGeometry.imageRect(
                    forGuide: guide,
                    previewSize: previewSize,
                    imageSize: upright.size,
                    margin: Self.singleMargin
                )
                onCapture(upright.cropped(to: rect) ?? upright, .single)
            }
        }
    }
}

// MARK: - Preview layer

private struct CameraPreview: UIViewRepresentable {
    let session: AVCaptureSession

    func makeUIView(context: Context) -> PreviewView {
        let view = PreviewView()
        view.previewLayer.session = session
        view.previewLayer.videoGravity = .resizeAspectFill
        return view
    }

    func updateUIView(_ uiView: PreviewView, context: Context) {}

    final class PreviewView: UIView {
        override class var layerClass: AnyClass { AVCaptureVideoPreviewLayer.self }
        var previewLayer: AVCaptureVideoPreviewLayer { layer as! AVCaptureVideoPreviewLayer }

        override func layoutSubviews() {
            super.layoutSubviews()
            if let connection = previewLayer.connection, connection.isVideoRotationAngleSupported(90) {
                connection.videoRotationAngle = 90 // portrait, matches the upright photo
            }
        }
    }
}

// MARK: - Session

@MainActor
final class CameraController: NSObject, ObservableObject {
    let session = AVCaptureSession()
    @Published private(set) var isAvailable = false
    @Published private(set) var unavailableReason: String?

    private let output = AVCapturePhotoOutput()
    private let queue = DispatchQueue(label: "nailous.camera")
    private var configured = false
    private var completion: ((UIImage?) -> Void)?

    func start() {
        Task {
            let granted: Bool
            switch AVCaptureDevice.authorizationStatus(for: .video) {
            case .authorized: granted = true
            case .notDetermined: granted = await AVCaptureDevice.requestAccess(for: .video)
            default: granted = false
            }
            guard granted else {
                unavailableReason = "設定でカメラへのアクセスを許可してください"
                return
            }
            configureIfNeeded()
            if isAvailable {
                let session = self.session
                queue.async { if !session.isRunning { session.startRunning() } }
            }
        }
    }

    func stop() {
        let session = self.session
        queue.async { if session.isRunning { session.stopRunning() } }
    }

    private func configureIfNeeded() {
        guard !configured else { return }
        configured = true
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
              let input = try? AVCaptureDeviceInput(device: device) else {
            unavailableReason = "この端末ではカメラを使えません"
            return
        }
        session.beginConfiguration()
        session.sessionPreset = .photo
        if session.canAddInput(input) { session.addInput(input) }
        if session.canAddOutput(output) { session.addOutput(output) }
        session.commitConfiguration()
        output.maxPhotoQualityPrioritization = .quality
        isAvailable = true
    }

    func capture(_ completion: @escaping (UIImage?) -> Void) {
        guard isAvailable, self.completion == nil else { completion(nil); return }
        self.completion = completion
        let settings = AVCapturePhotoSettings()
        settings.photoQualityPrioritization = .quality
        if let connection = output.connection(with: .video), connection.isVideoRotationAngleSupported(90) {
            connection.videoRotationAngle = 90
        }
        output.capturePhoto(with: settings, delegate: self)
    }
}

extension CameraController: AVCapturePhotoCaptureDelegate {
    nonisolated func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        let image = photo.fileDataRepresentation().flatMap(UIImage.init(data:))
        Task { @MainActor in
            let done = completion
            completion = nil
            done?(error == nil ? image : nil)
        }
    }
}

// MARK: - Image helpers

private extension UIImage {
    /// Redraws so `imageOrientation` becomes `.up` and `size` is the visual
    /// size — the coordinate space the guide mapping assumes.
    func uprightCopy() -> UIImage {
        guard imageOrientation != .up else { return self }
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }

    func cropped(to rect: CGRect) -> UIImage? {
        guard let cg = cgImage else { return nil }
        let pixelRect = CGRect(
            x: rect.minX * scale, y: rect.minY * scale,
            width: rect.width * scale, height: rect.height * scale
        ).integral
        guard let part = cg.cropping(to: pixelRect) else { return nil }
        return UIImage(cgImage: part, scale: 1, orientation: .up)
    }
}
