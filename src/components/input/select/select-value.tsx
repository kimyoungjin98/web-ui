"use client";
import * as React from "react";
import { useSelectContext } from "./select-context";
export function SelectValue({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const { options, value } = useSelectContext();
  return (
    <span
      data-slot="select-value"
      className={
        !options.some((option) => option.value === value)
          ? "text-muted-foreground"
          : undefined
      }
    >
      {options.find((option) => option.value === value)?.label ||
        placeholder ||
        children}
    </span>
  );
}
