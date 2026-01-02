import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { ErrorService } from './services/error.service';
import { LoaderService } from './services/loader.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { LoggedUserGuard } from './guards/logged-user.guard';

// Interceptors
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

@NgModule({ imports: [CommonModule], providers: [
        // SERVICES
        AuthService,
        ErrorService,
        LoaderService,
        // GUARDS
        AuthGuard,
        LoggedUserGuard,
        // INTERCEPTORS
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule è già stato importato. Importalo solo in AppModule.');
    }
  }
}
