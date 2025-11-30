import { Injectable } from '@angular/core';
import { info } from 'console';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetService {
  private readonly assets: { [key: string]: string } = {
    fallback_image: environment.fallBackImage,
    logo: 'assets/images/LOGO_ART.jpeg',
    home_banner: 'assets/images/home_banner.jpeg',
    home_art: 'assets/images/franconi_elena_orizontal_2.jpeg',
    home_elena_franconi: 'assets/images/franconi_elena_orizontal_1.jpeg',
    info_banner: 'assets/images/franconi_elena_orizontal_3.jpeg',
    info_art_1: 'assets/images/franconi_elena_vertical_3.jpeg',
    info_art_2: 'assets/images/home_2.jpeg'
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
