import type{UploadContext,UploadResult,UploadStorageObject}from "./storage-types";

export type UploadStatus="pending"|"uploading"|"success"|"error"
export type UploadFileItem={
  id:string;file:File;name:string;size:number;extension:string
  progress:number;status:UploadStatus;error?:string;
  key?:string;
  storage?:UploadStorageObject;
  url?:string;
}
export type FileUploaderLabels={
  description?:string;guide?:string;help?:string;idle?:string;over?:string;title?:string
}
export type FileUploaderProps={
  accept?:string|string[];acceptedFileTypes?:string[];className?:string;disabled?:boolean
  initialUrls?:string[];initialStorageObjects?:UploadStorageObject[]
  labels?:FileUploaderLabels;maxCount?:number;maxFileSize?:number;multiple?:boolean
  onCancel?:(f:UploadFileItem[])=>void;
  onRemove?:(f:UploadFileItem)=>void;
  onRetry?:(f:UploadFileItem)=>void;
  onUpload?:(f:File,c:UploadContext)=>Promise<UploadResult|void>;
}
