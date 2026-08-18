export const DEFAULT_DATA_GRID_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function parseDataGridPageSize(value: string): number | null {
  const trimmedValue = value.trim();
  if (!/^[1-9]\d*$/.test(trimmedValue)) return null;

  const pageSize = Number(trimmedValue);
  return Number.isSafeInteger(pageSize) ? pageSize : null;
}

export function getDataGridPageSizeOptions(
  value: number,
  additionalOptions: readonly number[] = [],
) {
  return [
    ...new Set([
      ...DEFAULT_DATA_GRID_PAGE_SIZE_OPTIONS,
      ...additionalOptions,
      value,
    ]),
  ]
    .filter((option) => Number.isSafeInteger(option) && option > 0)
    .sort((left, right) => left - right);
}
