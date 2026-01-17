import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPreview } from './project-form.interface';
import { QuillModule } from 'ngx-quill';
import { AdminCourseService } from '../../services/admin-course.service';
import { AdminEventService } from '../../services/admin-event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageService } from 'src/app/service/image.service';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, QuillModule, TranslateModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  // File size limits (in bytes)
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per singolo file
  private readonly MAX_REQUEST_SIZE = 200 * 1024 * 1024; // 200MB totale

  projectForm!: FormGroup;
  projectType: 'COURSE' | 'EVENT' = 'COURSE';
  isEditMode: boolean = false;
  projectId?: string;

  // File previews
  coverImagePreview: string | null = null;
  coverImageFile: File | null = null;
  imagesFiles: File[] = [];
  imagesPreviews: string[] = [];
  filesFiles: File[] = [];
  videosFiles: File[] = [];

  // Preview object per componenti riutilizzabili
  previewContent: ProjectPreview | null = null;

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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminCourseService: AdminCourseService,
    private adminEventService: AdminEventService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private translate: TranslateService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    // Determina se siamo in create o edit mode
    this.route.params.subscribe(params => {
      if (params['type']) {
        // Create mode: /admin/projects/create/:type
        this.projectType = params['type'] as 'COURSE' | 'EVENT';
        this.isEditMode = false;
      } else if (params['id']) {
        // Edit mode: /admin/projects/:id/edit
        this.projectId = params['id'];
        this.isEditMode = true;
        // TODO: caricare dati progetto esistente
      }
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      maxParticipants: [1, [Validators.required, Validators.min(1)]],
      informations: [''],
      googleMapsLink: ['']
    });

    // Aggiungi campi specifici per tipo
    if (this.projectType === 'COURSE') {
      this.projectForm.addControl('dateFrom', this.fb.control('', [Validators.required]));
      this.projectForm.addControl('dateTo', this.fb.control('', [Validators.required]));
    } else {
      this.projectForm.addControl('eventDates', this.fb.array([], [Validators.required]));
      this.addEventDate(); // Aggiungi almeno una data iniziale
    }

    // Subscribe a valueChanges per aggiornare preview
    this.projectForm.valueChanges.subscribe(() => {
      this.updatePreview();
    });

    this.updatePreview();
  }

  get eventDates(): FormArray {
    return this.projectForm.get('eventDates') as FormArray;
  }

  addEventDate(): void {
    this.eventDates.push(this.fb.control('', [Validators.required]));
  }

  removeEventDate(index: number): void {
    if (this.eventDates.length > 1) {
      this.eventDates.removeAt(index);
    }
  }

  onCoverImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validazione tipo file
      if (!this.imageService.isValidImage(file)) {
        this.toastService.showError(this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_IMAGE'));
        input.value = ''; // Reset input
        return;
      }

      // Validazione dimensione singolo file
      if (file.size > this.MAX_FILE_SIZE) {
        this.toastService.showError(this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILE_TOO_LARGE', { max: '50MB' }));
        input.value = '';
        return;
      }

      this.coverImageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImagePreview = e.target?.result as string;
        this.updatePreview();
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview = null;
    const input = document.getElementById('coverImage') as HTMLInputElement;
    if (input) input.value = '';
    this.updatePreview();
  }

  onImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);

      // Validazione tipo file
      const invalidFiles = filesArray.filter(file => !this.imageService.isValidImage(file));
      if (invalidFiles.length > 0) {
        this.toastService.showError(`${invalidFiles.length} ${this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_IMAGES')}`);
        input.value = ''; // Reset input
        return;
      }

      // Validazione dimensione singoli file
      const oversizedFiles = filesArray.filter(file => file.size > this.MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        this.toastService.showError(this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILES_TOO_LARGE', { count: oversizedFiles.length, max: '50MB' }));
        input.value = '';
        return;
      }

      // Append invece di sovrascrivere
      filesArray.forEach(file => {
        this.imagesFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagesPreviews.push(e.target?.result as string);
          this.updatePreview();
        };
        reader.readAsDataURL(file);
      });

      // Reset input per permettere ricaricamento stesso file
      input.value = '';
    }
  }

  removeImage(index: number): void {
    this.imagesFiles.splice(index, 1);
    this.imagesPreviews.splice(index, 1);
    this.updatePreview();
  }

  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);

      // Validazione tipo file
      const invalidFiles = filesArray.filter(file => !this.imageService.isValidFile(file));
      if (invalidFiles.length > 0) {
        this.toastService.showError(`${invalidFiles.length} ${this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_FILES')}`);
        input.value = ''; // Reset input
        return;
      }

      // Validazione dimensione singoli file
      const oversizedFiles = filesArray.filter(file => file.size > this.MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        this.toastService.showError(this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILES_TOO_LARGE', { count: oversizedFiles.length, max: '50MB' }));
        input.value = '';
        return;
      }

      // Append invece di sovrascrivere
      this.filesFiles.push(...filesArray);

      // Reset input per permettere ricaricamento stesso file
      input.value = '';
    }
  }

  removeFile(index: number): void {
    this.filesFiles.splice(index, 1);
  }

  onVideosChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);

      // Validazione tipo video
      const invalidFiles = filesArray.filter(file => !this.imageService.isValidVideo(file));
      if (invalidFiles.length > 0) {
        this.toastService.showError(`${invalidFiles.length} ${this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_INVALID_VIDEOS')}`);
        input.value = ''; // Reset input
        return;
      }

      // Validazione dimensione singoli file
      const oversizedFiles = filesArray.filter(file => file.size > this.MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        this.toastService.showError(this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_FILES_TOO_LARGE', { count: oversizedFiles.length, max: '50MB' }));
        input.value = '';
        return;
      }

      // Append invece di sovrascrivere
      this.videosFiles.push(...filesArray);

      // Reset input per permettere ricaricamento stesso file
      input.value = '';
    }
  }

  removeVideo(index: number): void {
    this.videosFiles.splice(index, 1);
  }

  updatePreview(): void {
    const formValue = this.projectForm.value;

    const basePreview = {
      title: formValue.title || 'Titolo del progetto',
      description: formValue.description || 'Descrizione del progetto',
      location: formValue.location || 'Luogo',
      maxParticipants: formValue.maxParticipants || 1,
      informations: formValue.informations || null,
      googleMapsLink: formValue.googleMapsLink || null,
      coverImagePreview: this.coverImagePreview,
      imagesPreviews: this.imagesPreviews,
      filesNames: this.filesFiles.map(f => f.name),
      videosNames: this.videosFiles.map(f => f.name)
    };

    if (this.projectType === 'COURSE') {
      this.previewContent = {
        ...basePreview,
        contentType: 'COURSE',
        dateFrom: formValue.dateFrom ? new Date(formValue.dateFrom) : null,
        dateTo: formValue.dateTo ? new Date(formValue.dateTo) : null
      };
    } else {
      this.previewContent = {
        ...basePreview,
        contentType: 'EVENT',
        eventDates: formValue.eventDates?.map((d: string) => new Date(d)) || []
      };
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid || !this.coverImageFile) {
      this.projectForm.markAllAsTouched();
      return;
    }

    // Validazione dimensione totale prima di inviare
    const totalSize = this.calculateTotalSize();
    console.log('Calculated Size' + totalSize);

    if (totalSize > this.MAX_REQUEST_SIZE) {
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      const maxSizeMB = (this.MAX_REQUEST_SIZE / (1024 * 1024)).toFixed(0);
      this.toastService.showError(this.translate.instant('ADMIN.PROJECTS.FORM.ERROR_REQUEST_TOO_LARGE', { total: totalSizeMB, max: maxSizeMB }));
      return;
    }

    const formData = this.buildFormData();
    this.loaderService.show();

    if (this.projectType === 'COURSE') {
      this.adminCourseService.create(formData).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.toastService.showSuccess(this.translate.instant('ADMIN.PROJECTS.FORM.SUCCESS_COURSE_CREATED'));
          this.router.navigate(['/admin/projects']);
        },
        error: (processedError: ProcessedError) => {
          this.handleError(processedError);
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
          this.handleError(processedError);
        }
      });
    }
  }

  private calculateTotalSize(): number {
    let total = 0;
    if (this.coverImageFile) {
      total += this.coverImageFile.size;
    }
    this.imagesFiles.forEach(file => total += file.size);
    this.filesFiles.forEach(file => total += file.size);
    this.videosFiles.forEach(file => total += file.size);
    return total;
  }

  private handleError(processedError: ProcessedError): void {
    this.loaderService.hide();
    let message: string;

    if (processedError.backendMessage) {
      message = this.translate.instant(processedError.key) + ': ' + processedError.backendMessage;
    } else {
      message = this.translate.instant(processedError.key);
    }
    this.toastService.showError(message);
  }

  private sanitizeHtml(html: string): string {
    if (!html) return html;

    // Rimuove background-color: rgb(255, 255, 255) (bianco)
    html = html.replace(/background-color:\s*rgb\(255,\s*255,\s*255\);?\s*/gi, '');

    // Rimuove color: rgb(0, 0, 0) (nero)
    html = html.replace(/color:\s*rgb\(0,\s*0,\s*0\);?\s*/gi, '');

    // Rimuove color: rgb(33, 43, 49) (dark-gray - colore di default)
    html = html.replace(/color:\s*rgb\(33,\s*43,\s*49\);?\s*/gi, '');

    // Rimuove attributi style vuoti o con solo spazi/punto e virgola
    html = html.replace(/\s*style="\s*;?\s*"/gi, '');

    // Rimuove span senza attributi: <span>testo</span> -> testo
    html = html.replace(/<span>(.*?)<\/span>/gi, '$1');

    // Rimuove strong senza attributi: <strong>testo</strong> rimane strong ma senza style
    html = html.replace(/<(strong|em|u|i|b)\s+>([^<]*)<\/\1>/gi, '<$1>$2</$1>');

    return html;
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const formValue = this.projectForm.value;

    // Campi comuni
    formData.append('title', formValue.title);
    formData.append('description', this.sanitizeHtml(formValue.description));
    formData.append('location', formValue.location);
    formData.append('maxParticipants', formValue.maxParticipants.toString());

    if (formValue.informations) {
      formData.append('informations', this.sanitizeHtml(formValue.informations));
    }
    if (formValue.googleMapsLink) {
      formData.append('googleMapsLink', formValue.googleMapsLink);
    }

    // Campi specifici per tipo
    if (this.projectType === 'COURSE') {
      formData.append('dateFrom', formValue.dateFrom);
      formData.append('dateTo', formValue.dateTo);
    } else {
      // EVENT: array di date
      formValue.eventDates?.forEach((date: string) => {
        formData.append('eventDates', date);
      });
    }

    // Files
    if (this.coverImageFile) {
      formData.append('coverImage', this.coverImageFile);
    }

    this.imagesFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.filesFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.videosFiles.forEach((file) => {
      formData.append('videos', file);
    });

    return formData;
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }
}
