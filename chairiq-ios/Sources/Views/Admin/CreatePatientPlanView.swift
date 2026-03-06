import SwiftUI
import UIKit

struct CreatePatientPlanView: View {
    @State private var viewModel = CreatePlanViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                stepIndicator
                Divider()

                switch viewModel.currentStep {
                case .patientInfo:
                    patientInfoStep
                case .procedures:
                    proceduresStep
                case .preview:
                    previewStep
                }
            }
            .background(ChairIQTheme.Colors.backgroundPrimary)
            .navigationTitle("Create Plan")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
            .task { await viewModel.loadLibraryData() }
            .alert("Error", isPresented: .init(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } }
            )) {
                Button("OK") { viewModel.errorMessage = nil }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .sheet(isPresented: $viewModel.showShareSheet) {
                shareSheet
            }
        }
    }

    private var stepIndicator: some View {
        HStack(spacing: 0) {
            ForEach(CreatePlanViewModel.Step.allCases, id: \.rawValue) { step in
                VStack(spacing: ChairIQTheme.Spacing.xs) {
                    ZStack {
                        Circle()
                            .fill(step.rawValue <= viewModel.currentStep.rawValue
                                  ? ChairIQTheme.Colors.primary
                                  : ChairIQTheme.Colors.border)
                            .frame(width: 28, height: 28)
                        Text("\(step.rawValue + 1)")
                            .font(ChairIQTheme.Typography.caption)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                    }
                    Text(step.title)
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(step == viewModel.currentStep
                                         ? ChairIQTheme.Colors.textPrimary
                                         : ChairIQTheme.Colors.textTertiary)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.vertical, ChairIQTheme.Spacing.md)
        .padding(.horizontal, ChairIQTheme.Spacing.lg)
    }

    private var patientInfoStep: some View {
        ScrollView {
            VStack(spacing: ChairIQTheme.Spacing.xl) {
                sectionCard(title: "Patient Information", icon: "person.fill") {
                    VStack(spacing: ChairIQTheme.Spacing.md) {
                        formField(label: "First Name", text: $viewModel.firstName, placeholder: "Enter first name")
                        formField(label: "Last Name", text: $viewModel.lastName, placeholder: "Enter last name")
                        formField(label: "Phone Number", text: $viewModel.phone, placeholder: "+1 (555) 000-0000", keyboard: .phonePad)

                        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                            Text("Preferred Language")
                                .font(ChairIQTheme.Typography.subheadline)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                            Picker("Language", selection: $viewModel.preferredLanguage) {
                                ForEach(Language.allCases, id: \.self) { lang in
                                    Text(lang.displayName).tag(lang)
                                }
                            }
                            .pickerStyle(.segmented)
                        }
                    }
                }

                sectionCard(title: "Practice Information", icon: "building.2.fill") {
                    VStack(spacing: ChairIQTheme.Spacing.md) {
                        formField(label: "Dentist Name", text: $viewModel.dentistName, placeholder: "Dr. Smith")
                        formField(label: "Practice Name", text: $viewModel.practiceName, placeholder: "Dental Practice")
                    }
                }

                Button {
                    viewModel.advanceStep()
                } label: {
                    HStack {
                        Text("Next: Add Procedures")
                        Image(systemName: "arrow.right")
                    }
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ChairIQTheme.Spacing.md)
                    .background(
                        viewModel.canAdvanceFromPatientInfo
                        ? ChairIQTheme.Colors.primary
                        : ChairIQTheme.Colors.border,
                        in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md)
                    )
                }
                .disabled(!viewModel.canAdvanceFromPatientInfo)
            }
            .padding(ChairIQTheme.Spacing.lg)
        }
    }

    private var proceduresStep: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(spacing: ChairIQTheme.Spacing.lg) {
                    SearchBar(text: $viewModel.searchQuery, placeholder: "Search procedures or ADA codes...")

                    if !viewModel.searchQuery.isEmpty {
                        searchResults
                    }

                    if viewModel.procedures.isEmpty {
                        emptyProceduresState
                    } else {
                        proceduresList
                    }
                }
                .padding(ChairIQTheme.Spacing.lg)
            }

            Divider()
            bottomBar
        }
    }

    private var searchResults: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            if !viewModel.filteredLibraryItems.isEmpty {
                Text("Library Procedures")
                    .font(ChairIQTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)

                ForEach(viewModel.filteredLibraryItems.prefix(5)) { item in
                    Button {
                        viewModel.addFromLibraryItem(item)
                        viewModel.searchQuery = ""
                    } label: {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(item.titleEn)
                                    .font(ChairIQTheme.Typography.body)
                                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                                if let category = item.category {
                                    Text(category.capitalized)
                                        .font(ChairIQTheme.Typography.caption)
                                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                }
                            }
                            Spacer()
                            Image(systemName: "plus.circle.fill")
                                .foregroundStyle(ChairIQTheme.Colors.primary)
                        }
                        .padding(ChairIQTheme.Spacing.md)
                        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                    }
                }
            }

            if !viewModel.filteredADACodes.isEmpty {
                Text("ADA Codes")
                    .font(ChairIQTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    .padding(.top, ChairIQTheme.Spacing.sm)

                ForEach(viewModel.filteredADACodes.prefix(5)) { code in
                    Button {
                        viewModel.addFromADACode(code)
                        viewModel.searchQuery = ""
                    } label: {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(code.code)
                                    .font(ChairIQTheme.Typography.body)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                                Text(code.description)
                                    .font(ChairIQTheme.Typography.caption)
                                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                                    .lineLimit(2)
                            }
                            Spacer()
                            Image(systemName: "plus.circle.fill")
                                .foregroundStyle(ChairIQTheme.Colors.primary)
                        }
                        .padding(ChairIQTheme.Spacing.md)
                        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                    }
                }
            }

            if viewModel.filteredLibraryItems.isEmpty && viewModel.filteredADACodes.isEmpty {
                HStack {
                    Spacer()
                    VStack(spacing: ChairIQTheme.Spacing.sm) {
                        Image(systemName: "magnifyingglass")
                            .font(.title2)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        Text("No results found")
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    }
                    .padding(.vertical, ChairIQTheme.Spacing.xl)
                    Spacer()
                }
            }
        }
        .padding(ChairIQTheme.Spacing.md)
        .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
    }

    private var emptyProceduresState: some View {
        VStack(spacing: ChairIQTheme.Spacing.lg) {
            Image(systemName: "list.clipboard")
                .font(.system(size: 48))
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
            Text("No Procedures Added")
                .font(ChairIQTheme.Typography.title2)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
            Text("Search for procedures above or add a custom one")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                .multilineTextAlignment(.center)

            Button {
                viewModel.addProcedure(CreatePlanViewModel.ProcedureEntry())
            } label: {
                HStack {
                    Image(systemName: "plus.circle.fill")
                    Text("Add Custom Procedure")
                }
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(ChairIQTheme.Colors.primary)
            }
        }
        .padding(.vertical, ChairIQTheme.Spacing.xxxl)
    }

    private var proceduresList: some View {
        VStack(spacing: ChairIQTheme.Spacing.md) {
            HStack {
                Text("Procedures (\(viewModel.procedures.count))")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                Spacer()
                Button {
                    viewModel.addProcedure(CreatePlanViewModel.ProcedureEntry())
                } label: {
                    HStack(spacing: ChairIQTheme.Spacing.xs) {
                        Image(systemName: "plus")
                        Text("Add")
                    }
                    .font(ChairIQTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                }
            }

            ForEach($viewModel.procedures) { $entry in
                procedureEntryCard(entry: $entry)
            }
            .onDelete { viewModel.removeProcedure(at: $0) }
        }
    }

    private func procedureEntryCard(entry: Binding<CreatePlanViewModel.ProcedureEntry>) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            HStack {
                Image(systemName: "line.3.horizontal")
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                Text(entry.wrappedValue.effectiveTitle.isEmpty ? "New Procedure" : entry.wrappedValue.effectiveTitle)
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                Spacer()
                Button {
                    viewModel.removeProcedure(id: entry.wrappedValue.id)
                } label: {
                    Image(systemName: "trash")
                        .foregroundStyle(ChairIQTheme.Colors.danger)
                }
            }

            VStack(spacing: ChairIQTheme.Spacing.sm) {
                formField(label: "Display Title", text: entry.displayTitle.withDefault(""), placeholder: "e.g. Root Canal Treatment")
                formField(label: "Procedure Name", text: entry.procedureName, placeholder: "Procedure name")
                formField(label: "ADA Code", text: entry.adaCode.withDefault(""), placeholder: "e.g. D2740")
                formField(label: "Est. Time", text: entry.estTime.withDefault(""), placeholder: "e.g. 60 min")
                formField(label: "Notes for Patient", text: entry.notesForPatient.withDefault(""), placeholder: "Optional notes")
            }

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                Text("Priority")
                    .font(ChairIQTheme.Typography.subheadline)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                Picker("Priority", selection: entry.priority) {
                    ForEach(ProcedurePriority.allCases, id: \.self) { p in
                        Text(p.rawValue).tag(p)
                    }
                }
                .pickerStyle(.segmented)
            }

            toothPicker(for: entry)
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
        .overlay(
            RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md)
                .stroke(ChairIQTheme.Colors.border, lineWidth: 1)
        )
    }

    private func toothPicker(for entry: Binding<CreatePlanViewModel.ProcedureEntry>) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            Text("Tooth Numbers")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)

            let columns = Array(repeating: GridItem(.flexible(), spacing: 4), count: 8)
            VStack(spacing: ChairIQTheme.Spacing.sm) {
                Text("Upper")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                LazyVGrid(columns: columns, spacing: 4) {
                    ForEach(Array(1...16).map { String($0) }, id: \.self) { tooth in
                        toothButton(tooth: tooth, entry: entry)
                    }
                }
                Text("Lower")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                LazyVGrid(columns: columns, spacing: 4) {
                    ForEach(Array(17...32).map { String($0) }, id: \.self) { tooth in
                        toothButton(tooth: tooth, entry: entry)
                    }
                }
            }

            if !entry.wrappedValue.toothNumbers.isEmpty {
                Text("Selected: \(entry.wrappedValue.toothNumbers.joined(separator: ", "))")
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
            }
        }
    }

    private func toothButton(tooth: String, entry: Binding<CreatePlanViewModel.ProcedureEntry>) -> some View {
        let isSelected = entry.wrappedValue.toothNumbers.contains(tooth)
        return Button {
            viewModel.toggleToothNumber(tooth, for: entry.wrappedValue.id)
        } label: {
            Text(tooth)
                .font(ChairIQTheme.Typography.caption)
                .fontWeight(isSelected ? .bold : .regular)
                .foregroundStyle(isSelected ? .white : ChairIQTheme.Colors.textPrimary)
                .frame(width: 32, height: 32)
                .background(
                    isSelected ? ChairIQTheme.Colors.primary : ChairIQTheme.Colors.backgroundSecondary,
                    in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm)
                )
        }
    }

    private var bottomBar: some View {
        HStack(spacing: ChairIQTheme.Spacing.md) {
            Button {
                viewModel.goBack()
            } label: {
                HStack {
                    Image(systemName: "arrow.left")
                    Text("Back")
                }
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                .padding(.vertical, ChairIQTheme.Spacing.md)
                .frame(maxWidth: .infinity)
                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
            }

            Button {
                viewModel.advanceStep()
            } label: {
                HStack {
                    Text(viewModel.currentStep == .procedures ? "Preview" : "Next")
                    Image(systemName: "arrow.right")
                }
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(.white)
                .padding(.vertical, ChairIQTheme.Spacing.md)
                .frame(maxWidth: .infinity)
                .background(
                    viewModel.canAdvanceFromProcedures
                    ? ChairIQTheme.Colors.primary
                    : ChairIQTheme.Colors.border,
                    in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md)
                )
            }
            .disabled(!viewModel.canAdvanceFromProcedures)
        }
        .padding(ChairIQTheme.Spacing.lg)
    }

    private var previewStep: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(spacing: ChairIQTheme.Spacing.xl) {
                    sectionCard(title: "Patient", icon: "person.fill") {
                        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                            previewRow(label: "Name", value: viewModel.patientFullName)
                            previewRow(label: "Phone", value: viewModel.phone)
                            previewRow(label: "Language", value: viewModel.preferredLanguage.displayName)
                        }
                    }

                    sectionCard(title: "Practice", icon: "building.2.fill") {
                        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                            previewRow(label: "Dentist", value: viewModel.dentistName)
                            previewRow(label: "Practice", value: viewModel.practiceName)
                        }
                    }

                    sectionCard(title: "Procedures (\(viewModel.procedures.count))", icon: "list.clipboard") {
                        VStack(spacing: ChairIQTheme.Spacing.md) {
                            ForEach(Array(viewModel.procedures.enumerated()), id: \.element.id) { index, proc in
                                HStack(alignment: .top) {
                                    Text("\(index + 1).")
                                        .font(ChairIQTheme.Typography.body)
                                        .fontWeight(.semibold)
                                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                        .frame(width: 24, alignment: .trailing)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(proc.effectiveTitle)
                                            .font(ChairIQTheme.Typography.body)
                                            .fontWeight(.medium)
                                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                                        HStack(spacing: ChairIQTheme.Spacing.sm) {
                                            PriorityBadge(priority: proc.priority)
                                            if let code = proc.adaCode, !code.isEmpty {
                                                Text(code)
                                                    .font(ChairIQTheme.Typography.caption)
                                                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                            }
                                            if let time = proc.estTime, !time.isEmpty {
                                                Text(time)
                                                    .font(ChairIQTheme.Typography.caption)
                                                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                            }
                                        }
                                        if !proc.toothNumbers.isEmpty {
                                            Text("Teeth: \(proc.toothNumbers.joined(separator: ", "))")
                                                .font(ChairIQTheme.Typography.caption)
                                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                                        }
                                    }
                                    Spacer()
                                }
                                if index < viewModel.procedures.count - 1 {
                                    Divider()
                                }
                            }
                        }
                    }
                }
                .padding(ChairIQTheme.Spacing.lg)
            }

            Divider()
            HStack(spacing: ChairIQTheme.Spacing.md) {
                Button {
                    viewModel.goBack()
                } label: {
                    HStack {
                        Image(systemName: "arrow.left")
                        Text("Back")
                    }
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    .padding(.vertical, ChairIQTheme.Spacing.md)
                    .frame(maxWidth: .infinity)
                    .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }

                Button {
                    Task { await viewModel.savePlan() }
                } label: {
                    HStack {
                        if viewModel.isSaving {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Image(systemName: "checkmark.circle.fill")
                        }
                        Text("Save Plan")
                    }
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(.white)
                    .padding(.vertical, ChairIQTheme.Spacing.md)
                    .frame(maxWidth: .infinity)
                    .background(ChairIQTheme.Colors.success, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }
                .disabled(viewModel.isSaving)
            }
            .padding(ChairIQTheme.Spacing.lg)
        }
    }

    private var shareSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ChairIQTheme.Spacing.xl) {
                    VStack(spacing: ChairIQTheme.Spacing.md) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 56))
                            .foregroundStyle(ChairIQTheme.Colors.success)
                        Text("Plan Created!")
                            .font(ChairIQTheme.Typography.title)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                        Text("Share the treatment plan with your patient")
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    }
                    .padding(.top, ChairIQTheme.Spacing.xl)

                    if let url = viewModel.shareURL {
                        VStack(spacing: ChairIQTheme.Spacing.sm) {
                            Text(url)
                                .font(ChairIQTheme.Typography.caption)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                                .lineLimit(1)
                                .truncationMode(.middle)
                                .padding(ChairIQTheme.Spacing.md)
                                .frame(maxWidth: .infinity)
                                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))

                            Button {
                                viewModel.copyLink()
                            } label: {
                                HStack {
                                    Image(systemName: viewModel.linkCopied ? "checkmark" : "doc.on.doc")
                                    Text(viewModel.linkCopied ? "Copied!" : "Copy Link")
                                }
                                .font(ChairIQTheme.Typography.headline)
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, ChairIQTheme.Spacing.md)
                                .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                            }
                        }
                    }

                    VStack(spacing: ChairIQTheme.Spacing.md) {
                        Button {
                            Task { await viewModel.sendSMS() }
                        } label: {
                            HStack {
                                if viewModel.isSendingSMS {
                                    ProgressView().tint(.white)
                                } else {
                                    Image(systemName: "message.fill")
                                }
                                Text("Send via SMS")
                            }
                            .font(ChairIQTheme.Typography.headline)
                            .foregroundStyle(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, ChairIQTheme.Spacing.md)
                            .background(ChairIQTheme.Colors.success, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                        }
                        .disabled(viewModel.isSendingSMS)

                        VStack(spacing: ChairIQTheme.Spacing.sm) {
                            formField(label: "Patient Email", text: $viewModel.patientEmail, placeholder: "patient@email.com", keyboard: .emailAddress)
                            Button {
                                Task { await viewModel.sendEmail() }
                            } label: {
                                HStack {
                                    if viewModel.isSendingEmail {
                                        ProgressView().tint(.white)
                                    } else {
                                        Image(systemName: "envelope.fill")
                                    }
                                    Text("Send via Email")
                                }
                                .font(ChairIQTheme.Typography.headline)
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, ChairIQTheme.Spacing.md)
                                .background(
                                    viewModel.patientEmail.isEmpty
                                    ? ChairIQTheme.Colors.border
                                    : ChairIQTheme.Colors.secondary,
                                    in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md)
                                )
                            }
                            .disabled(viewModel.patientEmail.isEmpty || viewModel.isSendingEmail)
                        }
                    }

                    Button {
                        viewModel.showShareSheet = false
                        viewModel.reset()
                    } label: {
                        Text("Create Another Plan")
                            .font(ChairIQTheme.Typography.headline)
                            .foregroundStyle(ChairIQTheme.Colors.primary)
                    }
                    .padding(.top, ChairIQTheme.Spacing.md)
                }
                .padding(ChairIQTheme.Spacing.lg)
            }
            .navigationTitle("Share Plan")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        viewModel.showShareSheet = false
                        dismiss()
                    }
                }
            }
        }
    }

    private func sectionCard<Content: View>(title: String, icon: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            HStack(spacing: ChairIQTheme.Spacing.sm) {
                Image(systemName: icon)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                Text(title)
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
            }
            content()
        }
        .padding(ChairIQTheme.Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
        .overlay(
            RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md)
                .stroke(ChairIQTheme.Colors.border, lineWidth: 1)
        )
    }

    private func formField(label: String, text: Binding<String>, placeholder: String, keyboard: UIKeyboardType = .default) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text(label)
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            TextField(placeholder, text: text)
                .font(ChairIQTheme.Typography.body)
                .keyboardType(keyboard)
                .padding(ChairIQTheme.Spacing.md)
                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
        }
    }

    private func previewRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                .frame(width: 80, alignment: .leading)
            Text(value)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
            Spacer()
        }
    }
}

extension Binding where Value == String? {
    func withDefault(_ defaultValue: String) -> Binding<String> {
        Binding<String>(
            get: { self.wrappedValue ?? defaultValue },
            set: { self.wrappedValue = $0.isEmpty ? nil : $0 }
        )
    }
}

