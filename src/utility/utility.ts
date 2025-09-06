
export function startOfMonthISO(d: Date): string {
  const a = new Date(d.getFullYear(), d.getMonth(), 1);
  return a.toISOString();
}

export function endOfMonthISO(d: Date): string {
  const a = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  return a.toISOString();
}

export function formatCurrency(n: number, currency = "JPY"): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
}

export function yyyyMM(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function toLocalYMD(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
