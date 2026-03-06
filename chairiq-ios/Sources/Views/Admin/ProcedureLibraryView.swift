import SwiftUI

struct ProcedureLibraryView: View {
    @State private var viewModel = ProcedureLibraryViewModel()
    @State private var showCreateSheet = false
    @State private var editingItem: ProcedureLibraryItem?

    var body: some View {
        NavigationStack {
            ZStack {
                ChairIQTheme.Colors.backgroundPrimary.ignoresSafeArea()

                VStack(spacing: 0) {
                    if let success = viewModel.successMessage {
                        successBanner(success)
                    }

                    if let error = viewModel.errorMessage {
                        errorBanner(error)
                    }

                    filterBar

                    if viewModel.isLoading {
                        LoadingSpinner(message: "Loading procedures...")
                    } else if viewModel.filteredProcedures.isEmpty {
                        emptyState
                    } else {
                        procedureList
                    }
                }
            }
            .navigationTitle("Procedure Library")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showCreateSheet = true
                    } label: {
                        Label("Add", systemImage: "plus")
                    }
                }
            }
            .sheet(isPresented: $showCreateSheet) {
                ProcedureEditorSheet(mode: .create) { _ in
                    Task { await viewModel.loadProcedures() }
                }
            }
            .sheet(item: $editingItem) { item in
                ProcedureEditorSheet(mode: .edit(item)) { _ in
                    Task { await viewModel.loadProcedures() }
                }
            }
            .confirmationDialog(
                "Delete Procedure",
                isPresented: .init(
                    get: { viewModel.deleteConfirmItem != nil },
                    set: { if !$0 { viewModel.deleteConfirmItem = nil } }
                ),
                titleVisibility: .visible
            ) {
                if let item = viewModel.deleteConfirmItem {
                    Button("Delete \"\(item.titleEn)\"", role: .destructive) {
                        Task { await viewModel.deleteProcedure(item) }
                    }
                }
                Button("Cancel", role: .cancel) {
                    viewModel.deleteConfirmItem = nil
                }
            } message: {
                Text("This action cannot be undone.")
            }
            .task {
                await viewModel.loadProcedures()
            }
        }
    }

    private var filterBar: some View {
        VStack(spacing: ChairIQTheme.Spacing.sm) {
            SearchBar(text: $viewModel.searchText, placeholder: "Search procedures...")

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: ChairIQTheme.Spacing.sm) {
                    ForEach(ProcedureLibraryViewModel.allCategories, id: \.value) { cat in
                        categoryChip(cat.label, isSelected: viewModel.selectedCategory == cat.value) {
                            viewModel.selectedCategory = cat.value
                        }
                    }
                }
                .padding(.horizontal, ChairIQTheme.Spacing.lg)
            }

            HStack(spacing: ChairIQTheme.Spacing.sm) {
                statusChip("All", isSelected: viewModel.selectedStatus == "all") {
                    viewModel.selectedStatus = "all"
                }
                statusChip("Published", isSelected: viewModel.selectedStatus == "published") {
                    viewModel.selectedStatus = "published"
                }
                statusChip("Draft", isSelected: viewModel.selectedStatus == "draft") {
                    viewModel.selectedStatus = "draft"
                }
                Spacer()
                Text("\(viewModel.filteredProcedures.count) procedures")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
            }
            .padding(.horizontal, ChairIQTheme.Spacing.lg)
        }
        .padding(.vertical, ChairIQTheme.Spacing.sm)
    }

    private var procedureList: some View {
        List {
            ForEach(viewModel.filteredProcedures) { item in
                ProcedureLibraryRow(
                    item: item,
                    completeness: viewModel.contentCompleteness(for: item),
                    onEdit: { editingItem = item },
                    onTogglePublish: { Task { await viewModel.togglePublished(item) } },
                    onDelete: { viewModel.deleteConfirmItem = item }
                )
                .listRowBackground(Color.clear)
                .listRowSeparator(.hidden)
                .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
            }
        }
        .listStyle(.plain)
    }

    private var emptyState: some View {
        VStack(spacing: ChairIQTheme.Spacing.lg) {
            Image(systemName: "book.closed")
                .font(.system(size: 48))
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
            Text("No procedures found")
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            Text("Try adjusting your filters or add a new procedure.")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }

    private func categoryChip(_ label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(ChairIQTheme.Typography.caption)
                .fontWeight(isSelected ? .semibold : .regular)
                .padding(.horizontal, ChairIQTheme.Spacing.md)
                .padding(.vertical, ChairIQTheme.Spacing.xs)
                .background(
                    isSelected ? ChairIQTheme.Colors.primary : ChairIQTheme.Colors.backgroundSecondary,
                    in: Capsule()
                )
                .foregroundStyle(isSelected ? .white : ChairIQTheme.Colors.textSecondary)
        }
    }

    private func statusChip(_ label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(ChairIQTheme.Typography.caption)
                .fontWeight(isSelected ? .semibold : .regular)
                .padding(.horizontal, ChairIQTheme.Spacing.md)
                .padding(.vertical, ChairIQTheme.Spacing.xs)
                .background(
                    isSelected ? ChairIQTheme.Colors.secondary : ChairIQTheme.Colors.backgroundSecondary,
                    in: Capsule()
                )
                .foregroundStyle(isSelected ? .white : ChairIQTheme.Colors.textSecondary)
        }
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
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
        .padding(.top, ChairIQTheme.Spacing.sm)
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
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
        .padding(.top, ChairIQTheme.Spacing.sm)
    }
}

