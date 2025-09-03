import LegalContact from "@/components/common/legal-contact";
import PageHeader from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { privacySections } from "@/lib/data/privacy-data";
import { UrlObject } from "url";

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
					{privacySections.map((section, sectionIndex) => (
						<Card key={sectionIndex}>
							<CardContent>
								<h2 className="text-2xl font-medium mb-6 text-primary">
									{section.title}
								</h2>

								<div className="space-y-6">
									{section.content.map((item, itemIndex) => (
										<div key={itemIndex}>
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
