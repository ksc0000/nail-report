import SwiftUI
import UIKit

/// The month-end recap card (#374): every nail from one calendar month,
/// scattered loosely across a warm paper surface as if set down by hand — the
/// photogenic composition that lost out to the tidy month field on Home, given
/// its own role here instead of being thrown away.
enum RecapCardRenderer {
    /// Renders one recap card at the same native size as `CardRenderer`
    /// (941×1672) so the two families share a frame. Deterministic: the same
    /// `records` always scatter into the same layout, seeded from each
    /// record's own id rather than the record order or the current time.
    static func render(records: [NailRecord], month: Int, year: Int) -> UIImage? {
        guard !records.isEmpty else { return nil }
        let size = CGSize(width: 941, height: 1672)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1

        // Stable order so re-rendering the same month never reshuffles which
        // record lands in which cell.
        let ordered = records.sorted { lhs, rhs in
            if lhs.createdAt != rhs.createdAt { return lhs.createdAt < rhs.createdAt }
            return lhs.id.uuidString < rhs.id.uuidString
        }

        let area = CGRect(
            x: size.width * 0.075,
            y: size.height * 0.14,
            width: size.width * 0.85,
            height: size.height * 0.72
        )
        let placements = scatterLayout(seeds: ordered.map { $0.id.stableSeed }, in: area)

        return UIGraphicsImageRenderer(size: size, format: format).image { ctx in
            let cg = ctx.cgContext
            UIColor(Palette.paper).setFill()
            cg.fill(CGRect(origin: .zero, size: size))

            CardRenderer.draw(
                "NAILOUS", at: 0.055, in: size,
                font: CardRenderer.serif(15, weight: .semibold),
                color: UIColor(Palette.mutedWarm), kern: 9
            )

            for (record, placement) in zip(ordered, placements) {
                drawChip(record, in: placement, context: cg)
            }

            let thisYear = Calendar.current.component(.year, from: Date())
            let monthLabel = year == thisYear ? "\(month)月" : "\(year)年\(month)月"
            CardRenderer.draw(
                "\(monthLabel)　・　\(ordered.count)本", at: 0.90, in: size,
                font: CardRenderer.serif(26, weight: .medium),
                color: UIColor(Palette.inkWarm), kern: 3
            )
        }
    }

    // MARK: - Scatter layout

    private struct Placement {
        let rect: CGRect
        let angle: CGFloat
    }

    /// A jittered grid: cells are sized to fit `count` inside `area` at the
    /// nail's own aspect ratio, then each chip is nudged off its cell centre
    /// and tilted a few degrees — enough to read as "set down by hand"
    /// without ever pushing a chip off the card or fully over another.
    private static func scatterLayout(seeds: [UInt64], in area: CGRect) -> [Placement] {
        let count = seeds.count
        let nailAspect: CGFloat = 512.0 / 768.0
        let areaAspect = area.width / area.height
        let cols = max(1, min(count, Int((Double(count) * Double(areaAspect)).squareRoot().rounded(.up))))
        let rows = Int((Double(count) / Double(cols)).rounded(.up))

        let cellW = area.width / CGFloat(cols)
        let cellH = area.height / CGFloat(rows)
        var chipH = min(cellH * 0.82, area.height * 0.58)
        var chipW = chipH * nailAspect
        if chipW > cellW * 0.82 {
            chipW = cellW * 0.82
            chipH = chipW / nailAspect
        }

        // Jitter is scaled to each chip's own leftover margin within its cell,
        // not a fixed fraction of the cell itself — dense grids (little
        // leftover margin, e.g. 8 nails in 3×3) automatically get gentler
        // nudges instead of the fixed-fraction jitter eating past the natural
        // gap and stacking chips on top of each other (#376).
        let marginX = max(0, (cellW - chipW) / 2)
        let marginY = max(0, (cellH - chipH) / 2)
        let jitterFrac: CGFloat = 0.55

        var placements: [Placement] = []
        var index = 0
        var row = 0
        while index < count {
            let itemsInRow = min(cols, count - index)
            let rowY = area.minY + cellH * (CGFloat(row) + 0.5)
            let rowWidth = cellW * CGFloat(itemsInRow)
            let rowStartX = area.minX + (area.width - rowWidth) / 2
            for col in 0..<itemsInRow {
                let cellCenter = CGPoint(x: rowStartX + cellW * (CGFloat(col) + 0.5), y: rowY)
                var rng = SeededGenerator(seed: seeds[index])
                let jitterX = CGFloat.random(in: -jitterFrac...jitterFrac, using: &rng) * marginX
                let jitterY = CGFloat.random(in: -jitterFrac...jitterFrac, using: &rng) * marginY
                let center = CGPoint(x: cellCenter.x + jitterX, y: cellCenter.y + jitterY)
                let angle = CGFloat.random(in: -12...12, using: &rng) * .pi / 180
                let rect = CGRect(x: center.x - chipW / 2, y: center.y - chipH / 2, width: chipW, height: chipH)
                placements.append(Placement(rect: rect, angle: angle))
                index += 1
            }
            row += 1
        }
        return placements
    }

