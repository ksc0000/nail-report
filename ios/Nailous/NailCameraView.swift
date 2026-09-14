import AVFoundation
import SwiftUI
import UIKit

/// What the camera was asked to frame: one hand (the default — five nails
/// from above, then optional side / curled shots for curve estimation) or a
/// single nail up close.
enum CaptureMode: String, CaseIterable, Identifiable {
    case hand
    case single

    var id: String { rawValue }

    var label: String {
        switch self {
        case .hand: return "片手"
        case .single: return "1本だけ"
        }
    }
}

/// Storage slots for a hand's reference photos (`NailRecord.anglePhotoData`
/// order). `otherSide` is a legacy slot from the per-nail 4-angle scan and
/// is no longer captured.
enum AngleStep: Int, CaseIterable {
    case top, side, otherSide, catHand

    var label: String {
        switch self {
        case .top: return "手の甲"
        case .side: return "横"
        case .otherSide: return "逆の横"
        case .catHand: return "猫の手"
        }
    }
}

/// The three shots of a hand capture, in order. Only the top shot is
/// required; side and curled feed curve estimation and can be skipped.
enum HandStep: Int, CaseIterable, Identifiable {
    case top, side, catHand

    var id: Int { rawValue }

    var slot: AngleStep {
        switch self {
        case .top: return .top
        case .side: return .side
        case .catHand: return .catHand
        }
    }

    var hint: String {
        switch self {
        case .top: return "手の甲を上に、指を伸ばして5本を枠に"
        case .side: return "手を横に倒して、爪の横顔が並ぶように"
        case .catHand: return "指を軽く握って、5本の先端が見えるように"
        }
    }

    var isSkippable: Bool { self != .top }
}

/// In-app camera. Hand mode: the top shot goes to fingertip detection (five
/// nails), the optional side and curled shots are kept as references for
/// curve estimation. Single mode: the nail-shaped guide is the crop — what
/// you framed (plus a margin to nudge) is what reaches the crop step.
struct NailCameraView: View {
    @Binding var nailShape: NailShape
    /// Single-nail capture (already cropped to the guide).
    let onCapture: (UIImage, CaptureMode) -> Void
    /// Hand capture: the top photo (full frame, for detection), all storage
    /// slots in `AngleStep` order (nil where skipped), and which hand.
    var onCaptureHand: ((UIImage, [UIImage?], Hand) -> Void)? = nil
    let onCancel: () -> Void

    @StateObject private var camera = CameraController()
    // `-debugCameraMode <rawValue>` (with `-debugCamera 1`) starts on a given
    // mode so the overlay can be screenshotted headlessly.
    @State private var mode: CaptureMode = {
        let raw = UserDefaults.standard.string(forKey: "debugCameraMode") ?? ""
        return CaptureMode(rawValue: raw) ?? .hand
    }()
    @State private var hand: Hand = Hand.remembered
    @State private var isCapturing = false
    @State private var zoomFactor: CGFloat = 1
    @State private var zoomAnchor: CGFloat = 1
    @State private var step: HandStep = .top
    @State private var slots: [UIImage?] = Array(repeating: nil, count: AngleStep.allCases.count)

