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
  const layout = getDataGridTableLayout(
    p.columns,
    Boolean(p.rowActions),
    Boolean(p.selection),
  );

  return (
    <div className="min-h-0 flex-auto overflow-auto" role="region">
      <div
        role="table"
        aria-busy={p.loading || undefined}
        className="w-full text-sm"
        style={{ minWidth: p.minTableWidth }}
      >
        <DataGridHeader
          columns={layout.columns}
          gridTemplateColumns={layout.gridTemplateColumns}
          sort={p.sort}
          hasRowActions={Boolean(p.rowActions)}
          rowActionsLeftEdge={layout.rowActionsLeftEdge}
          {...(p.selection ? { selection: p.selection } : {})}
          {...(p.onSortChange ? { onSortChange: p.onSortChange } : {})}
          {...(layout.rowActionsRightOffset
            ? { rowActionsRightOffset: layout.rowActionsRightOffset }
            : {})}
        />
        <DataGridBody
          {...p}
          columns={layout.columns}
          gridTemplateColumns={layout.gridTemplateColumns}
          rowActionsLeftEdge={layout.rowActionsLeftEdge}
          {...(layout.rowActionsRightOffset
            ? { rowActionsRightOffset: layout.rowActionsRightOffset }
            : {})}
        />
      </div>
    </div>
  );
}
