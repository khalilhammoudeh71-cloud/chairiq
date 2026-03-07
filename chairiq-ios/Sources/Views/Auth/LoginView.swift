import SwiftUI

struct LoginView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @State private var showSignUp = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ChairIQTheme.Spacing.xl) {
                    VStack(spacing: ChairIQTheme.Spacing.md) {
                        Image("AppIcon")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 72, height: 72)
                            .clipShape(RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))

                        Text("ChairIQ")
                            .font(ChairIQTheme.Typography.largeTitle)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                        Text("Dentist Portal")
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    }
                    .padding(.top, ChairIQTheme.Spacing.xxxl)

                    VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.lg) {
                        Text("Welcome back")
                            .font(ChairIQTheme.Typography.title)
                            .foregroundStyle(ChairIQTheme.Colors.textPrimary)

                        if let errorMessage = authViewModel.errorMessage {
                            HStack(alignment: .top, spacing: ChairIQTheme.Spacing.sm) {
                                Image(systemName: "exclamationmark.circle.fill")
                                    .foregroundStyle(ChairIQTheme.Colors.danger)
                                Text(errorMessage)
                                    .font(ChairIQTheme.Typography.subheadline)
                                    .foregroundStyle(ChairIQTheme.Colors.danger)
                            }
                            .padding(ChairIQTheme.Spacing.md)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(ChairIQTheme.Colors.dangerLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                        }

                        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                            Text("Email Address")
                                .font(ChairIQTheme.Typography.subheadline)
                                .fontWeight(.medium)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                            TextField("dentist@chairiq.com", text: $email)
                                .textContentType(.emailAddress)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .padding(ChairIQTheme.Spacing.md)
                                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                                .disabled(authViewModel.isLoading)
                        }

                        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                            Text("Password")
                                .font(ChairIQTheme.Typography.subheadline)
                                .fontWeight(.medium)
                                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                            HStack {
                                Group {
                                    if showPassword {
                                        TextField("Enter your password", text: $password)
                                    } else {
                                        SecureField("Enter your password", text: $password)
                                    }
                                }
                                .textContentType(.password)
                                .disableAutocorrection(true)

                                Button {
                                    showPassword.toggle()
                                } label: {
                                    Image(systemName: showPassword ? "eye.slash.fill" : "eye.fill")
                                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                                }
                            }
                            .padding(ChairIQTheme.Spacing.md)
                            .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                            .disabled(authViewModel.isLoading)
                        }

                        Button {
                            Task {
                                await authViewModel.signIn(email: email, password: password)
                            }
                        } label: {
                            HStack(spacing: ChairIQTheme.Spacing.sm) {
                                if authViewModel.isLoading {
                                    ProgressView()
                                        .tint(.white)
                                }
                                Text(authViewModel.isLoading ? "Signing in..." : "Sign In")
                                    .fontWeight(.semibold)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, ChairIQTheme.Spacing.md)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(ChairIQTheme.Colors.primary)
                        .disabled(authViewModel.isLoading || email.isEmpty || password.isEmpty)
                    }
                    .padding(ChairIQTheme.Spacing.xl)
                    .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
                    .shadow(color: .black.opacity(0.05), radius: 8, y: 4)

                    HStack(spacing: ChairIQTheme.Spacing.xs) {
                        Text("Don't have an account?")
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        Button("Sign up") {
                            showSignUp = true
                        }
                        .font(ChairIQTheme.Typography.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(ChairIQTheme.Colors.primary)
                    }

                    Text("Powered by ChairIQ")
                        .font(ChairIQTheme.Typography.caption)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                        .padding(.top, ChairIQTheme.Spacing.lg)
                }
                .padding(.horizontal, ChairIQTheme.Spacing.xl)
            }
            .background(ChairIQTheme.Colors.backgroundPrimary)
            .navigationDestination(isPresented: $showSignUp) {
                SignUpView()
            }
        }
    }
}
