import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Course } from 'src/app/models/course.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { CourseService } from 'src/app/service/course.service';
import { ImageService } from 'src/app/service/image.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AnimatedButtonComponent } from 'src/app/shared/components/animated-button/animated-button.component';
import { environment } from 'src/environments/environment';
import GLightbox from 'glightbox';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadModalComponent } from 'src/app/shared/components/modals/download-modal/download-modal.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-detail',
  imports: [
    AsyncPipe,
    DatePipe,
    AnimatedButtonComponent,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail implements OnInit, OnDestroy {
  isStaticMode: boolean = environment.isStaticMode;
  course$!: Observable<Course>;
  courseId!: string;
  _galleryItems: any[] = [];
  lightbox: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private loader: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService,
    private imageService: ImageService,
    private modalService: NgbModal,
    private sanitazier: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['id'];
    this.loadCourse();
  }

  ngOnDestroy(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }

  private loadCourse(): void {
    this.loader.show();
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.processMedia(course);
        this.course$ = of(course);
        console.log('course:', course);
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

  private processImages(course: Course): void {
    if (course.coverImagePath) {
      this.imageService
        .getFullImageUrl(course.coverImagePath)
        .subscribe((url) => {
          course.coverImagePath = url;
          this._galleryItems.push({
            href: url,
            type: 'image',
          });
        });
    }
    if (course.imagePaths && course.imagePaths.length > 0) {
      course.imagePaths.forEach((imagePath, index) => {
        this.imageService.getFullImageUrl(imagePath).subscribe((url) => {
          course.imagePaths[index] = url;
          this._galleryItems.push({
            href: url,
            type: 'image',
          });
        });
      });
    }
    if (course.pressReviews && course.pressReviews.length > 0) {
      course.pressReviews.forEach((pressReview, index) => {
        this.imageService
          .getFullImageUrl(pressReview.imagePath)
          .subscribe((url) => {
            course.pressReviews[index].imagePath = url;
          });
      });
    }
  }

  private processVideos(course: Course): void {
    if (course.videoPaths && course.videoPaths.length > 0) {
      course.videoPaths.forEach((videoPath, index) => {
        this.imageService.getFullVideoUrl(videoPath).subscribe((url) => {
          course.videoPaths[index] = url;
          this._galleryItems.push({
            href: url,
            type: 'video',
            source: 'local',
          });
        });
      });
    }
  }

  private processFiles(course: Course): void {
    if (course.filePaths && course.filePaths.length > 0) {
      course.filePaths.forEach((filePath, index) => {
        course.filePaths[index] = this.imageService.getFullFileUrl(filePath);
      });
    }
  }

  private processMedia(course: Course): void {
    this.processFiles(course);
    this.processImages(course);
    this.processVideos(course);
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
}
