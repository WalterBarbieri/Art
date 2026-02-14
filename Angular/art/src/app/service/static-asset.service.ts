import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetService {
  private readonly assets: { [key: string]: string } = {
    fallback_image: environment.fallBackImage,
    logo: 'assets/logo/LOGO_ART_NO_BG.png',
    home_banner: 'assets/images/art_1_banner.jpeg',
    home_art: 'assets/images/art_3_horizontal.jpeg',
    home_elena_franconi: 'assets/images/elena_franconi_art_1_horizontal.jpeg',
    info_banner: 'assets/images/art_2_horizontal.jpeg',
    info_art_1: 'assets/images/art_4_square.jpeg',
    info_art_2: 'assets/images/art_5_square.jpeg',
    info_art_3: 'assets/images/art_8_vertical.jpeg',
    info_art_4: 'assets/images/nature_2_vertical.jpeg',
    info_art_5: 'assets/images/art_6_vertical.jpeg',
    bio_banner: 'assets/images/elena_franconi_art_4_horizontal.jpeg',
    bio_art_1: 'assets/images/elena_franconi_art_5_vertical.jpeg',
    bio_art_2: 'assets/images/elena_franconi_1_vertical.jpeg',
    bio_art_3: 'assets/images/elena_franconi_art_2_horizontal.jpeg',
  };
  constructor() { }

  getAssetPath(key: string): string {
    return this.assets[key] || this.assets['fallback_image'];
  }

  getAllAssets(): { [key: string]: string } {
    return {...this.assets};
  }

  preloadCriticalAssets(keys: string[]): void {
    keys.forEach(key => {
      const assetPath = this.getAssetPath(key);
      if (assetPath) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = assetPath;
        document.head.appendChild(link);
        console.log(`Preloaded asset: ${key} -> ${assetPath}`);
      }
    });
  }

  hasAsset(key: string): boolean {
    return key in this.assets;
  }
}