struct ProcedureLibraryRow: View {
    let item: ProcedureLibraryItem
    let completeness: Int
    var onEdit: () -> Void
    var onTogglePublish: () -> Void
    var onDelete: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                    Text(item.titleEn)
                        .font(ChairIQTheme.Typography.headline)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                    if let titleEs = item.titleEs, !titleEs.isEmpty {
                        Text(titleEs)
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    }

                    Text(item.slug)
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: ChairIQTheme.Spacing.xs) {
                    HStack(spacing: 4) {
                        Circle()
                            .fill(item.isPublished == true ? ChairIQTheme.Colors.success : ChairIQTheme.Colors.warning)
                            .frame(width: 8, height: 8)
                        Text(item.isPublished == true ? "Published" : "Draft")
                            .font(ChairIQTheme.Typography.caption)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    }

                    if let category = item.category {
                        Text(category.capitalized)
                            .font(ChairIQTheme.Typography.caption)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(ChairIQTheme.Colors.primaryLight, in: Capsule())
                            .foregroundStyle(ChairIQTheme.Colors.primary)
                    }
                }
            }

            completenessBar

            HStack(spacing: ChairIQTheme.Spacing.md) {
                Button { onEdit() } label: {
                    Label("Edit", systemImage: "pencil")
                        .font(ChairIQTheme.Typography.caption)
                }

                Button { onTogglePublish() } label: {
                    Label(
                        item.isPublished == true ? "Unpublish" : "Publish",
                        systemImage: item.isPublished == true ? "eye.slash" : "eye"
                    )
                    .font(ChairIQTheme.Typography.caption)
                }

                Spacer()

                Button(role: .destructive) { onDelete() } label: {
                    Label("Delete", systemImage: "trash")
                        .font(ChairIQTheme.Typography.caption)
                }
            }
            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var completenessBar: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack {
                Text("Content Completeness")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                Spacer()
                Text("\(completeness)%")
                    .font(ChairIQTheme.Typography.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(completenessColor)
            }
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: ChairIQTheme.Radius.full)
                        .fill(ChairIQTheme.Colors.backgroundSecondary)
                        .frame(height: 6)
                    RoundedRectangle(cornerRadius: ChairIQTheme.Radius.full)
                        .fill(completenessColor)
                        .frame(width: geometry.size.width * CGFloat(completeness) / 100, height: 6)
                }
            }
            .frame(height: 6)
        }
    }

    private var completenessColor: Color {
        if completeness >= 80 { return ChairIQTheme.Colors.success }
        if completeness >= 50 { return ChairIQTheme.Colors.warning }
        return ChairIQTheme.Colors.danger
    }
}

struct ProcedureEditorSheet: View {
    enum Mode: Identifiable {
        case create
        case edit(ProcedureLibraryItem)

        var id: String {
            switch self {
            case .create: return "create"
            case .edit(let item): return item.id.uuidString
            }
        }
    }

    let mode: Mode
    var onSave: ((ProcedureLibraryItem) -> Void)?

    @Environment(\.dismiss) private var dismiss
    @State private var slug = ""
    @State private var titleEn = ""
    @State private var titleEs = ""
    @State private var summaryEn = ""
    @State private var summaryEs = ""
    @State private var whyEn = ""
    @State private var whyEs = ""
    @State private var aftercareEn = ""
    @State private var aftercareEs = ""
    @State private var risksEn = ""
    @State private var risksEs = ""
    @State private var category = ""
    @State private var isPublished = false
    @State private var timeEstimate = ""
    @State private var visitsEstimate = ""
    @State private var isSaving = false
    @State private var errorMessage: String?

    private let service = ProcedureLibraryService.shared

