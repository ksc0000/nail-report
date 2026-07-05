import SwiftData
import SwiftUI

/// The jewel view: one saved nail (or sample) on the spinnable stage, with its
/// story underneath. Records can be deleted here.
struct NailDetailView: View {
    let appearance: NailAppearance
    let title: String
    let subtitle: String?
    var record: NailRecord?

    @State private var shape: NailShape
    @State private var mode: StageMode = .single
    @State private var layout: SetLayout = .arc
    @State private var motion: AutoMotion = .off
    @State private var theme: StageTheme = .glass
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @State private var confirmingDelete = false

    init(appearance: NailAppearance, title: String, subtitle: String?, record: NailRecord? = nil) {
        self.appearance = appearance
        self.title = title
        self.subtitle = subtitle
        self.record = record
        _shape = State(initialValue: record?.shape ?? .squoval)
        // A whole-hand capture opens as the five-piece set by default.
        _mode = State(initialValue: (record?.setAppearances?.count ?? 0) > 1 ? .set : .single)
    }

    var body: some View {
        ZStack {
            StageBackground(theme: theme)

            VStack(spacing: 0) {
                VStack(spacing: 4) {
                    Text("NAILOUS")
                        .font(.system(size: 12, weight: .semibold))
                        .kerning(4)
                        .foregroundStyle(.white.opacity(0.5))
                    Text(title)
                        .font(.system(size: 23, weight: .medium, design: .serif))
                        .foregroundStyle(.white)
                    if let subtitle {
                        Text(subtitle)
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.5))
                    }
                }
                .padding(.top, 6)

                NailSceneView(
                    appearance: appearance,
                    shape: shape,
                    mode: mode,
                    setAppearances: record?.setAppearances,
                    layout: layout,
                    motion: motion,
                    theme: theme
                )
                .frame(maxWidth: .infinity, maxHeight: .infinity)

                Text("ドラッグで回転")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.45))
                    .padding(.bottom, 12)

                if let record, !record.tags.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(record.tags, id: \.self) { tag in
                                Text("#\(tag)")
                                    .font(.system(size: 11.5, weight: .medium))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(Capsule().fill(Color(red: 0.83, green: 0.54, blue: 0.61).opacity(0.28)))
                                    .foregroundStyle(Color(red: 0.96, green: 0.8, blue: 0.86))
                            }
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 10)
                }

                if let record, !record.salon.isEmpty || record.priceYen != nil || !record.memo.isEmpty {
                    VStack(spacing: 6) {
                        HStack(spacing: 8) {
                            if !record.salon.isEmpty {
                                Label(record.salon, systemImage: "scissors")
                            }
                            if let price = record.priceYen {
                                Label("¥\(price.formatted())", systemImage: "yensign.circle")
                            }
                        }
                        .font(.system(size: 12.5))
                        .foregroundStyle(.white.opacity(0.65))

                        if !record.memo.isEmpty {
                            Text(record.memo)
                                .font(.system(size: 12.5))
                                .foregroundStyle(.white.opacity(0.55))
                                .multilineTextAlignment(.center)
                                .lineLimit(4)
                                .padding(.horizontal, 32)
                        }
                    }
                    .padding(.bottom, 14)
                }

                VStack(spacing: 8) {
                    HStack(spacing: 8) {
                        ForEach(StageMode.allCases) { candidate in
                            StagePill(label: candidate.label, isOn: mode == candidate) {
                                mode = candidate
                            }
                        }
                        StagePill(label: motion.label, isOn: motion != .off) {
                            motion = motion.next
                        }
                    }
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(StageTheme.allCases) { candidate in
                                StagePill(label: candidate.label, isOn: theme == candidate) {
                                    theme = candidate
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                    if mode == .set {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(SetLayout.allCases) { candidate in
                                    StagePill(label: candidate.label, isOn: layout == candidate) {
                                        layout = candidate
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                    if record == nil {
                        HStack(spacing: 8) {
                            ForEach(NailShape.allCases) { candidate in
                                StagePill(label: candidate.label, isOn: shape == candidate) {
                                    shape = candidate
                                }
                            }
                        }
                    }
                }
                .padding(.bottom, record == nil ? 28 : 16)

                if record != nil {
                    Button(role: .destructive) {
                        confirmingDelete = true
                    } label: {
                        Text("この記録を削除")
                            .font(.system(size: 13))
                            .foregroundStyle(.red.opacity(0.85))
                    }
                    .padding(.bottom, 24)
                }
            }
        }
        .toolbarColorScheme(.dark, for: .navigationBar)
        .confirmationDialog("この記録を削除しますか？", isPresented: $confirmingDelete, titleVisibility: .visible) {
            Button("削除する", role: .destructive) {
                if let record {
                    modelContext.delete(record)
                }
                dismiss()
            }
        }
    }
}

/// Shared dark stage backdrop.
struct StageBackground: View {
    var theme: StageTheme = .glass

    var body: some View {
        Group {
            if let backdrop = theme.backdropImage {
                // AI-generated backdrop (bg_<theme>.png in the bundle), dimmed
                // and vignetted so the nail stays the hero.
                GeometryReader { proxy in
                    Image(uiImage: backdrop)
                        .resizable()
                        .scaledToFill()
                        .frame(width: proxy.size.width, height: proxy.size.height)
                        .clipped()
                        .overlay(Color.black.opacity(0.3))
                        .overlay(
                            RadialGradient(
                                colors: [.clear, .black.opacity(0.55)],
                                center: .center,
                                startRadius: 120,
                                endRadius: 520
                            )
                        )
                }
            } else {
                RadialGradient(
                    colors: theme.gradientColors,
                    center: .center,
                    startRadius: 40,
                    endRadius: 480
                )
            }
        }
        .ignoresSafeArea()
    }
}

/// Shared capsule toggle.
struct StagePill: View {
    let label: String
    let isOn: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 12.5, weight: .medium))
                .lineLimit(1)
                .fixedSize()
                .padding(.horizontal, 12)
                .padding(.vertical, 7)
                .background(
                    Capsule().fill(isOn ? Color.white.opacity(0.92) : Color.white.opacity(0.08))
                )
                .foregroundStyle(
                    isOn ? Color(red: 0.2, green: 0.1, blue: 0.18) : .white.opacity(0.75)
                )
        }
    }
}
