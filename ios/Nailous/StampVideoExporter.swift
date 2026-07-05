import AVFoundation
import SceneKit
import UIKit

/// Renders a seamless 3-second turntable loop of the current nail(s) as an
/// H.264 MP4 (1080×1920) with the stage theme baked in — ready for Instagram
/// Stories, LINE, or the photo library.
///
/// Frames are rendered offline with SCNRenderer at exact angles (no screen
/// capture), so the loop is perfect and never drops frames.
enum StampVideoExporter {
    static func export(
        appearance: NailAppearance,
        setAppearances: [NailAppearance]?,
        shape: NailShape,
        mode: StageMode,
        layout: SetLayout,
        theme: StageTheme,
        duration: Double = 3,
        fps: Int = 30,
        size: CGSize = CGSize(width: 1080, height: 1920)
    ) async throws -> URL {
        try await Task.detached(priority: .userInitiated) {
            try renderVideo(
                appearance: appearance,
                setAppearances: setAppearances,
                shape: shape,
                mode: mode,
                layout: layout,
                theme: theme,
                duration: duration,
                fps: fps,
                size: size
            )
        }.value
    }

    private static func renderVideo(
        appearance: NailAppearance,
        setAppearances: [NailAppearance]?,
        shape: NailShape,
        mode: StageMode,
        layout: SetLayout,
        theme: StageTheme,
        duration: Double,
        fps: Int,
        size: CGSize
    ) throws -> URL {
        // --- offscreen stage (same recipe as the live view) ---
        let scene = SCNScene()
        scene.background.contents = backgroundImage(for: theme, size: size)
        scene.lightingEnvironment.contents = StageEnvironment.image(for: theme)
        scene.lightingEnvironment.intensity = 1.6

        let camera = SCNCamera()
        camera.fieldOfView = 30
        let cameraNode = SCNNode()
        cameraNode.camera = camera
        cameraNode.position = SCNVector3(0, 0, 9.2)
        scene.rootNode.addChildNode(cameraNode)

        let key = SCNNode()
        key.light = SCNLight()
        key.light?.type = .directional
        key.light?.intensity = 700
        key.eulerAngles = SCNVector3(-0.5, 0.35, 0)
        scene.rootNode.addChildNode(key)

        let ambient = SCNNode()
        ambient.light = SCNLight()
        ambient.light?.type = .ambient
        ambient.light?.intensity = 220
        scene.rootNode.addChildNode(ambient)

        let spinNode = SCNNode()
        let content: SCNNode
        switch mode {
        case .single:
            content = SCNNode(
                geometry: NailSceneView.Coordinator.makePlate(appearance: appearance, shape: shape)
            )
        case .set:
            content = NailSceneView.Coordinator.makeTipSet(
                appearances: setAppearances ?? [appearance],
                shape: shape,
                layout: layout
            )
        }
        spinNode.addChildNode(content)
        scene.rootNode.addChildNode(spinNode)

        guard let device = MTLCreateSystemDefaultDevice() else {
            throw ExportError.metalUnavailable
        }
        let renderer = SCNRenderer(device: device, options: nil)
        renderer.scene = scene
        renderer.autoenablesDefaultLighting = false

        // --- video writer ---
        let url = FileManager.default.temporaryDirectory
            .appendingPathComponent("nailous-stamp-\(Int(Date().timeIntervalSince1970)).mp4")
        try? FileManager.default.removeItem(at: url)

        let writer = try AVAssetWriter(outputURL: url, fileType: .mp4)
        let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: Int(size.width),
            AVVideoHeightKey: Int(size.height),
        ])
        input.expectsMediaDataInRealTime = false
        let adaptor = AVAssetWriterInputPixelBufferAdaptor(
            assetWriterInput: input,
            sourcePixelBufferAttributes: [
                kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
                kCVPixelBufferWidthKey as String: Int(size.width),
                kCVPixelBufferHeightKey as String: Int(size.height),
            ]
        )
        writer.add(input)
        guard writer.startWriting() else {
            throw writer.error ?? ExportError.writerFailed
        }
        writer.startSession(atSourceTime: .zero)

        let frameCount = Int(duration * Double(fps))
        for frame in 0..<frameCount {
            let progress = Float(frame) / Float(frameCount)
            spinNode.eulerAngles = SCNVector3(-0.1, 2 * Float.pi * progress, 0)

            let image = renderer.snapshot(
                atTime: 0,
                with: size,
                antialiasingMode: .multisampling4X
            )
            guard let buffer = pixelBuffer(from: image, size: size, pool: adaptor.pixelBufferPool) else {
                throw ExportError.frameFailed
            }
            while !input.isReadyForMoreMediaData {
                Thread.sleep(forTimeInterval: 0.01)
            }
            let time = CMTime(value: CMTimeValue(frame), timescale: CMTimeScale(fps))
            adaptor.append(buffer, withPresentationTime: time)
        }

        input.markAsFinished()
        let semaphore = DispatchSemaphore(value: 0)
        writer.finishWriting { semaphore.signal() }
        semaphore.wait()
        guard writer.status == .completed else {
            throw writer.error ?? ExportError.writerFailed
        }
        return url
    }

    enum ExportError: Error {
        case metalUnavailable
        case writerFailed
        case frameFailed
    }

    /// The theme backdrop aspect-filled to the video size (with a soft dim),
    /// or the theme gradient when no AI backdrop is bundled.
    private static func backgroundImage(for theme: StageTheme, size: CGSize) -> UIImage {
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { ctx in
            let cg = ctx.cgContext
            if let backdrop = theme.backdropImage {
                let scale = max(size.width / backdrop.size.width, size.height / backdrop.size.height)
                let drawSize = CGSize(width: backdrop.size.width * scale, height: backdrop.size.height * scale)
                let origin = CGPoint(
                    x: (size.width - drawSize.width) / 2,
                    y: (size.height - drawSize.height) / 2
                )
                backdrop.draw(in: CGRect(origin: origin, size: drawSize))
                cg.setFillColor(UIColor.black.withAlphaComponent(0.28).cgColor)
                cg.fill(CGRect(origin: .zero, size: size))
            } else {
                let colors = theme.gradientColors.map { UIColor($0).cgColor } as CFArray
                if let gradient = CGGradient(
                    colorsSpace: CGColorSpaceCreateDeviceRGB(),
                    colors: colors,
                    locations: [0, 1]
                ) {
                    cg.drawRadialGradient(
                        gradient,
                        startCenter: CGPoint(x: size.width / 2, y: size.height / 2),
                        startRadius: 60,
                        endCenter: CGPoint(x: size.width / 2, y: size.height / 2),
                        endRadius: size.height * 0.75,
                        options: [.drawsAfterEndLocation]
                    )
                }
            }
        }
    }

    private static func pixelBuffer(
        from image: UIImage,
        size: CGSize,
        pool: CVPixelBufferPool?
    ) -> CVPixelBuffer? {
        var buffer: CVPixelBuffer?
        if let pool {
            CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
        }
        if buffer == nil {
            CVPixelBufferCreate(
                nil,
                Int(size.width),
                Int(size.height),
                kCVPixelFormatType_32ARGB,
                nil,
                &buffer
            )
        }
        guard let buffer else { return nil }

        CVPixelBufferLockBaseAddress(buffer, [])
        defer { CVPixelBufferUnlockBaseAddress(buffer, []) }
        guard let context = CGContext(
            data: CVPixelBufferGetBaseAddress(buffer),
            width: Int(size.width),
            height: Int(size.height),
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
        ), let cgImage = image.cgImage else { return nil }
        context.draw(cgImage, in: CGRect(origin: .zero, size: size))
        return buffer
    }
}
