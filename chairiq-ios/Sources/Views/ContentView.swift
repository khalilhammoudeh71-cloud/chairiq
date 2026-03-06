import SwiftUI

struct ContentView: View {
    @Environment(AuthViewModel.self) private var authViewModel

    @State private var deepLinkToken: String?

    var body: some View {
        Group {
            if authViewModel.isLoading {
                LoadingSpinner(message: "Loading ChairIQ...")
            } else if let token = deepLinkToken {
                PatientPlanView(publicToken: token)
                    .toolbar {
                        ToolbarItem(placement: .topBarLeading) {
                            Button("Close") {
                                deepLinkToken = nil
                            }
                        }
                    }
            } else if authViewModel.isAuthenticated {
                AdminTabView()
            } else {
                LoginView()
            }
        }
        .animation(.easeInOut(duration: 0.3), value: authViewModel.isAuthenticated)
        .animation(.easeInOut(duration: 0.3), value: authViewModel.isLoading)
        .onReceive(NotificationCenter.default.publisher(for: .openPatientPlan)) { notification in
            if let token = notification.userInfo?["publicToken"] as? String {
                deepLinkToken = token
            }
        }
    }
}
