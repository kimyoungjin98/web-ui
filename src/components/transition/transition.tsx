"use client";

import * as React from "react";

import { cn } from "../../libs/tailwind-util";

type TransitionPreset = "fade" | "scale" | "slide-down" | "slide-up";

type TransitionProps = Omit<React.ComponentProps<"div">, "children"> & {
  children: React.ReactNode;
  /** 전환할 요소의 표시 여부입니다. */
  show: boolean;
  /** 전환 효과입니다. */
  preset?: TransitionPreset;
  /** 전환 시간(ms)입니다. */
  duration?: number;
  /** CSS timing function입니다. */
  easing?: string;
  /** 숨김 전환이 완료된 뒤 DOM에서 제거할지 여부입니다. */
  unmountOnExit?: boolean;
};

const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      children,
      className,
      duration = 180,
      easing = "cubic-bezier(0.2, 0, 0, 1)",
      onTransitionEnd,
      preset = "fade",
      show,
      style,
      unmountOnExit = true,
      ...props
    },
    ref,
  ) => {
    const [isMounted, setIsMounted] = React.useState(show);
    const [isVisible, setIsVisible] = React.useState(show);

    React.useEffect(() => {
      if (!show) {
        setIsVisible(false);

        if (duration === 0 && unmountOnExit) {
          setIsMounted(false);
        }

        return;
      }

      setIsMounted(true);
      const frame = window.requestAnimationFrame(() => setIsVisible(true));

      return () => window.cancelAnimationFrame(frame);
    }, [duration, show, unmountOnExit]);

    if (!isMounted) {
      return null;
    }

    return (
      <div
        {...props}
        ref={ref}
        aria-hidden={!isVisible || undefined}
        className={cn(
          "ui-transition",
          `ui-transition--${preset}`,
          !isVisible && "pointer-events-none",
          className,
        )}
        data-state={isVisible ? "open" : "closed"}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "opacity" &&
            !show &&
            unmountOnExit
          ) {
            setIsMounted(false);
          }

          onTransitionEnd?.(event);
        }}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: easing,
        }}
      >
        {children}
      </div>
    );
  },
);
Transition.displayName = "Transition";

export { Transition };
export type { TransitionPreset, TransitionProps };
