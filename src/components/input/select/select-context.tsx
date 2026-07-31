"use client";

import * as React from "react";

import type { FormSize } from "../../form-size";

export type DeclaredSelectOption = {
  disabled: boolean;
  label: React.ReactNode;
  value: string;
};

export type SelectDirection = "first" | "last" | "next" | "previous";

export type SelectContextValue = {
  activeValue: string;
  disabled: boolean;
  moveActive: (direction: SelectDirection) => void;
  open: boolean;
  openFromKeyboard: (direction: "first" | "last") => void;
  options: DeclaredSelectOption[];
  registerOption: (option: DeclaredSelectOption) => void;
  select: (value: string) => void;
  setActiveValue: (value: string) => void;
  setOpen: (open: boolean) => void;
  size: FormSize;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  value: string;
};

export const SelectContext = React.createContext<SelectContextValue | null>(
  null,
);

export function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context)
    throw new Error("Select components must be used within Select.");
  return context;
}
