export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  createdAt: string;
}

export type TransactionDraft = Omit<Transaction, "id" | "createdAt">;
