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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchiveModalComponent } from 'src/app/shared/components/modals/archive-modal/archive-modal.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environment';

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
  isStaticMode: boolean = environment.isStaticMode;

  constructor(
    private adminContentService: AdminContentService,
    private imageService: ImageService,
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService
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
        console.log('Loaded Content:', data);

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
    this.applyFilters(filters);
  }

  private applyFilters(filters: FilterValues): void {
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

  openArchiveModal(project: Content): void {
    const modalRef = this.modalService.open(ArchiveModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.contentId = project.id;
    modalRef.componentInstance.contentTitle = project.title;
    modalRef.componentInstance.contentType = project.contentType;

    modalRef.result.then(result => {
      if (result) {
        this.archiveProject(result.contentId, result.contentType);
      }
    }).catch(() => {
      // Modal dismissed
    });
  }

  private archiveProject(contentId: string, contentType: string): void {
    this.loaderService.show();
    this.adminContentService.patchArchive(contentId, contentType).subscribe({
      next: (updatedProject: Content) => {
        // Aggiorna il progetto nella lista
        const index = this.projects.findIndex(p => p.id === contentId);
        if (index !== -1) {
          this.projects[index] = {
            ...updatedProject,
            contentType: contentType, // Preserva il contentType originale
            eventDates: updatedProject.eventDates ? updatedProject.eventDates.map(d => new Date(d)) : []
          };
          // Ricarica l'immagine se necessario
          this.getFullImageUrl(this.projects[index].coverImagePath, index);
        }
        // Aggiorna anche filteredProjects ri-applicando i filtri dal session storage
        const currentFilters = this.storageService.getProjectFilters(true); // true perché siamo in admin
        if (currentFilters) {
          this.applyFilters(currentFilters);
        } else {
          // Fallback: copia tutti i progetti se non ci sono filtri salvati
          this.filteredProjects = [...this.projects];
        }
        this.translate.get('MODALS.ARCHIVE.SUCCESS').subscribe(message => {
          this.toastService.showSuccess(message);
        });
      },
      error: (processedError: ProcessedError) => {
        this.errorService.handleProcessedError(processedError);
      },
      complete: () => {
        this.loaderService.hide();
      }
    });
  }

}
