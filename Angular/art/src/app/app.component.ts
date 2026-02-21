import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from './service/language.service';
import { MetaService } from './service/meta.service';
import { StaticAssetService } from './service/static-asset.service';
import { MetaManagedComponent } from './shared/classes/meta-managed.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent extends MetaManagedComponent implements OnInit, OnDestroy {
  title = 'art';

  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService,
    private staticAssetService: StaticAssetService
  ) {
    super(metaService, languageService);
  }

  ngOnInit(): void {
    this.initializeMetaManagement();
    this.preloadAssets();
  }
  ngOnDestroy(): void {
    this.cleanupMetaManagement();
  }

  protected getComponentName(): string {
    return 'app';
  }

  private preloadAssets() {
    const deviceWidth = window.innerWidth;
    this.staticAssetService.preloadCriticalAssetsResponsive(['home_banner','logo'], deviceWidth);
  }
}
