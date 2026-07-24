import { describe, expect, it } from "vitest";

import { getInputClassName } from "./input-style";

describe("getInputClassName", () => {
  it("applies the selected size and reserves space for input icons", () => {
    const className = getInputClassName({
      size: "lg",
      startIcon: true,
      endIcon: true,
      className: "text-right",
    });

    expect(className).toContain("h-11");
    expect(className).toContain("pl-8");
    expect(className).toContain("pr-8");
    expect(className).toContain("text-right");
  });
});
