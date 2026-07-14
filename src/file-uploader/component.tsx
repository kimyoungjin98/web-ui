"use client";

import { DEFAULT_MAX_SIZE } from "./types/const";
import type { FileUploaderProps } from "./types/types";
import { acceptedTypes, getViewModel } from "./utils/model";
import { useUploader } from "./queue/state";
import { UploaderView } from "./view";

export function FileUploader(props: FileUploaderProps) {
  const {
    className,
    disabled,
    initialStorageObjects,
    initialUrls,
    labels,
    maxCount,
    maxFileSize = DEFAULT_MAX_SIZE,
    multiple = true,
    ...callbacks
  } = props;
  const acceptedFileTypes = acceptedTypes(props);
  const uploadState = useUploader({
    ...callbacks,
    acceptedFileTypes,
    initialStorageObjects,
    initialUrls,
    maxCount,
    maxFileSize,
    multiple,
  });

  return (
    <UploaderView
      {...getViewModel(acceptedFileTypes, uploadState.items)}
      canAdd={maxCount == null || uploadState.items.length < maxCount}
      className={className}
      disabled={disabled}
      items={uploadState.items}
      labels={labels}
      limitError={uploadState.error}
      multiple={multiple}
      onCancel={uploadState.cancel}
      onFiles={uploadState.add}
      onRemove={uploadState.remove}
      onRetry={uploadState.retry}
    />
  );
}
