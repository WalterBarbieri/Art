import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    standalone: false
})
export class InfoComponent implements OnInit, OnDestroy {

  private languageSubscription: Subscription = new Subscription();

  infoBannerPath: string = '';
  infoArt1Path: string = '';
  infoArt2Path: string = '';
  infoArt3Path: string = '';
  infoArt4Path: string = '';
  infoArt5Path: string = '';

  constructor(private staticAssetService: StaticAssetService, private metaService: MetaService, private languageService: LanguageService) { }

  ngOnInit(): void {
    this.loadStaticAssets();
    this.updateMetaTags();
    this.setupLanguageSubscription();
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  loadStaticAssets(): void {
    this.infoBannerPath = this.staticAssetService.getAssetPath('info_banner');
    this.infoArt1Path = this.staticAssetService.getAssetPath('info_art_1');
    this.infoArt2Path = this.staticAssetService.getAssetPath('info_art_2');
    this.infoArt3Path = this.staticAssetService.getAssetPath('info_art_3');
    this.infoArt4Path = this.staticAssetService.getAssetPath('info_art_4');
    this.infoArt5Path = this.staticAssetService.getAssetPath('info_art_5');
  }
  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('info');
    this.metaService.updateTitleForComponent('info');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }

}
