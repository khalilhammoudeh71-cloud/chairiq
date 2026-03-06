import Foundation
import AVFoundation

final class TTSService {
    static let shared = TTSService()

    private var openAIKey: String? {
        ProcessInfo.processInfo.environment["OPENAI_API_KEY"]
    }

    private var audioPlayer: AVAudioPlayer?

    private init() {}

    func generateSpeech(
        text: String,
        voice: String = "alloy",
        speed: Double = 1.0
    ) async throws -> Data {
        guard let apiKey = openAIKey else {
            throw AIError.missingAPIKey("OpenAI")
        }

        guard let url = URL(string: "https://api.openai.com/v1/audio/speech") else {
            throw URLError(.badURL)
        }

        let body: [String: Any] = [
            "model": "gpt-4o-mini-tts",
            "input": text,
            "voice": voice,
            "speed": speed,
            "response_format": "mp3"
        ]

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AIError.generationFailed("TTS request failed")
        }

        return data
    }

    func playAudio(data: Data) throws {
        audioPlayer = try AVAudioPlayer(data: data)
        audioPlayer?.play()
    }

    func stopAudio() {
        audioPlayer?.stop()
        audioPlayer = nil
    }

    var isPlaying: Bool {
        audioPlayer?.isPlaying ?? false
    }
}
