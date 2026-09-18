import type { IconName } from "../../icon";

export type RowAction<T> = {
  id: string;
  label: string;
  icon?: IconName;
  variant?: "default" | "destructive";
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  onSelect: (row: T) => void;
};

export function getVisibleRowActions<T>(row: T, actions: RowAction<T>[]) {
  return actions.filter((action) => !action.hidden?.(row));
}
