"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { formatCurrency } from "@/lib/format";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export function SummaryCards({
  income,
  expenses,
  balance,
  incomeCount,
  expenseCount,
}: SummaryCardsProps) {
  const totalCount = incomeCount + expenseCount;
  const isPositiveBalance = balance >= 0;

  const cards = [
    {
      label: "Total Income",
      value: income,
      icon: ArrowDownLeft,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
      glow: "from-emerald-400/40 to-teal-300/10",
      meta: `${incomeCount} ${incomeCount === 1 ? "deposit" : "deposits"}`,
    },
    {
      label: "Total Expenses",
      value: expenses,
      icon: ArrowUpRight,
      iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      valueClass: "text-rose-600 dark:text-rose-400",
      glow: "from-rose-400/40 to-orange-300/10",
      meta: `${expenseCount} ${expenseCount === 1 ? "purchase" : "purchases"}`,
    },
    {
      label: "Remaining Balance",
      value: balance,
      icon: Wallet,
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      valueClass: isPositiveBalance
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400",
      glow: "from-violet-400/40 to-indigo-300/10",
      meta: `${totalCount} total ${totalCount === 1 ? "transaction" : "transactions"}`,
    },
  ];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      aria-label="Financial summary"
      className="grid gap-4 sm:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.article
            key={card.label}
            variants={item}
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="glass-card group relative overflow-hidden p-5"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${card.glow} opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-80`}
            />
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  {card.label}
                </span>
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${card.iconClass}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div>
                <AnimatedNumber
                  value={card.value}
                  className={`block text-xl font-bold tracking-tight tabular-nums sm:text-2xl ${card.valueClass}`}
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {card.meta}
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
      <span className="sr-only">
        Remaining balance is {formatCurrency(balance)}.
      </span>
    </motion.section>
  );
}
