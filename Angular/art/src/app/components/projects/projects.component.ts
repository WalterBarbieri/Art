import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Content } from 'src/app/models/content.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { ContentService } from 'src/app/service/content.service';
import { ImageService } from 'src/app/service/image.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Content[] = [];
  filteredProjects: Content[] = [];
  successToast: boolean = false;
  errorToast: boolean = false;
  toastMessage: string = '';
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
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  getFullImageUrl(imagePath: string | null, index: number): void {
    this.imageLoading[index] = true;
    this.imageService.getFullImageUrl(imagePath).subscribe(
      (url) => {
        this.projects[index].coverImagePath = url;
        this.imageLoading[index] = false;
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
        this.projects = data;
        this.imageLoading = new Array(this.projects.length).fill(false);
        this.projects.forEach((project, index) => {
          this.getFullImageUrl(project.coverImagePath, index);
        });
        this.applyFilters();
      },
      error: (processedError: ProcessedError) => {
        if (processedError.backendMessage) {
          this.toastMessage =
            this.translate.instant(processedError.key) +
            ': ' +
            processedError.backendMessage;
        } else {
          this.toastMessage = this.translate.instant(processedError.key);
        }
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
  truncateText(text: string): string {
    if (text.length > 100) {
      return text.substring(0, 100) + '...';
    } else {
      return text;
    }
  }

  mostraToast(success: boolean, message: string) {
    this.toastMessage = message;
    if (success) {
      this.successToast = true;
      this.errorToast = false;
    } else {
      this.errorToast = true;
      this.successToast = false;
    }
  }

  chiudiToast() {
    this.successToast = false;
    this.errorToast = false;
    this.toastMessage = '';
  }
}
