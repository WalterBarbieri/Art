import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Content } from 'src/app/models/content.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { ContentService } from 'src/app/service/content.service';
import { ImageService } from 'src/app/service/image.service';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    standalone: false
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Content[] = [];
  filteredProjects: Content[] = [];
  imageLoading: boolean[] = [];
  selectedStatusFilter: string = 'all';
  selectedTypeFilter: string = 'all';
  selectedSortOrder: string = 'default';
  showFilters: boolean = false;

  private languageSubscription: Subscription = new Subscription();

  constructor(
    private contentService: ContentService,
    private imageService: ImageService,
    private router: Router,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService,
    private metaService: MetaService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.updateMetaTags();
    this.setupLanguageSubscription();
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
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

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('projects');
    this.metaService.updateTitleForComponent('projects');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }
}
