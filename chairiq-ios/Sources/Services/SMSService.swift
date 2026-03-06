import Foundation
import Supabase

final class SMSService {
    static let shared = SMSService()
    private let client = SupabaseManager.shared.client

    private init() {}

    struct SendSMSRequest: Codable {
        let to: String
        let body: String
        let planUrl: String?

        enum CodingKeys: String, CodingKey {
            case to, body
            case planUrl = "plan_url"
        }
    }

    struct SendSMSResponse: Codable {
        let success: Bool
        let messageSid: String?
        let error: String?

        enum CodingKeys: String, CodingKey {
            case success
            case messageSid = "message_sid"
            case error
        }
    }

    func sendPlanLink(
        to phoneNumber: String,
        patientName: String,
        publicToken: String,
        practiceName: String
    ) async throws -> SendSMSResponse {
        let planUrl = "https://chairiq.app/p/\(publicToken)"
        let messageBody = "Hi \(patientName), your treatment plan from \(practiceName) is ready. View it here: \(planUrl)"

        let request = SendSMSRequest(
            to: phoneNumber,
            body: messageBody,
            planUrl: planUrl
        )

        let response: SendSMSResponse = try await client.functions
            .invoke(
                "send-sms",
                options: .init(body: request)
            )

        let logEntry = SMSMessage(
            id: nil,
            phoneNumber: phoneNumber,
            messageContent: messageBody,
            messageType: "treatment_plan",
            planLinkUrl: planUrl,
            treatmentPlanId: nil,
            deliveryStatus: response.success ? .sent : .failed,
            twilioMessageSid: response.messageSid,
            errorMessage: response.error
        )
        try? await client.from("sms_messages")
            .insert(logEntry)
            .execute()

        return response
    }
}
