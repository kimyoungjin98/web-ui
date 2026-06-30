import type * as React from "react";
import type { ReactNode } from "react";
import { Checkbox } from "../../checkbox";
import { resolveCellContent } from "../../lib/data-grid/cell";
import { cn } from "../../lib/tailwind-util";
import type { DataGridSelection } from "../types";
import type { DataGridTableColumn } from "./layout";

const ROW =
  "data-grid-row-enter group border-b border-border/50 hover:bg-gray-50";

const SELECTED_ROW =
  "bg-primary-soft hover:bg-primary-soft focus-visible:bg-primary-soft";

const CLICKABLE =
  "cursor-pointer outline-none focus-visible:bg-gray-50 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/20";

type Props<T> = {
  row: T;
  index: number;
  columns: DataGridTableColumn<T>[];
  gridTemplateColumns: string;
  selection?: DataGridSelection<T>;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => ReactNode;
  rowActionsRightOffset?: string;
  rowActionsLeftEdge: boolean;
};

export function DataGridRow<T>(p: Props<T>) {
  const canClick = Boolean(p.onRowClick);
  const selected = p.selection?.isSelected(p.row, p.index) ?? false;
  return (
    <div
      role="row"
      aria-label={canClick ? "행 상세 보기" : undefined}
      aria-selected={selected || undefined}
      data-selected={selected || undefined}
      tabIndex={canClick ? 0 : undefined}
      style={{ gridTemplateColumns: p.gridTemplateColumns }}
      onClick={(e) => runRowClick(e, p.row, p.index, p.onRowClick)}
      onKeyDown={(e) => runRowClick(e, p.row, p.index, p.onRowClick)}
      className={cn(
        "grid",
        ROW,
        canClick && CLICKABLE,
        selected && SELECTED_ROW,
        p.rowClassName?.(p.row, p.index),
      )}
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
        <DataGridCell key={c.column.id} row={p.row} index={p.index} item={c} />
      ))}
      {p.rowActions ? (
        <DataGridRowActionsCell
          row={p.row}
          index={p.index}
          rowActions={p.rowActions}
          rightOffset={p.rowActionsRightOffset}
          leftEdge={p.rowActionsLeftEdge}
        />
      ) : null}
    </div>
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
    <div
      role="cell"
      data-row-click-ignore
      className={cn(
        "flex min-h-16 items-center px-4 py-3",
        selected && "shadow-[inset_3px_0_0_hsl(var(--primary))]",
      )}
    >
      <Checkbox
        aria-label="선택"
        checked={selected}
        size="lg"
        labelClassName="min-h-0 border-0 bg-transparent px-0 py-0 has-[:checked]:bg-transparent"
        onChange={() => selection.onToggleRow(row, index)}
      />
    </div>
  );
}

function DataGridCell<T>({
  row,
  index,
  item,
}: {
  row: T;
  index: number;
  item: DataGridTableColumn<T>;
}) {
  const column = item.column;
  return (
    <div
      role="cell"
      style={{
        ...item.style,
        right: item.fixedRightOffset,
      }}
      className={cn(
        "flex items-center whitespace-nowrap px-4 py-3 text-foreground",
        item.fixedRightOffset &&
          "sticky z-10 bg-card group-hover:bg-gray-50 group-data-[selected=true]:bg-primary-soft",
        item.fixedLeftEdge &&
          "border-l border-border/70 shadow-[-18px_0_24px_-24px_rgba(15,23,42,0.45)]",
        column.align === "center" && "justify-center",
        column.align === "right" && "justify-end",
        !column.align && "justify-start",
        column.align === "center" && "text-center",
        column.align === "right" && "text-right",
        column.className,
      )}
    >
      {resolveCellContent(row, column, index)}
    </div>
  );
}

function DataGridRowActionsCell<T>({
  row,
  index,
  rowActions,
  rightOffset,
  leftEdge,
}: {
  row: T;
  index: number;
  rowActions: (row: T, index: number) => React.ReactNode;
  rightOffset?: string;
  leftEdge: boolean;
}) {
  return (
    <div
      role="cell"
      data-row-click-ignore
      style={{ right: rightOffset, width: "64px", minWidth: "64px" }}
      className={cn(
        "sticky right-0 z-10 flex min-h-16 w-16 items-center justify-end bg-card px-4 py-3 text-right group-hover:bg-gray-50 group-data-[selected=true]:bg-primary-soft",
        leftEdge &&
          "border-l border-border/70 shadow-[-18px_0_24px_-24px_rgba(15,23,42,0.45)]",
      )}
    >
      {rowActions(row, index)}
    </div>
  );
}

type RowEvent =
  | React.MouseEvent<HTMLDivElement>
  | React.KeyboardEvent<HTMLDivElement>;

function runRowClick<T>(
  event: RowEvent,
  row: T,
  index: number,
  onRowClick?: (row: T, index: number) => void,
) {
  if (!onRowClick || isInteractiveTarget(event)) return;
  if ("key" in event && event.key !== "Enter" && event.key !== " ") return;
  if ("key" in event) event.preventDefault();
  onRowClick(row, index);
}

function isInteractiveTarget(event: RowEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return false;
  const found = target.closest(
    "a,button,input,select,textarea,[role='button'],[role='menuitem'],[data-row-click-ignore]",
  );

  return Boolean(found && found !== event.currentTarget);
}
