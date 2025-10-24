import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from './service/language.service';
import { MetaService } from './service/meta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'art';
  private languageSubscription: Subscription = new Subscription();

  constructor(private languageService: LanguageService, private metaService: MetaService) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.setupLanguageSubscription();

  }
  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('app');
    this.metaService.updateTitleForComponent('app');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }
}
