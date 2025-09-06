import type { Category, Budget, Transaction } from "../types/types";
import { toLocalYMD } from "../utility/utility";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = {
  async login(username: string, password: string): Promise<{ token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
  async validate(authToken: string): Promise<{ valid: boolean, userId: number }> {
    const res = await fetch(`${BASE_URL}/auth/validate`, {
      method: "GET",
      headers: authToken ? { "X-Auth-Token": authToken } : {},
    });
    if (!res.ok) throw new Error("auth token expired");
    return res.json();
  },
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
  async getBudgets(authToken: string, month: string): Promise<Budget[]> {
    console.log({authToken})
    if (authToken == "") { throw new Error("No auth token: you need to sign"); };
    const res = await fetch(`${BASE_URL}/budgets?month=${month}`, {
      headers: authToken ? { "X-Auth-Token": authToken } : {},
    });
    if (!res.ok) throw new Error("Failed to fetch budgets");
    return res.json();
  },
  async upsertBudget(authToken: string, input: Partial<Budget> & { categoryId: string; month: string }): Promise<Budget> {
    const res = await fetch(`${BASE_URL}/budgets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "X-Auth-Token": authToken } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to save budget");
    return res.json();
  },
  async getTransactions(authToken: string, fromISO: string, toISO: string): Promise<Transaction[]> {
    if (authToken == "") { throw new Error("No auth token: you need to sign"); };
    // const fromDate = fromISO.split("T")[0];
    // const toDate = toISO.split("T")[0];
    const fromDate = toLocalYMD(fromISO);
    const toDate = toLocalYMD(toISO);
    const res = await fetch(`${BASE_URL}/transactions?from=${fromDate}&to=${toDate}`, {
      headers: authToken ? { "X-Auth-Token": authToken } : {},
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },
  async createTransaction(authToken: string, input: Omit<Transaction, "id">): Promise<Transaction> {
    if (authToken == "") { throw new Error("No auth token: you need to sign"); };
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "X-Auth-Token": authToken } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },
  async deleteTransaction(authToken: string, id: string): Promise<void> {
    if (authToken == "") { throw new Error("No auth token: you need to sign"); };
    const res = await fetch(`${BASE_URL}/transactions/${id}`, { 
      method: "DELETE",
      headers: authToken ? { "X-Auth-Token": authToken } : {},
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
    // return res.json();
    // If void, no need to call res.json()
  },
};
