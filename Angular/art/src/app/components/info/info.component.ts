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

  constructor(private staticService: StaticAssetService) { }

  ngOnInit(): void {
    this.loadStaticAssets();
  }

  loadStaticAssets(): void {
    this.infoBannerPath = this.staticService.getAssetPath('info_banner');
    this.infoArt1Path = this.staticService.getAssetPath('info_art_1');
    this.infoArt2Path = this.staticService.getAssetPath('info_art_2');
  }

}
