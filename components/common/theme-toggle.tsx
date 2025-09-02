"use client";

import { Monitor, MoonStar, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "light") return <Sun className="size-[1.2rem]" />;
    if (theme === "dark") return <MoonStar className="size-[1.2rem]" />;
    return <Monitor className="size-[1.2rem]" />;
  };

  const getThemeKey = () => {
    if (theme === "light") return "light";
    if (theme === "dark") return "dark";
    return "system";
  };

  const getLabel = () => {
    if (theme === "light") return "Switch to dark theme";
    if (theme === "dark") return "Switch to system theme";
    return "Switch to light theme";
  };

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      <AnimatePresence mode="wait">
        <motion.div
          key={getThemeKey()}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center"
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">{getLabel()}</span>
    </Button>
  );
}
