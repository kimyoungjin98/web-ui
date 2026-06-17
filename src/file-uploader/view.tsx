import type { ReactNode } from "react";
import { Button } from "../button";
import { Icon } from "../icon";
import { cn } from "../lib/tailwind-util";
import type { FileUploaderLabels, UploadFileItem } from "./types";
import { DropZone } from "./drop-zone";
import { FileList } from "./file-list";

type Props = {
  accept: string;
  active: boolean;
  canAdd: boolean;
  className?: string;
  disabled?: boolean;
  error: string;
  items: UploadFileItem[];
  label: string;
  labels?: FileUploaderLabels;
  limitError: string;
  multiple: boolean;
  onCancel: () => void;
  onFiles: (files: globalThis.FileList) => void;
  onRemove: (item: UploadFileItem) => void;
  onRetry: (item: UploadFileItem) => void;
  progress: number;
};

export function UploaderView(props: Props) {
  const disabled = props.disabled;
  const labels = props.labels;
  const limitError = props.limitError;
  const help = labels?.help ?? `${props.label} 파일을 업로드할 수 있습니다.`;

  return (
    <Box className={props.className}>
      <UploaderHeader
        active={props.active}
        disabled={disabled}
        onCancel={props.onCancel}
      />
      {props.canAdd ? (
        <DropZone
          accept={props.accept}
          disabled={disabled}
          help={help}
          labels={labels}
          multiple={props.multiple}
          onFiles={props.onFiles}
        />
      ) : null}
      <Limit message={limitError} />
      <OverallProgress active={props.active} progress={props.progress} />
      <FileList
        items={props.items}
        disabled={disabled}
        onRemove={props.onRemove}
        onRetry={props.onRetry}
      />
      <Live message={limitError || props.error} />
    </Box>
  );
}

function Box({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("grid gap-4", className)}>{children}</section>;
}

function UploaderHeader({
  active,
  disabled,
  onCancel,
}: {
  active: boolean;
  disabled?: boolean;
  onCancel: () => void;
}) {
  if (!active) return null;

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onCancel}
    >
      <Icon name="lucide:x" />
      업로드 취소
    </Button>
  );
}

function OverallProgress({
  active,
  progress,
}: {
  active: boolean;
  progress: number;
}) {
  if (!active) return null;

  return (
    <div className="rounded border border-primary-border bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground">업로드 중</p>
        <p className="text-xs font-bold text-muted-foreground">
          전체 {progress}%
        </p>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}

function Limit({ message }: { message: string }) {
  return message ? (
    <p className="text-xs font-bold text-red-600">{message}</p>
  ) : null;
}

function Live({ message }: { message: string }) {
  return (
    <p className="sr-only" role="alert" aria-live="assertive">
      {message}
    </p>
  );
}
