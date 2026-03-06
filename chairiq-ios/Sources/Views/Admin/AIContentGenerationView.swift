import SwiftUI

struct AIContentGenerationView: View {
    @State private var viewModel = AIContentViewModel()

    var body: some View {
        NavigationStack {
            ZStack {
                ChairIQTheme.Colors.backgroundPrimary.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: ChairIQTheme.Spacing.lg) {
                        if let success = viewModel.successMessage {
                            successBanner(success)
                        }
                        if let error = viewModel.errorMessage {
                            errorBanner(error)
                        }

                        configurationSection
                        contentSection
                    }
                    .padding(ChairIQTheme.Spacing.lg)
                }
            }
            .navigationTitle("AI Content Studio")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        viewModel.showBatchView.toggle()
                    } label: {
                        Label("Batch", systemImage: "square.stack.3d.up")
                    }
                }
            }
            .sheet(isPresented: $viewModel.showBatchView) {
                BatchJobsSheet(viewModel: viewModel)
            }
            .task {
                await viewModel.loadProcedures()
            }
        }
    }

    private var configurationSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Text("Configuration")
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            VStack(spacing: ChairIQTheme.Spacing.md) {
                procedurePicker
                languagePicker
                tonePicker
                complexityPicker
            }
            .padding(ChairIQTheme.Spacing.lg)
            .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
            .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
        }
    }

    private var procedurePicker: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text("Procedure")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)

            if viewModel.isLoading {
                HStack {
                    ProgressView()
                    Text("Loading procedures...")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
            } else {
                Picker("Procedure", selection: $viewModel.selectedProcedureId) {
                    Text("Select a procedure...").tag(nil as UUID?)
                    ForEach(viewModel.procedures) { proc in
                        Text(proc.titleEn).tag(proc.id as UUID?)
                    }
                }
                .pickerStyle(.menu)
                .onChange(of: viewModel.selectedProcedureId) { _, newValue in
                    viewModel.selectProcedure(newValue)
                }
            }
        }
    }

    private var languagePicker: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text("Language")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            Picker("Language", selection: $viewModel.language) {
                ForEach(Language.allCases, id: \.self) { lang in
                    Text(lang.displayName).tag(lang)
                }
            }
            .pickerStyle(.segmented)
        }
    }

    private var tonePicker: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text("Tone")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            Picker("Tone", selection: $viewModel.tone) {
                ForEach(ContentTone.allCases, id: \.self) { t in
                    Text(t.rawValue).tag(t)
                }
            }
            .pickerStyle(.segmented)
        }
    }

    private var complexityPicker: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text("Complexity")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            Picker("Complexity", selection: $viewModel.complexity) {
                ForEach(ContentComplexity.allCases, id: \.self) { c in
                    Text(c.rawValue).tag(c)
                }
            }
            .pickerStyle(.segmented)
        }
    }

    @ViewBuilder
    private var contentSection: some View {
        if viewModel.selectedProcedure != nil {
            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
                HStack {
                    Text("Generated Content")
                        .font(ChairIQTheme.Typography.headline)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                    Spacer()
                    generateAllButton
                }

                contentCard(
                    title: "Description",
                    icon: "doc.text",
                    content: $viewModel.generatedDescription,
                    isGenerating: viewModel.isGeneratingDescription,
                    section: .description
                )

                contentCard(
                    title: "Risks",
                    icon: "exclamationmark.triangle",
                    content: $viewModel.generatedRisks,
                    isGenerating: viewModel.isGeneratingRisks,
                    section: .risks
                )

                contentCard(
                    title: "Aftercare",
                    icon: "heart",
                    content: $viewModel.generatedAftercare,
                    isGenerating: viewModel.isGeneratingAftercare,
                    section: .aftercare
                )

                faqsCard

                saveButton
            }
        } else {
            VStack(spacing: ChairIQTheme.Spacing.lg) {
                Image(systemName: "wand.and.stars")
                    .font(.system(size: 48))
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                Text("Select a procedure to generate content")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, ChairIQTheme.Spacing.xxxl)
        }
    }

    private var generateAllButton: some View {
        Button {
            Task { await viewModel.generateAll() }
        } label: {
            HStack(spacing: ChairIQTheme.Spacing.xs) {
                if viewModel.isGeneratingAll {
                    ProgressView()
                        .scaleEffect(0.7)
                        .tint(.white)
                } else {
                    Image(systemName: "wand.and.stars")
                }
                Text("Generate All")
            }
            .font(ChairIQTheme.Typography.subheadline)
            .fontWeight(.semibold)
            .foregroundStyle(.white)
            .padding(.horizontal, ChairIQTheme.Spacing.lg)
            .padding(.vertical, ChairIQTheme.Spacing.sm)
            .background(ChairIQTheme.Colors.secondary, in: Capsule())
        }
        .disabled(viewModel.isGenerating)
    }

    private func contentCard(
        title: String,
        icon: String,
        content: Binding<String>,
        isGenerating: Bool,
        section: AIContentGenerationService.ContentSection
    ) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            HStack {
                Label(title, systemImage: icon)
                    .font(ChairIQTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                Spacer()
                Button {
                    Task { await viewModel.generateSection(section) }
                } label: {
                    HStack(spacing: 4) {
                        if isGenerating {
                            ProgressView()
                                .scaleEffect(0.6)
                        } else {
                            Image(systemName: "wand.and.stars")
                                .font(.caption)
                        }
                        Text("Generate")
                            .font(ChairIQTheme.Typography.caption)
                    }
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                }
                .disabled(viewModel.isGenerating)
            }

            TextEditor(text: content)
                .frame(minHeight: 100)
                .font(ChairIQTheme.Typography.body)
                .padding(ChairIQTheme.Spacing.sm)
                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                .overlay {
                    if isGenerating {
                        RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm)
                            .fill(.ultraThinMaterial)
                        ProgressView("Generating...")
                    }
                }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var faqsCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            HStack {
                Label("FAQs", systemImage: "questionmark.circle")
                    .font(ChairIQTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                Spacer()
                Button {
                    Task { await viewModel.generateSection(.faqs) }
                } label: {
                    HStack(spacing: 4) {
                        if viewModel.isGeneratingFAQs {
                            ProgressView()
                                .scaleEffect(0.6)
                        } else {
                            Image(systemName: "wand.and.stars")
                                .font(.caption)
                        }
                        Text("Generate")
                            .font(ChairIQTheme.Typography.caption)
                    }
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                }
                .disabled(viewModel.isGenerating)
            }

            if viewModel.generatedFAQs.isEmpty {
                Text("No FAQs generated yet")
                    .font(ChairIQTheme.Typography.subheadline)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.vertical, ChairIQTheme.Spacing.lg)
            } else {
                ForEach(Array(viewModel.generatedFAQs.enumerated()), id: \.offset) { index, faq in
                    VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                        Text("Q: \(faq.q)")
                            .font(ChairIQTheme.Typography.subheadline)
                            .fontWeight(.semibold)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                        Text("A: \(faq.a)")
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    }
                    .padding(ChairIQTheme.Spacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))

                    if index < viewModel.generatedFAQs.count - 1 {
                        Divider()
                    }
                }
            }

            if viewModel.isGeneratingFAQs {
                HStack {
                    Spacer()
                    ProgressView("Generating FAQs...")
                    Spacer()
                }
                .padding()
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var saveButton: some View {
        Button {
            Task { await viewModel.saveToLibrary() }
        } label: {
            HStack {
                if viewModel.isSaving {
                    ProgressView()
                        .tint(.white)
                } else {
                    Image(systemName: "square.and.arrow.down")
                }
                Text("Save to Library")
            }
            .font(ChairIQTheme.Typography.headline)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, ChairIQTheme.Spacing.md)
            .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
        }
        .disabled(viewModel.isSaving || viewModel.isGenerating)
    }

    private func successBanner(_ message: String) -> some View {
        HStack {
            Image(systemName: "checkmark.circle.fill")
            Text(message)
                .font(ChairIQTheme.Typography.subheadline)
        }
        .foregroundStyle(ChairIQTheme.Colors.success)
        .padding(ChairIQTheme.Spacing.md)
        .frame(maxWidth: .infinity)
        .background(ChairIQTheme.Colors.successLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
    }

    private func errorBanner(_ message: String) -> some View {
        HStack {
            Image(systemName: "exclamationmark.triangle.fill")
            Text(message)
                .font(ChairIQTheme.Typography.subheadline)
        }
        .foregroundStyle(ChairIQTheme.Colors.danger)
        .padding(ChairIQTheme.Spacing.md)
        .frame(maxWidth: .infinity)
        .background(ChairIQTheme.Colors.dangerLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
    }
}

struct BatchJobsSheet: View {
    @Bindable var viewModel: AIContentViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: ChairIQTheme.Spacing.lg) {
                Text("Batch content generation allows you to generate AI content for multiple procedures at once.")
                    .font(ChairIQTheme.Typography.subheadline)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    .padding(.horizontal, ChairIQTheme.Spacing.lg)

                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
                    Text("Settings")
                        .font(ChairIQTheme.Typography.headline)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                    VStack(spacing: ChairIQTheme.Spacing.sm) {
                        HStack {
                            Text("Language")
                                .font(ChairIQTheme.Typography.subheadline)
                            Spacer()
                            Picker("Language", selection: $viewModel.language) {
                                ForEach(Language.allCases, id: \.self) { lang in
                                    Text(lang.displayName).tag(lang)
                                }
                            }
                            .pickerStyle(.segmented)
                            .frame(maxWidth: 200)
                        }
                        HStack {
                            Text("Tone")
                                .font(ChairIQTheme.Typography.subheadline)
                            Spacer()
                            Picker("Tone", selection: $viewModel.tone) {
                                ForEach(ContentTone.allCases, id: \.self) { t in
                                    Text(t.rawValue).tag(t)
                                }
                            }
                            .pickerStyle(.segmented)
                            .frame(maxWidth: 250)
                        }
                    }
                }
                .padding(ChairIQTheme.Spacing.lg)
                .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
                .padding(.horizontal, ChairIQTheme.Spacing.lg)

                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
                    Text("Procedures (\(viewModel.procedures.count) available)")
                        .font(ChairIQTheme.Typography.headline)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                    Text("Batch processing will generate content for all procedures missing content in the selected language.")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
                .padding(.horizontal, ChairIQTheme.Spacing.lg)

                Spacer()
            }
            .padding(.top, ChairIQTheme.Spacing.lg)
            .background(ChairIQTheme.Colors.backgroundPrimary)
            .navigationTitle("Batch Processing")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }
}
