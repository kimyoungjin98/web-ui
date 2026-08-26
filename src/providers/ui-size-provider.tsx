"use client";

import * as React from "react";

import type { ButtonSize } from "../components/button/types";
import type { CheckboxSize } from "../components/checkbox";
import type { DataGridDensity } from "../components/data-grid/types";
import type { FormSize } from "../components/form-size";
import type { ToggleSize } from "../components/toggle";

type SpinnerSize = "sm" | "default" | "lg";

export type UiSizeDefaults = {
  button: ButtonSize;
  checkbox: CheckboxSize;
  dataGridDensity: DataGridDensity;
  datePicker: FormSize;
  dateRangePicker: FormSize;
  input: FormSize;
  monthPicker: FormSize;
  numberInput: FormSize;
  searchSelect: FormSize;
  select: FormSize;
  spinner: SpinnerSize;
  tabs: FormSize;
  toggle: ToggleSize;
  yearPicker: FormSize;
};

const UiSizeContext = React.createContext<Partial<UiSizeDefaults>>({});

type UiSizeProviderProps = React.PropsWithChildren<{
  sizes: Partial<UiSizeDefaults>;
}>;

/**
 * 컴포넌트의 기본 UI 사이즈를 설정하는 Provider입니다.
 * @param param0
 * @returns
 */
export function UiSizeProvider({ children, sizes }: UiSizeProviderProps) {
  return (
    <UiSizeContext.Provider value={sizes}>{children}</UiSizeContext.Provider>
  );
}

export function useUiSize<TKey extends keyof UiSizeDefaults>(
  key: TKey,
  size: UiSizeDefaults[TKey] | undefined,
  fallback: UiSizeDefaults[TKey],
): UiSizeDefaults[TKey] {
  const sizes = React.useContext(UiSizeContext);

  return size ?? sizes[key] ?? fallback;
}
