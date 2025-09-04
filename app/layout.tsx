import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import {
	OrganizationStructuredData,
	WebApplicationStructuredData,
} from "@/components/common/structured-data";
import MainLayout from "@/components/layouts/main";
import ProviderWrapper from "@/providers/provider-wrapper";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Aequitally - Simple Expense Sharing & Split Bills",
		template: "%s | Aequitally",
	},
	description:
		"Track and split expenses easily with friends and groups. Fair settlement calculations, real-time collaboration, and secure expense management. Free expense sharing app.",
	keywords: [
		"expense sharing",
		"bill splitting",
		"group expenses",
		"settlement calculator",
		"expense tracker",
		"split bills",
		"shared expenses",
		"expense management",
		"group finance",
		"bill calculator",
	],
	authors: [{ name: "Aequitally" }],
	creator: "Aequitally",
	publisher: "Aequitally",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://aequitally.com"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Aequitally - Simple Expense Sharing & Split Bills",
		description:
			"Track and split expenses easily with friends and groups. Fair settlement calculations, real-time collaboration, and secure expense management.",
		url: "https://aequitally.com",
		siteName: "Aequitally",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "Aequitally - Expense Sharing App",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Aequitally - Simple Expense Sharing & Split Bills",
		description:
			"Track and split expenses easily with friends and groups. Fair settlement calculations and secure expense management.",
		images: ["/logo.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/facicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		shortcut: "/favicon.ico",
	},
	manifest: "/manifest.json",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		// Add when available:
		// google: 'your-google-verification-code',
		// yandex: 'your-yandex-verification-code',
		// yahoo: 'your-yahoo-verification-code',
	},
	category: "finance",
	classification: "Financial Application",
	referrer: "origin-when-cross-origin",
	appLinks: {
		web: {
			url: "https://aequitally.com",
			should_fallback: true,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<WebApplicationStructuredData />
				<OrganizationStructuredData />
			</head>
			<body
				className={`${outfit.className} bg-background text-foreground antialiased`}
				suppressHydrationWarning
			>
				<ProviderWrapper>
					<MainLayout>{children}</MainLayout>
				</ProviderWrapper>
			</body>
		</html>
	);
}
