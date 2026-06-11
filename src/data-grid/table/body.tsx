import type * as React from "react";
import type { DataGridColumn, DataGridSelection } from "../types";
import { DataGridRow } from "./row/row";

type Props<T> = {
  columns: DataGridColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  loading: boolean;
  emptyMessage: string;
  pageSize: number;
  selection?: DataGridSelection<T>;
  tableColumnCount: number;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
};

export function DataGridBody<T>(p: Props<T>) {
  const count = p.tableColumnCount;
  if (p.loading) return <tbody>{Array.from({ length: Math.min(p.pageSize, 5) }).map((_, i) => <SkeletonRow key={i} count={count} />)}</tbody>;
  if (!p.rows.length) return <tbody><EmptyRow count={count} message={p.emptyMessage} /></tbody>;
  return <tbody>{p.rows.map((r, i) => <DataGridRow key={p.getRowId(r, i)} row={r} index={i} columns={p.columns} selection={p.selection} onRowClick={p.onRowClick} rowActions={p.rowActions} />)}</tbody>;
}

function SkeletonRow({ count }: { count: number }) {
  return <tr className="border-b border-border last:border-0">{Array.from({ length: count }).map((_, i) => <td key={i} className="p-4"><span className="sr-only">로딩 중</span><div aria-hidden="true" className="h-4 w-full rounded bg-muted" /></td>)}</tr>;
}

function EmptyRow({ count, message }: { count: number; message: string }) {
  return <tr><td colSpan={count} className="px-4 py-12 text-center text-sm font-semibold text-muted-foreground">{message}</td></tr>;
}
