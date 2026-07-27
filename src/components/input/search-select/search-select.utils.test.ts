import { describe, expect, it } from "vitest";

import {
  canCreateSearchSelectOption,
  createSearchSelectOption,
  filterSearchSelectOptions,
} from "./search-select.utils";

const options = [
  { value: "seoul", label: "서울", keywords: ["Seoul", "SEO"] },
  { value: "busan", label: "부산" },
];

describe("search select options", () => {
  it("matches labels and keywords without case sensitivity", () => {
    expect(filterSearchSelectOptions(options, "seo")).toEqual([options[0]]);
  });

  it("allows creating only a non-empty query with no matches", () => {
    expect(canCreateSearchSelectOption("  Incheon  ", [])).toBe(true);
    expect(canCreateSearchSelectOption("   ", [])).toBe(false);
    expect(canCreateSearchSelectOption("Seoul", [options[0]])).toBe(false);
  });

  it("passes a trimmed unmatched query to the creator and returns its option", async () => {
    const createOption = async (query: string) => ({
      value: query.toLowerCase(),
      label: query,
    });

    await expect(
      createSearchSelectOption("  Incheon  ", [], createOption),
    ).resolves.toEqual({ value: "incheon", label: "Incheon" });
  });
});
