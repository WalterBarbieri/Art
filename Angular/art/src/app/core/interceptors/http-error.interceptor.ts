import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService, private loaderService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        this.loaderService.hide();

        try {
          const processedError = this.errorService.processHttpError(error);

          if (processedError && typeof processedError === 'object' && processedError.key) {
            this.errorService.setErrorByKey(processedError.key);
            return throwError(() => processedError);
          } else {
            console.warn('ProcessedError is invalid:', processedError);
            const fallbackError = { key: 'ERROR.GENERIC', backendMessage: 'Server error' };
            this.errorService.setErrorByKey(fallbackError.key);
            return throwError(() => fallbackError);
          }
        } catch (e) {
          console.error('Error processing HTTP error:', error, e);
          const fallbackError = { key: 'ERROR.NETWORK', backendMessage: 'Connection error' };
          this.errorService.setErrorByKey(fallbackError.key);
          return throwError(() => fallbackError);
        }
      })
    );
  }
}
