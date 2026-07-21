"use client";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="ui-page-transition-enter">{children}</div>;
}
