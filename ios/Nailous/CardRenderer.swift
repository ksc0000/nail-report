import UIKit

/// A nail card: the 3D nail stamp set into an AI-illustrated frame
/// (`card_<rawValue>.png`, 941×1672). All typography is drawn in Swift —
/// nothing is baked into the artwork — so titles, dates, and salon names stay
/// crisp and editable.
enum CardTemplate: String, CaseIterable, Identifiable {
    case showcase
    case memory
    case salon
    case minimal

    var id: String { rawValue }

    var label: String {
        switch self {
        case .showcase: return "ショーケース"
        case .memory: return "メモリー"
        case .salon: return "サロン"
        case .minimal: return "ミニマル"
        }
    }

    var backgroundImage: UIImage? { UIImage(named: "card_\(rawValue)") }

    /// Dark templates carry the gold logo mark (screen-blended); the light
    /// minimal template uses dark drawn text instead.
    var isDark: Bool { self != .minimal }

    var textColor: UIColor {
        switch self {
        case .showcase: return UIColor(red: 0.96, green: 0.9, blue: 0.78, alpha: 1)
        case .memory: return UIColor(red: 0.88, green: 0.9, blue: 0.98, alpha: 1)
        case .salon: return UIColor(red: 0.85, green: 0.93, blue: 0.92, alpha: 1)
        case .minimal: return UIColor(red: 0.45, green: 0.33, blue: 0.3, alpha: 1)
        }
    }

    var accentColor: UIColor {
        switch self {
        case .showcase: return UIColor(red: 0.85, green: 0.7, blue: 0.42, alpha: 1)
        case .memory: return UIColor(red: 0.75, green: 0.78, blue: 0.92, alpha: 1)
        case .salon: return UIColor(red: 0.72, green: 0.85, blue: 0.82, alpha: 1)
        case .minimal: return UIColor(red: 0.72, green: 0.55, blue: 0.45, alpha: 1)
        }
    }

    /// (nail centre Y, nail width, title baseline Y) as fractions — tuned to
    /// each frame's composition (podium, plaque, open sky…).
    var layout: (nailCenterY: CGFloat, nailWidth: CGFloat, titleY: CGFloat) {
        switch self {
        case .showcase: return (0.47, 0.44, 0.845)
        case .memory: return (0.44, 0.5, 0.80)
        case .salon: return (0.42, 0.46, 0.795)
        case .minimal: return (0.45, 0.5, 0.845)
        }
    }
}

enum CardRenderer {
    /// Renders one card at the artwork's native size (941×1672).
    /// - stamp: transparent nail snapshot from the live stage
    /// - subtitle: salon name (salon template) or memo/tag line, optional
    static func render(
        template: CardTemplate,
        stamp: UIImage,
        title: String,
        date: Date,
        subtitle: String? = nil
    ) -> UIImage? {
        guard let background = template.backgroundImage else { return nil }
        let size = CGSize(width: 941, height: 1672)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1

        return UIGraphicsImageRenderer(size: size, format: format).image { ctx in
            let cg = ctx.cgContext
            background.draw(in: CGRect(origin: .zero, size: size))

            // --- brand mark ---
            if template.isDark, let logo = UIImage(named: "logo_nailous_mark") {
                // gold-on-black mark: screen blend melts the black away
                let logoWidth = size.width * 0.2
                let logoHeight = logoWidth * (logo.size.height / max(1, logo.size.width))
                logo.draw(
                    in: CGRect(
                        x: (size.width - logoWidth) / 2,
                        y: size.height * 0.022,
                        width: logoWidth,
                        height: logoHeight
                    ),
                    blendMode: .screen,
                    alpha: 1
                )
            } else {
                draw("NAILOUS", at: 0.05, in: size,
                     font: serif(15, weight: .semibold), color: template.accentColor, kern: 9)
            }

            // --- the nail ---
            let layout = template.layout
            let stampAspect = stamp.size.height / max(1, stamp.size.width)
            var nailWidth = size.width * layout.nailWidth
            var nailHeight = nailWidth * stampAspect
            let maxHeight = size.height * 0.5
            if nailHeight > maxHeight {
                nailHeight = maxHeight
                nailWidth = nailHeight / stampAspect
            }
            let nailRect = CGRect(
                x: (size.width - nailWidth) / 2,
                y: size.height * layout.nailCenterY - nailHeight / 2,
                width: nailWidth,
                height: nailHeight
            )
            // grounding shadow so the stamp sits "in" the scene
            cg.saveGState()
            cg.setShadow(
                offset: CGSize(width: 0, height: nailHeight * 0.05),
                blur: nailHeight * 0.09,
                color: UIColor.black.withAlphaComponent(template.isDark ? 0.55 : 0.25).cgColor
            )
            stamp.draw(in: nailRect)
            cg.restoreGState()

            // --- typography (Swift-drawn, never baked) ---
            let titleY = layout.titleY
            let displayTitle = title.isEmpty ? "MY NAIL" : title
            draw(displayTitle, at: titleY, in: size,
                 font: serif(52, weight: .medium), color: template.textColor, kern: 4)

            let dateText = date.formatted(.dateTime.year().month(.twoDigits).day(.twoDigits))
                .replacingOccurrences(of: "/", with: ".")
            draw(dateText, at: titleY + 0.042, in: size,
                 font: serif(24, weight: .regular), color: template.textColor.withAlphaComponent(0.75), kern: 6)

            if let subtitle, !subtitle.isEmpty {
                draw(subtitle, at: titleY + 0.077, in: size,
                     font: serif(21, weight: .regular), color: template.accentColor, kern: 3)
            }
        }
    }

    private static func serif(_ size: CGFloat, weight: UIFont.Weight) -> UIFont {
        let base = UIFont.systemFont(ofSize: size, weight: weight)
        guard let descriptor = base.fontDescriptor.withDesign(.serif) else { return base }
        return UIFont(descriptor: descriptor, size: size)
    }

    /// Centred single line at a fractional Y (top of the line box).
    private static func draw(
        _ text: String,
        at fractionY: CGFloat,
        in size: CGSize,
        font: UIFont,
        color: UIColor,
        kern: CGFloat
    ) {
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color,
            .kern: kern,
        ]
        let attributed = NSAttributedString(string: text, attributes: attributes)
        var bounds = attributed.size()
        bounds.width = min(bounds.width, size.width * 0.86)
        attributed.draw(
            in: CGRect(
                x: (size.width - bounds.width) / 2,
                y: size.height * fractionY,
                width: bounds.width,
                height: bounds.height + 4
            )
        )
    }
}