    var body: some View {
        NavigationStack {
            Form {
                Section("Basic Information") {
                    TextField("Slug", text: $slug)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                    TextField("Title (English)", text: $titleEn)
                    TextField("Title (Spanish)", text: $titleEs)
                    Picker("Category", selection: $category) {
                        Text("Select...").tag("")
                        ForEach(ProcedureCategory.allCases, id: \.self) { cat in
                            Text(cat.displayName).tag(cat.rawValue)
                        }
                    }
                    Toggle("Published", isOn: $isPublished)
                }

                Section("Estimates") {
                    TextField("Time Estimate", text: $timeEstimate)
                    TextField("Visits Estimate", text: $visitsEstimate)
                }

                Section("Summary") {
                    TextEditor(text: $summaryEn)
                        .frame(minHeight: 80)
                    TextEditor(text: $summaryEs)
                        .frame(minHeight: 80)
                }

                Section("Why This Treatment") {
                    TextEditor(text: $whyEn)
                        .frame(minHeight: 80)
                    TextEditor(text: $whyEs)
                        .frame(minHeight: 80)
                }

                Section("Aftercare") {
                    TextEditor(text: $aftercareEn)
                        .frame(minHeight: 80)
                    TextEditor(text: $aftercareEs)
                        .frame(minHeight: 80)
                }

                Section("Risks") {
                    TextEditor(text: $risksEn)
                        .frame(minHeight: 80)
                    TextEditor(text: $risksEs)
                        .frame(minHeight: 80)
                }

                if let errorMessage {
                    Section {
                        Text(errorMessage)
                            .foregroundStyle(ChairIQTheme.Colors.danger)
                    }
                }
            }
            .navigationTitle(isCreateMode ? "New Procedure" : "Edit Procedure")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task { await save() }
                    }
                    .disabled(isSaving || titleEn.isEmpty || slug.isEmpty)
                }
            }
            .onAppear { populateFields() }
            .disabled(isSaving)
            .overlay {
                if isSaving {
                    Color.black.opacity(0.2).ignoresSafeArea()
                    ProgressView("Saving...")
                        .padding()
                        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }
            }
        }
    }

    private var isCreateMode: Bool {
        if case .create = mode { return true }
        return false
    }

    private func populateFields() {
        if case .edit(let item) = mode {
            slug = item.slug
            titleEn = item.titleEn
            titleEs = item.titleEs ?? ""
            summaryEn = item.summaryEn ?? ""
            summaryEs = item.summaryEs ?? ""
            whyEn = item.whyEn ?? ""
            whyEs = item.whyEs ?? ""
            aftercareEn = item.aftercareEn ?? ""
            aftercareEs = item.aftercareEs ?? ""
            risksEn = item.risksEn ?? ""
            risksEs = item.risksEs ?? ""
            category = item.category ?? ""
            isPublished = item.isPublished ?? false
            timeEstimate = item.timeEstimate ?? ""
            visitsEstimate = item.visitsEstimate ?? ""
        }
    }

    private func save() async {
        isSaving = true
        errorMessage = nil

        let item = ProcedureLibraryItem(
            id: existingId ?? UUID(),
            slug: slug,
            titleEn: titleEn,
            titleEs: titleEs.isEmpty ? nil : titleEs,
            summaryEn: summaryEn.isEmpty ? nil : summaryEn,
            summaryEs: summaryEs.isEmpty ? nil : summaryEs,
            whyEn: whyEn.isEmpty ? nil : whyEn,
            whyEs: whyEs.isEmpty ? nil : whyEs,
            whatIfNotEn: nil,
            whatIfNotEs: nil,
            stepsEn: nil,
            stepsEs: nil,
            anesthesiaEn: nil,
            anesthesiaEs: nil,
            risksEn: risksEn.isEmpty ? nil : risksEn,
            risksEs: risksEs.isEmpty ? nil : risksEs,
            aftercareEn: aftercareEn.isEmpty ? nil : aftercareEn,
            aftercareEs: aftercareEs.isEmpty ? nil : aftercareEs,
            faqsEn: nil,
            faqsEs: nil,
            timeEstimate: timeEstimate.isEmpty ? nil : timeEstimate,
            visitsEstimate: visitsEstimate.isEmpty ? nil : visitsEstimate,
            visuals: nil,
            category: category.isEmpty ? nil : category,
            isPublished: isPublished,
            createdAt: nil,
            updatedAt: nil,
            createdBy: nil,
            canonicalSlug: nil
        )

        do {
            let result: ProcedureLibraryItem
            if case .edit(let existing) = mode {
                result = try await service.update(id: existing.id, item: item)
            } else {
                result = try await service.create(item)
            }
            onSave?(result)
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
        isSaving = false
    }

    private var existingId: UUID? {
        if case .edit(let item) = mode { return item.id }
        return nil
    }
}
