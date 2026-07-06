"use client";

import * as React from "react";

import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

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
      <DialogContent className="max-w-[24rem] p-0">
        <DialogHeader className="gap-2">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="solid"
            color="primary"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmAlert };
