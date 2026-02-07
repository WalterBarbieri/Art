import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PressReview } from 'src/app/models/press-review.interface';

@Component({
  selector: 'app-project-press-reviews-form',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './project-press-reviews-form.component.html',
  styleUrl: './project-press-reviews-form.component.scss',
})
export class ProjectPressReviewsFormComponent implements OnInit, OnDestroy {
  @Input() pressReviews: PressReview[] = [];
  @Input() projectType: 'COURSE' | 'EVENT' = 'COURSE';
  @Input() isEditMode: boolean = false;

  @Output() pressReviewsChange = new EventEmitter<PressReview[]>();

  // Working copy - never modify the original input
  workingPressReviews: PressReview[] = [];

  // Memory leak prevention
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.initializeWorkingCopy();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeWorkingCopy(): void {
    // Create a deep copy of own press reviews only
    this.workingPressReviews = this.pressReviews
      .filter((review) => review.own)
      .map((review) => ({ ...review }));
  }

  addPressReview(): void {
    const newReview: PressReview = {
      id: null as any,
      url: '',
      imagePath: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      own: true,
    };

    this.workingPressReviews.push(newReview);
    this.emitPressReviewsChange();
  }

  removePressReview(index: number): void {
    this.workingPressReviews.splice(index, 1);
    this.emitPressReviewsChange();
  }

  onImageChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Update working copy with blob URL for preview
      this.workingPressReviews[index] = {
        ...this.workingPressReviews[index],
        imagePath: URL.createObjectURL(file),
      };
      this.emitPressReviewsChange();
    }
  }

  removeImage(index: number): void {
    // Reset to empty (user can select a new image)
    this.workingPressReviews[index] = {
      ...this.workingPressReviews[index],
      imagePath: '',
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
    // Create a map of modified/added reviews for quick lookup
    const modifiedReviewsMap = new Map(
      this.workingPressReviews.map((review) => [review.id, review]),
    );

    // Combine: keep all original reviews that are NOT own (external reviews)
    // Plus all reviews from workingPressReviews (modified/added/own reviews)
    const combinedPressReviews = [
      ...this.pressReviews.filter((review) => !review.own), // Keep external reviews
      ...this.workingPressReviews, // Add all working copy reviews (modified/added)
    ];

    this.pressReviewsChange.emit(combinedPressReviews);
  }

  onSubmit(): void {
    this.emitPressReviewsChange();
  }
}
