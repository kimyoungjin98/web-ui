import * as React from "react";
import Icon from "../../icon";

type ActionsButtonProps = React.ComponentPropsWithoutRef<"button">;

export const ActionsButton = React.forwardRef<HTMLButtonElement, ActionsButtonProps>(
  ({ className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      aria-label="액션 더보기"
      className={`grid size-8 cursor-pointer place-items-center rounded-md text-gray-500 hover:bg-muted hover:text-primary ${className ?? ""}`}
      {...props}
    >
      <Icon name="lucide:more-horizontal" className="size-4" />
    </button>
  );
  },
);

ActionsButton.displayName = "ActionsButton";
