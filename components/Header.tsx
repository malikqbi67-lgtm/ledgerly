"use client";

import { motion } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onAdd: () => void;
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold tracking-tight">
              Ledgerly
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Finance Tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <motion.button
            type="button"
            onClick={onAdd}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-shadow hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950 sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
