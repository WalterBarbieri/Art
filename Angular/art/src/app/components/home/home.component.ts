import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/service/meta.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';
import { LanguageService } from 'src/app/service/language.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private languageSubscription: Subscription = new Subscription();
  homeBannerPath: string = '';
  successToast: boolean = false;
  errorToast: boolean = false;
  toastMessage: string = '';

  constructor(
    private metaService: MetaService,
    private languageService: LanguageService,
    private staticAssetService: StaticAssetService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.setupLanguageSubscription();
    this.homeBannerPath = this.staticAssetService.getAssetPath('home_banner');
    this.route.queryParams.subscribe(params => {
      const message = params['message'];
      if (message === 'LoginSuccess') {
        this.mostraToast(true, 'Login successful!');
      }
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  mostraToast(success: boolean, message: string) {
    this.toastMessage = message;
    if (success) {
      this.successToast = true;
      this.errorToast = false;
    } else {
      this.errorToast = true;
      this.successToast = false;
    }
  }

  chiudiToast() {
    this.successToast = false;
    this.errorToast = false;
    this.toastMessage = '';
  }

  private updateMetaTags(): void {
    this.metaService.updateMetaTagsForComponents('home');
    this.metaService.updateTitleForComponent('home');
  }

  private setupLanguageSubscription(): void {
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.updateMetaTags();
    });
  }
}
