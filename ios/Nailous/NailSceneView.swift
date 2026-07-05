import CoreMotion
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

/// How the five-piece set is arranged on stage.
enum SetLayout: String, CaseIterable, Identifiable {
    case arc
    case curve
    case cascade
    case circle
    case line

    var id: String { rawValue }

    var label: String {
        switch self {
        case .arc: return "アーチ"
        case .curve: return "カーブ"
        case .cascade: return "カスケード"
        case .circle: return "サークル"
        case .line: return "ライン"
        }
    }
}

/// Idle motion applied to the stage.
enum AutoMotion: String, CaseIterable {
    case off
    case turntable
    case orbit

    var next: AutoMotion {
        switch self {
        case .off: return .turntable
        case .turntable: return .orbit
        case .orbit: return .off
        }
    }

    var label: String {
        switch self {
        case .off: return "▶ 回転"
        case .turntable: return "⟳ ターン中"
        case .orbit: return "◎ 周回中"
        }
    }
}

struct NailSceneView: UIViewRepresentable {
    var appearance: NailAppearance
    var shape: NailShape
    var mode: StageMode
    /// When present, the five-piece set uses these per finger (cycled if fewer).
    var setAppearances: [NailAppearance]? = nil
    var layout: SetLayout = .arc
    var motion: AutoMotion = .off

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

        // Key light sits on a rig so device tilt can sweep the highlight
        // across the gel — the way light moves on a real tip in your hand.
        let lightRig = SCNNode()
        let key = SCNNode()
        key.light = SCNLight()
        key.light?.type = .directional
        key.light?.intensity = 700
        key.eulerAngles = SCNVector3(-0.5, 0.35, 0)
        lightRig.addChildNode(key)
        scene.rootNode.addChildNode(lightRig)
        context.coordinator.lightRig = lightRig
        context.coordinator.startMotionUpdates()

        let ambient = SCNNode()
        ambient.light = SCNLight()
        ambient.light?.type = .ambient
        ambient.light?.intensity = 220
        scene.rootNode.addChildNode(ambient)

        // orbitNode (revolves) → orbitArm (radius offset) → floatNode (bob) →
        // spinNode (user rotation) → nail content
        let orbitNode = SCNNode()
        let orbitArm = SCNNode()
        let floatNode = SCNNode()
        let spinNode = SCNNode()
        // Rest pose: a slight three-quarter view so the C-curve reads as 3D
        // before the first touch.
        spinNode.eulerAngles = SCNVector3(-0.1, 0.42, 0)
        floatNode.addChildNode(spinNode)
        orbitArm.addChildNode(floatNode)
        orbitNode.addChildNode(orbitArm)
        scene.rootNode.addChildNode(orbitNode)
        context.coordinator.orbitNode = orbitNode
        context.coordinator.orbitArm = orbitArm

        let bob = SCNAction.sequence([
            SCNAction.moveBy(x: 0, y: 0.09, z: 0, duration: 1.9),
            SCNAction.moveBy(x: 0, y: -0.09, z: 0, duration: 1.9),
        ])
        bob.timingMode = .easeInEaseOut
        floatNode.runAction(SCNAction.repeatForever(bob))

        context.coordinator.spinNode = spinNode
        context.coordinator.rebuildPlate(appearance: appearance, setAppearances: setAppearances, shape: shape, mode: mode, layout: layout)
        context.coordinator.updateMotion(motion, stageMode: mode)

