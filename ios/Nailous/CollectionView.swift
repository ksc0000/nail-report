import SwiftData
import SwiftUI

/// Home = the jewelry box. Saved nails sit on the shelf as nail-shaped jewels;
/// tapping one opens the spinnable stage. The"＋" starts the capture flow.
struct CollectionView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \NailRecord.createdAt, order: .reverse) private var records: [NailRecord]
    @State private var isAdding = false
    @State private var glowingID: UUID?
    @State private var selected: NailRecord?
    @State private var arrivalID: String?

    private let columns = [GridItem(.adaptive(minimum: 100), spacing: 18)]

    var body: some View {
        NavigationStack {
            ZStack {
                StageBackground()

                ScrollView {
                    VStack(spacing: 24) {
                        header

                        if records.isEmpty {
                            emptyState
                        } else {
                            jewelStage
                            shelf
                        }

                        sampleSection
                    }
                    .padding(.bottom, 48)
                }

                StageForeground(theme: .glass)
            }
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    GoldIconButton(systemName: "plus") { isAdding = true }
                }
            }
            .toolbarColorScheme(.dark, for: .navigationBar)
            .sheet(isPresented: $isAdding) {
                AddNailView()
            }
            .navigationDestination(item: $selected) { record in
                NailDetailView(
                    appearance: record.appearance ?? NailStyle.samples[0].appearance,
                    title: record.title,
                    subtitle: record.createdAt.formatted(.dateTime.year().month().day()),
                    record: record
                )
            }
            .onChange(of: records.first?.id) { _, newID in
                // A nail just joined the box: drop-in animation on the stage,
                // welcome glow on the shelf, success haptic.
                guard let newID,
                      let newest = records.first,
                      Date().timeIntervalSince(newest.createdAt) < 8 else { return }
                arrivalID = newID.uuidString
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                withAnimation(.easeInOut(duration: 0.7)) { glowingID = newID }
                Task {
                    try? await Task.sleep(for: .seconds(2.2))
                    withAnimation(.easeInOut(duration: 0.9)) { glowingID = nil }
                }
            }
        }
        .preferredColorScheme(.dark)
        .task {
            seedIfRequested()
            if UserDefaults.standard.string(forKey: "openAdd") == "1" {
                isAdding = true
            }
        }
    }

    private var header: some View {
        DisplayTitle(
            title: "コレクション",
            subtitle: records.isEmpty ? nil : "\(records.count) 個のネイル"
        )
        .padding(.top, 12)
    }

    private var emptyState: some View {
        VStack(spacing: 14) {
            Image(systemName: "sparkles")
                .font(.system(size: 34))
                .foregroundStyle(Palette.gold)
            Text("最初のネイルをコレクションへ")
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(.white)
            Text("サロン帰りの写真を選ぶだけで、\nあなたのネイルが指先で回せる3Dチップになります。")
                .font(.system(size: 13))
                .multilineTextAlignment(.center)
                .foregroundStyle(.white.opacity(0.6))
                .lineSpacing(3)
            Button {
                isAdding = true
            } label: {
                Text("ネイルを記録する")
                    .font(.system(size: 15, weight: .semibold))
                    .padding(.horizontal, 28)
                    .padding(.vertical, 12)
                    .background(Capsule().fill(Palette.goldGradient))
                    .foregroundStyle(Palette.ink0)
            }
            .padding(.top, 6)
        }
        .padding(.vertical, 30)
    }

    /// The five designs drifting on stage: the one being worn (if any) front
    /// and centre, then the newest.
    private var showcase: [NailRecord] {
        guard let wearing = records.first(where: { $0.wornSince != nil }) else {
            return Array(records.prefix(5))
        }
        return [wearing] + records.filter { $0.id != wearing.id }.prefix(4)
    }

    private var jewelStage: some View {
        VStack(spacing: 4) {
            if let first = showcase.first, let firstAppearance = first.appearance {
                ZStack {
                    JewelPodium()
                    NailSceneView(
                        appearance: firstAppearance,
                        shape: first.shape,
                        mode: .set,
                        plateParams: first.plateParams,
                        setAppearances: showcase.compactMap(\.appearance),
                        setShapes: showcase.map(\.shape),
                        layout: .cloud,
                        theme: .glass,
                        onTipTap: { index in
                            if showcase.indices.contains(index) {
                                selected = showcase[index]
                            }
                        },
                        arrivalID: arrivalID
                    )
                }
                .frame(height: 400)
                if let days = showcase.first?.wearDays, let title = showcase.first?.title {
                    HStack(spacing: 6) {
                        Circle().fill(Palette.goldBright).frame(width: 5, height: 5)
                        Text("装着中 ・ \(days)日目 — \(title)")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(Palette.goldBright.opacity(0.9))
                    }
                }
                Text("タップで開く・ドラッグで回転")
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.4))
            }
        }
    }

    private var shelf: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(title: "最近のネイル")

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(records) { record in
                        if let texture = record.texture {
                            Button {
                                selected = record
                            } label: {
                                VStack(spacing: 6) {
                                    NailThumbnail(image: texture, nailShape: record.shape)
                                        .scaleEffect(0.76)
                                        .frame(width: 66, height: 100)
                                        .shadow(
                                            color: glowingID == record.id
                                                ? Palette.goldBright.opacity(0.85)
                                                : .clear,
                                            radius: 14
                                        )
                                        .overlay(alignment: .topTrailing) {
                                            if record.wornSince != nil {
                                                Circle()
                                                    .fill(Palette.goldBright)
                                                    .frame(width: 7, height: 7)
                                                    .shadow(color: Palette.gold, radius: 4)
                                                    .offset(x: -4, y: 10)
                                            }
                                        }
                                    Text(record.title)
                                        .font(.system(size: 11))
                                        .lineLimit(1)
                                        .foregroundStyle(.white.opacity(0.7))
                                        .frame(width: 76)
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 4)
            }
        }
    }

    private var sampleSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "サンプルデザイン")

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 18) {
                    ForEach(NailStyle.samples) { style in
                        NavigationLink {
                            NailDetailView(
                                appearance: style.appearance,
                                title: style.label,
                                subtitle: "サンプル"
                            )
                        } label: {
                            VStack(spacing: 10) {
                                NailThumbnail(image: style.texture, nailShape: .squoval)
                                Text(style.label)
                                    .font(.system(size: 12))
                                    .lineLimit(1)
                                    .foregroundStyle(.white.opacity(0.75))
                            }
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 6)
            }
        }
    }

    /// `-seedDemo 1` launch argument inserts one demo record so the collection
    /// UI can be verified headlessly in the simulator.
    private func seedIfRequested() {
        guard UserDefaults.standard.string(forKey: "seedDemo") == "1", records.isEmpty else { return }
        let sample = NailStyle.samples[3]
        guard let jpeg = sample.texture.jpegData(compressionQuality: 0.85) else { return }
        modelContext.insert(
            NailRecord(title: "深海ネイル", shape: .oval, finish: .gloss, photoData: jpeg)
        )
        let second = NailStyle.samples[1]
        if let jpeg2 = second.texture.jpegData(compressionQuality: 0.85) {
            modelContext.insert(
                NailRecord(title: "グレージュ", shape: .squoval, finish: .gloss, photoData: jpeg2)
            )
        }
    }
}
