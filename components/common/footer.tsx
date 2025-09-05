import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-border/60 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
					{/* Copyright Section */}
					<div className="flex items-center space-x-2 text-muted-foreground text-sm">
						<span>© {new Date().getFullYear()} Aequitally</span>
					</div>

					{/* Legal Links Section */}
					<div className="flex items-center space-x-4 text-muted-foreground text-sm">
						<Link
							href="/about"
							className="hover:text-foreground transition-colors"
						>
							About
						</Link>
						<Link
							href="/privacy"
							className="hover:text-foreground transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/cookies"
							className="hover:text-foreground transition-colors"
						>
							Cookies
						</Link>
						<Link
							href="/terms"
							className="hover:text-foreground transition-colors"
						>
							Terms
						</Link>
					</div>

					{/* Developer Attribution Section */}
					<div className="flex items-center space-x-3 text-muted-foreground text-sm">
						<span>Built by Azula9713</span>
						<div className="flex items-center space-x-2">
							<Link
								href="https://github.com/azula9713/aequitally"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-foreground transition-colors"
								aria-label="View source code on GitHub"
							>
								<Github className="h-4 w-4" />
							</Link>
							<Link
								href="https://azula9713.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-foreground transition-colors"
								aria-label="Visit developer's portfolio website"
							>
								<ExternalLink className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
