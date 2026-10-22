"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { formatCurrency } from "@/lib/format";

interface BalanceChartProps {
  income: number;
  expenses: number;
  balance: number;
}

const chartTransition = {
  type: "spring" as const,
  stiffness: 70,
  damping: 18,
  mass: 0.8,
};

export function BalanceChart({
  income,
  expenses,
  balance,
}: BalanceChartProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const incomeGradientId = `income-${uid}`;
  const expenseGradientId = `expense-${uid}`;

  const total = income + expenses;
  const incomePercent =
    total > 0 ? Math.min(100, Math.max(0, (income / total) * 100)) : 0;
  const expensePercent =
    total > 0 ? Math.min(100, Math.max(0, (expenses / total) * 100)) : 0;
  const isPositiveBalance = balance >= 0;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Cash flow"
      className="glass-card flex flex-col p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start"
    >
      <div>
        <h2 className="text-sm font-semibold tracking-tight">Cash Flow</h2>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          Income vs. expenses
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center justify-center">
        <div
          role="img"
          aria-label={`Income ${formatCurrency(income)} versus expenses ${formatCurrency(expenses)}.`}
          className="relative h-40 w-40 shrink-0"
        >
          <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient
                id={incomeGradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient
                id={expenseGradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              strokeWidth="14"
              className="stroke-zinc-200/90 dark:stroke-zinc-800"
            />

            <motion.circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke={`url(#${incomeGradientId})`}
              strokeWidth="14"
              strokeLinecap="round"
              pathLength={100}
              transform="rotate(-90 80 80)"
              initial={{ strokeDasharray: "0 100", opacity: 0 }}
              animate={{
                strokeDasharray: `${incomePercent} ${100 - incomePercent}`,
                opacity: incomePercent > 0 ? 1 : 0,
              }}
              transition={chartTransition}
            />

            <motion.circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke={`url(#${expenseGradientId})`}
              strokeWidth="14"
              strokeLinecap="round"
              pathLength={100}
              transform="rotate(-90 80 80)"
              initial={{
                strokeDasharray: "0 100",
                strokeDashoffset: 0,
                opacity: 0,
              }}
              animate={{
                strokeDasharray: `${expensePercent} ${100 - expensePercent}`,
                strokeDashoffset: -incomePercent,
                opacity: expensePercent > 0 ? 1 : 0,
              }}
              transition={chartTransition}
            />
          </svg>

          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Balance
              </p>
              <AnimatedNumber
                value={balance}
                className={`mt-0.5 block text-lg font-bold tracking-tight tabular-nums ${
                  isPositiveBalance
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 w-full space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-100/70 px-3 py-2.5 dark:bg-white/5">
            <span className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Income
            </span>
            <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatCurrency(income)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-100/70 px-3 py-2.5 dark:bg-white/5">
            <span className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Expenses
            </span>
            <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatCurrency(expenses)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Your balance updates instantly as transactions are added or removed.
      </p>
    </motion.aside>
  );
}
