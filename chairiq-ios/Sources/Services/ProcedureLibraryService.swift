import Foundation
import Supabase

final class ProcedureLibraryService {
    static let shared = ProcedureLibraryService()
    private let client = SupabaseManager.shared.client

    private init() {}

    func listAll() async throws -> [ProcedureLibraryItem] {
        let items: [ProcedureLibraryItem] = try await client.from("procedure_library")
            .select()
            .order("title_en")
            .execute()
            .value
        return items
    }

    func search(query: String) async throws -> [ProcedureLibraryItem] {
        let items: [ProcedureLibraryItem] = try await client.from("procedure_library")
            .select()
            .or("title_en.ilike.%\(query)%,title_es.ilike.%\(query)%,slug.ilike.%\(query)%")
            .order("title_en")
            .execute()
            .value
        return items
    }

    func getBySlug(_ slug: String) async throws -> ProcedureLibraryItem? {
        let item: ProcedureLibraryItem? = try? await client.from("procedure_library")
            .select()
            .eq("slug", value: slug)
            .single()
            .execute()
            .value
        return item
    }

    func getByCategory(_ category: String) async throws -> [ProcedureLibraryItem] {
        let items: [ProcedureLibraryItem] = try await client.from("procedure_library")
            .select()
            .eq("category", value: category)
            .order("title_en")
            .execute()
            .value
        return items
    }

    func create(_ item: ProcedureLibraryItem) async throws -> ProcedureLibraryItem {
        let result: ProcedureLibraryItem = try await client.from("procedure_library")
            .insert(item)
            .select()
            .single()
            .execute()
            .value
        return result
    }

    func update(id: UUID, item: ProcedureLibraryItem) async throws -> ProcedureLibraryItem {
        let result: ProcedureLibraryItem = try await client.from("procedure_library")
            .update(item)
            .eq("id", value: id.uuidString)
            .select()
            .single()
            .execute()
            .value
        return result
    }

    func delete(id: UUID) async throws {
        try await client.from("procedure_library")
            .delete()
            .eq("id", value: id.uuidString)
            .execute()
    }

    func searchADACodes(query: String) async throws -> [ADACode] {
        let codes: [ADACode] = try await client.from("ada_codes")
            .select()
            .or("code.ilike.%\(query)%,description.ilike.%\(query)%")
            .eq("is_active", value: true)
            .order("code")
            .execute()
            .value
        return codes
    }
}
