"use client";

import { useEffect, useState } from "react";
import { UrlObject } from "url";
import LegalContact from "@/components/common/legal-contact";
import PageHeader from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cookieTypes } from "@/lib/data/cookie-pref";
import {
	loadCookiePreferences,
	saveCookiePreferences,
} from "@/lib/handlers/cookie-handler";

export default function Cookies() {
	const [essential, setEssential] = useState(true);
	const [marketing, setMarketing] = useState(false);
	const [analytics, setAnalytics] = useState(false);
	const [preferences, setPreferences] = useState(false);

	const handleCookieChange = (key: string, value: boolean) => {
		switch (key) {
			case "essential": // Essential cookies cannot be disabled
				break;
			case "analytics":
				setAnalytics(value);
				break;
			case "marketing":
				setMarketing(value);
				break;
			case "preferences":
				setPreferences(value);
				break;
			default:
				break;
		}
	};

	const handleAcceptAll = () => {
		setEssential(true);
		setAnalytics(true);
		setMarketing(true);
		setPreferences(true);
	};

	const handleOptionalOnly = () => {
		setEssential(true);
		setAnalytics(false);
		setMarketing(false);
		setPreferences(false);
	};

	useEffect(() => {
		const initialSettings = loadCookiePreferences();
		setEssential(initialSettings.essential);
		setAnalytics(initialSettings.analytics);
		setMarketing(initialSettings.marketing);
		setPreferences(initialSettings.preferences);
	}, []);

	useEffect(() => {
		const handleSaveSettings = () => {
			const cookieSettings = {
				essential,
				analytics,
				marketing,
				preferences,
			};
			saveCookiePreferences(cookieSettings);
		};

		handleSaveSettings();
	}, [essential, analytics, marketing, preferences]);

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

					{cookieTypes.map((type) => (
						<Card key={type.key}>
							<CardContent>
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-xl font-medium">{type.name}</h3>
									<div className="flex items-center">
										{type.required ? (
											<Badge>Required</Badge>
										) : (
											<Switch
												checked={
													type.key === "essential"
														? essential
														: type.key === "analytics"
															? analytics
															: type.key === "marketing"
																? marketing
																: preferences
												}
												onCheckedChange={(checked) =>
													handleCookieChange(type.key, checked)
												}
												disabled={type.required}
											/>
										)}
									</div>
								</div>

								<p className="text-muted-foreground mb-4 leading-relaxed">
									{type.description}
								</p>

								<div>
									<h4 className="font-medium mb-3">Examples:</h4>
									<ul className="space-y-2">
										{type.examples.map((example, exampleIndex) => (
											<li key={example} className="flex items-center space-x-2">
												<span className="text-primary">•</span>
												<span className="text-muted-foreground text-sm">
													{example}
												</span>
											</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>
					))}

					{/* Cookie Settings */}
					<Card className="border-accent/20">
						<CardContent>
							<h2 className="text-2xl font-medium mb-2 text-primary">
								Manage Your Cookie Preferences
							</h2>

							<div className="space-y-6">
								<p className="text-muted-foreground leading-relaxed">
									You can choose which types of cookies to allow. Note that
									essential cookies cannot be disabled as they are required for
									the website to function properly.
								</p>

								<div className="flex flex-col sm:flex-row gap-4">
									<Button
										onClick={handleAcceptAll}
										className="bg-accent hover:bg-accent/90 text-accent-foreground"
									>
										Accept All Cookies
									</Button>
									<Button
										onClick={handleOptionalOnly}
										variant="outline"
										className="border-accent text-primary hover:bg-accent hover:text-accent-foreground"
									>
										Reject Optional Cookies
									</Button>
								</div>

								<Separator />

								<div className="space-y-2">
									<h3 className="font-medium">Additional Information</h3>
									<div className="text-muted-foreground text-sm space-y-2">
										<p>
											• You can change your cookie preferences at any time by
											returning to this page
										</p>
										<p>
											• Disabling certain cookies may impact your experience on
											Aequitally
										</p>
										<p>
											• Essential cookies will always be active to ensure the
											site functions properly
										</p>
										<p>
											• Your preferences are stored locally and apply only to
											this browser
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

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
