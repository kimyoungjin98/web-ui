import * as React from "react";

import type { DataGridColumn } from "../types";

export function resolveCellContent<T>(
  row: T,
  column: DataGridColumn<T>,
  index: number,
) {
  const accessor = column.accessor;
  const renderer =
    column.cell ?? (typeof accessor === "function" ? accessor : undefined);

  if (renderer) return renderer(row, index);

  const key =
    typeof accessor === "function" ? column.id : (accessor ?? column.id);

  return formatCellValue(getRowValue(row, key));
}

function getRowValue<T>(row: T, key: PropertyKey): unknown {
  return (row as Record<PropertyKey, unknown>)[key];
}

function formatCellValue(value: unknown): React.ReactNode {
  if (React.isValidElement(value)) return value;
  if (value == null) return "-";

  return String(value);
}
