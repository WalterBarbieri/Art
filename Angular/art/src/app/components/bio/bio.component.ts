import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';
import { MetaManagedComponent } from 'src/app/shared/classes/meta-managed.component';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss'],
  standalone: false,
})
export class BioComponent
  extends MetaManagedComponent
  implements OnInit, OnDestroy
{
  constructor(
    protected override metaService: MetaService,
    protected override languageService: LanguageService,
    public staticAssetService: StaticAssetService,
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
    return 'bio';
  }
}
