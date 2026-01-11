import { OnDestroy, OnInit, Directive } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import GLightbox from 'glightbox';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ImageService } from 'src/app/service/image.service';
import { DownloadModalComponent } from 'src/app/shared/components/modals/download-modal/download-modal.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MetaManagedComponent } from './meta-managed.component';
import { MetaService } from 'src/app/service/meta.service';
import { LanguageService } from 'src/app/service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Directive()
export abstract class ProjectDetailBase extends MetaManagedComponent implements OnInit, OnDestroy {
  isStaticMode: boolean = environment.isStaticMode;
  _galleryItems: any[] = [];
  lightbox: any;
  protected currentProject: any;

  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService,
    protected loader: LoaderService,
    protected translate: TranslateService,
    protected toastService: ToastService,
    protected imageService: ImageService,
    protected modalService: NgbModal
  ) {
    super(metaService, languageService);
  }

  ngOnInit(): void {
    this.initializeMetaManagement();
  }

  ngOnDestroy(): void {
    this.cleanupMetaManagement();
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }

  protected override updateMetaTags(): void {
    if (this.currentProject) {
      this.metaService.updateMetaTagsForProject(this.getComponentName(), this.currentProject);
      this.metaService.updateTitleForComponent(this.getComponentName(), { title: this.currentProject.title });
    } else {
      this.metaService.updateMetaTagsForComponents(this.getComponentName());
      this.metaService.updateTitleForComponent(this.getComponentName());
    }
  }

  protected updateMetaTagsForProject(project: any): void {
    this.currentProject = project;
    this.updateMetaTags();
  }

  protected processImages(project: any): void {
    if (project.coverImagePath) {
      this.imageService
        .getFullImageUrl(project.coverImagePath)
        .subscribe((url) => {
          project.coverImagePath = url;
          this._galleryItems.push({
            href: url,
            type: 'image',
          });
        });
    }
    if (project.imagePaths && project.imagePaths.length > 0) {
      project.imagePaths.forEach((imagePath: string, index: number) => {
        this.imageService.getFullImageUrl(imagePath).subscribe((url) => {
          project.imagePaths[index] = url;
          this._galleryItems.push({
            href: url,
            type: 'image',
          });
        });
      });
    }
    if (project.pressReviews && project.pressReviews.length > 0) {
      project.pressReviews.forEach((pressReview: any, index: number) => {
        this.imageService
          .getFullImageUrl(pressReview.imagePath)
          .subscribe((url) => {
            project.pressReviews[index].imagePath = url;
          });
      });
    }
  }

  protected processVideos(project: any): void {
    if (project.videoPaths && project.videoPaths.length > 0) {
      project.videoPaths.forEach((videoPath: string, index: number) => {
        this.imageService.getFullVideoUrl(videoPath).subscribe((url) => {
          project.videoPaths[index] = url;
          this._galleryItems.push({
            href: url,
            type: 'video',
            source: 'local',
          });
        });
      });
    }
  }

  protected processFiles(project: any): void {
    if (project.filePaths && project.filePaths.length > 0) {
      project.filePaths.forEach((filePath: string, index: number) => {
        project.filePaths[index] = this.imageService.getFullFileUrl(filePath);
      });
    }
  }

  protected processMedia(project: any): void {
    this.processFiles(project);
    this.processImages(project);
    this.processVideos(project);
  }

  protected initGallery(): void {
    if (this._galleryItems.length > 0) {
      this.lightbox = GLightbox({
        elements: this._galleryItems as any,
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
      });
    }
  }

  openDownloadModal(fileUrl: string, fileName: string): void {
    const modalRef = this.modalService.open(DownloadModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.fileUrl = fileUrl;
    modalRef.componentInstance.fileName = fileName;
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
