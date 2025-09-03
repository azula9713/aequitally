import Link from "next/link";

import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
	const values = [
		{
			title: "Simplicity First",
			description:
				"If it takes more than 60 seconds to create a tally, it's too complicated.",
			icon: "✨",
		},
		{
			title: "Privacy Focused",
			description:
				"Your financial data stays private. No tracking, no ads, no data selling.",
			icon: "🔒",
		},
		{
			title: "Actually Useful",
			description:
				"Built by someone who uses it daily. Every feature solves a real problem.",
			icon: "🛠️",
		},
	];

	return (
		<>
			<PageHeader
				{...{
					badgeText: "The story",
					badgeIcon: "🌟",
					title: {
						text: "Made for",
						highlight: "easy tallying",
					},
					description:
						"I built Aequitally to make tallying expenses simple and stress-free for everyone.",
				}}
			/>

			{/* Mission Section */}
			<section className="py-8 px-2">
				<div className="max-w-7xl mx-auto">
					<div className="grid gap-12 items-center">
						<div className="space-y-6">
							<h2 className="text-4xl lg:text-5xl font-light">
								The <span className="text-primary">story</span>
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								As someone who loves going out with friends but dreads the math
								afterward, I found myself constantly frustrated with existing
								solutions. They were either too complex, required everyone to
								sign up, or charged monthly fees for something I only used
								occasionally.
							</p>
							<p className="text-lg text-muted-foreground leading-relaxed">
								So I built Aequitally with a simple philosophy: pay only for
								what you use, keep it simple enough for anyone to understand,
								and never make money conversations awkward again.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{values.map((value) => (
								<Card key={value.title}>
									<CardContent className="space-y-2">
										<div className="text-3xl">{value.icon}</div>
										<h3 className="text-lg font-medium">{value.title}</h3>
										<p className="text-muted-foreground text-sm">
											{value.description}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Developer Section */}
			<section className="py-8 px-2 border-t border-border">
				<div className="max-w-5xl mx-auto">
					<div className="text-center space-y-4 mb-8">
						<h2 className="text-4xl lg:text-5xl font-light">
							About the <span className="text-primary">developer</span>
						</h2>
						<p className="text-muted-foreground text-lg">
							The person behind Aequitally
						</p>
					</div>

					<Card>
						<CardContent className="text-center">
							<div className="bg-accent/20 rounded-full mx-auto flex items-center justify-center size-24">
								<span className="text-primary text-2xl font-semibold">
									👨‍💻
								</span>
							</div>
							<div className="space-y-4">
								<h3 className="text-2xl font-medium">Solo Developer</h3>
								<p className="text-primary">Full-Stack Engineer & Designer</p>
								<p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
									I`&apos;`m a software engineer who believes in building tools
									that solve real problems. When I`&apos;`m not coding
									Aequitally, you`&apos;`ll find me trying new restaurants (and
									sharing the bill with friends), hiking, or working on other
									side projects.
								</p>
								<p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
									Aequitally is bootstrapped and independent - no investors, no
									pressure to add unnecessary features or raise prices. Just a
									simple tool that works.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-8 px-2 border-t border-border">
				<div className="max-w-5xl mx-auto text-center space-y-8">
					<h2 className="text-4xl lg:text-5xl font-light">
						Ready to try <span className="text-primary">Aequitally?</span>
					</h2>
					<p className="text-muted-foreground text-lg">
						Built with love by a developer who actually uses it. Give it a try!
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" className="px-8 py-6 text-lg">
							<Link href="/">Get Started</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
