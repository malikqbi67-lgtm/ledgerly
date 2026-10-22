"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";
import type { TransactionDraft } from "@/lib/types";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionDraft) => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TransactionModal({
  open,
  onClose,
  onSubmit,
}: TransactionModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLInputElement>("#transaction-title")
        ?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="transaction-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/50 backdrop-blur-sm"
        >
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="transaction-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="transaction-modal-title"
                    className="text-lg font-bold tracking-tight"
                  >
                    New Transaction
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Log income or an expense to keep your balance current.
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Close dialog"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-transparent text-zinc-500 transition-colors hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 dark:text-zinc-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-zinc-100"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="mt-6">
                <TransactionForm onSubmit={onSubmit} onCancel={onClose} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
