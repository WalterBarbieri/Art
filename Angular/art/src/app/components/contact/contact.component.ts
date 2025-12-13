import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
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
    this.metaService.updateMetaTagsForComponents('app');
    this.metaService.updateTitleForComponent('app');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }

}
