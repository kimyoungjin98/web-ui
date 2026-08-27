"use client";

import type { ReactNode } from "react";

import { useState } from "react";
import { Button } from "../button/button";
import { resolveSelectDialogPortalContainer } from "../dialog/select-dialog-portal";
import Icon from "../icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type DotsDropdownItem = {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  onSelect: () => void;
  variant?: "default" | "destructive";
};

export function DotsDropdown({
  ariaLabel,
  disabled = false,
  items,
}: {
  ariaLabel: string;
  disabled?: boolean;
  items: DotsDropdownItem[];
}) {
  const [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={setTriggerRef}
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 bg-background"
          disabled={disabled}
          aria-label={ariaLabel}
        >
          <Icon name="lucide:more-horizontal" className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        portalContainer={resolveSelectDialogPortalContainer(triggerRef)}
        align="end"
        className="min-w-32"
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={item.disabled}
            variant={item.variant}
            onSelect={item.onSelect}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
