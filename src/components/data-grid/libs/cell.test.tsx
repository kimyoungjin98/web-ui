import { describe, expect, it } from "vitest";

import type { DataGridColumn } from "../types";
import { resolveCellContent } from "./cell";

type Row = {
  active: boolean;
  count: number;
};

describe("resolveCellContent", () => {
  it("preserves falsy values read through the column id fallback", () => {
    const countColumn: DataGridColumn<Row> = {
      id: "count",
      header: "Count",
    };
    const activeColumn: DataGridColumn<Row> = {
      id: "active",
      header: "Active",
    };

    expect(resolveCellContent({ count: 0, active: false }, countColumn, 0)).toBe(
      "0",
    );
    expect(
      resolveCellContent({ count: 0, active: false }, activeColumn, 0),
    ).toBe("false");
  });
});
