import type * as React from "react";

export type DataGridSort = {
  columnId: string;
  direction: "asc" | "desc";
} | null;

export type DataGridDensity = "default" | "compact" | "ultra-compact";

/** AG Grid와 유사하게 JSON으로 전달할 수 있는 컬럼 정의입니다. */
export type DataGridColumnDef<T extends object> = {
  align?: "left" | "center" | "right";
  field: Extract<keyof T, string>;
  headerName?: string;
  hide?: boolean;
  pinned?: "right";
  sortable?: boolean;
  type?: "text" | "number" | "date" | "boolean";
  width?: number | string;
};

export type DataGridColumn<T> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  cell?: (row: T, index: number) => React.ReactNode;
  exportValue?: (row: T, index: number) => React.ReactNode;
  exportable?: boolean;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  fixed?: "right";
  className?: string;
  type?: "text" | "number" | "date" | "boolean";
};

export type DataGridExcelDownloadAction = {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  filename?: string;
};

export type DataGridSelection<T> = {
  selectedIds: string[];
  isSelected: (row: T, index: number) => boolean;
  onToggleRow: (row: T, index: number) => void;
  onTogglePage: () => void;
  allPageSelected: boolean;
};
