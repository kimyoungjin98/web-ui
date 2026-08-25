"use client";

import * as React from "react";

import { cn } from "../libs/tailwind-util";
import { Badge } from "./badge";
import { Button } from "./button/button";
import Icon from "./icon";

export type FilterPanelAppliedFilter = {
  id: React.Key;
  label: string;
  onRemove: () => void;
};

export type FilterPanelProps = {
  activeCount?: number;
  appliedFilters?: readonly FilterPanelAppliedFilter[];
  children: React.ReactNode;
  className?: string;
  onReset: () => void;
  resetDisabled?: boolean;
  title?: string;
};

const EMPTY_APPLIED_FILTERS: readonly FilterPanelAppliedFilter[] = [];

export function FilterPanel({
  activeCount,
  appliedFilters = EMPTY_APPLIED_FILTERS,
  children,
  className,
  onReset,
  resetDisabled,
  title = "필터",
}: FilterPanelProps) {
  const titleId = React.useId();
  const resolvedActiveCount = activeCount ?? appliedFilters.length;
  const isResetDisabled = resetDisabled ?? resolvedActiveCount === 0;

  return (
    <section
      data-slot="filter-panel"
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-4 rounded-md border border-border bg-card p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon name="lucide:list-filter" className="size-4" />
          </span>
          <div className="flex items-center gap-2">
            <h2 id={titleId} className="font-semibold">
              {title}
            </h2>
            {resolvedActiveCount > 0 ? (
              <Badge color="primary" variant="solid">
                {resolvedActiveCount}
              </Badge>
            ) : null}
          </div>
        </div>

        <Button asChild size="sm" variant="outline" disabled={isResetDisabled}>
          <button type="button" disabled={isResetDisabled} onClick={onReset}>
            <Icon name="mdi:reload" />
            초기화
          </button>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {children}
      </div>

      {appliedFilters.length > 0 ? (
        <div
          aria-label="적용 중인 필터"
          className="flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-3"
        >
          <span className="text-xs font-medium text-muted-foreground">
            적용 중
          </span>
          {appliedFilters.map((filter) => (
            <Badge key={filter.id} color="primary" className="gap-1 pr-1">
              {filter.label}
              <button
                type="button"
                aria-label={`${filter.label} 필터 해제`}
                className="grid size-4 cursor-pointer place-items-center rounded-sm text-current/70 transition-colors hover:bg-primary/15 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={filter.onRemove}
              >
                <Icon name="mdi:close" className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </section>
  );
}
