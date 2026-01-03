import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Course } from 'src/app/models/course.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { CourseService } from 'src/app/service/course.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-course-detail',
  imports: [],
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
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['id'];
    this.loadCourse();
  }

  private loadCourse(): void {
    this.loader.show();
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course$ = of(course);
        console.log('course:', course);
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
}
