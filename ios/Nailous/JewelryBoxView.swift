import SwiftUI

/// The jewelry-box stage: one spotlighted 3D nail you can spin with a finger,
/// with swatches to swap design and shape.
struct JewelryBoxView: View {
    // Launch arguments (-style <id> / -shape <rawValue>) allow headless UI
    // verification via `simctl launch`; users never see them.
    @State private var style: NailStyle = {
        let id = UserDefaults.standard.string(forKey: "style")
        return NailStyle.samples.first { $0.id == id } ?? NailStyle.samples[0]
    }()
    @State private var shape: NailShape = {
        let raw = UserDefaults.standard.string(forKey: "shape") ?? ""
        return NailShape(rawValue: raw) ?? .squoval
    }()
    @State private var mode: StageMode = {
        let raw = UserDefaults.standard.string(forKey: "mode") ?? ""
        return StageMode(rawValue: raw) ?? .single
    }()

    var body: some View {
        ZStack {
            RadialGradient(
                colors: [
                    Color(red: 0.16, green: 0.09, blue: 0.15),
                    Color(red: 0.04, green: 0.02, blue: 0.05),
                ],
                center: .center,
                startRadius: 40,
                endRadius: 480
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                header
                    .padding(.top, 8)

                NailSceneView(appearance: style.appearance, shape: shape, mode: mode)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                Text("ドラッグで回転")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.45))
                    .padding(.bottom, 14)

                controls
                    .padding(.horizontal, 20)
                    .padding(.bottom, 26)
            }
        }
        .preferredColorScheme(.dark)
    }

    private var header: some View {
        VStack(spacing: 4) {
            Text("NAILOUS")
                .font(.system(size: 13, weight: .semibold))
                .kerning(5)
                .foregroundStyle(.white.opacity(0.55))
            Text(style.label)
                .font(.system(size: 24, weight: .medium, design: .serif))
                .foregroundStyle(.white)
        }
    }

    private var controls: some View {
        VStack(spacing: 16) {
            HStack(spacing: 14) {
                ForEach(NailStyle.samples) { sample in
                    Button {
                        style = sample
                    } label: {
                        Circle()
                            .fill(Color(sample.swatch))
                            .frame(width: 40, height: 40)
                            .overlay(
                                Circle().strokeBorder(
                                    .white.opacity(style.id == sample.id ? 0.9 : 0.18),
                                    lineWidth: style.id == sample.id ? 2 : 1
                                )
                            )
                    }
                    .accessibilityLabel(sample.label)
                }
            }

            HStack(spacing: 8) {
                ForEach(NailShape.allCases) { candidate in
                    pill(candidate.label, isOn: shape == candidate) { shape = candidate }
                }
            }
            HStack(spacing: 8) {
                ForEach(StageMode.allCases) { candidate in
                    pill(candidate.label, isOn: mode == candidate) { mode = candidate }
                }
            }
        }
    }
}

private extension JewelryBoxView {
    func pill(_ label: String, isOn: Bool, action: @escaping () -> Void) -> some View {
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

#Preview {
    JewelryBoxView()
}
