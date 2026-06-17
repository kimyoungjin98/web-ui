"use client";

import { cn } from "../lib/tailwind-util";
import { getDataGridModel } from "./model";
import { DataGridPagination } from "./pagination";
import type { DataGridProps } from "./props";
import { DataGridTable } from "./table/table";
import { DataGridToolbar } from "./toolbar/toolbar";

type Model = ReturnType<typeof getDataGridModel>;

export function DataGrid<T>(props: DataGridProps<T>) {
  return <DataGridView props={props} model={getDataGridModel(props)} />;
}

function DataGridView<T>({
  props: p,
  model: m,
}: {
  props: DataGridProps<T>;
  model: Model;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-card",
        p.className,
      )}
    >
      <DataGridToolbar
        search={p.search ?? ""}
        searchable={p.searchable ?? true}
        selectedCount={p.selection?.selectedIds.length ?? 0}
        pageSize={p.pageSize}
        pageSizeOptions={p.pageSizeOptions ?? [10, 20, 50]}
        excelDownload={m.excelDownload}
        onSearchChange={p.onSearchChange}
        onPageSizeChange={p.onPageSizeChange}
      />
      <DataGridTable
        columns={p.columns}
        rows={p.rows}
        getRowId={p.getRowId}
        loading={p.loading ?? false}
        emptyMessage={p.emptyMessage ?? "표시할 데이터가 없습니다."}
        pageSize={p.pageSize}
        selection={p.selection}
        sort={p.sort}
        tableColumnCount={m.tableColumnCount}
        minTableWidth={p.minTableWidth ?? "760px"}
        onSortChange={p.onSortChange}
        onRowClick={p.onRowClick}
        rowActions={p.rowActions}
      />
      <DataGridPagination
        firstItem={m.firstItem}
        lastItem={m.lastItem}
        total={p.total}
        page={p.page}
        pageCount={m.pageCount}
        onPageChange={p.onPageChange}
      />
    </div>
  );
}
