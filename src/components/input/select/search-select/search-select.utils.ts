export type SearchSelectOption = {
  value: string;
  label: string;
  keywords?: readonly string[];
  disabled?: boolean;
};

export function filterSearchSelectOptions<T extends SearchSelectOption>(
  options: readonly T[],
  query: string,
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [...options];
  }

  return options.filter((option) =>
    [option.label, ...(option.keywords ?? [])].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}

export function canCreateSearchSelectOption(
  query: string,
  matchingOptions: readonly SearchSelectOption[],
) {
  return query.trim().length > 0 && matchingOptions.length === 0;
}

export async function createSearchSelectOption<
  TOption extends SearchSelectOption,
>(
  query: string,
  matchingOptions: readonly SearchSelectOption[],
  createOption: (query: string) => TOption | void | Promise<TOption | void>,
) {
  if (!canCreateSearchSelectOption(query, matchingOptions)) {
    return;
  }

  return createOption(query.trim());
}
