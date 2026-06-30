import type * as React from "react";
import { cn } from "../../lib/tailwind-util";
import type { DataGridSelection } from "../types";
import type { DataGridTableColumn } from "./layout";
import { DataGridRow } from "./row";

type Props<T> = {
  columns: DataGridTableColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  loading: boolean;
  emptyMessage: string;
  pageSize: number;
  selection?: DataGridSelection<T>;
  tableColumnCount: number;
  rowActionsRightOffset?: string;
  rowActionsLeftEdge: boolean;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => React.ReactNode;
};

export function DataGridBody<T>(p: Props<T>) {
  const count = p.tableColumnCount;
  if (p.loading) return <tbody>{Array.from({ length: Math.min(p.pageSize, 5) }).map((_, i) => <SkeletonRow key={i} columns={p.columns} hasSelection={Boolean(p.selection)} hasRowActions={Boolean(p.rowActions)} rowActionsRightOffset={p.rowActionsRightOffset} rowActionsLeftEdge={p.rowActionsLeftEdge} />)}</tbody>;
  if (!p.rows.length) return <tbody><EmptyRow count={count} message={p.emptyMessage} /></tbody>;
  return <tbody>{p.rows.map((r, i) => (
    <DataGridRow
      key={p.getRowId(r, i)}
      row={r}
      index={i}
      columns={p.columns}
      selection={p.selection}
      onRowClick={p.onRowClick}
      rowClassName={p.rowClassName}
      rowActions={p.rowActions}
      rowActionsRightOffset={p.rowActionsRightOffset}
      rowActionsLeftEdge={p.rowActionsLeftEdge}
    />
  ))}</tbody>;
}

function SkeletonRow<T>({
  columns,
  hasSelection,
  hasRowActions,
  rowActionsRightOffset,
  rowActionsLeftEdge,
}: {
  columns: DataGridTableColumn<T>[];
  hasSelection: boolean;
  hasRowActions: boolean;
  rowActionsRightOffset?: string;
  rowActionsLeftEdge: boolean;
}) {
  return <tr className="border-b border-border last:border-0">{hasSelection ? <SkeletonCell /> : null}{columns.map((item) => <SkeletonCell key={item.column.id} item={item} />)}{hasRowActions ? <SkeletonCell width="64px" rightOffset={rowActionsRightOffset} leftEdge={rowActionsLeftEdge} /> : null}</tr>;
}

function EmptyRow({ count, message }: { count: number; message: string }) {
  return <tr><td colSpan={count} className="px-4 py-12 text-center text-sm font-semibold text-muted-foreground">{message}</td></tr>;
}

function SkeletonCell<T>({
  item,
  width,
  rightOffset,
  leftEdge,
}: {
  item?: DataGridTableColumn<T>;
  width?: string;
  rightOffset?: string;
  leftEdge?: boolean;
}) {
  const fixedRightOffset = item?.fixedRightOffset ?? rightOffset;
  const fixedLeftEdge = item?.fixedLeftEdge ?? leftEdge;

  return (
    <td
      style={{
        ...(item?.style ?? { width, minWidth: width }),
        right: fixedRightOffset,
      }}
      className={cn(
        "p-4",
        fixedRightOffset && "sticky z-10 bg-card",
        fixedLeftEdge && "shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.75)]",
      )}
    >
      <span className="sr-only">로딩 중</span>
      <div aria-hidden="true" className="h-4 w-full rounded bg-muted" />
    </td>
  );
}
