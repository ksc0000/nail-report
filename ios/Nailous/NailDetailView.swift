import SwiftData
import SwiftUI
import UniformTypeIdentifiers

/// The jewel view: one saved nail (or sample) on the spinnable stage, with its
/// story underneath. Records can be deleted here.
struct NailDetailView: View {
    let appearance: NailAppearance
    let title: String
    let subtitle: String?
    var record: NailRecord?

    @State private var shape: NailShape
    @State private var plateParams: NailPlateParams
    @State private var finish: NailFinish
    @State private var showTuneSheet = false
    @State private var showStageSheet = false
    @State private var mode: StageMode = .single
    @State private var layout: SetLayout = .arc
    @State private var motion: AutoMotion = .off
    @State private var theme: StageTheme = .glass
    @State private var stampSource: Int?
    @State private var stageController = StageController()
    @State private var stampImage: UIImage?
    @State private var showStampSheet = false
    @State private var showCopiedToast = false
    @State private var stir: StirEvent?
    @AppStorage("stageDecor") private var decorRaw = StageDecor.sparkle.rawValue
    @AppStorage("stageLiquid") private var liquidOn = true
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @State private var confirmingDelete = false

    init(appearance: NailAppearance, title: String, subtitle: String?, record: NailRecord? = nil) {
        self.appearance = appearance
        self.title = title
        self.subtitle = subtitle
        self.record = record
        _shape = State(initialValue: record?.shape ?? .squoval)
        _plateParams = State(initialValue: record?.plateParams ?? .default)
        _finish = State(initialValue: record?.finish ?? appearance.finish)
        // A whole-hand capture opens as the five-piece set by default.
        _mode = State(initialValue: (record?.setAppearances?.count ?? 0) > 1 ? .set : .single)
    }

    /// The hero appearance with the live-edited finish applied.
    private var liveAppearance: NailAppearance {
        NailAppearance(id: appearance.id, texture: appearance.texture, finish: finish)
    }

    /// Set-mode appearances rebuilt with the live finish (nil for single).
    private var liveSetAppearances: [NailAppearance]? {
        guard let base = record?.setAppearances else { return nil }
        return base.map { NailAppearance(id: $0.id, texture: $0.texture, finish: finish) }
    }

    /// Marks this design as the one on the user's nails right now. Only one
    /// record wears at a time; marking schedules the (single) refit reminder.
    private var wearPill: some View {
        let days = record?.wearDays
        return StagePill(
            label: days.map { "装着中 ・ \($0)日目" } ?? "装着中にする",
            isOn: days != nil
        ) {
            toggleWearing()
        }
    }

    private func toggleWearing() {
        guard let record else { return }
        if record.wornSince != nil {
            record.wornSince = nil
            RefitReminder.cancel()
        } else {
            let all = (try? modelContext.fetch(FetchDescriptor<NailRecord>())) ?? []
            for other in all where other.wornSince != nil {
                other.wornSince = nil
            }
            record.wornSince = Date()
            RefitReminder.schedule(designTitle: record.title)
        }
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    /// Stage controls (mode / motion / theme / layout), tucked away so the
    /// viewing screen stays quiet.
    private var stageSheet: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "ステージ")
                .padding(.top, 18)
            HStack(spacing: 8) {
                ForEach(StageMode.allCases) { candidate in
                    StagePill(label: candidate.label, isOn: mode == candidate) {
                        mode = candidate
                    }
                }
                StagePill(label: motion.label, isOn: motion != .off) {
                    motion = motion.next
                }
            }
            .padding(.horizontal, 24)

