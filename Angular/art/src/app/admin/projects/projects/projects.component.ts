import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Content } from 'src/app/models/content.interface';
import { ImageService } from 'src/app/service/image.service';
import { AdminContentService } from '../../services/admin-content.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { FilterValues, ProjectFiltersComponent } from 'src/app/shared/components/project/project-filters/project-filters.component';
import { RouterModule } from '@angular/router';
import { ProjectCardComponent } from 'src/app/shared/components/project/project-card/project-card.component';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-projects',
  imports: [RouterModule, ProjectFiltersComponent, ProjectCardComponent, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Content[] = [];
  filteredProjects: Content[] = [];
  imageLoading: boolean[] = [];

  constructor(
    private adminContentService: AdminContentService,
    private imageService: ImageService,
    private loaderService: LoaderService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  getFullImageUrl(imagePath: string | null, index: number): void {
    this.imageLoading[index] = true;
    this.imageService.getFullImageUrl(imagePath).subscribe({
      next: (url) => {
        this.projects[index].coverImagePath = url;
        this.imageLoading[index] = false;
      },
      error: () => {
        this.imageLoading[index] = false;
      }
    });
  }

  getAllProjects(): void {
    this.loaderService.show();
    this.adminContentService.getAllSorted().subscribe({
      next: (data: Content[]) => {
        this.projects = data.map(project => ({
          ...project,
          eventDates: project.eventDates ? project.eventDates.map(d => new Date(d)) : []
        }));
        this.imageLoading = new Array(this.projects.length).fill(false);
        this.projects.forEach((project, index) => {
          this.getFullImageUrl(project.coverImagePath, index);
        });
        this.filteredProjects = [...this.projects];

      },
      error: (processedError: ProcessedError) => {
        this.errorService.handleProcessedError(processedError);
      },
      complete: () => {
        this.loaderService.hide();
      }
    })
  }

  onFiltersChanged(filters: FilterValues): void {
      this.filteredProjects = this.projects.filter((project) => {
        const statusMatch =
          filters.status === 'all' ||
          project.contentStatus === filters.status;

        const typeMatch =
          filters.type === 'all' ||
          project.contentType === filters.type;

        const archivedMatch =
          !filters.archived ||
          filters.archived === 'all' ||
          (filters.archived === 'archived' ? project.archived === true : project.archived !== true);

        return statusMatch && typeMatch && archivedMatch;
      });

      if (filters.sortOrder === 'reverse') {
        this.filteredProjects.reverse();
      }
    }

}
