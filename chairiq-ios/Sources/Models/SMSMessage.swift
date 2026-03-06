import Foundation

struct SMSMessage: Codable, Identifiable {
    let id: UUID?
    let phoneNumber: String
    let messageContent: String
    let messageType: String
    let planLinkUrl: String?
    let treatmentPlanId: UUID?
    var deliveryStatus: DeliveryStatus?
    var twilioMessageSid: String?
    var errorMessage: String?
    var errorCode: String?
    var sentAt: Date?
    var failedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case phoneNumber = "phone_number"
        case messageContent = "message_content"
        case messageType = "message_type"
        case planLinkUrl = "plan_link_url"
        case treatmentPlanId = "treatment_plan_id"
        case deliveryStatus = "delivery_status"
        case twilioMessageSid = "twilio_message_sid"
        case errorMessage = "error_message"
        case errorCode = "error_code"
        case sentAt = "sent_at"
        case failedAt = "failed_at"
    }
}
