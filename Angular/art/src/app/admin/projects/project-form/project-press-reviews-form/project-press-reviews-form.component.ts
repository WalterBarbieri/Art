import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PressReviewForm } from '../project-form.interface';
import { ProjectFileService } from '../../../services/project-file.service';

@Component({
  selector: 'app-project-press-reviews-form',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './project-press-reviews-form.component.html',
  styleUrl: './project-press-reviews-form.component.scss',
})
export class ProjectPressReviewsFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() pressReviews: PressReviewForm[] = [];
  @Input() projectType: 'COURSE' | 'EVENT' = 'COURSE';
  @Input() isEditMode: boolean = false;
  @Input() projectId?: string;
  @Input() refreshTrigger: number = 0;
  @Input() canSubmit: boolean = false;
  @Input() canReset: boolean = false;

  @Output() pressReviewsChange = new EventEmitter<PressReviewForm[]>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();
  @Output() resetFormEvent = new EventEmitter<void>();

  // Working copy - never modify the original input
  workingPressReviews: PressReviewForm[] = [];

  // Memory leak prevention
  private destroy$ = new Subject<void>();

  constructor(private projectFileService: ProjectFileService) {}

  ngOnInit(): void {
    this.initializeWorkingCopy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.initializeWorkingCopy();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeWorkingCopy(): void {
    // Create a deep copy of own press reviews only, with isRemoved: false
    this.workingPressReviews = this.pressReviews
      .filter((review) => review.own)
      .map((review) => ({ ...review, isRemoved: false }));
  }

  addPressReview(): void {
    const newReview: PressReviewForm = {
      id: '', // No id for new reviews
      url: '',
      imagePath: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      own: true,
      isRemoved: false,
    };

    this.workingPressReviews.push(newReview);
    this.emitPressReviewsChange();
  }

  removePressReview(index: number): void {
    // Mark as removed instead of deleting from array
    this.workingPressReviews[index].isRemoved = true;
    this.emitPressReviewsChange();
  }

  onImageChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file using ProjectFileService
      this.projectFileService.handleCoverImageChange(event).subscribe({
        next: (result) => {
          // Update working copy with file and preview
          this.workingPressReviews[index] = {
            ...this.workingPressReviews[index],
            imageFile: result.file,
            imagePath: result.preview, // For preview
          };
          this.emitPressReviewsChange();
        },
        error: () => {
          // Error already handled in service (toast)
          input.value = '';
        },
      });
    }
  }

  removeImage(index: number): void {
    // Reset image
    this.workingPressReviews[index] = {
      ...this.workingPressReviews[index],
      imagePath: '',
      imageFile: undefined,
    };

    // Reset file input
    const input = document.getElementById(
      `pressReviewImage-${index}`,
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }

    this.emitPressReviewsChange();
  }

  onUrlChange(index: number): void {
    this.emitPressReviewsChange();
  }

  private emitPressReviewsChange(): void {
    // Combine: keep all original reviews that are NOT own (external reviews)
    // Plus all reviews from workingPressReviews (modified/added/own reviews, including removed)
    const combinedPressReviews: PressReviewForm[] = [
      ...this.pressReviews.filter((review) => !review.own), // Keep external reviews
      ...this.workingPressReviews, // Add all working copy reviews (modified/added/removed)
    ];

    this.pressReviewsChange.emit(combinedPressReviews);
  }

  onSubmit(): void {
    this.submitForm.emit();
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  onReset(): void {
    this.resetFormEvent.emit();
    console.log('onReset Called');
  }

  public reset(): void {
    this.initializeWorkingCopy();
    console.log('reset Called');
  }
}
