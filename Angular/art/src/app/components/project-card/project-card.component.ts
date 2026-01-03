import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Content } from '../../models/content.interface';
import { ProjectCardService } from '../../shared/services/project-card.service';
import { ImageLoaderComponent } from '../../shared/components/image-loader/image-loader.component';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ImageLoaderComponent
  ],
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: Content;
  @Input() isImageLoading: boolean = false;
  @Input() truncateDescription: boolean = false;

  constructor(private projectCardService: ProjectCardService) {}

  getEventDatesDisplay(eventDates: Date[] | null): { dates: Date[], showDots: boolean } {
    return this.projectCardService.getEventDatesDisplay(eventDates);
  }

  truncateText(text: string): string {
    if (text.length > 100) {
      return text.substring(0, 100) + '...';
    }
    return text;
  }

  getDetailRoute(): string[] {
    if (this.project.contentType === 'Course') {
      return ['/projects', 'courses', this.project.id];
    } else if (this.project.contentType === 'Event') {
      return ['/projects', 'events', this.project.id];
    }
    return ['/'];
  }
}
