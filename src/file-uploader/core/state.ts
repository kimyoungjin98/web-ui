"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { UploadContext, UploadResult, UploadStorageObject } from "../storage-types";
import type { FileUploaderProps, UploadFileItem } from "../types";
import { createItem } from "./file";
import { getExtension } from "../utils/accept";

type UploaderProps = Required<
  Pick<FileUploaderProps, "acceptedFileTypes" | "maxFileSize">
> &
  FileUploaderProps;

type Upload = NonNullable<FileUploaderProps["onUpload"]>;
type SetItems = Dispatch<SetStateAction<UploadFileItem[]>>;
type Patch = (id: string, next: Partial<UploadFileItem>) => void;

export function useUploader(props: UploaderProps) {
  const [items, setItems] = useState<UploadFileItem[]>(
    () => createInitialItems(props.initialUrls, props.initialStorageObjects),
  );
  const [error, setError] = useState("");
  const controllers = useRef(new Map<string, AbortController>());

  return {
    error,
    items,
    ...createActions({ controllers: controllers.current, items, props, setError, setItems }),
  };
}

function createActions(args: {
  controllers: Map<string, AbortController>;
  items: UploadFileItem[];
  props: UploaderProps;
  setError: Dispatch<SetStateAction<string>>;
  setItems: SetItems;
}) {
  const { controllers, items, props, setError, setItems } = args;
  const upload = props.onUpload ?? defaultUpload;
  const patch = (id: string, next: Partial<UploadFileItem>) => patchItem(setItems, id, next);
  const start = (item: UploadFileItem) => startUpload(item, upload, controllers, patch);

  return {
    add: (files: FileList) => addUpload(files, items, props, setItems, start, setError),
    cancel: () => (setError(""), cancelUploads(items, controllers, setItems, props.onCancel)),
    remove: (item: UploadFileItem) => (setError(""), removeUpload(item, controllers, setItems, props.onRemove)),
    retry: (item: UploadFileItem) => retryUpload(item, patch, start, props.onRetry),
  };
}

function addUpload(
  files: FileList,
  items: UploadFileItem[],
  props: UploaderProps,
  setItems: SetItems,
  start: (item: UploadFileItem) => void,
  setError: Dispatch<SetStateAction<string>>,
) {
  const selected = createSelectedItems(files, props);
  const count = props.multiple ? items.length + selected.length : selected.length;
  if (props.maxCount !== undefined && count > props.maxCount) {
    setError(`최대 ${props.maxCount}개까지 업로드할 수 있습니다.`);
    return;
  }
  setError("");
  setItems((current) => (props.multiple ? [...current, ...selected] : selected));
  selected.forEach(start);
}

function createSelectedItems(files: FileList, props: UploaderProps) {
  const next = Array.from(files).map((file) =>
    createItem(file, props.acceptedFileTypes, props.maxFileSize),
  );

  return props.multiple ? next : next.slice(0, 1);
}

function startUpload(
  item: UploadFileItem,
  upload: Upload,
  controllers: Map<string, AbortController>,
  patch: Patch,
) {
  if (item.status === "error") return;
  const controller = new AbortController();
  controllers.set(item.id, controller);
  patch(item.id, { status: "uploading", progress: 1, error: undefined });
  void upload(item.file, {
    signal: controller.signal,
    onProgress: (progress) => patch(item.id, { progress }),
  })
    .then((result) => finishUpload(item, result, patch))
    .catch(() => {
      if (!controller.signal.aborted) patch(item.id, { status: "error", error: "업로드에 실패했습니다." });
    })
    .finally(() => controllers.delete(item.id));
}

function finishUpload(item: UploadFileItem, result: UploadResult | void, patch: Patch) {
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
  controllers: Map<string, AbortController>,
  setItems: SetItems,
  onCancel?: (files: UploadFileItem[]) => void,
) {
  const active = items.filter(isActive);
  controllers.forEach((controller) => controller.abort());
  setItems((list) => list.map(cancelled));
  onCancel?.(active);
}

function removeUpload(
  item: UploadFileItem,
  controllers: Map<string, AbortController>,
  setItems: SetItems,
  onRemove?: (item: UploadFileItem) => void,
) {
  controllers.get(item.id)?.abort();
  setItems((list) => list.filter((current) => current.id !== item.id));
  onRemove?.(item);
}

function retryUpload(
  item: UploadFileItem,
  patch: Patch,
  start: (item: UploadFileItem) => void,
  onRetry?: (item: UploadFileItem) => void,
) {
  const next = { ...item, status: "pending" as const, progress: 1, error: undefined };
  patch(item.id, next);
  onRetry?.(item);
  start(next);
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

function createInitialItems(urls?: string[], objects?: UploadStorageObject[]): UploadFileItem[] {
  return [...fromObjects(objects), ...fromUrls(urls)];
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
  return (objects ?? []).filter((object) => object.url).map(createInitialObject);
}

function createInitialObject(object: UploadStorageObject): UploadFileItem {
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
