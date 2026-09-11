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

    /// `label(month:)` with `year` folded in when it isn't `currentYear`;
    /// used where the month stands alone, such as the recap card title (#377).
    func label(month: Int, year: Int, currentYear: Int) -> String {
        let bare = label(month: month)
        guard year != currentYear else { return bare }
        switch self {
        case .kanji: return "\(year)年\(month)月"
        case .abbreviated, .full: return "\(bare) \(year)"
        }
    }

    /// Kerning that keeps each style legible inside the label column.
    var kerning: CGFloat { self == .full ? 0.5 : 2 }

    /// Wide enough for the month alone; a past year sits on its own line
    /// under the month, so the column stays narrow and the chips stay close.
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
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @ScaledMetric(relativeTo: .caption) private var monthFontSize = 13.0
    @ScaledMetric(relativeTo: .caption2) private var captionFontSize = 11.0
    @ScaledMetric(relativeTo: .caption2) private var wearFontSize = 9.0
    @ScaledMetric(relativeTo: .headline) private var emptyTitleFontSize = 17.0
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var deletionUndo: DeletionUndoStore
    @Query(sort: \NailRecord.createdAt, order: .reverse) private var records: [NailRecord]
    @State private var isAdding = false
    @State private var glowingID: UUID?
    @State private var selected: NailRecord?
    @State private var gridShown = false
    @State private var recapCard: RecapCardPayload?
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
        .sheet(item: $recapCard) { card in
            RecapSheet(image: card.image, monthTitle: card.monthTitle)
        }
        .task {
            renderDebugCards()
            renderDebugRecap()
            seedIfRequested()
            if UserDefaults.standard.string(forKey: "openAdd") == "1" {
                isAdding = true
            }
            if UserDefaults.standard.string(forKey: "openGrid") == "1" {
                try? await Task.sleep(for: .seconds(0.4))
                gridShown = true
            }
            if UserDefaults.standard.string(forKey: "openRecap") == "1", let firstGroup = monthGroups.first {
                try? await Task.sleep(for: .seconds(0.4))
                presentRecap(for: firstGroup)
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
        let layout = dynamicTypeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: 16))
            : AnyLayout(HStackLayout(alignment: .bottom))
        return layout {
            VStack(alignment: .leading, spacing: 6) {
                Text("NAILOUS")
                    .font(.system(size: captionFontSize, weight: .regular, design: .serif))
                    .kerning(5)
                    .foregroundStyle(Palette.mutedWarm)
                if !records.isEmpty {
                    Text("\(String(thisYear)) ・ \(records.count)本")
                        .font(.system(size: captionFontSize, weight: .light))
                        .kerning(2)
                        .foregroundStyle(Palette.mutedWarm)
                }
            }
            if !dynamicTypeSize.isAccessibilitySize { Spacer() }
            HStack(spacing: 10) {
                if !records.isEmpty {
                    outlineButton(systemName: "magnifyingglass", label: "コレクションを検索") { gridShown = true }
                }
                displayMenu
                outlineButton(systemName: "plus", label: "ネイルを記録する") { isAdding = true }
            }
        }
        .padding(.horizontal, 30)
        .padding(.top, 18)
    }

    private func outlineButton(systemName: String, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            outlineIcon(systemName)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private func outlineIcon(_ systemName: String) -> some View {
        Image(systemName: systemName)
            .font(.system(size: 14, weight: .regular))
            .foregroundStyle(Palette.inkWarm)
            .frame(width: 36, height: 36)
            .overlay(Circle().stroke(Palette.inkWarm, lineWidth: 1))
            .frame(width: 44, height: 44)
            .contentShape(Rectangle())
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
    private var usesStackedMonths: Bool { dynamicTypeSize >= .xxxLarge }

    private var monthField: some View {
        VStack(alignment: .leading, spacing: 28) {
            ForEach(monthGroups) { group in
                if usesStackedMonths {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            monthLabel(group)
                            Spacer(minLength: 12)
                            recapButton(group)
                        }
                        monthChips(group)
                    }
                } else {
                    HStack(alignment: .top, spacing: 18) {
                        monthLabel(group)
                            .frame(width: monthLabelStyle.columnWidth * max(1, monthFontSize / 13), alignment: .leading)
                            .padding(.top, 22)
                        monthChips(group)
                        recapButton(group)
                            .padding(.top, 14)
                    }
                }
            }
        }
        .padding(.horizontal, 30)
        .padding(.top, 52)
    }

    private func monthLabel(_ group: MonthGroup) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(monthLabelStyle.label(month: group.month))
                .font(.system(size: monthFontSize, weight: .regular, design: .serif))
                .kerning(monthLabelStyle.kerning)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
            if group.year != thisYear {
                Text(String(group.year))
                    .font(.system(size: captionFontSize))
            }
        }
        .foregroundStyle(Palette.mutedWarm)
        .fixedSize(horizontal: false, vertical: true)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(String(group.year))年\(group.month)月")
        .accessibilityAddTraits(.isHeader)
    }

    private func monthChips(_ group: MonthGroup) -> some View {
        // A leading-aligned flow rather than LazyVGrid: inside the month row's
        // HStack a lazy grid claimed only two columns and centred them, so the
        // chips drifted away from their month label.
        ChipFlow(horizontalSpacing: 12, verticalSpacing: 16) {
            ForEach(group.records) { record in
                chip(record)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func recapButton(_ group: MonthGroup) -> some View {
        Button {
            presentRecap(for: group)
        } label: {
            Image(systemName: "square.and.arrow.up")
                .font(.system(size: 12, weight: .regular))
                .foregroundStyle(Palette.mutedWarm)
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(String(group.year))年\(group.month)月のリキャップを共有")
    }

    /// One month's records as a share payload; `Identifiable` so `.sheet(item:)`
    /// can present it directly.
    private struct RecapCardPayload: Identifiable {
        let id: String
        let image: UIImage
        let monthTitle: String
    }

    private func presentRecap(for group: MonthGroup) {
        guard let image = RecapCardRenderer.render(records: group.records, month: group.month, year: group.year)
        else { return }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        recapCard = RecapCardPayload(
            id: group.id,
            image: image,
            monthTitle: monthLabelStyle.label(month: group.month, year: group.year, currentYear: thisYear)
        )
    }

    private func chip(_ record: NailRecord) -> some View {
        let texture = record.texture
        return Button {
            selected = record
        } label: {
            VStack(spacing: 12) {
                Group {
                    if let texture {
                        NailThumbnail(
                            image: texture,
                            nailShape: record.shape,
                            params: record.plateParams,
                            size: chipSize,
                            shadowColor: .black.opacity(0.12),
                            shadowRadius: 8,
                            shadowY: 4,
                            worn: record.wornSince != nil
                        )
                    } else {
                        NailSilhouette(nailShape: record.shape)
                            .fill(Palette.mutedWarm.opacity(0.12))
                            .overlay {
                                Image(systemName: "photo.badge.exclamationmark")
                                    .font(.system(size: 17))
                                    .foregroundStyle(Palette.mutedWarm)
                            }
                            .frame(width: chipSize.width, height: chipSize.height)
                    }
                }
                .shadow(
                    color: glowingID == record.id ? Palette.goldHairline.opacity(0.9) : .clear,
                    radius: 14
                )
                if let days = record.wearDays {
                    Text("\(days)日目")
                        .font(.system(size: wearFontSize, weight: .regular))
                        .kerning(1)
                        .foregroundStyle(Palette.mutedWarm)
                }
            }
            .padding(.top, 8)
            .frame(minWidth: 44, minHeight: 44)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(record.title)、\(record.createdAt.formatted(.dateTime.year().month().day()))")
        .accessibilityValue([texture == nil ? "写真を読み込めません" : nil, record.wearDays.map { "着用中、\($0)日目" }].compactMap { $0 }.joined(separator: "、"))
        .accessibilityHint("ネイルの詳細を開きます")
    }

    // MARK: - Empty state

    private var emptyState: some View {
        VStack(spacing: 14) {
            // Brand mark: one almond chip drawn with a single gold hairline.
            NailSilhouette(nailShape: .almond)
                .stroke(Palette.goldHairline, lineWidth: 1.2)
                .frame(width: 24, height: 50)
                .padding(.bottom, 6)
                .accessibilityHidden(true)
            Text("最初のネイルをコレクションへ")
                .font(.system(size: emptyTitleFontSize, weight: .medium, design: .serif))
                .multilineTextAlignment(.center)
                .foregroundStyle(Palette.inkWarm)
            Text("サロン帰りの写真を選ぶだけで、\nあなたのネイルが指先で回せる3Dチップになります。")
                .font(.system(size: monthFontSize, weight: .light))
                .multilineTextAlignment(.center)
                .foregroundStyle(Palette.mutedWarm)
                .lineSpacing(3)
            Button {
                isAdding = true
            } label: {
                Text("ネイルを記録する")
                    .font(.system(size: monthFontSize, weight: .regular))
                    .multilineTextAlignment(.center)
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
        .padding(.horizontal, 24)
        .padding(.top, dynamicTypeSize.isAccessibilitySize ? 40 : 120)
        .padding(.bottom, 40)
    }

    /// Sample designs to try before the first real record — hidden once the
    /// collection has anything of the user's own in it.
    private var sampleSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("サンプル")
                .font(.system(size: captionFontSize, weight: .regular, design: .serif))
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
                                    .font(.system(size: captionFontSize))
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

    /// `-debugRecap 1` renders the monthly recap card for 1/3/8-nail months,
    /// twice each, so the scatter composition and its determinism (pass 1 ==
    /// pass 2 for the same records) can both be checked headlessly (#374).
    private func renderDebugRecap() {
        guard UserDefaults.standard.string(forKey: "debugRecap") == "1" else { return }
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        for count in [1, 3, 8] {
            let sample = (0..<count).map { i -> NailRecord in
                let style = NailStyle.samples[i % NailStyle.samples.count]
                let jpeg = style.texture.jpegData(compressionQuality: 0.85) ?? Data()
                let record = NailRecord(
                    title: "サンプル\(i)",
                    shape: NailShape.allCases[i % NailShape.allCases.count],
                    finish: .gloss,
                    photoData: jpeg
                )
                if i == 0 { record.wornSince = Date() }
                if i == 1 { record.isFavorite = true }
                return record
            }
            for pass in 1...2 {
                if let card = RecapCardRenderer.render(records: sample, month: 7, year: 2026),
                   let png = card.pngData() {
                    try? png.write(to: docs.appendingPathComponent("recap_\(count)_pass\(pass).png"))
                }
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

/// Leading-aligned wrapping row of fixed-size chips. Each subview keeps its
/// own size; rows break when the next chip would overflow the proposed width.
private struct ChipFlow: Layout {
    var horizontalSpacing: CGFloat
    var verticalSpacing: CGFloat

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let frames = layout(in: proposal.width ?? .infinity, subviews: subviews)
        let width = frames.map(\.maxX).max() ?? 0
        let height = frames.map(\.maxY).max() ?? 0
        return CGSize(width: proposal.width ?? width, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let frames = layout(in: bounds.width, subviews: subviews)
        for (subview, frame) in zip(subviews, frames) {
            subview.place(
                at: CGPoint(x: bounds.minX + frame.minX, y: bounds.minY + frame.minY),
                proposal: ProposedViewSize(frame.size)
            )
        }
    }

    private func layout(in width: CGFloat, subviews: Subviews) -> [CGRect] {
        var frames: [CGRect] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x > 0, x + size.width > width {
                x = 0
                y += rowHeight + verticalSpacing
                rowHeight = 0
            }
            frames.append(CGRect(origin: CGPoint(x: x, y: y), size: size))
            x += size.width + horizontalSpacing
            rowHeight = max(rowHeight, size.height)
        }
        return frames
    }
}
