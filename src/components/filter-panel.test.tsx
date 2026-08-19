// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FilterPanel } from "./filter-panel";

afterEach(cleanup);

describe("FilterPanel", () => {
  it("disables reset when there are no active filters", () => {
    render(
      <FilterPanel onReset={vi.fn()}>
        <span>필터 컨트롤</span>
      </FilterPanel>,
    );

    expect(
      (screen.getByRole("button", { name: "초기화" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it("exposes reset and individual filter removal actions", () => {
    const onReset = vi.fn();
    const onRemove = vi.fn();

    render(
      <FilterPanel
        title="사용자 필터"
        appliedFilters={[{ id: "active", label: "승인됨", onRemove }]}
        onReset={onReset}
      >
        <span>필터 컨트롤</span>
      </FilterPanel>,
    );

    expect(screen.getByRole("heading", { name: "사용자 필터" })).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "초기화" }));
    fireEvent.click(screen.getByRole("button", { name: "승인됨 필터 해제" }));

    expect(onReset).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
