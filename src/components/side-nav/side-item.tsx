"use client";

import Icon from "../icon";
import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "../../libs/tailwind-util";
import { Paragraph } from "../typography/paragraph";

export type SideMenu = {
  label: string;
  icon?: string;
  left?: ReactNode;
  children?: SideMenu[];
  active?: boolean;
  disabled?: boolean;
  isSidebarCollapsed?: boolean;
  onClick?: () => void;
};

export function SideItem({ menu }: { menu: SideMenu }) {
  const isSidebarCollapsed = menu.isSidebarCollapsed ?? false;
  const activeStyle = "bg-foreground/15 text-base-content";
  const inactiveStyle =
    "text-muted-foreground/80 hover:bg-muted-foreground/20 hover:text-base-content";
  const active = menu.active ?? false;
  const activeLabel = getActiveLabel(menu);
  const [expanded, setExpanded] = useState(Boolean(activeLabel));
  const groupId = useId();
  const hasChildren = Boolean(menu.children?.length);
  const showChildren = expanded && !isSidebarCollapsed;

  useEffect(() => {
    if (activeLabel) setExpanded(true);
  }, [activeLabel]);

  const buttonClassName = cn(
    "active:scale-95 transition-all flex w-full cursor-pointer items-center rounded-lg py-1.5 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
    isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3",
    active ? activeStyle : inactiveStyle,
  );

  if (hasChildren) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          aria-label={menu.label}
          aria-expanded={showChildren}
          aria-controls={groupId}
          title={menu.label}
          disabled={menu.disabled}
          onClick={() => {
            setExpanded((current) => !current);
            menu.onClick?.();
          }}
          className={buttonClassName}
        >
          {menu.icon && <Icon name={menu.icon} className="size-5" />}
          {menu.left && <>{menu.left}</>}
          <Paragraph typography="t6">
            <span className={isSidebarCollapsed ? "sr-only" : undefined}>
              {menu.label}
            </span>
          </Paragraph>
          {isSidebarCollapsed ? null : (
            <Icon
              name={expanded ? "lucide:chevron-up" : "lucide:chevron-down"}
              className="ml-auto size-4"
            />
          )}
        </button>
        {!showChildren ? null : (
          <div
            id={groupId}
            className="ml-4 flex flex-col gap-1 border-l border-border pl-2"
          >
            {menu.children?.map((child) => (
              <SideItem
                key={child.label}
                menu={{ ...child, isSidebarCollapsed }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={menu.onClick}
      aria-label={menu.label}
      aria-current={active ? "page" : undefined}
      title={menu.label}
      disabled={menu.disabled}
      className={buttonClassName}
    >
      {menu.icon && <Icon name={menu.icon} className="size-5" />}
      {menu.left && <>{menu.left}</>}
      <Paragraph typography="t6">
        <span className={isSidebarCollapsed ? "sr-only" : undefined}>
          {menu.label}
        </span>
      </Paragraph>
    </button>
  );
}

function getActiveLabel(menu: SideMenu): string | undefined {
  if (menu.active) return menu.label;
  for (const child of menu.children ?? []) {
    const activeLabel = getActiveLabel(child);
    if (activeLabel) return activeLabel;
  }
}
