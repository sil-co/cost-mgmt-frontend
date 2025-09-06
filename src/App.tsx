// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import React, { useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import type { DefaultTheme } from 'styled-components/dist/types';
import { Login } from './components/Login';
import type { Category, Budget, Transaction } from './types/types';
import { api } from './api/api';
import { startOfMonthISO, endOfMonthISO, formatCurrency, yyyyMM } from './utility/utility';
import SortableTable from './components/SortableTable';

/**
 * Cost Management App (Single-file)
 * Tech: React + TypeScript + styled-components
 *
 * How to use:
 * - Update the BASE_URL and endpoints in `api` to match your backend.
 * - Ensure CORS is allowed on your API.
 */

// ------------------------------
// THEME & GLOBAL STYLES
// ------------------------------
const theme: DefaultTheme = {
  bg: "#0f1222",
  panel: "#171a2e",
  panelSoft: "#1d2140",
  text: "#eaeaf2",
  textDim: "#b3b6d4",
  primary: "#7c7cff",
  primaryAccent: "#a3a3ff",
  danger: "#ff6b6b",
  success: "#39d98a",
  warning: "#ffc861",
  border: "#2a2e4a",
  shadow: "rgba(0,0,0,0.35)",
};

const Global = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    background: ${theme.bg}; color: ${theme.text};
  }
  input, select, button, textarea { font-family: inherit; font-size: 14px; }
`;

// ------------------------------
// LAYOUT STYLES
// ------------------------------
const Shell = styled.div`
  display: grid; grid-template-rows: auto 1fr; min-height: 100vh;
`;

const Header = styled.header`
  position: sticky; top: 0; z-index: 10;
  background: ${p => p.theme.panel};
  border-bottom: 1px solid ${p => p.theme.border};
  box-shadow: 0 10px 30px ${p => p.theme.shadow};
`;

const HeaderInner = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 14px 18px;
  display: flex; gap: 14px; align-items: center; justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 18px; margin: 0; font-weight: 700; letter-spacing: 0.4px;
`;

const RightItem = styled.div`
  display: flex;

`;

const MonthPickerWrap = styled.div`
  display: flex; gap: 8px; align-items: center;
`;

const MonthInput = styled.input`
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
  padding: 8px 10px; border-radius: 10px; border: 1px solid ${p => p.theme.border};
`;

const Container = styled.main`
  max-width: 1100px; margin: 18px auto; padding: 0 18px 80px; width: 100%;
`;

const Grid = styled.div`
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 16px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const Card = styled.section`
  background: ${p => p.theme.panel}; border: 1px solid ${p => p.theme.border};
  border-radius: 16px; box-shadow: 0 10px 30px ${p => p.theme.shadow};
  margin-bottom: 18px;
`;

const CardHeader = styled.div`
  padding: 14px 16px; border-bottom: 1px solid ${p => p.theme.border};
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`;

const CardTitle = styled.h2`
  font-size: 14px; margin: 0; color: ${p => p.theme.textDim}; font-weight: 600; text-transform: uppercase; letter-spacing: .6px;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const Row = styled.div`
  display: grid; grid-template-columns: repeat(12, 1fr); gap: 10px; align-items: center;
`;

const Button = styled.button<{ variant?: "primary" | "ghost" | "danger" }>`
  padding: 10px 12px; border-radius: 12px; border: 1px solid transparent; cursor: pointer;
  background: ${p => (p.variant === "primary" ? p.theme.primary : p.variant === "danger" ? p.theme.danger : p.theme.panelSoft)};
  color: ${p => (p.variant ? "#0c0c17" : p.theme.text)};
  border-color: ${p => (p.variant ? "transparent" : p.theme.border)};
  font-weight: 600; letter-spacing: .2px;
  transition: transform .04s ease, filter .2s ease;
  &:active { transform: translateY(1px); }
  &:hover { filter: brightness(1.05); }
`;

const Input = styled.input`
  width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid ${p => p.theme.border};
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
`;

const Select = styled.select`
  width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid ${p => p.theme.border};
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
`;

const Text = styled.p`
  margin: 0; color: ${p => p.theme.textDim}; font-size: 13px;
`;

const StatGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Stat = styled.div`
  background: ${p => p.theme.panelSoft}; border: 1px solid ${p => p.theme.border};
  border-radius: 12px; padding: 12px; display: grid; gap: 6px;
`;

