import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthData } from '../../auth/auth.interface';
import { ErrorService } from '../services/error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user$.pipe(
      take<AuthData | null>(1),
      map((authData: AuthData | null) => {
        if (authData && authData.userTokenResponse) {
          const userRole = authData.userTokenResponse.role;
          if (route.data['roles'] && route.data['roles'].includes(userRole)) {
            return true;
          } else {
            this.errorService.setErrorByKey('GUARD.NOT_AUTHORIZED');
            return this.router.createUrlTree(['/error']);
          }
        }

        this.errorService.setErrorByKey('GUARD.NOT_AUTHENTICATED');
        return this.router.createUrlTree(['/error']);
      })
    );
  }
}
