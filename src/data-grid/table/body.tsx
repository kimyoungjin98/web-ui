import type * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../../lib/tailwind-util";
import type { DataGridSelection } from "../types";
import {
  PINNED_SIDE_SHADOW,
  ROW_ACTIONS_WIDTH,
  type DataGridTableColumn,
} from "./layout";
import { DataGridRow } from "./row";

type Props<T> = {
  mainCols: DataGridTableColumn<T>[];
  sideCols: DataGridTableColumn<T>[];
  minMainWidth: string;
  rows: T[];
  getRowId: (row: T, index: number) => string;
  loading: boolean;
  emptyMessage: string;
  pageSize: number;
  selection?: DataGridSelection<T>;
  tableColumnCount: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  setMain: (node: HTMLDivElement | null) => void;
  onMainScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => React.ReactNode;
};

export function DataGridBody<T>(p: Props<T>) {
  const count = p.tableColumnCount;
  const rows = p.rows;
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 64,
    getItemKey: (index) => p.getRowId(rows[index], index),
    getScrollElement: () => p.scrollRef.current,
    overscan: 8,
  });

  if (p.loading) {
    return (
      <div role="rowgroup">
        {Array.from({ length: Math.min(p.pageSize, 5) }).map((_, i) => (
          <SkeletonRow
            key={i}
            mainCols={p.mainCols}
            sideCols={p.sideCols}
            minMainWidth={p.minMainWidth}
            hasSelection={Boolean(p.selection)}
            hasRowActions={Boolean(p.rowActions)}
            setMain={p.setMain}
            onMainScroll={p.onMainScroll}
          />
        ))}
      </div>
    );
  }

  if (!p.rows.length) {
    return (
      <div role="rowgroup">
        <EmptyRow count={count} message={p.emptyMessage} />
      </div>
    );
  }

  return (
    <div
      role="rowgroup"
      className="relative"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((item) => {
        const row = rows[item.index];

        return (
          <div
            key={item.key}
            ref={virtualizer.measureElement}
            data-index={item.index}
            className="absolute left-0 top-0 w-full"
            style={{ transform: `translateY(${item.start}px)` }}
          >
            <DataGridRow
              row={row}
              index={item.index}
              isLast={item.index === rows.length - 1}
              mainCols={p.mainCols}
              sideCols={p.sideCols}
              minMainWidth={p.minMainWidth}
              selection={p.selection}
              onRowClick={p.onRowClick}
              rowClassName={p.rowClassName}
              rowActions={p.rowActions}
              setMain={p.setMain}
              onMainScroll={p.onMainScroll}
              animate={false}
            />
          </div>
        );
      })}
    </div>
  );
}

function SkeletonRow<T>({
  mainCols,
  sideCols,
  minMainWidth,
  hasSelection,
  hasRowActions,
  setMain,
  onMainScroll,
}: {
  mainCols: DataGridTableColumn<T>[];
  sideCols: DataGridTableColumn<T>[];
  minMainWidth: string;
  hasSelection: boolean;
  hasRowActions: boolean;
  setMain: (node: HTMLDivElement | null) => void;
  onMainScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}) {
  const hasSide = sideCols.length > 0 || hasRowActions;

  return (
    <div role="row" className="flex w-full min-w-full border-b border-border/50">
      <div
        ref={setMain}
        onScroll={onMainScroll}
        className="min-w-0 flex-1 overflow-x-hidden"
      >
        <div className="flex" style={{ minWidth: minMainWidth }}>
          {hasSelection ? <SkeletonCell width="48px" /> : null}
          {mainCols.map((item) => (
            <SkeletonCell key={item.column.id} item={item} />
          ))}
        </div>
      </div>
      {hasSide ? (
        <div
          className={cn(
            "flex shrink-0 border-l border-border/70 bg-card",
            PINNED_SIDE_SHADOW,
          )}
        >
          {sideCols.map((item) => (
            <SkeletonCell key={item.column.id} item={item} />
          ))}
          {hasRowActions ? <SkeletonCell width={ROW_ACTIONS_WIDTH} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function EmptyRow({
  count,
  message,
}: {
  count: number;
  message: string;
}) {
  return (
    <div role="row" className="flex w-full min-w-full">
      <div
        role="cell"
        aria-colspan={count}
        className="flex-1 px-4 py-12 text-center text-sm font-semibold text-muted-foreground"
      >
        {message}
      </div>
    </div>
  );
}

function SkeletonCell<T>({
  item,
  width,
}: {
  item?: DataGridTableColumn<T>;
  width?: string;
}) {
  return (
    <div
      role="cell"
      style={{
        ...(item?.style ?? {
          flex: width ? `0 0 ${width}` : undefined,
          width,
          minWidth: width,
        }),
      }}
      className={cn(
        "box-border flex min-h-16 shrink-0 items-center p-4",
      )}
    >
      <span className="sr-only">로딩 중</span>
      <div aria-hidden="true" className="h-4 w-full rounded bg-muted" />
    </div>
  );
}
