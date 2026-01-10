import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { MetaManagedComponent } from 'src/app/shared/classes/meta-managed.component';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: false
})
export class ContactComponent extends MetaManagedComponent implements OnInit, OnDestroy {

  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService
  ) {
    super(metaService, languageService);
  }

  ngOnInit(): void {
    this.initializeMetaManagement();
  }
  ngOnDestroy(): void {
    this.cleanupMetaManagement();
  }

  protected getComponentName(): string {
    return 'contact';
  }

}
