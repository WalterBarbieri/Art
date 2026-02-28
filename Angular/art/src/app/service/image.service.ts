import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StaticAssetService } from './static-asset.service';

export interface FileValidationResult {
  valid: File[];
  invalid: File[];
  oversized: File[];
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // File size constants
  private readonly MB = 1024 * 1024;

  // File size limits (in bytes)
  readonly MAX_FILE_SIZE = 50 * this.MB; // 50MB for single file
  readonly MAX_REQUEST_SIZE = 200 * this.MB; // 200MB total

  baseUrl = environment.baseURL;
  private fallBackImage: string;

  constructor(private staticAssetService: StaticAssetService) {
    this.fallBackImage = this.staticAssetService.getAssetWebp('fallback_image');
  }

  getFullImageUrl(imagePath: string | null): Observable<string> {
    if (!imagePath) {
      return of(this.fallBackImage);
    }

    if (imagePath.startsWith('http')) {
      return of(imagePath).pipe(catchError(() => of(this.fallBackImage)));
    }

    const modifiedPath = imagePath.replace(/^content\//, 'storage/');

    const fullPath = `${this.baseUrl}${modifiedPath}`;

    return of(fullPath).pipe(catchError(() => of(this.fallBackImage)));
  }

  getFullFileUrl(filePath: string): string {
    const modifiedPath = filePath.replace(/^content\//, 'storage/');
    return `${this.baseUrl}${modifiedPath}`;
  }

  getFullVideoUrl(videoPath: string | null): Observable<string> {
    if (!videoPath) {
      return of('');
    }

    if (videoPath.startsWith('http')) {
      return of(videoPath).pipe(catchError(() => of('')));
    }

    const modifiedPath = videoPath.replace(/^content\//, 'storage/');
    const fullPath = `${this.baseUrl}${modifiedPath}`;
    return of(fullPath).pipe(catchError(() => of('')));
  }

  isValidImage(file: File): boolean {
    if (!file) return false;
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
    ];
    return allowedTypes.includes(file.type);
  }

  isValidFile(file: File): boolean {
    if (!file) return false;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/json',
      'application/xml',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/vnd.oasis.opendocument.graphics',
      'application/vnd.oasis.opendocument.chart',
      'application/vnd.oasis.opendocument.database',
      'application/vnd.oasis.opendocument.formula',
    ];
    return allowedTypes.includes(file.type);
  }

  isValidVideo(file: File): boolean {
    if (!file) return false;
    const allowedTypes = [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo', // AVI
      'video/x-ms-wmv', // WMV
      'video/webm',
      'video/ogg',
    ];
    return allowedTypes.includes(file.type);
  }

  /**
   * Validates an array of files against type and size constraints
   * @param files Array of files to validate
   * @param typeValidationFn Function to validate file type (e.g., isValidImage)
   * @returns Object with valid, invalid, and oversized file arrays
   */
  validateFiles(
    files: File[],
    typeValidationFn: (file: File) => boolean,
  ): FileValidationResult {
    const result: FileValidationResult = {
      valid: [],
      invalid: [],
      oversized: [],
    };

    files.forEach((file) => {
      if (!typeValidationFn(file)) {
        result.invalid.push(file);
      } else if (file.size > this.MAX_FILE_SIZE) {
        result.oversized.push(file);
      } else {
        result.valid.push(file);
      }
    });

    return result;
  }

  /**
   * Calculates total size of all provided files
   * @param files Array of files to calculate total size
   * @returns Total size in bytes
   */
  calculateTotalSize(files: File[]): number {
    return files.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Formats bytes to human-readable string
   * @param bytes Size in bytes
   * @param decimals Number of decimal places
   * @returns Formatted string (e.g., "50.00 MB")
   */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  convertUrlToRelativePath(fullUrl: string): string {
    // Remove the base URL part to get the relative path
    // Example: "http://localhost:4001/storage/content/..." -> "content/..."
    const baseUrlPattern = /^https?:\/\/[^\/]+\/storage\//;
    let relative = fullUrl.replace(baseUrlPattern, '');
    // Ensure it starts with 'content/'
    if (!relative.startsWith('content/')) {
      relative = 'content/' + relative;
    }
    return relative;
  }
}
