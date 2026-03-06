import SwiftUI

struct LoadingSpinner: View {
    var message: String?
    var size: CGFloat = 40

    var body: some View {
        VStack(spacing: ChairIQTheme.Spacing.md) {
            ProgressView()
                .scaleEffect(size / 40)
                .tint(ChairIQTheme.Colors.primary)
            if let message {
                Text(message)
                    .font(ChairIQTheme.Typography.subheadline)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct ProgressIndicatorBar: View {
    let current: Int
    let total: Int

    private var progress: Double {
        guard total > 0 else { return 0 }
        return Double(current) / Double(total)
    }

    var body: some View {
        VStack(spacing: ChairIQTheme.Spacing.xs) {
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: ChairIQTheme.Radius.full)
                        .fill(ChairIQTheme.Colors.backgroundSecondary)
                        .frame(height: 8)

                    RoundedRectangle(cornerRadius: ChairIQTheme.Radius.full)
                        .fill(ChairIQTheme.Colors.primary)
                        .frame(width: geometry.size.width * progress, height: 8)
                        .animation(.easeInOut(duration: 0.3), value: progress)
                }
            }
            .frame(height: 8)

            HStack {
                Text("Step \(current) of \(total)")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                Spacer()
                Text("\(Int(progress * 100))%")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            }
        }
    }
}
