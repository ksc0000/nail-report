import CoreImage
import CoreImage.CIFilterBuiltins
import PhotosUI
import SwiftData
import SwiftUI

/// The capture flow: pick a photo → position it (or grab all detected nails at
/// once) → live 3D preview with light retouching → into the jewelry box.
struct AddNailView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var pickerItem: PhotosPickerItem?
    @State private var originalImage: UIImage?
    /// What the crop cover is positioning. Item-driven so the cover always
    /// has its image; a Bool flag evaluated the cover before the image
    /// landed and left it blank.
    @State private var cropSource: CropSource?
    @State private var showCamera = false
    @State private var isCleaning = false
    @State private var isAIProcessing = false
    @State private var aiProgress = ""
    @State private var aiError: String?
    @State private var aiApplied = false

    /// Baked textures straight from the crop (before retouch). One entry for a
    /// single nail; up to five (photo left→right) for a whole-hand capture.
    @State private var bakedTextures: [UIImage] = []
    /// Retouched copies actually shown and saved.
    @State private var displayTextures: [UIImage] = []
    /// Reference photos from a 立体スキャン capture, in `AngleStep` order
    /// (nil where skipped); cleared whenever the top photo changes outside
    /// of a scan, so a stale scan can't get attached to an unrelated photo.
    @State private var scanAnglePhotos: [UIImage?] = Array(repeating: nil, count: AngleStep.allCases.count)
    /// Which hand a five-nail capture is; nil for a single nail.
    @State private var hand: Hand?
    /// Hand chosen on the crop screen for library photos.
    @State private var pickedHand: Hand = Hand.remembered
    /// Per-finger shapes (thumb→pinky) once a hand capture was estimated.
    @State private var fingerShapes: [NailShape]?
    /// Fields the 立体スキャン estimator filled in (#389). A field drops out as
    /// soon as its value differs from the estimate, i.e. the user took over.
    @State private var autoFields: Set<AutoScanEstimator.Field> = []
    @State private var estimatedShape: NailShape = .squoval
    @State private var estimatedParams = NailPlateParams()
    @State private var isEstimating = false
    /// Bumped whenever the source photo is replaced, so an estimate `Task`
    /// started against a superseded photo can't land its result once a new
    /// one has taken over (#401).
    @State private var estimateGeneration = 0

    @State private var smoothStep: Float = 2
    @State private var brightnessStep: Float = 0
    @State private var saturationStep: Float = 0
    @State private var contrastStep: Float = 0
    @State private var retouchTask: Task<Void, Never>?

    @State private var plateParams = NailPlateParams()

    @State private var shape: NailShape = .squoval
    @State private var finish: NailFinish = .gloss
    @State private var cameraSingle = false
    @State private var showRetouch = false
    @State private var showTune = false
    @State private var showDetails = false
    @State private var title = ""
    @State private var salon = ""
    @State private var priceText = ""
    @State private var memo = ""
    @State private var tagsText = ""

    private var hasTexture: Bool { !displayTextures.isEmpty }
    private var isSetCapture: Bool { displayTextures.count > 1 }
    private var isProcessing: Bool { isCleaning || isEstimating || isAIProcessing }

    private var previewAppearance: NailAppearance {
        if let first = displayTextures.first {
            return NailAppearance(id: "picked-\(first.hashValue)", texture: first, finish: finish)
        }
        return NailStyle.samples[0].appearance
    }

    private var previewSetAppearances: [NailAppearance]? {
        guard isSetCapture else { return nil }
        return displayTextures.enumerated().map { index, texture in
            NailAppearance(id: "picked-\(index)-\(texture.hashValue)", texture: texture, finish: finish)
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Palette.paper.ignoresSafeArea()

                VStack(spacing: 0) {
                    stage

                    ScrollView {
                        VStack(spacing: 22) {
                            if hasTexture {
                                capturedControls
                            } else {
                                sourceChoices
                            }
                        }
                        .padding(.top, 18)
                        .padding(.bottom, hasTexture ? 96 : 24)
                        .disabled(isProcessing)
                    }
                    .scrollDismissesKeyboard(.interactively)
                }

                if hasTexture {
                    VStack {
                        Spacer()
                        saveBar
                    }
                }
            }
            .navigationTitle("ネイルを記録")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("閉じる") { dismiss() }
                        .foregroundStyle(Palette.inkWarm)
                }
            }
        }
        .tint(Palette.inkWarm)
        .environment(\.stageIsLight, true)
        .environment(\.colorScheme, .light)
        .onChange(of: pickerItem) { _, newItem in
            guard let newItem else { return }
            // Bump before the load starts (not after it finishes, #403): any
            // in-flight estimate for the outgoing photo must fail its guard
            // for the whole load, not just once this one lands.
            estimateGeneration += 1
            isEstimating = false
            let generation = estimateGeneration
            Task {
                if let data = try? await newItem.loadTransferable(type: Data.self),
                   let image = UIImage(data: data) {
                    // A newer selection may have landed while this one was
                    // still loading; only the latest may take the screen.
                    guard generation == estimateGeneration else { return }
                    cameraSingle = false
                    originalImage = image
                    scanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                    cropSource = CropSource(image: image, single: false)
                }
            }
        }
        .onAppear {
            if let dbg = UserDefaults.standard.string(forKey: "debugFinish"),
               let f = NailFinish(rawValue: dbg), displayTextures.isEmpty {
                // Skip the crop step: drop a sample straight onto the preview so
                // the finish material can be screenshotted headlessly.
                finish = f
                let tex = NailStyle.samples[2].texture
                bakedTextures = [tex]
                displayTextures = [tex]
            } else if let set = UserDefaults.standard.string(forKey: "debugScanSet"), displayTextures.isEmpty {
                // `-debugScanSet 1` feeds the bundled synthetic angle set to the
                // estimator exactly as a 立体スキャン would, no camera needed.
                // The synthetic sets are not bundled (`angles` is excluded in
                // project.yml); `-debugScanDir <abs path>` points at them on the
                // host, which the simulator can read directly.
                let dir = UserDefaults.standard.string(forKey: "debugScanDir") ?? ""
                let photos = AngleStep.allCases.map { step -> UIImage? in
                    let suffix: String
                    switch step {
                    case .top: suffix = "top"
                    case .side: suffix = "side"
                    case .otherSide: suffix = "otherside"
                    case .catHand: suffix = "catpaw"
                    }
                    let name = "set\(set)_\(suffix)"
                    if !dir.isEmpty, let image = UIImage(contentsOfFile: "\(dir)/\(name).png") { return image }
                    return UIImage(named: name)
                }
                let tex = photos[0] ?? NailStyle.samples[2].texture
                bakedTextures = [tex]
                displayTextures = [tex]
                scanAnglePhotos = photos
                runAutoEstimate(photos)
            } else if UserDefaults.standard.string(forKey: "debugPhoto") == "1", originalImage == nil {
                let sample = NailStyle.samples[3].texture
                originalImage = sample
                cropSource = CropSource(image: sample, single: false)
            }
            // `-debugCamera 1` opens the in-app camera directly, so its guide
            // overlay (mode pills, 立体スキャン step dots, hints) can be
            // screenshotted headlessly — the simulator has no camera hardware
            // to drive an actual capture.
            if UserDefaults.standard.string(forKey: "debugCamera") == "1" {
                showCamera = true
            }
        }
        .fullScreenCover(isPresented: $showCamera) {
            NailCameraView(
                nailShape: $shape,
                onCapture: { image, _ in
                    showCamera = false
                    estimateGeneration += 1
                    isEstimating = false
                    cameraSingle = true
                    hand = nil
                    originalImage = image
                    scanAnglePhotos = Array(repeating: nil, count: AngleStep.allCases.count)
                    cropSource = CropSource(image: image, single: true, initialZoom: NailCameraView.singleMargin)
                },
                onCaptureHand: { top, slots, capturedHand in
                    showCamera = false
                    estimateGeneration += 1
                    isEstimating = false
                    cameraSingle = false
                    hand = capturedHand
                    pickedHand = capturedHand
                    originalImage = top
                    scanAnglePhotos = slots
                    cropSource = CropSource(image: top, single: false)
                },
                onCancel: { showCamera = false }
            )
            .ignoresSafeArea()
        }
        .fullScreenCover(item: $cropSource) { source in
            PhotoCropView(
                image: source.image,
                nailShape: $shape,
                forceSingle: source.single,
                initialZoom: source.initialZoom,
                hand: $pickedHand,
                onConfirm: { baked in
                    cropSource = nil
                    hand = nil
                    fingerShapes = nil
                    cleanupAndSet([baked])
                },
                onConfirmSet: { bakedList in
                    cropSource = nil
                    // Textures are stored thumb→pinky; a left hand photographed
                    // from above has its thumb on the right, so flip.
                    let chosen = pickedHand
                    hand = chosen
                    let ordered = chosen.thumbIsOnPhotoLeft ? bakedList : Array(bakedList.reversed())
                    cleanupAndSet(ordered)
                    runHandEstimate(fingers: ordered, angles: scanAnglePhotos)
                },
                onCancel: { cropSource = nil }
            )
        }
    }

    /// Cloud pipeline (matting → composite → detail enhance) over every
    /// captured texture, sequential with progress.
    private func runAICleanup() {
        guard !isAIProcessing, !bakedTextures.isEmpty else { return }
        isAIProcessing = true
        aiError = nil
        let sources = bakedTextures
        Task {
            var results: [UIImage] = []
            do {
                for (index, texture) in sources.enumerated() {
                    aiProgress = sources.count > 1
                        ? "AI処理中（\(index + 1)/\(sources.count)）…"
                        : "AI処理中…"
                    let enhanced = try await AICleanup.enhance(texture)
                    results.append(enhanced)
                }
                bakedTextures = AICleanup.colorBalanced(results)
                applyRetouch()
                aiApplied = true
                UINotificationFeedbackGenerator().notificationOccurred(.success)
            } catch {
                aiError = "AI処理に失敗しました。通信環境を確認して再試行してください。"
                UINotificationFeedbackGenerator().notificationOccurred(.error)
            }
            isAIProcessing = false
        }
    }

    /// On-device cleanup (subject mask → skin feathering → highlight taming)
    /// runs once per committed texture, off the main thread.
    private func cleanupAndSet(_ textures: [UIImage]) {
        autoFields = []
        fingerShapes = nil
        aiApplied = false
        aiError = nil
        isCleaning = true
        Task.detached(priority: .userInitiated) {
            let cleaned = textures.map { NailCleanup.process($0) }
            await MainActor.run {
                bakedTextures = cleaned
                applyRetouch()
                isCleaning = false
            }
        }
    }

    // MARK: - Retouch

    private var retouchSection: some View {
        VStack(spacing: 6) {
            GoldSlider(label: "なめらか", value: $smoothStep, range: 0...5) { _ in scheduleRetouch() }
            GoldSlider(label: "明るさ", value: $brightnessStep, range: -5...5) { _ in scheduleRetouch() }
            GoldSlider(label: "鮮やかさ", value: $saturationStep, range: -5...5) { _ in scheduleRetouch() }
            GoldSlider(label: "コントラスト", value: $contrastStep, range: -5...5) { _ in scheduleRetouch() }
        }
        .padding(.horizontal, 24)
    }

    /// CIFilter chain is too heavy to run per drag tick; coalesce slider
    /// movement and re-render once the finger pauses.
    private func scheduleRetouch() {
        retouchTask?.cancel()
        retouchTask = Task {
            try? await Task.sleep(nanoseconds: 120_000_000)
            guard !Task.isCancelled else { return }
            applyRetouch()
        }
    }

    /// Downscales the picked photo to a size worth keeping for reference —
    /// big enough to show a nail artist, small enough that a long collection
    /// stays light (long edge 1600pt, JPEG 0.8 ≈ a few hundred KB).
    static func archivalJPEG(_ image: UIImage) -> Data? {
        let maxEdge: CGFloat = 1600
        let scale = min(1, maxEdge / max(image.size.width, image.size.height))
        guard scale < 1 else { return image.jpegData(compressionQuality: 0.8) }
        let size = CGSize(width: image.size.width * scale, height: image.size.height * scale)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        let resized = UIGraphicsImageRenderer(size: size, format: format).image { _ in
            image.draw(in: CGRect(origin: .zero, size: size))
        }
        return resized.jpegData(compressionQuality: 0.8)
    }

    /// `NailRecord.anglePhotoData` from a 立体スキャン's 4 slots (nil →
    /// skipped, stored as empty `Data` to keep the slot's position). Returns
    /// `[]` when nothing was scanned, so untouched records stay untouched.
    static func archivalAngleData(_ photos: [UIImage?]) -> [Data] {
        guard photos.contains(where: { $0 != nil }) else { return [] }
        return photos.map { $0.flatMap(archivalJPEG) ?? Data() }
    }

    private static let ciContext = CIContext()

    private func applyRetouch() {
        displayTextures = bakedTextures.map { retouched($0) }
    }

    private func retouched(_ image: UIImage) -> UIImage {
        guard abs(smoothStep) > 0.05 || abs(brightnessStep) > 0.05
            || abs(saturationStep) > 0.05 || abs(contrastStep) > 0.05,
              let input = CIImage(image: image) else { return image }
        var working = input

        // Edge-preserving smoothing: median wipes speckle/grain, noise
        // reduction softens skin/gel texture while sharpness keeps art edges.
        if smoothStep > 0.05 {
            let median = CIFilter.median()
            median.inputImage = working
            working = median.outputImage ?? working
            let noise = CIFilter.noiseReduction()
            noise.inputImage = working
            noise.noiseLevel = smoothStep * 0.012
            noise.sharpness = 0.55
            working = noise.outputImage ?? working
        }

        if brightnessStep != 0 || saturationStep != 0 || contrastStep != 0 {
            let filter = CIFilter.colorControls()
            filter.inputImage = working
            filter.brightness = brightnessStep * 0.04
            filter.saturation = 1 + saturationStep * 0.12
            filter.contrast = 1 + contrastStep * 0.05
            working = filter.outputImage ?? working
        }

        guard let cgImage = Self.ciContext.createCGImage(working, from: input.extent) else { return image }
        return UIImage(cgImage: cgImage)
    }

    // MARK: - Stage & sections

    /// Paper stage: before a photo, a hairline outline shows where the nail
    /// will appear; after, the live 3D preview with a soft contact shadow.
    private var stage: some View {
        ZStack {
            StageBackground(theme: .paper)
            if hasTexture {
                Ellipse()
                    .fill(Palette.inkWarm.opacity(0.12))
                    .frame(width: 120, height: 26)
                    .blur(radius: 10)
                    .offset(y: 100)
                NailSceneView(
                    appearance: previewAppearance,
                    shape: shape,
                    mode: isSetCapture ? .set : .single,
                    plateParams: plateParams,
                    setAppearances: previewSetAppearances,
                    setShapes: isSetCapture ? fingerShapes : nil,
                    mirrored: hand == .left,
                    theme: .paper
                )
            } else {
                VStack(spacing: 16) {
                    NailSilhouette(nailShape: shape)
                        .stroke(Palette.goldHairline, lineWidth: 1.2)
                        .frame(width: 56, height: 84)
                    Text("写真を選ぶと、ここにあなたのネイルが現れます")
                        .font(.system(size: 12))
                        .foregroundStyle(Palette.mutedWarm)
                }
            }
        }
        .frame(height: hasTexture ? 300 : 230)
        .clipped()
        .overlay {
            if isCleaning {
                HStack(spacing: 8) {
                    ProgressView().tint(Palette.paper)
                    Text("仕上げ処理中…")
                        .font(.system(size: 13))
                        .foregroundStyle(Palette.paper)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Capsule().fill(Palette.inkWarm.opacity(0.92)))
            }
        }
    }

    /// Empty state: the only decision is where the photo comes from.
    private var sourceChoices: some View {
        VStack(spacing: 10) {
            PhotosPicker(selection: $pickerItem, matching: .images) {
                actionRow(icon: "photo.on.rectangle.angled", title: "写真を選ぶ", detail: "サロン帰りの1枚から")
            }
            if UIImagePickerController.isSourceTypeAvailable(.camera) {
                Button { showCamera = true } label: {
                    actionRow(icon: "camera", title: "カメラで撮る", detail: "片手の5本、または1本だけ")
                }
            }
        }
        .padding(.horizontal, 24)
    }

    /// After the photo: the two picks that matter (shape, finish) stay open;
    /// fine tuning, retouch, cloud cleanup and story details fold away.
    private var capturedControls: some View {
        VStack(spacing: 22) {
            HStack(spacing: 8) {
                PhotosPicker(selection: $pickerItem, matching: .images) {
                    pillLabel("写真を変更", icon: "photo")
                }
                if let originalImage {
                    Button { cropSource = CropSource(image: originalImage, single: cameraSingle) } label: {
                        pillLabel("位置を調整", icon: "arrow.up.and.down.and.arrow.left.and.right")
                    }
                }
                if UIImagePickerController.isSourceTypeAvailable(.camera) {
                    Button { showCamera = true } label: {
                        pillLabel("撮り直す", icon: "camera")
                    }
                }
            }
            .padding(.horizontal, 24)

            if isSetCapture {
                HStack(spacing: 8) {
                    ForEach(Hand.allCases) { candidate in
                        StagePill(label: candidate.label, isOn: hand == candidate) {
                            switchHand(to: candidate)
                        }
                    }
                    Text("\(displayTextures.count)本")
                        .font(.system(size: 12))
                        .foregroundStyle(Palette.mutedWarm)
                }
            }

            StoryField(prompt: "タイトル（例: 深海ネイル）", text: $title)
                .padding(.horizontal, 24)

            section("形（シェイプ）") {
                HStack(spacing: 6) {
                    ForEach(NailShape.allCases) { candidate in
                        shapeChip(candidate)
                    }
                }
                .padding(.horizontal, 20)
                if liveAutoFields.contains(.shape) {
                    estimateNote("形は角度写真から推定しました。違えば選び直せます")
                }
            }

            section("仕上げ") {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(NailFinish.allCases) { candidate in
                            StagePill(label: candidate.label, isOn: finish == candidate) {
                                finish = candidate
                                UISelectionFeedbackGenerator().selectionChanged()
                            }
                        }
                    }
                    .padding(.horizontal, 24)
                }
            }

            disclosure(tuneTitle, isOn: $showTune) {
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
                    estimateNote("「推定」は角度写真から求めた値です。動かすと手動の値になります")
                }
            }

            disclosure("写真を微調整（明るさ・鮮やかさ等）", isOn: $showRetouch) {
                retouchSection
            }

            if AICleanup.isConfigured {
                aiCleanupRow
            }

            disclosure("詳細を追加（タグ・サロン・価格・メモ）", isOn: $showDetails) {
                VStack(spacing: 10) {
                    StoryField(prompt: "タグ（カンマ区切り。例: ピンク, マグネット）", text: $tagsText)
                    StoryField(prompt: "サロン名（任意）", text: $salon)
                    StoryField(prompt: "価格（任意・円）", text: $priceText)
                        .keyboardType(.numberPad)
                    StoryField(prompt: "メモ（任意）", text: $memo, axis: .vertical)
                }
                .padding(.horizontal, 24)
            }
        }
    }

    // MARK: - 立体スキャン auto-estimate (#389)

    /// Fields whose value still equals the estimate; anything the user moved
    /// is no longer "estimated", without needing per-slider change handlers.
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

    private var tuneTitle: String {
        let count = liveAutoFields.subtracting([.shape]).count
        if isEstimating { return "チップの形を細かく調整（角度写真から推定中…）" }
        return count > 0 ? "チップの形を細かく調整（\(count)項目を推定）" : "チップの形を細かく調整"
    }

    private func estimateNote(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 11))
            .foregroundStyle(Palette.mutedWarm)
            .padding(.horizontal, 28)
    }

    /// Hand capture: per-finger shapes from the cropped textures, curves
    /// from the side / curled references.
    private func runHandEstimate(fingers: [UIImage], angles: [UIImage?]) {
        guard fingers.count > 1 else { return }
        isEstimating = true
        estimateGeneration += 1
        let generation = estimateGeneration
        Task.detached(priority: .userInitiated) {
            let estimate = AutoScanEstimator.estimateHand(fingers: fingers, angles: angles)
            await MainActor.run {
                // The photo may have been replaced while this ran; a stale
                // result must not land on whatever photo is current now.
                guard generation == estimateGeneration else { return }
                estimate.result.apply(to: &shape, params: &plateParams)
                if estimate.fingerShapes.contains(where: { $0 != nil }) {
                    fingerShapes = estimate.fingerShapes.map { $0 ?? shape }
                } else {
                    fingerShapes = nil
                }
                estimatedShape = shape
                estimatedParams = plateParams
                autoFields = estimate.result.fields
                isEstimating = false
                if !estimate.result.fields.subtracting([.shape]).isEmpty { showTune = true }
            }
        }
    }

    /// Changing the hand after capture flips the finger order (thumb stays
    /// the thumb) and remembers the choice.
    private func switchHand(to newHand: Hand) {
        guard hand != newHand else { return }
        hand = newHand
        newHand.remember()
        bakedTextures.reverse()
        displayTextures.reverse()
        fingerShapes?.reverse()
    }

    /// Vision + least-squares fit off the main thread; the sliders open with
    /// the guesses badged so the user sees what came from the photos.
    private func runAutoEstimate(_ photos: [UIImage?]) {
        guard photos.contains(where: { $0 != nil }) else { return }
        isEstimating = true
        estimateGeneration += 1
        let generation = estimateGeneration
        Task.detached(priority: .userInitiated) {
            let result = AutoScanEstimator.estimate(from: photos)
            await MainActor.run {
                guard generation == estimateGeneration else { return }
                result.apply(to: &shape, params: &plateParams)
                estimatedShape = shape
                estimatedParams = plateParams
                autoFields = result.fields
                isEstimating = false
                if !result.fields.subtracting([.shape]).isEmpty { showTune = true }
            }
        }
    }

    private var aiCleanupRow: some View {
        VStack(spacing: 6) {
            Button(action: runAICleanup) {
                HStack(spacing: 8) {
                    if isAIProcessing {
                        ProgressView().tint(Palette.inkWarm)
                        Text(aiProgress)
                    } else {
                        Image(systemName: aiApplied ? "checkmark.circle" : "wand.and.stars")
                        Text(aiApplied ? "AIクリーンアップ済み" : "AIクリーンアップ")
                    }
                }
                .font(.system(size: 13.5, weight: .medium))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Capsule().stroke(Palette.inkWarm.opacity(aiApplied ? 0.2 : 0.4), lineWidth: 1))
                .foregroundStyle(aiApplied ? Palette.mutedWarm : Palette.inkWarm)
            }
            .disabled(isAIProcessing || aiApplied)
            if let aiError {
                Text(aiError)
                    .font(.system(size: 12))
                    .foregroundStyle(Color(red: 0.72, green: 0.27, blue: 0.27))
                    .multilineTextAlignment(.center)
            }
            Text("背景と肌を取り除き、ディテールを整えます（クラウド処理）")
                .font(.system(size: 11))
                .foregroundStyle(Palette.mutedWarm)
        }
        .padding(.horizontal, 24)
    }

    /// Always within reach once there is something to save.
    private var saveBar: some View {
        Button(action: save) {
            Text("コレクションに加える")
                .font(.system(size: 15, weight: .medium))
                .kerning(1)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Capsule().fill(Palette.inkWarm))
                .foregroundStyle(Palette.paper)
        }
        .disabled(isProcessing)
        .padding(.horizontal, 24)
        .padding(.top, 14)
        .padding(.bottom, 10)
        .background(
            // Solid paper under the button, a short fade above it, so the
            // scrolled content dissolves instead of peeking through.
            Palette.paper
                .overlay(alignment: .top) {
                    LinearGradient(colors: [Palette.paper.opacity(0), Palette.paper], startPoint: .top, endPoint: .bottom)
                        .frame(height: 28)
                        .offset(y: -28)
                }
                .ignoresSafeArea()
        )
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: title)
            content()
        }
    }

    private func disclosure<Content: View>(
        _ title: String,
        isOn: Binding<Bool>,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Button {
                withAnimation(.easeInOut(duration: 0.2)) { isOn.wrappedValue.toggle() }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: isOn.wrappedValue ? "chevron.up" : "chevron.down")
                        .font(.system(size: 10, weight: .semibold))
                    Text(title)
                        .font(.system(size: 12.5, weight: .medium))
                    Spacer()
                }
                .foregroundStyle(Palette.mutedWarm)
                .padding(.horizontal, 28)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            if isOn.wrappedValue {
                content()
            }
        }
    }

    // MARK: - Rows & chips

    /// Full-width choice row on paper: ink icon, title, a quiet detail line,
    /// hairline border.
    private func actionRow(icon: String, title: String, detail: String) -> some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .regular))
                .foregroundStyle(Palette.inkWarm)
                .frame(width: 26)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(Palette.inkWarm)
                Text(detail)
                    .font(.system(size: 12))
                    .foregroundStyle(Palette.mutedWarm)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(Palette.mutedWarm)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Palette.inkWarm.opacity(0.2), lineWidth: 1)
        )
        .contentShape(Rectangle())
    }

    private func pillLabel(_ title: String, icon: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon).font(.system(size: 12))
            Text(title).font(.system(size: 12.5, weight: .medium))
        }
        .foregroundStyle(Palette.inkWarm)
        .padding(.horizontal, 13)
        .padding(.vertical, 8)
        .background(Capsule().stroke(Palette.inkWarm.opacity(0.35), lineWidth: 1))
        .contentShape(Capsule())
    }

    /// A nail-silhouette shape option; ink when selected, hairline otherwise.
    private func shapeChip(_ candidate: NailShape) -> some View {
        let isOn = shape == candidate
        return Button {
            shape = candidate
        } label: {
            VStack(spacing: 6) {
                NailSilhouette(nailShape: candidate)
                    .fill(isOn ? Palette.inkWarm : Palette.inkWarm.opacity(0.08))
                    .frame(width: 26, height: 42)
                    .overlay(
                        NailSilhouette(nailShape: candidate)
                            .stroke(isOn ? Palette.goldHairline : Palette.inkWarm.opacity(0.25), lineWidth: 1)
                    )
                Text(candidate.label)
                    .font(.system(size: 10, weight: isOn ? .semibold : .regular))
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
                    .foregroundStyle(isOn ? Palette.inkWarm : Palette.mutedWarm)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isOn ? Palette.inkWarm.opacity(0.06) : Color.clear)
            )
        }
        .buttonStyle(.plain)
    }

    // MARK: - Save

    private func save() {
        guard !isProcessing else { return }
        guard let primary = displayTextures.first,
              let jpeg = primary.jpegData(compressionQuality: 0.85) else { return }
        let fingerData = isSetCapture
            ? displayTextures.compactMap { $0.jpegData(compressionQuality: 0.85) }
            : []
        let name = title.trimmingCharacters(in: .whitespacesAndNewlines)
        let record = NailRecord(
            title: name.isEmpty ? "マイネイル" : name,
            shape: shape,
            finish: finish,
            photoData: jpeg,
            salon: salon.trimmingCharacters(in: .whitespacesAndNewlines),
            priceYen: Int(priceText.trimmingCharacters(in: .whitespaces)),
            memo: memo.trimmingCharacters(in: .whitespacesAndNewlines),
            tags: tagsText
                .split(whereSeparator: { $0 == "," || $0 == "、" })
                .map { $0.trimmingCharacters(in: .whitespaces) }
                .filter { !$0.isEmpty },
            fingerPhotoData: fingerData,
            originalPhotoData: originalImage.flatMap(Self.archivalJPEG),
            anglePhotoData: Self.archivalAngleData(scanAnglePhotos),
            plateParams: plateParams
        )
        record.autoEstimatedRaw = AutoScanEstimator.encode(liveAutoFields)
        if isSetCapture {
            record.hand = hand
            record.fingerShapes = fingerShapes
        }
        modelContext.insert(record)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        dismiss()
    }
}

private struct CropSource: Identifiable {
    let id = UUID()
    let image: UIImage
    let single: Bool
    var initialZoom: CGFloat = 1
}
