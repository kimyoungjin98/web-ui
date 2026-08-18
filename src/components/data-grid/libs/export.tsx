import * as React from "react";

import type { DataGridColumn } from "../types";
import { resolveCellContent } from "./cell";

type ExcelCellValue = string | number | boolean | Date;

type DownloadDataGridAsExcelOptions<T> = {
  columns: DataGridColumn<T>[];
  rows: T[];
  filename: string;
};

export async function downloadDataGridAsExcel<T>({
  columns,
  rows,
  filename,
}: DownloadDataGridAsExcelOptions<T>) {
  const { utils, write } = await import("xlsx");
  const exportableColumns = columns.filter(
    (column) => column.exportable !== false,
  );
  const exportRows = rows.map((row, index) =>
    exportableColumns.map((column) => resolveExportValue(row, column, index)),
  );
  const worksheet = utils.aoa_to_sheet(
    [
      exportableColumns.map((column) => reactNodeToText(column.header)),
      ...exportRows,
    ],
    { cellDates: true, dateNF: "yyyy-mm-dd" },
  );
  worksheet["!cols"] = exportableColumns.map((column, columnIndex) =>
    resolveExcelColumnWidth(column, exportRows, columnIndex),
  );
  exportableColumns.forEach((column, columnIndex) => {
    const excelFormat =
      column.excelFormat ?? (column.type === "date" ? "yyyy-mm-dd" : undefined);

    if (!excelFormat) return;

    rows.forEach((_, rowIndex) => {
      const address = utils.encode_cell({ c: columnIndex, r: rowIndex + 1 });
      const cell = worksheet[address];

      if (cell) cell.z = excelFormat;
    });
  });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data");
  const blob = new Blob(
    [write(workbook, { bookType: "xlsx", type: "array" })],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `${sanitizeFilename(filename)}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function resolveExcelColumnWidth<T>(
  column: DataGridColumn<T>,
  rows: ExcelCellValue[][],
  columnIndex: number,
) {
  const pixelWidth = parsePixelWidth(column.width);
  if (pixelWidth !== null && pixelWidth > 0) return { wpx: pixelWidth };

  const headerWidth = getTextWidth(reactNodeToText(column.header));
  const contentWidth = rows.reduce(
    (width, row) =>
      Math.max(width, getExcelValueWidth(row[columnIndex], column)),
    0,
  );

  return { wch: Math.min(60, Math.max(10, headerWidth, contentWidth) + 2) };
}

function parsePixelWidth(width?: string) {
  const match = width?.trim().match(/^(\d+(?:\.\d+)?)px$/);
  if (!match) return null;

  const value = Number(match[1]);
  return Number.isFinite(value) ? Math.ceil(value) : null;
}

function getExcelValueWidth<T>(
  value: ExcelCellValue | undefined,
  column: DataGridColumn<T>,
) {
  if (value instanceof Date) {
    return (column.excelFormat ?? "yyyy-mm-dd").length;
  }

  return getTextWidth(String(value ?? ""));
}

function getTextWidth(value: string) {
  return Array.from(value).reduce(
    (width, character) => width + (/[^\x00-\xff]/.test(character) ? 2 : 1),
    0,
  );
}

function resolveExportValue<T>(
  row: T,
  column: DataGridColumn<T>,
  index: number,
): ExcelCellValue {
  if (column.exportValue) {
    return toExcelCellValue(column.exportValue(row, index), column.type);
  }

  const rawValue = getRawColumnValue(row, column, index);
  if (rawValue !== undefined && (column.type || !column.cell)) {
    return toExcelCellValue(rawValue, column.type);
  }

  return toExcelCellValue(resolveCellContent(row, column, index), column.type);
}

function getRawColumnValue<T>(
  row: T,
  column: DataGridColumn<T>,
  index: number,
): unknown {
  const accessor = column.accessor;

  if (typeof accessor === "function") return accessor(row, index);

  const key = accessor ?? column.id;
  return (row as Record<PropertyKey, unknown>)[key];
}

function toExcelCellValue(
  value: unknown,
  type?: DataGridColumn<unknown>["type"],
): ExcelCellValue {
  if (value == null) return "";

  if (type === "text") return reactNodeToText(value);

  if (type === "number") {
    if (typeof value === "string" && value.trim() === "") return "";

    if (typeof value !== "number" && typeof value !== "string") {
      return reactNodeToText(value);
    }

    const numberValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numberValue) ? numberValue : reactNodeToText(value);
  }

  if (type === "boolean") {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1) return true;
    if (value === "false" || value === 0) return false;
    return reactNodeToText(value);
  }

  if (type === "date") {
    const dateValue =
      value instanceof Date
        ? value
        : typeof value === "number"
          ? new Date(value)
          : new Date(String(value));
    return Number.isNaN(dateValue.getTime())
      ? reactNodeToText(value)
      : dateValue;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;

  return reactNodeToText(value);
}

function reactNodeToText(node: unknown): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "bigint"
  ) {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(reactNodeToText).filter(Boolean).join(" ");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return reactNodeToText(node.props.children);
  }

  return "";
}

function sanitizeFilename(filename: string) {
  const sanitized = filename.trim().replace(/[\\/:*?"<>|]+/g, "-");

  return sanitized || "data-grid";
}
