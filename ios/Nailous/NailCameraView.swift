import SwiftUI
import UIKit

/// In-app camera with a nail-silhouette guide overlay: shooting straight-on
/// and close fills the texture with real pixels instead of upscaled crop.
struct NailCameraView: UIViewControllerRepresentable {
    let onCapture: (UIImage) -> Void
    let onCancel: () -> Void

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.cameraCaptureMode = .photo
        picker.delegate = context.coordinator

        let guide = GuideOverlayView()
        guide.isUserInteractionEnabled = false
        guide.backgroundColor = .clear
        guide.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        guide.frame = UIScreen.main.bounds
        picker.cameraOverlayView = guide
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    final class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: NailCameraView

        init(_ parent: NailCameraView) { self.parent = parent }

        func imagePickerController(
            _ picker: UIImagePickerController,
            didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]
        ) {
            if let image = info[.originalImage] as? UIImage {
                parent.onCapture(image)
            } else {
                parent.onCancel()
            }
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.onCancel()
        }
    }
}

/// Dashed nail outline + hint, centered over the camera preview.
private final class GuideOverlayView: UIView {
    private let hint = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        hint.text = "枠に爪を合わせて、真上から近づいて撮影"
        hint.font = .systemFont(ofSize: 13, weight: .medium)
        hint.textColor = UIColor.white.withAlphaComponent(0.9)
        hint.textAlignment = .center
        hint.layer.shadowColor = UIColor.black.cgColor
        hint.layer.shadowOpacity = 0.8
        hint.layer.shadowRadius = 3
        hint.layer.shadowOffset = .zero
        addSubview(hint)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) unavailable") }

    override func layoutSubviews() {
        super.layoutSubviews()
        hint.frame = CGRect(x: 0, y: bounds.height * 0.16, width: bounds.width, height: 20)
        setNeedsDisplay()
    }

    override func draw(_ rect: CGRect) {
        let guideWidth = bounds.width * 0.42
        let guideHeight = guideWidth * 1.5
        let guideRect = CGRect(
            x: (bounds.width - guideWidth) / 2,
            y: bounds.height * 0.5 - guideHeight * 0.62,
            width: guideWidth,
            height: guideHeight
        )

        let path = UIBezierPath()
        let samples = 40
        var left: [CGPoint] = []
        var right: [CGPoint] = []
        for i in 0...samples {
            let t = Float(i) / Float(samples)
            let half = CGFloat(NailGeometry.widthFactor(t: t, shape: .squoval)) * guideRect.width / 2
            let y = guideRect.maxY - CGFloat(t) * guideRect.height
            left.append(CGPoint(x: guideRect.midX - half, y: y))
            right.append(CGPoint(x: guideRect.midX + half, y: y))
        }
        path.move(to: left[0])
        for point in left.dropFirst() { path.addLine(to: point) }
        for point in right.reversed() { path.addLine(to: point) }
        path.close()

        UIColor.white.withAlphaComponent(0.9).setStroke()
        path.lineWidth = 2
        path.setLineDash([7, 5], count: 2, phase: 0)
        path.stroke()
    }
}
