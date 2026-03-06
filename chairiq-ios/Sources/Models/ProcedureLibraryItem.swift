import Foundation

struct ProcedureStep: Codable, Hashable {
    let stepTitle: String?
    let stepBody: String?
    let imageKey: String?
}

struct ProcedureFAQ: Codable, Hashable {
    let q: String
    let a: String
}

struct ProcedureVisuals: Codable, Hashable {
    let heroKey: String?
    let stepKeys: [String]?
}

struct ProcedureLibraryItem: Codable, Identifiable, Hashable {
    let id: UUID
    var slug: String
    var titleEn: String
    var titleEs: String?
    var summaryEn: String?
    var summaryEs: String?
    var whyEn: String?
    var whyEs: String?
    var whatIfNotEn: String?
    var whatIfNotEs: String?
    var stepsEn: [ProcedureStep]?
    var stepsEs: [ProcedureStep]?
    var anesthesiaEn: String?
    var anesthesiaEs: String?
    var risksEn: String?
    var risksEs: String?
    var aftercareEn: String?
    var aftercareEs: String?
    var faqsEn: [ProcedureFAQ]?
    var faqsEs: [ProcedureFAQ]?
    var timeEstimate: String?
    var visitsEstimate: String?
    var visuals: ProcedureVisuals?
    var category: String?
    var isPublished: Bool?
    let createdAt: Date?
    let updatedAt: Date?
    var createdBy: UUID?
    var canonicalSlug: String?

    func title(for language: Language) -> String {
        switch language {
        case .en: return titleEn
        case .es: return titleEs ?? titleEn
        }
    }

    func summary(for language: Language) -> String? {
        switch language {
        case .en: return summaryEn
        case .es: return summaryEs ?? summaryEn
        }
    }

    func why(for language: Language) -> String? {
        switch language {
        case .en: return whyEn
        case .es: return whyEs ?? whyEn
        }
    }

    func steps(for language: Language) -> [ProcedureStep]? {
        switch language {
        case .en: return stepsEn
        case .es: return stepsEs ?? stepsEn
        }
    }

    func risks(for language: Language) -> String? {
        switch language {
        case .en: return risksEn
        case .es: return risksEs ?? risksEn
        }
    }

    func aftercare(for language: Language) -> String? {
        switch language {
        case .en: return aftercareEn
        case .es: return aftercareEs ?? aftercareEn
        }
    }

    func faqs(for language: Language) -> [ProcedureFAQ]? {
        switch language {
        case .en: return faqsEn
        case .es: return faqsEs ?? faqsEn
        }
    }

    enum CodingKeys: String, CodingKey {
        case id, slug, visuals, category
        case titleEn = "title_en"
        case titleEs = "title_es"
        case summaryEn = "summary_en"
        case summaryEs = "summary_es"
        case whyEn = "why_en"
        case whyEs = "why_es"
        case whatIfNotEn = "what_if_not_en"
        case whatIfNotEs = "what_if_not_es"
        case stepsEn = "steps_en"
        case stepsEs = "steps_es"
        case anesthesiaEn = "anesthesia_en"
        case anesthesiaEs = "anesthesia_es"
        case risksEn = "risks_en"
        case risksEs = "risks_es"
        case aftercareEn = "aftercare_en"
        case aftercareEs = "aftercare_es"
        case faqsEn = "faqs_en"
        case faqsEs = "faqs_es"
        case timeEstimate = "time_estimate"
        case visitsEstimate = "visits_estimate"
        case isPublished = "is_published"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case createdBy = "created_by"
        case canonicalSlug = "canonical_slug"
    }
}
