import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetService {
  private readonly assets: { [key: string]: string } = {
    fallback_image: environment.fallBackImage,
    logo: 'assets/images/LOGO_ART.jpeg',
    home_banner: 'assets/images/home_banner.jpeg',
    art_image_1: 'assets/images/home_1.jpeg',
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
