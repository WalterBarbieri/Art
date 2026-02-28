import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ProjectPreview, ProjectFormValue, PressReviewForm } from './project-form.interface';
import { AdminCourseService } from '../../services/admin-course.service';
import { AdminEventService } from '../../services/admin-event.service';
import { ProjectFileService } from '../../services/project-file.service';
import {
  ProjectFormService,
  FormFiles,
  RemovedFiles,
} from '../../services/project-form.service';
import { EventFormService } from '../../services/event-form.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorService } from 'src/app/core/services/error.service';
import { ProjectCoverComponent } from 'src/app/shared/components/project/cover/project-cover';
import { ProjectGalleryComponent } from 'src/app/shared/components/project/gallery/project-gallery';
import { ProjectInfoComponent } from 'src/app/shared/components/project/info/project-info';
import { ProjectFilesComponent } from 'src/app/shared/components/project/files/project-files';
import { AnimatedButtonComponent } from 'src/app/shared/components/animated-button/animated-button.component';
import { ProjectPressReviewsComponent } from 'src/app/shared/components/project/press-reviews/project-press-reviews';

import { environment } from 'src/environments/environment';
import { Course } from 'src/app/models/course.interface';
import { ProjectEvent } from 'src/app/models/event.interface';
import { PressReview } from 'src/app/models/press-review.interface';
import { ProjectMediaService } from '../../services/project-media.service';
import { ProjectSubmitService } from '../../services/project-submit.service';
import { ProjectDetailsInfoComponent } from 'src/app/shared/components/project/details-info/project-details-info.component';
import { ProjectPreviewService } from '../../services/project-preview.service';
import { ProjectMainFormComponent } from './project-main-form/project-main-form.component';
import { ProjectPressReviewsFormComponent } from './project-press-reviews-form/project-press-reviews-form.component';
import { ImageService } from 'src/app/service/image.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ProjectCoverComponent,
    ProjectGalleryComponent,
    ProjectInfoComponent,
    ProjectFilesComponent,
    ProjectDetailsInfoComponent,
    AnimatedButtonComponent,
    ProjectPressReviewsComponent,
    ProjectMainFormComponent,
    ProjectPressReviewsFormComponent,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  projectForm!: FormGroup<any>;
  projectType: 'COURSE' | 'EVENT' = 'COURSE';
  isEditMode: boolean = false;
  projectId?: string;
  originalProject?: Course | ProjectEvent;
  isStaticMode: boolean = environment.isStaticMode;

  // Memory leak prevention
  private destroy$ = new Subject<void>();
  private valueChangesSub?: Subscription;

  // File previews
  coverImagePreview: string | null = null;
  coverImageFile: File | null = null;
  imagesFiles: File[] = [];
  imagesPreviews: string[] = [];
  filesFiles: File[] = [];
  videosFiles: File[] = [];
  videosPreviews: string[] = [];

  // Existing media from DB
  existingCoverImage: string | null = null;
  existingImages: string[] = [];
  existingVideos: { name: string; url: string }[] = [];
  existingFiles: { name: string }[] = [];

  // Original media from DB (for edit mode reset)
  originalCoverImage: string | null = null;
  originalImages: string[] = [];
  originalVideos: { name: string; url: string }[] = [];
  originalFiles: { name: string }[] = [];

  // Removed media tracking (for edit mode)
  removedImages: string[] = [];
  removedFiles: string[] = [];
  removedVideos: string[] = [];

  // Preview object for reusable components
  previewContent$ = this.previewService.preview$;
  previewContent: ProjectPreview | null = null;

  // Press reviews for form
  pressReviews: PressReviewForm[] = [];
  originalPressReviews: PressReviewForm[] = [];

  // Tab management
  activeTab: 'info' | 'press-reviews' = 'info';

  // Media modification tracking
  mediaModified: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminCourseService: AdminCourseService,
    private adminEventService: AdminEventService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private translate: TranslateService,
    private fileService: ProjectFileService,
    private formService: ProjectFormService,
    private eventFormService: EventFormService,
    private errorService: ErrorService,
    private projectMediaService: ProjectMediaService,
    private projectSubmitService: ProjectSubmitService,
    private previewService: ProjectPreviewService,
    private imageService: ImageService,
    public staticAssetService: StaticAssetService,
  ) {}

  ngOnInit(): void {
    // Determine if we are in create or edit mode
    this.route.params.subscribe((params) => {
      if (params['type'] && !params['id']) {
        // Create mode: /admin/projects/create/:type
        this.projectType = params['type'] as 'COURSE' | 'EVENT';
        this.isEditMode = false;
      } else if (params['type'] && params['id']) {
        // Edit mode: /admin/projects/:type/:id/edit
        this.projectType = params['type'].toUpperCase() as 'COURSE' | 'EVENT';
        this.projectId = params['id'];
        this.isEditMode = true;
        this.loadExistingProject();
      }
      this.initializeForm();
    });

    // Subscribe to preview updates
    this.previewContent$.subscribe((preview) => {
      this.previewContent = preview;
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up blob URLs
    this.videosPreviews.forEach((url) => URL.revokeObjectURL(url));
  }

  initializeForm(): void {
    this.projectForm = this.formService.createForm(this.projectType);

    // For create mode events, add at least one empty date slot
    if (!this.isEditMode && this.projectType === 'EVENT') {
      const eventDatesArray = this.projectForm.get('eventDates') as FormArray;
      const emptySlot = this.formService.createEmptyEventDateSlot();
      eventDatesArray.push(emptySlot);
    }

    // Subscribe to valueChanges to update preview
    this.valueChangesSub = this.projectForm.valueChanges.subscribe(() => {
      this.updatePreview();
    });

    this.updatePreview();
  }

  loadExistingProject(): void {
    if (!this.projectId || !this.projectType) return;

    this.loaderService.show();
    if (this.projectType === 'COURSE') {
      this.adminCourseService.getById(this.projectId).subscribe({
        next: (project: Course) => {
          console.log('Existing project data:', project);
          this.originalProject = project;
          this.formService.populateForm(
            this.projectForm,
            project,
            this.projectType,
          );
          this.projectMediaService
            .loadExistingMedia(project)
            .subscribe((media) => {
              this.existingCoverImage = media.coverImage;
              this.existingImages = media.images;
              this.existingVideos = media.videos;
              this.existingFiles = media.files;
              // Save originals for reset
              this.originalCoverImage = media.coverImage;
              this.originalImages = [...media.images];
              this.originalVideos = [...media.videos];
              this.originalFiles = [...media.files];
              this.coverImagePreview = media.coverImage;
              this.imagesPreviews = [...media.images];
              this.videosPreviews = media.videos.map((v) => v.url);
              // Assegna press reviews alla preview
              if (this.previewContent) {
                this.previewContent.pressReviews = media.pressReviews;
              }
              this.pressReviews = media.pressReviews.map(review => ({ ...review, isRemoved: false, imageFile: null }));
              this.originalPressReviews = [...this.pressReviews];
              this.updatePreview();
              this.loaderService.hide();
            });
        },
        error: (processedError: ProcessedError) => {
          this.errorService.handleProcessedError(processedError);
        },
        complete: () => {
          // Loader hide is now inside the media subscribe
        },
      });
    } else {
      this.adminEventService.getById(this.projectId).subscribe({
        next: (project: ProjectEvent) => {
          console.log('Existing project data:', project);
          this.originalProject = project;
          this.formService.populateForm(
            this.projectForm,
            project,
            this.projectType,
          );
          this.projectMediaService
            .loadExistingMedia(project)
            .subscribe((media) => {
              this.existingCoverImage = media.coverImage;
              this.existingImages = media.images;
              this.existingVideos = media.videos;
              this.existingFiles = media.files;
              // Save originals for reset
              this.originalCoverImage = media.coverImage;
              this.originalImages = [...media.images];
              this.originalVideos = [...media.videos];
              this.originalFiles = [...media.files];
              this.coverImagePreview = media.coverImage;
              this.imagesPreviews = [...media.images];
              this.videosPreviews = media.videos.map((v) => v.url);
              // Assegna press reviews alla preview
              if (this.previewContent) {
                this.previewContent.pressReviews = media.pressReviews;
              }
              this.pressReviews = media.pressReviews.map(review => ({ ...review, isRemoved: false, imageFile: null }));
              this.originalPressReviews = [...this.pressReviews];
              this.updatePreview();
              this.loaderService.hide();
            });
        },
        error: (processedError: ProcessedError) => {
          this.errorService.handleProcessedError(processedError);
        },
        complete: () => {
          // Loader hide is now inside the media subscribe
        },
      });
    }
  }

  get eventDates(): FormArray {
    return this.eventFormService.getEventDates(this.projectForm);
  }

  addEventDate(): void {
    this.eventFormService.addEventDateToForm(this.projectForm);
  }

  removeEventDate(index: number): void {
    this.eventFormService.removeEventDateFromForm(this.projectForm, index);
  }

  get videoNames(): { name: string; size?: number }[] {
    return [
      ...this.existingVideos,
      ...this.videosFiles.map((f) => ({ name: f.name, size: f.size })),
    ];
  }

  get fileNames(): { name: string; size?: number }[] {
    return [
      ...this.existingFiles,
      ...this.filesFiles.map((f) => ({ name: f.name, size: f.size })),
    ];
  }

  onCoverImageChange(event: Event): void {
    this.fileService.handleCoverImageChange(event).subscribe({
      next: (result) => {
        this.coverImageFile = result.file;
        this.coverImagePreview = result.preview;
        this.mediaModified = true;
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.existingCoverImage = null;
    this.fileService.clearCoverImage();
    this.mediaModified = true;
    this.updatePreview();
  }

  onImagesChange(event: Event): void {
    this.fileService.handleImagesChange(event).subscribe({
      next: (result) => {
        this.imagesFiles.push(...result.files);
        this.imagesPreviews.push(...result.previews);
        this.mediaModified = true;
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeImage(index: number): void {
    if (index < this.existingImages.length) {
      // Remove existing image - track for removal
      const imagePath = this.imageService.convertUrlToRelativePath(this.existingImages[index]);
      this.removedImages.push(imagePath);
      this.existingImages.splice(index, 1);
      this.imagesPreviews.splice(index, 1);
    } else {
      // Remove new image
      const newIndex = index - this.existingImages.length;
      this.fileService.removeFileFromArray(
        this.imagesFiles,
        newIndex,
        this.imagesPreviews,
        index,
      );
    }
    this.mediaModified = true;
    this.updatePreview();
  }

  onFilesChange(event: Event): void {
    this.fileService.handleFilesChange(event).subscribe({
      next: (files) => {
        this.filesFiles.push(...files);
        this.mediaModified = true;
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeFile(index: number): void {
    if (index < this.existingFiles.length) {
      const filePath = this.originalProject?.filePaths[index];
      if (filePath) {
        this.removedFiles.push(filePath);
      }

      this.existingFiles.splice(index, 1);
    } else {
      // Remove new file
      const newIndex = index - this.existingFiles.length;
      this.fileService.removeFileFromArray(this.filesFiles, newIndex);
    }
    this.mediaModified = true;
    this.updatePreview();
  }

  onVideosChange(event: Event): void {
    this.fileService.handleVideosChange(event).subscribe({
      next: (files) => {
        this.videosFiles.push(...files);
        this.videosPreviews.push(
          ...files.map((file) => URL.createObjectURL(file)),
        );
        this.mediaModified = true;
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeVideo(index: number): void {
    if (index < this.existingVideos.length) {
      const videoPath = this.imageService.convertUrlToRelativePath(this.existingVideos[index].url);
      this.removedVideos.push(videoPath);
      this.existingVideos.splice(index, 1);
      if (this.videosPreviews[index]) {
        URL.revokeObjectURL(this.videosPreviews[index]);
      }
      this.videosPreviews.splice(index, 1);
    } else {
      // Remove new video
      const newIndex = index - this.existingVideos.length;
      if (this.videosPreviews[index]) {
        URL.revokeObjectURL(this.videosPreviews[index]);
      }
      this.fileService.removeFileFromArray(this.videosFiles, newIndex);
      this.videosPreviews.splice(index, 1);
    }
    this.mediaModified = true;
    this.updatePreview();
  }

  updatePreview(): void {
    const formValue: ProjectFormValue = this.projectForm.value;
    const files: FormFiles = {
      coverImage: this.coverImageFile,
      images: this.imagesFiles,
      files: this.filesFiles,
      videos: this.videosFiles,
    };

    const preview = this.formService.createPreview(
      formValue,
      files,
      this.originalProject,
    );
    // Override with component state for previews
    if (preview) {
      preview.coverImagePreview = this.coverImagePreview;
      preview.imagesPreviews = this.imagesPreviews;
      // Add existing media to gallery
      preview.galleryItems = [
        ...this.existingImages.map((url) => ({
          href: url,
          type: 'image' as const,
        })),
        ...this.imagesPreviews
          .slice(this.existingImages.length)
          .map((url) => ({ href: url, type: 'image' as const })),
        ...this.videosPreviews.map((url) => ({
          href: url,
          type: 'video' as const,
          source: 'local' as const,
        })),
      ];
      preview.filePaths = [
        ...this.existingFiles.map((f) => f.name),
        ...this.filesFiles.map((f) => f.name),
      ];
      // Use current press reviews (filter out removed ones)
      preview.pressReviews = this.pressReviews.filter(review => !review.isRemoved);
    }
    this.previewService.setPreview(preview);
  }

  setActiveTab(tab: 'info' | 'press-reviews'): void {
    this.activeTab = tab;
  }

  onPressReviewsChange(pressReviews: PressReviewForm[]): void {
    this.pressReviews = pressReviews;
    this.updatePreview();
  }

  onSubmit(): void {
    console.log('onSubmit called with:', {
      projectType: this.projectType,
      isEditMode: this.isEditMode,
      projectId: this.projectId,
      formValue: this.projectForm.value,
      pressReviews: this.pressReviews
    });

    if (
      this.projectForm.invalid ||
      (!this.coverImageFile && !this.existingCoverImage)
    ) {
      this.projectForm.markAllAsTouched();
      return;
    }

    // Total size validation before submit
    const allFiles = [
      this.coverImageFile,
      ...this.imagesFiles,
      ...this.filesFiles,
      ...this.videosFiles,
    ].filter(Boolean) as File[];

    if (!this.fileService.validateTotalSize(allFiles)) {
      return;
    }

    const formValue: ProjectFormValue = {
      ...this.projectForm.value,
      pressReviews: this.pressReviews,
    };
    const files: FormFiles = {
      coverImage: this.coverImageFile,
      images: this.imagesFiles,
      files: this.filesFiles,
      videos: this.videosFiles,
    };

    const removedFiles: RemovedFiles = {
      removedImages: this.removedImages,
      removedFiles: this.removedFiles,
      removedVideos: this.removedVideos,
    };

    this.loaderService.show();

    this.projectSubmitService
      .submit(
        this.projectType,
        formValue,
        files,
        this.isEditMode,
        this.projectId,
        removedFiles
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          const successMessage =
            this.projectType === 'COURSE'
              ? (this.isEditMode
                  ? 'ADMIN.PROJECTS.FORM.SUCCESS_COURSE_UPDATED'
                  : 'ADMIN.PROJECTS.FORM.SUCCESS_COURSE_CREATED')
              : (this.isEditMode
                  ? 'ADMIN.PROJECTS.FORM.SUCCESS_EVENT_UPDATED'
                  : 'ADMIN.PROJECTS.FORM.SUCCESS_EVENT_CREATED');
          this.toastService.showSuccess(this.translate.instant(successMessage));
          this.router.navigate(['/admin/projects']);
        },
        error: (error) => {
          this.loaderService.hide();
          if (error instanceof Error) {
            this.toastService.showError(error.message);
          } else {
            this.errorService.handleProcessedError(error);
          }
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  addPressReview(data: { url: string; image: File }): void {
    // TODO: Implement press review addition logic
    console.log('Adding press review:', data);
  }

  removePressReview(index: number): void {
    // TODO: Implement press review removal logic
    console.log('Removing press review at index:', index);
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }

  onResetForm(): void {
    if (this.isEditMode) {
      // Reset to original values
      if (this.originalProject) {
        this.formService.populateForm(this.projectForm, this.originalProject, this.projectType);
        this.pressReviews = [...this.originalPressReviews];
      }
      // Reset media to originals
      this.existingCoverImage = this.originalCoverImage;
      this.existingImages = [...this.originalImages];
      this.existingVideos = [...this.originalVideos];
      this.existingFiles = [...this.originalFiles];
      // Clear new files
      this.coverImageFile = null;
      this.imagesFiles = [];
      this.videosFiles = [];
      this.filesFiles = [];
      // Recreate previews
      this.coverImagePreview = this.originalCoverImage;
      this.imagesPreviews = [...this.originalImages];
      this.videosPreviews = this.originalVideos.map(v => v.url);

      // Clear removed tracking
      this.removedImages = [];
      this.removedFiles = [];
      this.removedVideos = [];
      // Clean up any blob URLs from new videos (but since we cleared videosFiles, no new blobs)
    } else {
      // Reset form to empty state (create mode)
      this.projectForm.reset();
      // For events, ensure at least one empty date slot
      if (this.projectType === 'EVENT') {
        const eventDatesArray = this.projectForm.get('eventDates') as FormArray;
        eventDatesArray.clear();
        const emptySlot = this.formService.createEmptyEventDateSlot();
        eventDatesArray.push(emptySlot);
      }
      // Reset all file selections and previews (create mode)
      this.coverImageFile = null;
      this.imagesFiles = [];
      this.videosFiles = [];
      this.filesFiles = [];

      // Clean up blob URLs
      this.coverImagePreview = null;
      this.imagesPreviews.forEach((url) => URL.revokeObjectURL(url));
      this.imagesPreviews = [];
      this.videosPreviews.forEach((url) => URL.revokeObjectURL(url));
      this.videosPreviews = [];
    }

    // Reset cover image input
    this.fileService.clearCoverImage();

    // Reset media modification flag
    this.mediaModified = false;

    // Update preview
    this.updatePreview();
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  // Preview data preparation methods
  get previewGalleryItems(): any[] {
    const items: any[] = [];
    if (this.previewContent?.coverImagePreview) {
      items.push({
        href: this.previewContent.coverImagePreview,
        type: 'image',
      });
    }
    if (this.previewContent?.imagesPreviews) {
      items.push(
        ...this.previewContent.imagesPreviews.map((preview) => ({
          href: preview,
          type: 'image',
        })),
      );
    }
    if (this.videosPreviews) {
      items.push(
        ...this.videosPreviews.map((preview) => ({
          href: preview,
          type: 'video',
        })),
      );
    }
    return items;
  }

  get previewFilePaths(): string[] {
    if (!this.previewContent) return [];
    return [...this.previewContent.filesNames];
  }
}
