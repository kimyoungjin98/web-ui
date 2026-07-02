import type { DataGridColumn } from "../types";
import type * as React from "react";

export const ROW_ACTIONS_WIDTH = "96px";
export const SELECTION_COLUMN_WIDTH = "48px";
export const DEFAULT_FIXED_COLUMN_WIDTH = "160px";
export const DEFAULT_COLUMN_MIN_WIDTH = "96px";
export const PINNED_SIDE_SHADOW =
  "shadow-[-12px_0_18px_-22px_rgba(15,23,42,0.30)]";

export type DataGridTableColumn<T> = {
  column: DataGridColumn<T>;
  style: React.CSSProperties;
};

export type DataGridTableLayout<T> = {
  mainCols: DataGridTableColumn<T>[];
  sideCols: DataGridTableColumn<T>[];
};

export function getDataGridTableLayout<T>(
  columns: DataGridColumn<T>[],
): DataGridTableLayout<T> {
  const mainCols = columns
    .filter((column) => column.fixed !== "right")
    .map((column) => ({
      column,
      style: createMainStyle(column.width),
    }));
  const sideCols = columns
    .filter((column) => column.fixed === "right")
    .map((column) => ({
      column,
      style: createSideStyle(column.width ?? DEFAULT_FIXED_COLUMN_WIDTH),
    }));

  return {
    mainCols,
    sideCols,
  };
}

function createMainStyle(width?: string): React.CSSProperties {
  if (width) {
    return {
      flex: `0 0 ${width}`,
      width,
      minWidth: width,
    };
  }

  return {
    flex: `1 0 ${DEFAULT_COLUMN_MIN_WIDTH}`,
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  };
}

function createSideStyle(width: string): React.CSSProperties {
  return {
    flex: `0 0 ${width}`,
    width,
    minWidth: width,
  };
}
