import type { UploadFileItem } from "./types";
import { formatBytes, getExtension, matchesAcceptedType } from "./utils";

export function createItem(
  file: File,
  acceptedFileTypes: string[],
  maxFileSize: number,
): UploadFileItem {
  const error = validateFile(file, acceptedFileTypes, maxFileSize);

  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    name: file.name,
    size: file.size,
    extension: getExtension(file.name).toUpperCase(),
    progress: error ? 0 : 1,
    status: error ? "error" : "pending",
    error: error ?? undefined,
  };
}

function validateFile(
  file: File,
  acceptedFileTypes: string[],
  maxFileSize: number,
) {
  if (!matchesAcceptedType(file, acceptedFileTypes)) {
    return "허용되지 않은 파일 형식입니다.";
  }

  if (file.size > maxFileSize) {
    return `파일 크기가 제한을 초과했습니다. (최대 ${formatBytes(maxFileSize)})`;
  }

  return null;
}
