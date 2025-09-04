import type { Metadata } from "next";
import PageHeader from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { privacySections } from "@/lib/data/privacy-data";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Aequitally's Privacy Policy explains how we collect, use, and protect your information. We prioritize your privacy and never sell your data.",
	keywords: [
		"privacy policy",
		"data protection",
		"user privacy",
		"financial data security",
		"expense tracking privacy",
		"gdpr compliance",
	],
	openGraph: {
		title: "Privacy Policy - Aequitally",
		description:
			"Learn how Aequitally protects your privacy and personal data. We prioritize user privacy and never sell your information.",
		type: "website",
		url: "https://aequitally.vercel.app/privacy",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "Aequitally Privacy Policy",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Privacy Policy - Aequitally",
		description:
			"Learn how Aequitally protects your privacy and personal data.",
		images: ["/logo.png"],
	},
	alternates: {
		canonical: "/privacy",
	},
};

export default function Privacy() {
	return (
		<>
			<PageHeader
				{...{
					badgeText: "Privacy Policy",
					badgeIcon: "🔒",
					title: {
						text: "Your privacy",
						highlight: "matters to us",
					},
					description:
						"This Privacy Policy explains how Aequitally collects, uses, and protects your information. Last updated: July 2025",
				}}
			/>

			{/* Privacy Sections */}
			<section className="py-8 px-2">
				<div className="max-w-4xl mx-auto space-y-8">
					{privacySections.map((section) => (
						<Card key={section.title}>
							<CardContent>
								<h2 className="text-2xl font-medium mb-6 text-primary">
									{section.title}
								</h2>

								<div className="space-y-6">
									{section.content.map((item, itemIndex) => (
										<div key={item.subtitle}>
											<h3 className="font-medium mb-2">{item.subtitle}</h3>
											<p className="text-muted-foreground leading-relaxed">
												{item.text}
											</p>
											{itemIndex < section.content.length - 1 && (
												<Separator className="mt-4" />
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</>
	);
}
