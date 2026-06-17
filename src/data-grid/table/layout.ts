import type { DataGridColumn } from "../types";

export const ROW_ACTIONS_WIDTH = "64px";
export const DEFAULT_FIXED_COLUMN_WIDTH = "160px";

export type DataGridTableColumn<T> = {
  column: DataGridColumn<T>;
  fixedRightOffset?: string;
  fixedWidth?: string;
  fixedLeftEdge?: boolean;
};

export function getDataGridTableLayout<T>(
  columns: DataGridColumn<T>[],
  hasRowActions: boolean,
) {
  const normalColumns: DataGridTableColumn<T>[] = [];
  const rightFixedColumns = columns
    .filter((column) => column.fixed === "right")
    .map((column) => ({
      column,
      fixedWidth: column.width ?? DEFAULT_FIXED_COLUMN_WIDTH,
    }));

  for (const column of columns) {
    if (column.fixed !== "right") normalColumns.push({ column });
  }

  const rightOffsets = getRightFixedOffsets(
    rightFixedColumns.map((item) => item.fixedWidth),
    hasRowActions ? ROW_ACTIONS_WIDTH : "0px",
  );

  return {
    columns: [
      ...normalColumns,
      ...rightFixedColumns.map((item, index) => ({
        ...item,
        fixedRightOffset: rightOffsets[index],
        fixedLeftEdge: index === 0,
      })),
    ],
    rowActionsRightOffset: hasRowActions ? "0px" : undefined,
    rowActionsLeftEdge: hasRowActions && rightFixedColumns.length === 0,
  };
}

function getRightFixedOffsets(widths: string[], initialOffset: string) {
  const offsets = new Array<string>(widths.length);
  let offset = initialOffset;

  for (let index = widths.length - 1; index >= 0; index -= 1) {
    offsets[index] = offset;
    offset = addCssLengths(offset, widths[index] ?? DEFAULT_FIXED_COLUMN_WIDTH);
  }

  return offsets;
}

function addCssLengths(left: string, right: string) {
  if (left === "0px") return right;

  return `calc(${left} + ${right})`;
}
