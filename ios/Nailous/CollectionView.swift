import SwiftData
import SwiftUI

/// How the month rows on the home field are labelled (#373). Stored as a raw
/// string so `@AppStorage` can hold it; `kanji` is the default.
enum MonthLabelStyle: String, CaseIterable, Identifiable {
    case kanji, abbreviated, full

    var id: String { rawValue }

    /// Sample shown in the picker so the choice is visual, not described.
    var sample: String { label(month: 7) }

    func label(month: Int) -> String {
        let name = Self.englishMonths[max(0, min(11, month - 1))]
        switch self {
        case .kanji: return "\(month)月"
        case .abbreviated: return String(name.prefix(3)).uppercased()
        case .full: return name
        }
    }

    /// Kerning that keeps each style legible inside the label column.
    var kerning: CGFloat { self == .full ? 0.5 : 2 }
    var columnWidth: CGFloat { self == .full ? 72 : 44 }

    private static let englishMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ]
}

/// Home = the collection itself: every saved nail as a small chip, laid out in
/// rows by month like a salon's colour chart kept on your own timeline. The
/// one being worn carries a thin gold ring. Tapping a chip opens the 3D stage —
/// the spin is the reward for touching, not the default view.
struct CollectionView: View {
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var deletionUndo: DeletionUndoStore
    @Query(sort: \NailRecord.createdAt, order: .reverse) private var records: [NailRecord]
    @State private var isAdding = false
    @State private var glowingID: UUID?
    @State private var selected: NailRecord?
    @State private var gridShown = false
    @AppStorage("monthLabelStyle") private var monthLabelStyleRaw = MonthLabelStyle.kanji.rawValue

    private var monthLabelStyle: MonthLabelStyle {
        MonthLabelStyle(rawValue: monthLabelStyleRaw) ?? .kanji
    }


