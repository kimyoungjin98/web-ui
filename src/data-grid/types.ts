import type * as React from "react";

export type DataGridSort = {
  columnId: string;
  direction: "asc" | "desc";
} | null;

export type DataGridColumn<T> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  exportValue?: (row: T) => React.ReactNode;
  exportable?: boolean;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
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
