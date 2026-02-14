import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Content } from 'src/app/models/content.interface';
import { ImageService } from 'src/app/service/image.service';
import { AdminContentService } from '../../services/admin-content.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import {
  FilterValues,
  ProjectFiltersComponent,
} from 'src/app/shared/components/project/project-filters/project-filters.component';
import { RouterModule } from '@angular/router';
import { ProjectCardComponent } from 'src/app/shared/components/project/project-card/project-card.component';
import { ErrorService } from 'src/app/core/services/error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchiveModalComponent } from 'src/app/shared/components/modals/archive-modal/archive-modal.component';
import { LinkModalComponent } from 'src/app/shared/components/modals/link-modal/link-modal.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projects',
  imports: [
    RouterModule,
    ProjectFiltersComponent,
    ProjectCardComponent,
    TranslateModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
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
    private storageService: StorageService,
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
      },
    });
  }

  getAllProjects(): void {
    this.loaderService.show();
    this.adminContentService.getAllSorted().subscribe({
      next: (data: Content[]) => {
        console.log('Loaded Content:', data);

        this.projects = data.map((project) => ({
          ...project,
          eventDates: project.eventDates
            ? project.eventDates.map((d: string | Date) => new Date(d))
            : [],
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
      },
    });
  }

  onFiltersChanged(filters: FilterValues): void {
    this.applyFilters(filters);
  }

  openLinkModal(project: Content): void {
    const availableTargets = this.getAvailableTargetsFor(project);
    const linkedContent = this.getLinkedContentFor(project);
    const modalRef = this.modalService.open(LinkModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.content = project;
    modalRef.componentInstance.linkedContent = linkedContent;
    modalRef.componentInstance.availableTargets = availableTargets;

    modalRef.result
      .then((result) => {
        if (result && result.updatedContent) {
          // Update the source project in the list
          const sourceIndex = this.projects.findIndex(
            (p) => p.id === result.updatedContent.id,
          );
          if (sourceIndex !== -1) {
            this.projects[sourceIndex] = {
              ...result.updatedContent,
              contentType: this.projects[sourceIndex].contentType, // Preserve the original contentType
              eventDates: result.updatedContent.eventDates
                ? result.updatedContent.eventDates.map(
                    (d: string | Date) => new Date(d),
                  )
                : [],
            };
            // Reload the image for the source
            this.getFullImageUrl(
              this.projects[sourceIndex].coverImagePath,
              sourceIndex,
            );
          }

          // Also update the target project if present in the list
          if (result.action === 'link' && result.targetId) {
            const targetIndex = this.projects.findIndex(
              (p) => p.id === result.targetId,
            );
            if (targetIndex !== -1) {
              // Set the opposite link in the target
              if (result.updatedContent.contentType === 'Course') {
                this.projects[targetIndex].linkedCourseId =
                  result.updatedContent.id;
              } else {
                this.projects[targetIndex].linkedEventId =
                  result.updatedContent.id;
              }
              // Reload the image for the target (it might have changed)
              this.getFullImageUrl(
                this.projects[targetIndex].coverImagePath,
                targetIndex,
              );
            }
          } else if (result.action === 'unlink') {
            // Remove the link from both projects
            if (result.targetId) {
              const targetIndex = this.projects.findIndex(
                (p) => p.id === result.targetId,
              );
              if (targetIndex !== -1) {
                this.projects[targetIndex].linkedCourseId = null;
                this.projects[targetIndex].linkedEventId = null;
                // Reload the image for the target
                this.getFullImageUrl(
                  this.projects[targetIndex].coverImagePath,
                  targetIndex,
                );
              }
            }
          }

          // Update filteredProjects by re-applying filters
          const currentFilters = this.storageService.getProjectFilters(true);
          if (currentFilters) {
            this.applyFilters(currentFilters);
          } else {
            this.filteredProjects = [...this.projects];
          }

          // Show the success message
          const successKey =
            result.action === 'link'
              ? 'MODALS.LINK.SUCCESS_LINK'
              : 'MODALS.LINK.SUCCESS_UNLINK';
          this.translate.get(successKey).subscribe((message) => {
            this.toastService.showSuccess(message);
          });

          // If it's an unlink and should reopen, reopen the modal with updated data
          if (result.action === 'unlink' && result.shouldReopen) {
            setTimeout(() => {
              this.openLinkModal(this.projects[sourceIndex]);
            }, 300);
          } else {
          }
        }
      })
      .catch(() => {
        // Modal dismissed
      });
  }

  openArchiveModal(project: Content): void {
    const modalRef = this.modalService.open(ArchiveModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.contentId = project.id;
    modalRef.componentInstance.contentTitle = project.title;
    modalRef.componentInstance.contentType = project.contentType;
    modalRef.componentInstance.isArchived = project.archived;
    modalRef.componentInstance.isLinked = !!(project.linkedCourseId || project.linkedEventId);

    modalRef.result
      .then((result) => {
        if (result) {
          this.archiveProject(result.contentId, result.contentType);
        }
      })
      .catch(() => {
        // Modal dismissed
      });
  }

  private applyFilters(filters: FilterValues): void {
    this.filteredProjects = this.projects.filter((project) => {
      const statusMatch =
        filters.status === 'all' || project.contentStatus === filters.status;

      const typeMatch =
        filters.type === 'all' || project.contentType === filters.type;

      const archivedMatch =
        !filters.archived ||
        filters.archived === 'all' ||
        (filters.archived === 'archived'
          ? project.archived === true
          : project.archived !== true);

      return statusMatch && typeMatch && archivedMatch;
    });

    if (filters.sortOrder === 'reverse') {
      this.filteredProjects.reverse();
    }
  }

  private getAvailableTargetsFor(content: Content): Content[] {
    return this.projects.filter((project) => {
      // Exclude the content itself
      if (project.id === content.id) return false;

      // Only non-archived content
      if (project.archived) return false;

      // Only content not already linked
      if (project.linkedCourseId || project.linkedEventId) return false;

      // Filter by type: Course can only link to Event, and vice versa
      if (content.contentType === 'Course') {
        return project.contentType === 'Event';
      } else if (content.contentType === 'Event') {
        return project.contentType === 'Course';
      }

      return false;
    });
  }

  private getLinkedContentFor(content: Content): Content | null {
    if (!content.linkedCourseId && !content.linkedEventId) return null;

    const linkedId = content.linkedCourseId || content.linkedEventId;
    return this.projects.find((p) => p.id === linkedId) || null;
  }

  private archiveProject(contentId: string, contentType: string): void {
    this.loaderService.show();
    this.adminContentService.patchArchive(contentId, contentType).subscribe({
      next: (updatedProject: Content) => {
        // Update the project in the list
        const index = this.projects.findIndex((p) => p.id === contentId);
        if (index !== -1) {
          this.projects[index] = {
            ...updatedProject,
            contentType: contentType, // Preserve the original contentType
            eventDates: updatedProject.eventDates
              ? updatedProject.eventDates.map((d: string | Date) => new Date(d))
              : [],
          };
          // Reload the image if necessary
          this.getFullImageUrl(this.projects[index].coverImagePath, index);
        }
        // Also update filteredProjects by re-applying filters from session storage
        const currentFilters = this.storageService.getProjectFilters(true); // true because we are in admin
        if (currentFilters) {
          this.applyFilters(currentFilters);
        } else {
          // Fallback: copy all projects if no filters are saved
          this.filteredProjects = [...this.projects];
        }
        // Show the appropriate success message
        const successKey = updatedProject.archived
          ? 'MODALS.ARCHIVE.SUCCESS'
          : 'MODALS.ARCHIVE.SUCCESS_UNARCHIVE';
        this.translate.get(successKey).subscribe((message) => {
          this.toastService.showSuccess(message);
        });
      },
      error: (processedError: ProcessedError) => {
        this.errorService.handleProcessedError(processedError);
      },
      complete: () => {
        this.loaderService.hide();
      },
    });
  }
}
