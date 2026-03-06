import Foundation

struct PlanProcedure: Codable, Identifiable, Hashable {
    let id: UUID
    let treatmentPlanId: UUID
    var procedureName: String
    var adaCode: String?
    var priority: ProcedurePriority?
    var estTime: String?
    var notesForPatient: String?
    var sortOrder: Int?
    let createdAt: Date?
    var procedureSlug: String?
    var displayTitle: String?
    var toothNumbers: String?
    var canonicalSlug: String?

    var effectiveTitle: String {
        displayTitle ?? procedureName
    }

    var toothNumbersList: [String] {
        guard let numbers = toothNumbers else { return [] }
        return numbers
            .components(separatedBy: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
    }

    enum CodingKeys: String, CodingKey {
        case id
        case treatmentPlanId = "treatment_plan_id"
        case procedureName = "procedure_name"
        case adaCode = "ada_code"
        case priority
        case estTime = "est_time"
        case notesForPatient = "notes_for_patient"
        case sortOrder = "sort_order"
        case createdAt = "created_at"
        case procedureSlug = "procedure_slug"
        case displayTitle = "display_title"
        case toothNumbers = "tooth_numbers"
        case canonicalSlug = "canonical_slug"
    }
}

struct PlanProcedureCreateRequest: Codable {
    let treatmentPlanId: UUID
    let procedureName: String
    var adaCode: String?
    var priority: ProcedurePriority?
    var estTime: String?
    var notesForPatient: String?
    var sortOrder: Int?
    var procedureSlug: String?
    var displayTitle: String?
    var toothNumbers: String?
    var canonicalSlug: String?

    enum CodingKeys: String, CodingKey {
        case treatmentPlanId = "treatment_plan_id"
        case procedureName = "procedure_name"
        case adaCode = "ada_code"
        case priority
        case estTime = "est_time"
        case notesForPatient = "notes_for_patient"
        case sortOrder = "sort_order"
        case procedureSlug = "procedure_slug"
        case displayTitle = "display_title"
        case toothNumbers = "tooth_numbers"
        case canonicalSlug = "canonical_slug"
    }
}
