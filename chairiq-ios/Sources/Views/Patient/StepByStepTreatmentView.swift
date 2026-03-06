import SwiftUI
import Kingfisher

struct StepByStepTreatmentView: View {
    @Bindable var viewModel: PatientPlanViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var showImageViewer = false
    @State private var selectedImageURL: URL?
    @State private var selectedImageAlt: String = ""

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isCompleted {
                    TreatmentCompletionView(viewModel: viewModel)
                } else if let procedure = viewModel.currentProcedure {
                    stepContent(procedure: procedure)
                } else {
                    LoadingSpinner(message: viewModel.language == .en ? "Loading steps..." : "Cargando pasos...")
                }
            }
            .background(ChairIQTheme.Colors.backgroundPrimary)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    }
                }
                ToolbarItem(placement: .principal) {
                    Text(viewModel.language == .en ? "Step-by-Step Guide" : "Guía Paso a Paso")
                        .font(ChairIQTheme.Typography.headline)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    LanguageToggle(language: $viewModel.language)
                }
            }
            .sheet(isPresented: $showImageViewer) {
                FullScreenImageViewer(imageURL: selectedImageURL, altText: selectedImageAlt)
            }
        }
    }

    private func stepContent(procedure: PlanProcedure) -> some View {
        ScrollView {
            VStack(spacing: ChairIQTheme.Spacing.xl) {
                ProgressIndicatorBar(current: viewModel.currentStepIndex + 1, total: viewModel.totalSteps)
                    .padding(.horizontal, ChairIQTheme.Spacing.lg)

                stepHeroImage(procedure: procedure)
                stepInfo(procedure: procedure)
                stepDetails(procedure: procedure)
                navigationButtons
            }
            .padding(.vertical, ChairIQTheme.Spacing.lg)
        }
    }

    private func stepHeroImage(procedure: PlanProcedure) -> some View {
        Group {
            if let heroURL = viewModel.heroImageURL(for: procedure) {
                Button {
                    selectedImageURL = heroURL
                    selectedImageAlt = procedure.effectiveTitle
                    showImageViewer = true
                } label: {
                    AsyncImageView(url: heroURL, contentMode: .fill, cornerRadius: ChairIQTheme.Radius.lg)
                        .frame(height: 200)
                        .clipped()
                }
                .padding(.horizontal, ChairIQTheme.Spacing.lg)
            }
        }
    }

    private func stepInfo(procedure: PlanProcedure) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            HStack {
                Text(viewModel.language == .en ? "Step \(viewModel.currentStepIndex + 1)" : "Paso \(viewModel.currentStepIndex + 1)")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                    .fontWeight(.semibold)
                    .padding(.horizontal, ChairIQTheme.Spacing.sm)
                    .padding(.vertical, ChairIQTheme.Spacing.xs)
                    .background(ChairIQTheme.Colors.primaryLight, in: Capsule())

                Spacer()

                if let priority = procedure.priority {
                    PriorityBadge(priority: priority)
                }
            }

            Text(procedure.effectiveTitle)
                .font(ChairIQTheme.Typography.title)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            if let code = procedure.adaCode {
                Text("ADA Code: \(code)")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
            }

            if let time = procedure.estTime {
                Label(time, systemImage: "clock")
                    .font(ChairIQTheme.Typography.subheadline)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            }
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
    }

    private func stepDetails(procedure: PlanProcedure) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.lg) {
            if let libraryItem = viewModel.libraryItem(for: procedure) {
                if let summary = libraryItem.summary(for: viewModel.language) {
                    detailSection(
                        title: viewModel.language == .en ? "Overview" : "Resumen",
                        icon: "doc.text",
                        content: summary
                    )
                }

                if let why = libraryItem.why(for: viewModel.language) {
                    detailSection(
                        title: viewModel.language == .en ? "Why This Treatment?" : "¿Por Qué Este Tratamiento?",
                        icon: "questionmark.circle",
                        content: why
                    )
                }

                if let steps = libraryItem.steps(for: viewModel.language), !steps.isEmpty {
                    stepsSection(steps: steps, procedure: procedure)
                }

                if let risks = libraryItem.risks(for: viewModel.language) {
                    detailSection(
                        title: viewModel.language == .en ? "Risks & Considerations" : "Riesgos y Consideraciones",
                        icon: "exclamationmark.shield",
                        content: risks
                    )
                }

                if let aftercare = libraryItem.aftercare(for: viewModel.language) {
                    detailSection(
                        title: viewModel.language == .en ? "Aftercare" : "Cuidados Posteriores",
                        icon: "heart.text.square",
                        content: aftercare
                    )
                }
            } else if let notes = procedure.notesForPatient, !notes.isEmpty {
                detailSection(
                    title: viewModel.language == .en ? "Notes from Your Dentist" : "Notas de Su Dentista",
                    icon: "note.text",
                    content: notes
                )
            }

            visualGallery(procedure: procedure)
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
    }

    private func detailSection(title: String, icon: String, content: String) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            Label(title, systemImage: icon)
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            Text(content)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                .lineSpacing(4)
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func stepsSection(steps: [ProcedureStep], procedure: PlanProcedure) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            Label(
                viewModel.language == .en ? "What to Expect" : "Qué Esperar",
                systemImage: "list.number"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                HStack(alignment: .top, spacing: ChairIQTheme.Spacing.md) {
                    ZStack {
                        Circle()
                            .fill(ChairIQTheme.Colors.primary)
                            .frame(width: 28, height: 28)
                        Text("\(index + 1)")
                            .font(ChairIQTheme.Typography.caption)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                    }

                    VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                        if let title = step.stepTitle {
                            Text(title)
                                .font(ChairIQTheme.Typography.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                        }
                        if let body = step.stepBody {
                            Text(body)
                                .font(ChairIQTheme.Typography.body)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                        }
                    }
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func visualGallery(procedure: PlanProcedure) -> some View {
        let visuals = viewModel.visuals(for: procedure)
        return Group {
            if !visuals.isEmpty {
                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                    Label(
                        viewModel.language == .en ? "Visual Guide" : "Guía Visual",
                        systemImage: "photo.on.rectangle.angled"
                    )
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: ChairIQTheme.Spacing.md) {
                            ForEach(visuals) { visual in
                                Button {
                                    selectedImageURL = URL(string: visual.imageUrl)
                                    selectedImageAlt = visual.altText(for: viewModel.language)
                                    showImageViewer = true
                                } label: {
                                    AsyncImageView(
                                        url: URL(string: visual.imageUrl),
                                        contentMode: .fill,
                                        cornerRadius: ChairIQTheme.Radius.md
                                    )
                                    .frame(width: 160, height: 120)
                                    .clipped()
                                }
                            }
                        }
                    }
                }
                .padding(ChairIQTheme.Spacing.lg)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
                .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
            }
        }
    }

    private var navigationButtons: some View {
        HStack(spacing: ChairIQTheme.Spacing.md) {
            if viewModel.currentStepIndex > 0 {
                Button {
                    withAnimation { viewModel.goToPreviousStep() }
                } label: {
                    Label(
                        viewModel.language == .en ? "Previous" : "Anterior",
                        systemImage: "chevron.left"
                    )
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ChairIQTheme.Spacing.md)
                    .background(ChairIQTheme.Colors.primaryLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }
            }

            Button {
                withAnimation { viewModel.goToNextStep() }
            } label: {
                Label(
                    viewModel.currentStepIndex < viewModel.totalSteps - 1
                        ? (viewModel.language == .en ? "Next" : "Siguiente")
                        : (viewModel.language == .en ? "Complete" : "Completar"),
                    systemImage: viewModel.currentStepIndex < viewModel.totalSteps - 1 ? "chevron.right" : "checkmark"
                )
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, ChairIQTheme.Spacing.md)
                .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
            }
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
        .padding(.bottom, ChairIQTheme.Spacing.xxl)
    }
}
