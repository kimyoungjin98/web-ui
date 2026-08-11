import type * as React from "react";
import type { ReactNode } from "react";
import { Checkbox } from "../../checkbox";
import { resolveCellContent } from "../libs/cell";
import { cn } from "../../../libs/tailwind-util";
import type { DataGridDensity, DataGridSelection } from "../types";
import {
  PINNED_SIDE_SHADOW,
  ROW_ACTIONS_WIDTH,
  type DataGridTableColumn,
} from "./layout";
import { getDataGridDensity } from "./density";

const ROW = "group transition-colors hover:bg-muted";

const ROW_ENTER = "data-grid-row-enter";

const SELECTED_ROW =
  "bg-primary/15 hover:bg-primary/15 focus-visible:bg-primary/15";

const CLICKABLE =
  "cursor-pointer outline-none focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/20";

type Props<T> = {
  row: T;
  index: number;
  isLast?: boolean;
  mainCols: DataGridTableColumn<T>[];
  sideCols: DataGridTableColumn<T>[];
  minMainWidth: string;
  selection?: DataGridSelection<T>;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => ReactNode;
  setMain: (node: HTMLDivElement | null) => void;
  onMainScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  animate?: boolean;
  density: DataGridDensity;
};

export function DataGridRow<T>(p: Props<T>) {
  const canClick = Boolean(p.onRowClick);
  const selected = p.selection?.isSelected(p.row, p.index) ?? false;
  const hasSide = p.sideCols.length > 0 || Boolean(p.rowActions);

  return (
    <div
      role="row"
      aria-label={canClick ? "행 상세 보기" : undefined}
      aria-selected={selected || undefined}
      data-selected={selected || undefined}
      tabIndex={canClick ? 0 : undefined}
      onClick={(e) => runRowClick(e, p.row, p.index, p.onRowClick)}
      onKeyDown={(e) => runRowClick(e, p.row, p.index, p.onRowClick)}
      className={cn(
        "flex w-full min-w-full",
        ROW,
        p.index % 2 === 1 && "bg-muted/20",
        !p.isLast && "border-b border-border/50",
        p.animate !== false && ROW_ENTER,
        canClick && CLICKABLE,
        selected && SELECTED_ROW,
        p.rowClassName?.(p.row, p.index),
      )}
    >
      <div
        ref={p.setMain}
        onScroll={p.onMainScroll}
        className="min-w-0 flex-1 overflow-x-hidden"
      >
        <div className="flex" style={{ minWidth: p.minMainWidth }}>
          {p.selection ? (
            <DataGridSelectionCell
              density={p.density}
              row={p.row}
              index={p.index}
              selected={selected}
              selection={p.selection}
            />
          ) : null}
          {p.mainCols.map((c) => (
            <DataGridCell
              key={c.column.id}
              row={p.row}
              index={p.index}
              item={c}
              density={p.density}
            />
          ))}
        </div>
      </div>
      {hasSide ? (
        <div
          className={cn(
            "flex shrink-0 border-l border-border/70",
            PINNED_SIDE_SHADOW,
          )}
        >
          {p.sideCols.map((c) => (
            <DataGridCell
              key={c.column.id}
              row={p.row}
              index={p.index}
              item={c}
              density={p.density}
            />
          ))}
          {p.rowActions ? (
            <DataGridRowActionsCell
              density={p.density}
              row={p.row}
              index={p.index}
              rowActions={p.rowActions}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DataGridSelectionCell<T>({
  density,
  row,
  index,
  selected,
  selection,
}: {
  density: DataGridDensity;
  row: T;
  index: number;
  selected: boolean;
  selection: DataGridSelection<T>;
}) {
  const densityStyles = getDataGridDensity(density);
  return (
    <div
      role="cell"
      data-row-click-ignore
      style={{ flex: `0 0 ${densityStyles.selectionWidth}` }}
      className={cn(
        "box-border flex shrink-0 items-center",
        densityStyles.selectionCell,
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
  density,
  row,
  index,
  item,
}: {
  density: DataGridDensity;
  row: T;
  index: number;
  item: DataGridTableColumn<T>;
}) {
  const column = item.column;
  const densityStyles = getDataGridDensity(density);
  return (
    <div
      role="cell"
      style={item.style}
      className={cn(
        "box-border flex min-w-0 shrink-0 items-center overflow-hidden whitespace-nowrap text-base-content",
        densityStyles.cell,
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
  density,
  row,
  index,
  rowActions,
}: {
  density: DataGridDensity;
  row: T;
  index: number;
  rowActions: (row: T, index: number) => React.ReactNode;
}) {
  const densityStyles = getDataGridDensity(density);
  return (
    <div
      role="cell"
      data-row-click-ignore
      style={{
        flex: `0 0 ${ROW_ACTIONS_WIDTH}`,
        width: ROW_ACTIONS_WIDTH,
        minWidth: ROW_ACTIONS_WIDTH,
      }}
      className={cn(
        "box-border flex shrink-0 items-center justify-end text-right",
        densityStyles.actionCell,
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
