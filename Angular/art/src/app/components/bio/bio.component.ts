import { Component, OnInit } from '@angular/core';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit {

  bioBannerPath: string = '';
  bioArt1Path: string = '';
  bioArt2Path: string = '';
  bioArt3Path: string = '';

  constructor(private staticAssetService: StaticAssetService) { }

  ngOnInit(): void {
    this.loadStaticAssets();
  }

  loadStaticAssets(): void {
    this.bioBannerPath = this.staticAssetService.getAssetPath('bio_banner');
    this.bioArt1Path = this.staticAssetService.getAssetPath('bio_art_1');
    this.bioArt2Path = this.staticAssetService.getAssetPath('bio_art_2');
    this.bioArt3Path = this.staticAssetService.getAssetPath('bio_art_3');
  }

}
