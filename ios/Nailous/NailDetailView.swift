import PhotosUI
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
    @State private var editTitle: String
    @State private var editTagsText: String
    @State private var editSalon: String
    @State private var editPriceText: String
    @State private var editMemo: String
    @State private var showTuneSheet = false
    @State private var showStageSheet = false
    @State private var showEditSheet = false
    @State private var mode: StageMode = .single
    @State private var layout: SetLayout = .arc
    @State private var motion: AutoMotion = .off
    @State private var theme: StageTheme = .paper
    @State private var stampSource: Int?
    @State private var stageController = StageController()
    @State private var stampImage: UIImage?
    @State private var showStampSheet = false
    @State private var showOriginalPhoto = false
    @State private var showCopiedToast = false
    @State private var stir: StirEvent?
    @AppStorage("stageDecor") private var decorRaw = StageDecor.sparkle.rawValue
    @AppStorage("stageLiquid") private var liquidOn = true
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var deletionUndo: DeletionUndoStore
    @Environment(\.dismiss) private var dismiss
    @State private var confirmingDelete = false

    // Re-scan: replace this record's design from a new photo or the camera,
    // keeping title, tags, tuning and the wear timer.
    @State private var rescanPickerShown = false
    @State private var rescanPickerItem: PhotosPickerItem?
    @State private var rescanCameraShown = false
    @State private var rescanSource: RescanSource?
    @State private var rescanTexture: UIImage?
    @State private var isRescanning = false
    @State private var rescanAnglePhotos: [UIImage?] = Array(repeating: nil, count: AngleStep.allCases.count)
    @State private var viewingAnglePhoto: ViewingPhoto?

    init(appearance: NailAppearance, title: String, subtitle: String?, record: NailRecord? = nil) {
        self.appearance = appearance
        self.title = title
        self.subtitle = subtitle
        self.record = record
        _shape = State(initialValue: record?.shape ?? .squoval)
        _plateParams = State(initialValue: record?.plateParams ?? .default)
        _finish = State(initialValue: record?.finish ?? appearance.finish)
        _editTitle = State(initialValue: record?.title ?? title)
        _editTagsText = State(initialValue: record?.tags.joined(separator: ", ") ?? "")
        _editSalon = State(initialValue: record?.salon ?? "")
        _editPriceText = State(initialValue: record?.priceYen.map(String.init) ?? "")
        _editMemo = State(initialValue: record?.memo ?? "")
        // A whole-hand capture opens as the five-piece set by default.
        _mode = State(initialValue: (record?.setAppearances?.count ?? 0) > 1 ? .set : .single)
    }

    private var photoUnavailable: Bool {
        record.map { $0.texture == nil } ?? false
    }

    private var isLight: Bool { theme.isLight }
    private var ink: Color { isLight ? Palette.inkWarm : .white }
    private var muted: Color { isLight ? Palette.mutedWarm : .white.opacity(0.5) }
    private var sheetBackground: Color {
        isLight ? Palette.paper : Color(red: 0.09, green: 0.06, blue: 0.1).opacity(0.97)
    }

    /// The hero appearance with the live-edited finish applied (and the
    /// re-scanned texture once one has been taken this visit).
    private var liveAppearance: NailAppearance {
        if let rescanTexture {
            return NailAppearance(id: "rescan-\(rescanTexture.hashValue)", texture: rescanTexture, finish: finish)
        }
        return NailAppearance(id: appearance.id, texture: appearance.texture, finish: finish)
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

    /// Everything that used to sit on the screen as its own control lives
    /// here, so the stage is only the nail, its name, and how long it's worn.
    private var moreMenu: some View {
        Menu {
            if let record {
                Button {
                    record.isFavorite.toggle()
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                } label: {
                    Label(record.isFavorite ? "お気に入りを解除" : "お気に入りに追加",
                          systemImage: record.isFavorite ? "heart.fill" : "heart")
                }
                Button { showEditSheet = true } label: {
                    Label("記録を編集", systemImage: "pencil")
                }
            }
            if !photoUnavailable {
                Button { showTuneSheet = true } label: {
                    Label("形を調整", systemImage: "slider.horizontal.3")
                }
                Button { showStageSheet = true } label: {
                    Label("ステージ演出", systemImage: "sparkles")
                }
            }
            if record?.originalPhoto != nil {
                Button { showOriginalPhoto = true } label: {
                    Label("元の写真を見る", systemImage: "photo")
                }
            }
            if record != nil {
                Divider()
                Button { rescanPickerShown = true } label: {
                    Label("写真から再スキャン", systemImage: "photo.on.rectangle.angled")
                }
                Button { rescanCameraShown = true } label: {
                    Label("カメラで再スキャン", systemImage: "camera")
                }
                Divider()
                Button(role: .destructive) { confirmingDelete = true } label: {
                    Label("この記録を削除", systemImage: "trash")
                }
            }
        } label: {
            Image(systemName: "ellipsis")
                .font(.system(size: 14, weight: .regular))
                .foregroundStyle(ink)
                .frame(width: 36, height: 36)
                .overlay(Circle().stroke(ink.opacity(isLight ? 1 : 0.6), lineWidth: 1))
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("その他")
    }

    /// One line of the story worth seeing without opening anything: where
    /// and how much. Tags and memo wait in the edit sheet.
    private var storyLine: String? {
        guard let record else { return nil }
        var parts: [String] = []
        if !record.salon.isEmpty { parts.append(record.salon) }
        if let price = record.priceYen { parts.append("¥\(price.formatted())") }
        return parts.isEmpty ? nil : parts.joined(separator: " ・ ")
    }

    /// This record's 立体スキャン reference photos, if any were captured.
    private var anglePhotos: [(step: AngleStep, image: UIImage)] {
        record?.anglePhotos ?? []
    }

    /// Thumbnails for each captured angle, tappable into the same full-size
    /// viewer as the original photo.
    private var anglePhotosStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(anglePhotos, id: \.step.rawValue) { entry in
                    Button { viewingAnglePhoto = ViewingPhoto(image: entry.image, label: entry.step.label) } label: {
                        VStack(spacing: 4) {
                            Image(uiImage: entry.image)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 52, height: 52)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(ink.opacity(isLight ? 0.2 : 0.3), lineWidth: 1)
                                )
                            Text(entry.step.label)
                                .font(.system(size: 10))
                                .foregroundStyle(muted)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 24)
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

            if !theme.isLight {
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
                    .foregroundStyle(muted)
                    .frame(maxWidth: .infinity)
            }
            Spacer(minLength: 0)
        }
        .onChange(of: shape) { persistTuning() }
        .onChange(of: plateParams) { persistTuning() }
        .onChange(of: finish) { persistTuning() }
    }

    /// Edit the story fields set at save time — title, tags, salon, price,
    /// memo — so a rushed save doesn't lock those in forever.
    private var editSheet: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "記録を編集")
                .padding(.top, 18)
            VStack(spacing: 10) {
                StoryField(prompt: "タイトル", text: $editTitle)
                StoryField(prompt: "タグ（カンマ区切り。例: ピンク, マグネット）", text: $editTagsText)
                StoryField(prompt: "サロン名（任意）", text: $editSalon)
                StoryField(prompt: "価格（任意・円）", text: $editPriceText)
                    .keyboardType(.numberPad)
                StoryField(prompt: "メモ（任意）", text: $editMemo, axis: .vertical)
            }
            .padding(.horizontal, 24)

            Text("変更はこの記録にそのまま保存されます")
                .font(.system(size: 11))
                .foregroundStyle(muted)
                .frame(maxWidth: .infinity)
            Spacer(minLength: 0)
        }
        .onChange(of: editTitle) { persistStory() }
        .onChange(of: editTagsText) { persistStory() }
        .onChange(of: editSalon) { persistStory() }
        .onChange(of: editPriceText) { persistStory() }
        .onChange(of: editMemo) { persistStory() }
    }

    /// Same on-device cleanup as a fresh capture, then the record's design
    /// (and its keepsake original) are replaced in place.
    private func applyRescan(_ textures: [UIImage], original: UIImage) {
        guard let record else { return }
        isRescanning = true
        let anglePhotos = rescanAnglePhotos
        Task.detached(priority: .userInitiated) {
            let cleaned = textures.map { NailCleanup.process($0) }
            let jpegs = cleaned.compactMap { $0.jpegData(compressionQuality: 0.85) }
            let archival = AddNailView.archivalJPEG(original)
            let angleData = AddNailView.archivalAngleData(anglePhotos)
            await MainActor.run {
                if let first = jpegs.first {
                    record.photoData = first
                    record.fingerPhotoData = jpegs.count > 1 ? jpegs : []
                    record.originalPhotoData = archival
                    record.anglePhotoData = angleData
                    record.shapeRaw = shape.rawValue
                    try? modelContext.save()
                    rescanTexture = cleaned.first
                    mode = jpegs.count > 1 ? .set : .single
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                }
                isRescanning = false
                rescanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
            }
        }
    }

    private func persistStory() {
        guard let record else { return }
        let trimmedTitle = editTitle.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedTitle.isEmpty {
            record.title = trimmedTitle
        }
        record.salon = editSalon.trimmingCharacters(in: .whitespacesAndNewlines)
        record.priceYen = Int(editPriceText.trimmingCharacters(in: .whitespaces))
        record.memo = editMemo.trimmingCharacters(in: .whitespacesAndNewlines)
        record.tags = editTagsText
            .split(whereSeparator: { $0 == "," || $0 == "、" })
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
        // Explicit save: autosave alone can lose an edit if the app is
        // killed moments after typing, which defeats the point of this sheet.
        try? modelContext.save()
    }

    private func tuneShapeChip(_ candidate: NailShape) -> some View {
        let isOn = shape == candidate
        return Button {
            shape = candidate
        } label: {
            VStack(spacing: 6) {
                NailSilhouette(nailShape: candidate)
                    .fill(
                        isOn
                            ? (isLight ? AnyShapeStyle(Palette.inkWarm) : AnyShapeStyle(Palette.goldGradient))
                            : AnyShapeStyle(isLight ? Palette.inkWarm.opacity(0.08) : Color.white.opacity(0.16))
                    )
                    .frame(width: 22, height: 36)
                    .overlay(
                        NailSilhouette(nailShape: candidate)
                            .stroke(
                                isOn
                                    ? (isLight ? Palette.goldHairline : Palette.goldBright)
                                    : (isLight ? Palette.inkWarm.opacity(0.25) : .white.opacity(0.25)),
                                lineWidth: 1
                            )
                    )
                Text(candidate.label)
                    .font(.system(size: 10, weight: isOn ? .semibold : .regular))
                    .foregroundStyle(isOn ? (isLight ? Palette.inkWarm : Palette.goldBright) : muted)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(
                        isOn
                            ? (isLight ? Palette.inkWarm.opacity(0.06) : Palette.gold.opacity(0.1))
                            : (isLight ? Color.clear : Color.white.opacity(0.04))
                    )
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
                        .stroke(
                            isOn
                                ? (isLight ? Palette.inkWarm : Palette.goldBright)
                                : (isLight ? Palette.inkWarm.opacity(0.2) : .white.opacity(0.15)),
                            lineWidth: isOn ? 2 : 1
                        )
                )
                Text(candidate.label)
                    .font(.system(size: 10.5, weight: isOn ? .semibold : .regular))
                    .foregroundStyle(isOn ? (isLight ? Palette.inkWarm : Palette.goldBright) : muted)
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
                VStack(spacing: 5) {
                    Text(record?.title ?? title)
                        .font(.system(size: 22, weight: .regular, design: .serif))
                        .foregroundStyle(ink)
                    if let subtitle {
                        Text(subtitle)
                            .font(.system(size: 12))
                            .kerning(1)
                            .foregroundStyle(muted)
                    }
                    if let storyLine {
                        Text(storyLine)
                            .font(.system(size: 12))
                            .foregroundStyle(muted)
                    }
                }
                .padding(.top, 10)
                .padding(.horizontal, 32)

                if photoUnavailable {
                    ContentUnavailableView("写真を読み込めません", systemImage: "photo.badge.exclamationmark",
                                           description: Text("記録の編集や削除は引き続き行えます"))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
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
                    .background {
                        // Paper stage: a soft contact shadow grounds the nail
                        // where there is no velvet or glass to sit in.
                        if isLight {
                            Ellipse()
                                .fill(Palette.inkWarm.opacity(0.13))
                                .frame(width: 150, height: 34)
                                .blur(radius: 12)
                                .offset(y: 165)
                        }
                    }
                    .offset(y: (showTuneSheet || showStageSheet) ? -132 : 0)
                    .animation(.easeInOut(duration: 0.3), value: showTuneSheet || showStageSheet)
                    .overlay(alignment: .bottom) {
                        if showCopiedToast {
                            Label("コピーしました — 他のアプリでそのまま貼り付けできます", systemImage: "checkmark.circle.fill")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundStyle(Palette.paper)
                                .padding(.horizontal, 14)
                                .padding(.vertical, 9)
                                .background(Capsule().fill(Palette.inkWarm.opacity(0.94)))
                                .padding(.bottom, 8)
                                .transition(.opacity.combined(with: .move(edge: .bottom)))
                        }
                    }
                    .overlay(alignment: .top) {
                        if stampSource != nil {
                            HStack(spacing: 10) {
                                Text("コピーしました：爪をタップで適用・他アプリでペースト可")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundStyle(Palette.paper)
                                Button("解除") { stampSource = nil }
                                    .font(.system(size: 12.5, weight: .semibold))
                                    .foregroundStyle(Palette.goldHairline)
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Capsule().fill(Palette.inkWarm.opacity(0.94)))
                            .padding(.top, 6)
                        }
                    }

                    // Always present, in small type: the owner asked for a
                    // standing guide, not a one-time tip (it used to vanish
                    // after the first spin, so nobody saw the double-tap).
                    Text(mode == .set
                         ? "ドラッグで回転 ・ ダブルタップで正面へ ・ 爪を長押しでコピー"
                         : "ドラッグで回転 ・ ダブルタップで正面へ ・ 長押しでコピー")
                        .font(.system(size: 10.5))
                        .kerning(0.8)
                        .foregroundStyle(muted.opacity(0.85))
                        .padding(.bottom, anglePhotos.isEmpty ? 12 : 8)

                    if !anglePhotos.isEmpty {
                        anglePhotosStrip
                            .padding(.bottom, 12)
                    }
                }

                HStack(spacing: 12) {
                    if record != nil {
                        wearPill
                    }
                    moreMenu
                }
                .padding(.bottom, 22)
            }

            StageForeground(theme: theme)
        }
        .toolbarColorScheme(isLight ? .light : .dark, for: .navigationBar)
        .tint(ink)
        .environment(\.stageIsLight, isLight)
        .toolbar {
            if !photoUnavailable {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        if let stamp = stageController.makeStamp() {
                            stampImage = stamp
                            showStampSheet = true
                            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                        }
                    } label: {
                        Label("共有", systemImage: "square.and.arrow.up")
                            .foregroundStyle(ink)
                    }
                }
            }
        }
        .photosPicker(isPresented: $rescanPickerShown, selection: $rescanPickerItem, matching: .images)
        .onChange(of: rescanPickerItem) { _, item in
            guard let item else { return }
            Task {
                if let data = try? await item.loadTransferable(type: Data.self),
                   let image = UIImage(data: data) {
                    rescanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                    rescanSource = RescanSource(image: image, single: false, initialZoom: 1)
                }
                rescanPickerItem = nil
            }
        }
        .fullScreenCover(isPresented: $rescanCameraShown) {
            NailCameraView(
                nailShape: $shape,
                onCapture: { image, captureMode in
                    rescanCameraShown = false
                    rescanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                    rescanSource = RescanSource(
                        image: image,
                        single: captureMode == .single,
                        initialZoom: captureMode == .single ? NailCameraView.singleMargin : 1
                    )
                },
                onCaptureScan: { top, photos in
                    rescanCameraShown = false
                    rescanAnglePhotos = photos
                    rescanSource = RescanSource(image: top, single: true, initialZoom: NailCameraView.singleMargin)
                },
                onCancel: { rescanCameraShown = false }
            )
            .ignoresSafeArea()
        }
        .fullScreenCover(item: $rescanSource) { source in
            PhotoCropView(
                image: source.image,
                nailShape: $shape,
                forceSingle: source.single,
                initialZoom: source.initialZoom,
                onConfirm: { baked in
                    rescanSource = nil
                    applyRescan([baked], original: source.image)
                },
                onConfirmSet: { bakedList in
                    rescanSource = nil
                    applyRescan(bakedList, original: source.image)
                },
                onCancel: { rescanSource = nil }
            )
        }
        .overlay {
            if isRescanning {
                HStack(spacing: 8) {
                    ProgressView().tint(isLight ? Palette.paper : .white)
                    Text("仕上げ処理中…")
                        .font(.system(size: 13))
                        .foregroundStyle(isLight ? Palette.paper : .white)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Capsule().fill(isLight ? Palette.inkWarm.opacity(0.92) : Color.black.opacity(0.7)))
            }
        }
        .sheet(isPresented: $showOriginalPhoto) {
            if let original = record?.originalPhoto {
                OriginalPhotoView(image: original, title: title)
            }
        }
        .sheet(item: $viewingAnglePhoto) { photo in
            OriginalPhotoView(image: photo.image, title: "\(title)・\(photo.label)")
        }
        .sheet(isPresented: $showStageSheet) {
            ScrollView { stageSheet }
                .presentationDetents([.height(400), .height(560)])
                .presentationBackgroundInteraction(.enabled(upThrough: .height(560)))
                .presentationDragIndicator(.visible)
                .presentationBackground(sheetBackground)
                .preferredColorScheme(isLight ? .light : .dark)
                .environment(\.stageIsLight, isLight)
        }
        .sheet(isPresented: $showTuneSheet) {
            ScrollView { tuneSheet }
                .presentationDetents([.height(400), .height(600)])
                .presentationBackgroundInteraction(.enabled(upThrough: .height(600)))
                .presentationDragIndicator(.visible)
                .presentationBackground(sheetBackground)
                .preferredColorScheme(isLight ? .light : .dark)
                .environment(\.stageIsLight, isLight)
        }
        .sheet(isPresented: $showEditSheet) {
            ScrollView { editSheet }
                .presentationDetents([.height(460), .height(640)])
                .presentationBackgroundInteraction(.enabled(upThrough: .height(640)))
                .presentationDragIndicator(.visible)
                .presentationBackground(sheetBackground)
                .preferredColorScheme(isLight ? .light : .dark)
                .environment(\.stageIsLight, isLight)
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
                            title: record?.title ?? title,
                            date: record?.createdAt ?? Date(),
                            subtitle: record.flatMap { $0.salon.isEmpty ? nil : $0.salon }
                        )
                    }
                )
                .presentationDetents([.height(620), .large])
            }
        }
        .preferredColorScheme(isLight ? .light : .dark)
        .confirmationDialog("この記録を削除しますか？", isPresented: $confirmingDelete, titleVisibility: .visible) {
            Button("削除する", role: .destructive) {
                if let record {
                    deletionUndo.stage(record)
                    modelContext.delete(record)
                    try? modelContext.save()
                }
                dismiss()
            }
        }
        .onAppear {
            if let dbg = UserDefaults.standard.string(forKey: "debugStageTheme"),
               let t = StageTheme(rawValue: dbg) {
                theme = t
            }
            // `-openEdit 1` (+ optional -editTitle/-editSalon/-editPriceYen/
            // -editMemo/-editTags) opens the edit sheet and applies the given
            // values headlessly, so the edit→persist flow can be verified in
            // the simulator without a touch driver.
            if UserDefaults.standard.string(forKey: "debugRescan") == "1" {
                rescanSource = RescanSource(image: NailStyle.samples[0].texture, single: false, initialZoom: 1)
            }
            if UserDefaults.standard.string(forKey: "openEdit") == "1" {
                if let v = UserDefaults.standard.string(forKey: "editTitle") { editTitle = v }
                if let v = UserDefaults.standard.string(forKey: "editSalon") { editSalon = v }
                if let v = UserDefaults.standard.string(forKey: "editPriceYen") { editPriceText = v }
                if let v = UserDefaults.standard.string(forKey: "editMemo") { editMemo = v }
                if let v = UserDefaults.standard.string(forKey: "editTags") { editTagsText = v }
                persistStory()
                showEditSheet = true
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
    var fontSize: CGFloat = 12.5
    let action: () -> Void
    @Environment(\.stageIsLight) private var isLight

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: fontSize, weight: .medium))
                .lineLimit(1)
                .fixedSize()
                .padding(.horizontal, 13)
                .padding(.vertical, 7)
                .background(pillBackground)
                .foregroundStyle(pillForeground)
        }
    }

    // Dark stage: champagne gold when on. Paper stage: ink when on, a thin
    // ink outline when off — the same vocabulary as the home header.
    private var pillBackground: some View {
        Capsule()
            .fill(
                isOn
                    ? (isLight ? AnyShapeStyle(Palette.inkWarm) : AnyShapeStyle(Palette.goldGradient))
                    : (isLight ? AnyShapeStyle(Color.clear) : AnyShapeStyle(Color.white.opacity(0.08)))
            )
            .overlay(
                Capsule().stroke(
                    isLight && !isOn ? Palette.inkWarm.opacity(0.35) : Color.clear,
                    lineWidth: 1
                )
            )
    }

    private var pillForeground: Color {
        if isLight { return isOn ? Palette.paper : Palette.inkWarm }
        return isOn ? Palette.ink0 : .white.opacity(0.75)
    }
}

