import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  baseUrl = environment.baseURL;
  private fallBackImage = environment.fallBackImage;

  constructor() { }

  getFullImageUrl(imagePath: string | null): Observable<string> {
    if (!imagePath) {
      return of(this.fallBackImage);
    }

    if (imagePath.startsWith('http')) {
      return of(imagePath).pipe(
        catchError(() => of(this.fallBackImage))
      );
    }

    const modifiedPath = imagePath
      .replace(/^content\//, 'storage/');

    const fullPath = `${this.baseUrl}${modifiedPath}`;

    return of(fullPath).pipe(
      catchError(() => of(this.fallBackImage))
    );
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
      return of(videoPath).pipe(
        catchError(() => of(''))
      );
    }

    const modifiedPath = videoPath.replace(/^content\//, 'storage/');
    const fullPath = `${this.baseUrl}${modifiedPath}`;
    return of(fullPath).pipe(
      catchError(() => of(''))
    );
  }

  isValidImage(file: File): boolean {
    if (!file) return false;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    return allowedTypes.includes(file.type);
  }

  isValidFile(file: File): boolean {
    if (!file) return false;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
      "application/x-rar-compressed",
      "text/plain",
      "application/x-7z-compressed",
      "application/x-tar",
      "application/json",
      "application/xml",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.presentation",
      "application/vnd.oasis.opendocument.graphics",
      "application/vnd.oasis.opendocument.chart",
      "application/vnd.oasis.opendocument.database",
      "application/vnd.oasis.opendocument.formula"
    ];
    return allowedTypes.includes(file.type);
  }

  isValidVideo(file: File): boolean {
    if (!file) return false;
    const allowedTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo", // AVI
      "video/x-ms-wmv",  // WMV
      "video/webm",
      "video/ogg"
    ];
    return allowedTypes.includes(file.type);
  }
}
