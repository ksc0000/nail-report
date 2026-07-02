import SwiftUI

/// The 2D outline of a nail plate, sampled from the same width function the 3D
/// mesh uses — thumbnails match the real shape exactly. Tip points up.
struct NailSilhouette: Shape {
    let nailShape: NailShape

    func path(in rect: CGRect) -> Path {
        let samples = 48
        var leftSide: [CGPoint] = []
        var rightSide: [CGPoint] = []
        for i in 0...samples {
            let t = Float(i) / Float(samples)
            let half = CGFloat(NailGeometry.widthFactor(t: t, shape: nailShape)) * rect.width / 2
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

/// Photo thumbnail clipped to the nail silhouette, with a soft gloss streak so
/// shelf items still read as gel nails.
struct NailThumbnail: View {
    let image: UIImage
    let nailShape: NailShape

    var body: some View {
        Image(uiImage: image)
            .resizable()
            .scaledToFill()
            .frame(width: 84, height: 128)
            .clipShape(NailSilhouette(nailShape: nailShape))
            .overlay(
                LinearGradient(
                    colors: [.white.opacity(0.38), .white.opacity(0.06), .clear],
                    startPoint: .topLeading,
                    endPoint: .center
                )
                .clipShape(NailSilhouette(nailShape: nailShape))
            )
            .overlay(
                NailSilhouette(nailShape: nailShape)
                    .stroke(.white.opacity(0.22), lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.45), radius: 10, y: 7)
    }
}