const ProgressWrap = styled.div`
  height: 8px; background: #0b0d1a; border: 1px solid ${p => p.theme.border}; border-radius: 999px; overflow: hidden;
`;

const ProgressBar = styled.div<{ ratio: number; color?: string }>`
  width: ${p => Math.min(100, Math.max(0, p.ratio * 100)).toFixed(1)}%;
  height: 100%; background: ${p => p.color || p.theme.primary}; transition: width .4s ease;
`;

const Badge = styled.span<{ color?: string }>`
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px;
  background: ${p => p.color ? p.color + "22" : p.theme.panelSoft};
  border: 1px solid ${p => p.theme.border}; color: ${p => p.theme.text}; font-weight: 600; font-size: 12px;
`;

// const Table = styled.table`
//   width: 100%; border-collapse: collapse; font-size: 14px;
//   th, td { padding: 10px 8px; border-bottom: 1px solid ${p => p.theme.border}; text-align: left; }
//   tbody tr:hover { background: ${p => p.theme.panelSoft}; }
// `;

const EmptyState = styled.div`
  text-align: center; padding: 20px; color: ${p => p.theme.textDim};
`;

// ------------------------------
// MAIN APP
// ------------------------------
const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
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

  // form state
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
  const budgetByCategory = useMemo(() => Object.fromEntries(budgets.map(b => [b.categoryId, b])), [budgets]);

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
        const [cats, bs] = await Promise.all([
          api.getCategories(),
          api.getBudgets(authToken, month),
        ]);
        if (!mounted) return;
        setCategories(cats);
        setBudgets(bs);
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

  async function handleBudgetSave(categoryId: string, amount: number) {
    try {
      setLoading(true); setError(null);
      const saved = await api.upsertBudget(authToken, { categoryId, month, amount });
      setBudgets(prev => {
        const idx = prev.findIndex(b => b.categoryId === categoryId && b.month === month);
        if (idx >= 0) { const clone = [...prev]; clone[idx] = saved; return clone; }
        return [saved, ...prev];
      });
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
      <Shell>
        <Header>
          <HeaderInner>
            <Title>💸 Cost Manager</Title>
            <RightItem>
              <MonthPickerWrap>
                <Text>Month</Text>
                <MonthInput
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </MonthPickerWrap>
              {!loggedIn ? (
                <Login handleLogin={handleLogin} />
              ) : (
                <></>
              )}
            </RightItem>
          </HeaderInner>
        </Header>

        <Container>
          {error && (
            <Card style={{ borderColor: theme.danger }}>
              <CardBody>
                <Text style={{ color: theme.danger }}>Error: {error}</Text>
              </CardBody>
            </Card>
          )}

          <Grid>
            {/* LEFT: TRANSACTIONS */}
            <Card>
              <CardHeader>
                <CardTitle>New Expense</CardTitle>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleAdd}>
                  <Row style={{ marginBottom: 10 }}>
                    <div style={{ gridColumn: "span 3" }}>
                      <Text>Date</Text>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ gridColumn: "span 3" }}>
                      <Text>Amount</Text>
                      <Input
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
                      <Text>Category</Text>
                      <Select
                        value={form.categoryId || categories[0]?.id || ""}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div style={{ gridColumn: "span 3" }}>
                      <Text>Note</Text>
                      <Input
                        placeholder="Optional note"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                      />
                    </div>
                  </Row>
                  <Row>
                    <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end" }}>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Saving..." : "Add Expense"}
                      </Button>
                    </div>
                  </Row>
                </form>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardBody>
                <StatGrid>
                  <Stat>
                    <Text>Total Spent</Text>
                    <strong style={{ fontSize: 22 }}>{formatCurrency(totals.total, currency)}</strong>
                  </Stat>
                  <Stat>
                    <Text>Top Category</Text>
                    <div>
                      {topCategoryId ? (
                        <Badge color={categoryMap[topCategoryId]?.color}>
                          {categoryMap[topCategoryId]?.name || "Unknown"}
                        </Badge>
                      ) : (
                        <Text>—</Text>
                      )}
                    </div>
                  </Stat>
                  <Stat>
                    <Text>Transactions</Text>
                    <strong style={{ fontSize: 22 }}>{txns.length}</strong>
                  </Stat>
                </StatGrid>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardBody>
                {txns.length === 0 ? (
                  <EmptyState>No transactions this month.</EmptyState>
                ) : (
                  // <Table>
                  //   <thead>
                  //     <tr>
                  //       <th style={{ width: 120 }}>Date</th>
                  //       <th>Category</th>
                  //       <th>Note</th>
                  //       <th style={{ textAlign: "right", width: 140 }}>Amount</th>
                  //       <th style={{ width: 60 }}></th>
                  //     </tr>
                  //   </thead>
                  //   <tbody>
                  //     {txns
                  //       .slice()
                  //       .sort((a, b) => (a.date < b.date ? 1 : -1))
                  //       .map((t) => {
                  //         return (
                  //           <tr key={t.id}>
                  //             <td>{new Date(t.date).toLocaleDateString()}</td>
                  //             <td>
                  //               <Badge color={categoryMap[t.categoryId]?.color}>
                  //                 {categoryMap[t.categoryId]?.name || "Unknown"}
                  //               </Badge>
                  //             </td>
                  //             <td>{t.note || ""}</td>
                  //             <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrency(t.amount, currency)}</td>
                  //             <td>
                  //               <Button variant="ghost" onClick={() => handleDelete(t.id)}>🗑️</Button>
                  //             </td>
                  //           </tr>
                  //         )
                  //       })}
                  //   </tbody>
                  // </Table>
                  <SortableTable txns={txns} categoryMap={categoryMap} currency={currency} formatCurrency={formatCurrency} handleDelete={handleDelete} Badge={Badge} Button={Button} />
                )}
              </CardBody>
            </Card>

            {/* RIGHT: BUDGETS */}
            <Card>
              <CardHeader>
                <CardTitle>Budgets ({month})</CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: 12 }}>
                  {categories.length === 0 && <Text>No categories.</Text>}
                  {categories.map((c) => {
                    const spent = totals.byCategory.get(c.id) || 0;
                    const budget = budgetByCategory[c.id]?.amount || 0;
                    const ratio = budget > 0 ? spent / budget : 0;
                    return (
                      <div key={c.id} style={{ background: theme.panelSoft, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Badge color={c.color}>{c.name}</Badge>
                            <Text>
                              {formatCurrency(spent, currency)} / {formatCurrency(budget, currency)}
                            </Text>
                          </div>
                          <BudgetInlineEditor
                            initial={budget}
                            onSave={(val) => handleBudgetSave(c.id, val)}
                            disabled={loading}
                          />
                        </div>
                        <ProgressWrap>
                          <ProgressBar ratio={ratio} color={ratio > 1 ? theme.danger : c.color || theme.primary} />
                        </ProgressWrap>
                        {ratio > 1 && (
                          <Text style={{ color: theme.warning, marginTop: 6 }}>⚠️ Over budget by {formatCurrency(spent - budget, currency)}</Text>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </Grid>
        </Container>
      </Shell>
    </ThemeProvider>
  );
};

export default App;

// ------------------------------
// INLINE BUDGET EDITOR COMPONENT
// ------------------------------
const BudgetInlineWrap = styled.div`
  display: inline-flex; gap: 8px; align-items: center;
`;

const BudgetInput = styled(Input)`
  width: 110px;
`;

const BudgetInlineEditor: React.FC<{ initial: number; onSave: (val: number) => void; disabled?: boolean }> = ({ initial, onSave, disabled }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(initial ?? 0));

  useEffect(() => { setVal(String(initial ?? 0)); }, [initial]);

  if (!editing) {
    return (
      <BudgetInlineWrap>
        <Button onClick={() => setEditing(true)} disabled={disabled}>Edit Budget</Button>
      </BudgetInlineWrap>
    );
  }
  return (
    <BudgetInlineWrap>
      <BudgetInput type="number" inputMode="numeric" value={val} onChange={e => setVal(e.target.value)} />
      <Button
        variant="primary"
        onClick={() => { onSave(Number(val || 0)); setEditing(false); }}
        disabled={disabled}
      >Save</Button>
      <Button onClick={() => { setVal(String(initial ?? 0)); setEditing(false); }} disabled={disabled}>Cancel</Button>
    </BudgetInlineWrap>
  );
};
