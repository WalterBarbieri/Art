import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: false
})
export class ContactComponent implements OnInit, OnDestroy {

  private languageSubscription: Subscription = new Subscription();

  constructor(private languageService: LanguageService, private metaService: MetaService) { }

  ngOnInit(): void {
    this.updateMetaTags();
    this.setupLanguageSubscription();
  }
  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('contact');
    this.metaService.updateTitleForComponent('contact');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }

}
