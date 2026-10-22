"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
