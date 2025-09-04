import type { Metadata } from "next";
import PageHeader from "@/components/common/page-header";
import CookieSettings from "@/components/cookies/cookie-settings";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Cookie Policy",
	description:
		"Learn about how Aequitally uses cookies and manage your cookie preferences. Control your privacy settings and understand our cookie policy.",
	keywords: [
		"cookie policy",
		"cookie preferences",
		"privacy settings",
		"website cookies",
		"tracking preferences",
		"data collection",
	],
	openGraph: {
		title: "Cookie Policy - Aequitally",
		description:
			"Learn about how Aequitally uses cookies and manage your cookie preferences to control your privacy settings.",
		type: "website",
		url: "https://aequitally.vercel.app/cookies",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "Aequitally Cookie Policy",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Cookie Policy - Aequitally",
		description:
			"Learn about our cookie policy and manage your privacy preferences.",
		images: ["/logo.png"],
	},
	alternates: {
		canonical: "/cookies",
	},
};

export default function Cookies() {
	return (
		<>
			<PageHeader
				{...{
					badgeText: "Cookie Policy",
					badgeIcon: "🍪",
					title: {
						text: "Your cookie preferences",
						highlight: "matter",
					},
					description:
						"Learn about how Aequitally uses cookies and manage your preferences. Last updated: October 2023",
				}}
			/>

			<section className="py-8 px-2">
				<div className="max-w-4xl mx-auto space-y-8">
					<Card>
						<CardContent className="p-8">
							<h2 className="text-2xl font-medium mb-2 text-primary">
								What Are Cookies?
							</h2>
							<div className="space-y-2 text-muted-foreground leading-relaxed">
								<p>
									Cookies are small text files that are stored on your device
									when you visit websites. They help websites remember
									information about your visit, which can make your next visit
									easier and the site more useful to you.
								</p>
								<p>
									Aequitally uses cookies to provide essential functionality,
									improve performance, and enhance your user experience. You can
									control which cookies we use through the settings below.
								</p>
							</div>
						</CardContent>
					</Card>

					<CookieSettings />

					{/* Third-Party Services */}
					<Card>
						<CardContent className="p-8">
							<h2 className="text-2xl font-medium mb-2 text-primary">
								Third-Party Services
							</h2>

							<div className="space-y-2 text-muted-foreground leading-relaxed">
								<p>
									Aequitally may use third-party services that set their own
									cookies. These include:
								</p>

								<ul className="space-y-2 ml-4">
									<li className="flex items-start space-x-2">
										<span className="text-primary mt-1.5">•</span>
										<span>
											<strong>Google Analytics:</strong> For website analytics
											and performance monitoring
										</span>
									</li>
									<li className="flex items-start space-x-2">
										<span className="text-primary mt-1.5">•</span>
										<span>
											<strong>CDN Services:</strong> For faster content delivery
											and performance
										</span>
									</li>
								</ul>

								<p>
									Each service has its own privacy policy and cookie practices.
									We recommend reviewing their policies if you have concerns
									about third-party data collection.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</>
	);
}
