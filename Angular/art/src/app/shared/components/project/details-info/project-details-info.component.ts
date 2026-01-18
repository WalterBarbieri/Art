import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-details-info',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './project-details-info.component.html',
  styleUrls: ['./project-details-info.component.scss']
})
export class ProjectDetailsInfoComponent {
  @Input() projectType!: 'course' | 'event';
  @Input() project!: any;

  calculateMaxParticipants(project: any): number {
    // Copia la logica da event-detail, assumendo sia simile
    if (project.eventDateSlots && project.eventDateSlots.length > 0) {
      return Math.min(...project.eventDateSlots.map((slot: any) => slot.maxParticipants));
    }
    return project.maxParticipants || 0;
  }
}
