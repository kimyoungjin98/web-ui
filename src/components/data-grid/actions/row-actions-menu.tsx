import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../dropdown/dropdown-menu";
import Icon from "../../icon";
import { ActionsButton } from "./actions-button";
import { getVisibleRowActions, type RowAction } from "./row-actions";

type RowActionsProps<T> = {
  row: T;
  actions: RowAction<T>[];
  ariaLabel?: string;
};

export function RowActions<T>({
  row,
  actions,
  ariaLabel = "행 액션 더보기",
}: RowActionsProps<T>) {
  const visibleActions = getVisibleRowActions(row, actions);

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionsButton aria-label={ariaLabel} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            variant={action.variant}
            disabled={action.disabled?.(row)}
            onSelect={() => action.onSelect(row)}
          >
            {action.icon ? <Icon name={action.icon} /> : null}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
