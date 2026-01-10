import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-download-modal',
  imports: [TranslateModule],
  templateUrl: './download-modal.component.html',
  styleUrl: './download-modal.component.scss'
})
export class DownloadModalComponent {
  @Input() fileUrl!: string;
  @Input() fileName!: string;

  constructor(public activeModal: NgbActiveModal) {}

  downloadFile(): void {
    const link = document.createElement('a');
    link.href = this.fileUrl;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.activeModal.close();
  }
}
