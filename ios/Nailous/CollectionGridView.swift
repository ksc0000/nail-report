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
            StageBackground()

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

            StageForeground(theme: .glass)
        }
        .navigationTitle("すべてのネイル")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .preferredColorScheme(.dark)
    }

    private var filterBar: some View {
        HStack(spacing: 8) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    StagePill(label: "すべて", isOn: activeTag == nil && !favoritesOnly) {
                        activeTag = nil
                        favoritesOnly = false
                    }
                    StagePill(label: "♡ お気に入り", isOn: favoritesOnly) {
                        favoritesOnly.toggle()
                    }
                    ForEach(allTags, id: \.self) { tag in
                        StagePill(label: "#\(tag)", isOn: activeTag == tag) {
                            activeTag = (activeTag == tag) ? nil : tag
                        }
                    }
                }
                .padding(.horizontal, 20)
            }

            Menu {
                Picker("並べ替え", selection: $sortOrder) {
                    ForEach(CollectionSortOrder.allCases) { order in
                        Text(order.title).tag(order)
                    }
                }
            } label: {
                Image(systemName: "arrow.up.arrow.down")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Palette.goldBright)
                    .frame(width: 38, height: 34)
                    .background(.white.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
            }
            .padding(.trailing, 20)
        }
    }

    private var searchBar: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.white.opacity(0.5))
            TextField("タイトル・サロン・メモ・タグを検索", text: $searchText)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .foregroundStyle(.white)
            if !searchText.isEmpty {
                Button { searchText = "" } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(.white.opacity(0.5))
                }
                .accessibilityLabel("検索を消去")
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 42)
        .background(.white.opacity(0.08), in: RoundedRectangle(cornerRadius: 12))
    }

    private func card(_ record: NailRecord) -> some View {
        Group {
            if let texture = record.texture {
                Button {
                    onSelect(record)
                } label: {
                    VStack(spacing: 7) {
                        NailThumbnail(image: texture, nailShape: record.shape)
                            .frame(width: 96, height: 132)
                            .overlay(alignment: .topTrailing) {
                                HStack(spacing: 3) {
                                    if record.wornSince != nil {
                                        Image(systemName: "hand.point.up.left.fill")
                                            .font(.system(size: 9))
                                            .foregroundStyle(Palette.ink0)
                                            .padding(4)
                                            .background(Circle().fill(Palette.goldBright))
                                    }
                                    if record.isFavorite {
                                        Image(systemName: "heart.fill")
                                            .font(.system(size: 11))
                                            .foregroundStyle(Palette.goldBright)
                                            .shadow(color: .black.opacity(0.5), radius: 2)
                                    }
                                }
                                .offset(x: -2, y: 6)
                            }
                        Text(record.title)
                            .font(.system(size: 12))
                            .lineLimit(1)
                            .foregroundStyle(.white.opacity(0.8))
                        Text(record.createdAt.formatted(.dateTime.year().month(.abbreviated)))
                            .font(.system(size: 10))
                            .foregroundStyle(.white.opacity(0.4))
                    }
                }
            }
        }
    }

    private var emptyFilter: some View {
        VStack(spacing: 10) {
            Image(systemName: searchText.isEmpty && !favoritesOnly && activeTag == nil ? "square.grid.2x2" : "magnifyingglass")
                .font(.system(size: 30))
                .foregroundStyle(Palette.gold.opacity(0.7))
            Text(emptyFilterTitle)
                .font(.system(size: 14))
                .foregroundStyle(.white.opacity(0.6))
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
