import SwiftUI

struct ProfileView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @State private var showingSignOutAlert = false

    var body: some View {
        List {
            Section {
                HStack(spacing: ChairIQTheme.Spacing.lg) {
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 56))
                        .foregroundStyle(ChairIQTheme.Colors.primary)

                    VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                        Text(authViewModel.currentUser?.fullName ?? "Dentist")
                            .font(ChairIQTheme.Typography.title2)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                        Text(authViewModel.currentUser?.email ?? "")
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)

                        if let role = authViewModel.currentUser?.role {
                            Text(role.rawValue.capitalized)
                                .font(ChairIQTheme.Typography.caption)
                                .fontWeight(.semibold)
                                .foregroundStyle(ChairIQTheme.Colors.primary)
                                .padding(.horizontal, ChairIQTheme.Spacing.sm)
                                .padding(.vertical, 2)
                                .background(ChairIQTheme.Colors.primaryLight, in: Capsule())
                        }
                    }
                }
                .padding(.vertical, ChairIQTheme.Spacing.sm)
            }

            Section("Practice Information") {
                if let practice = authViewModel.currentUser?.practiceName {
                    LabeledContent("Practice", value: practice)
                }
                if let phone = authViewModel.currentUser?.phone {
                    LabeledContent("Phone", value: phone)
                }
            }

            Section("App") {
                LabeledContent("Version", value: "1.0.0")
                LabeledContent("Platform", value: "iOS")
            }

            Section {
                Button(role: .destructive) {
                    showingSignOutAlert = true
                } label: {
                    HStack {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                        Text("Sign Out")
                    }
                }
            }
        }
        .navigationTitle("Profile")
        .alert("Sign Out", isPresented: $showingSignOutAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Sign Out", role: .destructive) {
                Task {
                    await authViewModel.signOut()
                }
            }
        } message: {
            Text("Are you sure you want to sign out?")
        }
    }
}
