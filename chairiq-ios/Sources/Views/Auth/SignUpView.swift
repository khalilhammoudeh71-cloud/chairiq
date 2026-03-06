import SwiftUI

struct SignUpView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var fullName = ""
    @State private var practiceName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var showPassword = false
    @State private var showSuccess = false
    @State private var validationError: String?

    private var displayError: String? {
        validationError ?? authViewModel.errorMessage
    }

    private var isFormValid: Bool {
        !fullName.isEmpty && !practiceName.isEmpty && !email.isEmpty && !password.isEmpty && !confirmPassword.isEmpty
    }

    var body: some View {
        ScrollView {
            if showSuccess {
                successContent
            } else {
                formContent
            }
        }
        .background(ChairIQTheme.Colors.backgroundPrimary)
        .navigationTitle("Sign Up")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var successContent: some View {
        VStack(spacing: ChairIQTheme.Spacing.xl) {
            Spacer().frame(height: ChairIQTheme.Spacing.xxxl)

            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 64))
                .foregroundStyle(ChairIQTheme.Colors.success)

            Text("Check Your Email")
                .font(ChairIQTheme.Typography.largeTitle)
                .foregroundStyle(ChairIQTheme.Colors.textPrimary)

            VStack(spacing: ChairIQTheme.Spacing.sm) {
                Text("We sent a verification link to")
                    .font(ChairIQTheme.Typography.body)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                Text(email)
                    .font(ChairIQTheme.Typography.body)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
            }

            Text("Click the link in the email to verify your account. Once verified, you can log in immediately.")
                .font(ChairIQTheme.Typography.subheadline)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, ChairIQTheme.Spacing.xl)

            Button {
                dismiss()
            } label: {
                Text("Go to Login")
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ChairIQTheme.Spacing.md)
            }
            .buttonStyle(.borderedProminent)
            .tint(ChairIQTheme.Colors.primary)
            .padding(.horizontal, ChairIQTheme.Spacing.xl)
            .padding(.top, ChairIQTheme.Spacing.lg)
        }
        .padding(.horizontal, ChairIQTheme.Spacing.xl)
    }

    private var formContent: some View {
        VStack(spacing: ChairIQTheme.Spacing.xl) {
            VStack(spacing: ChairIQTheme.Spacing.sm) {
                Text("Join ChairIQ")
                    .font(ChairIQTheme.Typography.largeTitle)
                    .foregroundStyle(ChairIQTheme.Colors.textPrimary)
                Text("Start delivering visual treatment plans in minutes")
                    .font(ChairIQTheme.Typography.body)
                    .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, ChairIQTheme.Spacing.xl)

            VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.lg) {
                if let error = displayError {
                    HStack(alignment: .top, spacing: ChairIQTheme.Spacing.sm) {
                        Image(systemName: "exclamationmark.circle.fill")
                            .foregroundStyle(ChairIQTheme.Colors.danger)
                        Text(error)
                            .font(ChairIQTheme.Typography.subheadline)
                            .foregroundStyle(ChairIQTheme.Colors.danger)
                    }
                    .padding(ChairIQTheme.Spacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(ChairIQTheme.Colors.dangerLight, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }

                formField(label: "Full Name", placeholder: "Dr. Jane Smith", text: $fullName, contentType: .name)

                formField(label: "Practice Name", placeholder: "Smith Dental Care", text: $practiceName, contentType: .organizationName)

                formField(label: "Email Address", placeholder: "dr.smith@example.com", text: $email, contentType: .emailAddress, keyboardType: .emailAddress)

                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                    Text("Password")
                        .font(ChairIQTheme.Typography.subheadline)
                        .fontWeight(.medium)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    HStack {
                        Group {
                            if showPassword {
                                TextField("At least 6 characters", text: $password)
                            } else {
                                SecureField("At least 6 characters", text: $password)
                            }
                        }
                        .textContentType(.newPassword)
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
                }

                VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
                    Text("Confirm Password")
                        .font(ChairIQTheme.Typography.subheadline)
                        .fontWeight(.medium)
                        .foregroundStyle(ChairIQTheme.Colors.textSecondary)
                    Group {
                        if showPassword {
                            TextField("Re-enter your password", text: $confirmPassword)
                        } else {
                            SecureField("Re-enter your password", text: $confirmPassword)
                        }
                    }
                    .textContentType(.newPassword)
                    .disableAutocorrection(true)
                    .padding(ChairIQTheme.Spacing.md)
                    .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                }

                Button {
                    handleSignUp()
                } label: {
                    HStack(spacing: ChairIQTheme.Spacing.sm) {
                        if authViewModel.isLoading {
                            ProgressView()
                                .tint(.white)
                        }
                        Text(authViewModel.isLoading ? "Creating Account..." : "Sign Up")
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ChairIQTheme.Spacing.md)
                }
                .buttonStyle(.borderedProminent)
                .tint(ChairIQTheme.Colors.primary)
                .disabled(authViewModel.isLoading || !isFormValid)

                HStack(spacing: ChairIQTheme.Spacing.xs) {
                    Text("Already have an account?")
                        .font(ChairIQTheme.Typography.subheadline)
                        .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                    Button("Log in") {
                        dismiss()
                    }
                    .font(ChairIQTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(ChairIQTheme.Colors.primary)
                }
                .frame(maxWidth: .infinity)
            }
            .padding(ChairIQTheme.Spacing.xl)
            .background(ChairIQTheme.Colors.backgroundCard, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.lg))
            .shadow(color: .black.opacity(0.05), radius: 8, y: 4)

            Text("Powered by ChairIQ")
                .font(ChairIQTheme.Typography.caption)
                .foregroundStyle(ChairIQTheme.Colors.textTertiary)
                .padding(.top, ChairIQTheme.Spacing.lg)
        }
        .padding(.horizontal, ChairIQTheme.Spacing.xl)
    }

    private func formField(label: String, placeholder: String, text: Binding<String>, contentType: UITextContentType, keyboardType: UIKeyboardType = .default) -> some View {
        VStack(alignment: .leading, spacing: ChairIQTheme.Spacing.xs) {
            Text(label)
                .font(ChairIQTheme.Typography.subheadline)
                .fontWeight(.medium)
                .foregroundStyle(ChairIQTheme.Colors.textSecondary)
            TextField(placeholder, text: text)
                .textContentType(contentType)
                .keyboardType(keyboardType)
                .autocapitalization(keyboardType == .emailAddress ? .none : .words)
                .disableAutocorrection(true)
                .padding(ChairIQTheme.Spacing.md)
                .background(ChairIQTheme.Colors.backgroundSecondary, in: RoundedRectangle(cornerRadius: ChairIQTheme.Radius.md))
                .disabled(authViewModel.isLoading)
        }
    }

    private func handleSignUp() {
        validationError = nil

        if password.count < 6 {
            validationError = "Password must be at least 6 characters."
            return
        }

        if password != confirmPassword {
            validationError = "Passwords do not match."
            return
        }

        Task {
            await authViewModel.signUp(
                email: email,
                password: password,
                fullName: fullName,
                practiceName: practiceName
            )
            if authViewModel.errorMessage == nil {
                showSuccess = true
            }
        }
    }
}
