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
} from "../dialog";

type AppAlertVariant = "error" | "info" | "success" | "warning";

type AppAlertOptions = {
  confirmLabel?: string;
  description?: React.ReactNode;
  onConfirm?: () => void;
};

type AppAlertState = AppAlertOptions & {
  id: number;
  title: React.ReactNode;
  variant: AppAlertVariant;
};

type AppAlertListener = (alert: AppAlertState) => void;

const appAlertListeners = new Set<AppAlertListener>();

function subscribeAppAlert(listener: AppAlertListener) {
  appAlertListeners.add(listener);
  return () => {
    appAlertListeners.delete(listener);
  };
}

function publishAppAlert(alert: Omit<AppAlertState, "id">) {
  const nextAlert = {
    ...alert,
    id: Date.now(),
  };

  appAlertListeners.forEach((listener) => listener(nextAlert));
}

function normalizeAlertOptions(
  descriptionOrOptions?: React.ReactNode | AppAlertOptions,
  options?: AppAlertOptions,
): AppAlertOptions {
  if (isAlertOptions(descriptionOrOptions)) {
    return descriptionOrOptions;
  }

  return {
    ...options,
    description: descriptionOrOptions,
  };
}

function isAlertOptions(
  value: React.ReactNode | AppAlertOptions,
): value is AppAlertOptions {
  if (!value || typeof value !== "object" || React.isValidElement(value)) {
    return false;
  }

  return (
    "confirmLabel" in value || "description" in value || "onConfirm" in value
  );
}

function createAppAlert(variant: AppAlertVariant) {
  return (
    title: React.ReactNode,
    descriptionOrOptions?: React.ReactNode | AppAlertOptions,
    options?: AppAlertOptions,
  ) => {
    publishAppAlert({
      ...normalizeAlertOptions(descriptionOrOptions, options),
      title,
      variant,
    });
  };
}

const appAlert = {
  error: createAppAlert("error"),
  info: createAppAlert("info"),
  success: createAppAlert("success"),
  warning: createAppAlert("warning"),
};

function AppAlertHost() {
  const [alert, setAlert] = React.useState<AppAlertState | null>(null);

  React.useEffect(() => subscribeAppAlert(setAlert), []);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setAlert(null);
    }
  }

  function handleConfirm() {
    const onConfirm = alert?.onConfirm;
    setAlert(null);
    onConfirm?.();
  }

  if (!alert) {
    return null;
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[24rem] p-0">
        <DialogHeader className="gap-2">
          <DialogTitle className={getAlertTitleClassName(alert.variant)}>
            {alert.title}
          </DialogTitle>
          {alert.description ? (
            <DialogDescription>{alert.description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="solid"
            color="primary"
            onClick={handleConfirm}
          >
            {alert.confirmLabel ?? "확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getAlertTitleClassName(variant: AppAlertVariant) {
  if (variant === "error") return "text-destructive";
  if (variant === "success") return "text-emerald-700";
  if (variant === "warning") return "text-amber-700";
  return undefined;
}

export { AppAlertHost, appAlert };
