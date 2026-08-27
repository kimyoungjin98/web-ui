/**
 * Select,Dropdown,Popover 등 포털을 사용하는 컴포넌트의 포털 컨테이너를 결정합니다.
 * @param trigger
 * @returns
 */
export function resolveSelectDialogPortalContainer<T>(
  trigger: { closest: (selector: string) => T | null } | null,
): T | undefined {
  // Keep the popover inside a dialog so its stacking context and focus handling remain intact.
  return trigger?.closest("[data-slot='dialog-content']") ?? undefined;
}
