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
  props,
  model,
}: {
  props: DataGridProps<T>;
  model: Model;
}) {
  const showToolbar = props.showToolbar ?? props.toolbar ?? true;
  const showPagination = props.pagination ?? true;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-card",
        props.className,
      )}
    >
      {showToolbar ? (
        <DataGridToolbar
          search={props.search ?? ""}
          searchable={props.searchable ?? true}
          selectedCount={props.selection?.selectedIds.length ?? 0}
          pageSize={props.pageSize}
          pageSizeOptions={props.pageSizeOptions ?? [10, 20, 50]}
          excelDownload={model.excelDownload}
          onSearchChange={props.onSearchChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      ) : null}
      <DataGridTable
        columns={props.columns}
        rows={props.rows}
        getRowId={props.getRowId}
        loading={props.loading ?? false}
        emptyMessage={props.emptyMessage ?? "표시할 데이터가 없습니다."}
        pageSize={props.pageSize}
        selection={props.selection}
        sort={props.sort}
        tableColumnCount={model.tableColumnCount}
        minTableWidth={props.minTableWidth ?? "760px"}
        onSortChange={props.onSortChange}
        onRowClick={props.onRowClick}
        rowClassName={props.rowClassName}
        rowActions={props.rowActions}
      />
      {showPagination ? (
        <DataGridPagination
          firstItem={model.firstItem}
          lastItem={model.lastItem}
          total={props.total}
          page={props.page}
          pageCount={model.pageCount}
          onPageChange={props.onPageChange}
        />
      ) : null}
    </div>
  );
}
