import SwiftUI

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    var trend: String?
    var trendUp: Bool = true
    var color: Color = ChairIQTheme.Colors.primary

    var body: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            HStack {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundStyle(color)
                    .frame(width: 36, height: 36)
                    .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))

                Spacer()

                if let trend {
                    HStack(spacing: 2) {
                        Image(systemName: trendUp ? "arrow.up.right" : "arrow.down.right")
                            .font(.caption2)
                        Text(trend)
                            .font(ChairIQTheme.Typography.caption)
                    }
                    .foregroundStyle(trendUp ? ChairIQTheme.Colors.success : ChairIQTheme.Colors.danger)
                }
            }

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                Text(value)
                    .font(ChairIQTheme.Typography.title)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                Text(title)
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }
}
