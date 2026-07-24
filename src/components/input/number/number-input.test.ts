import { describe, expect, it } from "vitest";

import { getNumberInputValue } from "./number-input";

describe("getNumberInputValue", () => {
  it("keeps the formatted numeric value and converts an empty value to zero", () => {
    expect(getNumberInputValue(1234)).toBe(1234);
    expect(getNumberInputValue(undefined)).toBe(0);
  });
});