/// A photo shared as JPEG, so the receiving app gets a sensibly sized file
/// with the right extension (the stamp's transferable is PNG-only).
struct SharedPhotoJPEG: Transferable {
    let data: Data

    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .jpeg) { $0.data }
    }
}

/// The user's own photo at full size — the thing you actually show a nail
/// artist. Pinch to zoom, and share it straight out to LINE or a message.
struct OriginalPhotoView: View {
    let image: UIImage
    let title: String
    @Environment(\.dismiss) private var dismiss
    @State private var zoom: CGFloat = 1
    @State private var zoomAnchor: CGFloat = 1

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .scaleEffect(zoom)
                    .gesture(
                        MagnificationGesture()
                            .onChanged { value in
                                zoom = min(5, max(1, zoomAnchor * value))
                            }
                            .onEnded { _ in zoomAnchor = zoom }
                    )
                    .onTapGesture(count: 2) {
                        withAnimation(.easeOut(duration: 0.25)) {
                            zoom = zoom > 1 ? 1 : 2.5
                            zoomAnchor = zoom
                        }
                    }
            }
            .navigationTitle("元の写真")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("閉じる") { dismiss() }
                        .foregroundStyle(.white.opacity(0.8))
                }
                ToolbarItem(placement: .primaryAction) {
                    if let jpeg = image.jpegData(compressionQuality: 0.9) {
                        ShareLink(
                            item: SharedPhotoJPEG(data: jpeg),
                            preview: SharePreview(title, image: Image(uiImage: image))
                        ) {
                            Image(systemName: "square.and.arrow.up")
                                .foregroundStyle(.white)
                        }
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

/// A tapped 角度別の写真 thumbnail, opened in the full-size viewer.
private struct ViewingPhoto: Identifiable {
    let id = UUID()
    let image: UIImage
    let label: String
}

private struct RescanSource: Identifiable {
    let id = UUID()
    let image: UIImage
    let single: Bool
    let initialZoom: CGFloat
}
