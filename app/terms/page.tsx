import { UrlObject } from "url";
import LegalContact from "@/components/common/legal-contact";
import PageHeader from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { termsSections } from "@/lib/data/terms-data";

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
