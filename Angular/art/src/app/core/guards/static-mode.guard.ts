import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticModeGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (environment.isStaticMode) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
