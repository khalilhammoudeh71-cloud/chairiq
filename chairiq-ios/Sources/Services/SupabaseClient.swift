import Foundation
import Supabase

final class SupabaseManager {
    static let shared = SupabaseManager()

    let client: SupabaseClient

    private init() {
        guard let urlString = ProcessInfo.processInfo.environment["SUPABASE_URL"] ?? Bundle.main.infoDictionary?["SUPABASE_URL"] as? String,
              let url = URL(string: urlString),
              let anonKey = ProcessInfo.processInfo.environment["SUPABASE_ANON_KEY"] ?? Bundle.main.infoDictionary?["SUPABASE_ANON_KEY"] as? String else {
            fatalError("Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY in Info.plist or environment.")
        }

        client = SupabaseClient(
            supabaseURL: url,
            supabaseKey: anonKey
        )
    }
}
