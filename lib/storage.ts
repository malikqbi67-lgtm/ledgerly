import type { Transaction } from "@/lib/types";

const STORAGE_KEY = "ledgerly.transactions.v1";

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.amount === "number" &&
    Number.isFinite(candidate.amount) &&
    (candidate.type === "income" || candidate.type === "expense") &&
    typeof candidate.category === "string" &&
    typeof candidate.createdAt === "string"
  );
}

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTransaction);
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // Storage may be unavailable (private mode, quota exceeded, etc.).
  }
}
