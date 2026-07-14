export type UploadStorageObject = {
  id?: string;
  key?: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  siteId?: string;
  status?: string;
  createdAt?: string;
  deletedAt?: string | null;
  deletedById?: string | null;
};
export type UploadResult = UploadStorageObject;
export type UploadContext = {
  signal: AbortSignal;
  onProgress: (n: number) => void;
};
