import SceneKit
import SwiftUI

/// SceneKit stage hosting one spinnable 3D nail.
///
/// Node hierarchy: floatNode (idle bobbing) → spinNode (finger rotation) → plate.
/// Gel gloss comes from a physically-based material with a clear coat, lit by a
/// generated studio environment map (no external assets, offline-friendly).
/// How nails are staged: one hero nail, or a five-piece tip set.
enum StageMode: String, CaseIterable, Identifiable {
    case single
    case set

    var id: String { rawValue }

    var label: String {
        switch self {
        case .single: return "1本"
        case .set: return "セット"
        }
    }
}

struct NailSceneView: UIViewRepresentable {
    var appearance: NailAppearance
    var shape: NailShape
    var mode: StageMode

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> SCNView {
        let view = SCNView()
        view.backgroundColor = .clear
        view.antialiasingMode = .multisampling4X
        view.preferredFramesPerSecond = 60

        let scene = SCNScene()
        scene.background.contents = UIColor.clear
        scene.lightingEnvironment.contents = StudioEnvironment.image
        scene.lightingEnvironment.intensity = 1.6
        view.scene = scene

        let camera = SCNCamera()
        camera.fieldOfView = 30
        camera.wantsDepthOfField = false
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

        let floatNode = SCNNode()
        let spinNode = SCNNode()
        // Rest pose: a slight three-quarter view so the C-curve reads as 3D
        // before the first touch.
        spinNode.eulerAngles = SCNVector3(-0.1, 0.42, 0)
        floatNode.addChildNode(spinNode)
        scene.rootNode.addChildNode(floatNode)

        let bob = SCNAction.sequence([
            SCNAction.moveBy(x: 0, y: 0.09, z: 0, duration: 1.9),
            SCNAction.moveBy(x: 0, y: -0.09, z: 0, duration: 1.9),
        ])
        bob.timingMode = .easeInEaseOut
        floatNode.runAction(SCNAction.repeatForever(bob))

        context.coordinator.spinNode = spinNode
        context.coordinator.rebuildPlate(appearance: appearance, shape: shape, mode: mode)

        let pan = UIPanGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handlePan(_:))
        )
        view.addGestureRecognizer(pan)
        return view
    }

    func updateUIView(_ uiView: SCNView, context: Context) {
        context.coordinator.rebuildPlate(appearance: appearance, shape: shape, mode: mode)
    }

    final class Coordinator: NSObject {
        var spinNode: SCNNode?
        private var contentNode: SCNNode?
        private var currentKey: String?

        /// Per-finger tip sizes (width, length), thumb → pinky, like a press-on set.
        private static let fingerSpecs: [(w: Float, l: Float)] = [
            (1.06, 0.88), (0.88, 1.0), (0.94, 1.06), (0.86, 1.0), (0.70, 0.84),
        ]

        func rebuildPlate(appearance: NailAppearance, shape: NailShape, mode: StageMode) {
            let key = "\(appearance.id)/\(shape.rawValue)/\(mode.rawValue)"
            guard key != currentKey, let spinNode else { return }
            currentKey = key

            contentNode?.removeFromParentNode()
            let node: SCNNode
            switch mode {
            case .single:
                node = SCNNode(geometry: Self.makePlate(appearance: appearance, shape: shape))
            case .set:
                node = Self.makeTipSet(appearance: appearance, shape: shape)
            }
            spinNode.addChildNode(node)
            contentNode = node
        }

        private static func makePlate(appearance: NailAppearance, shape: NailShape) -> SCNGeometry {
            let geometry = NailGeometry.makeGeometry(shape: shape)
            geometry.materials = [makeMaterial(appearance: appearance)]
            return geometry
        }

        /// Five tips fanned in a shallow arc, middle finger front and tallest —
        /// the way a press-on set is presented.
        private static func makeTipSet(appearance: NailAppearance, shape: NailShape) -> SCNNode {
            let group = SCNNode()
            for (index, spec) in fingerSpecs.enumerated() {
                let fi = Float(index) - 2
                let node = SCNNode(geometry: makePlate(appearance: appearance, shape: shape))
                node.scale = SCNVector3(spec.w, spec.l, spec.w)
                node.position = SCNVector3(fi * 1.52, -0.16 * fi * fi, -0.03 * abs(fi))
                node.eulerAngles.z = -fi * 0.055
                group.addChildNode(node)
            }
            group.scale = SCNVector3(0.44, 0.44, 0.44)
            return group
        }

        private static func makeMaterial(appearance: NailAppearance) -> SCNMaterial {
            let material = SCNMaterial()
            material.lightingModel = .physicallyBased
            material.diffuse.contents = appearance.texture
            material.metalness.contents = 0.0
            material.isDoubleSided = true
            switch appearance.finish {
            case .gloss:
                material.roughness.contents = 0.34
                material.clearCoat.contents = 1.0
                material.clearCoatRoughness.contents = 0.08
            case .matte:
                material.roughness.contents = 0.78
                material.clearCoat.contents = 0.12
                material.clearCoatRoughness.contents = 0.6
            }
            return material
        }

        @objc func handlePan(_ gesture: UIPanGestureRecognizer) {
            guard let spinNode, let view = gesture.view else { return }
            switch gesture.state {
            case .began:
                spinNode.removeAllActions()
            case .changed:
                let delta = gesture.translation(in: view)
                gesture.setTranslation(.zero, in: view)
                spinNode.eulerAngles.y += Float(delta.x) * 0.011
                let tiltedX = spinNode.eulerAngles.x + Float(delta.y) * 0.008
                spinNode.eulerAngles.x = min(0.5, max(-0.5, tiltedX))
            case .ended:
                let velocity = gesture.velocity(in: view)
                let spin = SCNAction.rotateBy(
                    x: 0,
                    y: CGFloat(velocity.x) * 0.0011,
                    z: 0,
                    duration: 0.9
                )
                spin.timingMode = .easeOut
                spinNode.runAction(spin)
            default:
                break
            }
        }
    }
}

/// A generated "studio softbox" environment map: dark room, bright strip lights.
/// This is what the clear coat reflects, giving the gel its liquid highlight.
private enum StudioEnvironment {
    static let image: UIImage = {
        let size = CGSize(width: 256, height: 128)
        return UIGraphicsImageRenderer(size: size).image { ctx in
            let cg = ctx.cgContext
            cg.setFillColor(UIColor(white: 0.05, alpha: 1).cgColor)
            cg.fill(CGRect(origin: .zero, size: size))

            func softbox(_ rect: CGRect, brightness: CGFloat) {
                let colors = [
                    UIColor(white: brightness, alpha: 1).cgColor,
                    UIColor(white: brightness, alpha: 0).cgColor,
                ] as CFArray
                guard let gradient = CGGradient(
                    colorsSpace: CGColorSpaceCreateDeviceRGB(),
                    colors: colors,
                    locations: [0, 1]
                ) else { return }
                cg.saveGState()
                cg.clip(to: rect)
                cg.drawRadialGradient(
                    gradient,
                    startCenter: CGPoint(x: rect.midX, y: rect.midY),
                    startRadius: 0,
                    endCenter: CGPoint(x: rect.midX, y: rect.midY),
                    endRadius: max(rect.width, rect.height) / 2,
                    options: []
                )
                cg.restoreGState()
            }

            softbox(CGRect(x: 30, y: 8, width: 90, height: 34), brightness: 1.0)
            softbox(CGRect(x: 150, y: 30, width: 70, height: 26), brightness: 0.75)
            softbox(CGRect(x: 70, y: 84, width: 120, height: 22), brightness: 0.4)
        }
    }()
}
