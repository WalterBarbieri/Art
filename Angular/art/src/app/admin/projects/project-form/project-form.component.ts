import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ProjectPreview, ProjectFormValue } from './project-form.interface';
import { AdminCourseService } from '../../services/admin-course.service';
import { AdminEventService } from '../../services/admin-event.service';
import { ProjectFileService } from '../../services/project-file.service';
import {
  ProjectFormService,
  FormFiles,
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
  existingVideos: { name: string; size?: number }[] = [];
  existingFiles: { name: string; size?: number }[] = [];

  // Preview object for reusable components
  previewContent$ = this.previewService.preview$;
  previewContent: ProjectPreview | null = null;

  fallbackImage: string = environment.fallBackImage;

  // Tab management
  activeTab: 'info' | 'press-reviews' = 'info';

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
              this.coverImagePreview = media.coverImage;
              this.imagesPreviews = [...media.images];
              this.videosPreviews = media.videos.map((v) => v.url);
              // Assegna press reviews alla preview
              if (this.previewContent) {
                this.previewContent.pressReviews = media.pressReviews;
              }
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
              this.coverImagePreview = media.coverImage;
              this.imagesPreviews = [...media.images];
              this.videosPreviews = media.videos.map((v) => v.url);
              // Assegna press reviews alla preview
              if (this.previewContent) {
                this.previewContent.pressReviews = media.pressReviews;
              }
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
    this.updatePreview();
  }

  onImagesChange(event: Event): void {
    this.fileService.handleImagesChange(event).subscribe({
      next: (result) => {
        this.imagesFiles.push(...result.files);
        this.imagesPreviews.push(...result.previews);
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeImage(index: number): void {
    if (index < this.existingImages.length) {
      // Remove existing image
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
    this.updatePreview();
  }

  onFilesChange(event: Event): void {
    this.fileService.handleFilesChange(event).subscribe({
      next: (files) => {
        this.filesFiles.push(...files);
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeFile(index: number): void {
    if (index < this.existingFiles.length) {
      // Remove existing file
      this.existingFiles.splice(index, 1);
    } else {
      // Remove new file
      const newIndex = index - this.existingFiles.length;
      this.fileService.removeFileFromArray(this.filesFiles, newIndex);
    }
    this.updatePreview();
  }

  onVideosChange(event: Event): void {
    this.fileService.handleVideosChange(event).subscribe({
      next: (files) => {
        this.videosFiles.push(...files);
        this.videosPreviews.push(
          ...files.map((file) => URL.createObjectURL(file)),
        );
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      },
    });
  }

  removeVideo(index: number): void {
    if (index < this.existingVideos.length) {
      // Remove existing video
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
      // Use current press reviews from previewContent if available, otherwise original
      if (this.previewContent?.pressReviews) {
        preview.pressReviews = this.previewContent.pressReviews;
      } else if (this.originalProject?.pressReviews) {
        preview.pressReviews = this.originalProject.pressReviews;
      }
    }
    this.previewService.setPreview(preview);
  }

  setActiveTab(tab: 'info' | 'press-reviews'): void {
    this.activeTab = tab;
  }

  onSubmit(): void {
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

    const formValue: ProjectFormValue = this.projectForm.value;
    const files: FormFiles = {
      coverImage: this.coverImageFile,
      images: this.imagesFiles,
      files: this.filesFiles,
      videos: this.videosFiles,
    };

    this.loaderService.show();

    this.projectSubmitService
      .submit(
        this.projectType,
        formValue,
        files,
        this.isEditMode,
        this.projectId,
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          const successMessage =
            this.projectType === 'COURSE'
              ? 'ADMIN.PROJECTS.FORM.SUCCESS_COURSE_CREATED'
              : 'ADMIN.PROJECTS.FORM.SUCCESS_EVENT_CREATED';
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

  onPressReviewsChange(pressReviews: PressReview[]): void {
    if (this.previewContent) {
      this.previewContent.pressReviews = pressReviews;
      this.updatePreview();
    }
  }
}
