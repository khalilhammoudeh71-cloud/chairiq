import SwiftUI

struct TreatmentCompletionView: View {
    @Bindable var viewModel: PatientPlanViewModel
    @Environment(\.dismiss) private var dismiss

    private var content: (congratulations: String, mainMessage: String, subtitle: String, reviewButton: String, homeButton: String) {
        if viewModel.language == .en {
            return (
                "Congratulations!",
                "You've completed your treatment plan",
                "You've successfully reviewed all procedures in your personalized dental education plan. You're now well-prepared for your upcoming dental visits.",
                "Review Procedures",
                "Return Home"
            )
        } else {
            return (
                "¡Felicidades!",
                "Ha completado su plan de tratamiento",
                "Ha revisado exitosamente todos los procedimientos en su plan de educación dental personalizado. Ahora está bien preparado para sus próximas visitas dentales.",
                "Revisar Procedimientos",
                "Regresar al Inicio"
            )
        }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: ChairIQTheme.Spacing.xl) {
                Spacer().frame(height: ChairIQTheme.Spacing.xxl)

                completionBadge
                messageSection
                summaryCard
                nextStepsCard
                contactCard
                actionButtons

                Spacer().frame(height: ChairIQTheme.Spacing.xxl)
            }
            .padding(.horizontal, ChairIQTheme.Spacing.lg)
        }
        .background(ChairIQTheme.Colors.backgroundPrimary)
    }

    private var completionBadge: some View {
        ZStack {
            Circle()
                .fill(ChairIQTheme.Colors.successLight)
                .frame(width: 96, height: 96)
            Circle()
                .stroke(ChairIQTheme.Colors.success.opacity(0.3), lineWidth: 4)
                .frame(width: 96, height: 96)
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 48))
                .foregroundStyle(ChairIQTheme.Colors.success)
        }
    }

    private var messageSection: some View {
        VStack(spacing: ChairIQTheme.Spacing.md) {
            Text(content.congratulations)
                .font(ChairIQTheme.Typography.largeTitle)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            Text(content.mainMessage)
                .font(ChairIQTheme.Typography.title2)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)

            Text(content.subtitle)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
        }
        .multilineTextAlignment(.center)
    }

    private var summaryCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Label(
                viewModel.language == .en ? "Learning Summary" : "Resumen de Aprendizaje",
                systemImage: "chart.bar.doc.horizontal"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            HStack(spacing: ChairIQTheme.Spacing.lg) {
                summaryMetric(
                    value: "\(viewModel.procedures.count)",
                    label: viewModel.language == .en ? "Procedures\nReviewed" : "Procedimientos\nRevisados",
                    color: ChairIQTheme.Colors.primary
                )
                summaryMetric(
                    value: formatDuration(viewModel.sessionDuration),
                    label: viewModel.language == .en ? "Time\nSpent" : "Tiempo\nDedicado",
                    color: ChairIQTheme.Colors.secondary
                )
                summaryMetric(
                    value: "100%",
                    label: viewModel.language == .en ? "Plan\nComplete" : "Plan\nCompletado",
                    color: ChairIQTheme.Colors.success
                )
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func summaryMetric(value: String, label: String, color: Color) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.xs) {
            Text(value)
                .font(ChairIQTheme.Typography.title)
                .foregroundStyle(color)
            Text(label)
                .font(ChairIQTheme.Typography.caption)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }

    private var nextStepsCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Label(
                viewModel.language == .en ? "Next Steps" : "Próximos Pasos",
                systemImage: "arrow.right.circle.fill"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
                nextStep(
                    number: "1",
                    text: viewModel.language == .en
                        ? "Schedule your appointment with your dental office"
                        : "Programe su cita con su consultorio dental"
                )
                nextStep(
                    number: "2",
                    text: viewModel.language == .en
                        ? "Review any procedures you'd like to learn more about"
                        : "Revise cualquier procedimiento sobre el que desee saber más"
                )
                nextStep(
                    number: "3",
                    text: viewModel.language == .en
                        ? "Prepare any questions for your dentist"
                        : "Prepare cualquier pregunta para su dentista"
                )
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func nextStep(number: String, text: String) -> some View {
        HStack(alignment: .top, spacing: ChairIQTheme.Spacing.md) {
            ZStack {
                Circle()
                    .fill(ChairIQTheme.Colors.primaryLight)
                    .frame(width: 28, height: 28)
                Text(number)
                    .font(ChairIQTheme.Typography.caption)
                    .fontWeight(.bold)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
            }
            Text(text)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
        }
    }

    private var contactCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Label(
                viewModel.language == .en ? "Contact Your Practice" : "Contacte Su Consultorio",
                systemImage: "phone.fill"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                if !viewModel.practiceName.isEmpty {
                    Label(viewModel.practiceName, systemImage: "building.2")
                        .font(ChairIQTheme.Typography.body)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                }
                if !viewModel.dentistName.isEmpty {
                    Label("Dr. \(viewModel.dentistName)", systemImage: "stethoscope")
                        .font(ChairIQTheme.Typography.body)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var actionButtons: some View {
        VStack(spacing: ChairIQTheme.Spacing.md) {
            Button {
                viewModel.isCompleted = false
                viewModel.currentStepIndex = 0
            } label: {
                Label(content.reviewButton, systemImage: "arrow.counterclockwise")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ChairIQTheme.Spacing.lg)
                    .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
            }

            Button {
                dismiss()
            } label: {
                Label(content.homeButton, systemImage: "house")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ChairIQTheme.Spacing.lg)
                    .background(ChairIQTheme.Colors.primaryLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
            }
        }
    }

    private func formatDuration(_ interval: TimeInterval) -> String {
        let minutes = Int(interval) / 60
        if minutes < 1 { return "<1 min" }
        return "\(minutes) min"
    }
}
