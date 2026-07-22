import { describe, expect, it } from "vitest";

import { resolveSelectPortalContainer } from "./select";

describe("resolveSelectPortalContainer", () => {
  it("uses the containing dialog as the select portal container", () => {
    const dialogContent = {};
    const trigger = {
      closest: (selector: string) =>
        selector === "[data-slot='dialog-content']" ? dialogContent : null,
    };

    expect(resolveSelectPortalContainer(trigger)).toBe(dialogContent);
  });

  it("uses the default portal container outside a dialog", () => {
    expect(resolveSelectPortalContainer(null)).toBeUndefined();
  });
});
