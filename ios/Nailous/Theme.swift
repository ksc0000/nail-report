import SwiftUI

/// The Nailous look: warm near-black grounds, champagne-gold accents, serif
/// display type. One source of truth so every screen shares the jewelry-box
/// language.
enum Palette {
    static let ink0 = Color(red: 0.05, green: 0.035, blue: 0.05)
    static let ink1 = Color(red: 0.10, green: 0.07, blue: 0.09)
    static let velvet = Color(red: 0.20, green: 0.11, blue: 0.17)

    static let gold = Color(red: 0.83, green: 0.68, blue: 0.38)
    static let goldBright = Color(red: 0.94, green: 0.86, blue: 0.64)
    static let goldDeep = Color(red: 0.55, green: 0.42, blue: 0.20)

    /// Retained accent for actions that shouldn't read as "metal" (kept warm).
    static let rose = Color(red: 0.83, green: 0.54, blue: 0.61)

    static let goldGradient = LinearGradient(
        colors: [goldBright, gold, goldDeep],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}

/// Small rotated-gem rule used under display titles.
struct GemDivider: View {
    var width: CGFloat = 108

    var body: some View {
        HStack(spacing: 8) {
            line
            Image(systemName: "diamond.fill")
                .font(.system(size: 7))
                .foregroundStyle(Palette.gold)
            line
        }
        .frame(width: width)
    }

    private var line: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [.clear, Palette.gold.opacity(0.7)],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .frame(height: 1)
    }
}

/// "NAILOUS" kicker + serif display title + gem divider — the screen crown.
struct DisplayTitle: View {
    let title: String
    var kicker: String = "NAILOUS"
    var subtitle: String?

    var body: some View {
        VStack(spacing: 6) {
            Text(kicker)
                .font(.system(size: 11, weight: .semibold))
                .kerning(6)
                .foregroundStyle(Palette.gold.opacity(0.85))
            Text(title)
                .font(.system(size: 30, weight: .regular, design: .serif))
                .foregroundStyle(.white)
            GemDivider()
            if let subtitle {
                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.45))
                    .padding(.top, 2)
            }
        }
    }
}

/// Gold small-caps section label with an optional trailing action.
struct SectionHeader: View {
    let title: String
    var trailing: String?
    var action: (() -> Void)?

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .kerning(2)
                .foregroundStyle(Palette.gold.opacity(0.8))
            Spacer()
            if let trailing, let action {
                Button(action: action) {
                    HStack(spacing: 2) {
                        Text(trailing).font(.system(size: 12))
                        Image(systemName: "chevron.right").font(.system(size: 9, weight: .semibold))
                    }
                    .foregroundStyle(.white.opacity(0.5))
                }
            }
        }
        .padding(.horizontal, 24)
    }
}

/// A round velvet podium with a thin gold orbit ring — the display stand the
/// jewels float above on the home stage.
struct JewelPodium: View {
    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            ZStack {
                Ellipse()
                    .fill(
                        RadialGradient(
                            colors: [Palette.velvet.opacity(0.9), Palette.ink0.opacity(0.0)],
                            center: .center,
                            startRadius: 6,
                            endRadius: 190
                        )
                    )
                    .frame(width: 320, height: 120)
                    .blur(radius: 2)
                Ellipse()
                    .stroke(Palette.gold.opacity(0.35), lineWidth: 1)
                    .frame(width: 250, height: 74)
                Ellipse()
                    .stroke(Palette.gold.opacity(0.12), lineWidth: 1)
                    .frame(width: 320, height: 96)
            }
            .padding(.bottom, 26)
        }
    }
}

/// A restrained gold hairline frame with corner flourishes, laid over a screen
/// to give the "display case" feel without competing with the content.
struct LuxuryFrame: View {
    var body: some View {
        GeometryReader { proxy in
            let inset: CGFloat = 10
            let rect = CGRect(origin: .zero, size: proxy.size).insetBy(dx: inset, dy: inset)
            let corner: CGFloat = 22
            ZStack {
                RoundedRectangle(cornerRadius: corner)
                    .inset(by: 0)
                    .stroke(Palette.gold.opacity(0.22), lineWidth: 1)
                    .frame(width: rect.width, height: rect.height)
                    .position(x: proxy.size.width / 2, y: proxy.size.height / 2)
                cornerMark.position(x: rect.minX + corner, y: rect.minY + corner)
                cornerMark.rotationEffect(.degrees(90)).position(x: rect.maxX - corner, y: rect.minY + corner)
                cornerMark.rotationEffect(.degrees(-90)).position(x: rect.minX + corner, y: rect.maxY - corner)
                cornerMark.rotationEffect(.degrees(180)).position(x: rect.maxX - corner, y: rect.maxY - corner)
            }
            .allowsHitTesting(false)
        }
        .ignoresSafeArea()
    }

    private var cornerMark: some View {
        Image(systemName: "diamond.fill")
            .font(.system(size: 6))
            .foregroundStyle(Palette.gold.opacity(0.5))
    }
}

/// Gold circular "+" (or any icon) toolbar button with a ring.
struct GoldIconButton: View {
    let systemName: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(Palette.ink0)
                .frame(width: 34, height: 34)
                .background(Circle().fill(Palette.goldGradient))
                .overlay(Circle().stroke(Palette.goldBright.opacity(0.6), lineWidth: 1).padding(-3))
        }
    }
}
