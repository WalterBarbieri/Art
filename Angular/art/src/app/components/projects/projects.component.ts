import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Content } from 'src/app/models/content.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { ContentService } from 'src/app/service/content.service';
import { ImageService } from 'src/app/service/image.service';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MetaManagedComponent } from 'src/app/shared/classes/meta-managed.component';
import { FilterValues } from 'src/app/shared/components/project/project-filters/project-filters.component';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    standalone: false
})
export class ProjectsComponent extends MetaManagedComponent implements OnInit, OnDestroy {
  projects: Content[] = [];
  filteredProjects: Content[] = [];
  imageLoading: boolean[] = [];

  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService,
    private contentService: ContentService,
    private imageService: ImageService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {
    super(metaService, languageService);
  }

  ngOnInit(): void {
    this.initializeMetaManagement();
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.cleanupMetaManagement();
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
    this.contentService.getAllActiveSorted().subscribe({
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

  onFiltersChanged(filters: FilterValues): void {
    this.filteredProjects = this.projects.filter((project) => {
      const statusMatch =
        filters.status === 'all' ||
        project.contentStatus === filters.status;

      const typeMatch =
        filters.type === 'all' ||
        project.contentType === filters.type;

      return statusMatch && typeMatch;
    });

    if (filters.sortOrder === 'reverse') {
      this.filteredProjects.reverse();
    }
  }

  protected getComponentName(): string {
    return 'projects';
  }
}
