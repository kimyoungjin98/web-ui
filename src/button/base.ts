import type { ButtonSize, ButtonVariant } from "./types";

export const buttonBase =
  "select-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm! font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export const buttonSizes: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6",
  icon: "size-10",
};

export const buttonVariantBase: Record<ButtonVariant, string> = {
  solid: "shadow-xs",
  outline: "shadow-xs border",
  ghost: "",
};
