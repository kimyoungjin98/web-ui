import type * as React from "react";
import { useCallback, useRef, useState } from "react";
import type { DataGridColumn, DataGridSelection, DataGridSort } from "../types";
import { DataGridBody } from "./body";
import { DataGridHeader } from "./header";
import { getDataGridTableLayout, ROW_ACTIONS_WIDTH } from "./layout";

type Props<T> = {
  ariaLabel?: string;
  columns: DataGridColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  loading: boolean;
  emptyMessage: string;
  pageSize: number;
  selection?: DataGridSelection<T>;
  sort: DataGridSort;
  tableColumnCount: number;
  minTableWidth: string;
  onSortChange?: (sort: DataGridSort) => void;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => React.ReactNode;
};

export function DataGridTable<T>(p: Props<T>) {
  const layout = getDataGridTableLayout(p.columns);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mainRefs = useRef(new Set<HTMLDivElement>());
  const syncing = useRef(false);
  const [mainWidth, setMainWidth] = useState<number | null>(null);
  const setMain = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      mainRefs.current.add(node);
      requestAnimationFrame(() => updateMainWidth());
    }
  }, []);
  const onMainScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (syncing.current) {
      return;
    }

    syncMain(event.currentTarget.scrollLeft, event.currentTarget);
  }, []);
  const onTableWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      const delta = event.deltaX || (event.shiftKey ? event.deltaY : 0);

      if (!delta) {
        return;
      }

      const scroller = findMainScroller();

      if (!scroller) {
        return;
      }

      const maxLeft = scroller.scrollWidth - scroller.clientWidth;
      const nextLeft = Math.max(
        0,
        Math.min(maxLeft, scroller.scrollLeft + delta),
      );

      if (nextLeft === scroller.scrollLeft) {
        return;
      }

      syncMain(nextLeft);
    },
    [],
  );

  function updateMainWidth() {
    const width = [...mainRefs.current].reduce((max, node) => {
      if (!node.isConnected) {
        mainRefs.current.delete(node);
        return max;
      }

      return Math.max(max, node.scrollWidth);
    }, 0);

    if (width > 0) {
      setMainWidth((current) => (current === width ? current : width));
    }
  }

  function findMainScroller() {
    return [...mainRefs.current].find((node) => {
      if (!node.isConnected) {
        mainRefs.current.delete(node);
        return false;
      }

      return node.scrollWidth > node.clientWidth;
    });
  }

  function syncMain(left: number, source?: HTMLDivElement) {
    syncing.current = true;
    updateMainWidth();

    for (const node of [...mainRefs.current]) {
      if (!node.isConnected) {
        mainRefs.current.delete(node);
        continue;
      }

      if (node !== source && node.scrollLeft !== left) {
        node.scrollLeft = left;
      }
    }

    syncing.current = false;
  }

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-auto overflow-y-auto"
      role="region"
      aria-label={p.ariaLabel ?? "데이터 표"}
    >
      <div
        role="table"
        aria-busy={p.loading || undefined}
        aria-colcount={p.tableColumnCount}
        className="w-full text-sm"
        onWheel={onTableWheel}
      >
        <DataGridHeader
          mainCols={layout.mainCols}
          sideCols={layout.sideCols}
          sort={p.sort}
          hasRowActions={Boolean(p.rowActions)}
          minMainWidth={p.minTableWidth}
          setMain={setMain}
          onMainScroll={onMainScroll}
          {...(p.selection ? { selection: p.selection } : {})}
          {...(p.onSortChange ? { onSortChange: p.onSortChange } : {})}
        />
        <DataGridBody
          {...p}
          mainCols={layout.mainCols}
          sideCols={layout.sideCols}
          minMainWidth={p.minTableWidth}
          scrollRef={scrollRef}
          setMain={setMain}
          onMainScroll={onMainScroll}
        />
        <DataGridScrollBar
          minMainWidth={p.minTableWidth}
          mainWidth={mainWidth}
          sideCols={layout.sideCols}
          hasRowActions={Boolean(p.rowActions)}
          setMain={setMain}
          onMainScroll={onMainScroll}
        />
      </div>
    </div>
  );
}

function DataGridScrollBar<T>({
  minMainWidth,
  mainWidth,
  sideCols,
  hasRowActions,
  setMain,
  onMainScroll,
}: {
  minMainWidth: string;
  mainWidth: number | null;
  sideCols: ReturnType<typeof getDataGridTableLayout<T>>["sideCols"];
  hasRowActions: boolean;
  setMain: (node: HTMLDivElement | null) => void;
  onMainScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}) {
  const hasSide = sideCols.length > 0 || hasRowActions;

  return (
    <div className="flex w-full min-w-full bg-card">
      <div
        ref={setMain}
        onScroll={onMainScroll}
        className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden"
      >
        <div
          className="h-2"
          style={
            mainWidth ? { width: `${mainWidth}px` } : { minWidth: minMainWidth }
          }
        />
      </div>
      {hasSide ? (
        <div className="flex h-2 shrink-0 border-l border-border/70 bg-card">
          {sideCols.map((item) => (
            <div key={item.column.id} style={item.style} />
          ))}
          {hasRowActions ? (
            <div
              style={{
                flex: `0 0 ${ROW_ACTIONS_WIDTH}`,
                width: ROW_ACTIONS_WIDTH,
                minWidth: ROW_ACTIONS_WIDTH,
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
