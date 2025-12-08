import { Component, Input } from '@angular/core';
import { Content } from '../../models/content.interface';
import { ProjectCardService } from '../../shared/services/project-card.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: Content;
  @Input() isImageLoading: boolean = false;
  @Input() routerLink?: string | string[];
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
}