        let pan = UIPanGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handlePan(_:))
        )
        view.addGestureRecognizer(pan)
        return view
    }

    func updateUIView(_ uiView: SCNView, context: Context) {
        context.coordinator.rebuildPlate(appearance: appearance, setAppearances: setAppearances, shape: shape, mode: mode, layout: layout)
        context.coordinator.updateMotion(motion, stageMode: mode)
    }

    final class Coordinator: NSObject {
        var spinNode: SCNNode?
        var lightRig: SCNNode?
        var orbitNode: SCNNode?
        var orbitArm: SCNNode?
        private var contentNode: SCNNode?
        private var currentKey: String?
        private let motion = CMMotionManager()
        private var referenceAttitude: CMAttitude?

        deinit {
            motion.stopDeviceMotionUpdates()
        }

        /// Tilting the phone sweeps the key light, so the gloss streak moves
        /// like on a real nail tip. No-op where device motion is unavailable
        /// (e.g. the simulator).
        func startMotionUpdates() {
            guard motion.isDeviceMotionAvailable, !motion.isDeviceMotionActive else { return }
            motion.deviceMotionUpdateInterval = 1.0 / 30.0
            motion.startDeviceMotionUpdates(using: .xArbitraryZVertical, to: .main) { [weak self] deviceMotion, _ in
                guard let self, let deviceMotion else { return }
                if self.referenceAttitude == nil {
                    self.referenceAttitude = deviceMotion.attitude.copy() as? CMAttitude
                }
                let attitude = deviceMotion.attitude
                if let reference = self.referenceAttitude {
                    attitude.multiply(byInverseOf: reference)
                }
                let clamp: (Double, Double) -> Float = { value, limit in
                    Float(min(limit, max(-limit, value)))
                }
                self.lightRig?.eulerAngles = SCNVector3(
                    clamp(attitude.pitch, 0.6) * 0.8,
                    clamp(attitude.roll, 0.6) * 0.8,
                    0
                )
            }
        }

        /// Per-finger tip sizes (width, length), thumb → pinky, like a press-on set.
        private static let fingerSpecs: [(w: Float, l: Float)] = [
            (1.06, 0.88), (0.88, 1.0), (0.94, 1.06), (0.86, 1.0), (0.70, 0.84),
        ]

        func rebuildPlate(appearance: NailAppearance, setAppearances: [NailAppearance]?, shape: NailShape, mode: StageMode, layout: SetLayout) {
            let setKey = setAppearances?.map(\.id).joined(separator: "+") ?? ""
            let key = "\(appearance.id)/\(setKey)/\(shape.rawValue)/\(mode.rawValue)/\(layout.rawValue)"
            guard key != currentKey, let spinNode else { return }
            currentKey = key

            contentNode?.removeFromParentNode()
            let node: SCNNode
            switch mode {
            case .single:
                node = SCNNode(geometry: Self.makePlate(appearance: appearance, shape: shape))
            case .set:
                node = Self.makeTipSet(appearances: setAppearances ?? [appearance], shape: shape, layout: layout)
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
        private static func makeTipSet(appearances: [NailAppearance], shape: NailShape, layout: SetLayout) -> SCNNode {
            let group = SCNNode()
            for (index, spec) in fingerSpecs.enumerated() {
                let fi = Float(index) - 2
                let appearance = appearances[index % appearances.count]
                let node = SCNNode(geometry: makePlate(appearance: appearance, shape: shape))
                node.scale = SCNVector3(spec.w, spec.l, spec.w)
                switch layout {
                case .arc:
                    node.position = SCNVector3(fi * 1.52, -0.16 * fi * fi, -0.03 * abs(fi))
                    node.eulerAngles.z = -fi * 0.055
                case .curve:
                    // Nails standing on a circular orbit receding into depth:
                    // centre nail nearest the camera, ends curving away and
                    // turning outward along the ring's tangent.
                    let step: Float = 0.35
                    let radius: Float = 4.7
                    let angle = fi * step
                    node.position = SCNVector3(
                        radius * sin(angle),
                        0,
                        radius * cos(angle) - radius
                    )
                    node.eulerAngles.y = angle
                    node.eulerAngles.z = 0
                case .cascade:
                    node.position = SCNVector3(fi * 1.34, -fi * 0.62, -0.02 * abs(fi))
                    node.eulerAngles.z = -0.1
                case .circle:
                    let angle = Float(index) / 5 * 2 * Float.pi
                    let radius: Float = 1.62
                    node.position = SCNVector3(radius * sin(angle), radius * cos(angle), 0)
                    node.eulerAngles.z = -angle
                case .line:
                    node.position = SCNVector3(fi * 1.5, 0, 0)
                    node.eulerAngles.z = 0
                }
                group.addChildNode(node)
            }
            let groupScale: Float = layout == .circle ? 0.4 : 0.44
            group.scale = SCNVector3(groupScale, groupScale, groupScale)
            return group
        }

        private var currentMotion: AutoMotion = .off

        func updateMotion(_ motion: AutoMotion, stageMode: StageMode) {
            guard motion != currentMotion else { return }
            currentMotion = motion
            spinNode?.removeAction(forKey: "turntable")
            orbitNode?.removeAction(forKey: "orbit")

            switch motion {
            case .off:
                settleOrbit()
            case .turntable:
                settleOrbit()
                startTurntable()
            case .orbit:
                // Swing out to the orbit radius, then revolve around the stage
                // centre — a slow concentric drift past the camera.
                let radius: Float = stageMode == .set ? 0.7 : 1.5
                let out = SCNAction.move(to: SCNVector3(radius, 0, 0), duration: 0.8)
                out.timingMode = .easeInEaseOut
                orbitArm?.runAction(out)
                let revolve = SCNAction.rotateBy(x: 0, y: CGFloat.pi * 2, z: 0, duration: 16)
                orbitNode?.runAction(SCNAction.repeatForever(revolve), forKey: "orbit")
            }
        }

        private func settleOrbit() {
            guard let orbitNode, let orbitArm else { return }
            let home = SCNAction.move(to: SCNVector3Zero, duration: 0.6)
            home.timingMode = .easeInEaseOut
            orbitArm.runAction(home)
            let level = SCNAction.rotateTo(x: 0, y: 0, z: 0, duration: 0.6, usesShortestUnitArc: true)
            level.timingMode = .easeInEaseOut
            orbitNode.runAction(level)
        }

        private func startTurntable() {
            guard let spinNode, spinNode.action(forKey: "turntable") == nil else { return }
            let spin = SCNAction.rotateBy(x: 0, y: CGFloat.pi * 2, z: 0, duration: 10)
            spinNode.runAction(SCNAction.repeatForever(spin), forKey: "turntable")
        }

        private static func makeMaterial(appearance: NailAppearance) -> SCNMaterial {
            let material = SCNMaterial()
            material.lightingModel = .physicallyBased
            material.diffuse.contents = appearance.texture
            material.diffuse.maxAnisotropy = 8
            material.diffuse.mipFilter = .linear
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
                if currentMotion == .turntable {
                    startTurntable()
                    return
                }
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
