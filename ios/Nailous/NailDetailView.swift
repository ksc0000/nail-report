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
    @State private var fingerShapes: [NailShape]?
    @State private var selectedFingerIndex: Int?
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
    @State private var autoFields: Set<AutoScanEstimator.Field> = []
    @State private var estimatedShape: NailShape = .squoval
    @State private var estimatedParams = NailPlateParams()
    @State private var isEstimating = false
    /// Bumped whenever a photo/rescan replaces what the estimator was fed, so
    /// a `Task` from a superseded photo can't land its result on the current
    /// one (#401).
    @State private var estimateGeneration = 0
    @State private var rescanAnglePhotos: [UIImage?] = Array(repeating: nil, count: AngleStep.allCases.count)
    @State private var rescanHand: Hand = Hand.remembered
    @State private var viewingAnglePhoto: ViewingPhoto?

    init(appearance: NailAppearance, title: String, subtitle: String?, record: NailRecord? = nil) {
        self.appearance = appearance
        self.title = title
        self.subtitle = subtitle
        self.record = record
        _shape = State(initialValue: record?.shape ?? .squoval)
        _fingerShapes = State(initialValue: record?.fingerShapes)
        _plateParams = State(initialValue: record?.plateParams ?? .default)
        _finish = State(initialValue: record?.finish ?? appearance.finish)
        _editTitle = State(initialValue: record?.title ?? title)
        _editTagsText = State(initialValue: record?.tags.joined(separator: ", ") ?? "")
        _editSalon = State(initialValue: record?.salon ?? "")
        _editPriceText = State(initialValue: record?.priceYen.map(String.init) ?? "")
        _editMemo = State(initialValue: record?.memo ?? "")
        // A whole-hand capture opens as the five-piece set by default.
        _mode = State(initialValue: (record?.setAppearances?.count ?? 0) > 1 ? .set : .single)
        // Untouched 立体スキャン estimates keep their badge across visits.
        _autoFields = State(initialValue: AutoScanEstimator.decode(record?.autoEstimatedRaw ?? ""))
        _estimatedShape = State(initialValue: record?.shape ?? .squoval)
        _estimatedParams = State(initialValue: record?.plateParams ?? .default)
    }

    /// Fields whose value still equals the estimate (moved = user's now).
    private var liveAutoFields: Set<AutoScanEstimator.Field> {
        autoFields.filter { field in
            switch field {
            case .shape: return shape == estimatedShape
            case .length: return plateParams.length == estimatedParams.length
            case .width: return plateParams.width == estimatedParams.width
            case .curveH: return plateParams.curveH == estimatedParams.curveH
            case .curveV: return plateParams.curveV == estimatedParams.curveV
            case .thickness: return plateParams.thickness == estimatedParams.thickness
            case .corner: return plateParams.corner == estimatedParams.corner
            }
        }
    }

    private func badge(_ field: AutoScanEstimator.Field) -> String? {
        liveAutoFields.contains(field) ? "推定" : nil
    }

    /// Re-run the estimator on this record's angle photos (… menu), e.g.
    /// after the estimator improves or a re-scan added angles.
    private func estimateFromAnglePhotos() {
        guard let record, !record.anglePhotoData.isEmpty else { return }
        isEstimating = true
        estimateGeneration += 1
        let generation = estimateGeneration
        let photos = AutoScanEstimator.slots(from: record.anglePhotoData)
        Task.detached(priority: .userInitiated) {
            let result = AutoScanEstimator.estimate(from: photos)
            await MainActor.run {
                // A rescan (or another estimate) may have superseded this
                // task while it was running; a stale result must not land.
                guard generation == estimateGeneration else { return }
                result.apply(to: &shape, params: &plateParams)
                estimatedShape = shape
                estimatedParams = plateParams
                autoFields = result.fields
                persistTuning()
                isEstimating = false
                UINotificationFeedbackGenerator().notificationOccurred(result.fields.isEmpty ? .warning : .success)
                if !result.fields.isEmpty { showTuneSheet = true }
            }
        }
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
            if !(record?.anglePhotoData.isEmpty ?? true) {
                Button { estimateFromAnglePhotos() } label: {
                    Label("角度写真から形を推定", systemImage: "wand.and.stars")
                }
                .disabled(isEstimating)
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

    private static let fingerNames = ["親指", "人差し指", "中指", "薬指", "小指"]

    /// Whether this record holds a five-nail set whose fingers can be
    /// reshaped individually (a single-nail record only ever has `shape`).
    private var isMultiFinger: Bool { (record?.setAppearances?.count ?? 0) > 1 }

    /// Reshape a jewel after the fact: shape chips + tip-tuning sliders, live
    /// on the stage behind the sheet, written straight back to the record.
    private var tuneSheet: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "形（シェイプ）")
                .padding(.top, 18)
            if isMultiFinger {
                // All 6 pills (whole-record + 5 fingers) wrap into rows instead
                // of scrolling horizontally, so every finger — including the
                // pinky, which used to sit just past the visible edge — is
                // always on screen and its selected state always visible (#395).
                FlowLayout(spacing: 8) {
                    StagePill(label: "すべての指に適用", isOn: selectedFingerIndex == nil) {
                        selectedFingerIndex = nil
                    }
                    ForEach(0..<Self.fingerNames.count, id: \.self) { index in
                        StagePill(label: Self.fingerNames[index], isOn: selectedFingerIndex == index) {
                            selectedFingerIndex = index
                        }
                    }
                }
                .padding(.horizontal, 24)
            }
            HStack(spacing: 8) {
                ForEach(NailShape.allCases) { candidate in
                    tuneShapeChip(candidate)
                }
            }
            .padding(.horizontal, 24)

            SectionHeader(title: "チップ調整")
            VStack(spacing: 6) {
                GoldSlider(label: "長さ", value: $plateParams.length, badge: badge(.length))
                GoldSlider(label: "幅", value: $plateParams.width, badge: badge(.width))
                GoldSlider(label: "カーブ 横", value: $plateParams.curveH, badge: badge(.curveH))
                GoldSlider(label: "カーブ 縦", value: $plateParams.curveV, badge: badge(.curveV))
                GoldSlider(label: "厚み", value: $plateParams.thickness, badge: badge(.thickness))
                GoldSlider(label: "角の丸み", value: $plateParams.corner, badge: badge(.corner))
            }
            .padding(.horizontal, 24)
            if !liveAutoFields.isEmpty {
                Text("「推定」は角度写真から求めた値です。動かすと手動の値になります")
                    .font(.system(size: 11))
                    .foregroundStyle(muted)
                    .padding(.horizontal, 28)
            }

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
        .onChange(of: fingerShapes) { persistTuning() }
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
    private func applyRescan(_ textures: [UIImage], original: UIImage, hand: Hand?) {
        guard let record else { return }
        isRescanning = true
        // Invalidates any in-flight estimate task (e.g. from the "…" menu)
        // fed from the photo this rescan is replacing (#401).
        estimateGeneration += 1
        isEstimating = false
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
                    record.hand = jpegs.count > 1 ? hand : nil
                    record.fingerShapes = nil
                    fingerShapes = nil
                    selectedFingerIndex = nil
                    if angleData.isEmpty {
                        // No angle photos to estimate from: the old scan's
                        // "推定" badge no longer describes this photo. Only
                        // the estimate bookkeeping is cleared — shape/params
                        // themselves are left as the user (or prior scan)
                        // set them, so nothing gets silently reset.
                        autoFields = []
                        estimatedShape = shape
                        estimatedParams = plateParams
                    }
                    persistTuning()
                    try? modelContext.save()
                    rescanTexture = cleaned.first
                    mode = jpegs.count > 1 ? .set : .single
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                }
                isRescanning = false
                rescanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                // A re-scan with angles refreshes the estimate too.
                if !angleData.isEmpty { estimateFromAnglePhotos() }
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

    /// The shape shown as "selected" for the finger tab currently active in
    /// the tune sheet — a specific finger's shape, or the whole-record shape
    /// when "すべての指に適用" is active.
    private var activeChipShape: NailShape {
        guard let selectedFingerIndex, let fingerShapes, fingerShapes.indices.contains(selectedFingerIndex) else {
            return shape
        }
        return fingerShapes[selectedFingerIndex]
    }

    private func selectShape(_ candidate: NailShape) {
        if let selectedFingerIndex {
            var updated = fingerShapes ?? Array(repeating: shape, count: record?.fingerPhotoData.count ?? Self.fingerNames.count)
            guard updated.indices.contains(selectedFingerIndex) else { return }
            updated[selectedFingerIndex] = candidate
            fingerShapes = updated
        } else {
            shape = candidate
            // "すべての指に適用": collapse any per-finger differences back to one shape.
            if isMultiFinger { fingerShapes = nil }
        }
    }

    private func tuneShapeChip(_ candidate: NailShape) -> some View {
        let isOn = activeChipShape == candidate
        return Button {
            selectShape(candidate)
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
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
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
        record.fingerShapes = fingerShapes
        record.finishRaw = finish.rawValue
        record.lengthAdj = plateParams.length
        record.widthAdj = plateParams.width
        record.curveHAdj = plateParams.curveH
        record.curveVAdj = plateParams.curveV
        record.thicknessAdj = plateParams.thickness
        record.cornerAdj = plateParams.corner
        record.autoEstimatedRaw = AutoScanEstimator.encode(liveAutoFields)
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
                    if let handLabel = record?.hand?.label, (record?.fingerPhotoData.count ?? 0) > 1 {
                        Text("\(handLabel) ・ \(record?.fingerPhotoData.count ?? 0)本")
                            .font(.system(size: 11))
                            .kerning(1)
                            .foregroundStyle(muted)
                    }
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
                        setShapes: fingerShapes,
                        highlightedTipIndex: showTuneSheet ? selectedFingerIndex : nil,
                        mirrored: record?.hand == .left,
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
            // Bump before the load starts (not after it finishes, #403): any
            // in-flight estimate for the outgoing photo must fail its guard
            // for the whole load, not just once this one lands.
            estimateGeneration += 1
            isEstimating = false
            let generation = estimateGeneration
            Task {
                if let data = try? await item.loadTransferable(type: Data.self),
                   let image = UIImage(data: data) {
                    // A newer selection may have landed while this one was
                    // still loading; only the latest may take the screen.
                    if generation == estimateGeneration {
                        rescanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                        rescanSource = RescanSource(image: image, single: false, initialZoom: 1)
                    }
                }
                rescanPickerItem = nil
            }
        }
        .fullScreenCover(isPresented: $rescanCameraShown) {
            NailCameraView(
                nailShape: $shape,
                onCapture: { image, _ in
                    rescanCameraShown = false
                    estimateGeneration += 1
                    isEstimating = false
                    rescanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                    rescanSource = RescanSource(image: image, single: true, initialZoom: NailCameraView.singleMargin)
                },
                onCaptureHand: { top, slots, capturedHand in
                    rescanCameraShown = false
                    estimateGeneration += 1
                    isEstimating = false
                    rescanAnglePhotos = slots
                    rescanHand = capturedHand
                    rescanSource = RescanSource(image: top, single: false, initialZoom: 1)
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
                hand: $rescanHand,
                onConfirm: { baked in
                    rescanSource = nil
                    applyRescan([baked], original: source.image, hand: nil)
                },
                onConfirmSet: { bakedList in
                    rescanSource = nil
                    let ordered = rescanHand.thumbIsOnPhotoLeft ? bakedList : Array(bakedList.reversed())
                    applyRescan(ordered, original: source.image, hand: rescanHand)
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
            if UserDefaults.standard.string(forKey: "debugAngleView") == "1", let entry = anglePhotos.first {
                viewingAnglePhoto = ViewingPhoto(image: entry.image, label: entry.step.label)
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
            // `-openTune 1` (+ optional -tuneFinger 0-4, -tuneShape <rawValue>)
            // opens the tune sheet and picks a finger + shape headlessly, so
            // per-finger tuning (#393) can be verified without a touch driver.
            if UserDefaults.standard.string(forKey: "openTune") == "1" {
                if let v = UserDefaults.standard.string(forKey: "tuneFinger"), let idx = Int(v) {
                    selectedFingerIndex = idx
                }
                if let v = UserDefaults.standard.string(forKey: "tuneShape"), let candidate = NailShape(rawValue: v) {
                    selectShape(candidate)
                }
                showTuneSheet = true
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
