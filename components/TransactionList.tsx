"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";

interface TransactionListProps {
  transactions: Transaction[];
  hydrated: boolean;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function TransactionList({
  transactions,
  hydrated,
  onDelete,
  onAdd,
}: TransactionListProps) {
  const count = transactions.length;

  return (
    <section aria-labelledby="transactions-heading" className="glass-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="transactions-heading"
            className="text-sm font-semibold tracking-tight"
          >
            Recent Transactions
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {count === 0
              ? "Your activity will appear here."
              : `${count} ${count === 1 ? "entry" : "entries"} saved on this device`}
          </p>
        </div>
        <span className="rounded-full border border-zinc-200/80 bg-white/60 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
          {count}
        </span>
      </div>

      {!hydrated ? (
        <div className="mt-6 flex flex-col gap-3" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex animate-pulse items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white/50 p-4 dark:border-white/5 dark:bg-white/[0.03]"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200/80 dark:bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
                <div className="h-2.5 w-1/4 rounded-full bg-zinc-200/60 dark:bg-zinc-800/70" />
              </div>
              <div className="h-4 w-16 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300/80 bg-white/40 px-6 py-14 text-center dark:border-white/10 dark:bg-white/[0.02]"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <ReceiptText className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No transactions yet</h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Add your first income or expense to watch your balance and cash flow
            update in real time.
          </p>
          <motion.button
            type="button"
            onClick={onAdd}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-shadow hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
          >
            <Plus className="h-4 w-4" />
            Add your first transaction
          </motion.button>
        </motion.div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";
              const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

              return (
                <motion.li
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/50 p-3 transition-colors hover:border-zinc-300 hover:bg-white/80 dark:border-white/5 dark:bg-white/[0.03] dark:hover:border-white/10 dark:hover:bg-white/[0.06] sm:gap-4 sm:p-4"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl sm:h-10 sm:w-10 ${
                      isIncome
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {transaction.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-medium dark:bg-white/5">
                        {transaction.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold tabular-nums sm:text-sm ${
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "−"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 sm:block">
                        {isIncome ? "Income" : "Expense"}
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => onDelete(transaction.id)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      aria-label={`Delete ${transaction.title}`}
                      title="Delete transaction"
                      className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 opacity-100 transition-all hover:bg-rose-500/10 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 dark:text-zinc-500 dark:hover:text-rose-400 sm:h-8 sm:w-8 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
