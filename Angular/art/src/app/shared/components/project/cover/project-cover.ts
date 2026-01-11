import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-cover',
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-cover.html',
  styleUrls: ['./project-cover.scss']
})
export class ProjectCoverComponent {
  @Input() coverImagePath!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Output() imageClick = new EventEmitter<void>();

  onImageClick(): void {
    this.imageClick.emit();
  }
}
