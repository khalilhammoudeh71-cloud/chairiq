import SwiftUI
import Charts

struct AnalyticsDashboardView: View {
    @State private var viewModel = AdminDashboardViewModel()
    @State private var copiedToken: String?

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    LoadingSpinner(message: "Loading Analytics...")
                } else if let error = viewModel.errorMessage {
                    errorView(error)
                } else {
                    analyticsContent
                }
            }
            .navigationTitle("Analytics")
            .background(ChairIQTheme.Colors.backgroundPrimary)
        }
        .task {
            await viewModel.loadAnalyticsData()
        }
    }

    private func errorView(_ message: String) -> some View {
        VStack(spacing: ChairIQTheme.Spacing.lg) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundStyle(ChairIQTheme.Colors.danger)

            Text("Error Loading Analytics")
                .font(ChairIQTheme.Typography.title)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            Text(message)
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                .multilineTextAlignment(.center)

            Button {
                Task { await viewModel.loadAnalyticsData() }
            } label: {
                Text("Retry")
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

    private var analyticsContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xl) {
                headerSection
                timeRangeFilter
                metricsSection
                engagementChartSection
                patientEngagementListSection
            }
            .padding(ChairIQTheme.Spacing.lg)
        }
        .refreshable {
            await viewModel.loadAnalyticsData()
        }
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text("Analytics Dashboard")
                .font(ChairIQTheme.Typography.largeTitle)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            Text("Track patient engagement and treatment effectiveness")
                .font(ChairIQTheme.Typography.body)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)

            HStack(spacing: ChairIQTheme.Spacing.xs) {
                Image(systemName: "calendar")
                    .font(.caption)
                Text(timeRangeLabel)
                    .font(ChairIQTheme.Typography.caption)
            }
            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
            .padding(.top, ChairIQTheme.Spacing.xs)
        }
    }

    private var timeRangeLabel: String {
        switch viewModel.selectedTimeRange {
        case "7d": return "Showing data for the last 7 days"
        case "30d": return "Showing data for the last 30 days"
        case "90d": return "Showing data for the last 90 days"
        default: return "Showing data for the last 30 days"
        }
    }

    private var timeRangeFilter: some View {
        HStack(spacing: ChairIQTheme.Spacing.sm) {
            ForEach(["7d", "30d", "90d"], id: \.self) { range in
                Button {
                    viewModel.selectedTimeRange = range
                    Task { await viewModel.loadAnalyticsData() }
                } label: {
                    Text(rangeLabel(range))
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(viewModel.selectedTimeRange == range ? .white : ChairIQTheme.Colors.textPrimary)
                        .padding(.horizontal, ChairIQTheme.Spacing.lg)
                        .padding(.vertical, ChairIQTheme.Spacing.sm)
                        .background(
                            viewModel.selectedTimeRange == range ? ChairIQTheme.Colors.primary : ChairIQTheme.Colors.backgroundSecondary,
                            in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md)
                        )
                }
            }
            Spacer()
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func rangeLabel(_ range: String) -> String {
        switch range {
        case "7d": return "7 Days"
        case "30d": return "30 Days"
        case "90d": return "90 Days"
        default: return range
        }
    }

    private var metricsSection: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: ChairIQTheme.Spacing.md) {
            StatCard(
                title: "Total Patients",
                value: "\(viewModel.overallMetrics.totalPatients)",
                icon: "person.2.fill",
                color: ChairIQTheme.Colors.primary
            )
            StatCard(
                title: "Active Plans",
                value: "\(viewModel.overallMetrics.activePlans)",
                icon: "doc.text.fill",
                color: ChairIQTheme.Colors.success
            )
            StatCard(
                title: "Avg. Engagement",
                value: "\(viewModel.overallMetrics.avgEngagementTime)%",
                icon: "chart.bar.fill",
                color: ChairIQTheme.Colors.warning
            )
            StatCard(
                title: "Completion Rate",
                value: "\(viewModel.overallMetrics.completionRate)%",
                icon: "chart.line.uptrend.xyaxis",
                color: ChairIQTheme.Colors.secondary
            )
        }
    }

    private var engagementChartSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            sectionHeader(title: "Engagement Trends")

            if viewModel.engagementTrends.isEmpty {
                VStack(spacing: ChairIQTheme.Spacing.md) {
                    Image(systemName: "chart.line.uptrend.xyaxis")
                        .font(.system(size: 40))
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    Text("No engagement data available yet")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, ChairIQTheme.Spacing.xxl)
            } else {
                Chart(viewModel.engagementTrends) { trend in
                    LineMark(
                        x: .value("Date", trend.date),
                        y: .value("Plan Views", trend.planViews)
                    )
                    .foregroundStyle(ChairIQTheme.Colors.primary)

                    LineMark(
                        x: .value("Date", trend.date),
                        y: .value("Procedure Views", trend.procedureViews)
                    )
                    .foregroundStyle(ChairIQTheme.Colors.success)

                    LineMark(
                        x: .value("Date", trend.date),
                        y: .value("Completions", trend.completions)
                    )
                    .foregroundStyle(ChairIQTheme.Colors.warning)
                }
                .frame(height: 200)
                .chartLegend(position: .bottom)

                HStack(spacing: ChairIQTheme.Spacing.lg) {
                    legendItem(color: ChairIQTheme.Colors.primary, label: "Plan Views")
                    legendItem(color: ChairIQTheme.Colors.success, label: "Procedure Views")
                    legendItem(color: ChairIQTheme.Colors.warning, label: "Completions")
                }
                .font(ChairIQTheme.Typography.caption)
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func legendItem(color: Color, label: String) -> some View {
        HStack(spacing: ChairIQTheme.Spacing.xs) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            Text(label)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
        }
    }

    private var patientEngagementListSection: some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.md) {
            sectionHeader(title: "Patient Engagement List")

            if viewModel.patientEngagementList.isEmpty {
                VStack(spacing: ChairIQTheme.Spacing.md) {
                    Image(systemName: "person.3.fill")
                        .font(.system(size: 40))
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    Text("No patient engagement data yet")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, ChairIQTheme.Spacing.xxl)
            } else {
                ForEach(viewModel.patientEngagementList) { patient in
                    patientEngagementRow(patient)
                }
            }
        }
        .padding(ChairIQTheme.Spacing.lg)
        .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }

    private func patientEngagementRow(_ patient: PatientEngagement) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.sm) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(patient.patientName)
                        .font(ChairIQTheme.Typography.headline)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                    Text(patient.language)
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(.white)
                        .padding(.horizontal, ChairIQTheme.Spacing.sm)
                        .padding(.vertical, 2)
                        .background(
                            patient.language == "EN" ? ChairIQTheme.Colors.primary : ChairIQTheme.Colors.warning,
                            in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm)
                        )
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text(patient.completionStatus)
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                    Text("\(patient.completionPercentage)%")
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(.white)
                        .padding(.horizontal, ChairIQTheme.Spacing.sm)
                        .padding(.vertical, 2)
                        .background(
                            patient.completionPercentage > 50 ? ChairIQTheme.Colors.success : ChairIQTheme.Colors.warning,
                            in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm)
                        )
                }
            }

            HStack(spacing: ChairIQTheme.Spacing.sm) {
                Text(formatTime(patient.timeSpent))
                    .font(ChairIQTheme.Typography.caption)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)

                Spacer()

                if !patient.publicToken.isEmpty {
                    Button {
                        let link = viewModel.copyPlanLink(publicToken: patient.publicToken)
                        UIPasteboard.general.string = link
                        copiedToken = patient.publicToken
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            if copiedToken == patient.publicToken {
                                copiedToken = nil
                            }
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: copiedToken == patient.publicToken ? "checkmark" : "doc.on.doc")
                            Text(copiedToken == patient.publicToken ? "Copied" : "Copy Link")
                        }
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(copiedToken == patient.publicToken ? ChairIQTheme.Colors.success : ChairIQTheme.Colors.primary)
                        .padding(.horizontal, ChairIQTheme.Spacing.sm)
                        .padding(.vertical, ChairIQTheme.Spacing.xs)
                        .background(
                            (copiedToken == patient.publicToken ? ChairIQTheme.Colors.successLight : ChairIQTheme.Colors.primaryLight),
                            in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm)
                        )
                    }
                }
            }
        }
        .padding(ChairIQTheme.Spacing.md)
        .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.sm))
    }

    private func formatTime(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let remainingSeconds = seconds % 60
        return "\(minutes)m \(remainingSeconds)s"
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
