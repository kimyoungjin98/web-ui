"use client";

import * as React from "react";

import { CompoundSelect } from "./select-compound";
import { OptionSelect } from "./select-option";
import type {
  CompoundSelectProps,
  OptionSelectProps,
  SelectOption,
} from "./libs/select-types";

export type { OptionSelectProps, SelectOption } from "./libs/select-types";
export { SelectContent } from "./select-content";
export { SelectItem } from "./select-item";
export { SelectTrigger } from "./select-trigger";
export { composeSelectRefs } from "./libs/select-utils";
export { SelectValue } from "./select-value";

function Select(props: CompoundSelectProps): React.ReactElement;

function Select<TOption extends SelectOption>(
  props: OptionSelectProps<TOption>,
): React.ReactElement;

function Select<TOption extends SelectOption>(
  props: CompoundSelectProps | OptionSelectProps<TOption>,
) {
  if ("options" in props)
    return <OptionSelect {...(props as OptionSelectProps<TOption>)} />;
  return <CompoundSelect {...props} />;
}

export { Select };
