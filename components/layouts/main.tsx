"use client";

import { Toaster } from "@/components/ui/sonner";

import Footer from "../common/footer";
import Header from "../common/header";

type Props = {
	children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
	return (
		<div className="bg-background min-h-screen text-foreground overflow-hidden relative flex flex-col">
			<Header />
			<main className="max-w-6xl mx-auto mt-16 flex-1 w-full px-4">
				{children}
			</main>
			<Footer />
			<Toaster />
		</div>
	);
}
