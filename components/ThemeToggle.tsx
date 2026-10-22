"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200/80 bg-white/60 text-zinc-600 backdrop-blur transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? (isDark ? "sun" : "moon") : "placeholder"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="grid place-items-center"
        >
          {!mounted ? (
            <span className="block h-[18px] w-[18px]" />
          ) : isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
