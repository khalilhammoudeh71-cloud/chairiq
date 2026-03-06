import Foundation

enum ProcedurePriority: String, Codable, CaseIterable {
    case immediate = "Immediate"
    case soon = "Soon"
    case future = "Future"

    var displayColor: String {
        switch self {
        case .immediate: return "red"
        case .soon: return "orange"
        case .future: return "blue"
        }
    }

    var sortOrder: Int {
        switch self {
        case .immediate: return 0
        case .soon: return 1
        case .future: return 2
        }
    }
}

enum UserRole: String, Codable {
    case dentist
    case patient
    case admin
}

enum Language: String, Codable, CaseIterable {
    case en = "EN"
    case es = "ES"

    var displayName: String {
        switch self {
        case .en: return "English"
        case .es: return "Español"
        }
    }
}

enum ProcedureCategory: String, Codable, CaseIterable {
    case restorative
    case preventive
    case surgery
    case endodontic
    case periodontic
    case prosthodontic
    case orthodontic
    case diagnostic
    case other

    var displayName: String {
        rawValue.capitalized
    }
}

enum DeliveryStatus: String, Codable {
    case sent
    case failed
    case pending
}

enum ContentTone: String, Codable, CaseIterable {
    case professional = "Professional"
    case friendly = "Friendly"
    case simple = "Simple"
}

enum ContentComplexity: String, Codable, CaseIterable {
    case basic = "Basic"
    case moderate = "Moderate"
    case detailed = "Detailed"
}
