"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { FiMoon, FiSun } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 cursor-pointer"
            onClick={() =>
              mounted && setTheme(theme === "dark" ? "light" : "dark")
            }
            aria-label={
              mounted
                ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
                : "Toggle theme"
            }
          >
            {/* Always render both icons but hide one based on theme */}
            <div className="relative w-4 h-4">
              <FiSun
                className={`h-4 w-4 absolute top-0 left-0 transition-opacity duration-300 ${mounted && theme === "dark" ? "opacity-100" : "opacity-0"}`}
              />
              <FiMoon
                className={`h-4 w-4 absolute top-0 left-0 transition-opacity duration-300 ${mounted && theme !== "dark" ? "opacity-100" : "opacity-0"}`}
              />
            </div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
