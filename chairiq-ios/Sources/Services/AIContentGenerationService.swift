import Foundation

final class AIContentGenerationService {
    static let shared = AIContentGenerationService()

    private var openAIKey: String? {
        ProcessInfo.processInfo.environment["OPENAI_API_KEY"]
    }
    private var geminiKey: String? {
        ProcessInfo.processInfo.environment["GEMINI_API_KEY"]
    }

    private init() {}

    struct GenerationRequest {
        let procedureName: String
        let adaCode: String?
        let language: Language
        let tone: ContentTone
        let complexity: ContentComplexity
        let sections: [ContentSection]
    }

    enum ContentSection: String, CaseIterable {
        case description
        case risks
        case aftercare
        case faqs
        case whyNeeded = "why_needed"
    }

    struct GeneratedContent {
        var description: String?
        var risks: String?
        var aftercare: String?
        var faqs: [ProcedureFAQ]?
        var whyNeeded: String?
    }

    func generateContent(request: GenerationRequest) async throws -> GeneratedContent {
        guard let apiKey = openAIKey else {
            throw AIError.missingAPIKey("OpenAI")
        }

        let systemPrompt = buildSystemPrompt(request: request)
        let userPrompt = buildUserPrompt(request: request)

        let response = try await callOpenAI(
            apiKey: apiKey,
            systemPrompt: systemPrompt,
            userPrompt: userPrompt
        )

        return parseGeneratedContent(response, sections: request.sections)
    }

    func generateBatchContent(
        procedures: [String],
        language: Language,
        tone: ContentTone,
        complexity: ContentComplexity
    ) async throws -> [String: GeneratedContent] {
        var results: [String: GeneratedContent] = [:]

        try await withThrowingTaskGroup(of: (String, GeneratedContent).self) { group in
            for procedure in procedures {
                group.addTask {
                    let request = GenerationRequest(
                        procedureName: procedure,
                        adaCode: nil,
                        language: language,
                        tone: tone,
                        complexity: complexity,
                        sections: ContentSection.allCases
                    )
                    let content = try await self.generateContent(request: request)
                    return (procedure, content)
                }
            }

            for try await (procedure, content) in group {
                results[procedure] = content
            }
        }

        return results
    }

    private func buildSystemPrompt(request: GenerationRequest) -> String {
        let languageStr = request.language == .en ? "English" : "Spanish"
        let toneStr = request.tone.rawValue.lowercased()
        let complexityStr = request.complexity.rawValue.lowercased()

        return """
        You are a dental education content specialist. Generate patient-friendly educational content about dental procedures.
        
        Guidelines:
        - Language: \(languageStr)
        - Tone: \(toneStr)
        - Complexity: \(complexityStr)
        - Use clear, reassuring language
        - Focus on patient understanding and comfort
        - Include practical information patients need
        """
    }

    private func buildUserPrompt(request: GenerationRequest) -> String {
        let sections = request.sections.map { $0.rawValue }.joined(separator: ", ")
        var prompt = "Generate the following sections for the dental procedure '\(request.procedureName)': \(sections)."
        if let code = request.adaCode {
            prompt += " ADA Code: \(code)."
        }
        prompt += "\n\nReturn the content in JSON format with keys matching the section names."
        return prompt
    }

    private func callOpenAI(apiKey: String, systemPrompt: String, userPrompt: String) async throws -> String {
        guard let url = URL(string: "https://api.openai.com/v1/chat/completions") else {
            throw URLError(.badURL)
        }

        let body: [String: Any] = [
            "model": "gpt-4o-mini",
            "messages": [
                ["role": "system", "content": systemPrompt],
                ["role": "user", "content": userPrompt]
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        ]

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let choices = json["choices"] as? [[String: Any]],
              let firstChoice = choices.first,
              let message = firstChoice["message"] as? [String: Any],
              let content = message["content"] as? String else {
            throw AIError.invalidResponse
        }

        return content
    }

    private func parseGeneratedContent(_ raw: String, sections: [ContentSection]) -> GeneratedContent {
        var content = GeneratedContent()

        if let data = raw.data(using: .utf8),
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            content.description = json["description"] as? String
            content.risks = json["risks"] as? String
            content.aftercare = json["aftercare"] as? String
            content.whyNeeded = json["why_needed"] as? String

            if let faqArray = json["faqs"] as? [[String: String]] {
                content.faqs = faqArray.compactMap { dict in
                    guard let q = dict["q"], let a = dict["a"] else { return nil }
                    return ProcedureFAQ(q: q, a: a)
                }
            }
        } else {
            content.description = raw
        }

        return content
    }
}

enum AIError: LocalizedError {
    case missingAPIKey(String)
    case invalidResponse
    case generationFailed(String)

    var errorDescription: String? {
        switch self {
        case .missingAPIKey(let provider): return "Missing \(provider) API key."
        case .invalidResponse: return "Invalid response from AI service."
        case .generationFailed(let msg): return "Content generation failed: \(msg)"
        }
    }
}
