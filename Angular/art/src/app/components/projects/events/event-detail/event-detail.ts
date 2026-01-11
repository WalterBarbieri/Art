import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Event } from 'src/app/models/event.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { EventService } from 'src/app/service/event.service';
import { ImageService } from 'src/app/service/image.service';
import { AnimatedButtonComponent } from 'src/app/shared/components/animated-button/animated-button.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProjectDetailBase } from 'src/app/shared/classes/project-detail-base';
import { MetaService } from 'src/app/service/meta.service';
import { LanguageService } from 'src/app/service/language.service';

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
export class EventDetail extends ProjectDetailBase implements OnInit, OnDestroy {
  event$!: Observable<Event>;
  eventId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
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
    this.eventId = this.activatedRoute.snapshot.params['id'];
    this.loadEvent();
  }

  protected getComponentName(): string {
    return 'event-detail';
  }

  private loadEvent(): void {
    this.loader.show();
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.processMedia(event);
        this.event$ = of(event);
        this.updateMetaTagsForProject(event);
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

  calculateMaxParticipants(event: Event): number {
    return Math.max(...event.eventDateSlots.map(slot => slot.maxParticipants));
  }
}
