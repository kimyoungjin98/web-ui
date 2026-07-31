// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MultiSelect } from "./multi-select/multi-select";
import { SearchSelect } from "./search-select/search-select";
import { Select } from "./select";

afterEach(cleanup);

describe("option-based Select", () => {
  it("renders options and emits a single selected value", () => {
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="역할"
        options={[
          { value: "ADMIN", label: "관리자" },
          { value: "USER", label: "일반 사용자" },
        ]}
        placeholder="역할 선택"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "역할" }));
    fireEvent.click(screen.getByRole("option", { name: "관리자" }));

    expect(onValueChange).toHaveBeenCalledWith("ADMIN");
  });

  it("only renders a trigger title when consumers explicitly provide one", () => {
    const { rerender } = render(
      <>
        <SearchSelect options={[]} placeholder="업체 선택" />
        <MultiSelect
          label="담당자"
          options={[]}
          value={[]}
          onValueChange={vi.fn()}
        />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "업체 선택" }).getAttribute("title"),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "담당자" }).getAttribute("title"),
    ).toBeNull();

    rerender(
      <>
        <SearchSelect
          options={[]}
          placeholder="업체 선택"
          title="업체 고르기"
        />
        <MultiSelect
          label="담당자"
          options={[]}
          value={[]}
          title="담당자 고르기"
          onValueChange={vi.fn()}
        />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "업체 선택" }).getAttribute("title"),
    ).toBe("업체 고르기");
    expect(
      screen.getByRole("button", { name: "담당자" }).getAttribute("title"),
    ).toBe("담당자 고르기");
  });

  it("filters options and reports the query in searchable mode", () => {
    const onSearchChange = vi.fn();

    render(
      <Select
        aria-label="업체"
        searchable
        options={[
          { value: "seoul", label: "서울" },
          { value: "busan", label: "부산" },
        ]}
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "업체" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "부" },
    });

    expect(onSearchChange).toHaveBeenCalledWith("부");
    expect(screen.getByRole("option", { name: "부산" })).not.toBeNull();
    expect(screen.queryByRole("option", { name: "서울" })).toBeNull();
  });

  it("toggles array values without closing in multiple mode", () => {
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="담당자"
        multiple
        options={[{ value: "min", label: "민수" }]}
        value={[]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "담당자" }));
    fireEvent.click(screen.getByRole("option", { name: "민수" }));

    expect(onValueChange).toHaveBeenCalledWith(["min"]);
    expect(screen.getByRole("listbox")).not.toBeNull();
  });

  it("creates and selects an unmatched query in searchable single mode", async () => {
    const onCreateOption = vi.fn().mockResolvedValue({
      value: "incheon",
      label: "인천",
    });
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="업체"
        searchable
        options={[]}
        onCreateOption={onCreateOption}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "업체" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "인천" },
    });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    expect(onCreateOption).toHaveBeenCalledWith("인천");
    await vi.waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("incheon");
    });
  });
});
