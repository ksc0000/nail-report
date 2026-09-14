import Foundation

/// Which hand a five-nail record belongs to. Records are one hand each; the
/// thumb→pinky order of `fingerPhotoData` is anatomical, so a left hand shot
/// from above (back of the hand) reverses the photo's left→right order.
enum Hand: String, CaseIterable, Identifiable {
    case right, left

    var id: String { rawValue }

    var label: String {
        switch self {
        case .right: return "右手"
        case .left: return "左手"
        }
    }

    /// In a back-of-hand photo the thumb sits on the left for a right hand
    /// and on the right for a left hand.
    var thumbIsOnPhotoLeft: Bool { self == .right }

    static let storageKey = "lastHand"

    /// The hand chosen last time, so a habitual user never re-picks it.
    static var remembered: Hand {
        Hand(rawValue: UserDefaults.standard.string(forKey: storageKey) ?? "") ?? .right
    }

    func remember() {
        UserDefaults.standard.set(rawValue, forKey: Self.storageKey)
    }
}
