import Icon from "../../icon";
import type * as React from "react";
import { Checkbox } from "../../checkbox";
import { getNextSort } from "../../lib/data-grid/sort";
import { cn } from "../../lib/tailwind-util";
import type { DataGridColumn, DataGridSelection, DataGridSort } from "../types";
import {
  PINNED_SIDE_SHADOW,
  ROW_ACTIONS_WIDTH,
  type DataGridTableColumn,
} from "./layout";

const HEAD =
  "flex items-center whitespace-nowrap bg-gray-50 px-4 py-3 text-sm font-semibold uppercase tracking-normal text-muted-foreground";

const HEAD_BUTTON =
  "whitespace-pre-line inline-flex items-center gap-1 rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/20";

type Props<T> = {
  mainCols: DataGridTableColumn<T>[];
  sideCols: DataGridTableColumn<T>[];
  minMainWidth: string;
  selection?: DataGridSelection<T>;
  sort: DataGridSort;
  hasRowActions: boolean;
  setMain: (node: HTMLDivElement | null) => void;
  onMainScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onSortChange?: (sort: DataGridSort) => void;
};

export function DataGridHeader<T>(p: Props<T>) {
  const hasSide = p.sideCols.length > 0 || p.hasRowActions;

  return (
    <div role="rowgroup" className="sticky top-0 z-20">
      <div
        role="row"
        className="flex w-full min-w-full border-b border-border bg-gray-50"
      >
        <div
          ref={p.setMain}
          onScroll={p.onMainScroll}
          className="min-w-0 flex-1 overflow-x-hidden"
        >
          <div className="flex" style={{ minWidth: p.minMainWidth }}>
            {p.selection ? <SelectionHead selection={p.selection} /> : null}
            {p.mainCols.map((c) => (
              <HeadCell
                key={c.column.id}
                item={c}
                sort={p.sort}
                onSortChange={p.onSortChange}
              />
            ))}
          </div>
        </div>
        {hasSide ? (
          <div
            className={cn(
              "flex shrink-0 border-l border-border/70 bg-gray-50",
              PINNED_SIDE_SHADOW,
            )}
          >
            {p.sideCols.map((c) => (
              <HeadCell
                key={c.column.id}
                item={c}
                sort={p.sort}
                onSortChange={p.onSortChange}
              />
            ))}
            {p.hasRowActions ? <ActionHead /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SelectionHead<T>({ selection }: { selection: DataGridSelection<T> }) {
  return (
    <div
      role="columnheader"
      style={{ flex: "0 0 48px" }}
      className="box-border flex min-h-12 w-12 shrink-0 items-center bg-gray-50 px-4 py-3 text-left"
    >
      <Checkbox
        aria-label="현재 페이지 캠페인 전체 선택"
        checked={selection.allPageSelected}
        size="lg"
        labelClassName="min-h-0 border-0 bg-transparent px-0 py-0 has-[:checked]:bg-transparent"
        onChange={selection.onTogglePage}
      />
    </div>
  );
}

function HeadCell<T>({
  item,
  sort,
  onSortChange,
}: {
  item: DataGridTableColumn<T>;
  sort: DataGridSort;
  onSortChange?: (sort: DataGridSort) => void;
}) {
  const column = item.column;
  const active = sort?.columnId === column.id;
  const align = column.align;
  return (
    <div
      role="columnheader"
      style={item.style}
      className={cn(
        "box-border shrink-0",
        HEAD,
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        !align && "justify-start",
        align === "center" && "text-center",
        align === "right" && "text-right",
        !align && "text-left",
      )}
    >
      {column.sortable ? (
        <SortButton
          column={column}
          sort={sort}
          active={active}
          onSortChange={onSortChange}
        />
      ) : (
        column.header
      )}
    </div>
  );
}

function ActionHead() {
  return (
    <div
      role="columnheader"
      style={{
        flex: `0 0 ${ROW_ACTIONS_WIDTH}`,
        width: ROW_ACTIONS_WIDTH,
        minWidth: ROW_ACTIONS_WIDTH,
      }}
      className="box-border flex min-h-12 shrink-0 items-center justify-end bg-gray-50 px-4 py-3 text-right text-sm font-semibold uppercase tracking-normal text-muted-foreground"
    >
      액션
    </div>
  );
}

function SortButton<T>({
  active,
  column,
  sort,
  onSortChange,
}: {
  active: boolean;
  column: DataGridColumn<T>;
  sort: DataGridSort;
  onSortChange?: (sort: DataGridSort) => void;
}) {
  const icon = active
    ? sort?.direction === "asc"
      ? "lucide:arrow-up"
      : "lucide:arrow-down"
    : "lucide:chevrons-up-down";
  return (
    <button
      type="button"
      onClick={() => onSortChange?.(getNextSort(sort, column.id))}
      className={cn(
        HEAD_BUTTON,
        column.align === "center" && "justify-center",
        column.align === "right" && "justify-end",
      )}
    >
      <span>{column.header}</span>
      <Icon
        name={icon}
        className={cn(
          "size-3.5",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      />
    </button>
  );
}
