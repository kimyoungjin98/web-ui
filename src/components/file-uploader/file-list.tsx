"use client";

import { useEffect, useState } from "react";
import { Button } from "../button/button";
import { Icon } from "../icon";
import type { UploadFileItem } from "./types/types";
import { formatBytes } from "./types/utils";

type Props = {
  disabled?: boolean;
  items: UploadFileItem[];
  onRemove: (item: UploadFileItem) => void;
  onRetry: (item: UploadFileItem) => void;
};

type RowProps = Omit<Props, "items"> & {
  item: UploadFileItem;
};

export function FileList({ items, disabled, onRemove, onRetry }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-2" aria-label="업로드 파일 목록">
      {items.map((item) => (
        <FileRow
          key={item.id}
          item={item}
          disabled={disabled}
          onRemove={onRemove}
          onRetry={onRetry}
        />
      ))}
    </ul>
  );
}

function FileRow(props: RowProps) {
  const { item, disabled, onRemove, onRetry } = props;

  return (
    <li className="rounded border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <FilePreview item={item} />
        <FileMeta item={item} />
        <StatusIcon status={item.status} />
      </div>
      <FileRowFooter
        item={item}
        disabled={disabled}
        onRemove={onRemove}
        onRetry={onRetry}
      />
    </li>
  );
}

function FileMeta({ item }: { item: UploadFileItem }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
      <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
        {formatBytes(item.size)} · {item.extension || "FILE"}
      </p>
      {item.error ? (
        <p className="mt-1 text-xs font-bold text-red-600" role="alert">
          {item.error}
        </p>
      ) : null}
    </div>
  );
}

const IMAGE_EXTENSIONS = ["JPG", "JPEG", "PNG", "WEBP", "GIF"];

function FilePreview({ item }: { item: UploadFileItem }) {
  const image =
    item.file.type.startsWith("image/") ||
    IMAGE_EXTENSIONS.includes(item.extension);
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (!image) return;
    if (item.url) {
      setSrc(item.url);
      return;
    }
    const url = URL.createObjectURL(item.file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [image, item.file, item.url]);
  if (!image || !src)
    return <FileIcon extension={item.extension} status={item.status} />;
  return (
    <img
      src={src}
      alt=""
      className="size-10 shrink-0 rounded object-cover ring-1 ring-gray-200"
    />
  );
}

function FileRowFooter({ item, disabled, onRemove, onRetry }: RowProps) {
  const tone =
    item.status === "error"
      ? "red"
      : item.status === "success"
        ? "green"
        : "blue";

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <ProgressBar value={item.progress} tone={tone} />
      <div className="flex justify-end gap-2">
        <RowActions item={item} disabled={disabled} onRetry={onRetry} />
        <RemoveButton item={item} disabled={disabled} onRemove={onRemove} />
      </div>
    </div>
  );
}

function RowActions({
  item,
  disabled,
  onRetry,
}: {
  item: UploadFileItem;
  disabled?: boolean;
  onRetry: (item: UploadFileItem) => void;
}) {
  if (item.status === "error")
    return <RetryButton disabled={disabled} onClick={() => onRetry(item)} />;
  if (item.status === "success" && item.url)
    return <DownloadButton url={item.url} name={item.name} />;
  return null;
}

function FileIcon({
  extension,
  status,
}: {
  extension: string;
  status: string;
}) {
  const tone =
    status === "error"
      ? "bg-red-50 text-red-600"
      : "bg-primary-soft text-primary";

  return (
    <div className={`grid size-10 shrink-0 place-items-center rounded ${tone}`}>
      <Icon name={iconName(extension)} className="size-5" />
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "success")
    return (
      <Icon name="lucide:check-circle-2" className="size-5 text-emerald-600" />
    );
  if (status === "error")
    return <Icon name="lucide:circle-alert" className="size-5 text-red-600" />;
  return <Icon name="lucide:loader-circle" className="size-5 text-primary" />;
}

function iconName(ext: string) {
  if (["JPG", "PNG"].includes(ext)) return "lucide:image";
  if (ext === "PDF") return "lucide:file-text";
  if (["DOC", "DOCX"].includes(ext)) return "lucide:file-type";
  if (ext === "MP4") return "lucide:file-video";
  return "lucide:file";
}

function ProgressBar({
  value,
  tone = "blue",
}: {
  value: number;
  tone?: "blue" | "green" | "red";
}) {
  const color =
    tone === "green"
      ? "bg-emerald-500"
      : tone === "red"
        ? "bg-red-500"
        : "bg-primary";

  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}

function RetryButton(props: { disabled?: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label="파일 업로드 다시 시도"
    >
      <Icon name="lucide:refresh-cw" />
    </Button>
  );
}

function DownloadButton({ url, name }: { name: string; url: string }) {
  return (
    <Button size="sm" asChild variant="outline" aria-label={name + " 다운로드"}>
      <a href={url} download>
        <Icon name="lucide:download" />
      </a>
    </Button>
  );
}

function RemoveButton({
  item,
  disabled,
  onRemove,
}: {
  item: UploadFileItem;
  disabled?: boolean;
  onRemove: (item: UploadFileItem) => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => onRemove(item)}
      aria-label={`${item.name} 삭제`}
    >
      <Icon name="lucide:trash-2" />
    </Button>
  );
}