    // MARK: - Chip drawing

    private static func drawChip(_ record: NailRecord, in placement: Placement, context cg: CGContext) {
        let rect = placement.rect
        cg.saveGState()
        cg.translateBy(x: rect.midX, y: rect.midY)
        cg.rotate(by: placement.angle)
        let local = CGRect(x: -rect.width / 2, y: -rect.height / 2, width: rect.width, height: rect.height)
        let path = nailPath(in: local, shape: record.shape)

        // Cast the drop shadow from the silhouette itself so it reads as a
        // physical chip, then clip and paint the photo without re-shadowing.
        cg.saveGState()
        cg.setShadow(
            offset: CGSize(width: 0, height: rect.height * 0.05),
            blur: rect.height * 0.10,
            color: UIColor.black.withAlphaComponent(0.22).cgColor
        )
        cg.addPath(path)
        cg.setFillColor(UIColor.white.cgColor)
        cg.fillPath()
        cg.restoreGState()

        cg.saveGState()
        cg.addPath(path)
        cg.clip()
        if let texture = record.texture {
            drawAspectFill(texture, in: local)
        }
        cg.restoreGState()

        if record.wornSince != nil || record.isFavorite {
            cg.addPath(path)
            cg.setStrokeColor(UIColor(Palette.goldHairline).cgColor)
            cg.setLineWidth(2.4)
            cg.strokePath()
        }
        cg.restoreGState()
    }

    /// Same silhouette the Home chips and the 3D stage use
    /// (`NailSilhouette`/`NailGeometry.widthFactor`), rebuilt as a `CGPath`
    /// since this renderer draws with Core Graphics, not SwiftUI.
    private static func nailPath(in rect: CGRect, shape: NailShape) -> CGPath {
        let samples = 48
        var left: [CGPoint] = []
        var right: [CGPoint] = []
        for i in 0...samples {
            let t = Float(i) / Float(samples)
            let half = CGFloat(NailGeometry.widthFactor(t: t, shape: shape)) * rect.width / 2
            let y = rect.maxY - CGFloat(t) * rect.height
            left.append(CGPoint(x: rect.midX - half, y: y))
            right.append(CGPoint(x: rect.midX + half, y: y))
        }
        let path = CGMutablePath()
        path.move(to: left[0])
        for point in left.dropFirst() { path.addLine(to: point) }
        for point in right.reversed() { path.addLine(to: point) }
        path.closeSubpath()
        return path
    }

    private static func drawAspectFill(_ image: UIImage, in rect: CGRect) {
        let scale = max(rect.width / image.size.width, rect.height / image.size.height)
        let size = CGSize(width: image.size.width * scale, height: image.size.height * scale)
        let origin = CGPoint(x: rect.midX - size.width / 2, y: rect.midY - size.height / 2)
        image.draw(in: CGRect(origin: origin, size: size))
    }
}

private extension UUID {
    /// A 64-bit seed derived from the UUID's raw bytes (FNV-1a), stable
    /// across app launches — unlike `hashValue`, which Swift salts randomly
    /// per process, so a record's scatter position stays put run to run.
    var stableSeed: UInt64 {
        var hash: UInt64 = 0xcbf2_9ce4_8422_2325
        for byte in [
            uuid.0, uuid.1, uuid.2, uuid.3, uuid.4, uuid.5, uuid.6, uuid.7,
            uuid.8, uuid.9, uuid.10, uuid.11, uuid.12, uuid.13, uuid.14, uuid.15,
        ] {
            hash ^= UInt64(byte)
            hash = hash &* 0x0000_0100_0000_01b3
        }
        return hash
    }
}

/// Deterministic RNG so a month's scatter never reshuffles between renders.
private struct SeededGenerator: RandomNumberGenerator {
    private var state: UInt64
    init(seed: UInt64) { state = seed &+ 0x9E3779B97F4A7C15 }
    mutating func next() -> UInt64 {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        var z = state
        z = (z ^ (z >> 30)) &* 0xBF58476D1CE4E5B9
        z = (z ^ (z >> 27)) &* 0x94D049BB133111EB
        return z ^ (z >> 31)
    }
}
