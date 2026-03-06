import Foundation

struct UserProfile: Codable, Identifiable, Hashable {
    let id: UUID
    let email: String
    var fullName: String
    var role: UserRole
    var practiceName: String?
    var phone: String?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, email, role, phone
        case fullName = "full_name"
        case practiceName = "practice_name"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}
