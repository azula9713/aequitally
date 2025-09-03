import type { ReactNode } from "react";
import ConvexClientProvider from "./convex-client-provider";
import { ThemeProvider } from "./theme-provider";

type Props = {
	children: ReactNode;
};

export default function ProviderWrapper({ children }: Props) {
	return (
		<ConvexClientProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</ConvexClientProvider>
	);
}
