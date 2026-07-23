export type FormSize = "xs" | "sm" | "default" | "lg";

type FormSizeStyle = {
  height: string;
  icon: string;
  inputPadding: string;
  selectItem: string;
  text: string;
};

const FORM_SIZES: Record<FormSize, FormSizeStyle> = {
  xs: {
    height: "h-7",
    icon: "left-2 size-3.5",
    inputPadding: "px-2",
    selectItem: "py-1 pl-7 pr-1.5 text-xs",
    text: "text-xs",
  },
  sm: {
    height: "h-8",
    icon: "left-2.5 size-4",
    inputPadding: "px-2.5",
    selectItem: "py-1 pl-7 pr-2 text-xs",
    text: "text-sm",
  },
  default: {
    height: "h-9",
    icon: "left-2.5 size-4",
    inputPadding: "px-3",
    selectItem: "py-1.5 pl-8 pr-2 text-sm",
    text: "text-sm",
  },
  lg: {
    height: "h-11",
    icon: "left-3 size-5",
    inputPadding: "px-3.5",
    selectItem: "py-2 pl-9 pr-3 text-base",
    text: "text-base",
  },
};

export function getFormSize(size: FormSize = "default"): FormSizeStyle {
  return FORM_SIZES[size];
}
