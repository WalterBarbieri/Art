import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import GLightbox from 'glightbox';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Event } from 'src/app/models/event.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { EventService } from 'src/app/service/event.service';
import { ImageService } from 'src/app/service/image.service';
import { AnimatedButtonComponent } from 'src/app/shared/components/animated-button/animated-button.component';
import { DownloadModalComponent } from 'src/app/shared/components/modals/download-modal/download-modal.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-detail',
  imports: [
    AsyncPipe,
    DatePipe,
    AnimatedButtonComponent,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail implements OnInit, OnDestroy {
  isStaticMode: boolean = environment.isStaticMode;
  event$!: Observable<Event>;
  eventId!: string;
  _galleryItems: any[] = [];
  lightbox: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private loader: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService,
    private imageService: ImageService,
    private modalService: NgbModal,
    private sanitazier: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.eventId = this.activatedRoute.snapshot.params['id'];
    this.loadEvent();
  }

  ngOnDestroy(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }

  private loadEvent(): void {
    this.loader.show();
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.processMedia(event);
        this.event$ = of(event);
        console.log('event:', event);
        setTimeout(() => {
          this.initGallery();
        }, 500);
      },
      error: (processedError: ProcessedError) => {
        let message: string;
        if (processedError.backendMessage) {
          message =
            this.translate.instant(processedError.key) +
            ': ' +
            processedError.backendMessage;
        } else {
          message = this.translate.instant(processedError.key);
        }
        this.toastService.showError(message);
      },
      complete: () => {
        this.loader.hide();
      },
    });
  }

  private processImages(event: Event): void {
    if (event.coverImagePath) {
      this.imageService
        .getFullImageUrl(event.coverImagePath)
        .subscribe((url) => {
          event.coverImagePath = url;
          this._galleryItems.push({
            href: url,
            type: 'image',
          });
        });
    }
    if (event.imagePaths && event.imagePaths.length > 0) {
      event.imagePaths.forEach((imagePath, index) => {
        this.imageService.getFullImageUrl(imagePath).subscribe((url) => {
          event.imagePaths[index] = url;
          this._galleryItems.push({
            href: url,
            type: 'image',
          });
        });
      });
    }
    if (event.pressReviews && event.pressReviews.length > 0) {
      event.pressReviews.forEach((pressReview, index) => {
        this.imageService
          .getFullImageUrl(pressReview.imagePath)
          .subscribe((url) => {
            event.pressReviews[index].imagePath = url;
          });
      });
    }
  }

  private processVideos(event: Event): void {
    if (event.videoPaths && event.videoPaths.length > 0) {
      event.videoPaths.forEach((videoPath, index) => {
        this.imageService.getFullVideoUrl(videoPath).subscribe((url) => {
          event.videoPaths[index] = url;
          this._galleryItems.push({
            href: url,
            type: 'video',
            source: 'local',
          });
        });
      });
    }
  }

  private processFiles(event: Event): void {
    if (event.filePaths && event.filePaths.length > 0) {
      event.filePaths.forEach((filePath, index) => {
        event.filePaths[index] = this.imageService.getFullFileUrl(filePath);
      });
    }
  }

  private processMedia(event: Event): void {
    this.processFiles(event);
    this.processImages(event);
    this.processVideos(event);
  }

  private initGallery(): void {
    if (this._galleryItems.length > 0) {
      this.lightbox = GLightbox({
        elements: this._galleryItems as any,
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
      });
    }
  }

  getFileName(filePath: string): string {
    const fileName = filePath.split('/').pop() || '';
    return fileName.substring(14);
  }

  getFileIconClass(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fa fa-file-pdf-o';
      case 'doc':
      case 'docx':
        return 'fa fa-file-word-o';
      case 'xls':
      case 'xlsx':
        return 'fa fa-file-excel-o';
      case 'ppt':
      case 'pptx':
        return 'fa fa-file-powerpoint-o';
      case 'zip':
      case 'rar':
        return 'fa fa-file-archive-o';
      case 'txt':
        return 'fa fa-file-text-o';
      default:
        return 'fa fa-file-o';
    }
  }

  openDownloadModal(fileUrl: string, fileName: string): void {
    const modalRef = this.modalService.open(DownloadModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.fileUrl = fileUrl;
    modalRef.componentInstance.fileName = fileName;
  }
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitazier.bypassSecurityTrustResourceUrl(url);
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  calculateMaxParticipants(event: Event): number {
    return Math.max(...event.eventDateSlots.map(slot => slot.maxParticipants));
  }
}
