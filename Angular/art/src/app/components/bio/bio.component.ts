import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';
import { MetaManagedComponent } from 'src/app/shared/classes/meta-managed.component';

@Component({
    selector: 'app-bio',
    templateUrl: './bio.component.html',
    styleUrls: ['./bio.component.scss'],
    standalone: false
})
export class BioComponent extends MetaManagedComponent implements OnInit, OnDestroy {

  bioBannerPath: string = '';
  bioArt1Path: string = '';
  bioArt2Path: string = '';
  bioArt3Path: string = '';

  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService,
    private staticAssetService: StaticAssetService
  ) {
    super(metaService, languageService);
  }

  ngOnInit(): void {
    this.initializeMetaManagement();
    this.loadStaticAssets();
  }
  ngOnDestroy(): void {
    this.cleanupMetaManagement();
  }

  loadStaticAssets(): void {
    this.bioBannerPath = this.staticAssetService.getAssetPath('bio_banner');
    this.bioArt1Path = this.staticAssetService.getAssetPath('bio_art_1');
    this.bioArt2Path = this.staticAssetService.getAssetPath('bio_art_2');
    this.bioArt3Path = this.staticAssetService.getAssetPath('bio_art_3');
  }

  protected getComponentName(): string {
    return 'bio';
  }

}
