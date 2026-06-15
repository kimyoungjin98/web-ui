import { DEFAULT_ACCEPTED_TYPES } from "./constants";
import type { FileUploaderProps, UploadFileItem } from "./types";
import { toAccept } from "./utils";

export function acceptedTypes(props: FileUploaderProps) {
  if (Array.isArray(props.accept)) return props.accept;
  if (props.accept) return props.accept.split(",").map((type) => type.trim());
  return props.acceptedFileTypes ?? DEFAULT_ACCEPTED_TYPES;
}

export function getViewModel(types: string[], items: UploadFileItem[]) {
  return {
    accept: toAccept(types),
    active: items.some(
      (item) => item.status === "pending" || item.status === "uploading",
    ),
    error:
      [...items].reverse().find((item) => item.status === "error")?.error ?? "",
    label: types
      .map((type) =>
        type === "*" || type === "*/*"
          ? "모든"
          : type.replace(".", "").toUpperCase(),
      )
      .join(", "),
    progress: getProgress(items),
  };
}

function getProgress(items: UploadFileItem[]) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + item.progress, 0);

  return Math.round(total / items.length);
}
