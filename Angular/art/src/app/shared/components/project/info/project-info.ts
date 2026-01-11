import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-info',
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-info.html',
  styleUrls: ['./project-info.scss']
})
export class ProjectInfoComponent {
  @Input() informations: string = '';
  @Input() googleMapsLink: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}