import { describe, expect, it } from "vitest";

import {
  DEFAULT_DATA_GRID_PAGE_SIZE_OPTIONS,
  getDataGridPageSizeOptions,
  parseDataGridPageSize,
} from "./page-size";

describe("data grid page size", () => {
  it("uses the standard page size options", () => {
    expect(DEFAULT_DATA_GRID_PAGE_SIZE_OPTIONS).toEqual([10, 20, 50, 100]);
  });

  it("adds custom integers to the defaults", () => {
    expect(getDataGridPageSizeOptions(30, [25, 200])).toEqual([
      10, 20, 25, 30, 50, 100, 200,
    ]);
  });

  it("removes duplicates and invalid options", () => {
    expect(getDataGridPageSizeOptions(10, [20, 20, 0, -1, 1.5])).toEqual([
      10, 20, 50, 100,
    ]);
  });

  it("only parses positive safe integers", () => {
    expect(parseDataGridPageSize(" 35 ")).toBe(35);
    expect(parseDataGridPageSize("0")).toBeNull();
    expect(parseDataGridPageSize("1.5")).toBeNull();
    expect(parseDataGridPageSize("abc")).toBeNull();
  });
});
