import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPreview } from './project-form.interface';
import { TextareaAutoresizeDirective } from 'src/app/directive/textarea-autoresize.directive';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, TextareaAutoresizeDirective, QuillModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
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
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ]
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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
      this.coverImageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImagePreview = e.target?.result as string;
        this.updatePreview();
      };
      reader.readAsDataURL(file);
    }
  }

  onImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imagesFiles = Array.from(input.files);
      this.imagesPreviews = [];

      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagesPreviews.push(e.target?.result as string);
          this.updatePreview();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.filesFiles = Array.from(input.files);
    }
  }

  onVideosChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.videosFiles = Array.from(input.files);
    }
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
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    // TODO: Costruire FormData e chiamare service
    console.log('Form valido:', this.projectForm.value);
    console.log('Files:', {
      coverImage: this.coverImageFile,
      images: this.imagesFiles,
      files: this.filesFiles,
      videos: this.videosFiles
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }
}
