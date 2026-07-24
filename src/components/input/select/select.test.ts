import { describe, expect, it } from "vitest";

import { composeSelectRefs, resolveSelectPortalContainer } from "./select";

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

describe("composeSelectRefs", () => {
  it("preserves callback cleanup and detaches refs without cleanup", () => {
    const trigger = {};
    const portalTriggerValues: Array<object | null> = [];
    const callerValues: Array<object | null> = [];
    const objectRef = { current: null as object | null };
    let callerCleanupCount = 0;
    const triggerRef = composeSelectRefs<object>(
      (value) => {
        portalTriggerValues.push(value);
      },
      (value) => {
        callerValues.push(value);
        return () => {
          callerCleanupCount += 1;
        };
      },
      objectRef,
    );

    const cleanup = triggerRef(trigger);

    expect(portalTriggerValues).toEqual([trigger]);
    expect(callerValues).toEqual([trigger]);
    expect(objectRef.current).toBe(trigger);
    expect(cleanup).toBeTypeOf("function");

    cleanup?.();

    expect(portalTriggerValues).toEqual([trigger, null]);
    expect(callerCleanupCount).toBe(1);
    expect(objectRef.current).toBeNull();
  });
});
