"use client";

import * as React from "react";

import { Button } from "../button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog/dialog";

type AppAlertVariant = "error" | "info" | "success" | "warning";

type AppAlertOptions = {
  confirmLabel?: string;
  description?: React.ReactNode;
  onConfirm?: () => void;
};

type AppConfirmAlertOptions = AppAlertOptions & {
  cancelLabel?: string;
  onCancel?: () => void;
  variant?: AppAlertVariant;
};

type AppAlertState = AppAlertOptions & {
  id: number;
  cancelLabel?: string;
  kind: "alert" | "confirm";
  onCancel?: () => void;
  resolve?: (confirmed: boolean) => void;
  title: React.ReactNode;
  variant: AppAlertVariant;
};

type AppAlertListener = (alert: AppAlertState | null) => void;

const appAlertListeners = new Set<AppAlertListener>();
const appAlertQueue: AppAlertState[] = [];
let activeAppAlert: AppAlertState | null = null;
let isCompletingAppAlert = false;
let nextAppAlertId = 1;

function subscribeAppAlert(listener: AppAlertListener) {
  appAlertListeners.add(listener);
  listener(activeAppAlert);

  return () => {
    appAlertListeners.delete(listener);
  };
}

function publishAppAlert(alert: Omit<AppAlertState, "id">) {
  appAlertQueue.push({
    ...alert,
    id: nextAppAlertId++,
  });

  if (!isCompletingAppAlert) {
    showNextAppAlert();
  }
}

function showNextAppAlert() {
  if (activeAppAlert || appAlertQueue.length === 0) {
    return;
  }

  activeAppAlert = appAlertQueue.shift() ?? null;
  if (!activeAppAlert) {
    return;
  }

  emitAppAlert();
}

function emitAppAlert() {
  appAlertListeners.forEach((listener) => listener(activeAppAlert));
}

function completeAppAlert(alert: AppAlertState, confirmed: boolean) {
  if (activeAppAlert?.id !== alert.id) {
    return;
  }

  activeAppAlert = null;
  isCompletingAppAlert = true;

  if (confirmed) {
    alert.onConfirm?.();
  } else if (alert.kind === "confirm") {
    alert.onCancel?.();
    alert.resolve?.(false);
  }

  if (confirmed && alert.kind === "confirm") {
    alert.resolve?.(true);
  }

  isCompletingAppAlert = false;
  showNextAppAlert();
  if (!activeAppAlert) {
    emitAppAlert();
  }
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
  value: React.ReactNode | AppAlertOptions | AppConfirmAlertOptions,
): value is AppAlertOptions {
  if (!value || typeof value !== "object" || React.isValidElement(value)) {
    return false;
  }

  return (
    "cancelLabel" in value ||
    "confirmLabel" in value ||
    "description" in value ||
    "onCancel" in value ||
    "onConfirm" in value ||
    "variant" in value
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
      kind: "alert",
      title,
      variant,
    });
  };
}

function createAppConfirmAlert() {
  return (
    title: React.ReactNode,
    descriptionOrOptions?: React.ReactNode | AppConfirmAlertOptions,
    options?: AppConfirmAlertOptions,
  ) =>
    new Promise<boolean>((resolve) => {
      const alertOptions = normalizeAlertOptions(
        descriptionOrOptions,
        options,
      ) as AppConfirmAlertOptions;

      publishAppAlert({
        ...alertOptions,
        kind: "confirm",
        resolve,
        title,
        variant: alertOptions.variant ?? "warning",
      });
    });
}

const appAlert = {
  confirm: createAppConfirmAlert(),
  error: createAppAlert("error"),
  info: createAppAlert("info"),
  success: createAppAlert("success"),
  warning: createAppAlert("warning"),
};

function AppAlertHost() {
  const [alert, setAlert] = React.useState<AppAlertState | null>(null);

  React.useEffect(() => subscribeAppAlert(setAlert), []);

  function handleOpenChange(open: boolean) {
    if (!open && alert) {
      completeAppAlert(alert, false);
    }
  }

  function handleConfirm() {
    if (alert) {
      completeAppAlert(alert, true);
    }
  }

  function handleCancel() {
    if (alert) {
      completeAppAlert(alert, false);
    }
  }

  if (!alert) {
    return null;
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[24rem] p-0">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-base">{alert.title}</DialogTitle>
          {alert.description ? (
            <DialogDescription>
              <span className="whitespace-pre-line">{alert.description}</span>
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          {alert.kind === "confirm" ? (
            <Button type="button" variant="outline" onClick={handleCancel}>
              {alert.cancelLabel ?? "취소"}
            </Button>
          ) : null}
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

export { AppAlertHost, appAlert };
