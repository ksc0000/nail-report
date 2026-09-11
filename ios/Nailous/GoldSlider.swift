import SwiftUI

/// Luxury horizontal slider: drag anywhere along the track — no tiny thumb to
/// grab. Bipolar ranges fill from the centre notch; zero snaps gently.
struct GoldSlider: View {
    let label: String
    @Binding var value: Float
    var range: ClosedRange<Float> = -1...1
    /// Called continuously while sliding (already throttled by SwiftUI's
    /// gesture cadence) and once on release.
    var onEditingChanged: ((Bool) -> Void)? = nil
    @Environment(\.stageIsLight) private var isLight

    private var isBipolar: Bool { range.lowerBound < 0 && range.upperBound > 0 }

    private func fraction(_ v: Float) -> CGFloat {
        CGFloat((v - range.lowerBound) / (range.upperBound - range.lowerBound))
    }

    var body: some View {
        HStack(spacing: 12) {
            Text(label)
                .font(.system(size: 12))
                .foregroundStyle(isLight ? Palette.mutedWarm : .white.opacity(0.65))
                .frame(width: 74, alignment: .leading)

            GeometryReader { geo in
                let width = geo.size.width
                let zeroX = width * fraction(0)
                let valueX = width * fraction(value)

                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(isLight ? Palette.inkWarm.opacity(0.1) : Color.white.opacity(0.1))
                        .frame(height: 4)

                    // gold fill: centre→value for bipolar, leading→value otherwise
                    if isBipolar {
                        Capsule()
                            .fill(isLight ? AnyShapeStyle(Palette.goldHairline) : AnyShapeStyle(Palette.goldGradient))
                            .frame(width: max(2, abs(valueX - zeroX)), height: 4)
                            .offset(x: min(zeroX, valueX))
                        Rectangle()
                            .fill(isLight ? Palette.inkWarm.opacity(0.3) : Color.white.opacity(0.35))
                            .frame(width: 1, height: 10)
                            .offset(x: zeroX - 0.5)
                    } else {
                        Capsule()
                            .fill(isLight ? AnyShapeStyle(Palette.goldHairline) : AnyShapeStyle(Palette.goldGradient))
                            .frame(width: max(2, valueX), height: 4)
                    }

                    Circle()
                        .fill(isLight ? Palette.inkWarm : Palette.goldBright)
                        .frame(width: 16, height: 16)
                        .shadow(color: isLight ? .black.opacity(0.15) : Palette.gold.opacity(0.7), radius: isLight ? 3 : 5)
                        .offset(x: valueX - 8)
                }
                .frame(height: 28)
                .contentShape(Rectangle())
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { gesture in
                            let f = Float(min(max(0, gesture.location.x / width), 1))
                            var next = range.lowerBound + f * (range.upperBound - range.lowerBound)
                            // gentle snap to the stock value
                            if isBipolar, abs(next) < 0.05 {
                                if value != 0, next != 0 {
                                    UISelectionFeedbackGenerator().selectionChanged()
                                }
                                next = 0
                            }
                            if next != value {
                                value = next
                                onEditingChanged?(true)
                            }
                        }
                        .onEnded { _ in
                            onEditingChanged?(false)
                        }
                )
            }
            .frame(height: 28)
        }
    }
}
