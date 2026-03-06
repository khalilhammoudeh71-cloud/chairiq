import Foundation
import Observation
import Supabase

struct DashboardStats {
    var totalPatients: Int = 0
    var monthlyPlans: Int = 0
    var completionRate: Int = 0
    var avgEngagementMinutes: Int = 0
}

struct RecentPlan: Identifiable {
    let id: UUID
    let patientName: String
    let patientPhone: String
    let createdAt: Date?
    let publicToken: String
    let dentistName: String
}

struct PendingAction: Identifiable {
    let id: UUID
    let type: String
    let message: String
    let priority: String
    let publicToken: String?
}

struct PatientEngagement: Identifiable {
    let id: UUID
    let patientName: String
    let language: String
    let publicToken: String
    let timeSpent: Int
    let completionStatus: String
    let completionPercentage: Int
}

struct EngagementTrend: Identifiable {
    let id = UUID()
    let date: String
    var planViews: Int
    var procedureViews: Int
    var completions: Int
}

struct OverallMetrics {
    var totalPatients: Int = 0
    var activePlans: Int = 0
    var completionRate: Int = 0
    var avgEngagementTime: Int = 0
}

@Observable
final class AdminDashboardViewModel {
    var isLoading = true
    var errorMessage: String?
    var stats = DashboardStats()
    var recentPlans: [RecentPlan] = []
    var pendingActions: [PendingAction] = []
    var searchQuery = ""
    var searchResults: [Patient] = []
    var isSearching = false
    var selectedPatient: Patient?
    var selectedPatientPlans: [EnrichedTreatmentPlan] = []

    var overallMetrics = OverallMetrics()
    var engagementTrends: [EngagementTrend] = []
    var patientEngagementList: [PatientEngagement] = []
    var selectedTimeRange = "30d"

    private let client = SupabaseManager.shared.client

    func loadDashboardData() async {
        await MainActor.run { isLoading = true; errorMessage = nil }
        do {
            async let statsResult = fetchDashboardStats()
            async let plansResult = fetchRecentPlans(limit: 5)
            async let actionsResult = fetchPendingActions()
            let (s, p, a) = try await (statsResult, plansResult, actionsResult)
            await MainActor.run {
                self.stats = s
                self.recentPlans = p
                self.pendingActions = a
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
                self.isLoading = false
            }
        }
    }

    func loadAnalyticsData() async {
        await MainActor.run { isLoading = true; errorMessage = nil }
        do {
            async let metricsResult = fetchOverallMetrics()
            async let trendsResult = fetchEngagementTrends()
            async let engagementResult = fetchPatientEngagementList()
            let (m, t, e) = try await (metricsResult, trendsResult, engagementResult)
            await MainActor.run {
                self.overallMetrics = m
                self.engagementTrends = t
                self.patientEngagementList = e
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
                self.isLoading = false
            }
        }
    }

    func searchPatients() async {
        let query = searchQuery.trimmingCharacters(in: .whitespacesAndNewlines)
        guard query.count >= 2 else {
            await MainActor.run { searchResults = [] }
            return
        }
        await MainActor.run { isSearching = true }
        do {
            let results: [Patient] = try await client.from("patients")
                .select()
                .or("first_name.ilike.%\(query)%,last_name.ilike.%\(query)%,phone.ilike.%\(query)%")
                .order("created_at", ascending: false)
                .limit(10)
                .execute()
                .value
            await MainActor.run {
                self.searchResults = results
                self.isSearching = false
            }
        } catch {
            await MainActor.run {
                self.searchResults = []
                self.isSearching = false
            }
        }
    }

    func selectPatient(_ patient: Patient) async {
        await MainActor.run { selectedPatient = patient }
        do {
            let plans: [EnrichedTreatmentPlan] = try await client.from("treatment_plans")
                .select("*, patients(*), plan_procedures(*)")
                .eq("patient_id", value: patient.id.uuidString)
                .order("created_at", ascending: false)
                .execute()
                .value
            await MainActor.run { self.selectedPatientPlans = plans }
        } catch {
            await MainActor.run { self.selectedPatientPlans = [] }
        }
    }

