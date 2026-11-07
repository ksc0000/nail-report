import PhotosUI
import SwiftUI

/// First prototype of photo try-on (#431): the user picks one of their own
/// hand photos, drops nail-shaped translucent colour overlays on it by hand,
/// and switches colours to compare.
///
/// Deliberately *not* a segmentation or AR feature: nothing detects where the
/// nails are, nothing tracks them, and the overlay is a flat tinted silhouette
/// the user positions themselves. It is a manual mock-up for feel and colour
/// comparison only.
///
/// Nothing leaves the device and nothing is kept: the picked photo lives in
/// view state for the lifetime of the sheet, no `NailRecord` is created or
/// touched, and closing the sheet discards photo and overlays together.
struct PhotoTryOnView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var pickerItem: PhotosPickerItem?
    @State private var photo: UIImage?
    @State private var isLoadingPhoto = false
    /// Guards against a slow earlier pick landing after a newer one (#403).
    @State private var loadGeneration = 0

    @State private var nails: [TryOnNail] = []
    @State private var selectedID: TryOnNail.ID?
    @State private var paletteIndex = 0

    // Gesture anchors, per overlay: the value the gesture started from.
    @State private var dragAnchors: [TryOnNail.ID: CGPoint] = [:]
    @State private var sizeAnchors: [TryOnNail.ID: CGFloat] = [:]
    @State private var rotationAnchors: [TryOnNail.ID: Angle] = [:]

    var body: some View {
        NavigationStack {
            ZStack {
                Palette.paper.ignoresSafeArea()

                if let photo {
                    VStack(spacing: 0) {
                        stage(for: photo)
                        controls
                    }
                } else {
                    emptyState
                }
            }
            .navigationTitle("試着（プロトタイプ）")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    // Cancel always works, at every step: it drops the photo
                    // and every overlay without saving anything.
                    Button("閉じる") { cancel() }
                        .foregroundStyle(Palette.inkWarm)
                }
            }
        }
        .tint(Palette.inkWarm)
        .environment(\.colorScheme, .light)
        .onChange(of: pickerItem) { _, newItem in
            guard let newItem else { return }
            loadGeneration += 1
            let generation = loadGeneration
            isLoadingPhoto = true
            Task {
                let loaded = try? await newItem.loadTransferable(type: Data.self)
                guard generation == loadGeneration else { return }
                isLoadingPhoto = false
                guard let loaded, let image = UIImage(data: loaded) else { return }
                // A new photo invalidates every placement made on the old one.
                photo = image
                nails = []
                selectedID = nil
            }
        }
    }

    // MARK: - Empty state

    private var emptyState: some View {
        VStack(spacing: 14) {
            NailSilhouette(nailShape: .almond)
                .stroke(Palette.goldHairline, lineWidth: 1.2)
                .frame(width: 24, height: 50)
                .padding(.bottom, 6)
                .accessibilityHidden(true)
            Text("手の写真で色を試す")
                .font(.system(size: 17, weight: .medium, design: .serif))
                .foregroundStyle(Palette.inkWarm)
            Text("自分の手の写真を選んで、爪の形の色見本を指先に重ねます。\n位置と大きさは手で合わせる試作版です。写真も重ねた色も保存されません。")
                .font(.system(size: 13, weight: .light))
                .multilineTextAlignment(.center)
                .foregroundStyle(Palette.mutedWarm)
                .lineSpacing(3)
            PhotosPicker(selection: $pickerItem, matching: .images) {
                Text(isLoadingPhoto ? "読み込み中…" : "写真を選ぶ")
                    .font(.system(size: 13))
                    .kerning(2)
                    .foregroundStyle(Palette.inkWarm)
                    .padding(.horizontal, 28)
                    .padding(.vertical, 13)
                    .overlay(Capsule().stroke(Palette.inkWarm, lineWidth: 1))
            }
            .disabled(isLoadingPhoto)
            .padding(.top, 6)
        }
        .padding(.horizontal, 28)
    }

    // MARK: - Stage

    /// The photo, aspect-fitted, with the overlays placed on top of it.
    ///
    /// Overlay coordinates are unit coordinates *inside the fitted photo rect*,
    /// so they stay on the same spot on the hand when the stage resizes
    /// (rotation, Dynamic Type, a taller control strip).
    private func stage(for image: UIImage) -> some View {
        GeometryReader { proxy in
            // `UIImage.size` is already the visual (orientation-applied) size,
            // and `Image(uiImage:)` draws with the same orientation, so the
            // fit below is correct for camera photos that carry an EXIF
            // orientation without having to redraw them upright.
            let rect = TryOnLayout.fittedRect(image: image.size, in: proxy.size)

            ZStack(alignment: .topLeading) {
                Color.black.opacity(0.04)

                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(width: rect.width, height: rect.height)
                    .position(x: rect.midX, y: rect.midY)
                    .accessibilityLabel("選んだ手の写真")

                ForEach($nails) { $nail in
                    overlay(for: $nail, in: rect)
                }
            }
            .contentShape(Rectangle())
            .onTapGesture { selectedID = nil }
        }
        .frame(maxHeight: .infinity)
    }

    private func overlay(for nail: Binding<TryOnNail>, in rect: CGRect) -> some View {
        let value = nail.wrappedValue
        let isSelected = value.id == selectedID
        let height = max(8, rect.height * value.heightFraction)
        let width = height * NailGeometry.plateAspect(for: value.shape)
        let silhouette = NailSilhouette(nailShape: value.shape)

        return silhouette
            .fill(TryOnPalette.entry(value.colorIndex).color.opacity(value.opacity))
            .overlay(
                // A single soft highlight so the patch reads as polish rather
                // than as a flat sticker. Still just a drawing, not lighting.
                LinearGradient(
                    colors: [.white.opacity(0.35 * value.opacity), .clear],
                    startPoint: .topLeading,
                    endPoint: .center
                )
                .clipShape(silhouette)
            )
            .overlay(
                silhouette.stroke(
                    isSelected ? Palette.goldHairline : .white.opacity(0.35),
                    lineWidth: isSelected ? 1.6 : 0.8
                )
            )
            .frame(width: width, height: height)
            .rotationEffect(value.rotation)
            // Grabbable even when drawn small: the hit area is a centred box
            // with a 40pt minimum. Overlays dragged on top of each other can
            // therefore overlap in touch terms — the topmost (most recently
            // added) one wins, which is the usual expectation.
            .frame(width: max(width, 40), height: max(height, 40))
            .contentShape(Rectangle())
            .position(TryOnLayout.point(for: value.center, in: rect))
            .gesture(dragGesture(for: nail, in: rect))
            .simultaneousGesture(magnifyGesture(for: nail))
            .simultaneousGesture(rotateGesture(for: nail))
            .onTapGesture { selectedID = value.id }
            .accessibilityLabel("\(TryOnPalette.entry(value.colorIndex).label)の爪")
            .accessibilityHint("ドラッグで位置、ピンチで大きさ、回転で角度を調整します")
    }

    // MARK: - Gestures

    /// Drag moves the overlay. The anchor is captured on the first change so
    /// the drag is relative to where the overlay was, not to the touch point,
    /// and the centre is clamped into the photo rect so an overlay can never
    /// be flicked off-screen and lost.
    private func dragGesture(for nail: Binding<TryOnNail>, in rect: CGRect) -> some Gesture {
        DragGesture()
            .onChanged { gesture in
                let id = nail.wrappedValue.id
                selectedID = id
                let anchor = dragAnchors[id] ?? nail.wrappedValue.center
                dragAnchors[id] = anchor
                guard rect.width > 0, rect.height > 0 else { return }
                nail.wrappedValue.center = TryOnLayout.clampUnit(
                    CGPoint(
                        x: anchor.x + gesture.translation.width / rect.width,
                        y: anchor.y + gesture.translation.height / rect.height
                    )
                )
            }
            .onEnded { _ in dragAnchors[nail.wrappedValue.id] = nil }
    }

    private func magnifyGesture(for nail: Binding<TryOnNail>) -> some Gesture {
        MagnificationGesture()
            .onChanged { scale in
                let id = nail.wrappedValue.id
                selectedID = id
                let anchor = sizeAnchors[id] ?? nail.wrappedValue.heightFraction
                sizeAnchors[id] = anchor
                nail.wrappedValue.heightFraction = TryOnNail.clampedHeight(anchor * scale)
            }
            .onEnded { _ in sizeAnchors[nail.wrappedValue.id] = nil }
    }

    private func rotateGesture(for nail: Binding<TryOnNail>) -> some Gesture {
        RotationGesture()
            .onChanged { angle in
                let id = nail.wrappedValue.id
                selectedID = id
                let anchor = rotationAnchors[id] ?? nail.wrappedValue.rotation
                rotationAnchors[id] = anchor
                nail.wrappedValue.rotation = Angle(radians: anchor.radians + angle.radians)
            }
            .onEnded { _ in rotationAnchors[nail.wrappedValue.id] = nil }
    }

    // MARK: - Controls

    private var selectedIndex: Int? {
        guard let selectedID else { return nil }
        return nails.firstIndex { $0.id == selectedID }
    }

    private var controls: some View {
        VStack(spacing: 12) {
            Text(
                nails.isEmpty
                    ? "「爪を追加」で色見本を置き、ドラッグとピンチで指先に合わせます"
                    : selectedIndex == nil
                        ? "爪をタップすると、色・形・濃さを変えられます"
                        : "ドラッグで移動、ピンチで大きさ、2本指の回転で角度"
            )
            .font(.system(size: 12))
            .multilineTextAlignment(.center)
            .foregroundStyle(Palette.mutedWarm)

            swatchRow

            if let index = selectedIndex {
                shapeRow(for: index)
                opacityRow(for: index)
            }

            HStack(spacing: 8) {
                Button { addNail() } label: {
                    pill(title: "爪を追加", icon: "plus", filled: true)
                }
                if let index = selectedIndex {
                    Button { removeNail(at: index) } label: {
                        pill(title: "削除", icon: "trash")
                    }
                }
                if !nails.isEmpty {
                    Button { clearNails() } label: {
                        pill(title: "全部消す", icon: "arrow.counterclockwise")
                    }
                }
                PhotosPicker(selection: $pickerItem, matching: .images) {
                    pill(title: "写真を変更", icon: "photo")
                }
            }

            Text("試作版です。爪の自動認識やリアルタイム表示は行いません。写真と調整内容は保存されません。")
                .font(.system(size: 10.5))
                .multilineTextAlignment(.center)
                .foregroundStyle(Palette.mutedWarm.opacity(0.8))
        }
        .padding(.horizontal, 20)
        .padding(.top, 14)
        .padding(.bottom, 20)
        .background(Palette.paper)
    }

    /// Colour switching: with a nail selected it recolours that nail, otherwise
    /// it sets the colour the next added nail starts with.
    private var swatchRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(Array(TryOnPalette.colors.enumerated()), id: \.offset) { index, entry in
                    let isOn = (selectedIndex.map { nails[$0].colorIndex } ?? paletteIndex) == index
                    Button {
                        paletteIndex = index
                        if let selected = selectedIndex { nails[selected].colorIndex = index }
                    } label: {
                        Circle()
                            .fill(entry.color)
                            .frame(width: 28, height: 28)
                            .overlay(
                                Circle().stroke(
                                    isOn ? Palette.inkWarm : Palette.mutedWarm.opacity(0.3),
                                    lineWidth: isOn ? 2 : 0.8
                                )
                            )
                            .frame(width: 44, height: 44)
                            .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(entry.label)
                    .accessibilityAddTraits(isOn ? [.isSelected] : [])
                }
            }
            .padding(.horizontal, 4)
        }
    }

    private func shapeRow(for index: Int) -> some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(NailShape.allCases) { candidate in
                    let isOn = nails[index].shape == candidate
                    Button { nails[index].shape = candidate } label: {
                        Text(candidate.label)
                            .font(.system(size: 11.5, weight: .medium))
                            .padding(.horizontal, 11)
                            .padding(.vertical, 6)
                            .background(
                                Capsule().fill(isOn ? Palette.inkWarm : Palette.mutedWarm.opacity(0.12))
                            )
                            .foregroundStyle(isOn ? Palette.paper : Palette.inkWarm)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 4)
        }
    }

    private func opacityRow(for index: Int) -> some View {
        HStack(spacing: 10) {
            Text("濃さ")
                .font(.system(size: 11.5))
                .foregroundStyle(Palette.mutedWarm)
            Slider(value: $nails[index].opacity, in: 0.2...0.9)
                .accessibilityLabel("色の濃さ")
        }
    }

    private func pill(title: String, icon: String, filled: Bool = false) -> some View {
        HStack(spacing: 5) {
            Image(systemName: icon).font(.system(size: 11))
            Text(title).font(.system(size: 12, weight: .medium))
        }
        .padding(.horizontal, 13)
        .padding(.vertical, 9)
        .background(Capsule().fill(filled ? Palette.inkWarm : Palette.mutedWarm.opacity(0.12)))
        .foregroundStyle(filled ? Palette.paper : Palette.inkWarm)
    }

    // MARK: - Actions

    /// New overlays land in the middle of the photo, where the user can see
    /// them straight away, then get dragged onto a fingertip.
    private func addNail() {
        let nail = TryOnNail(
            center: TryOnLayout.clampUnit(CGPoint(x: 0.5, y: 0.45 + 0.04 * CGFloat(nails.count % 3))),
            colorIndex: paletteIndex
        )
        nails.append(nail)
        selectedID = nail.id
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    private func removeNail(at index: Int) {
        let removed = nails.remove(at: index)
        dragAnchors[removed.id] = nil
        sizeAnchors[removed.id] = nil
        rotationAnchors[removed.id] = nil
        selectedID = nil
    }

    private func clearNails() {
        nails = []
        selectedID = nil
        dragAnchors = [:]
        sizeAnchors = [:]
        rotationAnchors = [:]
    }

    private func cancel() {
        clearNails()
        photo = nil
        pickerItem = nil
        loadGeneration += 1
        isLoadingPhoto = false
        dismiss()
    }
}

