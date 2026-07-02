import PhotosUI
import SwiftData
import SwiftUI

/// The capture flow: pick a photo → position it under the nail window → it
/// appears live on the 3D nail → add the story → into the jewelry box.
struct AddNailView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var pickerItem: PhotosPickerItem?
    @State private var originalImage: UIImage?
    @State private var texture: UIImage?
    @State private var isCropping = false
    @State private var shape: NailShape = .squoval
    @State private var title = ""
    @State private var salon = ""
    @State private var priceText = ""
    @State private var memo = ""
    @State private var tagsText = ""

    private var previewAppearance: NailAppearance {
        if let texture {
            return NailAppearance(id: "picked-\(texture.hashValue)", texture: texture, finish: .gloss)
        }
        return NailStyle.samples[0].appearance
    }

    var body: some View {
        NavigationStack {
            ZStack {
                StageBackground()

                VStack(spacing: 0) {
                    NailSceneView(appearance: previewAppearance, shape: shape, mode: .single)
                        .frame(height: 300)
                        .overlay(alignment: .bottom) {
                            if texture == nil {
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
                                        texture == nil ? "写真を選ぶ" : "写真を変更",
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

                            HStack(spacing: 8) {
                                ForEach(NailShape.allCases) { candidate in
                                    StagePill(label: candidate.label, isOn: shape == candidate) {
                                        shape = candidate
                                    }
                                }
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
                                            texture == nil
                                                ? Color.white.opacity(0.25)
                                                : Color(red: 0.83, green: 0.54, blue: 0.61)
                                        )
                                    )
                                    .foregroundStyle(.white)
                            }
                            .disabled(texture == nil)
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
            // -debugPhoto 1: preload a generated image so the crop flow can be
            // exercised headlessly in the simulator.
            if UserDefaults.standard.string(forKey: "debugPhoto") == "1", originalImage == nil {
                originalImage = NailStyle.samples[3].texture
                isCropping = true
            }
        }
        .fullScreenCover(isPresented: $isCropping) {
            if let originalImage {
                PhotoCropView(
                    image: originalImage,
                    nailShape: shape,
                    onConfirm: { baked in
                        texture = baked
                        isCropping = false
                    },
                    onCancel: { isCropping = false }
                )
            }
        }
    }

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
        guard let texture,
              let jpeg = texture.jpegData(compressionQuality: 0.85) else { return }
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
                .filter { !$0.isEmpty }
        )
        modelContext.insert(record)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        dismiss()
    }
}
