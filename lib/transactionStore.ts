import { loadTransactions, saveTransactions } from "@/lib/storage";
import type { Transaction } from "@/lib/types";

const EMPTY: Transaction[] = [];
const listeners = new Set<() => void>();

let cache: Transaction[] | null = null;

function byNewestFirst(a: Transaction, b: Transaction) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function read(): Transaction[] {
  if (cache === null) {
    cache = [...loadTransactions()].sort(byNewestFirst);
  }

  return cache;
}

function write(next: Transaction[]) {
  cache = next;
  saveTransactions(next);

  for (const listener of listeners) {
    listener();
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): Transaction[] {
  return read();
}

export function getServerSnapshot(): Transaction[] {
  return EMPTY;
}

export function addTransaction(transaction: Transaction) {
  write([transaction, ...read()]);
}

export function removeTransaction(id: string) {
  write(read().filter((transaction) => transaction.id !== id));
}
