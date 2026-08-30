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
    @State private var isCropping = false
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
    @State private var showDetails = false
    @State private var title = ""
    @State private var salon = ""
    @State private var priceText = ""
    @State private var memo = ""
    @State private var tagsText = ""

    private var hasTexture: Bool { !displayTextures.isEmpty }
    private var isSetCapture: Bool { displayTextures.count > 1 }

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
                StageBackground()

                VStack(spacing: 0) {
                    NailSceneView(
                        appearance: previewAppearance,
                        shape: shape,
                        mode: isSetCapture ? .set : .single,
                        plateParams: plateParams,
                        setAppearances: previewSetAppearances
                    )
                    .frame(height: 290)
                    .overlay(alignment: .bottom) {
                        if !hasTexture {
                            Text("写真を選ぶと、この爪にデザインが映ります")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.55))
                        }
                    }
                    .overlay {
                        if isCleaning {
                            HStack(spacing: 8) {
                                ProgressView().tint(.white)
                                Text("仕上げ処理中…")
                                    .font(.system(size: 13))
                                    .foregroundStyle(.white.opacity(0.85))
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(Capsule().fill(Color.black.opacity(0.6)))
                        }
                    }

                    ScrollView {
                        VStack(spacing: 18) {
                            VStack(spacing: 10) {
                                PhotosPicker(selection: $pickerItem, matching: .images) {
                                    actionRow(
                                        icon: "photo.on.rectangle.angled",
                                        title: hasTexture ? "写真を変更" : "写真を選ぶ"
                                    )
                                }
                                if UIImagePickerController.isSourceTypeAvailable(.camera) {
                                    Button { showCamera = true } label: {
                                        actionRow(icon: "camera", title: "カメラで撮る")
                                    }
                                }
                                if originalImage != nil {
                                    Button { isCropping = true } label: {
                                        actionRow(
                                            icon: "arrow.up.and.down.and.arrow.left.and.right",
                                            title: "位置を調整"
                                        )
                                    }
                                }
                            }
                            .padding(.horizontal, 24)

                            if isSetCapture {
                                Text("\(displayTextures.count) 本ぶんのデザインを取り込みました（セット表示）")
                                    .font(.caption)
                                    .foregroundStyle(Palette.gold.opacity(0.75))
                            }

                            VStack(alignment: .leading, spacing: 12) {
                                SectionHeader(title: "形（シェイプ）")
                                HStack(spacing: 8) {
                                    ForEach(NailShape.allCases) { candidate in
                                        shapeChip(candidate)
                                    }
                                }
                                .padding(.horizontal, 24)
                            }

                            VStack(alignment: .leading, spacing: 12) {
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
                            }

                            if hasTexture {
                                VStack(alignment: .leading, spacing: 12) {
                                    SectionHeader(title: "仕上げ")
                                    ScrollView(.horizontal, showsIndicators: false) {
                                        HStack(spacing: 8) {
                                            ForEach(NailFinish.allCases) { candidate in
                                                finishChip(candidate)
                                            }
                                        }
                                        .padding(.horizontal, 24)
                                    }
                                }
                            }

                            if hasTexture {
                                VStack(alignment: .leading, spacing: 8) {
                                    Button {
                                        withAnimation(.easeInOut(duration: 0.2)) { showRetouch.toggle() }
                                    } label: {
                                        HStack(spacing: 6) {
                                            Image(systemName: showRetouch ? "chevron.up" : "slider.horizontal.3")
                                                .font(.system(size: 11, weight: .semibold))
                                            Text(showRetouch ? "写真の微調整を閉じる" : "写真を微調整（明るさ・鮮やかさ等）")
                                                .font(.system(size: 12.5, weight: .medium))
                                            Spacer()
                                        }
                                        .foregroundStyle(.white.opacity(0.55))
                                        .padding(.horizontal, 28)
                                    }
                                    if showRetouch {
                                        retouchSection
                                    }
                                }

                                if AICleanup.isConfigured {
                                    VStack(spacing: 6) {
                                        Button(action: runAICleanup) {
                                            HStack(spacing: 8) {
                                                if isAIProcessing {
                                                    ProgressView().tint(Palette.goldBright)
                                                    Text(aiProgress)
                                                } else {
                                                    Image(systemName: aiApplied ? "checkmark.seal.fill" : "sparkles")
                                                    Text(aiApplied ? "AIクリーンアップ済み" : "AIクリーンアップ（クラウド）")
                                                }
                                            }
                                            .font(.system(size: 14, weight: .semibold))
                                            .frame(maxWidth: .infinity)
                                            .padding(.vertical, 12)
                                            .background(
                                                Capsule()
                                                    .fill(Color.white.opacity(0.06))
                                                    .overlay(Capsule().stroke(Palette.gold.opacity(0.5), lineWidth: 1))
                                            )
                                            .foregroundStyle(Palette.goldBright)
                                        }
                                        .disabled(isAIProcessing || aiApplied)
                                        if let aiError {
                                            Text(aiError)
                                                .font(.system(size: 12))
                                                .foregroundStyle(Color(red: 1, green: 0.6, blue: 0.65))
                                        }
                                        Text("背景・肌をAIで完全除去し、ディテールを強化します")
                                            .font(.system(size: 11))
                                            .foregroundStyle(.white.opacity(0.45))
                                    }
                                    .padding(.horizontal, 24)
                                }
                            }

                            VStack(spacing: 10) {
                                StoryField(prompt: "タイトル（例: 深海ネイル）", text: $title)
                                Button {
                                    withAnimation(.easeInOut(duration: 0.22)) { showDetails.toggle() }
                                } label: {
                                    HStack(spacing: 6) {
                                        Image(systemName: showDetails ? "chevron.up" : "plus")
                                            .font(.system(size: 11, weight: .semibold))
                                        Text(showDetails ? "詳細を閉じる" : "詳細を追加（タグ・サロン・価格・メモ）")
                                            .font(.system(size: 12.5, weight: .medium))
                                        Spacer()
                                    }
                                    .foregroundStyle(Palette.gold.opacity(0.85))
                                    .padding(.horizontal, 4)
                                    .padding(.vertical, 2)
                                }
                                if showDetails {
                                    StoryField(prompt: "タグ（カンマ区切り。例: ピンク, マグネット）", text: $tagsText)
                                    StoryField(prompt: "サロン名（任意）", text: $salon)
                                    StoryField(prompt: "価格（任意・円）", text: $priceText)
                                        .keyboardType(.numberPad)
                                    StoryField(prompt: "メモ（任意）", text: $memo, axis: .vertical)
                                }
                            }
                            .padding(.horizontal, 24)

                            Button(action: save) {
                                HStack(spacing: 6) {
                                    Text("コレクションに加える")
                                    Image(systemName: "sparkles")
                                }
                                .font(.system(size: 15, weight: .semibold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(
                                    Capsule().fill(
                                        hasTexture
                                            ? AnyShapeStyle(Palette.goldGradient)
                                            : AnyShapeStyle(Color.white.opacity(0.15))
                                    )
                                )
                                .foregroundStyle(hasTexture ? Palette.ink0 : .white.opacity(0.5))
                            }
                            .disabled(!hasTexture)
                            .padding(.horizontal, 24)
                            .padding(.top, 4)
                        }
                        .padding(.vertical, 16)
                    }
                    .scrollDismissesKeyboard(.interactively)
                }

                StageForeground(theme: .glass)
            }
            .navigationTitle("ネイルを記録")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("閉じる") { dismiss() }
                        .foregroundStyle(.white.opacity(0.8))
                }
            }
        }
        .preferredColorScheme(.dark)
        .onChange(of: pickerItem) { _, newItem in
            guard let newItem else { return }
            Task {
                if let data = try? await newItem.loadTransferable(type: Data.self),
                   let image = UIImage(data: data) {
                    cameraSingle = false
                    originalImage = image
                    isCropping = true
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
            } else if UserDefaults.standard.string(forKey: "debugPhoto") == "1", originalImage == nil {
                originalImage = NailStyle.samples[3].texture
                isCropping = true
            }
        }
        .fullScreenCover(isPresented: $showCamera) {
            NailCameraView(
                onCapture: { image in
                    showCamera = false
                    cameraSingle = true
                    originalImage = image
                    isCropping = true
                },
                onCancel: { showCamera = false }
            )
            .ignoresSafeArea()
        }
        .fullScreenCover(isPresented: $isCropping) {
            if let originalImage {
                PhotoCropView(
                    image: originalImage,
                    nailShape: $shape,
                    forceSingle: cameraSingle,
                    onConfirm: { baked in
                        isCropping = false
                        cleanupAndSet([baked])
                    },
                    onConfirmSet: { bakedList in
                        isCropping = false
                        cleanupAndSet(bakedList)
                    },
                    onCancel: { isCropping = false }
                )
            }
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

    // MARK: - Rows & chips

    /// Full-width list row: gold icon, title, chevron — the mockup's tappable
    /// list style for 写真を選ぶ / 位置を調整.
    private func actionRow(icon: String, title: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Palette.gold)
                .frame(width: 24)
            Text(title)
                .font(.system(size: 15, weight: .medium))
                .foregroundStyle(.white)
            Spacer()
            Image(systemName: "chevron.right")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(.white.opacity(0.35))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 15)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.06))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Palette.gold.opacity(0.12), lineWidth: 1))
        )
    }

    /// A finish option chip; gold when selected.
    private func finishChip(_ candidate: NailFinish) -> some View {
        let isOn = finish == candidate
        return Button {
            finish = candidate
            UISelectionFeedbackGenerator().selectionChanged()
        } label: {
            Text(candidate.label)
                .font(.system(size: 13, weight: isOn ? .semibold : .regular))
                .padding(.horizontal, 15)
                .padding(.vertical, 9)
                .background(
                    Capsule().fill(
                        isOn ? AnyShapeStyle(Palette.goldGradient) : AnyShapeStyle(Color.white.opacity(0.08))
                    )
                )
                .foregroundStyle(isOn ? Palette.ink0 : .white.opacity(0.75))
        }
    }

    /// A nail-silhouette shape option; gold outline + glow when selected.
    private func shapeChip(_ candidate: NailShape) -> some View {
        let isOn = shape == candidate
        return Button {
            shape = candidate
        } label: {
            VStack(spacing: 6) {
                NailSilhouette(nailShape: candidate)
                    .fill(isOn ? AnyShapeStyle(Palette.goldGradient) : AnyShapeStyle(Color.white.opacity(0.16)))
                    .frame(width: 26, height: 42)
                    .overlay(
                        NailSilhouette(nailShape: candidate)
                            .stroke(isOn ? Palette.goldBright : .white.opacity(0.25), lineWidth: 1)
                    )
                Text(candidate.label)
                    .font(.system(size: 10.5, weight: isOn ? .semibold : .regular))
                    .foregroundStyle(isOn ? Palette.goldBright : .white.opacity(0.6))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isOn ? Palette.gold.opacity(0.1) : Color.white.opacity(0.04))
            )
        }
    }

    // MARK: - Save

    private func save() {
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
            plateParams: plateParams
        )
        modelContext.insert(record)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        dismiss()
    }
}
