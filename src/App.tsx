// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { Login } from './components/Login';
import type { Category, Transaction } from './types/types';
import { api } from './api/api';
import { startOfMonthISO, endOfMonthISO, formatCurrency, yyyyMM } from './utility/utility';
import SortableTable from './components/SortableTable';
import CategoryManager from './components/CategoryManager';
import * as SC from './components/StyledComponents';
import BudgetInlineEditor from './components/BudgetInlineEditor';
import { theme } from './theme';

const Global = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    background: ${theme.bg}; color: ${theme.text};
  }
  input, select, button, textarea { font-family: inherit; font-size: 14px; }
`;

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem("authToken") ?? "";
  });

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return yyyyMM(now);
  });

  const [form, setForm] = useState<{ date: string; amount: string; categoryId: string; note: string }>({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    categoryId: "",
    note: "",
  });

  const monthDate = useMemo(() => new Date(month + "-01T00:00:00"), [month]);
  const fromISO = useMemo(() => startOfMonthISO(monthDate), [monthDate]);
  const toISO = useMemo(() => endOfMonthISO(monthDate), [monthDate]);

  // derived maps
  const categoryMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);

  const totals = useMemo(() => {
    const byCategory = new Map<string, number>();
    let total = 0;
    for (const t of txns) {
      total += t.amount;
      byCategory.set(t.categoryId, (byCategory.get(t.categoryId) || 0) + t.amount);
    }
    return { total, byCategory };
  }, [txns]);

  const topCategoryId = useMemo(() => {
    let top: string | null = null; let topVal = -Infinity;
    totals.byCategory.forEach((v, k) => { if (v > topVal) { topVal = v; top = k; } });
    return top;
  }, [totals]);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const valid = await api.validate(authToken);
        console.log({ valid });
        if (valid.valid) {
          setLoggedIn(true);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to validate");
      } finally {
        setLoading(false);
      }
    })()
  }, [authToken]);

  // load initial
  useEffect(() => {
    if (!loggedIn) { return; }
    let mounted = true;
    (async () => {
      setLoading(true); setError(null);
      try {
        const [cats] = await Promise.all([
          api.getCategories(authToken),
          // api.getBudgets(authToken, month),
        ]);
        if (!mounted) return;
        setCategories(cats);
        // setBudgets(bs);
      } catch (e: any) {
        setError(e?.message || "Failed to load");
        // setError("Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [month, loggedIn]);

  // load txns per month
  useEffect(() => {
    if (!loggedIn) { return; }
    let mounted = true;
    (async () => {
      setLoading(true); setError(null);
      try {
        const list = await api.getTransactions(authToken, fromISO, toISO);
        if (!mounted) return;
        setTxns(list);
      } catch (e: any) {
        setError(e?.message || "Failed to load transactions");
        // setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [fromISO, toISO, loggedIn]);


  async function handleLogin(name: string, password: string) {
    try {
      setLoading(true); setError(null);
      const { token } = await api.login(name, password);
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setLoggedIn(true);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(name: string, password: string) {
    try {
      setLoading(true); setError(null);
      const { token } = await api.signUp(name, password);
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setLoggedIn(true);
    } catch (e: any) {
      setError(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory(form: { name: string, color: string }) {
    try {
      setError(null); setLoading(true);
      await api.createCategory(authToken, form);
      const list = await api.getCategories(authToken);
      setCategories(list);
    } catch (e: any) {
      setError(e?.message || "Failed to add transaction");
      // setError("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null); setLoading(true);
      const payload: Omit<Transaction, "id"> = {
        date: form.date,
        amount: Number(form.amount || 0),
        categoryId: form.categoryId || categories[0]?.id,
        note: form.note?.trim() || undefined,
      };
      // const created = await api.createTransaction(payload);
      // setTxns(prev => [created, ...prev]);
      await api.createTransaction(authToken, payload);
      const list = await api.getTransactions(authToken, fromISO, toISO);
      setTxns(list);
      setForm(f => ({ ...f, amount: "", note: "" }));
    } catch (e: any) {
      setError(e?.message || "Failed to add transaction");
      // setError("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this transaction?")) return;
    try {
      setLoading(true); setError(null);
      await api.deleteTransaction(authToken, id);
      setTxns(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
      // setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  async function handleBudgetSave(categoryId: string, budget: number) {
    try {
      setLoading(true); setError(null);
      await api.upsertCategoryBudget(authToken, { categoryId, budget });
      // setBudgets(prev => {
      //   const idx = prev.findIndex(b => b.categoryId === categoryId && b.month === month);
      //   if (idx >= 0) { const clone = [...prev]; clone[idx] = saved; return clone; }
      //   return [saved, ...prev];
      // });
      const list = await api.getCategories(authToken);
      setCategories(list);
    } catch (e: any) {
      // setError(e?.message || "Failed to save budget");
      setError("Failed to save budget");
    } finally {
      setLoading(false);
    }
  }

  const currency = "JPY"; // change to your currency code

  return (
    <ThemeProvider theme={theme}>
      <Global />
      <SC.Shell>
        <SC.Header>
          <SC.HeaderInner>
            <SC.Title>💸 Cost Manager</SC.Title>
            <SC.RightItem>
              <SC.MonthPickerWrap>
                <SC.Text>Month</SC.Text>
                <SC.MonthInput
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </SC.MonthPickerWrap>
              {!loggedIn ? (
                <Login handleLogin={handleLogin} handleSignUp={handleSignUp} />
              ) : (
                <></>
              )}
            </SC.RightItem>
          </SC.HeaderInner>
        </SC.Header>

        <SC.Container>
          {error && (
            <SC.Card style={{ borderColor: theme.danger }}>
              <SC.CardBody>
                <SC.Text style={{ color: theme.danger }}>Error: {error}</SC.Text>
              </SC.CardBody>
            </SC.Card>
          )}

          <SC.Card>
            <SC.CardHeader>
              <SC.CardTitle>Monthly Overview</SC.CardTitle>
            </SC.CardHeader>
            <SC.CardBody>
              <SC.StatGrid>
                <SC.Stat>
                  <SC.Text>Total Spent</SC.Text>
                  <strong style={{ fontSize: 22 }}>{formatCurrency(totals.total, currency)}</strong>
                </SC.Stat>
                <SC.Stat>
                  <SC.Text>Top Category</SC.Text>
                  <div>
                    {topCategoryId ? (
                      <SC.Badge color={categoryMap[topCategoryId]?.color}>
                        {categoryMap[topCategoryId]?.name || "Unknown"}
                      </SC.Badge>
                    ) : (
                      <SC.Text>—</SC.Text>
                    )}
                  </div>
                </SC.Stat>
                <SC.Stat>
                  <SC.Text>Transactions</SC.Text>
                  <strong style={{ fontSize: 22 }}>{txns.length}</strong>
                </SC.Stat>
              </SC.StatGrid>
            </SC.CardBody>
          </SC.Card>

          <SC.Grid>
            {/* LEFT: TRANSACTIONS */}
            <SC.Card>
              <SC.CardHeader>
                <SC.CardTitle>New Expense</SC.CardTitle>
              </SC.CardHeader>
              <SC.CardBody>
                <form onSubmit={handleAdd}>
                  <SC.Row style={{ marginBottom: 10 }}>
                    <div style={{ gridColumn: "span 3" }}>
                      <SC.Text>Date</SC.Text>
                      <SC.Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ gridColumn: "span 3" }}>
                      <SC.Text>Amount</SC.Text>
                      <SC.Input
                        type="number"
                        step="1"
                        inputMode="numeric"
                        placeholder="0"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ gridColumn: "span 3" }}>
                      <SC.Text>Category</SC.Text>
                      <SC.Select
                        value={form.categoryId || categories[0]?.id || ""}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </SC.Select>
                    </div>
                    <div style={{ gridColumn: "span 3" }}>
                      <SC.Text>Note</SC.Text>
                      <SC.Input
                        placeholder="Optional note"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                      />
                    </div>
                  </SC.Row>
                  <SC.Row>
                    <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end" }}>
                      <SC.Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Saving..." : "Add Expense"}
                      </SC.Button>
                    </div>
                  </SC.Row>
                </form>
              </SC.CardBody>
            </SC.Card>

            <CategoryManager
              handleAdd={handleAddCategory}
            />

            {/* RIGHT: BUDGETS */}
            <SC.Card>
              <SC.CardHeader>
                <SC.CardTitle>Budgets ({month})</SC.CardTitle>
              </SC.CardHeader>
              <SC.CardBody>
                <div style={{ display: "grid", gap: 12 }}>
                  {categories.length === 0 && <SC.Text>No categories.</SC.Text>}
                  {categories.map((c) => {
                    const spent = totals.byCategory.get(c.id) || 0;
                    // const budget = budgetByCategory[c.id]?.amount || 0;
                    const ratio = c.budget > 0 ? spent / c.budget : 0;
                    return (
                      <div key={c.id} style={{ background: theme.panelSoft, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <SC.Badge color={c.color}>{c.name}</SC.Badge>
                            <SC.Text>
                              {formatCurrency(spent, currency)} / {formatCurrency(c.budget, currency)}
                            </SC.Text>
                          </div>
                          <BudgetInlineEditor
                            initial={c.budget}
                            onSave={(val) => handleBudgetSave(c.id, val)}
                            disabled={loading}
                          />
                        </div>
                        <SC.ProgressWrap>
                          <SC.ProgressBar ratio={ratio} color={ratio > 1 ? theme.danger : c.color || theme.primary} />
                        </SC.ProgressWrap>
                        {ratio > 1 && (
                          <SC.Text style={{ color: theme.warning, marginTop: 6 }}>⚠️ Over budget by {formatCurrency(spent - c.budget, currency)}</SC.Text>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SC.CardBody>
            </SC.Card>

            <SC.Card>
              <SC.CardHeader>
                <SC.CardTitle>Transactions</SC.CardTitle>
              </SC.CardHeader>
              <SC.CardBody>
                {txns.length === 0 ? (
                  <SC.EmptyState>No transactions this month.</SC.EmptyState>
                ) : (
                  <SortableTable txns={txns} categoryMap={categoryMap} currency={currency} formatCurrency={formatCurrency} handleDelete={handleDelete} Badge={SC.Badge} Button={SC.Button} />
                )}
              </SC.CardBody>
            </SC.Card>

          </SC.Grid>
        </SC.Container>
      </SC.Shell>
    </ThemeProvider>
  );
}

export default App;
