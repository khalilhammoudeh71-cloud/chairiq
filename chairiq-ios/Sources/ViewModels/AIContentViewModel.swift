import Foundation
import Observation

@Observable
final class AIContentViewModel {
    var procedures: [ProcedureLibraryItem] = []
    var selectedProcedureId: UUID?
    var language: Language = .en
    var tone: ContentTone = .professional
    var complexity: ContentComplexity = .detailed

    var generatedDescription: String = ""
    var generatedRisks: String = ""
    var generatedAftercare: String = ""
    var generatedFAQs: [ProcedureFAQ] = []

    var isGeneratingDescription: Bool = false
    var isGeneratingRisks: Bool = false
    var isGeneratingAftercare: Bool = false
    var isGeneratingFAQs: Bool = false
    var isGeneratingAll: Bool = false
    var isSaving: Bool = false

    var isLoading: Bool = false
    var errorMessage: String?
    var successMessage: String?

    var showBatchView: Bool = false

    private let libraryService = ProcedureLibraryService.shared
    private let aiService = AIContentGenerationService.shared

    var selectedProcedure: ProcedureLibraryItem? {
        guard let id = selectedProcedureId else { return nil }
        return procedures.first { $0.id == id }
    }

    var isGenerating: Bool {
        isGeneratingDescription || isGeneratingRisks || isGeneratingAftercare || isGeneratingFAQs || isGeneratingAll
    }

    func loadProcedures() async {
        isLoading = true
        do {
            procedures = try await libraryService.listAll()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func selectProcedure(_ id: UUID?) {
        selectedProcedureId = id
        guard let proc = selectedProcedure else {
            clearGenerated()
            return
        }
        switch language {
        case .en:
            generatedDescription = proc.summaryEn ?? ""
            generatedRisks = proc.risksEn ?? ""
            generatedAftercare = proc.aftercareEn ?? ""
            generatedFAQs = proc.faqsEn ?? []
        case .es:
            generatedDescription = proc.summaryEs ?? proc.summaryEn ?? ""
            generatedRisks = proc.risksEs ?? proc.risksEn ?? ""
            generatedAftercare = proc.aftercareEs ?? proc.aftercareEn ?? ""
            generatedFAQs = proc.faqsEs ?? proc.faqsEn ?? []
        }
    }

    func generateAll() async {
        guard let proc = selectedProcedure else { return }
        isGeneratingAll = true
        errorMessage = nil
        do {
            let request = AIContentGenerationService.GenerationRequest(
                procedureName: proc.titleEn,
                adaCode: nil,
                language: language,
                tone: tone,
                complexity: complexity,
                sections: AIContentGenerationService.ContentSection.allCases
            )
            let content = try await aiService.generateContent(request: request)
            generatedDescription = content.description ?? generatedDescription
            generatedRisks = content.risks ?? generatedRisks
            generatedAftercare = content.aftercare ?? generatedAftercare
            if let faqs = content.faqs { generatedFAQs = faqs }
            successMessage = "All content generated successfully"
            clearSuccessAfterDelay()
        } catch {
            errorMessage = error.localizedDescription
        }
        isGeneratingAll = false
    }

    func generateSection(_ section: AIContentGenerationService.ContentSection) async {
        guard let proc = selectedProcedure else { return }
        setGenerating(section, value: true)
        errorMessage = nil
        do {
            let request = AIContentGenerationService.GenerationRequest(
                procedureName: proc.titleEn,
                adaCode: nil,
                language: language,
                tone: tone,
                complexity: complexity,
                sections: [section]
            )
            let content = try await aiService.generateContent(request: request)
            switch section {
            case .description:
                generatedDescription = content.description ?? generatedDescription
            case .risks:
                generatedRisks = content.risks ?? generatedRisks
            case .aftercare:
                generatedAftercare = content.aftercare ?? generatedAftercare
            case .faqs:
                if let faqs = content.faqs { generatedFAQs = faqs }
            case .whyNeeded:
                break
            }
            successMessage = "\(section.rawValue.capitalized) generated"
            clearSuccessAfterDelay()
        } catch {
            errorMessage = error.localizedDescription
        }
        setGenerating(section, value: false)
    }

    func saveToLibrary() async {
        guard var proc = selectedProcedure else { return }
        isSaving = true
        errorMessage = nil
        switch language {
        case .en:
            proc.summaryEn = generatedDescription
            proc.risksEn = generatedRisks
            proc.aftercareEn = generatedAftercare
            proc.faqsEn = generatedFAQs
        case .es:
            proc.summaryEs = generatedDescription
            proc.risksEs = generatedRisks
            proc.aftercareEs = generatedAftercare
            proc.faqsEs = generatedFAQs
        }
        do {
            let updated = try await libraryService.update(id: proc.id, item: proc)
            if let idx = procedures.firstIndex(where: { $0.id == proc.id }) {
                procedures[idx] = updated
            }
            successMessage = "Content saved to library"
            clearSuccessAfterDelay()
        } catch {
            errorMessage = error.localizedDescription
        }
        isSaving = false
    }

    private func setGenerating(_ section: AIContentGenerationService.ContentSection, value: Bool) {
        switch section {
        case .description: isGeneratingDescription = value
        case .risks: isGeneratingRisks = value
        case .aftercare: isGeneratingAftercare = value
        case .faqs: isGeneratingFAQs = value
        case .whyNeeded: break
        }
    }

    private func clearGenerated() {
        generatedDescription = ""
        generatedRisks = ""
        generatedAftercare = ""
        generatedFAQs = []
    }

    private func clearSuccessAfterDelay() {
        Task { @MainActor in
            try? await Task.sleep(for: .seconds(3))
            successMessage = nil
        }
    }
}
