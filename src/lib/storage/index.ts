export interface StorageUploadResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface StorageProvider {
  upload(file: File | Blob, folder?: string): Promise<StorageUploadResult>;
  delete(url: string): Promise<boolean>;
}

// Allowed MIME types for media library
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit

export class DefaultStorageProvider implements StorageProvider {
  async upload(file: File | Blob, folder = 'general'): Promise<StorageUploadResult> {
    const mimeType = file.type;
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`Unsupported file format "${mimeType}". Allowed: JPEG, PNG, WebP, AVIF, SVG.`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error('File size exceeds the 5MB maximum limit.');
    }

    const filename = (file as File).name || `upload_${Date.now()}`;
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

    // In production on Vercel with @vercel/blob token:
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`${folder}/${sanitizedFilename}`, file, {
          access: 'public',
        });
        return {
          url: blob.url,
          filename: sanitizedFilename,
          mimeType,
          size: file.size,
        };
      } catch (err: any) {
        console.error('Vercel Blob upload failed, falling back:', err.message);
      }
    }

    // Standard fallback representation for development / demo upload:
    // Generate data-url for preview or mock persistent URL
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      url: dataUrl,
      filename: sanitizedFilename,
      mimeType,
      size: file.size,
    };
  }

  async delete(_url: string): Promise<boolean> {
    // If Vercel Blob or external provider is configured:
    if (process.env.BLOB_READ_WRITE_TOKEN && _url.startsWith('http')) {
      try {
        const { del } = await import('@vercel/blob');
        await del(_url);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }
}

export const storage: StorageProvider = new DefaultStorageProvider();
