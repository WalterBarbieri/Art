import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  newRequest!: HttpRequest<any>;

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return next.handle(request);
        }
        this.newRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${user.token}`)
        })
        return next.handle(this.newRequest);
      })
    )
  }
}
