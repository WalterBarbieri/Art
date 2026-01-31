import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
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
export class ProjectPressReviewsFormComponent implements OnInit, OnDestroy, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pressReviews'] && !changes['pressReviews'].firstChange) {
      this.initializeWorkingCopy();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeWorkingCopy(): void {
    // Create a deep copy of own press reviews only
    this.workingPressReviews = this.pressReviews
      .filter(review => review.own)
      .map(review => ({ ...review }));
  }

  addPressReview(): void {
    const newReview: PressReview = {
      id: null as any,
      url: '',
      imagePath: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      own: true
    };

    this.workingPressReviews.push(newReview);
    // Don't emit immediately to avoid UI issues
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
        imagePath: URL.createObjectURL(file)
      };

      this.emitPressReviewsChange();
    }
  }

  removeImage(index: number): void {
    // Reset to empty (user can select a new image)
    this.workingPressReviews[index] = {
      ...this.workingPressReviews[index],
      imagePath: ''
    };

    // Reset file input
    const input = document.getElementById(`pressReviewImage-${index}`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }

    this.emitPressReviewsChange();
  }

  onUrlChange(index: number): void {
    // ngModel has already updated workingPressReviews[index].url
    // Don't emit to avoid UI issues for now
    // this.emitPressReviewsChange();
  }

  private emitPressReviewsChange(): void {
    // Combine original press reviews with modified ones
    // Keep all original reviews (including those with own: false)
    // Replace those with own: true with the modified versions from workingPressReviews
    const modifiedReviewsMap = new Map(this.workingPressReviews.map(review => [review.id, review]));

    const combinedPressReviews = this.pressReviews.map(originalReview => {
      if (originalReview.own && modifiedReviewsMap.has(originalReview.id)) {
        // Use the modified version
        return modifiedReviewsMap.get(originalReview.id)!;
      } else {
        // Keep the original
        return originalReview;
      }
    });

    this.pressReviewsChange.emit(combinedPressReviews);
  }

  onSubmit(): void {
    this.emitPressReviewsChange();
  }
}
