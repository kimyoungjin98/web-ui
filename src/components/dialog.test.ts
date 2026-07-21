import { describe, expect, it } from "vitest";

import { shouldPreventDialogOutsideInteraction } from "./dialog";

describe("shouldPreventDialogOutsideInteraction", () => {
  it("keeps a dialog open for an interaction in a portalled select menu", () => {
    const target = {
      closest: (selector: string) =>
        selector.includes("[data-slot='select-content']") ? {} : null,
    };

    expect(shouldPreventDialogOutsideInteraction(target)).toBe(true);
  });

  it("does not prevent dismissal for an ordinary outside interaction", () => {
    expect(shouldPreventDialogOutsideInteraction(null)).toBe(false);
  });
});
