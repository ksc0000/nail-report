import CoreGraphics

/// Pure geometry for the in-app camera: which part of the captured photo the
/// on-screen guide covered. UIKit-free so it can be checked on the host.
enum CaptureGeometry {
    /// Maps a rect in preview-layer points to pixels of the upright captured
    /// image, assuming the preview showed the image aspect-filled and centred
    /// (`AVLayerVideoGravity.resizeAspectFill`). `margin` grows the region
    /// about its centre (1.3 = 30% more on each axis) so the user can still
    /// nudge the framing afterwards; the result is clamped to the image.
    static func imageRect(
        forGuide guide: CGRect,
        previewSize: CGSize,
        imageSize: CGSize,
        margin: CGFloat = 1
    ) -> CGRect {
        guard previewSize.width > 0, previewSize.height > 0,
              imageSize.width > 0, imageSize.height > 0 else { return CGRect(origin: .zero, size: imageSize) }
        let scale = max(previewSize.width / imageSize.width, previewSize.height / imageSize.height)
        // Image pixels hidden beyond the preview's edges on each axis.
        let hiddenX = (imageSize.width - previewSize.width / scale) / 2
        let hiddenY = (imageSize.height - previewSize.height / scale) / 2
        var rect = CGRect(
            x: hiddenX + guide.minX / scale,
            y: hiddenY + guide.minY / scale,
            width: guide.width / scale,
            height: guide.height / scale
        )
        if margin != 1 {
            rect = rect.insetBy(dx: -rect.width * (margin - 1) / 2, dy: -rect.height * (margin - 1) / 2)
        }
        return rect.intersection(CGRect(origin: .zero, size: imageSize)).integral
    }
}
