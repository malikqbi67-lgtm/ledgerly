"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { TransactionDraft, TransactionType } from "@/lib/types";

interface TransactionFormProps {
  onSubmit: (transaction: TransactionDraft) => void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
}

const fieldBase =
  "w-full rounded-xl border bg-white/80 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:ring-2 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-500";

function fieldClasses(hasError: boolean) {
  return `${fieldBase} ${
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-500/60"
      : "border-zinc-200 hover:border-zinc-300 focus:border-violet-500 focus:ring-violet-500/30 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-violet-400"
  }`;
}

export function TransactionForm({
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<string>("Other");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const parsedAmount = Number(amount);

    if (!trimmedTitle) {
      nextErrors.title = "Please enter a title.";
    }

    if (!amount.trim()) {
      nextErrors.amount = "Please enter an amount.";
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Amount must be greater than zero.";
    }

    if (!category) {
      nextErrors.category = "Please choose a category.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      amount: Math.round(parsedAmount * 100) / 100,
      type,
      category,
    });
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05, duration: 0.25 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="transaction-title"
          className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
        >
          Title
        </label>
        <input
          id="transaction-title"
          type="text"
          value={title}
          maxLength={80}
          placeholder="e.g. Monthly salary"
          autoComplete="off"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "transaction-title-error" : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
            clearError("title");
          }}
          className={fieldClasses(Boolean(errors.title))}
        />
        <AnimatePresence initial={false}>
          {errors.title ? (
            <motion.p
              id="transaction-title-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {errors.title}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="transaction-amount"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-sm font-medium text-zinc-400">
              $
            </span>
            <input
              id="transaction-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              placeholder="0.00"
              autoComplete="off"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={
                errors.amount ? "transaction-amount-error" : undefined
              }
              onChange={(event) => {
                setAmount(event.target.value);
                clearError("amount");
              }}
              className={`${fieldClasses(Boolean(errors.amount))} pl-8`}
            />
          </div>
          <AnimatePresence initial={false}>
            {errors.amount ? (
              <motion.p
                id="transaction-amount-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs font-medium text-rose-600 dark:text-rose-400"
              >
                {errors.amount}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Type
          </span>
          <div
            role="group"
            aria-label="Transaction type"
            className="grid grid-cols-2 gap-1 rounded-xl border border-zinc-200 bg-zinc-100/70 p-1 dark:border-white/10 dark:bg-white/5"
          >
            {(
              [
                { value: "income", label: "Income", icon: ArrowDownLeft },
                { value: "expense", label: "Expense", icon: ArrowUpRight },
              ] as const
            ).map((option) => {
              const active = type === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setType(option.value)}
                  className="relative rounded-lg px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                >
                  {active ? (
                    <motion.span
                      layoutId="transaction-type-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-zinc-800"
                    />
                  ) : null}
                  <span
                    className={`relative flex items-center justify-center gap-1.5 ${
                      active
                        ? option.value === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="transaction-category"
          className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
        >
          Category
        </label>
        <div className="relative">
          <select
            id="transaction-category"
            value={category}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "transaction-category-error" : undefined
            }
            onChange={(event) => {
              setCategory(event.target.value);
              clearError("category");
            }}
            className={`${fieldClasses(Boolean(errors.category))} cursor-pointer appearance-none pr-10`}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
        <AnimatePresence initial={false}>
          {errors.category ? (
            <motion.p
              id="transaction-category-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {errors.category}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <motion.button
          type="button"
          onClick={onCancel}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-shadow hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </motion.button>
      </div>
    </motion.form>
  );
}
