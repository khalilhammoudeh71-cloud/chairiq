import Foundation
import Supabase

final class PatientPlanService {
    static let shared = PatientPlanService()
    private let client = SupabaseManager.shared.client

    private init() {}

    struct CreatePlanInput {
        let firstName: String
        let lastName: String
        let phone: String
        let preferredLanguage: Language
        let dentistName: String
        let practiceName: String
        let procedures: [PlanProcedureCreateRequest]
    }

    struct CreatePlanResult {
        let patient: Patient
        let plan: TreatmentPlan
        let procedures: [PlanProcedure]
        var shareUrl: String {
            "https://chairiq.app/p/\(plan.publicToken)"
        }
    }

    func createPatientPlan(input: CreatePlanInput) async throws -> CreatePlanResult {
        let existingPatient: Patient? = try? await client.from("patients")
            .select()
            .eq("phone", value: input.phone)
            .single()
            .execute()
            .value

        let patient: Patient
        if let existing = existingPatient {
            patient = existing
        } else {
            let request = PatientCreateRequest(
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                preferredLanguage: input.preferredLanguage
            )
            patient = try await client.from("patients")
                .insert(request)
                .select()
                .single()
                .execute()
                .value
        }

        let planRequest = TreatmentPlanCreateRequest(
            patientId: patient.id,
            dentistName: input.dentistName,
            practiceName: input.practiceName
        )
        let plan: TreatmentPlan = try await client.from("treatment_plans")
            .insert(planRequest)
            .select()
            .single()
            .execute()
            .value

        var createdProcedures: [PlanProcedure] = []
        for (index, var procedureInput) in input.procedures.enumerated() {
            var request = procedureInput
            let resolvedSlug = try? await resolveCanonicalSlug(
                slug: request.procedureSlug,
                adaCode: request.adaCode
            )

            let createRequest = PlanProcedureCreateRequest(
                treatmentPlanId: plan.id,
                procedureName: request.procedureName,
                adaCode: request.adaCode,
                priority: request.priority,
                estTime: request.estTime,
                notesForPatient: request.notesForPatient,
                sortOrder: index,
                procedureSlug: request.procedureSlug,
                displayTitle: request.displayTitle,
                toothNumbers: request.toothNumbers,
                canonicalSlug: resolvedSlug ?? request.canonicalSlug
            )

            let procedure: PlanProcedure = try await client.from("plan_procedures")
                .insert(createRequest)
                .select()
                .single()
                .execute()
                .value
            createdProcedures.append(procedure)
        }

        return CreatePlanResult(patient: patient, plan: plan, procedures: createdProcedures)
    }

    func getEnrichedPatientPlan(publicToken: String) async throws -> EnrichedTreatmentPlan {
        let plan: EnrichedTreatmentPlan = try await client.from("treatment_plans")
            .select("*, patients(*), plan_procedures(*)")
            .eq("public_token", value: publicToken)
            .single()
            .execute()
            .value
        return plan
    }

    func fetchProcedureVisuals(canonicalSlug: String) async throws -> [ProcedureVisualRecord] {
        let visuals: [ProcedureVisualRecord] = try await client.from("procedure_visuals")
            .select()
            .eq("canonical_slug", value: canonicalSlug)
            .order("sort_order")
            .execute()
            .value
        return visuals
    }

    func fetchLibraryItem(slug: String) async throws -> ProcedureLibraryItem? {
        let item: ProcedureLibraryItem? = try? await client.from("procedure_library")
            .select()
            .eq("slug", value: slug)
            .single()
            .execute()
            .value
        return item
    }

    func fetchLibraryItemByCanonicalSlug(_ canonicalSlug: String) async throws -> ProcedureLibraryItem? {
        let item: ProcedureLibraryItem? = try? await client.from("procedure_library")
            .select()
            .eq("canonical_slug", value: canonicalSlug)
            .single()
            .execute()
            .value
        return item
    }

    func resolveCanonicalSlug(slug: String?, adaCode: String?) async throws -> String? {
        if let slug = slug {
            let result: ProcedureLibraryItem? = try? await client.from("procedure_library")
                .select("canonical_slug")
                .eq("slug", value: slug)
                .single()
                .execute()
                .value
            if let canonical = result?.canonicalSlug {
                return canonical
            }
        }

        if let code = adaCode {
            let result: ADACode? = try? await client.from("ada_codes")
                .select("canonical_slug")
                .eq("code", value: code)
                .single()
                .execute()
                .value
            if let canonical = result?.canonicalSlug {
                return canonical
            }
        }

        return nil
    }

    func getDentistPlans() async throws -> [EnrichedTreatmentPlan] {
        let plans: [EnrichedTreatmentPlan] = try await client.from("treatment_plans")
            .select("*, patients(*), plan_procedures(*)")
            .order("created_at", ascending: false)
            .execute()
            .value
        return plans
    }

    func deletePlan(planId: UUID) async throws {
        try await client.from("treatment_plans")
            .delete()
            .eq("id", value: planId.uuidString)
            .execute()
    }

    func resolveVisualUrl(path: String) -> URL? {
        try? client.storage
            .from("procedure-visuals")
            .getPublicURL(path: path)
    }
}
