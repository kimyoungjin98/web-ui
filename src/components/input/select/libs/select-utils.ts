import type * as React from "react";

export function resolveSelectPortalContainer<T>(
  trigger: { closest: (selector: string) => T | null } | null,
): T | undefined {
  // Keep the popover inside a dialog so its stacking context and focus handling remain intact.
  return trigger?.closest("[data-slot='dialog-content']") ?? undefined;
}

export function composeSelectRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") return ref(value);
      if (ref) ref.current = value;
      return undefined;
    });
    if (cleanups.some((cleanup) => typeof cleanup === "function")) {
      return () => {
        // React callback refs may return cleanup functions; run them before detaching every ref.
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === "function") cleanup();
          const ref = refs[index];
          if (typeof ref === "function") ref(null);
          else if (ref) ref.current = null;
        });
      };
    }
  };
}
