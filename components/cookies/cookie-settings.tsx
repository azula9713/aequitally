"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cookieTypes } from "@/lib/data/cookie-pref";
import {
	loadCookiePreferences,
	saveCookiePreferences,
} from "@/lib/handlers/cookie-handler";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

export default function CookieSettings() {
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
								{type.examples.map((example) => (
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

			<Card className="border-accent/20">
				<CardContent>
					<h2 className="text-2xl font-medium mb-2 text-primary">
						Manage Your Cookie Preferences
					</h2>

					<div className="space-y-6">
						<p className="text-muted-foreground leading-relaxed">
							You can choose which types of cookies to allow. Note that
							essential cookies cannot be disabled as they are required for the
							website to function properly.
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
									• Essential cookies will always be active to ensure the site
									functions properly
								</p>
								<p>
									• Your preferences are stored locally and apply only to this
									browser
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
