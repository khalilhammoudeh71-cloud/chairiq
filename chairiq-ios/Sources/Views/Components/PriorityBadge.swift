import SwiftUI

struct PriorityBadge: View {
    let priority: ProcedurePriority

    var body: some View {
        Text(priority.rawValue)
            .font(ChairIQTheme.Typography.caption)
            .fontWeight(.semibold)
            .foregroundStyle(ChairIQTheme.Colors.priorityColor(priority))
            .padding(.horizontal, ChairIQTheme.Spacing.sm)
            .padding(.vertical, ChairIQTheme.Spacing.xs)
            .background(
                ChairIQTheme.Colors.priorityBackground(priority),
                in: Capsule()
            )
    }
}
