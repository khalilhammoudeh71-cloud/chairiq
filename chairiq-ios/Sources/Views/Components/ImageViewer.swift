import SwiftUI
import Kingfisher

struct AsyncImageView: View {
    let url: URL?
    var contentMode: SwiftUI.ContentMode = .fill
    var cornerRadius: CGFloat = ChairIQTheme.Radius.md

    var body: some View {
        KFImage(url)
            .placeholder {
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(ChairIQTheme.Colors.backgroundSecondary)
                    .overlay {
                        Image(systemName: "photo")
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    }
            }
            .resizable()
            .aspectRatio(contentMode: contentMode)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
    }
}

struct FullScreenImageViewer: View {
    let imageURL: URL?
    let altText: String
    @Environment(\.dismiss) private var dismiss

    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                KFImage(imageURL)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .scaleEffect(scale)
                    .offset(offset)
                    .gesture(
                        MagnificationGesture()
                            .onChanged { value in
                                scale = value
                            }
                            .onEnded { _ in
                                withAnimation {
                                    scale = max(1.0, scale)
                                }
                            }
                    )
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                offset = value.translation
                            }
                            .onEnded { _ in
                                withAnimation {
                                    offset = .zero
                                }
                            }
                    )
                    .onTapGesture(count: 2) {
                        withAnimation {
                            scale = scale > 1 ? 1 : 2
                            offset = .zero
                        }
                    }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundStyle(.white.opacity(0.8))
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
        .accessibilityLabel(altText)
    }
}
