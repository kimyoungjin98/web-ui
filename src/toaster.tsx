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
              "cursor-pointer border-border bg-white text-foreground shadow-[0_16px_44px_rgba(15,23,42,0.14)] rounded-md font-medium ring-1 ring-black/5",
            title: "text-sm font-bold",
            description: "text-xs font-semibold text-muted-foreground",
            icon: "text-current",
            success:
              "border-l-4 border-l-emerald-500 text-emerald-600 [&_[data-description]]:text-emerald-700/80 [&_[data-icon]]:text-emerald-600 [&_[data-icon]_svg]:text-emerald-600 [&_[data-title]]:text-emerald-700",
            error:
              "border-l-4 border-l-destructive text-destructive [&_[data-description]]:text-destructive/80 [&_[data-icon]]:text-destructive [&_[data-icon]_svg]:text-destructive [&_[data-title]]:text-destructive",
            warning:
              "border-l-4 border-l-amber-500 text-amber-600 [&_[data-description]]:text-amber-700/80 [&_[data-icon]]:text-amber-600 [&_[data-icon]_svg]:text-amber-600 [&_[data-title]]:text-amber-700",
            info: "border-l-4 border-l-primary text-primary [&_[data-description]]:text-primary/80 [&_[data-icon]]:text-primary [&_[data-icon]_svg]:text-primary [&_[data-title]]:text-primary",
            actionButton: "bg-primary text-primary-foreground",
            cancelButton: "bg-secondary text-secondary-foreground",
          },
        }}
        {...props}
      />
    </div>
  );
}
