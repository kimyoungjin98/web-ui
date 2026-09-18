"use client";

import { cn } from "../../libs/tailwind-util";
import { useUiSize } from "../../providers/ui-size-provider";
import { createDataGridColumns } from "./libs/json";
import { getDataGridModel } from "./model";
import { DataGridPagination } from "./pagination";
import type { DataGridProps, ResolvedDataGridProps } from "./props";
import { DataGridTable } from "./table/table";
import { getDataGridPageSizeOptions } from "./toolbar/page-size";
import { DataGridToolbar } from "./toolbar/toolbar";

type Model<T extends object> = ReturnType<typeof getDataGridModel<T>>;

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const density = useUiSize("dataGridDensity", props.density, "default");
  const resolvedProps: ResolvedDataGridProps<T> = {
    ...props,
    columns: props.columns ?? createDataGridColumns(props.columnDefs ?? []),
    getRowId:
      props.getRowId ??
      ((row, index) => String((row as { id?: unknown }).id ?? `row-${index}`)),
    rows: props.rows ?? props.rowData ?? [],
    density,
  };

  return (
    <DataGridView
      props={resolvedProps}
      model={getDataGridModel(resolvedProps)}
    />
  );
}

function DataGridView<T extends object>({
  props,
  model,
}: {
  props: ResolvedDataGridProps<T>;
  model: Model<T>;
}) {
  const showToolbar = props.toolbar ?? true;
  const showPagination = props.pagination ?? true;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-md bg-card",
        props.gridLines &&
          "[&_[role=cell]]:border-r [&_[role=cell]]:border-border/70 [&_[role=columnheader]]:border-r [&_[role=columnheader]]:border-border/70",
        props.className,
      )}
    >
      {showToolbar ? (
        <DataGridToolbar
          search={props.search ?? ""}
          searchable={props.searchable ?? true}
          selectedCount={props.selection?.selectedIds.length ?? 0}
          pageSize={props.pageSize}
          pageSizeOptions={getDataGridPageSizeOptions(
            props.pageSize,
            props.pageSizeOptions,
          )}
          excelDownload={model.excelDownload}
          onSearchChange={props.onSearchChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      ) : null}
      <DataGridTable
        ariaLabel={props.ariaLabel}
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
        density={props.density}
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
