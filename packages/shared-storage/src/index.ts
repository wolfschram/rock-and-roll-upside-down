// Phase 2 — S3/GCS/R2 abstraction layer
// Cloud provider TBD — this package will abstract all storage operations

export interface StorageClient {
  upload(key: string, data: Buffer | ReadableStream, contentType?: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

export function createStorageClient(): StorageClient {
  throw new Error("Storage client not yet implemented — Phase 2");
}
