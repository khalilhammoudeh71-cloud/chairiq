import SwiftUI

struct LanguageToggle: View {
    @Binding var language: Language

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Language.allCases, id: \.self) { lang in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        language = lang
                    }
                } label: {
                    Text(lang.displayName)
                        .font(ChairIQTheme.Typography.subheadline)
                        .fontWeight(language == lang ? .semibold : .regular)
                        .foregroundStyle(language == lang ? .white : ChairIQTheme.Colors.textSecondary)
                        .padding(.horizontal, ChairIQTheme.Spacing.lg)
                        .padding(.vertical, ChairIQTheme.Spacing.sm)
                        .background {
                            if language == lang {
                                Capsule()
                                    .fill(ChairIQTheme.Colors.primary)
                            }
                        }
                }
            }
        }
        .background(ChairIQTheme.Colors.backgroundSecondary, in: Capsule())
    }
}
