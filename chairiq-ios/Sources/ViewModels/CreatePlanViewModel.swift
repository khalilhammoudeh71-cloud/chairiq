import Foundation
import UIKit
import Observation

@Observable
final class CreatePlanViewModel {
    enum Step: Int, CaseIterable {
        case patientInfo = 0
        case procedures = 1
        case preview = 2

        var title: String {
            switch self {
            case .patientInfo: return "Patient Info"
            case .procedures: return "Procedures"
            case .preview: return "Preview"
            }
        }
    }

    var currentStep: Step = .patientInfo

    var firstName = ""
    var lastName = ""
    var phone = ""
    var preferredLanguage: Language = .en
    var dentistName = ""
    var practiceName = ""

    var procedures: [ProcedureEntry] = []
    var libraryItems: [ProcedureLibraryItem] = []
    var adaCodes: [ADACode] = []
    var searchQuery = ""

    var isLoading = false
    var isSaving = false
    var errorMessage: String?

    var savedResult: PatientPlanService.CreatePlanResult?
    var showShareSheet = false
    var linkCopied = false
    var isSendingSMS = false
    var isSendingEmail = false
    var patientEmail = ""

    private let planService = PatientPlanService.shared
    private let libraryService = ProcedureLibraryService.shared
    private let smsService = SMSService.shared
    private let emailService = EmailService.shared

    struct ProcedureEntry: Identifiable {
        let id = UUID()
        var procedureName: String = ""
        var adaCode: String?
        var priority: ProcedurePriority = .soon
        var estTime: String?
        var notesForPatient: String?
        var procedureSlug: String?
        var displayTitle: String?
        var toothNumbers: [String] = []
        var canonicalSlug: String?

        var effectiveTitle: String {
            displayTitle ?? procedureName
        }

        var toothNumbersString: String? {
            toothNumbers.isEmpty ? nil : toothNumbers.joined(separator: ", ")
        }
    }

    var patientFullName: String {
        "\(firstName) \(lastName)".trimmingCharacters(in: .whitespaces)
    }

    var filteredLibraryItems: [ProcedureLibraryItem] {
        guard !searchQuery.isEmpty else { return libraryItems }
        let q = searchQuery.lowercased()
        return libraryItems.filter {
            $0.titleEn.lowercased().contains(q) ||
            ($0.titleEs?.lowercased().contains(q) ?? false) ||
            $0.slug.lowercased().contains(q)
        }
    }

    var filteredADACodes: [ADACode] {
        guard !searchQuery.isEmpty else { return [] }
        let q = searchQuery.lowercased()
        return adaCodes.filter {
            $0.code.lowercased().contains(q) ||
            $0.description.lowercased().contains(q)
        }
    }

    var shareURL: String? {
        guard let result = savedResult else { return nil }
        return "https://chairiq.app/p/\(result.plan.publicToken)"
    }