    var body: some View {
        NavigationStack {
            ZStack {
                Palette.paper.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        header

                        if records.isEmpty {
                            emptyState
                            sampleSection
                        } else {
                            monthField
                        }
                    }
                    .padding(.bottom, 56)
                }

                if deletionUndo.blocksUnderlyingInteraction {
                    Rectangle()
                        .fill(.clear)
                        .contentShape(Rectangle())
                        .ignoresSafeArea()
                        .onTapGesture { }
                }

                if deletionUndo.pending != nil {
                    HStack(spacing: 16) {
                        Text("削除しました")
                            .font(.system(size: 14, weight: .medium))
                        ProgressView(value: deletionUndo.remainingProgress)
                            .tint(Palette.goldBright)
                            .frame(width: 42)
                        Button("取り消す") {
                            deletionUndo.undo(in: modelContext)
                        }
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Palette.goldBright)
                    }
                    .foregroundStyle(.white)
                    .padding(.horizontal, 18)
                    .padding(.vertical, 13)
                    .background(Palette.inkWarm.opacity(0.94), in: Capsule())
                    .shadow(color: .black.opacity(0.18), radius: 12, y: 5)
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                    .frame(maxHeight: .infinity, alignment: .bottom)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .animation(.easeInOut(duration: 0.25), value: deletionUndo.pending != nil)
            .toolbar(.hidden, for: .navigationBar)
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
            .navigationDestination(isPresented: $gridShown) {
                CollectionGridView(records: records) { selected = $0 }
            }
            .onChange(of: records.first?.id) { _, newID in
                // A nail just joined: a brief gold glow on its chip, success haptic.
                guard let newID,
                      let newest = records.first,
                      Date().timeIntervalSince(newest.createdAt) < 8 else { return }
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                withAnimation(.easeInOut(duration: 0.7)) { glowingID = newID }
                Task {
                    try? await Task.sleep(for: .seconds(2.2))
                    withAnimation(.easeInOut(duration: 0.9)) { glowingID = nil }
                }
            }
        }
        .task {
            renderDebugCards()
            seedIfRequested()
            if UserDefaults.standard.string(forKey: "openAdd") == "1" {
                isAdding = true
            }
            if UserDefaults.standard.string(forKey: "openGrid") == "1" {
                try? await Task.sleep(for: .seconds(0.4))
                gridShown = true
            }
            if UserDefaults.standard.string(forKey: "openFirst") == "1", let first = records.first {
                try? await Task.sleep(for: .seconds(0.4))
                selected = first
            }
        }
    }

    // MARK: - Header

    private var thisYear: Int { Calendar.current.component(.year, from: Date()) }

    private var header: some View {
        HStack(alignment: .bottom) {
            VStack(alignment: .leading, spacing: 6) {
                Text("NAILOUS")
                    .font(.system(size: 11, weight: .regular, design: .serif))
                    .kerning(5)
                    .foregroundStyle(Palette.mutedWarm)
                if !records.isEmpty {
                    Text("\(String(thisYear)) ・ \(records.count)本")
                        .font(.system(size: 11, weight: .light))
                        .kerning(2)
                        .foregroundStyle(Palette.mutedWarm)
                }
            }
            Spacer()
            HStack(spacing: 10) {
                if !records.isEmpty {
                    outlineButton(systemName: "magnifyingglass") { gridShown = true }
                }
                displayMenu
                outlineButton(systemName: "plus") { isAdding = true }
            }
        }
        .padding(.horizontal, 30)
        .padding(.top, 18)
    }

    private func outlineButton(systemName: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            outlineIcon(systemName)
        }
        .buttonStyle(.plain)
    }

    private func outlineIcon(_ systemName: String) -> some View {
        Image(systemName: systemName)
            .font(.system(size: 14, weight: .regular))
            .foregroundStyle(Palette.inkWarm)
            .frame(width: 36, height: 36)
            .overlay(Circle().stroke(Palette.inkWarm, lineWidth: 1))
            .contentShape(Circle())
    }

    /// Display preferences for the field. Kept as a quiet menu rather than a
    /// settings screen: one choice today (#373), room for more later.
    private var displayMenu: some View {
        Menu {
            Picker("月の表記", selection: $monthLabelStyleRaw) {
                ForEach(MonthLabelStyle.allCases) { style in
                    Text(style.sample).tag(style.rawValue)
                }
            }
        } label: {
            outlineIcon("ellipsis")
        }
        .buttonStyle(.plain)
        .accessibilityLabel("表示設定")
    }

    // MARK: - Month field

    private struct MonthGroup: Identifiable {
        let id: String
        let year: Int
        let month: Int
        let records: [NailRecord]
    }

    /// Records grouped by calendar month, newest month first, newest nail
    /// first within the month. Earlier years get a small year line under the
    /// month so the chart stays legible across years.
    private var monthGroups: [MonthGroup] {
        let calendar = Calendar.current
        var buckets: [String: (year: Int, month: Int, items: [NailRecord])] = [:]
        for record in records {
            let comps = calendar.dateComponents([.year, .month], from: record.createdAt)
            guard let y = comps.year, let m = comps.month else { continue }
            let key = String(format: "%04d-%02d", y, m)
            buckets[key, default: (y, m, [])].items.append(record)
        }
        return buckets
            .sorted { $0.key > $1.key }
            .map { key, value in
                MonthGroup(id: key, year: value.year, month: value.month, records: value.items)
            }
    }

    private let chipSize = CGSize(width: 44, height: 64)
    private let chipColumns = [GridItem(.adaptive(minimum: 44, maximum: 44), spacing: 12, alignment: .top)]

    private var monthField: some View {
        VStack(alignment: .leading, spacing: 28) {
            ForEach(monthGroups) { group in
                HStack(alignment: .top, spacing: 18) {
                    VStack(alignment: .leading, spacing: 3) {
                        Text(monthLabelStyle.label(month: group.month))
                            .font(.system(size: 13, weight: .regular, design: .serif))
                            .kerning(monthLabelStyle.kerning)
                        if group.year != thisYear {
                            Text(String(group.year))
                                .font(.system(size: 10, weight: .regular, design: .serif))
                                .kerning(1.5)
                        }
                    }
                    .foregroundStyle(Palette.mutedWarm)
                    .lineLimit(1)
                    .minimumScaleFactor(0.85)
                    .frame(width: monthLabelStyle.columnWidth, alignment: .leading)
                    .padding(.top, 22)
                    LazyVGrid(columns: chipColumns, alignment: .leading, spacing: 16) {
                        ForEach(group.records) { record in
                            chip(record)
                        }
                    }
                }
            }
        }
        .padding(.horizontal, 30)
        .padding(.top, 52)
    }

    private func chip(_ record: NailRecord) -> some View {
        Group {
            if let texture = record.texture {
                Button {
                    selected = record
                } label: {
                    VStack(spacing: 7) {
                        NailThumbnail(
                            image: texture,
                            nailShape: record.shape,
                            size: chipSize,
                            shadowColor: .black.opacity(0.12),
                            shadowRadius: 8,
                            shadowY: 4
                        )
                        .overlay {
                            if record.wornSince != nil {
                                Ellipse()
                                    .stroke(Palette.goldHairline, lineWidth: 1.2)
                                    .padding(-7)
                            }
                        }
                        .shadow(
                            color: glowingID == record.id ? Palette.goldHairline.opacity(0.9) : .clear,
                            radius: 14
                        )
                        if let days = record.wearDays {
                            Text("\(days)日目")
                                .font(.system(size: 9, weight: .regular))
                                .kerning(1)
                                .foregroundStyle(Palette.mutedWarm)
                        }
                    }
                    .padding(.top, 8)
                }
                .buttonStyle(.plain)
            }
        }
    }

    // MARK: - Empty state

    private var emptyState: some View {
        VStack(spacing: 14) {
            Image(systemName: "sparkles")
                .font(.system(size: 30))
                .foregroundStyle(Palette.goldHairline)
            Text("最初のネイルをコレクションへ")
                .font(.system(size: 17, weight: .medium, design: .serif))
                .foregroundStyle(Palette.inkWarm)
            Text("サロン帰りの写真を選ぶだけで、\nあなたのネイルが指先で回せる3Dチップになります。")
                .font(.system(size: 13, weight: .light))
                .multilineTextAlignment(.center)
                .foregroundStyle(Palette.mutedWarm)
                .lineSpacing(3)
            Button {
                isAdding = true
            } label: {
                Text("ネイルを記録する")
                    .font(.system(size: 13, weight: .regular))
                    .kerning(2)
                    .foregroundStyle(Palette.inkWarm)
                    .padding(.horizontal, 28)
                    .padding(.vertical, 13)
                    .overlay(Capsule().stroke(Palette.inkWarm, lineWidth: 1))
            }
            .buttonStyle(.plain)
            .padding(.top, 6)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 120)
        .padding(.bottom, 40)
    }

    /// Sample designs to try before the first real record — hidden once the
    /// collection has anything of the user's own in it.
    private var sampleSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("サンプル")
                .font(.system(size: 11, weight: .regular, design: .serif))
                .kerning(3)
                .foregroundStyle(Palette.mutedWarm)
                .padding(.horizontal, 30)

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
                                NailThumbnail(
                                    image: style.texture,
                                    nailShape: .squoval,
                                    size: CGSize(width: 60, height: 88),
                                    shadowColor: .black.opacity(0.12),
                                    shadowRadius: 8,
                                    shadowY: 4
                                )
                                Text(style.label)
                                    .font(.system(size: 11))
                                    .lineLimit(1)
                                    .foregroundStyle(Palette.mutedWarm)
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 30)
                .padding(.vertical, 6)
            }
        }
        .padding(.top, 10)
    }

    /// `-debugCards 1` renders every card template to Documents so the
    /// composition can be checked headlessly in the simulator.
    private func renderDebugCards() {
        guard UserDefaults.standard.string(forKey: "debugCards") == "1" else { return }
        let stamp = NailStyle.samples[1].texture
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        for template in CardTemplate.allCases {
            if let card = CardRenderer.render(
                template: template,
                stamp: stamp,
                title: "深海ネイル",
                date: Date(),
                subtitle: template == .salon ? "Salon Lumière" : nil
            ), let png = card.pngData() {
                try? png.write(to: docs.appendingPathComponent("card_\(template.rawValue).png"))
            }
        }
    }

    /// `-seedDemo 1` launch argument inserts one demo record so the collection
    /// UI can be verified headlessly in the simulator.
    private func seedIfRequested() {
        guard UserDefaults.standard.string(forKey: "seedDemo") == "1", records.isEmpty else { return }
        let specs: [(NailStyle, String, NailShape, [String], Bool, Int)] = [
            (NailStyle.samples[3], "深海ネイル", .oval, ["ブルー", "グラデ"], true, 0),
            (NailStyle.samples[1], "グレージュ", .squoval, ["ベージュ", "マグネット"], false, 9),
            (NailStyle.samples[0], "シアーローズ", .almond, ["ピンク", "シアー"], true, 18),
            (NailStyle.samples[2], "ラメフレンチ", .coffin, ["フレンチ", "ラメ"], false, 27),
            (NailStyle.samples[1], "ミルクティー", .round, ["ベージュ"], false, 41),
            (NailStyle.samples[0], "桜", .oval, ["ピンク"], false, 55),
            (NailStyle.samples[3], "ネイビー", .squoval, ["ブルー"], false, 63),
            (NailStyle.samples[2], "パールフレンチ", .almond, ["フレンチ"], true, 84),
            (NailStyle.samples[1], "グレージュ2", .coffin, ["ベージュ"], false, 95),
        ]
        for (index, (style, title, shape, tags, fav, daysAgo)) in specs.enumerated() {
            guard let jpeg = style.texture.jpegData(compressionQuality: 0.85) else { continue }
            let record = NailRecord(title: title, shape: shape, finish: .gloss, photoData: jpeg, tags: tags)
            record.isFavorite = fav
            record.createdAt = Calendar.current.date(byAdding: .day, value: -daysAgo, to: Date()) ?? Date()
            if index == 0 { record.wornSince = Calendar.current.date(byAdding: .day, value: -2, to: Date()) }
            modelContext.insert(record)
        }
    }
}
