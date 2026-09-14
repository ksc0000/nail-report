import SwiftUI

/// The 2D outline of a nail plate, sampled from the same width function the 3D
/// mesh uses — thumbnails match the real shape exactly. Tip points up.
struct NailSilhouette: Shape {
    let nailShape: NailShape
    /// Corner rounding as tuned on the record (0 = the shape's default).
    var corner: Float = 0

    func path(in rect: CGRect) -> Path {
        let samples = 48
        var leftSide: [CGPoint] = []
        var rightSide: [CGPoint] = []
        for i in 0...samples {
            let t = Float(i) / Float(samples)
            let half = CGFloat(NailGeometry.widthFactor(t: t, shape: nailShape, corner: corner)) * rect.width / 2
            let y = rect.maxY - CGFloat(t) * rect.height
            leftSide.append(CGPoint(x: rect.midX - half, y: y))
            rightSide.append(CGPoint(x: rect.midX + half, y: y))
        }
        var path = Path()
        path.move(to: leftSide[0])
        for point in leftSide.dropFirst() { path.addLine(to: point) }
        for point in rightSide.reversed() { path.addLine(to: point) }
        path.closeSubpath()
        return path
    }
}

/// A hand's five nails as one compact bundle, thumb→pinky laid out the way
/// the hand looks from above (thumb on the left for a right hand). Small
/// stagger in height hints at the finger lengths.
struct HandChipBundle: View {
    let textures: [UIImage]
    let shapes: [NailShape]
    var params: NailPlateParams = .default
    var hand: Hand?
    /// Height of the middle (tallest) chip; the bundle is about 2.4× as wide.
    var chipHeight: CGFloat = 44
    var shadowColor: Color = .black.opacity(0.12)
    var worn: Bool = false

    private var order: [Int] {
        let anatomical = Array(textures.indices)
        return (hand?.thumbIsOnPhotoLeft ?? true) ? anatomical : anatomical.reversed()
    }

    /// Thumb→pinky relative heights of a resting hand.
    private static let lengthScale: [CGFloat] = [0.78, 0.94, 1, 0.94, 0.8]

    var body: some View {
        HStack(alignment: .bottom, spacing: -chipHeight * 0.06) {
            ForEach(order, id: \.self) { index in
                let scale = Self.lengthScale.indices.contains(index) ? Self.lengthScale[index] : 1
                let height = chipHeight * scale
                NailThumbnail(
                    image: textures[index],
                    nailShape: shapes.indices.contains(index) ? shapes[index] : (shapes.first ?? .squoval),
                    params: params,
                    size: CGSize(width: height * 0.62, height: height),
                    shadowColor: shadowColor,
                    shadowRadius: 5,
                    shadowY: 3
                )
                .padding(.bottom, (chipHeight - height) * 0.35)
            }
        }
        .overlay {
            if worn {
                RoundedRectangle(cornerRadius: chipHeight)
                    .stroke(Palette.goldHairline, lineWidth: 1.2)
                    .padding(-max(6, chipHeight * 0.16))
            }
        }
    }
}

/// Photo thumbnail clipped to the nail silhouette, with a soft gloss streak so
/// shelf items still read as gel nails.
struct NailThumbnail: View {
    let image: UIImage
    let nailShape: NailShape
    /// Length / width / corner as tuned on the record, so a long almond stays
    /// long here too instead of being squashed into one fixed box.
    var params: NailPlateParams = .default
    /// Bounding box the chip is fitted into (the drawn plate keeps the 3D
    /// plate's proportions). Default matches the original shelf size; the
    /// home field renders chips smaller so a month reads at a glance.
    var size: CGSize = CGSize(width: 84, height: 128)
    /// Deep shadow suits the dark stage; the light home uses a soft one so
    /// chips sit on the paper like objects rather than float.
    var shadowColor: Color = .black.opacity(0.45)
    var shadowRadius: CGFloat = 10
    var shadowY: CGFloat = 7
    /// Draws the thin gold ring that marks the nail being worn, sized to the
    /// drawn chip rather than the bounding box.
    var worn: Bool = false

    /// The plate's real proportions (per-shape base size × tuning), fitted
    /// inside `size`.
    private var drawnSize: CGSize {
        let base = NailGeometry.plateSize(for: nailShape)
        let aspect = CGFloat(base.width * (1 + 0.25 * params.width))
            / CGFloat(max(0.1, base.height * (1 + 0.25 * params.length)))
        if size.width / size.height > aspect {
            return CGSize(width: size.height * aspect, height: size.height)
        }
        return CGSize(width: size.width, height: size.width / aspect)
    }

    private var silhouette: NailSilhouette {
        NailSilhouette(nailShape: nailShape, corner: params.corner)
    }

    var body: some View {
        let drawn = drawnSize
        Image(uiImage: image)
            .resizable()
            .scaledToFill()
            .frame(width: drawn.width, height: drawn.height)
            .clipShape(silhouette)
            .overlay(
                LinearGradient(
                    colors: [.white.opacity(0.38), .white.opacity(0.06), .clear],
                    startPoint: .topLeading,
                    endPoint: .center
                )
                .clipShape(silhouette)
            )
            .overlay(
                silhouette
                    .stroke(.white.opacity(0.22), lineWidth: 1)
            )
            .shadow(color: shadowColor, radius: shadowRadius, y: shadowY)
            .overlay {
                if worn {
                    Ellipse()
                        .stroke(Palette.goldHairline, lineWidth: 1.2)
                        .padding(-max(6, drawn.width * 0.14))
                }
            }
            .frame(width: size.width, height: size.height)
    }
}
