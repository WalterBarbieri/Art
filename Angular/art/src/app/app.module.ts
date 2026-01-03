import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  TranslateHttpLoader,
  TRANSLATE_HTTP_LOADER_CONFIG,
} from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { BioComponent } from './components/bio/bio.component';
import { ContactComponent } from './components/contact/contact.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ErrorComponent } from './components/error/error.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UserpageComponent } from './components/userpage/userpage.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { Carousel } from './shared/components/carousel/carousel';

export function HttpLoaderFactory(): TranslateHttpLoader {
  return new TranslateHttpLoader();
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InfoComponent,
    BioComponent,
    ContactComponent,
    PrivacyComponent,
    ErrorComponent,
    UserpageComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [],
      },
    }),
    SharedModule,
    CoreModule,
    ProjectCardComponent,
    Carousel,
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { prefix: '/assets/i18n/', suffix: '.json' },
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
