"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TallyPageError() {
	const headingId = useId();
	const descriptionId = useId();

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<div className="bg-background flex items-center justify-center p-4 h-max">
			<div className="max-w-5xl mx-auto w-full">
				<Card className="bg-card border-border/50">
					<CardContent className="text-center">
						{/* Error Icon */}
						<div className="flex justify-center">
							<div className="size-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
								<AlertCircle size={24} aria-hidden="true" />
							</div>
						</div>

						{/* Error Content */}
						<div className="space-y-4">
							<h1 id={headingId} className="text-4xl lg:text-5xl font-light">
								Tally <span className="text-primary">not found</span>
							</h1>

							<p
								id={descriptionId}
								className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
							>
								The tally you're looking for doesn't exist or may have been
								removed.
							</p>

							<p className="text-base text-muted-foreground">
								Double-check the URL or try creating a new tally.
							</p>
						</div>
					</CardContent>
				</Card>
				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
					<Button
						asChild
						size="lg"
						className="px-8 py-6 text-lg"
						aria-describedby={`${headingId} ${descriptionId}`}
					>
						<Link href="/">
							<Home size={20} aria-hidden="true" />
							Go back home
						</Link>
					</Button>

					<Button
						variant="outline"
						size="lg"
						className="px-8 py-6 text-lg"
						onClick={handleRefresh}
						aria-label="Refresh page to try again"
					>
						<RefreshCw size={20} aria-hidden="true" />
						Try again
					</Button>
				</div>
			</div>
		</div>
	);
}
