import * as React from "react";

import type { DataGridColumn } from "../types";
import { resolveCellContent } from "./cell";

type DownloadDataGridAsExcelOptions<T> = {
  columns: DataGridColumn<T>[];
  rows: T[];
  filename: string;
};

export function downloadDataGridAsExcel<T>({
  columns,
  rows,
  filename,
}: DownloadDataGridAsExcelOptions<T>) {
  const exportableColumns = columns.filter(
    (column) => column.exportable !== false,
  );
  const headerCells = exportableColumns.map((column) =>
    renderExcelCell(reactNodeToText(column.header), "th"),
  );
  const bodyRows = rows.map(
    (row, index) =>
      `<tr>${exportableColumns
        .map((column) => {
          const value = column.exportValue
            ? column.exportValue(row, index)
            : resolveCellContent(row, column, index);

          return renderExcelCell(reactNodeToText(value), "td");
        })
        .join("")}</tr>`,
  );
  const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table><thead><tr>${headerCells.join(
    "",
  )}</tr></thead><tbody>${bodyRows.join("")}</tbody></table></body></html>`;
  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `${sanitizeFilename(filename)}.xls`;
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

function renderExcelCell(content: string, tagName: "td" | "th") {
  return `<${tagName}>${escapeHtml(content)}</${tagName}>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeFilename(filename: string) {
  const sanitized = filename.trim().replace(/[\\/:*?"<>|]+/g, "-");

  return sanitized || "data-grid";
}