            SectionHeader(title: "テーマ")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(StageTheme.allCases) { candidate in
                        themeThumb(candidate)
                    }
                }
                .padding(.horizontal, 24)
            }

            if mode == .set {
                SectionHeader(title: "ならび")
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(SetLayout.allCases) { candidate in
                            StagePill(label: candidate.label, isOn: layout == candidate) {
                                layout = candidate
                            }
                        }
                    }
                    .padding(.horizontal, 24)
                }
            }

            SectionHeader(title: "装飾")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(StageDecor.allCases) { candidate in
                        StagePill(label: candidate.label, isOn: decorRaw == candidate.rawValue) {
                            decorRaw = candidate.rawValue
                        }
                    }
                    StagePill(label: liquidOn ? "水面 オン" : "水面 オフ", isOn: liquidOn) {
                        liquidOn.toggle()
                    }
                }
                .padding(.horizontal, 24)
            }
            Spacer(minLength: 0)
        }
    }

    /// Reshape a jewel after the fact: shape chips + tip-tuning sliders, live
    /// on the stage behind the sheet, written straight back to the record.
    private var tuneSheet: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "形（シェイプ）")
                .padding(.top, 18)
            HStack(spacing: 8) {
                ForEach(NailShape.allCases) { candidate in
                    tuneShapeChip(candidate)
                }
            }
            .padding(.horizontal, 24)

            SectionHeader(title: "チップ調整")
            VStack(spacing: 6) {
                GoldSlider(label: "長さ", value: $plateParams.length)
                GoldSlider(label: "幅", value: $plateParams.width)
                GoldSlider(label: "カーブ 横", value: $plateParams.curveH)
                GoldSlider(label: "カーブ 縦", value: $plateParams.curveV)
                GoldSlider(label: "厚み", value: $plateParams.thickness)
                GoldSlider(label: "角の丸み", value: $plateParams.corner)
            }
            .padding(.horizontal, 24)

            SectionHeader(title: "仕上げ")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(NailFinish.allCases) { candidate in
                        StagePill(label: candidate.label, isOn: finish == candidate) {
                            finish = candidate
                        }
                    }
                }
                .padding(.horizontal, 24)
            }

            if record != nil {
                Text("変更はこの記録にそのまま保存されます")
                    .font(.system(size: 11))
                    .foregroundStyle(.white.opacity(0.45))
                    .frame(maxWidth: .infinity)
            }
            Spacer(minLength: 0)
        }
        .onChange(of: shape) { persistTuning() }
        .onChange(of: plateParams) { persistTuning() }
        .onChange(of: finish) { persistTuning() }
    }

    private func tuneShapeChip(_ candidate: NailShape) -> some View {
        let isOn = shape == candidate
        return Button {
            shape = candidate
        } label: {
            VStack(spacing: 6) {
                NailSilhouette(nailShape: candidate)
                    .fill(isOn ? AnyShapeStyle(Palette.goldGradient) : AnyShapeStyle(Color.white.opacity(0.16)))
                    .frame(width: 22, height: 36)
                    .overlay(
                        NailSilhouette(nailShape: candidate)
                            .stroke(isOn ? Palette.goldBright : .white.opacity(0.25), lineWidth: 1)
                    )
                Text(candidate.label)
                    .font(.system(size: 10, weight: isOn ? .semibold : .regular))
                    .foregroundStyle(isOn ? Palette.goldBright : .white.opacity(0.6))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isOn ? Palette.gold.opacity(0.1) : Color.white.opacity(0.04))
            )
        }
    }

    private func persistTuning() {
        guard let record else { return }
        record.shapeRaw = shape.rawValue
        record.finishRaw = finish.rawValue
        record.lengthAdj = plateParams.length
        record.widthAdj = plateParams.width
        record.curveHAdj = plateParams.curveH
        record.curveVAdj = plateParams.curveV
        record.thicknessAdj = plateParams.thickness
        record.cornerAdj = plateParams.corner
    }

    /// Theme picker as a little backdrop swatch with a label — matches the
    /// mockup's テーマ thumbnails; gold ring when selected.
    private func themeThumb(_ candidate: StageTheme) -> some View {
        let isOn = theme == candidate
        return Button {
            theme = candidate
        } label: {
            VStack(spacing: 5) {
                ZStack {
                    if let img = candidate.backdropImage {
                        Image(uiImage: img).resizable().scaledToFill()
                    } else {
                        LinearGradient(colors: candidate.gradientColors, startPoint: .top, endPoint: .bottom)
                    }
                }
                .frame(width: 58, height: 44)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(isOn ? Palette.goldBright : .white.opacity(0.15), lineWidth: isOn ? 2 : 1)
                )
                Text(candidate.label)
                    .font(.system(size: 10.5, weight: isOn ? .semibold : .regular))
                    .foregroundStyle(isOn ? Palette.goldBright : .white.opacity(0.6))
            }
        }
    }

    private func copyToClipboard(_ image: UIImage?) {
        guard let png = image?.pngData() else { return }
        UIPasteboard.general.setData(png, forPasteboardType: UTType.png.identifier)
        withAnimation(.easeOut(duration: 0.25)) { showCopiedToast = true }
        Task {
            try? await Task.sleep(for: .seconds(2.6))
            withAnimation(.easeIn(duration: 0.4)) { showCopiedToast = false }
        }
    }

    var body: some View {
        ZStack {
            StageBackground(theme: theme, stir: stir)

            VStack(spacing: 0) {
                VStack(spacing: 4) {
                    Text("NAILOUS")
                        .font(.system(size: 12, weight: .semibold))
                        .kerning(4)
                        .foregroundStyle(.white.opacity(0.5))
                    Text(title)
                        .font(.system(size: 23, weight: .medium, design: .serif))
                        .foregroundStyle(.white)
                    if let subtitle {
                        Text(subtitle)
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.5))
                    }
                }
                .padding(.top, 6)

                NailSceneView(
                    appearance: liveAppearance,
                    shape: shape,
                    mode: mode,
                    plateParams: plateParams,
                    onPanStir: { point in
                        stir = StirEvent(point: point, time: Date())
                    },
                    setAppearances: liveSetAppearances,
                    layout: layout,
                    motion: motion,
                    theme: theme,
                    onTipLongPress: { index in
                        // One gesture, two uses: the nail goes straight onto the
                        // system clipboard (paste in Instagram etc.), and stays
                        // armed for in-app apply via a tap on another tip.
                        copyToClipboard(stageController.makeStamp(tipIndex: index))
                        if mode == .set, record?.setAppearances != nil {
                            stampSource = index
                        }
                        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                    },
                    onTipTap: { index in
                        guard let source = stampSource else { return }
                        defer { stampSource = nil }
                        guard let record,
                              record.fingerPhotoData.indices.contains(source),
                              record.fingerPhotoData.indices.contains(index),
                              source != index else { return }
                        record.fingerPhotoData[index] = record.fingerPhotoData[source]
                        UINotificationFeedbackGenerator().notificationOccurred(.success)
                    },
                    onStageLongPress: {
                        copyToClipboard(stageController.makeStamp())
                        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                    },
                    controller: stageController
                )
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .offset(y: (showTuneSheet || showStageSheet) ? -132 : 0)
                .animation(.easeInOut(duration: 0.3), value: showTuneSheet || showStageSheet)
                .overlay(alignment: .bottom) {
                    if showCopiedToast {
                        Label("コピーしました — 他のアプリでそのまま貼り付けできます", systemImage: "checkmark.circle.fill")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 9)
                            .background(
                                Capsule()
                                    .fill(Color.black.opacity(0.72))
                                    .overlay(Capsule().stroke(Palette.gold.opacity(0.55), lineWidth: 1))
                            )
                            .padding(.bottom, 8)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }
                }
                .overlay(alignment: .top) {
                    if stampSource != nil {
                        HStack(spacing: 10) {
                            Text("コピーしました：爪をタップで適用・他アプリでペースト可")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundStyle(.white)
                            Button("解除") { stampSource = nil }
                                .font(.system(size: 12.5, weight: .semibold))
                                .foregroundStyle(Palette.goldBright)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(
                            Capsule()
                                .fill(Color.black.opacity(0.72))
                                .overlay(Capsule().stroke(Palette.gold.opacity(0.55), lineWidth: 1))
                        )
                        .padding(.top, 6)
                    }
                }

                Text(mode == .set ? "ドラッグで回転・爪を長押しでコピー" : "ドラッグで回転・長押しでコピー")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.45))
                    .padding(.bottom, 12)

                if let record, !record.tags.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(record.tags, id: \.self) { tag in
                                Text("#\(tag)")
                                    .font(.system(size: 11.5, weight: .medium))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(Capsule().fill(Palette.gold.opacity(0.16)))
                                    .foregroundStyle(Palette.goldBright.opacity(0.9))
                            }
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 10)
                }

                if let record, !record.salon.isEmpty || record.priceYen != nil || !record.memo.isEmpty {
                    VStack(spacing: 6) {
                        HStack(spacing: 8) {
                            if !record.salon.isEmpty {
                                Label(record.salon, systemImage: "scissors")
                            }
                            if let price = record.priceYen {
                                Label("¥\(price.formatted())", systemImage: "yensign.circle")
                            }
                        }
                        .font(.system(size: 12.5))
                        .foregroundStyle(.white.opacity(0.65))

                        if !record.memo.isEmpty {
                            Text(record.memo)
                                .font(.system(size: 12.5))
                                .foregroundStyle(.white.opacity(0.55))
                                .multilineTextAlignment(.center)
                                .lineLimit(4)
                                .padding(.horizontal, 32)
                        }
                    }
                    .padding(.bottom, 14)
                }

                HStack(spacing: 8) {
                    if record != nil {
                        wearPill
                    }
                    StagePill(label: "ステージ", isOn: showStageSheet) {
                        showStageSheet = true
                    }
                    StagePill(label: "調整", isOn: showTuneSheet) {
                        showTuneSheet = true
                    }
                }
                .padding(.bottom, record == nil ? 28 : 16)

                if record != nil {
                    Button(role: .destructive) {
                        confirmingDelete = true
                    } label: {
                        Text("この記録を削除")
                            .font(.system(size: 13))
                            .foregroundStyle(.red.opacity(0.85))
                    }
                    .padding(.bottom, 24)
                }
            }

            StageForeground(theme: theme)
        }
        .toolbarColorScheme(.dark, for: .navigationBar)
        .toolbar {
            if let record {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        record.isFavorite.toggle()
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    } label: {
                        Image(systemName: record.isFavorite ? "heart.fill" : "heart")
                            .foregroundStyle(record.isFavorite ? Palette.goldBright : .white)
                    }
                }
            }
            ToolbarItem(placement: .primaryAction) {
                Button {
                    if let stamp = stageController.makeStamp() {
                        stampImage = stamp
                        showStampSheet = true
                        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    }
                } label: {
                    Label("スタンプ", systemImage: "square.and.arrow.up")
                        .foregroundStyle(.white)
                }
            }
        }
        .sheet(isPresented: $showStageSheet) {
            ScrollView { stageSheet }
                .presentationDetents([.height(400), .height(560)])
                .presentationBackgroundInteraction(.enabled(upThrough: .height(560)))
                .presentationDragIndicator(.visible)
                .presentationBackground(Color(red: 0.09, green: 0.06, blue: 0.1).opacity(0.97))
                .preferredColorScheme(.dark)
        }
        .sheet(isPresented: $showTuneSheet) {
            ScrollView { tuneSheet }
                .presentationDetents([.height(400), .height(600)])
                .presentationBackgroundInteraction(.enabled(upThrough: .height(600)))
                .presentationDragIndicator(.visible)
                .presentationBackground(Color(red: 0.09, green: 0.06, blue: 0.1).opacity(0.97))
                .preferredColorScheme(.dark)
        }
        .sheet(isPresented: $showStampSheet) {
            if let stampImage {
                StampSheet(
                    image: stampImage,
                    makeVideo: { [liveAppearance, liveSetAppearances, shape, plateParams, mode, layout, theme] motion in
                        try await StampVideoExporter.export(
                            appearance: liveAppearance,
                            setAppearances: liveSetAppearances,
                            shape: shape,
                            params: plateParams,
                            mode: mode,
                            layout: layout,
                            theme: theme,
                            motion: motion
                        )
                    },
                    makeGIF: { [liveAppearance, liveSetAppearances, shape, plateParams, mode, layout, theme] motion in
                        try await StampVideoExporter.exportGIF(
                            appearance: liveAppearance,
                            setAppearances: liveSetAppearances,
                            shape: shape,
                            params: plateParams,
                            mode: mode,
                            layout: layout,
                            theme: theme,
                            motion: motion
                        )
                    },
                    makeCard: { template in
                        CardRenderer.render(
                            template: template,
                            stamp: stampImage,
                            title: title,
                            date: record?.createdAt ?? Date(),
                            subtitle: record.flatMap { $0.salon.isEmpty ? nil : $0.salon }
                        )
                    }
                )
                .presentationDetents([.height(620), .large])
            }
        }
        .confirmationDialog("この記録を削除しますか？", isPresented: $confirmingDelete, titleVisibility: .visible) {
            Button("削除する", role: .destructive) {
                if let record {
                    modelContext.delete(record)
                }
                dismiss()
            }
        }
        .onAppear {
            if let dbg = UserDefaults.standard.string(forKey: "debugStageTheme"),
               let t = StageTheme(rawValue: dbg) {
                theme = t
            }
        }
    }
}

