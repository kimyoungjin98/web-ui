import * as React from "react";

import type { DataGridColumn } from "../types";
import { resolveCellContent } from "./cell";

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
  const worksheet = utils.aoa_to_sheet([
    exportableColumns.map((column) => reactNodeToText(column.header)),
    ...rows.map((row, index) =>
      exportableColumns.map((column) => {
        const value = column.exportValue
          ? column.exportValue(row, index)
          : resolveCellContent(row, column, index);

        return reactNodeToText(value);
      }),
    ),
  ]);
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

function reactNodeToText(node: React.ReactNode): string {
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
