import type { DataGridSort } from "../types";

export function getNextSort(
  sort: DataGridSort,
  columnId: string,
  orderBy = columnId,
): DataGridSort {
  if (sort?.columnId !== columnId) {
    return { columnId, orderBy, direction: "asc" };
  }

  if (sort.direction === "asc") {
    return { columnId, orderBy, direction: "desc" };
  }

  return null;
}
