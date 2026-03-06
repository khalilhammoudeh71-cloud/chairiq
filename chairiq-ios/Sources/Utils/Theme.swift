import SwiftUI

enum ChairIQTheme {
    enum Colors {
        static let primary = Color(hex: "2563EB")
        static let primaryDark = Color(hex: "1D4ED8")
        static let primaryLight = Color(hex: "DBEAFE")

        static let secondary = Color(hex: "7C3AED")
        static let secondaryLight = Color(hex: "EDE9FE")

        static let success = Color(hex: "059669")
        static let successLight = Color(hex: "D1FAE5")

        static let warning = Color(hex: "D97706")
        static let warningLight = Color(hex: "FEF3C7")

        static let danger = Color(hex: "DC2626")
        static let dangerLight = Color(hex: "FEE2E2")

        static let backgroundPrimary = Color(hex: "F8FAFC")
        static let backgroundSecondary = Color(hex: "F1F5F9")
        static let backgroundCard = Color.white

        static let textPrimary = Color(hex: "0F172A")
        static let textSecondary = Color(hex: "475569")
        static let textTertiary = Color(hex: "94A3B8")

        static let border = Color(hex: "E2E8F0")
        static let borderLight = Color(hex: "F1F5F9")

        static func priorityColor(_ priority: ProcedurePriority) -> Color {
            switch priority {
            case .immediate: return danger
            case .soon: return warning
            case .future: return primary
            }
        }

        static func priorityBackground(_ priority: ProcedurePriority) -> Color {
            switch priority {
            case .immediate: return dangerLight
            case .soon: return warningLight
            case .future: return primaryLight
            }
        }
    }

    enum Typography {
        static let largeTitle = Font.system(size: 28, weight: .bold, design: .rounded)
        static let title = Font.system(size: 22, weight: .bold, design: .rounded)
        static let title2 = Font.system(size: 20, weight: .semibold, design: .rounded)
        static let headline = Font.system(size: 17, weight: .semibold)
        static let body = Font.system(size: 16, weight: .regular)
        static let callout = Font.system(size: 15, weight: .regular)
        static let subheadline = Font.system(size: 14, weight: .regular)
        static let footnote = Font.system(size: 13, weight: .regular)
        static let caption = Font.system(size: 12, weight: .regular)
    }

    enum Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
        static let xxl: CGFloat = 32
        static let xxxl: CGFloat = 48
    }

    enum Radius {
        static let sm: CGFloat = 6
        static let md: CGFloat = 10
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
        static let full: CGFloat = 9999
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
