import SwiftUI
import Kingfisher

struct ProcedureDetailView: View {
    let procedure: PlanProcedure
    @Bindable var viewModel: PatientPlanViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var showImageViewer = false
    @State private var selectedImageURL: URL?
    @State private var selectedImageAlt = ""
    @State private var isSpeaking = false

    private var libraryItem: ProcedureLibraryItem? {
        viewModel.libraryItem(for: procedure)
    }

    private var visuals: [ProcedureVisualRecord] {
        viewModel.visuals(for: procedure)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    heroSection
                    contentSection
                }
            }
            .background(ChairIQTheme.Colors.backgroundPrimary)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    LanguageToggle(language: $viewModel.language)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showImageViewer) {
                FullScreenImageViewer(imageURL: selectedImageURL, altText: selectedImageAlt)
            }
        }
    }

    private var heroSection: some View {
        ZStack(alignment: .bottomLeading) {
            if let heroURL = viewModel.heroImageURL(for: procedure) {
                Button {
                    selectedImageURL = heroURL
                    selectedImageAlt = procedure.effectiveTitle
                    showImageViewer = true
                } label: {
                    KFImage(heroURL)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(height: 260)
                        .clipped()
                        .overlay {
                            LinearGradient(
                                colors: [.clear, .black.opacity(0.6)],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        }
                }
            } else {
                Rectangle()
                    .fill(
                        LinearGradient(
                            colors: [ChairIQTheme.Colors.primary, ChairIQTheme.Colors.primaryDark],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(height: 200)
            }

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                if let priority = procedure.priority {
                    PriorityBadge(priority: priority)
                }
                Text(procedure.effectiveTitle)
                    .font(ChairIQTheme.Typography.largeTitle)
                    .foregroundStyle(.white)
                HStack(spacing: ChairIQTheme.Spacing.md) {
                    if let code = procedure.adaCode {
                        Label("ADA \(code)", systemImage: "tag")
                            .font(ChairIQTheme.Typography.caption)
                            .foregroundStyle(.white.opacity(0.8))
                    }
                    if let time = procedure.estTime {
                        Label(time, systemImage: "clock")
                            .font(ChairIQTheme.Typography.caption)
                            .foregroundStyle(.white.opacity(0.8))
                    }
                }
            }
            .padding(ChairIQTheme.Spacing.xl)
        }
    }

    private var contentSection: some View {
        VStack(spacing: ChairIQTheme.Spacing.lg) {
            if let item = libraryItem {
                if let summary = item.summary(for: viewModel.language) {
                    sectionCard(
                        title: viewModel.language == .en ? "About This Procedure" : "Acerca de Este Procedimiento",
                        icon: "doc.text.fill",
                        content: summary
                    )
                }

                if let why = item.why(for: viewModel.language) {
                    sectionCard(
                        title: viewModel.language == .en ? "Why This Treatment?" : "¿Por Qué Este Tratamiento?",
                        icon: "questionmark.circle.fill",
                        content: why
                    )
                }

                if let whatIfNot = (viewModel.language == .en ? item.whatIfNotEn : item.whatIfNotEs ?? item.whatIfNotEn) {
                    sectionCard(
                        title: viewModel.language == .en ? "What If Not Treated?" : "¿Qué Pasa Si No Se Trata?",
                        icon: "exclamationmark.triangle.fill",
                        content: whatIfNot
                    )
                }

                if let steps = item.steps(for: viewModel.language), !steps.isEmpty {
                    stepsCard(steps: steps)
                }

                if let anesthesia = (viewModel.language == .en ? item.anesthesiaEn : item.anesthesiaEs ?? item.anesthesiaEn) {
                    sectionCard(
                        title: viewModel.language == .en ? "Anesthesia" : "Anestesia",
                        icon: "syringe.fill",
                        content: anesthesia
                    )
                }

                if let risks = item.risks(for: viewModel.language) {
                    sectionCard(
                        title: viewModel.language == .en ? "Risks & Considerations" : "Riesgos y Consideraciones",
                        icon: "exclamationmark.shield.fill",
                        content: risks
                    )
                }

                if let aftercare = item.aftercare(for: viewModel.language) {
                    sectionCard(
                        title: viewModel.language == .en ? "Aftercare Instructions" : "Instrucciones de Cuidado",
                        icon: "heart.text.square.fill",
                        content: aftercare
                    )
                }

                if let faqs = item.faqs(for: viewModel.language), !faqs.isEmpty {
                    faqsCard(faqs: faqs)
                }
            }

            if let notes = procedure.notesForPatient, !notes.isEmpty {
                sectionCard(
                    title: viewModel.language == .en ? "Notes from Your Dentist" : "Notas de Su Dentista",
                    icon: "note.text",
                    content: notes
                )
            }

            if !procedure.toothNumbersList.isEmpty {
                toothCard
            }

            if !visuals.isEmpty {
                visualGalleryCard
            }

            ttsButton
        }
        .padding(ChairIQTheme.Spacing.lg)
    }

    private func sectionCard(title: String, icon: String, content: String) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
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

    private func stepsCard(steps: [ProcedureStep]) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Label(
                viewModel.language == .en ? "Step-by-Step" : "Paso a Paso",
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
                if index < steps.count - 1 {
                    Divider().padding(.leading, 40)
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func faqsCard(faqs: [ProcedureFAQ]) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Label(
                viewModel.language == .en ? "Frequently Asked Questions" : "Preguntas Frecuentes",
                systemImage: "bubble.left.and.bubble.right.fill"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            ForEach(Array(faqs.enumerated()), id: \.offset) { _, faq in
                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                    Text(faq.q)
                        .font(ChairIQTheme.Typography.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                    Text(faq.a)
                        .font(ChairIQTheme.Typography.body)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                }
                .padding(ChairIQTheme.Spacing.md)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var toothCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Label(
                viewModel.language == .en ? "Affected Teeth" : "Dientes Afectados",
                systemImage: "mouth"
            )
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            HStack(spacing: ChairIQTheme.Spacing.sm) {
                ForEach(procedure.toothNumbersList, id: \.self) { tooth in
                    Text("#\(tooth)")
                        .font(ChairIQTheme.Typography.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(ChairIQTheme.Colors.primary)
                        .padding(.horizontal, ChairIQTheme.Spacing.md)
                        .padding(.vertical, ChairIQTheme.Spacing.sm)
                        .background(ChairIQTheme.Colors.primaryLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var visualGalleryCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
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
                            VStack(spacing: ChairIQTheme.Spacing.xs) {
                                AsyncImageView(
                                    url: URL(string: visual.imageUrl),
                                    contentMode: .fill,
                                    cornerRadius: ChairIQTheme.Radius.md
                                )
                                .frame(width: 180, height: 130)
                                .clipped()

                                Text(visual.altText(for: viewModel.language))
                                    .font(ChairIQTheme.Typography.caption)
                                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                                    .lineLimit(2)
                                    .frame(width: 180)
                            }
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

    private var ttsButton: some View {
        Button {
            Task { await toggleSpeech() }
        } label: {
            Label(
                isSpeaking
                    ? (viewModel.language == .en ? "Stop Listening" : "Dejar de Escuchar")
                    : (viewModel.language == .en ? "Listen to Explanation" : "Escuchar Explicación"),
                systemImage: isSpeaking ? "stop.fill" : "speaker.wave.2.fill"
            )
            .font(ChairIQTheme.Typography.subheadline)
            .fontWeight(.semibold)
            .foregroundStyle(ChairIQTheme.Colors.primary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, ChairIQTheme.Spacing.md)
            .background(ChairIQTheme.Colors.primaryLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
        }
        .padding(.bottom, ChairIQTheme.Spacing.xxl)
    }

    private func toggleSpeech() async {
        if isSpeaking {
            TTSService.shared.stopAudio()
            isSpeaking = false
            return
        }

        guard let item = libraryItem,
              let summary = item.summary(for: viewModel.language) else { return }

        isSpeaking = true
        do {
            let audioData = try await TTSService.shared.generateSpeech(text: summary)
            try TTSService.shared.playAudio(data: audioData)
        } catch {
            isSpeaking = false
        }
    }
}
