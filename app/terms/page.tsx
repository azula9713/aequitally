import type { Metadata } from "next";
import PageHeader from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { termsSections } from "@/lib/data/terms-data";

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"Read Aequitally's Terms of Service to understand your rights and responsibilities when using our expense sharing platform.",
	keywords: [
		"terms of service",
		"user agreement",
		"legal terms",
		"service agreement",
		"user responsibilities",
		"platform terms",
	],
	openGraph: {
		title: "Terms of Service - Aequitally",
		description:
			"Read Aequitally's Terms of Service to understand your rights and responsibilities when using our expense sharing platform.",
		type: "website",
		url: "https://aequitally.vercel.app/terms",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "Aequitally Terms of Service",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Terms of Service - Aequitally",
		description:
			"Read our Terms of Service to understand your rights and responsibilities.",
		images: ["/logo.png"],
	},
	alternates: {
		canonical: "/terms",
	},
};

export default function Terms() {
	return (
		<>
			<PageHeader
				{...{
					badgeText: "Terms of Service",
					badgeIcon: "📋",
					title: {
						text: "Understand our",
						highlight: "terms of service",
					},
					description:
						"Please read these Terms of Service carefully before using Aequitally. Last updated: December 2024",
				}}
			/>

			{/* Terms Sections */}
			<section className="py-8 px-2">
				<div className="max-w-4xl mx-auto space-y-8">
					{termsSections.map((section, sectionIndex) => (
						<Card key={section.title}>
							<CardContent>
								<h2 className="text-2xl font-medium mb-2 text-primary">
									{sectionIndex + 1}. {section.title}
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
