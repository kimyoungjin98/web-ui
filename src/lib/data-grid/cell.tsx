import * as React from "react";

import type { DataGridColumn } from "../../data-grid/types";

export function resolveCellContent<T>(row: T, column: DataGridColumn<T>) {
  if (column.cell) {
    return column.cell(row);
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row);
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
