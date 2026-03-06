import Foundation
import Supabase
import Auth

final class AuthService {
    static let shared = AuthService()
    private let client = SupabaseManager.shared.client

    private init() {}

    func signIn(email: String, password: String) async throws -> UserProfile {
        let response = try await client.auth.signIn(
            email: email,
            password: password
        )
        return try await fetchProfile(userId: response.user.id)
    }

    func signUp(
        email: String,
        password: String,
        fullName: String,
        practiceName: String
    ) async throws -> UserProfile {
        let response = try await client.auth.signUp(
            email: email,
            password: password,
            data: [
                "full_name": .string(fullName),
                "practice_name": .string(practiceName),
                "role": .string("dentist")
            ]
        )
        guard let user = response.user else {
            throw AuthError.signUpFailed
        }
        return try await fetchProfile(userId: user.id)
    }

    func signOut() async throws {
        try await client.auth.signOut()
    }

    func currentSession() async -> Session? {
        try? await client.auth.session
    }

    func fetchProfile(userId: UUID) async throws -> UserProfile {
        let profile: UserProfile = try await client.from("user_profiles")
            .select()
            .eq("id", value: userId.uuidString)
            .single()
            .execute()
            .value
        return profile
    }

    func observeAuthStateChanges() -> AsyncStream<(AuthChangeEvent, Session?)> {
        AsyncStream { continuation in
            let task = Task {
                for await (event, session) in client.auth.authStateChanges {
                    continuation.yield((event, session))
                }
                continuation.finish()
            }
            continuation.onTermination = { _ in
                task.cancel()
            }
        }
    }
}

enum AuthError: LocalizedError {
    case signUpFailed
    case notAuthenticated
    case profileNotFound

    var errorDescription: String? {
        switch self {
        case .signUpFailed: return "Sign up failed. Please try again."
        case .notAuthenticated: return "You are not signed in."
        case .profileNotFound: return "User profile not found."
        }
    }
}
