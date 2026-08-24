import SwiftData
import SwiftUI

@main
struct NailousApp: App {
    var body: some Scene {
        WindowGroup {
            CollectionView()
                .task {
                    if DetectionBenchmark.isRequested {
                        await DetectionBenchmark.run()
                    }
                }
        }
        .modelContainer(for: NailRecord.self)
    }
}
