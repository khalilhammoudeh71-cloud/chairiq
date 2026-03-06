import Foundation

final class AIPersonalizationService {
    static let shared = AIPersonalizationService()

    private var geminiKey: String? {
        ProcessInfo.processInfo.environment["GEMINI_API_KEY"]
    }

    private init() {}

    struct LearningProfile {
        var attentionSpan: AttentionLevel
        var complexityPreference: ContentComplexity
        var sectionsOfInterest: [String]
        var timeSpentMinutes: Double
        var completionPercentage: Double
    }

    enum AttentionLevel: String {
        case brief
        case moderate
        case detailed
    }

    func analyzeLearningProfile(
        sessionDuration: TimeInterval,
        sectionsViewed: [String],
        completionRate: Double
    ) -> LearningProfile {
        let minutes = sessionDuration / 60.0

        let attention: AttentionLevel
        if minutes < 2 {
            attention = .brief
        } else if minutes < 5 {
            attention = .moderate
        } else {
            attention = .detailed
        }

        let complexity: ContentComplexity
        if completionRate > 0.8 && minutes > 3 {
            complexity = .detailed
        } else if completionRate > 0.5 {
            complexity = .moderate
        } else {
            complexity = .basic
        }

        return LearningProfile(
            attentionSpan: attention,
            complexityPreference: complexity,
            sectionsOfInterest: sectionsViewed,
            timeSpentMinutes: minutes,
            completionPercentage: completionRate
        )
    }

    func adaptContent(
        originalContent: String,
        profile: LearningProfile,
        language: Language
    ) async throws -> String {
        guard let apiKey = geminiKey else {
            return originalContent
        }

        let prompt = buildAdaptationPrompt(
            content: originalContent,
            profile: profile,
            language: language
        )

        return try await callGemini(apiKey: apiKey, prompt: prompt)
    }

    private func buildAdaptationPrompt(
        content: String,
        profile: LearningProfile,
        language: Language
    ) -> String {
        let languageStr = language == .en ? "English" : "Spanish"
        return """
        Adapt the following dental education content for a patient with these characteristics:
        - Attention span: \(profile.attentionSpan.rawValue)
        - Preferred complexity: \(profile.complexityPreference.rawValue)
        - Language: \(languageStr)
        
        Original content:
        \(content)
        
        Adapted content:
        """
    }

    private func callGemini(apiKey: String, prompt: String) async throws -> String {
        guard let url = URL(string: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\(apiKey)") else {
            throw URLError(.badURL)
        }

        let body: [String: Any] = [
            "contents": [
                ["parts": [["text": prompt]]]
            ]
        ]

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let candidates = json["candidates"] as? [[String: Any]],
              let first = candidates.first,
              let contentObj = first["content"] as? [String: Any],
              let parts = contentObj["parts"] as? [[String: Any]],
              let text = parts.first?["text"] as? String else {
            throw AIError.invalidResponse
        }

        return text
    }
}
