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
import { ProjectDetailBase } from 'src/app/shared/classes/project-detail-base';
import { MetaService } from 'src/app/service/meta.service';
import { LanguageService } from 'src/app/service/language.service';

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
export class CourseDetail extends ProjectDetailBase implements OnInit, OnDestroy {
  course$!: Observable<Course>;
  courseId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    protected override loader: LoaderService,
    protected override translate: TranslateService,
    protected override toastService: ToastService,
    protected override imageService: ImageService,
    protected override modalService: NgbModal,
    protected override sanitazier: DomSanitizer,
    protected override metaService: MetaService,
    protected override languageService: LanguageService
  ) {
    super(metaService, languageService, loader, translate, toastService, imageService, modalService, sanitazier);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.courseId = this.activatedRoute.snapshot.params['id'];
    this.loadCourse();
  }

  protected getComponentName(): string {
    return 'course-detail';
  }

  private loadCourse(): void {
    this.loader.show();
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.processMedia(course);
        this.course$ = of(course);
        this.updateMetaTagsForProject(course);
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
}
