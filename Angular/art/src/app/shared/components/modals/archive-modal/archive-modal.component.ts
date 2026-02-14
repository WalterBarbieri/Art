import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-archive-modal',
  imports: [TranslateModule],
  templateUrl: './archive-modal.component.html',
  styleUrl: './archive-modal.component.scss',
})
export class ArchiveModalComponent {
  @Input() contentId!: string;
  @Input() contentTitle!: string;
  @Input() contentType!: string;
  @Input() isArchived: boolean = false;
  @Input() isLinked: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  confirmArchive(): void {
    this.activeModal.close({
      contentId: this.contentId,
      contentTitle: this.contentTitle,
      contentType: this.contentType,
    });
  }
}