    /// Margin around the single-nail guide kept in the crop (30% each axis).
    static let singleMargin: CGFloat = 1.3
    /// Margin around the side / curled guides — reference photos, not crop
    /// sources, so less slack is needed.
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
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Capsule().fill(Color.black.opacity(0.45)))
                        .padding(.top, windowSafeInsets.top + 10)

                    if let focusHint {
                        Text(focusHint)
                            .font(.system(size: 11))
                            .foregroundStyle(.white.opacity(0.75))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Capsule().fill(Color.black.opacity(0.4)))
                    }
                    if zoomFactor > 1.05 {
                        Text(String(format: "%.1fx", zoomFactor))
                            .font(.system(size: 11, weight: .medium))
                            .foregroundStyle(.white.opacity(0.85))
                            .padding(.horizontal, 9)
                            .padding(.vertical, 4)
                            .background(Capsule().fill(Color.black.opacity(0.45)))
                    }

                    HStack(spacing: 6) {
                        ForEach(CaptureMode.allCases) { candidate in
                            pill(candidate.label, isOn: mode == candidate) { mode = candidate }
                        }
                    }

                    if mode == .hand {
                        HStack(spacing: 6) {
                            ForEach(Hand.allCases) { candidate in
                                pill(candidate.label, isOn: hand == candidate, small: true) {
                                    hand = candidate
                                    candidate.remember()
                                }
                            }
                        }
                        stepDots
                    } else {
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
                        if mode == .hand {
                            VStack(spacing: 8) {
                                if step.isSkippable {
                                    Button("スキップ", action: skipStep)
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundStyle(.white.opacity(0.75))
                                }
                                if slots[AngleStep.top.rawValue] != nil {
                                    Button("完了", action: finishHand)
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
                .disabled(isCapturing)
            }
        }
        .environment(\.colorScheme, .dark)
        .gesture(
            MagnificationGesture()
                .onChanged { value in
                    zoomFactor = camera.setZoom(zoomAnchor * value)
                }
                .onEnded { _ in zoomAnchor = zoomFactor }
        )
        .onAppear { camera.start() }
        .onDisappear { camera.stop() }
        .onChange(of: mode) { _, _ in
            step = .top
            slots = Array(repeating: nil, count: AngleStep.allCases.count)
        }
    }

    /// The three shots as dots: filled once taken, ringed while current.
    private var stepDots: some View {
        HStack(spacing: 14) {
            ForEach(HandStep.allCases) { candidate in
                Button { step = candidate } label: {
                    VStack(spacing: 4) {
                        Circle()
                            .fill(slots[candidate.slot.rawValue] != nil ? .white : Color.white.opacity(0.25))
                            .frame(width: 8, height: 8)
                            .overlay(
                                Circle().stroke(.white.opacity(candidate == step ? 0.9 : 0), lineWidth: 1.5)
                                    .frame(width: 16, height: 16)
                            )
                        Text(candidate.slot.label)
                            .font(.system(size: 10))
                            .foregroundStyle(.white.opacity(candidate == step ? 0.9 : 0.5))
                    }
                }
            }
        }
        .padding(.top, 2)
    }

    /// The cover ignores the safe area so the preview fills the screen; the
    /// controls still need to clear the status bar and home indicator.
    private var windowSafeInsets: UIEdgeInsets {
        let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
        return scene?.keyWindow?.safeAreaInsets ?? .zero
    }

    private var hintText: String {
        switch mode {
        case .hand: return "\(step.rawValue + 1)/3 ・ \(step.hint)"
        case .single: return "枠に爪を合わせて、真上から近づいて"
        }
    }

    /// Second line under the hint for the close-up guide.
    private var focusHint: String? {
        guard guideKind == .nail else { return nil }
        return "ピントが合う距離まで近づいて。枠より小さくてもOK、ピンチで拡大できます"
    }

    // MARK: - Guide

    /// The nail silhouette for a single nail; a rounded field for the hand
    /// shots (the top shot is detected, the rest are references).
    private enum GuideKind { case nail, frame }

    private var guideKind: GuideKind {
        mode == .single ? .nail : .frame
    }

    private func guideRect(in size: CGSize) -> CGRect {
        switch guideKind {
        case .nail:
            // Same proportions as the crop window for this shape. Kept small:
            // filling a big outline meant pushing the lens past its closest
            // focus. Pinch zoom closes the rest of the gap.
            let height = size.width * 0.4
            let width = height * NailGeometry.plateAspect(for: nailShape)
            return CGRect(x: (size.width - width) / 2, y: size.height * 0.46 - height / 2, width: width, height: height)
        case .frame:
            // Below the hand / step controls, above the shutter.
            let width = size.width * 0.78
            let height = size.height * 0.46
            return CGRect(x: (size.width - width) / 2, y: size.height * 0.54 - height / 2, width: width, height: height)
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
            case .single:
                let rect = CaptureGeometry.imageRect(
                    forGuide: guide,
                    previewSize: previewSize,
                    imageSize: upright.size,
                    margin: Self.singleMargin
                )
                onCapture(upright.cropped(to: rect) ?? upright, .single)
            case .hand:
                if step == .top {
                    // Full frame: fingertip detection wants the whole hand.
                    slots[AngleStep.top.rawValue] = upright
                } else {
                    let rect = CaptureGeometry.imageRect(
                        forGuide: guide,
                        previewSize: previewSize,
                        imageSize: upright.size,
                        margin: Self.angleMargin
                    )
                    slots[step.slot.rawValue] = upright.cropped(to: rect) ?? upright
                }
                advanceStep()
            }
        }
    }

    // MARK: - Hand steps

    private func advanceStep() {
        if let next = HandStep(rawValue: step.rawValue + 1) {
            step = next
        } else {
            finishHand()
        }
    }

    private func skipStep() {
        guard !isCapturing, step.isSkippable else { return }
        slots[step.slot.rawValue] = nil
        UISelectionFeedbackGenerator().selectionChanged()
        advanceStep()
    }

    private func finishHand() {
        // Completion after the last shot happens inside the capture callback.
        guard let top = slots[AngleStep.top.rawValue] else { return }
        hand.remember()
        onCaptureHand?(top, slots, hand)
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
    private var device: AVCaptureDevice?

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
        // A virtual multi-camera device lets the system switch to the
        // ultra-wide for close focus (automatic macro on phones that have
        // it), which a bare wide-angle device never does; nails are shot
        // from a few centimetres away.
        let preferred: [AVCaptureDevice.DeviceType] = [.builtInTripleCamera, .builtInDualWideCamera, .builtInDualCamera, .builtInWideAngleCamera]
        let discovery = AVCaptureDevice.DiscoverySession(deviceTypes: preferred, mediaType: .video, position: .back)
        guard let device = preferred.lazy.compactMap({ type in discovery.devices.first { $0.deviceType == type } }).first,
              let input = try? AVCaptureDeviceInput(device: device) else {
            unavailableReason = "この端末ではカメラを使えません"
            return
        }
        self.device = device
        session.beginConfiguration()
        session.sessionPreset = .photo
        if session.canAddInput(input) { session.addInput(input) }
        if session.canAddOutput(output) { session.addOutput(output) }
        session.commitConfiguration()
        output.maxPhotoQualityPrioritization = .quality
        // Full sensor resolution: a nail that fills a fifth of the frame
        // still has enough pixels for the 1536-tall texture.
        if let largest = device.activeFormat.supportedMaxPhotoDimensions.last {
            output.maxPhotoDimensions = largest
        }
        isAvailable = true
    }

    /// Clamps to the device's range and applies it; returns what was set so
    /// the gesture state stays in sync.
    @discardableResult
    func setZoom(_ factor: CGFloat) -> CGFloat {
        guard let device else { return 1 }
        let clamped = min(max(factor, 1), min(device.activeFormat.videoMaxZoomFactor, 6))
        if (try? device.lockForConfiguration()) != nil {
            device.videoZoomFactor = clamped
            device.unlockForConfiguration()
        }
        return device.videoZoomFactor
    }

    func capture(_ completion: @escaping (UIImage?) -> Void) {
        guard isAvailable, self.completion == nil else { completion(nil); return }
        self.completion = completion
        let settings = AVCapturePhotoSettings()
        settings.photoQualityPrioritization = .quality
        settings.maxPhotoDimensions = output.maxPhotoDimensions
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
