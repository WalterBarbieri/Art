import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly validLanguages = ['en', 'it'];
  private readonly defaultLanguage = 'it';
  private readonly storageKey = 'appLanguage';

  private currentLanguageSubject = new BehaviorSubject<string>(this.defaultLanguage);
  public language$: Observable<string> = this.currentLanguageSubject.asObservable();

  private isValidLanguage(lang: string): boolean {
    return this.validLanguages.includes(lang);
  }

  constructor(private translate: TranslateService) {
    const storedLang = this.getLanguage();
    this.translate.setDefaultLang(storedLang);
    this.translate.use(storedLang);
    this.currentLanguageSubject.next(storedLang);
   }

   setLanguage(lang: string): void {
    if (this.isValidLanguage(lang)) {
      localStorage.setItem(this.storageKey, lang);
      this.translate.use(lang);
      this.currentLanguageSubject.next(lang);
    }
   }

   getLanguage(): string {
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang && this.isValidLanguage(storedLang)) {
      return storedLang;
    }
    const browserLang = this.translate.getBrowserLang();
    if (browserLang && this.isValidLanguage(browserLang)) {
      return browserLang;
    }
    return this.defaultLanguage;
   }

}
