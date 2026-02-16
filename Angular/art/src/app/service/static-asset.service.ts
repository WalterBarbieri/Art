import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetService {
  private readonly assets: { [key: string]: { webp: string[], fallback: string } } = {
    fallback_image: {
      webp: ['assets/logo/LOGO_ART_WHITE_BG_120.webp'],
      fallback: 'assets/logo/LOGO_ART_WHITE_BG.png'
    },
    logo: {
      webp: ['assets/logo/LOGO_ART_NO_BG_120.webp'],
      fallback: 'assets/logo/LOGO_ART_NO_BG.png'
    },
    home_banner: {
      webp: ['assets/images/art_1_banner_500.webp', 'assets/images/art_1_banner_1000.webp', 'assets/images/art_1_banner_2000.webp'],
      fallback: 'assets/images/art_1_banner.jpeg'
    },
    home_art: {
      webp: ['assets/images/art_3_horizontal_1000.webp'],
      fallback: 'assets/images/art_3_horizontal.jpeg'
    },
    home_elena_franconi: {
      webp: ['assets/images/elena_franconi_art_1_horizontal_1000.webp'],
      fallback: 'assets/images/elena_franconi_art_1_horizontal.jpeg'
    },
    info_banner: {
      webp: ['assets/images/art_2_horizontal_1000.webp'],
      fallback: 'assets/images/art_2_horizontal.jpeg'
    },
    info_art_1: {
      webp: ['assets/images/art_4_square_1000.webp'],
      fallback: 'assets/images/art_4_square.jpeg'
    },
    info_art_2: {
      webp: ['assets/images/art_5_square_1000.webp'],
      fallback: 'assets/images/art_5_square.jpeg'
    },
    info_art_3: {
      webp: ['assets/images/art_8_vertical_1000.webp'],
      fallback: 'assets/images/art_8_vertical.jpeg'
    },
    info_art_4: {
      webp: ['assets/images/nature_2_vertical_1000.webp'],
      fallback: 'assets/images/nature_2_vertical.jpeg'
    },
    info_art_5: {
      webp: ['assets/images/art_6_vertical_1000.webp'],
      fallback: 'assets/images/art_6_vertical.jpeg'
    },
    bio_banner: {
      webp: ['assets/images/elena_franconi_art_4_horizontal_1000.webp'],
      fallback: 'assets/images/elena_franconi_art_4_horizontal.jpeg'
    },
    bio_art_1: {
      webp: ['assets/images/elena_franconi_art_5_vertical_1000.webp'],
      fallback: 'assets/images/elena_franconi_art_5_vertical.jpeg'
    },
    bio_art_2: {
      webp: ['assets/images/elena_franconi_1_vertical_1000.webp'],
      fallback: 'assets/images/elena_franconi_1_vertical.jpeg'
    },
    bio_art_3: {
      webp: ['assets/images/elena_franconi_art_2_horizontal_1000.webp'],
      fallback: 'assets/images/elena_franconi_art_2_horizontal.jpeg'
    },
  };
  constructor() { }

  getAssetPath(key: string): string {
    const asset = this.assets[key];
    if (asset) {
      return asset.webp[0] || asset.fallback || this.assets['fallback_image'].webp[0] || this.assets['fallback_image'].fallback;
    }
    return this.assets['fallback_image'].webp[0] || this.assets['fallback_image'].fallback;
  }

  getAssetWebp(key: string): string[] {
    return this.assets[key]?.webp || [];
  }

  getAssetFallback(key: string): string {
    return this.assets[key]?.fallback || '';
  }

  preloadCriticalAssets(keys: string[]): void {
    keys.forEach(key => {
      const asset = this.assets[key];
      if (asset) {
        const assetPath = asset.webp[0] || asset.fallback;
        if (assetPath) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = assetPath;
          document.head.appendChild(link);
          console.log(`Preloaded asset: ${key} -> ${assetPath}`);
        }
      }
    });
  }

  hasAsset(key: string): boolean {
    return key in this.assets;
  }
}
