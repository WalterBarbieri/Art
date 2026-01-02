import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticModeGuard  {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (environment.isStaticMode) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
