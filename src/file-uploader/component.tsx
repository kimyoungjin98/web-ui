"use client"

import {DEFAULT_MAX_SIZE as MAX} from "./constants"
import type {FileUploaderProps as Props} from "./types"
import {acceptedTypes as typesOf, getViewModel as viewOf} from "./core/model"
import {useUploader} from "./core/state"
import {UploaderView as View} from "./parts/view"

export function FileUploader(props:Props) {
  const {className:c,disabled:d,initialStorageObjects:o,initialUrls:i,labels:l,maxCount:m,maxFileSize=MAX,multiple:mu=true,...cb}=props
  const t=typesOf(props)
  const up=useUploader({...cb,acceptedFileTypes:t,initialStorageObjects:o,initialUrls:i,maxCount:m,maxFileSize,multiple:mu})
  return (
    <View
      {...viewOf(t,up.items)}
      canAdd={m==null||up.items.length<m}
      className={c}
      disabled={d}
      items={up.items}
      labels={l}
      limitError={up.error}
      multiple={mu}
      onCancel={up.cancel}
      onFiles={up.add}
      onRemove={up.remove}
      onRetry={up.retry}
    />
  );
}
