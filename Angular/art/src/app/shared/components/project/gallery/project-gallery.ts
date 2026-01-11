import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import GLightbox from 'glightbox';

@Component({
  selector: 'app-project-gallery',
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-gallery.html',
  styleUrls: ['./project-gallery.scss']
})
export class ProjectGalleryComponent implements OnInit, OnDestroy {
  @Input() galleryItems: any[] = [];
  lightbox: any;

  ngOnInit(): void {
    this.initGallery();
  }

  ngOnDestroy(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }

  private initGallery(): void {
    if (this.galleryItems.length > 0) {
      this.lightbox = GLightbox({
        elements: this.galleryItems.map(item => ({
          href: item.src || item.href,
          type: item.type || 'image'
        })) as any
      });
    }
  }

  openLightbox(index: number): void {
    if (this.lightbox) {
      this.lightbox.openAt(index);
    }
  }
}