/// A drag on the stage that the backdrop answers with a ripple.
struct StirEvent: Equatable {
    var point: CGPoint // normalized 0-1
    var time: Date
}

/// Shared dark stage backdrop. With 水面 on, the backdrop becomes living
/// water: a slow ambient sway plus ripples that follow the finger while the
/// nail is being spun.
struct StageBackground: View {
    var theme: StageTheme = .glass
    var stir: StirEvent? = nil
    @AppStorage("stageLiquid") private var liquidOn = true

    private func stirAmplitude(now: Date) -> Float {
        guard let stir else { return 0 }
        let age = now.timeIntervalSince(stir.time)
        return Float(max(0, 1 - age / 1.4)) * 16
    }

    var body: some View {
        Group {
            if let backdrop = theme.backdropImage {
                // AI-generated backdrop (bg_<theme>.png in the bundle), dimmed
                // and vignetted so the nail stays the hero.
                GeometryReader { proxy in
                    Group {
                        if liquidOn {
                            TimelineView(.animation(minimumInterval: 1.0 / 30.0)) { timeline in
                                let t = timeline.date.timeIntervalSinceReferenceDate
                                backdropImage(backdrop, size: proxy.size)
                                    .distortionEffect(
                                        ShaderLibrary.waterSway(
                                            .float(Float(t.truncatingRemainder(dividingBy: 100_000))),
                                            .float2(proxy.size),
                                            .float(2.5 * theme.swayAmplitude),
                                            .float2(CGPoint(
                                                x: (stir?.point.x ?? 0.5) * proxy.size.width,
                                                y: (stir?.point.y ?? 0.5) * proxy.size.height
                                            )),
                                            .float(stirAmplitude(now: timeline.date))
                                        ),
                                        maxSampleOffset: CGSize(width: 26, height: 26)
                                    )
                            }
                        } else {
                            backdropImage(backdrop, size: proxy.size)
                        }
                    }
                    .overlay(Color.black.opacity(0.3))
                    .overlay(
                        RadialGradient(
                            colors: [.clear, .black.opacity(0.55)],
                            center: .center,
                            startRadius: 120,
                            endRadius: 520
                        )
                    )
                }
            } else {
                RadialGradient(
                    colors: theme.gradientColors,
                    center: .center,
                    startRadius: 40,
                    endRadius: 480
                )
            }
        }
        .ignoresSafeArea()
    }

    private func backdropImage(_ backdrop: UIImage, size: CGSize) -> some View {
        Image(uiImage: backdrop)
            .resizable()
            .scaledToFill()
            .frame(width: size.width, height: size.height)
            .clipped()
    }
}

/// Shared capsule toggle — selected reads as champagne gold.
struct StagePill: View {
    let label: String
    let isOn: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 12.5, weight: .medium))
                .lineLimit(1)
                .fixedSize()
                .padding(.horizontal, 13)
                .padding(.vertical, 7)
                .background(
                    Capsule().fill(
                        isOn ? AnyShapeStyle(Palette.goldGradient) : AnyShapeStyle(Color.white.opacity(0.08))
                    )
                )
                .foregroundStyle(isOn ? Palette.ink0 : .white.opacity(0.75))
        }
    }
}
