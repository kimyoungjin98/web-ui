import * as React from "react";

import type { DataGridColumn } from "../../data-grid/types";

export function resolveCellContent<T>(
  row: T,
  column: DataGridColumn<T>,
  index: number,
) {
  if (column.cell) {
    return column.cell(row, index);
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row, index);
  }

  if (column.accessor) {
    const value = row[column.accessor];

    if (React.isValidElement(value)) {
      return value;
    }

    if (value == null) {
      return "";
    }

    return String(value);
  }

  return "";
}
