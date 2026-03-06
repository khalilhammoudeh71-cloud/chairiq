import SwiftUI
import Kingfisher

struct TreatmentPlanLandingView: View {
    @Bindable var viewModel: PatientPlanViewModel
    var onStartPlan: () -> Void
    var onSelectProcedure: (PlanProcedure) -> Void

    var body: some View {
        ScrollView {
            VStack(spacing: ChairIQTheme.Spacing.xl) {
                heroSection
                atAGlanceSection
                procedureListSection
                ctaSection
            }
        }
        .background(ChairIQTheme.Colors.backgroundPrimary)
    }

    private var heroSection: some View {
        ZStack(alignment: .bottomLeading) {
            LinearGradient(
                colors: [ChairIQTheme.Colors.primary, ChairIQTheme.Colors.primaryDark],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .frame(height: 240)
            .clipShape(RoundedRectangle(cornerRadius: ChairIQTheme.Radius.xl))

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                if let patient = viewModel.patient {
                    Text(viewModel.language == .en
                         ? "Hello, \(patient.firstName)"
                         : "Hola, \(patient.firstName)")
                        .font(ChairIQTheme.Typography.largeTitle)
                        .foregroundStyle(.white)
                }
                Text(viewModel.language == .en
                     ? "Your dental care journey starts here"
                     : "Su viaje de cuidado dental comienza aquí")
                    .font(ChairIQTheme.Typography.body)
                    .foregroundStyle(.white.opacity(0.85))

                if !viewModel.practiceName.isEmpty {
                    Label(viewModel.practiceName, systemImage: "building.2")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(.white.opacity(0.7))
                }
            }
            .padding(ChairIQTheme.Spacing.xl)
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
    }

    private var atAGlanceSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Text(viewModel.language == .en ? "At a Glance" : "De un Vistazo")
                .font(ChairIQTheme.Typography.title2)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            HStack(spacing: ChairIQTheme.Spacing.md) {
                glanceCard(
                    icon: "list.bullet.clipboard",
                    value: "\(viewModel.procedures.count)",
                    label: viewModel.language == .en ? "Procedures" : "Procedimientos",
                    color: ChairIQTheme.Colors.primary
                )
                glanceCard(
                    icon: "clock",
                    value: estimatedTime,
                    label: viewModel.language == .en ? "Est. Time" : "Tiempo Est.",
                    color: ChairIQTheme.Colors.secondary
                )
            }

            if let immediateCount = viewModel.enrichedPlan?.proceduresByPriority[.immediate]?.count, immediateCount > 0 {
                HStack(spacing: ChairIQTheme.Spacing.sm) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .foregroundStyle(ChairIQTheme.Colors.danger)
                    Text(viewModel.language == .en
                         ? "\(immediateCount) procedure\(immediateCount > 1 ? "s" : "") need\(immediateCount > 1 ? "" : "s") immediate attention"
                         : "\(immediateCount) procedimiento\(immediateCount > 1 ? "s" : "") necesita\(immediateCount > 1 ? "n" : "") atención inmediata")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.danger)
                }
                .padding(ChairIQTheme.Spacing.md)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(ChairIQTheme.Colors.dangerLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
            }
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
    }

    private func glanceCard(icon: String, value: String, label: String, color: Color) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.sm) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(color)
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

    private var estimatedTime: String {
        let count = viewModel.procedures.count
        return "\(count * 5)-\(count * 8) min"
    }

    private var procedureListSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Text(viewModel.language == .en ? "Your Procedures" : "Sus Procedimientos")
                .font(ChairIQTheme.Typography.title2)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            ForEach(Array(viewModel.procedures.enumerated()), id: \.element.id) { index, procedure in
                Button { onSelectProcedure(procedure) } label: {
                    procedureRow(procedure: procedure, index: index)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
    }

    private func procedureRow(procedure: PlanProcedure, index: Int) -> some View {
        HStack(spacing: ChairIQTheme.Spacing.md) {
            ZStack {
                Circle()
                    .fill(priorityGradient(for: procedure.priority))
                    .frame(width: 44, height: 44)
                Image(systemName: procedureIcon(for: procedure))
                    .font(.body)
                    .foregroundStyle(.white)
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(procedure.effectiveTitle)
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                if let code = procedure.adaCode {
                    Text("ADA \(code)")
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
            }

            Spacer()

            if let priority = procedure.priority {
                PriorityBadge(priority: priority)
            }

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func priorityGradient(for priority: ProcedurePriority?) -> LinearGradient {
        let color = priority.map { ChairIQTheme.Colors.priorityColor($0) } ?? ChairIQTheme.Colors.primary
        return LinearGradient(colors: [color, color.opacity(0.7)], startPoint: .topLeading, endPoint: .bottomTrailing)
    }

    private func procedureIcon(for procedure: PlanProcedure) -> String {
        let name = (procedure.canonicalSlug ?? procedure.procedureName).lowercased()
        if name.contains("root") && name.contains("canal") { return "bolt.fill" }
        if name.contains("crown") { return "crown.fill" }
        if name.contains("filling") || name.contains("composite") { return "drop.fill" }
        if name.contains("extract") { return "scissors" }
        if name.contains("implant") { return "pin.fill" }
        if name.contains("bridge") { return "link" }
        if name.contains("denture") { return "face.smiling" }
        if name.contains("clean") || name.contains("prophylaxis") { return "sparkles" }
        if name.contains("exam") { return "magnifyingglass" }
        if name.contains("x-ray") || name.contains("radiograph") { return "waveform.path.ecg" }
        if name.contains("scaling") || name.contains("srp") { return "square.3.layers.3d" }
        if name.contains("sealant") { return "shield.fill" }
        if name.contains("fluoride") { return "drop.fill" }
        if name.contains("veneer") { return "sparkles" }
        if name.contains("whitening") { return "sun.max.fill" }
        return "cross.case.fill"
    }

    private var ctaSection: some View {
        VStack(spacing: ChairIQTheme.Spacing.md) {
            Button(action: onStartPlan) {
                Label(
                    viewModel.language == .en ? "Begin Your Journey" : "Comience Su Recorrido",
                    systemImage: "play.fill"
                )
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, ChairIQTheme.Spacing.lg)
                .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
            }

            HStack(spacing: ChairIQTheme.Spacing.xl) {
                trustSignal(icon: "lock.shield.fill", text: viewModel.language == .en ? "HIPAA Secure" : "Seguro HIPAA")
                trustSignal(icon: "checkmark.seal.fill", text: viewModel.language == .en ? "ADA Verified" : "Verificado ADA")
            }
        }
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
        .padding(.bottom, ChairIQTheme.Spacing.xxl)
    }

    private func trustSignal(icon: String, text: String) -> some View {
        HStack(spacing: ChairIQTheme.Spacing.xs) {
            Image(systemName: icon)
                .font(.caption2)
                .foregroundStyle(ChairIQTheme.Colors.success)
            Text(text)
                .font(ChairIQTheme.Typography.caption)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
        }
    }
}
