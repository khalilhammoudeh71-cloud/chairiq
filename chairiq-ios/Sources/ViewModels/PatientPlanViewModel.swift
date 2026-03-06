import Foundation
import SwiftUI

@Observable
final class PatientPlanViewModel {
    var enrichedPlan: EnrichedTreatmentPlan?
    var libraryItems: [String: ProcedureLibraryItem] = [:]
    var procedureVisuals: [String: [ProcedureVisualRecord]] = [:]
    var language: Language = .en
    var isLoading = false
    var errorMessage: String?
    var expandedProcedureIds: Set<UUID> = []
    var currentStepIndex: Int = 0
    var isCompleted = false
    var sessionStartDate = Date()

    var patient: Patient? { enrichedPlan?.patient }
    var procedures: [PlanProcedure] { enrichedPlan?.sortedProcedures ?? [] }
    var planName: String { enrichedPlan?.practiceName ?? "Treatment Plan" }
    var dentistName: String { enrichedPlan?.dentistName ?? "" }
    var practiceName: String { enrichedPlan?.practiceName ?? "" }

    var proceduresByPriority: [(ProcedurePriority, [PlanProcedure])] {
        guard let plan = enrichedPlan else { return [] }
        let grouped = plan.proceduresByPriority
        return ProcedurePriority.allCases.compactMap { priority in
            guard let procs = grouped[priority], !procs.isEmpty else { return nil }
            return (priority, procs)
        }
    }

    var totalSteps: Int { procedures.count }

    var currentProcedure: PlanProcedure? {
        guard currentStepIndex >= 0, currentStepIndex < procedures.count else { return nil }
        return procedures[currentStepIndex]
    }

    var progressPercentage: Double {
        guard totalSteps > 0 else { return 0 }
        return Double(currentStepIndex + 1) / Double(totalSteps)
    }

    func loadPlan(publicToken: String) async {
        isLoading = true
        errorMessage = nil
        do {
            let plan = try await PatientPlanService.shared.getEnrichedPatientPlan(publicToken: publicToken)
            enrichedPlan = plan
            if let patientLang = plan.patient?.preferredLanguage {
                language = patientLang
            }
            await loadLibraryData()
        } catch {
            errorMessage = "Failed to load treatment plan. Please try again."
        }
        isLoading = false
    }

    private func loadLibraryData() async {
        guard let procs = enrichedPlan?.planProcedures else { return }
        for proc in procs {
            if let slug = proc.canonicalSlug ?? proc.procedureSlug {
                async let libraryTask: Void = loadLibraryItem(slug: slug)
                async let visualsTask: Void = loadVisuals(canonicalSlug: slug)
                _ = await (libraryTask, visualsTask)
            }
        }
    }

    private func loadLibraryItem(slug: String) async {
        guard libraryItems[slug] == nil else { return }
        if let item = try? await PatientPlanService.shared.fetchLibraryItemByCanonicalSlug(slug) {
            libraryItems[slug] = item
        } else if let item = try? await PatientPlanService.shared.fetchLibraryItem(slug: slug) {
            libraryItems[slug] = item
        }
    }

    private func loadVisuals(canonicalSlug: String) async {
        guard procedureVisuals[canonicalSlug] == nil else { return }
        if let visuals = try? await PatientPlanService.shared.fetchProcedureVisuals(canonicalSlug: canonicalSlug) {
            procedureVisuals[canonicalSlug] = visuals
        }
    }

    func libraryItem(for procedure: PlanProcedure) -> ProcedureLibraryItem? {
        if let slug = procedure.canonicalSlug ?? procedure.procedureSlug {
            return libraryItems[slug]
        }
        return nil
    }

    func visuals(for procedure: PlanProcedure) -> [ProcedureVisualRecord] {
        if let slug = procedure.canonicalSlug ?? procedure.procedureSlug {
            return procedureVisuals[slug] ?? []
        }
        return []
    }

    func heroImageURL(for procedure: PlanProcedure) -> URL? {
        let vis = visuals(for: procedure)
        if let hero = vis.first(where: { $0.stepKey == "hero" || $0.stepKey == nil }) {
            return URL(string: hero.imageUrl)
        }
        return vis.first.flatMap { URL(string: $0.imageUrl) }
    }

    func toggleExpanded(_ procedureId: UUID) {
        if expandedProcedureIds.contains(procedureId) {
            expandedProcedureIds.remove(procedureId)
        } else {
            expandedProcedureIds.insert(procedureId)
        }
    }

    func isExpanded(_ procedureId: UUID) -> Bool {
        expandedProcedureIds.contains(procedureId)
    }

    func goToNextStep() {
        if currentStepIndex < totalSteps - 1 {
            currentStepIndex += 1
        } else {
            isCompleted = true
        }
    }

    func goToPreviousStep() {
        if currentStepIndex > 0 {
            currentStepIndex -= 1
        }
    }

    func goToStep(_ index: Int) {
        guard index >= 0, index < totalSteps else { return }
        currentStepIndex = index
    }

    var sessionDuration: TimeInterval {
        Date().timeIntervalSince(sessionStartDate)
    }
}
