import { describe, expect, it } from "vitest";

import { COLOR_TOKENS } from "../../themes/color-token";
import { getButtonColorClass } from "./colors";
import type { ButtonVariant } from "./types";

const variants: ButtonVariant[] = ["solid", "outline", "ghost", "link"];

describe("button color classes", () => {
  it.each(variants)("supports every %s color", (variant) => {
    for (const color of COLOR_TOKENS) {
      expect(getButtonColorClass(variant, color)).toBeTruthy();
    }
  });

  it("uses opaque hover feedback for solid semantic colors", () => {
    for (const color of COLOR_TOKENS.filter((token) => token !== "primary")) {
      expect(getButtonColorClass("solid", color)).toContain(
        "hover:brightness-95",
      );
    }
  });

  it("uses the same border opacity across outline colors", () => {
    for (const color of COLOR_TOKENS) {
      expect(getButtonColorClass("outline", color)).toContain(
        `border-${color}/30`,
      );
    }
  });

  it("honors color selection for link buttons", () => {
    expect(getButtonColorClass("link", "destructive")).toContain(
      "text-destructive",
    );
  });
});