    var canAdvanceFromPatientInfo: Bool {
        !firstName.trimmingCharacters(in: .whitespaces).isEmpty &&
        !lastName.trimmingCharacters(in: .whitespaces).isEmpty &&
        !phone.trimmingCharacters(in: .whitespaces).isEmpty &&
        !dentistName.trimmingCharacters(in: .whitespaces).isEmpty &&
        !practiceName.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var canAdvanceFromProcedures: Bool {
        !procedures.isEmpty && procedures.allSatisfy { !$0.effectiveTitle.trimmingCharacters(in: .whitespaces).isEmpty }
    }

    func loadLibraryData() async {
        isLoading = true
        do {
            async let items = libraryService.listAll()
            async let codes = libraryService.searchADACodes(query: "")
            libraryItems = try await items
            adaCodes = try await codes
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func addProcedure(_ entry: ProcedureEntry) {
        procedures.append(entry)
    }

    func addFromLibraryItem(_ item: ProcedureLibraryItem) {
        var entry = ProcedureEntry()
        entry.procedureName = item.titleEn
        entry.displayTitle = item.titleEn
        entry.procedureSlug = item.slug
        entry.canonicalSlug = item.canonicalSlug
        entry.estTime = item.timeEstimate
        procedures.append(entry)
    }

    func addFromADACode(_ code: ADACode) {
        var entry = ProcedureEntry()
        entry.procedureName = code.description
        entry.displayTitle = code.description
        entry.adaCode = code.code
        entry.canonicalSlug = code.canonicalSlug
        procedures.append(entry)
    }

    func removeProcedure(at offsets: IndexSet) {
        procedures.remove(atOffsets: offsets)
    }

    func removeProcedure(id: UUID) {
        procedures.removeAll { $0.id == id }
    }

    func moveProcedure(from source: IndexSet, to destination: Int) {
        procedures.move(fromOffsets: source, toOffset: destination)
    }

    func toggleToothNumber(_ tooth: String, for procedureId: UUID) {
        guard let idx = procedures.firstIndex(where: { $0.id == procedureId }) else { return }
        if procedures[idx].toothNumbers.contains(tooth) {
            procedures[idx].toothNumbers.removeAll { $0 == tooth }
        } else {
            procedures[idx].toothNumbers.append(tooth)
        }
    }

    func advanceStep() {
        guard let next = Step(rawValue: currentStep.rawValue + 1) else { return }
        currentStep = next
    }

    func goBack() {
        guard let prev = Step(rawValue: currentStep.rawValue - 1) else { return }
        currentStep = prev
    }

    func savePlan() async {
        isSaving = true
        errorMessage = nil

        let procedureRequests = procedures.enumerated().map { index, entry in
            PlanProcedureCreateRequest(
                treatmentPlanId: UUID(),
                procedureName: entry.procedureName.isEmpty ? (entry.displayTitle ?? "") : entry.procedureName,
                adaCode: entry.adaCode,
                priority: entry.priority,
                estTime: entry.estTime,
                notesForPatient: entry.notesForPatient,
                sortOrder: index,
                procedureSlug: entry.procedureSlug,
                displayTitle: entry.displayTitle,
                toothNumbers: entry.toothNumbersString,
                canonicalSlug: entry.canonicalSlug
            )
        }

        let input = PatientPlanService.CreatePlanInput(
            firstName: firstName.trimmingCharacters(in: .whitespaces),
            lastName: lastName.trimmingCharacters(in: .whitespaces),
            phone: phone.trimmingCharacters(in: .whitespaces),
            preferredLanguage: preferredLanguage,
            dentistName: dentistName.trimmingCharacters(in: .whitespaces),
            practiceName: practiceName.trimmingCharacters(in: .whitespaces),
            procedures: procedureRequests
        )

        do {
            let result = try await planService.createPatientPlan(input: input)
            await MainActor.run {
                self.savedResult = result
                self.showShareSheet = true
            }
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
            }
        }

        await MainActor.run {
            self.isSaving = false
        }
    }

    func sendSMS() async {
        guard let result = savedResult else { return }
        isSendingSMS = true
        do {
            let response = try await smsService.sendPlanLink(
                to: result.patient.phone,
                patientName: result.patient.firstName,
                publicToken: result.plan.publicToken,
                practiceName: result.plan.practiceName
            )
            if !response.success {
                errorMessage = response.error ?? "Failed to send SMS"
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        isSendingSMS = false
    }

    func sendEmail() async {
        guard let result = savedResult, !patientEmail.isEmpty else { return }
        isSendingEmail = true
        do {
            let response = try await emailService.sendPlanEmail(
                to: patientEmail,
                patientName: result.patient.firstName,
                publicToken: result.plan.publicToken,
                practiceName: result.plan.practiceName,
                dentistName: result.plan.dentistName
            )
            if !response.success {
                errorMessage = response.error ?? "Failed to send email"
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        isSendingEmail = false
    }

    func copyLink() {
        guard let url = shareURL else { return }
        UIPasteboard.general.string = url
        linkCopied = true
        Task {
            try? await Task.sleep(for: .seconds(2))
            await MainActor.run { self.linkCopied = false }
        }
    }

    func reset() {
        currentStep = .patientInfo
        firstName = ""
        lastName = ""
        phone = ""
        preferredLanguage = .en
        procedures = []
        savedResult = nil
        showShareSheet = false
        errorMessage = nil
        searchQuery = ""
        patientEmail = ""
        linkCopied = false
    }
}
