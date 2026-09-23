import type { ComponentProps } from "react";
import { cn } from "../../libs/tailwind-util";

export type SideNavProps = ComponentProps<"aside"> & {
  isSidebarCollapsed?: boolean;
};

export function SideNav({
  className,
  isSidebarCollapsed = false,
  ...props
}: SideNavProps) {
  return (
    <aside
      data-slot="side-nav"
      data-collapsed={isSidebarCollapsed}
      className={cn(
        "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-background transition-[width,padding] duration-200 ease-out motion-reduce:transition-none md:flex",
        isSidebarCollapsed ? "w-18" : "w-60",
        className,
      )}
      {...props}
    />
  );
}
