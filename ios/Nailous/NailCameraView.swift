import AVFoundation
import SwiftUI
import UIKit

/// What the camera was asked to frame: one nail up close, the whole hand for
/// fingertip detection, or a guided 4-angle 立体スキャン.
enum CaptureMode: String, CaseIterable, Identifiable {
    case single
    case hand
    case scan

    var id: String { rawValue }

    var label: String {
        switch self {
        case .single: return "1本"
        case .hand: return "手全体"
        case .scan: return "立体スキャン"
        }
    }

    var hint: String {
        switch self {
        case .single: return "枠に爪を合わせて、真上から近づいて"
        case .hand: return "手の甲を上にして、指を伸ばして枠に"
        case .scan: return "4方向から撮って、立体的に記録"
        }
    }
}

/// One step of a 立体スキャン, in capture order. Only `.top` is required; the
/// rest feed curve/thickness estimation later (Phase 2) and can be skipped.
enum AngleStep: Int, CaseIterable {
    case top, side, otherSide, catHand

    var label: String {
        switch self {
        case .top: return "上"
        case .side: return "横"
        case .otherSide: return "逆の横"
        case .catHand: return "猫の手"
        }
    }

    var hint: String {
        switch self {
        case .top: return "真上から、爪の表面全体を枠に"
        case .side: return "横から、縦のアーチが見えるように"
        case .otherSide: return "反対の横から、同じアングルで"
        case .catHand: return "指を軽く握って、先端のラインが見えるように"
        }
    }

    var isSkippable: Bool { self != .top }
}

/// In-app camera whose guide is the crop: the nail-shaped window on screen
/// is exactly the region handed to the crop step (plus a margin to nudge),
/// so what you framed is what you get. Whole-hand mode hands the full photo
/// to fingertip detection instead.
struct NailCameraView: View {
    @Binding var nailShape: NailShape
    let onCapture: (UIImage, CaptureMode) -> Void
    /// Called once a 立体スキャン finishes (top captured, the rest optional):
    /// the top photo (routed through the usual single-nail crop) and all 4
    /// slots in `AngleStep` order (nil where skipped).
    var onCaptureScan: ((UIImage, [UIImage?]) -> Void)? = nil
    let onCancel: () -> Void

    @StateObject private var camera = CameraController()
    // `-debugCameraMode <rawValue>` (with `-debugCamera 1`) starts on a given
    // mode, so e.g. 立体スキャン's step dots can be screenshotted headlessly —
    // the simulator has no camera to drive there by tapping the mode pill.
    @State private var mode: CaptureMode = {
        let raw = UserDefaults.standard.string(forKey: "debugCameraMode") ?? ""
        return CaptureMode(rawValue: raw) ?? .single
    }()
    @State private var isCapturing = false
    @State private var scanStep: AngleStep = .top
    @State private var scanPhotos: [UIImage?] = Array(repeating: nil, count: AngleStep.allCases.count)

    /// Margin around the single-nail guide kept in the crop (30% each axis).
    static let singleMargin: CGFloat = 1.3
    /// Margin around the side/otherSide/catHand guides — these are reference
    /// photos, not crop sources, so less slack is needed.
    static let angleMargin: CGFloat = 1.1

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
                    Text(hintText)
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

                    if mode == .scan {
                        HStack(spacing: 10) {
                            ForEach(AngleStep.allCases, id: \.rawValue) { step in
                                Button { scanStep = step } label: {
                                    Circle()
                                        .fill(scanPhotos[step.rawValue] != nil ? .white : Color.white.opacity(0.25))
                                        .frame(width: step == scanStep ? 10 : 7, height: step == scanStep ? 10 : 7)
                                        .overlay(
                                            Circle().stroke(.white.opacity(step == scanStep ? 0.9 : 0), lineWidth: 2)
                                                .frame(width: 16, height: 16)
                                        )
                                }
                            }
                        }
                    }

