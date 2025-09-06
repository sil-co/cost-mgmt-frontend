
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  categoryId: string;
  note?: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM
  amount: number; // monthly budget for that category
};

export type SortKey = "date" | "category" | "note" | "amount";
export type SortOrder = "asc" | "desc";

export interface TableProps {
  txns: Transaction[];
  categoryMap: Record<string, { name: string; color: string }>;
  currency: string;
  formatCurrency: (amount: number, currency: string) => string;
  handleDelete: (id: string) => void;
  Badge: React.FC<{ color: string; children: React.ReactNode }>;
  Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}

export interface CategoryProps {
  handleAdd: (form: { name: string, color: string }) => Promise<void>;
  categories: Category[]
}
