import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ToastService } from 'src/app/shared/services/toast.service';
import { MetaManagedComponent } from 'src/app/shared/classes/meta-managed.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent extends MetaManagedComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'it';
  projects: Content[] = [];
  imageLoading: boolean[] = [];

  // Static asset paths
  homeBannerPath: string = '';
  homeArtPath: string = '';
  homeElenaFranconiPath: string = '';

  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService,
    private staticAssetService: StaticAssetService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private contentService: ContentService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {
    super(metaService, languageService);
  }

  ngOnInit(): void {
    this.initializeMetaManagement();
    this.loadStaticAssets();
    this.route.queryParams.subscribe((params) => {
      const message = params['message'];
      if (message === 'LoginSuccess') {
        this.toastService.showSuccess('Login successful!');
      }
    });
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.cleanupMetaManagement();
  }

  protected override setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(
      (language) => {
        this.currentLanguage = language;
        this.updateMetaTags();
      }
    );
  }

  protected getComponentName(): string {
    return 'home';
  }

  private loadStaticAssets(): void {
    this.homeBannerPath = this.staticAssetService.getAssetPath('home_banner');
    this.homeArtPath = this.staticAssetService.getAssetPath('home_art');
    this.homeElenaFranconiPath = this.staticAssetService.getAssetPath(
      'home_elena_franconi'
    );
  }

  getFullImageUrl(imagePath: string | null, index: number): void {
    this.imageLoading[index] = true;
    this.imageService.getFullImageUrl(imagePath).subscribe({
      next: (url) => {
        this.projects[index].coverImagePath = url;
        this.imageLoading[index] = false;
      },
      error: () => {
        this.imageLoading[index] = false;
      }
    });
  }
  getAllProjects(): void {
    this.loaderService.show();
    this.contentService.getTopActiveSorted().subscribe({
      next: (data: Content[]) => {
        this.projects = data.map((project) => ({
          ...project,
          eventDates: project.eventDates
            ? project.eventDates.map((d) => new Date(d))
            : [],
        }));
        this.imageLoading = new Array(this.projects.length).fill(false);
        this.projects.forEach((project, index) => {
          this.getFullImageUrl(project.coverImagePath, index);
        });
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
        this.loaderService.hide();
      },
    });
  }
}
