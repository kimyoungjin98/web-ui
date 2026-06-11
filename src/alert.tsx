"use client";

import * as React from "react";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type ConfirmAlertProps = {
  cancelLabel?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  defaultOpen?: boolean;
  description?: React.ReactNode;
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: React.ReactNode;
};

function ConfirmAlert({
  cancelLabel = "취소",
  children,
  confirmLabel = "확인",
  defaultOpen,
  description,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmAlertProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const dialogOpen = open ?? internalOpen;

  function handleOpenChange(nextOpen: boolean) {
    setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  function handleConfirm() {
    handleOpenChange(false);
    onConfirm();
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="max-w-sm p-0">
        <div className="border-b border-border px-5 py-4 pr-12 flex flex-col gap-2">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button type="button" variant="solid" color="primary" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmAlert };
