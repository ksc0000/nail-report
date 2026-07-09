import UserNotifications

/// The app's only push: one local notification ~3 weeks after a design is
/// marked as worn — the natural refit window for gel. Marking a new design
/// (or unmarking) replaces/cancels it.
enum RefitReminder {
    private static let identifier = "refit-reminder"
    private static let interval: TimeInterval = 21 * 24 * 3600

    static func schedule(designTitle: String) {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound]) { granted, _ in
            guard granted else { return }
            let content = UNMutableNotificationContent()
            content.title = "そろそろ付け替えの時期です"
            content.body = "「\(designTitle)」をつけて3週間。次のデザインを選びませんか？"
            content.sound = .default
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: interval, repeats: false)
            center.removePendingNotificationRequests(withIdentifiers: [identifier])
            center.add(UNNotificationRequest(identifier: identifier, content: content, trigger: trigger))
        }
    }

    static func cancel() {
        UNUserNotificationCenter.current()
            .removePendingNotificationRequests(withIdentifiers: [identifier])
    }
}
