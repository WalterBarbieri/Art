import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';
import { MetaManagedComponent } from 'src/app/shared/classes/meta-managed.component';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    standalone: false
})
export class InfoComponent extends MetaManagedComponent implements OnInit, OnDestroy {

  infoBannerPath: string = '';
  infoArt1Path: string = '';
  infoArt2Path: string = '';
  infoArt3Path: string = '';
  infoArt4Path: string = '';
  infoArt5Path: string = '';

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
    this.infoBannerPath = this.staticAssetService.getAssetPath('info_banner');
    this.infoArt1Path = this.staticAssetService.getAssetPath('info_art_1');
    this.infoArt2Path = this.staticAssetService.getAssetPath('info_art_2');
    this.infoArt3Path = this.staticAssetService.getAssetPath('info_art_3');
    this.infoArt4Path = this.staticAssetService.getAssetPath('info_art_4');
    this.infoArt5Path = this.staticAssetService.getAssetPath('info_art_5');
  }

  protected getComponentName(): string {
    return 'info';
  }

}
