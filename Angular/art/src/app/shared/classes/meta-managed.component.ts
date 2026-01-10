import { Subscription } from 'rxjs';
import { LanguageService } from '../../service/language.service';
import { MetaService } from '../../service/meta.service';

export abstract class MetaManagedComponent {
  protected languageSubscription: Subscription = new Subscription();

  constructor(
    protected metaService: MetaService,
    protected languageService: LanguageService
  ) {}

  protected initializeMetaManagement(): void {
    this.updateMetaTags();
    this.setupLanguageSubscription();
  }

  protected cleanupMetaManagement(): void {
    this.languageSubscription.unsubscribe();
  }

  protected abstract getComponentName(): string;

  protected updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents(this.getComponentName());
    this.metaService.updateTitleForComponent(this.getComponentName());
  }

  protected setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }
}
