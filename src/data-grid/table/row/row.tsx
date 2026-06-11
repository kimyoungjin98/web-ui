import type * as React from "react";
import type { ReactNode } from "react";
import { Checkbox } from "../../../checkbox";
import { resolveCellContent } from "../../../lib/data-grid/cell";
import { cn } from "../../../lib/tailwind-util";
import type { DataGridColumn, DataGridSelection } from "../../types";

const ROW =
  "border-b border-border transition-colors last:border-0 hover:bg-gray-50";

const SELECTED_ROW = "bg-primary/5 hover:bg-primary/10 focus-visible:bg-primary/10";

const CLICKABLE =
  "cursor-pointer outline-none focus-visible:bg-gray-50 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/20";

type Props<T> = {
  row: T;
  index: number;
  columns: DataGridColumn<T>[];
  selection?: DataGridSelection<T>;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
};

export function DataGridRow<T>(p: Props<T>) {
  const canClick = Boolean(p.onRowClick);
  const selected = p.selection?.isSelected(p.row, p.index) ?? false;
  return (
    <tr
      role={canClick ? "button" : undefined}
      aria-label={canClick ? "행 상세 보기" : undefined}
      aria-selected={selected || undefined}
      data-selected={selected || undefined}
      tabIndex={canClick ? 0 : undefined}
      onClick={(e) => runRowClick(e, p.row, p.onRowClick)}
      onKeyDown={(e) => runRowClick(e, p.row, p.onRowClick)}
      className={cn(ROW, canClick && CLICKABLE, selected && SELECTED_ROW)}
    >
      {p.selection ? (
        <DataGridSelectionCell
          row={p.row}
          index={p.index}
          selected={selected}
          selection={p.selection}
        />
      ) : null}
      {p.columns.map((c) => (
        <DataGridCell key={c.id} row={p.row} column={c} />
      ))}
      {p.rowActions ? (
        <DataGridRowActionsCell row={p.row} rowActions={p.rowActions} />
      ) : null}
    </tr>
  );
}

function DataGridSelectionCell<T>({
  row,
  index,
  selected,
  selection,
}: {
  row: T;
  index: number;
  selected: boolean;
  selection: DataGridSelection<T>;
}) {
  return (
    <td
      data-row-click-ignore
      className={cn(
        "px-4 py-3 align-middle",
        selected && "shadow-[inset_3px_0_0_hsl(var(--primary))]",
      )}
    >
      <Checkbox
        aria-label="캠페인 선택"
        checked={selected}
        size="lg"
        labelClassName="min-h-0 border-0 bg-transparent px-0 py-0 has-[:checked]:bg-transparent"
        onChange={() => selection.onToggleRow(row, index)}
      />
    </td>
  );
}

function DataGridCell<T>({
  row,
  column,
}: {
  row: T;
  column: DataGridColumn<T>;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle text-foreground",
        column.align === "center" && "text-center",
        column.align === "right" && "text-right",
        column.className,
      )}
    >
      {resolveCellContent(row, column)}
    </td>
  );
}

function DataGridRowActionsCell<T>({
  row,
  rowActions,
}: {
  row: T;
  rowActions: (row: T) => React.ReactNode;
}) {
  return (
    <td data-row-click-ignore className="px-4 py-3 text-right align-middle">
      {rowActions(row)}
    </td>
  );
}

type RowEvent =
  | React.MouseEvent<HTMLTableRowElement>
  | React.KeyboardEvent<HTMLTableRowElement>;

function runRowClick<T>(
  event: RowEvent,
  row: T,
  onRowClick?: (row: T) => void,
) {
  if (!onRowClick || isInteractiveTarget(event)) return;
  if ("key" in event && event.key !== "Enter" && event.key !== " ") return;
  if ("key" in event) event.preventDefault();
  onRowClick(row);
}

function isInteractiveTarget(event: RowEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return false;
  const found = target.closest(
    "a,button,input,select,textarea,[role='button'],[role='menuitem'],[data-row-click-ignore]",
  );

  return Boolean(found && found !== event.currentTarget);
}
