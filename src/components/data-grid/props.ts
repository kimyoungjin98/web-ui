import type * as React from "react";
import type {
  DataGridColumn,
  DataGridColumnDef,
  DataGridDensity,
  DataGridExcelDownloadAction,
  DataGridSelection,
  DataGridSort,
} from "./types";

export type DataGridProps<T extends object> = {
  ariaLabel?: string;
  className?: string;
  columns?: DataGridColumn<T>[];
  columnDefs?: DataGridColumnDef<T>[];
  density?: DataGridDensity;
  rows?: T[];
  rowData?: T[];
  getRowId?: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  sort: DataGridSort;
  search?: string;
  searchable?: boolean;
  minTableWidth?: string;
  excelDownload?: DataGridExcelDownloadAction | false;
  selection?: DataGridSelection<T>;
  toolbar?: boolean;
  showToolbar?: boolean;
  pagination?: boolean;
  rowClassName?: (row: T, index: number) => string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sort: DataGridSort) => void;
  onSearchChange?: (search: string) => void;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => React.ReactNode;
};

export type ResolvedDataGridProps<T extends object> = DataGridProps<T> & {
  columns: DataGridColumn<T>[];
  getRowId: (row: T, index: number) => string;
  rows: T[];
};