                    if mode == .single || (mode == .scan && scanStep == .top) {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 6) {
                                ForEach(NailShape.allCases) { candidate in
                                    pill(candidate.label, isOn: nailShape == candidate, small: true) {
                                        nailShape = candidate
                                    }
                                }
                            }
                            .padding(.horizontal, 16)
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
                        if mode == .scan {
                            VStack(spacing: 8) {
                                if scanStep.isSkippable {
                                    Button("スキップ", action: skipScanStep)
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundStyle(.white.opacity(0.75))
                                }
                                if scanPhotos[AngleStep.top.rawValue] != nil {
                                    Button("完了", action: finishScan)
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundStyle(.white)
                                }
                            }
                            .frame(width: 96)
                        } else {
                            // Balances the cancel button so the shutter stays centred.
                            Color.clear.frame(width: 96, height: 1)
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, windowSafeInsets.bottom + 14)
                }
            }
        }
        .environment(\.colorScheme, .dark)
        .onAppear { camera.start() }
        .onDisappear { camera.stop() }
        .onChange(of: mode) { _, new in
            guard new != .scan else { return }
            scanStep = .top
            scanPhotos = Array(repeating: nil, count: AngleStep.allCases.count)
        }
    }

    /// The cover ignores the safe area so the preview fills the screen; the
    /// controls still need to clear the status bar and home indicator.
    private var windowSafeInsets: UIEdgeInsets {
        let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
        return scene?.keyWindow?.safeAreaInsets ?? .zero
    }

    private var hintText: String {
        mode == .scan ? "ステップ \(scanStep.rawValue + 1)/4 ・ \(scanStep.hint)" : mode.hint
    }

    // MARK: - Guide

    /// What shape the frame takes: the nail silhouette (single nail, and the
    /// top step of a scan) or a generic rounded field (whole hand, and the
    /// other scan steps — these are reference photos, not crop sources).
    private enum GuideKind { case nail, frame }

    private var guideKind: GuideKind {
        switch mode {
        case .single: return .nail
        case .hand: return .frame
        case .scan: return scanStep == .top ? .nail : .frame
        }
    }

    /// Nail: a 2:3 window (same ratio as the crop window), a little above
    /// centre so the hand below it stays visible. Frame: a tall rounded field
    /// for the whole hand or a loosely-framed angle shot.
    private func guideRect(in size: CGSize) -> CGRect {
        switch guideKind {
        case .nail:
            // Same proportions as the crop window for this shape.
            let height = size.width * 0.75
            let width = height * NailGeometry.plateAspect(for: nailShape)
            return CGRect(x: (size.width - width) / 2, y: size.height * 0.46 - height / 2, width: width, height: height)
        case .frame:
            let width = size.width * 0.78
            let height = size.height * 0.56
            return CGRect(x: (size.width - width) / 2, y: size.height * 0.47 - height / 2, width: width, height: height)
        }
    }

    @ViewBuilder
    private func guideShape(in rect: CGRect) -> some View {
        switch guideKind {
        case .nail:
            NailSilhouette(nailShape: nailShape)
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        case .frame:
            RoundedRectangle(cornerRadius: 28)
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        }
    }

    @ViewBuilder
    private func guideStroke(in rect: CGRect) -> some View {
        switch guideKind {
        case .nail:
            NailSilhouette(nailShape: nailShape)
                .stroke(.white.opacity(0.9), style: StrokeStyle(lineWidth: 1.5, dash: [7, 5]))
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        case .frame:
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
            case .scan:
                let margin = scanStep == .top ? Self.singleMargin : Self.angleMargin
                let rect = CaptureGeometry.imageRect(
                    forGuide: guide,
                    previewSize: previewSize,
                    imageSize: upright.size,
                    margin: margin
                )
                scanPhotos[scanStep.rawValue] = upright.cropped(to: rect) ?? upright
                advanceScanStep()
            }
        }
    }

    // MARK: - Scan steps

    private func advanceScanStep() {
        if let next = AngleStep(rawValue: scanStep.rawValue + 1) {
            scanStep = next
        } else {
            finishScan()
        }
    }

    private func skipScanStep() {
        UISelectionFeedbackGenerator().selectionChanged()
        advanceScanStep()
    }

    private func finishScan() {
        guard let top = scanPhotos[AngleStep.top.rawValue] else { return }
        onCaptureScan?(top, scanPhotos)
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
