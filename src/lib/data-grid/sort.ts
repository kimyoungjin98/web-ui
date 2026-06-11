import type { DataGridSort } from "../../data-grid/types";

export function getNextSort(
  sort: DataGridSort,
  columnId: string,
): DataGridSort {
  if (sort?.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }

  if (sort.direction === "asc") {
    return { columnId, direction: "desc" };
  }

  return null;
}
