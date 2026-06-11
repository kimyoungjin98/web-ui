import { downloadDataGridAsExcel } from "../../lib/data-grid/export";
import type { DataGridProps } from "../props";

export function getDataGridModel<T>(p: DataGridProps<T>) {
  const action = p.excelDownload;
  const pageCount = Math.max(1, Math.ceil(p.total / p.pageSize));
  const firstItem = p.total === 0 ? 0 : (p.page - 1) * p.pageSize + 1;
  const lastItem = Math.min(p.total, p.page * p.pageSize);
  const tableColumnCount =
    p.columns.length + (p.rowActions ? 1 : 0) + (p.selection ? 1 : 0);
  const excelDownload = action === false ? undefined : {
    label: action?.label,
    loading: action?.loading,
    disabled: action?.disabled || p.rows.length === 0,
    onClick: action?.onClick ?? (() => downloadDataGridAsExcel({
      columns: p.columns,
      rows: p.rows,
      filename: action?.filename ?? "data-grid",
    })),
  };

  return { pageCount, firstItem, lastItem, tableColumnCount, excelDownload };
}
