import { Component, Input } from '@angular/core';
import { Content } from 'src/app/models/content.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdminContentService } from 'src/app/admin/services/admin-content.service';
import { ErrorService } from 'src/app/core/services/error.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { ImageLoaderComponent } from 'src/app/shared/components/image-loader/image-loader.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-link-modal',
  imports: [FormsModule, TranslateModule],
  templateUrl: './link-modal.component.html',
  styleUrl: './link-modal.component.scss',
})
export class LinkModalComponent {
  @Input() content!: Content;
  @Input() linkedContent!: Content | null;
  @Input() availableTargets!: Content[];

  selectedTargetId: string = '';

  constructor(
    private activeModal: NgbActiveModal,
    private adminContentService: AdminContentService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
  ) {}

  // Helper: check if the content is already linked
  isLinked(): boolean {
    return !!this.linkedContent;
  }

  // Helper: get the linked content
  getLinkedContent(): Content | null {
    return this.linkedContent;
  }

  link(): void {
    if (!this.selectedTargetId) return;

    this.loaderService.show();
    this.adminContentService
      .linkContent(
        this.content.id,
        this.selectedTargetId,
        this.content.contentType,
      )
      .subscribe({
        next: (updatedContent: Content) => {
          this.activeModal.close({
            action: 'link',
            updatedContent,
            targetId: this.selectedTargetId,
          });
        },
        error: (processedError: ProcessedError) => {
          this.errorService.handleProcessedError(processedError);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  unlink(): void {
    if (!this.linkedContent) return;
    this.loaderService.show();
    this.adminContentService
      .unlinkContent(
        this.content.id,
        this.linkedContent.id,
        this.content.contentType,
      )
      .subscribe({
        next: (updatedContent: Content) => {
          // Close and let the parent reopen the modal with updated data
          this.activeModal.close({
            action: 'unlink',
            updatedContent,
            targetId: this.linkedContent!.id,
            shouldReopen: true,
          });
        },
        error: (processedError: ProcessedError) => {
          this.errorService.handleProcessedError(processedError);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
