"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/60 shadow-sm shadow-border/20 supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-transparent rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="Aequitally Logo"
                  width={32}
                  height={32}
                />
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
