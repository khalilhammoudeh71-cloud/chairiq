import SwiftUI

@main
struct ChairIQApp: App {
    @State private var authViewModel = AuthViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(authViewModel)
                .onOpenURL { url in
                    handleDeepLink(url)
                }
        }
    }

    private func handleDeepLink(_ url: URL) {
        guard let host = url.host(),
              host == "chairiq" || host.contains("chairiq"),
              url.pathComponents.count >= 3,
              url.pathComponents[1] == "p" else { return }
        let token = url.pathComponents[2]
        NotificationCenter.default.post(
            name: .openPatientPlan,
            object: nil,
            userInfo: ["publicToken": token]
        )
    }
}

extension Notification.Name {
    static let openPatientPlan = Notification.Name("openPatientPlan")
}
