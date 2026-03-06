import SwiftUI
import Kingfisher

struct PatientPlanView: View {
    let publicToken: String
    @State private var viewModel = PatientPlanViewModel()
    @State private var selectedProcedure: PlanProcedure?
    @State private var showStepByStep = false

    var body: some View {
        Group {
            if viewModel.isLoading {
                LoadingSpinner(message: "Loading your treatment plan...")
            } else if let error = viewModel.errorMessage {
                errorView(error)
            } else if viewModel.enrichedPlan != nil {
                planContent
            }
        }
        .background(ChairIQTheme.Colors.backgroundPrimary)
        .task {
            await viewModel.loadPlan(publicToken: publicToken)
        }
        .sheet(item: $selectedProcedure) { procedure in
            ProcedureDetailView(
                procedure: procedure,
                viewModel: viewModel
            )
        }
        .fullScreenCover(isPresented: $showStepByStep) {
            StepByStepTreatmentView(viewModel: viewModel)
        }
    }

    private var planContent: some View {
        ScrollView {
            VStack(spacing: ChairIQTheme.Spacing.xl) {
                headerSection
                summarySection
                proceduresByPrioritySection
                startButton
            }
            .padding(ChairIQTheme.Spacing.lg)
        }
    }

    private var headerSection: some View {
        VStack(spacing: ChairIQTheme.Spacing.md) {
            HStack {
                Spacer()
                LanguageToggle(language: $viewModel.language)
            }

            if let patient = viewModel.patient {
                VStack(spacing: ChairIQTheme.Spacing.sm) {
                    Text(viewModel.language == .en ? "Welcome, \(patient.firstName)!" : "Bienvenido/a, \(patient.firstName)!")
                        .font(ChairIQTheme.Typography.largeTitle)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                    Text(viewModel.language == .en
                         ? "Your personalized treatment plan from \(viewModel.practiceName)"
                         : "Su plan de tratamiento personalizado de \(viewModel.practiceName)")
                        .font(ChairIQTheme.Typography.body)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                        .multilineTextAlignment(.center)
                }
            }

            if !viewModel.dentistName.isEmpty {
                HStack(spacing: ChairIQTheme.Spacing.sm) {
                    Image(systemName: "stethoscope")
                        .foregroundStyle(ChairIQTheme.Colors.primary)
                    Text("Dr. \(viewModel.dentistName)")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                }
            }
        }
    }

    private var summarySection: some View {
        HStack(spacing: ChairIQTheme.Spacing.md) {
            summaryCard(
                icon: "list.clipboard",
                value: "\(viewModel.procedures.count)",
                label: viewModel.language == .en ? "Procedures" : "Procedimientos"
            )
            summaryCard(
                icon: "exclamationmark.triangle",
                value: "\(viewModel.enrichedPlan?.proceduresByPriority[.immediate]?.count ?? 0)",
                label: viewModel.language == .en ? "Immediate" : "Inmediato"
            )
        }
    }

    private func summaryCard(icon: String, value: String, label: String) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.sm) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(ChairIQTheme.Colors.primary)
            Text(value)
                .font(ChairIQTheme.Typography.title)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
            Text(label)
                .font(ChairIQTheme.Typography.caption)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
        }
        .frame(maxWidth: .infinity)
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var proceduresByPrioritySection: some View {
        VStack(spacing: ChairIQTheme.Spacing.xl) {
            ForEach(viewModel.proceduresByPriority, id: \.0) { priority, procedures in
                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
                    HStack(spacing: ChairIQTheme.Spacing.sm) {
                        Circle()
                            .fill(ChairIQTheme.Colors.priorityColor(priority))
                            .frame(width: 10, height: 10)
                        Text(priority.rawValue)
                            .font(ChairIQTheme.Typography.title2)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                        Spacer()
                        Text("\(procedures.count)")
                            .font(ChairIQTheme.Typography.caption)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                            .padding(.horizontal, ChairIQTheme.Spacing.sm)
                            .padding(.vertical, ChairIQTheme.Spacing.xs)
                            .background(ChairIQTheme.Colors.backgroundSecondary, in: Capsule())
                    }

                    ForEach(procedures) { procedure in
                        ProcedureCard(
                            procedure: procedure,
                            isExpanded: viewModel.isExpanded(procedure.id),
                            onTap: { withAnimation { viewModel.toggleExpanded(procedure.id) } },
                            onLearnMore: { selectedProcedure = procedure }
                        )
                    }
                }
            }
        }
    }

    private var startButton: some View {
        Button {
            showStepByStep = true
        } label: {
            Label(
                viewModel.language == .en ? "Start Guided Walkthrough" : "Iniciar Recorrido Guiado",
                systemImage: "play.fill"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, ChairIQTheme.Spacing.lg)
            .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        }
    }

    private func errorView(_ message: String) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.lg) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundStyle(ChairIQTheme.Colors.danger)
            Text(message)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                .multilineTextAlignment(.center)
            Button("Try Again") {
                Task { await viewModel.loadPlan(publicToken: publicToken) }
            }
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(.white)
            .padding(.horizontal, ChairIQTheme.Spacing.xl)
            .padding(.vertical, ChairIQTheme.Spacing.md)
            .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
