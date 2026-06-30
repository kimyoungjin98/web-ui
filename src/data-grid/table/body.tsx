import type * as React from "react";
import { cn } from "../../lib/tailwind-util";
import type { DataGridSelection } from "../types";
import type { DataGridTableColumn } from "./layout";
import { DataGridRow } from "./row";

type Props<T> = {
  columns: DataGridTableColumn<T>[];
  gridTemplateColumns: string;
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

  if (p.loading) {
    return (
      <div role="rowgroup">
        {Array.from({ length: Math.min(p.pageSize, 5) }).map((_, i) => (
          <SkeletonRow
            key={i}
            columns={p.columns}
            gridTemplateColumns={p.gridTemplateColumns}
            hasSelection={Boolean(p.selection)}
            hasRowActions={Boolean(p.rowActions)}
            rowActionsRightOffset={p.rowActionsRightOffset}
            rowActionsLeftEdge={p.rowActionsLeftEdge}
          />
        ))}
      </div>
    );
  }

  if (!p.rows.length) {
    return (
      <div role="rowgroup">
        <EmptyRow
          count={count}
          gridTemplateColumns={p.gridTemplateColumns}
          message={p.emptyMessage}
        />
      </div>
    );
  }

  return (
    <div role="rowgroup">
      {p.rows.map((r, i) => (
        <DataGridRow
          key={p.getRowId(r, i)}
          row={r}
          index={i}
          columns={p.columns}
          gridTemplateColumns={p.gridTemplateColumns}
          selection={p.selection}
          onRowClick={p.onRowClick}
          rowClassName={p.rowClassName}
          rowActions={p.rowActions}
          rowActionsRightOffset={p.rowActionsRightOffset}
          rowActionsLeftEdge={p.rowActionsLeftEdge}
        />
      ))}
    </div>
  );
}

function SkeletonRow<T>({
  columns,
  gridTemplateColumns,
  hasSelection,
  hasRowActions,
  rowActionsRightOffset,
  rowActionsLeftEdge,
}: {
  columns: DataGridTableColumn<T>[];
  gridTemplateColumns: string;
  hasSelection: boolean;
  hasRowActions: boolean;
  rowActionsRightOffset?: string;
  rowActionsLeftEdge: boolean;
}) {
  return (
    <div
      role="row"
      className="grid border-b border-border/50"
      style={{ gridTemplateColumns }}
    >
      {hasSelection ? <SkeletonCell /> : null}
      {columns.map((item) => (
        <SkeletonCell key={item.column.id} item={item} />
      ))}
      {hasRowActions ? (
        <SkeletonCell
          width="64px"
          rightOffset={rowActionsRightOffset}
          leftEdge={rowActionsLeftEdge}
        />
      ) : null}
    </div>
  );
}

function EmptyRow({
  count,
  gridTemplateColumns,
  message,
}: {
  count: number;
  gridTemplateColumns: string;
  message: string;
}) {
  return (
    <div role="row" className="grid" style={{ gridTemplateColumns }}>
      <div
        role="cell"
        aria-colspan={count}
        style={{ gridColumn: "1 / -1" }}
        className="px-4 py-12 text-center text-sm font-semibold text-muted-foreground"
      >
        {message}
      </div>
    </div>
  );
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
    <div
      role="cell"
      style={{
        ...(item?.style ?? { width, minWidth: width }),
        right: fixedRightOffset,
      }}
      className={cn(
        "flex min-h-16 items-center p-4",
        fixedRightOffset && "sticky z-10 bg-card",
        fixedLeftEdge &&
          "border-l border-border/70 shadow-[-18px_0_24px_-24px_rgba(15,23,42,0.45)]",
      )}
    >
      <span className="sr-only">로딩 중</span>
      <div aria-hidden="true" className="h-4 w-full rounded bg-muted" />
    </div>
  );
}
