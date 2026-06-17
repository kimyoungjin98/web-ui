import type * as React from "react";
import type { DataGridColumn, DataGridSelection, DataGridSort } from "../types";
import { DataGridBody } from "./body";
import { DataGridHeader } from "./header";
import { getDataGridTableLayout } from "./layout";

type Props<T> = {
  columns: DataGridColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  loading: boolean;
  emptyMessage: string;
  pageSize: number;
  selection?: DataGridSelection<T>;
  sort: DataGridSort;
  tableColumnCount: number;
  minTableWidth: string;
  onSortChange?: (sort: DataGridSort) => void;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => React.ReactNode;
};

export function DataGridTable<T>(p: Props<T>) {
  const layout = getDataGridTableLayout(p.columns, Boolean(p.rowActions));

  return (
    <div className="min-h-0 flex-auto overflow-auto">
      <table
        className="w-full border-collapse text-sm"
        style={{ minWidth: p.minTableWidth }}
      >
        <DataGridHeader
          columns={layout.columns}
          selection={p.selection}
          sort={p.sort}
          onSortChange={p.onSortChange}
          hasRowActions={Boolean(p.rowActions)}
          rowActionsRightOffset={layout.rowActionsRightOffset}
          rowActionsLeftEdge={layout.rowActionsLeftEdge}
        />
        <DataGridBody
          {...p}
          columns={layout.columns}
          rowActionsRightOffset={layout.rowActionsRightOffset}
          rowActionsLeftEdge={layout.rowActionsLeftEdge}
        />
      </table>
    </div>
  );
}
