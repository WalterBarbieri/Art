import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-press-reviews',
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-press-reviews.html',
  styleUrls: ['./project-press-reviews.scss']
})
export class ProjectPressReviewsComponent {
  @Input() pressReviews: any[] = [];
  @Output() reviewClick = new EventEmitter<string>();

  onReviewClick(url: string): void {
    this.reviewClick.emit(url);
  }
}
