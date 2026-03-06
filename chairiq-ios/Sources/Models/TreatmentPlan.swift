import Foundation

struct TreatmentPlan: Codable, Identifiable, Hashable {
    let id: UUID
    let patientId: UUID
    var dentistName: String
    var practiceName: String
    let publicToken: String
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case dentistName = "dentist_name"
        case practiceName = "practice_name"
        case publicToken = "public_token"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct EnrichedTreatmentPlan: Codable {
    let id: UUID
    let patientId: UUID
    let dentistName: String
    let practiceName: String
    let publicToken: String
    let createdAt: Date?
    let updatedAt: Date?
    let patients: Patient?
    let planProcedures: [PlanProcedure]?

    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case dentistName = "dentist_name"
        case practiceName = "practice_name"
        case publicToken = "public_token"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case patients
        case planProcedures = "plan_procedures"
    }

    var patient: Patient? { patients }

    var proceduresByPriority: [ProcedurePriority: [PlanProcedure]] {
        guard let procedures = planProcedures else { return [:] }
        return Dictionary(grouping: procedures) { $0.priority ?? .future }
    }

    var sortedProcedures: [PlanProcedure] {
        guard let procedures = planProcedures else { return [] }
        return procedures.sorted { ($0.sortOrder ?? 0) < ($1.sortOrder ?? 0) }
    }
}

struct TreatmentPlanCreateRequest: Codable {
    let patientId: UUID
    let dentistName: String
    let practiceName: String

    enum CodingKeys: String, CodingKey {
        case patientId = "patient_id"
        case dentistName = "dentist_name"
        case practiceName = "practice_name"
    }
}
