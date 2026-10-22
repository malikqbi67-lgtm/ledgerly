export const CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Food",
  "Housing",
  "Transport",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
