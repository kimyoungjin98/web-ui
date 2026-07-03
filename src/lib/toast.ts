"use client";

import { isValidElement, type ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastInput = string;
type ToastOptions = Omit<ExternalToast, "description"> & {
  description?: ReactNode;
};

function normalizeToastOptions(
  descriptionOrOptions?: ReactNode | ToastOptions,
  options?: ToastOptions,
): ToastOptions {
  if (isToastOptions(descriptionOrOptions)) {
    return descriptionOrOptions;
  }

  return {
    ...options,
    description: descriptionOrOptions as ReactNode,
  };
}

function isToastOptions(value: ReactNode | ToastOptions): value is ToastOptions {
  if (!value || typeof value !== "object" || isValidElement(value)) {
    return false;
  }

  return (
    "description" in value ||
    "action" in value ||
    "duration" in value ||
    "id" in value
  );
}

export const appToast = {
  message(title: ToastInput, options?: ToastOptions) {
    return sonnerToast(title, options);
  },
  success(
    title: ToastInput,
    descriptionOrOptions?: ReactNode | ToastOptions,
    options?: ToastOptions,
  ) {
    return sonnerToast.success(
      title,
      normalizeToastOptions(descriptionOrOptions, options),
    );
  },
  error(
    title: ToastInput,
    descriptionOrOptions?: ReactNode | ToastOptions,
    options?: ToastOptions,
  ) {
    return sonnerToast.error(
      title,
      normalizeToastOptions(descriptionOrOptions, options),
    );
  },
  warning(
    title: ToastInput,
    descriptionOrOptions?: ReactNode | ToastOptions,
    options?: ToastOptions,
  ) {
    return sonnerToast.warning(
      title,
      normalizeToastOptions(descriptionOrOptions, options),
    );
  },
  info(
    title: ToastInput,
    descriptionOrOptions?: ReactNode | ToastOptions,
    options?: ToastOptions,
  ) {
    return sonnerToast.info(
      title,
      normalizeToastOptions(descriptionOrOptions, options),
    );
  },
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
};
