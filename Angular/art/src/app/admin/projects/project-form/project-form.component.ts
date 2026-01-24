import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ProjectPreview, ProjectFormValue } from './project-form.interface';
import { QuillModule } from 'ngx-quill';
import { AdminCourseService } from '../../services/admin-course.service';
import { AdminEventService } from '../../services/admin-event.service';
import { ProjectFileService } from '../../services/project-file.service';
import { ProjectFormService, FormFiles } from '../../services/project-form.service';
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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, QuillModule, TranslateModule, ProjectCoverComponent, ProjectGalleryComponent, ProjectInfoComponent, ProjectFilesComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  projectForm!: FormGroup<any>;
  projectType: 'COURSE' | 'EVENT' = 'COURSE';
  isEditMode: boolean = false;
  projectId?: string;

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

  // Preview object for reusable components
  previewContent: ProjectPreview | null = null;

  fallbackImage: string = environment.fallBackImage;

  // Quill editor configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{
        'color': [
          '#212B31', // dark-gray: rgb(33, 43, 49)
          '#40B0C4', // dark-cyan: rgb(64, 176, 196)
          '#7FCBD8', // light-cyan: rgb(127, 203, 216)
          '#8E400F', // brown: rgb(142, 64, 15)
          '#5DD479', // light-green: rgba(93, 212, 121, 0.95)
          '#FFDA6C', // light-yellow: rgb(255, 218, 108, 0.95)
          '#F36464'  // light-red: rgb(243, 100, 100, 0.95)
        ]
      }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ]
  };

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
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    // Determine if we are in create or edit mode
    this.route.params.subscribe(params => {
      if (params['type']) {
        // Create mode: /admin/projects/create/:type
        this.projectType = params['type'] as 'COURSE' | 'EVENT';
        this.isEditMode = false;
      } else if (params['id']) {
        // Edit mode: /admin/projects/:id/edit
        this.projectId = params['id'];
        this.isEditMode = true;
        // TODO: load existing project data
      }
      this.initializeForm();
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.projectForm = this.formService.createForm(this.projectType);

    // Subscribe to valueChanges to update preview
    this.valueChangesSub = this.projectForm.valueChanges.subscribe(() => {
      this.updatePreview();
    });

    this.updatePreview();
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

  onCoverImageChange(event: Event): void {
    this.fileService.handleCoverImageChange(event).subscribe({
      next: (result) => {
        this.coverImageFile = result.file;
        this.coverImagePreview = result.preview;
        this.updatePreview();
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview = null;
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
      }
    });
  }

  removeImage(index: number): void {
    this.fileService.removeFileFromArray(this.imagesFiles, index, this.imagesPreviews, index);
    this.updatePreview();
  }

  onFilesChange(event: Event): void {
    this.fileService.handleFilesChange(event).subscribe({
      next: (files) => {
        this.filesFiles.push(...files);
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  removeFile(index: number): void {
    this.fileService.removeFileFromArray(this.filesFiles, index);
  }

  onVideosChange(event: Event): void {
    this.fileService.handleVideosChange(event).subscribe({
      next: (files) => {
        this.videosFiles.push(...files);
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  removeVideo(index: number): void {
    this.fileService.removeFileFromArray(this.videosFiles, index);
  }



  updatePreview(): void {
    const formValue: ProjectFormValue = this.projectForm.value;
    const files: FormFiles = {
      coverImage: this.coverImageFile,
      images: this.imagesFiles,
      files: this.filesFiles,
      videos: this.videosFiles
    };

    this.previewContent = this.formService.createPreview(formValue, files);
    // Override with component state for previews
    if (this.previewContent) {
      this.previewContent.coverImagePreview = this.coverImagePreview;
      this.previewContent.imagesPreviews = this.imagesPreviews;
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid || !this.coverImageFile) {
      this.projectForm.markAllAsTouched();
      return;
    }

    // Total size validation before submit
    const allFiles = [
      this.coverImageFile,
      ...this.imagesFiles,
      ...this.filesFiles,
      ...this.videosFiles
    ].filter(Boolean) as File[];

    if (!this.fileService.validateTotalSize(allFiles)) {
      return;
    }

    const formValue: ProjectFormValue = this.projectForm.value;
    const files: FormFiles = {
      coverImage: this.coverImageFile,
      images: this.imagesFiles,
      files: this.filesFiles,
      videos: this.videosFiles
    };

    const formData = this.formService.buildFormData(formValue, files);
    this.loaderService.show();

    if (this.projectType === 'COURSE') {
      this.adminCourseService.create(formData).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.toastService.showSuccess(this.translate.instant('ADMIN.PROJECTS.FORM.SUCCESS_COURSE_CREATED'));
          this.router.navigate(['/admin/projects']);
        },
        error: (processedError: ProcessedError) => {
          this.errorService.handleProcessedError(processedError);
        },
        complete: () => {
          this.loaderService.hide();
        }
      });
    } else {
      this.adminEventService.create(formData).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.toastService.showSuccess(this.translate.instant('ADMIN.PROJECTS.FORM.SUCCESS_EVENT_CREATED'));
          this.router.navigate(['/admin/projects']);
        },
        error: (processedError: ProcessedError) => {
          this.errorService.handleProcessedError(processedError);
        },
        complete: () => {
          this.loaderService.hide();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }

  // Preview data preparation methods
  get previewGalleryItems(): any[] {
    const items: any[] = [];
    if (this.previewContent?.coverImagePreview) {
      items.push({
        href: this.previewContent.coverImagePreview,
        type: 'image'
      });
    }
    if (this.previewContent?.imagesPreviews) {
      items.push(...this.previewContent.imagesPreviews.map(preview => ({
        href: preview,
        type: 'image'
      })));
    }
    return items;
  }

  get previewFilePaths(): string[] {
    if (!this.previewContent) return [];
    return [
      ...this.previewContent.filesNames,
      ...this.previewContent.videosNames
    ];
  }
}
