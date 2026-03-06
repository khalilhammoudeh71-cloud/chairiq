import Foundation

struct ProcedureVisualRecord: Codable, Identifiable, Hashable {
    let id: UUID
    let canonicalSlug: String
    let stepKey: String?
    let imageUrl: String
    let altTextEn: String
    let altTextEs: String
    let sortOrder: Int?
    let createdAt: Date?

    func altText(for language: Language) -> String {
        switch language {
        case .en: return altTextEn
        case .es: return altTextEs
        }
    }

    enum CodingKeys: String, CodingKey {
        case id
        case canonicalSlug = "canonical_slug"
        case stepKey = "step_key"
        case imageUrl = "image_url"
        case altTextEn = "alt_text_en"
        case altTextEs = "alt_text_es"
        case sortOrder = "sort_order"
        case createdAt = "created_at"
    }
}
