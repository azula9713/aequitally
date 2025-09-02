"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handleRouteChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", handleRouteChange);
      }
    };
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/60 shadow-sm shadow-border/20 supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary rounded-xl flex items-center justify-center size-8 group-hover:scale-105 transition-transform duration-200">
                <span className="text-primary-foreground font-bold text-lg">
                  $
                </span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Aequitally
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {pathname !== "/" && (
              <Button
                onClick={() => router.push("/")}
                variant={pathname.includes("/tally") ? "secondary" : "default"}
              >
                Create Tally
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
