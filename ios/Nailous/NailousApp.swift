import SwiftData
import SwiftUI

@main
struct NailousApp: App {
    var body: some Scene {
        WindowGroup {
            CollectionView()
        }
        .modelContainer(for: NailRecord.self)
    }
}
