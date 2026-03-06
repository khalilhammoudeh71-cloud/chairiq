import Foundation
import Observation

@Observable
final class AuthViewModel {
    var isAuthenticated = false
    var isLoading = true
    var currentUser: UserProfile?
    var errorMessage: String?

    private let authService = AuthService.shared
    private var authStateTask: Task<Void, Never>?

    init() {
        startObservingAuthState()
    }

    deinit {
        authStateTask?.cancel()
    }

    func signIn(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        do {
            let profile = try await authService.signIn(email: email, password: password)
            currentUser = profile
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func signUp(email: String, password: String, fullName: String, practiceName: String) async {
        isLoading = true
        errorMessage = nil
        do {
            let profile = try await authService.signUp(
                email: email,
                password: password,
                fullName: fullName,
                practiceName: practiceName
            )
            currentUser = profile
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func signOut() async {
        do {
            try await authService.signOut()
            currentUser = nil
            isAuthenticated = false
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func startObservingAuthState() {
        authStateTask = Task { [weak self] in
            guard let self else { return }
            if let session = await authService.currentSession() {
                do {
                    let profile = try await authService.fetchProfile(userId: session.user.id)
                    await MainActor.run {
                        self.currentUser = profile
                        self.isAuthenticated = true
                        self.isLoading = false
                    }
                } catch {
                    await MainActor.run {
                        self.isLoading = false
                    }
                }
            } else {
                await MainActor.run {
                    self.isLoading = false
                }
            }

            for await (event, session) in authService.observeAuthStateChanges() {
                await MainActor.run {
                    switch event {
                    case .signedIn:
                        self.isAuthenticated = true
                        if let userId = session?.user.id {
                            Task {
                                if let profile = try? await self.authService.fetchProfile(userId: userId) {
                                    await MainActor.run {
                                        self.currentUser = profile
                                    }
                                }
                            }
                        }
                    case .signedOut:
                        self.isAuthenticated = false
                        self.currentUser = nil
                    default:
                        break
                    }
                }
            }
        }
    }
}
