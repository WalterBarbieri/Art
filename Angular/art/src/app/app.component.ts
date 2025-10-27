import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from './service/language.service';
import { MetaService } from './service/meta.service';
import { StaticAssetService } from './service/static-asset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'art';
  private languageSubscription: Subscription = new Subscription();

  constructor(private languageService: LanguageService, private metaService: MetaService, private staticAssetService: StaticAssetService) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.setupLanguageSubscription();
    this.preloadAssets();
  }
  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('app');
    this.metaService.updateTitleForComponent('app');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }

  private preloadAssets() {
    this.staticAssetService.preloadCriticalAssets(['logo', 'fallback_image', 'home_banner']);
  }
}
