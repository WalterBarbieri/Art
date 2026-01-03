import { Component, Input, OnInit, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Content } from 'src/app/models/content.interface';
import { ProjectCardComponent } from 'src/app/components/project-card/project-card.component';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class Carousel implements OnInit, OnChanges {
  @Input() projects: Content[] = [];
  @Input() imageLoading: boolean[] = [];

  currentSlide: number = 0;
  cardWidthPercentage: number = 100;
  maxSlides: number = 0;

  ngOnInit(): void {
    this.initializeCarousel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && this.projects.length > 0) {
      this.initializeCarousel();
    }
  }

  private initializeCarousel(): void {
    this.updateCarouselSettings();
    this.currentSlide = 0;
  }

  private updateCarouselSettings(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1200) {
      this.cardWidthPercentage = 25;
      this.maxSlides = Math.max(0, this.projects.length - 3);
    } else if (screenWidth >= 992) {
      this.cardWidthPercentage = 33.333;
      this.maxSlides = Math.max(0, this.projects.length - 2);
    } else if (screenWidth >= 576) {
      this.cardWidthPercentage = 50;
      this.maxSlides = Math.max(0, this.projects.length - 1);
    } else {
      this.cardWidthPercentage = 100;
      this.maxSlides = this.projects.length;
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.maxSlides - 1) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateCarouselSettings();
    if (this.currentSlide >= this.maxSlides) {
      this.currentSlide = Math.max(0, this.maxSlides - 1);
    }
  }
}
