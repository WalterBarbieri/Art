import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Event } from 'src/app/models/event.interface';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { EventService } from 'src/app/service/event.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-event-detail',
  imports: [],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetail implements OnInit {
  event$!: Observable<Event>;
  eventId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private loader: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventId = this.activatedRoute.snapshot.params['id'];
    this.loadEvent();
  }

  private loadEvent(): void {
    this.loader.show();
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event$ = of(event);
        console.log('event:', event);
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
      }
    });
  }
}
