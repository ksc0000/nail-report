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

    /// Baked textures straight from the crop (before retouch). One entry for a
    /// single nail; up to five (photo left→right) for a whole-hand capture.
    @State private var bakedTextures: [UIImage] = []
    /// Retouched copies actually shown and saved.
    @State private var displayTextures: [UIImage] = []

    @State private var smoothStep: Int = 2
    @State private var brightnessStep: Int = 0
    @State private var saturationStep: Int = 0
    @State private var contrastStep: Int = 0

    @State private var shape: NailShape = .squoval
    @State private var title = ""
    @State private var salon = ""
    @State private var priceText = ""
    @State private var memo = ""
    @State private var tagsText = ""

    private var hasTexture: Bool { !displayTextures.isEmpty }
    private var isSetCapture: Bool { displayTextures.count > 1 }

    private var previewAppearance: NailAppearance {
        if let first = displayTextures.first {
            return NailAppearance(id: "picked-\(first.hashValue)", texture: first, finish: .gloss)
        }
        return NailStyle.samples[0].appearance
    }

    private var previewSetAppearances: [NailAppearance]? {
        guard isSetCapture else { return nil }
        return displayTextures.enumerated().map { index, texture in
            NailAppearance(id: "picked-\(index)-\(texture.hashValue)", texture: texture, finish: .gloss)
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

                    ScrollView {
                        VStack(spacing: 14) {
                            HStack(spacing: 10) {
                                PhotosPicker(selection: $pickerItem, matching: .images) {
                                    Label(
                                        hasTexture ? "写真を変更" : "写真を選ぶ",
                                        systemImage: "photo.on.rectangle.angled"
                                    )
                                    .font(.system(size: 14, weight: .semibold))
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 11)
                                    .background(Capsule().fill(Color.white.opacity(0.92)))
                                    .foregroundStyle(Color(red: 0.2, green: 0.1, blue: 0.18))
                                }
                                if originalImage != nil {
                                    Button {
                                        isCropping = true
                                    } label: {
                                        Label("位置を調整", systemImage: "arrow.up.and.down.and.arrow.left.and.right")
                                            .font(.system(size: 14, weight: .medium))
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 11)
                                            .background(Capsule().fill(Color.white.opacity(0.12)))
                                            .foregroundStyle(.white)
                                    }
                                }
                            }

                            if isSetCapture {
                                Text("\(displayTextures.count) 本ぶんのデザインを取り込みました（セット表示）")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.6))
                            }

                            HStack(spacing: 8) {
                                ForEach(NailShape.allCases) { candidate in
                                    StagePill(label: candidate.label, isOn: shape == candidate) {
                                        shape = candidate
                                    }
                                }
                            }

                            if hasTexture {
                                retouchSection
                            }

                            VStack(spacing: 10) {
                                storyField("タイトル（例: 深海ネイル）", text: $title)
                                storyField("タグ（カンマ区切り。例: ピンク, マグネット）", text: $tagsText)
                                storyField("サロン名（任意）", text: $salon)
                                storyField("価格（任意・円）", text: $priceText)
                                    .keyboardType(.numberPad)
                                storyField("メモ（任意）", text: $memo, axis: .vertical)
                            }
                            .padding(.horizontal, 24)

                            Button(action: save) {
                                Text("宝石箱に入れる")
                                    .font(.system(size: 15, weight: .semibold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 13)
                                    .background(
                                        Capsule().fill(
                                            hasTexture
                                                ? Color(red: 0.83, green: 0.54, blue: 0.61)
                                                : Color.white.opacity(0.25)
                                        )
                                    )
                                    .foregroundStyle(.white)
                            }
                            .disabled(!hasTexture)
                            .padding(.horizontal, 24)
                            .padding(.top, 4)
                        }
                        .padding(.vertical, 16)
                    }
                    .scrollDismissesKeyboard(.interactively)
                }
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
                    originalImage = image
                    isCropping = true
                }
            }
        }
        .onAppear {
            if UserDefaults.standard.string(forKey: "debugPhoto") == "1", originalImage == nil {
                originalImage = NailStyle.samples[3].texture
                isCropping = true
            }
        }
        .fullScreenCover(isPresented: $isCropping) {
            if let originalImage {
                PhotoCropView(
                    image: originalImage,
                    nailShape: $shape,
                    onConfirm: { baked in
                        bakedTextures = [baked]
                        applyRetouch()
                        isCropping = false
                    },
                    onConfirmSet: { bakedList in
                        bakedTextures = bakedList
                        applyRetouch()
                        isCropping = false
                    },
                    onCancel: { isCropping = false }
                )
            }
        }
    }

    // MARK: - Retouch

    private var retouchSection: some View {
        VStack(spacing: 8) {
            retouchStepper("なめらか", value: $smoothStep, range: 0...5)
            retouchStepper("明るさ", value: $brightnessStep)
            retouchStepper("鮮やかさ", value: $saturationStep)
            retouchStepper("コントラスト", value: $contrastStep)
        }
        .padding(.horizontal, 24)
    }

    /// Discrete stepped adjustment with +/- buttons; applied instantly per tap.
    private func retouchStepper(
        _ label: String,
        value: Binding<Int>,
        range: ClosedRange<Int> = -5...5
    ) -> some View {
        HStack(spacing: 12) {
            Text(label)
                .font(.system(size: 12))
                .foregroundStyle(.white.opacity(0.65))
                .frame(width: 86, alignment: .leading)
            Button {
                guard value.wrappedValue > range.lowerBound else { return }
                value.wrappedValue -= 1
                applyRetouch()
                UISelectionFeedbackGenerator().selectionChanged()
            } label: {
                stepButtonIcon("minus")
            }
            Text(value.wrappedValue > 0 ? "+\(value.wrappedValue)" : "\(value.wrappedValue)")
                .font(.system(size: 14, weight: .semibold, design: .monospaced))
                .foregroundStyle(value.wrappedValue == 0 ? .white.opacity(0.5) : .white)
                .frame(width: 36)
            Button {
                guard value.wrappedValue < range.upperBound else { return }
                value.wrappedValue += 1
                applyRetouch()
                UISelectionFeedbackGenerator().selectionChanged()
            } label: {
                stepButtonIcon("plus")
            }
            Spacer()
        }
    }

    private func stepButtonIcon(_ name: String) -> some View {
        Image(systemName: name)
            .font(.system(size: 13, weight: .semibold))
            .foregroundStyle(.white)
            .frame(width: 32, height: 32)
            .background(Circle().fill(Color.white.opacity(0.12)))
    }

    private static let ciContext = CIContext()

    private func applyRetouch() {
        displayTextures = bakedTextures.map { retouched($0) }
    }

    private func retouched(_ image: UIImage) -> UIImage {
        guard smoothStep != 0 || brightnessStep != 0 || saturationStep != 0 || contrastStep != 0,
              let input = CIImage(image: image) else { return image }
        var working = input

        // Edge-preserving smoothing: median wipes speckle/grain, noise
        // reduction softens skin/gel texture while sharpness keeps art edges.
        if smoothStep > 0 {
            let median = CIFilter.median()
            median.inputImage = working
            working = median.outputImage ?? working
            let noise = CIFilter.noiseReduction()
            noise.inputImage = working
            noise.noiseLevel = Float(Double(smoothStep) * 0.012)
            noise.sharpness = 0.55
            working = noise.outputImage ?? working
        }

        if brightnessStep != 0 || saturationStep != 0 || contrastStep != 0 {
            let filter = CIFilter.colorControls()
            filter.inputImage = working
            filter.brightness = Float(Double(brightnessStep) * 0.04)
            filter.saturation = Float(1 + Double(saturationStep) * 0.12)
            filter.contrast = Float(1 + Double(contrastStep) * 0.05)
            working = filter.outputImage ?? working
        }

        guard let cgImage = Self.ciContext.createCGImage(working, from: input.extent) else { return image }
        return UIImage(cgImage: cgImage)
    }

    // MARK: - Save

    private func storyField(
        _ prompt: String,
        text: Binding<String>,
        axis: Axis = .horizontal
    ) -> some View {
        TextField(
            "",
            text: text,
            prompt: Text(prompt).foregroundStyle(.white.opacity(0.35)),
            axis: axis
        )
        .lineLimit(axis == .vertical ? 3...5 : 1...1)
        .textFieldStyle(.plain)
        .foregroundStyle(.white)
        .padding(.horizontal, 16)
        .padding(.vertical, 11)
        .background(RoundedRectangle(cornerRadius: 12).fill(Color.white.opacity(0.08)))
    }

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
            finish: .gloss,
            photoData: jpeg,
            salon: salon.trimmingCharacters(in: .whitespacesAndNewlines),
            priceYen: Int(priceText.trimmingCharacters(in: .whitespaces)),
            memo: memo.trimmingCharacters(in: .whitespacesAndNewlines),
            tags: tagsText
                .split(whereSeparator: { $0 == "," || $0 == "、" })
                .map { $0.trimmingCharacters(in: .whitespaces) }
                .filter { !$0.isEmpty },
            fingerPhotoData: fingerData
        )
        modelContext.insert(record)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        dismiss()
    }
}
