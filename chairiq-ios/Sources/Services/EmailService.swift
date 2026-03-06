import Foundation

final class EmailService {
    static let shared = EmailService()

    private var baseURL: String {
        ProcessInfo.processInfo.environment["API_BASE_URL"] ?? "https://chairiq.app"
    }

    private init() {}

    struct SendEmailRequest: Codable {
        let to: String
        let subject: String
        let patientName: String
        let planUrl: String
        let practiceName: String
        let dentistName: String

        enum CodingKeys: String, CodingKey {
            case to, subject
            case patientName = "patient_name"
            case planUrl = "plan_url"
            case practiceName = "practice_name"
            case dentistName = "dentist_name"
        }
    }

    struct SendEmailResponse: Codable {
        let success: Bool
        let message: String?
        let error: String?
    }

    func sendPlanEmail(
        to email: String,
        patientName: String,
        publicToken: String,
        practiceName: String,
        dentistName: String
    ) async throws -> SendEmailResponse {
        let planUrl = "\(baseURL)/p/\(publicToken)"
        let request = SendEmailRequest(
            to: email,
            subject: "Your Treatment Plan from \(practiceName)",
            patientName: patientName,
            planUrl: planUrl,
            practiceName: practiceName,
            dentistName: dentistName
        )

        guard let url = URL(string: "\(baseURL)/api/notifications/send") else {
            throw URLError(.badURL)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try JSONEncoder().encode(request)

        let (data, _) = try await URLSession.shared.data(for: urlRequest)
        let response = try JSONDecoder().decode(SendEmailResponse.self, from: data)
        return response
    }
}
