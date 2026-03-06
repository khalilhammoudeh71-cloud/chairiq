import SwiftUI

struct AdminDashboardView: View {
    @State private var viewModel = AdminDashboardViewModel()
    @State private var showDeleteConfirmation = false
    @State private var patientToDelete: Patient?
    var userName: String = "Doctor"

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    LoadingSpinner(message: "Loading dashboard...")
                } else if let error = viewModel.errorMessage {
                    errorView(error)
                } else {
                    dashboardContent
                }
            }
            .navigationTitle("Dashboard")
            .background(ChairIQTheme.Colors.backgroundPrimary)
        }
        .task {
            await viewModel.loadDashboardData()
        }
    }

    private func errorView(_ message: String) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.lg) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundStyle(ChairIQTheme.Colors.danger)

            Text("Error Loading Dashboard")
                .font(ChairIQTheme.Typography.title)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            Text(message)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                .multilineTextAlignment(.center)

            Button {
                Task { await viewModel.loadDashboardData() }
            } label: {
                Text("Try Again")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(ChairIQTheme.Spacing.md)
                    .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
            }
            .padding(.horizontal, ChairIQTheme.Spacing.xxl)
        }
        .padding()
    }

    private var dashboardContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xl) {
                welcomeHeader
                keyMetricsSection
                patientLookupSection
                plansAndActionsSection
                quickActionsSection
            }
            .padding(ChairIQTheme.Spacing.lg)
        }
        .refreshable {
            await viewModel.loadDashboardData()
        }
    }

    private var welcomeHeader: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text("Welcome back, \(userName)!")
                .font(ChairIQTheme.Typography.largeTitle)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            Text(currentDateString)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
        }
        .padding(.bottom, ChairIQTheme.Spacing.sm)
    }

    private var currentDateString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMMM d, yyyy"
        return formatter.string(from: Date())
    }

    private var keyMetricsSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            sectionHeader(title: "Key Metrics")

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: ChairIQTheme.Spacing.md) {
                StatCard(
                    title: "Active Patients",
                    value: "\(viewModel.stats.totalPatients)",
                    icon: "person.2.fill",
                    color: ChairIQTheme.Colors.primary
                )
                StatCard(
                    title: "Plans This Month",
                    value: "\(viewModel.stats.monthlyPlans)",
                    icon: "doc.text.fill",
                    color: ChairIQTheme.Colors.success
                )
                StatCard(
                    title: "Completion Rate",
                    value: "\(viewModel.stats.completionRate)%",
                    icon: "chart.line.uptrend.xyaxis",
                    color: ChairIQTheme.Colors.warning
                )
                StatCard(
                    title: "Avg. Engagement",
                    value: "\(viewModel.stats.avgEngagementMinutes)min",
                    icon: "clock.fill",
                    color: ChairIQTheme.Colors.secondary
                )
            }
        }
    }

    private var patientLookupSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            sectionHeader(title: "Patient Lookup")

            VStack(spacing: ChairIQTheme.Spacing.md) {
                patientSearchCard
                treatmentDetailsCard
            }
        }
    }

    private var patientSearchCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            SearchBar(text: $viewModel.searchQuery, placeholder: "Search by name or phone...")

            Button {
                Task { await viewModel.searchPatients() }
            } label: {
                Text("Search")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(ChairIQTheme.Spacing.md)
                    .background(ChairIQTheme.Colors.primary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
            }

            if viewModel.isSearching {
                ProgressView()
                    .frame(maxWidth: .infinity)
            }

            if !viewModel.searchResults.isEmpty {
                VStack(spacing: ChairIQTheme.Spacing.sm) {
                    ForEach(viewModel.searchResults) { patient in
                        Button {
                            Task { await viewModel.selectPatient(patient) }
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(patient.fullName)
                                        .font(ChairIQTheme.Typography.headline)
                                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                                    Text(patient.phone)
                                        .font(ChairIQTheme.Typography.caption)
                                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                            }
                            .padding(ChairIQTheme.Spacing.md)
                            .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                        }
                    }
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var treatmentDetailsCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            if let patient = viewModel.selectedPatient {
                HStack {
                    VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                        Text(patient.fullName)
                            .font(ChairIQTheme.Typography.title2)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                        Text(patient.phone)
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                        Text(patient.preferredLanguage.displayName)
                            .font(ChairIQTheme.Typography.caption)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    }
                    Spacer()
                    Button(role: .destructive) {
                        patientToDelete = patient
                        showDeleteConfirmation = true
                    } label: {
                        Image(systemName: "trash")
                            .foregroundStyle(ChairIQTheme.Colors.danger)
                    }
                }

                if viewModel.selectedPatientPlans.isEmpty {
                    Text("No treatment plans found")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, ChairIQTheme.Spacing.lg)
                } else {
                    ForEach(viewModel.selectedPatientPlans, id: \.id) { plan in
                        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
                            HStack {
                                Text("Plan")
                                    .font(ChairIQTheme.Typography.headline)
                                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                                Spacer()
                                if let date = plan.createdAt {
                                    Text(date, style: .date)
                                        .font(ChairIQTheme.Typography.caption)
                                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                }
                            }

                            Text("\(plan.sortedProcedures.count) procedures")
                                .font(ChairIQTheme.Typography.subheadline)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)

                            ForEach(plan.sortedProcedures) { procedure in
                                HStack {
                                    Circle()
                                        .fill(ChairIQTheme.Colors.priorityColor(procedure.priority ?? .future))
                                        .frame(width: 8, height: 8)
                                    Text(procedure.effectiveTitle)
                                        .font(ChairIQTheme.Typography.subheadline)
                                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                                    Spacer()
                                    if let code = procedure.adaCode {
                                        Text(code)
                                            .font(ChairIQTheme.Typography.caption)
                                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                    }
                                }
                            }
                        }
                        .padding(ChairIQTheme.Spacing.md)
                        .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                    }
                }
            } else {
                VStack(spacing: ChairIQTheme.Spacing.md) {
                    Image(systemName: "person.crop.circle.badge.questionmark")
                        .font(.system(size: 40))
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    Text("Select a patient to view details")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, ChairIQTheme.Spacing.xxl)
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
        .alert("Delete Patient", isPresented: $showDeleteConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("Delete", role: .destructive) {
                if let patient = patientToDelete {
                    Task {
                        let success = await viewModel.deletePatient(patient.id)
                        if success {
                            await viewModel.loadDashboardData()
                        }
                    }
                }
            }
        } message: {
            Text("Are you sure you want to delete this patient and all associated data? This action cannot be undone.")
        }
    }

    private var plansAndActionsSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            sectionHeader(title: "Plans & Actions")

            recentPlansCard
            pendingActionsCard
        }
    }

    private var recentPlansCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            HStack {
                Text("Recent Plans")
                    .font(ChairIQTheme.Typography.headline)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                Spacer()
                Button {
                    Task { await viewModel.loadDashboardData() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .foregroundStyle(ChairIQTheme.Colors.primary)
                }
            }

            if viewModel.recentPlans.isEmpty {
                Text("No plans yet")
                    .font(ChairIQTheme.Typography.subheadline)
                    .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.vertical, ChairIQTheme.Spacing.lg)
            } else {
                ForEach(viewModel.recentPlans) { plan in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(plan.patientName)
                                .font(ChairIQTheme.Typography.headline)
                                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                            Text(plan.patientPhone)
                                .font(ChairIQTheme.Typography.caption)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                        }
                        Spacer()
                        if let date = plan.createdAt {
                            Text(date, style: .date)
                                .font(ChairIQTheme.Typography.caption)
                                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        }
                    }
                    .padding(ChairIQTheme.Spacing.md)
                    .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var pendingActionsCard: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            Text("Pending Actions")
                .font(ChairIQTheme.Typography.headline)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            if viewModel.pendingActions.isEmpty {
                HStack(spacing: ChairIQTheme.Spacing.sm) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(ChairIQTheme.Colors.success)
                    Text("All caught up!")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.vertical, ChairIQTheme.Spacing.lg)
            } else {
                ForEach(viewModel.pendingActions) { action in
                    HStack {
                        Circle()
                            .fill(action.priority == "high" ? ChairIQTheme.Colors.danger : action.priority == "medium" ? ChairIQTheme.Colors.warning : ChairIQTheme.Colors.primary)
                            .frame(width: 8, height: 8)
                        Text(action.message)
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                        Spacer()
                    }
                    .padding(ChairIQTheme.Spacing.md)
                    .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            sectionHeader(title: "Quick Actions")

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: ChairIQTheme.Spacing.md) {
                shortcutButton(title: "Create Plan", icon: "plus.circle.fill", color: ChairIQTheme.Colors.primary)
                shortcutButton(title: "View Library", icon: "books.vertical.fill", color: ChairIQTheme.Colors.secondary)
                shortcutButton(title: "Analytics", icon: "chart.bar.fill", color: ChairIQTheme.Colors.success)
                shortcutButton(title: "AI Studio", icon: "sparkles", color: ChairIQTheme.Colors.warning)
            }
        }
    }

    private func shortcutButton(title: String, icon: String, color: Color) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.sm) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(color)
                .frame(width: 44, height: 44)
                .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))

            Text(title)
                .font(ChairIQTheme.Typography.caption)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
        }
        .frame(maxWidth: .infinity)
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func sectionHeader(title: String) -> some View {
        HStack(spacing: ChairIQTheme.Spacing.sm) {
            RoundedRectangle(cornerRadius: ChairIQTheme.Radius.full)
                .fill(ChairIQTheme.Colors.primary)
                .frame(width: 4, height: 24)

            Text(title)
                .font(ChairIQTheme.Typography.title2)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)
        }
    }
}
