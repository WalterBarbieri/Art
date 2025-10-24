import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';
import { LanguageService } from 'src/app/service/language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private languageSubscription: Subscription = new Subscription();

  constructor(
    private staticAssetService: StaticAssetService,
    private metaService: MetaService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.preloadAssets();
    this.updateMetaTags();
    this.setupLanguageSubscription();
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  private preloadAssets() {
    this.staticAssetService.preloadCriticalAssets(['logo', 'fallback_image']);
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('home');
    this.metaService.updateTitleForComponent('home');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }
}
