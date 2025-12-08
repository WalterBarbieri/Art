import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Content } from 'src/app/models/content.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { ContentService } from 'src/app/service/content.service';
import { ImageService } from 'src/app/service/image.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Content[] = [];
  filteredProjects: Content[] = [];
  imageLoading: boolean[] = [];
  selectedStatusFilter: string = 'all';
  selectedTypeFilter: string = 'all';
  selectedSortOrder: string = 'default';
  showFilters: boolean = false;

  constructor(
    private contentService: ContentService,
    private imageService: ImageService,
    private router: Router,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  getFullImageUrl(imagePath: string | null, index: number): void {
    this.imageLoading[index] = true;
    this.imageService.getFullImageUrl(imagePath).subscribe(
      (url) => {
        this.projects[index].coverImagePath = url;
       // Test: commento hide per vedere il loader più a lungo
          // this.imageLoading[index] = false;

          // Opzionale: nascondi dopo 2 secondi per test
          setTimeout(() => {
            this.imageLoading[index] = false;
          }, 2000);
      },
      () => {
          this.imageLoading[index] = false;
      }
    );
  }

  getAllProjects(): void {
    this.loaderService.show();
    this.contentService.getAllSorted().subscribe({
      next: (data: Content[]) => {
        this.projects = data.map(project => ({
            ...project,
            eventDates: project.eventDates ? project.eventDates.map(d => new Date(d)) : []
          }));
        this.imageLoading = new Array(this.projects.length).fill(false);
        this.projects.forEach((project, index) => {
          this.getFullImageUrl(project.coverImagePath, index);
        });
        this.applyFilters();
      },
      error: (processedError: ProcessedError) => {
        let message: string;
        if (processedError.backendMessage) {
          message = this.translate.instant(processedError.key) + ': ' + processedError.backendMessage;
        } else {
          message = this.translate.instant(processedError.key);
        }
        this.toastService.showError(message);
      },
      complete: () => {
        this.loaderService.hide();
      },
    });
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter((project) => {
      const statusMatch =
        this.selectedStatusFilter === 'all' ||
        project.contentStatus === this.selectedStatusFilter;

      const typeMatch =
        this.selectedTypeFilter === 'all' ||
        project.contentType === this.selectedTypeFilter;

      return statusMatch && typeMatch;
    });

    this.applySorting();
  }

  applySorting(): void {
    if (this.selectedSortOrder === 'reverse') {
      this.filteredProjects.reverse();
    }
  }
}
