import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-project-cover',
  imports: [CommonModule, TranslateModule, SafeHtmlPipe],
  templateUrl: './project-cover.html',
  styleUrls: ['./project-cover.scss']
})
export class ProjectCoverComponent {
  @Input() coverImagePath!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() isPreviewMode: boolean = false;
  @Output() imageClick = new EventEmitter<void>();

  onImageClick(): void {
    if (!this.isPreviewMode) {
      this.imageClick.emit();
    }
  }
}
