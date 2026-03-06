import SwiftUI

struct SearchBar: View {
    @Binding var text: String
    var placeholder: String = "Search..."
    var onSubmit: (() -> Void)?

    var body: some View {
        HStack(spacing: ChairIQTheme.Spacing.sm) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)

            TextField(placeholder, text: $text)
                .font(ChairIQTheme.Typography.body)
                .onSubmit { onSubmit?() }

            if !text.isEmpty {
                Button {
                    text = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
            }
        }
        .padding(ChairIQTheme.Spacing.md)
        .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
    }
}
