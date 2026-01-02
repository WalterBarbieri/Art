import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
    selector: 'app-bio',
    templateUrl: './bio.component.html',
    styleUrls: ['./bio.component.scss'],
    standalone: false
})
export class BioComponent implements OnInit, OnDestroy {

  private languageSubscription: Subscription = new Subscription();

  bioBannerPath: string = '';
  bioArt1Path: string = '';
  bioArt2Path: string = '';
  bioArt3Path: string = '';

  constructor(private staticAssetService: StaticAssetService, private languageService: LanguageService, private metaService: MetaService) { }

  ngOnInit(): void {
    this.loadStaticAssets();
    this.updateMetaTags();
    this.setupLanguageSubscription();
  }
  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  loadStaticAssets(): void {
    this.bioBannerPath = this.staticAssetService.getAssetPath('bio_banner');
    this.bioArt1Path = this.staticAssetService.getAssetPath('bio_art_1');
    this.bioArt2Path = this.staticAssetService.getAssetPath('bio_art_2');
    this.bioArt3Path = this.staticAssetService.getAssetPath('bio_art_3');
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('bio');
    this.metaService.updateTitleForComponent('bio');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }

}
