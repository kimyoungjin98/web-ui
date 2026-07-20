"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  UploadContext,
  UploadResult,
  UploadStorageObject,
} from "../types/storage-types";
import type { FileUploaderProps, UploadFileItem } from "../types/types";
import { createItem } from "../utils/file";
import { UploadQueue } from "./queue";
import { getExtension } from "../types/utils";

type UploaderProps = Required<
  Pick<FileUploaderProps, "acceptedFileTypes" | "maxFileSize">
> &
  FileUploaderProps;

type Upload = NonNullable<FileUploaderProps["onUpload"]>;
type SetItems = Dispatch<SetStateAction<UploadFileItem[]>>;
type Patch = (id: string, next: Partial<UploadFileItem>) => void;

export function useUploader(props: UploaderProps) {
  const [items, setItems] = useState<UploadFileItem[]>(() => [
    ...fromObjects(props.initialStorageObjects),
    ...fromUrls(props.initialUrls),
  ]);
  const [error, setError] = useState("");
  const queue = useRef<UploadQueue<UploadFileItem> | null>(null);

  if (queue.current === null) queue.current = new UploadQueue();

  const uploadQueue = queue.current;
  useEffect(() => () => uploadQueue.cancelAll(), [uploadQueue]);

  return {
    error,
    items,
    ...createActions({
      items,
      props,
      queue: uploadQueue,
      setError,
      setItems,
    }),
  };
}

function createActions(args: {
  items: UploadFileItem[];
  props: UploaderProps;
  queue: UploadQueue<UploadFileItem>;
  setError: Dispatch<SetStateAction<string>>;
  setItems: SetItems;
}) {
  const { items, props, queue, setError, setItems } = args;
  const upload = props.onUpload ?? defaultUpload;
  const patch = (id: string, next: Partial<UploadFileItem>) =>
    patchItem(setItems, id, next);
  const enqueue = (queuedItems: UploadFileItem[]) =>
    queue.add(queuedItems, (item, signal) =>
      startUpload(item, upload, signal, patch),
    );

  return {
    add: (files: FileList) =>
      addUpload(files, items, props, setItems, enqueue, setError),
    cancel: () => (
      setError(""),
      cancelUploads(items, queue, setItems, props.onCancel)
    ),
    remove: (item: UploadFileItem) => (
      setError(""),
      removeUpload(item, queue, setItems, props.onRemove)
    ),
    retry: (item: UploadFileItem) =>
      retryUpload(item, patch, enqueue, props.onRetry),
  };
}

function addUpload(
  files: FileList,
  items: UploadFileItem[],
  props: UploaderProps,
  setItems: SetItems,
  enqueue: (items: UploadFileItem[]) => void,
  setError: Dispatch<SetStateAction<string>>,
) {
  const selectedFiles = props.multiple
    ? Array.from(files)
    : Array.from(files).slice(0, 1);
  const selected = selectedFiles.map((file) =>
    createItem(file, props.acceptedFileTypes, props.maxFileSize),
  );
  const count = props.multiple
    ? items.length + selected.length
    : selected.length;
  if (props.maxCount !== undefined && count > props.maxCount) {
    setError(`최대 ${props.maxCount}개까지 업로드할 수 있습니다.`);
    return;
  }
  setError("");
  setItems((current) =>
    props.multiple ? [...current, ...selected] : selected,
  );
  enqueue(selected);
}

async function startUpload(
  item: UploadFileItem,
  upload: Upload,
  signal: AbortSignal,
  patch: Patch,
) {
  if (item.status === "error") return;
  patch(item.id, { status: "uploading", progress: 1, error: undefined });

  try {
    const result = await upload(item.file, {
      signal,
      onProgress: (progress) => {
        if (!signal.aborted) patch(item.id, { progress });
      },
    });

    if (!signal.aborted) finishUpload(item, result, patch);
  } catch {
    if (!signal.aborted) {
      patch(item.id, { status: "error", error: "업로드에 실패했습니다." });
    }
  }
}

function finishUpload(
  item: UploadFileItem,
  result: UploadResult | void,
  patch: Patch,
) {
  const output = result || undefined;
  patch(item.id, {
    status: "success",
    progress: 100,
    key: output?.key,
    storage: output,
    url: output?.url,
    name: output?.filename ?? item.name,
    size: output?.size ?? item.size,
  });
}

function cancelUploads(
  items: UploadFileItem[],
  queue: UploadQueue<UploadFileItem>,
  setItems: SetItems,
  onCancel?: (files: UploadFileItem[]) => void,
) {
  const active = items.filter(isActive);
  queue.cancelAll();
  setItems((list) => list.map(cancelled));
  onCancel?.(active);
}

function removeUpload(
  item: UploadFileItem,
  queue: UploadQueue<UploadFileItem>,
  setItems: SetItems,
  onRemove?: (item: UploadFileItem) => void,
) {
  queue.cancel(item.id);
  setItems((list) => list.filter((current) => current.id !== item.id));
  onRemove?.(item);
}

function retryUpload(
  item: UploadFileItem,
  patch: Patch,
  enqueue: (items: UploadFileItem[]) => void,
  onRetry?: (item: UploadFileItem) => void,
) {
  const next = {
    ...item,
    status: "pending" as const,
    progress: 1,
    error: undefined,
  };
  patch(item.id, next);
  onRetry?.(item);
  enqueue([next]);
}

function patchItem(
  setItems: SetItems,
  id: string,
  next: Partial<UploadFileItem>,
) {
  setItems((list) =>
    list.map((item) => (item.id === id ? { ...item, ...next } : item)),
  );
}

function isActive(item: UploadFileItem) {
  return item.status === "pending" || item.status === "uploading";
}

function cancelled(item: UploadFileItem): UploadFileItem {
  return isActive(item)
    ? { ...item, status: "error", error: "업로드가 취소되었습니다." }
    : item;
}

function fromUrls(urls?: string[]): UploadFileItem[] {
  return (urls ?? []).filter(Boolean).map((url) => {
    const name = nameOf(url);
    return {
      id: `initial-${url}`,
      file: new File([], name),
      name,
      size: 0,
      extension: getExtension(name).toUpperCase(),
      progress: 100,
      status: "success",
      url,
    };
  });
}

function fromObjects(objects?: UploadStorageObject[]): UploadFileItem[] {
  return (objects ?? [])
    .filter((object) => object.url)
    .map((object) => {
      const name = object.filename || nameOf(object.url || "");

      return {
        id: object.id || `initial-${object.key || object.url}`,
        file: new File([], name),
        name,
        size: object.size || 0,
        extension: getExtension(object.mimeType || name).toUpperCase(),
        progress: 100,
        status: "success",
        key: object.key,
        storage: object,
        url: object.url,
      };
    });
}

function nameOf(url: string) {
  const path = url.split("?")[0]?.split("/").pop() || "업로드 파일";
  return decodeURIComponent(path);
}

async function defaultUpload(_file: File, context: UploadContext) {
  for (let step = 1; step <= 10; step += 1) {
    if (context.signal.aborted) throw new DOMException("Aborted", "AbortError");
    await wait(120);
    context.onProgress(step * 10);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

