import type { DataGridDensity } from "../types";

type DataGridDensityStyles = {
  actionCell: string;
  cell: string;
  header: string;
  rowHeight: number;
  selectionCell: string;
  selectionWidth: string;
};

const DENSITIES: Record<DataGridDensity, DataGridDensityStyles> = {
  default: {
    actionCell: "min-h-16 px-4 py-3 text-sm",
    cell: "min-h-16 px-4 py-3 text-sm",
    header: "min-h-12 px-4 py-3 text-sm",
    rowHeight: 64,
    selectionCell: "min-h-16 px-4 py-3",
    selectionWidth: "48px",
  },
  comfortable: {
    actionCell: "min-h-12 px-3 py-2 text-sm",
    cell: "min-h-12 px-3 py-2 text-sm",
    header: "min-h-11 px-3 py-2 text-sm",
    rowHeight: 48,
    selectionCell: "min-h-12 px-3 py-2",
    selectionWidth: "44px",
  },
  compact: {
    actionCell: "min-h-10 px-2 py-1 text-xs",
    cell: "min-h-10 px-2 py-1 text-xs",
    header: "min-h-10 px-2 py-1.5 text-xs",
    rowHeight: 40,
    selectionCell: "min-h-10 px-2 py-1",
    selectionWidth: "40px",
  },
  "ultra-compact": {
    actionCell: "min-h-[34px] px-1 py-1 text-[11px] leading-4",
    cell: "min-h-[34px] px-1 py-1 text-[11px] leading-4",
    header: "min-h-8 px-1 py-1 text-[10px] leading-3",
    rowHeight: 34,
    selectionCell: "min-h-[34px] px-1 py-1",
    selectionWidth: "36px",
  },
};

export function getDataGridDensity(
  density: DataGridDensity = "default",
): DataGridDensityStyles {
  return DENSITIES[density];
}
