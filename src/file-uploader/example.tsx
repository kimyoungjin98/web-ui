"use client";

import { FileUploader } from "./component";
import type { UploadContext } from "./types/storage-types";

export function FileUploaderExample() {
  return (
    <FileUploader
      multiple
      maxFileSize={100 * 1024 * 1024}
      accept={["jpg", "png", "pdf", "doc", "docx", "mp4"]}
      onUpload={demoUpload}
      onRemove={(file) => console.log("removed", file.name)}
      onRetry={(file) => console.log("retry", file.name)}
      onCancel={(files) => console.log("cancelled", files.length)}
    />
  );
}

async function demoUpload(_file: File, context: UploadContext) {
  for (let step = 1; step <= 20; step += 1) {
    if (context.signal.aborted) throw new DOMException("Aborted", "AbortError");
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    context.onProgress(step * 5);
  }

  return { url: "#" };
}
