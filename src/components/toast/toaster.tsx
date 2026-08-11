"use client";

import type { MouseEvent } from "react";
import {
  Toaster as Sonner,
  toast as sonnerToast,
  type ToasterProps,
} from "sonner";

type SonnerToastRecord = {
  id: number | string;
  dismiss?: boolean;
  position?: ToasterProps["position"];
};

function getClickedToastId(toastElement: HTMLElement) {
  const toastIndex = Number(toastElement.dataset.index);

  if (!Number.isInteger(toastIndex)) {
    return null;
  }

  const toastPosition = [
    toastElement.dataset.yPosition,
    toastElement.dataset.xPosition,
  ].join("-") as ToasterProps["position"];
  const toasts = sonnerToast.getToasts().reduce<SonnerToastRecord[]>(
    (visibleToasts, toast) => {
      if (!("id" in toast)) {
        return visibleToasts;
      }

      const toastRecord = toast as SonnerToastRecord;

      if (
        !toastRecord.dismiss &&
        (!toastRecord.position || toastRecord.position === toastPosition)
      ) {
        visibleToasts.push(toastRecord);
      }

      return visibleToasts;
    },
    [],
  );

  return toasts[toasts.length - 1 - toastIndex]?.id ?? null;
}

function handleToastClick(event: MouseEvent<HTMLDivElement>) {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.closest("button,a,[role='button']")) {
    return;
  }

  const toastElement = target.closest<HTMLElement>("[data-sonner-toast]");

  if (!toastElement) {
    return;
  }

  const toastId = getClickedToastId(toastElement);

  if (toastId !== null) {
    sonnerToast.dismiss(toastId);
  }
}

export function Toaster(props: ToasterProps) {
  return (
    <div className="contents" onClickCapture={handleToastClick}>
      <Sonner
        position="top-right"
        visibleToasts={4}
        toastOptions={{
          classNames: {
            toast:
              "cursor-pointer border-border bg-card text-base-content shadow-lg rounded-md font-medium ring-1 ring-border/50",
            title: "text-sm font-bold",
            description: "text-xs font-semibold text-muted-foreground",
            icon: "text-current",
            success:
              "border-l-4 border-l-success text-success-soft-foreground [&_[data-description]]:text-success-soft-foreground/80 [&_[data-icon]]:text-success-soft-foreground [&_[data-icon]_svg]:text-success-soft-foreground [&_[data-title]]:text-success-soft-foreground",
            error:
              "border-l-4 border-l-destructive text-destructive [&_[data-description]]:text-destructive/80 [&_[data-icon]]:text-destructive [&_[data-icon]_svg]:text-destructive [&_[data-title]]:text-destructive",
            warning:
              "border-l-4 border-l-warning text-warning-soft-foreground [&_[data-description]]:text-warning-soft-foreground/80 [&_[data-icon]]:text-warning-soft-foreground [&_[data-icon]_svg]:text-warning-soft-foreground [&_[data-title]]:text-warning-soft-foreground",
            info: "border-l-4 border-l-info text-info-soft-foreground [&_[data-description]]:text-info-soft-foreground/80 [&_[data-icon]]:text-info-soft-foreground [&_[data-icon]_svg]:text-info-soft-foreground [&_[data-title]]:text-info-soft-foreground",
            actionButton: "bg-primary text-primary-foreground",
            cancelButton: "bg-secondary text-secondary-foreground",
          },
        }}
        {...props}
      />
    </div>
  );
}
