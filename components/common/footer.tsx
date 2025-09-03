import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-border/60 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="flex items-center space-x-2 mb-3 md:mb-0 text-muted-foreground text-sm">
						<span>© {new Date().getFullYear()} Aequitally</span>
					</div>

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
				</div>
			</div>
		</footer>
	);
}