// MARK: - Model

/// One hand-placed colour patch. Position and size are relative to the fitted
/// photo rect so they survive any stage resize; nothing here is persisted.
struct TryOnNail: Identifiable {
    let id = UUID()
    /// Unit coordinates inside the fitted photo rect (0…1, origin top-left).
    var center: CGPoint
    /// Overlay height as a fraction of the fitted photo height.
    var heightFraction: CGFloat = 0.1
    var rotation: Angle = .zero
    var shape: NailShape = .oval
    var colorIndex: Int
    var opacity: Double = 0.62

    /// Small enough to sit on a fingertip in a whole-hand shot, large enough
    /// to stay grabbable in a close-up.
    static func clampedHeight(_ proposed: CGFloat) -> CGFloat {
        min(0.6, max(0.03, proposed))
    }
}

/// The prototype's fixed swatch set — a short, recognisable row rather than a
/// full colour picker, since the point is comparing a few colours quickly.
enum TryOnPalette {
    struct Entry {
        let label: String
        let color: Color
    }

    static let colors: [Entry] = [
        Entry(label: "ローズ", color: Palette.rose),
        Entry(label: "レッド", color: Color(red: 0.72, green: 0.16, blue: 0.22)),
        Entry(label: "ベージュ", color: Color(red: 0.84, green: 0.72, blue: 0.62)),
        Entry(label: "ミルキー", color: Color(red: 0.95, green: 0.93, blue: 0.94)),
        Entry(label: "テラコッタ", color: Color(red: 0.75, green: 0.42, blue: 0.33)),
        Entry(label: "モーブ", color: Color(red: 0.55, green: 0.42, blue: 0.55)),
        Entry(label: "ネイビー", color: Color(red: 0.16, green: 0.21, blue: 0.38)),
        Entry(label: "グリーン", color: Color(red: 0.33, green: 0.45, blue: 0.38)),
        Entry(label: "ゴールド", color: Palette.gold),
    ]

