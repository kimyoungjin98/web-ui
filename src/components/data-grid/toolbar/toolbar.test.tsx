// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { DataGridToolbar } from "./toolbar";

afterEach(cleanup);

function ToolbarHarness() {
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <>
      <output aria-label="선택된 페이지 크기">{pageSize}</output>
      <DataGridToolbar
        search=""
        searchable={false}
        selectedCount={0}
        pageSize={pageSize}
        pageSizeOptions={[25]}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}

describe("DataGridToolbar page size", () => {
  it("adds an integer to the options without selecting it", async () => {
    render(<ToolbarHarness />);

    fireEvent.click(
      screen.getByRole("button", { name: "페이지 크기 옵션 추가" }),
    );
    fireEvent.change(screen.getByLabelText("추가할 페이지 크기"), {
      target: { value: "35" },
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(screen.getByLabelText("선택된 페이지 크기").textContent).toBe("10");

    fireEvent.click(screen.getByRole("button", { name: "페이지당 행 수" }));
    expect(screen.getByRole("option", { name: "25" })).not.toBeNull();
    fireEvent.click(screen.getByRole("option", { name: "35" }));

    await waitFor(() =>
      expect(screen.getByLabelText("선택된 페이지 크기").textContent).toBe(
        "35",
      ),
    );
  });

  it("rejects invalid and duplicate options", () => {
    render(<ToolbarHarness />);

    fireEvent.click(
      screen.getByRole("button", { name: "페이지 크기 옵션 추가" }),
    );
    fireEvent.change(screen.getByLabelText("추가할 페이지 크기"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));
    expect(screen.getByRole("alert").textContent).toBe(
      "1 이상의 정수를 입력하세요.",
    );

    fireEvent.change(screen.getByLabelText("추가할 페이지 크기"), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));
    expect(screen.getByRole("alert").textContent).toBe(
      "이미 등록된 옵션입니다.",
    );
  });
});
