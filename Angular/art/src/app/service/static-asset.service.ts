import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaticAssetService {
  private readonly assets: {
    [key: string]: { webp: string[]; fallback: string };
  } = {
    fallback_image: {
      webp: ['assets/logo/LOGO_ART_WHITE_BG_120.webp'],
      fallback: 'assets/logo/LOGO_ART_WHITE_BG.png',
    },
    logo: {
      webp: ['assets/logo/LOGO_ART_NO_BG_120.webp'],
      fallback: 'assets/logo/LOGO_ART_NO_BG.png',
    },
    home_banner: {
      webp: [
        'assets/images/art_1_banner_768.webp',
        'assets/images/art_1_banner_1000.webp',
        'assets/images/art_1_banner_1440.webp',
        'assets/images/art_1_banner_1920.webp',
      ],
      fallback: 'assets/images/art_1_banner.jpeg',
    },
    home_art: {
      webp: [
        'assets/images/art_3_horizontal_480.webp',
        'assets/images/art_3_horizontal_768.webp',
        'assets/images/art_3_horizontal_1000.webp',
      ],
      fallback: 'assets/images/art_3_horizontal.jpeg',
    },
    home_elena_franconi: {
      webp: [
        'assets/images/elena_franconi_art_1_horizontal_480.webp',
        'assets/images/elena_franconi_art_1_horizontal_768.webp',
        'assets/images/elena_franconi_art_1_horizontal_1000.webp',
      ],
      fallback: 'assets/images/elena_franconi_art_1_horizontal.jpeg',
    },
    info_banner: {
      webp: [
        'assets/images/art_2_horizontal_480.webp',
        'assets/images/art_2_horizontal_768.webp',
        'assets/images/art_2_horizontal_1000.webp',
      ],
      fallback: 'assets/images/art_2_horizontal.jpeg',
    },
    info_art_1: {
      webp: [
        'assets/images/art_4_square_480.webp',
        'assets/images/art_4_square_768.webp',
        'assets/images/art_4_square_1000.webp',
      ],
      fallback: 'assets/images/art_4_square.jpeg',
    },
    info_art_2: {
      webp: [
        'assets/images/art_5_square_480.webp',
        'assets/images/art_5_square_768.webp',
        'assets/images/art_5_square_1000.webp',
      ],
      fallback: 'assets/images/art_5_square.jpeg',
    },
    info_art_3: {
      webp: [
        'assets/images/art_8_vertical_480.webp',
        'assets/images/art_8_vertical_768.webp',
        'assets/images/art_8_vertical_1000.webp',
      ],
      fallback: 'assets/images/art_8_vertical.jpeg',
    },
    info_art_4: {
      webp: [
        'assets/images/nature_2_vertical_480.webp',
        'assets/images/nature_2_vertical_768.webp',
        'assets/images/nature_2_vertical_1000.webp',
      ],
      fallback: 'assets/images/nature_2_vertical.jpeg',
    },
    info_art_5: {
      webp: [
        'assets/images/art_6_vertical_480.webp',
        'assets/images/art_6_vertical_768.webp',
        'assets/images/art_6_vertical_1000.webp',
      ],
      fallback: 'assets/images/art_6_vertical.jpeg',
    },
    bio_banner: {
      webp: [
        'assets/images/elena_franconi_art_4_horizontal_480.webp',
        'assets/images/elena_franconi_art_4_horizontal_768.webp',
        'assets/images/elena_franconi_art_4_horizontal_1000.webp',
      ],
      fallback: 'assets/images/elena_franconi_art_4_horizontal.jpeg',
    },
    bio_art_1: {
      webp: [
        'assets/images/elena_franconi_art_5_vertical_480.webp',
        'assets/images/elena_franconi_art_5_vertical_768.webp',
        'assets/images/elena_franconi_art_5_vertical_1000.webp',
      ],
      fallback: 'assets/images/elena_franconi_art_5_vertical.jpeg',
    },
    bio_art_2: {
      webp: [
        'assets/images/elena_franconi_1_vertical_480.webp',
        'assets/images/elena_franconi_1_vertical_768.webp',
        'assets/images/elena_franconi_1_vertical_1000.webp',
      ],
      fallback: 'assets/images/elena_franconi_1_vertical.jpeg',
    },
    bio_art_3: {
      webp: [
        'assets/images/elena_franconi_art_2_horizontal_480.webp',
        'assets/images/elena_franconi_art_2_horizontal_768.webp',
        'assets/images/elena_franconi_art_2_horizontal_1000.webp',
      ],
      fallback: 'assets/images/elena_franconi_art_2_horizontal.jpeg',
    },
  };
  constructor() {}

  getAssetWebp(key: string, index: number = 0): string {
    return this.assets[key]?.webp[index] || this.assets[key]?.fallback || '';
  }

  getAssetFallback(key: string): string {
    return this.assets[key]?.fallback || this.getAssetWebp('fallback_image');
  }

  preloadCriticalAssetsResponsive(keys: string[], deviceWidth: number): void {
    keys.forEach((key) => {
      const asset = this.assets[key];
      if (!asset) return;

      let assetPath: string;
      if (key === 'home_banner') {
        let index = 3; // 1920px default
        if (deviceWidth <= 768)
          index = 0; // 768px
        else if (deviceWidth <= 1000)
          index = 1; // 1000px
        else if (deviceWidth <= 1440) index = 2; // 1440px
        assetPath = asset.webp[index] || asset.fallback;
      } else {
        // For other assets, just take the first webp version
        assetPath = asset.webp[0] || asset.fallback;
      }

      if (assetPath) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = assetPath;
        document.head.appendChild(link);
        console.log(
          `Preloaded responsive asset: ${key} -> ${assetPath} (width: ${deviceWidth}px)`,
        );
      }
    });
  }
}
