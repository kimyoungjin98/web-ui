import type { ButtonSize, ButtonVariant } from "./types";

export const buttonBase =
  "active:scale-95 cursor-pointer select-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export const buttonSizes: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 text-sm",
  xs: "h-7 px-2.5 py-1 !text-xs",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-base",
  icon: "size-10",
};

export const buttonVariantBase: Record<ButtonVariant, string> = {
  solid: "border border-transparent",
  outline: "border",
  ghost: "",
  link: "underline-offset-4 hover:underline",
};
