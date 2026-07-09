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
    case cloud
    case cascade
    case circle
    case line

    var id: String { rawValue }

    var label: String {
        switch self {
        case .arc: return "アーチ"
        case .curve: return "カーブ"
        case .cloud: return "ふわり"
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

/// Lets SwiftUI ask the running stage for a transparent snapshot ("stamp").
final class StageController {
    weak var scnView: SCNView?
    weak var coordinator: NailSceneView.Coordinator?

    /// Renders the stage exactly as posed, without backdrop or particles,
    /// trimmed to the nails' bounding box — ready to paste anywhere.
    /// Pass `tipIndex` to capture just that one nail from the set.
    func makeStamp(tipIndex: Int? = nil) -> UIImage? {
        guard let view = scnView else { return nil }
        coordinator?.setParticlesHidden(true)
        if let tipIndex {
            coordinator?.setTipsHidden(except: tipIndex)
        }
        defer {
            coordinator?.setParticlesHidden(false)
            coordinator?.setTipsHidden(except: nil)
        }
        return view.snapshot().trimmedTransparency(padding: 24)
    }
}

struct NailSceneView: UIViewRepresentable {
    var appearance: NailAppearance
    var shape: NailShape
    var mode: StageMode
    var plateParams: NailPlateParams = .default
    /// When present, the five-piece set uses these per finger (cycled if fewer).
    var setAppearances: [NailAppearance]? = nil
    /// Per-nail shapes for the set (falls back to `shape`).
    var setShapes: [NailShape]? = nil
    var layout: SetLayout = .arc
    var motion: AutoMotion = .off
    var theme: StageTheme = .glass
    /// Set-mode interactions: long-press copies a tip, tap pastes onto one.
    var onTipLongPress: ((Int) -> Void)? = nil
    var onTipTap: ((Int) -> Void)? = nil
    /// Long-press that didn't land on a specific tip (single mode / empty space).
    var onStageLongPress: (() -> Void)? = nil
    var controller: StageController? = nil
    /// Fresh token plays the "new jewel drops into the box" arrival animation.
    var arrivalID: String? = nil

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> SCNView {
        let view = SCNView()
        view.backgroundColor = .clear
        view.isOpaque = false
        view.antialiasingMode = .multisampling4X
        view.preferredFramesPerSecond = 60

        let scene = SCNScene()
        scene.background.contents = UIColor.clear
        scene.lightingEnvironment.intensity = 1.6
        view.scene = scene
        context.coordinator.scene = scene
        context.coordinator.applyTheme(theme)

        let camera = SCNCamera()
        camera.fieldOfView = 30
        camera.wantsDepthOfField = false
        let cameraNode = SCNNode()
        cameraNode.camera = camera
        cameraNode.position = SCNVector3(0, 0, 9.2)
        scene.rootNode.addChildNode(cameraNode)
        context.coordinator.cameraNode = cameraNode

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
        context.coordinator.restOrientation = spinNode.orientation
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
        context.coordinator.rebuildPlate(appearance: appearance, setAppearances: setAppearances, setShapes: setShapes, shape: shape, params: plateParams, mode: mode, layout: layout, arrivalID: arrivalID)
        context.coordinator.updateMotion(motion, stageMode: mode)

        let pan = UIPanGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handlePan(_:))
        )
        view.addGestureRecognizer(pan)

        let pinch = UIPinchGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handlePinch(_:))
        )
        view.addGestureRecognizer(pinch)

        let doubleTap = UITapGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handleDoubleTap(_:))
        )
        doubleTap.numberOfTapsRequired = 2
        view.addGestureRecognizer(doubleTap)

        let singleTap = UITapGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handleTap(_:))
        )
        singleTap.require(toFail: doubleTap)
        view.addGestureRecognizer(singleTap)

        let longPress = UILongPressGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handleLongPress(_:))
        )
        view.addGestureRecognizer(longPress)

        context.coordinator.onTipLongPress = onTipLongPress
        context.coordinator.onTipTap = onTipTap
        context.coordinator.onStageLongPress = onStageLongPress
        controller?.scnView = view
        controller?.coordinator = context.coordinator
        return view
    }

    func updateUIView(_ uiView: SCNView, context: Context) {
        context.coordinator.rebuildPlate(appearance: appearance, setAppearances: setAppearances, setShapes: setShapes, shape: shape, params: plateParams, mode: mode, layout: layout, arrivalID: arrivalID)
        context.coordinator.updateMotion(motion, stageMode: mode)
        context.coordinator.applyTheme(theme)
        context.coordinator.onTipLongPress = onTipLongPress
        context.coordinator.onTipTap = onTipTap
        context.coordinator.onStageLongPress = onStageLongPress
        controller?.scnView = uiView
        controller?.coordinator = context.coordinator
    }

    final class Coordinator: NSObject {
        var onTipLongPress: ((Int) -> Void)?
        var onTipTap: ((Int) -> Void)?
        var onStageLongPress: (() -> Void)?
        var spinNode: SCNNode?
        var lightRig: SCNNode?
        var orbitNode: SCNNode?
        var orbitArm: SCNNode?
        var cameraNode: SCNNode?
        weak var scene: SCNScene?
        var restOrientation = SCNQuaternion(0, 0, 0, 1)
        private var particleNode: SCNNode?
        private var currentTheme: StageTheme?
        private var cameraAnchorZ: Float = 9.2

        func setParticlesHidden(_ hidden: Bool) {
            particleNode?.isHidden = hidden
        }

        /// Hides every named tip except one (nil shows all) for per-nail stamps.
        func setTipsHidden(except index: Int?) {
            guard let contentNode else { return }
            for child in contentNode.childNodes {
                guard let name = child.name, name.hasPrefix("tip-") else { continue }
                if let index {
                    child.isHidden = name != "tip-\(index)"
                } else {
                    child.isHidden = false
                }
            }
        }

        func applyTheme(_ theme: StageTheme) {
            guard theme != currentTheme, let scene else { return }
            currentTheme = theme
            scene.lightingEnvironment.contents = StageEnvironment.image(for: theme)
            particleNode?.removeFromParentNode()
            particleNode = nil
            if let system = StageEnvironment.particles(for: theme) {
                let node = SCNNode()
                node.position = SCNVector3(0, 0, -2.4)
                node.addParticleSystem(system)
                scene.rootNode.addChildNode(node)
                particleNode = node
            }
        }
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
        static let fingerSpecs: [(w: Float, l: Float)] = [
            (1.06, 0.88), (0.88, 1.0), (0.94, 1.06), (0.86, 1.0), (0.70, 0.84),
        ]

        private var lastArrivalID: String?

        func rebuildPlate(appearance: NailAppearance, setAppearances: [NailAppearance]?, setShapes: [NailShape]?, shape: NailShape, params: NailPlateParams, mode: StageMode, layout: SetLayout, arrivalID: String?) {
            let setKey = setAppearances?.map(\.id).joined(separator: "+") ?? ""
            let shapeKey = setShapes?.map(\.rawValue).joined(separator: "+") ?? shape.rawValue
            let key = "\(appearance.id)/\(setKey)/\(shapeKey)/\(mode.rawValue)/\(layout.rawValue)/\(params.key)"
            guard key != currentKey, let spinNode else { return }
            currentKey = key

            contentNode?.removeFromParentNode()
            let node: SCNNode
            switch mode {
            case .single:
                node = SCNNode(geometry: Self.makePlate(appearance: appearance, shape: shape, params: params))
            case .set:
                node = Self.makeTipSet(appearances: setAppearances ?? [appearance], shapes: setShapes, shape: shape, params: params, layout: layout)
            }
            spinNode.addChildNode(node)
            contentNode = node

            if let arrivalID, arrivalID != lastArrivalID {
                lastArrivalID = arrivalID
                playArrival(in: node)
            }
        }

        /// The newest jewel drops in from above and springs into place.
        private func playArrival(in container: SCNNode) {
            let target = container.childNode(withName: "tip-0", recursively: true) ?? container
            let finalScale = target.scale
            let finalY = target.position.y
            target.scale = SCNVector3(finalScale.x * 0.01, finalScale.y * 0.01, finalScale.z * 0.01)
            target.position.y = finalY + 2.6
            target.opacity = 0
            DispatchQueue.main.async {
                SCNTransaction.begin()
                SCNTransaction.animationDuration = 0.7
                SCNTransaction.animationTimingFunction = CAMediaTimingFunction(controlPoints: 0.2, 1.25, 0.4, 1)
                target.scale = finalScale
                target.position.y = finalY
                target.opacity = 1
                SCNTransaction.commit()
            }
        }

        static func makePlate(appearance: NailAppearance, shape: NailShape, params: NailPlateParams = .default) -> SCNGeometry {
            let geometry = NailGeometry.makeGeometry(shape: shape, params: params)
            geometry.materials = [makeMaterial(appearance: appearance)]
            return geometry
        }

        /// Five tips fanned in a shallow arc, middle finger front and tallest —
        /// the way a press-on set is presented.
        static func makeTipSet(appearances: [NailAppearance], shapes: [NailShape]? = nil, shape: NailShape, params: NailPlateParams = .default, layout: SetLayout) -> SCNNode {
            let group = SCNNode()
            let count = layout == .cloud ? max(1, min(appearances.count, 5)) : fingerSpecs.count
            for index in 0..<count {
                let spec = fingerSpecs[index % fingerSpecs.count]
                let fi = Float(index) - 2
                let appearance = appearances[index % appearances.count]
                let tipShape: NailShape = {
                    guard let shapes, !shapes.isEmpty else { return shape }
                    return shapes[index % shapes.count]
                }()
                let node = SCNNode(geometry: makePlate(appearance: appearance, shape: tipShape, params: params))
                node.name = "tip-\(index)"
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
                case .cloud:
                    // Scattered drift, newest front and center — the jewelry box.
                    let slots: [(x: Float, y: Float, z: Float, r: Float)] = [
                        (0, 0.05, 0.35, -0.05),
                        (-1.5, 1.05, -0.45, 0.13),
                        (1.45, 0.95, -0.3, -0.15),
                        (-1.35, -1.15, -0.25, 0.1),
                        (1.35, -1.05, -0.5, -0.09),
                    ]
                    let slot = slots[index % slots.count]
                    node.position = SCNVector3(slot.x, slot.y, slot.z)
                    node.eulerAngles.z = slot.r
                    node.eulerAngles.y = fi * 0.1
                }
                group.addChildNode(node)
            }
            let groupScale: Float = layout == .circle ? 0.4 : layout == .cloud ? 0.52 : 0.44
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

        static func makeMaterial(appearance: NailAppearance) -> SCNMaterial {
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

        private var lastAxis = SCNVector3(0, 1, 0)

        @objc func handlePan(_ gesture: UIPanGestureRecognizer) {
            guard let spinNode, let view = gesture.view else { return }
            switch gesture.state {
            case .began:
                spinNode.removeAllActions()
            case .changed:
                let delta = gesture.translation(in: view)
                gesture.setTranslation(.zero, in: view)
                applyTrackball(dx: Float(delta.x), dy: Float(delta.y))
            case .ended:
                if currentMotion == .turntable {
                    startTurntable()
                    return
                }
                let velocity = gesture.velocity(in: view)
                let speed = sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
                guard speed > 60 else { return }
                let spin = SCNAction.rotate(
                    by: CGFloat(speed) * 0.001,
                    around: lastAxis,
                    duration: 0.9
                )
                spin.timingMode = .easeOut
                spinNode.runAction(spin)
            default:
                break
            }
        }

        /// Free trackball rotation: the drag direction rotates the model about
        /// the perpendicular screen axis, so diagonal drags tumble diagonally.
        private func applyTrackball(dx: Float, dy: Float) {
            guard let spinNode else { return }
            let angle = sqrt(dx * dx + dy * dy) * 0.009
            guard angle > 0.0001 else { return }
            let length = sqrt(dx * dx + dy * dy)
            let axis = SCNVector3(dy / length, dx / length, 0)
            lastAxis = axis
            let half = angle / 2
            let rotation = SCNQuaternion(
                axis.x * sin(half),
                axis.y * sin(half),
                axis.z * sin(half),
                cos(half)
            )
            spinNode.orientation = Self.multiply(rotation, spinNode.orientation)
        }

        private static func multiply(_ l: SCNQuaternion, _ r: SCNQuaternion) -> SCNQuaternion {
            SCNQuaternion(
                l.w * r.x + l.x * r.w + l.y * r.z - l.z * r.y,
                l.w * r.y - l.x * r.z + l.y * r.w + l.z * r.x,
                l.w * r.z + l.x * r.y - l.y * r.x + l.z * r.w,
                l.w * r.w - l.x * r.x - l.y * r.y - l.z * r.z
            )
        }

        @objc func handlePinch(_ gesture: UIPinchGestureRecognizer) {
            guard let cameraNode else { return }
            switch gesture.state {
            case .began:
                cameraAnchorZ = cameraNode.position.z
            case .changed:
                let z = cameraAnchorZ / Float(gesture.scale)
                cameraNode.position.z = min(14, max(4.5, z))
            default:
                break
            }
        }

        @objc func handleTap(_ gesture: UITapGestureRecognizer) {
            guard let view = gesture.view as? SCNView else { return }
            if let index = tipIndex(at: gesture.location(in: view), in: view) {
                onTipTap?(index)
            }
        }

        @objc func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
            guard gesture.state == .began, let view = gesture.view as? SCNView else { return }
            if let index = tipIndex(at: gesture.location(in: view), in: view) {
                onTipLongPress?(index)
            } else {
                onStageLongPress?()
            }
        }

        private func tipIndex(at point: CGPoint, in view: SCNView) -> Int? {
            let hits = view.hitTest(
                point,
                options: [SCNHitTestOption.searchMode: SCNHitTestSearchMode.all.rawValue]
            )
            for hit in hits {
                var node: SCNNode? = hit.node
                while let current = node {
                    if let name = current.name, name.hasPrefix("tip-"),
                       let index = Int(name.dropFirst(4)) {
                        return index
                    }
                    node = current.parent
                }
            }
            return nil
        }

        /// Double tap: spring everything home — pose and zoom.
        @objc func handleDoubleTap(_ gesture: UITapGestureRecognizer) {
            guard let spinNode else { return }
            spinNode.removeAllActions()
            SCNTransaction.begin()
            SCNTransaction.animationDuration = 0.5
            SCNTransaction.animationTimingFunction = CAMediaTimingFunction(name: .easeOut)
            spinNode.orientation = restOrientation
            cameraNode?.position.z = 9.2
            SCNTransaction.commit()
            if currentMotion == .turntable { startTurntable() }
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
