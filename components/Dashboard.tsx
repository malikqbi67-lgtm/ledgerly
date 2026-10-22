"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { BalanceChart } from "@/components/BalanceChart";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionList } from "@/components/TransactionList";
import { TransactionModal } from "@/components/TransactionModal";
import {
  addTransaction as addTransactionToStore,
  getServerSnapshot,
  getSnapshot,
  removeTransaction,
  subscribe,
} from "@/lib/transactionStore";
import type { Transaction, TransactionDraft } from "@/lib/types";

const noopSubscribe = () => () => {};

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function Dashboard() {
  const transactions = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totals = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === "income") {
          accumulator.income += transaction.amount;
          accumulator.incomeCount += 1;
        } else {
          accumulator.expenses += transaction.amount;
          accumulator.expenseCount += 1;
        }

        return accumulator;
      },
      { income: 0, expenses: 0, incomeCount: 0, expenseCount: 0 },
    );
  }, [transactions]);

  const balance = totals.income - totals.expenses;

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleAdd = useCallback((draft: TransactionDraft) => {
    const transaction: Transaction = {
      ...draft,
      id: createId(),
      createdAt: new Date().toISOString(),
    };

    addTransactionToStore(transaction);
    setIsModalOpen(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    removeTransaction(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10" />
        <div className="absolute -right-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -bottom-40 left-1/3 h-[24rem] w-[24rem] rounded-full bg-rose-300/10 blur-3xl dark:bg-rose-500/5" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header onAdd={openModal} />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 sm:mb-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-400">
              Overview
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Your money, at a glance
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              A clear view of what came in and what went out.
            </p>
          </motion.div>

          <SummaryCards
            income={totals.income}
            expenses={totals.expenses}
            balance={balance}
            incomeCount={totals.incomeCount}
            expenseCount={totals.expenseCount}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <TransactionList
                transactions={transactions}
                hydrated={hydrated}
                onDelete={handleDelete}
                onAdd={openModal}
              />
            </div>
            <div className="lg:col-span-4">
              <BalanceChart
                income={totals.income}
                expenses={totals.expenses}
                balance={balance}
              />
            </div>
          </div>
        </main>

        <footer className="border-t border-zinc-200/60 py-6 dark:border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 text-[11px] text-zinc-500 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span className="font-semibold">Ledgerly</span>
            <span>All data is saved locally in your browser.</span>
          </div>
        </footer>
      </div>

      <TransactionModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAdd}
      />
    </div>
  );
}
