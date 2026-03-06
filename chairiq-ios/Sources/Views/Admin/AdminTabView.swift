import SwiftUI

struct AdminTabView: View {
    @State private var selectedTab: Tab = .dashboard

    enum Tab: String, CaseIterable {
        case dashboard = "Dashboard"
        case createPlan = "Create Plan"
        case library = "Library"
        case analytics = "Analytics"
        case profile = "Profile"

        var icon: String {
            switch self {
            case .dashboard: return "house.fill"
            case .createPlan: return "plus.circle.fill"
            case .library: return "books.vertical.fill"
            case .analytics: return "chart.bar.fill"
            case .profile: return "person.fill"
            }
        }
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                AdminDashboardView()
            }
            .tabItem {
                Label(Tab.dashboard.rawValue, systemImage: Tab.dashboard.icon)
            }
            .tag(Tab.dashboard)

            NavigationStack {
                CreatePatientPlanView()
            }
            .tabItem {
                Label(Tab.createPlan.rawValue, systemImage: Tab.createPlan.icon)
            }
            .tag(Tab.createPlan)

            NavigationStack {
                ProcedureLibraryView()
            }
            .tabItem {
                Label(Tab.library.rawValue, systemImage: Tab.library.icon)
            }
            .tag(Tab.library)

            NavigationStack {
                AnalyticsDashboardView()
            }
            .tabItem {
                Label(Tab.analytics.rawValue, systemImage: Tab.analytics.icon)
            }
            .tag(Tab.analytics)

            NavigationStack {
                ProfileView()
            }
            .tabItem {
                Label(Tab.profile.rawValue, systemImage: Tab.profile.icon)
            }
            .tag(Tab.profile)
        }
        .tint(ChairIQTheme.Colors.primary)
    }
}
