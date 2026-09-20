import SwiftData
import SwiftUI

/// The full collection as a scrollable grid, filterable by ♡ favourites and by
/// tag. The home shelf only shows the newest few; this is where a grown
/// collection is browsed and rediscovered.
struct CollectionGridView: View {
    let records: [NailRecord]
    let onSelect: (NailRecord) -> Void

    /// nil = すべて, "" sentinel = favourites, otherwise a tag.
    @State private var activeTag: String?
    @State private var favoritesOnly = false
    @State private var searchText = ""
    @State private var sortOrder: CollectionSortOrder = .newest

    @ScaledMetric(relativeTo: .caption) private var pillFontSize = 12.5
    @ScaledMetric(relativeTo: .caption) private var cardTitleFontSize = 12.0
    @ScaledMetric(relativeTo: .caption2) private var cardDateFontSize = 10.0
    @ScaledMetric(relativeTo: .subheadline) private var emptyFilterFontSize = 14.0
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize

    private let columns = [GridItem(.adaptive(minimum: 104), spacing: 16)]

    /// Tags across the collection, most frequent first.
    private var allTags: [String] {
        var counts: [String: Int] = [:]
        for record in records {
            for tag in record.tags { counts[tag, default: 0] += 1 }
        }
        return counts.sorted { $0.value > $1.value || ($0.value == $1.value && $0.key < $1.key) }
            .map(\.key)
    }

    private var filtered: [NailRecord] {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
            .folding(options: [.caseInsensitive, .diacriticInsensitive], locale: .current)
        let matching = records.filter { record in
            (!favoritesOnly || record.isFavorite)
                && (activeTag == nil || record.tags.contains(activeTag!))
                && (query.isEmpty || record.searchableText.localizedCaseInsensitiveContains(query))
        }
        return matching.sorted { sortOrder.areInOrder($0, $1) }
    }

    var body: some View {
        ZStack {
            Palette.paper.ignoresSafeArea()

            ScrollView {
                searchBar
                    .padding(.horizontal, 20)
                    .padding(.bottom, 10)

                filterBar
                    .padding(.top, 8)
                    .padding(.bottom, 14)

                if filtered.isEmpty {
                    emptyFilter
                } else {
                    LazyVGrid(columns: columns, spacing: 20) {
                        ForEach(filtered) { record in
                            card(record)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
                }
            }

        }
        .navigationTitle("すべてのネイル")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarColorScheme(.light, for: .navigationBar)
        .tint(Palette.inkWarm)
        .environment(\.stageIsLight, true)
        .preferredColorScheme(.light)
    }

    @ViewBuilder private var filterPills: some View {
        StagePill(label: "すべて", isOn: activeTag == nil && !favoritesOnly, fontSize: pillFontSize) {
            activeTag = nil
            favoritesOnly = false
        }
        StagePill(label: "♡ お気に入り", isOn: favoritesOnly, fontSize: pillFontSize) {
            favoritesOnly.toggle()
        }
        ForEach(allTags, id: \.self) { tag in
            StagePill(label: "#\(tag)", isOn: activeTag == tag, fontSize: pillFontSize) {
                activeTag = (activeTag == tag) ? nil : tag
            }
        }
    }

    private var sortButton: some View {
        Menu {
            Picker("並べ替え", selection: $sortOrder) {
                ForEach(CollectionSortOrder.allCases) { order in
                    Text(order.title).tag(order)
                }
            }
        } label: {
            Image(systemName: "arrow.up.arrow.down")
                .font(.system(size: 13, weight: .regular))
                .foregroundStyle(Palette.inkWarm)
                .frame(width: 38, height: 34)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Palette.inkWarm.opacity(0.35), lineWidth: 1))
        }
    }

