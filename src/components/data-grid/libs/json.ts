import type { DataGridColumn, DataGridColumnDef } from "../types";

export function createDataGridColumns<T extends object>(
  definitions: readonly DataGridColumnDef<T>[],
): DataGridColumn<T>[] {
  return definitions
    .filter((definition) => !definition.hide)
    .map((definition) => ({
      accessor: definition.field,
      align:
        definition.align ??
        (definition.type === "number" ? "right" : undefined),
      fixed: definition.pinned === "right" ? "right" : undefined,
      header: definition.headerName ?? definition.field,
      id: definition.field,
      orderBy: definition.orderBy ?? definition.field,
      sortable: definition.sortable,
      type: definition.type,
      width:
        typeof definition.width === "number"
          ? `${definition.width}px`
          : definition.width,
    }));
}
