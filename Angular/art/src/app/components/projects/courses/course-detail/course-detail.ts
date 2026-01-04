import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Course } from 'src/app/models/course.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { CourseService } from 'src/app/service/course.service';
import { ImageService } from 'src/app/service/image.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AnimatedButtonComponent } from "src/app/shared/components/animated-button/animated-button.component";
import { environment } from 'src/environments/environment';
import GLightbox from 'glightbox';

@Component({
  selector: 'app-course-detail',
  imports: [AsyncPipe, DatePipe, AnimatedButtonComponent, TranslateModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss'
})
export class CourseDetail implements OnInit, AfterViewInit, OnDestroy {
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
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['id'];
    this.loadCourse();
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }

  private loadCourse(): void {
    this.loader.show();
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.processImages(course);
        this.processVideos(course);
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
      this.imageService.getFullImageUrl(course.coverImagePath).subscribe(
        (url) => {
          course.coverImagePath = url;

        }
      );
    }
    if (course.imagePaths && course.imagePaths.length > 0) {
      course.imagePaths.forEach((imagePath, index) => {
        this.imageService.getFullImageUrl(imagePath).subscribe(
          (url) => {
            course.imagePaths[index] = url;
            this._galleryItems.push({
              href: url,
              type: 'image'
            });

          }
        );
      });
    }
  }

  private processVideos(course: Course): void {
    if (course.videoPaths && course.videoPaths.length > 0) {
      course.videoPaths.forEach((videoPath, index) => {
        this.imageService.getFullVideoUrl(videoPath).subscribe(
          (url) => {
            course.videoPaths[index] = url;
            this._galleryItems.push({
              href: url,
              type: 'video',
              source: 'local'
            });

          }
        )
      });
    }
  }

  private initGallery(): void {
    if (this._galleryItems.length > 0) {
      this.lightbox = GLightbox({
        elements: this._galleryItems as any,
        touchNavigation: true,
        loop: true,
        autoplayVideos: false
      });
    }
  }
}