    /// Index-safe lookup so a stale index can never trap.
    static func entry(_ index: Int) -> Entry {
        colors.indices.contains(index) ? colors[index] : colors[0]
    }
}

// MARK: - Layout math

enum TryOnLayout {
    /// The rect a `scaledToFit` image of `image` size occupies inside
    /// `container`, centred. Degenerate inputs give an empty rect rather than
    /// a NaN frame.
    static func fittedRect(image: CGSize, in container: CGSize) -> CGRect {
        guard image.width > 0, image.height > 0,
              container.width > 0, container.height > 0 else {
            return CGRect(origin: .zero, size: .zero)
        }
        let scale = min(container.width / image.width, container.height / image.height)
        let size = CGSize(width: image.width * scale, height: image.height * scale)
        return CGRect(
            x: (container.width - size.width) / 2,
            y: (container.height - size.height) / 2,
            width: size.width,
            height: size.height
        )
    }

    /// Unit coordinates → a point in the stage's coordinate space.
    static func point(for unit: CGPoint, in rect: CGRect) -> CGPoint {
        CGPoint(x: rect.minX + unit.x * rect.width, y: rect.minY + unit.y * rect.height)
    }

    static func clampUnit(_ point: CGPoint) -> CGPoint {
        CGPoint(x: min(1, max(0, point.x)), y: min(1, max(0, point.y)))
    }
}
