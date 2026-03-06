import Foundation

struct Patient: Codable, Identifiable, Hashable {
    let id: UUID
    var firstName: String
    var lastName: String
    var phone: String
    var preferredLanguage: Language
    let createdAt: Date?
    let updatedAt: Date?

    var fullName: String {
        "\(firstName) \(lastName)"
    }

    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case phone
        case preferredLanguage = "preferred_language"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct PatientCreateRequest: Codable {
    let firstName: String
    let lastName: String
    let phone: String
    let preferredLanguage: Language

    enum CodingKeys: String, CodingKey {
        case firstName = "first_name"
        case lastName = "last_name"
        case phone
        case preferredLanguage = "preferred_language"
    }
}
