import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private meta: Meta, private translate: TranslateService, private title: Title) { }

  private updateMetaTag(name: string, content: string, property?: boolean): void {
    if (content && content.trim()) {
      this.meta.updateTag(property ? { property: name, content } : { name, content });
    }
  }

  updateMetaTagsForComponents(component: string): void {
    const metaKeys = [
      `meta.${component}.description`,
      `meta.${component}.keywords`,
      `meta.${component}.author`,
      `meta.${component}.ogTitle`,
      `meta.${component}.ogDescription`,
      `meta.${component}.ogImage`,
      `meta.${component}.ogUrl`,
      `meta.${component}.ogType`,
      `meta.${component}.twitterCard`,
      `meta.${component}.twitterTitle`,
      `meta.${component}.twitterDescription`,
      `meta.${component}.twitterImage`,
    ];

    this.translate
      .get(metaKeys)
      .subscribe((translations) => {

        this.updateMetaTag('description', translations[`meta.${component}.description`]);
        this.updateMetaTag('keywords', translations[`meta.${component}.keywords`]);
        this.updateMetaTag('author', translations[`meta.${component}.author`]);

        this.updateMetaTag('og:title', translations[`meta.${component}.ogTitle`], true);
        this.updateMetaTag('og:description', translations[`meta.${component}.ogDescription`], true);
        this.updateMetaTag('og:image', translations[`meta.${component}.ogImage`], true);
        this.updateMetaTag('og:url', translations[`meta.${component}.ogUrl`], true);
        this.updateMetaTag('og:type', translations[`meta.${component}.ogType`], true);

        this.updateMetaTag('twitter:card', translations[`meta.${component}.twitterCard`]);
        this.updateMetaTag('twitter:title', translations[`meta.${component}.twitterTitle`], true);
        this.updateMetaTag('twitter:description', translations[`meta.${component}.twitterDescription`], true);
        this.updateMetaTag('twitter:image', translations[`meta.${component}.twitterImage`], true);
      });
  }


  updateTitleForComponent(
    component: string,
    params?: { [key: string]: string }
  ): void {
    this.translate.get(`title.${component}`).subscribe((translatedTitle) => {
      if (params) {
        const replacePlaceholders = (
          template: string,
          params: { [key: string]: string }
        ) => template.replace(/{(\w+)}/g, (_, key) => params[key] || '');
        translatedTitle = replacePlaceholders(translatedTitle, params);
      }
      this.title.setTitle(translatedTitle);
    });
  }
}
