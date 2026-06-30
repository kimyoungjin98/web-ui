import Icon from "../../icon";
import { Checkbox } from "../../checkbox";
import { getNextSort } from "../../lib/data-grid/sort";
import { cn } from "../../lib/tailwind-util";
import type { DataGridColumn, DataGridSelection, DataGridSort } from "../types";
import type { DataGridTableColumn } from "./layout";

const HEAD =
  "sticky top-0 z-10 whitespace-nowrap bg-gray-50 px-4 py-3 text-sm font-semibold uppercase tracking-normal text-muted-foreground";

const FIXED_HEAD = "sticky z-30 bg-gray-50";

const FIXED_LEFT_EDGE = "shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.75)]";

const HEAD_BUTTON =
  "whitespace-pre-line inline-flex items-center gap-1 rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/20";

type Props<T> = {
  columns: DataGridTableColumn<T>[];
  selection?: DataGridSelection<T>;
  sort: DataGridSort;
  hasRowActions: boolean;
  rowActionsRightOffset?: string;
  rowActionsLeftEdge: boolean;
  onSortChange?: (sort: DataGridSort) => void;
};

export function DataGridHeader<T>(p: Props<T>) {
  return (
    <thead className="sticky top-0 z-20">
      <tr className="sticky top-0 z-20 border-b border-border bg-gray-50">
        {p.selection ? <SelectionHead selection={p.selection} /> : null}
        {p.columns.map((c) => (
          <HeadCell
            key={c.column.id}
            item={c}
            sort={p.sort}
            onSortChange={p.onSortChange}
          />
        ))}
        {p.hasRowActions ? (
          <th
            style={{ right: p.rowActionsRightOffset, width: "64px" }}
            className={cn(
              "sticky right-0 top-0 z-30 w-16 bg-gray-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-normal text-muted-foreground",
              p.rowActionsLeftEdge && FIXED_LEFT_EDGE,
            )}
          >
            액션
          </th>
        ) : null}
      </tr>
    </thead>
  );
}

function SelectionHead<T>({ selection }: { selection: DataGridSelection<T> }) {
  return (
    <th
      scope="col"
      className="sticky top-0 z-10 w-12 bg-gray-50 px-4 py-3 text-left"
    >
      <Checkbox
        aria-label="현재 페이지 캠페인 전체 선택"
        checked={selection.allPageSelected}
        size="lg"
        labelClassName="min-h-0 border-0 bg-transparent px-0 py-0 has-[:checked]:bg-transparent"
        onChange={selection.onTogglePage}
      />
    </th>
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
    <th
      scope="col"
      style={{
        ...item.style,
        right: item.fixedRightOffset,
      }}
      className={cn(
        HEAD,
        item.fixedRightOffset && FIXED_HEAD,
        item.fixedLeftEdge && FIXED_LEFT_EDGE,
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
    </th>
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
      className={cn(HEAD_BUTTON, column.align === "right" && "justify-end")}
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
