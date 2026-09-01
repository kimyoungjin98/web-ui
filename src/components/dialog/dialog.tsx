"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import Icon from "../icon";
import { cn } from "../../libs/tailwind-util";

export function getDialogContentPointerEvents(selectIsOpen: boolean) {
  return selectIsOpen ? ("auto" as const) : undefined;
}

type DialogOutsideInteractionTarget = {
  closest: (selectors: string) => unknown;
};

/**
 * 드롭다운 메뉴, 셀렉트, 팝오버 등과 같은 컴포넌트가 열려있을 때 다이얼로그 외부를 클릭하면 다이얼로그가 닫히는 현상을 방지하기 위한 함수입니다.
 * @param target
 * @returns
 */
export function shouldPreventDialogOutsideInteraction(target: unknown) {
  if (
    !target ||
    typeof target !== "object" ||
    !("closest" in target) ||
    typeof target.closest !== "function"
  ) {
    return false;
  }

  return Boolean(
    (target as DialogOutsideInteractionTarget).closest(
      "[data-slot='popover-content'], [data-slot='select-content'], [data-slot='dropdown-menu-content']",
    ),
  );
}

function isTopmostDialogContent(content: HTMLElement) {
  const openDialogContents =
    content.ownerDocument.querySelectorAll<HTMLElement>(
      "[data-slot='dialog-content'][data-state='open']",
    );

  return openDialogContents.item(openDialogContents.length - 1) === content;
}

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ ...props }, ref) => (
  <DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn("dialog-overlay fixed inset-0 z-50 bg-overlay", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
  }
>(
  (
    { className, children, onInteractOutside, showClose = true, ...props },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 grid place-items-center p-2 pointer-events-none">
        <DialogPrimitive.Content
          ref={ref}
          data-slot="dialog-content"
          className={cn(
            "dialog-content pointer-events-auto relative flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[32rem] flex-col overflow-hidden rounded-md border border-border bg-card shadow-xl outline-none sm:max-h-[90vh]",
            className,
          )}
          onInteractOutside={(event) => {
            if (
              !isTopmostDialogContent(event.currentTarget as HTMLElement) ||
              shouldPreventDialogOutsideInteraction(event.target)
            ) {
              // overlay 클릭 시 다이얼로그가 닫히는 것을 방지하기 위해 preventDefault를 호출합니다.
              event.preventDefault();
            }
            onInteractOutside?.(event);
          }}
          {...props}
        >
          {children}
          {showClose ? (
            <DialogPrimitive.Close className="absolute right-4 top-4 z-20 rounded-md opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
              <Icon name="lucide:x" className="size-4 cursor-pointer" />
              <span className="sr-only">닫기</span>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn("text-lg font-bold text-base-content", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1 border-b border-border px-4 py-4 pr-12 text-left sm:px-5",
        className,
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("flex-1 overflow-y-auto px-4 py-4 sm:px-5", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col items-stretch justify-end gap-2 border-t border-border bg-card px-4 py-3 [&>button]:w-full sm:flex-row sm:items-center sm:px-5 sm:[&>button]:w-auto",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