    func deletePatient(_ patientId: UUID) async -> Bool {
        do {
            try await client.from("patients")
                .delete()
                .eq("id", value: patientId.uuidString)
                .execute()
            await MainActor.run {
                self.selectedPatient = nil
                self.selectedPatientPlans = []
                self.searchResults.removeAll { $0.id == patientId }
            }
            return true
        } catch {
            await MainActor.run { self.errorMessage = error.localizedDescription }
            return false
        }
    }

    func copyPlanLink(publicToken: String) -> String {
        "https://chairiq.app/p/\(publicToken)"
    }

    private func fetchDashboardStats() async throws -> DashboardStats {
        let patientsCount: Int = try await client.from("patients")
            .select("*", head: true, count: .exact)
            .execute()
            .count ?? 0

        let startOfMonth = Calendar.current.date(from: Calendar.current.dateComponents([.year, .month], from: Date()))!
        let monthlyCount: Int = try await client.from("treatment_plans")
            .select("*", head: true, count: .exact)
            .gte("created_at", value: ISO8601DateFormatter().string(from: startOfMonth))
            .execute()
            .count ?? 0

        return DashboardStats(
            totalPatients: patientsCount,
            monthlyPlans: monthlyCount,
            completionRate: 0,
            avgEngagementMinutes: 0
        )
    }

    private func fetchRecentPlans(limit: Int) async throws -> [RecentPlan] {
        struct PlanRow: Codable {
            let id: UUID
            let createdAt: Date?
            let publicToken: String
            let dentistName: String
            let patients: Patient?

            enum CodingKeys: String, CodingKey {
                case id
                case createdAt = "created_at"
                case publicToken = "public_token"
                case dentistName = "dentist_name"
                case patients
            }
        }

        let rows: [PlanRow] = try await client.from("treatment_plans")
            .select("id, created_at, public_token, dentist_name, patients(id, first_name, last_name, phone, preferred_language, created_at, updated_at)")
            .order("created_at", ascending: false)
            .limit(limit)
            .execute()
            .value

        return rows.map { row in
            RecentPlan(
                id: row.id,
                patientName: row.patients?.fullName ?? "Unknown Patient",
                patientPhone: row.patients?.phone ?? "N/A",
                createdAt: row.createdAt,
                publicToken: row.publicToken,
                dentistName: row.dentistName
            )
        }
    }

    private func fetchPendingActions() async throws -> [PendingAction] {
        return []
    }

    private func fetchOverallMetrics() async throws -> OverallMetrics {
        let patientsCount: Int = try await client.from("patients")
            .select("*", head: true, count: .exact)
            .execute()
            .count ?? 0

        let plansCount: Int = try await client.from("treatment_plans")
            .select("*", head: true, count: .exact)
            .execute()
            .count ?? 0

        return OverallMetrics(
            totalPatients: patientsCount,
            activePlans: plansCount,
            completionRate: 0,
            avgEngagementTime: 0
        )
    }

    private func fetchEngagementTrends() async throws -> [EngagementTrend] {
        return []
    }

    private func fetchPatientEngagementList() async throws -> [PatientEngagement] {
        struct PatientRow: Codable {
            let id: UUID
            let firstName: String
            let lastName: String
            let preferredLanguage: String

            enum CodingKeys: String, CodingKey {
                case id
                case firstName = "first_name"
                case lastName = "last_name"
                case preferredLanguage = "preferred_language"
            }
        }

        struct PlanTokenRow: Codable {
            let publicToken: String
            let patientId: UUID

            enum CodingKeys: String, CodingKey {
                case publicToken = "public_token"
                case patientId = "patient_id"
            }
        }

        let patients: [PatientRow] = try await client.from("patients")
            .select("id, first_name, last_name, preferred_language")
            .execute()
            .value

        let plans: [PlanTokenRow] = try await client.from("treatment_plans")
            .select("public_token, patient_id")
            .execute()
            .value

        let plansByPatient = Dictionary(grouping: plans) { $0.patientId }

        return patients.map { patient in
            let token = plansByPatient[patient.id]?.first?.publicToken ?? ""
            return PatientEngagement(
                id: patient.id,
                patientName: "\(patient.firstName) \(patient.lastName)",
                language: patient.preferredLanguage,
                publicToken: token,
                timeSpent: 0,
                completionStatus: "0/0",
                completionPercentage: 0
            )
        }
    }
}
