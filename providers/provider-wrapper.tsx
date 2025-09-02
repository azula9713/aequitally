import { ReactNode } from "react";

import { ThemeProvider } from "./theme-provider";
import ConvexClientProvider from "./convex-client-provider";

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
