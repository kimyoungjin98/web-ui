import { DEFAULT_ACCEPTED_TYPES } from "../types/const";
import type { FileUploaderProps, UploadFileItem } from "../types/types";
import { toAccept } from "../types/utils";

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
    progress:
      items.length === 0
        ? 0
        : Math.round(
            items.reduce((sum, item) => sum + item.progress, 0) / items.length,
          ),
  };
}
