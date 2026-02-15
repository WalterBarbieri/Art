import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectPreviewService } from '../../../services/project-preview.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-main-form',
  imports: [CommonModule, ReactiveFormsModule, QuillModule, TranslateModule],
  templateUrl: './project-main-form.component.html',
  styleUrl: './project-main-form.component.scss',
})
export class ProjectMainFormComponent implements OnInit, OnDestroy {
  @Input() projectForm!: FormGroup<any>;
  @Input() projectType: 'COURSE' | 'EVENT' = 'COURSE';
  @Input() isEditMode: boolean = false;
  @Input() existingCoverImage: string | null = null;
  @Input() existingImages: string[] = [];
  @Input() existingVideos: { name: string; size?: number }[] = [];
  @Input() existingFiles: { name: string; size?: number }[] = [];
  @Input() coverImagePreview: string | null = null;
  @Input() imagesPreviews: string[] = [];
  @Input() videosPreviews: string[] = [];
  @Input() filesFiles: File[] = [];
  @Input() videosFiles: File[] = [];
  @Input() coverImageFile: File | null = null;

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();
  @Output() coverImageChange = new EventEmitter<Event>();
  @Output() imagesChange = new EventEmitter<Event>();
  @Output() videosChange = new EventEmitter<Event>();
  @Output() filesChange = new EventEmitter<Event>();
  @Output() removeCoverImageEvent = new EventEmitter<void>();
  @Output() removeImageEvent = new EventEmitter<number>();
  @Output() removeVideoEvent = new EventEmitter<number>();
  @Output() removeFileEvent = new EventEmitter<number>();
  @Output() addEventDateEvent = new EventEmitter<void>();
  @Output() removeEventDateEvent = new EventEmitter<number>();
  @Output() resetFormEvent = new EventEmitter<void>();

  // Memory leak prevention
  private destroy$ = new Subject<void>();
  private valueChangesSub?: Subscription;

  // Preview object for reusable components
  previewContent$ = this.previewService.preview$;

  fallbackImage: string = environment.fallBackImage;

  // Quill editor configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [
        {
          color: [
            '#212B31', // dark-gray: rgb(33, 43, 49)
            '#40B0C4', // dark-cyan: rgb(64, 176, 196)
            '#7FCBD8', // light-cyan: rgb(127, 203, 216)
            '#8E400F', // brown: rgb(142, 64, 15)
            '#5DD479', // light-green: rgba(93, 212, 121, 0.95)
            '#FFDA6C', // light-yellow: rgb(255, 218, 108, 0.95)
            '#F36464', // light-red: rgb(243, 100, 100, 0.95)
          ],
        },
      ],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  constructor(private previewService: ProjectPreviewService) {}

  ngOnInit(): void {
    // Subscribe to form value changes to update preview
    this.valueChangesSub = this.projectForm.valueChanges.subscribe(() => {
      this.updatePreview();
    });

    // Handle eventDates changes to enable/disable date controls based on isRemoved
    if (this.projectType === 'EVENT') {
      this.eventDates.controls.forEach((slotGroup, index) => {
        const isRemovedControl = slotGroup.get('isRemoved');
        const dateControl = slotGroup.get('date');
        if (isRemovedControl && dateControl) {
          isRemovedControl.valueChanges.subscribe((isRemoved: boolean) => {
            if (isRemoved) {
              dateControl.disable({ emitEvent: false });
            } else {
              dateControl.enable({ emitEvent: false });
            }
          });
          // Initial state
          if (isRemovedControl.value) {
            dateControl.disable({ emitEvent: false });
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
  }

  get eventDates(): FormArray {
    return this.projectForm.get('eventDates') as FormArray;
  }

  get videoNames(): { name: string; size?: number }[] {
    return [
      ...this.existingVideos.map((v) => ({ name: v.name, size: v.size })),
      ...this.videosFiles.map((f) => ({ name: f.name, size: f.size })),
    ];
  }

  get fileNames(): { name: string; size?: number }[] {
    return [
      ...this.existingFiles.map((f) => ({ name: f.name, size: f.size })),
      ...this.filesFiles.map((f) => ({ name: f.name, size: f.size })),
    ];
  }

  onSubmit(): void {
    this.submitForm.emit();
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  onCoverImageChange(event: Event): void {
    this.coverImageChange.emit(event);
  }

  onImagesChange(event: Event): void {
    this.imagesChange.emit(event);
  }

  onVideosChange(event: Event): void {
    this.videosChange.emit(event);
  }

  onFilesChange(event: Event): void {
    this.filesChange.emit(event);
  }

  removeCoverImage(): void {
    this.removeCoverImageEvent.emit();
  }

  removeImage(index: number): void {
    this.removeImageEvent.emit(index);
  }

  removeVideo(index: number): void {
    this.removeVideoEvent.emit(index);
  }

  removeFile(index: number): void {
    this.removeFileEvent.emit(index);
  }

  addEventDate(): void {
    this.addEventDateEvent.emit();
  }

  removeEventDate(index: number): void {
    const slotGroup = this.eventDates.at(index);
    if (slotGroup.get('id')?.value) {
      // Existing slot: mark as removed
      slotGroup.get('isRemoved')?.setValue(true);
    } else {
      // New slot: remove from array
      this.eventDates.removeAt(index);
    }
  }

  restoreEventDate(index: number): void {
    const slotGroup = this.eventDates.at(index);
    slotGroup.get('isRemoved')?.setValue(false);
  }

  resetForm(): void {
    // Reset the form to empty state (only for create mode)
    this.projectForm.reset();
    this.resetFormEvent.emit();
  }

  private updatePreview(): void {
    // This will be handled by the parent component
    // The preview update logic is in the parent
  }
}
