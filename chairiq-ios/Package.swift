// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ChairIQ",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "ChairIQ",
            targets: ["ChairIQ"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/supabase/supabase-swift.git", from: "2.0.0"),
        .package(url: "https://github.com/onevcat/Kingfisher.git", from: "7.10.0"),
    ],
    targets: [
        .target(
            name: "ChairIQ",
            dependencies: [
                .product(name: "Supabase", package: "supabase-swift"),
                .product(name: "Kingfisher", package: "Kingfisher"),
            ],
            path: "Sources"
        )
    ]
)
