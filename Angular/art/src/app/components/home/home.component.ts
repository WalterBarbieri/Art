import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';
import { LanguageService } from 'src/app/service/language.service';
import { ActivatedRoute } from '@angular/router';
import { Content } from 'src/app/models/content.interface';
import { ImageService } from 'src/app/service/image.service';
import { ContentService } from 'src/app/service/content.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { log } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private languageSubscription: Subscription = new Subscription();
  successToast: boolean = false;
  errorToast: boolean = false;
  toastMessage: string = '';
  currentLanguage: string = 'it';
  projects: Content[] = [];
  imageLoading: boolean[] = [];
  currentSlide: number = 0;
  cardWidthPercentage: number = 100;
  maxSlides: number = 0;

  // Static asset paths
  homeBannerPath: string = '';
  homeArtPath: string = '';
  homeElenaFranconiPath: string = '';

  constructor(
    private metaService: MetaService,
    private languageService: LanguageService,
    private staticAssetService: StaticAssetService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private contentService: ContentService,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.setupLanguageSubscription();
    this.loadStaticAssets();
    this.route.queryParams.subscribe(params => {
      const message = params['message'];
      if (message === 'LoginSuccess') {
        this.mostraToast(true, 'Login successful!');
      }
    });
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  mostraToast(success: boolean, message: string) {
    this.toastMessage = message;
    if (success) {
      this.successToast = true;
      this.errorToast = false;
    } else {
      this.errorToast = true;
      this.successToast = false;
    }
  }

  chiudiToast() {
    this.successToast = false;
    this.errorToast = false;
    this.toastMessage = '';
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('home');
    this.metaService.updateTitleForComponent('home');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe((language) => {
      this.currentLanguage = language;
      this.updateMetaTags();
    });
  }

  private loadStaticAssets(): void {
    this.homeBannerPath = this.staticAssetService.getAssetPath('home_banner');
    this.homeArtPath = this.staticAssetService.getAssetPath('home_art');
    this.homeElenaFranconiPath = this.staticAssetService.getAssetPath('home_elena_franconi');
  }

  getFullImageUrl(imagePath: string | null, index: number): void {
    this.imageLoading[index] = true;
    this.imageService.getFullImageUrl(imagePath).subscribe(
      (url) => {
        this.projects[index].coverImagePath = url;
        this.imageLoading[index] = false;
      },
      () => {
        this.imageLoading[index] = false;
      }
    );
  }
   getAllProjects(): void {
      this.loaderService.show();
      this.contentService.getTopSorted().subscribe({
        next: (data: Content[]) => {
          this.projects = data.map(project => ({
            ...project,
            eventDates: project.eventDates ? project.eventDates.map(d => new Date(d)) : []
          }));
          this.imageLoading = new Array(this.projects.length).fill(false);
          this.projects.forEach((project, index) => {
            this.getFullImageUrl(project.coverImagePath, index);
          });
          this.initializeCarousel();
        },
        error: (processedError: ProcessedError) => {
          if (processedError.backendMessage) {
            this.toastMessage =
              this.translate.instant(processedError.key) +
              ': ' +
              processedError.backendMessage;
          } else {
            this.toastMessage = this.translate.instant(processedError.key);
          }
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
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

  getEventDatesDisplay(eventDates: Date[] | null): { dates: Date[], showDots: boolean } {
    if (!eventDates || eventDates.length === 0) return { dates: [], showDots: false };
    const sorted = [...eventDates].sort((a, b) => b.getDate() - a.getDate());
    if (sorted.length <= 2) {
      return { dates: sorted, showDots: false };
    }
    return { dates: [sorted[0], sorted[sorted.length - 1]], showDots: true };
  }
}
