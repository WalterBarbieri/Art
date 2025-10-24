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
      return of(`${this.baseUrl}${imagePath}`).pipe(
        catchError(() => of(this.fallBackImage))
      );
  }

  getFullFileUrl(filePath: string): string {
    return `${this.baseUrl}${filePath}`;
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
}