    private var filterBar: some View {
        Group {
            if dynamicTypeSize.isAccessibilitySize {
                // At accessibility sizes a single scrolling row can't fit even
                // one chip's full label, so every chip wraps into as many rows
                // as it takes instead — no fade mask, no hidden chips (#387).
                VStack(alignment: .trailing, spacing: 10) {
                    sortButton
                    FlowLayout(spacing: 8) {
                        filterPills
                    }
                }
                .padding(.horizontal, 20)
            } else {
                // The sort button lives in its own fixed column, outside the
                // horizontal scroller, so no chip can ever end up underneath it
                // regardless of scroll position (see #380, #384).
                HStack(spacing: 4) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            filterPills
                        }
                        .padding(.leading, 20)
                        .padding(.trailing, 4)
                    }
                    .mask(
                        LinearGradient(
                            stops: [
                                .init(color: .black, location: 0),
                                .init(color: .black, location: 0.92),
                                .init(color: .clear, location: 1),
                            ],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )

                    sortButton
                        .padding(.trailing, 20)
                }
            }
        }
    }

    private var searchBar: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(Palette.mutedWarm)
            TextField("タイトル・サロン・メモ・タグを検索", text: $searchText)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .foregroundStyle(Palette.inkWarm)
            if !searchText.isEmpty {
                Button { searchText = "" } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(Palette.mutedWarm)
                }
                .accessibilityLabel("検索を消去")
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 42)
        .background(Palette.inkWarm.opacity(0.05), in: RoundedRectangle(cornerRadius: 12))
    }

    private func card(_ record: NailRecord) -> some View {
        let texture = record.texture
        return Button {
            onSelect(record)
        } label: {
            VStack(spacing: 7) {
                Group {
                    if let set = record.setAppearances, set.count > 1 {
                        HandChipBundle(
                            textures: set.map(\.texture),
                            shapes: record.fingerShapes ?? Array(repeating: record.shape, count: set.count),
                            params: record.plateParams,
                            hand: record.hand,
                            chipHeight: 36, // ≈ 92pt wide, inside the 96pt cell
                            worn: record.wornSince != nil
                        )
                        .frame(width: 96, height: 132)
                    } else if let texture {
                        NailThumbnail(
                            image: texture,
                            nailShape: record.shape,
                            params: record.plateParams,
                            size: CGSize(width: 96, height: 132),
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
                            .frame(width: 96, height: 132)
                    }
                }
                .overlay(alignment: .topTrailing) {
                    if record.isFavorite {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(Palette.goldHairline)
                            .offset(x: 2, y: -2)
                    }
                }
                Text(record.title)
                    .font(.system(size: cardTitleFontSize))
                    .lineLimit(1)
                    .foregroundStyle(Palette.inkWarm)
                Text(record.createdAt.formatted(.dateTime.year().month(.abbreviated)))
                    .font(.system(size: cardDateFontSize))
                    .kerning(0.5)
                    .lineLimit(1)
                    .foregroundStyle(Palette.mutedWarm)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(record.title)、\(record.createdAt.formatted(.dateTime.year().month().day()))")
        .accessibilityValue(texture == nil ? "写真を読み込めません" : "")
        .accessibilityHint("ネイルの詳細を開きます")
    }

    private var emptyFilter: some View {
        VStack(spacing: 10) {
            Image(systemName: searchText.isEmpty && !favoritesOnly && activeTag == nil ? "square.grid.2x2" : "magnifyingglass")
                .font(.system(size: 26, weight: .light))
                .foregroundStyle(Palette.goldHairline)
            Text(emptyFilterTitle)
                .font(.system(size: emptyFilterFontSize))
                .foregroundStyle(Palette.mutedWarm)
        }
        .padding(.top, 80)
    }

    private var emptyFilterTitle: String {
        if !searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return "検索条件に一致するネイルはありません"
        }
        if favoritesOnly { return "お気に入りはまだありません" }
        if activeTag != nil { return "このタグのネイルはありません" }
        return "表示できるネイルはありません"
    }
}

private enum CollectionSortOrder: String, CaseIterable, Identifiable {
    case newest, oldest, priceHigh, priceLow

    var id: String { rawValue }

    var title: String {
        switch self {
        case .newest: return "新しい順"
        case .oldest: return "古い順"
        case .priceHigh: return "価格の高い順"
        case .priceLow: return "価格の安い順"
        }
    }

    func areInOrder(_ lhs: NailRecord, _ rhs: NailRecord) -> Bool {
        switch self {
        case .newest: return lhs.createdAt > rhs.createdAt
        case .oldest: return lhs.createdAt < rhs.createdAt
        case .priceHigh: return (lhs.priceYen ?? Int.min) > (rhs.priceYen ?? Int.min)
        case .priceLow: return (lhs.priceYen ?? Int.max) < (rhs.priceYen ?? Int.max)
        }
    }
}

private extension NailRecord {
    var searchableText: String {
        ([title, salon, memo] + tags).joined(separator: " ")
    }
}
