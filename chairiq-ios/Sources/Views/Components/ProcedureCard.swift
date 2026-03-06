import SwiftUI

struct ProcedureCard: View {
    let procedure: PlanProcedure
    var isExpanded: Bool = false
    var onTap: (() -> Void)?
    var onLearnMore: (() -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Button(action: { onTap?() }) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                        Text(procedure.effectiveTitle)
                            .font(ChairIQTheme.Typography.headline)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                            .multilineTextAlignment(.leading)

                        if let code = procedure.adaCode {
                            Text("ADA: \(code)")
                                .font(ChairIQTheme.Typography.caption)
                                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        }

                        if !procedure.toothNumbersList.isEmpty {
                            HStack(spacing: ChairIQTheme.Spacing.xs) {
                                Image(systemName: "mouth")
                                    .font(.caption2)
                                Text("Teeth: \(procedure.toothNumbers ?? "")")
                                    .font(ChairIQTheme.Typography.caption)
                            }
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                        }
                    }

                    Spacer()

                    VStack(alignment: .trailing, spacing: ChairIQTheme.Spacing.xs) {
                        if let priority = procedure.priority {
                            PriorityBadge(priority: priority)
                        }
                        if let time = procedure.estTime {
                            Label(time, systemImage: "clock")
                                .font(ChairIQTheme.Typography.caption)
                                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        }
                    }

                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        .padding(.leading, ChairIQTheme.Spacing.xs)
                }
            }
            .buttonStyle(.plain)

            if isExpanded {
                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
                    if let notes = procedure.notesForPatient, !notes.isEmpty {
                        Text(notes)
                            .font(ChairIQTheme.Typography.body)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    }

                    if let action = onLearnMore {
                        Button(action: action) {
                            Label("Learn More", systemImage: "book.fill")
                                .font(ChairIQTheme.Typography.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, ChairIQTheme.Spacing.md)
                                .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                        }
                    }
                }
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }
}
