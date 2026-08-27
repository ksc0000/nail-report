import SwiftData
import SwiftUI
import UIKit
import UserNotifications

final class NailousAppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // .list keeps a missed banner in Notification Center — a refit
        // reminder must remain findable, not vanish after five seconds.
        completionHandler([.banner, .list, .sound])
    }
}

@main
struct NailousApp: App {
    @UIApplicationDelegateAdaptor(NailousAppDelegate.self) private var appDelegate

    var body: some Scene {
        WindowGroup {
            CollectionView()
                .task {
                    if DetectionBenchmark.isRequested {
                        await DetectionBenchmark.run()
                    }
                    if ColorBalanceBenchmark.isRequested {
                        ColorBalanceBenchmark.run()
                    }
                }
        }
        .modelContainer(for: NailRecord.self)
    }
}
