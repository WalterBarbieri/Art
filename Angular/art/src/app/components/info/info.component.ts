import { Component, OnInit } from '@angular/core';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  infoBannerPath: string = '';
  infoArt1Path: string = '';
  infoArt2Path: string = '';
  infoArt3Path: string = '';
  infoArt4Path: string = '';
  infoArt5Path: string = '';

  constructor(private staticAssetService: StaticAssetService) { }

  ngOnInit(): void {
    this.loadStaticAssets();
  }

  loadStaticAssets(): void {
    this.infoBannerPath = this.staticAssetService.getAssetPath('info_banner');
    this.infoArt1Path = this.staticAssetService.getAssetPath('info_art_1');
    this.infoArt2Path = this.staticAssetService.getAssetPath('info_art_2');
    this.infoArt3Path = this.staticAssetService.getAssetPath('info_art_3');
    this.infoArt4Path = this.staticAssetService.getAssetPath('info_art_4');
    this.infoArt5Path = this.staticAssetService.getAssetPath('info_art_5');
  }

}
