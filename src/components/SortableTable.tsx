import { useState, useMemo } from "react";
import type { TableProps, SortKey, SortOrder } from "../types/types";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    padding: 10px 8px;
    border-bottom: 1px solid ${(p) => p.theme.border};
    text-align: left;
  }

  th {
    cursor: pointer;
    user-select: none;
  }

  tbody tr:hover {
    background: ${(p) => p.theme.panelSoft};
  }
`;

const SortableTable: React.FC<TableProps> = ({
    txns,
    categoryMap,
    currency,
    formatCurrency,
    handleDelete,
    Badge,
    Button,
}) => {
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const sortedTxns = useMemo(() => {
        const sorted = [...txns].sort((a, b) => {
            let aVal: string | number = "";
            let bVal: string | number = "";

            switch (sortKey) {
                case "date":
                    aVal = new Date(a.date).getTime();
                    bVal = new Date(b.date).getTime();
                    break;
                case "category":
                    aVal = categoryMap[a.categoryId]?.name || "";
                    bVal = categoryMap[b.categoryId]?.name || "";
                    break;
                case "note":
                    aVal = a.note || "";
                    bVal = b.note || "";
                    break;
                case "amount":
                    aVal = a.amount;
                    bVal = b.amount;
                    break;
            }

            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [txns, sortKey, sortOrder, categoryMap]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const renderSortIndicator = (key: SortKey) =>
        sortKey === key ? (sortOrder === "asc" ? " ▲" : " ▼") : "";

    return (
        <Table>
            <thead>
                <tr>
                    <th style={{ width: 120 }} onClick={() => handleSort("date")}>
                        Date{renderSortIndicator("date")}
                    </th>
                    <th onClick={() => handleSort("category")}>
                        Category{renderSortIndicator("category")}
                    </th>
                    <th onClick={() => handleSort("note")}>
                        Note{renderSortIndicator("note")}
                    </th>
                    <th
                        style={{ textAlign: "right", width: 140 }}
                        onClick={() => handleSort("amount")}
                    >
                        Amount{renderSortIndicator("amount")}
                    </th>
                    <th style={{ width: 60 }}></th>
                </tr>
            </thead>
            <tbody>
                {sortedTxns.map((t) => (
                    <tr key={t.id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>
                            <Badge color={categoryMap[t.categoryId]?.color}>
                                {categoryMap[t.categoryId]?.name || "Unknown"}
                            </Badge>
                        </td>
                        <td>{t.note || ""}</td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                            {formatCurrency(t.amount, currency)}
                        </td>
                        <td>
                            <Button onClick={() => handleDelete(t.id)}>🗑️</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default SortableTable;
