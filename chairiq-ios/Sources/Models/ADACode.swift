import Foundation

struct ADACode: Codable, Identifiable, Hashable {
    var id: String { code }
    let code: String
    let description: String
    let canonicalSlug: String?
    let isActive: Bool?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case code, description
        case canonicalSlug = "canonical_slug"
        case isActive = "is_active"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}
