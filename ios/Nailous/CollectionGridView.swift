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
        records.filter { record in
            (!favoritesOnly || record.isFavorite)
                && (activeTag == nil || record.tags.contains(activeTag!))
        }
    }

    var body: some View {
        ZStack {
            StageBackground()

            ScrollView {
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
            Image(systemName: favoritesOnly ? "heart" : "tag")
                .font(.system(size: 30))
                .foregroundStyle(Palette.gold.opacity(0.7))
            Text(favoritesOnly ? "お気に入りはまだありません" : "このタグのネイルはありません")
                .font(.system(size: 14))
                .foregroundStyle(.white.opacity(0.6))
        }
        .padding(.top, 80)
    }
}
