import Foundation
import Observation

@Observable
final class ProcedureLibraryViewModel {
    var procedures: [ProcedureLibraryItem] = []
    var filteredProcedures: [ProcedureLibraryItem] = []
    var searchText: String = "" { didSet { applyFilters() } }
    var selectedCategory: String = "all" { didSet { applyFilters() } }
    var selectedStatus: String = "all" { didSet { applyFilters() } }
    var isLoading: Bool = false
    var errorMessage: String?
    var successMessage: String?
    var deleteConfirmItem: ProcedureLibraryItem?

    private let service = ProcedureLibraryService.shared

    static let allCategories: [(value: String, label: String)] = [
        ("all", "All Categories"),
        ("preventive", "Preventive"),
        ("restorative", "Restorative"),
        ("endodontic", "Endodontic"),
        ("periodontic", "Periodontic"),
        ("prosthodontic", "Prosthodontic"),
        ("surgery", "Surgery"),
        ("orthodontic", "Orthodontic"),
        ("diagnostic", "Diagnostic"),
        ("cosmetic", "Cosmetic"),
        ("implants", "Implants"),
        ("pediatric", "Pediatric"),
        ("emergency", "Emergency"),
        ("other", "Other")
    ]

    func loadProcedures() async {
        isLoading = true
        errorMessage = nil
        do {
            procedures = try await service.listAll()
            applyFilters()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func deleteProcedure(_ item: ProcedureLibraryItem) async {
        do {
            try await service.delete(id: item.id)
            procedures.removeAll { $0.id == item.id }
            applyFilters()
            successMessage = "Deleted \"\(item.titleEn)\" successfully"
            clearSuccessAfterDelay()
        } catch {
            errorMessage = error.localizedDescription
        }
        deleteConfirmItem = nil
    }

    func togglePublished(_ item: ProcedureLibraryItem) async {
        var updated = item
        updated.isPublished = !(item.isPublished ?? false)
        do {
            let result = try await service.update(id: item.id, item: updated)
            if let idx = procedures.firstIndex(where: { $0.id == item.id }) {
                procedures[idx] = result
            }
            applyFilters()
            let status = (result.isPublished ?? false) ? "published" : "unpublished"
            successMessage = "\"\(result.titleEn)\" is now \(status)"
            clearSuccessAfterDelay()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func contentCompleteness(for item: ProcedureLibraryItem) -> Int {
        let fields: [String?] = [
            item.titleEn, item.titleEs,
            item.summaryEn, item.summaryEs,
            item.whyEn, item.whyEs,
            item.aftercareEn, item.aftercareEs
        ]
        let arrayFields: [Bool] = [
            (item.stepsEn?.isEmpty == false),
            (item.stepsEs?.isEmpty == false),
            (item.faqsEn?.isEmpty == false),
            (item.faqsEs?.isEmpty == false)
        ]
        let total = fields.count + arrayFields.count
        var filled = 0
        for f in fields {
            if let f, !f.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { filled += 1 }
        }
        for a in arrayFields {
            if a { filled += 1 }
        }
        guard total > 0 else { return 0 }
        return Int(round(Double(filled) / Double(total) * 100))
    }

    private func applyFilters() {
        var result = procedures

        if !searchText.isEmpty {
            let query = searchText.lowercased()
            result = result.filter { item in
                item.titleEn.lowercased().contains(query) ||
                (item.titleEs?.lowercased().contains(query) ?? false) ||
                item.slug.lowercased().contains(query)
            }
        }

        if selectedCategory != "all" {
            result = result.filter { ($0.category ?? "").lowercased() == selectedCategory.lowercased() }
        }

        if selectedStatus == "published" {
            result = result.filter { $0.isPublished == true }
        } else if selectedStatus == "draft" {
            result = result.filter { $0.isPublished != true }
        }

        filteredProcedures = result
    }

    private func clearSuccessAfterDelay() {
        Task { @MainActor in
            try? await Task.sleep(for: .seconds(3))
            successMessage = nil
        }
    }
}
