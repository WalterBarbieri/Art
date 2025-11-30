import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { BioComponent } from './components/bio/bio.component';
import { ContactComponent } from './components/contact/contact.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './auth/login/login.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ErrorComponent } from './components/error/error.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UserpageComponent } from './components/userpage/userpage.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    InfoComponent,
    ProjectsComponent,
    BioComponent,
    ContactComponent,
    LoginComponent,
    PrivacyComponent,
    ErrorComponent,
    LoaderComponent,
    UserpageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
