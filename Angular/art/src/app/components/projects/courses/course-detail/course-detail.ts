import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Course } from 'src/app/models/course.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { CourseService } from 'src/app/service/course.service';
import { ImageService } from 'src/app/service/image.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-course-detail',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetail implements OnInit {
  course$!: Observable<Course>;
  courseId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private loader: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['id'];
    this.loadCourse();
  }

  private loadCourse(): void {
    this.loader.show();
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.processImages(course);
        this.course$ = of(course);
        console.log('course:', course);
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
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
          this.cdr.markForCheck();
        }
      );
    }
    if (course.imagePaths && course.imagePaths.length > 0) {
      course.imagePaths.forEach((imagePath, index) => {
        this.imageService.getFullImageUrl(imagePath).subscribe(
          (url) => {
            course.imagePaths[index] = url;
            this.cdr.markForCheck();
          }
        );
      });
    }
  }
}
