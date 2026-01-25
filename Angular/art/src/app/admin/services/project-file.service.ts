import { Injectable } from '@angular/core';
import { Observable, from, map, mergeMap, toArray } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ImageService } from 'src/app/service/image.service';

export interface FileValidationResult {
  valid: File[];
  invalid: File[];
  oversized: File[];
}

export interface CoverImageResult {
  file: File;
  preview: string;
}

export interface ImagesResult {
  files: File[];
  previews: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectFileService {
  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    private imageService: ImageService,
  ) {}

  /**
   * Handle cover image file selection and validation
   */
  handleCoverImageChange(event: Event): Observable<CoverImageResult> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) {
      throw new Error('No file selected');
    }

    const file = input.files[0];
    const validation = this.imageService.validateFiles([file], (f) =>
      this.imageService.isValidImage(f),
    );

    if (validation.invalid.length > 0) {
      input.value = '';
      this.toastService.showError(
        this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_IMAGE'),
      );
      throw new Error('Invalid image file');
    }

    if (validation.oversized.length > 0) {
      input.value = '';
      this.toastService.showError(
        this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILE_TOO_LARGE', {
          max: this.imageService.formatBytes(this.imageService.MAX_FILE_SIZE),
        }),
      );
      throw new Error('File too large');
    }

    return this.createFilePreview(file).pipe(
      map((preview) => ({
        file,
        preview,
      })),
    );
  }

  /**
   * Handle gallery images file selection and validation
   */
  handleImagesChange(event: Event): Observable<ImagesResult> {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      throw new Error('No files selected');
    }

    const filesArray = Array.from(input.files);
    const validation = this.imageService.validateFiles(filesArray, (f) =>
      this.imageService.isValidImage(f),
    );

    if (validation.invalid.length > 0) {
      input.value = '';
      this.toastService.showError(
        `${validation.invalid.length} ${this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_IMAGES')}`,
      );
      throw new Error('Invalid image files');
    }

    if (validation.oversized.length > 0) {
      input.value = '';
      this.toastService.showError(
        this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILES_TOO_LARGE', {
          count: validation.oversized.length,
          max: this.imageService.formatBytes(this.imageService.MAX_FILE_SIZE),
        }),
      );
      throw new Error('Files too large');
    }

    input.value = '';

    return from(validation.valid).pipe(
      mergeMap((file) => this.createFilePreview(file)),
      toArray(),
      map((previews) => ({
        files: validation.valid,
        previews,
      })),
    );
  }

  /**
   * Handle document files selection and validation
   */
  handleFilesChange(event: Event): Observable<File[]> {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      throw new Error('No files selected');
    }

    const filesArray = Array.from(input.files);
    const validation = this.imageService.validateFiles(filesArray, (f) =>
      this.imageService.isValidFile(f),
    );

    if (validation.invalid.length > 0) {
      input.value = '';
      this.toastService.showError(
        `${validation.invalid.length} ${this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_FILES')}`,
      );
      throw new Error('Invalid files');
    }

    if (validation.oversized.length > 0) {
      input.value = '';
      this.toastService.showError(
        this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILES_TOO_LARGE', {
          count: validation.oversized.length,
          max: this.imageService.formatBytes(this.imageService.MAX_FILE_SIZE),
        }),
      );
      throw new Error('Files too large');
    }

    input.value = '';

    return new Observable((observer) => {
      observer.next(validation.valid);
      observer.complete();
    });
  }

  /**
   * Handle video files selection and validation
   */
  handleVideosChange(event: Event): Observable<File[]> {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      throw new Error('No files selected');
    }

    const filesArray = Array.from(input.files);
    const validation = this.imageService.validateFiles(filesArray, (f) =>
      this.imageService.isValidVideo(f),
    );

    if (validation.invalid.length > 0) {
      input.value = '';
      this.toastService.showError(
        `${validation.invalid.length} ${this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_VIDEOS')}`,
      );
      throw new Error('Invalid video files');
    }

    if (validation.oversized.length > 0) {
      input.value = '';
      this.toastService.showError(
        this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILES_TOO_LARGE', {
          count: validation.oversized.length,
          max: this.imageService.formatBytes(this.imageService.MAX_FILE_SIZE),
        }),
      );
      throw new Error('Files too large');
    }

    input.value = '';

    return new Observable((observer) => {
      observer.next(validation.valid);
      observer.complete();
    });
  }

  /**
   * Create file preview using FileReader
   */
  private createFilePreview(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        observer.next(e.target?.result as string);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generic method to remove a file from an array
   */
  removeFileFromArray(
    fileArray: File[],
    fileIndex: number,
    previewArray?: string[],
    previewIndex?: number,
  ): void {
    if (fileIndex >= 0 && fileIndex < fileArray.length) {
      fileArray.splice(fileIndex, 1);

      // Remove from preview array if provided
      if (
        previewArray &&
        previewIndex !== undefined &&
        previewIndex >= 0 &&
        previewIndex < previewArray.length
      ) {
        previewArray.splice(previewIndex, 1);
      }
    }
  }

  /**
   * Validate total size of all files before submission
   */
  validateTotalSize(files: File[]): boolean {
    const totalSize = this.imageService.calculateTotalSize(files);

    if (totalSize > this.imageService.MAX_REQUEST_SIZE) {
      this.toastService.showError(
        this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_REQUEST_TOO_LARGE', {
          total: this.imageService.formatBytes(totalSize),
          max: this.imageService.formatBytes(
            this.imageService.MAX_REQUEST_SIZE,
          ),
        }),
      );
      return false;
    }

    return true;
  }

  /**
   * Clear cover image
   */
  clearCoverImage(): void {
    const input = document.getElementById('coverImage') as HTMLInputElement;
    if (input) input.value = '';
  }
}
