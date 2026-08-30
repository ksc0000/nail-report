import UserNotifications

/// The app's only push: one local notification ~3 weeks after a design is
/// marked as worn — the natural refit window for gel. Marking a new design
/// (or unmarking) replaces/cancels it.
enum RefitReminder {
    private static let identifier = "refit-reminder"
    private static let defaultInterval: TimeInterval = 21 * 24 * 3600
    private static let versionQueue = DispatchQueue(label: "com.nailous.refitReminder.requestVersion")
    private static var requestVersion = 0

    /// A short interval can be injected by UI-test/simulator launches without
    /// changing the production reminder interval.
    private static var interval: TimeInterval {
        let arguments = ProcessInfo.processInfo.arguments
        guard let argumentIndex = arguments.firstIndex(of: "-debugReminderSeconds"),
              arguments.indices.contains(argumentIndex + 1),
              let seconds = TimeInterval(arguments[argumentIndex + 1]),
              seconds >= 1 else {
            return defaultInterval
        }
        return seconds
    }

    static func schedule(designTitle: String) {
        let center = UNUserNotificationCenter.current()
        let version = versionQueue.sync {
            requestVersion += 1
            return requestVersion
        }
        center.removePendingNotificationRequests(withIdentifiers: [identifier])
        center.requestAuthorization(options: [.alert, .sound]) { granted, _ in
            let isCurrent = versionQueue.sync { requestVersion == version }
            guard granted, isCurrent else { return }
            let content = UNMutableNotificationContent()
            content.title = "そろそろ付け替えの時期です"
            content.body = "「\(designTitle)」をつけて3週間。次のデザインを選びませんか？"
            content.sound = .default
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: interval, repeats: false)
            center.add(UNNotificationRequest(identifier: identifier, content: content, trigger: trigger))
        }
    }

    static func cancel() {
        let center = UNUserNotificationCenter.current()
        versionQueue.sync { requestVersion += 1 }
        center.removePendingNotificationRequests(withIdentifiers: [identifier])
        center.removeDeliveredNotifications(withIdentifiers: [identifier])
    }
}
